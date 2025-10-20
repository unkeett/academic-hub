// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axiosConfig';
import DashboardSubjects from '../components/DashboardSubjects';
import DashboardGoals from '../components/DashboardGoals';
import './HomePage.css';

const HomePage = () => {
  const [stats, setStats] = useState({
    subjects: 0,
    goals: 0,
    tutorials: 0,
    ideas: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Check if user is authenticated (has token)
      const token = localStorage.getItem('token');
      
      if (token) {
        // User is authenticated, fetch actual data
        const [subjectsRes, goalsRes, tutorialsRes, ideasRes] = await Promise.all([
          api.get('/api/subjects'),
          api.get('/api/goals'),
          api.get('/api/tutorials'),
          api.get('/api/ideas')
        ]);

        setStats({
          subjects: subjectsRes.data.count,
          goals: goalsRes.data.count,
          tutorials: tutorialsRes.data.count,
          ideas: ideasRes.data.count
        });
      } else {
        // User is not authenticated, set default values
        setStats({
          subjects: 0,
          goals: 0,
          tutorials: 0,
          ideas: 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set default values on error
      setStats({
        subjects: 0,
        goals: 0,
        tutorials: 0,
        ideas: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="home-page">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="page-header">
        <h1>Welcome to Academic Hub</h1>
        <p>Your personal academic organization center</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{stats.subjects}</h3>
            <p>Subjects</p>
            <Link to="/subjects" className="stat-link">Manage →</Link>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>{stats.goals}</h3>
            <p>Goals</p>
            <Link to="/goals" className="stat-link">Manage →</Link>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📺</div>
          <div className="stat-content">
            <h3>{stats.tutorials}</h3>
            <p>Tutorials</p>
            <Link to="/tutorials" className="stat-link">Manage →</Link>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💡</div>
          <div className="stat-content">
            <h3>{stats.ideas}</h3>
            <p>Ideas</p>
            <Link to="/ideas" className="stat-link">Manage →</Link>
          </div>
        </div>
      </div>

      <div className="dashboard-widgets">
        <DashboardSubjects />
        <DashboardGoals />
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/subjects" className="action-btn">
            <span className="action-icon">📚</span>
            <span>Add Subject</span>
          </Link>
          <Link to="/goals" className="action-btn">
            <span className="action-icon">🎯</span>
            <span>Set Goal</span>
          </Link>
          <Link to="/tutorials" className="action-btn">
            <span className="action-icon">📺</span>
            <span>Save Tutorial</span>
          </Link>
          <Link to="/ideas" className="action-btn">
            <span className="action-icon">💡</span>
            <span>Capture Idea</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;