import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Box, useTheme, useMediaQuery, IconButton } from '@mui/material';
import { Dashboard as DashboardIcon, People as PeopleIcon, DirectionsCar as DirectionsCarIcon, Group as GroupIcon, ExitToApp as LogoutIcon } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import meilLogo from '../assets/meil-logo.png';

const drawerWidth = 240;
function AdminSidebar({ open, toggleSidebar, handleLogout }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();

  const handleLinkClick = () => {
    if (isMobile && toggleSidebar) {
      toggleSidebar(); // Close drawer on mobile after link click
    }
  };

  const drawerVariant = isMobile ? "temporary" : "persistent";

  return (
<Drawer
    variant={drawerVariant}
    anchor="left"
    open={open}
    onClose={toggleSidebar}
    ModalProps={{
      keepMounted: true,
    }}
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      [`& .MuiDrawer-paper`]: {
        width: isMobile ? '100%' : drawerWidth,
        maxWidth: '100%',
        boxSizing: 'border-box',
        backgroundColor: '#f8f9fa',
        position: isMobile ? 'fixed' : 'static', // Change 'relative' to 'static'
        borderRight: '1px solid #e0e0e0',
      },
    }}
>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1 }}>
          <img src={meilLogo} alt="MEIL Logo" style={{ height: '60px', marginBottom: 1 }} />
          <Divider sx={{ width: '80%', my: 2 }} />
        </Box>
        <List sx={{ flexGrow: 1, px: 2 }}> {/* Removed color from List */}
          <ListItem
            component={RouterLink}
            to="/admin"
            onClick={handleLinkClick}
            selected={location.pathname === '/admin'}
            sx={{
              borderRadius: '0px',
              marginBottom: '8px',
              '&.Mui-selected': {
                backgroundColor: '#e0f2f7',
                '& .MuiListItemIcon-root': {
                  color: '#727273',
                },
                '& .MuiListItemText-primary': {
                  color: '#69458b',
                },
              },
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px', color: '#727273' }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" sx={{ color: '#69458b' }} /> {/* Applied text color using sx */}
          </ListItem>

          <ListItem
            component={RouterLink}
            to="/admin/drivers"
            onClick={handleLinkClick}
            selected={location.pathname === '/admin/drivers'}
            sx={{
              borderRadius: '0px',
              marginBottom: '8px',
              '&.Mui-selected': {
                backgroundColor: '#e0f2f7',
                '& .MuiListItemIcon-root': {
                  color: '#727273',
                },
                '& .MuiListItemText-primary': {
                  color: '#69458b',
                },
              },
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px', color: '#727273' }}>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Drivers" sx={{ color: '#69458b' }} /> {/* Applied text color using sx */}
          </ListItem>

          <ListItem
            component={RouterLink}
            to="/admin/vehicles" // Update with your actual route
            onClick={handleLinkClick}
            selected={location.pathname === '/admin/vehicles'}
            sx={{
              borderRadius: '0px',
              marginBottom: '8px',
              '&.Mui-selected': {
                backgroundColor: '#e0f2f7',
                '& .MuiListItemIcon-root': {
                  color: '#727273',
                },
                '& .MuiListItemText-primary': {
                  color: '#69458b',
                },
              },
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px', color: '#727273' }}>
              <DirectionsCarIcon />
            </ListItemIcon>
            <ListItemText primary="Vehicles" sx={{ color: '#69458b' }} /> {/* Applied text color using sx */}
          </ListItem>

          <ListItem
            component={RouterLink}
            to="/admin/employees" // Update with your actual route
            onClick={handleLinkClick}
            selected={location.pathname === '/admin/employees'}
            sx={{
              borderRadius: '0px',
              marginBottom: '8px',
              '&.Mui-selected': { backgroundColor: '#e0f2f7' },
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px', color: '#727273' }}><GroupIcon/></ListItemIcon>
            <ListItemText primary="Employees" sx={{ color: '#69458b' }} /> {/* Applied text color using sx */}
          </ListItem>
        </List>
        <Box sx={{ p: 2, marginTop: 'auto' }}>
          {/* Removed the first Divider here */}
        </Box>
        <Box sx={{ p: 1, marginTop: 'auto' }}>
          <Divider sx={{ width: '100%', mb: 1 }} />
          <ListItem
            onClick={() => {
              if (handleLogout) { handleLogout(); }
              handleLinkClick();
            }}
            sx={{
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                cursor: 'pointer'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px', color: '#404041' }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: '#404041' }} /> {/* Applied text color using sx */}
          </ListItem>
        </Box>
      </Box>
    </Drawer>
  );
}

export default AdminSidebar;