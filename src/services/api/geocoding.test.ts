import { describe, it, expect, vi, afterEach } from 'vitest';
import { GeocodingService } from './geocoding';

describe('GeocodingService', () => {
    // Mock global fetch
    const fetchMock = vi.fn();
    globalThis.fetch = fetchMock;

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should return results for a valid city search', async () => {
        const mockResponse = {
            results: [
                { id: 1, name: 'London', latitude: 51.5, longitude: -0.1, country: 'United Kingdom' }
            ],
            generationtime_ms: 10
        };

        fetchMock.mockResolvedValue({
            ok: true,
            json: async () => mockResponse
        } as Response);

        const results = await GeocodingService.searchCity('London');

        expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('name=London'));
        expect(results).toHaveLength(1);
        expect(results[0].name).toBe('London');
    });

    it('should return empty array on API error', async () => {
        fetchMock.mockResolvedValue({
            ok: false,
            statusText: 'Not Found'
        } as Response);

        // Spy on console.error to suppress output during test
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        const results = await GeocodingService.searchCity('InvalidCity');

        expect(results).toEqual([]);
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it('should return empty array for short query', async () => {
        const results = await GeocodingService.searchCity('A');
        expect(results).toEqual([]);
        expect(fetchMock).not.toHaveBeenCalled();
    });
});
