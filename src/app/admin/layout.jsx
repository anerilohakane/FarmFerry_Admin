"use client";
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  Settings, 
  Bell, 
  Search, 
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  Moon,
  Sun,
  Maximize2,
  Minimize2,
  HelpCircle,
  TrendingUp,
  Truck,
  ClipboardList,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(12);
  const router = useRouter();

  // Enhanced sidebar items with better organization
  const sidebarItems = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      active: activeItem === 'Dashboard',
      description: 'Overview & Analytics',
      route: '/admin'
    },
    { 
      icon: Users, 
      label: 'User Management',
      active: activeItem === 'User Management',
      description: 'Customers & Admins',
      route: '/admin/user-management'
    },
    { 
      icon: Truck, 
      label: 'Supplier Management',
      active: activeItem === 'Supplier Management',
      description: 'Manage suppliers',
      route: '/admin/supplier-management'
    },
    { 
      icon: Truck, 
      label: 'Delivery Associates',
      active: activeItem === 'Delivery Associates',
      description: 'Manage delivery team',
      route: '/admin/delivery-associatemanagement'
    },
    { 
      icon: Package, 
      label: 'Product Management',
      active: activeItem === 'Product Management',
      description: 'Inventory & products',
      route: '/admin/product-management'
    },
    { 
      icon: ClipboardList, 
      label: 'Category Management',
      active: activeItem === 'Category Management',
      description: 'Product categories',
      route: '/admin/category-management'
    },
    { 
      icon: ShoppingCart, 
      label: 'Order Management', 
      active: activeItem === 'Order Management',
      description: 'Process orders',
      route: '/admin/order-management'
    },
    { 
      icon: BarChart3, 
      label: 'Reports & Analytics',
      active: activeItem === 'Reports & Analytics',
      description: 'Sales & Performance',
      route: '/admin/reports-analytics'
    },
    { 
      icon: Settings, 
      label: 'Settings',
      active: activeItem === 'Settings',
      description: 'System configuration',
      route: '/admin/settings'
    },
  ];

  // Enhanced notifications with better structure
  const initialNotifications = [
    {
      id: 1,
      type: 'order',
      title: 'New Order Received',
      message: 'Order #12349 from Sarah Johnson',
      time: '2 minutes ago',
      unread: true,
      icon: ShoppingCart,
      color: 'blue'
    },
    {
      id: 2,
      type: 'user',
      title: 'New Customer Registered',
      message: 'Michael Brown joined Farm Ferry',
      time: '5 minutes ago',
      unread: true,
      icon: Users,
      color: 'green'
    },
    {
      id: 3,
      type: 'alert',
      title: 'System Alert',
      message: 'Dashboard updated successfully',
      time: '1 hour ago',
      unread: false,
      icon: AlertCircle,
      color: 'red'
    }
  ];

  // Initialize notifications
  useEffect(() => {
    setNotifications(initialNotifications);
  }, []);

  // Enhanced auth protection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/loginpage');
      }
    }
  }, [router]);

  // Enhanced fullscreen handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.log('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.log('Error attempting to exit fullscreen:', err);
      });
    }
  };

  // Enhanced notification management
  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, unread: false } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, unread: false }))
    );
  };

  // Enhanced navigation handler
  const handleItemClick = (item) => {
    setActiveItem(item.label);
    setSidebarOpen(false);
    if (item.route) {
      router.push(item.route);
    }
  };

  // Enhanced logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.replace('/loginpage');
  };

  // Enhanced search handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      // Implement search functionality here
      console.log('Searching for:', searchValue);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileOpen && !event.target.closest('.profile-dropdown')) {
        setProfileOpen(false);
      }
      if (notificationOpen && !event.target.closest('.notification-dropdown')) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen, notificationOpen]);

  return (
    <div className={`flex h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Enhanced Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 ${sidebarCollapsed ? 'w-16' : 'w-64'} ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}>
        
        {/* Sidebar Header */}
        <div className={`flex-shrink-0 flex items-center justify-between h-16 px-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} transition-opacity duration-300`}>
                Farm Ferry Admin
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`hidden lg:block p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'text-gray-600'} transition-colors`}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className={`lg:hidden p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'text-gray-600'} transition-colors`}
              title="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Online Status */}
        {!sidebarCollapsed && (
          <div className={`flex-shrink-0 px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {onlineUsers} users online
              </span>
            </div>
          </div>
        )}
        
        {/* Enhanced Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-4 space-y-1">
            {sidebarItems.map((item, index) => (
              <div key={index} className="relative group">
                <button
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    item.active 
                      ? `${darkMode ? 'bg-green-900 text-green-400' : 'bg-green-50 text-green-700'} border-r-4 border-green-500 shadow-sm` 
                      : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'} hover:text-gray-900 hover:shadow-sm`
                  } ${sidebarCollapsed ? 'justify-center' : ''}`}
                  title={sidebarCollapsed ? item.label : ''}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <item.icon className={`w-5 h-5 flex-shrink-0 ${item.active ? 'animate-pulse' : ''}`} />
                    {!sidebarCollapsed && (
                      <div className="flex-1 text-left">
                        <span className="font-medium block">{item.label}</span>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                          {item.description}
                        </p>
                      </div>
                    )}
                  </div>
                </button>
                
                {/* Enhanced Tooltip for collapsed sidebar */}
                {sidebarCollapsed && (
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-300">{item.description}</div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Enhanced Sidebar Footer */}
        {!sidebarCollapsed && (
          <div className={`flex-shrink-0 p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center`}>
              © {new Date().getFullYear()} Farm Ferry Admin
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Navbar */}
        <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b h-16`}>
          <div className="flex items-center justify-between px-6 h-full">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className={`lg:hidden p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'text-gray-600'} transition-colors`}
                title="Open sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Enhanced Search */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className={`flex items-center ${searchFocused ? 'w-80' : 'w-64'} transition-all duration-300`}>
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    placeholder="Search dashboard..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className={`w-full pl-10 pr-4 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-100 border-gray-200 placeholder-gray-500'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                  />
                  {searchValue && (
                    <button
                      type="button"
                      onClick={() => setSearchValue('')}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
                      title="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="flex items-center space-x-3">
              {/* Enhanced Quick Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleFullscreen}
                  className={`p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'text-gray-600'} transition-colors`}
                  title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'text-gray-600'} transition-colors`}
                  title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>

              {/* Enhanced Notifications */}
              <div className="relative notification-dropdown">
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className={`relative p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'text-gray-600'} transition-colors`}
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse font-medium">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationOpen && (
                  <div className={`absolute right-0 mt-2 w-80 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-lg z-50`}>
                    <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Notifications
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {unreadCount} new
                        </span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-colors`}
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={`px-4 py-3 hover:bg-gray-50 ${darkMode ? 'hover:bg-gray-700' : ''} cursor-pointer border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'} last:border-b-0 transition-colors`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg bg-${notification.color}-100 ${darkMode ? 'bg-opacity-20' : ''}`}>
                              <notification.icon className={`w-4 h-4 text-${notification.color}-600`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                                  {notification.title}
                                </h4>
                                {notification.unread && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                )}
                              </div>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                                {notification.message}
                              </p>
                              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Profile Dropdown */}
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''} transition-colors`}
                  title="Profile menu"
                >
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Profile"
                    className="w-8 h-8 rounded-full ring-2 ring-green-500 ring-offset-2 object-cover"
                  />
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} hidden md:block`}>
                    Admin
                  </span>
                  <ChevronDown className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'} transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <div className={`absolute right-0 mt-2 w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-lg z-50`}>
                    <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex items-center space-x-3">
                        <img
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Admin User
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Super Admin
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <button className={`w-full flex items-center px-4 py-2 text-sm hover:bg-gray-100 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700'} transition-colors`}>
                        <User className="w-4 h-4 mr-3" />
                        Profile
                      </button>
                      <button className={`w-full flex items-center px-4 py-2 text-sm hover:bg-gray-100 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700'} transition-colors`}>
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </button>
                      <button className={`w-full flex items-center px-4 py-2 text-sm hover:bg-gray-100 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700'} transition-colors`}>
                        <HelpCircle className="w-4 h-4 mr-3" />
                        Help & Support
                      </button>
                      <hr className={`my-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                      <button 
                        onClick={handleLogout} 
                        className={`w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 ${darkMode ? 'hover:bg-red-900/20' : ''} transition-colors`}
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Page Content */}
        <main className={`flex-1 overflow-auto p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          {children}
        </main>
      </div>

      {/* Enhanced Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;