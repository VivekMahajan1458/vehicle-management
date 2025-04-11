// src/components/VMSidebar.js
import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Box, useTheme, useMediaQuery } from '@mui/material';
import { Dashboard as DashboardIcon, History as HistoryIcon, ExitToApp as LogoutIcon } from '@mui/icons-material'; // Import HistoryIcon
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
                        selected={location.pathname === '/vehicle-manager'} // Highlight if active
                        sx={{
                            borderRadius: '8px',
                            marginBottom: '8px',
                            '&.Mui-selected': { backgroundColor: theme.palette.action.selected },
                            '&:hover': { backgroundColor: theme.palette.action.hover }
                        }}
                    > 
                        <ListItemIcon sx={{ minWidth: '40px' }}><DashboardIcon /></ListItemIcon>
                        <ListItemText 
                            primary="Dashboard"  
                            sx={{
                                color: location.pathname === '/vehicle-manager' ? 'blue' : 'inherit',
                                borderRadius: '8px',
                                '&:hover': { backgroundColor: theme.palette.action.hover }
                            }}
                        />

                </ListItem>

                     {/* *** ADDED: Past Requests Link *** */}
                    <ListItem
                         component={RouterLink}
                         to="/vehicle-manager/past-requests" // Link to the new page route
                         onClick={handleLinkClick}
                         selected={location.pathname === '/vehicle-manager/past-requests'} // Highlight if active
                         sx={{
                            borderRadius: '8px',
                            marginBottom: '8px',
                            '&.Mui-selected': { backgroundColor: theme.palette.action.selected },
                            '&:hover': { backgroundColor: theme.palette.action.hover }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: '40px' }}><HistoryIcon /></ListItemIcon> {/* History Icon */}
                        <ListItemText primary="Past Requests" />
                    </ListItem>
                    {/* Add other Vehicle Manager specific links here later */}

                </List>
                <Box sx={{ p: 1, marginTop: 'auto' }}> {/* Push Logout to bottom */}
                    <Divider sx={{ width: '100%', mb: 1 }} />
                    <ListItem
                        button // Keep button for clear clickable area
                        onClick={() => { // Combine logout and close
                            if (handleLogout) { handleLogout(); }
                            handleLinkClick();
                        }}
                         sx={{
                            borderRadius: '8px',
                            '&:hover': { backgroundColor: theme.palette.action.hover }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: '40px' }}><LogoutIcon /></ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </Box>
            </Box>
        </Drawer>
    );
}

export default VMSidebar;