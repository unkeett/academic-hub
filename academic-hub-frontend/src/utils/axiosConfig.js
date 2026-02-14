// src/utils/axiosConfig.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      const token = localStorage.getItem('token');
      const currentPath = window.location.pathname;
      const publicRoutes = ['/login', '/register'];
      
      // Only redirect if:
      // 1. We had a token (meaning it expired/invalid, not just missing)
      // 2. We're not already on a public route
      // 3. The error wasn't from a login/register attempt
      if (token && !publicRoutes.includes(currentPath)) {
        // Check if this is an auth endpoint (login/register) - don't redirect on those
        const isAuthEndpoint = error.config?.url?.includes('/api/auth/login') || 
                              error.config?.url?.includes('/api/auth/register');
        
        if (!isAuthEndpoint) {
          localStorage.removeItem('token');
          // Use a small delay to prevent redirect loops
          setTimeout(() => {
            const stillOnPublicRoute = publicRoutes.includes(window.location.pathname);
            if (!stillOnPublicRoute) {
              window.location.href = '/login';
            }
          }, 100);
        }
      }
      // If no token, just let the error pass through (component will handle it)
    }
    return Promise.reject(error);
  }
);

export default api;
