import express from 'express';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Placeholder controllers - will be implemented later
const getUsers = (req: any, res: any) => {
  res.json({ message: 'Get users - coming soon' });
};

const getUserById = (req: any, res: any) => {
  res.json({ message: 'Get user by ID - coming soon' });
};

const updateUser = (req: any, res: any) => {
  res.json({ message: 'Update user - coming soon' });
};

const deleteUser = (req: any, res: any) => {
  res.json({ message: 'Delete user - coming soon' });
};

// Protected routes
router.use(protect);

// Admin only routes
router.get('/', authorize('admin'), getUsers);
router.get('/:id', getUserById);
router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

export default router;
