import React, { useState, useEffect } from 'react';
import { Building2, TrendingUp, Users, MapPin, Calendar, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { companyAPI } from '../services/api';

const CompanyInfo = () => {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [formData, setFormData] = useState({
    artisans_supported: '500+',
    villages_reached: '50+',
    happy_customers: '10,000+',
    years_of_excellence: '5+',
    features: [
      { title: '100% Handwoven', description: 'Every product is authentically handcrafted by skilled artisans' },
      { title: 'Premium Quality', description: 'Carefully curated collection with the finest materials' },
      { title: 'Ethical Sourcing', description: 'Direct partnerships ensuring fair wages for artisans' },
      { title: 'Cultural Heritage', description: 'Preserving traditional techniques and designs' }
    ]
  });

  useEffect(() => {
    // Try to fetch, but don't block UI if it fails
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    setLoading(true);
    try {
      console.log('Fetching company info...');
      const response = await companyAPI.getInfo();
      console.log('Company info response:', response);
      const data = response.data;
      
      setFormData({
        artisans_supported: data.artisans_supported || '500+',
        villages_reached: data.villages_reached || '50+',
        happy_customers: data.happy_customers || '10,000+',
        years_of_excellence: data.years_of_excellence || '5+',
        features: data.features || [
          { title: '100% Handwoven', description: 'Every product is authentically handcrafted by skilled artisans' },
          { title: 'Premium Quality', description: 'Carefully curated collection with the finest materials' },
          { title: 'Ethical Sourcing', description: 'Direct partnerships ensuring fair wages for artisans' },
          { title: 'Cultural Heritage', description: 'Preserving traditional techniques and designs' }
        ]
      });
    } catch (error) {
      console.error('Error fetching company info:', error);
      console.error('Error details:', error.response?.data);
      // Don't show error for fetch, just use defaults
      toast.info('Using default company information');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => 
        i === index ? { ...feature, [field]: value } : feature
      )
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, { title: '', description: '' }]
    }));
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);

    try {
      console.log('Updating company info with data:', formData);
      const token = localStorage.getItem('authToken');
      console.log('Using token:', token ? 'Token exists' : 'No token found');
      
      const response = await companyAPI.updateInfo(formData);
      console.log('Update response:', response);
      toast.success('Company information updated successfully!');
      
      // Refresh data to show updated values
      await fetchCompanyInfo();
    } catch (error) {
      console.error('Error updating company info:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please login again.');
      } else if (error.response?.status === 403) {
        toast.error('Access denied. Seller permissions required.');
      } else {
        toast.error(`Failed to update company information: ${error.response?.data?.detail || error.message}`);
      }
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Company Information</h1>
            <p className="text-gray-600">Update your store's impact statistics and features</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Impact Statistics */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Our Impact Statistics
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Users className="h-4 w-4 mr-1" />
                  Artisans Supported
                </label>
                <input
                  type="text"
                  name="artisans_supported"
                  value={formData.artisans_supported}
                  onChange={handleInputChange}
                  placeholder="e.g., 500+"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  Villages Reached
                </label>
                <input
                  type="text"
                  name="villages_reached"
                  value={formData.villages_reached}
                  onChange={handleInputChange}
                  placeholder="e.g., 50+"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Users className="h-4 w-4 mr-1" />
                  Happy Customers
                </label>
                <input
                  type="text"
                  name="happy_customers"
                  value={formData.happy_customers}
                  onChange={handleInputChange}
                  placeholder="e.g., 10,000+"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  Years of Excellence
                </label>
                <input
                  type="text"
                  name="years_of_excellence"
                  value={formData.years_of_excellence}
                  onChange={handleInputChange}
                  placeholder="e.g., 5+"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Company Features */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Why Choose Us Features
              </h2>
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Feature
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.features.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Feature Title
                        </label>
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                          placeholder="e.g., Premium Quality"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={feature.description}
                          onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                          placeholder="Brief description of this feature..."
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {formData.features.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No features added yet. Click "Add Feature" to get started.</p>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saveLoading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
            >
              {saveLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Building2 className="h-5 w-5" />
                  <span>Update Company Info</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyInfo;
