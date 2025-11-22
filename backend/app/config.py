from pydantic_settings import BaseSettings
from pydantic import validator
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Database
    database_url: str
    
    # JWT
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7
    
    # Razorpay
    razorpay_key_id: str
    razorpay_key_secret: Optional[str] = None
    razorpay_webhook_secret: Optional[str] = None
    
    # Cloudinary
    cloudinary_cloud_name: Optional[str] = None
    cloudinary_api_key: Optional[str] = None
    cloudinary_api_secret: Optional[str] = None
    
    # SendGrid
    sendgrid_api_key: Optional[str] = None
    from_email: Optional[str] = "noreply@ashastore.com"
    from_name: str = "Asha Store"
    
    # Sentry
    sentry_dsn: Optional[str] = None
    
    # Redis
    redis_url: Optional[str] = None
    
    # Environment
    environment: str = "development"
    debug: bool = True
    frontend_url: str = "http://localhost:3000"
    
    # Rate Limiting
    rate_limit_requests: int = 100
    rate_limit_period: int = 3600
    
    # Email Templates
    email_templates_dir: str = "./templates/emails"
    
    # File Upload
    max_file_size: int = 10485760  # 10MB
    allowed_image_types: str = "image/jpeg,image/png,image/webp,image/gif"
    
    # Commission
    platform_commission_rate: float = 0.05
    minimum_payout_amount: int = 1000
    
    @validator('allowed_image_types')
    def validate_image_types(cls, v):
        return v.split(',') if isinstance(v, str) else v
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Create settings instance
settings = Settings()

# CORS settings
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]

if settings.environment == "production":
    CORS_ORIGINS.extend([
        "https://yourstore.com",
        "https://www.yourstore.com",
        # Add your production domains
    ])
