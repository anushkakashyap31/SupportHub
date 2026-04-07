/**
 * Authentication Store (Zustand)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authAPI from '../services/authAPI';
import toast from 'react-hot-toast';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Use direct email login (works without Firebase frontend SDK)
          const data = await authAPI.loginWithEmail(email, password);
          
          // Store token
          localStorage.setItem('accessToken', data.access_token);
          
          // Get user profile
          const user = await authAPI.getCurrentUser();
          
          set({
            accessToken: data.access_token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          
          toast.success('Login successful!');
          return true;
        } catch (error) {
          const errorMessage = error.response?.data?.detail || 'Login failed';
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      register: async (email, password, fullName) => {
        set({ isLoading: true, error: null });
        try {
          // Use direct registration
          const data = await authAPI.register(email, password, fullName);
          
          // Store token
          localStorage.setItem('accessToken', data.access_token);
          
          // Get user profile
          const user = await authAPI.getCurrentUser();
          
          set({
            accessToken: data.access_token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          
          toast.success('Registration successful!');
          return true;
        } catch (error) {
          const errorMessage = error.response?.data?.detail || 'Registration failed';
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      logout: async () => {
        try {
          await authAPI.signOut();
          localStorage.removeItem('accessToken');
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
          });
          toast.success('Logged out successfully');
        } catch (error) {
          console.error('Logout error:', error);
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        try {
          const user = await authAPI.getCurrentUser();
          set({
            user,
            accessToken: token,
            isAuthenticated: true,
          });
        } catch (error) {
          localStorage.removeItem('accessToken');
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
      }),
    }
  )
);

export default useAuthStore;