"use client";
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  IndianRupee, 
  DollarSign,
  ShoppingCart, 
  Users, 
  Package,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Download,
  Search,
  Calendar,
  BarChart2,
  LineChart,
  PieChart,
  Zap,
  Bell,
  RefreshCw,
  Activity,
  Clock,
  AlertCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [notifications, setNotifications] = useState(3);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [activeChart, setActiveChart] = useState('sales');

  // Dynamic stats that change based on time range
  const getStatsForTimeRange = (timeRange) => {
    const multipliers = {
      '1d': 0.1,
      '7d': 1,
      '30d': 4.2,
      '90d': 12.5
    };
    const mult = multipliers[timeRange] || 1;
    const formatRupee = (amount) => {
      return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };
    return [
      {
        title: 'Total Revenue',
        value: formatRupee(45231.89 * mult),
        change: `+${(20.1 + Math.random() * 5).toFixed(1)}%`,
        trend: 'up',
        icon: IndianRupee,
        color: 'green'
      },
      {
        title: 'Total Orders',
        value: Math.floor(1234 * mult).toLocaleString(),
        change: `+${(12.5 + Math.random() * 8).toFixed(1)}%`,
        trend: 'up',
        icon: ShoppingCart,
        color: 'blue'
      },
      {
        title: 'Total Customers',
        value: Math.floor(573 * mult).toLocaleString(),
        change: `+${(8.2 + Math.random() * 4).toFixed(1)}%`,
        trend: 'up',
        icon: Users,
        color: 'purple'
      },
      {
        title: 'Avg. Order Value',
        value: formatRupee(3675 * mult / 100),
        change: `${Math.random() > 0.3 ? '+' : '-'}${(2.1 + Math.random() * 3).toFixed(1)}%`,
        trend: Math.random() > 0.3 ? 'up' : 'down',
        icon: Package,
        color: 'red'
      }
    ];
  };

  const [stats, setStats] = useState(getStatsForTimeRange('7d'));

  // Dynamic orders data
  const [orders, setOrders] = useState([
    {
      id: '#12345',
      customer: 'John Smith',
      items: 3,
      total: '₹3,499.00',
      status: 'Delivered',
      date: '2025-01-15'
    },
    {
      id: '#12346',
      customer: 'Sarah Johnson',
      items: 5,
      total: '₹5,850.00',
      status: 'Processing',
      date: '2025-01-15'
    },
    {
      id: '#12347',
      customer: 'Mike Davis',
      items: 2,
      total: '₹2,225.00',
      status: 'Shipped',
      date: '2025-01-14'
    },
    {
      id: '#12348',
      customer: 'Emma Wilson',
      items: 7,
      total: '₹9,575.00',
      status: 'Pending',
      date: '2025-01-14'
    },
    {
      id: '#12349',
      customer: 'Alex Brown',
      items: 4,
      total: '₹6,730.00',
      status: 'Processing',
      date: '2025-01-13'
    },
    {
      id: '#12350',
      customer: 'Lisa Garcia',
      items: 6,
      total: '₹12,345.00',
      status: 'Delivered',
      date: '2025-01-13'
    }
  ]);

  // Recent activity feed
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'order',
      user: 'John Smith',
      action: 'placed a new order',
      time: '2 minutes ago',
      icon: ShoppingCart,
      color: 'blue'
    },
    {
      id: 2,
      type: 'user',
      user: 'Sarah Johnson',
      action: 'created an account',
      time: '15 minutes ago',
      icon: Users,
      color: 'purple'
    },
    {
      id: 3,
      type: 'payment',
      user: 'Mike Davis',
      action: 'completed payment',
      time: '1 hour ago',
      icon: IndianRupee,
      color: 'green'
    },
    {
      id: 4,
      type: 'issue',
      user: 'Emma Wilson',
      action: 'reported an issue',
      time: '3 hours ago',
      icon: AlertCircle,
      color: 'red'
    },
    {
      id: 5,
      type: 'order',
      user: 'Alex Brown',
      action: 'cancelled an order',
      time: '5 hours ago',
      icon: ShoppingCart,
      color: 'blue'
    }
  ]);

  // Chart data
  const getChartData = (timeRange) => {
    const baseData = {
      '1d': [
        { name: '00:00', sales: 400, users: 100 },
        { name: '04:00', sales: 300, users: 120 },
        { name: '08:00', sales: 600, users: 180 },
        { name: '12:00', sales: 800, users: 220 },
        { name: '16:00', sales: 500, users: 150 },
        { name: '20:00', sales: 900, users: 250 },
        { name: '24:00', sales: 700, users: 200 }
      ],
      '7d': [
        { name: 'Mon', sales: 400, users: 100, revenue: 2400 },
        { name: 'Tue', sales: 300, users: 120, revenue: 1398 },
        { name: 'Wed', sales: 600, users: 180, revenue: 9800 },
        { name: 'Thu', sales: 800, users: 220, revenue: 3908 },
        { name: 'Fri', sales: 500, users: 150, revenue: 4800 },
        { name: 'Sat', sales: 900, users: 250, revenue: 6800 },
        { name: 'Sun', sales: 700, users: 200, revenue: 4300 }
      ],
      '30d': [
        { name: 'Week 1', sales: 4000, users: 1000, revenue: 24000 },
        { name: 'Week 2', sales: 3000, users: 1200, revenue: 13980 },
        { name: 'Week 3', sales: 6000, users: 1800, revenue: 98000 },
        { name: 'Week 4', sales: 8000, users: 2200, revenue: 39080 }
      ],
      '90d': [
        { name: 'Month 1', sales: 12000, users: 3000, revenue: 72000 },
        { name: 'Month 2', sales: 9000, users: 3600, revenue: 41940 },
        { name: 'Month 3', sales: 18000, users: 5400, revenue: 294000 }
      ]
    };
    
    return baseData[timeRange] || baseData['7d'];
  };

  const [chartData, setChartData] = useState(getChartData('7d'));

  // Pie chart data
  const pieData = [
    { name: 'Vegetables', value: 400 },
    { name: 'Fruits', value: 300 },
    { name: 'Dairy', value: 200 },
    { name: 'Grains', value: 100 }
  ];

  // Top products
  const topProducts = [
    {
      name: 'Organic Tomatoes',
      sales: 245,
      revenue: '₹1,225.00',
      image: 'https://media.istockphoto.com/id/171579643/photo/tomato-greenhouse.jpg?s=1024x1024&w=is&k=20&c=kFi-7YRjDfBTcPgSkCdppZVznCUHEfrU_mvjZii5UhI=',
      trend: 'up'
    },
    {
      name: 'Fresh Spinach',
      sales: 198,
      revenue: '₹890.00',
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=100&h=100&fit=crop',
      trend: 'up'
    },
    {
      name: 'Organic Carrots',
      sales: 167,
      revenue: '₹645.50',
      image: 'https://media.istockphoto.com/id/2150710300/photo/overhead-view-of-freshly-sliced-organic-carrots-on-cutting-board.jpg?s=1024x1024&w=is&k=20&c=GPV2v952n2_U5LjF3CyZGJRIkE3CVQhxK_b_3gGzQgI=',
      trend: 'down'
    },
    {
      name: 'Bell Peppers',
      sales: 134,
      revenue: '₹534.00',
      image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=100&h=100&fit=crop',
      trend: 'up'
    }
  ];

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      setStats(getStatsForTimeRange(selectedTimeRange));
      setChartData(getChartData(selectedTimeRange));
      setNotifications(prev => prev + Math.floor(Math.random() * 2));
    }, 30000);
    
    return () => clearInterval(interval);
  }, [autoRefresh, selectedTimeRange]);

  // Handle time range change
  const handleTimeRangeChange = (range) => {
    setSelectedTimeRange(range);
    setIsAnimating(true);
    setTimeout(() => {
      setStats(getStatsForTimeRange(range));
      setChartData(getChartData(range));
      setIsAnimating(false);
    }, 300);
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Refresh data manually
  const refreshData = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setStats(getStatsForTimeRange(selectedTimeRange));
      setChartData(getChartData(selectedTimeRange));
      setIsAnimating(false);
    }, 500);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const deleteOrder = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  const renderChart = () => {
    switch (activeChart) {
      case 'sales':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" name="Sales" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'users':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#82ca9d" name="Users" />
            </RechartsLineChart>
          </ResponsiveContainer>
        );
      case 'revenue':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#ff7300" name="Revenue" />
            </RechartsLineChart>
          </ResponsiveContainer>
        );
      case 'categories':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" name="Sales" />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, Admin! {currentTime.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 rounded-lg border flex items-center space-x-2 ${
              autoRefresh ? 'bg-green-100 border-green-300 text-green-700' : 'bg-gray-100 border-gray-300 text-gray-700'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span className="text-sm">Auto-refresh</span>
          </button>
          
          <div className="relative">
            <button className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            {notifications > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </div>
          
          <button
            onClick={refreshData}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${isAnimating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-600" />
          <span className="text-sm text-gray-600">Time Range:</span>
        </div>
        <div className="flex space-x-2">
          {['1d', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => handleTimeRangeChange(range)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedTimeRange === range
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-md ${
              isAnimating ? 'animate-pulse' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="font-medium">{stat.change}</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Analytics Overview</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveChart('sales')}
              className={`px-3 py-1 rounded-lg text-sm font-medium flex items-center space-x-1 ${
                activeChart === 'sales' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Sales</span>
            </button>
            <button
              onClick={() => setActiveChart('users')}
              className={`px-3 py-1 rounded-lg text-sm font-medium flex items-center space-x-1 ${
                activeChart === 'users' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Users</span>
            </button>
            <button
              onClick={() => setActiveChart('revenue')}
              className={`px-3 py-1 rounded-lg text-sm font-medium flex items-center space-x-1 ${
                activeChart === 'revenue' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <IndianRupee className="w-4 h-4" />
              <span>Revenue</span>
            </button>
            <button
              onClick={() => setActiveChart('categories')}
              className={`px-3 py-1 rounded-lg text-sm font-medium flex items-center space-x-1 ${
                activeChart === 'categories' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <PieChart className="w-4 h-4" />
              <span>Categories</span>
            </button>
          </div>
        </div>
        
        <div className="h-80">
          {renderChart()}
        </div>
      </div>

      {/* Recent Activity and Orders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Feed */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                View all
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-${activity.color}-100 mt-1`}>
                  <activity.icon className={`w-4 h-4 text-${activity.color}-600`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    <span className="font-semibold">{activity.user}</span> {activity.action}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{activity.time}</span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                View all
              </button>
            </div>
            
            <div className="flex space-x-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.slice(0, 5).map((order, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No orders found matching your criteria.
            </div>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium">
              View all
            </button>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topProducts.map((product, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4 mb-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.sales} sales</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">{product.revenue}</span>
                {product.trend === 'up' ? (
                  <TrendingUp className="w-5 h-5 text-green-500" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;