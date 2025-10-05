// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar'; // Import the new Sidebar component
import HomePage from './pages/HomePage';
import './App.css'; 

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="App">
        <Navbar toggleSidebar={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} />
        
        {/* Add a class to the main content based on sidebar state */}
        <main className={`content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/goals" element={<h1>My Goals</h1>} />
            <Route path="/subjects" element={<h1>My Subjects</h1>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;