from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile, Form
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Enum, create_engine, Numeric
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.sql import func
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, timedelta
from decimal import Decimal
from jose import JWTError, jwt
import hashlib
import enum
import os
import aiofiles
import uuid
from pathlib import Path

# Database setup
DATABASE_URL = "sqlite:///./single_seller_store.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Enums
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

# Models - No User table needed, just Products
class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
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

# File upload setup
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
(UPLOAD_DIR / "products").mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# Create tables
Base.metadata.create_all(bind=engine)

# Schemas
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
    
    model_config = {"from_attributes": True}

class LoginRequest(BaseModel):
    password: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    message: str

# FastAPI app
app = FastAPI(
    title="Single Owner Clothing Store API",
    description="Simple clothing store backend for single owner - No multiple sellers",
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

# Security - Single password for owner
OWNER_PASSWORD = "clothing_store_2024"  # Change this!
SECRET_KEY = "single-owner-secret-key-2024"
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
def create_access_token():
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": "owner", "exp": expire}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username != "owner":
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return {"username": "owner"}

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
@app.post("/api/auth/login", response_model=AuthResponse)
async def login(login_data: LoginRequest):
    if login_data.password != OWNER_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")
    
    access_token = create_access_token()
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "message": "Welcome, Store Owner!"
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
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_product = Product(**product_data.dict())
    
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
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate images
    image_paths = []
    if images and images[0].filename:  # Check if files were actually uploaded
        for image in images:
            if len(images) > 5:
                raise HTTPException(status_code=400, detail="Maximum 5 images allowed")
            
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

@app.delete("/api/products/{product_id}")
async def delete_product(
    product_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    
    return {"message": "Product deleted successfully"}

@app.put("/api/products/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    product_data: ProductCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    for field, value in product_data.dict().items():
        setattr(product, field, value)
    
    db.commit()
    db.refresh(product)
    
    return product

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Single Owner Clothing Store API",
        "version": "1.0.0"
    }

@app.get("/")
async def root():
    return {
        "message": "Single Owner Clothing Store API is running!",
        "docs": "/docs",
        "health": "/api/health",
        "note": "Login with your owner password to manage products"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)  # Different port
