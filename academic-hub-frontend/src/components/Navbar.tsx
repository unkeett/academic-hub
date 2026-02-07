import React, { useState, useEffect, useRef, ElementType } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaSignOutAlt, FaUserCircle, FaGraduationCap, FaSun, FaMoon, FaSearch, FaHistory } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

interface NavbarProps {
  toggleSidebar: () => void;
}

const BarsIcon = FaBars as ElementType;
const SignOutIcon = FaSignOutAlt as ElementType;
const UserIcon = FaUserCircle as ElementType;
const GradCapIcon = FaGraduationCap as ElementType;
const SunIcon = FaSun as ElementType;
const MoonIcon = FaMoon as ElementType;
const SearchIcon = FaSearch as ElementType;
const HistoryIcon = FaHistory as ElementType;

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [showRecent, setShowRecent] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        setRecentSearches([]);
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowRecent(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
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
            <BarsIcon />
          </button>
          <Link to="/" className="nav-brand">
            <GradCapIcon className="brand-icon" />
            ACADEMIC <span>HUB</span>
          </Link>
        </div>

        {isAuthenticated && (
          <div className="navbar-center" ref={searchRef}>
            <form onSubmit={handleSearch} className="search-bar-form">
              <SearchIcon className="search-icon" />
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
                    <HistoryIcon className="recent-icon" />
                    <span>{term}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="navbar-right">
          <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
          {isAuthenticated && user ? (
            <div className="user-profile">
              <div className="user-info">
                <UserIcon className="user-icon" />
                <span className="user-name">{user.name}</span>
              </div>
              <button className="logout-icon-btn" onClick={handleLogout} title="Logout">
                <SignOutIcon />
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
