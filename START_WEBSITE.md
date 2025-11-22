# 🚀 Start Aशā Store Website - Quick Guide

## ✅ Current Status

### **🟢 Backend API - RUNNING** ✅
- **URL:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **Status:** Healthy and ready!

### **🟢 Customer Website - RUNNING** ✅  
- **URL:** http://localhost:3001
- **Status:** Ready for shopping!
- **Features:** Browse, cart, checkout all working!

### **🔴 Seller Dashboard - NEEDS FIX**
- **URL:** Should be http://localhost:3000
- **Status:** Configuration issue
- **Fix:** See instructions below

---

## 🎉 **Your Website is LIVE!**

### **Visit Customer Website:**
```
Open browser: http://localhost:3001
```

**What customers can do:**
- ✅ Browse products
- ✅ Search products
- ✅ Add to cart  
- ✅ Checkout
- ✅ Login/Register
- ✅ View profile
- ✅ View orders

---

## 🛠️ Running Commands

### **Terminal 1: Backend API** (Already Running ✅)
```bash
cd /Users/divyanshurathore/shopall/backend
python3 main.py
```

**Output:**
```
INFO: Uvicorn running on http://0.0.0.0:8000
INFO: Application startup complete.
```

---

### **Terminal 2: Customer Website** (Already Running ✅)
```bash
cd /Users/divyanshurathore/shopall/frontend/customer-website  
npm run dev
```

**Output:**
```
▲ Next.js 14.0.4
- Local: http://localhost:3001
✓ Ready in 1924ms
```

---

### **Terminal 3: Seller Dashboard** (Fix Needed)

**Current Issue:** Dev server configuration error

**Quick Fix:**
```bash
cd /Users/divyanshurathore/shopall/frontend/react-dashboard

# Option 1: Try with different port
PORT=3002 npm start

# Option 2: If that fails, build and serve
npm run build
npx serve -s build -l 3000
```

**If still issues, use Alternative:**
The seller can manage products through backend API docs:
- Go to: http://localhost:8000/docs
- Use "Auth" → Login with: asha@ashastore.com / AshaStore2024!
- Use "Products" endpoints to add/edit products

---

## 🌐 **Access Your Websites**

### **For Customers (Shopping):**
```
URL: http://localhost:3001

Features:
- Home page with featured products
- Collections page
- Sale page
- Product details
- Cart & Checkout
- Login & Register
- My Profile
- My Orders
```

### **For Asha (Admin/Seller):**
```
Option 1: Dashboard (when fixed)
URL: http://localhost:3000
Login: asha@ashastore.com / AshaStore2024!

Option 2: API Docs (working now)
URL: http://localhost:8000/docs
Use endpoints directly
```

---

## 🧪 **Test Everything**

### **Test Customer Shopping Flow:**

1. **Browse Products:**
   ```
   http://localhost:3001/collections
   ```

2. **View Product:**
   ```
   Click any product → See details
   ```

3. **Add to Cart:**
   ```
   Select size → Click "Add to Cart"
   ```

4. **Checkout:**
   ```
   Cart icon → Proceed to Checkout
   Fill details → Complete order
   ```

5. **Create Account:**
   ```
   User icon → Sign Up
   Email: test@example.com
   Password: test12345
   ```

---

### **Test Admin Functions:**

**Using API Docs (http://localhost:8000/docs):**

1. **Login:**
   ```
   POST /api/v1/auth/login
   Body: {
     "email": "asha@ashastore.com",
     "password": "AshaStore2024!"
   }
   Copy the access_token
   ```

2. **Authorize:**
   ```
   Click "Authorize" button (top right)
   Paste token
   Click "Authorize"
   ```

3. **Add Product:**
   ```
   POST /api/v1/products/
   Fill product details
   Execute
   ```

4. **View All Products:**
   ```
   GET /api/v1/products/
   Execute
   ```

---

## 🔧 **Troubleshooting**

### **Issue: Backend won't start**

**Error:** Module not found / Import error

**Solution:**
```bash
cd backend
pip3 install -r requirements.txt
python3 main.py
```

---

### **Issue: Customer website won't start**

**Error:** Port already in use

**Solution:**
```bash
# Kill existing process
lsof -ti:3001 | xargs kill

# Start again
npm run dev
```

---

### **Issue: Products not showing**

**Check:**
1. Backend running? → http://localhost:8000/health
2. Database has products? → http://localhost:8000/api/v1/products/
3. Frontend connected to backend? → Check console for errors

**Fix:**
```bash
# Add sample products
cd backend
python3 add_sample_products.py
```

---

### **Issue: Payment not working**

**Check:**
1. Razorpay keys in `.env.local`
2. Payment link configured: https://razorpay.me/@ashadhaundiyal
3. Test mode enabled in Razorpay dashboard

---

## 📁 **Important Files**

### **Backend:**
```
/backend/main.py              - Main API file
/backend/.env                 - Configuration  
/backend/app/routers/         - API endpoints
/backend/app/models.py        - Database models
```

### **Customer Website:**
```
/frontend/customer-website/
  ├── app/                    - Pages
  ├── components/             - UI components
  ├── services/api.js         - Backend API calls
  └── .env.local              - Config (API URL, Razorpay)
```

### **Seller Dashboard:**
```
/frontend/react-dashboard/
  ├── src/components/         - Dashboard components
  ├── src/services/api.js     - Backend API calls
  └── .env                    - Config
```

---

## 🎯 **Quick Commands**

### **Start Everything:**
```bash
# Terminal 1 - Backend
cd backend && python3 main.py

# Terminal 2 - Customer Site
cd frontend/customer-website && npm run dev

# Terminal 3 - Seller Dashboard (when fixed)
cd frontend/react-dashboard && npm start
```

### **Stop Everything:**
```bash
# Press Ctrl+C in each terminal

# Or kill all:
pkill -f "python3 main.py"
pkill -f "next dev"
pkill -f "react-scripts"
```

### **Check Status:**
```bash
# Backend
curl http://localhost:8000/health

# Customer Site
curl http://localhost:3001

# Check what's running
lsof -i :8000   # Backend
lsof -i :3001   # Customer site
lsof -i :3000   # Seller dashboard
```

---

## 📊 **System Architecture**

```
┌─────────────────────────────────────────┐
│          YOUR RUNNING SYSTEM            │
└─────────────────────────────────────────┘

Customers                    Asha (Seller)
    ↓                             ↓
http://localhost:3001    http://localhost:3000
(Next.js Website)       (React Dashboard)
    ↓                             ↓
    └─────────┬───────────────────┘
              ↓
    http://localhost:8000
    (FastAPI Backend)
              ↓
    SQLite Database
    (shopall.db)
```

---

## ✅ **Success Checklist**

- [x] Backend API running on port 8000
- [x] Customer website running on port 3001
- [ ] Seller dashboard running on port 3000 (fix needed)
- [x] Can browse products
- [x] Can add to cart
- [x] Can checkout
- [x] Can create account
- [x] Can login
- [x] Database connected
- [x] Razorpay integrated

---

## 🎊 **You're Live!**

**Your Aशā Store is running!**

**Customer Website:** http://localhost:3001 ✅

**What to do next:**
1. ✅ Test shopping flow
2. ✅ Add products (via API docs)
3. ✅ Test checkout
4. 🔧 Fix seller dashboard (optional)
5. 🚀 Deploy to internet!

---

## 💡 **Pro Tips**

### **Keep Terminals Open:**
Don't close the terminal windows where services are running!

### **View Logs:**
Watch the terminal output to see:
- API requests
- Database queries  
- Errors (if any)

### **Hot Reload:**
Both frontend and backend auto-reload when you change code!

### **Database:**
Your products and orders are saved in:
```
/backend/shopall.db
```

### **Images:**
Uploaded images are in:
```
/backend/uploads/products/
```

---

**Happy Selling! 🛍️**
