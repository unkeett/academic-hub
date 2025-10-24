// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import SubjectsPage from './pages/SubjectsPage';
import GoalsPage from './pages/GoalsPage';
import TutorialsPage from './pages/TutorialsPage';
import IdeasPage from './pages/IdeasPage';

import './App.css'; 
import Login from './components/Login';

const AppContent = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="App">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} />
      
      <main className={`content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Routes>
          {/* All routes are now public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/tutorials" element={<TutorialsPage />} />
          <Route path="/ideas" element={<IdeasPage />} />
          <Route path="/login" element={<Login />} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;