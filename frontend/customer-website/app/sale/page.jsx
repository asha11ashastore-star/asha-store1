'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useCart } from '../../components/CartProvider'
import apiService from '../../services/api'

export default function SalePage() {
  const router = useRouter()
  const { addItem } = useCart()
  const [saleProducts, setSaleProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSaleProducts()
  }, [])

  const fetchSaleProducts = async () => {
    try {
      setLoading(true)
      const response = await apiService.getAllProducts()
      
      console.log('=== SALE PAGE DEBUG ===')
      console.log('Total products fetched:', response.data.length)
      
      // Filter products that have discounted_price set (products on sale)
      const onSaleProducts = response.data.filter(product => {
        const hasDiscountPrice = product.discounted_price !== null && product.discounted_price !== undefined
        const discountPrice = parseFloat(product.discounted_price) || 0
        const regularPrice = parseFloat(product.price) || 0
        const isDiscounted = hasDiscountPrice && discountPrice > 0 && discountPrice < regularPrice
        const isActive = product.status?.toLowerCase() === 'active'
        const inStock = product.stock_quantity > 0
        
        // Debug each product
        console.log(`Product: ${product.name}`)
        console.log(`  - Price: ${regularPrice}, Discounted: ${discountPrice}`)
        console.log(`  - Status: ${product.status} (active: ${isActive})`)
        console.log(`  - Stock: ${product.stock_quantity} (inStock: ${inStock})`)
        console.log(`  - Show on sale: ${isDiscounted && isActive && inStock}`)
        
        return isDiscounted && isActive && inStock
      })
      
      console.log('Sale products found:', onSaleProducts.length)
      setSaleProducts(onSaleProducts)
    } catch (error) {
      console.error('Failed to fetch sale products:', error)
      setSaleProducts([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-beige-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif mb-4" style={{ color: '#B83C3A' }}>SALE</h1>
          <p className="text-xl text-gray-600">Up to 60% Off on Selected Items</p>
          <div className="mt-4 inline-block bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">
            🔥 Limited Time Offers - Shop Now!
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading sale products...</p>
          </div>
        ) : saleProducts.length === 0 ? (
          /* No Sale Products */
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-6xl mb-4">🏷️</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Sale Items Yet</h3>
            <p className="text-gray-600 mb-4">Check back soon for amazing deals!</p>
            <p className="text-sm text-gray-500 bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
              <strong>For Seller:</strong> Add products with discounted prices in your dashboard to show them here!
            </p>
          </div>
        ) : (
          /* Sale Products Grid */
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {saleProducts.map((product) => {
              const discount = Math.round((1 - parseFloat(product.discounted_price) / parseFloat(product.price)) * 100)
              
              return (
                <div 
                  key={product.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative"
                >
                  {/* Sale Badge */}
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold z-10">
                    SALE {discount}% OFF
                  </div>
                  
                  {/* Product Image - Clickable */}
                  <div 
                    className="h-64 bg-gradient-to-br from-beige-100 to-beige-200 flex items-center justify-center cursor-pointer"
                    onClick={() => router.push(`/product/${product.id}`)}
                  >
                    <img 
                      src={
                        product.primary_image?.startsWith('http') 
                          ? product.primary_image 
                          : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://asha-store-backend.onrender.com'}${product.primary_image || '/uploads/placeholder.jpg'}`
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.parentElement.innerHTML = `
                          <div class="text-gray-400 text-center">
                            <div class="text-4xl mb-2">👗</div>
                            <div class="text-xs">No Image</div>
                          </div>
                        `
                      }}
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 
                      className="font-medium text-lg mb-1 line-clamp-1 cursor-pointer hover:text-red-600"
                      onClick={() => router.push(`/product/${product.id}`)}
                    >
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-xl font-bold text-red-600">₹{parseFloat(product.discounted_price).toLocaleString()}</span>
                      <span className="text-sm text-gray-500 line-through">₹{parseFloat(product.price).toLocaleString()}</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                        {discount}% OFF
                      </span>
                    </div>
                    
                    {product.stock_quantity > 0 ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          addItem({ ...product, price: product.discounted_price })
                        }}
                        className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        Add to Cart - Sale Price
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg cursor-not-allowed font-medium"
                      >
                        Out of Stock
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Sale Banner */}
        <div className="mt-12 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Don't Miss Out!</h2>
          <p className="text-lg mb-4">These amazing deals won't last long. Shop now and save big on authentic handcrafted Indian wear.</p>
          <div className="text-sm opacity-90">
            * Sale prices valid while stocks last. No additional discounts applicable.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
