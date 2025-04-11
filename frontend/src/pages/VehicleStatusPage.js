import React from 'react';
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
    color: 'white', // Set text color to white
    ...(status === 'Available' && { backgroundColor: '#4CAF50' }),
    ...(status === 'Busy' && { backgroundColor: '#FF9800' }),
    ...(status === 'In-Maintenance' && { backgroundColor: '#F44336' }),
}));

function VehicleStatusPage() {
    // Mock data for vehicles.  Updated models.
    const vehicles = [
        { id: 'V1001', model: 'Bolero', status: 'Available' },
        { id: 'V1002', model: 'Bolero', status: 'Busy' },
        { id: 'V1003', model: 'Bolero', status: 'In-Maintenance' },
        { id: 'V1004', model: 'Bolero-Camper', status: 'Available' },
        { id: 'V1005', model: 'Bolero-Camper', status: 'Busy' },
        { id: 'V1006', model: 'Bolero-Camper', status: 'Available' },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Vehicle Status
            </Typography>
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
    );
}

export default VehicleStatusPage;