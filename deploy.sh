#!/bin/bash

echo "🚀 Deploying Aशā Store..."
echo "================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check if git is initialized
echo -e "\n${BLUE}Step 1: Checking Git...${NC}"
if [ -d .git ]; then
    echo -e "${GREEN}✓ Git repository found${NC}"
else
    echo -e "${YELLOW}! Initializing Git repository...${NC}"
    git init
fi

# Step 2: Add all files
echo -e "\n${BLUE}Step 2: Adding files to Git...${NC}"
git add .

# Step 3: Commit
echo -e "\n${BLUE}Step 3: Committing changes...${NC}"
git commit -m "Asha Store - Production Ready" || echo "No changes to commit"

# Step 4: Check if GitHub remote exists
echo -e "\n${BLUE}Step 4: Checking GitHub remote...${NC}"
if git remote get-url origin &> /dev/null; then
    echo -e "${GREEN}✓ GitHub remote configured${NC}"
    REPO_URL=$(git remote get-url origin)
    echo "Repository: $REPO_URL"
else
    echo -e "${RED}✗ GitHub remote not configured${NC}"
    echo -e "${YELLOW}Please set up GitHub first:${NC}"
    echo "1. Create a repository at github.com"
    echo "2. Run: git remote add origin YOUR_REPO_URL"
    echo "3. Run this script again"
    exit 1
fi

# Step 5: Push to GitHub
echo -e "\n${BLUE}Step 5: Pushing to GitHub...${NC}"
echo -e "${YELLOW}Attempting to push...${NC}"
if git push origin main 2>&1; then
    echo -e "${GREEN}✓ Code pushed to GitHub!${NC}"
else
    echo -e "${RED}✗ Push failed${NC}"
    echo -e "${YELLOW}Please push manually or set up authentication${NC}"
    echo "Run: git push origin main"
fi

# Step 6: Display next steps
echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}Git Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"

echo -e "\n${BLUE}Next Steps:${NC}"
echo ""
echo "1️⃣  Deploy Backend (Render.com):"
echo "   → Go to: https://dashboard.render.com"
echo "   → Click 'New +' → PostgreSQL"
echo "   → Name: asha-store-db"
echo "   → Then: 'New +' → Web Service"
echo "   → Root: backend"
echo "   → Build: pip install -r requirements.txt"
echo "   → Start: uvicorn main:app --host 0.0.0.0 --port \$PORT"
echo ""
echo "2️⃣  Deploy Customer Website (Vercel):"
echo "   → Go to: https://vercel.com/ashastore"
echo "   → Import repository"
echo "   → Root: frontend/customer-website"
echo "   → Deploy"
echo ""
echo "3️⃣  Deploy Seller Dashboard (Vercel):"
echo "   → Go to: https://vercel.com/ashastore"
echo "   → Import same repository"
echo "   → Root: frontend/react-dashboard"
echo "   → Deploy"
echo ""
echo "4️⃣  Connect Domain (GoDaddy):"
echo "   → Add DNS records from Vercel"
echo ""

echo -e "\n${YELLOW}📖 Full instructions: DEPLOY_INSTRUCTIONS.md${NC}"
echo -e "${YELLOW}⚡ Quick reference: QUICK_DEPLOY_STEPS.txt${NC}"
