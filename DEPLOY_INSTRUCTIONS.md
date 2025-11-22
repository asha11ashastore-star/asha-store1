# 🚀 Deploy Aशā Store - Complete Instructions

## ✅ You Have Ready:
- Vercel Account: https://vercel.com/ashastore
- Render Account: https://dashboard.render.com
- Code committed locally
- All 3 parts tested and working

---

## 📦 **STEP 1: Push to GitHub (5 minutes)**

### **Option A: Using GitHub Desktop (Easiest)**

1. **Download GitHub Desktop:**
   - Go to: https://desktop.github.com
   - Download and install

2. **Sign in to GitHub:**
   - Open GitHub Desktop
   - Sign in with your GitHub account
   - (If you don't have an account, create one at github.com)

3. **Add Repository:**
   ```
   - File → Add Local Repository
   - Choose: /Users/divyanshurathore/shopall
   - Click "Create Repository" if asked
   ```

4. **Publish to GitHub:**
   ```
   - Click "Publish repository"
   - Name: asha-store
   - Description: Asha Store E-commerce Website
   - Uncheck "Keep this code private" (or keep it private)
   - Click "Publish Repository"
   ```

5. **Done!** Your code is now on GitHub! ✅

### **Option B: Using Git Command (Alternative)**

```bash
# 1. Create a new repository on github.com
# 2. Copy the URL (looks like: https://github.com/yourusername/asha-store.git)

# 3. In terminal:
cd /Users/divyanshurathore/shopall
git remote remove origin
git remote add origin https://github.com/YOURUSERNAME/asha-store.git
git branch -M main
git push -u origin main

# It will ask for username and password
# Use your GitHub Personal Access Token as password
# Create token at: https://github.com/settings/tokens
```

---

## 🖥️ **STEP 2: Deploy Backend on Render (30 minutes)**

### **A. Create Database**

1. **Go to Render Dashboard:**
   - Open: https://dashboard.render.com
   - Click "New +" (top right)
   - Select "PostgreSQL"

2. **Configure Database:**
   ```
   Name: asha-store-db
   Database: shopall
   User: asha_admin
   Region: Singapore
   Plan: Free (or Starter for ₹580/month)
   ```

3. **Create:**
   - Click "Create Database"
   - Wait 1-2 minutes
   - Database will show "Available"

4. **Copy Connection String:**
   ```
   - Click on your database
   - Find "Internal Database URL"
   - Click "Copy" button
   - SAVE THIS - looks like:
   postgres://asha_admin:XXXXXX@dpg-XXXXX-singapore-postgres/shopall
   ```

### **B. Deploy Backend**

1. **Create Web Service:**
   ```
   - Click "New +" → "Web Service"
   - Choose "Build and deploy from a Git repository"
   - Click "Next"
   ```

2. **Connect GitHub:**
   ```
   - Click "Connect GitHub"
   - Authorize Render
   - Select your repository: asha-store
   - Click "Connect"
   ```

3. **Configure Service:**
   ```
   Name: asha-store-backend
   Region: Singapore
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   
   Build Command:
   pip install -r requirements.txt
   
   Start Command:
   uvicorn main:app --host 0.0.0.0 --port $PORT
   
   Instance Type: Free (or Starter)
   ```

4. **Add Environment Variables:**

   Click "Advanced" → "Add Environment Variable"
   
   Add these one by one (click "+ Add Environment Variable" for each):

   ```
   DATABASE_URL = [paste your database URL from step A4]
   
   JWT_SECRET = asha_store_super_secret_key_2024_production
   
   JWT_ALGORITHM = HS256
   
   ACCESS_TOKEN_EXPIRE_MINUTES = 1440
   
   REFRESH_TOKEN_EXPIRE_DAYS = 7
   
   RAZORPAY_KEY_ID = rzp_test_FVZPTn18225397949705
   (Change to live key after KYC: rzp_live_XXXXXXXX)
   
   RAZORPAY_KEY_SECRET = YOUR_RAZORPAY_SECRET
   (Get from Razorpay Dashboard → Settings → API Keys)
   
   ALLOWED_ORIGINS = https://ashastore.com,https://www.ashastore.com,https://admin.ashastore.com
   ```

5. **Deploy:**
   ```
   - Click "Create Web Service"
   - Wait 5-10 minutes (grab a coffee ☕)
   - Watch the logs at bottom
   - When you see "Your service is live!" → Done! ✅
   ```

6. **Copy Backend URL:**
   ```
   - At top of page, you'll see: https://asha-store-backend-XXXXX.onrender.com
   - Click "Copy URL" button
   - SAVE THIS - you'll need it for frontend!
   ```

7. **Test Backend:**
   ```
   - Click "Open URL" in Render
   - Add /health to URL: https://asha-store-backend-XXXXX.onrender.com/health
   - Should see: {"status":"healthy","database":"connected"}
   - ✅ Backend is LIVE!
   ```

---

## 🌐 **STEP 3: Deploy Customer Website on Vercel (20 minutes)**

1. **Go to Vercel Dashboard:**
   - Open: https://vercel.com/ashastore
   - Click "Add New..." → "Project"

2. **Import Repository:**
   ```
   - Click "Import Git Repository"
   - Connect GitHub (if not already)
   - Select your repository: asha-store
   - Click "Import"
   ```

3. **Configure Project:**
   ```
   Project Name: asha-store-customer
   Framework Preset: Next.js (auto-detected)
   Root Directory: frontend/customer-website
   Build Command: npm run build (auto-filled)
   Output Directory: .next (auto-filled)
   Install Command: npm install (auto-filled)
   ```

4. **Add Environment Variables:**

   Click "Environment Variables" section:

   Add these 3 variables:

   ```
   Name: NEXT_PUBLIC_API_URL
   Value: [paste your Render backend URL from Step 2.6]
   Example: https://asha-store-backend-abc123.onrender.com
   
   Name: NEXT_PUBLIC_RAZORPAY_KEY_ID
   Value: rzp_test_FVZPTn18225397949705
   (Change to live after KYC: rzp_live_XXXXXXXX)
   
   Name: NEXT_PUBLIC_RAZORPAY_PAYMENT_LINK
   Value: https://razorpay.me/@ashadhaundiyal
   ```

5. **Deploy:**
   ```
   - Click "Deploy"
   - Wait 2-3 minutes
   - Watch the build logs
   - When you see "Your project is ready!" → Done! ✅
   ```

6. **Copy Website URL:**
   ```
   - You'll see: https://asha-store-customer-XXXXX.vercel.app
   - Click "Visit" to open your website
   - SAVE THIS URL!
   ```

7. **Test Website:**
   ```
   - Click "Visit" button
   - Your website should load!
   - Try browsing products
   - Try adding to cart
   - ✅ Customer website is LIVE!
   ```

---

## 👨‍💼 **STEP 4: Deploy Seller Dashboard on Vercel (15 minutes)**

1. **Create Another Project:**
   ```
   - In Vercel Dashboard
   - Click "Add New..." → "Project"
   - Import SAME repository: asha-store
   ```

2. **Configure:**
   ```
   Project Name: asha-store-dashboard
   Framework Preset: Create React App
   Root Directory: frontend/react-dashboard
   Build Command: npm run build (auto-filled)
   Output Directory: build (auto-filled)
   ```

3. **Add Environment Variable:**
   ```
   Name: REACT_APP_API_URL
   Value: [your Render backend URL]
   Example: https://asha-store-backend-abc123.onrender.com
   ```

4. **Deploy:**
   ```
   - Click "Deploy"
   - Wait 2-3 minutes
   - Done! ✅
   ```

5. **Copy Dashboard URL:**
   ```
   - You'll see: https://asha-store-dashboard-XXXXX.vercel.app
   - SAVE THIS URL!
   ```

6. **Test Dashboard:**
   ```
   - Click "Visit"
   - Login with: asha@ashastore.com / AshaStore2024!
   - Should see dashboard
   - Try viewing products
   - ✅ Seller dashboard is LIVE!
   ```

---

## 🌍 **STEP 5: Connect Your GoDaddy Domain (30 minutes)**

### **A. Connect Customer Website (Main Domain)**

**In Vercel:**

1. **Go to Customer Website Project:**
   ```
   - Vercel Dashboard
   - Click on: asha-store-customer
   - Go to: Settings → Domains
   ```

2. **Add Your Domain:**
   ```
   - Click "Add"
   - Enter: ashastore.com
   - Click "Add"
   
   - Click "Add" again
   - Enter: www.ashastore.com
   - Click "Add"
   ```

3. **Copy DNS Records:**
   
   Vercel will show you records like this:
   ```
   For ashastore.com:
   Type: A
   Name: @
   Value: 76.76.21.21
   
   For www.ashastore.com:
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
   
   **Write these down or take a screenshot!**

**In GoDaddy:**

1. **Login to GoDaddy:**
   - Go to: https://godaddy.com
   - Sign in
   - Click "My Products"

2. **Manage DNS:**
   ```
   - Find your domain: ashastore.com
   - Click three dots → "Manage DNS"
   ```

3. **Add/Update Records:**
   
   **Record 1: Root Domain**
   ```
   - Look for existing A record with @ name
   - If exists, click pencil icon to edit
   - If not, click "Add New Record"
   
   Type: A
   Name: @
   Value: 76.76.21.21
   TTL: 600 (or 1 Hour)
   
   Click "Save"
   ```
   
   **Record 2: WWW Subdomain**
   ```
   - Add New Record
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 1 Hour
   
   Click "Save"
   ```

4. **Wait for DNS Propagation:**
   ```
   - Usually takes 10-60 minutes
   - Can take up to 24 hours
   - Check status: https://dnschecker.org
   ```

### **B. Connect Seller Dashboard (Admin Subdomain)**

**In Vercel:**

1. **Go to Dashboard Project:**
   ```
   - Vercel Dashboard
   - Click on: asha-store-dashboard
   - Settings → Domains
   ```

2. **Add Subdomain:**
   ```
   - Click "Add"
   - Enter: admin.ashastore.com
   - Click "Add"
   ```

3. **Copy DNS Record:**
   ```
   Vercel shows:
   Type: CNAME
   Name: admin
   Value: cname.vercel-dns.com
   ```

**In GoDaddy DNS:**

1. **Add Record:**
   ```
   - Same DNS page as before
   - Click "Add New Record"
   
   Type: CNAME
   Name: admin
   Value: cname.vercel-dns.com
   TTL: 1 Hour
   
   Click "Save"
   ```

2. **Done!**

---

## ⏰ **STEP 6: Wait & Verify (1 hour)**

### **Wait for DNS:**
```
- Minimum: 10 minutes
- Average: 30-60 minutes
- Maximum: 24 hours
```

### **Check DNS Propagation:**
```
1. Go to: https://dnschecker.org
2. Enter: ashastore.com
3. Select: A
4. Click "Search"
5. Should see: 76.76.21.21 in results
```

### **Verify Your Websites:**

After DNS propagation:

```
1. Customer Website:
   https://ashastore.com
   https://www.ashastore.com
   Should load your website! ✅

2. Seller Dashboard:
   https://admin.ashastore.com
   Should show login page! ✅

3. SSL Certificates:
   All URLs should have 🔒 padlock
   Vercel adds SSL automatically!
```

---

## ✅ **FINAL TESTING CHECKLIST**

### **Customer Website (https://ashastore.com):**

- [ ] Website loads
- [ ] Home page shows
- [ ] Products display
- [ ] Images load
- [ ] Can click on product
- [ ] Product details show
- [ ] Can add to cart
- [ ] Cart shows items
- [ ] Can proceed to checkout
- [ ] Checkout form works
- [ ] Can create account
- [ ] Can login
- [ ] Mobile responsive

### **Seller Dashboard (https://admin.ashastore.com):**

- [ ] Dashboard loads
- [ ] Can login with asha@ashastore.com
- [ ] Dashboard shows
- [ ] Can view products
- [ ] Can add product
- [ ] Can upload images
- [ ] Can edit product
- [ ] Product appears on website

### **Payment Testing:**

- [ ] Complete a test order
- [ ] Redirects to Razorpay
- [ ] Payment page loads
- [ ] Can make payment
- [ ] Check Razorpay dashboard for payment

---

## 🎉 **YOU'RE LIVE!**

**Congratulations! Your Aशā Store is now on the Internet!**

### **Your Live URLs:**
```
🛍️ Customer Website:
   https://ashastore.com
   https://www.ashastore.com

👨‍💼 Seller Dashboard:
   https://admin.ashastore.com

🔧 Backend API:
   https://asha-store-backend-XXXXX.onrender.com
```

---

## 📱 **ANNOUNCE YOUR LAUNCH!**

### **Share on Social Media:**

**Instagram Post:**
```
🎉 Excited to announce the launch of Aशā! 🎉

Discover beautiful handwoven sarees and traditional Indian wear, 
curated with love by Asha Dhaundiyal.

🛍️ Shop now: ashastore.com

✨ Exquisite collection
🌟 Authentic designs
💯 Premium quality
🚚 Nationwide delivery

Visit our website and explore timeless elegance!

#AshaStore #HandwovenSarees #TraditionalWear #IndianFashion
#NewLaunch #ShopOnline
```

**WhatsApp Status:**
```
🎊 NEW WEBSITE LAUNCH! 🎊

Aशा - Grace Woven by Asha Dhaundiyal

Beautiful handwoven sarees now available online!

Visit: ashastore.com

Order now! 🛍️
```

**Facebook:**
```
We're LIVE! 🎉

After months of preparation, I'm thrilled to announce the launch 
of my online store - Aशā!

Explore our collection of exquisite handwoven sarees and traditional 
Indian wear at ashastore.com

Special launch offers available!

Thank you for your support! 🙏
```

---

## 📊 **MONITOR YOUR WEBSITE**

### **Daily Checks:**
- [ ] Website loading properly
- [ ] Check for new orders
- [ ] Respond to inquiries
- [ ] Monitor Razorpay payments

### **Weekly Tasks:**
- [ ] Add new products
- [ ] Update inventory
- [ ] Check analytics
- [ ] Backup database

### **Monthly Goals:**
- [ ] Review sales
- [ ] Customer feedback
- [ ] Marketing campaigns
- [ ] Product promotions

---

## 💰 **YOUR COSTS**

### **Monthly:**
```
Domain (GoDaddy):     ₹100/month
Backend (Render):     ₹0 (Free) or ₹580/month
Frontend (Vercel):    ₹0 (FREE!)
Dashboard (Vercel):   ₹0 (FREE!)
SSL Certificates:     ₹0 (FREE!)
──────────────────────────────────
Total Free Tier:      ₹100/month
Total Paid Tier:      ₹680/month
```

### **First Year:**
```
Free Tier:  ₹1,200 (domain only!)
Paid Tier:  ₹8,160 (with better hosting)
```

---

## 🆘 **NEED HELP?**

### **If Something Doesn't Work:**

1. **Website Not Loading:**
   - Wait full 24 hours for DNS
   - Clear browser cache
   - Try incognito mode
   - Check https://dnschecker.org

2. **Backend Errors:**
   - Check Render logs
   - Verify environment variables
   - Check database connection

3. **Payment Not Working:**
   - Verify Razorpay keys
   - Check KYC status
   - Ensure live mode enabled

### **Support Resources:**
- Vercel: vercel.com/docs
- Render: docs.render.com
- GoDaddy: godaddy.com/help
- Razorpay: support@razorpay.com

---

## 🎯 **NEXT STEPS**

### **This Week:**
1. Add 20+ products with quality images
2. Test all features thoroughly
3. Complete Razorpay KYC
4. Switch to live payment mode
5. Start marketing!

### **This Month:**
1. Build social media presence
2. Run promotional campaigns
3. Collect customer reviews
4. Optimize based on analytics
5. Scale up!

---

**Your Aशā Store is now LIVE and ready for customers! 🚀**

**Start selling and grow your business! 💪**
