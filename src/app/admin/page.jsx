
// "use client";
// import React, { useState, useEffect } from 'react';
// import {
//   TrendingUp,
//   TrendingDown,
//   IndianRupee,
//   ShoppingCart,
//   Users,
//   Package,
//   Eye,
//   Calendar,
//   BarChart2,
//   PieChart,
//   Zap,
//   RefreshCw,
//   AlertCircle,
//   Search
// } from 'lucide-react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   LineChart as RechartsLineChart,
//   Line,
//   PieChart as RechartsPieChart,
//   Pie,
//   Cell
// } from 'recharts';
// import { apiRequest } from '@/utils/api';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// const Dashboard = () => {
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedStatus, setSelectedStatus] = useState('all');
//   const [autoRefresh, setAutoRefresh] = useState(true);
//   const [activeChart, setActiveChart] = useState('sales');
//   const [hoveredCard, setHoveredCard] = useState(null);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [chartTransition, setChartTransition] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Backend data
//   const [stats, setStats] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [activities, setActivities] = useState([]);
//   const [chartData, setChartData] = useState([]);
//   const [pieData, setPieData] = useState([]);
//   const [topProducts, setTopProducts] = useState([]);

//   // Fetch dashboard data
//   const fetchDashboardData = async (timeRange = selectedTimeRange) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
//       // Dashboard stats
//       const statsRes = await apiRequest('/api/v1/admin/dashboard-stats', { token });
//       // Orders (recent)
//       const ordersRes = await apiRequest('/api/v1/orders?limit=10&sort=createdAt&order=desc', { token });
//       // Revenue analytics (for chart)
//       const revenueRes = await apiRequest(`/api/v1/admin/analytics/revenue?range=${timeRange}`, { token });
//       // Product analytics (for pie chart and top products)
//       const productRes = await apiRequest(`/api/v1/admin/analytics/products?range=${timeRange}`, { token });
//       // Customer analytics (for users chart)
//       const customerRes = await apiRequest(`/api/v1/admin/analytics/customers?range=${timeRange}`, { token });

//       // Stats cards mapping
//       setStats([
//         {
//           title: 'Total Revenue',
//           value: `₹${(statsRes.data.totalRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
//           change: statsRes.data.revenueChange || '+0%',
//           trend: statsRes.data.revenueChange && statsRes.data.revenueChange.startsWith('-') ? 'down' : 'up',
//           icon: IndianRupee,
//           color: 'green',
//         },
//         {
//           title: 'Total Orders',
//           value: (statsRes.data.totalOrders || 0).toLocaleString(),
//           change: statsRes.data.ordersChange || '+0%',
//           trend: statsRes.data.ordersChange && statsRes.data.ordersChange.startsWith('-') ? 'down' : 'up',
//           icon: ShoppingCart,
//           color: 'blue',
//         },
//         {
//           title: 'Total Customers',
//           value: (statsRes.data.totalCustomers || 0).toLocaleString(),
//           change: statsRes.data.customersChange || '+0%',
//           trend: statsRes.data.customersChange && statsRes.data.customersChange.startsWith('-') ? 'down' : 'up',
//           icon: Users,
//           color: 'purple',
//         },
//         {
//           title: 'Avg. Order Value',
//           value: `₹${(statsRes.data.avgOrderValue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
//           change: statsRes.data.avgOrderValueChange || '+0%',
//           trend: statsRes.data.avgOrderValueChange && statsRes.data.avgOrderValueChange.startsWith('-') ? 'down' : 'up',
//           icon: Package,
//           color: 'red',
//         },
//       ]);

//       // Orders mapping
//       setOrders((ordersRes.data.orders || []).map(order => ({
//         id: order._id,
//         customer: order.customerName || order.customer?.firstName || 'N/A',
//         items: order.items?.length || 0,
//         total: `₹${order.totalAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
//         status: order.status,
//         date: order.createdAt ? order.createdAt.split('T')[0] : '',
//       })));

//       // Activities (if backend provides, else derive from orders)
//       setActivities((ordersRes.data.orders || []).slice(0, 5).map((order, idx) => ({
//         id: idx + 1,
//         type: 'order',
//         user: order.customerName || order.customer?.firstName || 'N/A',
//         action: `placed a new order`,
//         time: new Date(order.createdAt).toLocaleString(),
//         icon: ShoppingCart,
//         color: 'blue',
//       })));

//       // Chart data
//       setChartData(revenueRes.data.chartData || []);
//       // Pie chart data (categories)
//       setPieData(productRes.data.categoryDistribution || []);
//       // Top products
//       setTopProducts(productRes.data.topProducts || []);
//       setLoading(false);
//     } catch (err) {
//       setError(err.message || 'Failed to load dashboard data');
//       setLoading(false);
//     }
//   };

//   // Initial and auto-refresh fetch
//   useEffect(() => {
//     fetchDashboardData(selectedTimeRange);
//     // eslint-disable-next-line
//   }, [selectedTimeRange]);

//   // Auto-refresh every 30s
//   useEffect(() => {
//     if (!autoRefresh) return;
//     const interval = setInterval(() => {
//       fetchDashboardData(selectedTimeRange);
//       setIsAnimating(true);
//       setTimeout(() => setIsAnimating(false), 300);
//     }, 30000);
//     return () => clearInterval(interval);
//     // eslint-disable-next-line
//   }, [autoRefresh, selectedTimeRange]);

//   // Update time every second
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // Handle time range change
//   const handleTimeRangeChange = (range) => {
//     setSelectedTimeRange(range);
//     setIsAnimating(true);
//     setChartTransition(true);
//     setTimeout(() => {
//       fetchDashboardData(range);
//       setIsAnimating(false);
//       setChartTransition(false);
//     }, 300);
//   };

//   // Filter orders based on search and status
//   const filteredOrders = orders.filter(order => {
//     const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.id.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
//     return matchesSearch && matchesStatus;
//   });

//   // Refresh data manually
//   const refreshData = () => {
//     setIsRefreshing(true);
//     setIsAnimating(true);
//     fetchDashboardData(selectedTimeRange).then(() => {
//       setIsAnimating(false);
//       setIsRefreshing(false);
//     });
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Delivered':
//         return 'bg-green-100 text-green-800 border-green-200';
//       case 'Processing':
//         return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'Shipped':
//         return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'Pending':
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   const renderChart = () => {
//     switch (activeChart) {
//       case 'sales':
//         return (
//           <div className={`transition-all duration-500 ${chartTransition ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="sales" fill="#8884d8" name="Sales" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         );
//       case 'users':
//         return (
//           <div className={`transition-all duration-500 ${chartTransition ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
//             <ResponsiveContainer width="100%" height={300}>
//               <RechartsLineChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="users" stroke="#82ca9d" name="Users" strokeWidth={3} />
//               </RechartsLineChart>
//             </ResponsiveContainer>
//           </div>
//         );
//       case 'revenue':
//         return (
//           <div className={`transition-all duration-500 ${chartTransition ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
//             <ResponsiveContainer width="100%" height={300}>
//               <RechartsLineChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="revenue" stroke="#ff7300" name="Revenue" strokeWidth={3} />
//               </RechartsLineChart>
//             </ResponsiveContainer>
//           </div>
//         );
//       case 'categories':
//         return (
//           <div className={`transition-all duration-500 ${chartTransition ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
//             <ResponsiveContainer width="100%" height={300}>
//               <RechartsPieChart>
//                 <Pie
//                   data={pieData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                   nameKey="name"
//                   label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                 >
//                   {pieData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </RechartsPieChart>
//             </ResponsiveContainer>
//           </div>
//         );
//       default:
//         return (
//           <div className={`transition-all duration-500 ${chartTransition ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="sales" fill="#8884d8" name="Sales" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         );
//     }
//   };

//   if (loading) return <div className="p-10 text-center text-lg text-gray-500">Loading dashboard...</div>;
//   if (error) return <div className="p-10 text-center text-lg text-red-500">{error}</div>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center animate-fadeIn">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
//           <p className="text-gray-600 mt-1">
//             Welcome back, Admin!
//           </p>
//         </div>
//         <div className="flex items-center space-x-3">
//           <button
//             onClick={() => setAutoRefresh(!autoRefresh)}
//             className={`px-4 py-2 rounded-lg border flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 ${
//               autoRefresh
//                 ? 'bg-green-100 border-green-300 text-green-700 shadow-lg shadow-green-100'
//                 : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
//             }`}
//           >
//             <Zap className={`w-4 h-4 transition-transform ${autoRefresh ? 'animate-pulse' : ''}`} />
//             <span className="text-sm font-medium">Auto-refresh</span>
//           </button>

//           <button
//             onClick={refreshData}
//             className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-110"
//           >
//             <RefreshCw className={`w-5 h-5 text-gray-600 transition-all duration-1000 ${
//               isRefreshing ? 'animate-spin text-blue-500' : ''
//             }`} />
//           </button>
//         </div>
//       </div>

//       {/* Time Range Selector */}
//       <div className="flex items-center space-x-4 animate-slideInUp">
//         <div className="flex items-center space-x-2">
//           <Calendar className="w-5 h-5 text-gray-600" />
//           <span className="text-sm text-gray-600 font-medium">Time Range:</span>
//         </div>
//         <div className="flex space-x-2">
//           {['1d', '7d', '30d', '90d'].map((range) => (
//             <button
//               key={range}
//               onClick={() => handleTimeRangeChange(range)}
//               className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
//                 selectedTimeRange === range
//                   ? 'bg-green-600 text-white shadow-lg shadow-green-200'
//                   : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
//               }`}
//             >
//               {range}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat, index) => (
//           <div
//             key={index}
//             onMouseEnter={() => setHoveredCard(index)}
//             onMouseLeave={() => setHoveredCard(null)}
//             className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-200 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${
//               isAnimating ? 'animate-pulse' : ''
//             } ${hoveredCard === index ? 'ring-2 ring-green-200 bg-gradient-to-br from-white to-gray-50' : ''}`}
//             style={{
//               animationDelay: `${index * 100}ms`
//             }}
//           >
//             <div className="flex items-center justify-between mb-4">
//               <div className={`p-3 rounded-xl transition-all duration-300 ${
//                 hoveredCard === index ? 'scale-110 shadow-lg' : ''
//               } ${stat.color === 'green' ? 'bg-green-100' :
//                  stat.color === 'blue' ? 'bg-blue-100' :
//                  stat.color === 'purple' ? 'bg-purple-100' : 'bg-red-100'}`}>
//                 <stat.icon className={`w-6 h-6 transition-all duration-300 ${
//                   stat.color === 'green' ? 'text-green-600' :
//                   stat.color === 'blue' ? 'text-blue-600' :
//                   stat.color === 'purple' ? 'text-purple-600' : 'text-red-600'
//                 } ${hoveredCard === index ? 'animate-pulse' : ''}`} />
//               </div>
//               <div className={`flex items-center space-x-1 text-sm transition-all duration-300 ${
//                 stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
//               } ${hoveredCard === index ? 'scale-110' : ''}`}>
//                 {stat.trend === 'up' ? (
//                   <TrendingUp className="w-4 h-4" />
//                 ) : (
//                   <TrendingDown className="w-4 h-4" />
//                 )}
//                 <span className="font-medium">{stat.change}</span>
//               </div>
//             </div>
//             <h3 className={`text-2xl font-bold text-gray-900 transition-all duration-300 ${
//               hoveredCard === index ? 'text-3xl' : ''
//             }`}>{stat.value}</h3>
//             <p className="text-gray-600 text-sm mt-1">{stat.title}</p>
//           </div>
//         ))}
//       </div>

//       {/* Charts Section */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="text-lg font-semibold text-gray-900">Analytics Overview</h3>
//           <div className="flex space-x-2">
//             {[
//               { key: 'sales', label: 'Sales', icon: BarChart2 },
//               { key: 'users', label: 'Users', icon: Users },
//               { key: 'revenue', label: 'Revenue', icon: IndianRupee },
//               { key: 'categories', label: 'Categories', icon: PieChart }
//             ].map((chart) => (
//               <button
//                 key={chart.key}
//                 onClick={() => setActiveChart(chart.key)}
//                 className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 ${
//                   activeChart === chart.key
//                     ? 'bg-blue-100 text-blue-700 shadow-lg shadow-blue-100'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 <chart.icon className="w-4 h-4" />
//                 <span>{chart.label}</span>
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="h-80">
//           {renderChart()}
//         </div>
//       </div>

//       {/* Recent Activity and Orders Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Recent Activity Feed */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
//           <div className="p-6 border-b border-gray-200">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
//               <button className="text-green-600 hover:text-green-700 text-sm font-medium transition-all duration-300 hover:scale-105">
//                 View all
//               </button>
//             </div>
//           </div>
//           <div className="p-6 space-y-4">
//             {activities.map((activity, index) => (
//               <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-102">
//                 <div className={`p-2 rounded-lg mt-1 transition-all duration-300 ${
//                   activity.color === 'blue' ? 'bg-blue-100 hover:bg-blue-200' :
//                   activity.color === 'purple' ? 'bg-purple-100 hover:bg-purple-200' :
//                   activity.color === 'green' ? 'bg-green-100 hover:bg-green-200' :
//                   'bg-red-100 hover:bg-red-200'
//                 }`}>
//                   <activity.icon className={`w-4 h-4 ${
//                     activity.color === 'blue' ? 'text-blue-600' :
//                     activity.color === 'purple' ? 'text-purple-600' :
//                     activity.color === 'green' ? 'text-green-600' :
//                     'text-red-600'
//                   }`} />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium text-gray-900">
//                     <span className="font-semibold">{activity.user}</span> {activity.action}
//                   </p>
//                   <div className="text-xs text-gray-500">
//                     <span>{activity.time}</span>
//                   </div>
//                 </div>
//                 <button className="text-gray-400 hover:text-gray-600 transition-all duration-300 transform hover:scale-110">
//                   <Eye className="w-4 h-4" />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Recent Orders */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//           <div className="p-6 border-b border-gray-200">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
//               <button className="text-green-600 hover:text-green-700 text-sm font-medium">
//                 View all
//               </button>
//             </div>

//             <div className="flex space-x-3">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input
//                   type="text"
//                   placeholder="Search orders..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 />
//               </div>
//               <select
//                 value={selectedStatus}
//                 onChange={(e) => setSelectedStatus(e.target.value)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               >
//                 <option value="all">All Status</option>
//                 <option value="Pending">Pending</option>
//                 <option value="Processing">Processing</option>
//                 <option value="Shipped">Shipped</option>
//                 <option value="Delivered">Delivered</option>
//               </select>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Order ID
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Customer
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Total
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredOrders.slice(0, 5).map((order, index) => (
//                   <tr key={index} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {order.id}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {order.customer}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {order.total}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
//                         {order.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {filteredOrders.length === 0 && (
//             <div className="p-6 text-center text-gray-500">
//               No orders found matching your criteria.
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Top Products */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex justify-between items-center">
//             <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
//             <button className="text-green-600 hover:text-green-700 text-sm font-medium">
//               View all
//             </button>
//           </div>
//         </div>
//         <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           {topProducts.map((product, index) => (
//             <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//               <div className="flex items-center space-x-4 mb-3">
//                 <img
//                   src={product.image}
//                   alt={product.name}
//                   className="w-12 h-12 rounded-lg object-cover"
//                 />
//                 <div>
//                   <h4 className="font-medium text-gray-900">{product.name}</h4>
//                   <p className="text-sm text-gray-600">{product.sales} sales</p>
//                 </div>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="font-semibold text-gray-900">{product.revenue}</span>
//                 {product.trend === 'up' ? (
//                   <TrendingUp className="w-5 h-5 text-green-500" />
//                 ) : (
//                   <TrendingDown className="w-5 h-5 text-red-500" />
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


"use client";
import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  ShoppingCart,
  Users,
  Package,
  Eye,
  Calendar,
  BarChart2,
  PieChart,
  Zap,
  RefreshCw,
  AlertCircle,
  Search,
  Menu
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
import { apiRequest } from '@/utils/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [activeChart, setActiveChart] = useState('sales');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chartTransition, setChartTransition] = useState(false);
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Backend data
  const [stats, setStats] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activities, setActivities] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  // Fetch dashboard data
  const fetchDashboardData = async (timeRange = selectedTimeRange) => {
    setLoading(true);
    setError(null);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      // Fetch all data in parallel
      const [
        statsRes,
        ordersRes,
        revenueRes,
        productRes,
        customerRes
      ] = await Promise.all([
        apiRequest('/api/v1/admin/dashboard-stats', { token }),
        apiRequest('/api/v1/orders?limit=10&sort=createdAt&order=desc', { token }),
        apiRequest(`/api/v1/admin/analytics/revenue?range=${timeRange}`, { token }),
        apiRequest(`/api/v1/admin/analytics/products?range=${timeRange}`, { token }),
        apiRequest(`/api/v1/admin/analytics/customers?range=${timeRange}`, { token }),
      ]);
      // Stats cards mapping
      setStats([
        {
          title: 'Total Revenue',
          value: `₹${(statsRes.data.totalRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          change: statsRes.data.revenueChange || '+0%',
          trend: statsRes.data.revenueChange && statsRes.data.revenueChange.startsWith('-') ? 'down' : 'up',
          icon: IndianRupee,
          color: 'green',
        },
        {
          title: 'Total Orders',
          value: (statsRes.data.totalOrders || 0).toLocaleString(),
          change: statsRes.data.ordersChange || '+0%',
          trend: statsRes.data.ordersChange && statsRes.data.ordersChange.startsWith('-') ? 'down' : 'up',
          icon: ShoppingCart,
          color: 'blue',
        },
        {
          title: 'Total Customers',
          value: (statsRes.data.totalCustomers || 0).toLocaleString(),
          change: statsRes.data.customersChange || '+0%',
          trend: statsRes.data.customersChange && statsRes.data.customersChange.startsWith('-') ? 'down' : 'up',
          icon: Users,
          color: 'purple',
        },
        {
          title: 'Avg. Order Value',
          value: `₹${(statsRes.data.avgOrderValue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          change: statsRes.data.avgOrderValueChange || '+0%',
          trend: statsRes.data.avgOrderValueChange && statsRes.data.avgOrderValueChange.startsWith('-') ? 'down' : 'up',
          icon: Package,
          color: 'red',
        },
      ]);

      // Orders mapping
      // console.log("Orders API response:", ordersRes.data.orders);
      // console.log("ordersRes:",ordersRes)
      // console.log(ordersRes.data.orders)
  //     setOrders((ordersRes.data.orders || []).map(order => ({
  // id: order._id,
  // customer: order.customer
  //   ? `${order.customer.firstName || ""} ${order.customer.lastName || ""}`.trim()
  //       || order.customer.phone
  //       || order.customer.email
  //       || "N/A"
  //   : "N/A",
  // customer: order.customer
  // ? `${order.customer.firstName || ""} ${order.customer.lastName || ""}`.trim() || "N/A"
  // : "N/A",
//   items: order.items?.length || 0,
//   total: `₹${order.totalAmount?.toLocaleString("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2
//   })}`,
//   status: order.status,
//   date: order.createdAt ? order.createdAt.split("T")[0] : ""
// })));

//       setOrders((ordersRes.data.orders || []).map(order => {
//   let customerName = 'N/A';

//   if (order.customer) {
//     // If firstName or lastName exist, use them
//     if (order.customer.firstName || order.customer.lastName) {
//       customerName = `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim();
//     } 
//     // Otherwise, fallback to phone
//     else if (order.customer.phone) {
//       customerName = order.customer.phone;
//     }
//   }

//   return {
//     id: order._id,
//     customer: customerName,
//     items: order.items?.length || 0,
//     total: `₹${order.totalAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
//     status: order.status,
//     date: order.createdAt ? order.createdAt.split('T')[0] : '',
//   };
// }));

      console.log("Orders API response:", ordersRes.data.orders);
      setOrders((ordersRes.data.orders || []).map(order => {
  let customerName = 'N/A';

  if (order.customer) {
    // ✅ Priority 1: firstName + lastName
    if (order.customer.firstName || order.customer.lastName) {
      customerName = `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim();
    } 
    // ✅ Priority 2: fallback to address name (first address only)
    else if (order.customer.addresses?.length > 0 && order.customer.addresses[0].name) {
      customerName = order.customer.addresses[0].name;
    }
    // ✅ Priority 3: fallback to phone
    else if (order.customer.phone) {
      customerName = order.customer.phone;
    }
  }
  console.log("order:",order)

  return {
    id: order.orderId ,
    customer: customerName,
    items: order.items?.length || 0,
    total: `₹${order.totalAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    status: order.status,
    date: order.createdAt ? order.createdAt.split('T')[0] : '',
  };
}));



      // Activities (if backend provides, else derive from orders)
      // setActivities((ordersRes.data.orders || []).slice(0, 5).map((order, idx) => ({
      //   id: idx + 1,
      //   type: 'order',
      //   user: order.customerName || order.customer?.firstName || 'N/A',
      //   action: `placed a new order`,
      //   time: new Date(order.createdAt).toLocaleString(),
      //   icon: ShoppingCart,
      //   color: 'blue',
      // })));

      // Activities (if backend provides, else derive from orders)
setActivities((ordersRes.data.orders || []).slice(0, 5).map((order, idx) => {
  let customerName = 'N/A';

  if (order.customerName) {
    customerName = order.customerName;
  } else if (order.customer?.firstName || order.customer?.lastName) {
    customerName = `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim();
  } else if (order.customer?.addresses?.length > 0 && order.customer.addresses[0].name) {
    customerName = order.customer.addresses[0].name;
  } else if (order.customer?.phone) {
    customerName = order.customer.phone;
  }

  return {
    id: idx + 1,
    type: 'order',
    user: customerName,
    action: `placed a new order`,
    time: new Date(order.createdAt).toLocaleString(),
    icon: ShoppingCart,
    color: 'blue',
  };
}));


      // Chart data
      setChartData(revenueRes.data.chartData || []);
      // Pie chart data (categories)
      setPieData(productRes.data.categoryDistribution || []);
      // Top products
      setTopProducts(productRes.data.topProducts || []);
      setLoading(false);
      setFirstLoad(false);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      setLoading(false);
      setFirstLoad(false);
    }
  };
  // console.log("fetchDashboardData:",fetchDashboardData)

  // Initial and auto-refresh fetch
  useEffect(() => {
    fetchDashboardData(selectedTimeRange);
    // eslint-disable-next-line
  }, [selectedTimeRange]);

  // Auto-refresh every 30s
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchDashboardData(selectedTimeRange);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [autoRefresh, selectedTimeRange]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle time range change
  const handleTimeRangeChange = (range) => {
    setSelectedTimeRange(range);
    setIsAnimating(true);
    setChartTransition(true);
    setTimeout(() => {
      fetchDashboardData(range);
      setIsAnimating(false);
      setChartTransition(false);
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
    setIsRefreshing(true);
    setIsAnimating(true);
    fetchDashboardData(selectedTimeRange).then(() => {
      setIsAnimating(false);
      setIsRefreshing(false);
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderChart = () => {
    switch (activeChart) {
      case 'sales':
        return (
          <div className={`transition-all duration-500 ${chartTransition ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
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
          </div>
        );
      case 'users':
        return (
          <div className={`transition-all duration-500 ${chartTransition ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#82ca9d" name="Users" strokeWidth={3} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        );
      case 'revenue':
        return (
          <div className={`transition-all duration-500 ${chartTransition ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#ff7300" name="Revenue" strokeWidth={3} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        );
      case 'categories':
        return (
          <div className={`transition-all duration-500 ${chartTransition ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
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
          </div>
        );
      default:
        return (
          <div className={`transition-all duration-500 ${chartTransition ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
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
          </div>
        );
    }
  };

  if (firstLoad && loading) return <div className="p-10 text-center text-lg text-gray-500">Loading dashboard...</div>;
  if (error) return <div className="p-10 text-center text-lg text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fadeIn">
        <div className="flex justify-between items-center w-full sm:w-auto">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Welcome back, Admin! • {currentTime.toLocaleTimeString()}
            </p>
          </div>
          <button 
            className="sm:hidden p-2 rounded-lg bg-gray-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
        <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto`}>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`w-full sm:w-auto px-4 py-2 rounded-lg border flex items-center justify-center sm:justify-start space-x-2 transition-all duration-300 ${
              autoRefresh
                ? 'bg-green-100 border-green-300 text-green-700 shadow-lg shadow-green-100'
                : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Zap className={`w-4 h-4 transition-transform ${autoRefresh ? 'animate-pulse' : ''}`} />
            <span className="text-sm font-medium">Auto-refresh</span>
          </button>

          <button
            onClick={refreshData}
            className="w-full sm:w-auto p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 transition-all duration-1000 ${
              isRefreshing ? 'animate-spin text-blue-500' : ''
            }`} />
            <span className="ml-2 sm:hidden">Refresh</span>
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 animate-slideInUp">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-600" />
          <span className="text-sm text-gray-600 font-medium">Time Range:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {['1d', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => handleTimeRangeChange(range)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                selectedTimeRange === range
                  ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
            className={`bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 transform transition-all duration-300 hover:shadow-md ${
              isAnimating ? 'animate-pulse' : ''
            } ${hoveredCard === index ? 'ring-2 ring-green-200 bg-gradient-to-br from-white to-gray-50' : ''}`}
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-lg transition-all duration-300 ${
                hoveredCard === index ? 'scale-110 shadow-md' : ''
              } ${stat.color === 'green' ? 'bg-green-100' :
                 stat.color === 'blue' ? 'bg-blue-100' :
                 stat.color === 'purple' ? 'bg-purple-100' : 'bg-red-100'}`}>
                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${
                  stat.color === 'green' ? 'text-green-600' :
                  stat.color === 'blue' ? 'text-blue-600' :
                  stat.color === 'purple' ? 'text-purple-600' : 'text-red-600'
                } ${hoveredCard === index ? 'animate-pulse' : ''}`} />
              </div>
              <div className={`flex items-center space-x-1 text-xs sm:text-sm transition-all duration-300 ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              } ${hoveredCard === index ? 'scale-110' : ''}`}>
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                ) : (
                  <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                <span className="font-medium">{stat.change}</span>
              </div>
            </div>
            <h3 className={`text-xl sm:text-2xl font-bold text-gray-900 transition-all duration-300 ${
              hoveredCard === index ? 'text-2xl sm:text-3xl' : ''
            }`}>{stat.value}</h3>
            <p className="text-gray-600 text-xs sm:text-sm mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
          <h3 className="text-lg font-semibold text-gray-900">Analytics Overview</h3>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto ">
            {[
              { key: 'sales', label: 'Sales', icon: BarChart2 },
              { key: 'users', label: 'Users', icon: Users },
              { key: 'revenue', label: 'Revenue', icon: IndianRupee },
              { key: 'categories', label: 'Categories', icon: PieChart }
            ].map((chart) => (
              <button
                key={chart.key}
                onClick={() => setActiveChart(chart.key)}
                className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center space-x-1 sm:space-x-2 transition-all duration-300 ${
                  activeChart === chart.key
                    ? 'bg-blue-100 text-blue-700 shadow-md shadow-blue-100'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <chart.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{chart.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 sm:h-80 ">
          {renderChart()}
        </div>
      </div>

      {/* Recent Activity and Orders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Activity Feed */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium transition-all duration-300">
                View all
              </button>
            </div>
          </div>
          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex items-start space-x-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-all duration-300">
                <div className={`p-1 sm:p-2 rounded-lg mt-1 transition-all duration-300 ${
                  activity.color === 'blue' ? 'bg-blue-100 hover:bg-blue-200' :
                  activity.color === 'purple' ? 'bg-purple-100 hover:bg-purple-200' :
                  activity.color === 'green' ? 'bg-green-100 hover:bg-green-200' :
                  'bg-red-100 hover:bg-red-200'
                }`}>
                  <activity.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${
                    activity.color === 'blue' ? 'text-blue-600' :
                    activity.color === 'purple' ? 'text-purple-600' :
                    activity.color === 'green' ? 'text-green-600' :
                    'text-red-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                    <span className="font-semibold">{activity.user}</span> {activity.action}
                  </p>
                  <div className="text-xs text-gray-500 truncate">
                    <span>{activity.time}</span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-all duration-300">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                View all
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.slice(0, 5).map((order, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[100px] sm:max-w-none">
                      {order.id}
                    </td>
                    <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 truncate max-w-[80px] sm:max-w-none">
                      {order.customer}
                    </td>
                    <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {order.total}
                    </td>
                    <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
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
            <div className="p-4 sm:p-6 text-center text-xs sm:text-sm text-gray-500">
              No orders found matching your criteria.
            </div>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium">
              View all
            </button>
          </div>
        </div>
        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {topProducts.map((product, index) => (
            <div key={index} className="p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3 mb-2 sm:mb-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                />
                <div className="min-w-0">
                  <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">{product.name}</h4>
                  <p className="text-xs text-gray-600">{product.sales} sales</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm font-semibold text-gray-900">{product.revenue}</span>
                {product.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
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