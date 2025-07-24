"use client";
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, Check } from 'lucide-react';
import { apiRequest } from '@/utils/api';

const CategoryManagementDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', status: 'Active', image: null });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest('/api/v1/categories?includeInactive=true');
      let arr = [];
      if (Array.isArray(data.data?.categories)) {
        arr = data.data.categories;
      } else if (Array.isArray(data.categories)) {
        arr = data.categories;
      } else if (Array.isArray(data.data)) {
        arr = data.data;
      } else if (Array.isArray(data)) {
        arr = data;
      }
      setCategories(arr);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const displayedCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add Category
  const handleAddCategory = async () => {
    if (!formData.name.trim()) return;
    setActionLoading(true);
    setActionError('');
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('isActive', formData.status === 'Active');
      if (formData.image) {
        console.log('Image file:', formData.image);
        submitData.append('image', formData.image);
      }
      // Log all FormData entries
      for (let pair of submitData.entries()) {
        console.log('FormData:', pair[0], pair[1]);
      }
      await apiRequest('/api/v1/categories', {
        method: 'POST',
        body: submitData,
        isFormData: true
      });
      await fetchCategories();
      setShowAddForm(false);
      setFormData({ name: '', description: '', status: 'Active', image: null });
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Edit Category
  const handleEditCategory = async () => {
    if (!formData.name.trim() || !selectedCategory) return;
    setActionLoading(true);
    setActionError('');
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('isActive', formData.status === 'Active');
      if (formData.image) {
        submitData.append('image', formData.image);
      }
      await apiRequest(`/api/v1/categories/${selectedCategory._id}`, {
        method: 'PUT',
        body: submitData,
        isFormData: true
      });
      setCategories(prev => prev.map(cat =>
        cat._id === selectedCategory._id
          ? { ...cat, ...formData }
          : cat
      ));
      setShowEditForm(false);
      setSelectedCategory(null);
      setFormData({ name: '', description: '', status: 'Active', image: null });
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    setActionLoading(true);
    setActionError('');
    try {
      await apiRequest(`/api/v1/categories/${selectedCategory._id || selectedCategory.id}`, {
        method: 'DELETE',
      });
      await fetchCategories();
      setShowDeleteDialog(false);
      
      setSelectedCategory(null);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const openEditForm = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      status: category.isActive ? 'Active' : 'Inactive',
      image: null
    });
    setShowEditForm(true);
  };

  const openDeleteDialog = (category) => {
    setSelectedCategory(category);
    setShowDeleteDialog(true);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', status: 'Active', image: null });
    setShowAddForm(false);
    setShowEditForm(false);
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Category Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your farm produce categories and organize your products</p>
        </div>
        
        {loading && (
          <div className="text-center py-8 text-gray-500">Loading categories...</div>
        )}
        
        {error && (
          <div className="text-center py-8 text-red-500">{error}</div>
        )}
        
        {!loading && !error && (
          <>
            {/* Search and Add Button */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
                <div className="relative w-full sm:flex-1 sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                  <input
                    type="text"
                    placeholder="Search farm categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
                >
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                  Add Category
                </button>
              </div>
            </div>

            {/* Category List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {displayedCategories.map((category) => (
                      <tr key={category._id || category.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {category.image?.url && (
                              <img
                                src={category.image.url}
                                alt={category.name}
                                className="w-10 h-10 object-cover rounded border"
                              />
                            )}
                            <span className="text-sm font-medium text-gray-900">{category.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 max-w-xs truncate">{category.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(category.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEditForm(category)}
                              className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                              aria-label="Edit category"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openDeleteDialog(category)}
                              className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                              aria-label="Delete category"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="sm:hidden space-y-3 p-4">
                {displayedCategories.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-lg">No farm categories found</p>
                    <p className="text-gray-400 text-sm mt-2">Try adjusting your search or add a new product category</p>
                  </div>
                ) : (
                  displayedCategories.map((category) => (
                    <div key={category._id || category.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        {category.image?.url && (
                          <img
                            src={category.image.url}
                            alt={category.name}
                            className="w-10 h-10 object-cover rounded border"
                          />
                        )}
                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                      </div>
                      
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {new Date(category.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditForm(category)}
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                            aria-label="Edit category"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openDeleteDialog(category)}
                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                            aria-label="Delete category"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Empty state for desktop */}
              {displayedCategories.length === 0 && (
                <div className="hidden sm:block text-center py-12">
                  <p className="text-gray-500 text-lg">No farm categories found</p>
                  <p className="text-gray-400 text-sm mt-2">Try adjusting your search or add a new product category</p>
                </div>
              )}
            </div>

            {/* Add Category Form Modal */}
            {showAddForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Add New Farm Category</h2>
                    <button
                      onClick={resetForm}
                      className="text-gray-400 hover:text-gray-600 p-1"
                      aria-label="Close modal"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Fresh Vegetables, Dairy Products"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        placeholder="Describe the types of products in this category..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => setFormData({ ...formData, image: e.target.files[0] })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    
                    <div className="flex gap-3 pt-3 sm:pt-4">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="flex-1 px-4 py-2 text-sm sm:text-base text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="flex-1 px-4 py-2 text-sm sm:text-base bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                        disabled={actionLoading}
                      >
                        {actionLoading ? (
                          <>
                            Adding...
                            <Check className="h-4 w-4" />
                          </>
                        ) : 'Add Category'}
                      </button>
                    </div>
                    {actionError && (
                      <div className="text-red-500 text-sm mt-2">{actionError}</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Edit Category Form Modal */}
            {showEditForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Edit Farm Category</h2>
                    <button
                      onClick={resetForm}
                      className="text-gray-400 hover:text-gray-600 p-1"
                      aria-label="Close modal"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Fresh Vegetables, Dairy Products"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        placeholder="Describe the types of products in this category..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    
                    {selectedCategory?.image?.url && (
                      <div className="mb-2">
                        <span className="block text-xs text-gray-500 mb-1">Current Image:</span>
                        <img
                          src={selectedCategory.image.url}
                          alt={selectedCategory.name}
                          className="w-24 h-24 object-cover rounded border"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => setFormData({ ...formData, image: e.target.files[0] })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    
                    <div className="flex gap-3 pt-3 sm:pt-4">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="flex-1 px-4 py-2 text-sm sm:text-base text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleEditCategory}
                        className="flex-1 px-4 py-2 text-sm sm:text-base bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                        disabled={actionLoading}
                      >
                        {actionLoading ? (
                          <>
                            Updating...
                            <Check className="h-4 w-4" />
                          </>
                        ) : 'Update Category'}
                      </button>
                    </div>
                    {actionError && (
                      <div className="text-red-500 text-sm mt-2">{actionError}</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Delete Category Dialog */}
            {showDeleteDialog && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="bg-red-100 p-2 rounded-full">
                      <Trash2 className="h-5 sm:h-6 w-5 sm:w-6 text-red-600" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Delete Farm Category</h2>
                  </div>
                  
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                    Are you sure you want to delete "{selectedCategory?.name}"? This action cannot be undone.
                  </p>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteDialog(false)}
                      className="flex-1 px-4 py-2 text-sm sm:text-base text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteCategory}
                      className="flex-1 px-4 py-2 text-sm sm:text-base bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Deleting...' : 'Delete'}
                      {actionLoading && <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                  {actionError && (
                    <div className="text-red-500 text-sm mt-2">{actionError}</div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryManagementDashboard;