import type { SignName, PlanetName } from '../../types/astrology';

// Using Egyptian Terms/Bounds as standard for Traditional Astrology
// Structure: Planet rules from previous bound end up to 'degree'
interface Bound {
    planet: PlanetName;
    endDegree: number;
}

export const EGYPTIAN_BOUNDS: Record<SignName, Bound[]> = {
    Aries: [
        { planet: 'Jupiter', endDegree: 6 },
        { planet: 'Venus', endDegree: 12 },
        { planet: 'Mercury', endDegree: 20 },
        { planet: 'Mars', endDegree: 25 },
        { planet: 'Saturn', endDegree: 30 }
    ],
    Taurus: [
        { planet: 'Venus', endDegree: 8 },
        { planet: 'Mercury', endDegree: 14 },
        { planet: 'Jupiter', endDegree: 22 },
        { planet: 'Saturn', endDegree: 27 },
        { planet: 'Mars', endDegree: 30 }
    ],
    Gemini: [
        { planet: 'Mercury', endDegree: 6 },
        { planet: 'Jupiter', endDegree: 12 },
        { planet: 'Venus', endDegree: 17 },
        { planet: 'Mars', endDegree: 24 },
        { planet: 'Saturn', endDegree: 30 }
    ],
    Cancer: [
        { planet: 'Mars', endDegree: 7 },
        { planet: 'Venus', endDegree: 13 },
        { planet: 'Mercury', endDegree: 19 },
        { planet: 'Jupiter', endDegree: 26 },
        { planet: 'Saturn', endDegree: 30 }
    ],
    Leo: [
        { planet: 'Jupiter', endDegree: 6 },
        { planet: 'Venus', endDegree: 11 },
        { planet: 'Saturn', endDegree: 18 },
        { planet: 'Mercury', endDegree: 24 },
        { planet: 'Mars', endDegree: 30 }
    ],
    Virgo: [
        { planet: 'Mercury', endDegree: 7 },
        { planet: 'Venus', endDegree: 17 },
        { planet: 'Jupiter', endDegree: 21 },
        { planet: 'Mars', endDegree: 28 },
        { planet: 'Saturn', endDegree: 30 }
    ],
    Libra: [
        { planet: 'Saturn', endDegree: 6 },
        { planet: 'Mercury', endDegree: 14 },
        { planet: 'Jupiter', endDegree: 21 },
        { planet: 'Venus', endDegree: 28 },
        { planet: 'Mars', endDegree: 30 }
    ],
    Scorpio: [
        { planet: 'Mars', endDegree: 7 },
        { planet: 'Venus', endDegree: 11 },
        { planet: 'Mercury', endDegree: 19 },
        { planet: 'Jupiter', endDegree: 24 },
        { planet: 'Saturn', endDegree: 30 }
    ],
    Sagittarius: [
        { planet: 'Jupiter', endDegree: 12 },
        { planet: 'Venus', endDegree: 17 },
        { planet: 'Mercury', endDegree: 21 },
        { planet: 'Saturn', endDegree: 26 },
        { planet: 'Mars', endDegree: 30 }
    ],
    Capricorn: [
        { planet: 'Mercury', endDegree: 7 },
        { planet: 'Jupiter', endDegree: 14 },
        { planet: 'Venus', endDegree: 22 },
        { planet: 'Saturn', endDegree: 26 },
        { planet: 'Mars', endDegree: 30 }
    ],
    Aquarius: [
        { planet: 'Mercury', endDegree: 7 },
        { planet: 'Venus', endDegree: 13 },
        { planet: 'Jupiter', endDegree: 20 },
        { planet: 'Mars', endDegree: 25 },
        { planet: 'Saturn', endDegree: 30 }
    ],
    Pisces: [
        { planet: 'Venus', endDegree: 12 },
        { planet: 'Jupiter', endDegree: 16 },
        { planet: 'Mercury', endDegree: 19 },
        { planet: 'Mars', endDegree: 28 },
        { planet: 'Saturn', endDegree: 30 }
    ]
};

export function getBoundRuler(sign: SignName, degree: number): PlanetName {
    const bounds = EGYPTIAN_BOUNDS[sign];
    // Degree is 0-29.999
    for (const bound of bounds) {
        if (degree < bound.endDegree) {
            return bound.planet;
        }
    }
    // Fallback (should normally be caught by last bound)
    return bounds[bounds.length - 1].planet;
}
