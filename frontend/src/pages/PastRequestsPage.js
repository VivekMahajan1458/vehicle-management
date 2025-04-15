// src/pages/PastRequestsPage.js
import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Chip, Paper, Button, Dialog, DialogTitle,
    DialogContent, DialogContentText, DialogActions, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Stack, TextField,
    Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { styled, useTheme } from '@mui/system';
import { motion } from 'framer-motion'; // For animations
import MenuIcon from '@mui/icons-material/Menu'; // Import MenuIcon for Hamburger
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import VMSidebar from '../components/VMSidebar'; // Import VMSidebar


dayjs.locale('en');

// --- Re-add necessary styled components (Consider moving to a shared file later) ---
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

const HamburgerButton = styled(IconButton)(({ theme }) => ({
    position: 'fixed', // Keep fixed position
    left: '20px', // Increase left margin
    top: '20px',
    zIndex: theme.zIndex.drawer + 1,
    display: { xs: 'block', sm: 'none' }, // Show only on small screens
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Make more visible
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Add subtle shadow
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 1)',
    }
}));

const StyledPaper = styled(Paper)({ padding: '16px', marginBottom: '24px', width: '100%', boxSizing: 'border-box', overflowX: 'auto' });
const SectionTitle = styled(Typography)({ marginBottom: '16px' }); // Keep if needed, maybe not
const StyledChip = styled(Chip)(({ theme, status }) => ({
    marginRight: '8px',
    marginBottom: '8px',
    ...(status === 'Pending' && { backgroundColor: '#FF2C2C', color: 'white' }),
    ...(status === 'Approved' && { backgroundColor: theme.palette.success.main, color: 'white' }),
    ...(status === 'Hold' && { backgroundColor: '#FFBF00', color: 'black' }),
    ...((status === 'Cancelled' || status === 'Expired') && { backgroundColor: theme.palette.grey[400], color: 'black' }),
}));
// ----------------------------------------------------------------------

// Helper function to format dates
function formatDate(dateString) {
    return dayjs(dateString).format('MMM DD, YYYY'); // Use YYYY for 4-digit year
}

function PastRequestsPage() {
    const theme = useTheme(); // Needed for styled components accessing theme
    const navigate = useNavigate(); // Needed for logout

    const [pastRequests, setPastRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [openAssignmentDialog, setOpenAssignmentDialog] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState(null); // Highlighted row
    const [sidebarOpen, setSidebarOpen] = useState(true); // State for sidebar visibility
    const [selectedDriver, setSelectedDriver] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [past, setPast] = useState([]);

    const [drivers, setDrivers] = useState([
        { id: 'driver-1', name: 'Mukesh', phone: '8307618187' },
        { id: 'driver-2', name: 'Khema Ram', phone: '9799889868' },
        { id: 'driver-3', name: 'Monu', phone: '9636320520' },
        { id: 'driver-4', name: 'Dharmendra', phone: '9571846773' },
        { id: 'driver-5', name: 'Gopal', phone: '7014229176' },
        { id: 'driver-6', name: 'Jyoti Bhushan', phone: '9136557387' },
        { id: 'driver-7', name: 'Amit', phone: '8303654036' },
        { id: 'driver-8', name: 'Irfan Pathan', phone: '7850887676' },
    ]);
    const [vehicles, setVehicles] = useState([
        { id: 'vehicle-GJ01JT6723', number: 'GJ01JT6723', type: 'Bolero Camper' },
        { id: 'vehicle-GJ08CS5325', number: 'GJ08CS5325', type: 'Bolero Camper' },
        { id: 'vehicle-RJ13UB1492', number: 'RJ13UB1492', type: 'Bolero' },
        { id: 'vehicle-RJ01TA4584', number: 'RJ01TA4584', type: 'Bolero' },
        { id: 'vehicle-GJ01WG3715', number: 'GJ01WG3715', type: 'Bolero' },
        { id: 'vehicle-GJ01WD9880', number: 'GJ01WD9880', type: 'INNOVA' },
        { id: 'vehicle-GJ01WD9754', number: 'GJ01WD9754', type: 'INNOVA' },
    ]);

    const handleLogoutClick = () => {
        localStorage.clear();
        navigate('/login');
    };

    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        const pastDummyData = [
            { id: 'request-1', date: '2024-07-20T08:00:00.000Z', name: 'Alice Green', employeeId: '12345', purpose: 'Client Meeting', destination: 'Client Office', pickupLocation: 'Office', pickupTime: '09:00', returnTime: '17:00', passengers: 2, notes: 'Need a comfortable vehicle.', status: 'Approved', assignedDriver: { id: 'driver-1', name: 'Mukesh', phone: '8307618187' }, assignedVehicle: { id: 'vehicle-GJ01JT6723', number: 'GJ01JT6723', type: 'Bolero Camper' } },
            { id: 'request-2', date: '2024-07-15T10:00:00.000Z', name: 'Bob White', employeeId: '67890', purpose: 'Site Visit', destination: 'Construction Site', pickupLocation: 'Office', pickupTime: '11:00', returnTime: '15:00', passengers: 3, notes: 'Need a vehicle suitable for rough terrain.', status: 'Approved', assignedDriver: { id: 'driver-2', name: 'Khema Ram', phone: '9799889868' }, assignedVehicle: { id: 'vehicle-GJ08CS5325', number: 'GJ08CS5325', type: 'Bolero Camper' } },
            { id: 'request-3', date: '2024-07-10T14:00:00.000Z', name: 'Charlie Black', employeeId: '11223', purpose: 'Airport Pickup', destination: 'Airport', pickupLocation: 'Office', pickupTime: '15:00', returnTime: '18:00', passengers: 1, notes: 'Picking up a VIP client.', status: 'Approved', assignedDriver: { id: 'driver-3', name: 'Monu', phone: '9636320520' }, assignedVehicle: { id: 'vehicle-RJ13UB1492', number: 'RJ13UB1492', type: 'Bolero' } },
            { id: 'request-4', date: '2024-07-05T09:00:00.000Z', name: 'Diana Yellow', employeeId: '44556', purpose: 'Training', destination: 'Training Center', pickupLocation: 'Office', pickupTime: '10:00', returnTime: '16:00', passengers: 4, notes: 'Need a spacious vehicle.', status: 'Cancelled', assignedDriver: null, assignedVehicle: null },
            { id: 'request-5', date: '2024-06-30T11:00:00.000Z', name: 'Evan Blue', employeeId: '77889', purpose: 'Vendor Visit', destination: 'Vendor Office', pickupLocation: 'Office', pickupTime: '12:00', returnTime: '14:00', passengers: 2, notes: 'Need a reliable vehicle.', status: 'Expired', assignedDriver: null, assignedVehicle: null },
        ];
        
        // Get existing requests from localStorage
        let allRequests = JSON.parse(localStorage.getItem('requests') || '[]');
        
        // Check if there are any approved/cancelled/expired requests
        const existingPastRequests = allRequests.filter(req => 
            ['Approved', 'Cancelled', 'Expired'].includes(req.status)
        );
        
        // If no past requests exist, merge the past dummy data with existing requests
        if (existingPastRequests.length === 0) {
            // Combine current requests with past dummy data
            const combinedRequests = [...allRequests, ...pastDummyData];
            
            // Save the combined data back to localStorage
            localStorage.setItem('requests', JSON.stringify(combinedRequests));
            
            // Update allRequests reference to include the combined data
            allRequests = combinedRequests;
        }
        
        // Process requests as before - auto-approve if needed
        const updatedRequests = allRequests.map(request => {
            if (request.status === 'Cancelled' || request.status === 'Expired') {
                return { ...request, status: 'Approved' };
            }
            return request;
        });
        
        // Filter for past requests and sort by date
        const pastRequestsToDisplay = updatedRequests
            .filter(req => ['Approved', 'Cancelled', 'Expired'].includes(req.status))
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Update localStorage with processed requests
        localStorage.setItem('requests', JSON.stringify(updatedRequests));
        
        // Set state for UI
        setPastRequests(pastRequestsToDisplay);
    }, []);

    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setOpenDialog(true);
    };

    const handleEditAssignment = (request) => {
        setSelectedRequest(request);
        setSelectedDriver(request.assignedDriver ? request.assignedDriver.id : '');
        setSelectedVehicle(request.assignedVehicle ? request.assignedVehicle.id : '');
        setOpenAssignmentDialog(true);
    }

    const handleAssignmentChange = (event) => {
        const { name, value } = event.target;
        if (name === 'driver') {
            setSelectedDriver(value);
        } else if (name === 'vehicle') {
            setSelectedVehicle(value);
        }
    };

    const handleAssignmentSubmit = () => {
        if (selectedRequest && selectedDriver && selectedVehicle) {
            const updatedRequests = pastRequests.map(req => {
                if (req.id === selectedRequest.id) {
                    const driver = drivers.find(d => d.id === selectedDriver);
                    const vehicle = vehicles.find(v => v.id === selectedVehicle);
                    return {
                        ...req,
                        assignedDriver: {
                            id: driver.id,
                            name: driver.name,
                            phone: driver.phone,
                        },
                        assignedVehicle: {
                            id: vehicle.id,
                            number: vehicle.number,
                            type: vehicle.type,
                        },
                    };
                }
                return req;
            });

            // Filter to keep only 'Approved' requests before updating localStorage and state
            const filteredRequests = updatedRequests.filter(req => ['Approved', 'Cancelled', 'Expired'].includes(req.status));
            localStorage.setItem('requests', JSON.stringify(updatedRequests));
            setPastRequests(filteredRequests);
            setOpenAssignmentDialog(false);
            setSelectedRequest(null);
        setSelectedDriver('');
        setSelectedVehicle('');
        }
    };

    const handleCloseAssignmentDialog = () => {
        setOpenDialog(false);
        setSelectedRequest(null);
    };


    const handleRowClick = (requestId) => {
        setSelectedRequestId(requestId);
        // Find the full request object to potentially show details without separate button
        // const req = pastRequests.find(r => r.id === requestId);
        // if (req) handleViewDetails(req); // Optionally open details on row click
    };

    return (
        // --- ADDED DashboardContainer ---
        <DashboardContainer>
            {/* --- ADDED HamburgerButton --- */}
            <HamburgerButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                edge="start"
            >
                <MenuIcon />
            </HamburgerButton>

            {/* --- ADDED VMSidebar --- */}
            <VMSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} handleLogout={handleLogoutClick} />

            {/* --- ADDED ContentContainer --- */}
            <ContentContainer open={sidebarOpen}>
                {/* Optional: Add top padding for hamburger button */}
                <Box sx={{ pt: { xs: 6, sm: 0 } }} />

                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Typography variant="h4" gutterBottom>
                        Past Vehicle Requests
                    </Typography>

                    <StyledPaper>
                        {pastRequests.length > 0 ? (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Requester</TableCell>
                                            <TableCell>Purpose</TableCell>
                                            <TableCell>Driver</TableCell>
                                            <TableCell>Vehicle</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
<TableBody>
    {pastRequests.map((request) => (
        <TableRow
            key={request.id}
            onClick={() => handleRowClick(request.id)}
            sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                cursor: 'pointer',
                backgroundColor: selectedRequestId === request.id ? '#f5f5f5' : 'inherit',
            }}
        >
            <TableCell>{request.id}</TableCell>
            <TableCell>{formatDate(request.date)}</TableCell>
            <TableCell>{request.name || 'N/A'}</TableCell>
            <TableCell>{request.purpose}</TableCell>
            <TableCell>{request.assignedDriver ? request.assignedDriver.name : 'N/A'}</TableCell>
            <TableCell>{request.assignedVehicle ? request.assignedVehicle.number : 'N/A'}</TableCell>
            <TableCell>
                <StyledChip
                    label={request.status === 'Cancelled' || request.status === 'Expired' ? "Not Approved" : request.status}
                    status={request.status}
                />
            </TableCell>
            <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(request);
                        }}
                    >
                        View Details
                    </Button>
                    {request.status === 'Approved' && (
                        <Button
                            size="small"
                            variant="contained"
                            color="secondary"
                            onClick={(e) => { e.stopPropagation(); handleEditAssignment(request); }}
                        >
                            Edit Assignment
                        </Button>
                    )}
                </Stack>
            </TableCell>
        </TableRow>
    ))}
</TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography>No past requests found.</Typography>
                        )}
                    </StyledPaper>
                </motion.div>

                                {/* View Details Dialog */}
                                <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
                                    {selectedRequest && (
        <>
            <DialogTitle>Request Details (ID: {selectedRequest.id})</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Here are the details of the vehicle request:
                </DialogContentText>
                <TableContainer component={Paper} elevation={0} sx={{ mt: 2 }}>
                    <Table size="small">
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none', width: '30%' }}>Name:</TableCell>
                                <TableCell sx={{ borderBottom: 'none' }}>{selectedRequest.name || 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none' }}>Employee ID:</TableCell>
                                <TableCell sx={{ borderBottom: 'none' }}>{selectedRequest.employeeId || 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none' }}>Purpose:</TableCell>
                                <TableCell sx={{ borderBottom: 'none' }}>{selectedRequest.purpose}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none' }}>Destination:</TableCell>
                                <TableCell sx={{ borderBottom: 'none' }}>{selectedRequest.destination}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none' }}>Pickup Location:</TableCell>
                                <TableCell sx={{ borderBottom: 'none' }}>{selectedRequest.pickupLocation}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none' }}>Date:</TableCell>
                                <TableCell sx={{ borderBottom: 'none' }}>{formatDate(selectedRequest.date)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none' }}>Pickup Time:</TableCell>
                                <TableCell sx={{ borderBottom: 'none' }}>{selectedRequest.pickupTime}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none' }}>Return Time:</TableCell>
                                <TableCell sx={{ borderBottom: 'none' }}>{selectedRequest.returnTime || 'Not specified'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none' }}>Passengers:</TableCell>
                                <TableCell sx={{ borderBottom: 'none' }}>{selectedRequest.passengers}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none' }}>Notes:</TableCell>
                                <TableCell sx={{ borderBottom: 'none' }}>{selectedRequest.notes || 'No additional notes'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none' }}>Status:</TableCell>
                                <TableCell sx={{ borderBottom: 'none' }}>
                                    <StyledChip
                                        label={selectedRequest.status === 'Cancelled' || selectedRequest.status === 'Expired' ? "Not Approved" : selectedRequest.status}
                                        status={selectedRequest.status}
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenDialog(false)} color="primary">Close</Button>
            </DialogActions>
        </>
    )}
</Dialog>

                {/* Edit Assignment Dialog */}
                <Dialog open={openAssignmentDialog} onClose={() => setOpenAssignmentDialog(false)} fullWidth maxWidth="sm">
                    <DialogTitle>Edit Assignment</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Select a driver and vehicle for this request.
                        </DialogContentText>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="driver-select-label">Driver</InputLabel>
                            <Select
                                labelId="driver-select-label"
                                id="driver-select"
                                name="driver"
                                value={selectedDriver}
                                label="Driver"
                                onChange={handleAssignmentChange}
                            >
                                {drivers.map((driver) => (
                                    <MenuItem key={driver.id} value={driver.id}>
                                        {driver.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="vehicle-select-label">Vehicle</InputLabel>
                            <Select
                                labelId="vehicle-select-label"
                                id="vehicle-select"
                                name="vehicle"
                                value={selectedVehicle}
                                label="Vehicle"
                                onChange={handleAssignmentChange}
                            >
                                {vehicles.map((vehicle) => (
                                    <MenuItem key={vehicle.id} value={vehicle.id}>
                                        {vehicle.number} ({vehicle.type})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenAssignmentDialog(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleAssignmentSubmit} color="primary">
                            Update Assignment
                        </Button>
                    </DialogActions>
                </Dialog>
            </ContentContainer>
        </DashboardContainer>
    );
}

export default PastRequestsPage;