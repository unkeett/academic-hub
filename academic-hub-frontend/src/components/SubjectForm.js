// src/components/SubjectForm.js
import React, { useState, useEffect } from 'react';
import './SubjectForm.css';

const SubjectForm = ({ subject, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    topics: [],
    color: '#3B82F6'
  });
  const [newTopic, setNewTopic] = useState('');

  useEffect(() => {
    if (subject) {
      setFormData({
        name: subject.name || '',
        description: subject.description || '',
        topics: subject.topics || [],
        color: subject.color || '#3B82F6'
      });
    }
  }, [subject]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddTopic = () => {
    if (newTopic.trim()) {
      setFormData({
        ...formData,
        topics: [...formData.topics, newTopic.trim()]
      });
      setNewTopic('');
    }
  };

  const handleRemoveTopic = (index) => {
    setFormData({
      ...formData,
      topics: formData.topics.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const colorOptions = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h2>{subject ? 'Edit Subject' : 'Add New Subject'}</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="subject-form">
          <div className="form-group">
            <label htmlFor="name">Subject Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Mathematics, Physics, History"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the subject"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Color Theme</label>
            <div className="color-picker">
              {colorOptions.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`color-option ${formData.color === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData({ ...formData, color })}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Topics</label>
            <div className="topics-input">
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="Add a topic"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTopic())}
              />
              <button type="button" onClick={handleAddTopic} className="add-topic-btn">
                Add
              </button>
            </div>
            
            {formData.topics.length > 0 && (
              <div className="topics-list">
                {formData.topics.map((topic, index) => (
                  <div key={index} className="topic-item">
                    <span>{topic}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTopic(index)}
                      className="remove-topic-btn"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {subject ? 'Update Subject' : 'Create Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectForm;
