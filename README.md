# ShopAll - Production-Ready Multi-Vendor eCommerce Platform

A complete, production-ready multi-vendor eCommerce platform built with Next.js, FastAPI, and modern web technologies.

## 🚀 Features

### For Buyers
- Browse products across Clothing, Food, and Department Store categories
- Advanced search and filtering
- Shopping cart with persistence
- Secure checkout with Razorpay payments
- Order tracking and history
- User account management

### For Sellers
- Seller registration and verification
- Product management with image uploads
- Order management and tracking
- Payout requests and ledger
- Sales analytics dashboard

### Admin Features
- User and seller management
- Product moderation
- Refund processing
- Audit logs and reporting

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** with TypeScript
- **TailwindCSS** for styling
- **Zustand** for state management
- **React Hook Form** for form handling
- **Framer Motion** for animations

### Backend
- **FastAPI** with Python 3.11+
- **SQLAlchemy** ORM with Alembic migrations
- **MySQL** database (PlanetScale recommended)
- **JWT** authentication with refresh tokens
- **Pydantic** for data validation

### External Services
- **Cloudinary** for image uploads and transformation
- **Razorpay** for payment processing
- **SendGrid** for transactional emails
- **Sentry** for error monitoring

### Deployment
- **Frontend**: Vercel
- **Backend**: Render or Railway
- **Database**: PlanetScale
- **CI/CD**: GitHub Actions

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- MySQL 8.0+ (or PlanetScale account)
- Git

## 🏃‍♂️ Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd shopall
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
alembic upgrade head

# Start the backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start the development server
npm run dev
```

### 4. Using Docker (Alternative)

```bash
# Start all services
docker-compose up --build

# Run migrations
docker-compose exec backend alembic upgrade head
```

## 🌍 Deployment

### Environment Variables Setup

#### Backend (.env)
```bash
# Database
DATABASE_URL=mysql+pymysql://user:password@host:port/database

# JWT
SECRET_KEY=your-super-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@yourstore.com

# Sentry
SENTRY_DSN=your-sentry-dsn

# Environment
ENVIRONMENT=development
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### Deployment Steps

#### 1. PlanetScale Database Setup
```bash
# Install PlanetScale CLI
# Create database
pscale database create shopall --region us-east

# Create branch
pscale branch create shopall main

# Get connection string
pscale connect shopall main --port 3309
```

#### 2. Deploy Backend to Render
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set environment variables in Render dashboard
4. Deploy branch: `main`
5. Build command: `pip install -r requirements.txt`
6. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

#### 3. Deploy Frontend to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

#### 4. Configure Webhooks
- Set Razorpay webhook URL to: `https://your-backend-url/payment/webhook`
- Set webhook events: `payment.captured`, `payment.failed`

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/ -v
```

### Frontend Tests
```bash
cd frontend
npm run test
npm run test:e2e
```

## 📊 Monitoring & Logging

### Sentry Integration
- Add SENTRY_DSN to environment variables
- Errors automatically tracked and reported
- Performance monitoring enabled

### Logging
- Backend logs to stdout (captured by hosting platform)
- Request/response logging with correlation IDs
- Audit logs for critical actions

## 🔒 Security Checklist

- [x] HTTPS everywhere (TLS certificates)
- [x] JWT tokens with short expiration
- [x] Password hashing with bcrypt
- [x] Input validation and sanitization
- [x] Rate limiting on auth endpoints
- [x] CORS configuration
- [x] SQL injection prevention (SQLAlchemy ORM)
- [x] XSS protection
- [x] Secure headers (CSP, HSTS, etc.)

## 🎨 UI Customization

### Theme Configuration
Edit `frontend/tailwind.config.js` to customize colors, fonts, and spacing:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        // Add your brand colors
      },
    },
  },
}
```

### Component Customization
- **Navbar**: `frontend/components/layout/Navbar.tsx`
- **Product Card**: `frontend/components/products/ProductCard.tsx`
- **Dashboard**: `frontend/components/dashboard/`

## 🚦 Going Live Checklist

### 1. Switch to Production Keys
- [ ] Update Razorpay keys to live mode
- [ ] Update Cloudinary to production account
- [ ] Configure production SendGrid account
- [ ] Set production Sentry project

### 2. Domain & SSL
- [ ] Configure custom domain
- [ ] Set up DNS records
- [ ] Enable SSL certificates
- [ ] Update CORS settings

### 3. Database
- [ ] Promote PlanetScale branch to production
- [ ] Run production migrations
- [ ] Set up automated backups

### 4. Monitoring
- [ ] Configure Sentry alerts
- [ ] Set up uptime monitoring
- [ ] Configure log aggregation

### 5. Legal & Compliance
- [ ] Add privacy policy
- [ ] Add terms of service
- [ ] Configure cookie consent
- [ ] Set up GDPR compliance

## 📝 API Documentation

API documentation is automatically generated and available at:
- Development: http://localhost:8000/docs
- Production: https://your-backend-url/docs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Create a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: support@yourstore.com
- Documentation: https://docs.yourstore.com
