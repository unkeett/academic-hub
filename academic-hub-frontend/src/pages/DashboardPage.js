// src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';
import DashboardSubjects from '../components/DashboardSubjects';
import DashboardGoals from '../components/DashboardGoals';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
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
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
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

  const goalData = [
    { name: 'Completed', value: stats.completedGoals },
    { name: 'Pending', value: stats.totalGoals - stats.completedGoals }
  ];

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

      <div className="charts-section">
        <div className="chart-container">
          <h3>Subject Progress</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer>
              <BarChart data={stats.subjectStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completionRate" fill="#8884d8" name="Completion %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <h3>Goal Completion</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={goalData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {goalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
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

export default DashboardPage;