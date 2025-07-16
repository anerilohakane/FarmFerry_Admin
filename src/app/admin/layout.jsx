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
  Filter,
  RefreshCw,
  HelpCircle,
  MessageSquare,
  Activity,
  Zap,
  TrendingUp,
  Star,
  Heart,
  Award,
  Truck,
  ClipboardList,
  ThumbsUp,
  ThumbsDown,
  FileText,
  MessageCircle,
  AlertCircle
} from 'lucide-react';

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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  

  // Enhanced sidebar items with all your management sections
  const sidebarItems = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      active: activeItem === 'Dashboard',
      description: 'Overview & Analytics'
    },
    { 
      icon: Users, 
      label: 'User Management',
      active: activeItem === 'User Management',
      description: 'Customers & Admins',
      subItems: [
        { label: 'Customers', icon: User },
        { label: 'Admins', icon: User }
      ]
    },
    { 
      icon: Truck, 
      label: 'Supplier Management',
      active: activeItem === 'Supplier Management',
      description: 'Manage suppliers',
      badge: '5',
      trend: '+2 new'
    },
    { 
      icon: Truck, 
      label: 'Delivery Associates',
      active: activeItem === 'Delivery Associates',
      description: 'Manage delivery team',
      count: '24'
    },
    { 
      icon: Package, 
      label: 'Product Management',
      active: activeItem === 'Product Management',
      description: 'Inventory & products',
      count: '247'
    },
    { 
      icon: ClipboardList, 
      label: 'Category Management',
      active: activeItem === 'Category Management',
      description: 'Product categories'
    },
    { 
      icon: ShoppingCart, 
      label: 'Order Management', 
      badge: '12',
      active: activeItem === 'Order Management',
      description: 'Process orders',
      trend: '+15%'
    },
    { 
      icon: BarChart3, 
      label: 'Reports & Analytics',
      active: activeItem === 'Reports & Analytics',
      description: 'Sales & Performance'
    },
    { 
      icon: Settings, 
      label: 'Settings',
      active: activeItem === 'Settings',
      description: 'System configuration'
    },
  ];

  // Sample notifications
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

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, unread: false } : notification
      )
    );
  };

  const handleItemClick = (label) => {
    setActiveItem(label);
    setSidebarOpen(false);
  };
//   setTimeout(() => {
//       setIsLoading(false);
//       // Redirect to admin dashboard
//       window.location.href = '/admin/usermanagement';
//     }, 1000);



  return (
    <div className={`flex h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Enhanced Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 ${sidebarCollapsed ? 'w-16' : 'w-64'} ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}>
        {/* Sidebar Header */}
        <div className={`flex-shrink-0 flex items-center justify-between h-16 px-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} transition-opacity duration-300`}>
                Farm Ferry Admin
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`hidden lg:block p-2 rounded-md hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'text-gray-600'}`}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className={`lg:hidden p-2 rounded-md hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'text-gray-600'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Online Status */}
        {!sidebarCollapsed && (
          <div className={`flex-shrink-0 px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {onlineUsers} users online
              </span>
            </div>
          </div>
        )}
        
        {/* Navigation - Scrollable Area */}
        <div className="flex-1 overflow-y-auto">
          <nav className="mt-8 px-4 space-y-2">
            {sidebarItems.map((item, index) => (
              <div key={index} className="relative group">
                <button
                  onClick={() => handleItemClick(item.label)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                    item.active 
                      ? `${darkMode ? 'bg-green-900 text-green-400' : 'bg-green-50 text-green-700'} border-r-2 border-green-500 shadow-sm` 
                      : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'} hover:text-gray-900 hover:shadow-sm`
                  } ${sidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={`w-5 h-5 ${item.active ? 'animate-pulse' : ''}`} />
                    {!sidebarCollapsed && (
                      <div className="flex-1">
                        <span className="font-medium">{item.label}</span>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                          {item.description}
                        </p>
                      </div>
                    )}
                  </div>
                  {!sidebarCollapsed && (
                    <div className="flex items-center space-x-2">
                      {item.badge && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
                          {item.badge}
                        </span>
                      )}
                      {item.trend && (
                        <span className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'} flex items-center`}>
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {item.trend}
                        </span>
                      )}
                      {item.count && (
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {item.count}
                        </span>
                      )}
                    </div>
                  )}
                </button>
                
                {/* Tooltip for collapsed sidebar */}
                {sidebarCollapsed && (
                  <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
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
                className={`lg:hidden p-2 rounded-md hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'text-gray-600'}`}
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Enhanced Search */}
              <div className="relative">
                <div className={`flex items-center ${searchFocused ? 'w-80' : 'w-64'} transition-all duration-300`}>
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    placeholder="Search dashboard..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className={`w-full pl-10 pr-4 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-200'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                  />
                  {searchValue && (
                    <button
                      onClick={() => setSearchValue('')}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Time Display */}
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} hidden md:block`}>
                {currentTime.toLocaleTimeString()}
              </div>

              {/* Quick Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleFullscreen}
                  className={`p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'text-gray-600'} transition-colors`}
                >
                  {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'text-gray-600'} transition-colors`}
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>

              {/* Enhanced Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className={`relative p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'text-gray-600'} transition-colors`}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationOpen && (
                  <div className={`absolute right-0 mt-2 w-80 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-lg z-50`}>
                    <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                      <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {unreadCount} new
                      </span>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={`px-4 py-3 hover:bg-gray-50 ${darkMode ? 'hover:bg-gray-700' : ''} cursor-pointer border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'} last:border-b-0`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg bg-${notification.color}-100 ${darkMode ? 'bg-opacity-20' : ''}`}>
                              <notification.icon className={`w-4 h-4 text-${notification.color}-600`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {notification.title}
                                </h4>
                                {notification.unread && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
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
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''} transition-colors`}
                >
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Profile"
                    className="w-8 h-8 rounded-full ring-2 ring-green-500 ring-offset-2"
                  />
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} hidden md:block`}>
                    Admin User
                  </span>
                  <ChevronDown className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'} transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <div className={`absolute right-0 mt-2 w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-lg z-50`}>
                    <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex items-center space-x-3">
                        <img
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt="Profile"
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Admin User</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Super Admin</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <a href="#" className={`flex items-center px-4 py-2 text-sm hover:bg-gray-100 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700'}`}>
                        <User className="w-4 h-4 mr-3" />
                        Profile
                      </a>
                      <a href="#" className={`flex items-center px-4 py-2 text-sm hover:bg-gray-100 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700'}`}>
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </a>
                      <a href="#" className={`flex items-center px-4 py-2 text-sm hover:bg-gray-100 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700'}`}>
                        <HelpCircle className="w-4 h-4 mr-3" />
                        Help & Support
                      </a>
                      <hr className={`my-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                      <a href="#" className={`flex items-center px-4 py-2 text-sm hover:bg-gray-100 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700'}`}>
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign out
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>

      {/* Sidebar Overlay */}
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