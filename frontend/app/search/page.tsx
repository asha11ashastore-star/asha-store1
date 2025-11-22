// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'
import { 
  Search, 
  Filter, 
  SortAsc, 
  Grid, 
  List, 
  Star, 
  Heart, 
  ShoppingBag,
  ArrowLeft,
  X
} from 'lucide-react'

interface Product {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  category: string
  seller: string
  rating: number
  reviewCount: number
  inStock: boolean
  discount: number
}

interface FilterOptions {
  categories: string[]
  priceRange: [number, number]
  rating: number
  sortBy: 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest'
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: [0, 100000],
    rating: 0,
    sortBy: 'relevance'
  })

  // Mock search results
  const [allProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Bridal Lehenga Collection',
      price: 45999,
      originalPrice: 59999,
      image: 'https://images.unsplash.com/photo-1756483510809-122c56fbb035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWhlbmdhJTIwY2hvbGklMjBkZXNpZ25lcnxlbnwxfHx8fDE3NjI3NTkyNjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Clothing',
      seller: 'Royal Fashion House',
      rating: 4.9,
      reviewCount: 127,
      inStock: true,
      discount: 23
    },
    {
      id: 2,
      name: 'Silk Saree with Blouse',
      price: 12999,
      originalPrice: 18999,
      image: 'https://images.unsplash.com/photo-1715881634011-2c3e0dea96c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8aGFuZGxvb20lMjBzYXJlZSUyMGZhYnJpY3xlbnwxfHx8fDE3NjI3NTkyNjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Clothing',
      seller: 'Traditional Weavers',
      rating: 4.7,
      reviewCount: 89,
      inStock: true,
      discount: 32
    },
    {
      id: 3,
      name: 'North Indian Thali',
      price: 299,
      originalPrice: 399,
      image: 'https://images.unsplash.com/photo-1651488201726-bbb9577778ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGVsaXZlcnklMjByZXN0YXVyYW50fGVufDF8fHx8MTc2Mjc1ODY4OHww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Food',
      seller: 'Spice Garden Restaurant',
      rating: 4.6,
      reviewCount: 234,
      inStock: true,
      discount: 25
    },
    {
      id: 4,
      name: 'Organic Face Cream',
      price: 899,
      originalPrice: 1299,
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3NtZXRpY3MlMjBza2luY2FyZXxlbnwxfHx8fDE3NjI3NTkyNjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Beauty',
      seller: 'Nature\'s Best',
      rating: 4.8,
      reviewCount: 156,
      inStock: true,
      discount: 31
    },
    {
      id: 5,
      name: 'Premium Gold Jewelry Set',
      price: 35999,
      originalPrice: 49999,
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZXdlbHJ5JTIwZ29sZCUyMG5lY2tsYWNlfGVufDF8fHx8MTc2Mjc1OTI2NXww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Jewelry',
      seller: 'Golden Arts',
      rating: 4.9,
      reviewCount: 89,
      inStock: false,
      discount: 28
    },
    {
      id: 6,
      name: 'Smartphone Case Premium',
      price: 1499,
      originalPrice: 2499,
      image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG9uZSUyMGNhc2UlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjI3NTkyNjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Electronics',
      seller: 'Tech Accessories',
      rating: 4.4,
      reviewCount: 67,
      inStock: true,
      discount: 40
    }
  ])

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts)

  const categories = ['Clothing', 'Food', 'Beauty', 'Jewelry', 'Electronics', 'Home & Garden']

  useEffect(() => {
    filterProducts()
  }, [searchQuery, filters, allProducts])

  const filterProducts = () => {
    let results = allProducts

    // Search by query
    if (searchQuery.trim()) {
      results = results.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.seller.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by categories
    if (filters.categories.length > 0) {
      results = results.filter(product => 
        filters.categories.includes(product.category)
      )
    }

    // Filter by price range
    results = results.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    )

    // Filter by rating
    if (filters.rating > 0) {
      results = results.filter(product => product.rating >= filters.rating)
    }

    // Sort results
    results.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        case 'newest':
          return b.id - a.id
        default:
          return 0
      }
    })

    setFilteredProducts(results)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    filterProducts()
  }

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 100000],
      rating: 0,
      sortBy: 'relevance'
    })
  }

  const addToWishlist = (productId: number) => {
    alert('Added to wishlist!')
  }

  const addToCart = (product: Product) => {
    alert(`Added "${product.name}" to cart!`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands, categories..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              <Button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                Search
              </Button>
            </div>
          </form>

          {/* Results Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {searchQuery ? `Search results for "${searchQuery}"` : 'All Products'}
              </h1>
              <p className="text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="relevance">Most Relevant</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>

              {/* Filter Button */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {(filters.categories.length > 0 || filters.rating > 0) && (
                  <Badge className="bg-blue-600 text-white ml-1">
                    {filters.categories.length + (filters.rating > 0 ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-full lg:w-64 flex-shrink-0">
              <Card className="sticky top-4">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Filters</h3>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  </div>
                </div>

                <div className="p-4 space-y-6">
                  {/* Categories */}
                  <div>
                    <h4 className="font-medium mb-3">Categories</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <label key={category} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.categories.includes(category)}
                            onChange={() => toggleCategory(category)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                          />
                          <span className="text-sm">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium mb-3">Price Range</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={filters.priceRange[0]}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            priceRange: [parseInt(e.target.value) || 0, prev.priceRange[1]]
                          }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <span>to</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={filters.priceRange[1]}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            priceRange: [prev.priceRange[0], parseInt(e.target.value) || 100000]
                          }))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <h4 className="font-medium mb-3">Minimum Rating</h4>
                    <div className="space-y-2">
                      {[4, 3, 2, 1].map((rating) => (
                        <label key={rating} className="flex items-center">
                          <input
                            type="radio"
                            name="rating"
                            value={rating}
                            checked={filters.rating === rating}
                            onChange={() => setFilters(prev => ({ ...prev, rating }))}
                            className="mr-2"
                          />
                          <div className="flex items-center">
                            {Array.from({ length: rating }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                            <span className="text-sm ml-1">& up</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Products Grid/List */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">No products found</h2>
                  <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </CardContent>
              </Card>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="group relative overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <Link href={`/product/${product.id}`}>
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-medium">Out of Stock</span>
                        </div>
                      )}
                      {product.discount > 0 && (
                        <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                          -{product.discount}%
                        </Badge>
                      )}
                      <button
                        onClick={() => addToWishlist(product.id)}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Heart className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="mb-2">
                        <Badge className="bg-gray-100 text-gray-800 text-xs mb-2">
                          {product.category}
                        </Badge>
                        <Link href={`/product/${product.id}`}>
                          <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600">by {product.seller}</p>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium ml-1">{product.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">({product.reviewCount})</span>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <Button
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative w-full sm:w-48 h-48 sm:h-32">
                          <Link href={`/product/${product.id}`}>
                            <ImageWithFallback
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </Link>
                          {!product.inStock && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <span className="text-white text-sm font-medium">Out of Stock</span>
                            </div>
                          )}
                          {product.discount > 0 && (
                            <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                              -{product.discount}%
                            </Badge>
                          )}
                        </div>

                        <div className="flex-1 p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between h-full">
                            <div className="flex-1">
                              <Badge className="bg-gray-100 text-gray-800 text-xs mb-2">
                                {product.category}
                              </Badge>
                              <Link href={`/product/${product.id}`}>
                                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-1">
                                  {product.name}
                                </h3>
                              </Link>
                              <p className="text-sm text-gray-600 mb-2">by {product.seller}</p>
                              
                              <div className="flex items-center gap-2 mb-3">
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-medium ml-1">{product.rating}</span>
                                </div>
                                <span className="text-sm text-gray-500">({product.reviewCount} reviews)</span>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-xl font-bold text-gray-900">
                                  ₹{product.price.toLocaleString()}
                                </span>
                                {product.originalPrice > product.price && (
                                  <span className="text-sm text-gray-400 line-through">
                                    ₹{product.originalPrice.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 mt-4 sm:mt-0 sm:ml-6">
                              <Button
                                onClick={() => addToCart(product)}
                                disabled={!product.inStock}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
                              >
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => addToWishlist(product.id)}
                              >
                                <Heart className="h-4 w-4 mr-2" />
                                Wishlist
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
