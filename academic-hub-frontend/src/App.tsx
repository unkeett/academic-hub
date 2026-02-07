// src/App.tsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import SubjectsPage from './pages/SubjectsPage';
import GoalsPage from './pages/GoalsPage';
import TutorialsPage from './pages/TutorialsPage';
import IdeasPage from './pages/IdeasPage';
import SearchPage from './pages/SearchPage';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

const AppContent = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const isLandingPage = location.pathname === '/';
  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password' ||
    location.pathname.startsWith('/reset-password');

  const showNavAndSidebar = !isLandingPage && !isAuthPage;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="App">
      {showNavAndSidebar && (
        <>
          <Navbar toggleSidebar={toggleSidebar} />
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </>
      )}

      <main className={`content ${isSidebarOpen && showNavAndSidebar ? 'sidebar-open' : ''} ${isLandingPage ? 'landing-content' : ''}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:resettoken" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />

          <Route path="/search" element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          } />

          {/* Combined Routes (Public access, but can be protected if needed) */}
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/tutorials" element={<TutorialsPage />} />
          <Route path="/ideas" element={<IdeasPage />} />

          {/* Catch all route - redirect to dashboard if authenticated, else landing */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;