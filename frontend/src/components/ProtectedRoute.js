// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Assume 'allowedRoles' is an array of roles allowed for this specific route instance
// Or maybe it checks a single 'requiredRole' prop
const ProtectedRoute = ({ children, requiredRole }) => { // Added requiredRole prop example
    const location = useLocation();
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');

    // 1. Check if logged in at all
    if (!isLoggedIn) {
        // Redirect to login, saving the intended location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Check if a specific role is required AND if the user has it
    // --- THIS IS THE PART TO MODIFY ---
    if (requiredRole && userRole !== requiredRole) {
        // User is logged in, but doesn't have the right role
        // Redirect to an unauthorized page or back to login/dashboard
        console.warn(`Access denied: Route requires role "${requiredRole}", user has role "${userRole}"`);
        // You might redirect to a specific dashboard based on their actual role,
        // or just back to login, or show an "Unauthorized" component.
        // Example: Redirect back to login
        return <Navigate to="/login" replace />;
        // Example: Redirect based on their actual role
        // if (userRole === 'employee') return <Navigate to="/employee/dashboard" replace />;
        // if (userRole === 'manager') return <Navigate to="/vehicle-manager" replace />;
    }
    // --- END MODIFICATION AREA ---


    // If logged in AND (no specific role required OR user has the required role)
    return children; // Render the component (e.g., AdminPage)
};

export default ProtectedRoute;
