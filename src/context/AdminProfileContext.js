'use client';

import React, { createContext, useContext, useState } from 'react';

const AdminProfileContext = createContext();

export const AdminProfileProvider = ({ children }) => {
  const [adminProfile, setAdminProfile] = useState(null);

  return (
    <AdminProfileContext.Provider value={{ adminProfile, setAdminProfile }}>
      {children}
    </AdminProfileContext.Provider>
  );
};

export const useAdminProfile = () => useContext(AdminProfileContext); 