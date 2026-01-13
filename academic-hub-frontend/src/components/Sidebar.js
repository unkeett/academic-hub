// src/components/Sidebar.js
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

// Accept isOpen and onClose props
const Sidebar = ({ isOpen, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose}></div>}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <ul className="sidebar-menu">
          <li><Link to="/" onClick={onClose}>Dashboard</Link></li>
          <li><Link to="/subjects" onClick={onClose}>Subjects</Link></li>
          <li><Link to="/goals" onClick={onClose}>Goals</Link></li>
          <li><Link to="/tutorials" onClick={onClose}>Tutorials</Link></li>
          <li><Link to="/ideas" onClick={onClose}>Ideas</Link></li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;