# 🌍 Your GoDaddy DNS Setup - Exact Steps

**Your GoDaddy Dashboard:** https://dashboard.godaddy.com/venture/website?ventureId=16233c42-60a4-487f-b30b-a9fb2657181e

---

## ⚠️ IMPORTANT: Do This AFTER Deploying to Vercel!

**Don't add DNS yet!** First complete:
1. ✅ Deploy backend to Render
2. ✅ Deploy websites to Vercel
3. ✅ Then come back here for DNS

---

## 📋 **WHAT TO DO IN YOUR GODADDY DASHBOARD:**

### **STEP 1: Find DNS Settings**

**In your GoDaddy dashboard (the link you provided):**

1. Look for one of these options:
   - "DNS" button
   - "Manage DNS"
   - "DNS Settings"
   - "Domain Settings" → "DNS"

2. **Click it**

---

### **STEP 2: Add DNS Record #1 (Main Domain)**

**This makes ashastore.com work**

1. **Click:** "+ ADD" or "Add New Record" button

2. **Fill in EXACTLY:**
   ```
   Type: A
   Name: @ (or leave blank if @ is default)
   Value: 76.76.21.21
   TTL: 1 Hour (or 3600 seconds)
   ```

3. **Click:** "Save" or "Save Record"

✅ **Record 1 Done!**

---

### **STEP 3: Add DNS Record #2 (WWW)**

**This makes www.ashastore.com work**

1. **Click:** "+ ADD" or "Add New Record"

2. **Fill in EXACTLY:**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 1 Hour
   ```

3. **Click:** "Save"

✅ **Record 2 Done!**

---

### **STEP 4: Add DNS Record #3 (Admin Subdomain)**

**This makes admin.ashastore.com work**

1. **Click:** "+ ADD" or "Add New Record"

2. **Fill in EXACTLY:**
   ```
   Type: CNAME
   Name: admin
   Value: cname.vercel-dns.com
   TTL: 1 Hour
   ```

3. **Click:** "Save"

✅ **Record 3 Done!**

---

### **STEP 5: Verify Records**

**Your DNS records should now look like this:**

```
┌─────────────────────────────────────────────────┐
│  Type    Name    Value                   TTL    │
├─────────────────────────────────────────────────┤
│  A       @       76.76.21.21             1 Hour │
│  CNAME   www     cname.vercel-dns.com    1 Hour │
│  CNAME   admin   cname.vercel-dns.com    1 Hour │
└─────────────────────────────────────────────────┘
```

**If you see these 3 records, you're done!** ✅

---

## ⏰ **WAIT FOR DNS PROPAGATION**

### **How Long?**
- **Minimum:** 10 minutes
- **Average:** 30-60 minutes
- **Maximum:** 24 hours

### **Check Status:**

**Option 1 - DNS Checker:**
1. Go to: https://dnschecker.org
2. Type: `ashastore.com` (your domain)
3. Select: `A` record
4. Click: "Search"
5. Wait for green checkmarks worldwide

**Option 2 - Your Browser:**
Just wait 1 hour, then try visiting your domain!

---

## ✅ **TEST YOUR WEBSITES**

### **After DNS Propagates (30-60 minutes):**

**Open these URLs:**

```
🛍️ Customer Website:
   https://ashastore.com
   https://www.ashastore.com
   
   Should show: Your customer website!

👨‍💼 Seller Dashboard:
   https://admin.ashastore.com
   
   Should show: Login page
   Login with: asha@ashastore.com / AshaStore2024!
```

**All should have 🔒 HTTPS (secure padlock)**

---

## 🎯 **QUICK REFERENCE**

### **Copy-Paste Values:**

**Record 1 (A):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Record 2 (CNAME):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Record 3 (CNAME):**
```
Type: CNAME
Name: admin
Value: cname.vercel-dns.com
```

---

## 🆘 **TROUBLESHOOTING**

### **Problem: Can't find "Add Record" button**

**Look for:**
- "+ ADD" button
- "Add New Record" button
- "Add DNS Record" button
- Might be at top or bottom of page

---

### **Problem: Don't see "Type" dropdown**

**Solution:**
- Some GoDaddy interfaces show record types as separate buttons
- Click the button/tab for the record type you want (A or CNAME)
- Then fill in Name and Value

---

### **Problem: @ symbol not accepted**

**Solution:**
- Some interfaces use @ symbol
- Some leave it blank for root domain
- Some use "ashastore.com" directly
- Try leaving Name field empty for A record

---

### **Problem: Website not loading after 24 hours**

**Check:**
1. DNS records are saved (go back and verify)
2. No typos in values (especially the IP and CNAME)
3. Records are "Active" (not paused)
4. Try different browser or incognito mode

---

### **Problem: Shows "DNS_PROBE_FINISHED_NXDOMAIN"**

**This means:** DNS not set up yet

**Solution:**
- Double-check all 3 records are added
- Wait longer (up to 24 hours)
- Clear browser cache (Cmd+Shift+R on Mac)

---

## 💡 **IMPORTANT TIPS**

### **1. Double-Check Values:**
- A record: `76.76.21.21` (not 76.76.21.2 or 76.76.21.211)
- CNAME: `cname.vercel-dns.com` (not vercel.com)
- No extra spaces before or after

### **2. Save Each Record:**
- Click Save after EACH record
- Don't add all 3 then save
- Add one, save, add next, save

### **3. Wait Patiently:**
- DNS is not instant
- 30-60 minutes is normal
- Don't panic if it takes a few hours

### **4. Test After Wait:**
- Don't test immediately
- Wait at least 30 minutes
- Try on mobile data (not WiFi) to test

---

## 📸 **VISUAL GUIDE**

**Your GoDaddy DNS page should look something like this:**

```
┌─────────────────────────────────────────────────────┐
│  GoDaddy - DNS Management                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Domain: ashastore.com                              │
│                                                     │
│  DNS Records:                          [+ ADD]      │
│  ──────────────────────────────────────────────     │
│                                                     │
│  Type  Name   Value              TTL      Actions  │
│  A     @      76.76.21.21        1 Hour   [Edit]   │
│  CNAME www    cname.vercel...    1 Hour   [Edit]   │
│  CNAME admin  cname.vercel...    1 Hour   [Edit]   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## ✅ **CHECKLIST**

**Before you start:**
- [ ] Websites deployed on Vercel
- [ ] Have your domain name ready
- [ ] Logged into GoDaddy

**Adding DNS:**
- [ ] Found DNS Management page
- [ ] Added A record for @
- [ ] Added CNAME for www
- [ ] Added CNAME for admin
- [ ] Clicked Save for each record
- [ ] Verified all 3 records are listed

**After adding:**
- [ ] Waited at least 30 minutes
- [ ] Checked https://dnschecker.org
- [ ] Tested https://ashastore.com
- [ ] Tested https://www.ashastore.com
- [ ] Tested https://admin.ashastore.com
- [ ] All show 🔒 HTTPS padlock

---

## 🎉 **ONCE DNS WORKS:**

**Your Aशā Store is LIVE!**

**Customer Website:**
- https://ashastore.com
- https://www.ashastore.com

**Seller Dashboard:**
- https://admin.ashastore.com
- Login: asha@ashastore.com / AshaStore2024!

---

## 🚀 **NEXT STEPS AFTER LIVE:**

1. **Test Everything:**
   - Browse products
   - Add to cart
   - Complete checkout
   - Make ₹10 test payment

2. **Add Products:**
   - Login to admin dashboard
   - Add 10-20 products
   - Upload quality images
   - Set prices

3. **Announce Launch:**
   - Post on Instagram
   - Share on WhatsApp
   - Tell friends & family
   - Start marketing!

4. **Monitor:**
   - Check for orders daily
   - Respond to inquiries
   - Update inventory
   - Track analytics

---

## 📞 **NEED HELP?**

**GoDaddy Support:**
- Phone: 1-480-505-8877
- India: 1800-258-9000
- Chat: godaddy.com/help
- Hours: 24/7

**DNS Help:**
- Check status: https://dnschecker.org
- Vercel docs: vercel.com/docs/concepts/projects/domains

---

**Your GoDaddy dashboard is ready! After deploying to Vercel, come back and follow these exact steps!** 🚀
