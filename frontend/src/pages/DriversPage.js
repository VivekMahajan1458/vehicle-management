// c:\Users\Vivek\vehicle-management\frontend\src\pages\DriversPage.js
import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/system';
import VMSidebar from '../components/VMSidebar'; // Import Sidebar
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Driver data (can be replaced with state/API call later)
const driverData = [
    { id: '1', mobileNo: '8307618187', driverName: 'Mukesh', department: 'Admin' },
    { id: '2', mobileNo: '9799889868', driverName: 'Khema Ram', department: 'Admin' },
    { id: '3', mobileNo: '9636320520', driverName: 'Monu', department: 'Admin' },
    { id: '4', mobileNo: '9571846773', driverName: 'Dharmendra', department: 'QA / QC' },
    { id: '5', mobileNo: '7014229176', driverName: 'Gopal', department: 'QA / QC' },
    { id: '6', mobileNo: '9136557387', driverName: 'Jyoti Bhushan', department: 'General Manager' },
    { id: '7', mobileNo: '8303654036', driverName: 'Amit', department: 'General Manager' },
    { id: '8', mobileNo: '7850887676', driverName: 'Amit', department: 'RCM' },
    { id: '9', mobileNo: '9725989215', driverName: 'Irfan Pathan', department: 'RPD' }
    // Added 'id' for potential key prop usage if needed later
];

// Styled components for layout (consistent with VehiclesPage)
const drawerWidth = 240;

const DashboardContainer = styled(Box)({
    display: 'flex',
    width: '100%',
    minHeight: '100vh',
    boxSizing: 'border-box',
});

const ContentContainer = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: open ? `${drawerWidth}px` : 0,
        width: open ? `calc(100% - ${drawerWidth}px)` : '100%',
        position: 'absolute', // Add this
        left: 0, // Add this
        right: 0, // Add this
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    boxSizing: 'border-box',
    overflowY: 'auto',
    overflowX: 'hidden',
}));
// Hamburger Button styled component (FIX APPLIED: removed internal display logic)
const HamburgerButton = styled(IconButton)(({ theme }) => ({
    position: 'fixed',
    left: '20px',
    top: '20px',
    zIndex: theme.zIndex.drawer + 1, // Ensure it's above sidebar overlay
    // display: 'block', // REMOVED - Let sx prop handle display
    // [theme.breakpoints.up('sm')]: { // REMOVED - Let sx prop handle display
    //     display: 'none',
    // },
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 1)',
    }
}));

// Main functional component
function DriversPage() {
    const navigate = useNavigate();
    // Default sidebar state (true = open on desktop, false = closed on mobile initially)
    // You might adjust this based on initial screen size detection if needed
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [drivers, setDrivers] = useState(driverData); // Use state for data

    // TODO: Add useEffect to fetch real data from API

    const handleAddDriver = () => {
        console.log('Add Driver button clicked');
        navigate('/drivers/add');
        // TODO: Implement navigation or modal logic for adding a driver
    };

    // TODO: Implement Edit/Delete handlers similar to VehiclesPage if needed
    // const handleEditDriver = (driverId) => { ... };
    // const handleDeleteDriver = (driverId) => { ... };

    const handleLogoutClick = () => {
        localStorage.clear(); // Or remove specific auth token
        navigate('/login');
    };

    return (
        <DashboardContainer>
            {/* Hamburger button - visibility controlled by sx prop */}
            <HamburgerButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                edge="start"
                // Shows on xs, sm; Hides on md, lg, xl
                //sx={{ display: { xs: 'block', md: 'none' } }}
            >
                <MenuIcon />
            </HamburgerButton>

            {/* Sidebar Component */}
            <VMSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)} // Allow closing via overlay click or swipe
                handleLogout={handleLogoutClick}
                // drawerWidth={drawerWidth} // Pass width if VMSidebar needs it
            />

            {/* Main Content Area */}
            <ContentContainer open={sidebarOpen}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Add padding top for mobile to avoid overlap with fixed hamburger */}
                    <Box sx={{ pt: { xs: 8, md: 3 }, width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h4" component="h1" gutterBottom>
                                Manage Drivers
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={handleAddDriver}
                            >
                                Add Driver
                            </Button>
                        </Box>

                        <Paper sx={{ width: '100%', overflow: 'hidden', mb: 2 }}>
                            <TableContainer> {/* Enables horizontal scroll on small screens if needed */}
                                <Table sx={{ minWidth: 650 }} aria-label="drivers table">
                                    <TableHead sx={{ backgroundColor: (theme) => theme.palette.grey[200] }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Mobile No</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Driver Name</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                                            {/* Add Actions column if needed */}
                                            {/* <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell> */}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {drivers.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} align="center" sx={{ py: 3 }}> {/* Adjust colSpan if Actions added */}
                                                    No drivers found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            drivers.map((driver) => ( // Use state variable 'drivers'
                                                <TableRow
                                                    key={driver.id || driver.mobileNo} // Use a unique key
                                                    hover
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {driver.mobileNo}
                                                    </TableCell>
                                                    <TableCell>{driver.driverName}</TableCell>
                                                    <TableCell>{driver.department}</TableCell>
                                                    {/* Add Action buttons if needed */}
                                                    {/*
                                                    <TableCell align="center">
                                                        <IconButton color="primary" size="small" onClick={() => handleEditDriver(driver.id)}>
                                                            <EditIcon fontSize="small"/>
                                                        </IconButton>
                                                        <IconButton color="error" size="small" onClick={() => handleDeleteDriver(driver.id)} sx={{ ml: 1 }}>
                                                            <DeleteIcon fontSize="small"/>
                                                        </IconButton>
                                                    </TableCell>
                                                    */}
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Box>
                </motion.div>
            </ContentContainer>
        </DashboardContainer>
    );
}

export default DriversPage;
