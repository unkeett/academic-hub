import { render, screen } from '@testing-library/react';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>,
  useLocation: () => ({ pathname: '/' }),
  useNavigate: () => jest.fn(),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  NavLink: ({ children, to }) => <a href={to}>{children}</a>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ element }) => element,
  Navigate: ({ to }) => <div>Redirecting to {to}</div>,
}), { virtual: true });

// Mock AuthContext
jest.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }) => <div>{children}</div>,
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
    loading: false,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
  }),
}));

// Mock components and pages to avoid axios and other complex dependencies
jest.mock('./pages/LandingPage', () => () => <div>Academic Hub Landing Page</div>);
jest.mock('./pages/DashboardPage', () => () => <div>Dashboard Page</div>);
jest.mock('./pages/SubjectsPage', () => () => <div>Subjects Page</div>);
jest.mock('./pages/GoalsPage', () => () => <div>Goals Page</div>);
jest.mock('./pages/TutorialsPage', () => () => <div>Tutorials Page</div>);
jest.mock('./pages/IdeasPage', () => () => <div>Ideas Page</div>);
jest.mock('./components/Login', () => () => <div>Login Page</div>);
jest.mock('./components/Register', () => () => <div>Register Page</div>);
jest.mock('./components/ProtectedRoute', () => ({ children }) => <div>{children}</div>);
jest.mock('./components/Navbar', () => () => <div>Navbar</div>);
jest.mock('./components/Sidebar', () => () => <div>Sidebar</div>);
jest.mock('./components/Footer', () => () => <div>Footer</div>);

import App from './App';

test('renders academic hub brand', () => {
  render(<App />);
  const landingPageElement = screen.getByText(/Academic Hub Landing Page/i);
  expect(landingPageElement).toBeInTheDocument();
});
