#!/bin/bash

echo "🔍 Checking if NO-CACHE is deployed..."
echo ""
echo "⏰ Current time: $(date '+%I:%M %p')"
echo ""

echo "1️⃣ Checking Cache-Control headers..."
cache_header=$(curl -s -I https://customer-website-lovat.vercel.app/ 2>&1 | grep -i "cache-control" | head -1)
if echo "$cache_header" | grep -q "no-store"; then
    echo "   ✅ NO-CACHE headers found!"
    echo "   $cache_header"
else
    echo "   ❌ Still has caching enabled"
    echo "   $cache_header"
fi

echo ""
echo "2️⃣ Checking deployment age..."
age=$(curl -s -I https://customer-website-lovat.vercel.app/ 2>&1 | grep "age:" | awk '{print $2}')
age_clean=$(echo $age | tr -d '\r')
if [ -n "$age_clean" ]; then
    if [ "$age_clean" -lt 600 ]; then
        echo "   ✅ FRESH deployment! ($age_clean seconds old)"
    else
        echo "   ⚠️  Older deployment ($age_clean seconds = $((age_clean/60)) minutes)"
    fi
else
    echo "   ℹ️  No age header (might be fresh)"
fi

echo ""
echo "3️⃣ Checking for debug code..."
if curl -s "https://customer-website-lovat.vercel.app/collections" | grep -q "Debug:"; then
    echo "   ✅ Debug line found - NEW version!"
else
    echo "   ❌ Debug line not found - OLD version"
fi

echo ""
echo "4️⃣ Testing category functionality..."
if curl -s "https://customer-website-lovat.vercel.app/collections?category=handloom_saree" | grep -q "HANDLOOM SAREES"; then
    echo "   ✅ Categories WORKING! Shows 'HANDLOOM SAREES'"
else
    echo "   ❌ Categories broken - still shows 'ALL'"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Final verdict
if echo "$cache_header" | grep -q "no-store" && curl -s "https://customer-website-lovat.vercel.app/collections?category=handloom_saree" | grep -q "HANDLOOM SAREES"; then
    echo "🎉 SUCCESS! NO-CACHE is deployed and working!"
    echo ""
    echo "✅ Cache headers: Active"
    echo "✅ Categories: Working"
    echo "✅ Fresh content: Enabled"
    echo ""
    echo "👉 You can now test on mobile!"
    echo "   1. Clear Safari cache ONE MORE TIME"
    echo "   2. Go to website"
    echo "   3. Test categories"
    echo "   4. It should work!"
else
    echo "⏳ NOT READY YET"
    echo ""
    echo "Please wait a few more minutes for Vercel to deploy."
    echo "Run this script again in 2-3 minutes."
fi

echo ""
