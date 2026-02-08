import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user, updateUser, deleteAccount } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        avatar: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                bio: user.bio || '',
                avatar: user.avatar || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const res = await updateUser(formData);

        if (res.success) {
            setMessage('Profile updated successfully');
            setIsEditing(false);
        } else {
            setError(res.error || 'Failed to update profile');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone and will delete all your data.')) {
            const res = await deleteAccount();
            if (res.success) {
                navigate('/');
            } else {
                setError(res.error || 'Failed to delete account');
            }
        }
    };

    return (
        <div className="profile-page">
            <div className="profile-card">
                <h2>My Profile</h2>
                {message && <div className="alert success">{message}</div>}
                {error && <div className="alert error">{error}</div>}

                <div className="profile-header">
                    <div className="avatar-container">
                        {formData.avatar ? (
                            <img src={formData.avatar} alt="Profile" className="profile-avatar" />
                        ) : (
                            <div className="profile-avatar-placeholder">
                                {formData.name.charAt(0)}
                            </div>
                        )}
                    </div>
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Tell us about yourself"
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label>Avatar URL</label>
                            <input
                                type="url"
                                name="avatar"
                                value={formData.avatar}
                                onChange={handleChange}
                                placeholder="https://example.com/avatar.jpg"
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">Save Changes</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </form>
                ) : (
                    <div className="profile-details">
                        <div className="detail-item">
                            <strong>Name:</strong> {user?.name}
                        </div>
                        <div className="detail-item">
                            <strong>Email:</strong> {user?.email}
                        </div>
                        {user?.bio && (
                            <div className="detail-item">
                                <strong>Bio:</strong> {user.bio}
                            </div>
                        )}
                        <div className="profile-actions">
                            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
                            <button className="btn btn-danger" onClick={handleDelete}>Delete Account</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
