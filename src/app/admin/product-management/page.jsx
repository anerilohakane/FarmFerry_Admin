'use client';
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, Search, Filter, X } from 'lucide-react';

const ProductManagementDashboard = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Organic Tomatoes",
      category: "Fresh Produce",
      price: 4.99,
      stock: 250,
      status: "Active",
      description: "Fresh organic vine-ripened tomatoes, locally grown without pesticides. Perfect for salads and cooking.",
      sku: "FP-TOM-001",
      dateAdded: "2024-01-15"
    },
    {
      id: 2,
      name: "Free-Range Eggs",
      category: "Dairy & Eggs",
      price: 6.50,
      stock: 48,
      status: "Active",
      description: "Farm-fresh free-range eggs from happy hens. Rich in nutrients and perfect for breakfast.",
      sku: "DE-EGG-001",
      dateAdded: "2024-01-10"
    },
    {
      id: 3,
      name: "Organic Milk",
      category: "Dairy & Eggs",
      price: 5.99,
      stock: 0,
      status: "Out of Stock",
      description: "Creamy organic whole milk from grass-fed cows. Delivered fresh daily from local farms.",
      sku: "DE-MLK-001",
      dateAdded: "2024-01-08"
    },
    {
      id: 4,
      name: "Wheat Flour",
      category: "Grains & Cereals",
      price: 3.25,
      stock: 120,
      status: "Active",
      description: "Stone-ground whole wheat flour from locally sourced wheat. Perfect for baking bread and pastries.",
      sku: "GC-FLR-001",
      dateAdded: "2024-01-05"
    },
    {
      id: 5,
      name: "Honey",
      category: "Pantry",
      price: 12.99,
      stock: 35,
      status: "Active",
      description: "Pure wildflower honey harvested from local beehives. Raw and unfiltered for maximum health benefits.",
      sku: "PT-HNY-001",
      dateAdded: "2024-01-12"
    },
    {
      id: 6,
      name: "Organic Carrots",
      category: "Fresh Produce",
      price: 2.99,
      stock: 180,
      status: "Active",
      description: "Crisp organic carrots, freshly harvested. Great for snacking, cooking, and juicing.",
      sku: "FP-CAR-001",
      dateAdded: "2024-01-14"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [currentView, setCurrentView] = useState('list');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const categories = ['All', 'Fresh Produce', 'Dairy & Eggs', 'Grains & Cereals', 'Pantry', 'Meat & Poultry', 'Fruits', 'Vegetables'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = (newProduct) => {
    const product = {
      ...newProduct,
      id: Math.max(...products.map(p => p.id)) + 1,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setProducts([...products, product]);
    setShowAddForm(false);
  };

  const handleEditProduct = (updatedProduct) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setEditingProduct(null);
  };

  const handleDeleteProduct = () => {
    setProducts(products.filter(p => p.id !== productToDelete.id));
    setShowDeleteDialog(false);
    setProductToDelete(null);
  };

  const ProductListTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
            <p className="text-gray-600 mt-1">Manage your product inventory and details</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.sku}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${product.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="text-yellow-600 hover:text-yellow-800 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setProductToDelete(product);
                        setShowDeleteDialog(true);
                      }}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );

  const ProductDetailsModal = ({ product, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Name</label>
                  <p className="mt-1 text-sm text-gray-900">{product.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">SKU</label>
                  <p className="mt-1 text-sm text-gray-900">{product.sku}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <p className="mt-1 text-sm text-gray-900">{product.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date Added</label>
                  <p className="mt-1 text-sm text-gray-900">{product.dateAdded}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory & Pricing</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <p className="mt-1 text-sm text-gray-900">${product.price}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  <p className="mt-1 text-sm text-gray-900">{product.stock} units</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`mt-1 inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    product.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const ProductForm = ({ product, onSave, onCancel, isEditing }) => {
    const [formData, setFormData] = useState({
      name: product?.name || '',
      category: product?.category || 'Electronics',
      price: product?.price || '',
      stock: product?.stock || '',
      status: product?.status || 'Active',
      description: product?.description || '',
      sku: product?.sku || ''
    });

    const handleSubmit = () => {
      if (!formData.name || !formData.sku || !formData.category || !formData.price || !formData.stock || !formData.status) {
        alert('Please fill in all required fields');
        return;
      }
      
      onSave({
        ...formData,
        id: product?.id,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU *
                </label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.filter(cat => cat !== 'All').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Active">Active</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product description..."
              />
            </div>
            
            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isEditing ? 'Update Product' : 'Add Product'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ProductDeleteDialog = ({ product, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            Delete Product
          </h3>
          <p className="text-sm text-gray-600 text-center mb-6">
            Are you sure you want to delete "{product.name}"? This action cannot be undone.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <ProductListTable />
        
        {selectedProduct && (
          <ProductDetailsModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
        
        {showAddForm && (
          <ProductForm
            onSave={handleAddProduct}
            onCancel={() => setShowAddForm(false)}
            isEditing={false}
          />
        )}
        
        {editingProduct && (
          <ProductForm
            product={editingProduct}
            onSave={handleEditProduct}
            onCancel={() => setEditingProduct(null)}
            isEditing={true}
          />
        )}
        
        {showDeleteDialog && productToDelete && (
          <ProductDeleteDialog
            product={productToDelete}
            onConfirm={handleDeleteProduct}
            onCancel={() => {
              setShowDeleteDialog(false);
              setProductToDelete(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProductManagementDashboard;