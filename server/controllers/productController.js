import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Get all products (approved only for public, all for admin)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { category, featured, search, sort } = req.query;

    // Build query
    const query = {};

    // Only show approved products for non-admin users
    if (!req.user || req.user.role !== 'admin') {
      query.approved = true;
    }

    if (category) {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Build sort
    let sortOption = {};
    if (sort === 'price_asc') {
      sortOption = { retailPrice: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { retailPrice: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'featured') {
      sortOption = { featured: -1, createdAt: -1 };
    } else {
      sortOption = { createdAt: -1 };
    }

    const products = await Product.find(query)
      .sort(sortOption)
      .populate('sellerId', 'name email location');

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('sellerId', 'name email phone location story storysin image rating');

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Check if product is approved (unless user is admin or the seller)
    if (!product.approved &&
      (!req.user ||
        (req.user.role !== 'admin' && req.user._id.toString() !== product.sellerId.toString()))) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Seller/Admin)
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      namesin,
      description,
      descriptionsin,
      category,
      retailPrice,
      wholesalePrice,
      wholesaleThreshold,
      stock,
      images
    } = req.body;

    // Validation
    if (!name || !description || !category || !retailPrice || !wholesalePrice || !wholesaleThreshold) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields'
      });
    }

    // Get seller info
    const seller = await User.findById(req.user._id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        error: 'Seller not found'
      });
    }

    // Check if seller is approved
    if (seller.role === 'seller' && !seller.approved) {
      return res.status(403).json({
        success: false,
        error: 'Your seller account is pending approval'
      });
    }

    const productData = {
      name,
      namesin,
      description,
      descriptionsin,
      category,
      retailPrice,
      wholesalePrice,
      wholesaleThreshold,
      stock: stock || 0,
      stock: stock || 0,
      images: req.files
        ? req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`)
        : (images || []),
      sellerId: req.user._id,
      sellerName: seller.name,
      sellerLocation: seller.location || 'Sri Lanka',
      approved: false // req.user.role === 'admin' // Changed to false to allow testing approval flow
    };

    const product = await Product.create(productData);
    console.log('Product created:', product);

    res.status(201).json({
      success: true,
      product,
      message: req.user.role === 'admin'
        ? 'Product created successfully'
        : 'Product created. Waiting for admin approval.'
    });
  } catch (error) {
    console.error('Error creating product:', error);
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Seller/Admin)
// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Seller/Admin)
export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Check ownership or admin role
    if (req.user.role !== 'admin' && product.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this product'
      });
    }

    // Prepare update data
    const updateData = { ...req.body };

    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file =>
        `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
      );
    }

    // If updating, set approved to false again unless admin
    if (req.user.role !== 'admin') {
      // updateData.approved = false; // Optional: Require re-approval on edit? Let's leave it for now to avoid friction.
    }

    // Update product
    product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Seller/Admin)
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Check ownership or admin role
    if (req.user.role !== 'admin' && product.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this product'
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get seller's products
// @route   GET /api/products/seller/my-products
// @access  Private (Seller)
export const getSellerProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ sellerId: req.user._id })
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

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = async (req, res, next) => {
  try {
    const products = await Product.find({
      category: req.params.category,
      approved: true
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};
