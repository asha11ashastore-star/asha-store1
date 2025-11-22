# Live Mode Deployment Checklist

This checklist ensures you switch from test mode to live mode safely and correctly.

## 🔧 Pre-Live Setup

### 1. Razorpay Live Mode Activation
- [ ] Complete Razorpay account verification
- [ ] Submit all required KYC documents
- [ ] Get account approved for live transactions
- [ ] Generate live API keys (rzp_live_*)
- [ ] Set up live webhook URL: `https://your-backend-url/api/v1/payment/webhook`
- [ ] Test webhook signature validation with live keys

### 2. Domain & SSL Setup
- [ ] Purchase and configure custom domain
- [ ] Update DNS records (A, CNAME)
- [ ] SSL certificates automatically provisioned
- [ ] Test HTTPS on all endpoints
- [ ] Update CORS settings for production domain

### 3. Database Production Ready
- [ ] Promote PlanetScale branch to production
- [ ] Run all database migrations
- [ ] Set up automated backups
- [ ] Create database connection pooling
- [ ] Test database performance under load

### 4. Email Configuration
- [ ] Complete SendGrid sender verification
- [ ] Set up custom domain for emails (optional)
- [ ] Create email templates for production
- [ ] Test all transactional emails
- [ ] Configure DMARC, SPF, DKIM records

### 5. File Storage & CDN
- [ ] Upgrade Cloudinary to production plan
- [ ] Configure Cloudinary auto-optimization
- [ ] Set up image transformations
- [ ] Test file upload limits and sizes
- [ ] Consider additional CDN if needed

## 🔐 Security Hardening

### 1. Environment Variables
Update all production environment variables:

#### Backend (.env)
```bash
# Database - Production PlanetScale URL
DATABASE_URL=mysql+pymysql://username:password@aws.connect.psdb.cloud/shopall?ssl_ca=/etc/ssl/certs/ca-certificates.crt&ssl_disabled=false

# Security - Generate new secret key (256 bits)
SECRET_KEY=your-new-super-secret-production-key-256-bits-long

# Razorpay - LIVE MODE KEYS
RAZORPAY_KEY_ID=rzp_live_your_actual_key_id
RAZORPAY_KEY_SECRET=your_actual_razorpay_live_secret
RAZORPAY_WEBHOOK_SECRET=your_actual_webhook_secret

# Cloudinary - Production account
CLOUDINARY_CLOUD_NAME=your_production_cloud_name
CLOUDINARY_API_KEY=your_production_api_key
CLOUDINARY_API_SECRET=your_production_api_secret

# SendGrid - Production account
SENDGRID_API_KEY=SG.your_production_sendgrid_key
FROM_EMAIL=noreply@yourstore.com
FROM_NAME=YourStore

# Monitoring
SENTRY_DSN=https://your-production-sentry-dsn@sentry.io/project

# Production settings
ENVIRONMENT=production
DEBUG=false
FRONTEND_URL=https://yourstore.com
```

#### Frontend (.env.local)
```bash
# API URLs
NEXT_PUBLIC_BACKEND_URL=https://your-api.yourstore.com
NEXT_PUBLIC_API_URL=https://your-api.yourstore.com/api/v1

# Razorpay - LIVE MODE KEY
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_actual_key_id

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_production_cloud_name

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://your-frontend-sentry-dsn@sentry.io/project

# Production settings
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_SITE_URL=https://yourstore.com
```

### 2. Security Headers & Configuration
- [ ] Enable HSTS headers
- [ ] Configure CSP (Content Security Policy)
- [ ] Enable XSS protection
- [ ] Set secure cookie flags
- [ ] Configure rate limiting for production traffic
- [ ] Enable request logging and monitoring

## 💳 Payment Testing (CRITICAL)

### 1. Razorpay Live Mode Testing
- [ ] Start with smallest possible test amount (₹1)
- [ ] Test successful payment flow
- [ ] Test failed payment scenarios
- [ ] Verify webhook receives events correctly
- [ ] Check order status updates properly
- [ ] Test refund functionality
- [ ] Verify commission calculations
- [ ] Test payout requests (if implemented)

### 2. Payment Flow Validation
- [ ] Complete buyer journey: cart → checkout → payment → confirmation
- [ ] Test with different payment methods (cards, UPI, netbanking)
- [ ] Verify email notifications sent correctly
- [ ] Check seller commission calculations
- [ ] Test order status updates
- [ ] Validate inventory management

## 📊 Monitoring & Alerting

### 1. Application Monitoring
- [ ] Configure Sentry error tracking
- [ ] Set up performance monitoring
- [ ] Configure uptime monitoring (UptimeRobot, etc.)
- [ ] Set up log aggregation
- [ ] Configure application metrics

### 2. Business Metrics
- [ ] Set up conversion tracking
- [ ] Monitor payment success/failure rates
- [ ] Track user registration and engagement
- [ ] Monitor API response times
- [ ] Set up database performance monitoring

### 3. Alerting Rules
- [ ] High error rate alerts
- [ ] Payment failure alerts
- [ ] Database connection issues
- [ ] High response time alerts
- [ ] Failed deployment alerts

## 🚀 Go-Live Process

### 1. Final Pre-Launch Tests (24 hours before)
- [ ] Complete end-to-end test with live payment keys
- [ ] Test on mobile devices
- [ ] Verify all email templates
- [ ] Check all pages load correctly
- [ ] Test search and filtering
- [ ] Verify seller onboarding process
- [ ] Test admin functionalities

### 2. Launch Day Checklist
- [ ] **11:59 PM**: Switch to live environment variables
- [ ] **12:00 AM**: Deploy backend with live configuration
- [ ] **12:05 AM**: Deploy frontend with live configuration
- [ ] **12:10 AM**: Run smoke tests on critical paths
- [ ] **12:15 AM**: Test live payment with ₹1 transaction
- [ ] **12:20 AM**: Monitor error rates and performance
- [ ] **12:30 AM**: Announce soft launch to limited users

### 3. Post-Launch Monitoring (First 24 hours)
- [ ] Monitor payment success rates
- [ ] Check error logs every hour
- [ ] Verify email delivery rates
- [ ] Monitor database performance
- [ ] Check SSL certificate status
- [ ] Monitor CDN performance
- [ ] Track conversion funnel

## 🔄 Rollback Plan

### If Issues Occur:
1. **Immediate Actions**:
   - [ ] Revert to test mode environment variables
   - [ ] Deploy last known good version
   - [ ] Put maintenance page up if needed
   - [ ] Notify stakeholders

2. **Investigation**:
   - [ ] Check application logs
   - [ ] Review Sentry errors
   - [ ] Check database status
   - [ ] Verify external service status

3. **Communication**:
   - [ ] Notify users of any issues
   - [ ] Update status page
   - [ ] Post on social media if needed

## 📋 Legal & Compliance

### 1. Terms & Policies (Must Complete Before Launch)
- [ ] Create Privacy Policy (GDPR compliant)
- [ ] Draft Terms of Service
- [ ] Create Return/Refund Policy
- [ ] Add Cookie Policy
- [ ] Include Seller Terms & Conditions
- [ ] Add Contact Information page

### 2. Compliance Requirements
- [ ] GST compliance (if in India)
- [ ] Consumer protection compliance
- [ ] Payment card industry (PCI) compliance
- [ ] Data protection compliance (GDPR/CCPA)
- [ ] Accessibility compliance (WCAG 2.1)

## 🎯 Success Metrics

### Monitor These KPIs in First Week:
- [ ] Site uptime (target: 99.9%)
- [ ] Payment success rate (target: >95%)
- [ ] Page load time (target: <2s)
- [ ] Error rate (target: <1%)
- [ ] User registration rate
- [ ] Order completion rate
- [ ] Customer support tickets

## ✅ Final Pre-Launch Sign-off

### Technical Team:
- [ ] Backend developer approval
- [ ] Frontend developer approval  
- [ ] DevOps/Infrastructure approval
- [ ] Security review completion
- [ ] Performance testing approval

### Business Team:
- [ ] Product manager approval
- [ ] Legal compliance approval
- [ ] Marketing readiness
- [ ] Customer support preparation
- [ ] Payment processor approval

## 🚨 Emergency Contacts

Prepare contact information for:
- [ ] Razorpay support team
- [ ] PlanetScale support
- [ ] Vercel/Render support
- [ ] Domain registrar support
- [ ] SSL certificate provider
- [ ] Your development team contacts

---

## ⚠️ IMPORTANT REMINDERS

1. **NEVER** test live payment keys in development
2. **ALWAYS** start with small transaction amounts
3. **BACKUP** database before any major changes  
4. **MONITOR** closely for first 48 hours after launch
5. **HAVE** rollback plan ready at all times

---

*This checklist should be reviewed and signed off by technical lead and business stakeholders before going live.*
