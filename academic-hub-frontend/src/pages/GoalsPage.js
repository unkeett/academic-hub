// src/pages/GoalsPage.js
import React, { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';
import GoalCard from '../components/GoalCard';
import GoalForm from '../components/GoalForm';
import { FaPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import './GoalsPage.css';

const GoalsPage = () => {
  const { token } = useAuth();
  const { showNotification } = useNotification();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [filter, setFilter] = useState('all'); // all, completed, pending

  useEffect(() => {
    fetchGoals();
  }, [token]);

  const fetchGoals = async () => {
    // Check if user is authenticated before making API call
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/api/goals');
      setGoals(response.data.data || []);
    } catch (error) {
      showNotification('Failed to load your goals. Please try again.', 'error');
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (goalData) => {
    try {
      const response = await api.post('/api/goals', goalData);
      setGoals([response.data.data, ...goals]);
      setShowForm(false);
      showNotification('Goal added! Let\'s get to work.', 'success');
    } catch (error) {}
  };

  const handleUpdateGoal = async (id, goalData) => {
    try {
      const response = await api.put(`/api/goals/${id}`, goalData);
      setGoals(goals.map(goal =>
        goal._id === id ? response.data.data : goal
      ));
      setEditingGoal(null);
      showNotification('Goal updated successfully.', 'success');
    } catch (error) {}
  };

  const handleDeleteGoal = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await api.delete(`/api/goals/${id}`);
        setGoals(goals.filter(goal => goal._id !== id));
        showNotification('Goal removed.', 'info');
      } catch (error) {
      }
    }
  };

  const handleToggleGoal = async (id) => {
    try {
      const response = await api.put(`/api/goals/${id}/toggle`);
      const updatedGoal = response.data.data;
      setGoals(goals.map(goal =>
        goal._id === id ? response.data.data : goal
      ));
      if (updatedGoal.completed) {
        showNotification('Goal completed! Nice job! 🎉', 'success');
      } else {
        showNotification('Goal moved back to pending.', 'info');
      }
    } catch (error) {}
  };

  const filteredGoals = goals.filter(goal => {
    if (filter === 'completed') return goal.completed;
    if (filter === 'pending') return !goal.completed;
    return true;
  });

  const completedCount = goals.filter(goal => goal.completed).length;
  const totalCount = goals.length;

  if (loading) {
    return (
      <div className="goals-page">
        <div className="loading">Loading goals...</div>
      </div>
    );
  }

  return (
    <div className="goals-page">
      <header className="page-header">
        <h1>My Goals</h1>
        <div className="page-stats">
          <span>
            {completedCount} of {totalCount} completed
          </span>
          <div className="mini-progress-bar">
            <div
              className="mini-progress-fill"
              style={{
                width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%',
                backgroundColor: 'var(--success)'
              }}
            ></div>
          </div>
        </div>
      </header>

      <div className="goals-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({totalCount})
        </button>
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending ({totalCount - completedCount})
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed ({completedCount})
        </button>
      </div>

      {showForm && (
        <GoalForm
          onSubmit={handleCreateGoal}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingGoal && (
        <GoalForm
          goal={editingGoal}
          onSubmit={(data) => handleUpdateGoal(editingGoal._id, data)}
          onCancel={() => setEditingGoal(null)}
        />
      )}

      <div className="goals-list">
        {filteredGoals.length > 0 ? (
          filteredGoals.map(goal => (
            <GoalCard
              key={goal._id}
              goal={goal}
              onEdit={setEditingGoal}
              onDelete={handleDeleteGoal}
              onToggle={handleToggleGoal}
            />
          ))
        ) : (
          <div className="empty-state">
            <h3>No goals found</h3>
            <p>
              {filter === 'all'
                ? "Add your first goal to start tracking your progress."
                : `No ${filter} goals found.`
              }
            </p>
            {filter === 'all' && (
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                Add Your First Goal
              </button>
            )}
          </div>
        )}
      </div>

      <button
        className="fab"
        onClick={() => setShowForm(true)}
        title="Add New Goal"
      >
        <FaPlus />
      </button>
    </div>
  );
};

export default GoalsPage;
