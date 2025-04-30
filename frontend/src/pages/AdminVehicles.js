import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  useMediaQuery,
  useTheme,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  InputAdornment,
  Fab,
  Tooltip,
  Card,
  CardContent,
  Divider,
  Menu,
  MenuItem,
  Pagination

} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled, alpha } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

// Styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  border: 'none',
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  maxWidth: '100%', // This will make it take full width
  overflowX: 'auto',
  backgroundColor: theme.palette.background.paper,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
  },
  '&:nth-of-type(odd)': {
    backgroundColor: alpha(theme.palette.primary.light, 0.03),
  },
}));

const StyledTableHeader = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  padding: theme.spacing(2),
  whiteSpace: 'nowrap'
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2),
  whiteSpace: 'nowrap'
}));

// Updated SearchField to have a fixed width
const SearchField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  width: '300px', // Fixed width instead of 100%
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 2,
  }
}));

const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  zIndex: 1000,
}));

const VehicleCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6],
  }
}));

const AdminVehicles = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const showCards = isMobile || isTablet;
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentVehicle, setCurrentVehicle] = useState({ id: null, vehicleNo: '', type: '', department: '' });
    const [errors, setErrors] = useState({ vehicleNo: '', type: '', department: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [vehicles, setVehicles] = useState([
    { id: 1, vehicleNo: "GJ01JT6723", type: "Bolero Camper", department: "Admin" },
    { id: 2, vehicleNo: "GJ08CS5325", type: "Bolero Camper", department: "Admin" },
    { id: 3, vehicleNo: "RJ13UB1492", type: "Bolero", department: "Admin" },
    { id: 4, vehicleNo: "RJ01TA4584", type: "Bolero", department: "QA / QC" },
    { id: 5, vehicleNo: "GJ01WG3715", type: "Bolero", department: "General Manager" },
    { id: 6, vehicleNo: "GJ01WD9880", type: "INNOVA", department: "RCM" },
    { id: 7, vehicleNo: "GJ01WD9754", type: "INNOVA", department: "RPD" },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const vehiclesPerPage = 5;
    // Menu handlers
    const handleMenuOpen = (event, vehicleId) => {
        setMenuAnchorEl(event.currentTarget);
        setSelectedVehicleId(vehicleId);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setSelectedVehicleId(null);
    };

    // Form input handlers
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCurrentVehicle({ ...currentVehicle, [name]: value });
        validateField(name, value);
    };

    // Field validation
    const validateField = (name, value) => {
        let error = '';

        if (name === 'vehicleNo') {
            if (!value.trim()) {
                error = 'Vehicle number is required';
            } else if (value.length < 2) {
                error = 'Vehicle number must be at least 2 characters';
            }
        } else if (name === 'type') {
            if (!value.trim()) {
                error = 'Type is required';
            }
        } else if (name === 'department') {
            if (!value.trim()) {
                error = 'Department is required';
            }
        }

        setErrors({ ...errors, [name]: error });
        return !error;
    };

    // Form validation
    const validateForm = () => {
        const vehicleNoValid = validateField('vehicleNo', currentVehicle.vehicleNo);
        const typeValid = validateField('type', currentVehicle.type);
        const departmentValid = validateField('department', currentVehicle.department);
        return vehicleNoValid && typeValid && departmentValid;
    };

    // Add new vehicle
    const handleAddVehicle = () => {
        if (validateForm()) {
            const newVehicle = {
                id: Math.max(...vehicles.map(v => v.id), 0) + 1,
                vehicleNo: currentVehicle.vehicleNo,
                type: currentVehicle.type,
                department: currentVehicle.department
            };

            setVehicles([...vehicles, newVehicle]);
            setIsAddDialogOpen(false);
            setCurrentVehicle({ id: null, vehicleNo: '', type: '', department: '' });
            setSnackbar({ open: true, message: 'Vehicle added successfully!', severity: 'success' });
        }
    };

    // Dialog handlers
    const handleAddDialogOpen = () => {
        setCurrentVehicle({ id: null, vehicleNo: '', type: '', department: '' });
        setErrors({ vehicleNo: '', type: '', department: '' });
        setIsAddDialogOpen(true);
    };

    const handleCloseDialogs = () => {
        setIsAddDialogOpen(false);
        setIsEditDialogOpen(false);
        setIsDeleteDialogOpen(false);
    };

  // Filter vehicles based on search query
  const [filteredVehicles, setFilteredVehicles] = useState(vehicles);
    
    useEffect(() => {
        const filtered = vehicles.filter(vehicle => 
          vehicle.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vehicle.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vehicle.department.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredVehicles(filtered);
      }, [searchQuery, vehicles]);

  // Pagination
    const paginatedVehicles = filteredVehicles.slice(
      (page - 1) * rowsPerPage,
      page * rowsPerPage
    );


      // Edit vehicle
      const handleEditClick = (vehicle) => {
        setCurrentVehicle({ ...vehicle });
        setIsEditDialogOpen(true);
        handleMenuClose();
    };

    const handleUpdateVehicle = () => {
        if (validateForm()) {
            const updatedVehicles = vehicles.map(vehicle =>
                vehicle.id === currentVehicle.id ? currentVehicle : vehicle
            );

            setVehicles(updatedVehicles);
            setIsEditDialogOpen(false);
            setSnackbar({ open: true, message: 'Vehicle updated successfully!', severity: 'success' });
        }
    };

      // Delete vehicle
      const handleDeleteClick = (id) => {
        const vehicleToDelete = vehicles.find(vehicle => vehicle.id === id);
        setCurrentVehicle(vehicleToDelete);
        setIsDeleteDialogOpen(true);
        handleMenuClose();
    };

    const handleDeleteVehicle = () => {
        const updatedVehicles = vehicles.filter(vehicle => vehicle.id !== currentVehicle.id);
        setVehicles(updatedVehicles);
        setIsDeleteDialogOpen(false);
        setSnackbar({ open: true, message: 'Vehicle deleted successfully!', severity: 'warning' });
    };

    // Snackbar handler
    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Pagination handler
    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    return (
    <Box sx = {{ 
        display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', position: 'relative'
      }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ 
            fontWeight: 700, 
            color: '#2c3e50',
            position: 'relative',
            mb: 1,
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: 60,
              height: 4,
              backgroundColor: '#6366F1',
              borderRadius: 2
            }
          }}
        >
          Vehicles
        </Typography>   
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          Manage your vehicle roster with ease
        </Typography>
      </Box>

      {/* Search and Add Section - FIXED FOR RIGHT ALIGNMENT */}
      <Box sx={{
        width: '100%',
        mb: 3,
        display: 'flex',
        justifyContent: 'space-between', // This ensures the child elements are pushed to edges
        alignItems: 'center',
      }}>
        {/* Search field with fixed width */}
        <SearchField
          placeholder="Search vehicles..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value) }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ), 
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery('')}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        {/* Button explicitly placed at the right */}
        <Button
          variant="contained"
          color="primary"
            startIcon={<PersonAddIcon />}
            onClick={handleAddDialogOpen}
          sx={{ 
            borderRadius: theme.shape.borderRadius * 2,
            px: 3,
            py: 1,
          }}
        >
          ADD VEHICLE
        </Button>
      </Box>
      {/* Main Content - Conditional Table or Cards */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: '100%', mb: 2 }}>
      <Grid container spacing={3} sx={{ width: '100%', maxwidth: '100%', margin: 0, padding: 0 }}>
        {showCards ? (
          // Card view for mobile and tablet
              filteredVehicles.length > 0 ? (
              paginatedVehicles.map((vehicle) => (
                <Grid item xs={12}
                sx={{ 
                  width: '100%', 
                  padding: 0 
                }}
                 sm={6} key={vehicle.id}>
                  <VehicleCard elevation={3}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mt:'auto', mb: 4, pt: 2, width: '100%'}}>
                        <Typography variant="h6" component="h2" gutterBottom>
                             {vehicle.vehicleNo}
                        </Typography>
                        <IconButton
                          size="small" 
                          onClick={(e) => handleMenuOpen(e, vehicle.id)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body1" color="text.secondary">
                        <strong>Type:</strong> {vehicle.type}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        <strong>Department:</strong> {vehicle.department}
                      </Typography>
                    </CardContent>
                  </VehicleCard>

                </Grid>
              ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No vehicles found matching your search.
                </Typography>
              </Paper>
            </Grid>
          )
        ) : (
          // Table view for desktop
            <Grid item xs={12}>
              <StyledTableContainer component={Paper}
               sx={{ 
                width: '100% !important',

                maxWidth: 'none !important',
                margin: '0 !important' }}>
                <Table sx={{ width: '100% !important', tableLayout: 'fixed' }}>
                <TableHead>
                  <TableRow>
                    <StyledTableHeader>Vehicle No.</StyledTableHeader>
                    <StyledTableHeader>Type</StyledTableHeader>
                    <StyledTableHeader>Department</StyledTableHeader>
                    <StyledTableHeader align="right">Actions</StyledTableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                {filteredVehicles.length > 0 ? (
                  paginatedVehicles.map((vehicle) => (

                    <StyledTableRow key={vehicle.id}>
                      <StyledTableCell>{vehicle.vehicleNo}</StyledTableCell>
                      <StyledTableCell>{vehicle.type}</StyledTableCell>
                      <StyledTableCell>{vehicle.department}</StyledTableCell>
                      <StyledTableCell align="right">
                        <Tooltip title="Edit">
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleEditClick(vehicle)}
                                aria-label="edit driver"
                            >

                                                        
                           <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            size="small" 
                            color="error"
                              onClick={() => handleDeleteClick(vehicle.id)}
                            aria-label="delete vehicle"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>

                        </Tooltip>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        No vehicles found matching your search.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </Grid>
        )}
      </Grid>
      </Box>

      {/* Pagination */}
      {/* Pagination and Page Number */}
      {filteredVehicles.length > rowsPerPage && !showCards && (
          <Box sx={{ mt: 'auto', mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', pt: 2 }}>
              <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
              >
                  Page: {page}
              </Typography>
              <Pagination
                  count={Math.ceil(filteredVehicles.length / rowsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
              />
          </Box>
      )}
        {/* Mobile FAB for adding */}
        {isMobile && (
            <StyledFab
                color="primary"
                aria-label="add"
                onClick={handleAddDialogOpen}
            >
                <AddIcon />
            </StyledFab>
        )}

        {/* Context Menu */}
        <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={() => {
                const vehicle = vehicles.find(v => v.id === selectedVehicleId);
                handleEditClick(vehicle);
            }}>
                <EditIcon fontSize="small" sx={{ mr: 1 }} />
                Edit
            </MenuItem>
            <MenuItem onClick={() => handleDeleteClick(selectedVehicleId)}>
                <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                Delete
            </MenuItem>
        </Menu>

            {/* Add Vehicle Dialog */}
            <Dialog open={isAddDialogOpen} onClose={handleCloseDialogs} fullWidth maxWidth="sm">
                <DialogTitle>Add New Vehicle</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Please enter the details of the new vehicle.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="vehicleNo"
                        label="Vehicle No."
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={currentVehicle.vehicleNo}
                        onChange={handleInputChange}
                        error={!!errors.vehicleNo}
                        helperText={errors.vehicleNo}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="type"
                        label="Type"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={currentVehicle.type}
                        onChange={handleInputChange}
                        error={!!errors.type}
                        helperText={errors.type}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="department"
                        label="Department"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={currentVehicle.department}
                        onChange={handleInputChange}
                        error={!!errors.department}
                        helperText={errors.department}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseDialogs} color="inherit">Cancel</Button>
                    <Button onClick={handleAddVehicle} variant="contained" color="primary">Add Vehicle</Button>
                </DialogActions>
            </Dialog>


            {/* Edit Vehicle Dialog */}
            <Dialog open={isEditDialogOpen} onClose={handleCloseDialogs} fullWidth maxWidth="sm">
                <DialogTitle>Edit Vehicle</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Update the vehicle's information.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="vehicleNo"
                        label="Vehicle No."
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={currentVehicle.vehicleNo}
                        onChange={handleInputChange}
                        error={!!errors.vehicleNo}
                        helperText={errors.vehicleNo}
                        sx={{ mb: 2 }}
                    />
                        <TextField
                          margin="dense"
                          name="type"
                          label="Type"
                          type="text"
                          fullWidth
                          variant="outlined"
                          value={currentVehicle.type}
                          onChange={handleInputChange}
                          error={!!errors.type}
                          helperText={errors.type}
                           sx={{ mb: 2 }}
                        />
                        <TextField
                          margin="dense"
                          name="department"
                          label="Department"
                          type="text"
                          fullWidth
                          variant="outlined"
                          value={currentVehicle.department}
                          onChange={handleInputChange}
                          error={!!errors.department}
                          helperText={errors.department}
                          sx={{ mb: 2 }}
                        />

                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseDialogs} color="inherit">Cancel</Button>
                    <Button onClick={handleUpdateVehicle} variant="contained" color="primary">Update</Button>
                </DialogActions>
            </Dialog>
            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onClose={handleCloseDialogs}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete vehicle "{currentVehicle.vehicleNo}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseDialogs} color="inherit">Cancel</Button>
                    <Button onClick={handleDeleteVehicle} variant="contained" color="error">Delete</Button>
                </DialogActions>
            </Dialog>
            {/* Snackbar for notifications */}
            <Snackbar 
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
  );
};

export default AdminVehicles;