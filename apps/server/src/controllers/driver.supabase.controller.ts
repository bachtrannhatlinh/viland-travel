import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

// Khởi tạo Supabase client
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

export const bookDriver = (req: Request, res: Response) => {
  res.json({ 
    success: true, 
    message: 'Driver booking API - coming soon (Requires authentication)' 
  });
};

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
