import express from 'express';
import {
  getAllUsers,
  getPendingSellers,
  approveSeller,
  getAllProducts,
  approveProduct,
  deleteUser,
  getAllOrders,
  getPlatformStats
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are admin-only
router.use(protect);
router.use(authorize('admin'));

// User management
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

// Seller management
router.get('/pending-sellers', getPendingSellers);
router.put('/sellers/:id/approve', approveSeller);

// Product management
router.get('/products', getAllProducts);
router.put('/products/:id/approve', approveProduct);

// Order management
router.get('/orders', getAllOrders);

// Platform statistics
router.get('/stats', getPlatformStats);

export default router;
