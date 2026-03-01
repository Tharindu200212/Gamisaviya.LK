# GamiSaviya.lk - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Get JWT Token

Login to receive a JWT token:

**POST** `/auth/signin`

**Request Body:**
```json
{
  "email": "admin@gamisaviya.lk",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "admin@gamisaviya.lk",
    "name": "Admin User",
    "role": "admin"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🔐 Authentication Endpoints

### 1. Register New User

**POST** `/auth/signup`

**Access:** Public

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "buyer",
  "phone": "+94 77 123 4567"
}
```

**Seller Registration:**
```json
{
  "email": "newseller@example.com",
  "password": "password123",
  "name": "Jane Smith",
  "role": "seller",
  "phone": "+94 77 123 4567",
  "location": "Colombo",
  "story": "My story...",
  "storysin": "මගේ කතාව..."
}
```

**Response:**
```json
{
  "success": true,
  "user": { ... },
  "accessToken": "...",
  "message": "Account created successfully"
}
```

### 2. Login

**POST** `/auth/signin`

**Access:** Public

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### 3. Logout

**POST** `/auth/signout`

**Access:** Private

**Headers:**
```
Authorization: Bearer <token>
```

### 4. Get Current Session

**GET** `/auth/session`

**Access:** Private

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "...",
    "name": "...",
    "role": "buyer"
  }
}
```

### 5. Get My Profile

**GET** `/auth/me`

**Access:** Private

### 6. Update Profile

**PUT** `/auth/profile`

**Access:** Private

**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "+94 77 999 8888",
  "address": "New address"
}
```

### 7. Change Password

**PUT** `/auth/change-password`

**Access:** Private

**Request Body:**
```json
{
  "currentPassword": "oldpass123",
  "newPassword": "newpass123"
}
```

---

## 📦 Product Endpoints

### 1. Get All Products

**GET** `/products`

**Access:** Public

**Query Parameters:**
- `category` - Filter by category
- `featured` - Filter featured products (true/false)
- `search` - Search in product name/description
- `sort` - Sort by: price_asc, price_desc, rating, featured

**Example:**
```
GET /products?category=Grains & Rice&featured=true
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "products": [
    {
      "id": "...",
      "name": "Organic Rice",
      "description": "...",
      "category": "Grains & Rice",
      "retailPrice": 250,
      "wholesalePrice": 200,
      "wholesaleThreshold": 10,
      "stock": 500,
      "images": ["..."],
      "approved": true,
      "featured": true
    }
  ]
}
```

### 2. Get Single Product

**GET** `/products/:id`

**Access:** Public

**Response:**
```json
{
  "success": true,
  "product": {
    "id": "...",
    "name": "Organic Rice",
    "sellerId": {
      "name": "Ranjith Silva",
      "email": "ranjith@gamisaviya.lk",
      "location": "Anuradhapura",
      "story": "..."
    },
    ...
  }
}
```

### 3. Create Product

**POST** `/products`

**Access:** Private (Seller/Admin)

**Request Body:**
```json
{
  "name": "New Product",
  "namesin": "නව නිෂ්පාදනය",
  "description": "Product description",
  "descriptionsin": "නිෂ්පාදන විස්තරය",
  "category": "Grains & Rice",
  "retailPrice": 500,
  "wholesalePrice": 400,
  "wholesaleThreshold": 10,
  "stock": 100,
  "images": ["https://example.com/image.jpg"]
}
```

### 4. Update Product

**PUT** `/products/:id`

**Access:** Private (Owner/Admin)

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "stock": 150,
  "retailPrice": 550
}
```

### 5. Delete Product

**DELETE** `/products/:id`

**Access:** Private (Owner/Admin)

### 6. Get My Products (Seller)

**GET** `/products/seller/my-products`

**Access:** Private (Seller)

**Response:**
```json
{
  "success": true,
  "count": 3,
  "products": [...]
}
```

### 7. Get Products by Category

**GET** `/products/category/:category`

**Access:** Public

**Example:**
```
GET /products/category/Oils & Spices
```

---

## 🛍️ Order Endpoints

### 1. Create Order

**POST** `/orders`

**Access:** Private (Buyer)

**Request Body:**
```json
{
  "items": [
    {
      "productId": "product_id_1",
      "productName": "Organic Rice",
      "quantity": 15,
      "pricePerUnit": 200,
      "total": 3000
    }
  ],
  "totalAmount": 3000,
  "shippingAddress": "123 Main St, Colombo",
  "paymentMethod": "Cash on Delivery",
  "notes": "Please deliver in the morning"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "...",
    "orderNumber": "ORD-ABC123",
    "status": "pending",
    ...
  },
  "message": "Order created successfully"
}
```

### 2. Get Single Order

**GET** `/orders/:id`

**Access:** Private (Owner/Seller/Admin)

### 3. Get My Orders (Buyer)

**GET** `/orders/buyer/my-orders`

**Access:** Private (Buyer)

**Response:**
```json
{
  "success": true,
  "count": 5,
  "orders": [...]
}
```

### 4. Get My Orders (Seller)

**GET** `/orders/seller/my-orders`

**Access:** Private (Seller)

Returns only orders containing the seller's products.

### 5. Update Order Status

**PUT** `/orders/:id/status`

**Access:** Private (Seller/Admin)

**Request Body:**
```json
{
  "status": "processing"
}
```

**Valid Status Values:**
- `pending`
- `processing`
- `shipped`
- `delivered`
- `cancelled`

### 6. Cancel Order

**PUT** `/orders/:id/cancel`

**Access:** Private (Buyer)

Only pending orders can be cancelled. Stock will be restored.

---

## 👨‍💼 Seller Endpoints

### 1. Get All Sellers

**GET** `/sellers`

**Access:** Public

**Response:**
```json
{
  "success": true,
  "count": 3,
  "sellers": [
    {
      "id": "...",
      "name": "Ranjith Silva",
      "email": "ranjith@gamisaviya.lk",
      "location": "Anuradhapura",
      "story": "...",
      "products": 12,
      "rating": 4.8
    }
  ]
}
```

### 2. Get Seller Profile

**GET** `/sellers/:id`

**Access:** Public

**Response:**
```json
{
  "success": true,
  "seller": {
    "id": "...",
    "name": "...",
    "products": [
      // Array of seller's products
    ]
  }
}
```

### 3. Get Seller Dashboard Stats

**GET** `/sellers/dashboard/stats`

**Access:** Private (Seller)

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalProducts": 12,
    "approvedProducts": 10,
    "pendingProducts": 2,
    "totalOrders": 45,
    "pendingOrders": 3,
    "totalRevenue": 125000
  }
}
```

---

## 👑 Admin Endpoints

All admin endpoints require admin role authentication.

### 1. Get All Users

**GET** `/admin/users`

**Access:** Admin

**Query Parameters:**
- `role` - Filter by role (buyer/seller/admin)
- `approved` - Filter by approval status (true/false)

**Example:**
```
GET /admin/users?role=seller&approved=false
```

### 2. Get Pending Sellers

**GET** `/admin/pending-sellers`

**Access:** Admin

**Response:**
```json
{
  "success": true,
  "count": 5,
  "sellers": [...]
}
```

### 3. Approve/Reject Seller

**PUT** `/admin/sellers/:id/approve`

**Access:** Admin

**Request Body:**
```json
{
  "approved": true
}
```

### 4. Get All Products

**GET** `/admin/products`

**Access:** Admin

**Query Parameters:**
- `approved` - Filter by approval (true/false)
- `featured` - Filter featured (true/false)

### 5. Approve/Feature Product

**PUT** `/admin/products/:id/approve`

**Access:** Admin

**Request Body:**
```json
{
  "approved": true,
  "featured": true
}
```

### 6. Delete User

**DELETE** `/admin/users/:id`

**Access:** Admin

Cannot delete your own admin account.

### 7. Get All Orders

**GET** `/admin/orders`

**Access:** Admin

**Query Parameters:**
- `status` - Filter by status

### 8. Get Platform Statistics

**GET** `/admin/stats`

**Access:** Admin

**Response:**
```json
{
  "success": true,
  "stats": {
    "users": {
      "total": 150,
      "buyers": 120,
      "sellers": 25,
      "pendingSellers": 5
    },
    "products": {
      "total": 85,
      "approved": 75,
      "pending": 10
    },
    "orders": {
      "total": 320,
      "pending": 15,
      "completed": 280
    },
    "revenue": {
      "total": 2500000,
      "currency": "LKR"
    }
  }
}
```

---

## 🔄 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🧪 Testing Examples

### Using cURL (PowerShell)

**Login:**
```powershell
curl -X POST http://localhost:5000/api/auth/signin `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@gamisaviya.lk","password":"admin123"}'
```

**Get Products:**
```powershell
curl http://localhost:5000/api/products
```

**Create Product (with auth):**
```powershell
$token = "your-jwt-token"
curl -X POST http://localhost:5000/api/products `
  -H "Authorization: Bearer $token" `
  -H "Content-Type: application/json" `
  -d '{"name":"Test Product","description":"...","category":"Grains & Rice","retailPrice":500,"wholesalePrice":400,"wholesaleThreshold":10,"stock":100}'
```

### Using JavaScript (Fetch API)

```javascript
// Login
const loginResponse = await fetch('http://localhost:5000/api/auth/signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@gamisaviya.lk',
    password: 'admin123'
  })
});
const { accessToken } = await loginResponse.json();

// Get products with auth
const productsResponse = await fetch('http://localhost:5000/api/products', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
const products = await productsResponse.json();
```

---

## 📚 Additional Resources

- **MongoDB Docs:** https://docs.mongodb.com/
- **Express Docs:** https://expressjs.com/
- **JWT:** https://jwt.io/
- **Mongoose:** https://mongoosejs.com/

---

**Last Updated:** January 2026
