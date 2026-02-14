// src/components/DashboardGoals.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axiosConfig';
import './DashboardGoals.css';

const DashboardGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    // Check if user is authenticated before making API call
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/api/goals');
      // Sort goals to show incomplete ones first
      const sortedGoals = (response.data.data || []).sort((a, b) => a.completed - b.completed);
      setGoals(sortedGoals);
    } catch (error) {
      console.error('Error fetching goals:', error);
      // Don't redirect if we're already handling the error
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    try {
      await api.put(`/api/goals/${id}/toggle`);
      // Refetch goals to update the UI
      fetchGoals();
    } catch (error) {
      console.error('Error toggling goal:', error);
    }
  };

  if (loading) {
    return <div className="goals-widget card"><h3>Today's Goals</h3><p>Loading...</p></div>;
  }

  const pendingGoals = goals.filter(goal => !goal.completed);
  const completedGoals = goals.filter(goal => goal.completed);

  return (
    <div className="goals-widget card">
      <div className="widget-header">
        <h3>Today's Goals</h3>
        <Link to="/goals" className="view-all-link">View All</Link>
      </div>
      
      {goals.length > 0 ? (
        <div className="goals-content">
          <div className="goals-stats">
            <span className="stat">
              {completedGoals.length} of {goals.length} completed
            </span>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${(completedGoals.length / goals.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <ul className="goals-list">
            {pendingGoals.slice(0, 3).map((goal) => (
              <li key={goal._id} className="goal-item">
                <input
                  type="checkbox"
                  checked={goal.completed}
                  onChange={() => toggleComplete(goal._id, goal.completed)}
                />
                <span className="goal-text">{goal.text}</span>
                {goal.priority === 'high' && <span className="priority-high">!</span>}
              </li>
            ))}
            {pendingGoals.length > 3 && (
              <li className="more-goals">
                <Link to="/goals">
                  +{pendingGoals.length - 3} more pending goals
                </Link>
              </li>
            )}
          </ul>
        </div>
      ) : (
        <div className="empty-state">
          <p>No goals set for today. Add one!</p>
          <Link to="/goals" className="btn btn-primary">Add Goal</Link>
        </div>
      )}
    </div>
  );
};

export default DashboardGoals;