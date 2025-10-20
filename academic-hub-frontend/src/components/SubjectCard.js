// src/components/SubjectCard.js
import React, { useState } from 'react';
import './SubjectCard.css';

const SubjectCard = ({ subject, onEdit, onDelete, onUpdateProgress }) => {
  const [showTopics, setShowTopics] = useState(false);

  const calculateProgress = () => {
    if (!subject.topics || subject.topics.length === 0) {
      return 0;
    }
    return Math.round((subject.completedTopics / subject.topics.length) * 100);
  };

  const handleProgressUpdate = (e) => {
    const newCompletedTopics = parseInt(e.target.value);
    onUpdateProgress(subject._id, newCompletedTopics);
  };

  const progress = calculateProgress();

  return (
    <div className="subject-card" style={{ borderLeftColor: subject.color }}>
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
            ✏️
          </button>
          <button 
            className="action-btn delete-btn"
            onClick={() => onDelete(subject._id)}
            title="Delete subject"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-label">Progress</span>
          <span className="progress-percentage">{progress}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${progress}%`,
              backgroundColor: subject.color
            }}
          ></div>
        </div>
        <div className="progress-stats">
          <span>{subject.completedTopics || 0} of {subject.topics?.length || 0} topics completed</span>
        </div>
      </div>

      {subject.topics && subject.topics.length > 0 && (
        <div className="topics-section">
          <button 
            className="topics-toggle"
            onClick={() => setShowTopics(!showTopics)}
          >
            {showTopics ? 'Hide Topics' : 'Show Topics'} ({subject.topics.length})
          </button>
          
          {showTopics && (
            <div className="topics-list">
              {subject.topics.map((topic, index) => (
                <div 
                  key={index} 
                  className={`topic-item ${index < (subject.completedTopics || 0) ? 'completed' : ''}`}
                >
                  <span className="topic-text">{topic}</span>
                  {index < (subject.completedTopics || 0) && (
                    <span className="completed-icon">✓</span>
                  )}
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
