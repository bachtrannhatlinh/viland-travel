import express from 'express';
import { getTours, getTourById, searchTours, bookTour } from '../controllers/supabase/tour.supabase.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getTours);
router.get('/search', searchTours);
router.get('/:id', getTourById);

// Protected routes
router.use(protect)
router.post('/book', bookTour);

export default router;
