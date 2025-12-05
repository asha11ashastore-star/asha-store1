from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
# import sentry_sdk
# from sentry_sdk.integrations.fastapi import FastApiIntegration
# from sentry_sdk.integrations.sqlalchemy import SqlAlchemyIntegration
import logging
import time
import uuid

from app.config import settings, CORS_ORIGINS, CORS_ORIGIN_REGEX
from app.database import check_db_connection
from app.routers import auth, products, cart, orders, payments, company, products_fixed, products_detail, razorpay_link, guest_orders, products_dashboard, admin_reset, payment_links, contact
import uvicorn

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.debug else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Initialize Sentry for error tracking (DISABLED)
# if settings.sentry_dsn:
#     sentry_sdk.init(
#         dsn=settings.sentry_dsn,
#         integrations=[
#             FastApiIntegration(auto_enabling_integrations=True),
#             # SqlAlchemyIntegration(),
#         ],
#         traces_sample_rate=1.0 if settings.environment == "development" else 0.1,
#         environment=settings.environment,
#     )

# Rate limiter
limiter = Limiter(key_func=get_remote_address)

# Create FastAPI app
app = FastAPI(
    title="ShopAll API",
    description="Production-ready multi-vendor eCommerce platform API",
    version="1.0.0",
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
    openapi_url="/openapi.json" if settings.debug else None,
)

# Add rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Custom CORS to allow all Vercel deployment URLs
from typing import List

def verify_origin(origin: str, allowed_origins: List[str]) -> bool:
    """Check if origin is allowed, including Vercel deployment URLs"""
    if origin in allowed_origins:
        return True
    # Allow all Vercel deployment URLs for our projects
    if origin and origin.startswith("https://") and origin.endswith("-ashastore.vercel.app"):
        if "react-dashboard-" in origin or "customer-website-" in origin:
            return True
    return False

# Add CORS middleware with custom origin verification
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",  # Allow ALL Vercel deployment URLs
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Add trusted host middleware for production
if settings.environment == "production":
    app.add_middleware(
        TrustedHostMiddleware, 
        allowed_hosts=["yourstore.com", "www.yourstore.com", "api.yourstore.com"]
    )

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """Add processing time and request ID headers"""
    start_time = time.time()
    request_id = str(uuid.uuid4())
    
    # Add request ID to request state
    request.state.request_id = request_id
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    response.headers["X-Request-ID"] = request_id
    
    return response

@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all requests"""
    start_time = time.time()
    
    # Log request
    logger.info(
        f"Request: {request.method} {request.url.path} "
        f"- IP: {request.client.host} "
        f"- User-Agent: {request.headers.get('user-agent', 'Unknown')}"
    )
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    
    # Log response
    logger.info(
        f"Response: {response.status_code} "
        f"- Time: {process_time:.3f}s "
        f"- Request ID: {getattr(request.state, 'request_id', 'Unknown')}"
    )
    
    return response

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Custom HTTP exception handler"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": exc.detail,
            "status_code": exc.status_code,
            "request_id": getattr(request.state, "request_id", None)
        },
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """General exception handler"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    
    if settings.debug:
        return JSONResponse(
            status_code=500,
            content={
                "error": True,
                "message": str(exc),
                "type": type(exc).__name__,
                "request_id": getattr(request.state, "request_id", None)
            },
        )
    else:
        return JSONResponse(
            status_code=500,
            content={
                "error": True,
                "message": "Internal server error",
                "request_id": getattr(request.state, "request_id", None)
            },
        )

# Health check endpoint
@app.get("/health")
@limiter.limit("30/minute")
async def health_check(request: Request):
    """Health check endpoint"""
    db_status = check_db_connection()
    
    return {
        "status": "healthy" if db_status else "unhealthy",
        "database": "connected" if db_status else "disconnected",
        "environment": settings.environment,
        "version": "1.0.0",
        "timestamp": time.time()
    }

# Initialize database endpoint (for production setup)
@app.post("/init-db")
async def initialize_database():
    """Initialize database tables - run once on first deployment"""
    try:
        from app.database import create_tables
        logger.info("Manual database initialization requested")
        create_tables()
        return {
            "status": "success",
            "message": "Database tables created successfully!",
            "timestamp": time.time()
        }
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise HTTPException(status_code=500, detail=f"Database initialization failed: {str(e)}")

# Reset user password endpoint (temporary for production fix)
@app.post("/reset-seller-password")
def reset_seller_password():
    """Reset seller password - temporary endpoint for production fix"""
    try:
        from app.database import SessionLocal
        from app.models import User
        from app.auth import auth_manager
        
        db = SessionLocal()
        try:
            # Find user
            user = db.query(User).filter(User.email == "asha@ashastore.com").first()
            if user:
                # Reset password
                new_password = "AshaStore2024!"
                user.hashed_password = auth_manager.get_password_hash(new_password)
                db.commit()
                return {
                    "status": "success",
                    "message": "Password reset successfully",
                    "email": "asha@ashastore.com",
                    "new_password": new_password
                }
            else:
                # Create new user
                user = User(
                    email="asha@ashastore.com",
                    username="ashastore",
                    first_name="Asha",
                    last_name="Dhaundiyal",
                    hashed_password=auth_manager.get_password_hash("AshaStore2024!"),
                    role="seller",
                    is_active=True,
                    is_verified=True
                )
                db.add(user)
                db.commit()
                return {
                    "status": "success",
                    "message": "User created successfully",
                    "email": "asha@ashastore.com",
                    "password": "AshaStore2024!"
                }
        finally:
            db.close()
    except Exception as e:
        logger.error(f"Password reset failed: {e}")
        return {"status": "error", "message": str(e)}

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "ShopAll API",
        "version": "1.0.0",
        "docs": "/docs" if settings.debug else "Documentation not available in production",
        "health": "/health"
    }

# Include routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(admin_reset.router, prefix="/api/v1")  # TEMPORARY - DELETE AFTER FIXING PASSWORD
app.include_router(products.router, prefix="/api/v1")
app.include_router(cart.router, prefix="/api/v1")
app.include_router(orders.router, prefix="/api/v1")
app.include_router(payments.router, prefix="/api/v1")
app.include_router(company.router, prefix="/api/v1")

# Include dashboard products router
app.include_router(products_dashboard.router, prefix="/api/v1")

# Include fixed products router
app.include_router(products_fixed.router, prefix="/api/v1")

# Include product detail router (for edit functionality)
app.include_router(products_detail.router, prefix="/api/v1")

# Include Razorpay payment link router
app.include_router(razorpay_link.router, prefix="/api/v1")

# Include guest orders router
app.include_router(guest_orders.router)

# Include payment links router (for secure, locked-amount payments)
app.include_router(payment_links.router)

# Include contact form router
app.include_router(contact.router)

# Serve uploaded files
import os
from pathlib import Path

# Ensure uploads directory exists
uploads_dir = Path("./uploads")
uploads_dir.mkdir(exist_ok=True)
(uploads_dir / "products").mkdir(exist_ok=True)
(uploads_dir / "profiles").mkdir(exist_ok=True)
(uploads_dir / "reviews").mkdir(exist_ok=True)

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")
logger.info(f"Static file serving enabled for uploads at {uploads_dir.absolute()}")

@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    logger.info("Starting ShopAll API...")
    logger.info(f"Environment: {settings.environment}")
    logger.info(f"Debug mode: {settings.debug}")
    logger.info("Uploads directory initialized and ready")
    
    # Create database tables if they don't exist
    try:
        from app.database import create_tables
        logger.info("Creating database tables...")
        create_tables()
        logger.info("Database tables created/verified successfully!")
    except Exception as e:
        logger.error(f"Error creating tables: {e}")
        # Don't fail startup - tables might already exist
    
    # Check database connection
    if not check_db_connection():
        logger.error("Database connection failed on startup")
        raise Exception("Database connection failed")
    
    logger.info("ShopAll API started successfully!")

@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    logger.info("Shutting down ShopAll API...")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level="info" if not settings.debug else "debug",
    )
