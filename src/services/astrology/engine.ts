import type { ChartData, Planet, House, PlanetName, SignName, Coordinate, Aspect, Dignity } from '../../types/astrology';
import { SwissEphemeris, HouseSystem } from '@swisseph/browser';

// Swiss Ephemeris Constants
const SwePlanet = {
    Sun: 0, Moon: 1, Mercury: 2, Venus: 3, Mars: 4,
    Jupiter: 5, Saturn: 6, Uranus: 7, Neptune: 8, Pluto: 9
};
const LunarPoint = { MeanNode: 10, TrueNode: 11 };
const OpsHouseSystem = { Placidus: 'P', WholeSign: 'W' };

// Constants
const SIGNS: SignName[] = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Essential Dignity Tables (Traditional 7 Planets)
// Sign Rulers (Domicile)
const SIGN_RULERS: Record<SignName, PlanetName> = {
    Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon',
    Leo: 'Sun', Virgo: 'Mercury', Libra: 'Venus', Scorpio: 'Mars',
    Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter'
};

// Exaltations
const EXALTATIONS: Partial<Record<PlanetName, SignName>> = {
    Sun: 'Aries', Moon: 'Taurus', Mercury: 'Virgo', Venus: 'Pisces',
    Mars: 'Capricorn', Jupiter: 'Cancer', Saturn: 'Libra'
};

// Detriments (opposite of domicile)
const DETRIMENTS: Partial<Record<PlanetName, SignName[]>> = {
    Sun: ['Aquarius'], Moon: ['Capricorn'], Mercury: ['Sagittarius', 'Pisces'],
    Venus: ['Aries', 'Scorpio'], Mars: ['Taurus', 'Libra'],
    Jupiter: ['Gemini', 'Virgo'], Saturn: ['Cancer', 'Leo']
};

// Falls (opposite of exaltation)
const FALLS: Partial<Record<PlanetName, SignName>> = {
    Sun: 'Libra', Moon: 'Scorpio', Mercury: 'Pisces', Venus: 'Virgo',
    Mars: 'Cancer', Jupiter: 'Capricorn', Saturn: 'Aries'
};

export class AstrologyEngine {
    private static instance: AstrologyEngine;
    private swe: SwissEphemeris;
    private readyPromise: Promise<void>;

    private constructor() {
        this.swe = new SwissEphemeris();
        this.readyPromise = this.swe.init('/swisseph.wasm').then(() => {
            console.log("Swiss Ephemeris initialized.");
        });
    }

    public static getInstance(): AstrologyEngine {
        if (!AstrologyEngine.instance) {
            AstrologyEngine.instance = new AstrologyEngine();
        }
        return AstrologyEngine.instance;
    }

    public async calculateChart(date: Date, lat: number, long: number, system: 'WholeSign' | 'Placidus' = 'WholeSign'): Promise<ChartData> {
        await this.readyPromise;

        // Calculate Julian Day using the library's method
        const jd = this.swe.dateToJulianDay(date);

        // Calculate Planets
        const planets: Planet[] = [];
        const bodies = [
            { name: 'Sun', id: SwePlanet.Sun },
            { name: 'Moon', id: SwePlanet.Moon },
            { name: 'Mercury', id: SwePlanet.Mercury },
            { name: 'Venus', id: SwePlanet.Venus },
            { name: 'Mars', id: SwePlanet.Mars },
            { name: 'Jupiter', id: SwePlanet.Jupiter },
            { name: 'Saturn', id: SwePlanet.Saturn },
            { name: 'Uranus', id: SwePlanet.Uranus },
            { name: 'Neptune', id: SwePlanet.Neptune },
            { name: 'Pluto', id: SwePlanet.Pluto },
            { name: 'North Node', id: LunarPoint.MeanNode },
        ];

        // House System Mapping
        const sweSystem = system === 'WholeSign' ? HouseSystem.WholeSign : HouseSystem.Placidus;
        const housesCalc = this.swe.calculateHouses(jd, lat, long, sweSystem);

        for (const body of bodies) {
            const pos = this.swe.calculatePosition(jd, body.id);
            const signInfo = this.getZodiacSign(pos.longitude);

            let houseNum = 0;
            if (system === 'WholeSign') {
                const ascSignIndex = this.getZodiacSign(housesCalc.ascendant).index;
                const planetSignIndex = signInfo.index;
                houseNum = ((planetSignIndex - ascSignIndex + 12) % 12) + 1;
            } else {
                // Placidus house calculation
                houseNum = this.calculatePlacidusHouse(pos.longitude, housesCalc.cusps);
            }

            planets.push({
                name: body.name as PlanetName,
                sign: signInfo.sign,
                position: this.decimalToCoordinate(pos.longitude),
                isRetrograde: pos.longitudeSpeed < 0,
                house: houseNum,
                speed: pos.longitudeSpeed
            });
        }

        // Build Houses Array
        const houses: House[] = [];
        for (let i = 1; i <= 12; i++) {
            const cusp = housesCalc.cusps[i];
            const signInfo = this.getZodiacSign(cusp);
            houses.push({
                number: i,
                sign: signInfo.sign,
                degree: signInfo.degrees,
                totalDegree: cusp
            });
        }

        return {
            planets,
            houses,
            angles: {
                asc: housesCalc.ascendant,
                mc: housesCalc.mc,
                dsc: (housesCalc.ascendant + 180) % 360,
                ic: (housesCalc.mc + 180) % 360
            },
            aspects: this.calculateAspects(planets),
            meta: {
                isDayChart: this.isDayChart(planets),
                date: date,
                location: { lat, long }
            }
        };
    }

    /**
     * Calculate which house a planet falls into based on Placidus cusps
     */
    private calculatePlacidusHouse(longitude: number, cusps: number[]): number {
        // cusps is 1-indexed (1..12) from Swiss Ephemeris
        for (let i = 1; i <= 12; i++) {
            const start = cusps[i];
            // Next house cusp (wrap around to house 1 after house 12)
            const end = i === 12 ? cusps[1] : cusps[i + 1];

            if (start < end) {
                // Normal case: Start < End (e.g., 10° to 40°)
                if (longitude >= start && longitude < end) {
                    return i;
                }
            } else {
                // Crossing 0°/360° (e.g., 350° to 20°)
                if (longitude >= start || longitude < end) {
                    return i;
                }
            }
        }
        return 0; // Fallback, should theoretically not happen
    }

    private calculateAspects(planets: Planet[]): Aspect[] {
        const aspects: Aspect[] = [];
        const ORBS = {
            Conjunction: 8,
            Opposition: 8,
            Trine: 8,
            Square: 8,
            Sextile: 6
        };

        for (let i = 0; i < planets.length; i++) {
            for (let j = i + 1; j < planets.length; j++) {
                const p1 = planets[i];
                const p2 = planets[j];

                // Skip nodes for now to reduce clutter, or keep them? Keeping for now.

                let diff = Math.abs(p1.position.totalDegrees - p2.position.totalDegrees);
                if (diff > 180) diff = 360 - diff; // Shortest distance on circle

                let type: Aspect['type'] | null = null;
                let orb = 0;

                if (diff <= ORBS.Conjunction) {
                    type = 'Conjunction';
                    orb = diff;
                } else if (Math.abs(diff - 180) <= ORBS.Opposition) {
                    type = 'Opposition';
                    orb = Math.abs(diff - 180);
                } else if (Math.abs(diff - 120) <= ORBS.Trine) {
                    type = 'Trine';
                    orb = Math.abs(diff - 120);
                } else if (Math.abs(diff - 90) <= ORBS.Square) {
                    type = 'Square';
                    orb = Math.abs(diff - 90);
                } else if (Math.abs(diff - 60) <= ORBS.Sextile) {
                    type = 'Sextile';
                    orb = Math.abs(diff - 60);
                }

                if (type) {
                    aspects.push({
                        planet1: p1.name,
                        planet2: p2.name,
                        type,
                        orb
                    });
                }
            }
        }
        return aspects;
    }

    private isDayChart(planets: Planet[]): boolean {
        const sun = planets.find(p => p.name === 'Sun');
        if (!sun) return true;

        // Simple verification:
        // If we had the Ascendant passed here, we could check purely by angles.
        // For MVP we assume Day.
        return true;
    }

    public getZodiacSign(decimalDegree: number): { sign: SignName, degrees: number, index: number } {
        const total = (decimalDegree % 360 + 360) % 360;
        const signIndex = Math.floor(total / 30);
        const degreeInSign = total % 30;
        return {
            sign: SIGNS[signIndex],
            degrees: degreeInSign,
            index: signIndex
        };
    }

    private decimalToCoordinate(decimal: number): Coordinate {
        const d = Math.floor(decimal);
        const m = Math.floor((decimal - d) * 60);
        const s = Math.round(((decimal - d) * 60 - m) * 60);
        return {
            d: d % 30, // Degree within sign
            m,
            s,
            totalDegrees: decimal
        };
    }

    /**
     * Calculate Essential Dignity for a planet in a sign
     * Returns the dignity type and the sign's ruler
     */
    public getDignity(planet: PlanetName, sign: SignName): Dignity {
        const ruler = SIGN_RULERS[sign];

        // Check Domicile (planet rules the sign)
        if (ruler === planet) {
            return { type: 'Domicile', ruler };
        }

        // Check Exaltation
        if (EXALTATIONS[planet] === sign) {
            return { type: 'Exaltation', ruler };
        }

        // Check Detriment
        if (DETRIMENTS[planet]?.includes(sign)) {
            return { type: 'Detriment', ruler };
        }

        // Check Fall
        if (FALLS[planet] === sign) {
            return { type: 'Fall', ruler };
        }

        // No essential dignity = Peregrine
        return { type: 'Peregrine', ruler };
    }

    /**
     * Determine if chart is a Day or Night chart based on Sun position relative to horizon
     * Day = Sun above horizon (between ASC and DSC going through MC)
     * Night = Sun below horizon
     */
    public isDayChartByAngles(sunDegrees: number, ascDegrees: number): boolean {
        // Normalize to 0-360
        const sun = ((sunDegrees % 360) + 360) % 360;
        const asc = ((ascDegrees % 360) + 360) % 360;

        // Sun is above horizon if it's between DSC and ASC going counterclockwise
        // This means: dsc < sun < asc+360 (wrapping around)
        // Or more simply: check if sun is in the upper half of the chart

        // Calculate the relative position of sun from asc
        let relativePos = (sun - asc + 360) % 360;

        // Houses 7-12 are above horizon (180° from ASC going through MC)
        // In our coordinate system, above horizon = relativePos between 0 and 180
        // Actually, the horizon is the ASC-DSC axis
        // Above horizon: from DSC to ASC going through MC (the upper half)

        // Sun is above horizon if it's in the upper semicircle
        // Upper semicircle: from 180° relative to ASC, going back to 0° (or 360°)
        return relativePos >= 0 && relativePos < 180;
    }

    /**
     * Calculate the Lot of Fortune
     * Day formula: ASC + Moon - Sun
     * Night formula: ASC + Sun - Moon
     */
    public calculateLotOfFortune(asc: number, sun: number, moon: number, isDayChart: boolean): number {
        let lot: number;
        if (isDayChart) {
            lot = asc + moon - sun;
        } else {
            lot = asc + sun - moon;
        }
        // Normalize to 0-360
        return ((lot % 360) + 360) % 360;
    }

    /**
     * Calculate the Lot of Spirit
     * Day formula: ASC + Sun - Moon (reverse of Fortune)
     * Night formula: ASC + Moon - Sun
     */
    public calculateLotOfSpirit(asc: number, sun: number, moon: number, isDayChart: boolean): number {
        let lot: number;
        if (isDayChart) {
            lot = asc + sun - moon;
        } else {
            lot = asc + moon - sun;
        }
        // Normalize to 0-360
        return ((lot % 360) + 360) % 360;
    }
}
