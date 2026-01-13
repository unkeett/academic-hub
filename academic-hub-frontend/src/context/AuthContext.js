// src/context/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
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
      return {
        ...state,
        loading: true,
        error: null
      };
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
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Removed redundant useEffect for axios headers. 
  // Relying on axiosConfig interceptor for dynamic token injection from localStorage.

  // Load user on app start
  useEffect(() => {
    if (state.token) {
      loadUser();
    } else {
      dispatch({
        type: 'AUTH_FAIL',
        payload: null
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadUser = React.useCallback(async () => {
    try {
      const res = await api.get('/api/auth/me');
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: res.data.data,
          // Use the token from the response if refreshed, or fallback to current state/localStorage
          token: localStorage.getItem('token')
        }
      });
    } catch (error) {
      localStorage.removeItem('token');
      dispatch({ type: 'AUTH_FAIL' });
    }
  }, []); // api and dispatch are stable, so deps are empty (or minimal)

  const register = React.useCallback(async (userData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const res = await api.post('/api/auth/register', userData);

      localStorage.setItem('token', res.data.token);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: res.data.data,
          token: res.data.token
        }
      });
      return { success: true };
    } catch (error) {
      dispatch({
        type: 'AUTH_FAIL',
        payload: error.response?.data?.message || 'Registration failed'
      });
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  }, []);

  const login = React.useCallback(async (userData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const res = await api.post('/api/auth/login', userData);

      localStorage.setItem('token', res.data.token);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: res.data.data,
          token: res.data.token
        }
      });
      return { success: true };
    } catch (error) {
      dispatch({
        type: 'AUTH_FAIL',
        payload: error.response?.data?.message || 'Login failed'
      });
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  }, []);

  const logout = React.useCallback(() => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  }, []);

  const clearError = React.useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = React.useMemo(() => ({
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
