// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaSignOutAlt, FaUserCircle, FaGraduationCap } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

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
        <div className="navbar-left">
          <button className="menu-btn" onClick={toggleSidebar} title="Toggle Sidebar">
            <FaBars />
          </button>
          <Link to="/" className="nav-brand">
            <FaGraduationCap className="brand-icon" />
            ACADEMIC <span>HUB</span>
          </Link>
        </div>
        
        <div className="navbar-right">
          {isAuthenticated && user ? (
            <div className="user-profile">
              <div className="user-info">
                <FaUserCircle className="user-icon" />
                <span className="user-name">{user.name}</span>
              </div>
              <button className="logout-icon-btn" onClick={handleLogout} title="Logout">
                <FaSignOutAlt />
              </button>
            </div>
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