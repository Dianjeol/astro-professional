import React from 'react';
import { motion } from 'framer-motion';
import type { ChartData, PlanetName, SignName } from '../../types/astrology';
import { AstrologyEngine } from '../../services/astrology/engine';
import { getBoundRuler } from '../../services/astrology/bounds';
import { getChartRulerReport, getHouseRulersReport } from '../../services/astrology/rulership';
import './HellenisticPanel.css';

interface HellenisticPanelProps {
    data: ChartData;
}

// Traditional 7 planets (hellenistic)
const TRADITIONAL_PLANETS: PlanetName[] = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];

// Dignity colors for styling
const DIGNITY_COLORS: Record<string, string> = {
    Domicile: '#22c55e',
    Exaltation: '#f59e0b',
    Detriment: '#ef4444',
    Fall: '#dc2626',
    Peregrine: '#6b7280'
};

export const HellenisticPanel: React.FC<HellenisticPanelProps> = ({ data }) => {
    const engine = AstrologyEngine.getInstance();

    // Chart Ruler Report
    const chartRulerReport = getChartRulerReport(data);

    // Filter to traditional 7 planets
    const traditionalPlanets = data.planets.filter(p =>
        TRADITIONAL_PLANETS.includes(p.name)
    );

    // Calculate sect (day/night)
    const sunPlanet = data.planets.find(p => p.name === 'Sun');
    const isDayChart = sunPlanet
        ? engine.isDayChartByAngles(sunPlanet.position.totalDegrees, data.angles.asc)
        : true;

    // Calculate Lots
    const moonPlanet = data.planets.find(p => p.name === 'Moon');
    const lotOfFortune = sunPlanet && moonPlanet
        ? engine.calculateLotOfFortune(
            data.angles.asc,
            sunPlanet.position.totalDegrees,
            moonPlanet.position.totalDegrees,
            isDayChart
        )
        : null;

    const lotOfSpirit = sunPlanet && moonPlanet
        ? engine.calculateLotOfSpirit(
            data.angles.asc,
            sunPlanet.position.totalDegrees,
            moonPlanet.position.totalDegrees,
            isDayChart
        )
        : null;

    const getSignFromDegrees = (degrees: number): SignName => {
        return engine.getZodiacSign(degrees).sign;
    };

    const getDegreeInSign = (degrees: number): number => {
        return Math.floor(degrees % 30);
    };

    return (
        <motion.div
            className="hellenistic-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Sect Status */}
            <div className="sect-status">
                <span className={`sect-badge ${isDayChart ? 'day' : 'night'}`}>
                    {isDayChart ? '☀️ Day Chart' : '🌙 Night Chart'}
                </span>
            </div>

            {/* Chart Ruler */}
            <div className="chart-ruler-section">
                <h3>Chart Ruler: {chartRulerReport.rulerName}</h3>
                <p>{chartRulerReport.description}</p>
            </div>

            {/* Essential Dignities */}
            <h3>Essential Dignities</h3>
            <div className="dignities-table">
                <div className="dignities-header">
                    <span>Planet</span>
                    <span>Sign</span>
                    <span>Dignity</span>
                    <span>Ruler</span>
                    <span>Bound</span>
                </div>
                {traditionalPlanets.map((planet, index) => {
                    const dignity = engine.getDignity(planet.name, planet.sign);
                    const bound = getBoundRuler(planet.sign, planet.position.d);
                    return (
                        <motion.div
                            key={planet.name}
                            className="dignity-row"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <span className="planet-name">{planet.name}</span>
                            <span className="planet-sign">
                                {planet.sign} {planet.position.d}°
                                {planet.isRetrograde && <span className="retrograde">℞</span>}
                            </span>
                            <span
                                className="dignity-type"
                                style={{ color: DIGNITY_COLORS[dignity.type] }}
                            >
                                {dignity.type}
                            </span>
                            <span className="sign-ruler">{dignity.ruler}</span>
                            <span className="sign-ruler">{bound}</span>
                        </motion.div>
                    );
                })}
            </div>

            {/* Lots */}
            <h3>Lots (Arabic Parts)</h3>
            <div className="lots-grid">
                {lotOfFortune !== null && (
                    <motion.div
                        className="lot-card fortune"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="lot-icon">⊕</span>
                        <span className="lot-name">Lot of Fortune</span>
                        <span className="lot-position">
                            {getSignFromDegrees(lotOfFortune)} {getDegreeInSign(lotOfFortune)}°
                        </span>
                    </motion.div>
                )}
                {lotOfSpirit !== null && (
                    <motion.div
                        className="lot-card spirit"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <span className="lot-icon">☉</span>
                        <span className="lot-name">Lot of Spirit</span>
                        <span className="lot-position">
                            {getSignFromDegrees(lotOfSpirit)} {getDegreeInSign(lotOfSpirit)}°
                        </span>
                    </motion.div>
                )}
            </div>

            {/* House Rulers */}
            <h3>House Rulers</h3>
            <div className="house-rulers-grid">
                {getHouseRulersReport(data).map((report, index) => (
                    <motion.div
                        key={report.houseNumber}
                        className="house-ruler-card"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.03 }}
                    >
                        <span className="house-number">H{report.houseNumber}</span>
                        <span className="house-sign">{report.sign}</span>
                        <span className="house-ruler-name">{report.ruler}</span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};
