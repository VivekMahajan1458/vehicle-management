import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, Button, Paper, TableContainer, styled, Chip } from '@mui/material';

// Styled Components for better styling
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    color: '#2c3e50',
}));

const StyledChip = styled(Chip)(({ status }) => ({
    color: 'white',
    backgroundColor: status === 'Approved' ? '#28a745' : status === 'Pending' ? '#ffc107' : status === 'Cancelled' ? '#dc3545' : '#6c757d',
}));

const EmpPastRequests = () => {
    const [selectedRequestId, setSelectedRequestId] = useState(null);

    // Dummy data for past requests
    const pastRequests = [
        {
            id: "1746010702330",
            date: "Apr 28, 2025",
            name: "Vivekmahajan1103",
            purpose: "Past Meeting 1",
            destination: "Old Office",
            assignedDriver: { name: "Mukesh" },
            assignedVehicle: { number: "GJ01JT6723" },
            status: "Approved",
        },
        {
            id: "1746010702331",
            date: "Apr 25, 2025",
            name: "Vivekmahajan1103",
            purpose: "Past Lunch",
            destination: "Food Court",
            assignedDriver: { name: "Khema Ram" },
            assignedVehicle: { number: "GJ08CS5325" },
            status: "Approved",
        },
    ];

    const handleRowClick = (requestId) => {
        setSelectedRequestId(requestId);
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };
    const handleViewDetails = (request) => {
        console.log("View Details",request);
    }

    return (
        <Box p={2} m={2} bgcolor="white" borderRadius={2}>
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{ marginLeft: "20px" }}
            >
                {/* Updated Header Section */}
                <Box sx={{ mb: 4 }}>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            fontWeight: 600,
                            color: '#2c3e50',
                            mb: 1
                        }}
                    >
                        Past Requests
                    </Typography>
                    <Typography 
                        variant="subtitle1" 
                        sx={{ 
                            color: '#7f8c8d',
                            fontSize: '1.1rem'
                        }}
                    >
                        View your previously submitted vehicle requests
                    </Typography>
                </Box>

                {/* Past Requests Section */}
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
            </motion.div>
        </Box>
    );
};

export default EmpPastRequests;