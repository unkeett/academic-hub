import React, { useState, useEffect } from 'react';
import './IdeaForm.css';

interface IdeaFormData {
  title: string;
  content: string;
  category: string;
  tags: string[];
}

interface IdeaFormProps {
  idea?: {
    title?: string;
    content?: string;
    category?: string;
    tags?: string[];
  };
  onSubmit: (data: IdeaFormData) => Promise<void>;
  onCancel: () => void;
  error?: string | null;
  loading?: boolean;
}

const IdeaForm: React.FC<IdeaFormProps> = ({ idea, onSubmit, onCancel, error: externalError = null }) => {
  const [formData, setFormData] = useState<IdeaFormData>({
    title: '',
    content: '',
    category: 'general',
    tags: []
  });
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(externalError);

  const categories = [
    { value: 'study', label: 'Study' },
    { value: 'project', label: 'Project' },
    { value: 'research', label: 'Research' },
    { value: 'general', label: 'General' }
  ];

  useEffect(() => {
    if (idea) {
      setFormData({
        title: idea.title || '',
        content: idea.content || '',
        category: idea.category || 'general',
        tags: idea.tags || []
      });
    }
  }, [idea]);

  useEffect(() => {
    setError(externalError);
  }, [externalError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit(formData);
    } catch (err) {
      console.error('Submission error:', err);
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'An error occurred during submission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h2>{idea ? 'Edit Idea' : 'Add New Idea'}</h2>
          <button className="close-btn" onClick={onCancel} disabled={loading}>×</button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="idea-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Brief title for your idea"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              placeholder="Describe your idea in detail..."
              rows={6}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={loading}
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tags</label>
            <div className="tags-input">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                disabled={loading}
              />
              <button type="button" onClick={handleAddTag} className="add-tag-btn" disabled={loading}>
                Add
              </button>
            </div>

            {formData.tags.length > 0 && (
              <div className="tags-list">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="tag-item">
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="remove-tag-btn"
                      disabled={loading}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : (idea ? 'Update Idea' : 'Create Idea')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IdeaForm;
