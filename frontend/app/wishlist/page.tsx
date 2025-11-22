// @ts-nocheck
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  ArrowLeft, 
  Trash2,
  Share2,
  Filter,
  Grid,
  List,
  SortAsc
} from 'lucide-react'

interface WishlistItem {
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

export default function WishlistPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'rating'>('newest')
  
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
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
      name: 'Premium Gold Jewelry Set',
      price: 35999,
      originalPrice: 49999,
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZXdlbHJ5JTIwZ29sZCUyMG5lY2tsYWNlfGVufDF8fHx8MTc2Mjc1OTI2NXww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Jewelry',
      seller: 'Golden Arts',
      rating: 4.8,
      reviewCount: 156,
      inStock: false,
      discount: 28
    },
    {
      id: 4,
      name: 'Organic Face Cream',
      price: 899,
      originalPrice: 1299,
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3NtZXRpY3MlMjBza2luY2FyZXxlbnwxfHx8fDE3NjI3NTkyNjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Beauty',
      seller: 'Nature\'s Best',
      rating: 4.6,
      reviewCount: 234,
      inStock: true,
      discount: 31
    },
    {
      id: 5,
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

  const removeFromWishlist = (id: number) => {
    setWishlistItems(items => items.filter(item => item.id !== id))
    alert('Item removed from wishlist!')
  }

  const addToCart = (item: WishlistItem) => {
    alert(`Added "${item.name}" to cart!`)
  }

  const shareWishlist = () => {
    alert('Wishlist shared!')
  }

  const sortedItems = [...wishlistItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      default:
        return 0
    }
  })

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          </div>

          {/* Empty Wishlist */}
          <Card className="text-center py-16">
            <CardContent>
              <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-8">Save your favorite items for later by adding them to your wishlist.</p>
              <Link href="/marketplace">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600">{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved</p>
            </div>
            <Button onClick={shareWishlist} variant="outline" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share Wishlist
            </Button>
          </div>
        </div>

        {/* Filters and View Options */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

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
        </div>

        {/* Wishlist Items */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedItems.map((item) => (
              <Card key={item.id} className="group relative overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Link href={`/product/${item.id}`}>
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-medium">Out of Stock</span>
                    </div>
                  )}
                  {item.discount > 0 && (
                    <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                      -{item.discount}%
                    </Badge>
                  )}
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
                
                <CardContent className="p-4">
                  <div className="mb-2">
                    <Badge className="bg-gray-100 text-gray-800 text-xs mb-2">
                      {item.category}
                    </Badge>
                    <Link href={`/product/${item.id}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600">by {item.seller}</p>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium ml-1">{item.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({item.reviewCount})</span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-bold text-gray-900">
                      ₹{item.price.toLocaleString()}
                    </span>
                    {item.originalPrice > item.price && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{item.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <Button
                    onClick={() => addToCart(item)}
                    disabled={!item.inStock}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-48 h-48 sm:h-32">
                      <Link href={`/product/${item.id}`}>
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                      {!item.inStock && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white text-sm font-medium">Out of Stock</span>
                        </div>
                      )}
                      {item.discount > 0 && (
                        <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                          -{item.discount}%
                        </Badge>
                      )}
                    </div>

                    <div className="flex-1 p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between h-full">
                        <div className="flex-1">
                          <Badge className="bg-gray-100 text-gray-800 text-xs mb-2">
                            {item.category}
                          </Badge>
                          <Link href={`/product/${item.id}`}>
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-1">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-600 mb-2">by {item.seller}</p>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium ml-1">{item.rating}</span>
                            </div>
                            <span className="text-sm text-gray-500">({item.reviewCount} reviews)</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xl font-bold text-gray-900">
                              ₹{item.price.toLocaleString()}
                            </span>
                            {item.originalPrice > item.price && (
                              <span className="text-sm text-gray-400 line-through">
                                ₹{item.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-4 sm:mt-0 sm:ml-6">
                          <Button
                            onClick={() => addToCart(item)}
                            disabled={!item.inStock}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
                          >
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => removeFromWishlist(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
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

        {/* Quick Actions */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-white rounded-lg shadow">
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-gray-900">Love everything in your wishlist?</h3>
            <p className="text-sm text-gray-600">Add all available items to your cart at once</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                const availableItems = wishlistItems.filter(item => item.inStock)
                availableItems.forEach(item => addToCart(item))
              }}
            >
              Add All to Cart
            </Button>
            <Button onClick={shareWishlist}>
              Share Wishlist
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
