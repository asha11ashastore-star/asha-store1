#!/bin/bash

echo "🚀 Opening all deployment pages for you..."
echo "=========================================="

# Open GitHub to create repository
echo "📦 Opening GitHub..."
open "https://github.com/new"
sleep 2

# Open Render dashboard
echo "🖥️ Opening Render..."
open "https://dashboard.render.com"
sleep 2

# Open Vercel dashboard
echo "🌐 Opening Vercel..."
open "https://vercel.com/ashastore"
sleep 2

# Open GoDaddy
echo "🌍 Opening GoDaddy..."
open "https://godaddy.com"
sleep 2

# Open the deployment guide
echo "📖 Opening deployment guide..."
open "CLICK_BY_CLICK_DEPLOY.md"

echo ""
echo "✅ All pages opened!"
echo "=========================================="
echo ""
echo "📝 FOLLOW THESE STEPS:"
echo ""
echo "1️⃣  In GitHub tab:"
echo "   → Name: asha-store"
echo "   → Click 'Create repository'"
echo ""
echo "2️⃣  Then in Terminal, run:"
echo "   cd /Users/divyanshurathore/shopall"
echo "   git remote add origin https://github.com/YOUR_USERNAME/asha-store.git"
echo "   git push -u origin main"
echo ""
echo "3️⃣  In Render tab:"
echo "   → Create PostgreSQL database"
echo "   → Create Web Service for backend"
echo ""
echo "4️⃣  In Vercel tab:"
echo "   → Deploy customer website"
echo "   → Deploy seller dashboard"
echo ""
echo "5️⃣  In GoDaddy tab:"
echo "   → Add DNS records"
echo ""
echo "📖 Follow CLICK_BY_CLICK_DEPLOY.md for exact steps!"
echo ""
