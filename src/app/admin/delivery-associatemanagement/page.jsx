"use client";

import { useEffect, useState } from 'react';
import { FiEdit, FiTrash2, FiCheck, FiX, FiUserPlus, FiSearch, FiFilter, FiRefreshCw, FiInfo, FiTruck, FiMapPin, FiAward } from 'react-icons/fi';

// Toast notification component
const Toast = ({ message, onClose }) => (
  <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-4 py-2 rounded shadow flex items-center space-x-2 animate-fade-in">
    <FiCheck className="inline" />
    <span>{message}</span>
    <button onClick={onClose} className="ml-2 text-white hover:text-gray-200 focus:outline-none">&times;</button>
  </div>
);

const DeliveryAssociateManagement = () => {
  // State management
  const [associates, setAssociates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');
  const [specializationFilter, setSpecializationFilter] = useState('All');
  const [selectedAssociate, setSelectedAssociate] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [isAssignOrderDialogOpen, setIsAssignOrderDialogOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Active',
    vehicleType: 'Motorcycle',
  });
  const [newOrderData, setNewOrderData] = useState({
    orderId: '',
    deliveryAddress: '',
    estimatedTime: '',
    notes: '',
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Active',
    vehicleType: 'Motorcycle',
  });
  // 1. Add delete functionality
  const [availableOrders, setAvailableOrders] = useState([]);

  useEffect(() => {
    const fetchAssociates = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        setLoading(false);
        return;
      }
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const res = await fetch(`${API_BASE_URL}/api/v1/delivery-associates`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) throw new Error('Failed to fetch associates');
        const data = await res.json();
        setAssociates(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAssociates();
  }, []);

  // 4. Fetch available orders for assignment
  const fetchAvailableOrders = async () => {
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_BASE_URL}/api/v1/orders?status=unassigned`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setAvailableOrders(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch orders when assign dialog opens
  useEffect(() => {
    if (isAssignOrderDialogOpen) {
      fetchAvailableOrders();
    }
    // eslint-disable-next-line
  }, [isAssignOrderDialogOpen]);

  // Unique lists for filters
  const regions = ['All', ...Array.from(new Set(associates.map(a => a.address?.region || '')))].filter(Boolean);
  const specializations = ['All', ...Array.from(new Set(associates.map(a => a.specialization || '')))].filter(Boolean);

  // Filter associates based on search and filters
  const filteredAssociates = associates.filter(associate => {
    const matchesSearch = (associate.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (associate.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (associate.phone || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || (associate.isActive ? 'Active' : 'Inactive') === statusFilter || (associate.status === statusFilter);
    const matchesRegion = regionFilter === 'All' || (associate.address?.region || '') === regionFilter;
    const matchesSpec = specializationFilter === 'All' || (associate.specialization || '') === specializationFilter;
    return matchesSearch && matchesStatus && matchesRegion && matchesSpec;
  });

  // Toast helper
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  // Open associate details modal
  const openDetailsModal = (associate) => {
    setSelectedAssociate(associate);
    setIsDetailsModalOpen(true);
  };

  // Open edit form with associate data
  const openEditForm = (associate) => {
    setEditFormData({
      name: associate.name,
      email: associate.email,
      phone: associate.phone,
      status: associate.status,
      vehicleType: associate.vehicleType,
    });
    setSelectedAssociate(associate);
    setIsEditModalOpen(true);
  };

  // Handle edit form changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 3. Add dynamic edit associate
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_BASE_URL}/api/v1/delivery-associates/${selectedAssociate._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });
      if (!res.ok) throw new Error('Failed to update associate');
      const data = await res.json();
      setAssociates(prev => prev.map(a => a._id === selectedAssociate._id ? data.data : a));
      setIsEditModalOpen(false);
      showToast('Associate details updated!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle associate approval status
  const toggleApproval = (associate) => {
    setSelectedAssociate(associate);
    setIsApprovalDialogOpen(true);
  };

  // Confirm approval change
  const confirmApproval = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_BASE_URL}/api/v1/delivery-associates/${selectedAssociate._id}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Failed to update approval');
      const updated = await res.json();
      setAssociates(prev =>
        prev.map(a =>
          a._id === selectedAssociate._id ? { ...a, isVerified: updated.data.isVerified } : a
        )
      );
      setIsApprovalDialogOpen(false);
      showToast(selectedAssociate.isVerified ? 'Approval revoked.' : 'Associate approved!');
    } catch (err) {
      setError(err.message);
    }
  };

  // Open assign order dialog
  const openAssignOrderDialog = (associate) => {
    setSelectedAssociate(associate);
    setNewOrderData({
      orderId: '',
      deliveryAddress: '',
      estimatedTime: '',
      notes: '',
    });
    setIsAssignOrderDialogOpen(true);
  };

  // Handle order assignment form changes
  const handleOrderFormChange = (e) => {
    const { name, value } = e.target;
    setNewOrderData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 5. Assign order to associate
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_BASE_URL}/api/v1/orders/${newOrderData.orderId}/assign`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deliveryAssociateId: selectedAssociate._id }),
      });
      if (!res.ok) throw new Error('Failed to assign order');
      showToast(`Order ${newOrderData.orderId} assigned to ${selectedAssociate.name}`);
      setIsAssignOrderDialogOpen(false);
      // Optionally, refetch associates/orders here
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add new associate (mock)
  const handleAddAssociate = () => {
    const newId = Math.max(...associates.map(a => a.id)) + 1;
    setAssociates([
      ...associates,
      {
        id: newId,
        name: 'New Associate',
        email: '',
        phone: '',
        status: 'Active',
        vehicleType: 'Motorcycle',
        vehicleReg: '',
        region: '',
        specialization: '',
        rating: 0,
        ordersCompleted: 0,
        joinedDate: new Date().toISOString().slice(0, 10),
        lastActive: new Date().toISOString(),
        approved: false,
        workload: 0,
        profilePic: '',
      },
    ]);
    showToast('New associate added!');
  };

  // Open add associate form
  const openAddForm = () => {
    setAddFormData({
      name: '',
      email: '',
      phone: '',
      status: 'Active',
      vehicleType: 'Motorcycle',
    });
    setIsAddModalOpen(true);
  };

  // Handle add form changes
  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 2. Add dynamic add associate
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_BASE_URL}/api/v1/delivery-associates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: addFormData.name,
          email: addFormData.email,
          phone: addFormData.phone,
          status: addFormData.status,
          vehicleType: addFormData.vehicleType,
        }),
      });
      if (!res.ok) throw new Error('Failed to add associate');
      const data = await res.json();
      setAssociates(prev => [data.data, ...prev]);
      setIsAddModalOpen(false);
      showToast('New associate added!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 1. Add delete functionality
  const handleDeleteAssociate = async (associateId) => {
    if (!window.confirm('Are you sure you want to delete this associate?')) return;
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_BASE_URL}/api/v1/delivery-associates/${associateId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Failed to delete associate');
      setAssociates(prev => prev.filter(a => a._id !== associateId));
      showToast('Associate deleted!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper for last active
  const formatLastActive = (iso) => {
    const date = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now - date) / 60000); // minutes
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} min ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hr ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 lg:py-8 relative">
      {/* Toast notification */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Farm Ferry Banner */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
        <FiTruck className="text-green-600 text-2xl sm:text-3xl" />
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-800 mb-1">Delivery Associate Management</h1>
          <p className="text-xs sm:text-sm text-green-900">Manage your farm delivery associates, assign orders, and track performance across regions and specializations. Farm Ferry ensures fresh produce and products reach customers efficiently!</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex flex-col gap-3">
          {/* Search Bar */}
          <div className="w-full relative">
            <label htmlFor="search-associates" className="block text-xs font-semibold text-green-700 mb-1 flex items-center">
              <FiSearch className="mr-1" />Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                id="search-associates"
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search associates"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label htmlFor="status-filter" className="block text-xs font-semibold text-green-700 mb-1 flex items-center">
                <FiInfo className="mr-1" />Status
              </label>
              <select
                id="status-filter"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
            <div>
              <label htmlFor="region-filter" className="block text-xs font-semibold text-green-700 mb-1 flex items-center">
                <FiMapPin className="mr-1" />Region
              </label>
              <select
                id="region-filter"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                aria-label="Filter by region"
              >
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="spec-filter" className="block text-xs font-semibold text-green-700 mb-1 flex items-center">
                <FiAward className="mr-1" />Specialization
              </label>
              <select
                id="spec-filter"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                value={specializationFilter}
                onChange={(e) => setSpecializationFilter(e.target.value)}
                aria-label="Filter by specialization"
              >
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
            
            {/* Reset Button */}
            <div className="flex items-end">
              <button
                className="w-full sm:w-auto inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('All');
                  setRegionFilter('All');
                  setSpecializationFilter('All');
                }}
                aria-label="Reset filters"
                type="button"
              >
                <FiRefreshCw className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Associate List Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-green-800 flex items-center mb-2 sm:mb-0">
            <FiInfo className="mr-2 text-green-500" />Delivery Associates
          </h2>
          <button
            className="w-full sm:w-auto inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            onClick={openAddForm}
            aria-label="Add new associate"
            title="Add new associate"
          >
            <FiUserPlus className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Add New Associate</span>
            <span className="sm:hidden">Add New</span>
          </button>
        </div>
        
        {loading && (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        )}
        
        {error && (
          <div className="p-4 text-center text-red-500">Error: {error}</div>
        )}
        
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-50">
                <tr>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Contact</th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Workload</th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Approved</th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-green-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAssociates.length > 0 ? (
                  filteredAssociates.map((associate) => (
                    <tr key={associate._id} className="hover:bg-green-50">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {associate.profilePic ? (
                            <img 
                              src={associate.profilePic} 
                              alt={associate.name} 
                              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover" 
                            />
                          ) : (
                            <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">
                              {associate.name?.charAt(0)}
                            </div>
                          )}
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{associate.name}</div>
                            <div className="text-xs text-gray-500 flex items-center">
                              {associate.vehicle?.type} ({associate.vehicle?.registration})
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{associate.email}</div>
                        <div className="text-xs sm:text-sm text-gray-500">{associate.phone}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            associate.isActive ? 'bg-green-100 text-green-800' :
                            associate.status === 'Suspended' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`} 
                          title={associate.isActive ? 'Active' : associate.status || 'Inactive'}
                        >
                          {associate.isActive ? 'Active' : associate.status || 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{associate.activeAssignments || 0} active</span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            associate.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`} 
                          title={associate.isVerified ? 'Approved' : 'Pending'}
                        >
                          {associate.isVerified ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-1 sm:space-x-2">
                          <button
                            onClick={() => openDetailsModal(associate)}
                            className="text-green-600 hover:text-green-900"
                            title="View Details"
                            aria-label="View details"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <button
                            onClick={() => openEditForm(associate)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                            aria-label="Edit associate"
                          >
                            <FiEdit className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                          <button
                            onClick={() => toggleApproval(associate)}
                            className={associate.isVerified ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                            title={associate.isVerified ? "Revoke Approval" : "Approve"}
                            aria-label={associate.isVerified ? "Revoke approval" : "Approve associate"}
                          >
                            {associate.isVerified ? <FiX className="h-4 w-4 sm:h-5 sm:w-5" /> : <FiCheck className="h-4 w-4 sm:h-5 sm:w-5" />}
                          </button>
                          <button
                            onClick={() => handleDeleteAssociate(associate._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                            aria-label="Delete associate"
                          >
                            <FiTrash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 sm:px-6 py-4 text-center text-sm text-gray-500">
                      No delivery associates found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delivery Associate Details Modal */}
      {isDetailsModalOpen && (
        <>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50" aria-hidden="true"></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl w-full max-w-2xl">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-16 sm:w-16">
                    <span className="text-green-600 text-xl font-medium">{selectedAssociate?.name?.charAt(0)}</span>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{selectedAssociate?.name}</h3>
                        <p className="text-sm text-gray-500">{selectedAssociate?.vehicle?.type} ({selectedAssociate?.vehicle?.registration}) • {selectedAssociate?.status}</p>
                      </div>
                      <div className="mt-2 sm:mt-0 flex space-x-2">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          selectedAssociate?.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedAssociate?.isVerified ? 'Approved' : 'Pending Approval'}
                        </span>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Rating: {selectedAssociate?.averageRating || 0}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-8">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
                        <p className="mt-1 text-sm text-gray-900">{selectedAssociate?.email}</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedAssociate?.phone}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Performance</h4>
                        <p className="mt-1 text-sm text-gray-900">Orders Completed: {selectedAssociate?.ordersCompleted || 0}</p>
                        <p className="mt-1 text-sm text-gray-900">Joined: {new Date(selectedAssociate?.createdAt).toLocaleDateString()}</p>
                        <p className="mt-1 text-sm text-gray-900">Workload: {selectedAssociate?.activeAssignments || 0} active</p>
                        <p className="mt-1 text-xs text-gray-500">Last Active: {formatLastActive(selectedAssociate?.lastLogin || selectedAssociate?.updatedAt)}</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-500">Recent Activity</h4>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
                          <span>Delivered order #12345 - Today</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
                          <span>Delivered order #12344 - Yesterday</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <div className="h-2 w-2 rounded-full bg-yellow-400 mr-2"></div>
                          <span>Order #12343 delayed - 2 days ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setIsDetailsModalOpen(false);
                    openEditForm(selectedAssociate);
                  }}
                  aria-label="Edit profile"
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsDetailsModalOpen(false)}
                  aria-label="Close details"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delivery Associate Edit Form */}
      {isEditModalOpen && (
        <>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50" aria-hidden="true"></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl w-full max-w-lg">
              <form onSubmit={handleEditSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-16 sm:w-16">
                      <span className="text-green-600 text-xl font-medium">{selectedAssociate?.name?.charAt(0)}</span>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Associate</h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={editFormData.name}
                            onChange={handleEditFormChange}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={editFormData.email}
                            onChange={handleEditFormChange}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            id="phone"
                            className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={editFormData.phone}
                            onChange={handleEditFormChange}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                              id="status"
                              name="status"
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                              value={editFormData.status}
                              onChange={handleEditFormChange}
                              required
                            >
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                              <option value="Suspended">Suspended</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                            <select
                              id="vehicleType"
                              name="vehicleType"
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                              value={editFormData.vehicleType}
                              onChange={handleEditFormChange}
                              required
                            >
                              <option value="Motorcycle">Motorcycle</option>
                              <option value="Car">Car</option>
                              <option value="Bicycle">Bicycle</option>
                              <option value="Scooter">Scooter</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Delivery Associate Approval Dialog */}
      {isApprovalDialogOpen && (
        <>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50" aria-hidden="true"></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl w-full max-w-lg">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${
                    selectedAssociate?.isVerified ? 'bg-red-100' : 'bg-green-100'
                  } sm:mx-0 sm:h-10 sm:w-10`}>
                    {selectedAssociate?.isVerified ? (
                      <FiX className={`h-6 w-6 text-red-600`} />
                    ) : (
                      <FiCheck className={`h-6 w-6 text-green-600`} />
                    )}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {selectedAssociate?.isVerified ? 'Revoke Approval' : 'Approve Associate'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {selectedAssociate?.isVerified
                          ? `Are you sure you want to revoke ${selectedAssociate?.name}'s approval? They will no longer be able to receive new orders.`
                          : `Are you sure you want to approve ${selectedAssociate?.name}? They will be able to receive new orders.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                    selectedAssociate?.isVerified ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                  } text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    selectedAssociate?.isVerified ? 'focus:ring-red-500' : 'focus:ring-green-500'
                  } sm:ml-3 sm:w-auto sm:text-sm`}
                  onClick={confirmApproval}
                >
                  {selectedAssociate?.isVerified ? 'Revoke Approval' : 'Approve'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsApprovalDialogOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Assign Order Dialog */}
      {isAssignOrderDialogOpen && (
        <>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50" aria-hidden="true"></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl w-full max-w-lg">
              <form onSubmit={handleOrderSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Assign Order to {selectedAssociate?.name}
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="orderId" className="block text-sm font-medium text-gray-700">Order</label>
                          <select
                            name="orderId"
                            id="orderId"
                            className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={newOrderData.orderId}
                            onChange={handleOrderFormChange}
                            required
                          >
                            <option value="">Select an order</option>
                            {availableOrders.map(order => (
                              <option key={order._id} value={order._id}>
                                {order.orderNumber || order._id} - {order.deliveryAddress?.addressLine1 || ''}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700">Delivery Address</label>
                          <input
                            type="text"
                            name="deliveryAddress"
                            id="deliveryAddress"
                            className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={newOrderData.deliveryAddress}
                            onChange={handleOrderFormChange}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700">Estimated Delivery Time</label>
                            <input
                              type="text"
                              name="estimatedTime"
                              id="estimatedTime"
                              placeholder="e.g., 30 minutes"
                              className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              value={newOrderData.estimatedTime}
                              onChange={handleOrderFormChange}
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
                            <input
                              type="text"
                              name="notes"
                              id="notes"
                              className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              value={newOrderData.notes}
                              onChange={handleOrderFormChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Assign Order
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setIsAssignOrderDialogOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Add New Associate Modal */}
      {isAddModalOpen && (
        <>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50" aria-hidden="true"></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl w-full max-w-lg">
              <form onSubmit={handleAddSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-16 sm:w-16">
                      <span className="text-green-600 text-xl font-medium">+</span>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Associate</h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="add-name" className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            name="name"
                            id="add-name"
                            className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={addFormData.name}
                            onChange={handleAddFormChange}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="add-email" className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            name="email"
                            id="add-email"
                            className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={addFormData.email}
                            onChange={handleAddFormChange}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="add-phone" className="block text-sm font-medium text-gray-700">Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            id="add-phone"
                            className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={addFormData.phone}
                            onChange={handleAddFormChange}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="add-status" className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                              id="add-status"
                              name="status"
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                              value={addFormData.status}
                              onChange={handleAddFormChange}
                              required
                            >
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                              <option value="Suspended">Suspended</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="add-vehicleType" className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                            <select
                              id="add-vehicleType"
                              name="vehicleType"
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                              value={addFormData.vehicleType}
                              onChange={handleAddFormChange}
                              required
                            >
                              <option value="Motorcycle">Motorcycle</option>
                              <option value="Car">Car</option>
                              <option value="Bicycle">Bicycle</option>
                              <option value="Scooter">Scooter</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Add Associate
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DeliveryAssociateManagement;