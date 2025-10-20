// src/components/IdeaCard.js
import React from 'react';
import './IdeaCard.css';

const IdeaCard = ({ idea, onEdit, onDelete }) => {
  const getCategoryColor = (category) => {
    switch (category) {
      case 'study': return '#3B82F6';
      case 'project': return '#8B5CF6';
      case 'research': return '#10B981';
      case 'general': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'study': return '📚';
      case 'project': return '🚀';
      case 'research': return '🔬';
      case 'general': return '💡';
      default: return '💡';
    }
  };

  return (
    <div className="idea-card">
      <div className="card-header">
        <div className="idea-info">
          <h3 className="idea-title">{idea.title}</h3>
          <div className="idea-meta">
            <span 
              className="category-badge"
              style={{ backgroundColor: getCategoryColor(idea.category) }}
            >
              {getCategoryIcon(idea.category)} {idea.category}
            </span>
          </div>
        </div>
        <div className="card-actions">
          <button 
            className="action-btn edit-btn"
            onClick={() => onEdit(idea)}
            title="Edit idea"
          >
            ✏️
          </button>
          <button 
            className="action-btn delete-btn"
            onClick={() => onDelete(idea._id)}
            title="Delete idea"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="idea-content">
        <p className="idea-text">{idea.content}</p>
      </div>

      {idea.tags && idea.tags.length > 0 && (
        <div className="tags-section">
          <div className="tags-list">
            {idea.tags.map((tag, index) => (
              <span key={index} className="tag">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="card-footer">
        <span className="created-date">
          Created {new Date(idea.createdAt).toLocaleDateString()}
        </span>
        {idea.updatedAt !== idea.createdAt && (
          <span className="updated-date">
            Updated {new Date(idea.updatedAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default IdeaCard;
