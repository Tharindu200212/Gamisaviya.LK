import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  role: {
    type: String,
    enum: ['buyer', 'seller', 'admin'],
    default: 'buyer'
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: 'https://ui-avatars.com/api/?name='
  },
  approved: {
    type: Boolean,
    default: function() {
      // Auto-approve buyers and admins, sellers need manual approval
      return this.role !== 'seller';
    }
  },
  // Seller-specific fields
  location: {
    type: String,
    trim: true
  },
  story: {
    type: String,
    trim: true
  },
  storysin: {
    type: String,
    trim: true
  },
  image: {
    type: String
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to get public user data (without password)
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Set avatar URL on creation if not provided
userSchema.pre('save', function(next) {
  if (!this.avatar || this.avatar === 'https://ui-avatars.com/api/?name=') {
    this.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=random`;
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
