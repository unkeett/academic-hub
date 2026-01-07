// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

// Accept isOpen as a prop to control visibility
const Sidebar = ({ isOpen }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <ul className="sidebar-menu">
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/subjects">Subjects</Link></li>
        <li><Link to="/goals">Goals</Link></li>
        <li><Link to="/tutorials">Tutorials</Link></li>
        <li><Link to="/ideas">Ideas</Link></li>
      </ul>
    </aside>
  );
};

export default Sidebar;