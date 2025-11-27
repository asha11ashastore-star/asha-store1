'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import apiService from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        const token = apiService.getToken()
        const savedUser = localStorage.getItem('user_data')
        
        console.log('🔐 Auth check - Token exists:', !!token, '| SavedUser exists:', !!savedUser)
        
        // CRITICAL FIX: If we have a token, ALWAYS verify with API first
        // This prevents showing wrong user after payment redirect
        if (token) {
          try {
            console.log('🔍 Token found - verifying with API...')
            const userData = await apiService.getCurrentUser()
            setUser(userData)
            console.log('✅ User verified with API:', userData.email)
            
            // Update localStorage with fresh, verified data
            localStorage.setItem('user_data', JSON.stringify(userData))
            
            // Check if localStorage had different user (security issue!)
            if (savedUser) {
              try {
                const oldUser = JSON.parse(savedUser)
                if (oldUser.email !== userData.email) {
                  console.warn('⚠️ SECURITY: localStorage had different user!', {
                    localStorage: oldUser.email,
                    apiVerified: userData.email
                  })
                  console.log('✅ Fixed: Using API-verified user')
                }
              } catch (e) {
                // Ignore parse errors
              }
            }
          } catch (apiError) {
            console.error('❌ API verification failed:', apiError)
            // If 401, token is invalid - clear everything
            if (apiError.message.includes('401') || apiError.message.includes('Unauthorized')) {
              console.log('🔐 Token invalid, clearing session')
              apiService.logout()
              localStorage.removeItem('user_data')
              setUser(null)
            } else {
              // Network error - restore from localStorage as fallback ONLY
              console.warn('⚠️ Network error, using localStorage as fallback')
              if (savedUser) {
                try {
                  const parsedUser = JSON.parse(savedUser)
                  setUser(parsedUser)
                  console.log('⚠️ Fallback: User restored from localStorage:', parsedUser.email)
                } catch (e) {
                  console.error('❌ Failed to parse saved user data')
                  localStorage.removeItem('user_data')
                }
              }
            }
          }
        } else {
          // No token - user is not logged in
          console.log('ℹ️ No token found - user not logged in')
          // Clear any stale user data
          if (savedUser) {
            console.log('🧹 Clearing stale user data from localStorage')
            localStorage.removeItem('user_data')
          }
          setUser(null)
        }
      } catch (error) {
        console.error('❌ Auth check failed:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await apiService.login(email, password)
      const userData = await apiService.getCurrentUser()
      setUser(userData)
      
      // Store user data in localStorage for persistence
      localStorage.setItem('user_data', JSON.stringify(userData))
      console.log('✅ User logged in:', userData.email)
      
      return { success: true, user: userData }
    } catch (error) {
      console.error('❌ Login failed:', error)
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await apiService.register(userData)
      return { success: true, data: response }
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await apiService.logout()
      localStorage.removeItem('user_data')
      setUser(null)
      console.log('✅ User logged out')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const refreshUser = async () => {
    try {
      const userData = await apiService.getCurrentUser()
      setUser(userData)
      localStorage.setItem('user_data', JSON.stringify(userData))
      console.log('✅ User data refreshed:', userData.email)
      return userData
    } catch (error) {
      console.error('Failed to refresh user:', error)
      throw error
    }
  }

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
