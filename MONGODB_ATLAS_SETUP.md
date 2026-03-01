# 🍃 MongoDB Atlas Setup Guide

MongoDB Atlas is a free cloud database service - perfect for development and testing. No installation needed!

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Account

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google/Email
3. Choose **FREE** tier (M0 Sandbox)

### Step 2: Create Cluster

1. After signup, you'll see "Create a cluster"
2. Choose:
   - **Shared** (Free tier)
   - **Cloud Provider:** AWS
   - **Region:** Closest to your location
   - **Cluster Name:** `GamiSaviya` (or any name)
3. Click **Create Cluster** (takes 1-3 minutes)

### Step 3: Create Database User

1. Click **Database Access** (left sidebar)
2. Click **Add New Database User**
3. Authentication: **Password**
4. Username: `gamisaviya_user`
5. Password: Click **Autogenerate Secure Password** (copy it!)
6. Database User Privileges: **Read and write to any database**
7. Click **Add User**

### Step 4: Allow Network Access

1. Click **Network Access** (left sidebar)
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (for development)
4. Click **Confirm**

### Step 5: Get Connection String

1. Click **Database** (left sidebar)
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Driver: **Node.js**
5. Version: **5.5 or later**
6. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Update Connection String

1. Replace `<username>` with your username: `gamisaviya_user`
2. Replace `<password>` with the password you copied
3. Add database name before `?`: `/gamisaviya?`

**Final connection string should look like:**
```
mongodb+srv://gamisaviya_user:YourPassword123@cluster.mongodb.net/gamisaviya?retryWrites=true&w=majority
```

### Step 7: Configure Backend

Open `server/.env` and update:

```env
MONGODB_URI=mongodb+srv://gamisaviya_user:YourPassword123@cluster.mongodb.net/gamisaviya?retryWrites=true&w=majority
```

**⚠️ Important:**
- Replace `YourPassword123` with your actual password
- Keep the entire string on one line
- No spaces

### Step 8: Test Connection

```powershell
cd server
npm run seed
```

You should see:
```
✅ MongoDB Connected: cluster.mongodb.net
📊 Database: gamisaviya
✅ Created 5 users
✅ Created 6 products
✅ Created 2 orders
🎉 Database seeded successfully!
```

## ✅ You're Done!

Now run your application:

```powershell
cd ..
npm run dev
```

## 🔍 View Your Data

You can view your data in MongoDB Atlas:

1. Go to **Database** in Atlas
2. Click **Browse Collections**
3. See your users, products, and orders!

## 💡 MongoDB Atlas Benefits

✅ **Free Forever** (512MB storage)  
✅ **No installation** required  
✅ **Automatic backups**  
✅ **Global infrastructure**  
✅ **Easy to use**  
✅ **Perfect for development**  

## 🐛 Troubleshooting

### Connection Timeout Error

**Problem:** Can't connect to MongoDB Atlas

**Solutions:**
1. Check your internet connection
2. Verify IP address is allowed (Network Access → Allow Anywhere)
3. Check username/password in connection string
4. Make sure there are no spaces in the connection string

### Authentication Failed

**Problem:** `MongoServerError: bad auth`

**Solution:**
- Double-check password in connection string
- Make sure you're using the exact password (case-sensitive)
- Try regenerating password in Database Access

### Wrong Database Name

**Problem:** Collections not appearing

**Solution:**
- Make sure `/gamisaviya?` is in your connection string
- The format should be: `...@cluster.mongodb.net/gamisaviya?retryWrites=...`

## 📊 Monitor Your Database

**View Connection Activity:**
1. Go to **Metrics** tab in Atlas
2. See real-time connections
3. Monitor database operations

**View Collections:**
1. Click **Browse Collections**
2. See all your data:
   - `users` - User accounts
   - `products` - Product listings
   - `orders` - Customer orders
   - `addresses` - Shipping addresses

## 🔒 Security Tips

**For Development:**
- ✅ "Allow Access from Anywhere" is fine

**For Production:**
- ❌ Don't use "Allow Access from Anywhere"
- ✅ Add only your server's IP address
- ✅ Use environment variables (never commit passwords)
- ✅ Enable database encryption

## 🎯 Quick Reference

**Atlas Dashboard:** https://cloud.mongodb.com/  
**Documentation:** https://docs.atlas.mongodb.com/  
**Node.js Driver:** https://docs.mongodb.com/drivers/node/  

## ✨ Connection String Format

```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

Replace:
- `<username>` → Your database user
- `<password>` → Your password
- `<cluster>` → Your cluster name (auto-generated)
- `<database>` → `gamisaviya`

## 📝 Example .env Configuration

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://gamisaviya_user:SecurePass123@cluster0.abc123.mongodb.net/gamisaviya?retryWrites=true&w=majority

# Other Settings
PORT=5000
JWT_SECRET=your-super-secret-key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## 🎉 Success!

Once connected:
1. ✅ Run `npm run seed` to add sample data
2. ✅ Run `npm run dev` to start your app
3. ✅ Open http://localhost:5173
4. ✅ Login with test credentials
5. ✅ Start building!

**Need more help?**  
Check MongoDB Atlas documentation: https://docs.atlas.mongodb.com/getting-started/

---

**🌟 You're now using professional cloud database infrastructure!**
