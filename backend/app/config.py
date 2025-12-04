import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    def __init__(self):
        # Database
        self.database_url = os.getenv("DATABASE_URL", "sqlite:///./shopall.db")
        
        # JWT
        self.secret_key = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
        self.algorithm = os.getenv("ALGORITHM", "HS256")
        self.access_token_expire_minutes = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
        self.refresh_token_expire_days = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
        
        # Razorpay
        self.razorpay_key_id = os.getenv("RAZORPAY_KEY_ID", "")
        self.razorpay_key_secret = os.getenv("RAZORPAY_KEY_SECRET")
        self.razorpay_webhook_secret = os.getenv("RAZORPAY_WEBHOOK_SECRET")
        
        # Cloudinary - support both URL format and separate vars
        cloudinary_url = os.getenv("CLOUDINARY_URL")
        if cloudinary_url:
            # Parse cloudinary://api_key:api_secret@cloud_name
            try:
                from urllib.parse import urlparse
                parsed = urlparse(cloudinary_url)
                self.cloudinary_cloud_name = parsed.hostname
                self.cloudinary_api_key = parsed.username
                self.cloudinary_api_secret = parsed.password
            except Exception as e:
                print(f"Error parsing CLOUDINARY_URL: {e}")
                self.cloudinary_cloud_name = None
                self.cloudinary_api_key = None
                self.cloudinary_api_secret = None
        else:
            # Fallback to separate environment variables
            self.cloudinary_cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
            self.cloudinary_api_key = os.getenv("CLOUDINARY_API_KEY")
            self.cloudinary_api_secret = os.getenv("CLOUDINARY_API_SECRET")
        
        # SendGrid
        self.sendgrid_api_key = os.getenv("SENDGRID_API_KEY")
        self.from_email = os.getenv("FROM_EMAIL", "noreply@ashastore.com")
        self.from_name = os.getenv("FROM_NAME", "Asha Store")
        
        # Sentry
        self.sentry_dsn = os.getenv("SENTRY_DSN")
        
        # Redis
        self.redis_url = os.getenv("REDIS_URL")
        
        # Environment
        self.environment = os.getenv("ENVIRONMENT", "development")
        self.debug = os.getenv("DEBUG", "true").lower() == "true"
        self.frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
        
        # Rate Limiting
        self.rate_limit_requests = int(os.getenv("RATE_LIMIT_REQUESTS", "100"))
        self.rate_limit_period = int(os.getenv("RATE_LIMIT_PERIOD", "3600"))
        
        # Email Templates
        self.email_templates_dir = os.getenv("EMAIL_TEMPLATES_DIR", "./templates/emails")
        
        # File Upload
        self.max_file_size = int(os.getenv("MAX_FILE_SIZE", "10485760"))  # 10MB
        allowed_types = os.getenv("ALLOWED_IMAGE_TYPES", "image/jpeg,image/png,image/webp,image/gif")
        self.allowed_image_types = allowed_types.split(',') if isinstance(allowed_types, str) else allowed_types
        
        # Commission
        self.platform_commission_rate = float(os.getenv("PLATFORM_COMMISSION_RATE", "0.05"))
        self.minimum_payout_amount = int(os.getenv("MINIMUM_PAYOUT_AMOUNT", "1000"))

# Create settings instance
settings = Settings()

# CORS settings
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:5173",  # Vite dev server
    "http://127.0.0.1:5173",
    # Production Vercel deployments - specific URLs
    "https://react-dashboard-ashastore.vercel.app",
    "https://customer-website-lovat.vercel.app",
    "https://react-dashboard-nine-beta-65.vercel.app",
    "https://customer-website-pq176eplu-ashastore.vercel.app",
    # Git branch deployments
    "https://react-dashboard-git-main-ashastore.vercel.app",
    "https://customer-website-git-main-ashastore.vercel.app",
    # Allow any Vercel preview deployment
    "https://react-dashboard-g83d67ju-ashastore.vercel.app",
]

# Allow all Vercel deployment URLs (wildcard regex)
CORS_ORIGIN_REGEX = r"https://.*\.vercel\.app"

if settings.environment == "production":
    CORS_ORIGINS.extend([
        "https://ashastore.com",
        "https://www.ashastore.com",
        # Add your custom domains when ready
    ])

# Always allow basheera.in domain (production domain)
CORS_ORIGINS.extend([
    "https://basheera.in",
    "https://www.basheera.in",
    "http://basheera.in",
    "http://www.basheera.in",
])
