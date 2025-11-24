#!/bin/bash
# Complete System Test - Asha Store
# Tests all components: Backend, Database, APIs, Authentication

echo "🧪 ASHA STORE - COMPLETE SYSTEM TEST"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BACKEND_URL="https://asha-store-backend.onrender.com"

# Test counter
PASSED=0
FAILED=0

# Test function
test_api() {
    local name=$1
    local url=$2
    local method=${3:-GET}
    local data=$4
    local headers=$5
    local expect=$6
    
    echo -n "Testing $name... "
    
    if [ "$method" = "POST" ]; then
        response=$(curl -sL -X POST "$url" -H "Content-Type: application/json" -d "$data" $headers)
    else
        response=$(curl -sL $headers "$url")
    fi
    
    if echo "$response" | grep -q "$expect"; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        echo "   Response: $response"
        ((FAILED++))
        return 1
    fi
}

echo "1️⃣  BACKEND HEALTH CHECK"
echo "────────────────────────"
test_api "Backend Health" "$BACKEND_URL/health" "GET" "" "" "healthy"
echo ""

echo "2️⃣  AUTHENTICATION TESTS"
echo "────────────────────────"

# Test customer registration
test_api "Customer Registration" \
    "$BACKEND_URL/api/v1/auth/register" \
    "POST" \
    '{"first_name":"Test","last_name":"User","username":"testuser'$(date +%s)'","email":"test'$(date +%s)'@test.com","password":"Test1234!","role":"buyer"}' \
    "" \
    "email"

# Test customer login
test_api "Customer Login" \
    "$BACKEND_URL/api/v1/auth/login" \
    "POST" \
    '{"email":"testcustomer456@test.com","password":"Test1234!"}' \
    "" \
    "access_token"

# Test seller login
test_api "Seller Login" \
    "$BACKEND_URL/api/v1/auth/login" \
    "POST" \
    '{"email":"owner@ashastore.com","password":"Owner2024!"}' \
    "" \
    "access_token"

echo ""

echo "3️⃣  PRODUCTS API TESTS"
echo "────────────────────────"

# Get token for authenticated requests
TOKEN=$(curl -s -X POST "$BACKEND_URL/api/v1/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"owner@ashastore.com","password":"Owner2024!"}' | \
    python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])" 2>/dev/null)

if [ -n "$TOKEN" ]; then
    # Test public products
    test_api "Public Products List" \
        "$BACKEND_URL/api/v1/products?limit=5" \
        "GET" \
        "" \
        "" \
        "items"
    
    # Test seller products
    SELLER_RESPONSE=$(curl -sL "$BACKEND_URL/api/v1/products/seller" \
        -H "Authorization: Bearer $TOKEN")
    echo -n "Testing Seller Products List... "
    if echo "$SELLER_RESPONSE" | grep -q "items"; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}"
        echo "   Response: $SELLER_RESPONSE"
        ((FAILED++))
    fi
    
    # Test product categories
    test_api "Product Categories" \
        "$BACKEND_URL/api/v1/products/categories/" \
        "GET" \
        "" \
        "" \
        "saree"
else
    echo -e "${RED}❌ Could not get authentication token${NC}"
    ((FAILED+=3))
fi

echo ""

echo "4️⃣  ORDERS API TESTS"
echo "────────────────────────"

if [ -n "$TOKEN" ]; then
    ORDERS_RESPONSE=$(curl -sL "$BACKEND_URL/api/v1/guest-orders" \
        -H "Authorization: Bearer $TOKEN")
    echo -n "Testing Guest Orders List... "
    if echo "$ORDERS_RESPONSE" | grep -q "\["; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}"
        echo "   Response: $ORDERS_RESPONSE"
        ((FAILED++))
    fi
else
    echo -e "${RED}❌ Could not test orders (no token)${NC}"
    ((FAILED++))
fi

echo ""

echo "5️⃣  COMPANY INFO TEST"
echo "────────────────────────"
test_api "Company Info" \
    "$BACKEND_URL/api/v1/company/info" \
    "GET" \
    "" \
    "" \
    "artisans_supported"

echo ""
echo "════════════════════════════════════════"
echo "           TEST SUMMARY"
echo "════════════════════════════════════════"
echo ""
echo -e "${GREEN}✅ PASSED: $PASSED${NC}"
echo -e "${RED}❌ FAILED: $FAILED${NC}"
echo ""

TOTAL=$((PASSED + FAILED))
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! SYSTEM IS FULLY OPERATIONAL!${NC}"
    echo ""
    echo "Your e-commerce platform is ready to launch! 🚀"
    echo ""
    echo "Customer Website: https://customer-website-lovat.vercel.app"
    echo "Seller Dashboard: https://react-dashboard-ashastore.vercel.app"
    echo "Backend API: $BACKEND_URL"
    exit 0
else
    echo -e "${YELLOW}⚠️  SOME TESTS FAILED${NC}"
    echo ""
    echo "Please check the failures above and fix them."
    echo "Most common issues:"
    echo "  - Backend not deployed yet (wait 3-5 min)"
    echo "  - Seller account doesn't exist (run: ./recreate_seller_account.sh)"
    echo "  - Database connection issue (check Render logs)"
    exit 1
fi
