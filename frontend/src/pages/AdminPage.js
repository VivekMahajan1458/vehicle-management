import React from 'react';
import { Typography, Grid, Box, Paper, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import PersonOffIcon from '@mui/icons-material/PersonOff';

const AdminPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  // Data extracted from the image
  const vehiclesData = [
    { vehicleNo: "GJ01JT6723", mobileNo: "8307618187", driverName: "Mukesh Kumar", department: "Admin", type: "Bolero Camper" },
    { vehicleNo: "GJ08CS5325", mobileNo: "9799889868", driverName: "Khema Ram", department: "Admin", type: "Bolero Camper" },
    { vehicleNo: "RJ13UB1492", mobileNo: "9636320520", driverName: "Monu", department: "Admin", type: "Bolero" },
    { vehicleNo: "RJ01TA4584", mobileNo: "9571846773", driverName: "Dharmendra", department: "QA / QC", type: "Bolero" },
    { vehicleNo: "RJ01TA4584", mobileNo: "7014229176", driverName: "Gopal", department: "QA / QC", type: "Bolero" },
    { vehicleNo: "GJ01WG3715", mobileNo: "9136557387", driverName: "Jyoti Bhushan", department: "General Manager", type: "Bolero" },
    { vehicleNo: "GJ01WG3715", mobileNo: "8303654036", driverName: "Amit Kachera", department: "General Manager", type: "Bolero" },
    { vehicleNo: "GJ01WD9880", mobileNo: "7850887676", driverName: "Amit Singh", department: "RCM", type: "INNOVA" },
    { vehicleNo: "GJ01WD9754", mobileNo: "9725989212", driverName: "Irfan Pathan", department: "RPD", type: "INNOVA" },
  ];

  // Calculate data points
  const totalVehicles = vehiclesData.length;
  const totalDrivers = [...new Set(vehiclesData.map(v => v.driverName).filter(name => name !== undefined))].length;
  const activeVehicles = vehiclesData.filter(v => v.driverName !== undefined);
  const unavailableVehicles = 0;
  const unavailableDrivers = 0;

  // Card component for stats display
  const StatCard = ({ icon, count, label, color }) => (
    <Paper 
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        border: '1px solid #f0f0f0',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.08)'
        }
      }}
    >
      <Box 
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: `${color}15`,
          mb: 2
        }}
      >
        {icon}
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#333' }}>
        {count}
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
    </Paper>
  );

  return (
<Box 
  sx={{ 
    flexGrow: 1, 
    backgroundColor: '#f9fafc',
    minHeight: '100vh',
    width: '100%', // Add this to ensure full width
    boxSizing: 'border-box',
  }}
>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          mb: 4
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ 
            fontWeight: 700, 
            color: '#2c3e50',
            position: 'relative',
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
          Admin Dashboard
        </Typography>
        
        <Box sx={{ mt: { xs: 2, sm: 0 } }}>
          <Typography variant="body2" color="text.secondary">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Typography>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<DirectionsCarIcon sx={{ fontSize: 30, color: '#3b82f6' }} />}
            count={totalVehicles}
            label="Total Vehicles"
            color="#3b82f6"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<PersonIcon sx={{ fontSize: 30, color: '#10b981' }} />}
            count={totalDrivers}
            label="Total Drivers"
            color="#10b981"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<DirectionsCarFilledIcon sx={{ fontSize: 30, color: '#f59e0b' }} />}
            count={unavailableVehicles}
            label="Unavailable Vehicles"
            color="#f59e0b"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<PersonOffIcon sx={{ fontSize: 30, color: '#ef4444' }} />}
            count={unavailableDrivers}
            label="Unavailable Drivers"
            color="#ef4444"
          />
        </Grid>
      </Grid>

      {/* Vehicles Table */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          borderRadius: 2,
          border: '1px solid #f0f0f0',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
            Active Vehicles with Drivers
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {activeVehicles.length} active vehicles
          </Typography>
        </Box>
        
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'separate', 
            borderSpacing: '0',
            fontSize: '14px'
          }}>
            <thead>
              <tr>
                <th style={{ 
                  padding: '16px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #f0f0f0',
                  color: '#64748b',
                  fontWeight: 600
                }}>Vehicle No.</th>
                <th style={{ 
                  padding: '16px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #f0f0f0',
                  color: '#64748b',
                  fontWeight: 600
                }}>Driver</th>
                <th style={{ 
                  padding: '16px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #f0f0f0',
                  color: '#64748b',
                  fontWeight: 600 
                }}>Type</th>
                <th style={{ 
                  padding: '16px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #f0f0f0',
                  color: '#64748b',
                  fontWeight: 600
                }}>Department</th>
                <th style={{ 
                  padding: '16px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #f0f0f0',
                  color: '#64748b',
                  fontWeight: 600
                }}>Mobile No.</th>
              </tr>
            </thead>
            <tbody>
              {activeVehicles.map((vehicle, index) => (
                <tr 
                  key={index} 
                  style={{ 
                    transition: 'background-color 0.2s',
                    ':hover': {
                      backgroundColor: '#f8fafc'
                    }
                  }}
                >
                  <td style={{ 
                    padding: '16px', 
                    borderBottom: '1px solid #f0f0f0',
                    color: '#1e293b'
                  }}>{vehicle.vehicleNo}</td>
                  <td style={{ 
                    padding: '16px', 
                    borderBottom: '1px solid #f0f0f0',
                    color: '#1e293b' 
                  }}>{vehicle.driverName}</td>
                  <td style={{ 
                    padding: '16px', 
                    borderBottom: '1px solid #f0f0f0',
                    color: '#1e293b'
                  }}>{vehicle.type}</td>
                  <td style={{ 
                    padding: '16px', 
                    borderBottom: '1px solid #f0f0f0',
                    color: '#1e293b'
                  }}>{vehicle.department}</td>
                  <td style={{ 
                    padding: '16px', 
                    borderBottom: '1px solid #f0f0f0',
                    color: '#1e293b'
                  }}>{vehicle.mobileNo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminPage;