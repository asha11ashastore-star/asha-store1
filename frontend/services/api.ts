// @ts-nocheck
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

class ApiService {
  private baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = API_BASE_URL
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token')
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.detail || 'An error occurred',
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: 'Network error occurred',
      }
    }
  }

  // Authentication APIs
  async login(email: string, password: string) {
    const formData = new FormData()
    formData.append('username', email)
    formData.append('password', password)

    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (response.ok) {
      this.setToken(data.access_token)
      if (typeof window !== 'undefined') {
        localStorage.setItem('refresh_token', data.refresh_token)
      }
      return { success: true, data }
    }

    return { success: false, error: data.detail }
  }

  async register(userData: {
    email: string
    password: string
    first_name: string
    last_name: string
    role: string
    phone?: string
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async forgotPassword(email: string) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async getCurrentUser() {
    return this.request('/auth/me', {
      method: 'GET',
    })
  }

  async logout() {
    const result = await this.request('/auth/logout', {
      method: 'POST',
    })
    this.clearToken()
    return result
  }

  // Products APIs
  async getProducts(params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
    min_price?: number
    max_price?: number
  }) {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }

    const endpoint = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return this.request(endpoint, { method: 'GET' })
  }

  async getProduct(id: number) {
    return this.request(`/products/${id}`, { method: 'GET' })
  }

  async createProduct(productData: any) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  }

  async updateProduct(id: number, productData: any) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    })
  }

  async deleteProduct(id: number) {
    return this.request(`/products/${id}`, { method: 'DELETE' })
  }

  // Cart APIs
  async getCart() {
    return this.request('/cart', { method: 'GET' })
  }

  async addToCart(productId: number, quantity: number = 1) {
    return this.request('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    })
  }

  async updateCartItem(itemId: number, quantity: number) {
    return this.request(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    })
  }

  async removeFromCart(itemId: number) {
    return this.request(`/cart/items/${itemId}`, { method: 'DELETE' })
  }

  async clearCart() {
    return this.request('/cart/clear', { method: 'DELETE' })
  }

  // Orders APIs
  async createOrder(orderData: {
    address_id: number
    payment_method: string
    items: Array<{ product_id: number; quantity: number }>
  }) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  }

  async getOrders(page: number = 1, limit: number = 10) {
    return this.request(`/orders?page=${page}&limit=${limit}`, { method: 'GET' })
  }

  async getOrder(id: number) {
    return this.request(`/orders/${id}`, { method: 'GET' })
  }

  async cancelOrder(id: number) {
    return this.request(`/orders/${id}/cancel`, { method: 'POST' })
  }

  // Address APIs
  async getAddresses() {
    return this.request('/addresses', { method: 'GET' })
  }

  async createAddress(addressData: {
    street: string
    city: string
    state: string
    zip_code: string
    country: string
    phone?: string
    is_default?: boolean
  }) {
    return this.request('/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    })
  }

  async updateAddress(id: number, addressData: any) {
    return this.request(`/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    })
  }

  async deleteAddress(id: number) {
    return this.request(`/addresses/${id}`, { method: 'DELETE' })
  }

  // Wishlist APIs
  async getWishlist() {
    return this.request('/wishlist', { method: 'GET' })
  }

  async addToWishlist(productId: number) {
    return this.request('/wishlist/add', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    })
  }

  async removeFromWishlist(productId: number) {
    return this.request(`/wishlist/remove/${productId}`, { method: 'DELETE' })
  }

  // Reviews APIs
  async getProductReviews(productId: number) {
    return this.request(`/products/${productId}/reviews`, { method: 'GET' })
  }

  async createReview(reviewData: {
    product_id: number
    rating: number
    comment: string
  }) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    })
  }

  // Search API
  async searchProducts(query: string, filters?: any) {
    const params = new URLSearchParams({ q: query })
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })
    }

    return this.request(`/search?${params.toString()}`, { method: 'GET' })
  }

  // Categories API
  async getCategories() {
    return this.request('/categories', { method: 'GET' })
  }

  // Seller APIs
  async getSellerProducts(sellerId?: number) {
    const endpoint = sellerId ? `/sellers/${sellerId}/products` : '/sellers/products'
    return this.request(endpoint, { method: 'GET' })
  }

  async getSellerOrders(sellerId?: number) {
    const endpoint = sellerId ? `/sellers/${sellerId}/orders` : '/sellers/orders'
    return this.request(endpoint, { method: 'GET' })
  }

  async updateOrderStatus(orderId: number, status: string) {
    return this.request(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }

  // Admin APIs
  async getAllUsers(page: number = 1, limit: number = 10) {
    return this.request(`/admin/users?page=${page}&limit=${limit}`, { method: 'GET' })
  }

  async getAllOrders(page: number = 1, limit: number = 10) {
    return this.request(`/admin/orders?page=${page}&limit=${limit}`, { method: 'GET' })
  }

  async getAnalytics() {
    return this.request('/admin/analytics', { method: 'GET' })
  }
}

export const apiService = new ApiService()
export default apiService
