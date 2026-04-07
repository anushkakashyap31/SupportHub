/**
 * useAuth Hook
 * Convenient hook for authentication
 */

import { useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';

const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth,
    clearError,
  } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };
};

export default useAuth;