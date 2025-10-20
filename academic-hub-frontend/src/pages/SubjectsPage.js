// src/pages/SubjectsPage.js
import React, { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';
import SubjectCard from '../components/SubjectCard';
import SubjectForm from '../components/SubjectForm';
import './SubjectsPage.css';

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/api/subjects');
      setSubjects(response.data.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubject = async (subjectData) => {
    try {
      const response = await api.post('/api/subjects', subjectData);
      setSubjects([response.data.data, ...subjects]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating subject:', error);
    }
  };

  const handleUpdateSubject = async (id, subjectData) => {
    try {
      const response = await api.put(`/api/subjects/${id}`, subjectData);
      setSubjects(subjects.map(subject => 
        subject._id === id ? response.data.data : subject
      ));
      setEditingSubject(null);
    } catch (error) {
      console.error('Error updating subject:', error);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await api.delete(`/api/subjects/${id}`);
        setSubjects(subjects.filter(subject => subject._id !== id));
      } catch (error) {
        console.error('Error deleting subject:', error);
      }
    }
  };

  const handleUpdateProgress = async (id, completedTopics) => {
    try {
      const response = await api.put(`/api/subjects/${id}/progress`, {
        completedTopics
      });
      setSubjects(subjects.map(subject => 
        subject._id === id ? response.data.data : subject
      ));
    } catch (error) {
      console.error('Error updating progress:', error);
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
      <div className="page-header">
        <h1>My Subjects</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add New Subject
        </button>
      </div>

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
    </div>
  );
};

export default SubjectsPage;
