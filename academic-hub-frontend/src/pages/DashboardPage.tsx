import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';
import DashboardSubjects from '../components/DashboardSubjects';
import DashboardGoals from '../components/DashboardGoals';
import AnalyticsSection from '../components/AnalyticsSection';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    subjects: 0,
    goals: 0,
    tutorials: 0,
    ideas: 0
  });
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
    fetchAnalytics();
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
          subjects: subjectsRes.data.count || subjectsRes.data.data?.length || 0,
          goals: goalsRes.data.count || goalsRes.data.data?.length || 0,
          tutorials: tutorialsRes.data.count || tutorialsRes.data.data?.length || 0,
          ideas: ideasRes.data.count || ideasRes.data.data?.length || 0
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

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.get('/api/stats/summary');
        if (response.data.success) {
          setAnalyticsData(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            Welcome back, <span>{user ? user.name.split(' ')[0] : 'Student'}</span>
          </h1>
          <p>
            You have {stats.subjects} subjects and {stats.goals} goals in progress.
            Keep up the great work!
          </p>

          <div className="hero-actions">
            <Link to="/subjects" className="hero-btn primary">
              My Subjects
            </Link>
            <Link to="/goals" className="hero-btn secondary">
              My Goals
            </Link>
          </div>
        </div>
      </section>


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

      <AnalyticsSection
        analyticsData={analyticsData}
        loading={analyticsLoading}
      />

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

export default DashboardPage;
