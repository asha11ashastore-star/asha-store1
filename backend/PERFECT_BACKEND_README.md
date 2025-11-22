# 🛍️ Perfect Clothing Store Backend

A production-ready, feature-complete backend for clothing e-commerce with full payment integration, optimized for sarees and traditional Indian clothing.

## ✨ Key Features

### 🎯 Core E-commerce
- **Complete Product Management** - Detailed attributes for sarees, lehengas, kurtis, etc.
- **Multi-variant Support** - Size, color, and price variations per product
- **Advanced Search & Filters** - By category, fabric, price, occasion, pattern
- **Image Management** - Multiple images per product with automatic thumbnail generation
- **Inventory Tracking** - Real-time stock management per variant

### 💳 Payment Integration
- **Razorpay Integration** - Complete payment gateway setup
- **Multiple Payment Methods** - UPI, Cards, Net Banking, Wallets, COD
- **Secure Payment Verification** - Signature verification for all transactions
- **Automatic Order Processing** - Order confirmation on successful payment

### 👕 Clothing-Specific Features
- **Saree Attributes** - Length, blouse piece, work type, border type
- **Fabric Types** - 16+ fabric options (Silk, Cotton, Georgette, Banarasi, etc.)
- **Categories** - 20+ clothing categories covering traditional and western wear
- **Care Instructions** - Washing and maintenance guidelines
- **Size Charts** - Support for standard and custom sizing

### 🏪 Seller Features
- **Multi-vendor Support** - Multiple sellers can list products
- **Seller Dashboard** - Sales analytics, order management, inventory
- **Commission System** - Automatic platform fee calculation
- **Bank Details** - Secure storage for payouts

### 🛒 Shopping Features
- **Smart Cart** - Variant-aware cart with stock validation
- **Wishlist** - Save products for later
- **Reviews & Ratings** - Customer feedback with images
- **Coupons** - Percentage and fixed discounts with restrictions
- **Free Shipping** - Automatic on orders above ₹999

### 📦 Order Management
- **Order Tracking** - Real-time status updates
- **Multiple Addresses** - Save and manage delivery addresses
- **GST Invoice** - Automatic tax calculation (18% GST)
- **Return Management** - 7-day return policy

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r perfect_requirements.txt
```

### 2. Setup Environment
```bash
cp .env.perfect .env
# Edit .env with your Razorpay keys and database
```

### 3. Run the Server
```bash
python perfect_main.py
```

### 4. Access API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📝 API Endpoints

### Authentication
```
POST /api/auth/register     - Register new user/seller
POST /api/auth/login        - Login with email/phone
```

### Products
```
GET  /api/products          - List products with filters
GET  /api/products/{id}     - Get product details
POST /api/products          - Create product (seller only)
PUT  /api/products/{id}     - Update product
DELETE /api/products/{id}   - Delete product
```

### Cart & Wishlist
```
GET  /api/cart              - View cart
POST /api/cart/add          - Add to cart
PUT  /api/cart/update       - Update quantity
DELETE /api/cart/{id}       - Remove from cart
```

### Orders & Payments
```
POST /api/orders/create     - Create order
GET  /api/orders            - List user orders
GET  /api/orders/{id}       - Order details
POST /api/payments/verify   - Verify Razorpay payment
```

### Seller Dashboard
```
GET  /api/seller/dashboard  - Sales statistics
GET  /api/seller/orders     - Seller's orders
GET  /api/seller/products   - Seller's products
```

## 💾 Database Schema

### Key Tables
- **users** - Customers and sellers with roles
- **products** - Detailed product information
- **product_variants** - Size/color combinations
- **product_images** - Multiple images per product
- **cart_items** - User shopping cart
- **orders** - Order information
- **order_items** - Individual order line items
- **payments** - Payment records with gateway details
- **reviews** - Product reviews and ratings
- **addresses** - User delivery addresses
- **coupons** - Discount codes

## 🔧 Configuration

### Razorpay Setup
1. Create account at https://dashboard.razorpay.com
2. Get API keys from Dashboard → Settings → API Keys
3. Add keys to `.env` file:
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxx
```

### Database Options
- **SQLite** (Default) - No setup needed, perfect for development
- **PostgreSQL** - Production recommended
```env
DATABASE_URL=postgresql://user:password@localhost:5432/clothing_db
```

## 📤 Product Upload Example

### Using API (with images)
```python
import requests

# Login first
login = requests.post("http://localhost:8000/api/auth/login", json={
    "email_or_phone": "seller@example.com",
    "password": "password123"
})
token = login.json()["access_token"]

# Upload product with images
files = [
    ('images', open('saree1.jpg', 'rb')),
    ('images', open('saree2.jpg', 'rb')),
    ('images', open('saree3.jpg', 'rb'))
]

data = {
    'name': 'Banarasi Silk Saree',
    'description': 'Beautiful handwoven Banarasi silk saree',
    'category': 'saree',
    'mrp': 5999,
    'selling_price': 4499,
    'total_stock': 10,
    'fabric': 'silk',
    'pattern': 'Woven',
    'occasion': 'Wedding',
    'saree_length': 5.5,
    'blouse_piece': True,
    'blouse_length': 0.8,
    'work_type': 'Zari Work',
    'variants': json.dumps([
        {"color": "Red", "color_code": "#FF0000", "stock_quantity": 5},
        {"color": "Blue", "color_code": "#0000FF", "stock_quantity": 5}
    ])
}

response = requests.post(
    "http://localhost:8000/api/products",
    headers={"Authorization": f"Bearer {token}"},
    data=data,
    files=files
)
```

## 🎨 Frontend Integration

### Cart Management
```javascript
// Add to cart
const addToCart = async (productId, variantId, quantity) => {
    const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            product_id: productId,
            variant_id: variantId,
            quantity: quantity
        })
    });
    return response.json();
};
```

### Payment Integration
```javascript
// Create order and get Razorpay order ID
const createOrder = async (addressId, paymentMethod) => {
    const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            address_id: addressId,
            payment_method: paymentMethod
        })
    });
    const order = await response.json();
    
    // Initialize Razorpay
    if (paymentMethod !== 'cod') {
        const options = {
            key: 'YOUR_RAZORPAY_KEY_ID',
            amount: order.total_amount * 100,
            currency: 'INR',
            order_id: order.razorpay_order_id,
            name: 'Your Store Name',
            handler: function(response) {
                // Verify payment
                verifyPayment(response);
            }
        };
        const rzp = new Razorpay(options);
        rzp.open();
    }
};
```

## 🐳 Docker Deployment

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/clothing
      - RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID}
      - RAZORPAY_KEY_SECRET=${RAZORPAY_KEY_SECRET}
    volumes:
      - ./uploads:/app/uploads
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: clothing
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 📊 Features Comparison

| Feature | Basic Backend | **Perfect Backend** |
|---------|--------------|-------------------|
| Product Management | ✅ Basic | ✅ **Advanced with variants** |
| Image Upload | ❌ | ✅ **Multiple with thumbnails** |
| Payment Gateway | ❌ | ✅ **Razorpay integrated** |
| Search & Filter | Basic | ✅ **Advanced multi-field** |
| Seller Dashboard | ❌ | ✅ **Complete analytics** |
| Cart Management | Basic | ✅ **Variant-aware** |
| Order Tracking | ❌ | ✅ **Real-time status** |
| Reviews & Ratings | ❌ | ✅ **With images** |
| Coupons | ❌ | ✅ **Flexible discounts** |
| Stock Management | Basic | ✅ **Per variant tracking** |

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt encryption
- **Input Validation** - Pydantic schemas
- **SQL Injection Protection** - SQLAlchemy ORM
- **CORS Configuration** - Controlled origins
- **File Upload Validation** - Type and size checks
- **Payment Signature Verification** - Razorpay security

## 📞 Support

For issues or questions, check the API documentation at `/docs` after starting the server.

## 📜 License

MIT License - Use freely for your clothing store!
