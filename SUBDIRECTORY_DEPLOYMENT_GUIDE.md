# 🚀 Complete Guide: Deploy Both Websites on Same Domain

## 📋 Overview

This guide shows you how to deploy:
- **Customer Website** at: `https://yourdomain.com/`
- **Seller Dashboard** at: `https://yourdomain.com/seller/`

Both on the **same domain** using subdirectories!

---

## 🎯 Final Structure

| Website | URL | Server Location |
|---------|-----|----------------|
| Customer Website | `https://yourdomain.com/` | `public_html/` |
| Seller Dashboard | `https://yourdomain.com/seller/` | `public_html/seller/` |
| Backend API | `https://asha-store-backend.onrender.com` | (stays on Render) |

---

## 📦 STEP 1: Build Your Projects

### A. Build Customer Website (Next.js)

```bash
# Navigate to customer website folder
cd /Users/divyanshurathore/shopall/frontend/customer-website

# Install dependencies (if not already installed)
npm install

# Build for production
npm run build

# This creates a .next folder and standalone output
```

**✅ Output:** `frontend/customer-website/.next/` and `frontend/customer-website/.next/standalone/`

---

### B. Build Seller Dashboard (React) for Subdirectory

```bash
# Navigate to seller dashboard folder
cd /Users/divyanshurathore/shopall/frontend/react-dashboard

# Install dependencies (if not already installed)
npm install

# Build for subdirectory deployment
npm run build:subdirectory

# This creates a 'build' folder with PUBLIC_URL=/seller
```

**✅ Output:** `frontend/react-dashboard/build/`

---

## 📁 STEP 2: Prepare Files for Upload

### Create Deployment Folders

```bash
# Create a deployment folder
mkdir -p ~/Desktop/deployment
mkdir -p ~/Desktop/deployment/seller
```

### Copy Customer Website Files

```bash
# For Next.js standalone deployment, copy these files:
cd /Users/divyanshurathore/shopall/frontend/customer-website

# Copy standalone server files
cp -r .next/standalone/* ~/Desktop/deployment/

# Copy static files
cp -r .next/static ~/Desktop/deployment/.next/static

# Copy public files
cp -r public ~/Desktop/deployment/public
```

### Copy Seller Dashboard Files

```bash
# Copy all built React files
cd /Users/divyanshurathore/shopall/frontend/react-dashboard
cp -r build/* ~/Desktop/deployment/seller/
```

---

## 🌐 STEP 3: Upload to Your Hosting (cPanel Method)

### Option A: Using cPanel File Manager

1. **Login to cPanel**
   - Go to your hosting cPanel (usually `https://yourdomain.com/cpanel`)
   - Login with your credentials

2. **Navigate to File Manager**
   - Click "File Manager" icon
   - Go to `public_html` folder

3. **Upload Customer Website (Root)**
   
   **⚠️ IMPORTANT: For Next.js, you need Node.js hosting!**
   
   - Next.js requires a Node.js server to run
   - cPanel shared hosting doesn't support Next.js standalone
   - You need either:
     - VPS hosting with Node.js
     - Cloud hosting (DigitalOcean, AWS, etc.)
     - Keep customer website on Vercel (recommended)

4. **Upload Seller Dashboard (Subdirectory)**
   
   ✅ **This works on regular cPanel hosting!**
   
   - In File Manager, go to `public_html`
   - Create new folder: `seller`
   - Upload all files from `~/Desktop/deployment/seller/`
   - Click "Upload" button
   - Select all files from the seller build folder
   - Wait for upload to complete

---

## 🔧 STEP 4: Configure .htaccess for React Router

Create `.htaccess` file in `public_html/seller/` folder:

```apache
# .htaccess for React Router in subdirectory
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /seller/
  
  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Rewrite everything else to index.html
  RewriteRule ^ index.html [L]
</IfModule>

# Enable CORS (if needed)
<IfModule mod_headers.c>
  Header set Access-Control-Allow-Origin "*"
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

---

## 🎨 RECOMMENDED: Hybrid Deployment Strategy

Since Next.js requires Node.js hosting, here's the **BEST** approach:

### ✅ Recommended Setup:

| Website | Hosting | URL |
|---------|---------|-----|
| Customer Website | **Vercel** (Keep as is) | `https://yourdomain.com/` |
| Seller Dashboard | **cPanel/Shared Hosting** | `https://dashboard.yourdomain.com/` or `https://yourdomain.com/seller/` |
| Backend API | **Render** (Keep as is) | `https://asha-store-backend.onrender.com` |

### Why This is Better:

1. **Customer Website on Vercel:**
   - ✅ Next.js fully supported
   - ✅ Automatic deployments
   - ✅ CDN and edge functions
   - ✅ Free SSL certificate
   - ✅ Zero configuration

2. **Seller Dashboard on cPanel:**
   - ✅ Simple React app (no server needed)
   - ✅ Works on shared hosting
   - ✅ Cheaper hosting option
   - ✅ Full control

3. **Backend on Render:**
   - ✅ Python/FastAPI support
   - ✅ Free tier available
   - ✅ Auto-scaling

---

## 🔗 STEP 5: Connect Your Domain (GoDaddy)

### For Customer Website (Vercel):

1. **Add Domain to Vercel:**
   - Go to Vercel Dashboard
   - Select customer-website project
   - Go to Settings → Domains
   - Add: `yourdomain.com`

2. **Configure GoDaddy DNS:**
   - Go to GoDaddy DNS Management
   - Add these records:
   
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   TTL: 600
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 600
   ```

### For Seller Dashboard (Subdomain - Optional):

If you want: `https://dashboard.yourdomain.com`

1. **Add Subdomain in cPanel:**
   - Go to cPanel → Subdomains
   - Create subdomain: `dashboard`
   - Point to folder: `/public_html/seller`

2. **Add DNS Record in GoDaddy:**
   ```
   Type: A
   Name: dashboard
   Value: [Your cPanel server IP]
   TTL: 600
   ```

---

## 🧪 STEP 6: Test Your Deployment

### Test Customer Website:
```
https://yourdomain.com/
```
Should show: Your e-commerce store

### Test Seller Dashboard:
```
https://yourdomain.com/seller/
or
https://dashboard.yourdomain.com/
```
Should show: Login page for seller dashboard

### Test Backend API:
```
https://asha-store-backend.onrender.com/health
```
Should show: {"status": "healthy"}

---

## 🚨 Common Issues & Solutions

### Issue 1: React Router shows 404 on refresh

**Solution:** Make sure `.htaccess` file exists in `/seller/` folder

### Issue 2: CSS/JS files not loading

**Solution:** Check that PUBLIC_URL was set correctly during build
```bash
# Rebuild with correct PUBLIC_URL
PUBLIC_URL=/seller npm run build
```

### Issue 3: API calls failing

**Solution:** Check CORS settings in backend `main.py`
- Backend must allow your domain in CORS_ORIGINS

### Issue 4: Images not showing

**Solution:** Use absolute URLs for images
```javascript
// Don't use:
<img src="/images/logo.png" />

// Use:
<img src={`${process.env.PUBLIC_URL}/images/logo.png`} />
```

---

## 📊 Build Commands Summary

```bash
# Customer Website (Next.js)
cd frontend/customer-website
npm run build

# Seller Dashboard (React) - Subdirectory
cd frontend/react-dashboard
npm run build:subdirectory

# Seller Dashboard (React) - Root domain
cd frontend/react-dashboard
npm run build
```

---

## 🎯 Quick Deployment Checklist

- [ ] Build customer website with `npm run build`
- [ ] Build seller dashboard with `npm run build:subdirectory`
- [ ] Create deployment folder structure
- [ ] Copy built files to deployment folders
- [ ] Upload seller dashboard to `public_html/seller/`
- [ ] Create `.htaccess` file for React Router
- [ ] Configure domain DNS in GoDaddy
- [ ] Test customer website URL
- [ ] Test seller dashboard URL
- [ ] Test all links and API calls
- [ ] Check browser console for errors

---

## 💡 Pro Tips

1. **Use Vercel for Customer Website**
   - Next.js works perfectly on Vercel
   - Automatic deployments from GitHub
   - Free SSL and CDN

2. **Use cPanel for Seller Dashboard**
   - React build is just static files
   - Works on any shared hosting
   - Cheaper than VPS

3. **Keep Backend on Render**
   - Specialized for APIs
   - Free tier available
   - Good performance

4. **Use Git for Version Control**
   - Push changes to GitHub
   - Vercel auto-deploys customer website
   - Manually rebuild/upload seller dashboard when needed

---

## 📞 Need Help?

If you face any issues:
1. Check browser console for errors
2. Check `.htaccess` syntax
3. Verify PUBLIC_URL in build
4. Check CORS settings in backend
5. Test API endpoints separately

---

## 🎉 Success!

Your websites are now deployed:
- ✅ Customer Website: Live and accessible
- ✅ Seller Dashboard: Live at /seller/
- ✅ Backend API: Connected and working
- ✅ Custom domain: Connected

**Your e-commerce platform is now LIVE!** 🚀
