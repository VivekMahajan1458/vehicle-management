import React, { useState, useEffect } from 'react';
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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

function NewRequestPage() {
    const [name, setName] = useState('Vivek Mahajan');
    const [employeeId] = useState('12345'); // Removed unused setter
    const [purpose, setPurpose] = useState('');
    const [destination, setDestination] = useState('');
    const [pickupLocation, setPickupLocation] = useState('');
    const [date, setDate] = useState(null);
    const [passengers, setPassengers] = useState(1);
    const [pickupTime, setPickupTime] = useState('');
    const [returnTime, setReturnTime] = useState('');
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
    const today = dayjs().startOf('day'); // startOf('day') ensures time is 00:00:00

    const handleNameChange = (event) => { setName(event.target.value); };
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
    const handlePassengersChange = (event) => { setPassengers(event.target.value); setPassengersError(''); };
    const handlePickupTimeChange = (event) => { setPickupTime(event.target.value); setPickupTimeError(''); };
    const handleReturnTimeChange = (event) => { setReturnTime(event.target.value); };
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

    }, [date, today]); // Include today in dependencies

    // useEffect for the countdown timer
    useEffect(() => {
        let intervalId;

        if (timeoutActive && timeoutEndTime) {
            intervalId = setInterval(() => {
                const currentTime = Date.now();
                const timeLeft = Math.max(0, timeoutEndTime - currentTime); // Ensure time doesn't go negative
                setRemainingTime(Math.ceil(timeLeft / 1000)); // Convert to seconds

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
            // Store date in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)
            const isoDate = date ? dayjs(date).toISOString() : '';

            const newRequest = {
                id: Date.now(), name, employeeId, purpose, destination, pickupLocation,
                date: isoDate, // Store the ISO string
                pickupTime, returnTime,
                passengers, notes, status: 'Pending',
            };
            const existingRequests = JSON.parse(localStorage.getItem('requests') || '[]');
            existingRequests.push(newRequest);
            localStorage.setItem('requests', JSON.stringify(existingRequests));

            // Set the timeout *after* successfully saving
            const endTime = Date.now() + (10 * 60 * 1000); // 10 minutes in milliseconds
            setTimeoutEndTime(endTime);
            localStorage.setItem('timeoutEndTime', endTime); // Persist to local storage
            setTimeoutActive(true);

            setPurpose(''); setDestination(''); setPickupLocation(''); setDate(today); // Reset to today
            setPassengers(1); setPickupTime(''); setReturnTime(''); setNotes('');
            alert("Form Submitted");

            setPurposeError(""); setDestinationError(""); setPickupLocationError("");
            setDateError(""); setPassengersError(""); setPickupTimeError("");
        }
    };

    return (
        <Container component="main" maxWidth="md">
            <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
                {timeoutActive ? (
                     <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                        <Typography variant="h6">
                            You are currently in a timeout period.  Please wait.
                        </Typography>
                        <Typography variant="h4">
                            {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, '0')}
                         </Typography>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography component="h1" variant="h5">Request a Vehicle</Typography>
                        <Typography component="p" variant="subtitle1">Fill in the details for your transportation needs</Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, width: '100%' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Name" fullWidth variant="outlined" value={name} onChange={handleNameChange}
                                        InputProps={{ startAdornment: (<InputAdornment position="start"><i className="fas fa-user"></i></InputAdornment>) }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Employee ID" fullWidth variant="outlined" value={employeeId} inputProps={{ readOnly: true }}
                                        InputProps={{ startAdornment: (<InputAdornment position="start"><i className="fas fa-id-card"></i></InputAdornment>) }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField required id="purpose" label="Purpose" placeholder="Client meeting, team event, etc." fullWidth variant="outlined" value={purpose} onChange={handlePurposeChange} error={!!purposeError} helperText={purposeError}
                                        InputProps={{ startAdornment: (<InputAdornment position="start"><i className="fas fa-pencil-alt"></i></InputAdornment>) }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField required id="destination" label="Destination" placeholder="Where are you going?" fullWidth variant="outlined" value={destination} onChange={handleDestinationChange} error={!!destinationError} helperText={destinationError}
                                        InputProps={{ startAdornment: (<InputAdornment position="start"><i className="fas fa-map-marker-alt"></i></InputAdornment>) }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField required id="pickupLocation" label="Pickup Location" placeholder="Office, home, etc." fullWidth variant="outlined" value={pickupLocation} onChange={handlePickupLocationChange} error={!!pickupLocationError} helperText={pickupLocationError}
                                        InputProps={{ startAdornment: (<InputAdornment position="start"><i className="fas fa-map-pin"></i></InputAdornment>) }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
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
                                    <TextField required id="passengers" label="Passengers" type="number" inputProps={{ min: 1 }} fullWidth variant="outlined" value={passengers} onChange={handlePassengersChange} error={!!passengersError} helperText={passengersError}
                                        InputProps={{ startAdornment: (<InputAdornment position="start"><i className="fas fa-users"></i></InputAdornment>) }}
                                    />
                                </Grid>
                                 <Grid item xs={12} sm={6}>
                                     {/* Use native HTML time input */}
                                     <TextField
                                        required
                                        label="Pickup Time"
                                        type="time"
                                        fullWidth
                                        variant="outlined"
                                        value={pickupTime}
                                        onChange={handlePickupTimeChange}
                                        error={!!pickupTimeError}
                                        helperText={pickupTimeError}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <i className="fas fa-clock" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        inputProps={{
                                            step: 60,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                      {/* Use native HTML time input */}
                                    <TextField
                                        label="Return Time (Optional)"
                                        type="time"
                                        fullWidth
                                        variant="outlined"
                                        value={returnTime}
                                        onChange={handleReturnTimeChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <i className="fas fa-clock" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        inputProps={{
                                            step: 60,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField id="notes" label="Additional Notes" placeholder="Any special requirements or additional information..." fullWidth multiline rows={4} variant="outlined" value={notes} onChange={handleNotesChange} />
                                </Grid>
                            </Grid>
                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Submit Request</Button>
                        </Box>
                    </Box>
                )}
            </Paper>
        </Container>
    );
}

export default NewRequestPage;