# 🚀 Quick Start: Deploy to Same Domain

## 🎯 Goal
Deploy both websites on the same domain:
- Customer Website: `https://yourdomain.com/`
- Seller Dashboard: `https://yourdomain.com/seller/`

---

## ⚡ Quick Method (Recommended)

### Step 1: Run Build Script
```bash
cd /Users/divyanshurathore/shopall
./build-for-deployment.sh
```

This script will:
- ✅ Build seller dashboard for `/seller/` subdirectory
- ✅ Create deployment folder on your Desktop
- ✅ Generate `.htaccess` file
- ✅ Create upload instructions

### Step 2: Upload to cPanel

1. **Open deployment folder:**
   ```
   ~/Desktop/asha-store-deployment/
   ```

2. **Login to cPanel:**
   - Go to: `https://yourdomain.com/cpanel`
   - Login with your credentials

3. **Upload seller dashboard:**
   - Open File Manager
   - Navigate to `public_html`
   - Upload the entire `seller` folder
   - Make sure `.htaccess` is inside

4. **Done!**
   - Visit: `https://yourdomain.com/seller/`
   - Should show login page

---

## 🌐 Domain Setup

### Customer Website (Vercel)
Keep on Vercel, connect your domain:

1. **Vercel Dashboard:**
   - Go to customer-website project
   - Settings → Domains
   - Add: `yourdomain.com`

2. **GoDaddy DNS:**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME  
   Name: www
   Value: cname.vercel-dns.com
   ```

### Seller Dashboard (cPanel)
Already uploaded to `/seller/` subdirectory ✅

---

## ✅ Test Your Deployment

```
Customer Website: https://yourdomain.com/
Seller Dashboard: https://yourdomain.com/seller/
Backend API: https://asha-store-backend.onrender.com/health
```

---

## 🚨 Common Issues

### React Router 404 on refresh
**Fix:** Make sure `.htaccess` file exists in `public_html/seller/`

### CSS/JS not loading
**Fix:** Rebuild with:
```bash
cd frontend/react-dashboard
npm run build:subdirectory
```

### API calls failing
**Fix:** Check backend CORS allows your domain

---

## 📞 Need More Details?

Read the complete guide:
```
SUBDIRECTORY_DEPLOYMENT_GUIDE.md
```

---

## 🎉 You're Done!

Both websites are now on the same domain! 🚀
