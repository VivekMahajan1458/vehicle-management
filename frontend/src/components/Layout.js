// src/components/Layout.js
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import AdminSidebar from './AdminSidebar';
import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';

// Styled Hamburger Button
const HamburgerButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  left: '20px',
  top: '20px',
  zIndex: 1300,
  backgroundColor: 'white',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
}));

const Layout = () => {
  // Step 1: First initialize all hooks
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
 
  // Step 2: Then use their values
  const isAdminRoute = location.pathname.startsWith('/admin');
 
  // Step 3: Set initial state based on derived values
  const [adminSidebarOpen, setAdminSidebarOpen] = useState(
    isAdminRoute ? !isMobile : true
  );
 
  // Force sidebar closed when screen size changes to mobile
  useEffect(() => {
    if (isMobile && isAdminRoute) {
      setAdminSidebarOpen(false);
    }
  }, [isMobile, isAdminRoute]);
 
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };
 
  // Button to toggle sidebar visibility
  const toggleSidebar = () => {
    setAdminSidebarOpen(prev => !prev);
  };
 
  const renderAdminSidebar = () => {
    return (
      <>
        {/* Always show hamburger button */}
        <HamburgerButton
          color="inherit"
          aria-label={adminSidebarOpen ? "close drawer" : "open drawer"}
          onClick={toggleSidebar}
          edge="start"
        >
          <MenuIcon />
        </HamburgerButton>
       
        <AdminSidebar
          open={adminSidebarOpen}
          toggleSidebar={toggleSidebar}
          handleLogout={handleLogout}
        />
      </>
    );
  };
 
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        width: '100%', 
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden' // Prevent scrollbars on the container
      }}
    >
      {isAdminRoute ? renderAdminSidebar() : (
        <Sidebar handleLogout={handleLogout} />
      )}
      
      <Box
        component="main"
        sx={{
          width: '100%',
          flexGrow: 1,
          boxSizing: 'border-box',
          transition: theme.transitions.create(['width','margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          })
        }}
      >
        <Box sx={{ p: 3, boxSizing: 'border-box', height: '100%', maxWidth: '100%', overflowY: 'auto', zIndex: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;