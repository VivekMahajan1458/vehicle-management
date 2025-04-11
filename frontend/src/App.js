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
import PastRequestsPage from './pages/PastRequestsPage'; // *** Import the new page ***

// Components
import Layout from './components/Layout';
// Import ProtectedRoute if you add authentication back later
// import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                {/* --- Public Routes --- */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />

                {/* --- Employee Routes (Uses Layout) --- */}
                {/* Consider adding ProtectedRoute back later */}
                <Route path="/employee" element={<Layout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<EmployeeDashboard />} />
                    <Route path="new-request" element={<NewRequestPage />} />
                    <Route path="vehicle-status" element={<VehicleStatusPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Route>

                {/* --- Vehicle Manager Routes (No Layout) --- */}
                {/* Consider adding ProtectedRoute back later */}
                <Route path="/vehicle-manager" element={<VehicleManagerDashboard />} />
                {/* *** ADDED Route for Past Requests *** */}
                <Route path="/vehicle-manager/past-requests" element={<PastRequestsPage />} />
                 {/* Add other manager routes here, e.g., /vehicle-manager/vehicles */}


                {/* --- Catch-all --- */}
                <Route path="*" element={<Navigate to="/login" replace />} />

            </Routes>
        </Router>
    );
}

export default App;