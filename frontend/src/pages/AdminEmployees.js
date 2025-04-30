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

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  border: 'none',
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  maxWidth: '100%',
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

const SearchField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  width: '300px',
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

const EmployeeCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6],
  }
}));

const AdminEmployees = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const showCards = isMobile || isTablet;

  const initialEmployeesData = [
    { id: 1, empId: "EMP001", name: "John Doe", phoneNo: "1234567890" },
    { id: 2, empId: "EMP002", name: "Jane Smith", phoneNo: "9876543210" },
  ];

  const [employeesData, setEmployeesData] = useState(initialEmployeesData);
  const [filteredEmployees, setFilteredEmployees] = useState(initialEmployeesData);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState({ id: null, empId: '', name: '', phoneNo: '' });
  const [errors, setErrors] = useState({ empId: '', name: '', phoneNo: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  useEffect(() => {
    const filtered = employeesData.filter(employee =>
      employee.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.phoneNo.includes(searchQuery)
    );
    setFilteredEmployees(filtered);
    setPage(1);
  }, [searchQuery, employeesData]);

  const paginatedEmployees = filteredEmployees.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  
    const handleMenuOpen = (event, employeeId) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedEmployeeId(employeeId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedEmployeeId(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentEmployee({ ...currentEmployee, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = '';
    
    if (name === 'empId') {
      if (!value.trim()) {
        error = 'Employee ID is required';
      } else if (value.length < 2) {
        error = 'Employee ID must be at least 2 characters';
      }
    } else if (name === 'name') {
        if (!value.trim()) {
          error = 'Employee name is required';
        } else if (value.length < 2) {
          error = 'Name must be at least 2 characters';
        }
      }else if (name === 'phoneNo') {
      if (!value.trim()) {
        error = 'Phone number is required';
      } else if (!/^\d{10,12}$/.test(value)) {
        error = 'Enter a valid phone number (10-12 digits)';
      }
    }
    
    setErrors({ ...errors, [name]: error });
    return !error;
  };

  const validateForm = () => {
    const empIdValid = validateField('empId', currentEmployee.empId);
    const nameValid = validateField('name', currentEmployee.name);
    const phoneValid = validateField('phoneNo', currentEmployee.phoneNo);
    return empIdValid && nameValid && phoneValid;
  };

  const handleAddEmployee = () => {
    if (validateForm()) {
      const newEmployee = {
        id: Math.max(...employeesData.map(d => d.id), 0) + 1,
        empId: currentEmployee.empId,
        name: currentEmployee.name,
        phoneNo: currentEmployee.phoneNo
      };
      
      setEmployeesData([...employeesData, newEmployee]);
      setIsAddDialogOpen(false);
      setCurrentEmployee({ id: null, empId: '', name: '', phoneNo: '' });
      setSnackbar({ open: true, message: 'Employee added successfully!', severity: 'success' });
    }
  };

  const handleEditClick = (employee) => {
    setCurrentEmployee({ ...employee });
    setIsEditDialogOpen(true);
    handleMenuClose();
  };

  const handleUpdateEmployee = () => {
    if (validateForm()) {
      const updatedEmployees = employeesData.map(employee =>
        employee.id === currentEmployee.id ? currentEmployee : employee
      );
      
      setEmployeesData(updatedEmployees);
      setIsEditDialogOpen(false);
      setSnackbar({ open: true, message: 'Employee updated successfully!', severity: 'success' });
    }
  };

  const handleDeleteClick = (id) => {
    const employeeToDelete = employeesData.find(employee => employee.id === id);
    setCurrentEmployee(employeeToDelete);
    setIsDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteEmployee = () => {
    const updatedEmployees = employeesData.filter(employee => employee.id !== currentEmployee.id);
    setEmployeesData(updatedEmployees);
    setIsDeleteDialogOpen(false);
    setSnackbar({ open: true, message: 'Employee deleted successfully!', severity: 'warning' });
  };

  const handleAddDialogOpen = () => {
    setCurrentEmployee({ id: null, empId: '', name: '', phoneNo: '' });
    setErrors({ empId: '', name: '', phoneNo: '' });
    setIsAddDialogOpen(true);
  };

  const handleCloseDialogs = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', position: 'relative'
    }}>
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
          Employees
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          Manage your employee roster with ease
        </Typography>
      </Box>

      <Box sx={{
        width: '100%',
        mb: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <SearchField
          placeholder="Search employees..."
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
          ADD EMPLOYEE
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: '100%', mb: 2 }}>
        <Grid container spacing={3} sx={{ width: '100%', maxwidth: '100%', margin: 0, padding: 0 }}>
          {showCards ? (
            filteredEmployees.length > 0 ? (
              paginatedEmployees.map((employee) => (
                <Grid item xs={12}
                  sx={{
                    width: '100%',
                    padding: 0
                  }}
                  sm={6} key={employee.id}>
                  <EmployeeCard elevation={3}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 'auto', mb: 4, pt: 2, width: '100%' }}>
                        <Typography variant="h6" component="h2" gutterBottom>
                          {employee.name}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, employee.id)}
                          aria-label="employee options"
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body1" color="text.secondary">
                        <strong>Emp ID:</strong> {employee.empId}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        <strong>Phone:</strong> {employee.phoneNo}
                      </Typography>
                    </CardContent>
                  </EmployeeCard>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No employees found matching your search.
                  </Typography>
                </Paper>
              </Grid>
            )
          ) : (
            <Grid item xs={12}>
              <StyledTableContainer component={Paper}
                sx={{
                  width: '100% !important',
                  maxWidth: 'none !important',
                  margin: '0 !important'
                }}>
                <Table sx={{ width: '100% !important', tableLayout: 'fixed' }}>
                  <TableHead>
                    <TableRow>
                      <StyledTableHeader>EMP. ID</StyledTableHeader>
                      <StyledTableHeader>Name</StyledTableHeader>
                      <StyledTableHeader>Phone No.</StyledTableHeader>
                      <StyledTableHeader align="right">Actions</StyledTableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredEmployees.length > 0 ? (
                      paginatedEmployees.map((employee) => (
                        <StyledTableRow key={employee.id}>
                          <StyledTableCell>{employee.empId}</StyledTableCell>
                          <StyledTableCell>{employee.name}</StyledTableCell>
                          <StyledTableCell>{employee.phoneNo}</StyledTableCell>
                          <StyledTableCell align="right">
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleEditClick(employee)}
                                aria-label="edit employee"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteClick(employee.id)}
                                aria-label="delete employee"
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
                            No employees found matching your search.
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

      {filteredEmployees.length > rowsPerPage && !showCards && (
        <Box sx={{ mt: 'auto', mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', pt: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            Page: {page}
          </Typography>
          <Pagination
            count={Math.ceil(filteredEmployees.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {isMobile && (
        <StyledFab
          color="primary"
          aria-label="add"
          onClick={handleAddDialogOpen}
        >
          <AddIcon />
        </StyledFab>
      )}

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          const employee = employeesData.find(d => d.id === selectedEmployeeId);
          handleEditClick(employee);
        }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeleteClick(selectedEmployeeId)}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      <Dialog open={isAddDialogOpen} onClose={handleCloseDialogs} fullWidth maxWidth="sm">
        <DialogTitle>Add New Employee</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please enter the details of the new employee.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="empId"
            label="Employee ID"
            type="text"
            fullWidth
            variant="outlined"
            value={currentEmployee.empId}
            onChange={handleInputChange}
            error={!!errors.empId}
            helperText={errors.empId}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={currentEmployee.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="phoneNo"
            label="Phone Number"
            type="tel"
            fullWidth
            variant="outlined"
            value={currentEmployee.phoneNo}
            onChange={handleInputChange}
            error={!!errors.phoneNo}
            helperText={errors.phoneNo}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialogs} color="inherit">Cancel</Button>
          <Button onClick={handleAddEmployee} variant="contained" color="primary">Add Employee</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isEditDialogOpen} onClose={handleCloseDialogs} fullWidth maxWidth="sm">
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Update the employee's information.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="empId"
            label="Employee ID"
            type="text"
            fullWidth
            variant="outlined"
            value={currentEmployee.empId}
            onChange={handleInputChange}
            error={!!errors.empId}
            helperText={errors.empId}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={currentEmployee.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="phoneNo"
            label="Phone Number"
            type="tel"
            fullWidth
            variant="outlined"
            value={currentEmployee.phoneNo}
            onChange={handleInputChange}
            error={!!errors.phoneNo}
            helperText={errors.phoneNo}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialogs} color="inherit">Cancel</Button>
          <Button onClick={handleUpdateEmployee} variant="contained" color="primary">Update</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDialogs}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete employee "{currentEmployee.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialogs} color="inherit">Cancel</Button>
          <Button onClick={handleDeleteEmployee} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>

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

export default AdminEmployees;