# Deploying ShopAll to Your Existing Domain

## Overview
This guide shows you how to deploy the ShopAll eCommerce platform to your existing domain.

## Architecture
```
yourstore.com           → Frontend (Vercel)
api.yourstore.com       → Backend API (Render)
admin.yourstore.com     → Admin Panel (Optional)
```

## Step 1: Prepare Your Environment

### Update Configuration Files

#### Frontend Environment (.env.local)
```env
# Replace with your actual domain
NEXT_PUBLIC_SITE_URL=https://yourstore.com
NEXT_PUBLIC_BACKEND_URL=https://api.yourstore.com
NEXT_PUBLIC_API_URL=https://api.yourstore.com/api/v1

# Your payment keys
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_key_id
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Production settings
NEXT_PUBLIC_ENVIRONMENT=production
```

#### Backend Environment (.env)
```env
# Your domain URLs
FRONTEND_URL=https://yourstore.com
ALLOWED_ORIGINS=https://yourstore.com,https://www.yourstore.com

# Database (replace with your production DB)
DATABASE_URL=mysql+pymysql://user:pass@host:port/database

# Production settings
ENVIRONMENT=production
DEBUG=false

# Your service keys (get from respective services)
SECRET_KEY=your-super-secret-production-key
RAZORPAY_KEY_ID=rzp_live_your_key
RAZORPAY_KEY_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud
SENDGRID_API_KEY=your_sendgrid_key
```

## Step 2: Deploy Backend to Render

### 2.1 Create Render Account & Connect GitHub
1. Go to https://render.com
2. Sign up and connect your GitHub repository
3. Click "New +" → "Web Service"
4. Select your repository
5. Configure:
   - **Name**: `yourstore-api`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: `backend`

### 2.2 Add Environment Variables in Render
Add all the environment variables from your `.env` file in Render dashboard.

### 2.3 Deploy & Get URL
After deployment, you'll get a URL like: `https://yourstore-api.onrender.com`

## Step 3: Configure Your Domain DNS

### 3.1 Add DNS Records for Backend
In your domain registrar/DNS provider:

```dns
# For api.yourstore.com
Type: CNAME
Name: api
Value: yourstore-api.onrender.com
TTL: 300 (5 minutes)
```

### 3.2 Test Backend
```bash
# Test API endpoint
curl https://api.yourstore.com/health
```

## Step 4: Deploy Frontend to Vercel

### 4.1 Install Vercel CLI
```bash
npm i -g vercel
```

### 4.2 Deploy from Frontend Directory
```bash
cd frontend
vercel --prod
```

### 4.3 Configure Custom Domain in Vercel
1. Go to Vercel dashboard
2. Select your project
3. Go to "Settings" → "Domains"
4. Add your domain: `yourstore.com`
5. Add www subdomain: `www.yourstore.com`

### 4.4 Update DNS for Frontend
```dns
# For yourstore.com
Type: A
Name: @
Value: 76.76.19.61

# For www.yourstore.com  
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## Step 5: SSL Configuration

### Automatic SSL (Recommended)
- **Render**: Provides free SSL automatically
- **Vercel**: Provides free SSL automatically
- **Cloudflare** (if using): Enable SSL/TLS encryption

### Custom SSL (Optional)
If you need custom SSL certificates, you can:
1. Purchase from your provider
2. Use Let's Encrypt (free)
3. Configure in your hosting platform

## Step 6: Database Setup

### Option A: PlanetScale (Recommended)
```bash
# Install CLI
brew install planetscale/tap/pscale

# Create account and database
pscale database create yourstore-prod --region us-east

# Get connection string
pscale password create yourstore-prod main yourstore-prod-password

# Update DATABASE_URL in Render environment
```

### Option B: Your Existing MySQL
```env
# Update in Render environment variables
DATABASE_URL=mysql+pymysql://user:password@your-db-host:3306/yourstore
```

## Step 7: Run Database Migrations

```bash
# Connect to your production database
cd backend

# Run migrations
alembic upgrade head

# Create admin user (optional)
python scripts/create_admin.py
```

## Step 8: Configure External Services

### 8.1 Razorpay
1. Login to Razorpay Dashboard
2. Go to Settings → API Keys
3. Generate live mode keys
4. Update webhook URL: `https://api.yourstore.com/api/v1/payment/webhook`

### 8.2 Cloudinary
1. Login to Cloudinary
2. Get Cloud Name, API Key, API Secret
3. Update in environment variables

### 8.3 SendGrid
1. Setup SendGrid account
2. Create API key
3. Verify sender domain (yourstore.com)
4. Update in environment variables

## Step 9: DNS Propagation & Testing

### 9.1 Check DNS Propagation
```bash
# Check if DNS has propagated
nslookup yourstore.com
nslookup api.yourstore.com

# Online tool: https://dnschecker.org
```

### 9.2 Test Complete Flow
1. **Frontend**: https://yourstore.com
2. **API Health**: https://api.yourstore.com/health
3. **API Docs**: https://api.yourstore.com/docs (if enabled)

## Step 10: Go Live Checklist

### Pre-Launch Tests
- [ ] All pages load correctly
- [ ] User registration works
- [ ] Login/logout functions
- [ ] Product browsing works
- [ ] Cart functionality
- [ ] Checkout process
- [ ] Payment processing (test with ₹1)
- [ ] Email notifications
- [ ] Mobile responsiveness

### Security Check
- [ ] HTTPS enabled on all pages
- [ ] API endpoints secure
- [ ] Environment variables set correctly
- [ ] CORS configured for your domain
- [ ] Rate limiting active

### Performance Check
- [ ] Page load times < 3 seconds
- [ ] Images optimized
- [ ] API response times < 500ms
- [ ] Database queries optimized

## Troubleshooting

### Common Issues

#### 1. CORS Errors
```python
# In backend/main.py, ensure your domain is in CORS_ORIGINS
CORS_ORIGINS = [
    "https://yourstore.com",
    "https://www.yourstore.com",
    "http://localhost:3000"  # For development
]
```

#### 2. API Connection Issues
```javascript
// In frontend, verify API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.yourstore.com/api/v1';
```

#### 3. Database Connection
```bash
# Test database connection
python -c "from app.database import check_db_connection; print(check_db_connection())"
```

#### 4. SSL Issues
- Wait 24-48 hours for DNS propagation
- Use https:// in all URLs
- Check certificate status in browser

### Getting Help
- **Render Support**: help@render.com
- **Vercel Support**: support@vercel.com  
- **DNS Issues**: Contact your domain registrar

## Cost Estimate

### Monthly Costs (USD)
- **Render (Backend)**: $7/month (Starter plan)
- **Vercel (Frontend)**: Free (Pro: $20/month if needed)
- **PlanetScale (Database)**: Free (Scale: $29/month if needed)
- **Domain**: Already owned
- **SSL**: Free (included)
- **Total**: ~$7-50/month depending on scale

## Scaling Considerations

As your business grows:
1. **Upgrade Render plan** for more resources
2. **Use CDN** for faster global loading
3. **Database scaling** with read replicas
4. **Monitoring** with Sentry/LogRocket
5. **Caching** with Redis

---

## Quick Start Commands

```bash
# 1. Update environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
# Edit with your domain and API keys

# 2. Deploy backend
git push origin main  # Triggers Render deployment

# 3. Deploy frontend  
cd frontend
vercel --prod

# 4. Update DNS records in your domain provider
# 5. Test your live site!
```

Your eCommerce platform will be live at your domain within 24-48 hours! 🚀
