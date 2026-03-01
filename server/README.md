# GamiSaviya.lk Backend Server

Backend API server for the GamiSaviya.lk e-commerce platform built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control (Buyer, Seller, Admin)
- **User Management**: Registration, login, profile management
- **Product Management**: CRUD operations with approval workflow
- **Order Management**: Order creation, tracking, and status updates
- **Seller Management**: Seller profiles and approval system
- **Admin Panel**: Administrative endpoints for platform management

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the server directory:
   ```bash
   cd server
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

5. Update `.env` with your configuration:
   - Set `MONGODB_URI` to your MongoDB connection string
   - Set `JWT_SECRET` to a secure random string
   - Set `PORT` and `CLIENT_URL` as needed

## Running the Server

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Seed Database
```bash
npm run seed
```

The server will start on `http://localhost:5000` (or your configured PORT).

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/session` - Get current session
- `GET /api/auth/me` - Get current user profile

### Products
- `GET /api/products` - Get all approved products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Seller/Admin)
- `PUT /api/products/:id` - Update product (Seller/Admin)
- `DELETE /api/products/:id` - Delete product (Seller/Admin)
- `GET /api/products/seller/my-products` - Get seller's products

### Orders
- `POST /api/orders` - Create new order (Buyer)
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/buyer/my-orders` - Get buyer's orders
- `GET /api/orders/seller/my-orders` - Get seller's orders
- `PUT /api/orders/:id/status` - Update order status (Seller/Admin)

### Sellers
- `GET /api/sellers` - Get all approved sellers
- `GET /api/sellers/:id` - Get seller profile with products

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/pending-sellers` - Get pending seller approvals
- `PUT /api/admin/sellers/:id/approve` - Approve/reject seller
- `GET /api/admin/products` - Get all products (including unapproved)
- `PUT /api/admin/products/:id/approve` - Approve/reject product
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/stats` - Get platform statistics

## Project Structure

```
server/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js   # Authentication logic
│   ├── productController.js # Product CRUD
│   ├── orderController.js   # Order management
│   ├── sellerController.js  # Seller operations
│   └── adminController.js   # Admin operations
├── middleware/
│   ├── auth.js             # JWT authentication
│   └── errorHandler.js     # Error handling
├── models/
│   ├── User.js             # User schema
│   ├── Product.js          # Product schema
│   ├── Order.js            # Order schema
│   └── Seller.js           # Seller schema
├── routes/
│   ├── authRoutes.js       # Auth endpoints
│   ├── productRoutes.js    # Product endpoints
│   ├── orderRoutes.js      # Order endpoints
│   ├── sellerRoutes.js     # Seller endpoints
│   └── adminRoutes.js      # Admin endpoints
├── utils/
│   ├── seeder.js           # Database seeder
│   └── helpers.js          # Helper functions
├── .env.example            # Environment variables template
├── .gitignore
├── package.json
├── README.md
└── server.js               # Main server file
```

## Default Users (After Seeding)

**Admin:**
- Email: admin@gamisaviya.lk
- Password: admin123

**Sellers:**
- Email: ranjith@gamisaviya.lk, Password: seller123
- Email: kumari@gamisaviya.lk, Password: seller123

**Buyer:**
- Create via registration endpoint

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/gamisaviya |
| JWT_SECRET | Secret key for JWT | (required) |
| JWT_EXPIRE | JWT token expiration | 7d |
| CLIENT_URL | Frontend URL for CORS | http://localhost:5173 |
| NODE_ENV | Environment (development/production) | development |

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation
- CORS protection
- Environment variable configuration

## License

ISC
