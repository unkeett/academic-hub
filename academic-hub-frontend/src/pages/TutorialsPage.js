// src/pages/TutorialsPage.js
import React, { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';
import TutorialCard from '../components/TutorialCard';
import TutorialForm from '../components/TutorialForm';
import './TutorialsPage.css';

const TutorialsPage = () => {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTutorial, setEditingTutorial] = useState(null);
  const [filter, setFilter] = useState('all'); // all, watched, unwatched

  useEffect(() => {
    fetchTutorials();
  }, []);

  const fetchTutorials = async () => {
    try {
      const response = await api.get('/api/tutorials');
      setTutorials(response.data.data);
    } catch (error) {
      console.error('Error fetching tutorials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTutorial = async (tutorialData) => {
    try {
      const response = await api.post('/api/tutorials', tutorialData);
      setTutorials([response.data.data, ...tutorials]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating tutorial:', error);
      alert(error.response?.data?.message || 'Error creating tutorial');
    }
  };

  const handleUpdateTutorial = async (id, tutorialData) => {
    try {
      const response = await api.put(`/api/tutorials/${id}`, tutorialData);
      setTutorials(tutorials.map(tutorial => 
        tutorial._id === id ? response.data.data : tutorial
      ));
      setEditingTutorial(null);
    } catch (error) {
      console.error('Error updating tutorial:', error);
    }
  };

  const handleDeleteTutorial = async (id) => {
    if (window.confirm('Are you sure you want to delete this tutorial?')) {
      try {
        await api.delete(`/api/tutorials/${id}`);
        setTutorials(tutorials.filter(tutorial => tutorial._id !== id));
      } catch (error) {
        console.error('Error deleting tutorial:', error);
      }
    }
  };

  const handleToggleWatched = async (id) => {
    try {
      const response = await api.put(`/api/tutorials/${id}/toggle`);
      setTutorials(tutorials.map(tutorial => 
        tutorial._id === id ? response.data.data : tutorial
      ));
    } catch (error) {
      console.error('Error toggling tutorial:', error);
    }
  };

  const filteredTutorials = tutorials.filter(tutorial => {
    if (filter === 'watched') return tutorial.watched;
    if (filter === 'unwatched') return !tutorial.watched;
    return true;
  });

  const watchedCount = tutorials.filter(tutorial => tutorial.watched).length;
  const totalCount = tutorials.length;

  if (loading) {
    return (
      <div className="tutorials-page">
        <div className="loading">Loading tutorials...</div>
      </div>
    );
  }

  return (
    <div className="tutorials-page">
      <div className="page-header">
        <div className="header-content">
          <h1>My Tutorials</h1>
          <div className="tutorials-stats">
            <span className="stat">
              {watchedCount} of {totalCount} watched
            </span>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: totalCount > 0 ? `${(watchedCount / totalCount) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add New Tutorial
        </button>
      </div>

      <div className="tutorials-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({totalCount})
        </button>
        <button 
          className={`filter-btn ${filter === 'unwatched' ? 'active' : ''}`}
          onClick={() => setFilter('unwatched')}
        >
          Unwatched ({totalCount - watchedCount})
        </button>
        <button 
          className={`filter-btn ${filter === 'watched' ? 'active' : ''}`}
          onClick={() => setFilter('watched')}
        >
          Watched ({watchedCount})
        </button>
      </div>

      {showForm && (
        <TutorialForm
          onSubmit={handleCreateTutorial}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingTutorial && (
        <TutorialForm
          tutorial={editingTutorial}
          onSubmit={(data) => handleUpdateTutorial(editingTutorial._id, data)}
          onCancel={() => setEditingTutorial(null)}
        />
      )}

      <div className="tutorials-grid">
        {filteredTutorials.length > 0 ? (
          filteredTutorials.map(tutorial => (
            <TutorialCard
              key={tutorial._id}
              tutorial={tutorial}
              onEdit={setEditingTutorial}
              onDelete={handleDeleteTutorial}
              onToggleWatched={handleToggleWatched}
            />
          ))
        ) : (
          <div className="empty-state">
            <h3>No tutorials found</h3>
            <p>
              {filter === 'all' 
                ? "Add your first tutorial by pasting a YouTube URL."
                : `No ${filter} tutorials found.`
              }
            </p>
            {filter === 'all' && (
              <button 
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                Add Your First Tutorial
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorialsPage;
