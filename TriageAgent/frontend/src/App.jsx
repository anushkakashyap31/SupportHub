/**
 * Main App Component with Public Landing Page and Animations
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Layout Components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TriagePage from './pages/TriagePage';
import Dashboard from './pages/Dashboard';
import AnalyticsPage from './pages/AnalyticsPage';
import MessagePage from './pages/MessagePage';
import SettingsPage from './pages/SettingsPage';

// Auth
import ProtectedRoute from './components/auth/ProtectedRoute';

// Transition Wrapper
import PageTransition from './components/common/PageTransition';

// Store
import useAuthStore from './store/useAuthStore';

const AnimatedRoutes = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();

  // Public routes (no sidebar/header)
  const publicRoutes = ['/', '/login', '/register'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - only show when authenticated and not on public routes */}
      {!isPublicRoute && isAuthenticated && <Header />}
      
      <div className="flex">
        {/* Sidebar - only show when authenticated and not on public routes */}
        {!isPublicRoute && isAuthenticated && <Sidebar />}
        
        {/* Main Content */}
        <main className={`flex-1 ${!isPublicRoute && isAuthenticated ? 'p-8' : ''}`}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Public Landing Page */}
              <Route 
                path="/" 
                element={
                  isAuthenticated ? (
                    <Navigate to="/home" replace />
                  ) : (
                    <PageTransition><LandingPage /></PageTransition>
                  )
                } 
              />

              {/* Auth Routes */}
              <Route 
                path="/login" 
                element={
                  isAuthenticated ? (
                    <Navigate to="/home" replace />
                  ) : (
                    <PageTransition><LoginPage /></PageTransition>
                  )
                } 
              />
              <Route 
                path="/register" 
                element={
                  isAuthenticated ? (
                    <Navigate to="/home" replace />
                  ) : (
                    <PageTransition><RegisterPage /></PageTransition>
                  )
                } 
              />

              {/* Protected Routes */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <PageTransition><Home /></PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/triage"
                element={
                  <ProtectedRoute>
                    <PageTransition><TriagePage /></PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <PageTransition><Dashboard /></PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <PageTransition><AnalyticsPage /></PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages/:id"
                element={
                  <ProtectedRoute>
                    <PageTransition><MessagePage /></PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <PageTransition><SettingsPage /></PageTransition>
                  </ProtectedRoute>
                }
              />

              {/* Catch all - redirect to home if authenticated, landing if not */}
              <Route 
                path="*" 
                element={<Navigate to={isAuthenticated ? "/home" : "/"} replace />} 
              />
            </Routes>
          </AnimatePresence>
        </main>
      </div>

      {/* Footer - only show when authenticated and not on public routes */}
      {!isPublicRoute && isAuthenticated && <Footer />}
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

const App = () => {
  return (
    <Router basename="/triage">
      <AnimatedRoutes />
    </Router>
  );
};

export default App;