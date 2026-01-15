// src/pages/SubjectsPage.js
import React, { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';
import SubjectCard from '../components/SubjectCard';
import SubjectForm from '../components/SubjectForm';
import { FaPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext'; // 1. Import hook
import './SubjectsPage.css';

const SubjectsPage = () => {
  const { token } = useAuth();
  const { showNotification } = useNotification(); // 2. Initialize hook
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, [token]);

  const fetchSubjects = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/api/subjects');
      setSubjects(response.data.data || []);
    } catch (error) {
      // Replace console.error
      showNotification('Failed to load subjects. Please refresh the page.', 'error');
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubject = async (subjectData) => {
    try {
      const response = await api.post('/api/subjects', subjectData);
      setSubjects([response.data.data, ...subjects]);
      setShowForm(false);
      showNotification('Subject created successfully!', 'success'); 
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error creating subject', 'error');
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
    } catch (error) {
      showNotification('Failed to update subject.', 'error');
    }
  };

  const handleDeleteSubject = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await api.delete(`/api/subjects/${id}`);
        setSubjects(subjects.filter(subject => subject._id !== id));
        showNotification('Subject deleted.', 'info');
      } catch (error) {
        showNotification('Could not delete subject.', 'error');
      }
    }
  };

  const handleUpdateProgress = async (id, completedTopics) => {
    const subject = subjects.find(s => s._id === id);
    if (!subject) return;

    // Replace browser alerts with notifications
    if (
      completedTopics === undefined ||
      completedTopics === null ||
      Number.isNaN(completedTopics)
    ) {
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
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to update progress', 'error');
    }
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