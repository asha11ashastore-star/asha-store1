from fastapi import FastAPI, HTTPException, Depends, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text, Enum as SQLEnum, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from datetime import datetime
from typing import Optional, List
import logging
import enum
from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database setup
DATABASE_URL = "postgresql://clothinguser:clothingpass123@localhost/clothingstore"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Enums
class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    SELLER = "SELLER"
    BUYER = "BUYER"

class ProductStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    INACTIVE = "inactive"

# Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    role = Column(String, default="BUYER")
    products = relationship("Product", back_populates="seller")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, index=True)
    description = Column(Text)
    category = Column(String)
    price = Column(Float)
    discounted_price = Column(Float, nullable=True)
    stock_quantity = Column(Integer, default=0)
    status = Column(String, default="draft")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    seller = relationship("User", back_populates="products")
    images = relationship("ProductImage", back_populates="product")

class ProductImage(Base):
    __tablename__ = "product_images"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    image_url = Column(String)
    is_primary = Column(Boolean, default=False)
    
    product = relationship("Product", back_populates="images")

class CompanyInfo(Base):
    __tablename__ = "company_info"
    
    id = Column(Integer, primary_key=True, index=True)
    artisans_supported = Column(String, default="15+")
    villages_reached = Column(String, default="12+")
    happy_customers = Column(String, default="10000")
    years_of_excellence = Column(String, default="1+")
    features = Column(Text)  # JSON string

# Create tables
Base.metadata.create_all(bind=engine)

# FastAPI app
app = FastAPI(
    title="Asha Store API",
    description="API for Asha Store",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models
class ProductResponse(BaseModel):
    id: int
    name: str
    category: str
    price: float
    discounted_price: Optional[float]
    stock_quantity: int
    status: str
    primary_image: Optional[str]
    seller_name: str
    created_at: Optional[datetime]

class PaginatedResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int
    limit: int
    pages: int
    has_next: bool
    has_prev: bool

# Routes
@app.get("/")
async def root():
    return {"message": "Asha Store API is running"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "environment": "development",
        "version": "1.0.0",
        "timestamp": datetime.now().timestamp()
    }

@app.get("/api/v1/products/", response_model=PaginatedResponse)
async def get_products(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all active products"""
    try:
        # Build query
        query = db.query(Product).filter(text("status = 'active'"))
        
        if category:
            query = query.filter(Product.category == category)
        
        # Get total count
        total = query.count()
        
        # Apply pagination
        skip = (page - 1) * limit
        products = query.offset(skip).limit(limit).all()
        
        # Transform to response
        items = []
        for product in products:
            primary_image = None
            if product.images:
                for img in product.images:
                    if img.is_primary:
                        primary_image = img.image_url
                        break
                if not primary_image and product.images:
                    primary_image = product.images[0].image_url
            
            items.append(ProductResponse(
                id=product.id,
                name=product.name,
                category=product.category or "silk_saree",
                price=product.price,
                discounted_price=product.discounted_price,
                stock_quantity=product.stock_quantity,
                status=product.status,
                primary_image=primary_image,
                seller_name="Asha Store",
                created_at=product.created_at
            ))
        
        pages = (total + limit - 1) // limit if limit > 0 else 1
        
        return PaginatedResponse(
            items=items,
            total=total,
            page=page,
            limit=limit,
            pages=pages,
            has_next=page < pages,
            has_prev=page > 1
        )
    except Exception as e:
        logger.error(f"Error fetching products: {e}")
        return PaginatedResponse(
            items=[],
            total=0,
            page=1,
            limit=limit,
            pages=1,
            has_next=False,
            has_prev=False
        )

@app.get("/api/v1/products/dashboard", response_model=PaginatedResponse)
async def get_dashboard_products(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get all products for dashboard"""
    try:
        # Get all products (not just active)
        query = db.query(Product)
        
        # Get total count
        total = query.count()
        
        # Apply pagination
        skip = (page - 1) * limit
        products = query.offset(skip).limit(limit).all()
        
        # Transform to response
        items = []
        for product in products:
            primary_image = None
            if product.images:
                for img in product.images:
                    if img.is_primary:
                        primary_image = img.image_url
                        break
                if not primary_image and product.images:
                    primary_image = product.images[0].image_url
            
            items.append(ProductResponse(
                id=product.id,
                name=product.name,
                category=product.category or "silk_saree",
                price=product.price,
                discounted_price=product.discounted_price,
                stock_quantity=product.stock_quantity,
                status=product.status,
                primary_image=primary_image,
                seller_name="Asha Store",
                created_at=product.created_at
            ))
        
        pages = (total + limit - 1) // limit if limit > 0 else 1
        
        return PaginatedResponse(
            items=items,
            total=total,
            page=page,
            limit=limit,
            pages=pages,
            has_next=page < pages,
            has_prev=page > 1
        )
    except Exception as e:
        logger.error(f"Error fetching dashboard products: {e}")
        return PaginatedResponse(
            items=[],
            total=0,
            page=1,
            limit=limit,
            pages=1,
            has_next=False,
            has_prev=False
        )

@app.get("/api/v1/company/info")
async def get_company_info(db: Session = Depends(get_db)):
    """Get company information"""
    try:
        company = db.query(CompanyInfo).first()
        if company:
            import json
            features = []
            if company.features:
                try:
                    features = json.loads(company.features)
                except:
                    features = []
            
            return {
                "artisans_supported": company.artisans_supported or "15+",
                "villages_reached": company.villages_reached or "12+",
                "happy_customers": company.happy_customers or "10000",
                "years_of_excellence": company.years_of_excellence or "1+",
                "features": features
            }
        else:
            return {
                "artisans_supported": "15+",
                "villages_reached": "12+",
                "happy_customers": "10000",
                "years_of_excellence": "1+",
                "features": [
                    {"title": "Heritage Weaving", "description": "Traditional techniques preserved for generations"}
                ]
            }
    except Exception as e:
        logger.error(f"Error fetching company info: {e}")
        return {
            "artisans_supported": "15+",
            "villages_reached": "12+",
            "happy_customers": "10000",
            "years_of_excellence": "1+",
            "features": []
        }

@app.put("/api/v1/company/info")
async def update_company_info(
    data: dict,
    db: Session = Depends(get_db)
):
    """Update company information"""
    try:
        import json
        company = db.query(CompanyInfo).first()
        if not company:
            company = CompanyInfo()
            db.add(company)
        
        if "artisans_supported" in data:
            company.artisans_supported = data["artisans_supported"]
        if "villages_reached" in data:
            company.villages_reached = data["villages_reached"]
        if "happy_customers" in data:
            company.happy_customers = data["happy_customers"]
        if "years_of_excellence" in data:
            company.years_of_excellence = data["years_of_excellence"]
        if "features" in data:
            company.features = json.dumps(data["features"])
        
        db.commit()
        return {"message": "Company information updated successfully"}
    except Exception as e:
        logger.error(f"Error updating company info: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
