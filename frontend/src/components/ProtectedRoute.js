import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, requireRole } from '../services/auth';

export default function ProtectedRoute({ allowedRoles = [], children }) {
  if (!isAuthenticated()) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length && !requireRole(allowedRoles)) {
    // Logged in but not authorized
    return <Navigate to="/login" replace />;
  }

  // Authorized: render children directly
  return children;
}
