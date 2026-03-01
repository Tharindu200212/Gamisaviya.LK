# GamiSaviya.lk - Backend Integration Guide

## Overview

GamiSaviya.lk now has a fully functional backend powered by Supabase, providing:

- **Authentication** - User signup/signin with role-based access control
- **Database Storage** - Products, orders, users, and seller data
- **API Routes** - RESTful API for all CRUD operations
- **Authorization** - Protected routes for buyers, sellers, and admins

## Architecture

```
Frontend (React) → API Client (/utils/api.ts) → Server (/supabase/functions/server/index.tsx) → KV Store Database
                                                         ↓
                                                  Supabase Auth
```

## Getting Started

### 1. Database Initialization

When you first load the application, the `DatabaseInitializer` component will automatically:

1. Check if the database has been seeded
2. If not, create sample data including:
   - Admin account
   - Test seller accounts
   - Sample products
   - Categories and featured items

3. Display test credentials for immediate login

### 2. Test Credentials

After initialization, you'll receive:

**Admin Account:**
- Email: `admin@gamisaviya.lk`
- Password: `admin123`

**Seller Accounts:**
- Email: `ranjith@gamisaviya.lk` / Password: `seller123`
- Email: `kumari@gamisaviya.lk` / Password: `seller123`

**Create New Buyer Account:**
- Use the "Register" page to create a buyer account
- Buyers are auto-approved and can shop immediately

## API Routes

### Authentication

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/auth/signup` | POST | Create new user account | No |
| `/auth/signin` | POST | Sign in user | No |
| `/auth/signout` | POST | Sign out user | Optional |
| `/auth/session` | GET | Get current user session | Yes |

### Products

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/products` | GET | Get all approved products | No |
| `/products/:id` | GET | Get single product | No |
| `/products` | POST | Create new product | Seller/Admin |
| `/products/:id` | PUT | Update product | Seller/Admin |
| `/products/:id` | DELETE | Delete product | Seller/Admin |
| `/seller/products` | GET | Get seller's products | Seller |

### Orders

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/orders` | POST | Create new order | Buyer |
| `/orders/:id` | GET | Get single order | Buyer/Seller/Admin |
| `/buyer/orders` | GET | Get buyer's orders | Buyer |
| `/seller/orders` | GET | Get seller's orders | Seller |
| `/orders/:id/status` | PUT | Update order status | Seller/Admin |

### Sellers

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/sellers` | GET | Get all approved sellers | No |
| `/sellers/:id` | GET | Get seller profile | No |

### Admin

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/admin/pending-sellers` | GET | Get pending seller approvals | Admin |
| `/admin/sellers/:id/approve` | PUT | Approve/reject seller | Admin |
| `/admin/products` | GET | Get all products | Admin |
| `/admin/products/:id/approve` | PUT | Approve/reject product | Admin |
| `/admin/orders` | GET | Get all orders | Admin |
| `/admin/users` | GET | Get all users | Admin |

## Database Schema (KV Store)

### Key Patterns

```typescript
// Users
users:{userId} → User object

// Products
products:{productId} → Product object
products_by_seller:{sellerId} → Array of product IDs

// Orders
orders:{orderId} → Order object
orders_by_buyer:{buyerId} → Array of order IDs
orders_by_seller:{sellerId} → Array of order IDs

// Sellers
sellers:{sellerId} → Seller object
pending_sellers → Array of pending seller IDs

// System
db_seeded → Boolean flag
```

## User Roles & Permissions

### Buyer
- ✅ Browse and search products
- ✅ Add to cart and checkout
- ✅ View order history
- ✅ Track order status
- ❌ Cannot create products
- ❌ Cannot access seller/admin dashboards

### Seller (Requires Admin Approval)
- ✅ All buyer permissions
- ✅ Create and manage products
- ✅ View and manage received orders
- ✅ Update order status
- ❌ Products require admin approval before going live
- ❌ Cannot access admin dashboard

### Admin
- ✅ All permissions
- ✅ Approve/reject sellers
- ✅ Approve/reject products
- ✅ Set featured products
- ✅ View all orders, users, products
- ✅ Full platform management

## Frontend Integration

### API Client Usage

```typescript
import { authAPI, productAPI, orderAPI, sellerAPI, adminAPI } from '../utils/api';

// Sign in
const response = await authAPI.signin(email, password);

// Get products
const { products } = await productAPI.getAll({ category: 'Grains & Rice' });

// Create order
const order = await orderAPI.create({
  items: [...],
  totalAmount: 5000,
  shippingAddress: '...',
  paymentMethod: 'Cash on Delivery'
});

// Admin: Approve seller
await adminAPI.approveSeller(sellerId, true);
```

### Custom Hooks

```typescript
import { useProducts, useProduct } from '../hooks/useProducts';

// In component
const { products, loading, error, refetch } = useProducts({ featured: true });
const { product, loading } = useProduct(productId);
```

### Auth Context

```typescript
import { useAuth } from '../contexts/AuthContext';

const { user, login, logout, register, isAuthenticated, loading } = useAuth();

// Login
await login(email, password);

// Register
const result = await register(email, password, name, 'buyer');

// Logout
await logout();
```

## Dual Pricing System

The dual pricing system is maintained in the backend:

```typescript
// Product schema includes:
{
  retailPrice: number;        // e.g., 250 LKR
  wholesalePrice: number;     // e.g., 200 LKR
  wholesaleThreshold: number; // e.g., 10 items
}

// Frontend calculates effective price:
const effectivePrice = quantity >= product.wholesaleThreshold 
  ? product.wholesalePrice 
  : product.retailPrice;
```

## Approval Workflow

### Seller Approval
1. User registers as seller via `/auth/signup` or "Become a Seller" page
2. Seller profile created with `approved: false`
3. Added to `pending_sellers` list
4. Admin reviews via Admin Dashboard → Seller Approvals
5. Admin approves/rejects seller
6. Approved sellers can create products

### Product Approval
1. Seller creates product via `/products` endpoint
2. Product created with `approved: false`
3. Appears in Admin Dashboard → Product Management
4. Admin reviews and approves/rejects
5. Admin can also mark as `featured`
6. Only approved products visible to public

## Security Notes

⚠️ **Important Security Considerations:**

1. **Environment Variables:**
   - `SUPABASE_SERVICE_ROLE_KEY` is only used in server code
   - Never expose service role key to frontend
   - Frontend uses `SUPABASE_ANON_KEY` for public operations

2. **Authentication:**
   - Access tokens stored in `localStorage` as `gamisaviya_token`
   - Tokens validated on every protected route
   - Expired tokens automatically cleared

3. **Authorization:**
   - Role-based access control on all protected routes
   - Server validates user permissions before operations
   - Sellers can only modify their own products
   - Admins have full access

4. **Data Validation:**
   - All inputs validated on both client and server
   - Error messages include context for debugging
   - Failed operations logged to console

## Testing the Backend

### Test User Flows

1. **Buyer Registration & Shopping:**
   ```
   Register → Browse Products → Add to Cart → Checkout → View Orders
   ```

2. **Seller Application & Product Creation:**
   ```
   Apply as Seller → Wait for Approval → Login → Create Product → Wait for Product Approval
   ```

3. **Admin Management:**
   ```
   Login as Admin → Approve Sellers → Approve Products → Mark as Featured → View All Orders
   ```

### API Testing

Test the health check:
```bash
GET /make-server-9b2fc9a2/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-07T..."
}
```

## Troubleshooting

### Database Not Seeding
- Clear localStorage: `localStorage.clear()`
- Refresh the page
- Check browser console for errors

### Authentication Errors
- Verify credentials are correct
- Check if seller account is approved
- Clear localStorage and try again

### Product Not Appearing
- Verify product is approved (Admin dashboard)
- Check if seller is approved
- Confirm product data is valid

### Order Creation Fails
- Ensure user is logged in as buyer
- Verify cart has items
- Check shipping address is provided

## Next Steps

To extend the backend:

1. **Add Image Upload:**
   - Implement Supabase Storage for product images
   - Create upload endpoint in server
   - Update product creation flow

2. **Add Search:**
   - Implement search endpoint
   - Add full-text search on product names/descriptions

3. **Add Reviews:**
   - Create reviews schema
   - Add review endpoints
   - Update product rating calculations

4. **Add Notifications:**
   - Implement notification system
   - Email integration for order updates
   - Seller approval notifications

5. **Add Analytics:**
   - Track product views
   - Seller performance metrics
   - Revenue tracking

## Support

For questions or issues:
1. Check browser console for error logs
2. Verify API responses in Network tab
3. Review server logs in Supabase dashboard
4. Check this documentation for common patterns
