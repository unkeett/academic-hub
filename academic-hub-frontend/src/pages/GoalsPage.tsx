import React, { useState, useEffect, ElementType } from 'react';
import api from '../utils/axiosConfig';
import GoalCard from '../components/GoalCard';
import GoalForm from '../components/GoalForm';
import { FaPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './GoalsPage.css';

interface Goal {
  _id: string;
  text: string;
  completed: boolean;
  description?: string;
  dueDate?: string;
  priority?: 'high' | 'medium' | 'low';
  createdAt: string;
  updatedAt: string;
}

interface GoalFormData {
  text: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
}

const PlusIcon = FaPlus as ElementType;

const GoalsPage: React.FC = () => {
  const { token } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    fetchGoals();
  }, [token]);

  const fetchGoals = async (): Promise<void> => {
    // Check if user is authenticated before making API call
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/api/goals');
      setGoals(response.data.data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (goalData: GoalFormData): Promise<void> => {
    try {
      const response = await api.post('/api/goals', goalData);
      setGoals([response.data.data, ...goals]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const handleUpdateGoal = async (id: string, goalData: GoalFormData): Promise<void> => {
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

  const handleDeleteGoal = async (id: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await api.delete(`/api/goals/${id}`);
        setGoals(goals.filter(goal => goal._id !== id));
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  const handleToggleGoal = async (id: string): Promise<void> => {
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
          onClick={(): void => setFilter('all')}
        >
          All ({totalCount})
        </button>
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={(): void => setFilter('pending')}
        >
          Pending ({totalCount - completedCount})
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={(): void => setFilter('completed')}
        >
          Completed ({completedCount})
        </button>
      </div>

      {showForm && (
        <GoalForm
          onSubmit={handleCreateGoal}
          onCancel={(): void => setShowForm(false)}
        />
      )}

      {editingGoal && (
        <GoalForm
          goal={{
            text: editingGoal.text,
            description: editingGoal.description || '',
            priority: editingGoal.priority || 'medium',
            dueDate: editingGoal.dueDate || ''
          }}
          onSubmit={(data: GoalFormData): Promise<void> => handleUpdateGoal(editingGoal._id, data)}
          onCancel={(): void => setEditingGoal(null)}
        />
      )}

      <div className="goals-list">
        {filteredGoals.length > 0 ? (
          filteredGoals.map(goal => (
            <GoalCard
              key={goal._id}
              goal={goal}
              onEdit={(goal): void => setEditingGoal(goal)}
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
                onClick={(): void => setShowForm(true)}
              >
                Add Your First Goal
              </button>
            )}
          </div>
        )}
      </div>

      <button
        className="fab"
        onClick={(): void => setShowForm(true)}
        title="Add New Goal"
      >
        <PlusIcon />
      </button>
    </div>
  );
};

export default GoalsPage;
