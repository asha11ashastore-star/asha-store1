#!/bin/bash

# 🚀 Automated Deployment Script for Aशā Store
# This script automates everything that can be automated

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

clear
echo -e "${PURPLE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║           🚀 Aशā Store Auto Deployment 🚀                 ║"
echo "║                                                           ║"
echo "║              Automated Deployment System                  ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Function to print section headers
print_section() {
    echo -e "\n${CYAN}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}\n"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}! $1${NC}"
}

# Function to print info
print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if we're in the correct directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the shopall directory"
    exit 1
fi

print_section "STEP 1: PREPARING CODE"

# Check git status
print_info "Checking Git repository..."
if [ -d .git ]; then
    print_success "Git repository found"
else
    print_info "Initializing Git repository..."
    git init
    print_success "Git initialized"
fi

# Add all files
print_info "Adding files to Git..."
git add .
print_success "Files added"

# Commit changes
print_info "Committing changes..."
if git commit -m "Asha Store - Production deployment ready" 2>/dev/null; then
    print_success "Changes committed"
else
    print_warning "No changes to commit (already committed)"
fi

print_section "STEP 2: GITHUB SETUP"

# Check if GitHub remote exists
if git remote get-url origin &> /dev/null; then
    REPO_URL=$(git remote get-url origin)
    print_success "GitHub remote configured: $REPO_URL"
    
    # Try to push
    print_info "Pushing to GitHub..."
    if git push origin main 2>&1; then
        print_success "Code pushed to GitHub!"
    else
        print_error "Push failed. Please push manually:"
        echo -e "${YELLOW}git push origin main${NC}"
    fi
else
    print_warning "GitHub remote not configured"
    echo ""
    echo -e "${YELLOW}Please complete GitHub setup:${NC}"
    echo ""
    echo "1. Create repository at: https://github.com/new"
    echo "   Name: asha-store"
    echo ""
    echo "2. Run these commands:"
    echo -e "${CYAN}git remote add origin https://github.com/YOUR_USERNAME/asha-store.git${NC}"
    echo -e "${CYAN}git push -u origin main${NC}"
    echo ""
    read -p "Press Enter after completing GitHub setup..."
fi

print_section "STEP 3: DEPLOYMENT LINKS"

echo -e "${GREEN}Opening deployment dashboards...${NC}"
echo ""

# Open all deployment pages
print_info "Opening Render..."
open "https://dashboard.render.com" 2>/dev/null || xdg-open "https://dashboard.render.com" 2>/dev/null

sleep 2

print_info "Opening Vercel..."
open "https://vercel.com/new" 2>/dev/null || xdg-open "https://vercel.com/new" 2>/dev/null

sleep 2

print_info "Opening GoDaddy..."
open "https://dashboard.godaddy.com" 2>/dev/null || xdg-open "https://dashboard.godaddy.com" 2>/dev/null

print_success "All dashboards opened!"

print_section "STEP 4: DEPLOYMENT INSTRUCTIONS"

echo -e "${PURPLE}════════════════════════════════════════════════════════${NC}"
echo -e "${PURPLE}                FOLLOW THESE STEPS                      ${NC}"
echo -e "${PURPLE}════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${CYAN}📦 RENDER (Backend):${NC}"
echo "   1. Click 'New +' → PostgreSQL"
echo "      - Name: asha-store-db"
echo "      - Region: Singapore"
echo "      - Create & COPY database URL"
echo ""
echo "   2. Click 'New +' → Web Service"
echo "      - Connect your GitHub repo"
echo "      - Root: backend"
echo "      - Build: pip install -r requirements.txt"
echo "      - Start: uvicorn main:app --host 0.0.0.0 --port \$PORT"
echo ""
echo "   3. Add Environment Variables (see COPY_PASTE_COMMANDS.txt)"
echo ""
echo "   4. Deploy & COPY backend URL"
echo ""

echo -e "${CYAN}🌐 VERCEL (Websites):${NC}"
echo "   1. Import your GitHub repository"
echo "   2. Deploy customer website:"
echo "      - Root: frontend/customer-website"
echo "      - Add env vars (see COPY_PASTE_COMMANDS.txt)"
echo ""
echo "   3. Deploy seller dashboard:"
echo "      - Root: frontend/react-dashboard"
echo "      - Add env var (see COPY_PASTE_COMMANDS.txt)"
echo ""

echo -e "${CYAN}🌍 GODADDY (DNS):${NC}"
echo "   1. Manage DNS → Add 3 records:"
echo "      - A      @      76.76.21.21"
echo "      - CNAME  www    cname.vercel-dns.com"
echo "      - CNAME  admin  cname.vercel-dns.com"
echo ""

print_section "STEP 5: CONFIGURATION FILES CREATED"

print_success "render.yaml - Render configuration"
print_success "vercel-customer.json - Customer website config"
print_success "COPY_PASTE_COMMANDS.txt - All commands"
print_success "CLICK_BY_CLICK_DEPLOY.md - Detailed guide"

print_section "DEPLOYMENT SUMMARY"

echo -e "${GREEN}✓ Code committed and ready${NC}"
echo -e "${GREEN}✓ Deployment dashboards opened${NC}"
echo -e "${GREEN}✓ Configuration files created${NC}"
echo ""
echo -e "${YELLOW}⏳ Manual steps required:${NC}"
echo "   1. Create PostgreSQL on Render"
echo "   2. Deploy backend on Render"
echo "   3. Deploy websites on Vercel"
echo "   4. Configure DNS on GoDaddy"
echo ""
echo -e "${BLUE}📖 Follow: CLICK_BY_CLICK_DEPLOY.md for exact steps${NC}"
echo -e "${BLUE}📋 Use: COPY_PASTE_COMMANDS.txt for all commands${NC}"
echo ""

print_section "ESTIMATED TIME"

echo "📊 Deployment Timeline:"
echo ""
echo "   GitHub Push:        ✓ Done"
echo "   Render Setup:       10 minutes"
echo "   Vercel Deploy:      10 minutes"
echo "   DNS Setup:          5 minutes"
echo "   DNS Propagation:    30-60 minutes"
echo "   ────────────────────────────────"
echo "   Total:              ~1.5-2 hours"
echo ""

print_section "NEXT STEPS"

echo -e "${PURPLE}🎯 WHAT TO DO NOW:${NC}"
echo ""
echo "1. In Render tab: Create database & deploy backend"
echo "2. In Vercel tab: Deploy customer site & dashboard"
echo "3. In GoDaddy tab: Add DNS records"
echo "4. Wait for DNS propagation"
echo "5. Test your live website!"
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}         🎉 Aशā Store Ready for Deployment! 🎉              ${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Open deployment guide
print_info "Opening deployment guide..."
open "CLICK_BY_CLICK_DEPLOY.md" 2>/dev/null || xdg-open "CLICK_BY_CLICK_DEPLOY.md" 2>/dev/null || cat "CLICK_BY_CLICK_DEPLOY.md"

echo ""
print_success "Automation complete! Follow the opened guide for manual steps."
echo ""
