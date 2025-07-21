"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { Download, TrendingUp, Users, ShoppingCart, DollarSign, Calendar, Filter, RefreshCw } from 'lucide-react';
import {
  getAdminDashboardStats,
  getAdminRevenueAnalytics,
  getAdminProductAnalytics,
  getAdminCustomerAnalytics
} from '@/utils/api';

const pieColors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

const ReportsDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to get date range from selectedTimeRange
  const getDateRange = () => {
    const now = new Date();
    let startDate, endDate;
    endDate = now.toISOString().slice(0, 10);
    if (selectedTimeRange === '7d') {
      const d = new Date(now); d.setDate(d.getDate() - 6);
      startDate = d.toISOString().slice(0, 10);
    } else if (selectedTimeRange === '30d') {
      const d = new Date(now); d.setDate(d.getDate() - 29);
      startDate = d.toISOString().slice(0, 10);
    } else if (selectedTimeRange === '90d') {
      const d = new Date(now); d.setDate(d.getDate() - 89);
      startDate = d.toISOString().slice(0, 10);
    } else if (selectedTimeRange === '1y') {
      const d = new Date(now); d.setFullYear(d.getFullYear() - 1);
      startDate = d.toISOString().slice(0, 10);
    } else {
      startDate = endDate;
    }
    return { startDate, endDate };
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const { startDate, endDate } = getDateRange();
        const [dashboardRes, revenueRes, productRes, customerRes] = await Promise.all([
          getAdminDashboardStats(token),
          getAdminRevenueAnalytics({ startDate, endDate }, token),
          getAdminProductAnalytics({ startDate, endDate }, token),
          getAdminCustomerAnalytics({ startDate, endDate }, token)
        ]);
        setDashboard(dashboardRes.data);
        setRevenueData(revenueRes.data || []);
        setProductData(productRes.data || []);
        setCustomerData(customerRes.data || []);
        // Log the raw data for debugging
        console.log('dashboard:', dashboardRes.data);
        console.log('revenueData:', revenueRes.data);
        console.log('productData:', productRes.data);
        console.log('customerData:', customerRes.data);
      } catch (err) {
        setError(err.message || 'Failed to load analytics data');
      }
      setLoading(false);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTimeRange, selectedCategory]);

  // Mock export function (replace with real export logic if needed)
  const handleExport = async (type) => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate export process
    setIsExporting(false);
    alert(`${type} report exported successfully!`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading analytics...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  // Defensive: always use an array for chart data
  const revenueArray = revenueData && revenueData.analytics && Array.isArray(revenueData.analytics.timeseries)
    ? revenueData.analytics.timeseries
    : [];

  const productArray = productData && Array.isArray(productData.topSellingProducts)
    ? productData.topSellingProducts
    : [];

  const customerArray = customerData && Array.isArray(customerData.newCustomers)
    ? customerData.newCustomers
    : [];

  // Sales & Revenue Trends
  const salesChartData = (revenueData?.analytics?.timeseries || []).map(item => ({
    month: item.month || item.label || '',
    revenue: item.revenue || 0,
    sales: item.sales || 0,
    profit: item.profit || 0
  }));

  // Order Trends by Category & Sales Distribution
  const orderTrendsData = (productData?.topCategories || []).map(item => ({
    category: item.categoryName || item.name || '',
    orders: item.orders || 0,
    value: item.sales || 0
  }));

  const productChartData = productArray.map(item => ({
    product: item.productName || item.name || '',
    sales: item.sales || 0,
    orders: item.orders || 0
  }));

  const userGrowthChartData = customerArray.map(item => ({
    month: item.month || item.label || '',
    newUsers: item.count || 0
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into your farm marketplace performance</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <select 
                  value={selectedTimeRange} 
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {/* You can dynamically populate categories here if needed */}
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="grains">Grains</option>
                  <option value="dairy">Dairy</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleExport('PDF')}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                {isExporting ? 'Exporting...' : 'Export PDF'}
              </button>
              <button 
                onClick={() => handleExport('Excel')}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Excel
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Sales</p>
                <p className="text-2xl font-bold text-gray-800">₹{dashboard?.revenue?.total?.toLocaleString() || 0}</p>
                {/* You can add growth info if available */}
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-gray-800">{dashboard?.customers?.total?.toLocaleString() || 0}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800">{dashboard?.orders?.total?.toLocaleString() || 0}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <ShoppingCart className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">New Customers</p>
                <p className="text-2xl font-bold text-gray-800">{dashboard?.customers?.new?.toLocaleString() || 0}</p>
                <p className="text-purple-600 text-sm mt-1">New signups</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Report Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Sales & Revenue Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                <Area type="monotone" dataKey="profit" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* User Growth Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">User Growth Analytics</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="newUsers" stroke="#F59E0B" strokeWidth={3} />
                <Line type="monotone" dataKey="activeUsers" stroke="#10B981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Bottom Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Trends Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Trends by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Category Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Sales Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderTrendsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  nameKey="category"
                  label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                >
                  {orderTrendsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Export Status */}
        {isExporting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="text-gray-700">Generating report...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsDashboard;