import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, approved } = req.query;

    const query = {};
    if (role) query.role = role;
    if (approved !== undefined) query.approved = approved === 'true';

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending seller approvals
// @route   GET /api/admin/pending-sellers
// @access  Private (Admin)
export const getPendingSellers = async (req, res, next) => {
  try {
    const pendingSellers = await User.find({
      role: 'seller',
      approved: false
    })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pendingSellers.length,
      sellers: pendingSellers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/reject seller
// @route   PUT /api/admin/sellers/:id/approve
// @access  Private (Admin)
export const approveSeller = async (req, res, next) => {
  try {
    const { approved } = req.body;

    if (approved === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Please provide approval status'
      });
    }

    const seller = await User.findOne({
      _id: req.params.id,
      role: 'seller'
    });

    if (!seller) {
      return res.status(404).json({
        success: false,
        error: 'Seller not found'
      });
    }

    seller.approved = approved;
    await seller.save();

    res.status(200).json({
      success: true,
      seller: seller.toJSON(),
      message: approved ? 'Seller approved successfully' : 'Seller rejected'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products (including unapproved)
// @route   GET /api/admin/products
// @access  Private (Admin)
export const getAllProducts = async (req, res, next) => {
  try {
    const { approved, featured } = req.query;

    const query = {};
    if (approved === 'true') query.approved = true;
    else if (approved === 'false') query.approved = false;
    // else undefined, show all

    if (featured === 'true') query.featured = true;

    const products = await Product.find(query)
      .populate('sellerId', 'name email location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/reject/feature product
// @route   PUT /api/admin/products/:id/approve
// @access  Private (Admin)
export const approveProduct = async (req, res, next) => {
  try {
    const { approved, featured } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    if (approved !== undefined) product.approved = approved;
    if (featured !== undefined) product.featured = featured;

    await product.save();

    res.status(200).json({
      success: true,
      product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Don't allow deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete your own account'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private (Admin)
export const getAllOrders = async (req, res, next) => {
  try {
    const { status } = req.query;

    const query = {};
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('buyerId', 'name email phone')
      .populate('items.productId', 'name images')
      .populate('sellerIds', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getPlatformStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBuyers = await User.countDocuments({ role: 'buyer' });
    const totalSellers = await User.countDocuments({ role: 'seller', approved: true });
    const pendingSellers = await User.countDocuments({ role: 'seller', approved: false });

    const totalProducts = await Product.countDocuments();
    const approvedProducts = await Product.countDocuments({ approved: true });
    const pendingProducts = await Product.countDocuments({ approved: false });

    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const completedOrders = await Order.countDocuments({ status: 'delivered' });

    // Calculate total revenue
    const orders = await Order.find({ status: { $ne: 'cancelled' } });
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    const stats = {
      users: {
        total: totalUsers,
        buyers: totalBuyers,
        sellers: totalSellers,
        pendingSellers
      },
      products: {
        total: totalProducts,
        approved: approvedProducts,
        pending: pendingProducts
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        completed: completedOrders
      },
      revenue: {
        total: totalRevenue,
        currency: 'LKR'
      }
    };

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    next(error);
  }
};
