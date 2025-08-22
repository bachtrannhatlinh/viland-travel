
import express from 'express';
import { protect, authorize } from '../middleware/auth';
import { BookingSupabaseController } from '../controllers/supabase/booking.supabase.controller';

const router = express.Router();


import { Request, Response } from 'express';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      [key: string]: any;
    }
    interface Request {
      user?: UserPayload;
    }
  }
}
import { supabase, TABLES } from '../config/supabase';

// Lấy lịch sử booking của user đã đăng nhập
const getUserBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    // Có thể thêm filter theo status, type nếu cần
    const { data, error } = await supabase
      .from(TABLES.BOOKINGS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user bookings', error });
  }
};

const getBookingById = (req: any, res: any) => {
  res.json({ 
    success: true, 
    data: null,
    message: 'Booking details API - coming soon' 
  });
};

const cancelBooking = (req: any, res: any) => {
  res.json({ 
    success: true, 
    message: 'Cancel booking API - coming soon' 
  });
};

const modifyBooking = (req: any, res: any) => {
  res.json({ 
    success: true, 
    message: 'Modify booking API - coming soon' 
  });
};

const getAllBookings = (req: any, res: any) => {
  res.json({ 
    success: true, 
    data: [],
    message: 'All bookings API - coming soon (Admin only)',
    features: [
      'Admin view of all bookings',
      'Filter and search capabilities',
      'Booking management and processing',
      'Revenue and analytics data'
    ]
  });
};

const updateBookingStatus = (req: any, res: any) => {
  res.json({ 
    success: true, 
    message: 'Update booking status - coming soon (Admin only)' 
  });
};

const getBookingStats = (req: any, res: any) => {
  res.json({ 
    success: true, 
    data: {},
    message: 'Booking statistics - coming soon (Admin only)' 
  });
};


// Protected routes - all booking routes require authentication
router.use(protect);

// Customer routes
router.get('/my-bookings', getUserBookings);
router.get('/:bookingId', getBookingById);
router.put('/:bookingId/cancel', cancelBooking);
router.put('/:bookingId/modify', modifyBooking);
router.post('/', BookingSupabaseController.createBooking); // Thêm route tạo booking mới

// Admin routes
router.get('/', authorize('admin', 'staff'), getAllBookings);
router.put('/:bookingId/status', authorize('admin', 'staff'), updateBookingStatus);
router.get('/analytics/stats', authorize('admin'), getBookingStats);

export default router;
