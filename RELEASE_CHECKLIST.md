# 🚀 Aशā Store - Complete Release Checklist

## 📋 Pre-Release Checklist (Do Before Deploying)

### **✅ 1. Content Preparation**

**Products:**
- [ ] Add at least 10-15 products with quality images
- [ ] Set accurate prices
- [ ] Write detailed descriptions
- [ ] Set proper categories (Sarees, Kurta Sets, etc.)
- [ ] Add stock quantities
- [ ] Set sale prices (if applicable)
- [ ] Upload multiple images per product (3-5 images)

**Images:**
- [ ] High resolution (at least 1000x1000px)
- [ ] Good lighting and clear
- [ ] Show product from multiple angles
- [ ] Include close-ups of fabric/details
- [ ] Consistent background style

**Website Content:**
- [ ] About page completed
- [ ] Contact information correct
- [ ] Phone number: +91 your_number
- [ ] Email: asha@ashastore.com (after setup)
- [ ] WhatsApp number configured
- [ ] Social media links (if any)

---

### **✅ 2. Policies & Legal**

**Create/Review Pages:**
- [ ] Shipping Policy (delivery time, charges, areas)
- [ ] Return/Refund Policy (conditions, timeframe)
- [ ] Privacy Policy (data collection, usage)
- [ ] Terms & Conditions
- [ ] Size Guide for clothing

**Business Legal:**
- [ ] GST Registration (if applicable - mandatory for >₹40 lakhs)
- [ ] Business PAN Card
- [ ] Bank account for business
- [ ] Shop/Business registration (optional but recommended)

---

### **✅ 3. Razorpay Setup**

**Complete KYC:**
- [ ] Login to Razorpay: https://dashboard.razorpay.com
- [ ] Submit KYC documents:
  - [ ] PAN Card
  - [ ] Bank account details
  - [ ] Address proof (Aadhaar)
  - [ ] Business proof (or Aadhaar for proprietor)
  - [ ] Your photograph
- [ ] Wait for KYC approval (24-48 hours)
- [ ] Switch to Live Mode
- [ ] Generate Live API keys
- [ ] Test live payment with ₹1

**Payment Link:**
- [ ] Verify: https://razorpay.me/@ashadhaundiyal is active
- [ ] Test payment link works
- [ ] Configure webhook (optional)

---

### **✅ 4. Testing (Critical!)**

**Customer Website Testing:**
- [ ] Home page loads properly
- [ ] All images loading
- [ ] Collections page shows products
- [ ] Product detail pages work
- [ ] Search functionality works
- [ ] Add to cart works
- [ ] Cart shows correct items
- [ ] Size selection works
- [ ] Cart quantity +/- works
- [ ] Different sizes = different cart items
- [ ] Remove from cart works
- [ ] Checkout form validation
- [ ] Order creation works
- [ ] Payment redirect works
- [ ] Test actual payment (₹10)

**Mobile Testing:**
- [ ] Website responsive on mobile
- [ ] Images load properly
- [ ] Navigation menu works
- [ ] Forms are usable
- [ ] Cart works on mobile
- [ ] Checkout works on mobile
- [ ] Payment works on mobile

**Browser Testing:**
- [ ] Chrome ✅
- [ ] Safari ✅
- [ ] Firefox ✅
- [ ] Edge ✅
- [ ] Mobile browsers ✅

**Seller Dashboard Testing:**
- [ ] Login works
- [ ] Can add products
- [ ] Can upload images
- [ ] Can edit products
- [ ] Can set sale prices
- [ ] Can remove sale prices
- [ ] Can update stock
- [ ] Can delete products
- [ ] Products appear on website immediately

---

### **✅ 5. Code Preparation**

**Environment Variables:**
- [ ] Update production API URL
- [ ] Update Razorpay live keys
- [ ] Remove test/debug code
- [ ] Set proper CORS origins

**Security:**
- [ ] Change default passwords
- [ ] Use strong JWT secret
- [ ] Enable HTTPS only
- [ ] Set secure headers
- [ ] Protect admin routes

**Performance:**
- [ ] Optimize images
- [ ] Enable caching
- [ ] Compress responses
- [ ] Minimize bundle size

---

## 🚀 Deployment Steps

### **STEP 1: Setup GitHub Repository**

**Push Code to GitHub:**

```bash
cd /Users/divyanshurathore/shopall

# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Asha Store ready for deployment"

# Create repository on GitHub
# Go to: github.com → New Repository
# Name: asha-store
# Public or Private: Your choice

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/asha-store.git

# Push
git push -u origin main
```

**Repository Structure:**
```
asha-store/
├── backend/              # FastAPI
├── frontend/
│   ├── customer-website/  # Next.js
│   └── react-dashboard/   # React
└── README.md
```

---

### **STEP 2: Deploy Backend (Render.com)**

**1. Sign Up:**
- Go to: https://render.com
- Sign up with GitHub
- Authorize Render to access your repository

**2. Create PostgreSQL Database:**

```
1. Click "New +" → "PostgreSQL"
2. Settings:
   - Name: asha-store-db
   - Database: shopall
   - User: asha_admin
   - Region: Singapore (closest to India)
   - Plan: Free (or Starter $7/month)
3. Click "Create Database"
4. COPY the Internal Database URL (starts with postgres://)
```

**3. Create Web Service:**

```
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:

   Name: asha-store-backend
   Region: Singapore
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   
   Build Command:
   pip install -r requirements.txt
   
   Start Command:
   uvicorn main:app --host 0.0.0.0 --port $PORT
   
   Plan: Free (or Starter $7/month)
```

**4. Add Environment Variables:**

In Render dashboard → Environment → Add:

```
DATABASE_URL = [paste your postgres URL from step 2]
JWT_SECRET = [generate random 32 chars: openssl rand -hex 32]
JWT_ALGORITHM = HS256
ACCESS_TOKEN_EXPIRE_MINUTES = 1440
REFRESH_TOKEN_EXPIRE_DAYS = 7
RAZORPAY_KEY_ID = rzp_live_XXXXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET = XXXXXXXXXXXXXXXXXXXXXXXXXX
ALLOWED_ORIGINS = https://ashastore.com,https://www.ashastore.com,https://admin.ashastore.com
```

**5. Deploy:**
- Click "Create Web Service"
- Wait 5-10 minutes
- Note your backend URL: `https://asha-store-backend.onrender.com`

**6. Verify:**
```bash
curl https://asha-store-backend.onrender.com/health
# Should return: {"status": "healthy"}
```

---

### **STEP 3: Deploy Customer Website (Vercel)**

**1. Sign Up:**
- Go to: https://vercel.com
- Sign up with GitHub
- Import your repository

**2. Configure:**

```
Project Settings:
- Framework Preset: Next.js
- Root Directory: frontend/customer-website
- Build Command: npm run build
- Output Directory: .next
- Install Command: npm install
```

**3. Environment Variables:**

```
NEXT_PUBLIC_API_URL = https://asha-store-backend.onrender.com
NEXT_PUBLIC_RAZORPAY_KEY_ID = rzp_live_XXXXXXXXXXXXXXXX
NEXT_PUBLIC_RAZORPAY_PAYMENT_LINK = https://razorpay.me/@ashadhaundiyal
```

**4. Deploy:**
- Click "Deploy"
- Wait 2-3 minutes
- Note your URL: `https://asha-store-xxxxx.vercel.app`

**5. Connect GoDaddy Domain:**

**In Vercel:**
- Go to Project → Settings → Domains
- Add domain: `ashastore.com`
- Add domain: `www.ashastore.com`
- Copy the DNS records shown

**In GoDaddy:**
1. Login to GoDaddy
2. My Products → Your Domain → DNS
3. Click "Manage DNS"
4. Add/Update records:

```
Type    Name    Value                       TTL
A       @       76.76.21.21                600
CNAME   www     cname.vercel-dns.com       1 Hour
```

5. Save changes
6. Wait 10-60 minutes for DNS propagation

**6. Verify Domain:**
- Back in Vercel → Domains → Click "Verify"
- SSL certificate will be auto-configured
- Your site is now live at: https://ashastore.com ✅

---

### **STEP 4: Deploy Seller Dashboard (Vercel)**

**1. Create New Project:**
- Vercel → Add New → Project
- Import same GitHub repository

**2. Configure:**

```
Project Settings:
- Framework Preset: Create React App
- Root Directory: frontend/react-dashboard
- Build Command: npm run build
- Output Directory: build
- Install Command: npm install
```

**3. Environment Variables:**

```
REACT_APP_API_URL = https://asha-store-backend.onrender.com
```

**4. Deploy:**
- Click "Deploy"
- Wait 2-3 minutes
- Note URL: `https://asha-dashboard-xxxxx.vercel.app`

**5. Connect Subdomain:**

**In Vercel:**
- Settings → Domains
- Add: `admin.ashastore.com`
- Copy DNS record

**In GoDaddy DNS:**
```
Type    Name    Value                       TTL
CNAME   admin   cname.vercel-dns.com       1 Hour
```

- Save and wait 10-60 minutes
- Dashboard live at: https://admin.ashastore.com ✅

---

### **STEP 5: Update CORS (Backend)**

**In Render Dashboard:**

1. Go to your backend service
2. Environment → Edit
3. Update `ALLOWED_ORIGINS`:

```
ALLOWED_ORIGINS=https://ashastore.com,https://www.ashastore.com,https://admin.ashastore.com
```

4. Save → Service will auto-redeploy

---

### **STEP 6: Setup Business Email (Optional)**

**Google Workspace (₹150/month):**

1. Go to: https://workspace.google.com
2. Sign up → Use existing domain
3. Domain: ashastore.com
4. Plan: Business Starter
5. Create email: asha@ashastore.com

**Add DNS Records in GoDaddy:**

```
Type    Name    Value                       Priority    TTL
MX      @       aspmx.l.google.com          1           1 Hour
MX      @       alt1.aspmx.l.google.com     5           1 Hour
MX      @       alt2.aspmx.l.google.com     5           1 Hour
TXT     @       v=spf1 include:_spf.google.com ~all     1 Hour
```

Wait 24-48 hours → Email ready: asha@ashastore.com ✅

---

### **STEP 7: Final Configuration**

**Update Razorpay:**
- Login to Razorpay
- Settings → Website & App URLs
- Add: https://ashastore.com
- Add: https://admin.ashastore.com

**Test Everything:**
- [ ] Visit https://ashastore.com
- [ ] Browse products
- [ ] Add to cart
- [ ] Complete checkout
- [ ] Make test payment (₹10)
- [ ] Verify in Razorpay dashboard
- [ ] Login to admin: https://admin.ashastore.com
- [ ] Add a product
- [ ] Verify it appears on website

**Google Analytics (Free):**
1. Go to: https://analytics.google.com
2. Create account → Property: "Aशā Store"
3. Get Measurement ID: `G-XXXXXXXXXX`
4. Add to customer website (in Vercel env vars)

**Google Search Console:**
1. Go to: https://search.google.com/search-console
2. Add property: ashastore.com
3. Verify via DNS (in GoDaddy)
4. Submit sitemap

---

## 🎉 POST-LAUNCH CHECKLIST

### **Day 1: Launch Day**

- [ ] Announce on social media
- [ ] Share with friends & family
- [ ] Post on WhatsApp Status
- [ ] Create Instagram post
- [ ] Create Facebook post
- [ ] Email announcement (if you have list)

### **Week 1: Monitor**

- [ ] Check website daily
- [ ] Monitor orders
- [ ] Respond to inquiries
- [ ] Check payment settlements
- [ ] Monitor Google Analytics
- [ ] Check for errors
- [ ] Backup database

### **Month 1: Grow**

- [ ] Get customer feedback
- [ ] Add more products
- [ ] Start marketing campaign
- [ ] Run promotional offers
- [ ] Optimize based on analytics
- [ ] Build social media presence
- [ ] Collect customer reviews

---

## 💰 TOTAL COSTS

### **First Year:**

```
Domain (GoDaddy):          ₹1,200/year
Backend Hosting (Render):  ₹580/month × 12 = ₹6,960/year
Database (Render):         Included
Frontend (Vercel):         FREE
Seller Dashboard (Vercel): FREE
SSL Certificates:          FREE (included)
──────────────────────────────────────────
Subtotal:                  ₹8,160/year

Optional:
Business Email:            ₹150/month × 12 = ₹1,800/year
──────────────────────────────────────────
Total:                     ₹9,960/year (with email)
```

**Monthly: ₹830/month** (₹680 + ₹150 email)

---

## 📞 SUPPORT CONTACTS

**Technical Issues:**
- Render: docs.render.com
- Vercel: vercel.com/docs
- GoDaddy: godaddy.com/help

**Payment Issues:**
- Razorpay: support@razorpay.com
- Phone: +91-78-2828-6444

---

## 🎯 QUICK LAUNCH COMMAND LIST

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for production"
git push origin main

# 2. Deploy Backend (Render.com)
# → Connect GitHub → Configure → Deploy

# 3. Deploy Customer Site (Vercel.com)
# → Import repo → Set root: frontend/customer-website → Deploy

# 4. Deploy Seller Dashboard (Vercel.com)  
# → Import repo → Set root: frontend/react-dashboard → Deploy

# 5. Connect Domain (GoDaddy)
# → Add DNS records → Wait for propagation

# 6. Test Everything
curl https://ashastore.com
curl https://admin.ashastore.com
curl https://asha-store-backend.onrender.com/health
```

---

## ✅ COMPLETION CHECKLIST

**Before Going Live:**
- [ ] All products added
- [ ] Policies written
- [ ] Razorpay KYC approved
- [ ] All features tested
- [ ] Mobile responsive checked
- [ ] Payment tested

**Deployment:**
- [ ] GitHub repository created
- [ ] Backend deployed on Render
- [ ] Customer site deployed on Vercel
- [ ] Seller dashboard deployed on Vercel
- [ ] Domain connected
- [ ] SSL active (https)
- [ ] All environment variables set

**Post-Launch:**
- [ ] Website live and working
- [ ] Can browse products
- [ ] Can complete purchase
- [ ] Payment received in Razorpay
- [ ] Dashboard accessible
- [ ] Can manage products
- [ ] Analytics tracking
- [ ] Social media announced

---

## 🚀 READY TO LAUNCH?

**Your Aशā Store is ready for the world!**

**Timeline:**
- Day 1-2: Deploy to Render & Vercel
- Day 3: Connect domain
- Day 4: Final testing
- Day 5: LAUNCH! 🎉

**After Launch:**
- Monitor daily
- Respond to orders
- Keep adding products
- Market actively
- Grow your business!

---

**Need help? I'm here! Let's launch Aशā Store! 🚀**
