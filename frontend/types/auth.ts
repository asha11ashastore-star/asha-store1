export interface User {
  id: number
  email: string
  username: string
  first_name: string
  last_name: string
  phone?: string
  role: 'buyer' | 'seller' | 'admin'
  is_active: boolean
  is_verified: boolean
  avatar_url?: string
  created_at: string
  updated_at?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  first_name: string
  last_name: string
  phone?: string
  password: string
  role?: 'buyer' | 'seller'
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: User
}

export interface RefreshTokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: User
}
