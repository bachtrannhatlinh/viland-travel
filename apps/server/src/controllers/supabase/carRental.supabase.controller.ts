import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Lấy thông tin booking xe theo booking_number (public, không cần đăng nhập)
export const getCarBookingByNumber = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    if (!bookingId) {
      res.status(400).json({ success: false, message: 'Thiếu bookingId' });
      return;
    }
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('booking_number', bookingId)
      .eq('booking_type', 'car_rental')
      .single();
    if (error || !data) {
      res.status(404).json({ success: false, message: 'Không tìm thấy booking', error: error?.message });
      return;
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy thông tin booking', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Tìm kiếm xe thuê
export const searchCars = async (req: Request, res: Response) => {
  try {
    const { location, pickupDate, returnDate, carType, seats, priceMin, priceMax, transmission } = req.query;
    let query = supabase.from('car_rentals').select('*');
    if (location) {
      query = query.contains('location', { city: location });
    }
    if (carType) {
      query = query.eq('type', carType);
    }
    if (seats) {
      query = query.eq('seats', Number(seats));
    }
    if (transmission) {
      query = query.eq('transmission', transmission);
    }
    if (priceMin) {
      query = query.gte('price_per_day', Number(priceMin));
    }
    if (priceMax) {
      query = query.lte('price_per_day', Number(priceMax));
    }
    // TODO: Filter by availability (pickupDate, returnDate) if calendar exists
    const { data, error } = await query.order('price_per_day', { ascending: true });
    if (error) {
      res.status(500).json({ success: false, message: 'Lỗi khi tìm kiếm xe', error: error.message });
      return;
    }
    res.json({ success: true, data });
    return;
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi tìm kiếm xe', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Lấy chi tiết xe
export const getCarDetails = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const { data, error } = await supabase.from('car_rentals').select('*').eq('id', carId).single();
    if (error || !data) {
      res.status(404).json({ success: false, message: 'Không tìm thấy xe', error: error?.message });
      return;
    }
    res.json({ success: true, data });
    return;
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy chi tiết xe', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Đặt xe
export const bookCar = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }
    const { carId, pickupDate, returnDate, pickupLocation, dropoffLocation, totalPrice, additionalServices, driverInfo } = req.body;
    // Kiểm tra xe có tồn tại không
    const { data: car, error: carError } = await supabase.from('car_rentals').select('*').eq('id', carId).single();
    if (carError || !car) {
      res.status(404).json({ success: false, message: 'Không tìm thấy xe', error: carError?.message });
      return;
    }
    // TODO: Kiểm tra xe có sẵn trong khoảng thời gian không (availability)
    // Tạo booking chuẩn hóa về bảng BOOKINGS
    const bookingNumber = 'CR' + Date.now();
    // Chuẩn hóa contact_info lấy từ user hoặc body
    const contactInfo = req.user?.contactInfo || req.body.contactInfo || {
      name: req.user?.name || req.body.name || '',
      email: req.user?.email || req.body.email || '',
      phone: req.user?.phone || req.body.phone || ''
    };
    const bookingData = {
      booking_number: bookingNumber,
      booking_type: 'car_rental',
      user_id: userId,
      service_id: carId,
      status: 'pending',
      total_amount: totalPrice,
      paid_amount: 0,
      currency: 'VND',
      contact_info: contactInfo,
      booking_details: {
        serviceName: car.name || car.model || '',
        description: car.description || '',
        startDate: pickupDate,
        endDate: returnDate,
        participants: 1,
        pickupLocation,
        dropoffLocation,
        additionalServices: additionalServices || null,
        driverInfo: driverInfo || null,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: {},
    };
    const { data: booking, error: bookingError } = await supabase.from('bookings').insert([bookingData]).select().single();
    if (bookingError) {
      res.status(500).json({ success: false, message: 'Lỗi khi đặt xe', error: bookingError.message });
      return;
    }
    // Giả lập redirectUrl thanh toán (có thể thay bằng link thực tế nếu có tích hợp cổng thanh toán)
    const redirectUrl = `/car-rental/payment?bookingId=${booking.booking_number}`;
    res.json({ success: true, data: booking, message: 'Đặt xe thành công', redirectUrl });
    return;
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi đặt xe', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const getCarBookings = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Chưa đăng nhập'
      });
      return;
    }
    const { data, error } = await supabase
      .from('car_rental_bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy lịch sử thuê xe',
        error: error.message
      });
      return;
    }
    res.json({
      success: true,
      data,
      message: 'Lấy lịch sử thuê xe thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy lịch sử thuê xe',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const cancelCarBooking = async (req: any, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;
    const { error } = await supabase
      .from('car_rental_bookings')
      .update({ status: 'CANCELLED', cancel_reason: reason || null, cancelled_at: new Date().toISOString() })
      .eq('booking_number', bookingId);
    if (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi huỷ booking',
        error: error.message
      });
      return;
    }
    res.json({
      success: true,
      message: 'Huỷ booking thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi huỷ booking',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
