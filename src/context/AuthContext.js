"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '@/utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount, check for token in localStorage
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (storedToken) {
      setToken(storedToken);
      // Optionally, fetch user info here
      // fetchUser(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await apiRequest('/api/v1/auth/login/admin', {
      method: 'POST',
      body: { email, password },
    });
    // Use accessToken for admin/supplier, token for delivery associate
    const receivedToken = data.accessToken || data.token || (data.data && (data.data.accessToken || data.data.token));
    if (!receivedToken) throw new Error('No token received from server');
    setToken(receivedToken);
    localStorage.setItem('token', receivedToken);
    // Optionally, set user info
    setUser(data.admin || data.user || (data.data && (data.data.admin || data.data.user)));
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
} 