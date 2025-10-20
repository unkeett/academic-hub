// src/pages/GoalsPage.js
import React, { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';
import GoalCard from '../components/GoalCard';
import GoalForm from '../components/GoalForm';
import './GoalsPage.css';

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [filter, setFilter] = useState('all'); // all, completed, pending

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await api.get('/api/goals');
      setGoals(response.data.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (goalData) => {
    try {
      const response = await api.post('/api/goals', goalData);
      setGoals([response.data.data, ...goals]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const handleUpdateGoal = async (id, goalData) => {
    try {
      const response = await api.put(`/api/goals/${id}`, goalData);
      setGoals(goals.map(goal => 
        goal._id === id ? response.data.data : goal
      ));
      setEditingGoal(null);
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleDeleteGoal = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await api.delete(`/api/goals/${id}`);
        setGoals(goals.filter(goal => goal._id !== id));
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  const handleToggleGoal = async (id) => {
    try {
      const response = await api.put(`/api/goals/${id}/toggle`);
      setGoals(goals.map(goal => 
        goal._id === id ? response.data.data : goal
      ));
    } catch (error) {
      console.error('Error toggling goal:', error);
    }
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
      <div className="page-header">
        <div className="header-content">
          <h1>My Goals</h1>
          <div className="goals-stats">
            <span className="stat">
              {completedCount} of {totalCount} completed
            </span>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add New Goal
        </button>
      </div>

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
    </div>
  );
};

export default GoalsPage;
