import React from 'react';
import { motion } from 'framer-motion';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    Chip,
} from '@mui/material';
import { styled } from '@mui/system';

const StyledChip = styled(Chip)(({ status }) => ({
    color: 'white',
    ...(status === 'Available' && { backgroundColor: '#4CAF50' }),
    ...(status === 'Busy' && { backgroundColor: '#FF9800' }),
    ...(status === 'In-Maintenance' && { backgroundColor: '#F44336' }),
}));

function VehicleStatusPage() {
    // Mock data for vehicles. Updated models.
    const vehicles = [
        { id: 'V1001', model: 'Bolero', status: 'Available' },
        { id: 'V1002', model: 'Bolero', status: 'Busy' },
        { id: 'V1003', model: 'Bolero', status: 'In-Maintenance' },
        { id: 'V1004', model: 'Bolero-Camper', status: 'Available' },
        { id: 'V1005', model: 'Bolero-Camper', status: 'Busy' },
        { id: 'V1006', model: 'Bolero-Camper', status: 'Available' },
    ];

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }} 
        >
            <Box sx={{ p: 3 }}>
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
                        Vehicle Status
                    </Typography>
                    <Typography 
                        variant="subtitle1" 
                        sx={{ 
                            color: '#7f8c8d',
                            fontSize: '1.1rem'
                        }}
                    >
                        View current status of all company vehicles
                    </Typography>
                </Box>

                <TableContainer component={Paper} elevation={3}>
                    <Table sx={{ minWidth: 650 }} aria-label="vehicle status table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Vehicle ID</TableCell>
                                <TableCell>Model</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {vehicles.map((vehicle) => (
                                <TableRow key={vehicle.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        {vehicle.id}
                                    </TableCell>
                                    <TableCell>{vehicle.model}</TableCell>
                                    <TableCell>
                                        <StyledChip label={vehicle.status} status={vehicle.status} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </motion.div>
    );
}

export default VehicleStatusPage;