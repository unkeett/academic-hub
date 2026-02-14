// src/pages/SubjectsPage.js
import React, { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';
import SubjectCard from '../components/SubjectCard';
import SubjectForm from '../components/SubjectForm';
import { FaPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './SubjectsPage.css';

const SubjectsPage = () => {
  const { token } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const subjectsPerPage = 5;

  useEffect(() => {
  const fetchSubjects = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/api/subjects');
      setSubjects(response.data.data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  fetchSubjects();
}, [token]);

  useEffect(() => {
    setCurrentPage(1);
  }, [subjects.length]);

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
    const subject = subjects.find(s => s._id === id);
    if (!subject) return;

    if (
      completedTopics === undefined ||
      completedTopics === null ||
      Number.isNaN(completedTopics)
    ) {
      alert('Please enter a valid number');
      return;
    }

    if (completedTopics < 0) {
      alert('Completed topics cannot be negative');
      return;
    }

    if (subject.topics && completedTopics > subject.topics.length) {
      alert(`Completed topics cannot exceed total topics (${subject.topics.length})`);
      return;
    }

    try {
      const response = await api.put(`/api/subjects/${id}/progress`, {
        completedTopics
      });

      setSubjects(subjects.map(subject =>
        subject._id === id ? response.data.data : subject
      ));
    } catch (error) {
      console.error('Error updating progress:', error);
      alert(error.response?.data?.message || 'Failed to update progress');
    }
  };
  // Pagination calculations
  const indexOfLastSubject = currentPage * subjectsPerPage;
  const indexOfFirstSubject = indexOfLastSubject - subjectsPerPage;
  const currentSubjects = subjects.slice(
    indexOfFirstSubject,
    indexOfLastSubject
  );

  const totalPages = Math.ceil(subjects.length / subjectsPerPage);



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
          currentSubjects.map(subject => (
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
      {subjects.length > subjectsPerPage && (
      <div className="pagination">
        <button
          className="btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Previous
        </button>

        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="btn"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Next
        </button>
      </div>
    )}
  
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