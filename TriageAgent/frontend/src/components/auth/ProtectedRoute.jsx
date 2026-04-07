/**
 * Protected Route Component
 * Redirects to login if not authenticated
 */

import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  if (isLoading) {
    return <LoadingSpinner fullScreen text="Checking authentication..." />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

export default ProtectedRoute;