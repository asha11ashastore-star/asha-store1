import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Package, RefreshCw, Calendar, IndianRupee, Tag, Trash2, Edit } from 'lucide-react';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const { user } = useAuth();

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getAll();
      console.log('Products API response:', response);
      
      // Handle different response structures
      let productList = response.data;
      if (response.data && response.data.items) {
        productList = response.data.items;
      } else if (response.data && Array.isArray(response.data)) {
        productList = response.data;
      } else if (Array.isArray(response.data)) {
        productList = response.data;
      } else {
        productList = [];
      }
      
      console.log('Product list:', productList);
      console.log('Current user:', user);
      
      // Backend now filters out deleted products, so we can use the list directly
      setProducts(productList);
      
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error(`Failed to load products: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (productId, productName) => {
    console.log('Delete button clicked for product:', productId, productName);
    
    const confirmed = window.confirm(`Are you sure you want to delete "${productName}"?`);
    console.log('User confirmed:', confirmed);
    
    if (!confirmed) {
      return;
    }

    try {
      console.log('Calling delete API for product:', productId);
      const response = await productsAPI.delete(productId);
      console.log('Delete API response:', response);
      toast.success('Product deleted successfully');
      loadProducts(); // Reload products after deletion
    } catch (error) {
      console.error('Failed to delete product:', error);
      console.error('Error response:', error.response);
      toast.error(`Failed to delete product: ${error.response?.data?.detail || error.message}`);
    }
  };

  const handleEdit = async (productId) => {
    console.log('Edit button clicked for product:', productId);
    try {
      // Fetch product details
      const response = await productsAPI.getById(productId);
      console.log('Product data:', response.data);
      setEditingProduct(response.data);
      setShowEditModal(true);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Failed to load product details');
    }
  };

  const handleUpdateProduct = async (updatedData) => {
    try {
      console.log('=== UPDATE PRODUCT START ===');
      console.log('Product ID:', editingProduct.id);
      console.log('Raw updated data:', updatedData);
      
      // Prepare data for API - send all fields (Pydantic expects lowercase)
      const updatePayload = {
        name: updatedData.name,
        description: updatedData.description || '',
        category: updatedData.category ? updatedData.category.toLowerCase() : editingProduct.category,
        price: parseFloat(updatedData.price),
        stock_quantity: parseInt(updatedData.stock_quantity),
        status: updatedData.status ? updatedData.status.toLowerCase() : 'active'
      };
      
      // Add optional fields
      // For discounted_price, explicitly send null if empty to remove sale
      if (updatedData.discounted_price && updatedData.discounted_price !== '') {
        updatePayload.discounted_price = parseFloat(updatedData.discounted_price);
      } else {
        updatePayload.discounted_price = null;  // Explicitly set to null to remove sale
      }
      
      if (updatedData.brand) {
        updatePayload.brand = updatedData.brand;
      }
      if (updatedData.tags) {
        updatePayload.tags = updatedData.tags;
      }
      
      console.log('Sending payload:', JSON.stringify(updatePayload, null, 2));
      
      const response = await productsAPI.update(editingProduct.id, updatePayload);
      console.log('Update response:', response);
      
      toast.success('Product updated successfully! ✅');
      setShowEditModal(false);
      setEditingProduct(null);
      loadProducts(); // Reload products
    } catch (error) {
      console.error('=== UPDATE PRODUCT ERROR ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      
      const errorMsg = error.response?.data?.detail 
        ? (Array.isArray(error.response.data.detail) 
          ? error.response.data.detail.map(e => `${e.loc?.join('.')} - ${e.msg}`).join('; ')
          : error.response.data.detail)
        : error.message;
      toast.error(`Failed to update product: ${errorMsg}`);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingProduct(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCategory = (category) => {
    return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
              <p className="text-gray-600">Manage entire store inventory ({products.length} products)</p>
            </div>
          </div>
          
          <button
            onClick={loadProducts}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Total Products</span>
            </div>
            <div className="text-2xl font-bold text-blue-600 mt-1">{products.length}</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Tag className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-900">Active Products</span>
            </div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {products.filter(p => p.status === 'active').length}
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-red-900">Out of Stock</span>
            </div>
            <div className="text-2xl font-bold text-red-600 mt-1">
              {products.filter(p => p.stock_quantity === 0).length}
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <IndianRupee className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Total Value</span>
            </div>
            <div className="text-2xl font-bold text-purple-600 mt-1">
              ₹{products.reduce((sum, p) => sum + (parseFloat(p.price) * p.stock_quantity), 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Yet</h3>
          <p className="text-gray-600 mb-6">Start by adding your first clothing product</p>
          <button 
            onClick={() => window.location.hash = '#/dashboard/add-product'}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
              {/* Product Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center relative">
                <Package className="h-12 w-12 text-purple-400" />
                
                {/* OUT OF STOCK Badge Overlay */}
                {product.stock_quantity === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <div className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-lg shadow-lg transform rotate-[-5deg]">
                      OUT OF STOCK
                    </div>
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                  <div className="flex flex-col gap-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                      {product.status.replace('_', ' ').toUpperCase()}
                    </span>
                    {product.stock_quantity === 0 && (
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
                        SOLD OUT
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Category</span>
                    <span className="text-sm font-medium text-gray-900">{formatCategory(product.category)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Price</span>
                    <span className="text-lg font-bold text-green-600">₹{parseFloat(product.price).toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Stock</span>
                    {product.stock_quantity === 0 ? (
                      <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                        0 units - SOLD OUT
                      </span>
                    ) : (
                      <span className={`text-sm font-medium ${product.stock_quantity > 10 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {product.stock_quantity} units
                      </span>
                    )}
                  </div>
                  
                  {product.fabric && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Fabric</span>
                      <span className="text-sm font-medium text-gray-900">{product.fabric}</span>
                    </div>
                  )}
                  
                  {product.color && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Color</span>
                      <span className="text-sm font-medium text-gray-900">{product.color}</span>
                    </div>
                  )}
                  
                  {product.saree_length && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Saree Length</span>
                      <span className="text-sm font-medium text-gray-900">{product.saree_length}m</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(product.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Edit button clicked!', product.id);
                      handleEdit(product.id);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer font-medium"
                    style={{ minWidth: '100px' }}
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Delete button clicked!', product.id, product.name);
                      handleDelete(product.id, product.name);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 active:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer font-medium"
                    style={{ minWidth: '100px' }}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-3xl w-full my-8">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-lg z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
                <button
                  onClick={handleCloseEditModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <EditProductForm
                product={editingProduct}
                onSave={handleUpdateProduct}
                onCancel={handleCloseEditModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Edit Product Form Component
const EditProductForm = ({ product, onSave, onCancel }) => {
  // Extract available sizes from product tags
  const getInitialSizes = () => {
    try {
      if (product.tags) {
        const tags = typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags;
        return tags?.available_sizes || [];
      }
    } catch (e) {
      console.error('Error parsing sizes:', e);
    }
    return [];
  };

  const [formData, setFormData] = useState({
    name: product.name || '',
    description: product.description || '',
    category: product.category || 'silk_saree',
    price: product.price || '',
    discounted_price: product.discounted_price || '',
    stock_quantity: product.stock_quantity || 0,
    status: product.status || 'draft',
    brand: product.brand || ''
  });
  
  const [availableSizes, setAvailableSizes] = useState(getInitialSizes());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Parse existing tags
    let existingTags = {};
    try {
      if (product.tags) {
        existingTags = typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags;
      }
    } catch (e) {
      console.error('Error parsing existing tags:', e);
      existingTags = {};
    }
    
    // Include availableSizes in the save data
    const updatedData = {
      ...formData,
      tags: JSON.stringify({
        ...existingTags,
        available_sizes: availableSizes
      })
    };
    
    console.log('Submitting updated data:', updatedData);
    onSave(updatedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Category and Brand */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="silk_saree">Silk Saree</option>
            <option value="cotton_saree">Cotton Saree</option>
            <option value="kantha_saree">Kantha Saree</option>
            <option value="lehenga">Lehenga</option>
            <option value="kurti">Kurti</option>
            <option value="saree">Saree</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Brand
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Price and Discounted Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Regular Price (₹) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            Sale Price (₹)
            <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">
              SALE
            </span>
          </label>
          <input
            type="number"
            name="discounted_price"
            value={formData.discounted_price}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="Leave empty for no sale"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            Shows product on SALE page
          </p>
        </div>
      </div>

      {/* Sale Preview */}
      {formData.price && formData.discounted_price && parseFloat(formData.discounted_price) < parseFloat(formData.price) && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-medium text-green-800 mb-2">✓ Product will appear on SALE page</p>
          <div className="flex items-center space-x-3">
            <span className="text-lg font-bold text-green-600">₹{parseFloat(formData.discounted_price).toLocaleString()}</span>
            <span className="text-sm text-gray-500 line-through">₹{parseFloat(formData.price).toLocaleString()}</span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">
              {Math.round((1 - parseFloat(formData.discounted_price) / parseFloat(formData.price)) * 100)}% OFF
            </span>
          </div>
        </div>
      )}
      
      {formData.discounted_price && parseFloat(formData.discounted_price) >= parseFloat(formData.price) && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm font-medium text-yellow-800">⚠️ Sale price must be less than regular price</p>
        </div>
      )}

      {/* Available Sizes */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <span className="text-lg mr-2">👕</span>
          Available Sizes (Select all that apply)
        </label>
        <div className="flex flex-wrap gap-2">
          {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size'].map((size) => {
            const isSelected = availableSizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    setAvailableSizes(availableSizes.filter(s => s !== size));
                  } else {
                    setAvailableSizes([...availableSizes, size]);
                  }
                }}
                className={`
                  px-4 py-2 min-w-[60px] border-2 rounded-lg font-semibold text-sm transition-all
                  ${isSelected
                    ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                  }
                `}
              >
                {size}
              </button>
            );
          })}
        </div>
        {availableSizes.length > 0 ? (
          <p className="mt-3 text-sm text-green-700 font-semibold bg-green-100 px-3 py-2 rounded-md">
            ✓ Selected sizes: {availableSizes.join(', ')}
          </p>
        ) : (
          <p className="mt-3 text-sm text-gray-600 bg-white px-3 py-2 rounded-md border border-gray-200">
            💡 Click sizes to select. Leave empty if not applicable.
          </p>
        )}
      </div>

      {/* Stock and Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock Quantity *
          </label>
          <input
            type="number"
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status *
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default MyProducts;
