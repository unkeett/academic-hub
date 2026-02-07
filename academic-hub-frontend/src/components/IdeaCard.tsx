import React, { ElementType } from 'react';
import { FaEdit, FaTrash, FaLightbulb, FaFlask, FaRocket, FaBook } from 'react-icons/fa';
import './IdeaCard.css';

interface Idea {
  _id: string;
  title: string;
  content: string;
  category?: 'study' | 'project' | 'research' | 'general' | string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface IdeaCardProps {
  idea: Idea;
  onEdit: (idea: Idea) => void;
  onDelete: (id: string) => void;
}

const EditIcon = FaEdit as ElementType;
const TrashIcon = FaTrash as ElementType;
const BookIcon = FaBook as ElementType;
const RocketIcon = FaRocket as ElementType;
const FlaskIcon = FaFlask as ElementType;
const LightbulbIcon = FaLightbulb as ElementType;

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onEdit, onDelete }) => {
  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'study': return <BookIcon />;
      case 'project': return <RocketIcon />;
      case 'research': return <FlaskIcon />;
      case 'general': return <LightbulbIcon />;
      default: return <LightbulbIcon />;
    }
  };

  const getCategoryStyles = (category?: string) => {
    switch (category) {
      case 'study': return { color: 'var(--primary)', bg: 'var(--primary-light)' };
      case 'project': return { color: '#7c3aed', bg: '#f5f3ff' }; // Keep project distinct
      case 'research': return { color: 'var(--success)', bg: 'var(--success-light)' };
      case 'general': return { color: 'var(--secondary)', bg: 'var(--background)' };
      default: return { color: 'var(--secondary)', bg: 'var(--background)' };
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
            <EditIcon />
          </button>
          <button
            className="action-btn delete-btn"
            onClick={() => onDelete(idea._id)}
            title="Delete idea"
          >
            <TrashIcon />
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
