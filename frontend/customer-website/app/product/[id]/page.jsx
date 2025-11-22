'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { useCart } from '../../../components/CartProvider'

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [selectedSize, setSelectedSize] = useState('')
  const [sizeError, setSizeError] = useState('')

  // Fetch product from API
  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`http://localhost:8000/api/v1/products/${id}`)
      
      if (response.ok) {
        const productData = await response.json()
        console.log('Fetched product:', productData)
        setProduct(productData)
      } else if (response.status === 404) {
        setError('Product not found')
      } else {
        setError('Failed to load product')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  // Generate features from product tags or default features
  const getProductFeatures = (product) => {
    const features = []
    
    if (product.tags) {
      try {
        const tags = typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags
        if (tags.fabric) features.push(`${tags.fabric} Fabric`)
        if (tags.color) features.push(`${tags.color} Color`)
        if (tags.pattern) features.push(`${tags.pattern} Pattern`)
        if (tags.occasion) features.push(`${tags.occasion} Wear`)
        if (tags.work_type) features.push(`${tags.work_type} Work`)
      } catch (e) {
        console.error('Error parsing tags:', e)
      }
    }
    
    // Add category-based features
    if (product.category && product.category.includes('saree')) {
      features.push('Traditional Saree')
      features.push('Handcrafted')
    }
    
    if (features.length === 0) {
      features.push('Premium Quality', 'Traditional Design', 'Authentic Craft')
    }
    
    return features
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-warm-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beige-600 mx-auto mb-4"></div>
            <p className="text-beige-600">Loading product details...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-warm-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-serif text-beige-800 mb-4">{error}</h1>
            <p className="text-beige-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <button 
              onClick={() => router.push('/collections')}
              className="bg-beige-700 text-white px-6 py-2 rounded-lg hover:bg-beige-800 transition-colors"
            >
              Back to Collections
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Product not found (shouldn't happen with proper error handling)
  if (!product) {
    return (
      <div className="min-h-screen bg-warm-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-serif text-beige-800 mb-4">Product Not Found</h1>
            <button 
              onClick={() => router.push('/collections')}
              className="bg-beige-700 text-white px-6 py-2 rounded-lg hover:bg-beige-800 transition-colors"
            >
              Back to Collections
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const handleAddToCart = () => {
    // Check if size is selected (if product has sizes)
    const availableSizes = getAvailableSizes()
    if (availableSizes.length > 0 && !selectedSize) {
      setSizeError('Please select a size')
      return
    }
    
    // Check if product is in stock
    if (product.stock_quantity === 0) {
      alert('Sorry, this product is out of stock!')
      return
    }
    
    // Check if quantity exceeds available stock
    if (quantity > product.stock_quantity) {
      alert(`Sorry, only ${product.stock_quantity} items available in stock!`)
      return
    }
    
    // Use discounted price if available
    const finalPrice = product.discounted_price && parseFloat(product.discounted_price) < parseFloat(product.price)
      ? product.discounted_price
      : product.price
    
    const cartItem = { 
      ...product,
      price: finalPrice,
      quantity,
      selectedSize: selectedSize || null
    }
    addItem(cartItem)
    setAddedToCart(true)
    setSizeError('')
    
    // Show success message
    setTimeout(() => {
      setAddedToCart(false)
    }, 3000)
  }
  
  // Get available sizes from product
  const getAvailableSizes = () => {
    try {
      if (product?.tags) {
        const tags = typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags
        if (tags?.available_sizes && Array.isArray(tags.available_sizes)) {
          return tags.available_sizes
        }
      }
    } catch (e) {
      console.error('Error parsing sizes:', e)
    }
    return []
  }
  
  // Check if product is out of stock
  const isOutOfStock = product?.stock_quantity === 0
  const stockLeft = product?.stock_quantity || 0

  return (
    <div className="min-h-screen bg-warm-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button onClick={() => router.push('/')} className="hover:text-primary-brown">Home</button>
            <span>/</span>
            <button onClick={() => router.push('/collections')} className="hover:text-primary-brown">Collections</button>
            <span>/</span>
            <span className="text-primary-brown">{product.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="mb-4">
              <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={`http://localhost:8000${product.images[selectedImage]?.image_url || product.images[0]?.image_url}`}
                    alt={product.images[selectedImage]?.alt_text || product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div className={`w-full h-full bg-gradient-to-br from-cream to-warm-white flex items-center justify-center ${product.images && product.images.length > 0 ? 'hidden' : ''}`}>
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 bg-beige-300 rounded-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-beige-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-beige-700 font-elegant text-lg">{product.name}</p>
                    <p className="text-beige-600 text-sm mt-1">No image uploaded yet</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.slice(0, 5).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 bg-gray-100 rounded-lg border-2 overflow-hidden ${
                      selectedImage === index ? 'border-beige-700' : 'border-transparent'
                    }`}
                  >
                    <img 
                      src={`http://localhost:8000${image.image_url}`}
                      alt={image.alt_text || product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-serif text-primary-brown mb-2">{product.name}</h1>
            <p className="text-lg text-gray-600 mb-4">{product.description}</p>
            
            <div className="mb-6">
              {/* Check if product has discount */}
              {product.discounted_price && parseFloat(product.discounted_price) < parseFloat(product.price) ? (
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-red-600">₹{parseFloat(product.discounted_price).toLocaleString()}</span>
                  <span className="text-xl text-gray-500 line-through">₹{parseFloat(product.price).toLocaleString()}</span>
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {Math.round((1 - parseFloat(product.discounted_price) / parseFloat(product.price)) * 100)}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-primary-brown">₹{parseFloat(product.price).toLocaleString()}</span>
              )}
            </div>

            {/* Product Features */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Key Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {getProductFeatures(product).map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Description:</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Product Details */}
            <div className="mb-6 bg-white p-4 rounded-lg border">
              <h3 className="text-lg font-semibold mb-3">Product Details:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Category:</span> {product.category?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
                {product.brand && (
                  <div>
                    <span className="font-medium">Brand:</span> {product.brand}
                  </div>
                )}
                {product.sku && (
                  <div>
                    <span className="font-medium">SKU:</span> {product.sku}
                  </div>
                )}
                <div>
                  <span className="font-medium">Stock:</span> 
                  {product.stock_quantity > 0 ? (
                    <span className={product.stock_quantity <= 5 ? 'text-red-600 font-semibold' : ''}>
                      {product.stock_quantity} pieces {product.stock_quantity <= 5 && '(Low Stock!)'}
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">Out of Stock</span>
                  )}
                </div>
              </div>
            </div>

            {/* Size Selection */}
            {(() => {
              const availableSizes = getAvailableSizes()
              const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
              
              if (availableSizes.length > 0) {
                return (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Select Size: *
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {allSizes.map((size) => {
                        const isAvailable = availableSizes.includes(size)
                        const isSelected = selectedSize === size
                        
                        return (
                          <button
                            key={size}
                            onClick={() => {
                              if (isAvailable) {
                                setSelectedSize(size)
                                setSizeError('')
                              }
                            }}
                            disabled={!isAvailable}
                            className={`
                              px-6 py-3 min-w-[70px] border-2 rounded-lg font-semibold text-sm transition-all
                              ${isAvailable
                                ? isSelected
                                  ? 'border-primary-brown bg-primary-brown text-white'
                                  : 'border-gray-300 hover:border-primary-brown hover:bg-primary-brown/10'
                                : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                              }
                            `}
                          >
                            {size}
                          </button>
                        )
                      })}
                    </div>
                    {sizeError && (
                      <p className="mt-2 text-sm text-red-600 font-medium">
                        {sizeError}
                      </p>
                    )}
                    {selectedSize && (
                      <p className="mt-2 text-sm text-green-600 font-medium">
                        ✓ Selected: {selectedSize}
                      </p>
                    )}
                  </div>
                )
              }
              return null
            })()}

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              {!isOutOfStock ? (
                <>
                  <div className="flex items-center border rounded-lg">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-2 min-w-[50px] text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(stockLeft, quantity + 1))}
                      className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                      disabled={quantity >= stockLeft}
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary-brown text-white py-3 rounded-lg hover:bg-dark-brown transition-colors font-medium"
                  >
                    {addedToCart ? '✓ Added to Cart' : (() => {
                      const displayPrice = product.discounted_price && parseFloat(product.discounted_price) < parseFloat(product.price)
                        ? product.discounted_price
                        : product.price
                      return `Add to Cart - ₹${(parseFloat(displayPrice) * quantity).toLocaleString()}`
                    })()}
                  </button>
                  
                  {stockLeft <= 5 && stockLeft > 0 && (
                    <div className="text-red-600 text-sm">
                      Only {stockLeft} left!
                    </div>
                  )}
                </>
              ) : (
                <button
                  disabled
                  className="flex-1 bg-gray-400 text-white py-3 rounded-lg cursor-not-allowed font-medium"
                >
                  Out of Stock
                </button>
              )}
            </div>

            {/* Custom Measurement Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-green-800 mb-2">
                    📏 Need Custom Size?
                  </h4>
                  <p className="text-sm text-green-700 mb-3">
                    Get perfectly tailored fit! Share your measurements via WhatsApp
                  </p>
                  
                  <a
                    href={`https://wa.me/919818174388?text=${encodeURIComponent(
                      `Hi! I'm interested in:\n` +
                      `${product.name}\n` +
                      `Price: ₹${(product.discounted_price && parseFloat(product.discounted_price) < parseFloat(product.price)
                        ? parseFloat(product.discounted_price)
                        : parseFloat(product.price)
                      ).toLocaleString()}${product.discounted_price && parseFloat(product.discounted_price) < parseFloat(product.price) ? ` (Sale Price!)` : ``}\n\n` +
                      `I would like to share my measurements for custom fitting.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    📱 WhatsApp for Custom Measurements
                  </a>
                  
                  <div className="mt-3 space-y-1">
                    <p className="text-xs text-green-600 font-medium">
                      📞 +91 98181 74388 | Available 24/7
                    </p>
                    <p className="text-xs text-green-600">
                      ✓ Bust, Waist, Hip, Height, Shoulder, Sleeve length
                    </p>
                    <p className="text-xs text-green-600">
                      ✓ We'll guide you through the measurement process
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Care Instructions */}
            <div className="bg-cream/30 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Care Instructions:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Dry clean recommended for best results</li>
                <li>• Hand wash in cold water if needed</li>
                <li>• Store in a cool, dry place</li>
                <li>• Iron on medium heat with cloth protection</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Back to Collections Link */}
        <div className="mt-16 text-center">
          <button
            onClick={() => router.push('/collections')}
            className="bg-beige-700 text-white px-8 py-3 rounded-lg hover:bg-beige-800 transition-colors"
          >
            Browse More Products
          </button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
