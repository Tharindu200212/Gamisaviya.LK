// Helper functions for the API

// Format error response
export const errorResponse = (message, statusCode = 500) => {
  return {
    success: false,
    error: message,
    statusCode
  };
};

// Format success response
export const successResponse = (data, message = null) => {
  const response = {
    success: true,
    ...data
  };
  
  if (message) {
    response.message = message;
  }
  
  return response;
};

// Paginate results
export const paginate = (page = 1, limit = 10) => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  
  const skip = (pageNum - 1) * limitNum;
  
  return {
    skip,
    limit: limitNum
  };
};

// Calculate wholesale price
export const calculatePrice = (retailPrice, wholesalePrice, quantity, threshold) => {
  return quantity >= threshold ? wholesalePrice : retailPrice;
};

// Generate order number
export const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `ORD-${timestamp}-${random}`.toUpperCase();
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Sanitize user input
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

// Format currency (LKR)
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR'
  }).format(amount);
};

// Check if user can manage product
export const canManageProduct = (user, product) => {
  if (user.role === 'admin') return true;
  if (user.role === 'seller' && product.sellerId.toString() === user._id.toString()) {
    return true;
  }
  return false;
};

// Check if user can manage order
export const canManageOrder = (user, order) => {
  if (user.role === 'admin') return true;
  if (user._id.toString() === order.buyerId.toString()) return true;
  if (order.sellerIds && order.sellerIds.some(id => id.toString() === user._id.toString())) {
    return true;
  }
  return false;
};

// Get categories list
export const categories = [
  'Grains & Rice',
  'Oils & Spices',
  'Honey & Sweeteners',
  'Textiles & Crafts',
  'Pottery & Ceramics',
  'Fresh Produce',
  'Dairy Products',
  'Handicrafts',
  'Traditional Foods',
  'Herbal Products'
];

// Order status transitions
export const orderStatusFlow = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: []
};

// Check if status transition is valid
export const isValidStatusTransition = (currentStatus, newStatus) => {
  if (!orderStatusFlow[currentStatus]) return false;
  return orderStatusFlow[currentStatus].includes(newStatus);
};
