# GamiSaviya.lk - E-Commerce Platform Prototype

A high-fidelity, interactive prototype for a responsive e-commerce platform connecting Sri Lankan rural sellers with buyers.

## 🌟 Key Features

### ✅ Complete User Flows
- **Public Pages**: Home, Products, Product Details, About, Contact, Become a Seller
- **Buyer Flow**: Dashboard, Shopping Cart, Checkout, Order Management
- **Seller Flow**: Dashboard, Product Management, Order Management
- **Admin Flow**: Dashboard, Approvals, User Management

### 💰 Dual Pricing System (Core Feature)
The prototype demonstrates an **automatic dual pricing system**:
- **Retail Price**: Applied for quantities below threshold
- **Wholesale Price**: Automatically activated when quantity reaches seller-defined threshold
- **Dynamic Calculation**: Prices update instantly as quantity changes
- **Visual Indicators**: Clear display of active pricing mode and savings
- **No Manual Toggle**: System automatically determines pricing based on quantity

#### Dual Pricing Demonstration Pages:
1. **Product Details Page** - Quantity selector with live price updates
2. **Shopping Cart** - Shows wholesale pricing for eligible items with savings
3. **Checkout Page** - Final price calculation with wholesale discounts

### 🌍 Multilingual Support
- Toggle between English and Sinhala (සිංහල)
- Persistent language preference
- Translated product names and descriptions

### 🎨 Design Features
- Earth-tone color palette (amber, orange, green) inspired by Sri Lankan villages
- Responsive design (desktop-first, mobile-adaptable)
- Accessible contrast and readable fonts
- Professional, modern marketplace aesthetic
- Consistent component system

## 🚀 Quick Start Guide

### Login Options
The prototype includes **demo authentication** - use any email/password combination to log in as:
- **Buyer** - Access shopping cart, checkout, order management
- **Seller** - Manage products, view orders, seller dashboard
- **Admin** - Platform management, approvals, analytics

### Demo User Flows

#### 🛍️ Buyer Experience
1. Browse products on homepage or products page
2. View product details and see dual pricing in action
3. Add items to cart (quantity determines pricing)
4. Proceed to checkout and place order
5. View order history and status

#### 🏪 Seller Experience
1. Login as seller
2. View seller dashboard with sales overview
3. Manage product listings
4. Process customer orders
5. Update seller profile and story

#### 👨‍💼 Admin Experience
1. Login as admin
2. View platform analytics
3. Approve/reject seller applications
4. Manage products and users
5. Monitor orders and revenue

## 📱 Key Pages

### Public Pages
- **Home Page** - Hero, categories, featured products, meet the maker
- **Product Listing** - Search, filters, sorting, category navigation
- **Product Details** - Image gallery, pricing calculator, seller info
- **About Us** - Mission, values, community impact
- **Contact** - Contact form and information
- **Become a Seller** - Application form with benefits

### Buyer Dashboard
- Order summary and cart status
- Quick actions (shopping, addresses, tracking)
- Recent orders with status
- Profile management

### Seller Dashboard
- Revenue and sales analytics
- Product management quick access
- Order processing interface
- Seller profile and story

### Admin Dashboard
- Platform statistics overview
- Pending approvals indicator
- Recent activity monitoring
- User and product management

## 🎯 Dual Pricing System Logic

### How It Works
```
IF quantity >= wholesaleThreshold:
    price = wholesalePrice
    savings = (retailPrice - wholesalePrice) × quantity
ELSE:
    price = retailPrice
    savings = 0

totalPrice = price × quantity
```

### Example
- Product: Organic Rice
- Retail Price: LKR 250/kg
- Wholesale Price: LKR 200/kg
- Threshold: 10 kg

**Scenario 1**: Buy 5 kg
- Price: LKR 250/kg
- Total: LKR 1,250

**Scenario 2**: Buy 15 kg
- Price: LKR 200/kg (wholesale activated)
- Total: LKR 3,000
- Savings: LKR 750

## 🔧 Technical Stack
- **React** with TypeScript
- **React Router** for navigation
- **Context API** for state management
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Local Storage** for persistence

## 📊 Mock Data
The prototype includes realistic mock data:
- 6 sample products across various categories
- 3 featured sellers with stories
- Sample orders with different statuses
- Sri Lankan locations and context

## 🎓 University Project Features
- Matches SRS and Architectural Design requirements
- Demonstrates business logic implementation
- Shows system behavior and user interactions
- Ready for lecturer evaluation and viva presentation
- Professional, industry-level quality

## 🌐 Responsive Design
- Desktop-optimized (primary view)
- Tablet-friendly layouts
- Mobile-responsive navigation and components
- Touch-friendly interactive elements

## 💡 Design Philosophy
- **Accessibility**: High contrast, readable fonts, clear CTAs
- **User-Friendly**: Designed for low digital literacy users
- **Cultural Context**: Sri Lankan aesthetic and multilingual support
- **Professional**: Modern e-commerce standards with local flavor

## 🔐 Authentication
Mock authentication system:
- Role-based access control (Buyer/Seller/Admin)
- Protected routes for authenticated users
- Persistent login state
- Easy role switching for demo purposes

---

**GamiSaviya.lk** - Empowering rural Sri Lankan sellers through digital commerce 🇱🇰
