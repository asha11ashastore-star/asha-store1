import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Package, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ShoppingBag,
  Building2,
  ShoppingCart
} from 'lucide-react';
import toast from 'react-hot-toast';

// Components
import AddProduct from './AddProduct';
import MyProducts from './MyProducts';
import Profile from './Profile';
import CompanyInfo from './CompanyInfo';
import Orders from './Orders';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const menuItems = [
    {
      name: 'Customer Orders',
      icon: ShoppingCart,
      path: '/dashboard/orders',
      color: 'text-red-600'
    },
    {
      name: 'Add Product',
      icon: Plus,
      path: '/dashboard/add-product',
      color: 'text-green-600'
    },
    {
      name: 'My Products',
      icon: Package,
      path: '/dashboard/my-products',
      color: 'text-blue-600'
    },
    {
      name: 'Company Info',
      icon: Building2,
      path: '/dashboard/company-info',
      color: 'text-orange-600'
    },
    {
      name: 'Profile',
      icon: User,
      path: '/dashboard/profile',
      color: 'text-purple-600'
    }
  ];

  const Sidebar = () => (
    <div className="bg-white shadow-lg h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2" style={{background: 'linear-gradient(to right, #8b6742, #a67c52)'}}>
            <ShoppingBag className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Aशा Store</h1>
            <p className="text-sm text-gray-500">Seller Dashboard</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{background: 'linear-gradient(to right, #8b6742, #a67c52)'}}>
            <span className="text-white font-medium">
              {user?.full_name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{user?.full_name}</p>
            <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = window.location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <button
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  style={isActive ? {background: 'linear-gradient(to right, #8b6742, #a67c52)'} : {}}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : item.color}`} />
                  <span className="font-medium">{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          <LogOut className="h-4 w-4" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="h-full">
              <Sidebar />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {menuItems.find(item => window.location.pathname === item.path)?.name || 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                <span>Welcome back,</span>
                <span className="font-medium text-gray-900">{user?.full_name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="orders" element={<Orders />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="my-products" element={<MyProducts />} />
            <Route path="company-info" element={<CompanyInfo />} />
            <Route path="profile" element={<Profile />} />
            <Route path="/" element={<Orders />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
