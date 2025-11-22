from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional
import logging
from datetime import datetime

# Import routers
from app.routers import auth, products, users, orders, cart, company
from app.database import engine, Base, get_db
from app.models import Product, User, CompanyInfo

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="Asha Store API",
    description="API for Asha Store - Grace Woven by Asha Dhaundiyal",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(products.router, prefix="/api/v1/products", tags=["Products"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(orders.router, prefix="/api/v1/orders", tags=["Orders"])
app.include_router(cart.router, prefix="/api/v1/cart", tags=["Cart"])
app.include_router(company.router, prefix="/api/v1/company", tags=["Company"])

@app.get("/")
async def root():
    return {"message": "Welcome to Asha Store API"}

@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    try:
        # Test database connection
        db.execute("SELECT 1")
        return {
            "status": "healthy",
            "database": "connected",
            "environment": "development",
            "version": "1.0.0",
            "timestamp": datetime.now().timestamp()
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service unavailable"
        )

# Simple products endpoint override for testing
@app.get("/api/v1/products/")
async def get_products_simple(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all active products"""
    try:
        products = db.query(Product).filter(Product.status == "active").offset(skip).limit(limit).all()
        
        items = []
        for product in products:
            # Get primary image
            primary_image = None
            if product.images:
                for img in product.images:
                    if img.is_primary:
                        primary_image = img.image_url
                        break
                if not primary_image and product.images:
                    primary_image = product.images[0].image_url
            
            items.append({
                "id": product.id,
                "name": product.name,
                "category": product.category,
                "price": float(product.price),
                "discounted_price": float(product.discounted_price) if product.discounted_price else None,
                "stock_quantity": product.stock_quantity,
                "status": product.status,
                "primary_image": primary_image,
                "seller_name": "Asha Store",
                "created_at": product.created_at.isoformat() if product.created_at else None
            })
        
        total = db.query(Product).filter(Product.status == "active").count()
        
        return {
            "items": items,
            "total": total,
            "page": 1,
            "limit": limit,
            "pages": (total + limit - 1) // limit if limit > 0 else 1,
            "has_next": False,
            "has_prev": False
        }
    except Exception as e:
        logger.error(f"Error fetching products: {e}")
        return {
            "items": [],
            "total": 0,
            "page": 1,
            "limit": limit,
            "pages": 1,
            "has_next": False,
            "has_prev": False
        }

# Dashboard products endpoint for seller
@app.get("/api/v1/products/dashboard")
async def get_dashboard_products(
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Get all products for dashboard"""
    try:
        skip = (page - 1) * limit
        products = db.query(Product).offset(skip).limit(limit).all()
        
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
            
            items.append({
                "id": product.id,
                "name": product.name,
                "category": product.category,
                "price": float(product.price),
                "discounted_price": float(product.discounted_price) if product.discounted_price else None,
                "stock_quantity": product.stock_quantity,
                "status": product.status,
                "primary_image": primary_image,
                "seller_name": "Asha Store",
                "created_at": product.created_at.isoformat() if product.created_at else None
            })
        
        total = db.query(Product).count()
        
        return {
            "items": items,
            "total": total,
            "page": page,
            "limit": limit,
            "pages": (total + limit - 1) // limit if limit > 0 else 1,
            "has_next": page * limit < total,
            "has_prev": page > 1
        }
    except Exception as e:
        logger.error(f"Error fetching dashboard products: {e}")
        return {
            "items": [],
            "total": 0,
            "page": page,
            "limit": limit,
            "pages": 1,
            "has_next": False,
            "has_prev": False
        }

# Company info endpoint
@app.get("/api/v1/company/info")
async def get_company_info(db: Session = Depends(get_db)):
    """Get company information"""
    try:
        company = db.query(CompanyInfo).first()
        if company:
            return {
                "artisans_supported": company.artisans_supported or "15+",
                "villages_reached": company.villages_reached or "12+",
                "happy_customers": company.happy_customers or "10000",
                "years_of_excellence": company.years_of_excellence or "1+",
                "features": company.features or []
            }
        else:
            # Return default values
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
        # Return default values on error
        return {
            "artisans_supported": "15+",
            "villages_reached": "12+",
            "happy_customers": "10000",
            "years_of_excellence": "1+",
            "features": []
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
