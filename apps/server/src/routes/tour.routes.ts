import express from 'express';
import { getTours, getTourById, searchTours } from '../controllers/supabase/tour.supabase.controller';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getTours);
router.get('/search', searchTours);
router.get('/:id', getTourById);

export default router;
