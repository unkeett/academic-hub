// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css'; 

// Accept toggleSidebar as a prop
const Navbar = ({ toggleSidebar }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
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
          {isAuthenticated && user ? (
            <>
              <span className="user-greeting">Welcome, {user.name}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="login-link">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;