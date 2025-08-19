import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

// Khởi tạo Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Lấy lịch sử thuê xe của user
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
    // Query bookings theo user_id
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

// Hủy booking xe
export const cancelCarBooking = async (req: any, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;
    // Update status booking sang CANCELLED, lưu lý do nếu có
    const { error } = await supabase
      .from('car_rental_bookings')
      .update({ status: 'CANCELLED', cancel_reason: reason || null, cancelled_at: new Date().toISOString() })
      .eq('booking_number', bookingId);
    if (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi hủy đặt xe',
        error: error.message
      });
      return;
    }
    res.json({
      success: true,
      message: 'Hủy đặt xe thành công',
      bookingId,
      reason
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi hủy đặt xe',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Kiểm tra availability xe theo ngày
export const checkCarAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { carId } = req.params;
    const { pickupDate, returnDate } = req.query;
    if (!pickupDate || !returnDate) {
      res.status(400).json({ success: false, message: 'Thiếu ngày nhận/trả xe' });
      return;
    }
    // Lấy availability calendar của xe
    const { data, error } = await supabase
      .from('car_rentals')
      .select('availability')
      .eq('id', carId)
      .single();
    if (error || !data) {
      res.status(404).json({ success: false, message: 'Không tìm thấy xe' });
      return;
    }
    // Giả sử calendar là mảng các object {start: string, end: string}
    const calendar = data.availability?.calendar || [];
    const pick = new Date(pickupDate as string);
    const ret = new Date(returnDate as string);
    // Kiểm tra có bị trùng lịch không
    const isAvailable = !calendar.some((item: any) => {
      const bookedStart = new Date(item.start);
      const bookedEnd = new Date(item.end);
      return (pick <= bookedEnd && ret >= bookedStart);
    });
    res.json({ success: true, isAvailable });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi kiểm tra lịch xe', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Đặt xe (tạo booking mới)
export const bookCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      carId,
      pickupDate,
      returnDate,
      pickupLocation,
      returnLocation,
      driverInfo,
      contactInfo,
      additionalServices,
      specialRequests,
      totalAmount,
      paymentMethod,
      userId
    } = req.body;

    if (!carId || !pickupDate || !returnDate || !driverInfo || !contactInfo || !totalAmount || !paymentMethod) {
      res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
      return;
    }

    // Kiểm tra availability
    const { data: car, error: carError } = await supabase
      .from('car_rentals')
      .select('id, make, model, year, license_plate, seats, transmission, price_per_day, availability')
      .eq('id', carId)
      .single();
    if (carError || !car) {
      res.status(404).json({ success: false, message: 'Không tìm thấy xe' });
      return;
    }
    // Kiểm tra lịch trùng như trên
    const calendar = car.availability?.calendar || [];
    const pick = new Date(pickupDate);
    const ret = new Date(returnDate);
    const isAvailable = !calendar.some((item: any) => {
      const bookedStart = new Date(item.start);
      const bookedEnd = new Date(item.end);
      return (pick <= bookedEnd && ret >= bookedStart);
    });
    if (!isAvailable) {
      res.status(400).json({ success: false, message: 'Xe đã được đặt trong khoảng thời gian này' });
      return;
    }

    // Tạo booking
    const bookingNumber = 'CR' + Date.now().toString();
    const bookingData = {
      booking_number: bookingNumber,
      car_id: carId,
      user_id: userId || null,
      pickup_date: pickupDate,
      return_date: returnDate,
      pickup_location: pickupLocation,
      return_location: returnLocation,
      driver_info: driverInfo,
      contact_info: contactInfo,
      additional_services: additionalServices || [],
      special_requests: specialRequests,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      status: 'PENDING',
      created_at: new Date().toISOString()
    };
    const { data: booking, error: bookingError } = await supabase
      .from('car_rental_bookings')
      .insert([bookingData])
      .select()
      .single();
    if (bookingError) {
      res.status(500).json({ success: false, message: 'Lỗi khi tạo booking', error: bookingError.message });
      return;
    }

    // Cập nhật calendar xe (thêm lịch mới)
    const newCalendar = [...calendar, { start: pickupDate, end: returnDate }];
    await supabase
      .from('car_rentals')
      .update({ availability: { ...car.availability, calendar: newCalendar } })
      .eq('id', carId);

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi đặt xe', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Lưu transaction/payment (tuỳ chọn, nếu muốn quản lý giao dịch)
export const saveCarRentalPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId, transactionId, amount, method, status, details } = req.body;
    if (!bookingId || !transactionId || !amount || !method) {
      res.status(400).json({ success: false, message: 'Thiếu thông tin giao dịch' });
      return;
    }
    const { error } = await supabase
      .from('car_rental_payments')
      .insert([
        {
          booking_id: bookingId,
          transaction_id: transactionId,
          amount,
          method,
          status: status || 'PENDING',
          details: details || {},
          created_at: new Date().toISOString()
        }
      ]);
    if (error) {
      res.status(500).json({ success: false, message: 'Lỗi lưu giao dịch', error: error.message });
      return;
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lưu giao dịch', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Tìm kiếm xe
export const searchCars = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      location,
      carType,
      seats,
      priceMin,
      priceMax,
      transmission,
      fuelType
    } = req.query;

    let query = supabase.from('car_rentals').select('*');

    // Lọc theo status AVAILABLE
    query = query.eq('status', 'AVAILABLE');

    if (carType) query = query.eq('type', carType);
    if (seats) query = query.gte('seats', Number(seats));
    if (priceMin) query = query.gte('price_per_day', Number(priceMin));
    if (priceMax) query = query.lte('price_per_day', Number(priceMax));
    if (transmission) query = query.eq('transmission', transmission);
    if (fuelType) query = query.eq('fuel_type', fuelType);

    // location: lọc theo city hoặc address trong location jsonb
    if (location) {
      query = query.or(`location->>city.ilike.%${location}%,location->>address.ilike.%${location}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json({
      success: true,
      data,
      totalResults: data.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tìm kiếm xe',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Lấy chi tiết xe
export const getCarDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { carId } = req.params;
    const { data, error } = await supabase
      .from('car_rentals')
      .select('*')
      .eq('id', carId)
      .single();
    if (error || !data) {
      res.status(404).json({ success: false, message: 'Không tìm thấy xe' });
      return;
    }

    // Lấy các xe tương tự (cùng type, khác id)
    const { data: similarCars } = await supabase
      .from('car_rentals')
      .select('*')
      .eq('type', data.type)
      .neq('id', carId)
      .eq('status', 'AVAILABLE')
      .limit(3);

    res.json({
      success: true,
      data: {
        ...data,
        isBookable: data.status === 'AVAILABLE',
        similarCars: similarCars || []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin xe',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
