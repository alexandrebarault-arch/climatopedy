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
import { ScientificSourcesView } from './components/ScientificSourcesView';
import { MobileDeviceNoticeModal } from './components/MobileDeviceNoticeModal';
import { DesktopInteractiveTour } from './components/DesktopInteractiveTour';
import { ClimatopedyHeader } from './components/ClimatopedyHeader';
import { BookOpen, CheckCircle, FileText, ShieldAlert, Compass, Monitor } from 'lucide-react';
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

  // Modales d'aide, de recommandation d'usage et de tutoriel
  const [isMobileNoticeOpen, setIsMobileNoticeOpen] = useState<boolean>(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);

  // Détection automatique sur mobile ou affichage de bienvenue pour le tutoriel ordinateur
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isMobileScreen = window.innerWidth < 768;
    const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isMobile = isMobileScreen || isMobileUserAgent;

    if (isMobile) {
      try {
        const dismissed = localStorage.getItem('climatopedy_mobile_notice_dismissed') || localStorage.getItem('gaia_mobile_notice_dismissed');
        if (dismissed !== 'true') {
          const timer = setTimeout(() => setIsMobileNoticeOpen(true), 600);
          return () => clearTimeout(timer);
        }
      } catch (e) {
        setIsMobileNoticeOpen(true);
      }
    } else {
      // Pour les utilisateurs d'ordinateurs : lancer le tutoriel dynamique guidé lors de la première visite
      try {
        const tourCompleted = localStorage.getItem('climatopedy_desktop_tour_completed') || localStorage.getItem('gaia_desktop_tour_completed');
        if (tourCompleted !== 'true') {
          const timer = setTimeout(() => setIsTutorialOpen(true), 800);
          return () => clearTimeout(timer);
        }
      } catch (e) {
        // Mode privé ou localStorage bloqué
      }
    }
  }, []);

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
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Bar selon le Top Bar Contract */}
      <TopBar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onReset={handleReset}
        currentYear={currentYear}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onOpenMobileNotice={() => setIsMobileNoticeOpen(true)}
      />

      {/* Contenu principal */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        {/* Bannière d'accueil lorsqu'une simulation a été ouverte via une URL partagée */}
        {sharedConfigLoaded && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5 flex items-center justify-between gap-3 text-purple-900 text-xs shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-ping inline-block" />
              <span>
                <strong>Simulation personnalisée chargée via le lien URL :</strong> Trajectoire B configurée avec -{customParams.oilDemandReductionRate}%/an de pétrole, {customParams.agroEcologyAdoptionRate}% d'agroécologie et résilience x{customParams.adaptationResilienceBoost.toFixed(1)} (ECS : {customParams.climateSensitivityECS.toFixed(1)}°C).
              </span>
            </div>
            <button
              onClick={() => setSharedConfigLoaded(false)}
              className="px-2 py-1 rounded bg-purple-100 hover:bg-purple-200 text-purple-900 text-[11px] font-semibold border border-purple-300 transition-colors cursor-pointer shrink-0"
            >
              Fermer
            </button>
          </div>
        )}

        {currentTab === 'map' && (
          <div className="flex flex-col gap-6">
            {/* 0. En-tête pédagogique : Qu'est-ce que CLIMATOPEDY et son objectif pour tous */}
            <ClimatopedyHeader onOpenTutorial={() => setIsTutorialOpen(true)} />

            {/* 1. Planisphère à plat (Projection plane Plate Carrée) */}
            <WorldMap
              simulationState={currentTrajectoryState}
              selectedCountryId={selectedCountryId}
              onSelectCountry={setSelectedCountryId}
              currentYear={currentYear}
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
            />

            {/* 4. Fiche détaillée pédagogique : Comprendre comme à 12 ans */}
            <YouthExplainerCard />

            {/* Bannière d'accès direct au Dossier Scientifique des Points de Bascule */}
            <div className="bg-gradient-to-r from-rose-50 via-white to-indigo-50/50 border border-rose-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold font-mono bg-rose-50 text-rose-800 border border-rose-200 uppercase">
                    Dossier Scientifique Factuel
                  </span>
                  <span className="text-xs text-slate-500">Science 2022 / GIEC AR6</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Quels sont les points de non-retour du climat terrestre ?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Groenland, Antarctique, coraux tropicaux, forêt amazonienne, courant AMOC... 
                  Découvrez l'état des lieux rigoureux appuyé sur les mesures réelles par satellites et les faits démontrés, expliqué sans jargon ni supposition.
                </p>
              </div>

              <button
                onClick={() => {
                  setCurrentTab('tipping-points');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-all shrink-0 hover:scale-102"
              >
                <span>Explorer les 9 points de bascule</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>

            {/* 5. Conclusion finale pour les habitants du futur (2050, 2080, 2100) + Déchiffrage FaIR/Stull Tw + Score de confiance */}
            <FutureConclusionCard />

            {/* 6. Section FAQ Interactive & Lexique des termes techniques (EROI, Haber-Bosch, FaIR, Stull Tw) */}
            <InteractiveFaqSection />

            {/* 7. Pour aller plus loin : L'IA peut-elle nous sauver ? Ou va-t-elle accélérer le changement ? */}
            <AiFutureDebateCard />

            {/* 8. Vérification du travail & Sources Scientifiques */}
            <div className="rounded-2xl bg-gradient-to-r from-sky-50 via-white to-blue-50/60 border border-sky-200/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold font-mono bg-sky-100 text-sky-800 border border-sky-200 uppercase">
                    Transparence &amp; Rigueur Académique
                  </span>
                  <span className="text-xs text-emerald-700 font-mono flex items-center gap-1 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>100% Liens Vérifiés</span>
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Vérifier le Travail : Sources, Publications &amp; Données Réelles
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Consultez l'ensemble des 20+ publications à comité de lecture (<em>Nature, Science, PNAS</em>), 
                  des rapports officiels d'institutions internationales (<em>GIEC AR6, ONU, FAO</em>) et des relevés d'observatoires satellites (<em>NOAA, Copernicus, NASA</em>) 
                  qui fondent les calculs de CLIMATOPEDY.
                </p>
              </div>

              <button
                onClick={() => {
                  setCurrentTab('sources');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs cursor-pointer transition-all shrink-0 hover:scale-102"
              >
                <BookOpen className="w-4 h-4 text-white" />
                <span>Consulter toutes les sources vérifiées</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
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
            onSelectScenarioB={handleSelectScenarioB}
          />
        )}

        {currentTab === 'tipping-points' && (
          <TippingPointsView
            currentSimulatedYear={currentYear}
            currentSimulatedWarming={currentTrajectoryState?.surfaceTemperatureAnomaly ?? 1.34}
          />
        )}

        {currentTab === 'causal' && (
          <CausalChainExplorer />
        )}

        {currentTab === 'spec' && (
          <SpecModal />
        )}

        {currentTab === 'sources' && (
          <ScientificSourcesView
            onNavigateTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSeekYear={handleSeekYear}
          />
        )}
      </main>

      {/* Tiroir d'inspection granulaire d'un pays */}
      <CountryInspector
        countryId={selectedCountryId}
        onClose={() => setSelectedCountryId(null)}
        simulationState={currentTrajectoryState}
        onSelectCountry={setSelectedCountryId}
      />

      {/* Pop-up de recommandation d'usage pour utilisateurs mobiles */}
      <MobileDeviceNoticeModal
        isOpen={isMobileNoticeOpen}
        onClose={() => setIsMobileNoticeOpen(false)}
        onOpenTutorial={() => {
          setIsMobileNoticeOpen(false);
          setIsTutorialOpen(true);
        }}
      />

      {/* Tutoriel dynamique interactif avec interaction avec les pages pour ordinateur */}
      <DesktopInteractiveTour
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        currentTab={currentTab}
        onNavigateTab={(tab) => {
          setCurrentTab(tab);
        }}
        onSeekYear={handleSeekYear}
      />

      {/* Footer sobre et scientifique avec lien d'accès direct vers les sources */}
      <footer className="border-t border-slate-200 bg-white py-6 px-6 text-xs text-slate-600">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-4">
          {/* Navigation directe du footer pour vérification */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium">
            <button
              onClick={() => {
                setCurrentTab('sources');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-sky-800 hover:text-sky-900 hover:underline flex items-center gap-1.5 cursor-pointer font-semibold transition-colors bg-sky-50 px-3 py-1 rounded-lg border border-sky-200"
              title="Accéder à la liste complète des publications scientifiques pour vérifier le travail"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-600" />
              <span>Vérifier le Travail &amp; Consulter les Sources (20+ Publications)</span>
            </button>

            <button
              onClick={() => setIsTutorialOpen(true)}
              className="text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Ouvrir le tutoriel interactif de navigation pour ordinateur"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tutoriel de Navigation (PC)</span>
            </button>

            <button
              onClick={() => setIsMobileNoticeOpen(true)}
              className="text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Afficher la recommandation d'usage sur grand écran"
            >
              <Monitor className="w-3.5 h-3.5 text-amber-600" />
              <span>Recommandation Grand Écran</span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('spec');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-slate-600 hover:text-slate-900 hover:underline flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Spécifications (ODEs)</span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('tipping-points');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-rose-700 hover:text-rose-800 hover:underline flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>9 Points de Bascule</span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('map');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-slate-600 hover:text-slate-900 hover:underline flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>Planisphère</span>
            </button>
          </div>

          {/* Mentions scientifiques et crédits méthodologiques */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-slate-500 text-center max-w-4xl">
            <span>CLIMATOPEDY · L'Encyclopédie Citoyenne du Climat &amp; de l'Énergie</span>
            <span aria-hidden="true">·</span>
            <span>FaIR v1.3 CMIP6 (Smith et al. 2018)</span>
            <span aria-hidden="true">·</span>
            <span>Thermomètre Mouillé Stull (2011)</span>
            <span aria-hidden="true">·</span>
            <span>Rendements Zhao et al. (PNAS 2017)</span>
            <span aria-hidden="true">·</span>
            <span>Niveau Marin Vermeer &amp; Rahmstorf (2009)</span>
            <span aria-hidden="true">·</span>
            <span>Points de Bascule McKay et al. (Science 2022)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
