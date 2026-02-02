// src/components/Navbar.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaSignOutAlt, FaUserCircle, FaGraduationCap, FaSun, FaMoon, FaSearch, FaHistory } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [showRecent, setShowRecent] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowRecent(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Save to recent searches
    const updatedRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updatedRecent);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));

    setShowRecent(false);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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

        {isAuthenticated && (
          <div className="navbar-center" ref={searchRef}>
            <form onSubmit={handleSearch} className="search-bar-form">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowRecent(true)}
                className="search-input"
              />
            </form>
            {showRecent && recentSearches.length > 0 && (
              <div className="recent-searches-dropdown">
                <div className="dropdown-title">Recent Searches</div>
                {recentSearches.map((term, index) => (
                  <div
                    key={index}
                    className="recent-item"
                    onClick={() => {
                      setQuery(term);
                      navigate(`/search?q=${encodeURIComponent(term)}`);
                      setShowRecent(false);
                    }}
                  >
                    <FaHistory className="recent-icon" />
                    <span>{term}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="navbar-right">
          <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>
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
