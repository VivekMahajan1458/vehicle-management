// src/components/Sidebar.js
import React from 'react'; // Removed useState import
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Box, Typography } from '@mui/material'; // Removed useTheme, useMediaQuery
import { Dashboard as DashboardIcon, AddCircleOutline as AddIcon, DirectionsCar as CarIcon, ExitToApp as LogoutIcon, AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom'; // Keep useLocation for potential future highlighting
import meilLogo from '../assets/meil-logo.png';

const drawerWidth = 240;

// --- Simplified for PERMANENT sidebar ---
function Sidebar({ handleLogout }) { // Only needs handleLogout prop
    // const theme = useTheme(); // Not needed for permanent variant styles here
    // const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Not needed
    const location = useLocation();

    // Removed internal state and handleLinkClick

    return (
        <Drawer
            variant="permanent" // *** Use permanent variant ***
            anchor="left"
            // 'open' prop is not needed for permanent variant
            // 'onClose' prop is not needed for permanent variant
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: '#f8f9fa', // Example background
                    // No need for display logic based on 'open' state here
                },
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1 }}>
                    <img src={meilLogo} alt="MEIL Logo" style={{ height: '60px', marginBottom: 1 }} />
                    <Divider sx={{ width: '80%', my: 2 }} />
                </Box>
                <List sx={{ flexGrow: 1, px: 1 }}>
                     {/* *** CORRECTED 'to' props *** */}
                    <ListItem
                        component={RouterLink}
                        to="/employee/dashboard" // Correct path
                        // onClick is not needed to close permanent sidebar
                        selected={location.pathname === '/employee/dashboard'}
                        sx={{ borderRadius: '8px', marginBottom: '8px', '&.Mui-selected': { backgroundColor: 'action.selected' }, '&:hover': { backgroundColor: 'action.hover' } }}
                    >
                        <ListItemIcon sx={{ minWidth: '40px' }}><DashboardIcon /></ListItemIcon>
                        <ListItemText primary="Dashboard" sx={{ color: 'inherit', textDecoration: 'none' }} />
                    </ListItem>
                    <ListItem
                        component={RouterLink}
                        to="/employee/new-request" // Correct path
                        selected={location.pathname === '/employee/new-request'}
                        sx={{ borderRadius: '8px', marginBottom: '8px', '&.Mui-selected': { backgroundColor: 'action.selected' }, '&:hover': { backgroundColor: 'action.hover' } }}
                    >
                        <ListItemIcon sx={{ minWidth: '40px' }}><AddIcon /></ListItemIcon>
                        <ListItemText primary="New Request" sx={{ color: 'inherit', textDecoration: 'none' }} />
                    </ListItem>
                    <ListItem
                        component={RouterLink}
                        to="/employee/vehicle-status" // Correct path
                        selected={location.pathname === '/employee/vehicle-status'}
                        sx={{ borderRadius: '8px', marginBottom: '8px', '&.Mui-selected': { backgroundColor: 'action.selected' }, '&:hover': { backgroundColor: 'action.hover' } }}
                    >
                        <ListItemIcon sx={{ minWidth: '40px' }}><CarIcon /></ListItemIcon>
                        <ListItemText primary="Vehicle Status" sx={{ color: 'inherit', textDecoration: 'none' }} />
                    </ListItem>
                    <ListItem
                        component={RouterLink}
                        to="/employee/profile" // Correct path
                        selected={location.pathname === '/employee/profile'}
                         sx={{ borderRadius: '8px', marginBottom: '8px', '&.Mui-selected': { backgroundColor: 'action.selected' }, '&:hover': { backgroundColor: 'action.hover' } }}
                    >
                        <ListItemIcon sx={{ minWidth: '40px' }}><AccountCircleIcon /></ListItemIcon>
                        <ListItemText primary="Your Profile" sx={{ color: 'inherit', textDecoration: 'none' }} />
                    </ListItem>
                </List>
                <Box sx={{ p: 1, marginTop: 'auto' }}>
                    <Divider sx={{ width: '100%', mb: 1 }} />
                    <ListItem
                        button // Keep button for semantics
                        onClick={handleLogout} // Directly use handleLogout passed from Layout/Parent
                         sx={{ borderRadius: '8px', '&:hover': { backgroundColor: 'action.hover' } }}
                     >
                        <ListItemIcon sx={{ minWidth: '40px' }}><LogoutIcon /></ListItemIcon>
                        <ListItemText primary="Logout" sx={{ color: 'inherit', textDecoration: 'none' }} />
                    </ListItem>
                </Box>
            </Box>
        </Drawer>
    );
}

export default Sidebar;