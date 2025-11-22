# 🌍 Connect Your GoDaddy Domain to Aशā Store

## ✅ You Have Your GoDaddy Domain Ready!

Dashboard: https://dashboard.godaddy.com

---

## 📝 **WHAT YOU NEED FIRST:**

Before setting up DNS, you need these URLs from your deployments:

**From Vercel (after deploying):**
- ✅ Customer website URL
- ✅ Seller dashboard URL

**These will be like:**
- `asha-store-customer-abc123.vercel.app`
- `asha-store-dashboard-xyz789.vercel.app`

---

## 🔧 **DNS SETUP - STEP BY STEP**

### **STEP 1: Deploy Websites First**

**You MUST deploy to Vercel FIRST, then come back here!**

Why? Because Vercel will tell you exactly what DNS records to add.

---

### **STEP 2: Get DNS Records from Vercel**

**After deploying customer website on Vercel:**

1. Open Vercel Dashboard: https://vercel.com/ashastore
2. Click your project: `asha-store-customer`
3. Click "Settings" tab
4. Click "Domains" (left sidebar)
5. Click "Add" button
6. Type your domain (e.g., `ashastore.com`)
7. Click "Add"

**Vercel will show you DNS records like:**

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

**IMPORTANT:** Write these down! Each domain might be different.

---

### **STEP 3: Add DNS Records in GoDaddy**

**Now go to your GoDaddy dashboard:**

1. **Open:** https://dashboard.godaddy.com
2. **Click:** "Websites & Domains" or "My Products"
3. **Find:** Your domain
4. **Click:** Three dots (⋮) → "Manage DNS" or "DNS"

---

### **STEP 4: Add Record for Main Domain**

**In GoDaddy DNS page:**

1. **Look for existing records**
   - If you see an A record with "@" name, click "Edit" (pencil icon)
   - If not, click "Add New Record" or "+ ADD"

2. **Fill in:**
   ```
   Type: A
   Name: @ (means root domain)
   Value: 76.76.21.21 (or value Vercel showed you)
   TTL: 1 Hour (or 600 seconds)
   ```

3. **Click:** "Save" or "Save Record"

✅ **Main domain configured!**

---

### **STEP 5: Add Record for WWW**

**Still in GoDaddy DNS:**

1. **Click:** "Add New Record" or "+ ADD"

2. **Fill in:**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com (or value Vercel showed you)
   TTL: 1 Hour
   ```

3. **Click:** "Save"

✅ **WWW subdomain configured!**

---

### **STEP 6: Add Record for Admin/Dashboard**

**For seller dashboard:**

1. **In Vercel:** Go to `asha-store-dashboard` project
2. **Settings → Domains**
3. **Add:** `admin.ashastore.com` (replace with your domain)
4. **Vercel shows:** CNAME record needed

**Back in GoDaddy:**

1. **Click:** "Add New Record"

2. **Fill in:**
   ```
   Type: CNAME
   Name: admin
   Value: cname.vercel-dns.com (or value Vercel showed you)
   TTL: 1 Hour
   ```

3. **Click:** "Save"

✅ **Admin subdomain configured!**

---

## ⏰ **WAIT FOR DNS PROPAGATION**

### **How Long?**

```
Minimum:  10 minutes
Average:  30-60 minutes
Maximum:  24 hours (rare)
```

### **Check Status:**

**Option 1 - DNS Checker:**
1. Go to: https://dnschecker.org
2. Type your domain: `ashastore.com`
3. Select type: `A`
4. Click "Search"
5. Look for green checkmarks showing `76.76.21.21`

**Option 2 - Terminal:**
```bash
# Check A record
dig ashastore.com

# Check CNAME
dig www.ashastore.com
dig admin.ashastore.com
```

---

## 🔍 **YOUR DNS RECORDS SUMMARY**

**After setup, your DNS should look like this:**

```
┌──────────────────────────────────────────────────┐
│           YOUR GODADDY DNS RECORDS               │
├──────────────────────────────────────────────────┤
│                                                  │
│  Type    Name    Value                TTL       │
│  ─────────────────────────────────────────────  │
│  A       @       76.76.21.21          1 Hour    │
│  CNAME   www     cname.vercel-dns.com 1 Hour    │
│  CNAME   admin   cname.vercel-dns.com 1 Hour    │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## ✅ **VERIFY DNS IS WORKING**

### **After 30-60 minutes:**

**Test Each URL:**

1. **Main Domain:**
   ```
   https://ashastore.com
   Should show: Your customer website ✅
   ```

2. **WWW:**
   ```
   https://www.ashastore.com
   Should show: Same customer website ✅
   ```

3. **Admin:**
   ```
   https://admin.ashastore.com
   Should show: Seller dashboard login ✅
   ```

4. **SSL Certificate:**
   ```
   All URLs should have 🔒 padlock
   Vercel adds SSL automatically!
   ```

---

## 🔧 **COMMON DNS RECORDS EXPLAINED**

### **A Record:**
- **Points domain to IP address**
- Used for: Root domain (ashastore.com)
- Value: IP address (e.g., 76.76.21.21)

### **CNAME Record:**
- **Points domain to another domain**
- Used for: Subdomains (www, admin)
- Value: Another domain (e.g., cname.vercel-dns.com)

### **@ Symbol:**
- **Means "root domain"**
- Example: @ = ashastore.com

### **TTL (Time To Live):**
- **How long DNS is cached**
- 1 Hour = Changes take effect faster
- 24 Hours = More stable but slower updates

---

## 🚨 **TROUBLESHOOTING**

### **Problem: Domain not loading after 24 hours**

**Check:**
1. DNS records are correct (no typos!)
2. Value doesn't have extra spaces
3. Record is "Active" in GoDaddy
4. Domain is verified in Vercel

**Fix:**
1. Delete the record
2. Add it again carefully
3. Wait another hour

---

### **Problem: Shows "DNS_PROBE_FINISHED_NXDOMAIN"**

**This means:** DNS not configured yet

**Fix:**
1. Double-check DNS records in GoDaddy
2. Wait longer (up to 24 hours)
3. Clear browser cache (Cmd+Shift+R)
4. Try incognito mode

---

### **Problem: Shows old website or error**

**This means:** DNS cached in your browser

**Fix:**
1. Clear browser cache
2. Clear DNS cache on Mac:
   ```bash
   sudo dscacheutil -flushcache
   sudo killall -HUP mDNSResponder
   ```
3. Try different browser
4. Try mobile data (not WiFi)

---

### **Problem: No HTTPS (no padlock)**

**This means:** SSL certificate not yet issued

**Fix:**
1. Wait 10-15 minutes after DNS propagates
2. Vercel auto-issues SSL certificates
3. Check Vercel Settings → Domains
4. Should show "Valid Certificate" ✅

---

### **Problem: www works but root doesn't (or vice versa)**

**This means:** One DNS record is wrong

**Fix:**
1. Check both A and CNAME records
2. Make sure A record points to correct IP
3. Make sure CNAME points to cname.vercel-dns.com
4. Wait for DNS propagation

---

## 📊 **DNS SETUP CHECKLIST**

### **Before DNS Setup:**
- [ ] Customer website deployed on Vercel
- [ ] Seller dashboard deployed on Vercel
- [ ] Backend deployed on Render
- [ ] Have GoDaddy login credentials
- [ ] Copied DNS values from Vercel

### **DNS Records Added:**
- [ ] A record for root domain (@)
- [ ] CNAME record for www
- [ ] CNAME record for admin
- [ ] All records saved in GoDaddy
- [ ] No typos in values

### **After DNS Setup:**
- [ ] Waited at least 30 minutes
- [ ] Checked https://dnschecker.org
- [ ] Tested https://ashastore.com
- [ ] Tested https://www.ashastore.com
- [ ] Tested https://admin.ashastore.com
- [ ] All show 🔒 HTTPS padlock
- [ ] Can login to seller dashboard
- [ ] Customer site shows products

---

## 🎯 **QUICK REFERENCE**

### **GoDaddy:**
```
Login: https://dashboard.godaddy.com
Go to: My Products → Your Domain → Manage DNS
Add: 3 records (A, CNAME www, CNAME admin)
```

### **Vercel:**
```
Login: https://vercel.com/ashastore
Get DNS values from: Settings → Domains → Add Domain
Vercel shows exact values to use
```

### **Check DNS:**
```
https://dnschecker.org
Enter your domain
Select record type (A or CNAME)
Look for green checks globally
```

---

## 💡 **PRO TIPS**

### **1. Set Low TTL First:**
When first setting up:
- Use TTL: 600 seconds (10 minutes)
- Changes take effect faster
- After stable, can increase to 1 hour

### **2. Verify in Vercel:**
After adding DNS:
- Go to Vercel → Domains
- Click "Verify" button
- Should show "Valid Configuration" ✅

### **3. Use Vercel's Values:**
Always use exact values Vercel shows you:
- Don't assume IP addresses
- Don't assume CNAME values
- Copy-paste exactly as shown

### **4. Test Before Announcing:**
Before telling customers:
- Test from different devices
- Test from mobile data (not WiFi)
- Test from incognito mode
- Make a test purchase

---

## 🔒 **SECURITY NOTES**

### **SSL/HTTPS:**
- ✅ Vercel provides free SSL
- ✅ Auto-renews every 90 days
- ✅ No configuration needed
- ✅ Works for all subdomains

### **Always use HTTPS:**
- Customer data encrypted
- Payment information secure
- Better SEO ranking
- Trust indicators in browser

---

## 📞 **SUPPORT**

### **If DNS Issues:**
**GoDaddy Support:**
- Phone: 1-480-505-8877 (India: 1800-258-9000)
- Chat: godaddy.com/help
- Help: support.godaddy.com

**Vercel Support:**
- Docs: vercel.com/docs/concepts/projects/domains
- Status: vercel-status.com
- Community: github.com/vercel/vercel/discussions

---

## ✅ **COMPLETE!**

**Once DNS propagates, your websites will be live at:**

```
🛍️ Customer Shopping:
   https://ashastore.com
   https://www.ashastore.com

👨‍💼 Asha Dashboard:
   https://admin.ashastore.com
```

**All with 🔒 secure HTTPS automatically!**

---

**Your Aशā Store is ready for the world! 🚀**
