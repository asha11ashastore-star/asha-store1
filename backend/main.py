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

from app.config import settings, CORS_ORIGINS
from app.database import check_db_connection
from app.routers import auth, products, cart, orders, payments, company, products_fixed, products_detail, razorpay_link, guest_orders, products_dashboard
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

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID"],
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

# Serve uploaded files
import os
uploads_dir = "./uploads"
if os.path.exists(uploads_dir):
    app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")
    logger.info("Static file serving enabled for uploads")
else:
    logger.warning("Uploads directory not found - will be created on first upload")

@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    logger.info("Starting ShopAll API...")
    logger.info(f"Environment: {settings.environment}")
    logger.info(f"Debug mode: {settings.debug}")
    
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
