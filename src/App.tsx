import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TopBar, AppTabType } from './components/TopBar';
import { WorldMap } from './components/WorldMap';
import { TimelineController } from './components/TimelineController';
import { KpiCharts } from './components/KpiCharts';
import { ComparisonModePanel } from './components/ComparisonModePanel';
import { ComparativeDashboardView } from './components/ComparativeDashboardView';
import { YouthExplainerCard } from './components/YouthExplainerCard';
import { FutureConclusionCard } from './components/FutureConclusionCard';
import { InteractiveFaqSection } from './components/InteractiveFaqSection';
import { AiFutureDebateCard } from './components/AiFutureDebateCard';
import { CountryInspector } from './components/CountryInspector';
import { CausalChainExplorer } from './components/CausalChainExplorer';
import { SpecModal } from './components/SpecModal';
import { TippingPointsView } from './components/TippingPointsView';
import { PdfExportModal } from './components/PdfExportModal';
import { generateFullTrajectory, SCENARIO_BAU, SCENARIO_SOBRIETY } from './engine/simulationRunner';
import { SimulationScenarioConfig } from './types/simulation';
import { 
  decodeSimulationParamsFromUrl, 
  syncUrlWithSimulationState, 
  CustomSimulationParams 
} from './utils/urlParams';

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTabType>('map');
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);

  // Initialisation à partir des URL Search Params si disponibles
  const initialUrlState = useMemo(() => decodeSimulationParamsFromUrl(), []);
  const [sharedConfigLoaded, setSharedConfigLoaded] = useState<boolean>(initialUrlState.hasCustomUrlParams);

  // Modal d'export du rapport de simulation PDF
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

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
        if (next >= 2200) {
          setIsPlaying(false);
          return 2200;
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
    setCurrentYear((prev) => Math.min(2200, Math.floor(prev) + 1));
  };

  const handleSeekYear = (year: number) => {
    setCurrentYear(Math.max(1900, Math.min(2200, year)));
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans">
      {/* Top Bar selon le Top Bar Contract */}
      <TopBar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onReset={handleReset}
        currentYear={currentYear}
        onOpenPdfExport={() => setIsPdfModalOpen(true)}
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
              onOpenPdfExport={() => setIsPdfModalOpen(true)}
              onNavigateToDashboard={() => {
                setCurrentTab('comparative-dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
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
              onOpenPdfExport={() => setIsPdfModalOpen(true)}
            />

            {/* 4. Fiche détaillée pédagogique : Comprendre comme à 12 ans */}
            <YouthExplainerCard />

            {/* Bannière d'accès direct au Dossier Scientifique des Points de Bascule */}
            <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-indigo-950/40 border border-rose-800/40 hover:border-rose-600/70 transition-all rounded-2xl p-5 sm:p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold font-mono bg-rose-900/60 text-rose-300 border border-rose-700/60 uppercase">
                    Dossier Scientifique Factuel
                  </span>
                  <span className="text-xs text-slate-400">Science 2022 / GIEC AR6</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Quels sont les points de non-retour du climat terrestre ?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Groenland, Antarctique, coraux tropicaux, forêt amazonienne, courant AMOC... 
                  Découvrez l'état des lieux rigoureux appuyé sur les mesures réelles par satellites et les faits démontrés, expliqué sans jargon ni supposition.
                </p>
              </div>

              <button
                onClick={() => {
                  setCurrentTab('tipping-points');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-950/50 cursor-pointer transition-all shrink-0 hover:scale-105"
              >
                <span>Explorer les 9 points de bascule</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>

            {/* 5. Conclusion finale pour les habitants du futur (2050, 2080, 2100) + Déchiffrage FaIR/Stull Tw + Score de confiance */}
            <FutureConclusionCard 
              onOpenPdfExport={() => setIsPdfModalOpen(true)}
            />

            {/* 6. Section FAQ Interactive & Lexique des termes techniques (EROI, Haber-Bosch, FaIR, Stull Tw) */}
            <InteractiveFaqSection />

            {/* 7. Pour aller plus loin : L'IA peut-elle nous sauver ? Ou va-t-elle accélérer le changement ? */}
            <AiFutureDebateCard />
          </div>
        )}

        {currentTab === 'comparative-dashboard' && (
          <ComparativeDashboardView
            scenarioA={scenarioA}
            scenarioB={scenarioB}
            trajectoryA={trajectoryA}
            trajectoryB={trajectoryB}
            currentYear={currentYear}
            onSeekYear={handleSeekYear}
            onOpenPdfExport={() => setIsPdfModalOpen(true)}
            onSelectScenarioB={handleSelectScenarioB}
          />
        )}

        {currentTab === 'tipping-points' && (
          <TippingPointsView
            currentSimulatedYear={currentYear}
            currentSimulatedWarming={currentTrajectoryState?.surfaceTemperatureAnomaly ?? 1.3}
          />
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

      {/* Modal d'export du rapport de simulation PDF */}
      <PdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        scenarioA={scenarioA}
        scenarioB={scenarioB}
        isCompareMode={isCompareMode}
        currentYear={currentYear}
        trajectoryA={trajectoryA}
        trajectoryB={trajectoryB}
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
