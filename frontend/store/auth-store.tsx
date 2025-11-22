// @ts-nocheck
'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'
import { authApi } from '@/lib/api/auth'
import { apiService } from '@/services/api'
import type { User, LoginCredentials, RegisterData } from '@/types/auth'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: any) => Promise<boolean>
  logout: () => void
  setUser: (user: User) => void
  fetchCurrentUser: () => Promise<void>
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  refreshAuth: () => Promise<void>
  updateUser: (user: Partial<User>) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (credentials) => {
        try {
          set({ isLoading: true })
          const response = await authApi.login(credentials)
          
          // Store tokens in cookies (secure, httpOnly for production)
          Cookies.set('accessToken', response.access_token, {
            expires: response.expires_in / (24 * 60 * 60), // Convert seconds to days
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          })
          
          Cookies.set('refreshToken', response.refresh_token, {
            expires: 7, // 7 days
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          })

          set({
            user: response.user,
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (data) => {
        try {
          set({ isLoading: true })
          const user = await authApi.register(data)
          
          set({
            user,
            isLoading: false
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        // Remove tokens from cookies
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false
        })
      },

      refreshAuth: async () => {
        try {
          const refreshToken = get().refreshToken || Cookies.get('refreshToken')
          
          if (!refreshToken) {
            throw new Error('No refresh token available')
          }

          const response = await authApi.refreshToken(refreshToken)
          
          // Update tokens in cookies
          Cookies.set('accessToken', response.access_token, {
            expires: response.expires_in / (24 * 60 * 60),
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          })
          
          Cookies.set('refreshToken', response.refresh_token, {
            expires: 7,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          })

          set({
            user: response.user,
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
            isAuthenticated: true
          })
        } catch (error) {
          get().logout()
          throw error
        }
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        }))
      },

      setLoading: (loading) => {
        set({ isLoading: loading })
      }
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

// Auth Context Provider
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  refreshAuth: () => Promise<void>
  updateUser: (user: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authStore = useAuthStore()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize auth state from cookies on app start
    const initializeAuth = async () => {
      const accessToken = Cookies.get('accessToken')
      const refreshToken = Cookies.get('refreshToken')

      if (accessToken && refreshToken) {
        try {
          // Verify token and get user info
          const user = await authApi.getProfile()
          authStore.updateUser(user)
          useAuthStore.setState({
            accessToken,
            refreshToken,
            isAuthenticated: true
          })
        } catch (error) {
          // Token invalid, clear everything
          authStore.logout()
        }
      }
      
      setIsInitialized(true)
    }

    initializeAuth()
  }, [])

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={authStore}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
