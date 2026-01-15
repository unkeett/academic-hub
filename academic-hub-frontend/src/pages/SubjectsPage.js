// src/pages/SubjectsPage.js
import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import api from '../utils/axiosConfig';
import SubjectCard from '../components/SubjectCard';
import SubjectForm from '../components/SubjectForm';
import { FaPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import './SubjectsPage.css';

const SubjectsPage = () => {
  const { token } = useAuth();
  const { showNotification } = useNotification();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  // 1. Wrap fetchSubjects in useCallback to stabilize the function reference
  const fetchSubjects = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/api/subjects');
      setSubjects(response.data.data || []);
    } catch (error) {
      showNotification('Failed to load subjects. Please refresh the page.', 'error');
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  }, [token, showNotification]); // Dependencies for useCallback

  // 2. Include fetchSubjects in the dependency array
  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleCreateSubject = async (subjectData) => {
    try {
      const response = await api.post('/api/subjects', subjectData);
      setSubjects([response.data.data, ...subjects]);
      setShowForm(false);
      showNotification('Subject created successfully!', 'success'); 
    } catch (error) {
      // Interceptor will handle the notification, but local logic stays the same
    }
  };

  const handleUpdateSubject = async (id, subjectData) => {
    try {
      const response = await api.put(`/api/subjects/${id}`, subjectData);
      setSubjects(subjects.map(subject =>
        subject._id === id ? response.data.data : subject
      ));
      setEditingSubject(null);
      showNotification('Subject updated!', 'success');
    } catch (error) {}
  };

  const handleDeleteSubject = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await api.delete(`/api/subjects/${id}`);
        setSubjects(subjects.filter(subject => subject._id !== id));
        showNotification('Subject deleted.', 'info');
      } catch (error) {}
    }
  };

  const handleUpdateProgress = async (id, completedTopics) => {
    const subject = subjects.find(s => s._id === id);
    if (!subject) return;

    // Validation logic stays here for immediate feedback
    if (completedTopics === undefined || completedTopics === null || Number.isNaN(completedTopics)) {
      showNotification('Please enter a valid number', 'error');
      return;
    }

    if (completedTopics < 0) {
      showNotification('Completed topics cannot be negative', 'error');
      return;
    }

    if (subject.topics && completedTopics > subject.topics.length) {
      showNotification(`Completed topics cannot exceed total (${subject.topics.length})`, 'error');
      return;
    }

    try {
      const response = await api.put(`/api/subjects/${id}/progress`, {
        completedTopics
      });

      setSubjects(subjects.map(subject =>
        subject._id === id ? response.data.data : subject
      ));
      showNotification('Progress updated!', 'success');
    } catch (error) {}
  };

  if (loading) {
    return (
      <div className="subjects-page">
        <div className="loading">Loading subjects...</div>
      </div>
    );
  }

  return (
    <div className="subjects-page">
      <header className="page-header">
        <h1>My Subjects</h1>
        <div className="page-stats">
          <span>{subjects.length} {subjects.length === 1 ? 'subject' : 'subjects'} enrolled</span>
        </div>
      </header>

      {showForm && (
        <SubjectForm
          onSubmit={handleCreateSubject}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingSubject && (
        <SubjectForm
          subject={editingSubject}
          onSubmit={(data) => handleUpdateSubject(editingSubject._id, data)}
          onCancel={() => setEditingSubject(null)}
        />
      )}

      <div className="subjects-grid">
        {subjects.length > 0 ? (
          subjects.map(subject => (
            <SubjectCard
              key={subject._id}
              subject={subject}
              onEdit={setEditingSubject}
              onDelete={handleDeleteSubject}
              onUpdateProgress={handleUpdateProgress}
            />
          ))
        ) : (
          <div className="empty-state">
            <h3>No subjects yet</h3>
            <p>Add your first subject to get started with tracking your academic progress.</p>
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              Add Your First Subject
            </button>
          </div>
        )}
      </div>

      <button
        className="fab"
        onClick={() => setShowForm(true)}
        title="Add New Subject"
      >
        <FaPlus />
      </button>
    </div>
  );
};

export default SubjectsPage;