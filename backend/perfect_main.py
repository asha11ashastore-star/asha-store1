from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile, Form, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, or_, and_, desc, asc
from sqlalchemy.orm import sessionmaker
from typing import List, Optional, Dict, Any
import os
import secrets
import string
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import razorpay
from decimal import Decimal
import json
import shutil
from pathlib import Path
import uuid
from PIL import Image
import io

# Import everything inline to avoid import issues
from sqlalchemy.ext.declarative import declarative_base
import enum

Base = declarative_base()

# Import all models and schemas inline

# Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./clothing_store.db")
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# Razorpay Configuration
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")
razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

# Upload Configuration
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
for folder in ["products", "profiles", "reviews", "temp"]:
    (UPLOAD_DIR / folder).mkdir(exist_ok=True)

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}

# Database Setup
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

# FastAPI App
app = FastAPI(
    title="Perfect Clothing Store API",
    description="Complete e-commerce backend for clothing with payment integration",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Dependencies
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Utility Functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def generate_slug(name: str) -> str:
    slug = name.lower().replace(" ", "-").replace("/", "-")
    return f"{slug}-{uuid.uuid4().hex[:8]}"

def generate_order_number() -> str:
    timestamp = datetime.now().strftime("%Y%m%d")
    random_part = ''.join(secrets.choice(string.digits) for _ in range(6))
    return f"ORD{timestamp}{random_part}"

def generate_sku(category: str) -> str:
    prefix = category[:3].upper()
    random_part = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(7))
    return f"{prefix}-{random_part}"

async def save_upload_file(upload_file: UploadFile, folder: str) -> str:
    """Save uploaded file and return the URL path"""
    # Validate file extension
    file_ext = Path(upload_file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    # Generate unique filename
    unique_filename = f"{uuid.uuid4().hex}{file_ext}"
    file_path = UPLOAD_DIR / folder / unique_filename
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    
    # Create thumbnail for product images
    if folder == "products":
        create_thumbnail(file_path, unique_filename)
    
    return f"/uploads/{folder}/{unique_filename}"

def create_thumbnail(file_path: Path, filename: str):
    """Create thumbnail for product images"""
    try:
        img = Image.open(file_path)
        img.thumbnail((300, 300))
        thumbnail_path = UPLOAD_DIR / "products" / f"thumb_{filename}"
        img.save(thumbnail_path, optimize=True, quality=85)
    except Exception as e:
        print(f"Error creating thumbnail: {e}")

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

def get_seller_user(current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.SELLER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Seller access required")
    return current_user

# Auth Endpoints
@app.post("/api/auth/register", response_model=AuthResponse)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    # Check existing user
    if db.query(User).filter(or_(User.email == user_data.email, User.phone == user_data.phone)).first():
        raise HTTPException(status_code=400, detail="Email or phone already registered")
    
    # Create user
    db_user = User(
        email=user_data.email,
        phone=user_data.phone,
        username=user_data.username or user_data.email.split("@")[0],
        full_name=user_data.full_name,
        hashed_password=hash_password(user_data.password),
        role=user_data.role
    )
    
    # Add seller details if registering as seller
    if user_data.role == UserRole.SELLER and user_data.seller_details:
        db_user.store_name = user_data.seller_details.store_name
        db_user.gst_number = user_data.seller_details.gst_number
        db_user.pan_number = user_data.seller_details.pan_number
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create token
    access_token = create_access_token(data={"sub": db_user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": db_user
    }

@app.post("/api/auth/login", response_model=AuthResponse)
async def login(login_data: UserLogin, db: Session = Depends(get_db)):
    # Find user by email or phone
    user = db.query(User).filter(
        or_(User.email == login_data.email_or_phone, User.phone == login_data.email_or_phone)
    ).first()
    
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is inactive")
    
    # Create token
    access_token = create_access_token(data={"sub": user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

# Product Endpoints
@app.post("/api/products", response_model=ProductResponse)
async def create_product(
    name: str = Form(...),
    description: str = Form(...),
    category: ClothingCategory = Form(...),
    mrp: float = Form(...),
    selling_price: float = Form(...),
    total_stock: int = Form(...),
    fabric: Optional[FabricType] = Form(None),
    pattern: Optional[str] = Form(None),
    occasion: Optional[str] = Form(None),
    brand: Optional[str] = Form(None),
    saree_length: Optional[float] = Form(None),
    blouse_piece: Optional[bool] = Form(False),
    blouse_length: Optional[float] = Form(None),
    work_type: Optional[str] = Form(None),
    care_instructions: Optional[str] = Form(None),
    variants: Optional[str] = Form(None),  # JSON string
    images: List[UploadFile] = File(...),
    current_user: User = Depends(get_seller_user),
    db: Session = Depends(get_db)
):
    # Create product
    db_product = Product(
        seller_id=current_user.id,
        name=name,
        slug=generate_slug(name),
        description=description,
        category=category,
        mrp=mrp,
        selling_price=selling_price,
        discount_percentage=((mrp - selling_price) / mrp * 100) if mrp > selling_price else 0,
        sku=generate_sku(category.value),
        total_stock=total_stock,
        fabric=fabric,
        pattern=pattern,
        occasion=occasion,
        brand=brand or current_user.store_name,
        saree_length=saree_length,
        blouse_piece=blouse_piece,
        blouse_length=blouse_length,
        work_type=work_type,
        care_instructions=care_instructions,
        status=ProductStatus.ACTIVE if total_stock > 0 else ProductStatus.OUT_OF_STOCK
    )
    
    db.add(db_product)
    db.flush()  # Get product ID without committing
    
    # Save images
    for idx, image in enumerate(images[:10]):  # Max 10 images
        image_url = await save_upload_file(image, "products")
        db_image = ProductImage(
            product_id=db_product.id,
            image_url=image_url,
            thumbnail_url=image_url.replace("/uploads/", "/uploads/thumb_"),
            is_primary=(idx == 0),
            sort_order=idx
        )
        db.add(db_image)
    
    # Add variants if provided
    if variants:
        try:
            variants_data = json.loads(variants)
            for variant in variants_data:
                db_variant = ProductVariant(
                    product_id=db_product.id,
                    size=variant.get("size"),
                    color=variant.get("color"),
                    color_code=variant.get("color_code"),
                    stock_quantity=variant.get("stock_quantity", 0),
                    sku_variant=f"{db_product.sku}-{variant.get('size', '')}-{variant.get('color', '')}",
                    mrp=variant.get("mrp", mrp),
                    selling_price=variant.get("selling_price", selling_price)
                )
                db.add(db_variant)
        except json.JSONDecodeError:
            pass  # Ignore invalid JSON
    
    db.commit()
    db.refresh(db_product)
    
    return db_product

@app.get("/api/products", response_model=ProductListResponse)
async def get_products(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[ClothingCategory] = None,
    fabric: Optional[FabricType] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = Query("created_at", regex="^(price|created_at|popularity|rating)$"),
    order: Optional[str] = Query("desc", regex="^(asc|desc)$"),
    db: Session = Depends(get_db)
):
    # Base query
    query = db.query(Product).filter(Product.status == ProductStatus.ACTIVE)
    
    # Apply filters
    if category:
        query = query.filter(Product.category == category)
    
    if fabric:
        query = query.filter(Product.fabric == fabric)
    
    if min_price is not None:
        query = query.filter(Product.selling_price >= min_price)
    
    if max_price is not None:
        query = query.filter(Product.selling_price <= max_price)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_term),
                Product.description.ilike(search_term),
                Product.brand.ilike(search_term),
                Product.work_type.ilike(search_term)
            )
        )
    
    # Sorting
    sort_column = {
        "price": Product.selling_price,
        "created_at": Product.created_at,
        "popularity": Product.sold_count,
        "rating": Product.rating
    }.get(sort_by, Product.created_at)
    
    if order == "asc":
        query = query.order_by(asc(sort_column))
    else:
        query = query.order_by(desc(sort_column))
    
    # Pagination
    total = query.count()
    products = query.offset((page - 1) * limit).limit(limit).all()
    
    return {
        "products": products,
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit
    }

@app.get("/api/products/{product_id}", response_model=ProductDetailResponse)
async def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Increment view count
    product.view_count += 1
    db.commit()
    
    # Get related products
    related = db.query(Product).filter(
        Product.category == product.category,
        Product.id != product.id,
        Product.status == ProductStatus.ACTIVE
    ).limit(8).all()
    
    return {
        "product": product,
        "related_products": related
    }

# Cart Endpoints
@app.post("/api/cart/add")
async def add_to_cart(
    cart_item: CartItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check product exists
    product = db.query(Product).filter(Product.id == cart_item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check stock
    if cart_item.variant_id:
        variant = db.query(ProductVariant).filter(
            ProductVariant.id == cart_item.variant_id,
            ProductVariant.product_id == cart_item.product_id
        ).first()
        if not variant or variant.stock_quantity < cart_item.quantity:
            raise HTTPException(status_code=400, detail="Insufficient stock")
    elif product.total_stock < cart_item.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")
    
    # Check existing cart item
    existing = db.query(CartItem).filter(
        CartItem.user_id == current_user.id,
        CartItem.product_id == cart_item.product_id,
        CartItem.variant_id == cart_item.variant_id
    ).first()
    
    if existing:
        existing.quantity += cart_item.quantity
    else:
        db_cart_item = CartItem(
            user_id=current_user.id,
            **cart_item.dict()
        )
        db.add(db_cart_item)
    
    db.commit()
    
    return {"message": "Added to cart successfully"}

@app.get("/api/cart", response_model=CartResponse)
async def get_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    
    # Calculate totals
    subtotal = 0
    for item in cart_items:
        if item.variant:
            price = item.variant.selling_price
        else:
            price = item.product.selling_price
        subtotal += price * item.quantity
    
    shipping = 0 if subtotal >= 999 else 99  # Free shipping above ₹999
    total = subtotal + shipping
    
    return {
        "items": cart_items,
        "subtotal": subtotal,
        "shipping": shipping,
        "total": total,
        "item_count": sum(item.quantity for item in cart_items)
    }

# Order & Payment Endpoints
@app.post("/api/orders/create", response_model=OrderResponse)
async def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get cart items
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    # Get address
    address = db.query(Address).filter(
        Address.id == order_data.address_id,
        Address.user_id == current_user.id
    ).first()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    
    # Calculate amounts
    subtotal = 0
    order_items = []
    
    for cart_item in cart_items:
        product = cart_item.product
        variant = cart_item.variant
        
        # Get price
        if variant:
            unit_price = variant.selling_price
            stock = variant.stock_quantity
        else:
            unit_price = product.selling_price
            stock = product.total_stock
        
        # Check stock
        if stock < cart_item.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}")
        
        total_price = unit_price * cart_item.quantity
        subtotal += total_price
        
        # Calculate commission (10% platform fee)
        platform_fee = total_price * Decimal(0.10)
        seller_amount = total_price - platform_fee
        
        order_items.append({
            "product_id": product.id,
            "variant_id": variant.id if variant else None,
            "seller_id": product.seller_id,
            "product_name": product.name,
            "product_image": product.images[0].image_url if product.images else None,
            "size": variant.size if variant else None,
            "color": variant.color if variant else None,
            "quantity": cart_item.quantity,
            "unit_price": unit_price,
            "total_price": total_price,
            "platform_fee": platform_fee,
            "seller_amount": seller_amount
        })
    
    # Apply coupon if provided
    discount_amount = 0
    if order_data.coupon_code:
        coupon = db.query(Coupon).filter(
            Coupon.code == order_data.coupon_code,
            Coupon.is_active == True,
            Coupon.valid_from <= datetime.now(),
            Coupon.valid_until >= datetime.now()
        ).first()
        
        if coupon and subtotal >= coupon.minimum_amount:
            if coupon.discount_type == "percentage":
                discount_amount = subtotal * (coupon.discount_value / 100)
                if coupon.maximum_discount:
                    discount_amount = min(discount_amount, coupon.maximum_discount)
            else:
                discount_amount = coupon.discount_value
            
            coupon.used_count += 1
    
    # Calculate final amounts
    shipping_charge = 0 if subtotal >= 999 else 99
    tax_amount = (subtotal - discount_amount) * Decimal(0.18)  # 18% GST
    total_amount = subtotal - discount_amount + tax_amount + shipping_charge
    
    # Create order
    db_order = Order(
        order_number=generate_order_number(),
        customer_id=current_user.id,
        shipping_address=address.__dict__,
        billing_address=address.__dict__,
        subtotal=subtotal,
        discount_amount=discount_amount,
        coupon_code=order_data.coupon_code,
        tax_amount=tax_amount,
        shipping_charge=shipping_charge,
        total_amount=total_amount,
        payment_method=order_data.payment_method,
        customer_notes=order_data.notes
    )
    
    db.add(db_order)
    db.flush()
    
    # Create order items
    for item_data in order_items:
        db_order_item = OrderItem(order_id=db_order.id, **item_data)
        db.add(db_order_item)
        
        # Update stock
        if item_data["variant_id"]:
            variant = db.query(ProductVariant).filter(ProductVariant.id == item_data["variant_id"]).first()
            variant.stock_quantity -= item_data["quantity"]
        else:
            product = db.query(Product).filter(Product.id == item_data["product_id"]).first()
            product.total_stock -= item_data["quantity"]
            product.sold_count += item_data["quantity"]
    
    # Create Razorpay order if online payment
    if order_data.payment_method != PaymentMethod.COD:
        try:
            razorpay_order = razorpay_client.order.create({
                "amount": int(total_amount * 100),  # Amount in paise
                "currency": "INR",
                "receipt": db_order.order_number,
                "payment_capture": 1
            })
            
            db_order.razorpay_order_id = razorpay_order["id"]
            
            # Create payment record
            db_payment = Payment(
                order_id=db_order.id,
                amount=total_amount,
                method=order_data.payment_method,
                status=PaymentStatus.PENDING,
                gateway="razorpay",
                gateway_order_id=razorpay_order["id"]
            )
            db.add(db_payment)
            
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Payment gateway error: {str(e)}")
    else:
        # COD order
        db_order.status = OrderStatus.CONFIRMED
        db_payment = Payment(
            order_id=db_order.id,
            amount=total_amount,
            method=PaymentMethod.COD,
            status=PaymentStatus.PENDING
        )
        db.add(db_payment)
    
    # Clear cart
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    
    db.commit()
    db.refresh(db_order)
    
    return db_order

@app.post("/api/payments/verify")
async def verify_payment(
    payment_data: PaymentVerify,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get order
    order = db.query(Order).filter(
        Order.razorpay_order_id == payment_data.razorpay_order_id,
        Order.customer_id == current_user.id
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Verify signature
    try:
        razorpay_client.utility.verify_payment_signature({
            'razorpay_order_id': payment_data.razorpay_order_id,
            'razorpay_payment_id': payment_data.razorpay_payment_id,
            'razorpay_signature': payment_data.razorpay_signature
        })
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid payment signature")
    
    # Update order and payment
    order.razorpay_payment_id = payment_data.razorpay_payment_id
    order.razorpay_signature = payment_data.razorpay_signature
    order.payment_status = PaymentStatus.COMPLETED
    order.status = OrderStatus.CONFIRMED
    
    payment = db.query(Payment).filter(Payment.order_id == order.id).first()
    payment.gateway_payment_id = payment_data.razorpay_payment_id
    payment.gateway_signature = payment_data.razorpay_signature
    payment.status = PaymentStatus.COMPLETED
    
    db.commit()
    
    return {"message": "Payment verified successfully", "order_number": order.order_number}

# Seller Dashboard
@app.get("/api/seller/dashboard")
async def seller_dashboard(
    current_user: User = Depends(get_seller_user),
    db: Session = Depends(get_db)
):
    # Get statistics
    total_products = db.query(Product).filter(Product.seller_id == current_user.id).count()
    total_orders = db.query(OrderItem).filter(OrderItem.seller_id == current_user.id).count()
    
    # Revenue calculation
    revenue_query = db.query(OrderItem).filter(
        OrderItem.seller_id == current_user.id,
        OrderItem.status.in_([OrderStatus.DELIVERED, OrderStatus.SHIPPED])
    )
    
    total_revenue = sum(item.seller_amount for item in revenue_query.all())
    
    # Recent orders
    recent_orders = db.query(OrderItem).filter(
        OrderItem.seller_id == current_user.id
    ).order_by(OrderItem.created_at.desc()).limit(10).all()
    
    return {
        "statistics": {
            "total_products": total_products,
            "total_orders": total_orders,
            "total_revenue": total_revenue,
            "pending_orders": db.query(OrderItem).filter(
                OrderItem.seller_id == current_user.id,
                OrderItem.status == OrderStatus.PENDING
            ).count()
        },
        "recent_orders": recent_orders
    }

# Health Check
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Perfect Clothing Store API",
        "version": "2.0.0",
        "payment_gateway": "Razorpay" if RAZORPAY_KEY_ID else "Not configured"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
