'use client'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useCart } from '../../components/CartProvider'

export default function CollectionsPage() {
  const { addItem } = useCart()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch products from API
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/api/v1/products')
      
      if (response.ok) {
        const data = await response.json()
        const productList = data.items || data || []
        console.log('Fetched products:', productList)
        setProducts(productList)
      } else {
        console.error('Failed to fetch products:', response.status)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get filters from URL parameters
  useEffect(() => {
    const category = searchParams.get('category') || 'all'
    setSelectedCategory(category)
  }, [searchParams])

  // Filter products based on category
  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'all') {
      // Direct category match (e.g., kantha_saree)
      if (product.category === selectedCategory) return true
      
      // General saree category check
      if (selectedCategory === 'saree' && product.category && product.category.includes('saree')) return true
      
      // If no match, filter out
      if (product.category !== selectedCategory) return false
    }
    return true
  })

  // Generate category title
  const getCategoryTitle = () => {
    const categoryNames = {
      'saree': 'ALL SAREES',
      'cotton_saree': 'COTTON SAREES',
      'silk_saree': 'SILK SAREES', 
      'linen_saree': 'LINEN SAREES',
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
      'katan_silk_saree': 'KATAN SILK SAREES',
      'dhakil_saree': 'DHAKIL SAREES',
      'mulberry_silk_saree': 'MULBERRY SILK SAREES',
      'dhonekali_saree': 'DHONEKALI SAREES',
      'satin_silk_saree': 'SATIN SILK SAREES',
      'lehenga': 'LEHENGAS',
      'kurti': 'KURTIS',
      'dupatta': 'DUPATTAS'
    }
    
    return categoryNames[selectedCategory] || selectedCategory.replace('_', ' ').toUpperCase()
  }

  return (
    <div className="min-h-screen bg-beige-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-4 text-beige-800 tracking-wide">
          {getCategoryTitle()}
        </h1>

        {/* Active Filters Display */}
        <div className="mb-6">
          {selectedCategory !== 'all' && (
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <span className="px-3 py-1 bg-beige-600 text-white rounded-full text-sm">
                Category: {selectedCategory.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
          )}
          <p className="text-sm text-gray-600 text-center">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Quick Category Buttons */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => {
              setSelectedCategory('all')
              window.history.pushState({}, '', '/collections')
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === 'all'
                ? 'bg-beige-700 text-white' 
                : 'bg-beige-500 text-white hover:bg-beige-600'
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => {
              setSelectedCategory('saree')
              window.history.pushState({}, '', '/collections?category=saree')
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === 'saree'
                ? 'bg-beige-700 text-white' 
                : 'bg-beige-500 text-white hover:bg-beige-600'
            }`}
          >
            All Sarees
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beige-600"></div>
            <span className="ml-3 text-beige-600">Loading products...</span>
          </div>
        )}

        {/* No Products Found */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-beige-200 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-beige-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-beige-800 mb-2">No Products Found</h3>
            <p className="text-beige-600 mb-4">We don't have any products in this category yet.</p>
            <button
              onClick={() => {
                setSelectedCategory('all')
                window.history.pushState({}, '', '/collections')
              }}
              className="px-6 py-2 bg-beige-600 text-white rounded-lg hover:bg-beige-700 transition-colors"
            >
              View All Products
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <button 
                  onClick={() => router.push(`/product/${product.id}`)}
                  className="w-full text-left"
                >
                  <div className="h-64 bg-gradient-to-br from-beige-100 to-beige-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-2 bg-beige-300 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-beige-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-beige-600 text-xs">Click to view</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-1 hover:text-beige-700 transition-colors">{product.name}</h3>
                    <p className="text-beige-600 text-sm mb-2">{product.description}</p>
                    <p className="text-xl font-semibold mb-3">₹{product.price}</p>
                  </div>
                </button>
                
                <div className="px-4 pb-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      addItem(product)
                    }}
                    className="w-full bg-beige-700 text-white py-2 rounded-lg hover:bg-beige-800 transition-colors"
                  >
                    Add to Cart
                  </button>
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
