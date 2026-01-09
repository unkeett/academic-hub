// src/components/Register.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [localError, setLocalError] = useState('');
  const [formErrors, setFormErrors] = useState({
    email: ''
  });
  const { register, isAuthenticated, error, clearError } = useAuth();
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    return () => clearError();
  }, [isAuthenticated, navigate, clearError]);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const errors = {};
    
    // Email validation
    if (email && !validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Password confirmation validation
    if (password && confirmPassword && password !== confirmPassword) {
      setLocalError('Passwords do not match');
    } else {
      setLocalError('');
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Validate email in real-time as user types
    if (name === 'email' && value.trim() !== '') {
      if (!validateEmail(value)) {
        setFormErrors({
          ...formErrors,
          email: 'Please enter a valid email address'
        });
      } else {
        setFormErrors({
          ...formErrors,
          email: ''
        });
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setLocalError('');
    
    // Validate form before submission
    if (!validateForm()) {
      // If there are form errors, don't proceed
      if (formErrors.email) {
        return;
      }
    }
    
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    
    // Validate email format
    if (!validateEmail(email)) {
      setFormErrors({
        ...formErrors,
        email: 'Please enter a valid email address'
      });
      return;
    }
    
    const result = await register({ name, email, password });
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join Academic Hub and start organizing your studies</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        {localError && (
          <div className="error-message">
            {localError}
          </div>
        )}

        <form onSubmit={onSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={onChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              placeholder="Enter your email"
              className={formErrors.email ? 'input-error' : ''}
            />
            {formErrors.email && (
              <div className="field-error-message">
                {formErrors.email}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              minLength="6"
              placeholder="Enter your password (min 6 characters)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              required
              placeholder="Confirm your password"
            />
          </div>

          {password && confirmPassword && password !== confirmPassword && (
            <div className="error-message">
              Passwords do not match
            </div>
          )}

          <button type="submit" className="auth-button">
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
