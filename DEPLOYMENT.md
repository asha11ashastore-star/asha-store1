# ShopAll Deployment Guide

This guide provides step-by-step instructions for deploying the ShopAll eCommerce platform to production.

## Prerequisites

- GitHub account
- PlanetScale account (or MySQL 8.0+ server)
- Render account (for backend) or Railway
- Vercel account (for frontend)
- Cloudinary account
- Razorpay account
- SendGrid account
- Sentry account (optional but recommended)

## Environment Setup

### 1. Database Setup (PlanetScale)

```bash
# Install PlanetScale CLI
brew install planetscale/tap/pscale
# or
curl -fsSL https://get.planetscale.com/cli | sh

# Authenticate
pscale auth login

# Create database
pscale database create shopall --region us-east

# Create production branch
pscale branch create shopall production

# Create development branch
pscale branch create shopall development

# Connect to development branch for migrations
pscale connect shopall development --port 3309

# Update DATABASE_URL in backend/.env:
# DATABASE_URL=mysql+pymysql://root@127.0.0.1:3309/shopall
```

### 2. External Services Setup

#### Razorpay
1. Sign up at https://razorpay.com
2. Generate test API keys from Dashboard > Settings > API Keys
3. Set up webhook endpoint: `https://your-backend-url/api/v1/payment/webhook`
4. Note down Key ID, Key Secret, and Webhook Secret

#### Cloudinary
1. Sign up at https://cloudinary.com
2. Get Cloud Name, API Key, and API Secret from Dashboard
3. Configure upload presets if needed

#### SendGrid
1. Sign up at https://sendgrid.com
2. Create API key with Mail Send permissions
3. Verify sender identity/domain

#### Sentry (Optional)
1. Sign up at https://sentry.io
2. Create new project for FastAPI backend
3. Create new project for Next.js frontend
4. Note down DSN URLs

## Backend Deployment (Render)

### 1. Prepare Backend

1. Push code to GitHub repository
2. Ensure all environment variables are in `.env.example`

### 2. Deploy to Render

1. Connect GitHub repository to Render
2. Create new Web Service
3. Configure build settings:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Python Version**: 3.11

4. Set environment variables:
```env
DATABASE_URL=your_planetscale_production_url
SECRET_KEY=your_super_secret_key_256_bits
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SENDGRID_API_KEY=SG.your_sendgrid_api_key
FROM_EMAIL=noreply@yourstore.com
SENTRY_DSN=your_sentry_backend_dsn
ENVIRONMENT=production
DEBUG=false
FRONTEND_URL=https://yourstore.vercel.app
```

5. Deploy and test health endpoint: `https://your-backend-url/health`

### 3. Run Database Migrations

```bash
# Connect to production database
pscale connect shopall production --port 3309

# In another terminal, run migrations
cd backend
DATABASE_URL=mysql+pymysql://root@127.0.0.1:3309/shopall alembic upgrade head

# Promote development branch to production (when ready)
pscale deploy-request create shopall development production
pscale deploy-request deploy shopall <deploy-request-number>
```

## Frontend Deployment (Vercel)

### 1. Prepare Frontend

Update `frontend/.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url
NEXT_PUBLIC_API_URL=https://your-backend-url/api/v1
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_key_id
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_SENTRY_DSN=your_sentry_frontend_dsn
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_SITE_URL=https://yourstore.com
```

### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod

# Or connect GitHub repository in Vercel dashboard
```

### 3. Configure Custom Domain

1. Add domain in Vercel dashboard
2. Update DNS records as instructed
3. SSL certificate will be automatically provisioned

## Production Configuration

### 1. Security Checklist

- [ ] HTTPS enabled on all endpoints
- [ ] CORS configured for production domains
- [ ] Rate limiting enabled
- [ ] Input validation and sanitization
- [ ] SQL injection protection
- [ ] XSS protection headers
- [ ] Secure cookie settings
- [ ] Environment variables secured

### 2. Monitoring Setup

```bash
# Backend health check
curl https://your-backend-url/health

# Frontend health check
curl https://yourstore.com

# Set up uptime monitoring (UptimeRobot, Pingdom, etc.)
```

### 3. Backup Configuration

```sql
-- PlanetScale automatic backups are enabled by default
-- For manual backup:
pscale database dump shopall production --output shopall-backup.sql

-- Restore from backup:
pscale database restore-dump shopall production shopall-backup.sql
```

## CI/CD Setup

### 1. GitHub Secrets

Configure the following secrets in your GitHub repository:

```
RENDER_API_KEY=your_render_api_key
RENDER_BACKEND_SERVICE_ID=your_render_service_id
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
SLACK_WEBHOOK_URL=your_slack_webhook_url (optional)
```

### 2. Automated Deployments

The CI/CD pipeline will automatically:
- Run tests on pull requests
- Deploy to production on merge to main
- Run security scans
- Send notifications

## Going Live Checklist

### Pre-Launch
- [ ] Test all user workflows (registration, login, shopping, checkout)
- [ ] Verify payment processing with test transactions
- [ ] Test email notifications
- [ ] Check error handling and logging
- [ ] Verify mobile responsiveness
- [ ] Test performance under load
- [ ] Security audit completed
- [ ] SSL certificates installed
- [ ] DNS configured correctly
- [ ] Backup procedures tested

### Razorpay Live Mode
1. Complete account verification
2. Submit required documents
3. Switch to live API keys in environment variables
4. Update webhook URL to production
5. Test with small transactions first

### Launch
- [ ] Switch database to production branch
- [ ] Update all environment variables to production values
- [ ] Deploy backend and frontend
- [ ] Test critical paths
- [ ] Monitor error rates and performance
- [ ] Announce launch

### Post-Launch
- [ ] Set up monitoring alerts
- [ ] Configure log aggregation
- [ ] Plan for scaling
- [ ] Set up regular backups
- [ ] Create runbook for common issues

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check PlanetScale connection string
   - Verify SSL settings
   - Ensure database branch is promoted

2. **Payment Failures**
   - Verify Razorpay webhook URL
   - Check webhook signature validation
   - Ensure live mode keys are correct

3. **Image Upload Issues**
   - Verify Cloudinary configuration
   - Check upload presets
   - Validate file size limits

4. **Email Delivery Issues**
   - Verify SendGrid API key
   - Check sender verification
   - Monitor SendGrid dashboard

### Performance Optimization

1. **Database**
   - Add database indexes for frequently queried fields
   - Use database connection pooling
   - Monitor slow queries

2. **API**
   - Implement Redis caching
   - Use CDN for static assets
   - Optimize database queries

3. **Frontend**
   - Enable Next.js image optimization
   - Use Vercel Edge Functions for API routes
   - Implement lazy loading

## Support

For deployment issues:
1. Check logs in Render/Vercel dashboards
2. Monitor Sentry for errors
3. Review GitHub Actions logs
4. Contact platform support if needed

## Scaling Considerations

As your platform grows:
1. **Database**: Consider read replicas, connection pooling
2. **Storage**: Move to dedicated object storage (S3)
3. **Caching**: Implement Redis for session storage and caching
4. **CDN**: Use Cloudflare for global content delivery
5. **Monitoring**: Upgrade to comprehensive APM solution
6. **Infrastructure**: Consider containerization with Kubernetes
