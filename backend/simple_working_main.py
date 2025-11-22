from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile, Form
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Enum, create_engine, Numeric
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from sqlalchemy.sql import func
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, timedelta
from decimal import Decimal
from jose import JWTError, jwt
import hashlib
import enum
import os
import secrets
import string
import aiofiles
import uuid
from pathlib import Path

# Database setup
DATABASE_URL = "sqlite:///./clothing_store.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Enums
class UserRole(str, enum.Enum):
    OWNER = "owner"  # Only one role needed

class ClothingCategory(str, enum.Enum):
    # Traditional Indian Wear
    SAREE = "saree"
    LEHENGA = "lehenga"
    KURTI = "kurti"
    SALWAR_KAMEEZ = "salwar_kameez"
    ANARKALI = "anarkali"
    CHURIDAR = "churidar"
    SHARARA = "sharara"
    PALAZZO = "palazzo"
    
    # Western Wear
    DRESS = "dress"
    TOP = "top"
    SHIRT = "shirt"
    TROUSER = "trouser"
    JEANS = "jeans"
    SKIRT = "skirt"
    BLOUSE = "blouse"
    
    # Men's Wear
    KURTA = "kurta"
    SHERWANI = "sherwani"
    DHOTI = "dhoti"
    
    # Accessories
    DUPATTA = "dupatta"
    STOLE = "stole"
    SCARF = "scarf"

class ProductStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    OUT_OF_STOCK = "out_of_stock"

class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

# Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.OWNER, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    products = relationship("Product", back_populates="seller")
    orders = relationship("Order", back_populates="customer")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(Enum(ClothingCategory), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    stock = Column(Integer, default=0, nullable=False)
    status = Column(Enum(ProductStatus), default=ProductStatus.ACTIVE, nullable=False)
    brand = Column(String(100), nullable=True)
    fabric = Column(String(100), nullable=True)  # Cotton, Silk, Georgette, etc.
    color = Column(String(50), nullable=True)
    size = Column(String(20), nullable=True)  # S, M, L, XL, Free Size
    pattern = Column(String(100), nullable=True)  # Printed, Embroidered, Plain
    occasion = Column(String(100), nullable=True)  # Casual, Party, Wedding, Festival
    # Saree specific fields
    saree_length = Column(Numeric(5, 2), nullable=True)  # in meters
    blouse_piece = Column(Boolean, default=False, nullable=True)
    work_type = Column(String(200), nullable=True)  # Zari, Embroidery, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    seller = relationship("User", back_populates="products")

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    total_amount = Column(Numeric(10, 2), nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING, nullable=False)
    
    # Customer details
    customer_name = Column(String(100), nullable=False)
    customer_phone = Column(String(15), nullable=False)
    customer_email = Column(String(255), nullable=False)
    
    # Delivery address
    delivery_address = Column(Text, nullable=False)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    pincode = Column(String(10), nullable=False)
    
    # Payment details
    payment_method = Column(String(50), nullable=False, default="COD")
    payment_status = Column(String(50), nullable=False, default="PENDING")
    razorpay_order_id = Column(String(255), nullable=True)
    razorpay_payment_id = Column(String(255), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    customer = relationship("User", back_populates="orders")
    product = relationship("Product")

# File upload setup
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
(UPLOAD_DIR / "products").mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# Create tables
Base.metadata.create_all(bind=engine)

# Schemas - No UserCreate needed since registration is disabled

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: str
    role: UserRole
    is_active: bool
    created_at: datetime
    
    model_config = {"from_attributes": True}

class ProductCreate(BaseModel):
    name: str
    description: str
    category: ClothingCategory
    price: float
    stock: int
    brand: Optional[str] = None
    fabric: Optional[str] = None  # Cotton, Silk, Georgette, etc.
    color: Optional[str] = None
    size: Optional[str] = None  # S, M, L, XL, Free Size
    pattern: Optional[str] = None  # Printed, Embroidered, Plain
    occasion: Optional[str] = None  # Casual, Party, Wedding, Festival
    # Saree specific fields
    saree_length: Optional[float] = None  # in meters
    blouse_piece: Optional[bool] = False
    work_type: Optional[str] = None  # Zari, Embroidery, etc.

class ProductResponse(BaseModel):
    id: int
    name: str
    description: str
    category: ClothingCategory
    price: Decimal
    stock: int
    status: ProductStatus
    brand: Optional[str]
    fabric: Optional[str]
    color: Optional[str]
    size: Optional[str]
    pattern: Optional[str]
    occasion: Optional[str]
    # Saree specific fields
    saree_length: Optional[Decimal]
    blouse_piece: Optional[bool]
    work_type: Optional[str]
    created_at: datetime
    seller: UserResponse
    
    model_config = {"from_attributes": True}

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class OrderCreate(BaseModel):
    product_id: int
    quantity: int = 1
    customer_name: str
    customer_phone: str
    customer_email: EmailStr
    delivery_address: str
    city: str
    state: str
    pincode: str
    payment_method: str = "COD"

class OrderResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    total_amount: Decimal
    status: OrderStatus
    customer_name: str
    customer_phone: str
    customer_email: str
    delivery_address: str
    city: str
    state: str
    pincode: str
    payment_method: str
    payment_status: str
    created_at: datetime
    product: ProductResponse
    
    model_config = {"from_attributes": True}

# FastAPI app
app = FastAPI(
    title="Pure Clothing Store API",
    description="Complete clothing e-commerce backend - Sarees, Traditional & Western Wear ONLY",
    version="1.0.0"
)

# CORS - Fixed for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Mount static files for image serving
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Security - Fixed Owner Credentials
OWNER_EMAIL = "owner@clothingstore.com"  # CHANGE THIS TO YOUR EMAIL
OWNER_PASSWORD = "MyClothingStore2024"    # CHANGE THIS TO YOUR PASSWORD

SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

security = HTTPBearer()

# Dependencies
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Utility functions
def hash_password(password: str) -> str:
    # Use SHA256 for simplicity
    salt = "clothing_store_salt_2024"
    return hashlib.sha256((password + salt).encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

# File upload utilities
def validate_image_file(file: UploadFile):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    return file_ext

async def save_upload_file(file: UploadFile, destination: Path):
    async with aiofiles.open(destination, 'wb') as f:
        content = await file.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large. Max size: 10MB")
        await f.write(content)

# Endpoints
@app.post("/api/auth/register")
async def register():
    # Registration completely disabled for single seller system
    raise HTTPException(
        status_code=403, 
        detail="Registration disabled. This is a single owner system. Use fixed login credentials only."
    )

@app.post("/api/auth/login", response_model=AuthResponse)
async def login(login_data: UserLogin, db: Session = Depends(get_db)):
    # Check against fixed owner credentials
    if login_data.email != OWNER_EMAIL or login_data.password != OWNER_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create or get the owner user
    owner_user = db.query(User).filter(User.email == OWNER_EMAIL).first()
    if not owner_user:
        # Create the owner user if doesn't exist
        owner_user = User(
            email=OWNER_EMAIL,
            username="owner",
            full_name="Store Owner",
            hashed_password=hash_password(OWNER_PASSWORD),
            role=UserRole.OWNER,
            is_active=True
        )
        db.add(owner_user)
        db.commit()
        db.refresh(owner_user)
    
    # Create token
    access_token = create_access_token(data={"sub": owner_user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": owner_user
    }

@app.get("/api/products", response_model=List[ProductResponse])
async def get_products(
    category: Optional[ClothingCategory] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(Product.status == ProductStatus.ACTIVE)
    
    if category:
        query = query.filter(Product.category == category)
    
    products = query.all()
    return products

@app.get("/api/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.post("/api/products", response_model=ProductResponse)
async def create_product(
    product_data: ProductCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Only the owner can add products
    if current_user.role != UserRole.OWNER:
        raise HTTPException(status_code=403, detail="Owner access required")
    
    db_product = Product(
        seller_id=current_user.id,
        **product_data.dict()
    )
    
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    return db_product

@app.post("/api/products-with-images")
async def create_product_with_images(
    name: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    price: float = Form(...),
    stock: int = Form(...),
    brand: Optional[str] = Form(None),
    fabric: Optional[str] = Form(None),
    color: Optional[str] = Form(None),
    size: Optional[str] = Form(None),
    pattern: Optional[str] = Form(None),
    occasion: Optional[str] = Form(None),
    saree_length: Optional[float] = Form(None),
    blouse_piece: bool = Form(False),
    work_type: Optional[str] = Form(None),
    images: List[UploadFile] = File([]),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Only the owner can upload products with images
    if current_user.role != UserRole.OWNER:
        raise HTTPException(status_code=403, detail="Owner access required")
    
    # Validate images
    image_paths = []
    if images and images[0].filename:  # Check if files were actually uploaded
        for image in images:
            if len(images) > 10:
                raise HTTPException(status_code=400, detail="Maximum 10 images allowed")
            
            file_ext = validate_image_file(image)
            
            # Generate unique filename
            file_id = str(uuid.uuid4())
            filename = f"{file_id}{file_ext}"
            file_path = UPLOAD_DIR / "products" / filename
            
            # Save file
            await save_upload_file(image, file_path)
            image_paths.append(f"/uploads/products/{filename}")
    
    # Create product
    db_product = Product(
        seller_id=current_user.id,
        name=name,
        description=description,
        category=category,
        price=price,
        stock=stock,
        brand=brand,
        fabric=fabric,
        color=color,
        size=size,
        pattern=pattern,
        occasion=occasion,
        saree_length=saree_length,
        blouse_piece=blouse_piece,
        work_type=work_type
    )
    
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    return {
        "message": "Product created successfully",
        "product": db_product,
        "images": image_paths
    }

# Order endpoints
@app.post("/api/orders", response_model=OrderResponse)
async def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db)
):
    # Get the product
    product = db.query(Product).filter(Product.id == order_data.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check stock
    if product.stock < order_data.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")
    
    # Calculate total amount
    total_amount = product.price * order_data.quantity
    
    # Create customer user if doesn't exist
    customer = db.query(User).filter(User.email == order_data.customer_email).first()
    if not customer:
        customer = User(
            email=order_data.customer_email,
            username=order_data.customer_email.split('@')[0],
            full_name=order_data.customer_name,
            hashed_password=hash_password("temp_password"),
            role=UserRole.OWNER,  # Temporary
            is_active=True
        )
        db.add(customer)
        db.commit()
        db.refresh(customer)
    
    # Create order
    db_order = Order(
        customer_id=customer.id,
        product_id=order_data.product_id,
        quantity=order_data.quantity,
        total_amount=total_amount,
        customer_name=order_data.customer_name,
        customer_phone=order_data.customer_phone,
        customer_email=order_data.customer_email,
        delivery_address=order_data.delivery_address,
        city=order_data.city,
        state=order_data.state,
        pincode=order_data.pincode,
        payment_method=order_data.payment_method
    )
    
    # Update product stock
    product.stock -= order_data.quantity
    
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    return db_order

@app.get("/api/orders", response_model=List[OrderResponse])
async def get_all_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Only owner can see all orders
    if current_user.role != UserRole.OWNER:
        raise HTTPException(status_code=403, detail="Owner access required")
    
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    return orders

@app.put("/api/orders/{order_id}/status")
async def update_order_status(
    order_id: int,
    status: OrderStatus,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Only owner can update order status
    if current_user.role != UserRole.OWNER:
        raise HTTPException(status_code=403, detail="Owner access required")
    
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = status
    db.commit()
    
    return {"message": f"Order status updated to {status.value}"}

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Clothing Store API",
        "version": "1.0.0"
    }

@app.get("/")
async def root():
    return {
        "message": "Clothing Store API is running!",
        "docs": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
