// src/pages/PastRequestsPage.js
import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Chip, Paper, Button, Dialog, DialogTitle,
    DialogContent, DialogContentText, DialogActions, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, IconButton, Stack
} from '@mui/material';
import { styled, useTheme } from '@mui/system'; // Import useTheme
import { motion } from 'framer-motion';
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
    top: '20px', // Increase top margin slightly
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
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true); // State for sidebar visibility

    // --- Added handleLogoutClick ---
    const handleLogoutClick = () => {
        localStorage.clear();
        navigate('/login');
    };

    useEffect(() => {
        // --- Dummy Data for Testing ---
        const dummyRequests = [
            {
                id: 1,
                date: '2025-04-01T08:00:00Z',
                name: 'John Doe',
                employeeId: 'JD123',
                purpose: 'Client Meeting',
                destination: 'Ahmedabad',
                pickupLocation: 'Office',
                pickupTime: '09:00 AM',
                returnTime: '05:00 PM',
                passengers: 2,
                notes: 'Need a sedan.',
                status: 'Approved',
                assignedDriver: { name: 'Rajesh Kumar' },
                assignedVehicle: { number: 'GJ-01-AB-1234' },
            },
            {
                id: 2,
                date: '2025-04-03T10:00:00Z',
                name: 'Jane Smith',
                employeeId: 'JS456',
                purpose: 'Site Visit',
                destination: 'Gandhinagar',
                pickupLocation: 'Warehouse',
                pickupTime: '10:30 AM',
                returnTime: '04:00 PM',
                passengers: 3,
                notes: 'Need an SUV.',
                status: 'Cancelled',
                assignedDriver: null,
                assignedVehicle: null,
            },
            {
                id: 3,
                date: '2025-03-25T14:00:00Z',
                name: 'Peter Jones',
                employeeId: 'PJ789',
                purpose: 'Airport Drop-off',
                destination: 'Airport',
                pickupLocation: 'Guest House',
                pickupTime: '02:30 PM',
                returnTime: null,
                passengers: 1,
                notes: 'Urgent.',
                status: 'Expired',
                assignedDriver: { name: 'Sunil Patel' },
                assignedVehicle: { number: 'GJ-06-CD-5678' },
            },
            {
                id: 4,
                date: '2025-04-08T09:30:00Z',
                name: 'Alice Brown',
                employeeId: 'AB012',
                purpose: 'Training Session',
                destination: 'Training Center',
                pickupLocation: 'Office Lobby',
                pickupTime: '09:45 AM',
                returnTime: '01:00 PM',
                passengers: 4,
                notes: 'Need a spacious vehicle.',
                status: 'Approved',
                assignedDriver: { name: 'Priya Sharma' },
                assignedVehicle: { number: 'GJ-16-EF-9012' },
            },
            {
                id: 5,
                date: '2025-03-15T11:00:00Z',
                name: 'David Wilson',
                employeeId: 'DW345',
                purpose: 'Meeting with Vendor',
                destination: 'Vadodara Central',
                pickupLocation: 'Factory Gate',
                pickupTime: '11:15 AM',
                returnTime: '03:30 PM',
                passengers: 2,
                notes: 'Need a reliable car.',
                status: 'Cancelled',
                assignedDriver: null,
                assignedVehicle: null,
            },
        ];

        // Filter for past statuses and sort
        const past = dummyRequests
            .filter(req => ['Approved', 'Cancelled', 'Expired'].includes(req.status))
            .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending

        setPastRequests(past);

        // Remove the localStorage logic for dummy data
        // const storedRequests = JSON.parse(localStorage.getItem('requests') || '[]');
        // const past = storedRequests
        //     .filter(req => ['Approved', 'Cancelled', 'Expired'].includes(req.status)) // Filter for past statuses
        //     .sort((a, b) => b.id - a.id); // Sort newest first

        // setPastRequests(past);
    }, []);

    const handleViewDetails = (request) => {
        console.log("Viewing details for request:", request); // ADD THIS LOG
        setSelectedRequest(request);
        setOpenDialog(true);
    };;

    const handleCloseDialog = () => {
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
                                            <TableCell>Destination</TableCell>
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
                                                <TableCell>{request.destination}</TableCell>
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
                                                            onClick={(e) => { e.stopPropagation(); handleViewDetails(request); }}
                                                        >
                                                            View Details
                                                        </Button>
                                                        {/* Add "Edit Assignment" button here later */}
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
                <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
                    {selectedRequest && ( // Render content only if selectedRequest is not null
                        <>
                            <DialogTitle>Request Details (ID: {selectedRequest.id})</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Here are the details of the vehicle request:
                                </DialogContentText>
                                <TableContainer component={Paper} elevation={0} sx={{ mt: 2 }}> {/* Added margin-top */}
                                    <Table size="small"> {/* Use small size for potentially better fit */}
                                        <TableBody>
                                            {/* Ensure all these fields exist on your request objects */}
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
                                                        // Display "Not Approved" correctly for Cancelled/Expired
                                                        label={selectedRequest.status === 'Cancelled' || selectedRequest.status === 'Expired' ? "Not Approved" : selectedRequest.status}
                                                        status={selectedRequest.status}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                            {selectedRequest.assignedDriver && (<TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none' }}>Assigned Driver:</TableCell>
                                                    <TableCell sx={{ borderBottom: 'none' }}>{selectedRequest.assignedDriver.name}</TableCell>
                                                </TableRow>
                                            )}
                                            {selectedRequest.assignedVehicle && (
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none' }}>Assigned Vehicle:</TableCell>
                                                    <TableCell sx={{ borderBottom: 'none' }}>{selectedRequest.assignedVehicle.number}</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDialog} color="primary">Close</Button>
                            </DialogActions>
                        </>
                    )}
                </Dialog>
            </ContentContainer>
        </DashboardContainer>
    );
}

export default PastRequestsPage;