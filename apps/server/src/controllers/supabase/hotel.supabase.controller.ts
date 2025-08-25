import { Request, Response } from 'express';
import { Booking, supabaseService } from "../../config/supabase";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

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
    // Chuẩn hóa dữ liệu đầu vào
    const body = req.body || {};
    const hotelId = body.hotel_id || body.hotelId;
    const roomType = body.room_type || body.roomType;
    const quantity = body.quantity ?? 1;
    const checkIn = body.check_in || body.checkIn;
    const checkOut = body.check_out || body.checkOut;
    const guests = body.guests;
    const contactInfo = body.contact_info || body.contactInfo;
    const specialRequests = body.special_requests || body.specialRequests;
    const totalAmount = body.total_amount || body.totalAmount;
    const paymentMethod = body.payment_method || body.paymentMethod;
    const user = (req as any).user;
    if (!hotelId || !roomType || !checkIn || !checkOut || !contactInfo || !totalAmount || !paymentMethod) {
      res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
      return;
    }
    if (!user || !user.id) {
      res.status(401).json({ success: false, message: 'Bạn cần đăng nhập để đặt phòng' });
      return;
    }
    // Lấy thông tin khách sạn và phòng
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
    // Tạo booking_number chuẩn hóa
    const bookingNumber = 'HOTEL' + Date.now().toString().slice(-6) + Math.random().toString(36).substr(2, 3).toUpperCase();
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    // Chuẩn hóa contact_info
    const contact = {
      name: contactInfo.fullName || `${contactInfo.firstName || ''} ${contactInfo.lastName || ''}`.trim(),
      email: contactInfo.email,
      phone: contactInfo.phone
    };
    const bookingData: Booking  = {
      booking_number: bookingNumber,
      booking_type: 'hotel',
      status: 'pending',
      user_id: user.id,
      service_id: hotelId,
      contact_info: contact,
      booking_details: {
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
      total_amount: totalAmount,
      currency: 'VND',
      special_requests: specialRequests,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: {}
    };
    // Insert booking vào bảng bookings
    let booking;
    try {
      // Sử dụng supabaseService nếu có, nếu không thì dùng supabase trực tiếp
      booking = await supabaseService.createBooking(bookingData);
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Lỗi khi tạo booking', error: err.message });
      return;
    }
    // Update số lượng phòng sau khi booking thành công
    await supabase.from('rooms').update({ available: room.available - quantity }).eq('id', room.id);
    // Chuẩn bị thông tin thanh toán (nếu có tích hợp)
    const paymentInfo = {
      amount: totalAmount,
      currency: 'VND',
      description: `Hotel booking ${bookingNumber} - ${hotel.name}`
    };
    res.json({
      success: true,
      data: {
        booking,
        paymentInfo
      },
      message: 'Đặt phòng thành công. Vui lòng tiến hành thanh toán.'
    });
    return;
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
