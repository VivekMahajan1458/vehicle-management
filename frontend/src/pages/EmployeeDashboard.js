import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Chip,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Divider,
    Stack
} from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/en';

dayjs.locale('en');

function formatName(email) {
    if (!email) return "";
    const username = email.split('@')[0];
    const nameParts = username.split(/[._-]/).map(part => part.charAt(0).toUpperCase() + part.slice(1));
    return nameParts.join(' ');
}

function formatDate(dateString) {
    return dayjs(dateString).format('MMM DD, YYYY');
}

const SectionTitle = styled(Typography)({ marginBottom: '16px' });
const StyledChip = styled(Chip)(({ theme, status }) => ({
    marginRight: '8px',
    marginBottom: '8px',
    ...(status === 'Pending' && { backgroundColor: '#FF2C2C', color: 'white' }),
    ...(status === 'Approved' && { backgroundColor: theme.palette.success.main, color: 'white' }),
    ...(status === 'Hold' && { backgroundColor: '#FFBF00', color: 'black' }),
    ...((status === 'Cancelled' || status === 'Expired') && { backgroundColor: 'lightgray', color: 'black' }),
}));
const StyledPaper = styled(Paper)({ padding: '16px', marginBottom: '24px', width: '100%' });

function EmployeeDashboard() {
    const email = "vivekmahajan1103@gmail.com";
    const name = formatName(email);
    const navigate = useNavigate();

    const [allRequests, setAllRequests] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [timers, setTimers] = useState({});
    const [selectedRequestId, setSelectedRequestId] = useState(null);

    const handleLogoutClick = () => {
        localStorage.clear();
        navigate('/login');
    };

    const generateRequestId = () => Date.now();

    useEffect(() => {
        let storedRequests = JSON.parse(localStorage.getItem('requests') || '[]');

        if (storedRequests.length === 0) {
            const dummyData = [
                { id: generateRequestId(), date: dayjs().toISOString(), pickupTime: "09:00", purpose: 'Client Meeting', destination: 'Downtown Office', status: 'Pending', name: name, employeeId: email, pickupLocation: 'Office Parking', returnTime: '17:00', passengers: 2, notes: "Need a comfortable vehicle."},
                { id: generateRequestId(), date: dayjs().subtract(2, 'day').toISOString(), purpose: 'Past Meeting 1', destination: 'Old Office', status: 'Approved', name: name, employeeId: email, pickupLocation: "Office", pickupTime: "08:00", returnTime: "10:00", passengers: 1, notes: "", assignedDriver: { name: "Mukesh", phone: "" }, assignedVehicle: { number: "GJ01JT6723", type: "Bolero Camper"}},
                { id: generateRequestId(), date: dayjs().subtract(5, 'day').toISOString(), purpose: 'Past Lunch', destination: 'Food Court', status: 'Approved', name: name, employeeId: email, pickupLocation: "Office", pickupTime: "12:00", returnTime: "13:00", passengers: 3, notes: "", assignedDriver: { name: "Khema Ram", phone: "" }, assignedVehicle: { number: "GJ08CS5325", type: "Bolero Camper"}},
                { id: generateRequestId(), date: dayjs().subtract(10, 'day').toISOString(), purpose: 'Old Site Visit', destination: 'Site Beta', status: 'Cancelled', name: name, employeeId: email, pickupLocation: "Office", pickupTime: "10:00", returnTime: "16:00", passengers: 2, notes: "Project cancelled"},
            ];
            localStorage.setItem('requests', JSON.stringify(dummyData));
            storedRequests = dummyData;
        }

        setAllRequests(storedRequests);
        const loadedTimers = {};
        const now = Date.now();
        storedRequests.forEach(request => {
            if (request.status === 'Pending') {
                const timerKey = `timer_${request.id}`;
                let storedEndTime = localStorage.getItem(timerKey);
                let endTime;

                if (storedEndTime) {
                    endTime = parseInt(storedEndTime, 10);
                } else {
                    if (dayjs().diff(dayjs(request.id), 'day') < 1) {
                        endTime = Date.now() + (30 * 60 * 1000);
                        localStorage.setItem(timerKey, endTime.toString());
                    } else {
                         const index = storedRequests.findIndex(r => r.id === request.id);
                         if (index !== -1) storedRequests[index].status = 'Expired';
                         localStorage.setItem('requests', JSON.stringify(storedRequests));
                        return;
                    }
                }

                const remainingTimeMs = Math.max(0, endTime - now);
                if (remainingTimeMs > 0) {
                    loadedTimers[request.id] = { endTime, remainingTime: Math.ceil(remainingTimeMs / 1000), expired: false };
                } else {
                    const index = storedRequests.findIndex(r => r.id === request.id);
                    if (index !== -1 && storedRequests[index].status === 'Pending') {
                       storedRequests[index].status = 'Expired';
                       localStorage.setItem('requests', JSON.stringify(storedRequests));
                    }
                    localStorage.removeItem(timerKey);
                }
            }
        });
        setAllRequests([...storedRequests]);
        setTimers(loadedTimers);
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = Date.now();
            let timersChanged = false;
            const newlyExpiredRequestIds = [];
            let currentTimers = {};

            setTimers(prevTimers => {
                const updatedTimers = {...prevTimers};
                timersChanged = false;

                for (const requestIdStr in updatedTimers) {
                    const requestId = parseInt(requestIdStr, 10);
                    const timer = updatedTimers[requestIdStr];

                    if (!timer || timer.expired) continue;

                    const remainingTimeMs = Math.max(0, timer.endTime - now);
                    const newRemainingTimeSec = Math.ceil(remainingTimeMs / 1000);

                    if (newRemainingTimeSec <= 0) {
                        updatedTimers[requestIdStr] = { ...timer, expired: true, remainingTime: 0 };
                        localStorage.removeItem(`timer_${requestId}`);
                        newlyExpiredRequestIds.push(requestId);
                        timersChanged = true;
                    } else if (newRemainingTimeSec !== timer.remainingTime) {
                        updatedTimers[requestIdStr] = { ...timer, remainingTime: newRemainingTimeSec };
                        timersChanged = true;
                    }
                 }
                 if (timersChanged) {
                     return updatedTimers;
                 }
                 return prevTimers;
             });

            if (newlyExpiredRequestIds.length > 0) {
                setAllRequests(currentRequests => {
                    let statusChanged = false;
                    const requestsWithUpdatedStatus = currentRequests.map(req => {
                        if (newlyExpiredRequestIds.includes(req.id) && req.status === 'Pending') {
                            statusChanged = true;
                            return { ...req, status: 'Expired' };
                        }
                        return req;
                    });
                    if (statusChanged) {
                        localStorage.setItem('requests', JSON.stringify(requestsWithUpdatedStatus));
                        return requestsWithUpdatedStatus;
                    }
                    return currentRequests;
                });
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const handleCancelRequest = (requestId) => {
         setAllRequests(currentRequests => {
             const updated = currentRequests.map(req =>
                 req.id === requestId ? { ...req, status: 'Cancelled' } : req
             );
             localStorage.setItem('requests', JSON.stringify(updated));
             return updated;
         });

        localStorage.removeItem(`timer_${requestId}`);
        setTimers(prevTimers => {
            const newTimers = { ...prevTimers };
            delete newTimers[requestId];
            return newTimers;
        });

        if (selectedRequestId === requestId) {
            setSelectedRequestId(null);
        }
        alert(`Request Cancelled (ID: ${requestId})`);
    };

    const handleExpiredRequest = (requestId) => {
        navigate('/new-request');
    };

    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedRequest(null);
    };
    const handleRowClick = (requestId) => {
        setSelectedRequestId(requestId);
    };

    const activeRequests = allRequests.filter(req => req.status === 'Pending' || req.status === 'Expired');
    const pastRequests = allRequests.filter(req => req.status !== 'Pending' && req.status !== 'Expired').slice(0,3);

    return (
        <Box sx={{ p: 3 }}>
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
            {/* Header Section */}
            <Box sx={{ mb: 4, mt: 0.5 }}>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        fontWeight: 600,
                        color: '#2c3e50',
                        mb: 1
                    }}
                >
                    Dashboard
                </Typography>
                <Typography 
                    variant="subtitle1" 
                    sx={{ 
                        color: '#7f8c8d',
                        fontSize: '1.1rem'
                    }}
                >
                    Manage your vehicle requests and view assigned vehicles.
                </Typography>
            </Box>

            {/* Active Requests Section */}
            <StyledPaper>
                <SectionTitle variant="h6">Active Request</SectionTitle>
                {activeRequests.length > 0 ? (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Pickup Time</TableCell>
                                    <TableCell>Purpose</TableCell>
                                    <TableCell>Destination</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {activeRequests.map((request) => (
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
                                        <TableCell>{request.pickupTime}</TableCell>
                                        <TableCell>{request.purpose}</TableCell>
                                        <TableCell>{request.destination}</TableCell>
                                        <TableCell>
                                            <StyledChip
                                                label={request.status === 'Expired' ? 'Expired' : request.status}
                                                status={request.status}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {request.status === 'Pending' && timers[request.id] && !timers[request.id].expired && (
                                                <>
                                                    <Typography variant="body2" color={timers[request.id].remainingTime <= 300 ? "error" : "textSecondary"}>
                                                        Time Remaining: {Math.floor(timers[request.id].remainingTime / 60)}:
                                                        {String(timers[request.id].remainingTime % 60).padStart(2, '0')}
                                                    </Typography>
                                                    <Stack direction="row" spacing={1} sx={{mt: 1}}>
                                                      <Button size="small" variant="outlined" color="error" onClick={() => handleCancelRequest(request.id)}>Cancel</Button>
                                                      <Button size="small" variant="outlined" color="primary" onClick={() => handleViewDetails(request)}>View Details</Button>
                                                    </Stack>
                                                </>
                                            )}
                                            {request.status === 'Expired' && (
                                                 <Typography color="error" variant="body2">
                                                    Your Request wasn't accepted.
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleExpiredRequest(request.id)}
                                                        sx={{ ml: 1 }}
                                                    >
                                                        New Request?
                                                    </Button>
                                                 </Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography>No Active requests.</Typography>
                )}
            </StyledPaper>

            {/* Past Requests Section */}
            <StyledPaper>
                <SectionTitle variant="h6">Past Requests</SectionTitle>
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
                                    <TableCell>Actions</TableCell>
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
                                        <TableCell>{request.name}</TableCell>
                                        <TableCell>{request.purpose}</TableCell>
                                        <TableCell>{request.destination}</TableCell>
                                        <TableCell>{request.assignedDriver ? request.assignedDriver.name : 'N/A'}</TableCell>
                                        <TableCell>{request.assignedVehicle ? request.assignedVehicle.number : 'N/A'}</TableCell>
                                        <TableCell>
                                            <StyledChip
                                                label={request.status === 'Cancelled' ? "Not Approved" : request.status}
                                                status={request.status}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => handleViewDetails(request)}
                                            >
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography>No past requests.</Typography>
                )}
            </StyledPaper>

            {/* Request Details Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
                {selectedRequest && (
                    <>
                        <DialogTitle>Request Details (ID: {selectedRequest.id})</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Here are the details of the vehicle request:
                            </DialogContentText>
                            <TableContainer component={Paper} elevation={0}>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell><strong>Name:</strong></TableCell>
                                            <TableCell>{selectedRequest.name}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><strong>Employee ID:</strong></TableCell>
                                            <TableCell>{selectedRequest.employeeId}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><strong>Purpose:</strong></TableCell>
                                            <TableCell>{selectedRequest.purpose}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><strong>Destination:</strong></TableCell>
                                            <TableCell>{selectedRequest.destination}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><strong>Pickup Location:</strong></TableCell>
                                            <TableCell>{selectedRequest.pickupLocation}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><strong>Date:</strong></TableCell>
                                            <TableCell>{formatDate(selectedRequest.date)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><strong>Pickup Time:</strong></TableCell>
                                            <TableCell>{selectedRequest.pickupTime}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><strong>Return Time:</strong></TableCell>
                                            <TableCell>{selectedRequest.returnTime || 'Not specified'}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><strong>Passengers:</strong></TableCell>
                                            <TableCell>{selectedRequest.passengers}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><strong>Notes:</strong></TableCell>
                                            <TableCell>{selectedRequest.notes || 'No additional notes'}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><strong>Status:</strong></TableCell>
                                            <TableCell>
                                                <StyledChip
                                                    label={selectedRequest.status === 'Cancelled' ? "Not Approved" : selectedRequest.status}
                                                    status={selectedRequest.status}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        {selectedRequest.assignedDriver && (
                                            <TableRow>
                                                <TableCell><strong>Assigned Driver:</strong></TableCell>
                                                <TableCell>{selectedRequest.assignedDriver.name}</TableCell>
                                            </TableRow>
                                        )}
                                        {selectedRequest.assignedVehicle && (
                                            <TableRow>
                                                <TableCell><strong>Assigned Vehicle:</strong></TableCell>
                                                <TableCell>{selectedRequest.assignedVehicle.number}</TableCell>
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
            </motion.div>
        </Box>
    );
}

export default EmployeeDashboard;