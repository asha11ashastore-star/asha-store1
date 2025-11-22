import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { ShoppingBag, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: 'asha@ashastore.com',
    password: ''
  });

  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use AuthContext login for proper JWT authentication
      await login(formData.email, formData.password);
      toast.success('Welcome back, Asha!');
    } catch (error) {
      console.error('Login error:', error);
      if (error.message.includes('Seller account required')) {
        toast.error('Invalid credentials. Only the store owner can access this dashboard.');
      } else if (error.message.includes('Incorrect email or password')) {
        toast.error('Invalid email or password. Please check your credentials.');
      } else {
        toast.error(error.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" 
         style={{background: 'linear-gradient(135deg, #8b6742 0%, #a67c52 50%, #70553a 100%)'}}>
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-lg">
            <ShoppingBag className="h-10 w-10" style={{color: '#8b6742'}} />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Aशा Store Owner
          </h2>
          <p className="mt-2 text-sm text-orange-100">
            Owner dashboard for Asha Dhaundiyal
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{focusRingColor: '#8b6742'}}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              style={{background: 'linear-gradient(to right, #8b6742, #a67c52)'}}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Sign In as Owner'
              )}
            </button>

            {/* Owner Info */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Store Owner Access Only
              </p>
            </div>
          </form>
        </div>

        {/* Features */}
        <div className="text-center text-white">
          <p className="text-sm mb-4">🛍️ Aशा Store Management</p>
          <div className="flex justify-center space-x-6 text-xs">
            <span>✨ Easy Product Management</span>
            <span>📱 Mobile Friendly</span>
            <span>🔒 Owner Only Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
