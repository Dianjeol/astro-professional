import { describe, it, expect, vi, beforeAll } from 'vitest';
import type { ChartData, Planet } from '../../types/astrology';

// Mock dependencies
vi.mock('@swisseph/browser', () => ({
    SwissEphemeris: class {
        init() { return Promise.resolve(); }
    }
}));

vi.mock('./engine', () => ({
    AstrologyEngine: {
        getInstance: () => ({
            getDignity: (planet: string, sign: string) => {
                if (planet === 'Sun' && sign === 'Aries') return { type: 'Exaltation', ruler: 'Mars' };
                return { type: 'Peregrine' };
            }
        })
    }
}));

import { getChartRulerReport, getDispositor, getHouseRulersReport } from './rulership';

// Mock data
const mockPlanets: Planet[] = [
    { name: 'Ascendant', sign: 'Leo', position: { d: 0, m: 0, s: 0, totalDegrees: 120 }, house: 1, isRetrograde: false, speed: 0 },
    { name: 'Sun', sign: 'Aries', position: { d: 15, m: 0, s: 0, totalDegrees: 15 }, house: 9, isRetrograde: false, speed: 1 },
    { name: 'Mars', sign: 'Capricorn', position: { d: 5, m: 0, s: 0, totalDegrees: 275 }, house: 6, isRetrograde: false, speed: 1 }
];

const mockChart: ChartData = {
    planets: mockPlanets,
    houses: [
        { number: 1, sign: 'Leo', degree: 0, totalDegree: 120 }
    ],
    angles: { asc: 120, mc: 0, dsc: 0, ic: 0 },
    aspects: [],
    meta: {
        isDayChart: true,
        date: new Date(),
        location: { lat: 0, long: 0 }
    }
};

describe('Rulership Analysis', () => {
    describe('getDispositor', () => {
        it('should return Mars for Aries', () => {
            const ruler = getDispositor('Aries');
            expect(ruler).toBe('Mars');
        });

        it('should return Sun for Leo', () => {
            const ruler = getDispositor('Leo');
            expect(ruler).toBe('Sun');
        });
    });

    describe('getHouseRulersReport', () => {
        it('should return rulers for all houses', () => {
            const reports = getHouseRulersReport(mockChart);
            expect(reports).toHaveLength(1);
            expect(reports[0].houseNumber).toBe(1);
            expect(reports[0].ruler).toBe('Sun'); // Leo ruler
        });
    });

    describe('getChartRulerReport', () => {
        it('should identify the chart ruler correctly', () => {
            const report = getChartRulerReport(mockChart);
            expect(report.rulerName).toBe('Sun');
        });

        it('should provide description of ruler position', () => {
            const report = getChartRulerReport(mockChart);
            expect(report.description).toContain('located in Aries');
            expect(report.description).toContain('House 9');
        });

        it('should mention if ruler has essential dignity (e.g. Exaltation)', () => {
            // Sun in Aries is Exalted
            const report = getChartRulerReport(mockChart);
            expect(report.description).toContain('Exaltation');
        });
    });
});
