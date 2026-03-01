# GamiSaviya.lk - Interactive Prototype Demo Guide

## 🎯 Project Overview
**GamiSaviya.lk** is a high-fidelity, fully interactive e-commerce platform prototype connecting Sri Lankan rural sellers with buyers worldwide, featuring an innovative **Dual Pricing System**.

---

## 🔑 Core Feature: DUAL PRICING SYSTEM

### How It Works
The system **automatically** switches between retail and wholesale pricing based on quantity:
- **Retail Price**: Applied when quantity is BELOW the wholesale threshold
- **Wholesale Price**: Automatically activated when quantity REACHES or EXCEEDS the threshold
- **No Manual Selection**: The system decides pricing based on quantity alone

### Where to See It in Action

#### 1. **Product Detail Page** (`/product/:id`)
- Use the quantity selector
- Watch the price update in real-time
- Notice the "Wholesale price applied!" indicator
- See pricing breakdown with savings calculation

#### 2. **Add Product Page** (`/seller/products/add`)
- Sellers set BOTH prices
- Define wholesale threshold (minimum quantity)
- See live pricing preview
- Validation ensures wholesale < retail

#### 3. **Shopping Cart** (`/cart`)
- View current pricing for each item
- See wholesale indicator badge
- Adjust quantities and watch prices update
- Total automatically recalculates

#### 4. **Checkout Page** (`/checkout`)
- Final pricing confirmation
- Clear indication of wholesale savings
- Order summary with pricing breakdown

---

## 🚀 Quick Start Demo Flow

### Public User Flow (No Login Required)
1. **Home Page** → Browse featured products and sellers
2. **Products Page** → Filter by category, search, price range
3. **Product Detail** → Adjust quantity to see dual pricing in action
4. Click "Add to Cart" → Redirects to login if not authenticated

### Buyer Demo Flow
**Login Credentials:**
- Email: `any email`
- Password: `any password`
- Role: **Buyer**

**Demo Steps:**
1. Browse products
2. Select a product (e.g., "Handwoven Basket")
3. Start with quantity 1 (Retail: LKR 1,500)
4. Increase to 10+ items (Wholesale: LKR 1,200) ⚡
5. Add to cart
6. Go to cart → See wholesale pricing applied
7. Proceed to checkout → Complete order
8. View order confirmation with pricing details

### Seller Demo Flow
**Login Credentials:**
- Email: `any email`
- Password: `any password`
- Role: **Seller**

**Demo Steps:**
1. View seller dashboard with sales overview
2. Click "Add Product"
3. Fill product details
4. **Set Dual Pricing:**
   - Retail Price: LKR 2,000
   - Wholesale Price: LKR 1,700
   - Wholesale Threshold: 5 items
5. See live pricing preview
6. Save product
7. View in products list

### Admin Demo Flow
**Login Credentials:**
- Email: `any email`
- Password: `any password`
- Role: **Admin**

**Demo Steps:**
1. View system dashboard
2. Navigate to "Approvals"
3. Review product submissions
4. See dual pricing details for each product
5. Approve/reject products

---

## 📱 All Available Pages

### Public Pages
- ✅ Home Page (`/`)
- ✅ Products Listing (`/products`)
- ✅ Product Detail (`/product/:id`) **← DUAL PRICING DEMO**
- ✅ Search Results (integrated in Products)
- ✅ About Us (`/about`)
- ✅ Contact Us (`/contact`)
- ✅ Become a Seller (`/become-seller`)
- ✅ Login (`/login`)
- ✅ Register (`/register`)

### Buyer Pages (Login as Buyer)
- ✅ Buyer Dashboard (`/buyer/dashboard`)
- ✅ Shopping Cart (`/cart`) **← DUAL PRICING DEMO**
- ✅ Checkout (`/checkout`) **← DUAL PRICING DEMO**
- ✅ Order Confirmation (`/order-confirmation`)
- ✅ My Orders (`/buyer/orders`)
- ✅ Buyer Profile (`/buyer/profile`)
- ✅ Address Management (integrated in profile)

### Seller Pages (Login as Seller)
- ✅ Seller Dashboard (`/seller/dashboard`)
- ✅ Add Product (`/seller/products/add`) **← SET DUAL PRICING**
- ✅ Edit Product (`/seller/products/edit/:id`)
- ✅ My Products (`/seller/products`)
- ✅ Order Management (dashboard view)
- ✅ Seller Profile (dashboard view)

### Admin Pages (Login as Admin)
- ✅ Admin Dashboard (`/admin/dashboard`)
- ✅ Seller Approval (`/admin/approvals`) **← REVIEW DUAL PRICING**
- ✅ Product Management (dashboard view)
- ✅ User Management (dashboard view)

---

## 🎨 Key Features Demonstrated

### 1. Responsive Design
- Desktop-first, mobile-adaptable
- Grid layouts that adjust to screen size
- Mobile menu for navigation

### 2. Multilingual Support
- Language toggle (Sinhala | English)
- Click globe icon in header
- Product names and descriptions translated

### 3. Role-Based Access
- Different dashboards for Buyer/Seller/Admin
- Protected routes with authentication
- Role-specific navigation

### 4. Interactive Forms
- Real-time validation
- Form state management
- Success/error messages

### 5. Cart Management
- Add/remove items
- Update quantities
- Real-time total calculation
- Persistent cart state

### 6. User Authentication
- Mock login/register system
- Role selection
- Session management
- Protected routes

---

## 💡 Dual Pricing Examples

### Example 1: Handwoven Basket
- **Retail**: LKR 1,500 (qty 1-9)
- **Wholesale**: LKR 1,200 (qty 10+)
- **Threshold**: 10 items
- **Savings**: LKR 300 per item

### Example 2: Organic Rice (5kg)
- **Retail**: LKR 850 (qty 1-19)
- **Wholesale**: LKR 700 (qty 20+)
- **Threshold**: 20 items
- **Savings**: LKR 150 per item

### Example 3: Clay Pottery Set
- **Retail**: LKR 3,500 (qty 1-4)
- **Wholesale**: LKR 3,000 (qty 5+)
- **Threshold**: 5 items
- **Savings**: LKR 500 per item

---

## 🎓 For Viva Presentation

### Key Points to Highlight:

1. **Automatic Pricing Logic**
   - No manual toggle or selection
   - System intelligently applies correct price
   - Real-time calculation

2. **Seller Control**
   - Sellers define both prices
   - Set custom thresholds
   - Preview pricing before saving

3. **Buyer Transparency**
   - Clear pricing breakdown
   - Savings highlighted
   - Wholesale indicator badges

4. **Technical Implementation**
   - React Context for cart management
   - Real-time state updates
   - Responsive design with Tailwind CSS
   - Component-based architecture

5. **Business Logic**
   - Encourages bulk purchases
   - Benefits both buyers (savings) and sellers (volume)
   - Transparent pricing model

### Demo Flow for Presentation:
1. Show home page and features
2. Navigate to product detail
3. **Demonstrate dual pricing** by changing quantity
4. Add to cart and show cart page
5. Proceed to checkout
6. Switch to seller view and show product creation
7. Switch to admin view and show approval process

---

## 🔧 Technical Stack
- **Frontend**: React 18+ with TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v4
- **State Management**: React Context API
- **Icons**: Lucide React
- **Images**: Unsplash API

---

## 📊 Mock Data
The prototype uses realistic mock data including:
- 6 products across multiple categories
- 3 featured sellers with stories
- 2 sample orders showing pricing types
- Multiple categories and filters

---

## ✨ Interactive Behaviors
- Hover effects on cards and buttons
- Smooth transitions and animations
- Loading states
- Success/error notifications
- Modal dialogs
- Dropdown menus
- Form validation
- Real-time price calculations

---

## 🎯 Success Criteria Met
✅ High-fidelity UI design
✅ Complete user flows for all roles
✅ Interactive dual pricing system
✅ Responsive layout
✅ Multilingual support
✅ Role-based access control
✅ Form validation and error handling
✅ Professional Sri Lankan marketplace aesthetic
✅ Accessibility considerations
✅ Exam-ready demonstration

---

**Note**: This is a prototype for demonstration and evaluation purposes. In production, it would be connected to a real backend with database, payment gateway, and authentication system.
