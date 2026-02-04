import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ChartData } from '../../types/astrology';

// Mock the engine module BEFORE importing the component
vi.mock('../../services/astrology/engine', () => ({
    AstrologyEngine: {
        getInstance: () => ({
            getZodiacSign: (degrees: number) => {
                const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
                const index = Math.floor((degrees % 360) / 30);
                return { sign: signs[index], degrees: degrees % 30, index };
            }
        })
    }
}));

// Import component AFTER mocking
import { EvolutionaryPanel } from './EvolutionaryPanel';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => (
            <div {...props}>{children}</div>
        ),
    },
}));

const mockChartData: ChartData = {
    planets: [
        { name: 'Sun', sign: 'Leo', position: { d: 15, m: 0, s: 0, totalDegrees: 135 }, isRetrograde: false, house: 10, speed: 1 },
        { name: 'Moon', sign: 'Cancer', position: { d: 20, m: 0, s: 0, totalDegrees: 110 }, isRetrograde: false, house: 9, speed: 13 },
        { name: 'North Node', sign: 'Aries', position: { d: 10, m: 0, s: 0, totalDegrees: 10 }, isRetrograde: false, house: 6, speed: -0.05 },
        { name: 'Pluto', sign: 'Capricorn', position: { d: 25, m: 0, s: 0, totalDegrees: 295 }, isRetrograde: true, house: 3, speed: -0.01 },
        { name: 'Uranus', sign: 'Taurus', position: { d: 15, m: 0, s: 0, totalDegrees: 45 }, isRetrograde: false, house: 7, speed: 0.02 },
        { name: 'Neptune', sign: 'Pisces', position: { d: 20, m: 0, s: 0, totalDegrees: 350 }, isRetrograde: false, house: 5, speed: 0.01 },
    ],
    houses: Array.from({ length: 12 }, (_, i) => ({
        number: i + 1,
        sign: 'Aries' as const,
        degree: 0,
        totalDegree: i * 30
    })),
    angles: { asc: 0, mc: 270, dsc: 180, ic: 90 },
    aspects: [],
    meta: {
        isDayChart: true,
        date: new Date('2024-01-01T12:00:00Z'),
        location: { lat: 0, long: 0 }
    }
};

describe('EvolutionaryPanel', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(<EvolutionaryPanel data={mockChartData} />);
        expect(screen.getByText(/Lunar Nodes/i)).toBeInTheDocument();
    });

    it('displays North Node', () => {
        render(<EvolutionaryPanel data={mockChartData} />);
        expect(screen.getByText('North Node')).toBeInTheDocument();
        expect(screen.getByText(/evolutionary direction/i)).toBeInTheDocument();
    });

    it('displays South Node (calculated)', () => {
        render(<EvolutionaryPanel data={mockChartData} />);
        expect(screen.getByText('South Node')).toBeInTheDocument();
    });

    it('displays Pluto section', () => {
        render(<EvolutionaryPanel data={mockChartData} />);
        // Pluto appears in the special section AND in outer planets grid
        const plutoElements = screen.getAllByText('Pluto');
        expect(plutoElements.length).toBeGreaterThan(0);
        expect(screen.getByText('Polarity Point')).toBeInTheDocument();
    });

    it('displays outer planets', () => {
        render(<EvolutionaryPanel data={mockChartData} />);
        expect(screen.getByText('Uranus')).toBeInTheDocument();
        expect(screen.getByText('Neptune')).toBeInTheDocument();
    });

    it('shows heading for outer planets section', () => {
        render(<EvolutionaryPanel data={mockChartData} />);
        expect(screen.getByText(/Outer Planets/i)).toBeInTheDocument();
    });
});
