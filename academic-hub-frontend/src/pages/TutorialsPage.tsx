import React, { useState, useEffect, ElementType } from 'react';
import api from '../utils/axiosConfig';
import TutorialCard from '../components/TutorialCard';
import TutorialForm from '../components/TutorialForm';
import { FaPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './TutorialsPage.css';

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

interface TutorialFormData {
  url: string;
  title?: string;
}

type TutorialFilter = 'all' | 'watched' | 'unwatched' | 'bookmarked';

const PlusIcon = FaPlus as ElementType;

const TutorialsPage: React.FC = () => {
  const { token, user, loadUser } = useAuth();
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTutorial, setEditingTutorial] = useState<Tutorial | null>(null);
  const [filter, setFilter] = useState<TutorialFilter>('all');

  useEffect(() => {
    fetchTutorials();
  }, [token]);

  const fetchTutorials = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/api/tutorials');
      setTutorials(response.data.data || []);
    } catch (error) {
      console.error('Error fetching tutorials:', error);
      setTutorials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTutorial = async (tutorialData: TutorialFormData) => {
    try {
      const response = await api.post('/api/tutorials', tutorialData);
      setTutorials((prev) => [response.data.data, ...prev]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating tutorial:', error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Error creating tutorial';
      alert(message);
    }
  };

  const handleUpdateTutorial = async (id: string, tutorialData: TutorialFormData) => {
    try {
      const response = await api.put(`/api/tutorials/${id}`, tutorialData);
      setTutorials((prev) => prev.map((tutorial) => (tutorial._id === id ? response.data.data : tutorial)));
      setEditingTutorial(null);
    } catch (error) {
      console.error('Error updating tutorial:', error);
    }
  };

  const handleDeleteTutorial = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this tutorial?')) {
      try {
        await api.delete(`/api/tutorials/${id}`);
        setTutorials((prev) => prev.filter((tutorial) => tutorial._id !== id));
      } catch (error) {
        console.error('Error deleting tutorial:', error);
      }
    }
  };

  const handleToggleWatched = async (id: string) => {
    try {
      const response = await api.put(`/api/tutorials/${id}/toggle`);
      setTutorials((prev) => prev.map((tutorial) => (tutorial._id === id ? response.data.data : tutorial)));
    } catch (error) {
      console.error('Error toggling tutorial:', error);
    }
  };

  const handleToggleBookmark = async (id: string) => {
    try {
      await api.put(`/api/tutorials/${id}/bookmark`);
      await loadUser();
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const filteredTutorials = tutorials.filter((tutorial) => {
    if (filter === 'watched') return tutorial.watched;
    if (filter === 'unwatched') return !tutorial.watched;
    if (filter === 'bookmarked') return user?.bookmarkedTutorials?.includes(tutorial._id);
    return true;
  });

  const watchedCount = tutorials.filter((tutorial) => tutorial.watched).length;
  const bookmarkedCount = user?.bookmarkedTutorials?.length || 0;
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
                backgroundColor: 'var(--secondary)',
              }}
            ></div>
          </div>
        </div>
      </header>

      <div className="tutorials-filters">
        <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          All ({totalCount})
        </button>
        <button
          className={`filter-btn ${filter === 'unwatched' ? 'active' : ''}`}
          onClick={() => setFilter('unwatched')}
        >
          Unwatched ({totalCount - watchedCount})
        </button>
        <button className={`filter-btn ${filter === 'watched' ? 'active' : ''}`} onClick={() => setFilter('watched')}>
          Watched ({watchedCount})
        </button>
        <button
          className={`filter-btn ${filter === 'bookmarked' ? 'active' : ''}`}
          onClick={() => setFilter('bookmarked')}
        >
          Bookmarked ({bookmarkedCount})
        </button>
      </div>

      {showForm && <TutorialForm onSubmit={handleCreateTutorial} onCancel={() => setShowForm(false)} />}

      {editingTutorial && (
        <TutorialForm
          tutorial={editingTutorial}
          onSubmit={(data: TutorialFormData) => handleUpdateTutorial(editingTutorial._id, data)}
          onCancel={() => setEditingTutorial(null)}
        />
      )}

      <div className="tutorials-grid">
        {filteredTutorials.length > 0 ? (
          filteredTutorials.map((tutorial) => (
            <TutorialCard
              key={tutorial._id}
              tutorial={tutorial}
              onEdit={setEditingTutorial}
              onDelete={handleDeleteTutorial}
              onToggleWatched={handleToggleWatched}
              isBookmarked={user?.bookmarkedTutorials?.includes(tutorial._id)}
              onToggleBookmark={handleToggleBookmark}
            />
          ))
        ) : (
          <div className="empty-state">
            <h3>No tutorials found</h3>
            <p>
              {filter === 'all' ? 'Add your first tutorial by pasting a YouTube URL.' : `No ${filter} tutorials found.`}
            </p>
            {filter === 'all' && (
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                Add Your First Tutorial
              </button>
            )}
          </div>
        )}
      </div>

      <button className="fab" onClick={() => setShowForm(true)} title="Add New Tutorial">
        <PlusIcon />
      </button>
    </div>
  );
};

export default TutorialsPage;
