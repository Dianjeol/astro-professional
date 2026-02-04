import { describe, it, expect, beforeAll, vi } from 'vitest';
import { AstrologyEngine } from './engine';

// Mock the external library
vi.mock('@swisseph/browser', async () => {
    // Import vi directly inside the factory to ensure it works with hoisting
    const { vi } = await import('vitest');
    const SwissEphemerisMock = vi.fn().mockImplementation(function () {
        return {
            init: vi.fn().mockResolvedValue(undefined),
            // dateToJulianDay is replaced by manual calc in engine.ts, but consistent mock is good
            dateToJulianDay: vi.fn().mockReturnValue(2460310.5),
            calculateHouses: vi.fn().mockReturnValue({
                ascendant: 270, // Capricorn 0
                mc: 180, // Libra 0
                cusps: [0, 270, 300, 330, 0, 30, 60, 90, 120, 150, 180, 210, 240] // Dummy cusps
            }),
            calculatePosition: vi.fn().mockReturnValue({
                longitude: 280.5, // Capricorn 10.5
                longitudeSpeed: 1,
                latitude: 0,
                distance: 1,
                speed: 1
            })
        };
    });
    return { SwissEphemeris: SwissEphemerisMock };
});

describe('AstrologyEngine', () => {
    let engine: AstrologyEngine;

    beforeAll(async () => {
        engine = AstrologyEngine.getInstance();
    });

    it('should be a singleton', () => {
        const instance1 = AstrologyEngine.getInstance();
        const instance2 = AstrologyEngine.getInstance();
        expect(instance1).toBe(instance2);
    });

    it('should calculate a chart with mocked data', async () => {
        const date = new Date('2024-01-01T12:00:00Z');
        const lat = 51.5074;
        const long = -0.1278;

        const chart = await engine.calculateChart(date, lat, long);

        expect(chart).toBeDefined();
        expect(chart.planets.length).toBeGreaterThan(0);
        expect(chart.planets[0].sign).toBe('Capricorn');
        expect(chart.planets[0].position.d).toBe(10);

        expect(chart.houses.length).toBe(12);
        expect(chart.angles.asc).toBe(270);
    });
});

// Essential Dignities Tests (Pure logic, no mocking needed)
describe('Essential Dignities', () => {
    let engine: AstrologyEngine;

    beforeAll(() => {
        engine = AstrologyEngine.getInstance();
    });

    describe('getDignity', () => {
        // Domicile Tests (Planet rules the sign)
        it('returns Domicile for Sun in Leo', () => {
            const result = engine.getDignity('Sun', 'Leo');
            expect(result.type).toBe('Domicile');
        });

        it('returns Domicile for Moon in Cancer', () => {
            const result = engine.getDignity('Moon', 'Cancer');
            expect(result.type).toBe('Domicile');
        });

        it('returns Domicile for Mars in Aries', () => {
            const result = engine.getDignity('Mars', 'Aries');
            expect(result.type).toBe('Domicile');
        });

        it('returns Domicile for Saturn in Capricorn', () => {
            const result = engine.getDignity('Saturn', 'Capricorn');
            expect(result.type).toBe('Domicile');
        });

        it('returns Domicile for Jupiter in Sagittarius', () => {
            const result = engine.getDignity('Jupiter', 'Sagittarius');
            expect(result.type).toBe('Domicile');
        });

        // Exaltation Tests
        it('returns Exaltation for Sun in Aries', () => {
            const result = engine.getDignity('Sun', 'Aries');
            expect(result.type).toBe('Exaltation');
        });

        it('returns Exaltation for Moon in Taurus', () => {
            const result = engine.getDignity('Moon', 'Taurus');
            expect(result.type).toBe('Exaltation');
        });

        it('returns Exaltation for Saturn in Libra', () => {
            const result = engine.getDignity('Saturn', 'Libra');
            expect(result.type).toBe('Exaltation');
        });

        // Detriment Tests (opposite of Domicile)
        it('returns Detriment for Sun in Aquarius', () => {
            const result = engine.getDignity('Sun', 'Aquarius');
            expect(result.type).toBe('Detriment');
        });

        it('returns Detriment for Moon in Capricorn', () => {
            const result = engine.getDignity('Moon', 'Capricorn');
            expect(result.type).toBe('Detriment');
        });

        // Fall Tests (opposite of Exaltation)
        it('returns Fall for Sun in Libra', () => {
            const result = engine.getDignity('Sun', 'Libra');
            expect(result.type).toBe('Fall');
        });

        it('returns Fall for Moon in Scorpio', () => {
            const result = engine.getDignity('Moon', 'Scorpio');
            expect(result.type).toBe('Fall');
        });

        // Peregrine Tests (no essential dignity)
        it('returns Peregrine for Sun in Gemini', () => {
            const result = engine.getDignity('Sun', 'Gemini');
            expect(result.type).toBe('Peregrine');
        });

        // Should include ruler information
        it('includes ruler in dignity object', () => {
            const result = engine.getDignity('Sun', 'Aries');
            expect(result.ruler).toBe('Mars'); // Mars rules Aries
        });
    });
});

// Day/Night Chart (Sect) Tests
describe('Sect Calculation', () => {
    let engine: AstrologyEngine;

    beforeAll(() => {
        engine = AstrologyEngine.getInstance();
    });

    describe('isDayChartByAngles', () => {
        it('returns true when Sun is above horizon (in houses 7-12)', () => {
            // Sun at 100° (Cancer), ASC at 0° (Aries) - Sun is in upper half
            const result = engine.isDayChartByAngles(100, 0);
            expect(result).toBe(true);
        });

        it('returns false when Sun is below horizon (in houses 1-6)', () => {
            // Sun at 280° (Capricorn), ASC at 0° - Sun is in lower half
            const result = engine.isDayChartByAngles(280, 0);
            expect(result).toBe(false);
        });

        it('handles edge case at horizon', () => {
            // Sun exactly at ASC degree
            const result = engine.isDayChartByAngles(0, 0);
            expect(typeof result).toBe('boolean');
        });
    });
});

// Lots Calculation Tests
describe('Lots Calculation', () => {
    let engine: AstrologyEngine;

    beforeAll(() => {
        engine = AstrologyEngine.getInstance();
    });

    describe('calculateLotOfFortune', () => {
        // Day chart formula: ASC + Moon - Sun
        // Night chart formula: ASC + Sun - Moon
        it('calculates Lot of Fortune for day chart correctly', () => {
            // Day chart: ASC (0°) + Moon (90°) - Sun (30°) = 60° (Gemini 0°)
            const result = engine.calculateLotOfFortune(0, 30, 90, true);
            expect(result).toBe(60);
        });

        it('calculates Lot of Fortune for night chart correctly', () => {
            // Night chart: ASC (0°) + Sun (30°) - Moon (90°) = -60° = 300° (Aquarius 0°)
            const result = engine.calculateLotOfFortune(0, 30, 90, false);
            expect(result).toBe(300);
        });

        it('normalizes result to 0-360 range', () => {
            // Should handle negative values
            const result = engine.calculateLotOfFortune(10, 180, 30, true);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(360);
        });
    });

    describe('calculateLotOfSpirit', () => {
        // Day chart formula: ASC + Sun - Moon (opposite of Fortune)
        // Night chart formula: ASC + Moon - Sun
        it('calculates Lot of Spirit for day chart correctly', () => {
            // Day chart: ASC (0°) + Sun (30°) - Moon (90°) = -60° = 300°
            const result = engine.calculateLotOfSpirit(0, 30, 90, true);
            expect(result).toBe(300);
        });

        it('calculates Lot of Spirit for night chart correctly', () => {
            // Night chart: ASC (0°) + Moon (90°) - Sun (30°) = 60°
            const result = engine.calculateLotOfSpirit(0, 30, 90, false);
            expect(result).toBe(60);
        });
    });
});
