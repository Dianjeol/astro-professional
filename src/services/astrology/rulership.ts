import type { ChartData, PlanetName, SignName } from '../../types/astrology';
import { AstrologyEngine } from './engine';

export const SIGN_RULERS: Record<SignName, PlanetName> = {
    Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon',
    Leo: 'Sun', Virgo: 'Mercury', Libra: 'Venus', Scorpio: 'Mars',
    Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter'
};

export interface ChartRulerReport {
    rulerName: PlanetName;
    description: string;
}

export const getDispositor = (sign: SignName): PlanetName => {
    return SIGN_RULERS[sign];
}

export const getHouseRuler = (houseNumber: number, houses: { number: number, sign: SignName }[]): PlanetName => {
    const house = houses.find(h => h.number === houseNumber);
    const sign = house?.sign || 'Aries';
    return SIGN_RULERS[sign];
}

export interface HouseRulerReport {
    houseNumber: number;
    sign: SignName;
    ruler: PlanetName;
}

export const getHouseRulersReport = (chart: ChartData): HouseRulerReport[] => {
    return chart.houses.map(house => ({
        houseNumber: house.number,
        sign: house.sign,
        ruler: SIGN_RULERS[house.sign]
    }));
}

export const getChartRulerReport = (chart: ChartData): ChartRulerReport => {
    // 1. Find Ascendant Sign
    const ascHouse = chart.houses.find(h => h.number === 1);
    const ascSign = ascHouse?.sign || 'Aries';

    // 2. Find Ruler of Ascendant (Chart Ruler)
    const rulerName = getDispositor(ascSign);

    // 3. Find the Ruler planet in the chart
    const rulerPlanet = chart.planets.find(p => p.name === rulerName);

    if (!rulerPlanet) {
        return {
            rulerName,
            description: `The ruler of your Ascendant (${ascSign}) is ${rulerName}, but its position could not be calculated.`
        };
    }

    // 4. Analyze Dignity
    const engine = AstrologyEngine.getInstance();
    const dignity = engine.getDignity(rulerName, rulerPlanet.sign);

    let dignityText = '';
    if (dignity.type !== 'Peregrine') {
        dignityText = ` It is in ${dignity.type}, giving it extra strength/prominence.`;
    }

    // 5. Construct Description
    const description = `The ruler of your chart is ${rulerName}, located in ${rulerPlanet.sign} in House ${rulerPlanet.house}.${dignityText}`;

    return {
        rulerName,
        description
    };
}
