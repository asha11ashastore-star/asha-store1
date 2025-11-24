#!/bin/bash
# Auto-recreate seller account after deployment

echo "🔄 Recreating seller account..."

curl -X POST "https://asha-store-backend.onrender.com/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Asha",
    "last_name": "Store",
    "username": "ashaowner",
    "email": "owner@ashastore.com",
    "password": "Owner2024!",
    "role": "seller"
  }' 2>/dev/null

echo ""
echo "✅ Account recreated!"
echo ""
echo "Login credentials:"
echo "Email: owner@ashastore.com"
echo "Password: Owner2024!"
