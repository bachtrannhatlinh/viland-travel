import { createClient } from '@supabase/supabase-js';

// Khởi tạo Supabase client (nên chuyển vào file config riêng nếu dùng nhiều)
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);
// --- Hotel Booking Features with Supabase Auth ---
import { Hotel, HotelStatus, RoomType } from '../entities/Hotel.entity';
import { BookingType, BookingStatus } from '../entities/Booking.entity';
import { PaymentService } from '../services/payment/PaymentService';
import { PaymentRequest } from '../types/payment.types';

interface SupabaseAuthRequest extends Request {
  user?: any;
}


// Search hotels
export const searchHotels = async (req: Request, res: Response): Promise<void> => {
  try {
    const { destination, minPrice, maxPrice, starRating } = req.query;
    let query = supabase.from('hotels').select('*');
    // Lọc theo thành phố, tên, địa chỉ
    if (destination) {
      query = query.ilike('city', `%${destination}%`);
    }
    // Lọc theo giá (nếu có bảng rooms, nên join hoặc truy vấn riêng)
    // Lọc theo starRating
    if (starRating) {
      query = query.gte('star_rating', Number(starRating));
    }
    const { data, error } = await query;
    if (error) throw error;
    res.json({
      success: true,
      data,
      total: data.length,
      searchParams: req.query
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi tìm kiếm khách sạn', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Get hotel details
export const getHotelDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hotelId } = req.params;
    // Lấy thông tin khách sạn
    const { data: hotel, error } = await supabase.from('hotels').select('*').eq('id', hotelId).single();
    if (error || !hotel) {
      res.status(404).json({ success: false, message: 'Không tìm thấy khách sạn' });
      return;
    }
    // Lấy danh sách phòng của khách sạn
    const { data: rooms, error: roomError } = await supabase.from('rooms').select('*').eq('hotel_id', hotelId);
    res.json({ success: true, data: { ...hotel, rooms: rooms || [] } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy thông tin khách sạn', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Book hotel (requires Supabase user)
export const bookHotel = async (req: SupabaseAuthRequest, res: Response): Promise<void> => {
  try {
    const { hotelId, roomType, quantity = 1, checkIn, checkOut, guests, contactInfo, specialRequests, totalAmount, paymentMethod } = req.body;
    if (!hotelId || !roomType || !checkIn || !checkOut || !contactInfo || !totalAmount || !paymentMethod) {
      res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
      return;
    }
    if (!req.user || !req.user.id) {
      res.status(401).json({ success: false, message: 'Bạn cần đăng nhập để đặt phòng' });
      return;
    }
    // Lấy thông tin khách sạn từ Supabase
    const { data: hotel, error: hotelError } = await supabase.from('hotels').select('*').eq('id', hotelId).single();
    if (hotelError || !hotel) {
      res.status(404).json({ success: false, message: 'Không tìm thấy khách sạn' });
      return;
    }
    // Lấy thông tin phòng từ Supabase
    const { data: room, error: roomError } = await supabase.from('rooms').select('*').eq('hotel_id', hotelId).eq('type', roomType).single();
    if (roomError || !room) {
      res.status(404).json({ success: false, message: 'Không tìm thấy loại phòng' });
      return;
    }
    if (room.available < quantity) {
      res.status(400).json({ success: false, message: 'Không đủ phòng trống' });
      return;
    }
    const bookingNumber = 'BK' + Date.now().toString();
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const bookingData = {
      bookingNumber,
      bookingType: BookingType.HOTEL,
      status: BookingStatus.PENDING,
      userId: req.user.id,
      serviceId: hotelId,
      bookingDetails: {
        serviceName: hotel.name,
        description: `${room.name} - ${quantity} phòng, ${nights} đêm`,
        duration: `${nights} đêm`,
        startDate: checkIn,
        endDate: checkOut,
        participants: guests.adults + guests.children,
        specialRequests,
        contactInfo,
        roomDetails: {
          type: roomType,
          name: room.name,
          quantity,
          pricePerNight: room.base_price
        },
        guests
      },
      totalAmount,
      currency: 'VND'
    };
    try {
      const paymentService = new PaymentService({
        vnpay: {
          tmnCode: 'VNPAY_TMN_CODE',
          hashSecret: 'VNPAY_HASH_SECRET',
          url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
          apiUrl: 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
          returnUrl: process.env.VNPAY_RETURN_URL || 'http://localhost:3000/payment/return',
          notifyUrl: process.env.VNPAY_NOTIFY_URL || 'http://localhost:3001/api/payment/vnpay/callback'
        }
      });
      const paymentRequest: PaymentRequest = {
        bookingId: bookingNumber,
        amount: totalAmount,
        currency: 'VND',
        description: `Thanh toán đặt phòng ${hotel.name} - ${bookingNumber}`,
        customerInfo: {
          name: `${contactInfo.firstName} ${contactInfo.lastName}`,
          email: contactInfo.email,
          phone: contactInfo.phone
        }
      };
      const paymentResult = await paymentService.createPayment(paymentRequest, paymentMethod as any);
      if (paymentResult.success) {
        // Cập nhật số lượng phòng còn lại (giảm available)
        await supabase.from('rooms').update({ available: room.available - quantity }).eq('id', room.id);
        if (paymentResult.paymentUrl) {
          res.json({
            success: true,
            message: 'Đang chuyển hướng đến trang thanh toán',
            redirectUrl: paymentResult.paymentUrl,
            bookingNumber,
            transactionId: paymentResult.transactionId
          });
        } else {
          res.json({
            success: true,
            message: 'Đặt phòng và thanh toán thành công',
            bookingNumber,
            transactionId: paymentResult.transactionId,
            booking: bookingData
          });
        }
      } else {
        res.status(400).json({ success: false, message: paymentResult.error || 'Thanh toán thất bại' });
      }
    } catch (paymentError) {
      res.json({
        success: true,
        message: 'Đặt phòng thành công (Demo mode)',
        bookingNumber,
        transactionId: 'DEMO_' + Date.now(),
        booking: bookingData
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi đặt phòng', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Get hotel bookings for Supabase user
export const getHotelBookings = async (req: SupabaseAuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }
    // Lấy danh sách booking của user từ Supabase
    const { data, error } = await supabase.from('bookings').select('*').eq('user_id', userId);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy lịch sử đặt phòng', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Cancel hotel booking (Supabase user)
export const cancelHotelBooking = async (req: SupabaseAuthRequest, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;
    // Cập nhật trạng thái booking thành 'CANCELLED' trên Supabase
    const { error } = await supabase.from('bookings').update({ status: 'CANCELLED', cancel_reason: reason }).eq('id', bookingId);
    if (error) throw error;
    res.json({ success: true, message: 'Hủy đặt phòng thành công', bookingId, reason });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi hủy đặt phòng', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Add hotel review (Supabase user)
export const addHotelReview = async (req: SupabaseAuthRequest, res: Response): Promise<void> => {
  try {
    const { hotelId } = req.params;
    const { rating, comment, images } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }
    // Thêm review vào Supabase
    const { data, error } = await supabase.from('hotel_reviews').insert([
      {
        hotel_id: hotelId,
        user_id: userId,
        rating,
        comment,
        images,
        created_at: new Date().toISOString()
      }
    ]).select();
    if (error) throw error;
    res.json({
      success: true,
      message: 'Đánh giá đã được thêm thành công',
      review: data && data[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi thêm đánh giá', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { supabaseAuthService } from '../services/supabase.service';
import { sendEmail } from '../services/email.service';

// Register user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      });
      return;
    }
    const { firstName, lastName, email, password, phone } = req.body;
    const { data: user, error } = await supabaseAuthService.registerUser({ firstName, lastName, email, password, phone });
    if (error) {
      console.error('Supabase register error:', error);
      res.status(400).json({
        success: false,
        error: { message: error.message || 'Registration failed' }
      });
      return;
    }
    // Gửi email xác thực nếu cần
    res.status(201).json({
      success: true,
      data: { user },
      message: 'User registered successfully. Please check your email to verify your account.'
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error during registration', details: error }
    });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      });
      return;
    }
    const { email, password } = req.body;
    const { data: user, error } = await supabaseAuthService.loginUser({ email, password });
    if (error) {
      res.status(401).json({
        success: false,
        error: { message: error.message || 'Invalid email or password' }
      });
      return;
    }
    // Có thể set cookie nếu cần
    res.status(200).json({
      success: true,
      data: { user },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error during login' }
    });
  }
};

// Get current user profile
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: { message: 'User not authenticated' }
      });
      return;
    }
    const { data: user, error } = await supabaseAuthService.getUserProfile(userId);
    if (error || !user) {
      res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
};

// Logout user
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Nếu có logic logout với Supabase thì gọi, nếu không chỉ trả về thành công
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error during logout' }
    });
  }
};

// Refresh token (placeholder)
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
};

// Forgot password (placeholder)
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
};

// Reset password (placeholder)
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
};

// Verify email (placeholder)
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
};

// Resend verification email (placeholder)
export const resendVerificationEmail = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
};

// Update profile (placeholder)
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
};

// Change password (placeholder)
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
};