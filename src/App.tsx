import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TopBar } from './components/TopBar';
import { WorldMap } from './components/WorldMap';
import { TimelineController } from './components/TimelineController';
import { KpiCharts } from './components/KpiCharts';
import { YouthExplainerCard } from './components/YouthExplainerCard';
import { FutureConclusionCard } from './components/FutureConclusionCard';
import { AiFutureDebateCard } from './components/AiFutureDebateCard';
import { CountryInspector } from './components/CountryInspector';
import { CausalChainExplorer } from './components/CausalChainExplorer';
import { SpecModal } from './components/SpecModal';
import { generateFullTrajectory } from './engine/simulationRunner';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'map' | 'causal' | 'spec'>('map');
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);

  // Génération de la trajectoire biophysique complète (2026-2100)
  const trajectory = useMemo(() => generateFullTrajectory(), []);

  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1x = 1 an/sec

  // Index courant dans la table trajectoire
  const currentTrajectoryState = useMemo(() => {
    const yr = Math.floor(currentYear);
    const index = Math.max(0, Math.min(trajectory.length - 1, yr - 2026));
    return trajectory[index] || trajectory[0];
  }, [trajectory, currentYear]);

  // Boucle d'animation pour l'avancement temporel fluide
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = null;
      return;
    }

    let animationFrameId: number;

    const tick = (now: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }
      const deltaMs = now - lastTimeRef.current;
      lastTimeRef.current = now;

      // 1x = 1 an par 1000ms
      const yearIncrement = (deltaMs / 1000) * playbackSpeed * 1.2;

      setCurrentYear((prev) => {
        const next = prev + yearIncrement;
        if (next >= 2100) {
          setIsPlaying(false);
          return 2100;
        }
        return next;
      });

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, playbackSpeed]);

  // Raccourci clavier : Barre d'espace pour Play/Pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentYear(2026);
  };

  const handleStepForward = () => {
    setCurrentYear((prev) => Math.min(2100, Math.floor(prev) + 1));
  };

  const handleSeekYear = (year: number) => {
    setCurrentYear(Math.max(2026, Math.min(2100, year)));
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans">
      {/* Top Bar selon le Top Bar Contract */}
      <TopBar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onReset={handleReset}
        currentYear={currentYear}
      />

      {/* Contenu principal */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        {currentTab === 'map' && (
          <div className="flex flex-col gap-6">
            {/* 1. Planisphère à plat (Projection plane Plate Carrée) */}
            <WorldMap
              simulationState={currentTrajectoryState}
              selectedCountryId={selectedCountryId}
              onSelectCountry={setSelectedCountryId}
            />

            {/* 2. Contrôleur temporel (Timeline Scrubber & KPI Macro) */}
            <TimelineController
              currentYear={currentYear}
              isPlaying={isPlaying}
              playbackSpeed={playbackSpeed}
              onTogglePlay={() => setIsPlaying((p) => !p)}
              onStepForward={handleStepForward}
              onReset={handleReset}
              onSpeedChange={setPlaybackSpeed}
              onSeekYear={handleSeekYear}
              simulationState={currentTrajectoryState}
            />

            {/* 3. Graphiques KPI synchronisés sous la mapmonde */}
            <KpiCharts
              trajectory={trajectory}
              currentYear={currentYear}
              onSeekYear={handleSeekYear}
            />

            {/* 4. Fiche détaillée pédagogique : Comprendre comme à 12 ans */}
            <YouthExplainerCard />

            {/* 5. Conclusion finale pour les habitants du futur (2050, 2080, 2100) + Déchiffrage FaIR/Stull Tw + Score de confiance */}
            <FutureConclusionCard />

            {/* 6. Pour aller plus loin : L'IA peut-elle nous sauver ? Ou va-t-elle accélérer le changement ? */}
            <AiFutureDebateCard />
          </div>
        )}

        {currentTab === 'causal' && (
          <CausalChainExplorer />
        )}

        {currentTab === 'spec' && (
          <SpecModal />
        )}
      </main>

      {/* Tiroir d'inspection granulaire d'un pays */}
      <CountryInspector
        countryId={selectedCountryId}
        onClose={() => setSelectedCountryId(null)}
        simulationState={currentTrajectoryState}
        onSelectCountry={setSelectedCountryId}
      />

      {/* Footer sobre et scientifique */}
      <footer className="border-t border-slate-800/80 bg-[#070a10] py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <span>GAIA-Sim · Moteur Biophysique Intégré</span>
          <span aria-hidden="true">·</span>
          <span>FaIR v1.1 CMIP6 (Smith et al.)</span>
          <span aria-hidden="true">·</span>
          <span>Thermomètre Mouillé Stull (2011)</span>
          <span aria-hidden="true">·</span>
          <span>Zhao et al. (PNAS 2017)</span>
          <span aria-hidden="true">·</span>
          <span>Vermeer &amp; Rahmstorf (2009)</span>
          <span aria-hidden="true">·</span>
          <span>Hypothèse de Rigidité Comportementale SSP5-8.5</span>
        </div>
      </footer>
    </div>
  );
}
