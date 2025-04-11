import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Chip, Paper, Button, Dialog, DialogTitle,
    DialogContent, DialogContentText, DialogActions, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Divider, IconButton,
    Stack, Select, FormControl, InputLabel, MenuItem
} from '@mui/material';
import { styled, useTheme } from '@mui/system';
import { motion } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import VMSidebar from '../components/VMSidebar';

dayjs.locale('en');

// Helper functions (Keep as is)
function formatName(email) {
    if (!email) return "";
    const username = email.split('@')[0];
    const nameParts = username.split(/[._-]/).map(part => part.charAt(0).toUpperCase() + part.slice(1));
    return nameParts.join(' ');
}

function formatDate(dateString) {
    return dayjs(dateString).format('MMM DD, YYYY'); // Changed format slightly for clarity
}

const drawerWidth = 240;

// Styled components (Keep as is)
const DashboardContainer = styled(Box)({
    display: 'flex',
    width: '100%',
    minHeight: '100vh', // Ensure container takes full height
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

const SectionTitle = styled(Typography)({ marginBottom: '16px' });

const StyledChip = styled(Chip)(({ theme, status }) => ({
    marginRight: '8px',
    marginBottom: '8px',
    ...(status === 'Pending' && { backgroundColor: '#FF2C2C', color: 'white' }),
    ...(status === 'Approved' && { backgroundColor: theme.palette.success.main, color: 'white' }),
    ...(status === 'Hold' && { backgroundColor: '#FFBF00', color: 'black' }),
    ...((status === 'Cancelled' || status === 'Expired') && { backgroundColor: theme.palette.grey[400], color: 'black' }),
}));

const StyledPaper = styled(Paper)({ padding: '16px', marginBottom: '24px', width: '100%', boxSizing: 'border-box', overflowX: 'auto' });

// Hamburger Button (Keep as is)
const HamburgerButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed', // Keep fixed position
  left: '20px', // Increase left margin 
  top: '20px', // Increase top margin slightly
  zIndex: theme.zIndex.drawer + 1,
  display: { xs: 'block', sm: 'none' }, // Show only on small screens
  backgroundColor: 'white', // Make more visible
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Add subtle shadow
  '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
  }
}));

function VehicleManagerDashboard() {
    const theme = useTheme();
    const email = "managermeil@gmail.com";
    const name = formatName(email);
    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [heldRequests, setHeldRequests] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [assignVehicleDialogOpen, setAssignVehicleDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true); // Keep sidebar state
    const [selectedRequestId, setSelectedRequestId] = useState(null); // Keep for row highlighting if needed
    const [selectedDriver, setSelectedDriver] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [driverDetails, setDriverDetails] = useState({ name: '', phone: '' });
    const [vehicleDetails, setVehicleDetails] = useState({ type: '', number: '' });
    const [showDriverVehicleDetails, setShowDriverVehicleDetails] = useState(false);


    const drivers = [
        { id: 'driver-1', name: 'Mukesh', phone: '8307618187' },
        { id: 'driver-2', name: 'Khema Ram', phone: '9799889868' },
        { id: 'driver-3', name: 'Monu', phone: '9636320520' },
        { id: 'driver-4', name: 'Dharmendra', phone: '9571846773' },
        { id: 'driver-5', name: 'Gopal', phone: '7014229176' },
        { id: 'driver-6', name: 'Jyoti Bhushan', phone: '9136557387' },
        { id: 'driver-7', name: 'Amit', phone: '8303654036' },
        { id: 'driver-8', name: 'Irfan Pathan', phone: '7850887676' },
      ];

    const vehicles = [
        { id: 'vehicle-GJ01JT6723', number: 'GJ01JT6723', type: 'Bolero Camper' },
        { id: 'vehicle-GJ08CS5325', number: 'GJ08CS5325', type: 'Bolero Camper' },
        { id: 'vehicle-RJ13UB1492', number: 'RJ13UB1492', type: 'Bolero' },
        { id: 'vehicle-RJ01TA4584', number: 'RJ01TA4584', type: 'Bolero' },
        { id: 'vehicle-GJ01WG3715', number: 'GJ01WG3715', type: 'Bolero' },
        { id: 'vehicle-GJ01WD9880', number: 'GJ01WD9880', type: 'INNOVA' },
        { id: 'vehicle-GJ01WD9754', number: 'GJ01WD9754', type: 'INNOVA' },
      ];  

    // Removed profile menu state/handlers

    const handleLogoutClick = () =>  {

            localStorage.clear();
        
            navigate('/login');
        
          };
    const generateRequestId = () => Date.now();

    // --- UPDATED useEffect: Load requests and filter ONLY Pending and Held ---
    useEffect(() => {
        let storedRequests = JSON.parse(localStorage.getItem('requests') || '[]');

        // Dummy data logic (keep as is for now)
        if (storedRequests.length === 0) {
             const dummyData = [
                { id: generateRequestId(), date: dayjs().toISOString(), pickupTime: "09:00", purpose: 'Client Meeting', destination: 'Downtown Office', status: 'Pending', name:"John Doe", employeeId:"12345", pickupLocation: 'Office Parking', returnTime: '17:00', passengers: 2, notes:"Need a comfortable vehicle."},
                { id: generateRequestId(), date: dayjs().subtract(1,'hour').toISOString(), pickupTime: "14:00", purpose: 'Site Visit', destination: 'Factory A', status: 'Pending',name:"Jane Smith", employeeId:"22222", pickupLocation: 'Main Entrance',returnTime: "15:00", passengers:5, notes:"SomeThing" },
                { id: generateRequestId(), date: dayjs().subtract(1, 'day').toISOString(), pickupTime: "10:00", purpose: 'Inventory Check', destination: 'Warehouse B', status: 'Hold', name:"Alice Green", employeeId:"67890", pickupLocation: 'Loading Bay', returnTime: '11:00', passengers: 1, notes:"Quick check needed"},
                // Dummy approved request removed, as it belongs in PastRequestsPage
            ];
            localStorage.setItem('requests', JSON.stringify(dummyData));
            storedRequests = dummyData;
        }

        // Filter only into Pending and Held
        const pending = storedRequests.filter(req => req.status === 'Pending');
        const held = storedRequests.filter(req => req.status === 'Hold');
        // Removed filtering for past requests

        setRequests(pending);
        setHeldRequests(held);
        // setPastRequests(past); // *** REMOVED setting pastRequests state ***

    }, []);

    // --- UPDATED Handlers to remove pastRequests logic ---
    const handleApprove = (requestId) => {
        const requestToApprove = requests.find(req => req.id === requestId) || heldRequests.find(req => req.id === requestId);
        if (requestToApprove) {
            setSelectedRequest(requestToApprove);
            setAssignVehicleDialogOpen(true);
        }
    };

    const handleCloseAssignVehicleDialog = () =>  {
        setAssignVehicleDialogOpen(false);
        setSelectedRequest(null);
        setSelectedDriver('');
        setSelectedVehicle('');
        setShowDriverVehicleDetails(false);
        setDriverDetails({ name: '', phone: '' });
        setVehicleDetails({ type: '', number: '' });
      };

    const handleConfirmAssignment = () => {
        if (!selectedRequest || !selectedDriver || !selectedVehicle) 
            { alert("Please select both..."); 
                return; 
            }
        const storedRequests = JSON.parse(localStorage.getItem('requests') || '[]');
        const updatedRequests = storedRequests.map(req => {
            if (req.id === selectedRequest.id) {
              const assignedDriver = drivers.find(d => d.id === selectedDriver);
              const assignedVehicle = vehicles.find(v => v.id === selectedVehicle);
              return {
                ...req,
                status: 'Approved',
                assignedDriver: { name: assignedDriver.name, phone: assignedDriver.phone },
                assignedVehicle: { number: assignedVehicle.number, type: assignedVehicle.type }
              };
            }
            return req;
          });
        localStorage.setItem('requests', JSON.stringify(updatedRequests));

        // Re-filter and update ONLY requests and heldRequests state
        setRequests(updatedRequests.filter(req => req.status === 'Pending'));
        setHeldRequests(updatedRequests.filter(req => req.status === 'Hold'));
        // setPastRequests(...) // *** REMOVED ***
        handleCloseAssignVehicleDialog();
    };

    const handleDriverChange = (event) => {
        const driverId = event.target.value;
        setSelectedDriver(driverId);
        
        if (driverId) {
          const driver = drivers.find(d => d.id === driverId);
          setDriverDetails({ name: driver.name, phone: driver.phone });
        } else {
          setDriverDetails({ name: '', phone: '' });
        }
        
        setShowDriverVehicleDetails(Boolean(driverId && selectedVehicle));
      };

      const handleVehicleChange = (event) => {
        const vehicleId = event.target.value;
        setSelectedVehicle(vehicleId);
        
        if (vehicleId) {
          const vehicle = vehicles.find(v => v.id === vehicleId);
          setVehicleDetails({ type: vehicle.type, number: vehicle.number });
        } else {
          setVehicleDetails({ type: '', number: '' });
        }
        
        setShowDriverVehicleDetails(Boolean(selectedDriver && vehicleId));
      };
      
      const handleViewDriverVehicleDetails = () => {
        setShowDriverVehicleDetails(!showDriverVehicleDetails);
      };

    const handleHold = (requestId) => {
        const storedRequests = JSON.parse(localStorage.getItem('requests') || '[]');
        const updatedRequests = storedRequests.map(req => req.id === requestId ? { ...req, status: 'Hold' } : req );
        localStorage.setItem('requests', JSON.stringify(updatedRequests));

        // Re-filter and update ONLY requests and heldRequests state
        setRequests(updatedRequests.filter(req => req.status === 'Pending'));
        setHeldRequests(updatedRequests.filter(req => req.status === 'Hold'));
         // setPastRequests(...) // *** REMOVED ***
    };

    const handleViewDetails = (request) => {
        console.log("Viewing details for request:", request); // Debugging log
        setSelectedRequest(request);
        setOpenDialog(true); // This opens the dialog
      };
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedRequest(null); // Important: reset the selected request
      };
    const handleRowClick = (requestId) => { /* ... keep as is ... */ };

// ** END OF PART 1 **
return (
  <DashboardContainer>
      <HamburgerButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          edge="start"
      >
          <MenuIcon />
      </HamburgerButton>

      <VMSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} handleLogout={handleLogoutClick} />

      <ContentContainer open={sidebarOpen}> {/* Use 'open' prop for styled component */}
           <Box sx={{ mb: 3, pt: { xs: 6, sm: 0 } }}>
              <Typography variant="h5">Welcome, {name}</Typography>
           </Box>

          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Typography variant="h4" gutterBottom>
                  Vehicle Manager Dashboard
              </Typography>

              {/* Active Requests Table */}
              <StyledPaper>
                   <SectionTitle variant="h6">Active Requests</SectionTitle>
                   {requests.length === 0 ? ( <Typography>No pending requests.</Typography> ) : (
                      <TableContainer>
                          <Table>
                              <TableHead>
                                  <TableRow>
                                      <TableCell>ID</TableCell>
                                      <TableCell>Date</TableCell>
                                      <TableCell>Requester</TableCell>
                                      <TableCell>Purpose</TableCell>
                                      <TableCell>Destination</TableCell>
                                      <TableCell>Status</TableCell>
                                      <TableCell align="right">Actions</TableCell>
                                  </TableRow>
                              </TableHead>
                              <TableBody>
                                  {requests.map((request) => (
                                      <TableRow key={request.id} onClick={() => handleRowClick(request.id)} sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer', backgroundColor: selectedRequestId === request.id ? '#f5f5f5' : 'inherit' }}>
                                          <TableCell>{request.id}</TableCell>
                                          <TableCell>{formatDate(request.date)}</TableCell>
                                          <TableCell>{request.name}</TableCell>
                                          <TableCell>{request.purpose}</TableCell>
                                          <TableCell>{request.destination}</TableCell>
                                          <TableCell><StyledChip status={request.status} label={request.status} /></TableCell>
                                          <TableCell align="right">
                                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                  <Button size="small" variant="outlined" color="primary" onClick={(e) => { e.stopPropagation(); handleViewDetails(request); }}>View Details</Button>
                                                  <Button size="small" variant="contained" color="success" onClick={(e) => { e.stopPropagation(); handleApprove(request.id); }}>Approve</Button>
                                                  <Button size="small" variant="contained" sx={{ bgcolor: "#FFBF00", color: 'black', '&:hover': { bgcolor: '#FFAE00' } }} onClick={(e) => { e.stopPropagation(); handleHold(request.id); }}>Hold</Button>
                                              </Stack>
                                          </TableCell>
                                      </TableRow>
                                  ))}
                              </TableBody>
                          </Table>
                      </TableContainer>
                   )}
              </StyledPaper>

              {/* Held Requests Section */}
              <StyledPaper>
                   <SectionTitle variant="h6">Held Requests</SectionTitle>
                   {heldRequests.length === 0 ? ( <Typography>No requests currently on hold.</Typography> ) : (
                       <TableContainer>
                           <Table>
                               <TableHead>
                                   <TableRow>
                                       <TableCell>ID</TableCell>
                                       <TableCell>Date</TableCell>
                                       <TableCell>Requester</TableCell>
                                       <TableCell>Purpose</TableCell>
                                       <TableCell>Destination</TableCell>
                                       <TableCell>Status</TableCell>
                                       <TableCell align="right">Actions</TableCell>
                                   </TableRow>
                               </TableHead>
                               <TableBody>
                                   {heldRequests.map((request) => (
                                       <TableRow key={request.id} onClick={() => handleRowClick(request.id)} sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer', backgroundColor: selectedRequestId === request.id ? '#f5f5f5' : 'inherit' }}>
                                           <TableCell>{request.id}</TableCell>
                                           <TableCell>{formatDate(request.date)}</TableCell>
                                           <TableCell>{request.name}</TableCell>
                                           <TableCell>{request.purpose}</TableCell>
                                           <TableCell>{request.destination}</TableCell>
                                           <TableCell><StyledChip status={request.status} label={request.status} /></TableCell>
                                           <TableCell align="right">
                                               <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                   <Button size="small" variant="outlined" color="primary" onClick={(e) => { e.stopPropagation(); handleViewDetails(request); }}>View Details</Button>
                                                   <Button size="small" variant="contained" color="success" onClick={(e) => { e.stopPropagation(); handleApprove(request.id); }}>Approve</Button>
                                               </Stack>
                                           </TableCell>
                                       </TableRow>
                                   ))}
                               </TableBody>
                           </Table>
                       </TableContainer>
                   )}
               </StyledPaper>

               {/* *** PAST REQUESTS SECTION REMOVED *** */}

           </motion.div>

           {/* Dialogs (Keep as they were) */}
           <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
               {selectedRequest && (
                   <>
                      <DialogTitle>Request Details (ID: {selectedRequest.id})</DialogTitle>
                             <DialogContent>
                                 <DialogContentText>Here are the details of the vehicle request:</DialogContentText>
                                 {/* *** ENSURE THIS TABLE IS PRESENT AND CORRECT *** */}
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
                                                         label={selectedRequest.status === 'Cancelled' ? "Not Approved" : selectedRequest.status}
                                                         status={selectedRequest.status}
                                                     />
                                                 </TableCell>
                                             </TableRow>
                                             {/* Conditionally render driver/vehicle */}
                                             {selectedRequest.assignedDriver && (
                                                <TableRow>
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
           <Dialog open={assignVehicleDialogOpen} onClose={handleCloseAssignVehicleDialog} fullWidth maxWidth="sm">
               {selectedRequest && (    
                   <>
                      <DialogTitle>
        Assign Driver & Vehicle - Request #{selectedRequest.id}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Please assign a driver and vehicle for this request.
        </DialogContentText>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Request Information
          </Typography>
          <Box sx={{ pl: 1 }}>
            <Typography variant="body2">
              <strong>Destination:</strong> {selectedRequest.destination}
            </Typography>
            <Typography variant="body2">
              <strong>Date:</strong> {formatDate(selectedRequest.date)}
            </Typography>
            <Typography variant="body2">
              <strong>Time:</strong> {selectedRequest.pickupTime}
            </Typography>
            <Typography variant="body2">
              <strong>Passengers:</strong> {selectedRequest.passengers}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="driver-select-label">Driver</InputLabel>
          <Select
            labelId="driver-select-label"
            id="driver-select"
            value={selectedDriver}
            label="Driver"
            onChange={handleDriverChange}
          >
            <MenuItem value=""><em>Select a driver</em></MenuItem>
            {drivers.map((driver) => (
              <MenuItem key={driver.id} value={driver.id}>
                {driver.name} - {driver.phone}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="vehicle-select-label">Vehicle</InputLabel>
          <Select
            labelId="vehicle-select-label"
            id="vehicle-select"
            value={selectedVehicle}
            label="Vehicle"
            onChange={handleVehicleChange}
          >
            <MenuItem value=""><em>Select a vehicle</em></MenuItem>
            {vehicles.map((vehicle) => (
              <MenuItem key={vehicle.id} value={vehicle.id}>
                {vehicle.number} - {vehicle.type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {selectedDriver && selectedVehicle && (
          <Box sx={{ mt: 2 }}>
            <Button
              size="small"
              onClick={handleViewDriverVehicleDetails}
              sx={{ mb: 1 }}
            >
              {showDriverVehicleDetails ? "Hide Details" : "Show Details"}
            </Button>
            
            {showDriverVehicleDetails && (
              <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="subtitle2">Driver Details:</Typography>
                <Typography variant="body2">Name: {driverDetails.name}</Typography>
                <Typography variant="body2">Phone: {driverDetails.phone}</Typography>
                
                <Typography variant="subtitle2" sx={{ mt: 1 }}>Vehicle Details:</Typography>
                <Typography variant="body2">Number: {vehicleDetails.number}</Typography>
                <Typography variant="body2">Type: {vehicleDetails.type}</Typography>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseAssignVehicleDialog}>Cancel</Button>
        <Button 
          onClick={handleConfirmAssignment}
          variant="contained" 
          color="primary"
          disabled={!selectedDriver || !selectedVehicle}
        >
          Confirm Assignment
        </Button>
      </DialogActions>
                  </>
              )}
          </Dialog>

      </ContentContainer>
  </DashboardContainer>
);
}

export default VehicleManagerDashboard;