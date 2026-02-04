import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HellenisticPanel } from './HellenisticPanel';
import type { ChartData } from '../../types/astrology';

// Mock Swiss Ephemeris
vi.mock('@swisseph/browser', () => {
    return {
        SwissEphemeris: vi.fn().mockImplementation(function () {
            return {
                init: vi.fn().mockReturnValue(Promise.resolve()),
                calculateHouses: vi.fn(),
                calculatePosition: vi.fn()
            };
        })
    };
});

const mockChartData: ChartData = {
    planets: [
        { name: 'Sun', sign: 'Aries', position: { d: 15, m: 0, s: 0, totalDegrees: 15 }, house: 1, isRetrograde: false, speed: 1 },
    ],
    houses: [
        { number: 1, sign: 'Aries', degree: 0, totalDegree: 0 },
    ],
    angles: { asc: 0, mc: 90, dsc: 180, ic: 270 },
    aspects: [],
    meta: { isDayChart: true, date: new Date(), location: { lat: 0, long: 0 } }
};

describe('HellenisticPanel', () => {
    it('renders essential dignities and bounds', () => {
        render(<HellenisticPanel data={mockChartData} />);

        // Header
        expect(screen.getByText('Essential Dignities')).toBeInTheDocument();
        expect(screen.getByText('Bound')).toBeInTheDocument();

        // Sun row
        expect(screen.getByText('Sun')).toBeInTheDocument();
        expect(screen.getByText(/Aries 15/)).toBeInTheDocument();

        // Exaltation (Sun in Aries)
        expect(screen.getByText('Exaltation')).toBeInTheDocument();

        // Bound Ruler for Aries 15 is Mercury (12-20)
        // Since Mercury is the ruler, and also the bound ruler, we might see it twice.
        // Ruler of Aries is Mars. Bound ruler is Mercury.
        // We expect "Mars" (Sign Ruler) and "Mercury" (Bound Ruler).

        const marsElements = screen.getAllByText('Mars');
        expect(marsElements.length).toBeGreaterThan(0); // Sign Ruler

        const mercuryElements = screen.getAllByText('Mercury');
        expect(mercuryElements.length).toBeGreaterThan(0); // Bound Ruler
    });
});
