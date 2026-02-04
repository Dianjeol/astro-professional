import React from 'react';
import { motion } from 'framer-motion';
import type { ChartData } from '../../types/astrology';
import { getInterpretation } from '../../data/interpretations';
import './AspectList.css';

interface AspectListProps {
    data: ChartData;
}

export const AspectList: React.FC<AspectListProps> = ({ data }) => {
    if (!data.aspects || data.aspects.length === 0) {
        return null; // Or show "No major aspects found"
    }

    return (
        <div className="aspect-list">
            <h3>Major Aspects</h3>
            <div className="aspect-list-grid">
                {data.aspects.map((aspect, index) => {
                    const aspectText = getInterpretation(aspect.planet1, aspect.planet2, aspect.type);
                    const borderColorClass = `aspect-${aspect.type.toLowerCase()}`;

                    return (
                        <motion.div
                            key={`${aspect.planet1}-${aspect.planet2}-${aspect.type}`}
                            className={`aspect-item ${borderColorClass}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                        >
                            <div className="aspect-header">
                                <span className="aspect-title">
                                    {aspect.planet1} {aspect.type} {aspect.planet2}
                                </span>
                                <span className="aspect-orb">
                                    Orb: {aspect.orb.toFixed(1)}°
                                </span>
                            </div>
                            <p className="aspect-text">{aspectText}</p>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
