#!/bin/bash

# 🚀 Build Script for Subdirectory Deployment
# This script builds both websites for deployment on the same domain

echo "🎯 Starting build process for subdirectory deployment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Create deployment folder
DEPLOY_DIR="$HOME/Desktop/asha-store-deployment"
echo "${BLUE}📁 Creating deployment folder...${NC}"
mkdir -p "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR/seller"

# Build Customer Website (Next.js)
echo ""
echo "${BLUE}🏪 Building Customer Website (Next.js)...${NC}"
cd "$(dirname "$0")/frontend/customer-website"

if [ ! -d "node_modules" ]; then
    echo "${BLUE}📦 Installing dependencies...${NC}"
    npm install
fi

echo "${BLUE}⚙️  Building Next.js app...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo "${GREEN}✅ Customer website built successfully!${NC}"
    
    # Note: Next.js requires Node.js hosting
    echo "${BLUE}📝 Note: Next.js requires Node.js hosting (Vercel recommended)${NC}"
else
    echo "${RED}❌ Customer website build failed!${NC}"
    exit 1
fi

# Build Seller Dashboard (React)
echo ""
echo "${BLUE}📊 Building Seller Dashboard (React) for /seller/ subdirectory...${NC}"
cd "$(dirname "$0")/frontend/react-dashboard"

if [ ! -d "node_modules" ]; then
    echo "${BLUE}📦 Installing dependencies...${NC}"
    npm install
fi

echo "${BLUE}⚙️  Building React app with PUBLIC_URL=/seller...${NC}"
npm run build:subdirectory

if [ $? -eq 0 ]; then
    echo "${GREEN}✅ Seller dashboard built successfully!${NC}"
    
    # Copy seller dashboard files to deployment folder
    echo "${BLUE}📋 Copying seller dashboard files to deployment folder...${NC}"
    cp -r build/* "$DEPLOY_DIR/seller/"
    echo "${GREEN}✅ Files copied to: $DEPLOY_DIR/seller/${NC}"
else
    echo "${RED}❌ Seller dashboard build failed!${NC}"
    exit 1
fi

# Create .htaccess for React Router
echo ""
echo "${BLUE}📝 Creating .htaccess file for React Router...${NC}"
cat > "$DEPLOY_DIR/seller/.htaccess" << 'EOF'
# .htaccess for React Router in subdirectory
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /seller/
  
  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Rewrite everything else to index.html
  RewriteRule ^ index.html [L]
</IfModule>

# Enable CORS (if needed)
<IfModule mod_headers.c>
  Header set Access-Control-Allow-Origin "*"
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
EOF

echo "${GREEN}✅ .htaccess file created!${NC}"

# Create README for deployment
echo ""
echo "${BLUE}📝 Creating deployment README...${NC}"
cat > "$DEPLOY_DIR/DEPLOYMENT_INSTRUCTIONS.txt" << 'EOF'
🚀 DEPLOYMENT INSTRUCTIONS
==========================

Your files are ready for deployment!

📁 FOLDER STRUCTURE:
-------------------
seller/          → Upload this entire folder to: public_html/seller/

📤 UPLOAD STEPS:
---------------
1. Login to your cPanel
2. Open File Manager
3. Go to public_html folder
4. Upload the 'seller' folder (drag and drop or use Upload button)
5. Make sure .htaccess file is also uploaded inside seller folder

🌐 ACCESS YOUR SITES:
--------------------
Customer Website: https://yourdomain.com/
  (Keep on Vercel - Next.js requires Node.js)

Seller Dashboard: https://yourdomain.com/seller/
  (Upload to cPanel as instructed above)

✅ VERIFICATION:
---------------
After upload, visit:
- https://yourdomain.com/seller/
- Should show seller login page
- Test login and dashboard features

⚠️ IMPORTANT NOTES:
------------------
1. Make sure .htaccess file is in the seller folder
2. If React Router doesn't work, check .htaccess
3. If CSS/JS don't load, rebuild with: npm run build:subdirectory
4. Backend API should already be working on Render

🆘 TROUBLESHOOTING:
------------------
404 on refresh → Check .htaccess file exists
CSS not loading → Check PUBLIC_URL=/seller was used in build
API errors → Check CORS settings in backend

Need help? Check SUBDIRECTORY_DEPLOYMENT_GUIDE.md
EOF

echo "${GREEN}✅ Deployment README created!${NC}"

# Summary
echo ""
echo "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo "${GREEN}║  🎉 BUILD COMPLETE! FILES READY FOR DEPLOYMENT!       ║${NC}"
echo "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "${BLUE}📁 Deployment folder created at:${NC}"
echo "   $DEPLOY_DIR"
echo ""
echo "${BLUE}📦 What's inside:${NC}"
echo "   ✅ seller/              → Ready to upload to public_html/seller/"
echo "   ✅ seller/.htaccess     → React Router configuration"
echo "   ✅ DEPLOYMENT_INSTRUCTIONS.txt → Upload guide"
echo ""
echo "${BLUE}📤 Next Steps:${NC}"
echo "   1. Open: $DEPLOY_DIR"
echo "   2. Upload 'seller' folder to cPanel: public_html/seller/"
echo "   3. Visit: https://yourdomain.com/seller/"
echo ""
echo "${BLUE}📖 For detailed instructions, read:${NC}"
echo "   SUBDIRECTORY_DEPLOYMENT_GUIDE.md"
echo ""
echo "${GREEN}🚀 Happy Deploying!${NC}"
