import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ChartWheel } from './ChartWheel';
import type { ChartData } from '../../types/astrology';

const mockData: ChartData = {
    planets: [
        { name: 'Sun', sign: 'Aries', position: { d: 0, m: 0, s: 0, totalDegrees: 0 }, isRetrograde: false, house: 1, speed: 1 },
        { name: 'Moon', sign: 'Libra', position: { d: 0, m: 0, s: 0, totalDegrees: 180 }, isRetrograde: false, house: 7, speed: 1 }
    ],
    houses: Array.from({ length: 12 }, (_, i) => ({
        number: i + 1,
        sign: 'Aries', // simplified
        degree: 0,
        totalDegree: i * 30
    })),
    angles: { asc: 0, mc: 270, dsc: 180, ic: 90 },
    aspects: [],
    meta: {
        isDayChart: true,
        date: new Date(),
        location: { lat: 0, long: 0, city: 'Test City' }
    }
};

describe('ChartWheel', () => {
    it('renders without crashing', () => {
        const { container } = render(<ChartWheel data={mockData} />);
        expect(container.querySelector('svg')).toBeDefined();
    });

    it('renders 12 zodiac sectors', () => {
        const { container } = render(<ChartWheel data={mockData} />);
        const sectors = container.querySelectorAll('.sign-sector');
        expect(sectors.length).toBe(12);
    });

    it('renders planets', () => {
        const { container } = render(<ChartWheel data={mockData} />);
        const planets = container.querySelectorAll('.planet-group');
        expect(planets.length).toBe(2);

        expect(container.textContent).toContain('Su'); // Sun
        expect(container.textContent).toContain('Mo'); // Moon
    });

    it('renders aspect lines if present', () => {
        const dataWithAspects: ChartData = {
            ...mockData,
            aspects: [{
                planet1: 'Sun',
                planet2: 'Moon',
                type: 'Opposition',
                orb: 0
            }]
        };
        const { container } = render(<ChartWheel data={dataWithAspects} />);
        const aspects = container.querySelectorAll('.aspect-line');
        expect(aspects.length).toBe(1);
        expect(aspects[0].classList.contains('aspect-opposition')).toBe(true);
    });
});
