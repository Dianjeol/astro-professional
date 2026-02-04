import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
    beforeEach(() => {
        // Clear localStorage and document attribute before each test
        localStorage.clear();
        document.documentElement.removeAttribute('data-theme');
    });

    it('renders toggle button', () => {
        render(<ThemeToggle />);
        expect(screen.getByRole('button')).toBeDefined();
    });

    it('defaults to dark mode (default state)', () => {
        render(<ThemeToggle />);
        // Button should indicate option to switch to light
        expect(screen.getByLabelText(/Switch to light mode/i)).toBeDefined();
    });

    it('switches to light mode on click', () => {
        render(<ThemeToggle />);
        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
        expect(localStorage.getItem('astro_theme_preference')).toBe('light');
        expect(screen.getByLabelText(/Switch to dark mode/i)).toBeDefined();
    });

    it('persists theme preference', () => {
        localStorage.setItem('astro_theme_preference', 'light');
        render(<ThemeToggle />);

        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
        expect(screen.getByLabelText(/Switch to dark mode/i)).toBeDefined();
    });
});
