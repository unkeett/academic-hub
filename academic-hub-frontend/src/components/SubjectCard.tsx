import React, { useState, ElementType } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './SubjectCard.css';

interface Subject {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  topics?: string[];
  completedTopics?: number;
  createdAt: string;
}

interface SubjectCardProps {
  subject: Subject;
  onEdit: (subject: Subject) => void;
  onDelete: (id: string) => void;
  onUpdateProgress: (id: string, completedTopics: number) => void;
}

const EditIcon = FaEdit as ElementType;
const TrashIcon = FaTrash as ElementType;

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onEdit, onDelete, onUpdateProgress }) => {
  const [showTopics, setShowTopics] = useState(false);

  const calculateProgress = () => {
    if (!subject.topics || subject.topics.length === 0) {
      return 0;
    }
    return Math.round(((subject.completedTopics || 0) / subject.topics.length) * 100);
  };

  const handleProgressUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCompletedTopics = parseInt(e.target.value);
    onUpdateProgress(subject._id, newCompletedTopics);
  };

  const progress = calculateProgress();

  return (
    <div className="subject-card">
      <div className="card-accent" style={{ backgroundColor: subject.color }}></div>
      <div className="card-header">
        <div className="subject-info">
          <h3 className="subject-name">{subject.name}</h3>
          {subject.description && (
            <p className="subject-description">{subject.description}</p>
          )}
        </div>
        <div className="card-actions">
          <button
            className="action-btn edit-btn"
            onClick={() => onEdit(subject)}
            title="Edit subject"
          >
            <EditIcon />
          </button>
          <button
            className="action-btn delete-btn"
            onClick={() => onDelete(subject._id)}
            title="Delete subject"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-label">Progress</span>
          <span className="progress-percentage" style={{ color: subject.color }}>{progress}%</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar-bg">
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
                backgroundColor: subject.color,
                boxShadow: `0 0 10px ${subject.color}40`
              }}
            ></div>
          </div>
        </div>
        <div className="progress-stats">
          <span className="stats-text">
            <strong>{subject.completedTopics || 0}</strong> of <strong>{subject.topics?.length || 0}</strong> topics completed
          </span>
        </div>
      </div>

      {subject.topics && subject.topics.length > 0 && (
        <div className="topics-section">
          <button
            className={`topics-toggle ${showTopics ? 'active' : ''}`}
            onClick={() => setShowTopics(!showTopics)}
          >
            <span className="toggle-text">{showTopics ? 'Hide Topics' : 'Show Topics'}</span>
            <span className="toggle-count">{subject.topics.length}</span>
          </button>

          {showTopics && (
            <div className="topics-list">
              {subject.topics.map((topic, index) => (
                <div
                  key={index}
                  className={`topic-item ${index < (subject.completedTopics || 0) ? 'completed' : ''}`}
                >
                  <div className="topic-indicator">
                    {index < (subject.completedTopics || 0) ? (
                      <span className="completed-icon" style={{ color: subject.color }}>✓</span>
                    ) : (
                      <span className="pending-icon"></span>
                    )}
                  </div>
                  <span className="topic-text">{topic}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {subject.topics && subject.topics.length > 0 && (
        <div className="progress-control">
          <label htmlFor={`progress-${subject._id}`}>
            Completed Topics: {subject.completedTopics || 0}
          </label>
          <input
            type="range"
            id={`progress-${subject._id}`}
            min="0"
            max={subject.topics.length}
            value={subject.completedTopics || 0}
            onChange={handleProgressUpdate}
            className="progress-slider"
          />
        </div>
      )}

      <div className="card-footer">
        <span className="created-date">
          Created {new Date(subject.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default SubjectCard;
