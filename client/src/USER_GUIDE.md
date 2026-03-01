# GamiSaviya.lk - User Guide

## 🎯 How to Use This Prototype

This is a **fully interactive high-fidelity prototype** demonstrating all core features of the GamiSaviya.lk e-commerce platform.

---

## 🔐 Getting Started

### 1. Login / Register
- Click **"Login"** in the top navigation
- Select your role: **Buyer**, **Seller**, or **Admin**
- Enter any email and password (demo authentication)
- You'll be redirected to the appropriate dashboard

**Quick Tip**: You can use different browser tabs to test different user roles simultaneously!

---

## 🛍️ BUYER EXPERIENCE

### Browsing Products
1. Visit the **Home Page** to see featured products and categories
2. Click **"Products"** to browse all available items
3. Use **search**, **filters**, and **sorting** to find products
4. Click any product card to view detailed information

### Understanding Dual Pricing (KEY FEATURE)
On the **Product Details Page**:
- You'll see two price boxes: **Retail** and **Wholesale**
- Use the **quantity selector** (- / + buttons)
- Watch the prices change automatically:
  - **1-9 items** → Retail price applies (amber highlight)
  - **10+ items** → Wholesale price applies (green highlight)
- See your **total savings** displayed in real-time
- Notice the "Wholesale price applied" indicator

### Adding to Cart
1. Select your desired quantity
2. Click **"Add to Cart"** (you'll see a success message)
3. Or click **"Buy Now"** to go directly to cart
4. **Cart icon** in navigation shows item count

### Shopping Cart
- View all items with their pricing
- Adjust quantities (prices update automatically)
- See wholesale pricing badges for eligible items
- View total savings from wholesale purchases
- Click **"Checkout"** when ready

### Checkout Process
1. Fill in shipping information
2. Select payment method (COD or Bank Transfer)
3. Review order summary with final pricing
4. Click **"Place Order"**
5. See order confirmation with order number

### Managing Orders
- Go to **Buyer Dashboard** → **"My Orders"**
- View order history with status
- Click any order for details
- Track delivery status

---

## 🏪 SELLER EXPERIENCE

### Seller Dashboard
- View **revenue**, **products**, and **orders** overview
- Access quick actions for common tasks
- Monitor recent activity

### Adding Products (Dual Pricing Setup)
1. Click **"Add New Product"** from dashboard
2. Fill in product details (English & Sinhala)
3. **Important**: Set up dual pricing:
   - **Retail Price**: Regular price per unit
   - **Wholesale Price**: Discounted bulk price
   - **Wholesale Threshold**: Minimum quantity for wholesale (e.g., 10)
4. Add stock quantity
5. Submit for admin approval

**Example Pricing Setup**:
- Retail: LKR 250
- Wholesale: LKR 200
- Threshold: 10 units
- Result: Buyers pay LKR 250 for 1-9 items, LKR 200 for 10+ items

### Managing Products
- View all your listed products
- Edit product details and pricing
- Update stock levels
- Monitor approval status

### Processing Orders
- View incoming orders
- Update order status
- Communicate with buyers
- Track fulfillment

---

## 👨‍💼 ADMIN EXPERIENCE

### Admin Dashboard
- View platform-wide statistics
- Monitor **total sellers**, **products**, **orders**, **revenue**
- See pending approvals count
- Access management tools

### Seller Approvals (KEY WORKFLOW)
1. Navigate to **"Seller Approvals"**
2. See pending applications (orange badge)
3. Click a seller to view:
   - Contact information
   - Seller story
   - Business details
4. Click **"Approve Seller"** or **"Reject"**
5. Approved sellers can start listing products

### Product Approvals
- Review new product submissions
- Check pricing, descriptions, images
- Approve or reject listings
- Ensure quality standards

### Platform Management
- Manage all users (buyers, sellers)
- Oversee all products
- Monitor orders across platform
- View analytics and reports

---

## 🌍 MULTILINGUAL FEATURE

### Language Toggle
- Click the **globe icon** (🌐) in navigation
- Toggle between **English** and **Sinhala (සිංහල)**
- All UI elements translate
- Product names/descriptions show in selected language
- Preference is saved automatically

---

## 💡 KEY FEATURES TO DEMONSTRATE

### 1. Dual Pricing System ⭐
**Where to see it**:
- Product Details Page (quantity selector)
- Shopping Cart (wholesale badges)
- Checkout (final calculations)

**What to show**:
1. Add 5 units → Retail price
2. Change to 15 units → Wholesale price activates
3. See green indicator and savings amount
4. Go to cart → See wholesale badge
5. Complete checkout → Total reflects wholesale pricing

### 2. Role-Based Access
**Demo flow**:
1. Login as **Buyer** → See cart, shopping features
2. Logout → Login as **Seller** → See product management
3. Logout → Login as **Admin** → See approvals, analytics

### 3. Complete E-Commerce Flow
**End-to-end demo**:
1. Browse products → 
2. View details (dual pricing) → 
3. Add to cart → 
4. Checkout → 
5. Place order → 
6. Order confirmation → 
7. View in My Orders

### 4. Seller Application
**Demo workflow**:
1. Visit "Become a Seller" page
2. Fill application form
3. Submit → See confirmation
4. (As Admin) Review and approve
5. (As Seller) Login to dashboard

---

## 📱 Responsive Design

The prototype works on:
- **Desktop** (primary, optimized experience)
- **Tablet** (adapted layouts)
- **Mobile** (responsive navigation, touch-friendly)

Try resizing your browser to see responsive behavior!

---

## 🎓 For University Evaluation

### What to Highlight

#### 1. System Requirements (SRS) Compliance
✅ All user roles implemented  
✅ Complete user flows functional  
✅ Dual pricing system working  
✅ Multilingual support active  
✅ Order management operational  

#### 2. Business Logic Demonstration
✅ Automatic price calculation  
✅ Threshold-based wholesale pricing  
✅ Cart total updates dynamically  
✅ Order status workflow  
✅ Approval workflows  

#### 3. UI/UX Quality
✅ High-fidelity design  
✅ Consistent styling  
✅ Clear visual hierarchy  
✅ User-friendly interactions  
✅ Accessible interface  

#### 4. Technical Implementation
✅ React with TypeScript  
✅ Context API for state management  
✅ React Router for navigation  
✅ Responsive Tailwind CSS  
✅ Local storage persistence  

---

## 🐛 Troubleshooting

**Cart not showing items?**
- Make sure you're logged in as a Buyer
- Sellers and Admins don't have cart access

**Can't access seller/admin pages?**
- You need to be logged in with the correct role
- Use the role selector on login page

**Language not changing?**
- Click the globe icon (🌐) next to the cart
- Toggle shows EN/සිං

**Order not appearing?**
- Check "My Orders" in Buyer Dashboard
- Recent order shows in dashboard widget

---

## 💪 Best Practices for Demo

### For Viva/Presentation:

1. **Start with Overview**
   - Show homepage (hero, categories, featured)
   - Explain platform purpose

2. **Demonstrate Dual Pricing** (CRITICAL)
   - Open a product
   - Slowly change quantity from 5 → 15
   - Point out price changes
   - Highlight savings display

3. **Show Complete Flow**
   - Add to cart with wholesale quantity
   - Go through checkout
   - Show order confirmation

4. **Switch Roles**
   - Show seller adding product with dual pricing
   - Show admin approving seller

5. **Highlight Features**
   - Language toggle
   - Responsive design
   - Role-based access

---

## 📝 Notes

- **Mock Data**: The prototype uses sample data for demonstration
- **Authentication**: Simplified for demo (any email/password works)
- **Persistence**: Uses local storage (clears on browser cache clear)
- **API Calls**: Simulated (no real backend needed)

---

## ✨ Quick Demo Script (5 minutes)

1. **Homepage** (30s): Show design, categories, featured products
2. **Product Details** (90s): Demonstrate dual pricing with quantity changes
3. **Cart** (45s): Show wholesale badges and total calculations
4. **Checkout** (30s): Quick checkout flow
5. **Dashboards** (90s): Switch between Buyer → Seller → Admin dashboards
6. **Language** (15s): Toggle English ↔ Sinhala
7. **Q&A** (60s): Address questions

---

**Good luck with your presentation! 🎉**

For questions or issues, refer to the README.md file.
