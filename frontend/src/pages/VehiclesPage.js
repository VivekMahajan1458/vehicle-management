import React, { useState, useEffect } from 'react';
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
    IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu'; // Import MenuIcon for Hamburger
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import VMSidebar from '../components/VMSidebar';
import Swal from 'sweetalert2';import { motion } from 'framer-motion'; // Import motion

// --- Dummy Data (Keep as is) ---
const dummyVehicles = [
    { id: '1', make: 'Bolero', model: 'Camper', year: 2020, licensePlate: 'GJ01JT6723', status: 'Available' },
    { id: '2', make: 'Bolero', model: 'Camper', year: 2019, licensePlate: 'GJ08CS5325', status: 'Available' },
    { id: '3', make: 'Bolero', model: 'Standard', year: 2018, licensePlate: 'RJ13UB1492', status: 'In Use' },
    { id: '4', make: 'Bolero', model: 'Standard', year: 2021, licensePlate: 'RJ01TA4584', status: 'Available' },
    { id: '5', make: 'Bolero', model: 'Standard', year: 2022, licensePlate: 'GJ01WG3715', status: 'Maintenance' },
    { id: '6', make: 'Toyota', model: 'Innova', year: 2021, licensePlate: 'GJ01WD9880', status: 'Available' },
    { id: '7', make: 'Toyota', model: 'Innova', year: 2020, licensePlate: 'GJ01WD9754', status: 'Available' },
];
// --------------------------------

// --- Styled Components ---
const drawerWidth = 240;

const DashboardContainer = styled(Box)({
    display: 'flex',
    width: '100%',
    minHeight: '100vh',
    boxSizing: 'border-box',
});

// In your main dashboard file
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

// --- FIX: Removed conflicting display logic from styled component ---
const HamburgerButton = styled(IconButton)(({ theme }) => ({
    position: 'fixed',
    left: '20px',
    top: '20px',
    zIndex: theme.zIndex.drawer + 1,
    // display: 'block', // REMOVED - Let sx prop handle display
    // [theme.breakpoints.up('sm')]: { // REMOVED - Let sx prop handle display
    //    display: 'none',
    // },
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 1)',
    }
}));
// ------------------------------------------------------

function VehiclesPage() {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true); // Default state might need adjustment based on screen size later

    useEffect(() => {
        setVehicles(dummyVehicles);
        // Consider setting initial sidebarOpen state based on screen size here if needed
        // const isMobile = window.innerWidth < theme.breakpoints.values.md; // Example using theme
        // setSidebarOpen(!isMobile);
    }, []);

    const handleAddVehicle = () => {
        console.log('Add Vehicle button clicked');
        navigate('/vehicles/add');
    };

    const handleEditVehicle = (vehicleId) => {
        console.log(`Edit vehicle with ID: ${vehicleId}`);
        navigate(`/vehicles/edit/${vehicleId}`);
    };

    const handleDeleteVehicle = (vehicleId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                const originalVehicles = [...vehicles];
                setVehicles(prevVehicles => prevVehicles.filter(v => v.id !== vehicleId));

                // Replace with your actual API endpoint
                fetch(`/api/vehicles/${vehicleId}`, { method: 'DELETE' })
                    .then(response => {
                        if (!response.ok) {
                            // Check for specific auth errors if needed
                            if (response.status === 401 || response.status === 403) {
                                console.error('Authentication error during delete.');
                                // Optionally trigger logout or show specific message
                                // handleLogoutClick(); // Or show a message asking to log in again
                            }
                            throw new Error(`Failed to delete vehicle (status: ${response.status})`);
                        }
                        Swal.fire('Deleted!', 'The vehicle has been deleted.', 'success');
                        // No return needed here
                    })
                    .catch(error => {
                        console.error('Error deleting vehicle:', error);
                        setVehicles(originalVehicles); // Revert UI on error
                        Swal.fire('Error!', 'Failed to delete the vehicle. Please try again.', 'error');
                    });
            }
        });
    };


    const handleLogoutClick = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <DashboardContainer>
            {/* Hamburger button for mobile/tablet */}
            {/* The sx prop now solely controls the responsive display */}
            <HamburgerButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                edge="start"
                // Shows on xs and sm screens, hides on md and larger
                //sx={{ display: { xs: 'block', md: 'none' } }}
            >
                <MenuIcon />
            </HamburgerButton>

            {/* Sidebar */}
            {/* Pass theme breakpoints to sidebar if it needs them for responsive variant */}
            <VMSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                handleLogout={handleLogoutClick}
                // drawerWidth={drawerWidth} // Pass drawerWidth if needed by VMSidebar
            />


            {/* Main Content Area */}
            <ContentContainer open={sidebarOpen}><motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                 <Box sx={{ pt: { xs: 8, sm: 3 }, width: '100%' }}> {/* Adjusted padding top for sm */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Manage Vehicles
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleAddVehicle}
                        >
                            Add Vehicle
                        </Button>
                    </Box>

                    <Paper sx={{ width: '100%', overflow: 'hidden', mb: 2 }}>
                      <TableContainer>
                        <Table sx={{ minWidth: 650 }} aria-label="vehicles table">
                          <TableHead sx={{ backgroundColor: (theme) => theme.palette.grey[200] }}>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 'bold' }}>Make</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>Model</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>Year</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>License Plate</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {vehicles.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    No vehicles found.
                                </TableCell>
                              </TableRow>
                            ) : (
                              vehicles.map((vehicle) => (
                                <TableRow
                                  key={vehicle.id}
                                  hover
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                  <TableCell component="th" scope="row">{vehicle.make}</TableCell>
                                  <TableCell>{vehicle.model}</TableCell>
                                  <TableCell>{vehicle.year}</TableCell>
                                  <TableCell>{vehicle.licensePlate}</TableCell>
                                  <TableCell>{vehicle.status}</TableCell>
                                  <TableCell align="center">
                                    <IconButton
                                      color="primary"
                                      size="small"
                                      onClick={() => handleEditVehicle(vehicle.id)}
                                      aria-label={`Edit ${vehicle.make} ${vehicle.model}`}
                                      title="Edit"
                                    >
                                      <EditIcon fontSize="small"/>
                                    </IconButton>
                                    <IconButton
                                      color="error"
                                      size="small"
                                      onClick={() => handleDeleteVehicle(vehicle.id)}
                                      aria-label={`Delete ${vehicle.make} ${vehicle.model}`}
                                      title="Delete"
                                      sx={{ ml: 1 }}
                                    >
                                      <DeleteIcon fontSize="small"/>
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                 </Box></motion.div>
            </ContentContainer>
        </DashboardContainer>
    );
}

export default VehiclesPage;
