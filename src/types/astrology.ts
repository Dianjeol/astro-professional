export type PlanetName =
    | 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars'
    | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto'
    | 'North Node' | 'South Node' | 'Chiron' | 'Fortune' | 'Spirit' | 'Ascendant' | 'Midheaven';

export type SignName =
    | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer'
    | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio'
    | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export interface Coordinate {
    d: number; // degrees (0-30 within sign)
    m: number; // minutes
    s: number; // seconds
    totalDegrees: number; // 0-360
}

// Essential Dignities
export type DignityType = 'Domicile' | 'Exaltation' | 'Detriment' | 'Fall' | 'Peregrine';

export interface Dignity {
    type: DignityType;
    ruler?: PlanetName; // The planet that rules this sign
}

// Lots (Arabic Parts)
export interface Lot {
    name: 'Fortune' | 'Spirit';
    sign: SignName;
    degree: number;
    totalDegrees: number;
    house: number;
}

export interface Planet {
    name: PlanetName;
    sign: SignName;
    position: Coordinate;
    isRetrograde: boolean;
    house: number; // 1-12
    speed: number;
    dignity?: Dignity; // Essential dignity status
}

export interface House {
    number: number;
    sign: SignName;
    degree: number; // 0-30
    totalDegree: number; // 0-360
}

export interface Aspect {
    planet1: PlanetName;
    planet2: PlanetName;
    type: 'Conjunction' | 'Opposition' | 'Trine' | 'Square' | 'Sextile';
    orb: number;
}

export interface ChartData {
    planets: Planet[];
    houses: House[];
    angles: {
        asc: number; // total degrees
        mc: number;
        dsc: number;
        ic: number;
    };
    aspects: Aspect[];
    lots?: Lot[]; // Fortune and Spirit
    meta: {
        isDayChart: boolean;
        date: Date;
        location: {
            lat: number;
            long: number;
            city?: string;
        };
        name?: string; // Chart owner name
        unknownTime?: boolean; // If birth time is unknown
    };
}
