import express from 'express';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Import controller từ controller file
import {
  createItinerary,
  searchDrivers,
  getDriverDetails,
  bookDriver,
  getDriverBookings,
  cancelDriverBooking,
  rateDriver,
  getDriverProfile,
  updateDriverProfile,
  getDriverEarnings
} from '../controllers/driver.supabase.controller';


// Itinerary route (public)
router.post('/itinerary', createItinerary);

// Public routes
router.get('/search', searchDrivers);
router.get('/:driverId', getDriverDetails);

// Protected routes
router.use(protect);
router.post('/book', bookDriver);
router.get('/bookings/history', getDriverBookings);
router.put('/bookings/:bookingId/cancel', cancelDriverBooking);
router.post('/bookings/:bookingId/rate', rateDriver);

// Driver-specific routes
router.get('/profile/me', authorize('driver'), getDriverProfile);
router.put('/profile/me', authorize('driver'), updateDriverProfile);
router.get('/earnings/me', authorize('driver'), getDriverEarnings);

export default router;
