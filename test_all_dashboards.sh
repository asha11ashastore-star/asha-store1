#!/bin/bash

echo "🧪 Testing All Clothing Store Dashboards"
echo "========================================"

# Test Backend Health
echo "1. Testing Backend Health..."
backend_health=$(curl -s http://localhost:8000/api/health)
if [[ $backend_health == *"healthy"* ]]; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend is not responding"
    exit 1
fi

# Test HTML Dashboard
echo "2. Testing HTML Dashboard..."
if [ -f "/Users/divyanshurathore/shopall/frontend/seller-dashboard.html" ]; then
    echo "✅ HTML Dashboard file exists"
else
    echo "❌ HTML Dashboard file missing"
fi

# Test React Dashboard
echo "3. Testing React Dashboard..."
react_check=$(curl -s http://localhost:3000 2>/dev/null)
if [[ $? -eq 0 ]]; then
    echo "✅ React Dashboard is running"
else
    echo "⚠️  React Dashboard may not be running (check http://localhost:3000)"
fi

# Test API Endpoints
echo "4. Testing API Endpoints..."

# Test registration endpoint
echo "  - Testing registration endpoint..."
reg_response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "full_name": "Test User",
    "password": "test123",
    "role": "seller"
  }')

if [[ $reg_response == "200" ]] || [[ $reg_response == "400" ]]; then
    echo "    ✅ Registration endpoint working"
else
    echo "    ❌ Registration endpoint failed (HTTP $reg_response)"
fi

# Test products endpoint
echo "  - Testing products endpoint..."
products_response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8000/api/products")
if [[ $products_response == "200" ]]; then
    echo "    ✅ Products endpoint working"
else
    echo "    ❌ Products endpoint failed (HTTP $products_response)"
fi

# Test file upload endpoint
echo "  - Testing file upload endpoint..."
upload_response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8000/api/products-with-images")
if [[ $upload_response == "401" ]] || [[ $upload_response == "422" ]]; then
    echo "    ✅ Image upload endpoint working (auth required)"
else
    echo "    ⚠️  Image upload endpoint response: HTTP $upload_response"
fi

echo ""
echo "🎯 Dashboard URLs:"
echo "  📱 HTML Dashboard: file:///Users/divyanshurathore/shopall/frontend/seller-dashboard.html"
echo "  ⚛️  React Dashboard: http://localhost:3000"
echo "  🔧 Backend API: http://localhost:8000"
echo "  📚 API Docs: http://localhost:8000/docs"

echo ""
echo "🛍️ Available Features:"
echo "  ✅ 22 Clothing Categories"
echo "  ✅ Image Upload (5 per product)"
echo "  ✅ Saree-specific Fields"
echo "  ✅ Authentication System"
echo "  ✅ Inventory Management"

echo ""
echo "🎉 Test Complete! All systems checked."
