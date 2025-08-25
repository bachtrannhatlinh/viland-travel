import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Tạo mới itinerary
export const createItinerary = async (req: Request, res: Response) => {
  try {
    const { start_location, end_location, start_time, end_time, notes, user_id, service_type } = req.body;
    // Tùy chỉnh các trường theo schema thực tế của bạn
    const { data, error } = await supabase
      .from('itineraries')
      .insert([
        { start_location, end_location, start_time, end_time, notes, user_id, service_type }
      ])
      .select('id')
      .single();
    if (error) throw error;
    res.json({ success: true, itineraryId: data.id, message: 'Itinerary created successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to create itinerary' });
  }
};

// Các controller còn lại
// Lấy danh sách tài xế từ Supabase
export const searchDrivers = async (req: Request, res: Response) => {
  try {
    // Có thể filter theo itineraryId hoặc các tham số khác nếu cần
    const { data, error } = await supabase
      .from('drivers')
      .select('id, name, rating, trips, vehicle, price');
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch drivers' });
  }
};

export const getDriverDetails = (req: Request, res: Response) => {
  res.json({ 
    success: true, 
    data: null,
    message: 'Driver details API - coming soon' 
  });
};

// Đặt tài xế (booking driver)
export const bookDriver = async (req: any, res: Response) => {
  try {
    // Validate input
    const { itineraryId, driverId, totalAmount, paymentMethod, contactInfo } = req.body;
    if (!itineraryId || itineraryId === 'undefined') {
      return res.status(400).json({ success: false, message: 'Thiếu hoặc sai itineraryId' });
    }
    if (!driverId || driverId === 'undefined') {
      return res.status(400).json({ success: false, message: 'Thiếu hoặc sai driverId' });
    }
    // Lấy user_id từ req.user
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
    }
    // Lấy thông tin itinerary
    const { data: itinerary, error: itineraryError } = await supabase
      .from('itineraries')
      .select('*')
      .eq('id', itineraryId)
      .single();
    if (itineraryError || !itinerary) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy itinerary', error: itineraryError?.message });
    }
    // Lấy thông tin driver
    const { data: driver, error: driverError } = await supabase
      .from('drivers')
      .select('*')
      .eq('id', driverId)
      .single();
    if (driverError || !driver) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tài xế', error: driverError?.message });
    }
    // Chuẩn hóa contact_info
    const contact = req.user?.contactInfo || contactInfo || {
      name: req.user?.name || '',
      email: req.user?.email || '',
      phone: req.user?.phone || ''
    };
    // Tạo booking_number
    const bookingNumber = 'DRV' + Date.now().toString().slice(-6) + Math.random().toString(36).substr(2, 3).toUpperCase();
    // Chuẩn hóa dữ liệu booking
    const bookingData = {
      booking_number: bookingNumber,
      booking_type: 'driver',
      user_id: userId,
      service_id: driverId,
      status: 'pending',
      total_amount: totalAmount,
      paid_amount: 0,
      currency: 'VND',
      contact_info: contact,
      booking_details: {
        itineraryId,
        driverName: driver.name,
        vehicle: driver.vehicle,
        startLocation: itinerary.start_location,
        endLocation: itinerary.end_location,
        startTime: itinerary.start_time,
        endTime: itinerary.end_time,
        notes: itinerary.notes,
        serviceType: itinerary.service_type,
        paymentMethod: paymentMethod || 'onepay',
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: {},
    };
    // Insert booking vào bảng bookings
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();
    if (bookingError) {
      return res.status(500).json({ success: false, message: 'Lỗi khi đặt tài xế', error: bookingError.message });
    }
    // Chuẩn hóa paymentInfo trả về (nếu cần)
    const paymentInfo = {
      amount: totalAmount,
      currency: 'VND',
      description: `Driver booking ${bookingNumber} - ${driver.name}`,
    };
    res.json({ success: true, data: booking, message: 'Đặt tài xế thành công', bookingNumber, paymentInfo });
    return;
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi đặt tài xế', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

export const getDriverBookings = (req: Request, res: Response) => {
  res.json({ 
    success: true, 
    data: [],
    message: 'Driver booking history - coming soon' 
  });
};

export const cancelDriverBooking = (req: Request, res: Response) => {
  res.json({ 
    success: true, 
    message: 'Cancel driver booking - coming soon' 
  });
};

export const rateDriver = (req: Request, res: Response) => {
  res.json({ 
    success: true, 
    message: 'Rate driver service - coming soon' 
  });
};

export const getDriverProfile = (req: Request, res: Response) => {
  res.json({ 
    success: true, 
    data: null,
    message: 'Driver profile - coming soon (Driver only)' 
  });
};

export const updateDriverProfile = (req: Request, res: Response) => {
  res.json({ 
    success: true, 
    message: 'Update driver profile - coming soon (Driver only)' 
  });
};

export const getDriverEarnings = (req: Request, res: Response) => {
  res.json({ 
    success: true, 
    data: [],
    message: 'Driver earnings - coming soon (Driver only)' 
  });
};
