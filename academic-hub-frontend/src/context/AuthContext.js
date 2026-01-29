// src/context/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import api from '../utils/axiosConfig';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'AUTH_FAIL':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 1. Stabilize loadUser with useCallback and fix dependency array
  const loadUser = useCallback(async () => {
    try {
      const res = await api.get('/api/auth/me');
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: res.data.data,
          token: localStorage.getItem('token') // Use storage to ensure consistency
        }
      });
    } catch (error) {
      localStorage.removeItem('token');
      dispatch({ type: 'AUTH_FAIL' });
    }
  }, []); // Added missing dependency array for useCallback

  // 2. Set axios default header
  useEffect(() => {
    if (state.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  // 3. Load user on app start - Now includes loadUser in dependencies
  useEffect(() => {
    if (state.token) {
      loadUser();
    } else {
      dispatch({ type: 'AUTH_FAIL', payload: null });
    }
  }, [state.token, loadUser]); // Added loadUser here

  const register = useCallback(async (userData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const res = await api.post('/api/auth/register', userData);
      localStorage.setItem('token', res.data.token);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: res.data.data, token: res.data.token }
      });
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'AUTH_FAIL', payload: msg });
      return { success: false, error: msg };
    }
  }, []);

  const login = useCallback(async (userData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const res = await api.post('/api/auth/login', userData);
      localStorage.setItem('token', res.data.token);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: res.data.data, token: res.data.token }
      });
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_FAIL', payload: msg });
      return { success: false, error: msg };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = useMemo(() => ({
    ...state,
    register,
    login,
    logout,
    clearError,
    loadUser
  }), [state, register, login, logout, clearError, loadUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};