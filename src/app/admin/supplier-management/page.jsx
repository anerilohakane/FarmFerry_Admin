"use client";

import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, Edit, Eye, Check, X, Building2, Mail, Phone, MapPin, Calendar, User, DollarSign, Star, AlertCircle } from 'lucide-react';

const SupplierManagementDashboard = () => {
  // Sample supplier data
  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      name: 'TechCorp Solutions',
      email: 'contact@techcorp.com',
      phone: '+1 (555) 123-4567',
      address: '123 Tech Street, Silicon Valley, CA 94000',
      category: 'Technology',
      status: 'active',
      approvalStatus: 'approved',
      joinDate: '2023-01-15',
      rating: 4.8,
      totalOrders: 45,
      totalValue: 125000,
      contact: 'John Smith',
      description: 'Leading technology solutions provider specializing in enterprise software and cloud services.'
    },
    {
      id: 2,
      name: 'Global Manufacturing Inc',
      email: 'info@globalmanuf.com',
      phone: '+1 (555) 987-6543',
      address: '456 Industrial Ave, Detroit, MI 48000',
      category: 'Manufacturing',
      status: 'active',
      approvalStatus: 'pending',
      joinDate: '2023-03-20',
      rating: 4.2,
      totalOrders: 23,
      totalValue: 89000,
      contact: 'Sarah Johnson',
      description: 'Comprehensive manufacturing solutions with focus on quality and efficiency.'
    },
    {
      id: 3,
      name: 'Premium Services Ltd',
      email: 'hello@premiumserv.com',
      phone: '+1 (555) 456-7890',
      address: '789 Service Blvd, New York, NY 10001',
      category: 'Services',
      status: 'inactive',
      approvalStatus: 'rejected',
      joinDate: '2023-02-10',
      rating: 3.5,
      totalOrders: 12,
      totalValue: 34000,
      contact: 'Mike Davis',
      description: 'Professional services company offering consulting and support solutions.'
    },
    {
      id: 4,
      name: 'EcoSupply Chain',
      email: 'contact@ecosupply.com',
      phone: '+1 (555) 321-0987',
      address: '321 Green Way, Portland, OR 97000',
      category: 'Logistics',
      status: 'active',
      approvalStatus: 'approved',
      joinDate: '2023-04-05',
      rating: 4.6,
      totalOrders: 67,
      totalValue: 156000,
      contact: 'Emma Wilson',
      description: 'Sustainable supply chain solutions with environmental focus.'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [approvalFilter, setApprovalFilter] = useState('all');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [approvalAction, setApprovalAction] = useState('');

  // Filter suppliers based on search and filters
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier => {
      const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           supplier.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
      const matchesApproval = approvalFilter === 'all' || supplier.approvalStatus === approvalFilter;
      
      return matchesSearch && matchesStatus && matchesApproval;
    });
  }, [suppliers, searchTerm, statusFilter, approvalFilter]);

  // Handle supplier actions
  const handleViewDetails = (supplier) => {
    setSelectedSupplier(supplier);
    setShowDetailsModal(true);
  };

  const handleEditSupplier = (supplier) => {
    setEditingSupplier({ ...supplier });
    setShowEditForm(true);
  };

  const handleApprovalAction = (supplier, action) => {
    setSelectedSupplier(supplier);
    setApprovalAction(action);
    setShowApprovalDialog(true);
  };

  const confirmApproval = () => {
    if (selectedSupplier && approvalAction) {
      setSuppliers(prev => prev.map(s => 
        s.id === selectedSupplier.id 
          ? { ...s, approvalStatus: approvalAction }
          : s
      ));
      setShowApprovalDialog(false);
      setSelectedSupplier(null);
      setApprovalAction('');
    }
  };

  const handleSaveEdit = () => {
    if (editingSupplier) {
      setSuppliers(prev => prev.map(s => 
        s.id === editingSupplier.id ? editingSupplier : s
      ));
      setShowEditForm(false);
      setEditingSupplier(null);
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${classes[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getApprovalBadge = (status) => {
    const classes = {
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${classes[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Supplier Management</h1>
          <p className="text-gray-600">Manage and monitor your supplier relationships</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Suppliers</p>
                <p className="text-2xl font-bold text-gray-900">{suppliers.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{suppliers.filter(s => s.status === 'active').length}</p>
              </div>
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">{suppliers.filter(s => s.approvalStatus === 'pending').length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-purple-600">${suppliers.reduce((sum, s) => sum + s.totalValue, 0).toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <select
                value={approvalFilter}
                onChange={(e) => setApprovalFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Approvals</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Supplier List Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                          <div className="text-sm text-gray-500">{supplier.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{supplier.contact}</div>
                      <div className="text-sm text-gray-500">{supplier.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        {supplier.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(supplier.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getApprovalBadge(supplier.approvalStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-900">{supplier.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(supplier)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditSupplier(supplier)}
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {supplier.approvalStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprovalAction(supplier, 'approved')}
                              className="text-green-600 hover:text-green-900 p-1 rounded"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleApprovalAction(supplier, 'rejected')}
                              className="text-red-600 hover:text-red-900 p-1 rounded"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedSupplier && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Supplier Details</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{selectedSupplier.name}</p>
                          <p className="text-sm text-gray-500">{selectedSupplier.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 mr-3" />
                        <p className="text-sm text-gray-900">{selectedSupplier.email}</p>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-400 mr-3" />
                        <p className="text-sm text-gray-900">{selectedSupplier.phone}</p>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                        <p className="text-sm text-gray-900">{selectedSupplier.address}</p>
                      </div>
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-3" />
                        <p className="text-sm text-gray-900">{selectedSupplier.contact}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Status</span>
                        {getStatusBadge(selectedSupplier.status)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Approval</span>
                        {getApprovalBadge(selectedSupplier.approvalStatus)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Rating</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm text-gray-900">{selectedSupplier.rating}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Orders</span>
                        <span className="text-sm font-medium text-gray-900">{selectedSupplier.totalOrders}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Value</span>
                        <span className="text-sm font-medium text-gray-900">${selectedSupplier.totalValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Join Date</span>
                        <span className="text-sm text-gray-900">{new Date(selectedSupplier.joinDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-sm text-gray-600">{selectedSupplier.description}</p>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Form Modal */}
        {showEditForm && editingSupplier && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Edit Supplier</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      value={editingSupplier.name}
                      onChange={(e) => setEditingSupplier({...editingSupplier, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                    <input
                      type="text"
                      value={editingSupplier.contact}
                      onChange={(e) => setEditingSupplier({...editingSupplier, contact: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={editingSupplier.email}
                      onChange={(e) => setEditingSupplier({...editingSupplier, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={editingSupplier.phone}
                      onChange={(e) => setEditingSupplier({...editingSupplier, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={editingSupplier.category}
                      onChange={(e) => setEditingSupplier({...editingSupplier, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Technology">Technology</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Services">Services</option>
                      <option value="Logistics">Logistics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={editingSupplier.status}
                      onChange={(e) => setEditingSupplier({...editingSupplier, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={editingSupplier.address}
                    onChange={(e) => setEditingSupplier({...editingSupplier, address: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editingSupplier.description}
                    onChange={(e) => setEditingSupplier({...editingSupplier, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowEditForm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Approval Dialog */}
        {showApprovalDialog && selectedSupplier && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {approvalAction === 'approved' ? 'Approve Supplier' : 'Reject Supplier'}
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to {approvalAction === 'approved' ? 'approve' : 'reject'} <strong>{selectedSupplier.name}</strong>?
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowApprovalDialog(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmApproval}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      approvalAction === 'approved' 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    {approvalAction === 'approved' ? 'Approve' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierManagementDashboard;