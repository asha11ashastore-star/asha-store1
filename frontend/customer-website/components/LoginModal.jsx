'use client'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function LoginModal({ isOpen, onClose }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login, register } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      await login(email, password)
      setMessage('Login successful! Welcome back.')
      setTimeout(() => {
        onClose()
        resetForm()
      }, 2000)
    } catch (error) {
      console.error('Login error:', error)
      setMessage(`Login failed: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      await register({
        email,
        password,
        username,
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        role: 'buyer'
      })

      setMessage('Registration successful! You can now login.')
      setTimeout(() => {
        setIsSignUp(false)
        resetForm()
      }, 2000)
    } catch (error) {
      console.error('Registration error:', error)
      if (error.message.includes('Email already registered')) {
        setMessage('Email already registered. Please click "Already have an account? Login" below to sign in.')
        // Auto-switch to login form after 3 seconds
        setTimeout(() => {
          setIsSignUp(false)
          setMessage('')
        }, 3000)
      } else if (error.message.includes('Username already taken')) {
        setMessage('Username already taken. Please choose a different username.')
      } else {
        setMessage(`Registration failed: ${error.message}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setFirstName('')
    setLastName('')
    setUsername('')
    setPhone('')
    setMessage('')
  }

  const handleClose = () => {
    resetForm()
    setIsSignUp(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        
        <div className="relative bg-white w-full max-w-md rounded-lg shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif">{isSignUp ? 'Sign Up' : 'Login'}</h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
              {isSignUp && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-beige-600"
                        placeholder="First name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-beige-600"
                        placeholder="Last name"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-beige-600"
                      placeholder="Choose a username"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-beige-600"
                      placeholder="+91 9999999999"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-beige-600"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-beige-600"
                  placeholder="Enter your password"
                  minLength={isSignUp ? 8 : undefined}
                  required
                />
                {isSignUp && (
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 8 characters long
                  </p>
                )}
              </div>
              
              {message && (
                <p className={`text-sm ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </p>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-beige-600 text-white py-3 rounded-lg hover:bg-beige-700 transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#B83C3A' }}
              >
                {isLoading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Login')}
              </button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-beige-600 hover:text-beige-700 transition-colors"
                  style={{ color: '#B83C3A' }}
                >
                  {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
                </button>
              </div>
              
              {!isSignUp && (
                <div className="text-center text-sm text-gray-600">
                  <p>New to Aशा? Click "Sign Up" above to create an account!</p>
                  <p className="text-xs mt-1">Join thousands of customers who love our handwoven collection.</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
