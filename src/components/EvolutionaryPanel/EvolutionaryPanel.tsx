import React from 'react';
import { motion } from 'framer-motion';
import type { ChartData, PlanetName, SignName } from '../../types/astrology';
import { AstrologyEngine } from '../../services/astrology/engine';
import './EvolutionaryPanel.css';

interface EvolutionaryPanelProps {
    data: ChartData;
}

// Outer planets for evolutionary focus
const OUTER_PLANETS: PlanetName[] = ['Uranus', 'Neptune', 'Pluto'];

export const EvolutionaryPanel: React.FC<EvolutionaryPanelProps> = ({ data }) => {
    const engine = AstrologyEngine.getInstance();

    // Get Lunar Nodes
    const northNode = data.planets.find(p => p.name === 'North Node');
    const southNodeDegrees = northNode ? (northNode.position.totalDegrees + 180) % 360 : null;
    const southNodeSign = southNodeDegrees !== null
        ? engine.getZodiacSign(southNodeDegrees).sign
        : null;
    const southNodeDegree = southNodeDegrees !== null
        ? Math.floor(southNodeDegrees % 30)
        : null;

    // Get Pluto and calculate Polarity Point
    const pluto = data.planets.find(p => p.name === 'Pluto');
    const plutoPolarityDegrees = pluto ? (pluto.position.totalDegrees + 180) % 360 : null;
    const plutoPolaritySign = plutoPolarityDegrees !== null
        ? engine.getZodiacSign(plutoPolarityDegrees).sign
        : null;
    const plutoPolarityDegree = plutoPolarityDegrees !== null
        ? Math.floor(plutoPolarityDegrees % 30)
        : null;

    // Get outer planets
    const outerPlanets = data.planets.filter(p => OUTER_PLANETS.includes(p.name));

    return (
        <motion.div
            className="evolutionary-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Lunar Nodes Section */}
            <h3>Lunar Nodes</h3>
            <div className="nodes-section">
                {northNode && (
                    <motion.div
                        className="node-card north"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <span className="node-icon">☊</span>
                        <div className="node-info">
                            <span className="node-name">North Node</span>
                            <span className="node-position">
                                {northNode.sign} {northNode.position.d}°
                            </span>
                            <span className="node-meaning">Soul's evolutionary direction</span>
                        </div>
                    </motion.div>
                )}
                {southNodeSign && (
                    <motion.div
                        className="node-card south"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="node-icon">☋</span>
                        <div className="node-info">
                            <span className="node-name">South Node</span>
                            <span className="node-position">
                                {southNodeSign} {southNodeDegree}°
                            </span>
                            <span className="node-meaning">Past life patterns & comfort zone</span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Pluto & Polarity Point */}
            {pluto && (
                <>
                    <h3>Pluto & Soul Evolution</h3>
                    <div className="pluto-section">
                        <motion.div
                            className="pluto-card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="pluto-main">
                                <span className="planet-symbol">♇</span>
                                <div className="pluto-info">
                                    <span className="label">Pluto</span>
                                    <span className="position">
                                        {pluto.sign} {pluto.position.d}°
                                        {pluto.isRetrograde && <span className="rx">℞</span>}
                                    </span>
                                </div>
                            </div>
                            <div className="polarity-point">
                                <span className="label">Polarity Point</span>
                                <span className="position">
                                    {plutoPolaritySign} {plutoPolarityDegree}°
                                </span>
                                <span className="meaning">Integration point for soul growth</span>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}

            {/* Outer Planets */}
            <h3>Outer Planets (Generational)</h3>
            <div className="outer-planets-grid">
                {outerPlanets.map((planet, index) => (
                    <motion.div
                        key={planet.name}
                        className="outer-planet-card"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                    >
                        <span className="planet-name">{planet.name}</span>
                        <span className="planet-sign">
                            {planet.sign} {planet.position.d}°
                            {planet.isRetrograde && <span className="rx">℞</span>}
                        </span>
                        <span className="house-label">House {planet.house}</span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};
