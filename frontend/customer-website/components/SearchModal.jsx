'use client'
import { useState, useEffect } from 'react'

export default function SearchModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    if (searchQuery) {
      // Simulate search results
      const mockResults = [
        { id: 1, name: 'Silk Saree', price: '₹5,999', image: '/api/placeholder/200/250' },
        { id: 2, name: 'Cotton Kurta', price: '₹1,299', image: '/api/placeholder/200/250' },
        { id: 3, name: 'Embroidered Lehenga', price: '₹8,999', image: '/api/placeholder/200/250' },
      ].filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      setSearchResults(searchResults)
    } else {
      setSearchResults([])
    }
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
            
            {searchResults.length > 0 && (
              <div className="mt-6 grid grid-cols-3 gap-4">
                {searchResults.map((product) => (
                  <div key={product.id} className="cursor-pointer hover:opacity-80">
                    <div className="bg-gray-100 h-40 rounded-lg mb-2"></div>
                    <h3 className="text-sm font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.price}</p>
                  </div>
                ))}
              </div>
            )}
            
            {searchQuery && searchResults.length === 0 && (
              <p className="text-center text-gray-500 mt-8">No products found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
