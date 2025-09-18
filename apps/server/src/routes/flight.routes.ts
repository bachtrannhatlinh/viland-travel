import express from 'express';
import { protect } from '../middleware/auth';
import {
  searchFlights,
  getFlightDetails,
  bookFlight,
  getBookingHistory,
  cancelBooking,
  getAllFlights
} from '../controllers/supabase/flight.supabase.controller';
import { authorize } from '../middleware/auth';

const router = express.Router();


// Public routes
router.get('/search', searchFlights);
router.get('/:flightId', getFlightDetails);

// Admin/staff: lấy tất cả chuyến bay
router.get('/', authorize('admin', 'staff'), getAllFlights);

// Protected routes
router.use(protect);
router.post('/book', bookFlight);
router.get('/bookings/history', getBookingHistory);
router.put('/bookings/:bookingId/cancel', cancelBooking);

export default router;
