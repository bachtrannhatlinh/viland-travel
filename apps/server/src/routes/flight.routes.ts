import express from 'express';
import { protect } from '../middleware/auth';
import {
  searchFlights,
  getFlightDetails,
  bookFlight,
  getBookingHistory,
  cancelBooking
} from '../controllers/flight.controller';

const router = express.Router();

// Public routes
router.get('/search', searchFlights);
router.get('/:flightId', getFlightDetails);

// Protected routes
router.use(protect);
router.post('/book', bookFlight);
router.get('/bookings/history', getBookingHistory);
router.put('/bookings/:bookingId/cancel', cancelBooking);

export default router;
