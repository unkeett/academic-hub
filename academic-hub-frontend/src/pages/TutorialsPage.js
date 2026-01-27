import { toast } from 'react-toastify';
// src/pages/TutorialsPage.js
import React, { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';
import TutorialCard from '../components/TutorialCard';
import TutorialForm from '../components/TutorialForm';
import { FaPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './TutorialsPage.css';

const TutorialsPage = () => {
  const { token } = useAuth();
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTutorial, setEditingTutorial] = useState(null);
  const [filter, setFilter] = useState('all'); // all, watched, unwatched

  useEffect(() => {
    fetchTutorials();
  }, [token]);

  const fetchTutorials = async () => {
    // Check if user is authenticated before making API call
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/api/tutorials');
      setTutorials(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load tutorials');
      setTutorials([]);
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
      toast.error('Failed to update tutorial');
    }
  };

  const handleDeleteTutorial = async (id) => {
    if (window.confirm('Are you sure you want to delete this tutorial?')) {
      try {
        await api.delete(`/api/tutorials/${id}`);
        setTutorials(tutorials.filter(tutorial => tutorial._id !== id));
      } catch (error) {
        toast.error('Failed to delete tutorial');
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
      toast.error('Failed to update tutorial status');
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
      <header className="page-header">
        <h1>My Tutorials</h1>
        <div className="page-stats">
          <span>
            {watchedCount} of {totalCount} watched
          </span>
          <div className="mini-progress-bar">
            <div
              className="mini-progress-fill"
              style={{
                width: totalCount > 0 ? `${(watchedCount / totalCount) * 100}%` : '0%',
                backgroundColor: 'var(--secondary)'
              }}
            ></div>
          </div>
        </div>
      </header>

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

      <button
        className="fab"
        onClick={() => setShowForm(true)}
        title="Add New Tutorial"
      >
        <FaPlus />
      </button>
    </div>
  );
};

export default TutorialsPage;
