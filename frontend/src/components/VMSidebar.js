// src/components/VMSidebar.js
import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Box, useTheme, useMediaQuery } from '@mui/material';
// Import necessary icons
import { Dashboard as DashboardIcon, History as HistoryIcon, ExitToApp as LogoutIcon, DirectionsCar as DirectionsCarIcon, People as PeopleIcon } from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import meilLogo from '../assets/meil-logo.png';

const drawerWidth = 240;

function VMSidebar({ open, onClose, handleLogout }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose(); // Close drawer on mobile after link click
    }
    // Keep sidebar open on desktop when clicking links unless explicitly closed
  };

  // Determine the correct variant based on screen size
  const drawerVariant = isMobile ? "temporary" : "persistent"; // Use persistent on desktop

  return (
    <Drawer
      variant={drawerVariant}
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#f8f9fa', // Example background
          position: isMobile ? 'fixed' : 'relative', // Ensure proper positioning
        },
        // Display logic handled by the 'open' prop and variant for persistent/temporary
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1 }}>
          <img src={meilLogo} alt="MEIL Logo" style={{ height: '60px', marginBottom: 1 }} />
          <Divider sx={{ width: '80%', my: 2 }} />
        </Box>
        <List sx={{ flexGrow: 1, px: 1 }}>
          {/* Dashboard Link */}
          <ListItem
            component={RouterLink}
            to="/vehicle-manager" // Main dashboard link
            onClick={handleLinkClick}
            selected={location.pathname === '/vehicle-manager'}
            sx={{
              borderRadius: '8px',
              marginBottom: '8px',
              '&.Mui-selected': {
                backgroundColor: theme.palette.action.selected,
                '& .MuiListItemIcon-root': {
                  color: '#727273', // Apply icon color when selected
                },
                '& .MuiListItemText-primary': {
                  color: '#69458b', // Apply text color when selected
                },
              },
              '&:hover': { backgroundColor: theme.palette.action.hover },
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px', color: '#727273' }}> {/* Set default icon color */}
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" sx={{ color: '#69458b' }} /> {/* Set default text color */}
          </ListItem>

          {/* Past Requests Link */}
          <ListItem
            component={RouterLink}
            to="/vehicle-manager/past-requests"
            onClick={handleLinkClick}
            selected={location.pathname === '/vehicle-manager/past-requests'}
            sx={{
              borderRadius: '8px',
              marginBottom: '8px',
              '&.Mui-selected': {
                backgroundColor: theme.palette.action.selected,
                '& .MuiListItemIcon-root': {
                  color: '#727273',
                },
                '& .MuiListItemText-primary': {
                  color: '#69458b',
                },
              },
              '&:hover': { backgroundColor: theme.palette.action.hover },
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px', color: '#727273' }}>
              <HistoryIcon />
            </ListItemIcon>
            <ListItemText primary="Past Requests" sx={{ color: '#69458b' }} />
          </ListItem>

          {/* Manage Vehicles Link */}
          <ListItem
            component={RouterLink}
            to="/vehicle-manager/vehicles"
            onClick={handleLinkClick}
            selected={location.pathname === '/vehicle-manager/vehicles'}
            sx={{
              borderRadius: '8px',
              marginBottom: '8px',
              '&.Mui-selected': {
                backgroundColor: theme.palette.action.selected,
                '& .MuiListItemIcon-root': {
                  color: '#727273',
                },
                '& .MuiListItemText-primary': {
                  color: '#69458b',
                },
              },
              '&:hover': { backgroundColor: theme.palette.action.hover },
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px', color: '#727273' }}>
              <DirectionsCarIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Vehicles" sx={{ color: '#69458b' }} />
          </ListItem>

          {/* Manage Drivers Link */}
          <ListItem
            component={RouterLink}
            to="/vehicle-manager/drivers"
            onClick={handleLinkClick}
            selected={location.pathname === '/vehicle-manager/drivers'}
            sx={{
              borderRadius: '8px',
              marginBottom: '8px',
              '&.Mui-selected': {
                backgroundColor: theme.palette.action.selected,
                '& .MuiListItemIcon-root': {
                  color: '#727273',
                },
                '& .MuiListItemText-primary': {
                  color: '#69458b',
                },
              },
              '&:hover': { backgroundColor: theme.palette.action.hover },
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px', color: '#727273' }}>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Drivers" sx={{ color: '#69458b' }} />
          </ListItem>
        </List>
        <Box sx={{ p: 1, marginTop: 'auto' }}> {/* Push Logout to bottom */}
          <Divider sx={{ width: '100%', mb: 1 }} />
          <ListItem
            button={true} // Make sure it's explicitly true
            onClick={() => {
              if (handleLogout) { handleLogout(); }
              handleLinkClick();
            }}
            sx={{
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                cursor: 'pointer', // Add this to explicitly set the cursor
              },
              '& .MuiListItemIcon-root': {
                color: '#404041', // Apply icon color for logout
              },
              '& .MuiListItemText-primary': {
                color: '#404041', // Apply text color for logout
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </Box>
      </Box>
    </Drawer>
  );
}

export default VMSidebar;