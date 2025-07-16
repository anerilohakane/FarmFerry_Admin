"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { Download, TrendingUp, Users, ShoppingCart, DollarSign, Calendar, Filter, RefreshCw } from 'lucide-react';

const ReportsDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  
  // Sample data for charts
  const salesData = [
    { month: 'Jan', sales: 12000, orders: 145, profit: 8500 },
    { month: 'Feb', sales: 15000, orders: 180, profit: 10500 },
    { month: 'Mar', sales: 18000, orders: 220, profit: 12800 },
    { month: 'Apr', sales: 22000, orders: 280, profit: 15200 },
    { month: 'May', sales: 25000, orders: 320, profit: 17500 },
    { month: 'Jun', sales: 28000, orders: 380, profit: 19600 },
    { month: 'Jul', sales: 32000, orders: 420, profit: 22400 }
  ];

  const userGrowthData = [
    { month: 'Jan', newUsers: 150, activeUsers: 1200, retention: 85 },
    { month: 'Feb', newUsers: 200, activeUsers: 1350, retention: 88 },
    { month: 'Mar', newUsers: 250, activeUsers: 1520, retention: 90 },
    { month: 'Apr', newUsers: 300, activeUsers: 1750, retention: 92 },
    { month: 'May', newUsers: 280, activeUsers: 1980, retention: 89 },
    { month: 'Jun', newUsers: 320, activeUsers: 2200, retention: 91 },
    { month: 'Jul', newUsers: 380, activeUsers: 2450, retention: 93 }
  ];

  const orderTrendsData = [
    { category: 'Vegetables', orders: 245, value: 12500 },
    { category: 'Fruits', orders: 180, value: 9800 },
    { category: 'Grains', orders: 120, value: 8200 },
    { category: 'Dairy', orders: 95, value: 6500 },
    { category: 'Herbs', orders: 75, value: 4200 }
  ];

  const pieColors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Mock export function
  const handleExport = async (type) => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate export process
    setIsExporting(false);
    alert(`${type} report exported successfully!`);
  };

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
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
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
                <p className="text-2xl font-bold text-gray-800">$32,000</p>
                <p className="text-green-600 text-sm mt-1">+12% from last month</p>
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
                <p className="text-2xl font-bold text-gray-800">2,450</p>
                <p className="text-blue-600 text-sm mt-1">+8% from last month</p>
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
                <p className="text-2xl font-bold text-gray-800">420</p>
                <p className="text-yellow-600 text-sm mt-1">+15% from last month</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <ShoppingCart className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Growth Rate</p>
                <p className="text-2xl font-bold text-gray-800">93%</p>
                <p className="text-purple-600 text-sm mt-1">User retention</p>
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
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                <Area type="monotone" dataKey="profit" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* User Growth Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">User Growth Analytics</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
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