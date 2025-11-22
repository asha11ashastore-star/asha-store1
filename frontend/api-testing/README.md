# 🧪 API Testing Guide for Clothing Store Backend

Complete guide to test all your clothing store API endpoints.

## 🚀 Quick Start

Your backend is running at: **http://localhost:8000**
- 📖 **API Docs**: http://localhost:8000/docs  
- 🏠 **Homepage**: http://localhost:8000

## 📋 Testing Checklist

### ✅ 1. Health Check
```bash
curl http://localhost:8000/api/health
# Expected: {"status":"healthy","service":"Clothing Store API","version":"1.0.0"}
```

### ✅ 2. Register Seller Account
```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller@example.com",
    "username": "clothingstore",
    "full_name": "Clothing Store Owner", 
    "password": "password123",
    "role": "seller"
  }'
```

**Expected Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "seller@example.com",
    "username": "clothingstore",
    "full_name": "Clothing Store Owner",
    "role": "seller",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00"
  }
}
```

### ✅ 3. Login
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller@example.com",
    "password": "password123"
  }'
```

**Save the access_token from response for next requests!**

### ✅ 4. Upload Saree Product
```bash
# Replace YOUR_TOKEN with actual token from login
curl -X POST "http://localhost:8000/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Beautiful Banarasi Silk Saree",
    "description": "Handwoven Banarasi silk saree with intricate gold zari work. Perfect for weddings and special occasions.",
    "category": "saree", 
    "price": 4999,
    "stock": 15,
    "brand": "Traditional Crafts",
    "fabric": "Silk",
    "color": "Red",
    "pattern": "Woven",
    "occasion": "Wedding",
    "saree_length": 5.5,
    "blouse_piece": true,
    "work_type": "Zari Work"
  }'
```

### ✅ 5. Upload Lehenga
```bash
curl -X POST "http://localhost:8000/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Designer Bridal Lehenga",
    "description": "Stunning bridal lehenga with heavy embroidery work",
    "category": "lehenga",
    "price": 12999,
    "stock": 8,
    "brand": "Royal Collection",
    "fabric": "Georgette",
    "color": "Golden",
    "pattern": "Embroidered", 
    "occasion": "Wedding",
    "work_type": "Heavy Embroidery"
  }'
```

### ✅ 6. Upload Kurti
```bash
curl -X POST "http://localhost:8000/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Cotton Printed Kurti",
    "description": "Comfortable cotton kurti for daily wear",
    "category": "kurti",
    "price": 799,
    "stock": 25,
    "fabric": "Cotton",
    "color": "Blue",
    "size": "L",
    "pattern": "Printed",
    "occasion": "Casual"
  }'
```

### ✅ 7. View All Products
```bash
curl -X GET "http://localhost:8000/api/products"
```

### ✅ 8. Filter Products by Category
```bash
# Get only sarees
curl -X GET "http://localhost:8000/api/products?category=saree"

# Get only lehengas  
curl -X GET "http://localhost:8000/api/products?category=lehenga"

# Get only kurtis
curl -X GET "http://localhost:8000/api/products?category=kurti"
```

### ✅ 9. Get Specific Product
```bash
# Replace 1 with actual product ID
curl -X GET "http://localhost:8000/api/products/1"
```

## 🎯 Available Categories

### Traditional Indian Wear
- `saree` - Sarees
- `lehenga` - Lehengas  
- `kurti` - Kurtis
- `salwar_kameez` - Salwar Kameez
- `anarkali` - Anarkali suits
- `churidar` - Churidar
- `sharara` - Sharara
- `palazzo` - Palazzo sets

### Western Wear  
- `dress` - Dresses
- `top` - Tops
- `shirt` - Shirts
- `trouser` - Trousers
- `jeans` - Jeans
- `skirt` - Skirts
- `blouse` - Blouses

### Men's Wear
- `kurta` - Kurtas
- `sherwani` - Sherwanis
- `dhoti` - Dhotis

### Accessories
- `dupatta` - Dupattas
- `stole` - Stoles
- `scarf` - Scarves

## 🔧 Postman Collection

### Import this JSON into Postman:

```json
{
  "info": {
    "name": "Clothing Store API",
    "description": "Complete API collection for clothing store"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8000"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register Seller",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"seller@example.com\",\n  \"username\": \"clothingstore\",\n  \"full_name\": \"Clothing Store Owner\",\n  \"password\": \"password123\",\n  \"role\": \"seller\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "register"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type", 
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"seller@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Products",
      "item": [
        {
          "name": "Create Saree Product",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Beautiful Banarasi Silk Saree\",\n  \"description\": \"Handwoven Banarasi silk saree with intricate gold zari work\",\n  \"category\": \"saree\",\n  \"price\": 4999,\n  \"stock\": 15,\n  \"brand\": \"Traditional Crafts\",\n  \"fabric\": \"Silk\",\n  \"color\": \"Red\",\n  \"pattern\": \"Woven\",\n  \"occasion\": \"Wedding\",\n  \"saree_length\": 5.5,\n  \"blouse_piece\": true,\n  \"work_type\": \"Zari Work\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/products",
              "host": ["{{baseUrl}}"],
              "path": ["api", "products"]
            }
          }
        },
        {
          "name": "Get All Products", 
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/products",
              "host": ["{{baseUrl}}"],
              "path": ["api", "products"]
            }
          }
        },
        {
          "name": "Get Products by Category",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/products?category=saree",
              "host": ["{{baseUrl}}"],
              "path": ["api", "products"],
              "query": [
                {
                  "key": "category",
                  "value": "saree"
                }
              ]
            }
          }
        }
      ]
    }
  ]
}
```

## 📱 Frontend Integration Examples

### JavaScript/React Example:
```javascript
// Login and get token
const login = async () => {
  const response = await fetch('http://localhost:8000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'seller@example.com',
      password: 'password123'
    })
  });
  const data = await response.json();
  const token = data.access_token;
  
  // Store token for future requests
  localStorage.setItem('token', token);
};

// Add product with token
const addProduct = async (productData) => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:8000/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  });
  return response.json();
};
```

## 🐛 Common Issues & Solutions

### ❌ Error: "401 Unauthorized"
**Solution**: Include valid Bearer token in Authorization header

### ❌ Error: "403 Forbidden"  
**Solution**: Ensure user has 'seller' or 'admin' role

### ❌ Error: "422 Validation Error"
**Solution**: Check required fields and data types

### ❌ Error: "CORS Error" 
**Solution**: Backend has CORS enabled for all origins

## 🎉 Success! Your API is Working!

If all tests pass, your clothing store backend is **100% functional** and ready for:
- Frontend integration
- Mobile app development  
- Production deployment

**Next Steps:**
1. Use the HTML dashboard: `frontend/seller-dashboard.html`
2. Build React app: `frontend/react-dashboard/`
3. Deploy to production server
