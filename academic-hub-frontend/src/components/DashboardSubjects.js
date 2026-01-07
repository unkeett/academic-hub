// src/components/DashboardSubjects.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axiosConfig';
import './DashboardSubjects.css';

const DashboardSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      // Check if user is authenticated before making API call
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/api/subjects');
        setSubjects(response.data.data || []);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        // Don't redirect if we're already handling the error
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  if (loading) {
    return <div className="subjects-widget card"><h3>Subjects in Progress</h3><p>Loading...</p></div>;
  }
  
  const calculateProgress = (subject) => {
    if (!subject.topics || subject.topics.length === 0) {
      return 0;
    }
    return Math.round((subject.completedTopics / subject.topics.length) * 100);
  };

  return (
    <div className="subjects-widget card">
      <div className="widget-header">
        <h3>Subjects in Progress</h3>
        <Link to="/subjects" className="view-all-link">View All</Link>
      </div>
      {subjects.length > 0 ? (
        <ul className="subjects-list">
          {subjects.slice(0, 3).map((subject) => (
            <li key={subject._id} className="subject-item">
              <div className="subject-info">
                <span className="subject-name">{subject.name}</span>
                <span className="subject-progress-text">{calculateProgress(subject)}%</span>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  style={{ 
                    width: `${calculateProgress(subject)}%`,
                    backgroundColor: subject.color || '#3B82F6'
                  }}
                ></div>
              </div>
            </li>
          ))}
          {subjects.length > 3 && (
            <li className="more-subjects">
              <Link to="/subjects">
                +{subjects.length - 3} more subjects
              </Link>
            </li>
          )}
        </ul>
      ) : (
        <div className="empty-state">
          <p>No subjects added yet. Add one to get started!</p>
          <Link to="/subjects" className="btn btn-primary">Add Subject</Link>
        </div>
      )}
    </div>
  );
};

export default DashboardSubjects;