// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 

// Accept toggleSidebar as a prop
const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Menu button to toggle the sidebar */}
        <button className="menu-btn" onClick={toggleSidebar}>
          ☰
        </button>
        <Link to="/" className="nav-brand">Academic Hub</Link>
      </div>
    </nav>
  );
};

export default Navbar;