"use client";

import React, { useState, useEffect } from 'react';
import { Package, Eye, Edit3, Truck, Search, Filter, Calendar, MapPin, Phone, User, Clock, CheckCircle, AlertCircle, XCircle, Plus, X, Loader2 } from 'lucide-react';
import { getAllOrders, getOrderById, updateOrderStatus, assignDeliveryAssociate, getAllDeliveryAssociates } from '../../../utils/api';

const STATUS_TRANSITIONS_MAP = {
  pending: ['processing', 'cancelled'],
  processing: ['out_for_delivery', 'cancelled'],
  out_for_delivery: ['delivered', 'damaged'],
  delivered: ['returned'],
  cancelled: [],
  returned: [],
  damaged: [],
};

const STATUS_TRANSITIONS = {
  admin: ['pending', 'processing', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'damaged'],
  supplier: ['processing', 'out_for_delivery', 'cancelled', 'damaged'],
  deliveryAssociate: ['picked_up', 'on_the_way', 'delivered'],
  customer: ['cancelled', 'returned'],
};

const getAllowedStatusUpdates = (currentStatus, role) => {
  if (role === 'admin') return STATUS_TRANSITIONS_MAP[currentStatus] || [];
  if (role === 'supplier') {
    if (["pending", "processing"].includes(currentStatus)) {
      return STATUS_TRANSITIONS_MAP[currentStatus].filter(status => STATUS_TRANSITIONS.supplier.includes(status));
    }
    return [];
  }
  if (role === 'deliveryAssociate') {
    if (currentStatus === 'out_for_delivery') {
      return STATUS_TRANSITIONS_MAP[currentStatus].filter(status => STATUS_TRANSITIONS.deliveryAssociate.includes(status));
    }
    return [];
  }
  if (role === 'customer') {
    if (["pending", "processing"].includes(currentStatus)) {
      return STATUS_TRANSITIONS_MAP[currentStatus].filter(status => STATUS_TRANSITIONS.customer.includes(status));
    }
    if (currentStatus === 'delivered') {
      return STATUS_TRANSITIONS_MAP[currentStatus].filter(status => STATUS_TRANSITIONS.customer.includes(status));
    }
    return [];
  }
  return [];
};

const OrderManagementDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryAssociates, setDeliveryAssociates] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [userRole, setUserRole] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get token from localStorage
  const getToken = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
          console.log('❌ Invalid token format');
        }
      }
      return token;
    }
    return null;
  };

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sort: 'createdAt',
        order: 'desc'
      };

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      if (dateFilter !== 'all') {
        const today = new Date();
        if (dateFilter === 'today') {
          params.startDate = today.toISOString().split('T')[0];
          params.endDate = today.toISOString().split('T')[0];
        } else if (dateFilter === 'tomorrow') {
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          params.startDate = tomorrow.toISOString().split('T')[0];
          params.endDate = tomorrow.toISOString().split('T')[0];
        }
      }

      const response = await getAllOrders(params, token);
      setOrders(response.orders || []);
      setPagination(prev => ({
        ...prev,
        total: response.pagination?.total || 0,
        pages: response.pagination?.pages || 0
      }));
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  // Fetch delivery associates
  const fetchDeliveryAssociates = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await getAllDeliveryAssociates({ limit: 100 }, token);
      setDeliveryAssociates(response.deliveryAssociates || []);
    } catch (err) {
      console.error('Error fetching delivery associates:', err);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchOrders();
    fetchDeliveryAssociates();
  }, [pagination.page, statusFilter, dateFilter]);

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
      } catch (e) {
        setUserRole(null);
      }
    }
  }, []);

  // Handle order status update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      await updateOrderStatus(orderId, newStatus, '', token);
      
      // Refresh orders
      await fetchOrders();
      setShowStatusForm(false);
    } catch (err) {
      console.error('Error updating order status:', err);
      alert(err.message || 'Failed to update order status');
    }
  };

  // Handle delivery associate assignment
  const handleAssignDeliveryAssociate = async (orderId, associate) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      await assignDeliveryAssociate(orderId, associate._id, token);
      
      // Refresh orders
      await fetchOrders();
      setShowAssignDialog(false);
    } catch (err) {
      console.error('Error assigning delivery associate:', err);
      alert(err.message || 'Failed to assign delivery associate');
    }
  };

  // Handle search
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchOrders();
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'returned': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'damaged': return 'bg-amber-200 text-amber-900 border-amber-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <CheckCircle className="w-4 h-4" />;
      case 'out_for_delivery': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'returned': return <AlertCircle className="w-4 h-4" />;
      case 'damaged': return <AlertCircle className="w-4 h-4 text-amber-600" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Order List Table Component
  const OrderListTable = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-gray-200">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            Order Management
          </h2>
          
          <div className="w-full md:w-auto grid grid-cols-1 sm:grid-cols-2 md:flex gap-2 md:gap-3 text-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            <select 
              className="px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
              <option value="damaged">Damaged</option>
            </select>
            
            <select 
              className="px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          <span className="ml-2 text-gray-600">Loading orders...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchOrders}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm md:text-base"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            {isMobile ? (
              <div className="space-y-4 p-4">
                {orders.map((order) => (
                  <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">#{order.orderId?.slice(-6)}</div>
                        <div className="text-xs text-gray-500">{formatDate(order.createdAt)}</div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="mt-3">
                      <div className="text-sm">
                        <span className="font-medium">Customer:</span> {order.customer?.firstName} {order.customer?.lastName}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Items:</span> {order.items?.length} items
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Amount:</span> {formatCurrency(order.totalAmount)}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center text-gray-800">
                      {order.deliveryAssociate?.associate ? (
                        <div className="text-xs">
                          <div className="text-gray-700">
                            {order.deliveryAssociate.associate.name}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Not assigned</span>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderDetails(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowStatusForm(true);
                          }}
                          className="text-green-600 hover:text-green-900 transition-colors p-1"
                          title="Update Status"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowAssignDialog(true);
                          }}
                          className={`text-purple-600 hover:text-purple-900 transition-colors p-1 ${order.status !== 'processing' ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title={order.status !== 'processing' ? 'Can only assign delivery associate when order is in processing status' : 'Assign Delivery'}
                          disabled={order.status !== 'processing'}
                        >
                          <Truck className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 text-sm">{order.orderId?.slice(-6)}</div>
                        <div className="text-xs text-gray-500">{formatDate(order.createdAt)}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 text-sm">
                          {order.customer?.firstName} {order.customer?.lastName}
                        </div>
                        <div className="text-xs text-gray-500">{order.customer?.email}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">
                          {order.items?.slice(0, 2).map((item, index) => (
                            <div key={index} className="text-xs">
                              {item.product?.name} x {item.quantity}
                            </div>
                          ))}
                          {order.items?.length > 2 && (
                            <div className="text-xs text-gray-500">+{order.items.length - 2} more</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 text-sm">{formatCurrency(order.totalAmount)}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {order.deliveryAssociate? (
                          <div className="text-xs">
                            <div className="font-medium text-gray-900">
                              {order.deliveryAssociate?.name ||                                
                               'Delivery Associate'}
                            </div>
                          </div>
                        ) : order.deliveryAssociate ? (
                          <div className="text-xs">
                            <div className="font-medium text-gray-900">
                              {order.deliveryAssociate?.name || 
                               'Delivery Associate'}
                            </div>
                            
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Not assigned</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderDetails(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowStatusForm(true);
                            }}
                            className="text-green-600 hover:text-green-900 transition-colors p-1"
                            title="Update Status"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowAssignDialog(true);
                            }}
                            className={`text-purple-600 hover:text-purple-900 transition-colors p-1 ${order.status !== 'processing' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title={order.status !== 'processing' ? 'Can only assign delivery associate when order is in processing status' : 'Assign Delivery'}
                            disabled={order.status !== 'processing'}
                          >
                            <Truck className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {orders.length === 0 && !loading && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No orders found matching your criteria.</p>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                <div className="text-sm text-gray-700">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-700">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  // Order Details Modal Component
  const OrderDetailsModal = () => {
    const [showItems, setShowItems] = useState(false);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-4 md:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div className="flex justify-between items-center">
              <h3 className="text-lg md:text-xl font-bold text-gray-900">Order Details - {selectedOrder?.orderId?.slice(-6)}</h3>
              <button
                onClick={() => setShowOrderDetails(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>
          
          <div className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
                    <User className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                    Customer Information
                  </h4>
                  <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
                    <p><span className="font-medium">Name:</span> {selectedOrder?.customer?.firstName} {selectedOrder?.customer?.lastName}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder?.customer?.email}</p>
                    <p><span className="font-medium">Phone:</span> <span className="ml-1 text-green-700 font-semibold">{selectedOrder?.customer?.phone || 'N/A'}</span></p>
                    <p><span className="font-medium">Address:</span> {selectedOrder?.deliveryAddress?.street}, {selectedOrder?.deliveryAddress?.city}, {selectedOrder?.deliveryAddress?.state} {selectedOrder?.deliveryAddress?.postalCode}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                    Order Information
                  </h4>
                  <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
                    <p><span className="font-medium">Order Date:</span> {formatDate(selectedOrder?.createdAt)}</p>
                    <p><span className="font-medium">Estimated Delivery:</span> {formatDate(selectedOrder?.estimatedDeliveryDate)}</p>
                    <p className="flex items-center"><span className="font-medium">Status:</span> 
                      <span className={`ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder?.status)}`}>
                        {getStatusIcon(selectedOrder?.status)}
                        {selectedOrder?.status?.replace('_', ' ')}
                      </span>
                    </p>
                    <p><span className="font-medium">Payment Method:</span> {selectedOrder?.paymentMethod?.replace('_', ' ')}</p>
                    <p><span className="font-medium">Payment Status:</span> {selectedOrder?.paymentStatus}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                  <button
                    onClick={() => setShowItems(!showItems)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-sm md:text-base">
                      <Package className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                      Items Ordered ({selectedOrder?.items?.length || 0} items)
                    </h4>
                    <div className={`transform transition-transform duration-200 ${showItems ? 'rotate-180' : ''}`}>
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  
                  {showItems && (
                    <div className="mt-3 space-y-2">
                      {selectedOrder?.items?.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0 text-xs md:text-sm">
                          <div>
                            <p className="font-medium">{item.product?.name}</p>
                            <p className="text-gray-500">{item.quantity} units</p>
                          </div>
                          <p className="font-medium">{formatCurrency(item.totalPrice)}</p>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-2 border-t border-gray-300 text-sm md:text-base">
                        <p className="font-bold">Total Amount:</p>
                        <p className="font-bold">{formatCurrency(selectedOrder?.totalAmount)}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
                    <Truck className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                    Delivery Information
                  </h4>
                  <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
                    {selectedOrder?.deliveryAssociate? (
                      <div>
                        <p><span className="font-medium">Assigned to:</span> {selectedOrder.deliveryAssociate.name || selectedOrder.deliveryAssociate.associate.name}</p>
                        <p><span className="font-medium">Contact:</span> {selectedOrder.deliveryAssociate.associate.phone || 'N/A'}</p>
                        <p><span className="font-medium">Assigned at:</span> {formatDate(selectedOrder.deliveryAssociate.assignedAt)}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500">No delivery associate assigned</p>
                    )}
                    {selectedOrder?.notes && (
                      <div>
                        <p className="font-medium">Special Instructions:</p>
                        <p className="text-gray-700 bg-white p-2 rounded border text-xs">{selectedOrder.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Order Status Update Form Component
  const OrderStatusUpdateForm = () => {
    const allowedStatuses = getAllowedStatusUpdates(selectedOrder?.status, userRole);
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg w-full max-w-md">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg md:text-xl font-bold text-gray-900">Update Order Status</h3>
              <button
                onClick={() => setShowStatusForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>
          <div className="p-4 md:p-6">
            <div className="mb-3 md:mb-4">
              <p className="text-xs md:text-sm text-gray-600 mb-1">Order ID: <span className="font-medium">{selectedOrder?.orderId?.slice(-6)}</span></p>
              <p className="text-xs md:text-sm text-gray-600">Customer: <span className="font-medium">{selectedOrder?.customer?.firstName} {selectedOrder?.customer?.lastName}</span></p>
            </div>
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Current Status:</label>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder?.status)}`}>
                  {getStatusIcon(selectedOrder?.status)}
                  {selectedOrder?.status?.replace('_', ' ')}
                </span>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Update to:</label>
                <div className="space-y-2">
                  {allowedStatuses.length === 0 && (
                    <div className="text-gray-500 text-xs md:text-sm">No status updates allowed for your role at this stage.</div>
                  )}
                  {allowedStatuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdateOrderStatus(selectedOrder?._id, status)}
                      className={`w-full text-left px-3 py-2 rounded-lg border transition-colors text-xs md:text-sm ${
                        selectedOrder?.status === status 
                          ? 'bg-gray-100 border-gray-300 cursor-not-allowed' 
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                      disabled={selectedOrder?.status === status}
                      title={`Allowed for role: ${userRole}`}
                    >
                      <span className={`inline-flex items-center gap-2 ${getStatusColor(status)}`}>
                        {getStatusIcon(status)}
                        {status.replace('_', ' ')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Role legend */}
              <div className="mt-3 md:mt-4 text-xs text-gray-500">
                <div className="font-semibold mb-1">Status Update Permissions:</div>
                <ul className="list-disc ml-4 space-y-1">
                  <li><b>Admin:</b> Can update to any status</li>
                  <li><b>Supplier:</b> Can set Processing, Out for Delivery, Cancelled (before handover)</li>
                  <li><b>Delivery Associate:</b> Can set Picked Up, On the Way, Delivered</li>
                  <li><b>Customer:</b> Can request Cancelled (if pending/processing), Returned (if delivered)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Assign Delivery Associate Dialog Component
  const AssignDeliveryAssociateDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">Assign Delivery Associate</h3>
            <button
              onClick={() => setShowAssignDialog(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Order Details */}
            <div className="bg-gray-50 p-3 md:p-4 rounded-lg h-full">
              <h4 className="font-semibold text-gray-900 mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
                <Package className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                Order Details
              </h4>
              <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
                <p><span className="font-medium">Order ID:</span> {selectedOrder?.orderId?.slice(-6)}</p>
                <p><span className="font-medium">Order Date:</span> {formatDate(selectedOrder?.createdAt)}</p>
                <p><span className="font-medium">Delivery Date:</span> {formatDate(selectedOrder?.estimatedDeliveryDate)}</p>
                <p><span className="font-medium">Customer:</span> {selectedOrder?.customer?.firstName} {selectedOrder?.customer?.lastName}</p>
                <p><span className="font-medium">Phone:</span> {selectedOrder?.customer?.phone || 'N/A'}</p>
                <p><span className="font-medium">Address:</span> {selectedOrder?.deliveryAddress?.street}, {selectedOrder?.deliveryAddress?.city}, {selectedOrder?.deliveryAddress?.state} {selectedOrder?.deliveryAddress?.postalCode}</p>
                <p><span className="font-medium">Status:</span> <span className={`ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder?.status)}`}>{getStatusIcon(selectedOrder?.status)}{selectedOrder?.status?.replace('_', ' ')}</span></p>
                <p><span className="font-medium">Amount:</span> {formatCurrency(selectedOrder?.totalAmount)}</p>
                <div className="mt-2">
                  <span className="font-medium">Items:</span>
                  <ul className="space-y-2 mt-2">
                    {selectedOrder?.items?.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 p-2 bg-white rounded border border-gray-100">
                        {item.product?.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product?.name}
                            className="w-12 h-12 object-cover rounded border"
                          />
                        ) : (
                          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded border text-gray-400 text-xs">No Image</div>
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-xs md:text-sm">{item.product?.name}</div>
                          <div className="text-gray-500 text-xs">Qty: {item.quantity}</div>
                          <div className="text-gray-500 text-xs">Price: {formatCurrency(item.product?.price || 0)}</div>
                        </div>
                        <div className="font-bold text-green-700 text-xs md:text-sm">{formatCurrency(item.totalPrice)}</div>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-300 text-sm md:text-base mt-2">
                    <p className="font-bold">Total Amount:</p>
                    <p className="font-bold">{formatCurrency(selectedOrder?.totalAmount)}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Right: Available Associates */}
            <div>
              <h4 className="font-medium text-gray-900 text-sm md:text-base mb-2 md:mb-3">Available Associates:</h4>
              {deliveryAssociates.length === 0 ? (
                <p className="text-gray-500 text-xs md:text-sm">No delivery associates available</p>
              ) : (
                deliveryAssociates.map((associate) => (
                  <div
                    key={associate._id}
                    className={`p-2 md:p-3 rounded-lg border transition-colors text-xs md:text-sm ${
                      associate.isOnline 
                        ? 'bg-white border-gray-200 hover:bg-gray-50 cursor-pointer' 
                        : 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60'
                    }`}
                    onClick={() => associate.isOnline && handleAssignDeliveryAssociate(selectedOrder?._id, associate)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{associate.name}</p>
                        <p className="text-gray-500">{associate.phone}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          associate.isOnline 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {associate.isOnline ? 'Online' : 'Offline'}
                        </span>
                        {selectedOrder?.deliveryAssociate?.associate?._id === associate._id && (
                          <span className="text-blue-600 text-xs md:text-sm font-medium">Current</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <OrderListTable />
        
        {showOrderDetails && selectedOrder && <OrderDetailsModal />}
        {showStatusForm && selectedOrder && <OrderStatusUpdateForm />}
        {showAssignDialog && selectedOrder && <AssignDeliveryAssociateDialog />}
      </div>
    </div>
  );
};

export default OrderManagementDashboard;