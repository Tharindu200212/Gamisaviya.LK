import express from 'express';
import {
  createOrder,
  getOrder,
  getBuyerOrders,
  getSellerOrders,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protected routes - Buyer
router.post('/', protect, authorize('buyer', 'seller', 'admin'), createOrder);
router.get('/buyer/my-orders', protect, authorize('buyer', 'seller', 'admin'), getBuyerOrders);
router.put('/:id/cancel', protect, authorize('buyer', 'seller'), cancelOrder);

// Protected routes - Seller
router.get('/seller/my-orders', protect, authorize('seller', 'admin'), getSellerOrders);

// Protected routes - All authenticated users
router.get('/:id', protect, getOrder);

// Protected routes - Seller/Admin
router.put('/:id/status', protect, authorize('seller', 'admin'), updateOrderStatus);

export default router;
