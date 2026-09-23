import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TopBar } from './components/TopBar';
import { WorldMap } from './components/WorldMap';
import { TimelineController } from './components/TimelineController';
import { KpiCharts } from './components/KpiCharts';
import { ComparisonModePanel } from './components/ComparisonModePanel';
import { YouthExplainerCard } from './components/YouthExplainerCard';
import { FutureConclusionCard } from './components/FutureConclusionCard';
import { InteractiveFaqSection } from './components/InteractiveFaqSection';
import { AiFutureDebateCard } from './components/AiFutureDebateCard';
import { CountryInspector } from './components/CountryInspector';
import { CausalChainExplorer } from './components/CausalChainExplorer';
import { SpecModal } from './components/SpecModal';
import { generateFullTrajectory, SCENARIO_BAU, SCENARIO_SOBRIETY } from './engine/simulationRunner';
import { SimulationScenarioConfig } from './types/simulation';
import { 
  decodeSimulationParamsFromUrl, 
  syncUrlWithSimulationState, 
  CustomSimulationParams 
} from './utils/urlParams';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'map' | 'causal' | 'spec'>('map');
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);

  // Initialisation à partir des URL Search Params si disponibles
  const initialUrlState = useMemo(() => decodeSimulationParamsFromUrl(), []);
  const [sharedConfigLoaded, setSharedConfigLoaded] = useState<boolean>(initialUrlState.hasCustomUrlParams);

  // Configuration des scénarios de simulation biophysique
  const [isCompareMode, setIsCompareMode] = useState<boolean>(true);
  const [scenarioA, setScenarioA] = useState<SimulationScenarioConfig>(SCENARIO_BAU);
  const [scenarioB, setScenarioB] = useState<SimulationScenarioConfig>(initialUrlState.scenarioB);

  // Paramètres personnalisables pour le scénario B (Sobriété / Politique alternative)
  const [customParams, setCustomParams] = useState<CustomSimulationParams>(initialUrlState.customParams);

  // Année initiale (depuis l'URL si fournie, sinon 2026)
  const [currentYear, setCurrentYear] = useState<number>(initialUrlState.year ?? 2026);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1x = 1 an/sec

  // Synchronisation dynamique de l'URL lors des modifications
  useEffect(() => {
    syncUrlWithSimulationState(customParams, scenarioB.id, currentYear);
  }, [customParams, scenarioB.id, Math.floor(currentYear)]);

  const handleUpdateCustomParam = (key: string, value: number) => {
    setCustomParams((prev) => {
      const next = { ...prev, [key]: value };
      setScenarioB((prevScen) => ({
        ...prevScen,
        id: 'custom',
        name: 'Scénario Personnalisé (Variables Clés)',
        shortName: 'Personnalisé',
        [key]: value,
      }));
      return next;
    });
  };

  const handleSelectScenarioB = (scen: SimulationScenarioConfig) => {
    setScenarioB(scen);
    setCustomParams({
      oilDemandReductionRate: scen.oilDemandReductionRate ?? 4.0,
      agroEcologyAdoptionRate: scen.agroEcologyAdoptionRate ?? 65,
      adaptationResilienceBoost: scen.adaptationResilienceBoost ?? 1.8,
      climateSensitivityECS: scen.climateSensitivityECS ?? 3.0,
    });
  };

  // Trajectoire A (Scénario de référence, ex: Fil de l'eau BAU)
  const trajectoryA = useMemo(() => generateFullTrajectory(scenarioA), [scenarioA]);

  // Trajectoire B (Scénario comparatif, ex: Sobriété choisie ou Personnalisé)
  const trajectoryB = useMemo(() => generateFullTrajectory(scenarioB), [scenarioB]);

  // Trajectoire active principale pour la carte et les KPI généraux
  const trajectory = trajectoryA;

  // Index courant dans la table trajectoire (supporte 1900 à 2100)
  const currentTrajectoryState = useMemo(() => {
    const yr = Math.floor(currentYear);
    const found = trajectory.find((t) => t.year === yr);
    if (found) return found;
    if (trajectory.length > 0 && yr < trajectory[0].year) return trajectory[0];
    return trajectory[trajectory.length - 1] || trajectory[0];
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
    setCurrentYear(Math.max(1900, Math.min(2100, year)));
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
        {/* Bannière d'accueil lorsqu'une simulation a été ouverte via une URL partagée */}
        {sharedConfigLoaded && (
          <div className="bg-purple-950/70 border border-purple-600/80 rounded-xl p-3.5 flex items-center justify-between gap-3 text-purple-200 text-xs shadow-lg animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping inline-block" />
              <span>
                <strong>Simulation personnalisée chargée via le lien URL :</strong> Trajectoire B configurée avec -{customParams.oilDemandReductionRate}%/an de pétrole, {customParams.agroEcologyAdoptionRate}% d'agroécologie et résilience x{customParams.adaptationResilienceBoost.toFixed(1)} (ECS : {customParams.climateSensitivityECS.toFixed(1)}°C).
              </span>
            </div>
            <button
              onClick={() => setSharedConfigLoaded(false)}
              className="px-2 py-1 rounded bg-purple-900/80 hover:bg-purple-800 text-purple-200 text-[11px] font-medium transition-colors cursor-pointer shrink-0"
            >
              Fermer
            </button>
          </div>
        )}

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

            {/* 3. Module de Comparaison de Trajectoires Biophysiques */}
            <ComparisonModePanel
              isCompareMode={isCompareMode}
              onToggleCompareMode={() => setIsCompareMode((p) => !p)}
              scenarioA={scenarioA}
              scenarioB={scenarioB}
              onSelectScenarioB={handleSelectScenarioB}
              customParams={customParams}
              onUpdateCustomParam={handleUpdateCustomParam}
              trajectoryA={trajectoryA}
              trajectoryB={trajectoryB}
              currentYear={currentYear}
            />

            {/* 4. Graphiques KPI synchronisés sous la mapmonde avec superposition comparative */}
            <KpiCharts
              trajectory={trajectoryA}
              compareTrajectory={isCompareMode ? trajectoryB : null}
              scenarioA={scenarioA}
              scenarioB={scenarioB}
              isCompareMode={isCompareMode}
              currentYear={currentYear}
              onSeekYear={handleSeekYear}
            />

            {/* 4. Fiche détaillée pédagogique : Comprendre comme à 12 ans */}
            <YouthExplainerCard />

            {/* 5. Conclusion finale pour les habitants du futur (2050, 2080, 2100) + Déchiffrage FaIR/Stull Tw + Score de confiance */}
            <FutureConclusionCard />

            {/* 6. Section FAQ Interactive & Lexique des termes techniques (EROI, Haber-Bosch, FaIR, Stull Tw) */}
            <InteractiveFaqSection />

            {/* 7. Pour aller plus loin : L'IA peut-elle nous sauver ? Ou va-t-elle accélérer le changement ? */}
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
