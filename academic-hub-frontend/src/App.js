// src/App.js 
import React, { useState, useEffect } from 'react'; 
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'; 
import { AuthProvider, useAuth } from './context/AuthContext'; 
import { NotificationProvider, useNotification } from './context/NotificationContext'; // 1. Import Notification hooks
import { setNotificationHandler } from './utils/axiosConfig'; // 2. Import Axios bridge

import Navbar from './components/Navbar'; 
import Sidebar from './components/Sidebar'; 
import LandingPage from './pages/LandingPage'; 
import HomePage from './pages/HomePage'; 
import DashboardPage from './pages/DashboardPage'; 
import SubjectsPage from './pages/SubjectsPage'; 
import GoalsPage from './pages/GoalsPage'; 
import TutorialsPage from './pages/TutorialsPage'; 
import IdeasPage from './pages/IdeasPage'; 
import Footer from './components/Footer'; 
import ProtectedRoute from './components/ProtectedRoute';

import './App.css'; 
import Login from './components/Login'; 
import Register from './components/Register'; 

const AppContent = () => { 
  const [isSidebarOpen, setSidebarOpen] = useState(false); 
  const location = useLocation(); 
  const { isAuthenticated } = useAuth(); 
  const { showNotification } = useNotification(); // 3. Access notification trigger

  // 4. Connect Axios to our Notification system on mount
  useEffect(() => {
    setNotificationHandler(showNotification);
  }, [showNotification]);

  const toggleSidebar = () => { 
    setSidebarOpen(!isSidebarOpen); 
  }; 

  const isLandingPage = location.pathname === '/'; 
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'; 
  const showNavAndSidebar = !isLandingPage && !isAuthPage; 

  return ( 
    <div className="App"> 
      {showNavAndSidebar && <Navbar toggleSidebar={toggleSidebar} />} 
      {showNavAndSidebar && <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />} 
      
      <main className={`content ${isSidebarOpen && showNavAndSidebar ? 'sidebar-open' : ''} ${isLandingPage ? 'landing-content' : ''}`}> 
        <Routes> 
          <Route path="/" element={<LandingPage />} /> 
          <Route path="/home" element={<HomePage />} /> 
          <Route path="/login" element={<Login />} /> 
          <Route path="/register" element={<Register />} /> 

          <Route path="/dashboard" element={ 
            <ProtectedRoute> 
              <DashboardPage /> 
            </ProtectedRoute> 
          } /> 

          <Route path="/subjects" element={<SubjectsPage />} /> 
          <Route path="/goals" element={<GoalsPage />} /> 
          <Route path="/tutorials" element={<TutorialsPage />} /> 
          <Route path="/ideas" element={<IdeasPage />} /> 

          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />} /> 
        </Routes> 
      </main> 
      {!isAuthPage && <Footer />} 
    </div> 
  ); 
}; 

function App() { 
  return ( 
    <NotificationProvider> {/* 5. Wrap everything in NotificationProvider */}
      <AuthProvider> 
        <Router> 
          <AppContent /> 
        </Router> 
      </AuthProvider> 
    </NotificationProvider>
  ); 
} 

export default App;