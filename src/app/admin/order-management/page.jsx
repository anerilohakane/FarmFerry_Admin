"use client";

import React, { useState, useEffect } from 'react';
import { Package, Eye, Edit3, Truck, Search, Filter, Calendar, MapPin, Phone, User, Clock, CheckCircle, AlertCircle, XCircle, Plus, X, Loader2 } from 'lucide-react';
import { getAllOrders, getOrderById, updateOrderStatus, assignDeliveryAssociate, getAllDeliveryAssociates } from '../../../utils/api';

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

  // Get token from localStorage
  const getToken = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      console.log('🔑 Current token:', token ? 'Present' : 'Missing');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('🔍 Token payload:', {
            id: payload.id,
            email: payload.email,
            role: payload.role,
            exp: new Date(payload.exp * 1000)
          });
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
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Order List Table Component
  const OrderListTable = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-green-600" />
            Order Management
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            <select 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
            </select>
            
            <select 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Associate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{order.orderId}</div>
                      <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {order.customer?.firstName} {order.customer?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{order.customer?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.items?.slice(0, 2).map((item, index) => (
                          <div key={index}>
                            {item.product?.name} x {item.quantity}
                          </div>
                        ))}
                        {order.items?.length > 2 && (
                          <div className="text-gray-500">+{order.items.length - 2} more</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{formatCurrency(order.totalAmount)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.deliveryAssociate?.associate ? (
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {order.deliveryAssociate.associate.firstName} {order.deliveryAssociate.associate.lastName}
                          </div>
                          <div className="text-gray-500">{order.deliveryAssociate.associate.phone}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderDetails(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowStatusForm(true);
                          }}
                          className="text-green-600 hover:text-green-900 transition-colors"
                          title="Update Status"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowAssignDialog(true);
                          }}
                          className="text-purple-600 hover:text-purple-900 transition-colors"
                          title="Assign Delivery"
                        >
                          <Truck className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && !loading && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No orders found matching your criteria.</p>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-700">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
  const OrderDetailsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">Order Details - {selectedOrder?.orderId}</h3>
            <button
              onClick={() => setShowOrderDetails(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-600" />
                  Customer Information
                </h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedOrder?.customer?.firstName} {selectedOrder?.customer?.lastName}</p>
                  <p><span className="font-medium">Email:</span> {selectedOrder?.customer?.email}</p>
                  <p><span className="font-medium">Phone:</span> {selectedOrder?.customer?.phone || 'N/A'}</p>
                  <p><span className="font-medium">Address:</span> {selectedOrder?.deliveryAddress?.street}, {selectedOrder?.deliveryAddress?.city}, {selectedOrder?.deliveryAddress?.state} {selectedOrder?.deliveryAddress?.postalCode}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  Order Information
                </h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Order Date:</span> {formatDate(selectedOrder?.createdAt)}</p>
                  <p><span className="font-medium">Estimated Delivery:</span> {formatDate(selectedOrder?.estimatedDeliveryDate)}</p>
                  <p><span className="font-medium">Status:</span> 
                    <span className={`ml-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder?.status)}`}>
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
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5 text-gray-600" />
                  Items Ordered
                </h4>
                <div className="space-y-2">
                  {selectedOrder?.items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <div>
                        <p className="font-medium">{item.product?.name}</p>
                        <p className="text-sm text-gray-500">{item.quantity} units</p>
                      </div>
                      <p className="font-medium">{formatCurrency(item.totalPrice)}</p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                    <p className="font-bold">Total Amount:</p>
                    <p className="font-bold text-lg">{formatCurrency(selectedOrder?.totalAmount)}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-gray-600" />
                  Delivery Information
                </h4>
                <div className="space-y-2">
                  {selectedOrder?.deliveryAssociate?.associate ? (
                    <div>
                      <p><span className="font-medium">Assigned to:</span> {selectedOrder.deliveryAssociate.associate.firstName} {selectedOrder.deliveryAssociate.associate.lastName}</p>
                      <p><span className="font-medium">Contact:</span> {selectedOrder.deliveryAssociate.associate.phone}</p>
                      <p><span className="font-medium">Assigned at:</span> {formatDate(selectedOrder.deliveryAssociate.assignedAt)}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">No delivery associate assigned</p>
                  )}
                  {selectedOrder?.notes && (
                    <div>
                      <p className="font-medium">Special Instructions:</p>
                      <p className="text-gray-700 bg-white p-2 rounded border">{selectedOrder.notes}</p>
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

  // Order Status Update Form Component
  const OrderStatusUpdateForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">Update Order Status</h3>
            <button
              onClick={() => setShowStatusForm(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Order ID: <span className="font-medium">{selectedOrder?.orderId}</span></p>
            <p className="text-sm text-gray-600">Customer: <span className="font-medium">{selectedOrder?.customer?.firstName} {selectedOrder?.customer?.lastName}</span></p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Status:</label>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder?.status)}`}>
                {getStatusIcon(selectedOrder?.status)}
                {selectedOrder?.status?.replace('_', ' ')}
              </span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Update to:</label>
              <div className="space-y-2">
                {['pending', 'processing', 'out_for_delivery', 'delivered', 'cancelled', 'returned'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleUpdateOrderStatus(selectedOrder?._id, status)}
                    className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                      selectedOrder?.status === status 
                        ? 'bg-gray-100 border-gray-300 cursor-not-allowed' 
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                    disabled={selectedOrder?.status === status}
                  >
                    <span className={`inline-flex items-center gap-2 ${getStatusColor(status)}`}>
                      {getStatusIcon(status)}
                      {status.replace('_', ' ')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Assign Delivery Associate Dialog Component
  const AssignDeliveryAssociateDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">Assign Delivery Associate</h3>
            <button
              onClick={() => setShowAssignDialog(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Order ID: <span className="font-medium">{selectedOrder?.orderId}</span></p>
            <p className="text-sm text-gray-600">Delivery Date: <span className="font-medium">{formatDate(selectedOrder?.estimatedDeliveryDate)}</span></p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Available Associates:</h4>
            {deliveryAssociates.length === 0 ? (
              <p className="text-gray-500">No delivery associates available</p>
            ) : (
              deliveryAssociates.map((associate) => (
                <div
                  key={associate._id}
                  className={`p-3 rounded-lg border transition-colors ${
                    associate.isOnline 
                      ? 'bg-white border-gray-200 hover:bg-gray-50 cursor-pointer' 
                      : 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60'
                  }`}
                  onClick={() => associate.isOnline && handleAssignDeliveryAssociate(selectedOrder?._id, associate)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{associate.name}</p>
                      <p className="text-sm text-gray-500">{associate.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        associate.isOnline 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {associate.isOnline ? 'Online' : 'Offline'}
                      </span>
                      {selectedOrder?.deliveryAssociate?.associate?._id === associate._id && (
                        <span className="text-blue-600 text-sm font-medium">Current</span>
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
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
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