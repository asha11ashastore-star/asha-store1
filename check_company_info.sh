#!/bin/bash

echo "🔍 Checking Company Info API..."
echo ""

curl -s https://asha-store-backend.onrender.com/api/v1/company/info | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print('📊 Current Database Values:')
    print(f'  • Artisans: {data.get(\"artisans_supported\", \"N/A\")}')
    print(f'  • Villages: {data.get(\"villages_reached\", \"N/A\")}')
    print(f'  • Customers: {data.get(\"happy_customers\", \"N/A\")}')
    print(f'  • Years: {data.get(\"years_of_excellence\", \"N/A\")}')
    print('')
    
    if data.get('years_of_excellence') == '1+':
        print('✅ Years set to 1+ - CORRECT!')
    else:
        print('❌ Years still showing:', data.get('years_of_excellence'))
        print('   You need to update it in the dashboard!')
except:
    print('❌ Error fetching data')
"

echo ""
echo "💡 Run this script after updating dashboard to verify!"
