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
        console.log('🔐 Auth check - Token exists:', !!token)
        
        if (token) {
          const userData = await apiService.getCurrentUser()
          setUser(userData)
          console.log('✅ User authenticated:', userData.email)
          
          // Store user data in localStorage as backup
          localStorage.setItem('user_data', JSON.stringify(userData))
        } else {
          // Try to restore from localStorage backup
          const savedUser = localStorage.getItem('user_data')
          if (savedUser) {
            console.log('⚠️ No token but found saved user, attempting restore')
            setUser(JSON.parse(savedUser))
          }
        }
      } catch (error) {
        console.error('❌ Auth check failed:', error)
        // Don't clear token immediately - might be temporary network issue
        // Only clear if 401 unauthorized
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          apiService.logout()
          localStorage.removeItem('user_data')
          setUser(null)
        }
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
