import React, { useState, useEffect } from 'react';
import { GeocodingService, type GeoLocation } from '../services/api/geocoding';
import './ChartInputForm.css';

interface ChartInputData {
    date: Date;
    location: GeoLocation;
    name?: string;
    unknownTime?: boolean;
}

interface ChartInputHooks {
    onCalculate: (data: ChartInputData) => void;
}

export const ChartInputForm: React.FC<ChartInputHooks> = ({ onCalculate }) => {
    const [name, setName] = useState<string>('');
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState<string>('12:00');
    const [unknownTime, setUnknownTime] = useState<boolean>(false);
    const [cityQuery, setCityQuery] = useState<string>('');
    const [cityResults, setCityResults] = useState<GeoLocation[]>([]);
    const [selectedCity, setSelectedCity] = useState<GeoLocation | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (cityQuery.length >= 2 && !selectedCity) {
                setIsLoading(true);
                setError(null);
                try {
                    const results = await GeocodingService.searchCity(cityQuery);
                    setCityResults(results);
                    if (results.length === 0) {
                        setError('No cities found. Try another search.');
                    }
                } catch (err) {
                    setError('Failed to fetch cities. Please check your connection.');
                } finally {
                    setIsLoading(false);
                }
            } else {
                setCityResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [cityQuery, selectedCity]);

    const handleCitySelect = (city: GeoLocation) => {
        setSelectedCity(city);
        setCityQuery(`${city.name}, ${city.admin1 || ''} ${city.country}`);
        setCityResults([]);
        setError(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCity) {
            setError('Please select a city from the list.');
            return;
        }

        // When unknown time, always use 12:00 noon
        const effectiveTime = unknownTime ? '12:00' : time;
        const dateTimeString = `${date}T${effectiveTime}:00`;
        const dateObj = new Date(dateTimeString);

        if (isNaN(dateObj.getTime())) {
            setError('Invalid date or time.');
            return;
        }

        onCalculate({
            date: dateObj,
            location: selectedCity,
            name: name || undefined,
            unknownTime: unknownTime || undefined
        });
    };

    return (
        <form className="chart-input-form" onSubmit={handleSubmit}>
            {/* Name Input (Optional) */}
            <div className="form-group">
                <label htmlFor="chartName">Name</label>
                <input
                    type="text"
                    id="chartName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Optional"
                />
            </div>

            {/* Birth Date */}
            <div className="form-group">
                <label htmlFor="birthDate">Birth Date</label>
                <input
                    type="date"
                    id="birthDate"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>

            {/* Unknown Time Toggle */}
            <div className="form-group toggle-group">
                <label htmlFor="unknownTime" className="toggle-label">
                    <input
                        type="checkbox"
                        id="unknownTime"
                        checked={unknownTime}
                        onChange={(e) => setUnknownTime(e.target.checked)}
                    />
                    <span className="toggle-text">Unknown Birth Time</span>
                </label>
            </div>

            {/* Birth Time (hidden when unknown) */}
            <div className="form-group" style={{ display: unknownTime ? 'none' : 'block' }}>
                <label htmlFor="birthTime">Birth Time</label>
                <input
                    type="time"
                    id="birthTime"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required={!unknownTime}
                />
            </div>

            {/* City Search */}
            <div className="form-group search-group">
                <label htmlFor="citySearch">Birth Place</label>
                <input
                    type="text"
                    id="citySearch"
                    value={cityQuery}
                    onChange={(e) => {
                        setCityQuery(e.target.value);
                        setSelectedCity(null); // Reset selection on edit
                    }}
                    placeholder="Search for a city..."
                    required
                    aria-required="true"
                    aria-invalid={!!error}
                    aria-describedby={error ? "form-error-msg" : undefined}
                    autoComplete="off"
                />
                {isLoading && <div className="spinner">Searching...</div>}

                {cityResults.length > 0 && (
                    <ul className="search-results">
                        {cityResults.map((city) => (
                            <li key={city.id} onClick={() => handleCitySelect(city)}>
                                <strong>{city.name}</strong>
                                <small>{city.admin1 ? `${city.admin1}, ` : ''}{city.country}</small>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" disabled={isLoading}>
                Calculate Chart
            </button>
        </form>
    );
};
