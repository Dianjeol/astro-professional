export interface GeoLocation {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string; // State/Region
}

interface GeocodingResponse {
    results?: GeoLocation[];
    generationtime_ms: number;
}

export class GeocodingService {
    private static readonly API_URL = 'https://geocoding-api.open-meteo.com/v1/search';

    public static async searchCity(query: string): Promise<GeoLocation[]> {
        if (!query || query.length < 2) return [];

        try {
            const url = `${this.API_URL}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Geocoding API error: ${response.statusText}`);
            }

            const data: GeocodingResponse = await response.json();
            return data.results || [];
        } catch (error) {
            console.error('Failed to geocode city:', error);
            // Return empty array instead of throwing to avoid crashing UI for typeahead
            return [];
        }
    }
}
