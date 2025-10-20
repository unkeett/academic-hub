// src/components/GoalCard.js
import React from 'react';
import './GoalCard.css';

const GoalCard = ({ goal, onEdit, onDelete, onToggle }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: 'Overdue', className: 'overdue' };
    } else if (diffDays === 0) {
      return { text: 'Due today', className: 'due-today' };
    } else if (diffDays === 1) {
      return { text: 'Due tomorrow', className: 'due-soon' };
    } else if (diffDays <= 7) {
      return { text: `Due in ${diffDays} days`, className: 'due-soon' };
    } else {
      return { text: date.toLocaleDateString(), className: 'due-normal' };
    }
  };

  const dueDateInfo = formatDueDate(goal.dueDate);

  return (
    <div className={`goal-card ${goal.completed ? 'completed' : ''}`}>
      <div className="card-header">
        <div className="goal-info">
          <div className="goal-title-section">
            <input
              type="checkbox"
              checked={goal.completed}
              onChange={() => onToggle(goal._id)}
              className="goal-checkbox"
            />
            <h3 className={`goal-title ${goal.completed ? 'strikethrough' : ''}`}>
              {goal.text}
            </h3>
          </div>
          {goal.description && (
            <p className="goal-description">{goal.description}</p>
          )}
        </div>
        <div className="card-actions">
          <button 
            className="action-btn edit-btn"
            onClick={() => onEdit(goal)}
            title="Edit goal"
          >
            ✏️
          </button>
          <button 
            className="action-btn delete-btn"
            onClick={() => onDelete(goal._id)}
            title="Delete goal"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="goal-meta">
        <div className="priority-badge">
          <span 
            className="priority-dot"
            style={{ backgroundColor: getPriorityColor(goal.priority) }}
          ></span>
          <span className="priority-text">{goal.priority}</span>
        </div>
        
        {dueDateInfo && (
          <div className={`due-date ${dueDateInfo.className}`}>
            📅 {dueDateInfo.text}
          </div>
        )}
      </div>

      <div className="card-footer">
        <span className="created-date">
          Created {new Date(goal.createdAt).toLocaleDateString()}
        </span>
        {goal.completed && (
          <span className="completed-date">
            Completed {new Date(goal.updatedAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default GoalCard;
