// src/components/Layout.js
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Box } from '@mui/material';

function Layout() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      <Sidebar handleLogout={handleLogout} /> {/* Pass the handleLogout prop */}
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, boxSizing: 'border-box', overflowY: 'auto' }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;