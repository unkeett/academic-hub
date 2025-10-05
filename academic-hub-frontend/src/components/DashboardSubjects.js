// src/components/DashboardSubjects.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DashboardSubjects.css'; // We'll create this file next

const DashboardSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/subjects');
        setSubjects(response.data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
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
      <h3>Subjects in Progress</h3>
      {subjects.length > 0 ? (
        <ul className="subjects-list">
          {subjects.map((subject) => (
            <li key={subject._id} className="subject-item">
              <div className="subject-info">
                <span className="subject-name">{subject.name}</span>
                <span className="subject-progress-text">{calculateProgress(subject)}%</span>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${calculateProgress(subject)}%` }}
                ></div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No subjects added yet. Add one to get started!</p>
      )}
    </div>
  );
};

export default DashboardSubjects;