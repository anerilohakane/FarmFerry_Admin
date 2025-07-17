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
  const [formData, setFormData] = useState({ name: '', description: '', status: 'Active' });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    console.log('All categories:', categories);
  }, [categories]);

  async function fetchCategories() {
    setLoading(true);
    setError(null);
    try {
      // Remove isActive filter to fetch all categories
      const data = await apiRequest('/api/v1/categories?includeInactive=true');
      console.log('Fetched categories:', data);
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

  // Remove search filtering, always display all categories
  // const filteredCategories = categories.filter(...)
  const displayedCategories = categories;

  // Add Category
  const handleAddCategory = async () => {
    if (!formData.name.trim()) return;
    setActionLoading(true);
    setActionError('');
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        isActive: formData.status === 'Active',
      };
      await apiRequest('/api/v1/categories', {
        method: 'POST',
        body: payload,
      });
      await fetchCategories();
      setShowAddForm(false);
      setFormData({ name: '', description: '', status: 'Active' });
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
      console.log('Editing category:', selectedCategory);
      const payload = {
        name: formData.name,
        description: formData.description,
        isActive: formData.status === 'Active',
      };
      await apiRequest(`/api/v1/categories/${selectedCategory._id}`, {
        method: 'PUT',
        body: payload,
      });
      // Optimistically update the local state for immediate UI feedback
      setCategories(prev => prev.map(cat =>
        cat._id === selectedCategory._id
          ? { ...cat, ...payload }
          : cat
      ));
      setShowEditForm(false);
      setSelectedCategory(null);
      setFormData({ name: '', description: '', status: 'Active' });
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

  // When opening the edit form
  const openEditForm = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      status: category.isActive ? 'Active' : 'Inactive',
    });
    setShowEditForm(true);
  };

  const openDeleteDialog = (category) => {
    setSelectedCategory(category);
    setShowDeleteDialog(true);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', status: 'Active' });
    setShowAddForm(false);
    setShowEditForm(false);
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2"> Category Management</h1>
          <p className="text-gray-600">Manage your farm produce categories and organize your products</p>
        </div>
        {loading && (
          <div className="text-center py-8 text-gray-500">Loading categories...</div>
        )}
        {error && (
          <div className="text-center py-8 text-red-500">{error}</div>
        )}
        {/* Only render the rest if not loading and no error */}
        {!loading && !error && (
          <>
            {/* Search and Add Button */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search farm categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Add Category
                </button>
              </div>
            </div>

            {/* Category List Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
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
                          <div className="text-sm font-medium text-gray-900">{category.name}</div>
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
                          {category.createdAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEditForm(category)}
                              className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openDeleteDialog(category)}
                              className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
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
              
              {displayedCategories.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No farm categories found</p>
                  <p className="text-gray-400 text-sm mt-2">Try adjusting your search or add a new product category</p>
                </div>
              )}
            </div>

            {/* Add Category Form Modal */}
            {showAddForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Add New Farm Category</h2>
                    <button
                      onClick={resetForm}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Fresh Vegetables, Dairy Products"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                        disabled={actionLoading}
                      >
                        {actionLoading ? 'Adding...' : 'Add Category'}
                        {actionLoading && <Check className="h-4 w-4" />}
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
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Edit Farm Category</h2>
                    <button
                      onClick={resetForm}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Fresh Vegetables, Dairy Products"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleEditCategory}
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                        disabled={actionLoading}
                      >
                        {actionLoading ? 'Updating...' : 'Update Category'}
                        {actionLoading && <Check className="h-4 w-4" />}
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
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-red-100 p-2 rounded-full">
                      <Trash2 className="h-6 w-6 text-red-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Delete Farm Category</h2>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete "{selectedCategory?.name}"? This action cannot be undone.
                  </p>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteDialog(false)}
                      className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteCategory}
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
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