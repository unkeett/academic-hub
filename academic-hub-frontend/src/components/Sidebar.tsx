import React, { ElementType } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaBook, FaBullseye, FaVideo, FaLightbulb, FaThLarge } from 'react-icons/fa';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const HomeIcon = FaHome as ElementType;
const DashboardIcon = FaThLarge as ElementType;
const SubjectsIcon = FaBook as ElementType;
const GoalsIcon = FaBullseye as ElementType;
const TutorialsIcon = FaVideo as ElementType;
const IdeasIcon = FaLightbulb as ElementType;

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <ul className="sidebar-menu">
          <li>
            <NavLink to="/" end onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link" : ""}>
              <HomeIcon className="menu-icon" />
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link" : ""}>
              <DashboardIcon className="menu-icon" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/subjects" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link" : ""}>
              <SubjectsIcon className="menu-icon" />
              <span>Subjects</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/goals" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link" : ""}>
              <GoalsIcon className="menu-icon" />
              <span>Goals</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/tutorials" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link" : ""}>
              <TutorialsIcon className="menu-icon" />
              <span>Tutorials</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/ideas" onClick={toggleSidebar} className={({ isActive }) => isActive ? "active-link" : ""}>
              <IdeasIcon className="menu-icon" />
              <span>Ideas</span>
            </NavLink>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;