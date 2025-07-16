"use client";

import { useState } from 'react';
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
  // Sample data for delivery associates
  const initialAssociates = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 555-123-4567',
      status: 'Active',
      vehicleType: 'Motorcycle',
      vehicleReg: 'MH12AB1234',
      region: 'Green Valley',
      specialization: 'Vegetables',
      rating: 4.8,
      ordersCompleted: 125,
      joinedDate: '2023-01-15',
      lastActive: '2024-06-10T10:30:00Z',
      approved: true,
      workload: 2,
      profilePic: '',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 555-987-6543',
      status: 'Inactive',
      vehicleType: 'Car',
      vehicleReg: 'KA05CD5678',
      region: 'Sunrise Farms',
      specialization: 'Dairy',
      rating: 4.5,
      ordersCompleted: 89,
      joinedDate: '2023-03-22',
      lastActive: '2024-06-09T16:00:00Z',
      approved: false,
      workload: 0,
      profilePic: '',
    },
    {
      id: 3,
      name: 'Robert Johnson',
      email: 'robert@example.com',
      phone: '+1 555-456-7890',
      status: 'Suspended',
      vehicleType: 'Bicycle',
      vehicleReg: 'DL01EF4321',
      region: 'Riverbank',
      specialization: 'Poultry',
      rating: 4.2,
      ordersCompleted: 42,
      joinedDate: '2023-05-10',
      lastActive: '2024-06-08T08:15:00Z',
      approved: true,
      workload: 1,
      profilePic: '',
    },
  ];

  // Mock orders for assignment
  const mockOrders = [
    { id: 'ORD-1001', address: 'Farm Lane 12, Green Valley', notes: 'Handle with care', estimatedTime: '45 min' },
    { id: 'ORD-1002', address: 'Sunrise Farms, Block B', notes: '', estimatedTime: '30 min' },
    { id: 'ORD-1003', address: 'Riverbank, Plot 7', notes: 'Fragile eggs', estimatedTime: '60 min' },
  ];

  // State management
  const [associates, setAssociates] = useState(initialAssociates);
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
    vehicleReg: '',
    region: '',
    specialization: '',
  });
  const [newOrderData, setNewOrderData] = useState({
    orderId: '',
    deliveryAddress: '',
    estimatedTime: '',
    notes: '',
  });

  // Unique lists for filters
  const regions = ['All', ...Array.from(new Set(associates.map(a => a.region)))];
  const specializations = ['All', ...Array.from(new Set(associates.map(a => a.specialization)))];

  // Filter associates based on search and filters
  const filteredAssociates = associates.filter(associate => {
    const matchesSearch = associate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      associate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      associate.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || associate.status === statusFilter;
    const matchesRegion = regionFilter === 'All' || associate.region === regionFilter;
    const matchesSpec = specializationFilter === 'All' || associate.specialization === specializationFilter;
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
      vehicleReg: associate.vehicleReg,
      region: associate.region,
      specialization: associate.specialization,
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

  // Submit edited associate data
  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedAssociates = associates.map(associate =>
      associate.id === selectedAssociate.id ? { ...associate, ...editFormData } : associate
    );
    setAssociates(updatedAssociates);
    setIsEditModalOpen(false);
    showToast('Associate details updated!');
  };

  // Toggle associate approval status
  const toggleApproval = (associate) => {
    setSelectedAssociate(associate);
    setIsApprovalDialogOpen(true);
  };

  // Confirm approval change
  const confirmApproval = () => {
    const updatedAssociates = associates.map(associate =>
      associate.id === selectedAssociate.id ? { ...associate, approved: !associate.approved } : associate
    );
    setAssociates(updatedAssociates);
    setIsApprovalDialogOpen(false);
    showToast(selectedAssociate.approved ? 'Approval revoked.' : 'Associate approved!');
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

  // Submit assigned order
  const handleOrderSubmit = (e) => {
    e.preventDefault();
    showToast(`Order ${newOrderData.orderId} assigned to ${selectedAssociate.name}`);
    setIsAssignOrderDialogOpen(false);
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
    <div className="container mx-auto px-4 py-8 relative">
      {/* Toast notification */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Farm Ferry Banner */}
      <div className="mb-6 flex items-center space-x-4 bg-green-50 border border-green-200 rounded-lg p-4">
        <FiTruck className="text-green-600 text-3xl" />
        <div>
          <h1 className="text-3xl font-bold text-green-800 mb-1">Delivery Associate Management</h1>
          <p className="text-green-900 text-sm">Manage your farm delivery associates, assign orders, and track performance across regions and specializations. Farm Ferry ensures fresh produce and products reach customers efficiently!</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          {/* Search Bar */}
          <div className="w-full md:w-1/3 relative mb-2 md:mb-0">
            <label htmlFor="search-associates" className="block text-xs font-semibold text-green-700 mb-1 flex items-center"><FiSearch className="mr-1" />Search</label>
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
          <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label htmlFor="status-filter" className="block text-xs font-semibold text-green-700 mb-1 flex items-center"><FiInfo className="mr-1" />Status</label>
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
              <label htmlFor="region-filter" className="block text-xs font-semibold text-green-700 mb-1 flex items-center"><FiMapPin className="mr-1" />Region</label>
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
              <label htmlFor="spec-filter" className="block text-xs font-semibold text-green-700 mb-1 flex items-center"><FiAward className="mr-1" />Specialization</label>
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
          </div>

          {/* Reset Button */}
          <div className="w-full md:w-auto flex justify-end mt-2 md:mt-0">
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setRegionFilter('All');
                setSpecializationFilter('All');
              }}
              aria-label="Reset filters"
              type="button"
            >
              <FiRefreshCw className="mr-2" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Delivery Associate List Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-green-800 flex items-center"><FiInfo className="mr-2 text-green-500" />Delivery Associates</h2>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            onClick={handleAddAssociate}
            aria-label="Add new associate"
            title="Add new associate"
          >
            <FiUserPlus className="mr-2" />
            Add New Associate
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Contact</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Region</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Specialization</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Workload</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Rating</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Approved</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Last Active</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-green-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssociates.map((associate) => (
                <tr key={associate.id} className="hover:bg-green-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {associate.profilePic ? (
                        <img src={associate.profilePic} alt={associate.name} className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">
                          {associate.name.charAt(0)}
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{associate.name}</div>
                        <div className="text-xs text-gray-500 flex items-center"><FiAward className="mr-1" />{associate.vehicleType} ({associate.vehicleReg})</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{associate.email}</div>
                    <div className="text-sm text-gray-500">{associate.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 flex items-center"><FiMapPin className="mr-1" />{associate.region}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{associate.specialization}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      associate.status === 'Active' ? 'bg-green-100 text-green-800' :
                      associate.status === 'Suspended' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`} title={associate.status}>
                      {associate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{associate.workload} active</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900 mr-2">{associate.rating}</div>
                      <div className="w-20 bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-yellow-400 h-2.5 rounded-full" 
                          style={{ width: `${(associate.rating / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      associate.approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`} title={associate.approved ? 'Approved' : 'Pending'}>
                      {associate.approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs text-gray-500">{formatLastActive(associate.lastActive)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => openDetailsModal(associate)}
                        className="text-green-600 hover:text-green-900"
                        title="View Details"
                        aria-label="View details"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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
                        <FiEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => toggleApproval(associate)}
                        className={associate.approved ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                        title={associate.approved ? "Revoke Approval" : "Approve"}
                        aria-label={associate.approved ? "Revoke approval" : "Approve associate"}
                      >
                        {associate.approved ? <FiX className="h-5 w-5" /> : <FiCheck className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={() => openAssignOrderDialog(associate)}
                        className="text-purple-600 hover:text-purple-900"
                        title="Assign Order"
                        aria-label="Assign order"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredAssociates.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No delivery associates found matching your criteria.</p>
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
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{selectedAssociate?.name}</h3>
                        <p className="text-sm text-gray-500">{selectedAssociate?.vehicleType} ({selectedAssociate?.vehicleReg}) • {selectedAssociate?.status}</p>
                        <p className="text-xs text-gray-500">Region: {selectedAssociate?.region} | Specialization: {selectedAssociate?.specialization}</p>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          selectedAssociate?.approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedAssociate?.approved ? 'Approved' : 'Pending Approval'}
                        </span>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Rating: {selectedAssociate?.rating}
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
                        <p className="mt-1 text-sm text-gray-900">Orders Completed: {selectedAssociate?.ordersCompleted}</p>
                        <p className="mt-1 text-sm text-gray-900">Joined: {new Date(selectedAssociate?.joinedDate).toLocaleDateString()}</p>
                        <p className="mt-1 text-sm text-gray-900">Workload: {selectedAssociate?.workload} active</p>
                        <p className="mt-1 text-xs text-gray-500">Last Active: {formatLastActive(selectedAssociate?.lastActive)}</p>
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
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setIsDetailsModalOpen(false);
                    openAssignOrderDialog(selectedAssociate);
                  }}
                  aria-label="Assign order"
                >
                  Assign Order
                </button>
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
                        <div className="grid grid-cols-2 gap-4">
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
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="vehicleReg" className="block text-sm font-medium text-gray-700">Vehicle Registration</label>
                            <input
                              type="text"
                              name="vehicleReg"
                              id="vehicleReg"
                              className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              value={editFormData.vehicleReg}
                              onChange={handleEditFormChange}
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="region" className="block text-sm font-medium text-gray-700">Region</label>
                            <input
                              type="text"
                              name="region"
                              id="region"
                              className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              value={editFormData.region}
                              onChange={handleEditFormChange}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">Specialization</label>
                          <input
                            type="text"
                            name="specialization"
                            id="specialization"
                            className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={editFormData.specialization}
                            onChange={handleEditFormChange}
                            required
                          />
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
                    selectedAssociate?.approved ? 'bg-red-100' : 'bg-green-100'
                  } sm:mx-0 sm:h-10 sm:w-10`}>
                    {selectedAssociate?.approved ? (
                      <FiX className={`h-6 w-6 text-red-600`} />
                    ) : (
                      <FiCheck className={`h-6 w-6 text-green-600`} />
                    )}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {selectedAssociate?.approved ? 'Revoke Approval' : 'Approve Associate'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {selectedAssociate?.approved
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
                    selectedAssociate?.approved ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                  } text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    selectedAssociate?.approved ? 'focus:ring-red-500' : 'focus:ring-green-500'
                  } sm:ml-3 sm:w-auto sm:text-sm`}
                  onClick={confirmApproval}
                >
                  {selectedAssociate?.approved ? 'Revoke Approval' : 'Approve'}
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
                            {mockOrders.map(order => (
                              <option key={order.id} value={order.id}>{order.id} - {order.address}</option>
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
                        <div className="grid grid-cols-2 gap-4">
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
    </div>
  );
};

export default DeliveryAssociateManagement;