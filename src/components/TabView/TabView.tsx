import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './TabView.css';

export type PerspectiveTab = 'hellenistic' | 'evolutionary';

interface TabViewProps {
    activeTab?: PerspectiveTab;
    onTabChange?: (tab: PerspectiveTab) => void;
    children: React.ReactNode;
}

interface TabContentProps {
    active: boolean;
    children: React.ReactNode;
}

const tabVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
};

export function TabView({ activeTab: controlledTab, onTabChange, children }: TabViewProps) {
    const [internalTab, setInternalTab] = useState<PerspectiveTab>('hellenistic');

    const activeTab = controlledTab ?? internalTab;

    const handleTabChange = (tab: PerspectiveTab) => {
        if (onTabChange) {
            onTabChange(tab);
        } else {
            setInternalTab(tab);
        }
    };

    return (
        <div className="tab-view">
            <div className="tab-view__header" role="tablist" aria-label="Chart Perspective">
                <motion.button
                    className={`tab-view__tab ${activeTab === 'hellenistic' ? 'tab-view__tab--active' : ''}`}
                    onClick={() => handleTabChange('hellenistic')}
                    role="tab"
                    aria-selected={activeTab === 'hellenistic'}
                    aria-controls="panel-hellenistic"
                    id="tab-hellenistic"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span className="tab-view__icon">☉</span>
                    Hellenistic
                    <span className="tab-view__subtitle">Traditional</span>
                </motion.button>

                <motion.button
                    className={`tab-view__tab ${activeTab === 'evolutionary' ? 'tab-view__tab--active' : ''}`}
                    onClick={() => handleTabChange('evolutionary')}
                    role="tab"
                    aria-selected={activeTab === 'evolutionary'}
                    aria-controls="panel-evolutionary"
                    id="tab-evolutionary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span className="tab-view__icon">♇</span>
                    Evolutionary
                    <span className="tab-view__subtitle">Modern</span>
                </motion.button>

                {/* Animated indicator */}
                <motion.div
                    className="tab-view__indicator"
                    layoutId="tab-indicator"
                    initial={false}
                    animate={{
                        x: activeTab === 'hellenistic' ? '0%' : '100%'
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    className="tab-view__content"
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    role="tabpanel"
                    id={`panel-${activeTab}`}
                    aria-labelledby={`tab-${activeTab}`}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export function TabContent({ active, children }: TabContentProps) {
    if (!active) return null;
    return <>{children}</>;
}
