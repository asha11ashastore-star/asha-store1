'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  Eye,
  ArrowRight,
  TrendingUp,
  Flame
} from 'lucide-react'

export function FeaturedProducts() {
  const [wishlist, setWishlist] = useState<number[]>([])

  const toggleWishlist = (id: number) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const featuredProducts = [
    {
      id: 1,
      name: 'Bridal Lehenga Collection',
      price: 45999,
      originalPrice: 59999,
      image: 'https://images.unsplash.com/photo-1756483510809-122c56fbb035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWhlbmdhJTIwY2hvbGklMjBkZXNpZ25lcnxlbnwxfHx8fDE3NjI3NTkyNjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Clothing',
      rating: 4.9,
      reviews: 127,
      seller: 'Royal Fashion House'
    },
    {
      id: 2,
      name: 'North Indian Thali',
      price: 299,
      originalPrice: 399,
      image: 'https://images.unsplash.com/photo-1651488201726-bbb9577778ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGVsaXZlcnklMjByZXN0YXVyYW50fGVufDF8fHx8MTc2Mjc1ODY4OHww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Food',
      rating: 4.7,
      reviews: 89,
      seller: 'Spice Garden Restaurant'
    },
    {
      id: 3,
      name: 'Fresh Vegetables Pack',
      price: 149,
      originalPrice: 199,
      image: 'https://images.unsplash.com/photo-1651488201726-bbb9577778ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwc3RvcmUlMjBwcm9kdWN0c3xlbnwxfHx8fDE3NjI3NTg2ODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Grocery',
      rating: 4.5,
      reviews: 203,
      seller: 'Green Harvest Store'
    },
    {
      id: 4,
      name: 'Designer Wedding Saree',
      price: 35999,
      originalPrice: 45999,
      image: 'https://images.unsplash.com/photo-1750164874154-1bfa2d31af39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwYnJpZGFsJTIwb3V0Zml0fGVufDF8fHx8MTc2Mjc1OTI2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Clothing',
      rating: 4.8,
      reviews: 156,
      seller: 'Elite Textiles'
    },
    {
      id: 5,
      name: 'Continental Pasta',
      price: 249,
      originalPrice: 299,
      image: 'https://images.unsplash.com/photo-1651488201726-bbb9577778ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGVsaXZlcnklMjByZXN0YXVyYW50fGVufDF8fHx8MTc2Mjc1ODY4OHww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Food',
      rating: 4.6,
      reviews: 94,
      seller: 'Italiano Bistro'
    },
    {
      id: 6,
      name: 'Home Care Essentials',
      price: 399,
      originalPrice: 499,
      image: 'https://images.unsplash.com/photo-1651488201726-bbb9577778ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwc3RvcmUlMjBwcm9kdWN0c3xlbnwxfHx8fDE3NjI3NTg2ODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Grocery',
      rating: 4.4,
      reviews: 78,
      seller: 'Clean & Fresh Co.'
    }
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Clothing':
        return 'bg-pink-100 text-pink-800'
      case 'Food':
        return 'bg-orange-100 text-orange-800'
      case 'Grocery':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Flame className="h-6 w-6 text-orange-500" />
            <span className="text-orange-500 font-semibold">Trending Now</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Handpicked products from our most trusted sellers
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
              {/* Product Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <Heart 
                        className={`w-4 h-4 transition-colors ${
                          wishlist.includes(product.id) 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-600 hover:text-red-500'
                        }`}
                      />
                    </button>
                    <Link href={`/product/${product.id}`}>
                      <button className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200">
                        <Eye className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                      </button>
                    </Link>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className={getCategoryColor(product.category)}>
                      {product.category}
                    </Badge>
                  </div>

                  {/* Discount Badge */}
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-red-500 text-white">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </Badge>
                  </div>

                  {/* Quick Add Button */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      <ShoppingBag className="w-4 h-4 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-6">
                <div className="mb-2">
                  <p className="text-sm text-gray-500">{product.seller}</p>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500">({product.reviews} reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                </div>

                {/* Action Button */}
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                  View Product Details
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <Link href="/marketplace">
            <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 px-8 py-4 rounded-xl">
              <TrendingUp className="h-5 w-5 mr-2" />
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
