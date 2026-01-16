// src/components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaBook, FaBullseye, FaVideo, FaLightbulb, FaThLarge } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <ul className="sidebar-menu">
          <li>
            <NavLink to="/" end onClick={toggleSidebar}>
              <FaHome className="menu-icon" />
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard" onClick={toggleSidebar}>
              <FaThLarge className="menu-icon" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/subjects" onClick={toggleSidebar}>
              <FaBook className="menu-icon" />
              <span>Subjects</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/goals" onClick={toggleSidebar}>
              <FaBullseye className="menu-icon" />
              <span>Goals</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/tutorials" onClick={toggleSidebar}>
              <FaVideo className="menu-icon" />
              <span>Tutorials</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/ideas" onClick={toggleSidebar}>
              <FaLightbulb className="menu-icon" />
              <span>Ideas</span>
            </NavLink>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;