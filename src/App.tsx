import { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import { ChartInputForm } from './components/ChartInputForm';
import { ChartWheel } from './components/ChartWheel/ChartWheel';
import { ReadingPanel } from './components/ReadingPanel/ReadingPanel';
import { TabView, type PerspectiveTab } from './components/TabView/TabView';
import { AspectList } from './components/AspectList/AspectList';
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle';
import { AstrologyEngine } from './services/astrology/engine';
import type { GeoLocation } from './services/api/geocoding';
import type { ChartData } from './types/astrology';

const HellenisticPanel = lazy(() => import('./components/HellenisticPanel/HellenisticPanel').then(m => ({ default: m.HellenisticPanel })));
const EvolutionaryPanel = lazy(() => import('./components/EvolutionaryPanel/EvolutionaryPanel').then(m => ({ default: m.EvolutionaryPanel })));

// Animation Variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// Tab persistence key
const TAB_STORAGE_KEY = 'astro_perspective_tab';

function App() {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [engineReady, setEngineReady] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Tab state with localStorage persistence
  const [activeTab, setActiveTab] = useState<PerspectiveTab>(() => {
    const saved = localStorage.getItem(TAB_STORAGE_KEY);
    return (saved === 'evolutionary' || saved === 'hellenistic') ? saved : 'hellenistic';
  });

  useEffect(() => {
    AstrologyEngine.getInstance();
    setEngineReady(true);
  }, []);



  const calculateChartData = async (
    date: Date,
    location: GeoLocation,
    tab: PerspectiveTab
  ): Promise<ChartData> => {
    const engine = AstrologyEngine.getInstance();
    const system = tab === 'evolutionary' ? 'Placidus' : 'WholeSign';
    return await engine.calculateChart(date, location.latitude, location.longitude, system);
  };

  const handleCalculate = async (data: { date: Date; location: GeoLocation; name?: string; unknownTime?: boolean }) => {
    setIsCalculating(true);
    try {
      const chart = await calculateChartData(data.date, data.location, activeTab);

      chart.meta.location.city = data.location.name;
      chart.meta.name = data.name;
      chart.meta.unknownTime = data.unknownTime;

      // Small delay for animation smoothness
      await new Promise(resolve => setTimeout(resolve, 300));
      setChartData(chart);
    } catch (error) {
      console.error('Failed to calculate chart:', error);
      alert('Error calculating chart. Please check console.');
    } finally {
      setIsCalculating(false);
    }
  };

  // Recalculate when switching tabs if we have chart data
  const handleTabChange = async (tab: PerspectiveTab) => {
    setActiveTab(tab);
    localStorage.setItem(TAB_STORAGE_KEY, tab);

    if (chartData && chartData.meta.location && chartData.meta.date) {
      // preserve meta
      const currentMeta = { ...chartData.meta };
      try {
        // Need to reconstruct GeoLocation from meta which might be lossy if we didn't store full obj
        // But calculateChart only needs lat/long which are in meta.location
        const engine = AstrologyEngine.getInstance();
        const system = tab === 'evolutionary' ? 'Placidus' : 'WholeSign';

        const newChart = await engine.calculateChart(
          new Date(currentMeta.date),
          currentMeta.location.lat,
          currentMeta.location.long,
          system
        );

        // Restore meta info that engine might not have fully
        newChart.meta = { ...newChart.meta, ...currentMeta };
        setChartData(newChart);
      } catch (e) {
        console.error("Error updating chart for tab change:", e);
      }
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          ✦ Astrology
        </motion.h1>
        <div className="header-actions">
          <ThemeToggle />
        </div>
      </header>

      <main>
        <AnimatePresence mode="wait">
          {!chartData ? (
            <motion.div
              key="input"
              className="input-section"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <motion.p
                className="intro-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Enter your birth details to generate your natal chart
              </motion.p>
              {engineReady ? (
                <ChartInputForm onCalculate={handleCalculate} />
              ) : (
                <p className="loading-text">Initializing Astrology Engine...</p>
              )}
              {isCalculating && (
                <motion.div
                  className="calculating-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="spinner" />
                  <p>Calculating your chart...</p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="chart"
              className="chart-view"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {chartData.meta.name ? (
                  <>
                    <span className="chart-name">{chartData.meta.name}</span>
                    <span className="chart-subname"> • {chartData.meta.location.city}</span>
                  </>
                ) : (
                  `Natal Chart: ${chartData.meta.location.city}`
                )}
              </motion.h2>

              {chartData.meta.unknownTime && (
                <div className="unknown-time-warning">
                  <span>⚠ Birth time unknown - Houses and Angles are approximate</span>
                </div>
              )}

              <motion.div
                className="chart-container"
                initial={{ opacity: 0, scale: 0.9, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <ChartWheel data={chartData} width={600} height={600} />
              </motion.div>

              {/* Big Three Reading */}
              <ReadingPanel data={chartData} />

              {/* Dual Perspective Tabs */}
              <TabView activeTab={activeTab} onTabChange={handleTabChange}>
                <Suspense fallback={<div className="loading-fallback">Loading perspective details...</div>}>
                  {activeTab === 'hellenistic' ? (
                    <HellenisticPanel data={chartData} />
                  ) : (
                    <EvolutionaryPanel data={chartData} />
                  )}
                </Suspense>
              </TabView>

              {/* Aspect Interpretations */}
              <AspectList data={chartData} />

              <motion.div
                className="actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button className="primary" onClick={() => setChartData(null)}>
                  New Chart
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;

