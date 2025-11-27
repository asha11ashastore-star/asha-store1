'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useCart } from '../../components/CartProvider'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function CollectionsContent() {
  const router = useRouter()
  const { addItem } = useCart()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  
  // CRITICAL: Read category from URL on EVERY render
  const categoryFromURL = searchParams.get('category') || 'all'
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        
        // Add cache-busting and no-cache headers
        const timestamp = new Date().getTime()
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://asha-store-backend.onrender.com'}/api/v1/products-fixed?_t=${timestamp}`,
          {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          }
        )
        
        if (response.ok) {
          const data = await response.json()
          console.log('✅ Fetched FRESH products:', data.items?.length || data.length || 0, 'products')
          setProducts(data.items || data || [])
        } else {
          console.error('❌ Failed to fetch products:', response.status, response.statusText)
        }
      } catch (error) {
        console.error('❌ Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Filter products
  const filteredProducts = products.filter(product => {
    if (categoryFromURL === 'all') return true
    if (product.category === categoryFromURL) return true
    if (categoryFromURL === 'saree' && product.category?.includes('saree')) return true
    return false
  })

  // Get title - DIRECTLY from URL parameter
  const getTitle = () => {
    if (categoryFromURL === 'all') return 'ALL'
    
    const titles = {
      'kantha_saree': 'KANTHA SAREES',
      'jamdani_saree': 'JAMDANI SAREES',
      'handloom_saree': 'HANDLOOM SAREES',
      'shibori_saree': 'TIE N DYE (SHIBORI) SAREES',
      'handblock_saree': 'HANDBLOCK SAREES',
      'batik_saree': 'BATIK SAREES',
      'ajrakh_saree': 'AJRAKH SAREES',
      'khadi_saree': 'KHADI SAREES',
      'tissue_saree': 'TISSUE SAREES',
      'jacquard_saree': 'JACQUARD SAREES',
      'kota_saree': 'KOTA SAREES',
      'handloom_cotton_saree': 'HANDLOOM COTTON SAREES',
      'tangail_cotton_saree': 'TANGAIL COTTON SAREES',
      'handloom_silk_saree': 'HANDLOOM SILK SAREES',
      'matka_silk_saree': 'MATKA SILK SAREES',
      'tussar_silk_saree': 'TUSSAR SILK SAREES',
      'muslin_silk_saree': 'MUSLIN SILK SAREES',
      'katan_silk_saree': 'KATAN SILK SAREES'
    }
    
    return titles[categoryFromURL] || categoryFromURL.replace('_', ' ').toUpperCase()
  }

  return (
    <div className="min-h-screen bg-beige-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-beige-900 mb-8 text-center">
          {getTitle()}
        </h1>

        {/* Products Count */}
        <p className="text-center text-beige-600 mb-8">
          Showing {filteredProducts.length} products
        </p>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beige-800 mx-auto"></div>
            <p className="mt-4 text-beige-600">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-white rounded-lg shadow-md">
              <svg className="w-16 h-16 mx-auto text-beige-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-xl font-semibold text-beige-800 mb-2">No Products Found</h3>
              <p className="text-beige-600">We don't have any products in this category yet.</p>
              <button 
                onClick={() => window.location.href = '/collections'}
                className="mt-6 px-6 py-2 bg-beige-800 text-white rounded-lg hover:bg-beige-900"
              >
                View All Products
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                <div 
                  className="aspect-square relative bg-gray-100"
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
                      e.target.src = 'https://via.placeholder.com/400x400?text=No+Image'
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 
                    className="font-semibold text-lg text-beige-900 mb-2 line-clamp-2 cursor-pointer hover:text-beige-700"
                    onClick={() => router.push(`/product/${product.id}`)}
                  >
                    {product.name}
                  </h3>
                  <p className="text-beige-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-beige-800">₹{product.price?.toLocaleString()}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        addItem(product)
                      }}
                      className="px-4 py-2 bg-beige-800 text-white rounded-lg hover:bg-beige-900 transition-colors text-sm"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  )
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-beige-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beige-800 mx-auto mb-4"></div>
          <p className="text-beige-600">Loading collections...</p>
        </div>
      </div>
    }>
      <CollectionsContent />
    </Suspense>
  )
}
