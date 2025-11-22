from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
import os
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import secrets
import string

from app.clothing_database import SessionLocal, engine
from app.clothing_models import Base, User, ClothingProduct, CartItem, Order, OrderItem, Address, ProductImage
from app.clothing_schemas import *

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Clothing Store API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Auth utilities
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

def generate_sku() -> str:
    return ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(10))

def generate_order_number() -> str:
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    random_part = ''.join(secrets.choice(string.digits) for _ in range(4))
    return f"ORD{timestamp}{random_part}"

# Auth endpoints
@app.post("/auth/register", response_model=UserResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Create new user
    hashed_password = hash_password(user_data.password)
    db_user = User(
        email=user_data.email,
        username=user_data.username,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        phone=user_data.phone,
        hashed_password=hashed_password,
        role=user_data.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@app.post("/auth/login", response_model=TokenResponse)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

# Product endpoints
@app.get("/products", response_model=List[ClothingProductListResponse])
def get_products(
    category: Optional[str] = None,
    brand: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    query = db.query(ClothingProduct).filter(ClothingProduct.status == ProductStatus.ACTIVE)
    
    if category:
        query = query.filter(ClothingProduct.category == category)
    
    if brand:
        query = query.filter(ClothingProduct.brand.ilike(f"%{brand}%"))
    
    if min_price is not None:
        query = query.filter(ClothingProduct.price >= min_price)
    
    if max_price is not None:
        query = query.filter(ClothingProduct.price <= max_price)
    
    if search:
        query = query.filter(
            or_(
                ClothingProduct.name.ilike(f"%{search}%"),
                ClothingProduct.description.ilike(f"%{search}%"),
                ClothingProduct.brand.ilike(f"%{search}%")
            )
        )
    
    products = query.offset(skip).limit(limit).all()
    
    # Add primary image to response
    result = []
    for product in products:
        primary_image = db.query(ProductImage).filter(
            ProductImage.product_id == product.id,
            ProductImage.is_primary == True
        ).first()
        
        product_data = {
            "id": product.id,
            "name": product.name,
            "category": product.category,
            "price": product.price,
            "discounted_price": product.discounted_price,
            "brand": product.brand,
            "color": product.color,
            "primary_image": primary_image.image_url if primary_image else None,
            "created_at": product.created_at
        }
        result.append(product_data)
    
    return result

@app.get("/products/{product_id}", response_model=ClothingProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(ClothingProduct).filter(ClothingProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return product

@app.post("/products", response_model=ClothingProductResponse)
def create_product(
    product_data: ClothingProductCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role not in [UserRole.SELLER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Only sellers can create products")
    
    # Create product
    db_product = ClothingProduct(
        seller_id=current_user.id,
        sku=generate_sku(),
        **product_data.dict(exclude={'images'})
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    # Add images
    for idx, image_data in enumerate(product_data.images):
        db_image = ProductImage(
            product_id=db_product.id,
            **image_data.dict()
        )
        if idx == 0:  # First image is primary
            db_image.is_primary = True
        db.add(db_image)
    
    db.commit()
    db.refresh(db_product)
    
    return db_product

# Cart endpoints
@app.get("/cart", response_model=List[CartItemResponse])
def get_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    return cart_items

@app.post("/cart", response_model=CartItemResponse)
def add_to_cart(
    cart_data: CartItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if product exists
    product = db.query(ClothingProduct).filter(ClothingProduct.id == cart_data.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if item already in cart
    existing_item = db.query(CartItem).filter(
        CartItem.user_id == current_user.id,
        CartItem.product_id == cart_data.product_id,
        CartItem.size == cart_data.size
    ).first()
    
    if existing_item:
        existing_item.quantity += cart_data.quantity
        db.commit()
        db.refresh(existing_item)
        return existing_item
    
    # Create new cart item
    cart_item = CartItem(
        user_id=current_user.id,
        **cart_data.dict()
    )
    db.add(cart_item)
    db.commit()
    db.refresh(cart_item)
    
    return cart_item

@app.delete("/cart/{item_id}")
def remove_from_cart(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart_item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.user_id == current_user.id
    ).first()
    
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    db.delete(cart_item)
    db.commit()
    
    return {"message": "Item removed from cart"}

# Order endpoints
@app.post("/orders", response_model=OrderResponse)
def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate address
    address = db.query(Address).filter(
        Address.id == order_data.delivery_address_id,
        Address.user_id == current_user.id
    ).first()
    
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    
    # Calculate totals
    subtotal = 0
    order_items_data = []
    
    for item in order_data.items:
        product = db.query(ClothingProduct).filter(ClothingProduct.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        
        if product.stock_quantity < item.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}")
        
        item_total = product.price * item.quantity
        subtotal += item_total
        
        order_items_data.append({
            "product": product,
            "quantity": item.quantity,
            "size": item.size,
            "unit_price": product.price,
            "total_price": item_total
        })
    
    # Create order
    shipping_amount = 100  # Fixed shipping
    total_amount = subtotal + shipping_amount
    
    db_order = Order(
        order_number=generate_order_number(),
        buyer_id=current_user.id,
        delivery_address_id=order_data.delivery_address_id,
        subtotal=subtotal,
        shipping_amount=shipping_amount,
        total_amount=total_amount,
        notes=order_data.notes
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Create order items
    for item_data in order_items_data:
        db_order_item = OrderItem(
            order_id=db_order.id,
            product_id=item_data["product"].id,
            seller_id=item_data["product"].seller_id,
            quantity=item_data["quantity"],
            size=item_data["size"],
            unit_price=item_data["unit_price"],
            total_price=item_data["total_price"]
        )
        db.add(db_order_item)
        
        # Update stock
        item_data["product"].stock_quantity -= item_data["quantity"]
    
    db.commit()
    db.refresh(db_order)
    
    return db_order

@app.get("/orders", response_model=List[OrderResponse])
def get_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.buyer_id == current_user.id).order_by(Order.created_at.desc()).all()
    return orders

@app.get("/orders/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.buyer_id == current_user.id
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return order

# Address endpoints
@app.post("/addresses", response_model=AddressResponse)
def create_address(
    address_data: AddressCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # If this is set as default, unset other defaults
    if address_data.is_default:
        db.query(Address).filter(Address.user_id == current_user.id).update({"is_default": False})
    
    db_address = Address(
        user_id=current_user.id,
        **address_data.dict()
    )
    db.add(db_address)
    db.commit()
    db.refresh(db_address)
    
    return db_address

@app.get("/addresses", response_model=List[AddressResponse])
def get_addresses(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    addresses = db.query(Address).filter(Address.user_id == current_user.id).all()
    return addresses

# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "clothing-store-api"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
