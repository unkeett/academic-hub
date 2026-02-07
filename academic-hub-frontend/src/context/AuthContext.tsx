import { createContext, useContext, useReducer, useEffect, useCallback, useMemo, ReactNode } from 'react';
import api from '../utils/axiosConfig';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User | null; token: string } }
  | { type: 'AUTH_FAIL'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthContextType extends AuthState {
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  login: (userData: LoginData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  clearError: () => void;
  loadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set axios default header
  useEffect(() => {
    if (state.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  const loadUser = useCallback(async () => {
    if (!state.token) {
      // If we have no token, we just fail silently or set loaded state?
      // Actually if no token, we are already in initial state (not authenticated).
      // But loading is true initially. We should stop loading.
      dispatch({ type: 'AUTH_FAIL', payload: 'No token' });
      return;
    }
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
      // We need a payload for AUTH_FAIL
      dispatch({ type: 'AUTH_FAIL', payload: 'Session expired' });
    }
  }, [state.token]);

  // Load user on app start
  useEffect(() => {
    if (state.token) {
      loadUser();
    } else {
      // Stop loading if no token
      dispatch({
        type: 'AUTH_FAIL',
        payload: 'No token'
      });
    }
  }, [state.token, loadUser]);

  const register = useCallback(async (userData: RegisterData) => {
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
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Registration failed';
      dispatch({
        type: 'AUTH_FAIL',
        payload: message
      });
      return { success: false, error: message };
    }
  }, []);

  const login = useCallback(async (userData: LoginData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const res = await api.post('/api/auth/login', userData);

      localStorage.setItem('token', res.data.token);

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: res.data.user || null,
          token: res.data.token
        }
      });

      return { success: true };
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Login failed';
      dispatch({
        type: 'AUTH_FAIL',
        payload: message
      });
      return { success: false, error: message };
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
