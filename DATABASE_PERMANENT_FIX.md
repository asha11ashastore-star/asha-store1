# 🔧 PERMANENT DATABASE FIX

## 🚨 THE PROBLEM:

Your database gets **wiped on every deployment** because:
- Render uses SQLite (file-based database)
- SQLite file is stored in temporary `/tmp` folder
- Each deployment = new container = database deleted
- All users and products get lost!

---

## ✅ SOLUTION 1: Quick Fix (Use This Now)

### **After EVERY deployment, run this command:**

```bash
./recreate_seller_account.sh
```

This recreates your seller account in 2 seconds.

**OR** run manually:
```bash
curl -X POST "https://asha-store-backend.onrender.com/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Asha",
    "last_name": "Store",
    "username": "ashaowner",
    "email": "owner@ashastore.com",
    "password": "Owner2024!",
    "role": "seller"
  }'
```

---

## ✅ SOLUTION 2: PostgreSQL (Permanent - RECOMMENDED)

### **Why PostgreSQL?**
- ✅ Database persists across deployments
- ✅ Never loses data
- ✅ Free on Render
- ✅ Professional production setup

### **Setup Steps (15 minutes):**

#### **1. Create PostgreSQL Database on Render:**
1. Go to: https://dashboard.render.com
2. Click "New +" → "PostgreSQL"
3. Name: `asha-store-db`
4. Plan: **Free** (0.1GB storage)
5. Click "Create Database"
6. **Copy the "Internal Database URL"** (starts with `postgresql://`)

#### **2. Update Backend Environment Variable:**
1. Go to your backend service on Render
2. Click "Environment"
3. Find `DATABASE_URL` variable
4. Replace with the PostgreSQL URL you copied
5. Click "Save Changes"
6. Backend will auto-redeploy (2-3 min)

#### **3. Create Your Account (ONE TIME ONLY):**
```bash
curl -X POST "https://asha-store-backend.onrender.com/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Asha",
    "last_name": "Store",
    "username": "ashaowner",
    "email": "owner@ashastore.com",
    "password": "Owner2024!",
    "role": "seller"
  }'
```

#### **4. DONE! ✅**
- Database never gets wiped
- Users persist forever
- Products persist forever
- Orders persist forever

---

## ✅ SOLUTION 3: Render Disk (Alternative)

### **Add Persistent Disk to Backend:**

1. Go to backend service → "Disks"
2. Click "Add Disk"
3. Name: `database-storage`
4. Mount Path: `/data`
5. Size: 1GB (free)
6. Click "Save"

Then update backend code to use `/data/clothing_store.db` instead of `/tmp/`

---

## 📊 COMPARISON:

| Solution | Pros | Cons | Time |
|----------|------|------|------|
| Script | ✅ Quick<br>✅ Works now | ❌ Manual after each deploy | 30 sec |
| PostgreSQL | ✅ **Permanent**<br>✅ Professional<br>✅ Never loses data | Takes 15 min setup | 15 min |
| Render Disk | ✅ Permanent<br>✅ Keep SQLite | Requires code changes | 20 min |

---

## 🎯 MY RECOMMENDATION:

**Use PostgreSQL (Solution 2)!**

Why?
- ✅ One-time 15-minute setup
- ✅ Never worry about database again
- ✅ Production-ready
- ✅ Free tier available
- ✅ Automatic backups

---

## 🚀 CURRENT STATUS:

```
✅ Your account is recreated: owner@ashastore.com
✅ Login works right now
✅ Dashboard accessible
⚠️  Will be deleted on next deployment (unless you use PostgreSQL)
```

---

## 📝 QUICK COMMANDS:

### **Check if account exists:**
```bash
curl -X POST "https://asha-store-backend.onrender.com/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@ashastore.com","password":"Owner2024!"}'
```

### **Recreate account:**
```bash
./recreate_seller_account.sh
```

### **Test dashboard:**
Open: https://react-dashboard-ashastore.vercel.app

---

## ❓ WHAT TO DO NOW:

1. **Right now:** Login works! Use dashboard ✅
2. **After each deployment:** Run `./recreate_seller_account.sh`
3. **For permanent fix:** Set up PostgreSQL (15 min, one time)

**I recommend doing PostgreSQL setup when you have 15 minutes free!**
