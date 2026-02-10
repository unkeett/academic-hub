import React, { ElementType } from 'react';
import {
  FaEdit,
  FaTrash,
  FaYoutube,
  FaTv,
  FaEye,
  FaCheck,
  FaBookmark,
  FaRegBookmark,
} from 'react-icons/fa';
import './TutorialCard.css';

interface Tutorial {
  _id: string;
  title: string;
  url: string;
  description?: string;
  channel?: string;
  duration?: string;
  thumbnail?: string;
  watched: boolean;
  createdAt: string;
}

interface TutorialCardProps {
  tutorial: Tutorial;
  onEdit: (tutorial: Tutorial) => void;
  onDelete: (id: string) => void;
  onToggleWatched: (id: string) => void;
  isBookmarked?: boolean;
  onToggleBookmark: (id: string) => void;
}

const TutorialCard: React.FC<TutorialCardProps> = ({
  tutorial,
  onEdit,
  onDelete,
  onToggleWatched,
  isBookmarked = false,
  onToggleBookmark,
}) => {
  const YoutubeIcon = FaYoutube as ElementType;
  const TvIcon = FaTv as ElementType;
  const CheckIcon = FaCheck as ElementType;
  const EyeIcon = FaEye as ElementType;
  const EditIcon = FaEdit as ElementType;
  const TrashIcon = FaTrash as ElementType;
  const BookmarkIcon = FaBookmark as ElementType;
  const RegBookmarkIcon = FaRegBookmark as ElementType;

  const formatDuration = (duration?: string) => {
    if (!duration) return 'Unknown';
    return duration;
  };

  const getVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getVideoId(tutorial.url);
  const thumbnailUrl = tutorial.thumbnail || `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

  return (
    <div className={`tutorial-card ${tutorial.watched ? 'watched' : ''}`}>
      <div className="tutorial-thumbnail">
        <img src={thumbnailUrl} alt={tutorial.title} className="thumbnail-image" />
        <div className="thumbnail-overlay">
          <a
            href={tutorial.url}
            target="_blank"
            rel="noopener noreferrer"
            className="play-button"
            title="Play Video"
          >
            <YoutubeIcon />
          </a>
        </div>
        <div className="duration-badge">{formatDuration(tutorial.duration)}</div>
        {tutorial.watched && (
          <div className="watched-status-badge">
            <CheckIcon /> <span>Watched</span>
          </div>
        )}
      </div>

      <div className="tutorial-content">
        <div className="card-header">
          <h3 className="tutorial-title" title={tutorial.title}>
            {tutorial.title}
          </h3>
          <div className="card-actions">
            <button className="action-btn edit-btn" onClick={() => onEdit(tutorial)} title="Edit tutorial">
              <EditIcon />
            </button>
            <button className="action-btn delete-btn" onClick={() => onDelete(tutorial._id)} title="Delete tutorial">
              <TrashIcon />
            </button>
          </div>
        </div>

        <div className="tutorial-meta">
          <div className="channel-info">
            <TvIcon className="meta-icon" />
            <span className="channel-name">{tutorial.channel}</span>
          </div>

          <button
            className={`watch-status-btn ${tutorial.watched ? 'watched' : 'unwatched'}`}
            onClick={() => onToggleWatched(tutorial._id)}
            title={tutorial.watched ? 'Mark as unwatched' : 'Mark as watched'}
          >
            {tutorial.watched ? (
              <>
                <CheckIcon /> <span>Watched</span>
              </>
            ) : (
              <>
                <EyeIcon /> <span>Mark Watched</span>
              </>
            )}
          </button>

          <button
            className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={() => onToggleBookmark(tutorial._id)}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Tutorial'}
          >
            {isBookmarked ? <BookmarkIcon /> : <RegBookmarkIcon />}
          </button>
        </div>

        {tutorial.description && <p className="tutorial-description">{tutorial.description}</p>}

        <div className="card-footer">
          <a href={tutorial.url} target="_blank" rel="noopener noreferrer" className="watch-link">
            Watch on YouTube
          </a>
        </div>
      </div>
    </div>
  );
};

export default TutorialCard;
