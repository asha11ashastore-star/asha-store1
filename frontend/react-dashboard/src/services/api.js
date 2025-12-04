import axios from 'axios';

// Use custom domain for production API
const API_BASE_URL = 'https://api.basheera.in';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only logout if it's a login endpoint error, not for regular API calls
      if (error.config.url.includes('/auth/login')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/api/v1/auth/login', { email, password }),
  register: (data) => api.post('/api/v1/auth/register', data),
};

export const productsAPI = {
  getAll: () => api.get('/api/v1/products-dashboard'),  // Use dashboard endpoint for ALL products
  getById: (id) => api.get(`/api/v1/products/${id}`),
  create: (data) => api.post('/api/v1/products', data),
  update: (id, data) => api.put(`/api/v1/products/${id}`, data),
  delete: (id) => api.delete(`/api/v1/products/${id}`),
};

export const healthAPI = {
  check: () => api.get('/health'),
};

export const companyAPI = {
  getInfo: () => api.get('/api/v1/company/info'),
  updateInfo: (data) => api.put('/api/v1/company/info', data),
};

export const ordersAPI = {
  getAll: () => api.get('/api/v1/orders'),
  getById: (id) => api.get(`/api/v1/orders/${id}`),
  updateStatus: (id, status) => api.put(`/api/v1/orders/${id}/status`, { status }),
};

export default api;
