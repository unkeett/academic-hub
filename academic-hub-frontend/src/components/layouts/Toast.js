// src/components/layout/Toast.js
import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast-container ${type}`}>
      <div className="toast-content">
        <span>{message}</span>
        <button onClick={onClose} className="toast-close">&times;</button>
      </div>
      <div className="toast-progress"></div>
    </div>
  );
};

export default Toast;