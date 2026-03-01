import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
  getProductsByCategory
} from '../controllers/productController.js';
import { protect, authorize, checkApproval, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', optionalAuth, getProduct);

// Protected routes - Seller
router.get('/seller/my-products', protect, authorize('seller', 'admin'), getSellerProducts);

import upload from '../middleware/upload.js';

// Protected routes - Seller/Admin (with approval check)
router.post('/', protect, authorize('seller', 'admin'), checkApproval, upload.array('images', 5), createProduct);
router.put('/:id', protect, authorize('seller', 'admin'), upload.array('images', 5), updateProduct);
router.delete('/:id', protect, authorize('seller', 'admin'), deleteProduct);

export default router;
