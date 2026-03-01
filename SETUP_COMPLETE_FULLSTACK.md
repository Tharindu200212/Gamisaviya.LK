# 🚀 GamiSaviya.lk - Setup Complete!

## ✅ Frontend & Backend Organized

Your project is now organized with:
- **Client** folder (React frontend)
- **Server** folder (Node.js backend)
- Connected and ready to run!

## 📂 New Structure

```
GamiSaviya/
├── client/              # React + TypeScript frontend
│   ├── src/
│   ├── package.json
│   ├── .env             # Backend API URL configured
│   └── vite.config.ts
│
├── server/              # Node.js + Express + MongoDB backend
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── package.json
│   └── .env             # MongoDB & JWT configured
│
├── package.json         # Run both together
└── README.md
```

## ⚠️ MongoDB Required

You need MongoDB to run the backend. Choose one option:

### Option 1: MongoDB Atlas (Cloud - Recommended for Testing)

**Quick & Easy - No installation needed!**

1. Create free account: https://www.mongodb.com/cloud/atlas/register
2. Create a free cluster (M0 Sandbox)
3. Create database user with password
4. Get connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
5. Update `server/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gamisaviya?retryWrites=true&w=majority
   ```

### Option 2: Install MongoDB Locally

**Download & Install:**
- Windows: https://www.mongodb.com/try/download/community
- Or use Chocolatey: `choco install mongodb`

**Start MongoDB:**
```powershell
net start MongoDB
```

## 🎯 Start Your Application

### Step 1: Choose MongoDB Option (above)

### Step 2: Install Dependencies

```powershell
# Install both client and server dependencies
npm run install-all
```

### Step 3: Seed Database

```powershell
# Add sample data (users, products, orders)
npm run seed
```

You'll get test credentials:
- **Admin:** admin@gamisaviya.lk / admin123
- **Seller:** ranjith@gamisaviya.lk / seller123
- **Buyer:** buyer@gamisaviya.lk / buyer123

### Step 4: Run Both Client & Server

```powershell
# Run everything together!
npm run dev
```

This will start:
- ✅ Backend at http://localhost:5000
- ✅ Frontend at http://localhost:5173

### Alternative: Run Separately

**Terminal 1 - Backend:**
```powershell
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd client
npm run dev
```

## 🧪 Test the Application

1. **Open browser:** http://localhost:5173
2. **Click "Login"**
3. **Use test credentials:**
   - Admin: admin@gamisaviya.lk / admin123
4. **Browse products**
5. **Add to cart**
6. **Place order**

## ✨ What's Connected

- ✅ Frontend API calls point to `http://localhost:5000/api`
- ✅ Backend CORS allows `http://localhost:5173`
- ✅ JWT authentication configured
- ✅ All endpoints ready

## 🔧 Configuration Files

### Client (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### Server (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gamisaviya
JWT_SECRET=gamisaviya-super-secret-jwt-key-2026
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

## 📡 API Endpoints Working

Test backend directly:

```powershell
# Health check
curl http://localhost:5000/health

# Get products
curl http://localhost:5000/api/products

# Login
curl -X POST http://localhost:5000/api/auth/signin `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@gamisaviya.lk","password":"admin123"}'
```

## 🛠️ Available Commands

```powershell
# Root level
npm run install-all   # Install all dependencies
npm run dev          # Run both client & server
npm run server       # Run only backend
npm run client       # Run only frontend
npm run seed         # Seed database

# Client only (cd client)
npm run dev          # Start frontend dev server
npm run build        # Build for production

# Server only (cd server)
npm run dev          # Start backend with auto-reload
npm start           # Start production server
npm run seed        # Seed database
```

## 🐛 Troubleshooting

### MongoDB Connection Error

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Solution:**
- Use MongoDB Atlas (Option 1 above) - No installation needed!
- OR install MongoDB locally and start service: `net start MongoDB`

### Port Already in Use

**Backend (5000):**
- Change `PORT=5001` in `server/.env`

**Frontend (5173):**
- Vite will auto-assign next available port

### CORS Errors

Make sure `CLIENT_URL` in `server/.env` matches your frontend URL.

### Module Not Found

```powershell
npm run install-all
```

## 📚 Documentation

- **[README.md](README.md)** - Project overview
- **[server/API_DOCS.md](server/API_DOCS.md)** - Complete API documentation
- **[server/QUICKSTART.md](server/QUICKSTART.md)** - Backend setup guide
- **[BACKEND_INSTRUCTIONS.md](BACKEND_INSTRUCTIONS.md)** - Backend instructions

## 🎯 Quick Start Checklist

- [ ] Choose MongoDB option (Atlas or Local)
- [ ] If Atlas: Update `MONGODB_URI` in `server/.env`
- [ ] Run: `npm run install-all`
- [ ] Run: `npm run seed`
- [ ] Run: `npm run dev`
- [ ] Open: http://localhost:5173
- [ ] Login with test credentials
- [ ] ✅ Start developing!

## 🌟 Features Ready

**Frontend:**
- ✅ Product browsing
- ✅ Shopping cart
- ✅ User authentication
- ✅ Order placement
- ✅ Admin dashboard
- ✅ Seller dashboard
- ✅ Bilingual (EN/SI)

**Backend:**
- ✅ 30+ API endpoints
- ✅ JWT authentication
- ✅ Role-based access
- ✅ Product management
- ✅ Order processing
- ✅ Seller approvals
- ✅ Admin features

## 🚀 Next Steps

1. Set up MongoDB (Atlas or Local)
2. Install dependencies: `npm run install-all`
3. Seed database: `npm run seed`
4. Run application: `npm run dev`
5. Start coding!

---

## 📞 Need Help?

**MongoDB Setup Issues:**
- Use MongoDB Atlas (recommended) - it's free and requires no installation
- Follow guide: https://www.mongodb.com/basics/mongodb-atlas-tutorial

**General Issues:**
- Check if both servers are running (ports 5000 and 5173)
- Check console for error messages
- Verify `.env` files are configured correctly

---

**🎉 Everything is connected and ready to go!**

Just set up MongoDB and run `npm run dev` to start!
