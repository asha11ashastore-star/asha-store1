# 🔐 How to Set Your Own Email and Password

Your clothing store now uses **FIXED CREDENTIALS** - only your email and password will work!

## 🛠️ **How to Change Credentials:**

### **1. Edit Backend File:**
Open: `/backend/simple_working_main.py`

Find lines 211-212:
```python
OWNER_EMAIL = "owner@clothingstore.com"  # CHANGE THIS TO YOUR EMAIL
OWNER_PASSWORD = "MyClothingStore2024"    # CHANGE THIS TO YOUR PASSWORD
```

### **2. Replace with Your Details:**
```python
OWNER_EMAIL = "youremail@example.com"     # Your actual email
OWNER_PASSWORD = "YourSecurePassword123"  # Your chosen password
```

### **3. Update HTML Dashboard Display:**
Open: `/frontend/seller-dashboard.html`

Find lines 245-246 and update:
```html
Email: youremail@example.com<br>
Password: YourSecurePassword123<br>
```

### **4. Restart Backend:**
```bash
cd backend
python3 simple_working_main.py
```

## 🎯 **How It Works:**

### ✅ **Only Your Credentials Work:**
- **Your Email + Your Password** = ✅ Access granted
- **Any other email/password** = ❌ Access denied
- **No registration allowed** = ❌ Only you can access

### 🔒 **Security Features:**
- ✅ **Fixed credentials** - No one else can register
- ✅ **Database auto-creation** - Your user created automatically
- ✅ **Token authentication** - Secure session management
- ✅ **Registration disabled** - Prevents unauthorized access

## 📱 **Current Settings:**

### **Default Credentials:**
```
📧 Email: owner@clothingstore.com
🔑 Password: MyClothingStore2024
```

### **Dashboard URLs:**
- **HTML Dashboard**: Open `/frontend/seller-dashboard.html` 
- **React Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:8000

## ⚡ **Quick Test:**

### ✅ **Correct Credentials:**
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "owner@clothingstore.com", "password": "MyClothingStore2024"}'
# Should return: access_token
```

### ❌ **Wrong Credentials:**
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "wrong@email.com", "password": "wrong"}'
# Should return: Invalid credentials
```

## 🎊 **You're All Set!**

**Now only YOUR email and password can access the clothing store dashboard!**

Just:
1. **Set your credentials** in the code
2. **Restart the backend** 
3. **Login with your email/password**
4. **Start uploading sarees and clothing!** 🥻

**No one else can access your store - it's completely private!** 🔐
