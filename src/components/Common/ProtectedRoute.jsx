// This file protects certain pages from unauthorized users
// For example, only property owners can access property dashboard
// If someone tries to access without permission, they get a toast message

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authUtils } from '../../utils/auth';
import Toast from '../Toast/Toast';

const ProtectedRoute = ({ children, requiredRole, redirectTo = '/login' }) => {
  // Get current page location to remember where user was trying to go
  const location = useLocation();
  
  // Check if user is logged in and what their role is (admin, property_owner, user)
  const isAuthenticated = authUtils.isAuthenticated();
  const userRole = authUtils.getUserRole();
  
  // State to control when to show the error toast message
  const [showToast, setShowToast] = React.useState(false);

  // If user is not logged in at all, send them to login page
  if (!isAuthenticated) {
    // Remember this page so we can bring them back after login
    authUtils.setRedirectAfterLogin(location.pathname);
    return <Navigate to={redirectTo} replace />;
  }

  // If user is logged in but doesn't have the right role (like a regular user trying to access admin page)
  if (requiredRole && userRole !== requiredRole) {
    // Show error message and automatically go back after 2 seconds
    React.useEffect(() => {
      setShowToast(true);
      setTimeout(() => window.history.back(), 2000);
    }, []);

    // Display the red error toast telling them they can't access this page
    return (
      <Toast 
        show={showToast}
        message="Access denied. Only property owners can access this section."
        type="error"
        onClose={() => setShowToast(false)}
      />
    );
  }

  // If everything is good (user is logged in and has right role), show the page
  return children;
};

export default ProtectedRoute;