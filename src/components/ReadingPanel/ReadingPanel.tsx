import React from 'react';
import { motion } from 'framer-motion';
import type { ChartData } from '../../types/astrology';
import { getInterpretation } from '../../data/interpretations';
import './ReadingPanel.css';

interface ReadingPanelProps {
    data: ChartData;
}

export const ReadingPanel: React.FC<ReadingPanelProps> = ({ data }) => {
    const sunPlanet = data.planets.find(p => p.name === 'Sun');
    const moonPlanet = data.planets.find(p => p.name === 'Moon');

    // Get Ascendant sign from houses (House 1 cusp)
    const ascendantHouse = data.houses.find(h => h.number === 1);
    const ascendantSign = ascendantHouse?.sign;

    const readings = [
        {
            title: '☉ Sun',
            sign: `${sunPlanet?.sign} (House ${sunPlanet?.house})`,
            text: sunPlanet ?
                [
                    getInterpretation(sunPlanet.sign, 'sun'),
                    getInterpretation(sunPlanet.house, 'sun-house')
                ].filter(Boolean).join(' ')
                : null,
            color: '#fbbf24'
        },
        {
            title: '☽ Moon',
            sign: `${moonPlanet?.sign} (House ${moonPlanet?.house})`,
            text: moonPlanet ?
                [
                    getInterpretation(moonPlanet.sign, 'moon'),
                    getInterpretation(moonPlanet.house, 'moon-house')
                ].filter(Boolean).join(' ')
                : null,
            color: '#94a3b8'
        },
        {
            title: 'Rising',
            sign: ascendantSign,
            text: ascendantSign ? getInterpretation(ascendantSign, 'ascendant') : null,
            color: '#8b5cf6'
        }
    ];

    return (
        <div className="reading-panel">
            <h3>The Big Three</h3>
            <div className="readings-grid">
                {readings.map((reading, index) => (
                    <motion.div
                        key={reading.title}
                        className="reading-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                    >
                        <div className="reading-header" style={{ borderColor: reading.color }}>
                            <span className="reading-title">{reading.title}</span>
                            <span className="reading-sign">{reading.sign}</span>
                        </div>
                        <p className="reading-text">{reading.text}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
