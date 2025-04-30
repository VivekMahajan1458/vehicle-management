// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import LoginPage from './pages/LoginPage';
import EmployeeDashboard from './pages/EmployeeDashboard';
import NewRequestPage from './pages/NewRequestPage';
import VehicleStatusPage from './pages/VehicleStatusPage';
import ProfilePage from './pages/ProfilePage';
import VehicleManagerDashboard from './pages/VehicleManagerDashboard';
import PastRequestsPage from './pages/PastRequestsPage';
// Import the new pages
import VehiclesPage from './pages/VehiclesPage';
import DriversPage from './pages/DriversPage';
import AdminPage from './pages/AdminPage';
import AdminDrivers from './pages/AdminDrivers';
import AdminVehicles from './pages/AdminVehicles';
import AdminEmployees from './pages/AdminEmployees';
import EmpPastRequests from './pages/EmpPastRequests';


// Components
import Layout from './components/Layout';
// Import ProtectedRoute if you add authentication back later
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                {/* --- Public Routes --- */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />

                {/* --- Employee Routes (Uses Layout) --- */}
                {/* Consider adding ProtectedRoute back later */}
                <Route path="/employee" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<ProtectedRoute><Navigate to="dashboard" replace /></ProtectedRoute>} />
                    <Route path="dashboard" element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>} />
                    <Route path="new-request" element={<ProtectedRoute><NewRequestPage /></ProtectedRoute>} />
                    <Route path="vehicle-status" element={<VehicleStatusPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="past-requests" element={<EmpPastRequests />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Route>

                {/* --- Vehicle Manager Routes (No Layout for Dashboard/Past Requests) --- */}
                {/* Consider adding ProtectedRoute back later */}
                <Route path="/vehicle-manager" element={<VehicleManagerDashboard />} />
                <Route path="/vehicle-manager/past-requests" element={<PastRequestsPage />} />

                {/* --- NEW Vehicle Manager Routes for Vehicle/Driver Management --- */}
                {/* These might use a different Layout or the same one depending on future needs */}
                {/* For now, let's render them directly like the VM dashboard */} 
                <Route path="/vehicle-manager/vehicles" element={<VehiclesPage />} />
                <Route path="/vehicle-manager/drivers" element={<DriversPage />} />

                {/* --- Admin Routes --- */}
                <Route path="/admin" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route index element={<AdminPage />} />
                  <Route path="drivers" element={<AdminDrivers />} />
                  <Route path="vehicles" element={<AdminVehicles />} />
                  <Route path="employees" element={<AdminEmployees />} />
                </Route>

                {/* --- Catch-all --- */}
                <Route path="*" element={<Navigate to="/login" replace />} />

            </Routes>
        </Router>
    );
}

export default App;