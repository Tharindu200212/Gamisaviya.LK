import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Buyer)
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, notes, phone } = req.body; // added phone

    // Validation
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Order must contain at least one item'
      });
    }

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error: 'Please provide shipping address and payment method'
      });
    }

    // Verify stock availability, get seller IDs, and build final order items
    const sellerIds = new Set();
    const finalItems = [];
    let calculatedTotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: `Product ${item.productId} not found`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for ${product.name}`
        });
      }

      sellerIds.add(product.sellerId.toString());

      // Calculate price based on wholesale threshold
      const isWholesale = item.quantity >= product.wholesaleThreshold;
      const pricePerUnit = isWholesale ? product.wholesalePrice : product.retailPrice;
      const lineTotal = pricePerUnit * item.quantity;

      finalItems.push({
        productId: product._id,
        productName: product.name,
        quantity: item.quantity,
        pricePerUnit: pricePerUnit,
        total: lineTotal
      });

      calculatedTotal += lineTotal;

      // Update stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Get buyer info
    const buyer = await User.findById(req.user._id);

    // Create order
    const orderData = {
      buyerId: req.user._id,
      buyerName: buyer.name,
      items: finalItems,
      totalAmount: calculatedTotal,
      shippingAddress: phone ? `${shippingAddress} (Phone: ${phone})` : shippingAddress, // Append phone to address or handle better if schema allowed
      paymentMethod,
      notes,
      sellerIds: Array.from(sellerIds),
      status: 'pending'
    };

    const order = await Order.create(orderData);

    res.status(201).json({
      success: true,
      order,
      message: 'Order created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyerId', 'name email phone')
      .populate('items.productId', 'name images');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check authorization
    const isBuyer = order.buyerId._id.toString() === req.user._id.toString();
    const isSeller = order.sellerIds.some(id => id.toString() === req.user._id.toString());
    const isAdmin = req.user.role === 'admin';

    if (!isBuyer && !isSeller && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get buyer's orders
// @route   GET /api/orders/buyer/my-orders
// @access  Private (Buyer)
export const getBuyerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyerId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.productId', 'name images');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get seller's orders
// @route   GET /api/orders/seller/my-orders
// @access  Private (Seller)
export const getSellerOrders = async (req, res, next) => {
  try {
    // Find orders that contain products from this seller
    const orders = await Order.find({
      sellerIds: req.user._id
    })
      .sort({ createdAt: -1 })
    // .populate('buyerId', 'name email phone')
    // .populate('items.productId', 'name images sellerId');

    // Filter items to show only this seller's products
    const filteredOrders = orders.map(order => {
      const orderObj = order.toObject();
      orderObj.items = []; // DEBUGGING CRASH
      return orderObj;
    });

    res.status(200).json({
      success: true,
      count: filteredOrders.length,
      orders: filteredOrders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Seller/Admin)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Please provide order status'
      });
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order status'
      });
    }

    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check authorization
    const isSeller = order.sellerIds.some(id => id.toString() === req.user._id.toString());
    const isAdmin = req.user.role === 'admin';

    if (!isSeller && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this order'
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      order,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private (Buyer)
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if buyer owns this order
    if (order.buyerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this order'
      });
    }

    // Can only cancel pending orders
    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Can only cancel pending orders'
      });
    }

    // Restore stock
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      order,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};
