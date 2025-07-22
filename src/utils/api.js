// src/utils/api.js

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // Updated to match backend port

export async function apiRequest(endpoint, { method = 'GET', body, headers = {}, token, isFormData } = {}) {
  // Do not send token for login or register endpoints
  const isAuthEndpoint = endpoint.startsWith('/api/auth/login') || endpoint.startsWith('/api/auth/register');
  if (!isAuthEndpoint && !token && typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }
  
  const config = {
    method,
    headers: {
      ...headers,
    },
  };
  
  if (token && !isAuthEndpoint) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (body) {
    if (isFormData) {
      config.body = body;
      // Do not set Content-Type, browser will set it
    } else {
      config.headers['Content-Type'] = 'application/json';
      config.body = JSON.stringify(body);
    }
  }
  
  console.log('🌐 API Request:', {
    url: `${BASE_URL}${endpoint}`,
    method,
    hasToken: !!token,
    body: body ? 'present' : 'none'
  });
  
  const res = await fetch(`${BASE_URL}${endpoint}`, config);
  
  console.log('📡 API Response:', {
    status: res.status,
    statusText: res.statusText,
    url: res.url
  });
  
  if (!res.ok) {
    let error = {};
    try {
      error = await res.json();
    } catch (e) {
      try {
        const text = await res.text();
        error = { message: text || `HTTP ${res.status}: ${res.statusText}` };
      } catch {
        error = { message: `HTTP ${res.status}: ${res.statusText}` };
      }
    }
    console.error('❌ API Error:', error);
    throw new Error(error.message || `HTTP ${res.status}: ${res.statusText}`);
  }
  
  const data = await res.json();
  console.log('✅ API Success:', data);
  return data;
}

// Product API utilities
export async function getProducts() {
  const res = await apiRequest('/api/v1/products', { method: 'GET' });
  // The backend returns { data: { products: [...] } }
  return res.data.products;
}

export async function addProduct(product, token) {
  // product is FormData
  return apiRequest('/api/v1/products', {
    method: 'POST',
    body: product,
    token,
    isFormData: true
  });
}

export async function updateProduct(id, product, token) {
  // product is FormData
  return apiRequest(`/api/v1/products/${id}`, {
    method: 'PATCH',
    body: product,
    token,
    isFormData: true
  });
}

export async function deleteProduct(id, token) {
  await apiRequest(`/api/v1/products/${id}`, { method: 'DELETE', token });
}

export async function getCategories() {
  const res = await apiRequest('/api/v1/categories', { method: 'GET' });
  // The backend returns { data: { categories: [...] } }
  return res.data.categories;
}

// Order Management API utilities
export async function getAllOrders(params = {}, token) {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/api/v1/orders${queryString ? `?${queryString}` : ''}`;
  console.log('📋 Fetching orders with params:', params);
  const res = await apiRequest(endpoint, { method: 'GET', token });
  return res.data;
}

export async function getOrderById(orderId, token) {
  const res = await apiRequest(`/api/v1/orders/${orderId}`, { method: 'GET', token });
  return res.data.order;
}

export async function updateOrderStatus(orderId, status, note = '', token) {
  const body = { status, note };
  const res = await apiRequest(`/api/v1/orders/${orderId}/status`, { 
    method: 'PUT', 
    body, 
    token 
  });
  return res.data.order;
}

export async function assignDeliveryAssociate(orderId, deliveryAssociateId, token) {
  const body = { deliveryAssociateId };
  const res = await apiRequest(`/api/v1/orders/${orderId}/assign-delivery`, { 
    method: 'PUT', 
    body, 
    token 
  });
  return res.data.order;
}

// Delivery Associate API utilities
export async function getAllDeliveryAssociates(params = {}, token) {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/api/v1/admin/delivery-associates${queryString ? `?${queryString}` : ''}`;
  console.log('🚚 Fetching delivery associates with params:', params);
  const res = await apiRequest(endpoint, { method: 'GET', token });
  return res.data;
}

// Auth API utilities
export async function loginAdmin(credentials) {
  console.log('🔐 Admin login attempt:', { email: credentials.email });
  const res = await apiRequest('/api/v1/auth/login/admin', { 
    method: 'POST', 
    body: credentials 
  });
  console.log('✅ Admin login successful');
  return res.data;
}

export async function getCurrentUser(token) {
  const res = await apiRequest('/api/v1/auth/current-user', { method: 'GET', token });
  return res.data.user;
} 

// Analytics API utilities
export async function getAdminDashboardStats(token) {
  return apiRequest('/api/v1/admin/dashboard-stats', { method: 'GET', token });
}

// Revenue analytics
export async function getAdminRevenueAnalytics(params = {}, token) {
  const queryString = new URLSearchParams(params).toString();
  return apiRequest(`/api/v1/admin/analytics/revenue${queryString ? `?${queryString}` : ''}`, { method: 'GET', token });
}

// Product analytics
export async function getAdminProductAnalytics(params = {}, token) {
  const queryString = new URLSearchParams(params).toString();
  return apiRequest(`/api/v1/admin/analytics/products${queryString ? `?${queryString}` : ''}`, { method: 'GET', token });
}

// Customer analytics
export async function getAdminCustomerAnalytics(params = {}, token) {
  const queryString = new URLSearchParams(params).toString();
  return apiRequest(`/api/v1/admin/analytics/customers${queryString ? `?${queryString}` : ''}`, { method: 'GET', token });
}

export async function getAdminCategoryAnalytics(params = {}, token) {
  const queryString = new URLSearchParams(params).toString();
  return apiRequest(`/api/v1/admin/analytics/categories?${queryString}`, { method: 'GET', token });
} 

// Admin profile API utilities
export async function getAdminProfile(token) {
  const res = await apiRequest('/api/v1/admin/profile', { method: 'GET', token });
  return res.data.admin;
}

export async function updateAdminProfile(profile, token) {
  const res = await apiRequest('/api/v1/admin/profile', {
    method: 'PUT',
    body: profile,
    token
  });
  return res.data.admin;
}

export async function changeAdminPassword(passwords, token) {
  // passwords = { currentPassword, newPassword, confirmPassword }
  await apiRequest('/api/v1/admin/change-password', {
    method: 'PUT',
    body: passwords,
    token
  });
} 