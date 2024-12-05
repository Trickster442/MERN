import React from 'react';
import { Navigate } from 'react-router-dom';

//children is pass as prop as it will embed children i.e page to redirect to
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // If there is no token, redirect to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Optionally, you can add token validation here if necessary (e.g., by sending a request to the server)
  
  return children;  // If token exists, render the child components (Home page)
};

export default ProtectedRoute;
