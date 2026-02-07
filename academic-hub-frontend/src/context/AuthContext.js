// src/context/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
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

  // Set axios default header
  useEffect(() => {
    if (state.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

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
  }, [state.token]);

  const loadUser = useCallback(async () => {
    try {
      const res = await api.get('/api/auth/me');
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: res.data.data,
          token: state.token
        }
      });
    } catch (error) {
      localStorage.removeItem('token');
      dispatch({ type: 'AUTH_FAIL' });
    }
  }, [state.token]);

  const register = useCallback(async (userData) => {
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

  const login = useCallback(async (userData) => {
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

  const updateUser = useCallback(async (userData) => {
    try {
      const res = await api.put('/api/auth/updatedetails', userData);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: res.data.data,
          token: state.token
        }
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Update failed' };
    }
  }, [state.token]);

  const deleteAccount = useCallback(async () => {
    try {
      await api.delete('/api/auth/deleteaccount');
      logout();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Delete failed' };
    }
  }, [logout]);

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
    loadUser,
    updateUser,
    deleteAccount
  }), [state, register, login, logout, clearError, loadUser, updateUser, deleteAccount]);

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
