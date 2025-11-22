import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar, Store } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    productsCount: 0,
    totalSales: 0,
    pendingOrders: 0,
    outOfStock: 0,
    loading: true
  });

  useEffect(() => {
    fetchSellerStats();
  }, []);

  const fetchSellerStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      // Fetch products count and out of stock
      const productsResponse = await fetch(`${API_BASE_URL}/api/v1/products/seller`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (productsResponse.ok) {
        const products = await productsResponse.json();
        const outOfStockCount = products.filter(p => p.stock_quantity === 0).length;
        
        setStats(prev => ({
          ...prev,
          productsCount: products.length,
          outOfStock: outOfStockCount
        }));
      }

      // Fetch orders for pending count and sales
      const ordersResponse = await fetch(`${API_BASE_URL}/api/v1/guest-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (ordersResponse.ok) {
        const orders = await ordersResponse.json();
        const pendingCount = orders.filter(o => 
          o.order_status === 'pending' || o.order_status === 'processing'
        ).length;
        
        const totalSales = orders
          .filter(o => o.payment_status === 'completed')
          .reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

        setStats(prev => ({
          ...prev,
          pendingOrders: pendingCount,
          totalSales: totalSales,
          loading: false
        }));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex items-center space-x-6">
          {/* Avatar */}
          <div className="h-24 w-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-white">
              {user?.full_name?.charAt(0).toUpperCase()}
            </span>
          </div>
          
          {/* User Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user?.full_name}</h1>
            <p className="text-lg text-gray-600">@{user?.username}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                user?.role === 'seller' 
                  ? 'bg-green-100 text-green-800' 
                  : user?.role === 'admin'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {user?.role?.toUpperCase()} ACCOUNT
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                user?.is_active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {user?.is_active ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Account Information */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">{user?.full_name}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Username</label>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">@{user?.username}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">{user?.email}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Account Role</label>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Shield className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900 capitalize">{user?.role}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Member Since</label>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">{formatDate(user?.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seller Dashboard Stats */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Store className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Seller Statistics</h2>
          </div>
          
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.loading ? '...' : stats.productsCount}
                </div>
                <div className="text-sm text-gray-600">Products Listed</div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                <div className="text-2xl font-bold text-green-600">
                  {stats.loading ? '...' : formatCurrency(stats.totalSales)}
                </div>
                <div className="text-sm text-gray-600">Total Sales</div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-100">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.loading ? '...' : stats.pendingOrders}
                </div>
                <div className="text-sm text-gray-600">Pending Orders</div>
              </div>
              
              <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border border-red-100">
                <div className="text-2xl font-bold text-red-600">
                  {stats.loading ? '...' : stats.outOfStock}
                </div>
                <div className="text-sm text-gray-600">Out of Stock</div>
              </div>
            </div>
            
            {/* Account Status */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Status</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Account Verification</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    ✓ Verified
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Seller Permissions</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    ✓ Enabled
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Product Upload</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    ✓ Available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips for Sellers */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mt-8 border border-purple-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Tips for Success</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Upload high-quality product images (up to 5 per product)</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Write detailed product descriptions</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Use accurate saree measurements and details</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Keep inventory updated to avoid overselling</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
