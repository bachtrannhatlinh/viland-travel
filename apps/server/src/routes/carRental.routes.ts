import express from 'express';
import { protect } from '../middleware/auth';
import {bookCar, searchCars, getCarDetails, getCarBookings, cancelCarBooking, getCarBookingByNumber } from '../controllers/supabase/carRental.supabase.controller';

const router = express.Router();

const extendRental = (req: any, res: any) => {
  res.json({ 
    success: true, 
    message: 'Extend car rental - coming soon' 
  });
};

// Public routes
router.get('/search', searchCars);
router.get('/booking/:bookingId', getCarBookingByNumber);
router.get('/:carId', getCarDetails);

// Protected routes
router.use(protect);
router.post('/book', bookCar);
router.get('/bookings/history', getCarBookings);
router.put('/bookings/:bookingId/cancel', cancelCarBooking);
router.put('/bookings/:bookingId/extend', extendRental);

export default router;
