# 📊 GamiSaviya.lk Database Access Guide

## Overview
Your GamiSaviya.lk application uses a **Supabase** backend with a **PostgreSQL** database. The database is accessed through a Key-Value (KV) store system for rapid prototyping.

---

## 🔍 How to View Your Database

### Method 1: Using the Database Viewer (Recommended)
The easiest way to view your database is through the built-in **Database Viewer** page:

1. **Login as Admin:**
   - Email: `admin@gamisaviya.lk`
   - Password: `admin123`

2. **Navigate to Database Viewer:**
   - Go to Admin Dashboard
   - Click on the **"Database Viewer"** card (purple gradient card with database icon)
   - OR directly visit: `/admin/database-viewer`

3. **Features Available:**
   - **Overview Tab:** See summary statistics and recent data
   - **Users Tab:** View all registered users (buyers, sellers, admins)
   - **Products Tab:** View all products with pricing, stock, and approval status
   - **Orders Tab:** View all orders with details
   - **Sellers Tab:** View all sellers and pending approvals
   - **Search:** Search across all records in real-time
   - **Refresh:** Reload data from the database

### Method 2: Using Supabase Dashboard (Direct Database Access)

1. **Access Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard
   - Login to your Supabase account

2. **Find Your Project:**
   - Your project ID can be found in `/utils/supabase/info.tsx`
   - Select your GamiSaviya.lk project

3. **View the Database:**
   - Click **"Table Editor"** in the left sidebar
   - Select the `kv_store_9b2fc9a2` table
   - This is where all your data is stored in key-value format

4. **Query the Database:**
   - Click **"SQL Editor"** in the left sidebar
   - Run SQL queries directly on your database
   - Example queries are provided below

---

## 🗄️ Database Structure

### Key-Value Store Schema
All data is stored in a single table called `kv_store_9b2fc9a2` with the following structure:

```
key (TEXT) - Primary Key
value (JSONB) - JSON data
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Key Naming Conventions

| Key Pattern | Description | Example |
|------------|-------------|---------|
| `users:{userId}` | User profiles | `users:abc123` |
| `sellers:{sellerId}` | Seller profiles | `sellers:abc123` |
| `products:{productId}` | Product listings | `products:prod_1234` |
| `orders:{orderId}` | Order details | `orders:ORD1234567890` |
| `products_by_seller:{sellerId}` | List of product IDs for a seller | `products_by_seller:abc123` |
| `orders_by_buyer:{buyerId}` | List of order IDs for a buyer | `orders_by_buyer:abc123` |
| `orders_by_seller:{sellerId}` | List of order IDs for a seller | `orders_by_seller:abc123` |
| `pending_sellers` | Array of pending seller IDs | `pending_sellers` |
| `db_seeded` | Database initialization flag | `db_seeded` |

---

## 📝 Sample SQL Queries

### View All Users
```sql
SELECT * FROM kv_store_9b2fc9a2 
WHERE key LIKE 'users:%' 
ORDER BY created_at DESC;
```

### View All Products
```sql
SELECT * FROM kv_store_9b2fc9a2 
WHERE key LIKE 'products:%' 
ORDER BY created_at DESC;
```

### View All Orders
```sql
SELECT * FROM kv_store_9b2fc9a2 
WHERE key LIKE 'orders:%' 
ORDER BY created_at DESC;
```

### View Pending Sellers
```sql
SELECT * FROM kv_store_9b2fc9a2 
WHERE key = 'pending_sellers';
```

### Count Records by Type
```sql
SELECT 
  CASE 
    WHEN key LIKE 'users:%' THEN 'Users'
    WHEN key LIKE 'products:%' THEN 'Products'
    WHEN key LIKE 'orders:%' THEN 'Orders'
    WHEN key LIKE 'sellers:%' THEN 'Sellers'
    ELSE 'Other'
  END as record_type,
  COUNT(*) as count
FROM kv_store_9b2fc9a2
GROUP BY record_type;
```

### View Approved Products Only
```sql
SELECT key, value 
FROM kv_store_9b2fc9a2 
WHERE key LIKE 'products:%' 
AND value->>'approved' = 'true';
```

### Search Products by Name
```sql
SELECT key, value 
FROM kv_store_9b2fc9a2 
WHERE key LIKE 'products:%' 
AND value->>'name' ILIKE '%rice%';
```

---

## 🔌 API Endpoints for Database Access

### Authentication Endpoints
- `POST /make-server-9b2fc9a2/auth/signup` - Create new user
- `POST /make-server-9b2fc9a2/auth/signin` - Sign in
- `GET /make-server-9b2fc9a2/auth/session` - Get current session
- `POST /make-server-9b2fc9a2/auth/signout` - Sign out

### Product Endpoints
- `GET /make-server-9b2fc9a2/products` - Get all approved products
- `GET /make-server-9b2fc9a2/products/:id` - Get single product
- `POST /make-server-9b2fc9a2/products` - Create product (auth required)
- `PUT /make-server-9b2fc9a2/products/:id` - Update product (auth required)
- `DELETE /make-server-9b2fc9a2/products/:id` - Delete product (auth required)

### Order Endpoints
- `POST /make-server-9b2fc9a2/orders` - Create order (auth required)
- `GET /make-server-9b2fc9a2/orders/:id` - Get order details (auth required)
- `GET /make-server-9b2fc9a2/buyer/orders` - Get buyer's orders (auth required)
- `GET /make-server-9b2fc9a2/seller/orders` - Get seller's orders (auth required)
- `PUT /make-server-9b2fc9a2/orders/:id/status` - Update order status (auth required)

### Admin Endpoints (Require Admin Role)
- `GET /make-server-9b2fc9a2/admin/users` - Get all users
- `GET /make-server-9b2fc9a2/admin/products` - Get all products (including unapproved)
- `GET /make-server-9b2fc9a2/admin/orders` - Get all orders
- `GET /make-server-9b2fc9a2/admin/pending-sellers` - Get pending sellers
- `PUT /make-server-9b2fc9a2/admin/sellers/:id/approve` - Approve/reject seller
- `PUT /make-server-9b2fc9a2/admin/products/:id/approve` - Approve/reject product

### Seed Endpoint
- `POST /make-server-9b2fc9a2/seed` - Initialize database with sample data

---

## 🧪 Test Credentials

The database is automatically seeded with test accounts on first run:

### Admin Account
- **Email:** `admin@gamisaviya.lk`
- **Password:** `admin123`
- **Role:** Admin
- **Access:** Full system access

### Seller Accounts

**Seller 1:**
- **Email:** `ranjith@gamisaviya.lk`
- **Password:** `seller123`
- **Name:** Ranjith Silva
- **Location:** Anuradhapura

**Seller 2:**
- **Email:** `kumari@gamisaviya.lk`
- **Password:** `seller123`
- **Name:** Kumari Perera
- **Location:** Kurunegala

---

## 🛠️ Programmatic Access (For Developers)

### Using the KV Store Helper
```typescript
import * as kv from './supabase/functions/server/kv_store';

// Get a single value
const user = await kv.get('users:userId123');

// Set a value
await kv.set('users:userId123', { name: 'John', email: 'john@example.com' });

// Delete a value
await kv.del('users:userId123');

// Get multiple values
const users = await kv.mget(['users:id1', 'users:id2']);

// Set multiple values
await kv.mset({
  'users:id1': { name: 'User 1' },
  'users:id2': { name: 'User 2' }
});

// Delete multiple values
await kv.mdel(['users:id1', 'users:id2']);

// Get all keys with a prefix
const allProducts = await kv.getByPrefix('products:');
```

### Using the API Helper (Frontend)
```typescript
import { adminAPI } from './utils/api';

// Get all users (admin only)
const { users } = await adminAPI.getAllUsers();

// Get all products
const { products } = await adminAPI.getAllProducts();

// Get all orders
const { orders } = await adminAPI.getAllOrders();

// Get pending sellers
const { sellers } = await adminAPI.getPendingSellers();
```

---

## 📊 Database Statistics

### Current Seed Data Includes:
- **1 Admin Account** - Full system access
- **2 Seller Accounts** - Pre-approved sellers with profiles
- **~10 Sample Products** - Various categories (rice, coconut oil, spices, etc.)
- **Dual Pricing** - All products have retail and wholesale pricing configured
- **Multilingual Data** - Products include both English and Sinhala names/descriptions

### Data Distribution:
- Users: Admin + Sellers + Buyers (created through registration)
- Products: Pre-seeded + User-created products
- Orders: Created when buyers place orders
- Sellers: Pre-seeded + New seller registrations (pending approval)

---

## 🔐 Security Notes

### Protected Endpoints
- All endpoints with `/buyer/`, `/seller/`, or `/admin/` require authentication
- The `Authorization` header must include a valid Supabase access token
- Admin endpoints check for `role === 'admin'`
- Seller endpoints verify seller ownership or admin role

### Environment Variables (Already Configured)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Public anonymous key (frontend use)
- `SUPABASE_SERVICE_ROLE_KEY` - Server-side key (backend only)
- `SUPABASE_DB_URL` - Direct database connection string

⚠️ **IMPORTANT:** Never expose `SUPABASE_SERVICE_ROLE_KEY` to the frontend!

---

## 💡 Tips for Database Management

### Best Practices:
1. **Always use the Database Viewer** for quick inspections
2. **Test with sample credentials** before creating new test accounts
3. **Back up important data** before making bulk changes
4. **Use SQL queries** for complex filtering and analysis
5. **Monitor pending approvals** regularly in the admin dashboard

### Common Tasks:

**Reset Database:**
1. Clear the KV store table in Supabase
2. Clear localStorage: `localStorage.removeItem('gamisaviya_db_seeded')`
3. Refresh the app to re-seed

**Add Test Products:**
1. Login as a seller
2. Go to "Add Product" page
3. Fill in product details with dual pricing
4. Login as admin to approve the product

**Test Order Flow:**
1. Login as buyer (or register new buyer)
2. Add products to cart
3. Proceed to checkout
4. Complete order
5. View order in buyer dashboard and admin panel

---

## 📞 Troubleshooting

### Issue: Database Viewer shows empty data
**Solution:** 
- Make sure you're logged in as admin
- Check that the database has been seeded
- Click the Refresh button
- Check browser console for API errors

### Issue: Can't see new data
**Solution:**
- Click the Refresh button in Database Viewer
- Clear browser cache
- Check that data was successfully saved (check Network tab)

### Issue: Unauthorized errors
**Solution:**
- Make sure you're logged in
- Verify you have the correct role (admin, seller, buyer)
- Check that your session hasn't expired
- Try logging out and back in

---

## 🎯 Next Steps

1. **Explore the Database Viewer** - Login as admin and browse all tables
2. **Test CRUD Operations** - Create, update, and delete records
3. **Monitor Real-Time Data** - Watch how data changes as you use the app
4. **Customize Views** - Modify the Database Viewer to show additional fields
5. **Export Data** - Use SQL queries to export data for analysis

---

**Happy Data Exploration! 🚀**

For more information, check:
- `/supabase/functions/server/index.tsx` - All API endpoints
- `/utils/api.ts` - Frontend API helpers
- `/supabase/functions/server/kv_store.tsx` - KV store utilities
