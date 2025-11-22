# 🏗️ Aशā Store - System Architecture

## How Products Sync Between Seller Dashboard & Customer Website

---

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR SYSTEM ARCHITECTURE                  │
└─────────────────────────────────────────────────────────────┘

         ASHA (Owner)                    CUSTOMERS
              │                               │
              ↓                               ↓
     ┌─────────────────┐            ┌─────────────────┐
     │ SELLER DASHBOARD│            │ CUSTOMER WEBSITE│
     │  localhost:3000 │            │  localhost:3001 │
     │   (React App)   │            │   (Next.js App) │
     └────────┬────────┘            └────────┬────────┘
              │                               │
              │         API CALLS             │
              │    ┌──────────────────┐      │
              └────┤  BACKEND API     ├──────┘
                   │  localhost:8000  │
                   │  (FastAPI)       │
                   └────────┬─────────┘
                            │
                            ↓
                   ┌─────────────────┐
                   │    DATABASE     │
                   │   (PostgreSQL)  │
                   │  shopall.db     │
                   └─────────────────┘
```

---

## 🎯 How It Works (No Sync Server Needed!)

### **Single Source of Truth: Backend API**

Your system uses a **shared backend API** (localhost:8000) as the **single source of truth**. Both the seller dashboard and customer website connect to the SAME database through this API.

---

## 📝 Step-by-Step: Product Upload Flow

### **Step 1: Asha Adds Product (Seller Dashboard)**

```
1. Asha opens Seller Dashboard (localhost:3000)
2. Logs in: asha@ashastore.com / AshaStore2024!
3. Clicks "Add Product"
4. Fills product details:
   - Name: Bnarasi Saree
   - Price: ₹5,000
   - Category: Silk Saree
   - Stock: 10
   - Images: Upload photos
5. Clicks "Create Product"
```

**What Happens:**
```javascript
// Seller Dashboard makes API call:
POST http://localhost:8000/api/v1/products/

{
  "name": "Bnarasi Saree",
  "price": 5000,
  "category": "silk_saree",
  "stock_quantity": 10,
  "status": "active"
}
```

**Backend Response:**
```javascript
// Backend saves to database
// Returns created product:
{
  "id": 8,
  "name": "Bnarasi Saree",
  "price": 5000,
  "seller_id": 1,
  "status": "active",
  "created_at": "2025-11-22T..."
}
```

**Database:** Product is now stored in PostgreSQL!

---

### **Step 2: Product Appears on Customer Website (Automatic!)**

```
1. Customer visits website (localhost:3001)
2. Clicks "Collections" or "Sarees"
3. Website loads products
```

**What Happens:**
```javascript
// Customer Website makes API call to SAME backend:
GET http://localhost:8000/api/v1/products/

// Backend returns products from database:
{
  "items": [
    {
      "id": 8,
      "name": "Bnarasi Saree",
      "price": 5000,
      "status": "active"
    }
  ]
}
```

**Result:** Product appears on customer website instantly! ✅

---

## 🔄 Real-Time Sync Explanation

### **NO Separate Sync Server Needed!**

Both apps connect to the **same database** through the **same API**:

```
Seller Dashboard  ────┐
                      ├──→  Backend API  ──→  Database
Customer Website  ────┘
```

**How Sync Works:**

1. **Seller Dashboard:**
   - Asha adds/edits product
   - Sends data to Backend API
   - Backend saves to Database

2. **Customer Website:**
   - Customer visits page
   - Requests data from Backend API
   - Backend reads from Database (same data!)
   - Shows products to customer

3. **Result:**
   - Both see the SAME data
   - No delay, no sync needed
   - Single source of truth!

---

## 🗄️ Database Architecture

### **Single PostgreSQL Database**

```sql
-- products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL(10, 2),
    seller_id INTEGER,
    status VARCHAR(50),
    stock_quantity INTEGER,
    created_at TIMESTAMP
);

-- When Asha adds product:
INSERT INTO products (...) VALUES (...);

-- When customer views products:
SELECT * FROM products WHERE status = 'active';
```

**Both apps read from the SAME table!**

---

## 🚀 Complete Flow Example

### **Scenario: Asha Adds New Saree**

**Time: 2:00 PM**
```
1. Asha (Seller Dashboard):
   - Creates "Red Banarasi Saree"
   - Uploads 3 images
   - Sets price: ₹8,000
   - Sets stock: 5
   - Clicks "Save"

2. Backend API:
   - Receives POST request
   - Validates data
   - Saves to database
   - Returns success

3. Database:
   - INSERT INTO products (...)
   - Product ID: 12
   - Status: active
```

**Time: 2:01 PM (1 minute later)**
```
4. Customer (Website):
   - Visits "Sarees" page
   - Website makes: GET /api/v1/products/

5. Backend API:
   - Receives GET request
   - Queries database
   - Returns all active products

6. Customer Website:
   - Receives product list
   - Displays "Red Banarasi Saree" ✅
   - Shows price: ₹8,000
   - Shows stock: 5 pieces
```

**Result:** Product visible to customers immediately! 🎉

---

## 💾 Where Everything Lives

### **Backend API (Port 8000)**
```
Location: /Users/divyanshurathore/shopall/backend/
Main File: main.py
Database: PostgreSQL (shopall.db)

Endpoints:
- POST   /api/v1/products/       ← Seller adds product
- GET    /api/v1/products/       ← Customer views products
- PUT    /api/v1/products/{id}   ← Seller edits product
- DELETE /api/v1/products/{id}   ← Seller deletes product
```

### **Seller Dashboard (Port 3000)**
```
Location: /Users/divyanshurathore/shopall/frontend/react-dashboard/
Framework: React
API Base: http://localhost:8000

Features:
- Add products
- Edit products
- Upload images
- Manage inventory
```

### **Customer Website (Port 3001)**
```
Location: /Users/divyanshurathore/shopall/frontend/customer-website/
Framework: Next.js
API Base: http://localhost:8000

Features:
- Browse products
- View product details
- Add to cart
- Checkout
```

---

## 🔧 Technical Implementation

### **1. API Service (Both Apps)**

**Seller Dashboard:**
```javascript
// frontend/react-dashboard/src/services/api.js
const API_BASE_URL = 'http://localhost:8000'

const productsAPI = {
  create: async (productData) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/products/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    })
    return response.json()
  }
}
```

**Customer Website:**
```javascript
// frontend/customer-website/services/api.js
const API_BASE_URL = 'http://localhost:8000'

class ApiService {
  async getAllProducts() {
    const response = await fetch(`${API_BASE_URL}/api/v1/products/`)
    return response.json()
  }
}
```

**Same Backend URL! Same Data!**

---

### **2. Backend API Endpoints**

```python
# backend/app/routers/products.py

@router.post("/products/")
async def create_product(
    product: ProductCreate,
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Seller creates product - saves to database"""
    db_product = Product(**product.dict(), seller_id=current_seller.id)
    db.add(db_product)
    db.commit()
    return db_product

@router.get("/products/")
async def get_products(db: Session = Depends(get_db)):
    """Anyone can view products - reads from database"""
    products = db.query(Product).filter(Product.status == "active").all()
    return {"items": products}
```

**Same database queries! Same data!**

---

## 🌐 Deployment Architecture (Production)

### **Current (Development):**
```
Seller Dashboard:  localhost:3000
Customer Website:  localhost:3001
Backend API:       localhost:8000
Database:          PostgreSQL (local)
```

### **Production (When You Deploy):**
```
Seller Dashboard:  https://admin.ashastore.com
Customer Website:  https://ashastore.com
Backend API:       https://api.ashastore.com
Database:          PostgreSQL (cloud - e.g., AWS RDS)
```

**Still the same architecture!**
- Both apps connect to same API
- API connects to same database
- No sync server needed!

---

## ✅ Advantages of This Architecture

### **1. Real-Time Updates**
- ✅ Asha adds product → Immediately available
- ✅ Asha updates price → Customers see new price
- ✅ Asha marks out of stock → Product hidden

### **2. Single Source of Truth**
- ✅ One database
- ✅ No data conflicts
- ✅ Always consistent

### **3. Simple & Reliable**
- ✅ No complex sync logic
- ✅ No duplicate data
- ✅ Easy to maintain

### **4. Scalable**
- ✅ Add more features easily
- ✅ Handle more traffic
- ✅ Deploy anywhere

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  PRODUCT LIFECYCLE                      │
└─────────────────────────────────────────────────────────┘

STEP 1: CREATE
──────────────
Asha (Seller Dashboard)
    │
    │ POST /api/v1/products/
    ↓
Backend API
    │
    │ INSERT INTO products
    ↓
PostgreSQL Database
    │
    │ [Product Saved: ID=8, Name="Saree"]
    ↓
✅ Product Created


STEP 2: VIEW
──────────────
Customer (Website)
    │
    │ GET /api/v1/products/
    ↓
Backend API
    │
    │ SELECT * FROM products WHERE status='active'
    ↓
PostgreSQL Database
    │
    │ [Returns: ID=8, Name="Saree"]
    ↓
Backend API
    │
    │ JSON Response
    ↓
Customer Website
    │
    │ Display Product Card
    ↓
✅ Customer Sees Product


STEP 3: UPDATE
──────────────
Asha (Seller Dashboard)
    │
    │ PUT /api/v1/products/8
    │ (New Price: ₹6,000)
    ↓
Backend API
    │
    │ UPDATE products SET price=6000 WHERE id=8
    ↓
PostgreSQL Database
    │
    │ [Price Updated]
    ↓
✅ Product Updated

Customer refreshes page
    │
    │ GET /api/v1/products/
    ↓
Backend API
    │
    │ SELECT * FROM products
    ↓
✅ Customer Sees New Price: ₹6,000
```

---

## 🎯 Summary

**Q: Do I need a sync server?**
**A: NO! ❌**

**Q: How do products appear on customer website?**
**A: Both apps use the SAME backend API and database! ✅**

**Q: Is it real-time?**
**A: Yes! As soon as Asha adds/edits a product, it's in the database. When a customer visits the page, they see the latest data. ✅**

**Q: What if many customers browse at once?**
**A: The backend API handles all requests. Database can handle thousands of concurrent reads. ✅**

**Q: Do I need to do anything special?**
**A: No! Just keep all three running:
   - Backend API (localhost:8000)
   - Seller Dashboard (localhost:3000)
   - Customer Website (localhost:3001)
   That's it! ✅**

---

## 🚀 Running The System

```bash
# Terminal 1 - Backend API
cd backend
python -m uvicorn app.main:app --reload --port 8000

# Terminal 2 - Seller Dashboard
cd frontend/react-dashboard
npm start  # Runs on port 3000

# Terminal 3 - Customer Website
cd frontend/customer-website
npm run dev  # Runs on port 3001
```

**All three connect to same database!**
**Products sync automatically!**
**No extra configuration needed!** ✅

---

## 📚 Key Concepts

**1. REST API:**
- Backend provides endpoints
- Both apps call these endpoints
- Standard HTTP requests (GET, POST, PUT, DELETE)

**2. Stateless:**
- Each request is independent
- No session data on server
- Token-based authentication

**3. Client-Server:**
- Frontend (clients): Seller Dashboard + Customer Website
- Backend (server): API + Database
- Clear separation of concerns

**4. Single Database:**
- PostgreSQL stores all data
- Products, users, orders, images
- Both apps read/write same data

---

**Your system is already perfectly designed!** 🎉

**No sync server needed - everything works through the shared backend API!** ✅
