# 🚀 Deploy Aशā Store with GoDaddy Domain

## Complete Step-by-Step Guide

---

## 📋 **What You Have:**
- ✅ GoDaddy Domain purchased
- ✅ Backend (FastAPI) ready
- ✅ Customer Website (Next.js) ready
- ✅ Seller Dashboard (React) ready

## 🎯 **What We'll Do:**
1. Deploy Backend to Render
2. Deploy Customer Website to Vercel
3. Deploy Seller Dashboard to Vercel
4. Connect GoDaddy domain
5. Configure everything
6. Go live! 🎉

---

## 🔥 **STEP 1: Prepare Your Code for Deployment**

### **A. Update Backend for Production**

**1. Create requirements.txt (if not exists):**
```bash
cd /Users/divyanshurathore/shopall/backend
pip freeze > requirements.txt
```

**2. Create runtime.txt:**
```bash
echo "python-3.11" > runtime.txt
```

**3. Update main.py for production:**
```python
# backend/app/main.py

# Add at the top
import os

# Update CORS origins for production
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://ashastore.com",  # Your GoDaddy domain
    "https://www.ashastore.com",
    "https://admin.ashastore.com",  # Seller dashboard subdomain
]
```

**4. Create .env.production:**
```bash
cd backend
cat > .env.production << EOF
DATABASE_URL=your_render_postgres_url
JWT_SECRET=your_secure_secret_key_here
RAZORPAY_KEY_ID=your_live_razorpay_key
RAZORPAY_KEY_SECRET=your_live_razorpay_secret
EOF
```

---

### **B. Prepare Frontend for Production**

**Customer Website:**
```bash
cd /Users/divyanshurathore/shopall/frontend/customer-website

# Create .env.production
cat > .env.production << EOF
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_live_razorpay_key
NEXT_PUBLIC_RAZORPAY_PAYMENT_LINK=https://razorpay.me/@yourlink
EOF
```

**Seller Dashboard:**
```bash
cd /Users/divyanshurathore/shopall/frontend/react-dashboard

# Create .env.production
cat > .env.production << EOF
REACT_APP_API_URL=https://your-backend-url.onrender.com
EOF
```

---

## 🚀 **STEP 2: Deploy Backend to Render**

### **1. Sign Up on Render**

Go to: **https://render.com**
- Click "Get Started for Free"
- Sign up with GitHub (recommended)

### **2. Connect GitHub Repository**

```bash
# First, push your code to GitHub
cd /Users/divyanshurathore/shopall
git init
git add .
git commit -m "Initial commit - Asha Store"

# Create repo on GitHub
# Then:
git remote add origin https://github.com/yourusername/shopall.git
git push -u origin main
```

### **3. Create PostgreSQL Database**

In Render Dashboard:
1. Click "New +"
2. Select "PostgreSQL"
3. Choose settings:
   - **Name:** `asha-store-db`
   - **Database:** `shopall`
   - **User:** `asha_admin`
   - **Region:** Singapore (closest to India)
   - **Plan:** Free (or Starter $7/month)
4. Click "Create Database"
5. **SAVE THE CONNECTION STRING!**
   ```
   postgres://user:password@hostname/database
   ```

### **4. Create Web Service (Backend)**

In Render Dashboard:
1. Click "New +"
2. Select "Web Service"
3. Connect your GitHub repo
4. Choose settings:

```
Name: asha-store-backend
Region: Singapore
Branch: main
Root Directory: backend
Runtime: Python 3

Build Command:
pip install -r requirements.txt

Start Command:
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### **5. Add Environment Variables**

In Render Web Service settings → Environment:

```
DATABASE_URL = [paste your postgres connection string]
JWT_SECRET = [generate random 32 character string]
JWT_ALGORITHM = HS256
ACCESS_TOKEN_EXPIRE_MINUTES = 1440
REFRESH_TOKEN_EXPIRE_DAYS = 7
RAZORPAY_KEY_ID = [your live razorpay key]
RAZORPAY_KEY_SECRET = [your live razorpay secret]
```

### **6. Deploy!**

- Click "Create Web Service"
- Wait 5-10 minutes
- Your backend URL: `https://asha-store-backend.onrender.com`

### **7. Test Backend**

```bash
curl https://asha-store-backend.onrender.com/health
# Should return: {"status": "healthy"}
```

---

## 🌐 **STEP 3: Deploy Customer Website to Vercel**

### **1. Sign Up on Vercel**

Go to: **https://vercel.com**
- Sign up with GitHub
- Verify email

### **2. Import Project**

1. Click "Add New..." → "Project"
2. Import from GitHub
3. Select your `shopall` repository
4. Configure:

```
Framework Preset: Next.js
Root Directory: frontend/customer-website
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### **3. Add Environment Variables**

```
NEXT_PUBLIC_API_URL = https://asha-store-backend.onrender.com
NEXT_PUBLIC_RAZORPAY_KEY_ID = rzp_live_xxxxxxxxxx
NEXT_PUBLIC_RAZORPAY_PAYMENT_LINK = https://razorpay.me/@ashadhaundiyal
```

### **4. Deploy!**

- Click "Deploy"
- Wait 2-3 minutes
- Your website URL: `https://your-project.vercel.app`

### **5. Connect GoDaddy Domain**

**In Vercel Dashboard:**

1. Go to your project
2. Click "Settings" → "Domains"
3. Add domain: `ashastore.com`
4. Add domain: `www.ashastore.com`
5. Vercel will show DNS records to add

**Copy these DNS records** (example):
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**In GoDaddy:**

1. Login to GoDaddy
2. Go to "My Products"
3. Find your domain → "DNS"
4. Click "Manage DNS"
5. **Add/Update records:**

```
Type        Name        Value                          TTL
────────────────────────────────────────────────────────
A           @           76.76.21.21                    600
CNAME       www         cname.vercel-dns.com           1 Hour
```

6. Save changes
7. Wait 10-60 minutes for DNS propagation

### **6. Verify Domain**

In Vercel:
- Go back to Domains section
- Click "Verify"
- Once verified, SSL will be automatically configured! ✅

**Your customer website is now live at:**
- https://ashastore.com ✅
- https://www.ashastore.com ✅

---

## 🔐 **STEP 4: Deploy Seller Dashboard to Vercel**

### **1. Create Another Vercel Project**

1. Click "Add New..." → "Project"
2. Import same GitHub repo
3. Configure:

```
Framework Preset: Create React App
Root Directory: frontend/react-dashboard
Build Command: npm run build
Output Directory: build
```

### **2. Add Environment Variables**

```
REACT_APP_API_URL = https://asha-store-backend.onrender.com
```

### **3. Deploy!**

- Click "Deploy"
- Your dashboard URL: `https://asha-dashboard.vercel.app`

### **4. Connect Subdomain**

**In Vercel Dashboard:**

1. Settings → Domains
2. Add domain: `admin.ashastore.com`
3. Copy DNS record shown

**In GoDaddy DNS:**

```
Type        Name        Value                          TTL
────────────────────────────────────────────────────────
CNAME       admin       cname.vercel-dns.com           1 Hour
```

**Your seller dashboard is now live at:**
- https://admin.ashastore.com ✅

---

## ✅ **STEP 5: Update CORS in Backend**

After deploying, update backend CORS:

**In Render Dashboard:**

1. Go to your backend service
2. Environment → Edit
3. Add:

```
ALLOWED_ORIGINS = https://ashastore.com,https://www.ashastore.com,https://admin.ashastore.com
```

4. Save and wait for auto-redeploy

---

## 🔑 **STEP 6: Activate Razorpay Live Mode**

### **1. Complete KYC (If Not Done)**

1. Login to Razorpay Dashboard
2. Go to "Settings" → "Account"
3. Complete KYC verification:
   - PAN card
   - Bank account details
   - Business details

### **2. Generate Live API Keys**

1. Go to "Settings" → "API Keys"
2. Click "Generate Live Keys"
3. **Save these keys securely!**

```
Key ID: rzp_live_xxxxxxxxxxxx
Key Secret: xxxxxxxxxxxxxxxxxxxxxx
```

### **3. Update Environment Variables**

**In Vercel (Customer Website):**
```
NEXT_PUBLIC_RAZORPAY_KEY_ID = rzp_live_xxxxxxxxxxxx
```

**In Render (Backend):**
```
RAZORPAY_KEY_ID = rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET = xxxxxxxxxxxxxxxxxxxxxx
```

### **4. Test Payment**

1. Go to your website
2. Add product to cart
3. Proceed to checkout
4. Complete payment with real card
5. Verify in Razorpay Dashboard

---

## 🧪 **STEP 7: Final Testing**

### **Test Customer Website:**

```
1. Visit https://ashastore.com
   ✅ Page loads
   ✅ Products display
   ✅ Images load
   ✅ Search works
   ✅ Cart works
   ✅ Checkout works
   ✅ Payment works
   ✅ Mobile responsive
```

### **Test Seller Dashboard:**

```
1. Visit https://admin.ashastore.com
   ✅ Login works (asha@ashastore.com)
   ✅ Dashboard loads
   ✅ Add product works
   ✅ Upload images works
   ✅ Edit product works
   ✅ Product appears on website
```

### **Test Backend API:**

```bash
# Health check
curl https://asha-store-backend.onrender.com/health

# Get products
curl https://asha-store-backend.onrender.com/api/v1/products/

# Should return products JSON
```

---

## 📧 **STEP 8: Setup Business Email (Optional)**

### **With Google Workspace:**

1. Go to: **workspace.google.com**
2. Click "Get Started"
3. Enter your domain: `ashastore.com`
4. Choose plan: Business Starter (₹150/month)
5. Create account: `asha@ashastore.com`
6. Verify domain ownership

**Add these DNS records in GoDaddy:**

```
Type        Name        Value                          TTL
────────────────────────────────────────────────────────
MX          @           1 aspmx.l.google.com           1 Hour
MX          @           5 alt1.aspmx.l.google.com      1 Hour
MX          @           5 alt2.aspmx.l.google.com      1 Hour
TXT         @           v=spf1 include:_spf.google.com ~all
```

7. Wait 24-48 hours
8. You can now use: `asha@ashastore.com` 📧

---

## 🔒 **STEP 9: Security Setup**

### **1. Force HTTPS**

Both Vercel and Render automatically provide SSL.

**Verify:**
- http://ashastore.com → redirects to https ✅
- http://admin.ashastore.com → redirects to https ✅

### **2. Set Security Headers**

Create `vercel.json` in customer-website:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### **3. Environment Security**

- ✅ Never commit .env files
- ✅ Use environment variables in hosting
- ✅ Rotate secrets regularly
- ✅ Use strong JWT secret (32+ characters)

---

## 📊 **STEP 10: Setup Analytics**

### **Google Analytics:**

1. Go to: **analytics.google.com**
2. Create account
3. Create property: "Aशā Store"
4. Get Measurement ID: `G-XXXXXXXXXX`

**Add to customer website:**

```javascript
// frontend/customer-website/app/layout.jsx

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

Redeploy and analytics will start tracking! 📈

---

## 🌍 **STEP 11: SEO Setup**

### **1. Google Search Console**

1. Go to: **search.google.com/search-console**
2. Add property: `ashastore.com`
3. Verify ownership (DNS method in GoDaddy)
4. Submit sitemap: `https://ashastore.com/sitemap.xml`

### **2. Update Meta Tags**

Already done in your code! ✅
```javascript
export const metadata = {
  title: 'Aशā - Grace Woven by Asha Dhaundiyal',
  description: 'Discover timeless beauty...',
}
```

### **3. Create sitemap.xml**

Vercel handles this automatically for Next.js! ✅

---

## 🎯 **STEP 12: Final Checklist**

### **Pre-Launch:**

- [ ] Domain connected (ashastore.com)
- [ ] SSL certificates active (https)
- [ ] Backend deployed and working
- [ ] Customer website live
- [ ] Seller dashboard live
- [ ] Database connected
- [ ] All environment variables set
- [ ] Razorpay live mode activated
- [ ] Test payment successful
- [ ] Products added
- [ ] Images uploading correctly
- [ ] Email configured
- [ ] Analytics installed
- [ ] Mobile tested
- [ ] Desktop tested
- [ ] All links working

### **Post-Launch:**

- [ ] Monitor error logs
- [ ] Check payment notifications
- [ ] Test order flow
- [ ] Update social media
- [ ] Tell customers about website
- [ ] Start marketing! 🚀

---

## 🚨 **Common Issues & Solutions**

### **Issue 1: Domain Not Working**

**Solution:**
- Wait 24 hours for DNS propagation
- Check DNS records in GoDaddy
- Verify in Vercel domain settings
- Try clearing browser cache

### **Issue 2: Backend Connection Failed**

**Solution:**
- Check backend URL in .env files
- Ensure CORS is configured
- Check backend logs in Render
- Test API endpoint directly

### **Issue 3: Images Not Loading**

**Solution:**
- Check image URLs in database
- Update base URL to production domain
- Ensure image upload folder exists
- Check file permissions

### **Issue 4: Payment Failing**

**Solution:**
- Verify live Razorpay keys
- Check webhook URL
- Test with different payment method
- Check Razorpay dashboard logs

---

## 💰 **Monthly Costs**

```
GoDaddy Domain:        ₹100/month (₹1,200/year)
Render Backend:        ₹580/month (Starter plan)
Render Database:       Included
Vercel Hosting:        ₹0 (FREE!)
SSL Certificates:      ₹0 (FREE!)
───────────────────────────────────────────
Total:                 ₹680/month
First Year:            ₹9,360
```

---

## 📞 **Support Resources**

**If Something Goes Wrong:**

1. **Render Support:**
   - Docs: docs.render.com
   - Community: community.render.com

2. **Vercel Support:**
   - Docs: vercel.com/docs
   - Discord: vercel.com/discord

3. **GoDaddy Support:**
   - Phone: Available 24/7
   - Chat: godaddy.com/help

4. **Razorpay Support:**
   - Dashboard → Support
   - Email: support@razorpay.com

---

## 🎉 **Congratulations!**

**Your Aशā Store is now LIVE!** 🚀

**Customer Website:** https://ashastore.com
**Seller Dashboard:** https://admin.ashastore.com
**Business Email:** asha@ashastore.com

**Time to celebrate and start selling!** 🎊

---

## 📝 **Next Steps:**

1. **Add Products:**
   - Login to admin.ashastore.com
   - Add 10-20 products with good images

2. **Marketing:**
   - Create Facebook page
   - Setup Instagram
   - WhatsApp Business
   - Google My Business

3. **Operations:**
   - Setup shipping
   - Configure payment alerts
   - Train on order management
   - Customer service ready

**You're ready for business!** 💪
