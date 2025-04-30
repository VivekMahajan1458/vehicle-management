// src/components/Sidebar.js
import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Box, Typography } from '@mui/material';
import { Dashboard as DashboardIcon, AddCircleOutline as AddIcon, DirectionsCar as CarIcon, ExitToApp as LogoutIcon, AccountCircle as AccountCircleIcon, History as HistoryIcon } from '@mui/icons-material';
import { Link as RouterLink, useLocation, MenuItem } from 'react-router-dom';
import meilLogo from '../assets/meil-logo.png';

const drawerWidth = 240;

function Sidebar({ handleLogout }) {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#f8f9fa',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1 }}>
          <img src={meilLogo} alt="MEIL Logo" style={{ height: '60px', marginBottom: 1 }} />
          <Divider sx={{ width: '80%', my: 2 }} />
        </Box>
        <List sx={{ flexGrow: 1, px: 1 }}>
          <ListItem
            component={RouterLink}
            to="/employee/dashboard"
            selected={location.pathname === '/employee/dashboard'}
            sx={{
              borderRadius: '8px',
              marginBottom: '8px',
              '&.Mui-selected': {
                backgroundColor: 'action.selected',
                '& .MuiListItemIcon-root': {
                  color: '#727273', // Apply icon color when selected
                },
                '& .MuiListItemText-primary': {
                  color: '#69458b', // Apply text color when selected
                },
              },
              '&:hover': { backgroundColor: 'action.hover' },
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px', color: '#727273' }}> {/* Set default icon color */}
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" sx={{ color: '#69458b' }} /> {/* Set default text color */}
          </ListItem>
          <ListItem
            component={RouterLink}
            to="/employee/new-request"
            selected={location.pathname === '/employee/new-request'}
            sx={{
              borderRadius: '8px',
              marginBottom: '8px',
              '&.Mui-selected': {
                backgroundColor: 'action.selected',
                '& .MuiListItemIcon-root': {
                  color: '#727273',
                },
                '& .MuiListItemText-primary': {
                  color: '#69458b',
                },
              },
              '&:hover': { backgroundColor: 'action.hover' },
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px', color: '#727273' }}>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="New Request" sx={{ color: '#69458b' }} />
          </ListItem>
          <ListItem
            component={RouterLink}
            to="/employee/past-requests"
            selected={location.pathname === '/employee/past-requests'}
            sx={{
              borderRadius: '8px',
              marginBottom: '8px',
              '&.Mui-selected': {
                backgroundColor: 'action.selected',
                '& .MuiListItemIcon-root': {
                  color: '#727273',
                },
                '& .MuiListItemText-primary': {
                  color: '#69458b',
                },
              },
              '&:hover': { backgroundColor: 'action.hover' },
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px', color: '#727273' }}>
              <HistoryIcon />
            </ListItemIcon>
            <ListItemText primary="Past Requests" sx={{ color: '#69458b' }} />
          </ListItem>
          <ListItem
            component={RouterLink}
            to="/employee/vehicle-status"
            selected={location.pathname === '/employee/vehicle-status'}
            sx={{
              borderRadius: '8px',
              marginBottom: '8px',
              '&.Mui-selected': {
                backgroundColor: 'action.selected',
                '& .MuiListItemIcon-root': {
                  color: '#727273',
                },
                '& .MuiListItemText-primary': {
                  color: '#69458b',
                },
              },
              '&:hover': { backgroundColor: 'action.hover' },
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px', color: '#727273' }}>
              <CarIcon />
            </ListItemIcon>
            <ListItemText primary="Vehicle Status" sx={{ color: '#69458b' }} />
          </ListItem>
          <ListItem
            component={RouterLink}
            to="/employee/profile"
            selected={location.pathname === '/employee/profile'}
            sx={{
              borderRadius: '8px',
              marginBottom: '8px',
              '&.Mui-selected': {
                backgroundColor: 'action.selected',
                '& .MuiListItemIcon-root': {
                  color: '#727273',
                },
                '& .MuiListItemText-primary': {
                  color: '#69458b',
                },
              },
              '&:hover': { backgroundColor: 'action.hover' },
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px', color: '#727273' }}>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Your Profile" sx={{ color: '#69458b' }} />
          </ListItem>
        </List>
        <Box sx={{ p: 1, marginTop: 'auto' }}>
          <Divider sx={{ width: '100%', mb: 1 }} />
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              borderRadius: '8px',
              '&:hover': { backgroundColor: 'action.hover' },
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

export default Sidebar;