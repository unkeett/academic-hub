// src/components/IdeaCard.js
import React from 'react';
import { FaEdit, FaTrash, FaLightbulb, FaFlask, FaRocket, FaBook } from 'react-icons/fa';
import './IdeaCard.css';

const IdeaCard = ({ idea, onEdit, onDelete }) => {
  const getCategoryStyles = (category) => {
    switch (category) {
      case 'study': return { color: 'var(--primary)', bg: 'var(--primary-light)' };
      case 'project': return { color: '#7c3aed', bg: '#f5f3ff' }; // Keep project distinct
      case 'research': return { color: 'var(--success)', bg: 'var(--success-light)' };
      case 'general': return { color: 'var(--secondary)', bg: 'var(--background)' };
      default: return { color: 'var(--secondary)', bg: 'var(--background)' };
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'study': return <FaBook />;
      case 'project': return <FaRocket />;
      case 'research': return <FaFlask />;
      case 'general': return <FaLightbulb />;
      default: return <FaLightbulb />;
    }
  };

  const styles = getCategoryStyles(idea.category);

  return (
    <div className="idea-card">
      <div className="card-header">
        <div className="idea-info">
          <h3 className="idea-title">{idea.title}</h3>
          <div className="idea-meta">
            <span 
              className="category-badge"
              style={{ color: styles.color, backgroundColor: styles.bg }}
            >
              {getCategoryIcon(idea.category)}
              <span className="category-name">{idea.category}</span>
            </span>
          </div>
        </div>
        <div className="card-actions">
          <button 
            className="action-btn edit-btn"
            onClick={() => onEdit(idea)}
            title="Edit idea"
          >
            <FaEdit />
          </button>
          <button 
            className="action-btn delete-btn"
            onClick={() => onDelete(idea._id)}
            title="Delete idea"
          >
            <FaTrash />
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
