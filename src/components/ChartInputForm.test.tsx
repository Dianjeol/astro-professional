import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChartInputForm } from './ChartInputForm';
import { GeocodingService } from '../services/api/geocoding';

// Mock GeocodingService
vi.mock('../services/api/geocoding', () => ({
    GeocodingService: {
        searchCity: vi.fn()
    }
}));

describe('ChartInputForm', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    it('renders input fields', () => {
        render(<ChartInputForm onCalculate={vi.fn()} />);

        expect(screen.getByLabelText(/Birth Date/i)).toBeDefined();
        expect(screen.getByLabelText(/^Birth Time$/i)).toBeDefined();
        expect(screen.getByLabelText(/Birth Place/i)).toBeDefined();
    });

    it('calls onCalculate with valid data', async () => {
        const mockOnCalculate = vi.fn();
        const mockCity = {
            id: 1,
            name: 'Berlin',
            latitude: 52.52,
            longitude: 13.40,
            country: 'Germany'
        };

        // Mock search response
        vi.mocked(GeocodingService.searchCity).mockResolvedValue([mockCity]);

        render(<ChartInputForm onCalculate={mockOnCalculate} />);

        // Simulating user input
        const cityInput = screen.getByLabelText(/Birth Place/i);
        fireEvent.change(cityInput, { target: { value: 'Berlin' } });

        // Wait for results
        await waitFor(() => {
            expect(screen.getByText('Berlin')).toBeDefined();
        });

        // Select city
        fireEvent.click(screen.getByText('Berlin'));

        // Submit
        const submitButton = screen.getByRole('button', { name: /Calculate Chart/i }) as HTMLButtonElement;
        expect(submitButton.disabled).toBe(false);
        fireEvent.click(submitButton);

        expect(mockOnCalculate).toHaveBeenCalledTimes(1);
        const calledArg = mockOnCalculate.mock.calls[0][0];
        expect(calledArg.location).toEqual(mockCity);
        expect(calledArg.date).toBeInstanceOf(Date);
    });

    it('renders optional name input field', () => {
        render(<ChartInputForm onCalculate={vi.fn()} />);

        const nameInput = screen.getByLabelText(/Name/i);
        expect(nameInput).toBeDefined();
        expect(nameInput).toHaveAttribute('placeholder', 'Optional');
    });

    it('passes name to onCalculate when provided', async () => {
        const mockOnCalculate = vi.fn();
        const mockCity = {
            id: 1,
            name: 'Berlin',
            latitude: 52.52,
            longitude: 13.40,
            country: 'Germany'
        };

        vi.mocked(GeocodingService.searchCity).mockResolvedValue([mockCity]);

        render(<ChartInputForm onCalculate={mockOnCalculate} />);

        // Enter name
        const nameInput = screen.getByLabelText(/Name/i);
        fireEvent.change(nameInput, { target: { value: 'John Doe' } });

        // Select city
        const cityInput = screen.getByLabelText(/Birth Place/i);
        fireEvent.change(cityInput, { target: { value: 'Berlin' } });

        await waitFor(() => {
            expect(screen.getByText('Berlin')).toBeDefined();
        });

        fireEvent.click(screen.getByText('Berlin'));

        // Submit
        const submitButton = screen.getByRole('button', { name: /Calculate Chart/i });
        fireEvent.click(submitButton);

        expect(mockOnCalculate).toHaveBeenCalledTimes(1);
        expect(mockOnCalculate.mock.calls[0][0].name).toBe('John Doe');
    });

    it('renders unknown time toggle', () => {
        render(<ChartInputForm onCalculate={vi.fn()} />);

        const unknownTimeToggle = screen.getByLabelText(/Unknown Birth Time/i);
        expect(unknownTimeToggle).toBeDefined();
        expect(unknownTimeToggle).toHaveAttribute('type', 'checkbox');
    });

    it('hides time input when unknown time is checked', async () => {
        render(<ChartInputForm onCalculate={vi.fn()} />);

        // Time should be visible initially
        const timeInput = screen.getByLabelText(/^Birth Time$/i);
        expect(timeInput).toBeVisible();

        // Check unknown time
        const unknownTimeToggle = screen.getByLabelText(/Unknown Birth Time/i);
        fireEvent.click(unknownTimeToggle);

        // Time should be hidden now
        expect(timeInput).not.toBeVisible();
    });

    it('passes unknownTime flag when checked', async () => {
        const mockOnCalculate = vi.fn();
        const mockCity = {
            id: 1,
            name: 'Berlin',
            latitude: 52.52,
            longitude: 13.40,
            country: 'Germany'
        };

        vi.mocked(GeocodingService.searchCity).mockResolvedValue([mockCity]);

        render(<ChartInputForm onCalculate={mockOnCalculate} />);

        // Check unknown time
        const unknownTimeToggle = screen.getByLabelText(/Unknown Birth Time/i);
        fireEvent.click(unknownTimeToggle);

        // Select city
        const cityInput = screen.getByLabelText(/Birth Place/i);
        fireEvent.change(cityInput, { target: { value: 'Berlin' } });

        await waitFor(() => {
            expect(screen.getByText('Berlin')).toBeDefined();
        });

        fireEvent.click(screen.getByText('Berlin'));

        // Submit
        const submitButton = screen.getByRole('button', { name: /Calculate Chart/i });
        fireEvent.click(submitButton);

        expect(mockOnCalculate).toHaveBeenCalledTimes(1);
        expect(mockOnCalculate.mock.calls[0][0].unknownTime).toBe(true);
    });

    it('uses noon (12:00) when unknown time is checked', async () => {
        const mockOnCalculate = vi.fn();
        const mockCity = {
            id: 1,
            name: 'Berlin',
            latitude: 52.52,
            longitude: 13.40,
            country: 'Germany'
        };

        vi.mocked(GeocodingService.searchCity).mockResolvedValue([mockCity]);

        render(<ChartInputForm onCalculate={mockOnCalculate} />);

        // Check unknown time
        const unknownTimeToggle = screen.getByLabelText(/Unknown Birth Time/i);
        fireEvent.click(unknownTimeToggle);

        // Select city
        const cityInput = screen.getByLabelText(/Birth Place/i);
        fireEvent.change(cityInput, { target: { value: 'Berlin' } });

        await waitFor(() => {
            expect(screen.getByText('Berlin')).toBeDefined();
        });

        fireEvent.click(screen.getByText('Berlin'));

        // Submit
        const submitButton = screen.getByRole('button', { name: /Calculate Chart/i });
        fireEvent.click(submitButton);

        const calledDate: Date = mockOnCalculate.mock.calls[0][0].date;
        expect(calledDate.getHours()).toBe(12);
        expect(calledDate.getMinutes()).toBe(0);
    });
});
