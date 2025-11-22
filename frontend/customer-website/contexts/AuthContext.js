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
        if (token) {
          const userData = await apiService.getCurrentUser()
          setUser(userData)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        // Clear invalid token
        apiService.logout()
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
      return { success: true, user: userData }
    } catch (error) {
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
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
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
