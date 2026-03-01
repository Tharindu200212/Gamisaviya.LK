import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  namesin: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
  },
  descriptionsin: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  retailPrice: {
    type: Number,
    required: [true, 'Retail price is required'],
    min: [0, 'Price must be positive']
  },
  wholesalePrice: {
    type: Number,
    required: [true, 'Wholesale price is required'],
    min: [0, 'Price must be positive']
  },
  wholesaleThreshold: {
    type: Number,
    required: [true, 'Wholesale threshold is required'],
    min: [1, 'Threshold must be at least 1']
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  images: [{
    type: String
  }],
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerName: {
    type: String,
    required: true
  },
  sellerLocation: {
    type: String,
    required: true
  },
  approved: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
productSchema.index({ category: 1, approved: 1 });
productSchema.index({ sellerId: 1 });
productSchema.index({ featured: 1, approved: 1 });
productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
