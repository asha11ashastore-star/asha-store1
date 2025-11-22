// Sample script to populate products in the backend
const API_BASE_URL = 'http://localhost:8000'

const sampleProducts = [
  {
    name: 'Handloom Cotton Saree',
    description: 'Pure handloom cotton saree with traditional border',
    price: 2999,
    category: 'saree',
    fabric: 'cotton',
    weave: 'handloom',
    variety: 'handloom-cotton',
    stock_quantity: 10,
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400'],
    features: ['100% Pure Cotton', 'Handwoven', 'Traditional Border', 'Breathable Fabric', 'Easy Care']
  },
  {
    name: 'Tangail Cotton Saree',
    description: 'Traditional Tangail weave cotton saree',
    price: 3999,
    category: 'saree',
    fabric: 'cotton',
    weave: 'handloom',
    variety: 'tangail-cotton',
    stock_quantity: 8,
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400'],
    features: ['Tangail Weave', 'Geometric Patterns', 'Cultural Heritage', 'Fine Cotton', 'Traditional Craftsmanship']
  },
  {
    name: 'Banarasi Silk Saree',
    description: 'Traditional Banarasi silk saree with gold zari',
    price: 8999,
    category: 'saree',
    fabric: 'silk',
    weave: 'jacquard',
    variety: 'katan-silk',
    stock_quantity: 5,
    images: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400'],
    features: ['Pure Silk', 'Gold Zari Work', 'Banarasi Weave', 'Wedding Special', 'Luxury Craftsmanship']
  },
  {
    name: 'Tussar Silk Saree',
    description: 'Natural Tussar silk saree with textured finish',
    price: 6999,
    category: 'saree',
    fabric: 'silk',
    weave: 'handloom',
    variety: 'tussar-silk',
    stock_quantity: 7,
    images: ['https://images.unsplash.com/photo-1594736797933-d0901ba2fe65?w=400'],
    features: ['Natural Tussar Silk', 'Golden Sheen', 'Rich Texture', 'Durable', 'Versatile Wear']
  }
]

async function createProduct(product) {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // You'll need to add authentication headers if required
      },
      body: JSON.stringify(product)
    })
    
    if (response.ok) {
      const created = await response.json()
      console.log(`✅ Created product: ${created.name}`)
      return created
    } else {
      const error = await response.text()
      console.error(`❌ Failed to create ${product.name}:`, error)
    }
  } catch (error) {
    console.error(`❌ Error creating ${product.name}:`, error.message)
  }
}

async function populateProducts() {
  console.log('🚀 Starting to populate products...')
  
  for (const product of sampleProducts) {
    await createProduct(product)
    // Add small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  console.log('✨ Done populating products!')
}

// Check if running in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  populateProducts()
}

export { sampleProducts, populateProducts }
