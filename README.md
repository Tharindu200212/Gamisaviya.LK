# 🌟 GamiSaviya.lk - Full-Stack E-commerce Platform

A complete e-commerce platform connecting rural Sri Lankan sellers with buyers, featuring bilingual support (English/Sinhala) and dual pricing (retail/wholesale).

## 🏗️ Project Structure

```
├── client/          # React + TypeScript frontend (Vite)
├── server/          # Node.js + Express + MongoDB backend
├── package.json     # Root package for running both together
└── README.md        # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Option 1: Run Everything Together (Recommended)

```powershell
# Install all dependencies (client + server)
npm run install-all

# Start MongoDB (if using local)
net start MongoDB

# Seed the database with sample data
npm run seed

# Run both client and server concurrently
npm run dev
```

- **Backend:** http://localhost:5000
- **Frontend:** http://localhost:5173

### Option 2: Run Separately

**Terminal 1 - Backend:**
```powershell
cd server
npm install
npm run seed
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd client
npm install
npm run dev
```

## 🔑 Test Credentials

After seeding the database:

**Admin:**
- Email: `admin@gamisaviya.lk`
- Password: `admin123`

**Sellers:**
- Email: `ranjith@gamisaviya.lk` | Password: `seller123`
- Email: `kumari@gamisaviya.lk` | Password: `seller123`

**Buyer:**
- Email: `buyer@gamisaviya.lk` | Password: `buyer123`

## ✨ Features

### Frontend (React + TypeScript)
- ✅ Responsive UI with Tailwind CSS
- ✅ Bilingual support (English/Sinhala)
- ✅ Product browsing and search
- ✅ Shopping cart with dual pricing
- ✅ Order management
- ✅ User authentication
- ✅ Role-based dashboards (Buyer/Seller/Admin)

### Backend (Node.js + Express + MongoDB)
- ✅ RESTful API (30+ endpoints)
- ✅ JWT authentication
- ✅ Role-based authorization
- ✅ Product management
- ✅ Order processing
- ✅ Seller approval workflow
- ✅ Admin dashboard
- ✅ Dual pricing system

## 🛠️ Available Scripts

### Root Level

```powershell
npm run install-all   # Install all dependencies
npm run dev          # Run both client and server
npm run server       # Run only backend
npm run client       # Run only frontend
npm run seed         # Seed database
npm run build        # Build frontend for production
```

## 📚 Documentation

- **[BACKEND_INSTRUCTIONS.md](BACKEND_INSTRUCTIONS.md)** - Backend setup guide
- **[server/API_DOCS.md](server/API_DOCS.md)** - Complete API reference
- **[server/README.md](server/README.md)** - Backend documentation

## 🔧 Configuration

### Client Environment (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### Server Environment (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gamisaviya
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:5173
```

---

**Made with ❤️ for Sri Lankan rural sellers** 🌟
