import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    Grid,
    InputAdornment,
    Paper
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

function NewRequestPage() {
    const [name, setName] = useState('Vivek Mahajan');
    const [employeeId] = useState('12345');
    const [purpose, setPurpose] = useState('');
    const [destination, setDestination] = useState('');
    const [pickupLocation, setPickupLocation] = useState('');
    const [date, setDate] = useState(null);
    const [passengers, setPassengers] = useState(1);
    const [pickupTime, setPickupTime] = useState(null);
    const [returnTime, setReturnTime] = useState(null);
    const [notes, setNotes] = useState('');

    const [purposeError, setPurposeError] = useState('');
    const [destinationError, setDestinationError] = useState('');
    const [pickupLocationError, setPickupLocationError] = useState('');
    const [dateError, setDateError] = useState('');
    const [passengersError, setPassengersError] = useState('');
    const [pickupTimeError, setPickupTimeError] = useState('');

    const [timeoutActive, setTimeoutActive] = useState(false);
    const [timeoutEndTime, setTimeoutEndTime] = useState(null);
    const [remainingTime, setRemainingTime] = useState(0);

    // Get today's date as a Dayjs object
    const today = dayjs().startOf('day');

    const handlePurposeChange = (event) => { setPurpose(event.target.value); setPurposeError(''); };
    const handleDestinationChange = (event) => { setDestination(event.target.value); setDestinationError(''); };
    const handlePickupLocationChange = (event) => { setPickupLocation(event.target.value); setPickupLocationError(''); };
    const handleDateChange = (newValue) => {
        // Important: Only allow setting the date if it's today's date.
        if (newValue && newValue.isSame(today, 'day')) {
            setDate(newValue);
            setDateError('');
        } else {
            setDateError("You can only select today's date.");
            setDate(null);
        }
    };
    const handlePassengersChange = (event) => { setPassengers(parseInt(event.target.value, 10)); setPassengersError(''); };
    const handlePickupTimeChange = (newTime) => { setPickupTime(newTime); setPickupTimeError(''); };
    const handleReturnTimeChange = (newTime) => { setReturnTime(newTime); };
    const handleNotesChange = (event) => { setNotes(event.target.value); };

    // useEffect for initialization
    useEffect(() => {
        const storedTimeoutEndTime = localStorage.getItem('timeoutEndTime');
        if (storedTimeoutEndTime) {
            const endTime = parseInt(storedTimeoutEndTime, 10);
            if (endTime > Date.now()) {
                setTimeoutActive(true);
                setTimeoutEndTime(endTime);
            }
        }

        // Set initial date to today *only* if no date is stored already
        if (!date) {
            setDate(today);
        }

    }, [date, today]);

    // useEffect for the countdown timer
    useEffect(() => {
        let intervalId;

        if (timeoutActive && timeoutEndTime) {
            intervalId = setInterval(() => {
                const currentTime = Date.now();
                const timeLeft = Math.max(0, timeoutEndTime - currentTime);
                setRemainingTime(Math.ceil(timeLeft / 1000));

                if (timeLeft <= 0) {
                    clearInterval(intervalId);
                    setTimeoutActive(false);
                    localStorage.removeItem('timeoutEndTime');
                }
            }, 1000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [timeoutActive, timeoutEndTime]);

    const handleSubmit = (event) => {
        event.preventDefault();
        let isValid = true;

        if (!purpose) { setPurposeError("Purpose is required"); isValid = false; }
        if (!destination) { setDestinationError("Destination is required"); isValid = false; }
        if (!pickupLocation) { setPickupLocationError("Pick Up location is required"); isValid = false; }
        if (!date) { setDateError("Date is required"); isValid = false; }
        else if (!date.isSame(today, 'day')) {
            setDateError("You can only select today's date.");
            isValid = false;
        }
        if (!passengers) { setPassengersError("Number of passengers is required"); isValid = false; }
        else if (passengers <= 0) { setPassengersError("Passengers count should be more than 0"); isValid = false; }
        if (!pickupTime) { setPickupTimeError("Pick Up time is required"); isValid = false; }

        if (isValid) {
            // Store date in ISO format
            const isoDate = date ? date.toISOString() : '';
            // Format times for storage
            const formattedPickupTime = pickupTime ? pickupTime.format('HH:mm') : '';
            const formattedReturnTime = returnTime ? returnTime.format('HH:mm') : '';

            const newRequest = {
                id: Date.now(),
                name,
                employeeId,
                purpose,
                destination,
                pickupLocation,
                date: isoDate,
                pickupTime: formattedPickupTime,
                returnTime: formattedReturnTime,
                passengers,
                notes,
                status: 'Pending',
            };

            const existingRequests = JSON.parse(localStorage.getItem('requests') || '[]');
            existingRequests.push(newRequest);
            localStorage.setItem('requests', JSON.stringify(existingRequests));

            // Set the timeout *after* successfully saving
            const endTime = Date.now() + (10 * 60 * 1000); // 10 minutes in milliseconds
            setTimeoutEndTime(endTime);
            localStorage.setItem('timeoutEndTime', endTime);
            setTimeoutActive(true);

            // Reset form
            setPurpose('');
            setDestination('');
            setPickupLocation('');
            setDate(today);
            setPassengers(1);
            setPickupTime(null);
            setReturnTime(null);
            setNotes('');

            // Clear errors
            setPurposeError("");
            setDestinationError("");
            setPickupLocationError("");
            setDateError("");
            setPassengersError("");
            setPickupTimeError("");

            alert("Form Submitted");
        }
    };

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Container component="main" maxWidth="md" sx={{ my: 4 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    {timeoutActive ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                            <Typography variant="h6">
                                You are currently in a timeout period. Please wait.
                            </Typography>
                            <Typography variant="h4">
                                {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, '0')}
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography component="h1" variant="h5" gutterBottom>Request a Vehicle</Typography>
                            <Typography component="p" variant="subtitle1" sx={{ mb: 3 }}>Fill in the details for your transportation needs</Typography>

                            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Name"
                                            fullWidth
                                            variant="outlined"
                                            value={name}
                                            InputProps={{
                                                startAdornment: (<InputAdornment position="start"><i className="fas fa-user"></i></InputAdornment>)
                                            }}
                                            inputProps={{ readOnly: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Employee ID"
                                            fullWidth
                                            variant="outlined"
                                            value={employeeId}
                                            inputProps={{ readOnly: true }}
                                            InputProps={{
                                                startAdornment: (<InputAdornment position="start"><i className="fas fa-id-card"></i></InputAdornment>)
                                            }}
                                        />
                                    </Grid>


                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            id="purpose"
                                            label="Purpose"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    paddingRight: 0,
                                                },
                                            }}
                                            placeholder="Visit, Work, etc."
                                            fullWidth
                                            variant="outlined"
                                            value={purpose}
                                            onChange={handlePurposeChange}
                                            error={!!purposeError}
                                            helperText={purposeError}
                                            InputProps={{
                                                startAdornment: (<InputAdornment position="start"><i className="fas fa-pencil-alt"></i></InputAdornment>)
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            id="destination"
                                            label="Destination"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            sx={{
                                                padding: 0,
                                            }}
                                            placeholder="Where are you going?"
                                            fullWidth
                                            variant="outlined"
                                            value={destination}
                                            onChange={handleDestinationChange}
                                            error={!!destinationError}
                                            helperText={destinationError}
                                            InputProps={{
                                                startAdornment: (<InputAdornment position="start"><i className="fas fa-map-marker-alt"></i></InputAdornment>)
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            id="pickupLocation"
                                            label="Pickup Location"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            sx={{
                                                padding: 0,
                                            }}
                                            placeholder="Office, home, etc."
                                            fullWidth
                                            variant="outlined"
                                            value={pickupLocation}
                                            onChange={handlePickupLocationChange}
                                            error={!!pickupLocationError}
                                            helperText={pickupLocationError}
                                            InputProps={{
                                                startAdornment: (<InputAdornment position="start"><i className="fas fa-map-pin"></i></InputAdornment>)
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} >
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Date"
                                                value={date}
                                                onChange={handleDateChange}
                                                minDate={today}
                                                maxDate={today}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        fullWidth
                                                        required
                                                        error={!!dateError}
                                                        helperText={dateError}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <i className="fas fa-calendar-alt" />
                                                                </InputAdornment>
                                                            ),
                                                            ...params.InputProps,
                                                        }}
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField

                                            id="passengers"
                                            label="Passengers *"
                                            type="number"
                                            inputProps={{ min: 1 }}
                                            fullWidth
                                            variant="outlined"
                                            value={passengers}
                                            onChange={handlePassengersChange}
                                            error={!!passengersError}
                                            helperText={passengersError}
                                            InputProps={{
                                                startAdornment: (<InputAdornment position="start"><i className="fas fa-users"></i></InputAdornment>)
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <TimePicker
                                                        label="Pickup Time"
                                                        value={pickupTime}
                                                        onChange={handlePickupTimeChange}
                                                        ampm={false}
                                                        views={['hours', 'minutes']}
                                                        format="HH:mm"
                                                        slotProps={{
                                                            textField: {
                                                                fullWidth: true,
                                                                required: true,
                                                                error: !!pickupTimeError,
                                                                helperText: pickupTimeError,
                                                                InputProps: {
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <i className="fas fa-clock" />
                                                                        </InputAdornment>
                                                                    ),
                                                                },
                                                                InputLabelProps: {
                                                                    shrink: true,
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </LocalizationProvider>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <TimePicker
                                                        label="Return Time (Optional)"
                                                        value={returnTime}
                                                        onChange={handleReturnTimeChange}
                                                        ampm={false}
                                                        views={['hours', 'minutes']}
                                                        format="HH:mm"
                                                        slotProps={{
                                                            textField: {
                                                                fullWidth: true,
                                                                InputLabelProps: {
                                                                    shrink: true,
                                                                },
                                                                InputProps: {
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <i className="fas fa-clock" />
                                                                        </InputAdornment>
                                                                    )
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </LocalizationProvider>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    {/* Modified Additional Notes section */}
                                    <Grid item xs={12}>
                                        <TextField
                                            id="notes"
                                            label="Additional Notes (optional)"
                                            placeholder=""
                                            fullWidth
                                            multiline
                                            rows={4}
                                            variant="outlined"
                                            value={notes}
                                            onChange={handleNotesChange}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    padding: '16.5px 292px', // Adjust padding to match other fields
                                                    alignItems: 'flex-start', // Align text to top
                                                },
                                                '& .MuiInputLabel-outlined': {
                                                    backgroundColor: 'background.paper', // Creates the "cutting the line" effect
                                                    padding: '0 4px',
                                                    transform: 'translate(14px, -6px) scale(0.75)',
                                                },
                                            }}
                                        />
                                    </Grid>
                                </Grid>

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 4, py: 1.5, fontSize: '1rem' }}
                                >
                                    Submit Request
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Paper>
            </Container>
        </motion.div>
    );
}

export default NewRequestPage;