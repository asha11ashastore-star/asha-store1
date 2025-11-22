'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'
import { 
  Heart, 
  Star, 
  ShoppingBag, 
  Share2, 
  ArrowLeft,
  Plus,
  Minus,
  Truck,
  Shield,
  RefreshCw,
  MapPin,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal
} from 'lucide-react'

interface Review {
  id: number
  userName: string
  rating: number
  comment: string
  date: string
  helpful: number
  verified: boolean
}

interface Product {
  id: number
  name: string
  price: number
  originalPrice: number
  images: string[]
  description: string
  features: string[]
  category: string
  seller: {
    name: string
    rating: number
    totalSales: number
  }
  rating: number
  reviewCount: number
  inStock: boolean
  stockQuantity: number
  sku: string
  specifications: { [key: string]: string }
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id

  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Mock product data - in real app, fetch based on productId
  const product: Product = {
    id: Number(productId),
    name: 'Bridal Lehenga Collection - Premium Designer Wear',
    price: 45999,
    originalPrice: 59999,
    images: [
      'https://images.unsplash.com/photo-1756483510809-122c56fbb035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWhlbmdhJTIwY2hvbGklMjBkZXNpZ25lcnxlbnwxfHx8fDE3NjI3NTkyNjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1750164874154-1bfa2d31af39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwYnJpZGFsJTIwb3V0Zml0fGVufDF8fHx8MTc2Mjc1OTI2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1715881634011-2c3e0dea96c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbG9vbSUyMHNhcmVlJTIwZmFicmljfGVufDF8fHx8MTc2Mjc1OTI2NXww&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    description: 'Exquisite bridal lehenga featuring intricate embroidery work with golden zari, sequins, and beadwork. Made with premium silk fabric and comes with matching choli and dupatta. Perfect for weddings, receptions, and special occasions.',
    features: [
      'Premium silk fabric with golden zari work',
      'Hand-embroidered with sequins and beads',
      'Semi-stitched lehenga with customizable fit',
      'Includes matching choli and dupatta',
      'Dry clean only',
      'Available in multiple sizes'
    ],
    category: 'Clothing',
    seller: {
      name: 'Royal Fashion House',
      rating: 4.8,
      totalSales: 1250
    },
    rating: 4.9,
    reviewCount: 127,
    inStock: true,
    stockQuantity: 15,
    sku: 'RFH-BL-2024-001',
    specifications: {
      'Material': 'Premium Silk',
      'Work': 'Hand Embroidered',
      'Occasion': 'Wedding/Reception',
      'Pattern': 'Zari Work',
      'Care': 'Dry Clean Only',
      'Origin': 'Made in India'
    }
  }

  const reviews: Review[] = [
    {
      id: 1,
      userName: 'Priya S.',
      rating: 5,
      comment: 'Absolutely stunning lehenga! The quality is exceptional and the embroidery work is beautiful. Received so many compliments at my sister\'s wedding.',
      date: '2024-01-15',
      helpful: 12,
      verified: true
    },
    {
      id: 2,
      userName: 'Meera K.',
      rating: 4,
      comment: 'Good quality product but delivery took longer than expected. The lehenga fits perfectly and looks exactly like the photos.',
      date: '2024-01-10',
      helpful: 8,
      verified: true
    },
    {
      id: 3,
      userName: 'Anjali R.',
      rating: 5,
      comment: 'Worth every penny! The fabric quality and craftsmanship is top-notch. Will definitely order again from this seller.',
      date: '2024-01-05',
      helpful: 15,
      verified: true
    }
  ]

  const handleAddToCart = () => {
    // Add to cart logic
    alert(`Added ${quantity} item(s) to cart!`)
  }

  const handleBuyNow = () => {
    // Buy now logic - redirect to checkout
    alert('Redirecting to checkout...')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Shopping
          </Link>
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/marketplace" className="hover:text-gray-900">Marketplace</Link>
            <span className="mx-2">/</span>
            <Link href={`/categories/${product.category.toLowerCase()}`} className="hover:text-gray-900">{product.category}</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
              <ImageWithFallback
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index ? 'border-blue-600' : 'border-gray-200'
                  }`}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-blue-100 text-blue-800">{product.category}</Badge>
                <Badge className="bg-green-100 text-green-800">In Stock</Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.description}</p>
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1,2,3,4,5].map(star => (
                    <Star 
                      key={star} 
                      className={`w-5 h-5 ${star <= Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="font-medium">{product.rating}</span>
                <span className="text-gray-600">({product.reviewCount} reviews)</span>
              </div>
              <div className="text-sm text-gray-600">
                SKU: {product.sku}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
              <span className="text-xl text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
              <Badge className="bg-red-500 text-white">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </Badge>
            </div>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Sold by {product.seller.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{product.seller.rating}</span>
                      <span>•</span>
                      <span>{product.seller.totalSales} sales</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View Store</Button>
                </div>
              </CardContent>
            </Card>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 bg-gray-50 min-w-16 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="p-2 hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  Only {product.stockQuantity} left in stock
                </span>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleAddToCart} className="flex-1 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button onClick={handleBuyNow} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Buy Now
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="p-3"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button variant="outline" className="p-3">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Delivery Info */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Free Delivery</p>
                    <p className="text-sm text-gray-600">Expected delivery by Jan 25, 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">7-Day Returns</p>
                    <p className="text-sm text-gray-600">Return within 7 days for full refund</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Secure Payment</p>
                    <p className="text-sm text-gray-600">Your payment information is safe</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Features & Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Features</h4>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Specifications</h4>
                  <div className="space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-600">{key}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.userName}</span>
                        {review.verified && (
                          <Badge className="bg-green-100 text-green-800 text-xs">Verified Purchase</Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1,2,3,4,5].map(star => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{review.comment}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <button className="flex items-center gap-1 hover:text-gray-700">
                        <ThumbsUp className="w-3 h-3" />
                        Helpful ({review.helpful})
                      </button>
                      <button className="flex items-center gap-1 hover:text-gray-700">
                        <ThumbsDown className="w-3 h-3" />
                        Not Helpful
                      </button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Reviews
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
