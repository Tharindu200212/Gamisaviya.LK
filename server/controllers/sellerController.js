import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Get all approved sellers
// @route   GET /api/sellers
// @access  Public
export const getSellers = async (req, res, next) => {
  try {
    const sellers = await User.find({
      role: 'seller',
      approved: true
    }).select('-password');

    // Get product count for each seller
    const sellersWithProducts = await Promise.all(
      sellers.map(async (seller) => {
        const productCount = await Product.countDocuments({
          sellerId: seller._id,
          approved: true
        });

        return {
          ...seller.toObject(),
          products: productCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: sellersWithProducts.length,
      sellers: sellersWithProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single seller profile with products
// @route   GET /api/sellers/:id
// @access  Public
export const getSellerProfile = async (req, res, next) => {
  try {
    const seller = await User.findOne({
      _id: req.params.id,
      role: 'seller'
    }).select('-password');

    if (!seller) {
      return res.status(404).json({
        success: false,
        error: 'Seller not found'
      });
    }

    // Only show approved sellers to non-admin users
    if (!seller.approved && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({
        success: false,
        error: 'Seller not found'
      });
    }

    // Get seller's products
    const products = await Product.find({
      sellerId: seller._id,
      approved: true
    });

    const sellerData = {
      ...seller.toObject(),
      products: products
    };

    res.status(200).json({
      success: true,
      seller: sellerData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get seller dashboard stats
// @route   GET /api/sellers/dashboard/stats
// @access  Private (Seller)
export const getSellerStats = async (req, res, next) => {
  try {
    // Get product stats
    const totalProducts = await Product.countDocuments({ sellerId: req.user._id });
    const approvedProducts = await Product.countDocuments({
      sellerId: req.user._id,
      approved: true
    });
    const pendingProducts = await Product.countDocuments({
      sellerId: req.user._id,
      approved: false
    });

    // Get order stats (simplified - would need Order model with seller reference)
    const stats = {
      totalProducts,
      approvedProducts,
      pendingProducts,
      totalOrders: 0, // Placeholder
      pendingOrders: 0, // Placeholder
      totalRevenue: 0 // Placeholder
    };

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    next(error);
  }
};
