# 🚀 Aशā Store - Click-by-Click Deployment

**Follow these exact steps. Just click what I tell you!**

---

## 🔗 **STEP 1: PUSH TO GITHUB (2 minutes)**

### **Using GitHub Website (Easiest):**

1. **Open:** https://github.com/new
2. **Repository name:** `asha-store`
3. **Description:** `Asha Store Ecommerce Website`
4. **Keep Public** (or choose Private)
5. **UNCHECK** "Initialize with README"
6. **Click:** `Create repository`

7. **Copy these commands** from GitHub (they'll show on next screen)
8. **Open Terminal** on your Mac
9. **Run:**
```bash
cd /Users/divyanshurathore/shopall
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/asha-store.git
git branch -M main
git push -u origin main
```

10. **Enter your GitHub username and password** when asked
    - **Password:** Use Personal Access Token (not regular password)
    - **Get Token:** https://github.com/settings/tokens → Generate new token

✅ **Done! Code is on GitHub!**

---

## 🖥️ **STEP 2: DEPLOY BACKEND (10 minutes)**

### **A. Create Database:**

1. **Open:** https://dashboard.render.com
2. **Click:** Blue button "New +" (top right)
3. **Click:** "PostgreSQL"
4. **Fill:**
   - Name: `asha-store-db`
   - Database: `shopall`
   - User: `asha_admin`
   - Region: `Singapore`
   - Instance Type: `Free`
5. **Click:** Green button "Create Database"
6. **Wait:** 1 minute for "Available" status
7. **Click:** Your database name
8. **Find:** "Internal Database URL" section
9. **Click:** "Copy" button next to the URL
10. **Paste in Notes app** - you'll need this!

### **B. Deploy Backend:**

11. **Click:** "Dashboard" (top left)
12. **Click:** Blue "New +" button
13. **Click:** "Web Service"
14. **Click:** "Build and deploy from a Git repository"
15. **Click:** "Next"
16. **Click:** "Connect GitHub"
17. **Authorize Render** (allow access)
18. **Click:** Your repository "asha-store"
19. **Click:** "Connect"

20. **Fill the form:**

**Name:** `asha-store-backend`
**Region:** `Singapore`
**Branch:** `main`
**Root Directory:** `backend`
**Runtime:** `Python 3`

**Build Command:** 
```
pip install -r requirements.txt
```

**Start Command:**
```
uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Instance Type:** `Free` (or `Starter` for ₹580/month)

21. **Click:** "Advanced" button

22. **Add Environment Variables** (Click "+ Add Environment Variable" for each):

```
Key: DATABASE_URL
Value: [Paste the database URL you copied earlier]

Key: JWT_SECRET  
Value: asha_store_secret_key_2024_secure_production

Key: JWT_ALGORITHM
Value: HS256

Key: ACCESS_TOKEN_EXPIRE_MINUTES
Value: 1440

Key: REFRESH_TOKEN_EXPIRE_DAYS
Value: 7

Key: RAZORPAY_KEY_ID
Value: rzp_test_FVZPTn18225397949705

Key: RAZORPAY_KEY_SECRET
Value: [Get from Razorpay Dashboard → Settings → API Keys]

Key: ALLOWED_ORIGINS
Value: https://ashastore.com,https://www.ashastore.com,https://admin.ashastore.com
```

23. **Click:** Green "Create Web Service" button

24. **Wait:** 5-10 minutes (watch logs at bottom)

25. **When done:** You'll see "Your service is live!" 

26. **Copy your backend URL** from top of page
    - Looks like: `https://asha-store-backend-abc123.onrender.com`
    - **Paste in Notes** - you'll need this!

✅ **Backend is LIVE!**

**Test:** Click "Open" button → Add `/health` to URL
Should see: `{"status":"healthy"}`

---

## 🌐 **STEP 3: DEPLOY CUSTOMER WEBSITE (5 minutes)**

1. **Open:** https://vercel.com/ashastore
2. **Click:** "Add New..." button
3. **Click:** "Project"
4. **Click:** "Import Git Repository"
5. **Click:** Your repository "asha-store"
6. **Click:** "Import"

7. **Fill the form:**

**Project Name:** `asha-store-customer`
**Framework Preset:** `Next.js` (auto-detected)
**Root Directory:** Click "Edit" → Type: `frontend/customer-website`

8. **Environment Variables Section:**

Click "Add" for each:

```
Name: NEXT_PUBLIC_API_URL
Value: [Paste your backend URL from Render]

Name: NEXT_PUBLIC_RAZORPAY_KEY_ID  
Value: rzp_test_FVZPTn18225397949705

Name: NEXT_PUBLIC_RAZORPAY_PAYMENT_LINK
Value: https://razorpay.me/@ashadhaundiyal
```

9. **Click:** Blue "Deploy" button

10. **Wait:** 2-3 minutes

11. **When done:** Click "Visit" button

12. **Copy the URL** (looks like: `asha-store-customer-abc.vercel.app`)
    - **Save this!**

✅ **Customer Website is LIVE!**

---

## 👨‍💼 **STEP 4: DEPLOY SELLER DASHBOARD (5 minutes)**

1. **Stay on Vercel:** https://vercel.com/ashastore
2. **Click:** "Add New..." → "Project"
3. **Click:** SAME repository "asha-store"
4. **Click:** "Import"

5. **Fill:**

**Project Name:** `asha-store-dashboard`
**Framework Preset:** `Create React App`
**Root Directory:** Click "Edit" → Type: `frontend/react-dashboard`

6. **Environment Variable:**

```
Name: REACT_APP_API_URL
Value: [Paste your backend URL from Render]
```

7. **Click:** "Deploy"

8. **Wait:** 2-3 minutes

9. **When done:** Click "Visit"

10. **Copy URL** - Save this!

✅ **Seller Dashboard is LIVE!**

**Test:** Login with `asha@ashastore.com` / `AshaStore2024!`

---

## 🌍 **STEP 5: CONNECT DOMAIN (10 minutes)**

### **A. Connect Customer Website:**

1. **In Vercel:** Click your `asha-store-customer` project
2. **Click:** "Settings" tab
3. **Click:** "Domains" (left sidebar)
4. **Type:** `ashastore.com` → Click "Add"
5. **Type:** `www.ashastore.com` → Click "Add"

6. **Vercel shows DNS records** - Take a screenshot or write down:
```
Type: A       Name: @      Value: 76.76.21.21
Type: CNAME   Name: www    Value: cname.vercel-dns.com
```

### **B. Add DNS in GoDaddy:**

7. **Open new tab:** https://godaddy.com
8. **Click:** "Sign In" → Login
9. **Click:** "My Products"
10. **Find:** Your domain `ashastore.com`
11. **Click:** Three dots ⋮ → "Manage DNS"

12. **Add Record 1:**
    - **Click:** "Add New Record" button
    - **Type:** Select "A"
    - **Name:** Type `@`
    - **Value:** Type `76.76.21.21`
    - **TTL:** Select "1 Hour" or "600"
    - **Click:** "Save"

13. **Add Record 2:**
    - **Click:** "Add New Record"
    - **Type:** Select "CNAME"
    - **Name:** Type `www`
    - **Value:** Type `cname.vercel-dns.com`
    - **TTL:** "1 Hour"
    - **Click:** "Save"

### **C. Connect Seller Dashboard:**

14. **Back to Vercel:** Click `asha-store-dashboard` project
15. **Settings → Domains**
16. **Type:** `admin.ashastore.com` → Add
17. **Vercel shows:**
```
Type: CNAME   Name: admin   Value: cname.vercel-dns.com
```

18. **Back to GoDaddy DNS page**
19. **Add Record:**
    - **Type:** CNAME
    - **Name:** `admin`
    - **Value:** `cname.vercel-dns.com`
    - **TTL:** 1 Hour
    - **Save**

✅ **Domain Connected!**

---

## ⏰ **STEP 6: WAIT & TEST (1 hour)**

### **Wait for DNS:**

**After saving DNS records in GoDaddy:**
- Minimum wait: 10 minutes
- Average: 30-60 minutes
- Maximum: 24 hours

### **Check DNS Status:**

1. **Open:** https://dnschecker.org
2. **Type:** `ashastore.com`
3. **Select:** Type "A"
4. **Click:** "Search"
5. **Look for:** Green checks showing `76.76.21.21`

### **Test Your Live Websites:**

After DNS propagates:

```
✅ Customer Website:
   https://ashastore.com
   https://www.ashastore.com

✅ Seller Dashboard:
   https://admin.ashastore.com

✅ Backend API:
   https://asha-store-backend-XXXXX.onrender.com/health
```

---

## 🎉 **YOU'RE LIVE!**

### **Final Tests:**

**Customer Website:**
- [ ] Open https://ashastore.com
- [ ] Browse products
- [ ] Add to cart
- [ ] Test checkout

**Seller Dashboard:**
- [ ] Open https://admin.ashastore.com
- [ ] Login: asha@ashastore.com
- [ ] Add a test product
- [ ] Verify it appears on customer site

**Payment:**
- [ ] Make ₹10 test payment
- [ ] Check Razorpay dashboard
- [ ] Verify order received

---

## 📱 **ANNOUNCE YOUR LAUNCH!**

```
Copy this for WhatsApp Status:

🎉 EXCITING NEWS! 🎉

Aशā is now LIVE online!

Explore beautiful handwoven sarees and 
traditional Indian wear at:

🛍️ ashastore.com

Shop now! Free shipping on orders above ₹2000!

#AshaStore #HandwovenSarees #NewLaunch
```

---

## 💰 **YOUR MONTHLY COSTS:**

```
Domain:         ₹100/month
Backend:        ₹0 (Free) or ₹580 (Starter)
Websites:       ₹0 (FREE from Vercel!)
SSL:            ₹0 (FREE!)
──────────────────────────────
Total:          ₹100-680/month
```

---

## 🆘 **IF SOMETHING GOES WRONG:**

**Backend Not Deploying:**
- Check logs in Render dashboard
- Verify all environment variables
- Ensure database URL is correct

**Website Not Loading:**
- Wait full 24 hours for DNS
- Clear browser cache (Cmd+Shift+R)
- Try incognito mode
- Check https://dnschecker.org

**Can't Login to Dashboard:**
- Check backend URL in environment variables
- Verify backend is running (check /health)
- Try: asha@ashastore.com / AshaStore2024!

---

## ✅ **DEPLOYMENT COMPLETE!**

**Your Aशā Store is now LIVE on the Internet!**

**Start selling! 🚀**
