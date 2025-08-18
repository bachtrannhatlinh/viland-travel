import express from "express";
import { protect } from "../middleware/auth";
// import {
//   searchHotels,
//   getHotelDetails,
//   bookHotel,
//   getHotelBookings,
//   cancelHotelBooking,
//   addHotelReview
// } from '../controllers/hotel.controller';

import {
  searchHotels,
  getHotelDetails,
  bookHotel,
  getHotelBookings,
  cancelHotelBooking,
  addHotelReview,
} from "../controllers/hotel.supabase.controller";

const router = express.Router();

// Public routes
router.get("/search", searchHotels);
router.get("/:hotelId", getHotelDetails);

// Protected routes
router.use(protect);
router.post("/book", bookHotel);
router.get("/bookings/history", getHotelBookings);
router.put("/bookings/:bookingId/cancel", cancelHotelBooking);
router.post("/:hotelId/reviews", addHotelReview);

export default router;
