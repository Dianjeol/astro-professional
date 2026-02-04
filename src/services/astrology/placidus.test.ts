import { describe, it, expect, beforeAll, vi } from 'vitest';
import { AstrologyEngine } from './engine';

// Mock the external library
vi.mock('@swisseph/browser', async () => {
    const { vi } = await import('vitest');
    const SwissEphemerisMock = vi.fn().mockImplementation(function () {
        return {
            init: vi.fn().mockResolvedValue(undefined),
            dateToJulianDay: vi.fn(),
            calculateHouses: vi.fn().mockReturnValue({
                ascendant: 0,
                mc: 90,
                // Standard equal houses for simplicity in this test, starting at 0 (Aries)
                // House 1: 0-30, House 2: 30-60, etc.
                cusps: [0, 0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
            }),
            calculatePosition: vi.fn().mockImplementation((_jd, bodyId) => {
                // Mock different positions for different planets
                // Sun (0): 15 (House 1)
                // Moon (1): 350 (House 12: 330-0)
                // Mars (4): 45 (House 2: 30-60)
                let longitude = 0;
                if (bodyId === 0) longitude = 15;
                if (bodyId === 1) longitude = 350;
                if (bodyId === 4) longitude = 45;

                return {
                    longitude,
                    longitudeSpeed: 1,
                    latitude: 0,
                    distance: 1,
                    speed: 1
                };
            })
        };
    });
    return { SwissEphemeris: SwissEphemerisMock };
});

describe('AstrologyEngine - Placidus System', () => {
    let engine: AstrologyEngine;

    beforeAll(() => {
        engine = AstrologyEngine.getInstance();
    });

    it('should assign House 1 for Sun at 15° (Range 0-30)', async () => {
        const chart = await engine.calculateChart(new Date(), 0, 0, 'Placidus');
        const sun = chart.planets.find(p => p.name === 'Sun');
        expect(sun?.house).toBe(1);
    });

    it('should assign House 12 for Moon at 350° (Range 330-0)', async () => {
        const chart = await engine.calculateChart(new Date(), 0, 0, 'Placidus');
        const moon = chart.planets.find(p => p.name === 'Moon');
        expect(moon?.house).toBe(12);
    });

    it('should assign House 2 for Mars at 45° (Range 30-60)', async () => {
        const chart = await engine.calculateChart(new Date(), 0, 0, 'Placidus');
        const mars = chart.planets.find(p => p.name === 'Mars');
        expect(mars?.house).toBe(2);
    });
});
