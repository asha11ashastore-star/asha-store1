# Clothing Store Backend API

A simple FastAPI backend specifically designed for a clothing e-commerce website.

## Features

- 👤 User authentication (register, login)
- 👔 Clothing products management
- 🛒 Shopping cart functionality
- 📦 Order management
- 📍 Address management
- 🔍 Product search and filtering

## Clothing Categories

- Shirts
- Pants
- Dresses
- Jackets
- Shoes
- Accessories

## Quick Start

1. **Install Dependencies**
   ```bash
   pip install -r clothing_requirements.txt
   ```

2. **Set up Environment**
   ```bash
   cp .env.clothing .env
   # Edit .env with your database credentials
   ```

3. **Run the Server**
   ```bash
   python clothing_main.py
   ```

4. **Access API Documentation**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Products
- `GET /products` - List all products (with filters)
- `GET /products/{id}` - Get product details
- `POST /products` - Create product (seller only)

### Cart
- `GET /cart` - Get user cart
- `POST /cart` - Add item to cart
- `DELETE /cart/{item_id}` - Remove item from cart

### Orders
- `POST /orders` - Create order
- `GET /orders` - Get user orders
- `GET /orders/{id}` - Get order details

### Addresses
- `GET /addresses` - Get user addresses
- `POST /addresses` - Create new address

## Database Models

### ClothingProduct
- Basic product info (name, description, price)
- Clothing-specific fields (size, color, material, gender)
- Stock management
- Multiple product images

### User
- Authentication and profile
- Role-based access (buyer/seller/admin)

### Order & Cart
- Order management with items
- Cart functionality with size selection

## Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/clothing_db
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Database Setup

```sql
-- Create PostgreSQL database
CREATE DATABASE clothing_db;
```

The tables will be created automatically when you run the application.

## Usage Examples

### Register a new user
```bash
curl -X POST "http://localhost:8000/auth/register" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "user@example.com",
       "username": "fashionista",
       "first_name": "Jane",
       "last_name": "Doe",
       "password": "password123",
       "role": "buyer"
     }'
```

### Create a clothing product
```bash
curl -X POST "http://localhost:8000/products" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Cotton T-Shirt",
       "description": "Comfortable cotton t-shirt",
       "category": "shirts",
       "price": 29.99,
       "stock_quantity": 100,
       "brand": "FashionBrand",
       "color": "Blue",
       "material": "Cotton",
       "gender": "Unisex",
       "sizes_available": "[\"S\", \"M\", \"L\", \"XL\"]"
     }'
```

## License

MIT License
