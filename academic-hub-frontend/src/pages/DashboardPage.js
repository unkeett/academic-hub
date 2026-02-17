// src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';
import DashboardSubjects from '../components/DashboardSubjects';
import DashboardGoals from '../components/DashboardGoals';
import AnalyticsSection from '../components/AnalyticsSection';
import './DashboardPage.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const DashboardPage = () => {
  const [stats, setStats] = useState({
    subjects: 0,
    goals: 0,
    tutorials: 0,
    ideas: 0,
    goalCompletionRate: 0,
    subjectStats: [],
    completedGoals: 0,
    totalGoals: 0
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
      const token = localStorage.getItem('token');
      if (token) {
        const res = await api.get('/api/stats/summary');
        setStats({
          subjects: res.data.data.totalSubjects,
          goals: res.data.data.totalGoals,
          tutorials: res.data.data.totalTutorials,
          ideas: res.data.data.totalIdeas,
          goalCompletionRate: res.data.data.goalCompletionRate,
          subjectStats: res.data.data.subjectStats,
          completedGoals: res.data.data.completedGoals,
          totalGoals: res.data.data.totalGoals
        });
      } else {
        setStats({
          subjects: 0,
          goals: 0,
          tutorials: 0,
          ideas: 0,
          goalCompletionRate: 0,
          subjectStats: [],
          completedGoals: 0,
          totalGoals: 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        subjects: 0,
        goals: 0,
        tutorials: 0,
        ideas: 0,
        goalCompletionRate: 0,
        subjectStats: [],
        completedGoals: 0,
        totalGoals: 0
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
