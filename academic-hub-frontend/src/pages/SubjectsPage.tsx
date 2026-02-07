import React, { useState, useEffect, ElementType } from 'react';
import api from '../utils/axiosConfig';
import SubjectCard from '../components/SubjectCard';
import SubjectForm from '../components/SubjectForm';
import { FaPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './SubjectsPage.css';

interface Subject {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  topics?: string[];
  completedTopics?: number;
  createdAt: string;

}

interface SubjectFormData {
  name: string;
  description: string;
  topics: string[];
  color: string;
}

const PlusIcon = FaPlus as ElementType;

const SubjectsPage: React.FC = () => {
  const { token } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  useEffect(() => {
    fetchSubjects();
  }, [token]);

  const fetchSubjects = async () => {
    // Check if user is authenticated before making API call
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

  const handleCreateSubject = async (subjectData: SubjectFormData) => {
    try {
      const response = await api.post('/api/subjects', subjectData);
      setSubjects([response.data.data, ...subjects]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating subject:', error);
    }
  };

  const handleUpdateSubject = async (id: string, subjectData: SubjectFormData) => {
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

  const handleDeleteSubject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await api.delete(`/api/subjects/${id}`);
        setSubjects(subjects.filter(subject => subject._id !== id));
      } catch (error) {
        console.error('Error deleting subject:', error);
      }
    }
  };

  const handleUpdateProgress = async (id: string, completedTopics: number) => {
    const subject = subjects.find(s => s._id === id);
    if (!subject) return;

    if (
      completedTopics === undefined ||
      completedTopics === null ||
      Number.isNaN(Number(completedTopics))
    ) {
      alert('Please enter a valid number');
      return;
    }

    if (Number(completedTopics) < 0) {
      alert('Completed topics cannot be negative');
      return;
    }

    if (subject.topics && Number(completedTopics) > subject.topics.length) {
      alert(`Completed topics cannot exceed total topics (${subject.topics.length})`);
      return;
    }

    try {
      const response = await api.put(`/api/subjects/${id}/progress`, {
        completedTopics: Number(completedTopics)
      });

      setSubjects(subjects.map(subject =>
        subject._id === id ? response.data.data : subject
      ));
    } catch (error) {
      console.error('Error updating progress:', error);
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update progress';
      alert(message);
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
          subject={{
            name: editingSubject.name,
            description: editingSubject.description || '',
            topics: editingSubject.topics || [],
            color: editingSubject.color || '#3B82F6'
          }}
          onSubmit={(data: SubjectFormData) => handleUpdateSubject(editingSubject._id, data) as Promise<void>}
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
        <PlusIcon />
      </button>
    </div>
  );
};

export default SubjectsPage;
