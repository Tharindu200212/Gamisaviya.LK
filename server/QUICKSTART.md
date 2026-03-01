# GamiSaviya.lk - Quick Start Guide

## 🚀 Getting Started

This guide will help you set up and run the GamiSaviya.lk backend server.

## Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - Choose one option:
  - **Local MongoDB** - [Download](https://www.mongodb.com/try/download/community)
  - **MongoDB Atlas** (Cloud) - [Sign up free](https://www.mongodb.com/cloud/atlas/register)
- **npm** or **yarn** (comes with Node.js)

## Step-by-Step Setup

### 1. Install MongoDB (if using local)

**Windows:**
```powershell
# Download and install MongoDB from official website
# Or use Chocolatey:
choco install mongodb

# Start MongoDB service
net start MongoDB
```

**Verify MongoDB is running:**
```powershell
mongod --version
```

### 2. Navigate to Server Directory

```powershell
cd server
```

### 3. Install Dependencies

```powershell
npm install
```

This will install:
- express (Web framework)
- mongoose (MongoDB ODM)
- bcryptjs (Password hashing)
- jsonwebtoken (JWT authentication)
- cors (Cross-origin requests)
- dotenv (Environment variables)
- And more...

### 4. Configure Environment Variables

The `.env` file is already created with default values. Update if needed:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gamisaviya
JWT_SECRET=gamisaviya-super-secret-jwt-key-2026-change-in-production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

**Using MongoDB Atlas?**
Replace `MONGODB_URI` with your connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gamisaviya?retryWrites=true&w=majority
```

### 5. Seed the Database

Populate the database with sample data (users, products, orders):

```powershell
npm run seed
```

You should see:
```
✅ MongoDB Connected
👥 Creating users...
📦 Creating products...
🛍️  Creating sample orders...
🎉 Database seeded successfully!
```

**Test Credentials will be displayed:**
- Admin: admin@gamisaviya.lk / admin123
- Sellers: ranjith@gamisaviya.lk / seller123
- Buyer: buyer@gamisaviya.lk / buyer123

### 6. Start the Server

**Development mode (with auto-restart):**
```powershell
npm run dev
```

**Production mode:**
```powershell
npm start
```

The server will start on http://localhost:5000

### 7. Test the API

Open your browser and visit:
- http://localhost:5000 - Welcome message
- http://localhost:5000/health - Health check

Or use a tool like Postman or curl:

```powershell
# Test health endpoint
curl http://localhost:5000/health

# Test login
curl -X POST http://localhost:5000/api/auth/signin `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@gamisaviya.lk","password":"admin123"}'

# Get all products
curl http://localhost:5000/api/products
```

## 📁 Project Structure

```
server/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # Authentication logic
│   ├── productController.js   # Product management
│   ├── orderController.js     # Order handling
│   ├── sellerController.js    # Seller operations
│   └── adminController.js     # Admin features
├── middleware/
│   ├── auth.js               # JWT & authorization
│   └── errorHandler.js       # Error handling
├── models/
│   ├── User.js              # User schema
│   ├── Product.js           # Product schema
│   ├── Order.js             # Order schema
│   └── Address.js           # Address schema
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── productRoutes.js     # Product endpoints
│   ├── orderRoutes.js       # Order endpoints
│   ├── sellerRoutes.js      # Seller endpoints
│   └── adminRoutes.js       # Admin endpoints
├── utils/
│   ├── seeder.js           # Database seeder
│   └── helpers.js          # Utility functions
├── .env                     # Environment config
├── .env.example            # Template
├── package.json            # Dependencies
└── server.js              # Main entry point
```

## 🔑 API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /signup` - Register new user
- `POST /signin` - Login
- `POST /signout` - Logout
- `GET /session` - Get current session
- `GET /me` - Get user profile
- `PUT /profile` - Update profile
- `PUT /change-password` - Change password

### Products (`/api/products`)
- `GET /` - Get all products (with filters)
- `GET /:id` - Get single product
- `POST /` - Create product (Seller/Admin)
- `PUT /:id` - Update product (Seller/Admin)
- `DELETE /:id` - Delete product (Seller/Admin)
- `GET /seller/my-products` - Get seller's products

### Orders (`/api/orders`)
- `POST /` - Create order (Buyer)
- `GET /:id` - Get order details
- `GET /buyer/my-orders` - Get buyer's orders
- `GET /seller/my-orders` - Get seller's orders
- `PUT /:id/status` - Update order status
- `PUT /:id/cancel` - Cancel order

### Sellers (`/api/sellers`)
- `GET /` - Get all sellers
- `GET /:id` - Get seller profile
- `GET /dashboard/stats` - Get seller stats

### Admin (`/api/admin`)
- `GET /users` - Get all users
- `GET /pending-sellers` - Pending approvals
- `PUT /sellers/:id/approve` - Approve seller
- `GET /products` - All products
- `PUT /products/:id/approve` - Approve product
- `GET /orders` - All orders
- `GET /stats` - Platform statistics

## 🧪 Testing with Postman

1. Import the collection (create one with the endpoints above)
2. Login as admin to get JWT token
3. Add token to Authorization header: `Bearer <token>`
4. Test protected endpoints

## 🐛 Troubleshooting

**MongoDB connection error:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
- Make sure MongoDB is running: `net start MongoDB`
- Check if port 27017 is available
- Verify MONGODB_URI in .env file

**Port already in use:**
```
Error: listen EADDRINUSE: address already in use :::5000
```
- Change PORT in .env file
- Or kill the process using port 5000

**Dependencies error:**
```
Cannot find module 'express'
```
- Run `npm install` again
- Delete `node_modules` and run `npm install`

**Seeder error:**
```
Error seeding database: E11000 duplicate key error
```
- Data already exists. Drop the database first:
```powershell
# In MongoDB shell
use gamisaviya
db.dropDatabase()
# Then run seeder again
npm run seed
```

## 🔄 Common Commands

```powershell
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Seed database
npm run seed

# Check MongoDB status
net start MongoDB  # Windows

# Access MongoDB shell
mongosh gamisaviya
```

## 📊 MongoDB Commands

```javascript
// View all collections
show collections

// Count documents
db.users.countDocuments()
db.products.countDocuments()
db.orders.countDocuments()

// View users
db.users.find().pretty()

// View products
db.products.find({ approved: true }).pretty()

// Clear database
db.dropDatabase()
```

## 🎯 Next Steps

1. ✅ Backend server is running
2. 📱 Connect your frontend React app
3. 🔧 Update API_BASE_URL in frontend to `http://localhost:5000/api`
4. 🧪 Test authentication flow
5. 🛒 Test product and order operations

## 📞 Support

If you encounter any issues:
1. Check the console output for error messages
2. Verify MongoDB is running
3. Check .env configuration
4. Review the error logs

## 🚀 Production Deployment

Before deploying to production:
- [ ] Change JWT_SECRET to a strong random string
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas for database
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Set up logging and monitoring
- [ ] Configure CORS for your domain

---

**Happy Coding! 🎉**
