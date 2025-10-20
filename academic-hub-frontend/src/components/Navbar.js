// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css'; 

// Accept toggleSidebar as a prop
const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Menu button to toggle the sidebar */}
        <button className="menu-btn" onClick={toggleSidebar}>
          ☰
        </button>
        <Link to="/" className="nav-brand">Academic Hub</Link>
        
        <div className="navbar-right">
          <span className="user-greeting">Welcome, {user?.name}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;