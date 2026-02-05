'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://asha-store-backend.onrender.com'

export default function SearchModal({ isOpen, onClose }) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([])
        return
      }

      setLoading(true)
      try {
        const timestamp = new Date().getTime()
        const response = await fetch(
          `${API_BASE_URL}/api/v1/products-fixed/?limit=500&_t=${timestamp}`,
          {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache',
            }
          }
        )

        if (response.ok) {
          const data = await response.json()
          const products = data.items || []
          
          // Filter products by search query (name, description, category, tags)
          const filtered = products.filter(product => {
            const query = searchQuery.toLowerCase().trim()
            const name = product.name?.toLowerCase() || ''
            const description = product.description?.toLowerCase() || ''
            const category = product.category?.toLowerCase() || ''
            
            // Parse tags if they exist
            let tags = ''
            try {
              if (product.tags) {
                const parsedTags = typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags
                tags = Object.values(parsedTags).join(' ').toLowerCase()
              }
            } catch (e) {
              // Ignore tag parsing errors
            }
            
            return (
              name.includes(query) ||
              description.includes(query) ||
              category.includes(query) ||
              tags.includes(query)
            )
          })
          
          // Sort by relevance - exact name matches first
          filtered.sort((a, b) => {
            const aName = a.name?.toLowerCase() || ''
            const bName = b.name?.toLowerCase() || ''
            const query = searchQuery.toLowerCase().trim()
            
            const aExact = aName === query
            const bExact = bName === query
            const aStarts = aName.startsWith(query)
            const bStarts = bName.startsWith(query)
            
            if (aExact && !bExact) return -1
            if (!aExact && bExact) return 1
            if (aStarts && !bStarts) return -1
            if (!aStarts && bStarts) return 1
            return 0
          })
          
          setSearchResults(filtered)
        }
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchProducts, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-start justify-center min-h-screen pt-20 px-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        
        <div className="relative bg-white w-full max-w-2xl rounded-lg shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-serif">Search Products</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-beige-600"
              autoFocus
            />
            
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-brown mx-auto"></div>
                <p className="text-gray-500 mt-2 text-sm">Searching...</p>
              </div>
            )}
            
            {!loading && searchResults.length > 0 && (
              <div className="mt-6 grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {searchResults.map((product) => (
                  <div 
                    key={product.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => {
                      router.push(`/product/${product.id}`)
                      onClose()
                    }}
                  >
                    <div className="bg-gray-100 h-40 rounded-lg mb-2 overflow-hidden">
                      {product.primary_image ? (
                        <img 
                          src={
                            product.primary_image.startsWith('http')
                              ? product.primary_image
                              : `${API_BASE_URL}${product.primary_image}`
                          }
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <h3 className="text-sm font-medium line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-primary-brown font-semibold">
                      ₹{parseFloat(product.discounted_price || product.price).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
            
            {!loading && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
              <div className="text-center py-8">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-gray-500">No products found for "{searchQuery}"</p>
                <p className="text-gray-400 text-sm mt-2">Try searching with different keywords</p>
              </div>
            )}
            
            {searchQuery.trim().length < 2 && searchQuery.length > 0 && (
              <p className="text-center text-gray-400 mt-8 text-sm">Type at least 2 characters to search</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
