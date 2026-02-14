
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
    NavLink: ({ children, onClick, to }) => <a href={to} onClick={onClick}>{children}</a>,
    BrowserRouter: ({ children }) => <div>{children}</div>
}), { virtual: true });

describe('Sidebar Component', () => {
    const mockToggleSidebar = jest.fn();

    const renderSidebar = (isOpen) => {
        return render(
            <Sidebar isOpen={isOpen} toggleSidebar={mockToggleSidebar} />
        );
    };

    beforeEach(() => {
        mockToggleSidebar.mockClear();
    });

    test('renders sidebar when open', () => {
        const { container } = renderSidebar(true);
        const aside = container.querySelector('aside');
        expect(aside).toHaveClass('open');
    });

    test('renders overlay when open', () => {
        const { container } = renderSidebar(true);
        const overlay = container.querySelector('.sidebar-overlay');
        expect(overlay).toBeInTheDocument();
    });

    test('does not render overlay when closed', () => {
        const { container } = renderSidebar(false);
        const overlay = container.querySelector('.sidebar-overlay');
        expect(overlay).not.toBeInTheDocument();
    });

    test('calls toggleSidebar when overlay is clicked', () => {
        const { container } = renderSidebar(true);
        const overlay = container.querySelector('.sidebar-overlay');
        fireEvent.click(overlay);
        expect(mockToggleSidebar).toHaveBeenCalledTimes(1);
    });

    test('calls toggleSidebar when a menu link is clicked', () => {
        renderSidebar(true);
        const dashboardLink = screen.getByText('Dashboard');
        fireEvent.click(dashboardLink);
        expect(mockToggleSidebar).toHaveBeenCalledTimes(1);
    });
});
