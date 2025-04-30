import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  useMediaQuery,
  useTheme,
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
import { styled, alpha } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

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

const DriverCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6],
  }
}));

const AdminDrivers = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const showCards = isMobile || isTablet;
  
  // Initial data
  const initialDriversData = [
    { id: 1, driverName: "Mukesh", mobileNo: "8307618187" },
    { id: 2, driverName: "Khema Ram", mobileNo: "97999889868" },
    { id: 3, driverName: "Monu", mobileNo: "9636320520" },
    { id: 4, driverName: "Dharmendra", mobileNo: "9571846773" },
    { id: 5, driverName: "Gopal", mobileNo: "7014229176" },
    { id: 6, driverName: "Jyoti Bhushan", mobileNo: "9136557387" },
    { id: 7, driverName: "Amit", mobileNo: "8303654036" },
    { id: 8, driverName: "Amit", mobileNo: "7850887676" },
    { id: 9, driverName: "Irfan Pathan", mobileNo: "9725989212" },
  ];

  // State
  const [driversData, setDriversData] = useState(initialDriversData);
  const [filteredDrivers, setFilteredDrivers] = useState(initialDriversData);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentDriver, setCurrentDriver] = useState({ id: null, driverName: '', mobileNo: '' });
  const [errors, setErrors] = useState({ driverName: '', mobileNo: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  // Menu state
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState(null);

  // Effect to filter drivers based on search
  useEffect(() => {
    const filtered = driversData.filter(driver => 
      driver.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.mobileNo.includes(searchQuery)
    );
    setFilteredDrivers(filtered);
  }, [searchQuery, driversData]);

  // Calculate paginated data
  const paginatedDrivers = filteredDrivers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Menu handlers
  const handleMenuOpen = (event, driverId) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedDriverId(driverId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedDriverId(null);
  };

  // Handle search
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to first page on search
  };

  // Form input handlers
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentDriver({ ...currentDriver, [name]: value });
    validateField(name, value);
  };

  // Field validation
  const validateField = (name, value) => {
    let error = '';
    
    if (name === 'driverName') {
      if (!value.trim()) {
        error = 'Driver name is required';
      } else if (value.length < 2) {
        error = 'Name must be at least 2 characters';
      }
    } else if (name === 'mobileNo') {
      if (!value.trim()) {
        error = 'Mobile number is required';
      } else if (!/^\d{10,12}$/.test(value)) {
        error = 'Enter a valid mobile number (10-12 digits)';
      }
    }
    
    setErrors({ ...errors, [name]: error });
    return !error;
  };

  // Form validation
  const validateForm = () => {
    const nameValid = validateField('driverName', currentDriver.driverName);
    const mobileValid = validateField('mobileNo', currentDriver.mobileNo);
    return nameValid && mobileValid;
  };

  // Add new driver
  const handleAddDriver = () => {
    if (validateForm()) {
      const newDriver = {
        id: Math.max(...driversData.map(d => d.id), 0) + 1,
        driverName: currentDriver.driverName,
        mobileNo: currentDriver.mobileNo
      };
      
      setDriversData([...driversData, newDriver]);
      setIsAddDialogOpen(false);
      setCurrentDriver({ id: null, driverName: '', mobileNo: '' });
      setSnackbar({ open: true, message: 'Driver added successfully!', severity: 'success' });
    }
  };

  // Edit driver
  const handleEditClick = (driver) => {
    setCurrentDriver({ ...driver });
    setIsEditDialogOpen(true);
    handleMenuClose();
  };

  const handleUpdateDriver = () => {
    if (validateForm()) {
      const updatedDrivers = driversData.map(driver => 
        driver.id === currentDriver.id ? currentDriver : driver
      );
      
      setDriversData(updatedDrivers);
      setIsEditDialogOpen(false);
      setSnackbar({ open: true, message: 'Driver updated successfully!', severity: 'success' });
    }
  };

  // Delete driver
  const handleDeleteClick = (id) => {
    const driverToDelete = driversData.find(driver => driver.id === id);
    setCurrentDriver(driverToDelete);
    setIsDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteDriver = () => {
    const updatedDrivers = driversData.filter(driver => driver.id !== currentDriver.id);
    setDriversData(updatedDrivers);
    setIsDeleteDialogOpen(false);
    setSnackbar({ open: true, message: 'Driver deleted successfully!', severity: 'warning' });
  };

  // Dialog handlers
  const handleAddDialogOpen = () => {
    setCurrentDriver({ id: null, driverName: '', mobileNo: '' });
    setErrors({ driverName: '', mobileNo: '' });
    setIsAddDialogOpen(true);
  };

  const handleCloseDialogs = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
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
        Drivers
      </Typography>   
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        Manage your driver roster with ease
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
        placeholder="Search drivers..."
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
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
        ADD DRIVER
      </Button>
    </Box>

      {/* Main Content - Conditional Table or Cards */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: '100%', mb: 2 }}>
      <Grid container spacing={3} sx={{ width: '100%', maxwidth: '100%', margin: 0, padding: 0 }}>
        {showCards ? (
          // Card view for mobile and tablet
          filteredDrivers.length > 0 ? (
            paginatedDrivers.map((driver) => (
              <Grid item xs={12}
              sx={{ 
                width: '100%', 
                padding: 0 
              }}
               sm={6} key={driver.id}>
                <DriverCard elevation={3}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt:'auto', mb: 4, pt: 2, width: '100%'}}>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {driver.driverName}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleMenuOpen(e, driver.id)}
                        aria-label="driver options"
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body1" color="text.secondary">
                      <strong>Mobile:</strong> {driver.mobileNo}
                    </Typography>
                  </CardContent>
                </DriverCard>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No drivers found matching your search.
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
                    <StyledTableHeader>Driver Name</StyledTableHeader>
                    <StyledTableHeader>Mobile No.</StyledTableHeader>
                    <StyledTableHeader align="right">Actions</StyledTableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDrivers.length > 0 ? (
                    paginatedDrivers.map((driver) => (
                      <StyledTableRow key={driver.id}>
                        <StyledTableCell>{driver.driverName}</StyledTableCell>
                        <StyledTableCell>{driver.mobileNo}</StyledTableCell>
                        <StyledTableCell align="right">
                          <Tooltip title="Edit">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleEditClick(driver)}
                              aria-label="edit driver"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteClick(driver.id)}
                              aria-label="delete driver"
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
                          No drivers found matching your search.
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
      {filteredDrivers.length > rowsPerPage && !showCards && (
      <Box sx={{ mt: 'auto', mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', pt: 2 }}>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 1 }}
        >
          Page: {page}
        </Typography>
    <Pagination 
      count={Math.ceil(filteredDrivers.length / rowsPerPage)} 
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
          const driver = driversData.find(d => d.id === selectedDriverId);
          handleEditClick(driver);
        }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeleteClick(selectedDriverId)}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Add Driver Dialog */}
      <Dialog open={isAddDialogOpen} onClose={handleCloseDialogs} fullWidth maxWidth="sm">
        <DialogTitle>Add New Driver</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please enter the details of the new driver.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="driverName"
            label="Driver Name"
            type="text"
            fullWidth
            variant="outlined"
            value={currentDriver.driverName}
            onChange={handleInputChange}
            error={!!errors.driverName}
            helperText={errors.driverName}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="mobileNo"
            label="Mobile Number"
            type="tel"
            fullWidth
            variant="outlined"
            value={currentDriver.mobileNo}
            onChange={handleInputChange}
            error={!!errors.mobileNo}
            helperText={errors.mobileNo}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialogs} color="inherit">Cancel</Button>
          <Button onClick={handleAddDriver} variant="contained" color="primary">Add Driver</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Driver Dialog */}
      <Dialog open={isEditDialogOpen} onClose={handleCloseDialogs} fullWidth maxWidth="sm">
        <DialogTitle>Edit Driver</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Update the driver's information.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="driverName"
            label="Driver Name"
            type="text"
            fullWidth
            variant="outlined"
            value={currentDriver.driverName}
            onChange={handleInputChange}
            error={!!errors.driverName}
            helperText={errors.driverName}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="mobileNo"
            label="Mobile Number"
            type="tel"
            fullWidth
            variant="outlined"
            value={currentDriver.mobileNo}
            onChange={handleInputChange}
            error={!!errors.mobileNo}
            helperText={errors.mobileNo}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialogs} color="inherit">Cancel</Button>
          <Button onClick={handleUpdateDriver} variant="contained" color="primary">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDialogs}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete driver "{currentDriver.driverName}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialogs} color="inherit">Cancel</Button>
          <Button onClick={handleDeleteDriver} variant="contained" color="error">Delete</Button>
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

export default AdminDrivers;