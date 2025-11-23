import React, { useState } from 'react';
import { productsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Save, Package, IndianRupee, Shirt, Upload, X, Image } from 'lucide-react';

// HARDCODED - NO ENV VARS
const API_BASE_URL = 'https://asha-store-backend.onrender.com';

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    discounted_price: '',
    stock: '',
    brand: '',
    fabric: '',
    color: '',
    size: '',
    pattern: '',
    occasion: '',
    saree_length: '',
    blouse_piece: false,
    work_type: ''
  });

  const categories = {
    'ALL SAREES': [
      { value: 'saree', label: 'View All Sarees' }
    ],
    'SHOP BY FABRIC': [
      { value: 'cotton_saree', label: 'Cotton Saree' },
      { value: 'silk_saree', label: 'Silk Saree' },
      { value: 'linen_saree', label: 'Linen Saree' }
    ],
    'SHOP BY WEAVE': [
      { value: 'kantha_saree', label: 'Kantha Saree' },
      { value: 'jamdani_saree', label: 'Jamdani Saree' },
      { value: 'handloom_saree', label: 'Handloom Saree' },
      { value: 'shibori_saree', label: 'Tie N Dye (Shibori) Saree' },
      { value: 'handblock_saree', label: 'Handblock Saree' },
      { value: 'batik_saree', label: 'Batik Saree' },
      { value: 'ajrakh_saree', label: 'Ajrakh Saree' },
      { value: 'khadi_saree', label: 'Khadi Saree' },
      { value: 'tissue_saree', label: 'Tissue Saree' },
      { value: 'jacquard_saree', label: 'Jacquard Saree' },
      { value: 'kota_saree', label: 'Kota Saree' }
    ],
    'SHOP BY VARIETY': [
      { value: 'handloom_cotton_saree', label: 'Handloom Cotton Saree' },
      { value: 'tangail_cotton_saree', label: 'Tangail Cotton Saree' },
      { value: 'handloom_silk_saree', label: 'Handloom Silk Saree' },
      { value: 'matka_silk_saree', label: 'Matka Silk Saree' },
      { value: 'tussar_silk_saree', label: 'Tussar Silk Saree' },
      { value: 'muslin_silk_saree', label: 'Muslin Silk Saree' },
      { value: 'katan_silk_saree', label: 'Katan Silk Saree' },
      { value: 'dhakil_saree', label: 'Dhakil Saree' },
      { value: 'mulberry_silk_saree', label: 'Mulberry Silk Saree' },
      { value: 'dhonekali_saree', label: 'Dhonekali Saree' },
      { value: 'satin_silk_saree', label: 'Satin Silk Saree' }
    ],
    'Traditional Indian Wear': [
      { value: 'lehenga', label: 'Lehenga' },
      { value: 'kurti', label: 'Kurti' },
      { value: 'salwar_kameez', label: 'Salwar Kameez' },
      { value: 'anarkali', label: 'Anarkali' },
      { value: 'churidar', label: 'Churidar' },
      { value: 'sharara', label: 'Sharara' },
      { value: 'palazzo', label: 'Palazzo' }
    ],
    'Western Wear': [
      { value: 'dress', label: 'Dress' },
      { value: 'top', label: 'Top' },
      { value: 'shirt', label: 'Shirt' },
      { value: 'trouser', label: 'Trouser' },
      { value: 'jeans', label: 'Jeans' },
      { value: 'skirt', label: 'Skirt' },
      { value: 'blouse', label: 'Blouse' }
    ],
    "Men's Wear": [
      { value: 'kurta', label: 'Kurta' },
      { value: 'sherwani', label: 'Sherwani' },
      { value: 'dhoti', label: 'Dhoti' }
    ],
    'Accessories': [
      { value: 'dupatta', label: 'Dupatta' },
      { value: 'stole', label: 'Stole' },
      { value: 'scarf', label: 'Scarf' }
    ]
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 10;
    
    if (selectedImages.length + files.length > maxImages) {
      toast.error(`You can only upload up to ${maxImages} images`);
      return;
    }

    // Validate file types and sizes
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validFiles = files.filter(file => {
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image format`);
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    // Create preview URLs and add to selectedImages
    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));

    setSelectedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (imageId) => {
    setSelectedImages(prev => {
      const imageToRemove = prev.find(img => img.id === imageId);
      if (imageToRemove && imageToRemove.preview) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter(img => img.id !== imageId);
    });
  };

  const uploadImages = async (productId) => {
    if (selectedImages.length === 0) return;

    setImageUploadLoading(true);
    try {
      const formData = new FormData();
      selectedImages.forEach(image => {
        formData.append('files', image.file);
      });

      const response = await fetch(`${API_BASE_URL}/api/v1/products/${productId}/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Image upload failed:', response.status, errorText);
        throw new Error(`Failed to upload images: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('Images uploaded successfully:', result);
      toast.success(`${result.length} images uploaded successfully!`);
      
      // Clean up preview URLs
      selectedImages.forEach(image => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
      setSelectedImages([]);

    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload images');
    } finally {
      setImageUploadLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Basic form validation
      if (!formData.name.trim()) {
        toast.error('Product name is required');
        setLoading(false);
        return;
      }
      
      if (!formData.description.trim()) {
        toast.error('Product description is required');
        setLoading(false);
        return;
      }
      
      if (!formData.category) {
        toast.error('Please select a category');
        setLoading(false);
        return;
      }
      
      if (!formData.price || parseFloat(formData.price) <= 0) {
        toast.error('Please enter a valid price');
        setLoading(false);
        return;
      }
      
      if (!formData.stock || parseInt(formData.stock) < 0) {
        toast.error('Please enter a valid stock quantity');
        setLoading(false);
        return;
      }
      const productData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        discounted_price: formData.discounted_price ? parseFloat(formData.discounted_price) : null,
        stock_quantity: parseInt(formData.stock),
        sku: `SKU-${Date.now()}`, // Generate a temporary SKU
        status: "active", // Set product as active by default
        // Convert empty strings to null
        brand: formData.brand || null,
        weight: null,
        dimensions: null,
        tags: JSON.stringify({
          fabric: formData.fabric,
          color: formData.color,
          size: formData.size,
          pattern: formData.pattern,
          occasion: formData.occasion,
          saree_length: formData.saree_length,
          blouse_piece: formData.blouse_piece,
          work_type: formData.work_type,
          available_sizes: availableSizes
        }),
        meta_title: null,
        meta_description: null
      };

      const createdProduct = await productsAPI.create(productData);
      console.log('Product created:', createdProduct);
      
      // Upload images if any selected
      if (selectedImages.length > 0) {
        console.log('Uploading images...');
        await uploadImages(createdProduct.data.id);
      }
      
      toast.success('Product added successfully and is now live on your website!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        discounted_price: '',
        stock: '',
        brand: '',
        fabric: '',
        color: '',
        size: '',
        pattern: '',
        occasion: '',
        saree_length: '',
        blouse_piece: false,
        work_type: ''
      });

      // Reset images
      selectedImages.forEach(image => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
      setSelectedImages([]);
      
      // Reset available sizes
      setAvailableSizes([]);

    } catch (error) {
      console.error('Product creation error:', error);
      
      // Handle different types of errors
      let errorMessage = 'Failed to add product';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Handle Pydantic validation errors
        if (Array.isArray(errorData.detail)) {
          const validationErrors = errorData.detail.map(err => 
            `${err.loc?.join(' → ') || 'Field'}: ${err.msg}`
          ).join('\n');
          errorMessage = `Validation errors:\n${validationErrors}`;
        } else if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isSaree = formData.category === 'saree';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
            <p className="text-gray-600">Add clothing items to your store</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shirt className="h-5 w-5 mr-2" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Beautiful Banarasi Silk Saree"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {Object.entries(categories).map(([group, items]) => (
                    <optgroup key={group} label={group}>
                      {items.map(item => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="e.g., Traditional Crafts"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Detailed description of your product..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Price & Stock */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <IndianRupee className="h-5 w-5 mr-2" />
              Pricing & Inventory
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Regular Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  min="1"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  Sale Price (₹)
                  <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">
                    SALE
                  </span>
                </label>
                <input
                  type="number"
                  name="discounted_price"
                  min="1"
                  step="0.01"
                  value={formData.discounted_price}
                  onChange={handleInputChange}
                  placeholder="Leave empty for no sale"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Add sale price to show product on SALE page
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  required
                  min="1"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sale Preview */}
            {formData.price && formData.discounted_price && parseFloat(formData.discounted_price) < parseFloat(formData.price) && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800">✓ This product will appear on SALE page!</p>
                    <div className="mt-2 flex items-center space-x-3">
                      <span className="text-lg font-bold text-green-600">₹{parseFloat(formData.discounted_price).toLocaleString()}</span>
                      <span className="text-sm text-gray-500 line-through">₹{parseFloat(formData.price).toLocaleString()}</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">
                        {Math.round((1 - parseFloat(formData.discounted_price) / parseFloat(formData.price)) * 100)}% OFF
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {formData.discounted_price && parseFloat(formData.discounted_price) >= parseFloat(formData.price) && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium text-yellow-800">⚠️ Sale price must be less than regular price</p>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Product Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fabric
                </label>
                <input
                  type="text"
                  name="fabric"
                  value={formData.fabric}
                  onChange={handleInputChange}
                  placeholder="e.g., Silk, Cotton, Georgette"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="e.g., Red, Blue, Golden"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Sizes (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-3">
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
                          px-5 py-2.5 min-w-[70px] border-2 rounded-lg font-semibold text-sm transition-all
                          ${isSelected
                            ? 'border-purple-600 bg-purple-600 text-white shadow-md'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-purple-400 hover:bg-purple-50'
                          }
                        `}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
                {availableSizes.length > 0 && (
                  <p className="mt-2 text-sm text-green-600 font-medium">
                    ✓ Selected sizes: {availableSizes.join(', ')}
                  </p>
                )}
                {availableSizes.length === 0 && (
                  <p className="mt-2 text-sm text-gray-500">
                    Leave empty if size selection is not applicable for this product
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pattern
                </label>
                <input
                  type="text"
                  name="pattern"
                  value={formData.pattern}
                  onChange={handleInputChange}
                  placeholder="e.g., Printed, Embroidered, Plain"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occasion
                </label>
                <input
                  type="text"
                  name="occasion"
                  value={formData.occasion}
                  onChange={handleInputChange}
                  placeholder="e.g., Wedding, Party, Casual"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Saree Specific Fields */}
          {isSaree && (
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6 border border-purple-200">
              <h2 className="text-lg font-semibold text-purple-900 mb-4">
                🥻 Saree Specific Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Saree Length (meters)
                  </label>
                  <input
                    type="number"
                    name="saree_length"
                    step="0.1"
                    min="5"
                    max="7"
                    value={formData.saree_length}
                    onChange={handleInputChange}
                    placeholder="e.g., 5.5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Type
                  </label>
                  <input
                    type="text"
                    name="work_type"
                    value={formData.work_type}
                    onChange={handleInputChange}
                    placeholder="e.g., Zari Work, Hand Embroidery"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="blouse_piece"
                      name="blouse_piece"
                      checked={formData.blouse_piece}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="blouse_piece" className="text-sm font-medium text-gray-700">
                      Includes Blouse Piece
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product Images */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Image className="h-5 w-5 mr-2" />
              Product Images (up to 10)
            </h2>
            
            {/* Image Upload Area */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="h-12 w-12 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-gray-500">
                    PNG, JPG, JPEG, WebP up to 5MB each
                  </span>
                </label>
              </div>
            </div>

            {/* Image Preview Grid */}
            {selectedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {selectedImages.map((image, index) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    {index === 0 && (
                      <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Image Counter */}
            <div className="mt-4 text-sm text-gray-600">
              {selectedImages.length}/10 images selected
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: '', description: '', category: '', price: '', stock: '',
                  brand: '', fabric: '', color: '', size: '', pattern: '', occasion: '',
                  saree_length: '', blouse_piece: false, work_type: ''
                });
                // Clear selected images
                selectedImages.forEach(image => {
                  if (image.preview) {
                    URL.revokeObjectURL(image.preview);
                  }
                });
                setSelectedImages([]);
              }}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Reset Form
            </button>
            
            <button
              type="submit"
              disabled={loading || imageUploadLoading}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Product...</span>
                </>
              ) : imageUploadLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading Images...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Add Product</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
