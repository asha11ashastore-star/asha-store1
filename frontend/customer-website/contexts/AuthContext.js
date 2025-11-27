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
            console.log('   Token (first 10 chars):', token.substring(0, 10) + '...')
            
            const userData = await apiService.getCurrentUser()
            
            console.log('✅ User verified with API:', userData.email)
            console.log('   User ID:', userData.id)
            console.log('   Username:', userData.username)
            
            setUser(userData)
            
            // Update localStorage with fresh, verified data
            localStorage.setItem('user_data', JSON.stringify(userData))
            console.log('💾 Updated localStorage with verified user:', userData.email)
            
            // Check if localStorage had different user (security issue!)
            if (savedUser) {
              try {
                const oldUser = JSON.parse(savedUser)
                if (oldUser.email !== userData.email) {
                  console.warn('⚠️ SECURITY WARNING: localStorage had DIFFERENT user!')
                  console.warn('   localStorage had:', oldUser.email)
                  console.warn('   API verified:', userData.email)
                  console.warn('   This means auth data was stale!')
                  console.log('✅ FIXED: Using API-verified user:', userData.email)
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
      console.log('🔐 LOGIN ATTEMPT:', email)
      
      // STEP 1: Clear ALL previous auth data first
      console.log('🧹 Clearing all previous auth data...')
      localStorage.removeItem('user_data')
      localStorage.removeItem('auth_token')
      apiService.setToken(null)
      setUser(null)
      
      // STEP 2: Login and get NEW token
      console.log('📡 Calling login API...')
      const response = await apiService.login(email, password)
      console.log('✅ Login API response received, token:', response.access_token ? 'YES' : 'NO')
      
      // STEP 3: Get user data with NEW token
      console.log('📡 Fetching user data with new token...')
      const userData = await apiService.getCurrentUser()
      console.log('✅ User data received:', userData.email)
      
      // STEP 4: Verify email matches what we logged in with
      if (userData.email.toLowerCase() !== email.toLowerCase()) {
        console.error('❌ SECURITY ERROR: Logged in as different user!')
        console.error('   Expected:', email)
        console.error('   Got:', userData.email)
        throw new Error('Authentication mismatch - please try again')
      }
      
      // STEP 5: Set user in state
      setUser(userData)
      
      // STEP 6: Store VERIFIED user data in localStorage
      localStorage.setItem('user_data', JSON.stringify(userData))
      console.log('✅ User logged in and verified:', userData.email)
      console.log('💾 Saved to localStorage:', userData.email)
      
      return { success: true, user: userData }
    } catch (error) {
      console.error('❌ Login failed:', error)
      // Clean up on error
      localStorage.removeItem('user_data')
      localStorage.removeItem('auth_token')
      setUser(null)
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
      console.log('🚪 LOGOUT - Clearing all auth data...')
      const currentUser = user?.email || 'unknown'
      
      // Clear API token
      await apiService.logout()
      
      // Clear ALL localStorage auth data
      localStorage.removeItem('user_data')
      localStorage.removeItem('auth_token')
      
      // Clear state
      setUser(null)
      
      console.log('✅ User logged out:', currentUser)
      console.log('🧹 All auth data cleared from localStorage')
    } catch (error) {
      console.error('Logout error:', error)
      // Force clear even on error
      localStorage.removeItem('user_data')
      localStorage.removeItem('auth_token')
      setUser(null)
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
