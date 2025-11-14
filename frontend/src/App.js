import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

// --- Global Layout Components ---
// These are always present and manage our popups and navigation
import Notification from './components/layout/Notification';
import ConfirmationModal from './components/layout/ConfirmationModal';
import EditTaskModal from './components/layout/EditTaskModal';
import BottomNav from './components/layout/BottomNav';

// --- Page Imports (No Lazy Loading) ---
// We import all pages at the top
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import AddTaskPage from './pages/AddTaskPage';
import TasksPage from './pages/TasksPage';
import ProfilePage from './pages/ProfilePage';
// New pages for password reset
import ForgotPasswordPage from './pages/ForgotPasswordPage'; 
import ResetPasswordPage from './pages/ResetPasswordPage';   

/**
 * This is the wrapper for all authenticated pages.
 * It adds the main content area and the BottomNav.
 */
const AppLayout = ({ children }) => (
  <>
    <div className="app-container">
      {children}
    </div>
    <BottomNav />
  </>
);

function App() {
  // Check for auth token in local storage
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token; // true if token exists, false if not

  // Logout handler to pass down to the Profile page
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // Force a full refresh to clear all state
  };

  return (
    <Router>
      {/* Global components (modals/notifications) live outside <Routes> */}
      {/* so they can be triggered from any page. */}
      <Notification />
      <ConfirmationModal />
      <EditTaskModal />
      
      <Routes>
        {/* --- Public Routes --- */}
        {/* If user is authenticated, /login redirects to dashboard */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard" />} 
        />
        {/* New public routes for password reset */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        
        {/* --- Protected Routes --- */}
        {/* All other routes ("/*") are caught by this */}
        <Route 
          path="/*"
          element={
            isAuthenticated ? (
              // If user is logged in, show the app layout
              <AppLayout>
                <Routes>
                  {/* Nested routes for the authenticated app */}
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/add-task" element={<AddTaskPage />} />
                  <Route path="/profile" element={<ProfilePage onLogout={handleLogout} />} />
                  {/* Any other bad URL redirects to the dashboard */}
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </AppLayout>
            ) : (
              // If user is not logged in, redirect all paths to the login page
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;