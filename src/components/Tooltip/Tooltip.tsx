import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Tooltip.css';

interface TooltipProps {
    text: string;
    visible: boolean;
    x: number;
    y: number;
}

export const Tooltip: React.FC<TooltipProps> = ({ text, visible, x, y }) => {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="tooltip"
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    style={{ left: x, top: y }}
                >
                    {text}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
