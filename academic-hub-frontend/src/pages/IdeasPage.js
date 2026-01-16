// src/pages/IdeasPage.js
import React, { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';
import IdeaCard from '../components/IdeaCard';
import IdeaForm from '../components/IdeaForm';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './IdeasPage.css';

const IdeasPage = () => {
  const { token } = useAuth();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingIdea, setEditingIdea] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    { value: 'all', label: 'All Ideas' },
    { value: 'project', label: 'Project' },
    { value: 'research', label: 'Research' }
  ];

  useEffect(() => {
    fetchIdeas();
  }, [filter, searchTerm, token]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchIdeas = async () => {
    // Check if user is authenticated before making API call
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      let url = '/api/ideas';
      const params = new URLSearchParams();

      if (filter !== 'all') {
        params.append('category', filter);
      }

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await api.get(url);
      setIdeas(response.data.data || []);
    } catch (error) {
      console.error('Error fetching ideas:', error);
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIdea = async (ideaData) => {
    setCreateLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/ideas', ideaData);
      setIdeas([response.data.data, ...ideas]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating idea:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create idea. Please try again.';
      setError(errorMessage);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleUpdateIdea = async (id, ideaData) => {
    try {
      const response = await api.put(`/api/ideas/${id}`, ideaData);
      setIdeas(ideas.map(idea =>
        idea._id === id ? response.data.data : idea
      ));
      setEditingIdea(null);
    } catch (error) {
      console.error('Error updating idea:', error);
    }
  };

  const handleDeleteIdea = async (id) => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      try {
        await api.delete(`/api/ideas/${id}`);
        setIdeas(ideas.filter(idea => idea._id !== id));
      } catch (error) {
        console.error('Error deleting idea:', error);
      }
    }
  };

  const handleAddIdea = () => {
    setShowForm(true);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="ideas-page">
        <div className="loading">Loading ideas...</div>
      </div>
    );
  }

  return (
    <div className="ideas-page">
      <header className="page-header">
        <h1>My Ideas</h1>
        <div className="page-stats">
          <span>{ideas.length} {ideas.length === 1 ? 'idea' : 'ideas'} total</span>
        </div>
      </header>

      <div className="ideas-controls">
        <div className="search-box">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search ideas..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
        </div>

        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category.value}
              className={`filter-btn ${filter === category.value ? 'active' : ''}`}
              onClick={() => setFilter(category.value)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {showForm && (
        <IdeaForm
          onSubmit={handleCreateIdea}
          onCancel={() => {
            setShowForm(false);
            setError(null);
          }}
          loading={createLoading}
          error={error}
        />
      )}

      {editingIdea && (
        <IdeaForm
          idea={editingIdea}
          onSubmit={(data) => handleUpdateIdea(editingIdea._id, data)}
          onCancel={() => setEditingIdea(null)}
        />
      )}

      <div className="ideas-grid">
        {ideas.length > 0 ? (
          ideas.map(idea => (
            <IdeaCard
              key={idea._id}
              idea={idea}
              onEdit={setEditingIdea}
              onDelete={handleDeleteIdea}
            />
          ))
        ) : (
          <div className="empty-state">
            <h3>No ideas found</h3>
            <p>
              {searchTerm || filter !== 'all'
                ? "No ideas match your current filters."
                : "Capture your thoughts and ideas to keep track of your academic journey."
              }
            </p>
            {!searchTerm && filter === 'all' && (
              <button
                className="btn btn-primary"
                onClick={handleAddIdea}
              >
                Add Your First Idea
              </button>
            )}
          </div>
        )}
      </div>

      <button
        className="fab"
        onClick={() => setShowForm(true)}
        title="Add New Idea"
      >
        <FaPlus />
      </button>
    </div>
  );
};

export default IdeasPage;
