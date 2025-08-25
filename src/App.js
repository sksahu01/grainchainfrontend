import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import './styles/global.css';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DonorDashboard from './pages/DonorDashboard';
import ReceiverDashboard from './pages/ReceiverDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Protected route wrapper component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, loading } = useAuth();

  // If auth is still loading, show nothing or a loading spinner
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If role is required and user doesn't have it, redirect to appropriate dashboard
  if (requiredRole && currentUser.role !== requiredRole) {
    if (currentUser.role === 'donor') {
      return <Navigate to="/donor-dashboard" replace />;
    } else if (currentUser.role === 'receiver') {
      return <Navigate to="/receiver-dashboard" replace />;
    } else if (currentUser.role === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // Otherwise, render the protected component
  return children;
};

// Role-based dashboard redirect
const DashboardRedirect = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role === 'donor') {
    return <Navigate to="/donor-dashboard" replace />;
  } else if (currentUser.role === 'receiver') {
    return <Navigate to="/receiver-dashboard" replace />;
  } else if (currentUser.role === 'admin') {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return <Navigate to="/" replace />;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Dashboard redirect */}
            <Route path="/dashboard" element={<DashboardRedirect />} />

            {/* Protected routes with role-based access */}
            <Route
              path="/donor-dashboard"
              element={
                <ProtectedRoute requiredRole="donor">
                  <DonorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/receiver-dashboard"
              element={
                <ProtectedRoute requiredRole="receiver">
                  <ReceiverDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
