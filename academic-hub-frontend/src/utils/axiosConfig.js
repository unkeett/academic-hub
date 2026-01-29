// src/utils/axiosConfig.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// 1. Create a placeholder for our notification function
let showToast = null;

// 2. Export a function to "inject" the toast trigger from your React components
export const setNotificationHandler = (handler) => {
  showToast = handler;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor ... (kept exactly as you have it)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Enhanced Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'A network error occurred. Please try again.';

    // A. Global Notification logic
    if (showToast) {
      // Don't show generic error toast for 401s (handled below) or specific validation errors
      if (status !== 401 && status !== 422) {
        showToast(message, 'error');
      }
    }

    // B. Your existing 401/Auth logic
    if (status === 401) {
      const token = localStorage.getItem('token');
      const currentPath = window.location.pathname;
      const publicRoutes = ['/login', '/register'];
      
      if (token && !publicRoutes.includes(currentPath)) {
        const isAuthEndpoint = error.config?.url?.includes('/api/auth/login') || 
                              error.config?.url?.includes('/api/auth/register');
        
        if (!isAuthEndpoint) {
          localStorage.removeItem('token');
          if (showToast) showToast('Session expired. Please log in again.', 'info');
          
          setTimeout(() => {
            if (!publicRoutes.includes(window.location.pathname)) {
              window.location.href = '/login';
            }
          }, 1500); // Increased delay so user can read the toast
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;