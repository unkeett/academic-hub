// src/components/TutorialForm.js
import React, { useState, useEffect } from 'react';
import './TutorialForm.css';

const TutorialForm = ({ tutorial, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    url: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tutorial) {
      setFormData({
        url: tutorial.url || ''
      });
    }
  }, [tutorial]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting tutorial:', error);
    } finally {
      setLoading(false);
    }
  };

  const isValidYouTubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h2>{tutorial ? 'Edit Tutorial' : 'Add New Tutorial'}</h2>
          <button className="close-btn" onClick={onCancel} disabled={loading}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="tutorial-form">
          <div className="form-group">
            <label htmlFor="url">YouTube URL *</label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              required
              placeholder="https://www.youtube.com/watch?v=..."
              className={formData.url && !isValidYouTubeUrl(formData.url) ? 'error' : ''}
              disabled={loading}
            />
            {formData.url && !isValidYouTubeUrl(formData.url) && (
              <p className="error-message">Please enter a valid YouTube URL</p>
            )}
          </div>

          <div className="form-info">
            <p>
              <strong>How it works:</strong> Paste a YouTube URL and we'll automatically fetch the video details including title, channel, duration, and thumbnail.
            </p>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !isValidYouTubeUrl(formData.url)}
            >
              {loading ? 'Adding...' : (tutorial ? 'Update Tutorial' : 'Add Tutorial')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TutorialForm;
