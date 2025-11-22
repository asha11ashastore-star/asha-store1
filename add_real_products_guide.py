#!/usr/bin/env python3
"""
Guide and verification for adding real products
"""

import requests

API_BASE = "http://localhost:8000"

def verify_clean_database():
    """Verify database is clean and ready"""
    print("🔍 Verifying database status...")
    
    try:
        # Check products (public endpoint)
        response = requests.get(f"{API_BASE}/api/v1/products")
        if response.status_code == 200:
            data = response.json()
            products = data.get('products', data) if isinstance(data, dict) else data
            
            print(f"📦 Products in database: {len(products) if products else 0}")
            
            if not products:
                print("✅ Database is clean - ready for real products!")
                return True
            else:
                print("⚠️  Found some products still present")
                for product in products:
                    if isinstance(product, dict):
                        print(f"   📦 {product.get('name', 'Unknown')} (₹{product.get('price', 0)})")
                return False
        else:
            print(f"⚠️  Could not verify database: {response.status_code}")
            return True
    except Exception as e:
        print(f"❌ Verification error: {e}")
        return True

def check_seller_access():
    """Verify seller can access dashboard"""
    print("\n🔐 Testing seller dashboard access...")
    
    login_data = {
        "email": "asha@ashastore.com", 
        "password": "AshaStore2024!"
    }
    
    try:
        response = requests.post(f"{API_BASE}/api/v1/auth/login", json=login_data)
        if response.status_code == 200:
            user_data = response.json().get('user', {})
            print(f"✅ Seller login working!")
            print(f"   👤 User: {user_data.get('email', 'Unknown')}")
            print(f"   🏪 Role: {user_data.get('role', 'Unknown')}")
            return True
        else:
            print(f"❌ Seller login failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Login test error: {e}")
        return False

def show_real_product_examples():
    """Show examples of real products to add"""
    print("\n💡 REAL PRODUCT EXAMPLES FOR YOUR STORE:")
    print("=" * 60)
    
    examples = [
        {
            "name": "Pure Banarasi Silk Saree",
            "description": "Handwoven pure silk saree with traditional Banarasi motifs. Features intricate gold zari work and elegant border design. Perfect for weddings and special occasions.",
            "price": "₹4,500",
            "category": "saree",
            "sku": "BAN001",
            "stock": "5 pieces"
        },
        {
            "name": "Cotton Block Print Kurti",
            "description": "Hand block printed cotton kurti with traditional Rajasthani patterns. Comfortable daily wear with beautiful floral motifs. Available in multiple sizes.",
            "price": "₹1,200",
            "category": "kurti", 
            "sku": "KUR001",
            "stock": "15 pieces"
        },
        {
            "name": "Designer Lehenga Set",
            "description": "Elegant 3-piece lehenga set with heavy embroidery work. Includes blouse, lehenga skirt, and dupatta. Ideal for festivals and celebrations.",
            "price": "₹8,000",
            "category": "lehenga",
            "sku": "LEH001", 
            "stock": "3 pieces"
        }
    ]
    
    for i, example in enumerate(examples, 1):
        print(f"\n📦 EXAMPLE {i}: {example['name']}")
        print(f"   📝 Description: {example['description']}")
        print(f"   💰 Price: {example['price']}")
        print(f"   🏷️  Category: {example['category']}")
        print(f"   🔖 SKU: {example['sku']}")
        print(f"   📦 Stock: {example['stock']}")

def main():
    print("🚀 Real Products Setup Guide\n")
    print("=" * 60)
    
    # Verify database is clean
    db_clean = verify_clean_database()
    
    # Check seller access
    seller_ready = check_seller_access()
    
    if db_clean and seller_ready:
        print("\n🎉 EVERYTHING READY FOR REAL PRODUCTS!")
        
        print("\n📱 STEP-BY-STEP INSTRUCTIONS:")
        print("=" * 40)
        print("1. 🌐 Open: http://localhost:3000")
        print("2. 🔑 Login: asha@ashastore.com / AshaStore2024!")
        print("3. ➕ Click 'Add Product' in the sidebar")
        print("4. 📝 Fill in product details:")
        print("   • Product Name (authentic Indian clothing)")
        print("   • Detailed description (materials, craftsmanship)")
        print("   • Realistic price (market competitive)")
        print("   • Proper category (saree/kurti/lehenga)")
        print("   • Unique SKU code")
        print("   • Accurate stock quantity")
        print("5. 📸 Upload high-quality product images")
        print("6. 💾 Click 'Add Product' to save")
        
        # Show examples
        show_real_product_examples()
        
        print("\n✅ BENEFITS OF REAL PRODUCTS:")
        print("   • Professional appearance on customer website")
        print("   • Authentic product catalog")
        print("   • Ready for actual sales")
        print("   • SEO-friendly product listings")
        print("   • Customer trust and credibility")
        
        print("\n🔗 YOUR WEBSITES:")
        print(f"   📱 Seller Dashboard: http://localhost:3000")
        print(f"   🌐 Customer Website: http://localhost:3001")
        print(f"   🔧 Backend API: http://localhost:8000")
        
        print("\n🎯 PRO TIPS:")
        print("   • Use original product photos")
        print("   • Write engaging product descriptions")
        print("   • Research competitive pricing")
        print("   • Keep accurate inventory")
        print("   • Use traditional Indian clothing terminology")
        
    else:
        print("\n⚠️  SETUP ISSUES DETECTED:")
        if not db_clean:
            print("   • Database still has products")
        if not seller_ready:
            print("   • Seller access problems")
        print("   Please resolve these before adding products")

if __name__ == "__main__":
    main()
