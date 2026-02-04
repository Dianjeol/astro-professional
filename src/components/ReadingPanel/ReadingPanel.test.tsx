import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReadingPanel } from './ReadingPanel';
import type { ChartData } from '../../types/astrology';

// Mock chart data
const mockChartData: ChartData = {
    planets: [
        { name: 'Sun', sign: 'Aries', position: { d: 0, m: 0, s: 0, totalDegrees: 0 }, house: 1, isRetrograde: false, speed: 1 },
        { name: 'Moon', sign: 'Taurus', position: { d: 0, m: 0, s: 0, totalDegrees: 30 }, house: 2, isRetrograde: false, speed: 1 }
    ],
    houses: [
        { number: 1, sign: 'Aries', degree: 0, totalDegree: 0 },
        // ... other houses not strictly needed for this test if panel only checks specific ones
    ],
    angles: { asc: 0, mc: 90, dsc: 180, ic: 270 },
    aspects: [],
    meta: { isDayChart: true, date: new Date(), location: { lat: 0, long: 0 } }
};

describe('ReadingPanel', () => {
    it('displays Sun Sign interpretation', () => {
        render(<ReadingPanel data={mockChartData} />);
        expect(screen.getByText('☉ Sun')).toBeInTheDocument();
        // Check for Aries text snippet
        expect(screen.getByText(/courage, initiative/i)).toBeInTheDocument();
    });

    it('displays Sun House interpretation', () => {
        render(<ReadingPanel data={mockChartData} />);
        // Check for House 1 text snippet
        expect(screen.getByText(/In the 1st House, the Sun/i)).toBeInTheDocument();
    });

    it('displays Moon House interpretation', () => {
        render(<ReadingPanel data={mockChartData} />);
        expect(screen.queryByText(/In the 2nd House, the Sun shines on resources/i)).not.toBeInTheDocument(); // Negative check
        expect(screen.getByText(/In the 2nd House, emotional security/i)).toBeInTheDocument(); // Moon house 2
    });
});
