"use client";

import React, { useState, useEffect } from 'react';
import { Package, Eye, Edit3, Truck, Search, Filter, Calendar, MapPin, Phone, User, Clock, CheckCircle, AlertCircle, XCircle, Plus, X } from 'lucide-react';

const OrderManagementDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Sample order data
  const sampleOrders = [
    {
      id: 'ORD-001',
      customerName: 'John Doe',
      customerPhone: '+1 234-567-8900',
      customerAddress: '123 Main St, Cityville, State 12345',
      items: [
        { name: 'Organic Tomatoes', quantity: 5, unit: 'kg', price: 25.00 },
        { name: 'Fresh Lettuce', quantity: 3, unit: 'bunches', price: 15.00 },
        { name: 'Carrots', quantity: 2, unit: 'kg', price: 12.00 }
      ],
      totalAmount: 52.00,
      status: 'pending',
      deliveryDate: '2024-12-20',
      orderDate: '2024-12-18',
      deliveryAssociate: null,
      specialInstructions: 'Please deliver in the morning'
    },
    {
      id: 'ORD-002',
      customerName: 'Jane Smith',
      customerPhone: '+1 234-567-8901',
      customerAddress: '456 Oak Ave, Townsburg, State 67890',
      items: [
        { name: 'Organic Apples', quantity: 3, unit: 'kg', price: 18.00 },
        { name: 'Fresh Spinach', quantity: 2, unit: 'bunches', price: 10.00 }
      ],
      totalAmount: 28.00,
      status: 'confirmed',
      deliveryDate: '2024-12-19',
      orderDate: '2024-12-17',
      deliveryAssociate: { name: 'Mike Johnson', phone: '+1 234-567-8902' },
      specialInstructions: 'Call before delivery'
    },
    {
      id: 'ORD-003',
      customerName: 'Robert Wilson',
      customerPhone: '+1 234-567-8903',
      customerAddress: '789 Pine Rd, Villagetown, State 11111',
      items: [
        { name: 'Organic Potatoes', quantity: 10, unit: 'kg', price: 30.00 },
        { name: 'Onions', quantity: 2, unit: 'kg', price: 8.00 }
      ],
      totalAmount: 38.00,
      status: 'out_for_delivery',
      deliveryDate: '2024-12-18',
      orderDate: '2024-12-16',
      deliveryAssociate: { name: 'Sarah Davis', phone: '+1 234-567-8904' },
      specialInstructions: 'Leave at door if no one answers'
    },
    {
      id: 'ORD-004',
      customerName: 'Emma Brown',
      customerPhone: '+1 234-567-8905',
      customerAddress: '321 Elm St, Hamletville, State 22222',
      items: [
        { name: 'Organic Cucumbers', quantity: 4, unit: 'kg', price: 16.00 }
      ],
      totalAmount: 16.00,
      status: 'delivered',
      deliveryDate: '2024-12-17',
      orderDate: '2024-12-15',
      deliveryAssociate: { name: 'Tom Anderson', phone: '+1 234-567-8906' },
      specialInstructions: 'Ring doorbell twice'
    }
  ];

  const deliveryAssociates = [
    { id: 1, name: 'Mike Johnson', phone: '+1 234-567-8902', available: true },
    { id: 2, name: 'Sarah Davis', phone: '+1 234-567-8904', available: false },
    { id: 3, name: 'Tom Anderson', phone: '+1 234-567-8906', available: true },
    { id: 4, name: 'Lisa Wilson', phone: '+1 234-567-8907', available: true }
  ];

  useEffect(() => {
    setOrders(sampleOrders);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'out_for_delivery': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesDate = dateFilter === 'all' || 
                       (dateFilter === 'today' && order.deliveryDate === '2024-12-18') ||
                       (dateFilter === 'tomorrow' && order.deliveryDate === '2024-12-19');
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    setShowStatusForm(false);
  };

  const assignDeliveryAssociate = (orderId, associate) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, deliveryAssociate: associate } : order
    ));
    setShowAssignDialog(false);
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
              />
            </div>
            
            <select 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
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

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Associate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{order.id}</div>
                  <div className="text-sm text-gray-500">{order.orderDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{order.customerName}</div>
                  <div className="text-sm text-gray-500">{order.customerPhone}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {order.items.slice(0, 2).map((item, index) => (
                      <div key={index}>{item.name} x {item.quantity}</div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="text-gray-500">+{order.items.length - 2} more</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">${order.totalAmount.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.deliveryDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.deliveryAssociate ? (
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{order.deliveryAssociate.name}</div>
                      <div className="text-gray-500">{order.deliveryAssociate.phone}</div>
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
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowStatusForm(true);
                      }}
                      className="text-green-600 hover:text-green-900 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowAssignDialog(true);
                      }}
                      className="text-purple-600 hover:text-purple-900 transition-colors"
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

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No orders found matching your criteria.</p>
        </div>
      )}
    </div>
  );

  // Order Details Modal Component
  const OrderDetailsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">Order Details - {selectedOrder?.id}</h3>
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
                  <p><span className="font-medium">Name:</span> {selectedOrder?.customerName}</p>
                  <p><span className="font-medium">Phone:</span> {selectedOrder?.customerPhone}</p>
                  <p><span className="font-medium">Address:</span> {selectedOrder?.customerAddress}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  Order Information
                </h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Order Date:</span> {selectedOrder?.orderDate}</p>
                  <p><span className="font-medium">Delivery Date:</span> {selectedOrder?.deliveryDate}</p>
                  <p><span className="font-medium">Status:</span> 
                    <span className={`ml-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder?.status)}`}>
                      {getStatusIcon(selectedOrder?.status)}
                      {selectedOrder?.status.replace('_', ' ')}
                    </span>
                  </p>
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
                  {selectedOrder?.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.quantity} {item.unit}</p>
                      </div>
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                    <p className="font-bold">Total Amount:</p>
                    <p className="font-bold text-lg">${selectedOrder?.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-gray-600" />
                  Delivery Information
                </h4>
                <div className="space-y-2">
                  {selectedOrder?.deliveryAssociate ? (
                    <div>
                      <p><span className="font-medium">Assigned to:</span> {selectedOrder.deliveryAssociate.name}</p>
                      <p><span className="font-medium">Contact:</span> {selectedOrder.deliveryAssociate.phone}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">No delivery associate assigned</p>
                  )}
                  {selectedOrder?.specialInstructions && (
                    <div>
                      <p className="font-medium">Special Instructions:</p>
                      <p className="text-gray-700 bg-white p-2 rounded border">{selectedOrder.specialInstructions}</p>
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
            <p className="text-sm text-gray-600 mb-2">Order ID: <span className="font-medium">{selectedOrder?.id}</span></p>
            <p className="text-sm text-gray-600">Customer: <span className="font-medium">{selectedOrder?.customerName}</span></p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Status:</label>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder?.status)}`}>
                {getStatusIcon(selectedOrder?.status)}
                {selectedOrder?.status.replace('_', ' ')}
              </span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Update to:</label>
              <div className="space-y-2">
                {['pending', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateOrderStatus(selectedOrder?.id, status)}
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
            <p className="text-sm text-gray-600 mb-2">Order ID: <span className="font-medium">{selectedOrder?.id}</span></p>
            <p className="text-sm text-gray-600">Delivery Date: <span className="font-medium">{selectedOrder?.deliveryDate}</span></p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Available Associates:</h4>
            {deliveryAssociates.map((associate) => (
              <div
                key={associate.id}
                className={`p-3 rounded-lg border transition-colors ${
                  associate.available 
                    ? 'bg-white border-gray-200 hover:bg-gray-50 cursor-pointer' 
                    : 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60'
                }`}
                onClick={() => associate.available && assignDeliveryAssociate(selectedOrder?.id, associate)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{associate.name}</p>
                    <p className="text-sm text-gray-500">{associate.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      associate.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {associate.available ? 'Available' : 'Busy'}
                    </span>
                    {selectedOrder?.deliveryAssociate?.name === associate.name && (
                      <span className="text-blue-600 text-sm font-medium">Current</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Farm Ferry Dashboard</h1>
          <p className="text-gray-600">Manage orders, track deliveries, and coordinate with delivery associates</p>
        </div>
         */}
        <OrderListTable />
        
        {showOrderDetails && selectedOrder && <OrderDetailsModal />}
        {showStatusForm && selectedOrder && <OrderStatusUpdateForm />}
        {showAssignDialog && selectedOrder && <AssignDeliveryAssociateDialog />}
      </div>
    </div>
  );
};

export default OrderManagementDashboard;