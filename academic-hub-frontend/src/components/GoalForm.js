// src/components/GoalForm.js
import React, { useState, useEffect } from 'react';
import './GoalForm.css';

const GoalForm = ({ goal, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    text: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        text: goal.text || '',
        description: goal.description || '',
        priority: goal.priority || 'medium',
        dueDate: goal.dueDate ? new Date(goal.dueDate).toISOString().split('T')[0] : ''
      });
    }
  }, [goal]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
    };
    onSubmit(submitData);
  };

  const priorityOptions = [
    { value: 'low', label: 'Low', color: '#10B981' },
    { value: 'medium', label: 'Medium', color: '#F59E0B' },
    { value: 'high', label: 'High', color: '#EF4444' }
  ];

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h2>{goal ? 'Edit Goal' : 'Add New Goal'}</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="goal-form">
          <div className="form-group">
            <label htmlFor="text">Goal Title *</label>
            <input
              type="text"
              id="text"
              name="text"
              value={formData.text}
              onChange={handleChange}
              required
              placeholder="e.g., Complete calculus homework"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Additional details about this goal"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <div className="priority-options">
              {priorityOptions.map(option => (
                <label key={option.value} className="priority-option">
                  <input
                    type="radio"
                    name="priority"
                    value={option.value}
                    checked={formData.priority === option.value}
                    onChange={handleChange}
                  />
                  <span 
                    className="priority-label"
                    style={{ color: option.color }}
                  >
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {goal ? 'Update Goal' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalForm;
