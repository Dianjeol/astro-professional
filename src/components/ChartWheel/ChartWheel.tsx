import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { ChartData } from '../../types/astrology';
import { Tooltip } from '../Tooltip/Tooltip';
import './ChartWheel.css';

interface ChartWheelProps {
    data: ChartData;
    width?: number;
    height?: number;
}

export const ChartWheel: React.FC<ChartWheelProps> = ({
    data,
    width = 600,
    height = 600
}) => {
    const [hoveredPlanet, setHoveredPlanet] = useState<{ name: string; x: number; y: number } | null>(null);
    const center = { x: width / 2, y: height / 2 };
    const radius = Math.min(width, height) / 2 * 0.9;

    // Radii for different rings
    const zodiacOuterRadius = radius;
    const zodiacInnerRadius = radius * 0.85;
    const houseOuterRadius = zodiacInnerRadius;
    const houseInnerRadius = radius * 0.3;
    const planetRadius = radius * 0.75; // Place planets inside houses

    // The Ascendant value in data handles the rotation offset.
    const ascendantOffset = data ? data.angles.asc : 0;

    const getPointOnCircle = (r: number, angleDeg: number) => {
        // Visual Angle logic: 180 - (Angle - Offset).
        // 0 deg Aries should be at correct position relative to Ascendant.
        const visualAngle = 180 - (angleDeg - ascendantOffset);
        const rad = (visualAngle * Math.PI) / 180;
        return {
            x: center.x + r * Math.cos(rad),
            y: center.y + r * Math.sin(rad)
        };
    };

    // Signs
    const signs = [
        'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];

    return (
        <svg width={width} height={height} className="chart-wheel" viewBox={`0 0 ${width} ${height}`}>
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Background */}
            <circle cx={center.x} cy={center.y} r={radius} className="wheel-bg" />

            {/* Zodiac Ring */}
            <g className="zodiac-ring">
                {signs.map((sign, i) => {
                    const startAngle = i * 30;
                    const endAngle = (i + 1) * 30;

                    // Paths for sector
                    const p1 = getPointOnCircle(zodiacOuterRadius, startAngle);
                    const p2 = getPointOnCircle(zodiacOuterRadius, endAngle);
                    const p3 = getPointOnCircle(zodiacInnerRadius, endAngle);
                    const p4 = getPointOnCircle(zodiacInnerRadius, startAngle);

                    const pathd = `
                        M ${p1.x} ${p1.y}
                        A ${zodiacOuterRadius} ${zodiacOuterRadius} 0 0 0 ${p2.x} ${p2.y}
                        L ${p3.x} ${p3.y}
                        A ${zodiacInnerRadius} ${zodiacInnerRadius} 0 0 1 ${p4.x} ${p4.y}
                        Z
                    `;

                    return (
                        <g key={sign}>
                            <path d={pathd} className={`sign-sector sign-${i}`} />
                            {/* Text Label Center */}
                            {(() => {
                                const midAngle = startAngle + 15;
                                const labelPos = getPointOnCircle((zodiacOuterRadius + zodiacInnerRadius) / 2, midAngle);
                                return (
                                    <text x={labelPos.x} y={labelPos.y} className="sign-label" textAnchor="middle" dominantBaseline="middle">
                                        {sign.substring(0, 3)}
                                    </text>
                                );
                            })()}
                        </g>
                    );
                })}
            </g>

            {/* House Lines */}
            <g className="house-lines">
                {data.houses.map((house) => {
                    // House cusp
                    const pStart = getPointOnCircle(houseInnerRadius, house.totalDegree);
                    const pEnd = getPointOnCircle(houseOuterRadius, house.totalDegree);
                    return (
                        <line
                            key={`h-${house.number}`}
                            x1={pStart.x} y1={pStart.y}
                            x2={pEnd.x} y2={pEnd.y}
                            className="house-line"
                        />
                    );
                })}
            </g>

            {/* Aspect Lines */}
            <g className="aspect-lines">
                {data.aspects.map((aspect, i) => {
                    const p1Data = data.planets.find(p => p.name === aspect.planet1);
                    const p2Data = data.planets.find(p => p.name === aspect.planet2);

                    if (!p1Data || !p2Data) return null;

                    const coord1 = getPointOnCircle(planetRadius, p1Data.position.totalDegrees);
                    const coord2 = getPointOnCircle(planetRadius, p2Data.position.totalDegrees);

                    return (
                        <motion.line
                            key={`aspect-${i}`}
                            x1={coord1.x} y1={coord1.y}
                            x2={coord2.x} y2={coord2.y}
                            className={`aspect-line aspect-${aspect.type.toLowerCase()}`}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.6 }}
                            transition={{ duration: 1.5, delay: 0.5 + i * 0.1 }}
                        />
                    );
                })}
            </g>

            {/* Planets */}
            <g className="planet-layer">
                {data.planets.map((planet) => {
                    const p = getPointOnCircle(planetRadius, planet.position.totalDegrees);
                    return (
                        <g
                            key={planet.name}
                            className="planet-group"
                            onMouseEnter={(e) => setHoveredPlanet({
                                name: `${planet.name}: ${planet.sign} ${planet.position.d}° (H${planet.house})`,
                                x: e.clientX,
                                y: e.clientY
                            })}
                            onMouseMove={(e) => setHoveredPlanet({
                                name: `${planet.name}: ${planet.sign} ${planet.position.d}° (H${planet.house})`,
                                x: e.clientX,
                                y: e.clientY
                            })}
                            onMouseLeave={() => setHoveredPlanet(null)}
                        >
                            <line
                                x1={center.x} y1={center.y}
                                x2={p.x} y2={p.y}
                                className="planet-guide"
                            />
                            <circle cx={p.x} cy={p.y} r={12} className="planet-marker-bg" />
                            <text x={p.x} y={p.y} className="planet-label" textAnchor="middle" dominantBaseline="middle" dy="1">
                                {planet.name.substring(0, 2)}
                            </text>
                        </g>
                    );
                })}
            </g>

            {/* Center Hub */}
            <circle cx={center.x} cy={center.y} r={houseInnerRadius} className="wheel-center" />

            {/* Tooltip */}
            {hoveredPlanet && (
                <foreignObject x={0} y={0} width="100%" height="100%" style={{ pointerEvents: 'none' }}>
                    <Tooltip
                        text={hoveredPlanet.name}
                        visible={!!hoveredPlanet}
                        x={hoveredPlanet.x}
                        y={hoveredPlanet.y}
                    />
                </foreignObject>
            )}
        </svg>
    );
};
