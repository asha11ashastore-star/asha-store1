const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'https://asha-store-backend.onrender.com'
const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_your_key_id'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
    // CRITICAL FIX: DO NOT cache token in memory!
    // Always read from localStorage to prevent token mixing between users
  }

  setToken(token) {
    // CRITICAL FIX: Only use localStorage, NO in-memory caching
    if (typeof window !== 'undefined') {
      if (token) {
        console.log('🔑 Setting token in localStorage (first 10 chars):', token.substring(0, 10) + '...')
        localStorage.setItem('auth_token', token)
      } else {
        console.log('🗑️ Removing token from localStorage')
        localStorage.removeItem('auth_token')
      }
    }
  }

  getToken() {
    // CRITICAL FIX: ALWAYS read from localStorage, NEVER cache in memory
    // This prevents token mixing when singleton is shared
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token')
      if (token) {
        console.log('🔑 Retrieved token from localStorage (first 10 chars):', token.substring(0, 10) + '...')
      } else {
        console.log('🔑 No token in localStorage')
      }
      return token
    }
    return null
  }

  async request(endpoint, options = {}) {
    // Add timestamp for cache-busting
    const separator = endpoint.includes('?') ? '&' : '?'
    const timestamp = new Date().getTime()
    const url = `${this.baseURL}${endpoint}${separator}_t=${timestamp}`
    const token = this.getToken()
    
    // Log API request with token info
    console.log(`📡 API Request: ${options.method || 'GET'} ${endpoint}`)
    if (token) {
      console.log(`📡   → Using token (first 10): ${token.substring(0, 10)}...`)
    } else {
      console.log(`📡   → No token (public request)`)
    }
    
    const config = {
      cache: 'no-store',  // Prevent Next.js caching
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        ...options.headers,
      },
      ...options,
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        // Handle different error response formats from backend
        let errorMessage = 'API request failed'
        
        if (data.detail) {
          // Handle validation errors (array format)
          if (Array.isArray(data.detail)) {
            errorMessage = data.detail.map(err => err.msg).join(', ')
          } else {
            errorMessage = data.detail
          }
        } else if (data.message) {
          errorMessage = data.message
        }
        
        throw new Error(errorMessage)
      }

      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Auth endpoints
  async login(email, password) {
    try {
      console.log('🔐 API Service - Login attempt for:', email)
      
      const response = await this.request('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: email,
          password: password
        }),
      })

      if (response.access_token) {
        console.log('🔐 API Service - Login successful for:', email)
        console.log('🔐 API Service - Received token (first 10):', response.access_token.substring(0, 10) + '...')
        this.setToken(response.access_token)
        console.log('🔐 API Service - Token stored in localStorage')
      } else {
        console.error('🔐 API Service - No token in response!')
      }

      return response
    } catch (error) {
      console.error('🔐 API Service - Login failed for:', email, error)
      throw error
    }
  }

  async register(userData) {
    return await this.request('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async logout() {
    this.setToken(null)
  }

  async getCurrentUser() {
    console.log('👤 API Service - Fetching current user...')
    const userData = await this.request('/api/v1/auth/me')
    console.log('👤 API Service - Current user:', userData.email)
    console.log('👤 API Service - User ID:', userData.id)
    console.log('👤 API Service - Username:', userData.username)
    return userData
  }

  // Products endpoints
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return await this.request(`/api/v1/products-fixed?${queryString}`)
  }

  async getAllProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const response = await this.request(`/api/v1/products/${queryString ? '?' + queryString : ''}`)
    
    // Normalize response format - API returns {items: [], ...} but we need {data: []}
    if (response.items) {
      // Clean up enum strings in the response
      const cleanedItems = response.items.map(item => ({
        ...item,
        status: item.status ? item.status.replace('ProductStatus.', '').toLowerCase() : 'draft',
        category: item.category ? item.category.replace('Category.', '') : item.category
      }))
      return { data: cleanedItems, ...response }
    }
    return response
  }

  async getProduct(id) {
    return await this.request(`/api/v1/products/${id}`)
  }

  async searchProducts(query) {
    return await this.request(`/api/v1/products/search?q=${encodeURIComponent(query)}`)
  }

  // Cart endpoints
  async getCart() {
    return await this.request('/api/v1/cart')
  }

  async addToCart(productId, quantity = 1) {
    return await this.request('/api/v1/cart/add', {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        quantity: quantity,
      }),
    })
  }

  async updateCartItem(itemId, quantity) {
    return await this.request(`/api/v1/cart/update/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    })
  }

  async removeFromCart(itemId) {
    return await this.request(`/api/v1/cart/remove/${itemId}`, {
      method: 'DELETE',
    })
  }

  async clearCart() {
    return await this.request('/api/v1/cart/clear', {
      method: 'DELETE',
    })
  }

  // Orders endpoints
  async createOrder(orderData) {
    // Use customer order endpoint that accepts direct address data
    const transformedData = {
      customer_name: orderData.customer_name,
      customer_email: orderData.customer_email,
      customer_phone: orderData.customer_phone,
      shipping_address: orderData.shipping_address,
      notes: orderData.notes || null,
      items: orderData.items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: parseFloat(item.price || item.unit_price)
      }))
    }
    
    return await this.request('/api/v1/orders/customer', {
      method: 'POST',
      body: JSON.stringify(transformedData),
    })
  }

  async getOrders() {
    return await this.request('/api/v1/orders')
  }

  async getOrder(orderId) {
    return await this.request(`/api/v1/orders/${orderId}`)
  }

  // Payment endpoints
  async createPaymentOrder(orderId) {
    return await this.request('/api/v1/payment/create-order', {
      method: 'POST',
      body: JSON.stringify({ order_id: orderId }),
    })
  }

  async verifyPayment(paymentData) {
    return await this.request('/api/v1/payment/verify', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    })
  }

  // Razorpay Integration
  async initiatePayment(orderData) {
    try {
      // Real Razorpay integration with your merchant account
      const order = await this.createOrder(orderData)
      const paymentOrder = await this.createPaymentOrder(order.id)
      
      return new Promise((resolve, reject) => {
        const options = {
          key: RAZORPAY_KEY_ID,
          amount: paymentOrder.amount, // Amount in paise
          currency: paymentOrder.currency,
          name: 'Aशा - Grace Woven by Asha Dhaundiyal',
          description: 'Handwoven Sarees & Traditional Wear',
          order_id: paymentOrder.razorpay_order_id,
          handler: async (response) => {
            try {
              // Verify payment on backend
              const verification = await this.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
              resolve({ success: true, order, payment: response, verification })
            } catch (error) {
              reject({ success: false, error: error.message })
            }
          },
          prefill: {
            name: orderData.customer_name || '',
            email: orderData.customer_email || '',
            contact: orderData.customer_phone || '',
          },
          theme: {
            color: '#8B4513', // Primary brown color
          },
          modal: {
            ondismiss: () => {
              reject({ success: false, error: 'Payment cancelled by user' })
            },
          },
        }

        if (typeof window !== 'undefined' && window.Razorpay) {
          const rzp = new window.Razorpay(options)
          rzp.open()
        } else {
          reject({ success: false, error: 'Razorpay not loaded' })
        }
      })
    } catch (error) {
      throw error
    }
  }

  // Newsletter subscription
  async subscribeNewsletter(email) {
    return await this.request('/api/v1/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  // Contact form
  async submitContactForm(formData) {
    return await this.request('/api/v1/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    })
  }
}

const apiService = new ApiService()
export default apiService
