'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminProfileContext = createContext();

export const AdminProfileProvider = ({ children }) => {
  const [adminProfile, setAdminProfile] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Rehydrate adminProfile from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProfile = localStorage.getItem('adminProfile');
      if (storedProfile) {
        setAdminProfile(JSON.parse(storedProfile));
      }
      setIsHydrated(true);
    }
  }, []);

  // Persist adminProfile to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && adminProfile) {
      localStorage.setItem('adminProfile', JSON.stringify(adminProfile));
    }
  }, [adminProfile]);

  // Only render children after hydration
  if (!isHydrated) return null;

  return (
    <AdminProfileContext.Provider value={{ adminProfile, setAdminProfile }}>
      {children}
    </AdminProfileContext.Provider>
  );
};

export const useAdminProfile = () => useContext(AdminProfileContext); 