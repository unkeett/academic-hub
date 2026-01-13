
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
    Link: ({ children, onClick, to }) => <a href={to} onClick={onClick}>{children}</a>,
    BrowserRouter: ({ children }) => <div>{children}</div>
}), { virtual: true });

describe('Sidebar Component', () => {
    const mockOnClose = jest.fn();

    const renderSidebar = (isOpen) => {
        return render(
            <Sidebar isOpen={isOpen} onClose={mockOnClose} />
        );
    };

    beforeEach(() => {
        mockOnClose.mockClear();
    });

    test('renders sidebar when open', () => {
        const { container } = renderSidebar(true);
        const aside = container.querySelector('aside');
        expect(aside).toHaveClass('open');
    });

    test('renders backdrop when open', () => {
        const { container } = renderSidebar(true);
        const backdrop = container.querySelector('.sidebar-backdrop');
        expect(backdrop).toBeInTheDocument();
    });

    test('does not render backdrop when closed', () => {
        const { container } = renderSidebar(false);
        const backdrop = container.querySelector('.sidebar-backdrop');
        expect(backdrop).not.toBeInTheDocument();
    });

    test('calls onClose when backdrop is clicked', () => {
        const { container } = renderSidebar(true);
        const backdrop = container.querySelector('.sidebar-backdrop');
        fireEvent.click(backdrop);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('calls onClose when Esc key is pressed and sidebar is open', () => {
        renderSidebar(true);
        fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('does not call onClose when Esc key is pressed and sidebar is closed', () => {
        renderSidebar(false);
        fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
        expect(mockOnClose).toHaveBeenCalledTimes(0);
    });

    test('calls onClose when a menu link is clicked', () => {
        renderSidebar(true);
        const dashboardLink = screen.getByText('Dashboard');
        fireEvent.click(dashboardLink);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
});
