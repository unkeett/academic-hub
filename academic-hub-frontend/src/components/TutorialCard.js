// src/components/TutorialCard.js
import React from 'react';
import './TutorialCard.css';

const TutorialCard = ({ tutorial, onEdit, onDelete, onToggleWatched }) => {
  const formatDuration = (duration) => {
    if (!duration) return 'Unknown';
    return duration;
  };

  const getVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getVideoId(tutorial.url);
  const thumbnailUrl = tutorial.thumbnail || `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

  return (
    <div className={`tutorial-card ${tutorial.watched ? 'watched' : ''}`}>
      <div className="tutorial-thumbnail">
        <img 
          src={thumbnailUrl} 
          alt={tutorial.title}
          className="thumbnail-image"
        />
        <div className="thumbnail-overlay">
          <a 
            href={tutorial.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="play-button"
          >
            ▶️
          </a>
        </div>
        <div className="duration-badge">
          {formatDuration(tutorial.duration)}
        </div>
        {tutorial.watched && (
          <div className="watched-badge">
            ✓ Watched
          </div>
        )}
      </div>

      <div className="tutorial-content">
        <div className="card-header">
          <h3 className="tutorial-title">{tutorial.title}</h3>
          <div className="card-actions">
            <button 
              className="action-btn edit-btn"
              onClick={() => onEdit(tutorial)}
              title="Edit tutorial"
            >
              ✏️
            </button>
            <button 
              className="action-btn delete-btn"
              onClick={() => onDelete(tutorial._id)}
              title="Delete tutorial"
            >
              🗑️
            </button>
          </div>
        </div>

        <div className="tutorial-meta">
          <div className="channel-info">
            <span className="channel-name">📺 {tutorial.channel}</span>
          </div>
          
          <button 
            className={`watch-status-btn ${tutorial.watched ? 'watched' : 'unwatched'}`}
            onClick={() => onToggleWatched(tutorial._id)}
          >
            {tutorial.watched ? '✓ Watched' : '👁️ Mark as Watched'}
          </button>
        </div>

        {tutorial.description && (
          <p className="tutorial-description">
            {tutorial.description.length > 150 
              ? `${tutorial.description.substring(0, 150)}...` 
              : tutorial.description
            }
          </p>
        )}

        <div className="card-footer">
          <a 
            href={tutorial.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="watch-link"
          >
            Watch on YouTube →
          </a>
          <span className="created-date">
            Added {new Date(tutorial.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TutorialCard;
