import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);
// --- Hotel Booking Features with Supabase Auth ---
import { Hotel, HotelStatus, RoomType } from '../../entities/Hotel.entity';
import { BookingType, BookingStatus } from '../../entities/Booking.entity';
import { PaymentService } from '../../services/payment/PaymentService';
import { PaymentRequest } from '../../types/payment.types';
import { Request, Response } from 'express';

interface SupabaseAuthRequest extends Request {
  user?: any;
}

export const searchHotels = async (req: Request, res: Response): Promise<void> => {
  try {
    const { destination, minPrice, maxPrice, starRating } = req.query;
    let query = supabase.from('hotels').select('*');
    if (destination) {
      query = query.ilike('city', `%${destination}%`);
    }
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

export const getHotelDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hotelId } = req.params;
    const { data: hotel, error } = await supabase.from('hotels').select('*').eq('id', hotelId).single();
    if (error || !hotel) {
      res.status(404).json({ success: false, message: 'Không tìm thấy khách sạn' });
      return;
    }
    const { data: rooms, error: roomError } = await supabase.from('rooms').select('*').eq('hotel_id', hotelId);
    res.json({ success: true, data: { ...hotel, rooms: rooms || [] } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy chi tiết khách sạn', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Đặt phòng khách sạn
export const bookHotel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hotelId, roomType, quantity = 1, checkIn, checkOut, guests, contactInfo, specialRequests, totalAmount, paymentMethod } = req.body;
    const user = (req as any).user;
    if (!hotelId || !roomType || !checkIn || !checkOut || !contactInfo || !totalAmount || !paymentMethod) {
      res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
      return;
    }
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Bạn cần đăng nhập để đặt phòng' });
      return;
    }
    const { data: hotel, error: hotelError } = await supabase.from('hotels').select('*').eq('id', hotelId).single();
    if (hotelError || !hotel) {
      res.status(404).json({ success: false, message: 'Không tìm thấy khách sạn' });
      return;
    }
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
      userId: user.id,
      serviceId: hotelId,
      bookingDetails: {
        serviceName: hotel.name,
        description: `${room.name} - ${quantity} phòng, ${nights} đêm`,
        duration: `${nights} đêm`,
        startDate: checkIn,
        endDate: checkOut,
        participants: guests?.adults + guests?.children,
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
}

// Lấy lịch sử booking khách sạn của user
export const getHotelBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user?.id) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }
    const { data, error } = await supabase.from('bookings').select('*').eq('user_id', user.id);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy lịch sử đặt phòng', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

// Hủy booking khách sạn
export const cancelHotelBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;
    const { error } = await supabase.from('bookings').update({ status: 'CANCELLED', cancel_reason: reason }).eq('id', bookingId);
    if (error) throw error;
    res.json({ success: true, message: 'Hủy đặt phòng thành công', bookingId, reason });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi hủy đặt phòng', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

// Thêm đánh giá khách sạn
export const addHotelReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hotelId } = req.params;
    const { rating, comment, images } = req.body;
    const user = (req as any).user;
    if (!user?.id) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }
    const { data, error } = await supabase.from('hotel_reviews').insert([
      {
        hotel_id: hotelId,
        user_id: user.id,
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
}
