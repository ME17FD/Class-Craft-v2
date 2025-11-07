import React from 'react';
import { Navigate } from 'react-router-dom';

// Protected route component that checks if the user is authenticated
const ProtectedRoute = ({ Component, role }: { Component: React.FC, role: string }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // If no token or role doesn't match, redirect to login
  if (!token || (role && userRole !== role)) {
    return <Navigate to="/" />;
  }

  return <Component />;
};

export default ProtectedRoute;
