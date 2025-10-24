import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';

// Dashboard pages
import AdminDashboard from './pages/AdminDashboard';
import MemberDashboard from './pages/MemberDashboard';
import TrainerDashboard from './pages/TrainerDashboard';

// Admin pages
import Classes from './pages/Classes';
import Memberships from './pages/Memberships';
import Trainers from './pages/Trainers';
import Bookings from './pages/Bookings';

// Member pages
import MemberClasses from './pages/MemberClasses';
import MemberBookings from './pages/MemberBookings';
import MemberMembership from './pages/MemberMembership';

// Trainer pages
import TrainerClasses from './pages/TrainerClasses';
import TrainerProfile from './pages/TrainerProfile';

import './App.css';

// PUBLIC_INTERFACE
/**
 * Dashboard router component that routes to role-specific dashboard
 */
const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'trainer':
      return <TrainerDashboard />;
    case 'member':
    default:
      return <MemberDashboard />;
  }
};

// PUBLIC_INTERFACE
/**
 * Main App component with routing configuration
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected routes with layout */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardRouter />} />

                    {/* Admin routes */}
                    <Route
                      path="/classes"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <Classes />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/memberships"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <Memberships />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/trainers"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <Trainers />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/bookings"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <Bookings />
                        </ProtectedRoute>
                      }
                    />

                    {/* Member routes */}
                    <Route
                      path="/member/classes"
                      element={
                        <ProtectedRoute requiredRole="member">
                          <MemberClasses />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/member/bookings"
                      element={
                        <ProtectedRoute requiredRole="member">
                          <MemberBookings />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/member/membership"
                      element={
                        <ProtectedRoute requiredRole="member">
                          <MemberMembership />
                        </ProtectedRoute>
                      }
                    />

                    {/* Trainer routes */}
                    <Route
                      path="/trainer/classes"
                      element={
                        <ProtectedRoute requiredRole="trainer">
                          <TrainerClasses />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/trainer/profile"
                      element={
                        <ProtectedRoute requiredRole="trainer">
                          <TrainerProfile />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
