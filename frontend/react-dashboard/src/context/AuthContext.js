import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('currentUser');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // Only accept valid JWT tokens (not fake tokens)
        if (token.includes('.') && token.split('.').length === 3) {
          setUser(parsedUser);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          // Invalid token format, clear it
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
        }
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/v1/auth/login', { email, password });
      
      // Check if response contains an error
      if (response.data.error) {
        throw new Error(response.data.message || 'Login failed');
      }
      
      const { access_token, user: userData } = response.data;
      
      if (!access_token || !userData) {
        throw new Error('Invalid response from server');
      }
      
      if (userData.role !== 'seller' && userData.role !== 'admin') {
        throw new Error('Access denied. Seller account required.');
      }

      localStorage.setItem('authToken', access_token);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('Login error details:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.response?.data?.detail || error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  };

  const register = async (fullName, username, email, password) => {
    try {
      const response = await api.post('/api/v1/auth/register', {
        full_name: fullName,
        username,
        email,
        password,
        role: 'seller'
      });
      
      const { access_token, user: userData } = response.data;
      
      localStorage.setItem('authToken', access_token);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.detail || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
