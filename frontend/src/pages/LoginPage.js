import React, { useState } from 'react';
import { Container, Typography, TextField, Button, MenuItem, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import meilLogo from '../assets/meil-logo.png';
import backgroundImage from '../assets/gas.png';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(''); // Initialize as empty string
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setEmailError('');
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setPasswordError('');
    };

    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    // --- UPDATED handleSubmit ---
    const handleSubmit = (event) => {
        event.preventDefault();
        let isValid = true;

        // Reset errors
        setEmailError('');
        setPasswordError('');

        // Basic Validation
        if (!email) { setEmailError('Email is required'); isValid = false; }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError('Invalid email format'); isValid = false; }
        if (!password) { setPasswordError('Password is required'); isValid = false; }
        else if (password.length < 6) { setPasswordError('Password must be at least 6 characters long'); isValid = false; }
        if (!role) {
            // Consider a better UI element for this error if needed
            alert("Please select a role.");
            isValid = false;
        }

        if (isValid) {
            console.log(`Login attempt: Role - ${role}, Email - ${email}`); // Log attempt

            // Set localStorage items *before* navigation for any valid attempt
            localStorage.setItem('userRole', role);
            localStorage.setItem('isLoggedIn', 'true');

            // Navigation Logic based on role
            if (role === 'employee') {
                console.log('Navigating to employee dashboard...');
                navigate('/employee/dashboard');
            } else if (role === 'manager') {
                console.log('Navigating to vehicle manager dashboard...');
                navigate('/vehicle-manager');
            } else if (role === 'admin') {
                // --- CHANGE HERE: Navigate to admin route ---
                console.log('Navigating to admin dashboard...');
                navigate('/admin'); // Navigate to the admin page route
                // --- REMOVED: alert("Admin Feature is coming Soon"); ---
                // --- REMOVED: localStorage.removeItem lines (keep user logged in) ---
            } else {
                 // Fallback for unexpected roles (shouldn't happen with select)
                 console.error("Unexpected role selected:", role);
                 alert("An unexpected error occurred. Please try again.");
                 localStorage.removeItem('userRole');
                 localStorage.removeItem('isLoggedIn');
            }
        }
    };
    // -----------------------------

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden'
            }}
        >
             <Box
                 sx={{
                     backgroundColor: 'rgba(255, 255, 255, 0.1)',
                     backdropFilter: 'blur(2px)',
                     padding: '10px',
                     width: '100%',
                     display: 'flex',
                     justifyContent: 'center',
                     alignItems: 'center',
                     boxSizing: 'border-box'
                     }}
             >
                 <img src={meilLogo} alt="MEIL Logo" style={{ height: '75px' }} />
                 {/* Removed empty Typography */}
            </Box>

            <Container
                component="main"
                maxWidth="xs"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexGrow: 1,
                    boxSizing: 'border-box',
                    padding: '0',
                }}
            >
                 <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.3, duration: 0.5 }}
                     style={{ width: '100%' }}
                 >
                     <Box
                         sx={{
                             backgroundColor: 'rgba(255, 255, 255, 0.85)',
                             padding: 4,
                             borderRadius: 8,
                             boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)',
                             border: '1px solid rgba(255, 255, 255, 0.3)',
                             display: 'flex',
                             flexDirection: 'column',
                             alignItems: 'center',
                             width: '100%',
                             boxSizing: 'border-box',
                             transition: 'all 0.3s ease',
                         }}
                     >
                        <Typography
                            component="h1"
                            variant="h5"
                            sx={{
                                marginBottom: 3,
                                fontWeight: 600,
                                color: '#1565C0',
                                letterSpacing: '0.5px'
                            }}
                        >
                            Login
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                variant="outlined"
                                value={email}
                                onChange={handleEmailChange}
                                error={!!emailError}
                                helperText={emailError}
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': { borderColor: '#1976d2', },
                                        '&.Mui-focused fieldset': { borderColor: '#1976d2', borderWidth: '2px', },
                                    },
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                variant="outlined"
                                value={password}
                                onChange={handlePasswordChange}
                                error={!!passwordError}
                                helperText={passwordError}
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': { borderColor: '#1976d2', },
                                        '&.Mui-focused fieldset': { borderColor: '#1976d2', borderWidth: '2px', },
                                    },
                                }}
                            />
                            <TextField
                                select
                                required // Make role required
                                fullWidth
                                label="Select your role "
                                value={role}
                                onChange={handleRoleChange}
                                margin="normal"
                                variant="outlined"
                                id="role"
                                name="role"
                                // Add error/helperText state for role if needed
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': { borderColor: '#1976d2', },
                                        '&.Mui-focused fieldset': { borderColor: '#1976d2', borderWidth: '2px', },
                                    },
                                }}
                            >
                                {/* Added empty value option for better validation */}
                                <MenuItem value="employee">Employee</MenuItem>
                                <MenuItem value="manager">Vehicle Manager</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </TextField>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 4,
                                    mb: 2,
                                    backgroundColor: '#1976d2',
                                    backgroundImage: 'linear-gradient(to right, #1976d2, #2196f3)',
                                    padding: '12px 0',
                                    borderRadius: '8px',
                                    fontWeight: 500,
                                    boxShadow: '0 4px 6px rgba(25, 118, 210, 0.25)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: '#145ea8',
                                        backgroundImage: 'linear-gradient(to right, #145ea8, #1e88e5)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 10px rgba(25, 118, 210, 0.3)',
                                    }
                                }}
                            >
                                Login
                            </Button>
                        </Box>
                    </Box>
                 </motion.div>
            </Container>

            {/* Bottom Translucent Bar */}
             <Box
                 sx={{
                     backgroundColor: 'rgba(255, 255, 255, 0.1)',
                     backdropFilter: 'blur(2px)',
                     padding: '10px',
                     width: '100%',
                     textAlign: 'center',
                     boxSizing: 'border-box'
                     }}
             >
                 <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 500 }}>
                     {/* Corrected year */}
                     &copy; {new Date().getFullYear()} Megha Engineering & Infrastructures Ltd. Vehicle Management System. All rights reserved.
                 </Typography>
            </Box>
        </motion.div>
    );
}

export default LoginPage;
