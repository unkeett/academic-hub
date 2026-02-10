import { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  useLocation: () => ({ pathname: '/' }),
  useNavigate: () => jest.fn(),
  Link: ({ children, to }: { children: ReactNode; to: string }) => <a href={to}>{children}</a>,
  NavLink: ({ children, to }: { children: ReactNode; to: string }) => <a href={to}>{children}</a>,
  Routes: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Route: ({ element }: { element: ReactNode }) => element,
  Navigate: ({ to }: { to: string }) => <div>Redirecting to {to}</div>,
}));

// Mock AuthContext
jest.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => <div>{children}</div>,
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
jest.mock('./components/ProtectedRoute', () => ({ children }: { children: ReactNode }) => <div>{children}</div>);
jest.mock('./components/Navbar', () => () => <div>Navbar</div>);
jest.mock('./components/Sidebar', () => () => <div>Sidebar</div>);
jest.mock('./components/Footer', () => () => <div>Footer</div>);

test('renders academic hub brand', () => {
  render(<App />);
  const landingPageElement = screen.getByText(/Academic Hub Landing Page/i);
  expect(landingPageElement).toBeInTheDocument();
});
