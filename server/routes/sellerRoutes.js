import express from 'express';
import {
  getSellers,
  getSellerProfile,
  getSellerStats
} from '../controllers/sellerController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getSellers);
router.get('/:id', getSellerProfile);

// Protected routes - Seller
router.get('/dashboard/stats', protect, authorize('seller'), getSellerStats);

export default router;
