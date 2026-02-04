import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TabView, TabContent } from './TabView';

// Mock framer-motion to simplify testing
vi.mock('framer-motion', () => ({
    motion: {
        button: ({ children, ...props }: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) => (
            <button {...props}>{children}</button>
        ),
        div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => (
            <div {...props}>{children}</div>
        ),
    },
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

describe('TabView', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders both tab buttons', () => {
        render(
            <TabView>
                <p>Content</p>
            </TabView>
        );

        expect(screen.getByRole('tab', { name: /hellenistic/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /evolutionary/i })).toBeInTheDocument();
    });

    it('defaults to hellenistic tab as active', () => {
        render(
            <TabView>
                <p>Content</p>
            </TabView>
        );

        const hellenisticTab = screen.getByRole('tab', { name: /hellenistic/i });
        const evolutionaryTab = screen.getByRole('tab', { name: /evolutionary/i });

        expect(hellenisticTab).toHaveAttribute('aria-selected', 'true');
        expect(evolutionaryTab).toHaveAttribute('aria-selected', 'false');
    });

    it('switches tabs on click (uncontrolled mode)', () => {
        render(
            <TabView>
                <p>Content</p>
            </TabView>
        );

        const evolutionaryTab = screen.getByRole('tab', { name: /evolutionary/i });
        fireEvent.click(evolutionaryTab);

        expect(evolutionaryTab).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tab', { name: /hellenistic/i })).toHaveAttribute('aria-selected', 'false');
    });

    it('calls onTabChange when tab is clicked (controlled mode)', () => {
        const onTabChange = vi.fn();

        render(
            <TabView activeTab="hellenistic" onTabChange={onTabChange}>
                <p>Content</p>
            </TabView>
        );

        const evolutionaryTab = screen.getByRole('tab', { name: /evolutionary/i });
        fireEvent.click(evolutionaryTab);

        expect(onTabChange).toHaveBeenCalledWith('evolutionary');
        expect(onTabChange).toHaveBeenCalledTimes(1);
    });

    it('respects controlled activeTab prop', () => {
        const { rerender } = render(
            <TabView activeTab="evolutionary" onTabChange={() => { }}>
                <p>Content</p>
            </TabView>
        );

        expect(screen.getByRole('tab', { name: /evolutionary/i })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tab', { name: /hellenistic/i })).toHaveAttribute('aria-selected', 'false');

        // Rerender with different active tab
        rerender(
            <TabView activeTab="hellenistic" onTabChange={() => { }}>
                <p>Content</p>
            </TabView>
        );

        expect(screen.getByRole('tab', { name: /hellenistic/i })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tab', { name: /evolutionary/i })).toHaveAttribute('aria-selected', 'false');
    });

    it('renders children content', () => {
        render(
            <TabView>
                <p>Test content here</p>
            </TabView>
        );

        expect(screen.getByText('Test content here')).toBeInTheDocument();
    });

    it('has proper ARIA attributes for accessibility', () => {
        render(
            <TabView>
                <p>Content</p>
            </TabView>
        );

        const tablist = screen.getByRole('tablist');
        expect(tablist).toHaveAttribute('aria-label', 'Chart Perspective');

        const hellenisticTab = screen.getByRole('tab', { name: /hellenistic/i });
        expect(hellenisticTab).toHaveAttribute('id', 'tab-hellenistic');
        expect(hellenisticTab).toHaveAttribute('aria-controls', 'panel-hellenistic');

        const evolutionaryTab = screen.getByRole('tab', { name: /evolutionary/i });
        expect(evolutionaryTab).toHaveAttribute('id', 'tab-evolutionary');
        expect(evolutionaryTab).toHaveAttribute('aria-controls', 'panel-evolutionary');
    });

    it('displays tab panel with correct ARIA attributes', () => {
        render(
            <TabView activeTab="hellenistic">
                <p>Panel content</p>
            </TabView>
        );

        const panel = screen.getByRole('tabpanel');
        expect(panel).toHaveAttribute('id', 'panel-hellenistic');
        expect(panel).toHaveAttribute('aria-labelledby', 'tab-hellenistic');
    });
});

describe('TabContent', () => {
    it('renders children when active is true', () => {
        render(
            <TabContent active={true}>
                <p>Active content</p>
            </TabContent>
        );

        expect(screen.getByText('Active content')).toBeInTheDocument();
    });

    it('does not render children when active is false', () => {
        render(
            <TabContent active={false}>
                <p>Hidden content</p>
            </TabContent>
        );

        expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
    });

    it('toggles visibility based on active prop', () => {
        const { rerender } = render(
            <TabContent active={false}>
                <p>Toggle content</p>
            </TabContent>
        );

        expect(screen.queryByText('Toggle content')).not.toBeInTheDocument();

        rerender(
            <TabContent active={true}>
                <p>Toggle content</p>
            </TabContent>
        );

        expect(screen.getByText('Toggle content')).toBeInTheDocument();
    });
});
