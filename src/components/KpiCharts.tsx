import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Info,
  Clock,
  AlertTriangle,
  Layers,
  ChevronRight,
  Activity,
  GitCompare,
  Maximize2,
  Minimize2,
  X,
  SlidersHorizontal,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { GlobalBiophysicalState, SimulationScenarioConfig } from '../types/simulation';
import { TechTooltip } from './TechTooltip';

interface KpiChartsProps {
  trajectory: GlobalBiophysicalState[];
  compareTrajectory?: GlobalBiophysicalState[] | null;
  scenarioA?: SimulationScenarioConfig;
  scenarioB?: SimulationScenarioConfig;
  isCompareMode?: boolean;
  currentYear: number;
  onSeekYear: (year: number) => void;
}

export type TimeRangeType = '1900-2200' | '1900-2100' | '2026-2200' | '2026-2100';

export const KpiCharts: React.FC<KpiChartsProps> = ({
  trajectory,
  compareTrajectory,
  scenarioA,
  scenarioB,
  isCompareMode = false,
  currentYear,
  onSeekYear
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'demo' | 'energy' | 'climate' | 'agri'>('all');
  
  // Gestion fine du survol pour ÉVITER de faire bouger les autres graphiques
  const [hoverYear, setHoverYear] = useState<number | null>(null);
  const [hoveredChartId, setHoveredChartId] = useState<string | null>(null);
  const [isSyncHover, setIsSyncHover] = useState<boolean>(false); // Par défaut: Survol indépendant = les autres graphiques ne bougent JAMAIS

  // Mode Plein Écran par graphique individuel
  type ChartId = 'demo' | 'energy' | 'climate' | 'agri';
  const [expandedChartId, setExpandedChartId] = useState<ChartId | null>(null);

  // Plage temporelle : étendue jusqu'en 2200 selon les faits scientifiques IPCC AR6
  const [timeRange, setTimeRange] = useState<TimeRangeType>('1900-2200');

  // Fermeture du plein écran via la touche Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && expandedChartId) {
        setExpandedChartId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expandedChartId]);

  // Dimensions graphiques SVG de base
  const W = 540;
  const H = 205;
  const PAD = { top: 26, right: 44, bottom: 44, left: 48 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const startYear = (timeRange === '1900-2200' || timeRange === '1900-2100') ? 1900 : 2026;
  const endYear = (timeRange === '1900-2200' || timeRange === '2026-2200') ? 2200 : 2100;

  // Filtrer la trajectoire selon la plage temporelle choisie
  const visibleTrajectory = useMemo(() => {
    return trajectory.filter(pt => pt.year >= startYear && pt.year <= endYear);
  }, [trajectory, startYear, endYear]);

  const visibleCompareTrajectory = useMemo(() => {
    if (!isCompareMode || !compareTrajectory) return [];
    return compareTrajectory.filter(pt => pt.year >= startYear && pt.year <= endYear);
  }, [isCompareMode, compareTrajectory, startYear, endYear]);

  // Helper pour mapper une année vers les coordonnées horizontales X
  const getX = (year: number) => {
    const clampedYear = Math.max(startYear, Math.min(endYear, year));
    return PAD.left + ((clampedYear - startYear) / (endYear - startYear)) * plotW;
  };

  const currentX = getX(currentYear);
  const hoverX = hoverYear !== null ? getX(hoverYear) : null;
  const x2026 = getX(2026);
  const x2100 = getX(2100);

  // Repères d'années sur l'axe des abscisses
  const X_TICKS = useMemo(() => {
    if (timeRange === '1900-2200') {
      return [1900, 1950, 2000, 2026, 2060, 2100, 2150, 2200];
    }
    if (timeRange === '1900-2100') {
      return [1900, 1930, 1960, 1990, 2026, 2050, 2080, 2100];
    }
    if (timeRange === '2026-2200') {
      return [2026, 2050, 2080, 2100, 2130, 2160, 2200];
    }
    return [2026, 2040, 2060, 2080, 2100];
  }, [timeRange]);

  const X_GRID = useMemo(() => {
    if (timeRange === '1900-2200') {
      return [1925, 1950, 1975, 2000, 2026, 2050, 2075, 2100, 2125, 2150, 2175, 2200];
    }
    if (timeRange === '1900-2100') {
      return [1920, 1940, 1960, 1980, 2000, 2026, 2050, 2075, 2100];
    }
    if (timeRange === '2026-2200') {
      return [2040, 2060, 2080, 2100, 2120, 2140, 2160, 2180, 2200];
    }
    return [2030, 2040, 2050, 2060, 2070, 2080, 2090, 2100];
  }, [timeRange]);

  // =========================================================
  // 1. DÉMOGRAPHIE & MORTALITÉS
  // =========================================================
  const popMin = (startYear === 1900) ? 1.0 : 2.0; // Mds
  const popMax = 10.5; // Mds
  const getYPop = (popMillions: number) => {
    const popB = popMillions / 1000;
    return PAD.top + plotH - ((popB - popMin) / (popMax - popMin)) * plotH;
  };

  const pathPop = visibleTrajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYPop(pt.worldPopulation).toFixed(1)}`).join(' ');
  const pathPopB = visibleCompareTrajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYPop(pt.worldPopulation).toFixed(1)}`).join(' ');

  const deathMax = 220; // Millions / an
  const getYDeath = (deathsM: number) => {
    return PAD.top + plotH - (deathsM / deathMax) * plotH;
  };
  const pathDeathThermal = visibleTrajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYDeath(pt.worldDeathsAnnual.thermal).toFixed(1)}`).join(' ');
  const pathDeathThermalB = visibleCompareTrajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYDeath(pt.worldDeathsAnnual.thermal).toFixed(1)}`).join(' ');
  const pathDeathFamine = visibleTrajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYDeath(pt.worldDeathsAnnual.famine).toFixed(1)}`).join(' ');
  const pathDeathTotal = visibleTrajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYDeath(pt.worldDeathsAnnual.total).toFixed(1)}`).join(' ');

  // =========================================================
  // 2. ÉNERGIE & MULTIPLICATEUR EROI
  // =========================================================
  const eroiMax = (startYear === 1900) ? 105 : 35;
  const getYEroi = (eroi: number) => {
    return PAD.top + plotH - (Math.min(eroiMax, eroi) / eroiMax) * plotH;
  };
  const pathEroi = visibleTrajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYEroi(pt.currentEroi).toFixed(1)}`).join(' ');
  const pathEroiB = visibleCompareTrajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYEroi(pt.currentEroi).toFixed(1)}`).join(' ');

  const getYPct = (val0to1: number) => {
    return PAD.top + plotH - val0to1 * plotH;
  };
  const pathNetEnergy = visibleTrajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYPct(pt.netEnergyRatio).toFixed(1)}`).join(' ');
  const pathNetEnergyB = visibleCompareTrajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYPct(pt.netEnergyRatio).toFixed(1)}`).join(' ');
  const pathHaberBosch = visibleTrajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYPct(pt.haberBoschNitrogenFactor).toFixed(1)}`).join(' ');

  // =========================================================
  // 3. CLIMAT & OCÉANS
  // =========================================================
  const co2Min = (startYear === 1900) ? 280 : 350;
  const co2Max = 750;
  const getYCo2 = (co2: number) => {
    return PAD.top + plotH - ((co2 - co2Min) / (co2Max - co2Min)) * plotH;
  };
  const pathCo2 = visibleTrajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYCo2(pt.atmosphericCo2Ppm).toFixed(1)}`).join(' ');

  const tempMin = (startYear === 1900) ? -0.3 : 1.0;
  const tempMax = 5.0;
  const getYTemp = (temp: number) => {
    return PAD.top + plotH - ((temp - tempMin) / (tempMax - tempMin)) * plotH;
  };
  const pathTemp = visibleTrajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYTemp(pt.surfaceTemperatureAnomaly).toFixed(1)}`).join(' ');
  const pathTempB = visibleCompareTrajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYTemp(pt.surfaceTemperatureAnomaly).toFixed(1)}`).join(' ');

  // Échelle Océan en mètres : FOX-KEMPER ET AL. 2021 (GIEC AR6 Ch 9)
  // En 2200, sous scénario fossile haut, SLR atteint +2.6 à +3.0 mètres
  const slrMin = -0.15; // -15 cm
  const slrMax = endYear === 2200 ? 3.2 : 0.95; // jusqu'à +320 cm en 2200
  const getYSlr = (slr: number) => {
    return PAD.top + plotH - ((slr - slrMin) / (slrMax - slrMin)) * plotH;
  };
  const pathSlr = visibleTrajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYSlr(pt.seaLevelRiseMeters).toFixed(1)}`).join(' ');
  const pathSlrB = visibleCompareTrajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYSlr(pt.seaLevelRiseMeters).toFixed(1)}`).join(' ');

  // =========================================================
  // 4. AGRONOMIE & CALORIES
  // =========================================================
  const calMin = 1200;
  const calMax = 3500;
  const getYCal = (cal: number) => {
    return PAD.top + plotH - ((cal - calMin) / (calMax - calMin)) * plotH;
  };
  const pathCal = visibleTrajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYCal(pt.globalAverageCaloriesPerCapita).toFixed(1)}`).join(' ');
  const pathCalB = visibleCompareTrajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYCal(pt.globalAverageCaloriesPerCapita).toFixed(1)}`).join(' ');
  const yCalorie2100 = getYCal(2100);

  const yieldMin = 0.1;
  const yieldMax = 1.2;
  const getYYield = (yVal: number) => {
    return PAD.top + plotH - ((yVal - yieldMin) / (yieldMax - yieldMin)) * plotH;
  };
  const pathCropYield = visibleTrajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYYield(pt.globalCropYieldComposite).toFixed(1)}`).join(' ');
  const pathCropYieldB = visibleCompareTrajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYYield(pt.globalCropYieldComposite).toFixed(1)}`).join(' ');

  // Interaction Clic & Survol isolée par graphique
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, (clickX - PAD.left) / plotW));
    const targetYear = Math.round(startYear + ratio * (endYear - startYear));
    onSeekYear(targetYear);
  };

  const handleSvgHover = (e: React.MouseEvent<SVGSVGElement>, chartId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, (clickX - PAD.left) / plotW));
    const targetYear = Math.round(startYear + ratio * (endYear - startYear));
    setHoverYear(targetYear);
    setHoveredChartId(chartId);
  };

  const handleSvgLeave = (chartId: string) => {
    if (hoveredChartId === chartId) {
      setHoverYear(null);
      setHoveredChartId(null);
    }
  };

  // État courant de la simulation (stable, ne saute JAMAIS)
  const currentSimYear = Math.floor(currentYear);
  const currentSimState = trajectory.find(t => t.year === currentSimYear) || trajectory[0];
  const currentSimStateB = (isCompareMode && compareTrajectory)
    ? (compareTrajectory.find(t => t.year === currentSimYear) || compareTrajectory[0])
    : null;

  // Calcul d'état affiché pour un graphique spécifique
  const getChartDisplayData = (chartId: string) => {
    // Si la synchronisation est activée OU si ce graphique est celui directement survolé
    const isThisChartHovered = hoveredChartId === chartId;
    const isShowingHover = (isSyncHover || isThisChartHovered) && hoverYear !== null;

    const displayYear = isShowingHover ? hoverYear! : currentSimYear;
    const stateA = trajectory.find(t => t.year === displayYear) || currentSimState;
    const stateB = (isCompareMode && compareTrajectory)
      ? (compareTrajectory.find(t => t.year === displayYear) || currentSimStateB)
      : null;

    const thermalDeathsFormatted = stateA.worldDeathsAnnual.thermal >= 1
      ? `${stateA.worldDeathsAnnual.thermal.toFixed(2)} M/an`
      : `${Math.round(stateA.worldDeathsAnnual.thermal * 1000).toLocaleString('fr-FR')} décès/an`;

    const thermalDeathsFormattedB = stateB
      ? (stateB.worldDeathsAnnual.thermal >= 1
          ? `${stateB.worldDeathsAnnual.thermal.toFixed(2)} M/an`
          : `${Math.round(stateB.worldDeathsAnnual.thermal * 1000).toLocaleString('fr-FR')} décès/an`)
      : '';

    const seaLevelCm = Math.round(stateA.seaLevelRiseMeters * 100);
    const seaLevelVs2026 = Math.round((stateA.seaLevelRiseMeters - 0.12) * 100);
    const seaLevelCmB = stateB ? Math.round(stateB.seaLevelRiseMeters * 100) : 0;

    return {
      displayYear,
      isShowingHover,
      isThisChartHovered,
      stateA,
      stateB,
      thermalDeathsFormatted,
      thermalDeathsFormattedB,
      seaLevelCm,
      seaLevelVs2026,
      seaLevelCmB
    };
  };

  // Rendu de l'axe des abscisses et des repères temporels
  // Note: La ligne de survol orange n'apparaît QUE sur le graphique survolé (ou sur tous si isSyncHover est activé)
  const renderAbscisseAxis = (chartId: string) => {
    const showHoverOnThisChart = (isSyncHover || hoveredChartId === chartId) && hoverX !== null && hoverYear !== null;

    return (
      <g className="select-none pointer-events-none">
        {/* Zone historique ombrée si timeRange commence en 1900 */}
        {startYear === 1900 && x2026 > PAD.left && (
          <g>
            <rect
              x={PAD.left}
              y={PAD.top}
              width={x2026 - PAD.left}
              height={plotH}
              fill="#0284c7"
              opacity="0.06"
            />
            <line
              x1={x2026}
              y1={PAD.top}
              x2={x2026}
              y2={PAD.top + plotH}
              stroke="#0284c7"
              strokeWidth="1.2"
              strokeDasharray="3,3"
              opacity="0.8"
            />
            <text
              x={PAD.left + 6}
              y={PAD.top + 10}
              fill="#0369a1"
              fontSize="6.8"
              fontWeight="bold"
              fontFamily="sans-serif"
              opacity="0.9"
            >
              ← Historique mesuré (1900–2026)
            </text>
            <text
              x={x2026 + 6}
              y={PAD.top + 10}
              fill="#64748b"
              fontSize="6.8"
              fontWeight="bold"
              fontFamily="sans-serif"
              opacity="0.9"
            >
              Modélisation prospective →
            </text>
          </g>
        )}

        {/* Ligne repère 2100 si la projection va jusqu'en 2200 */}
        {endYear === 2200 && x2100 > PAD.left && x2100 < W - PAD.right && (
          <g>
            <line
              x1={x2100}
              y1={PAD.top}
              x2={x2100}
              y2={PAD.top + plotH}
              stroke="#9333ea"
              strokeWidth="1.2"
              strokeDasharray="3,3"
              opacity="0.8"
            />
            <text
              x={x2100 + 4}
              y={PAD.top + 10}
              fill="#7e22ce"
              fontSize="6.8"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Horizon 2100–2200 →
            </text>
          </g>
        )}

        {/* Lignes verticales de grille temporelle */}
        {X_GRID.map((yr) => {
          const x = getX(yr);
          if (x <= PAD.left || x >= W - PAD.right) return null;
          return (
            <line
              key={`grid-${yr}`}
              x1={x}
              y1={PAD.top}
              x2={x}
              y2={PAD.top + plotH}
              stroke="#e2e8f0"
              strokeWidth="0.8"
              strokeDasharray="2,3"
            />
          );
        })}

        {/* Ligne d'axe horizontal inférieur */}
        <line
          x1={PAD.left}
          y1={PAD.top + plotH}
          x2={W - PAD.right}
          y2={PAD.top + plotH}
          stroke="#94a3b8"
          strokeWidth="1"
        />

        {/* Graduations chiffrées de l'axe X */}
        {X_TICKS.map((yr) => {
          const x = getX(yr);
          const isToday = yr === 2026;
          const isPast = yr < 2026;
          const isCentury = yr === 2100 || yr === 2200;
          return (
            <g key={`tick-${yr}`}>
              <line
                x1={x}
                y1={PAD.top + plotH}
                x2={x}
                y2={PAD.top + plotH + 4}
                stroke={isToday ? '#0284c7' : isCentury ? '#7e22ce' : isPast ? '#2563eb' : '#94a3b8'}
                strokeWidth={isToday || isCentury ? '1.8' : '1'}
              />
              <text
                x={x}
                y={PAD.top + plotH + 14}
                textAnchor={yr === startYear ? 'start' : yr === endYear ? 'end' : 'middle'}
                fill={isToday ? '#0284c7' : isCentury ? '#7e22ce' : isPast ? '#1d4ed8' : '#64748b'}
                fontSize={isToday || isCentury ? '8.5' : '7.5'}
                fontWeight={isToday || isCentury ? '800' : '600'}
                fontFamily="monospace"
              >
                {isToday ? '2026 (Auj.)' : yr}
              </text>
            </g>
          );
        })}

        {/* Libellé de l'axe X */}
        <text
          x={PAD.left + plotW / 2}
          y={PAD.top + plotH + 28}
          textAnchor="middle"
          fill="#64748b"
          fontSize="7.5"
          fontWeight="600"
          fontFamily="sans-serif"
          letterSpacing="0.04em"
        >
          Axe temporel (X) : {startYear} → {endYear} ({endYear - startYear} ans de modélisation biophysique)
        </text>

        {/* Curseur de l'année active de la simulation */}
        <line
          x1={currentX}
          y1={PAD.top - 6}
          x2={currentX}
          y2={PAD.top + plotH + 4}
          stroke="#0284c7"
          strokeWidth="1.5"
          strokeDasharray="3,2"
        />
        <rect
          x={Math.max(PAD.left - 2, Math.min(W - PAD.right - 36, currentX - 18))}
          y={PAD.top - 18}
          width="36"
          height="13"
          rx="3"
          fill="#0284c7"
        />
        <text
          x={Math.max(PAD.left + 16, Math.min(W - PAD.right - 18, currentX))}
          y={PAD.top - 9}
          textAnchor="middle"
          fill="#ffffff"
          fontSize="8"
          fontWeight="800"
          fontFamily="monospace"
        >
          {currentSimYear}
        </text>

        {/* Curseur de survol isolé (visible UNIQUEMENT sur le graphique survolé) */}
        {showHoverOnThisChart && hoverYear !== currentSimYear && (
          <g>
            <line
              x1={hoverX!}
              y1={PAD.top - 6}
              x2={hoverX!}
              y2={PAD.top + plotH + 4}
              stroke="#d97706"
              strokeWidth="1.2"
              strokeDasharray="2,2"
            />
            <rect
              x={Math.max(PAD.left - 2, Math.min(W - PAD.right - 36, hoverX! - 18))}
              y={PAD.top - 18}
              width="36"
              height="13"
              rx="3"
              fill="#d97706"
            />
            <text
              x={Math.max(PAD.left + 16, Math.min(W - PAD.right - 18, hoverX!))}
              y={PAD.top - 9}
              textAnchor="middle"
              fill="#ffffff"
              fontSize="8"
              fontWeight="800"
              fontFamily="monospace"
            >
              {hoverYear}
            </text>
          </g>
        )}
      </g>
    );
  };

  // Données prêtes pour chaque graphique
  const d1 = getChartDisplayData('demo');
  const d2 = getChartDisplayData('energy');
  const d3 = getChartDisplayData('climate');
  const d4 = getChartDisplayData('agri');

  const getChartTitle = (id: ChartId) => {
    switch (id) {
      case 'demo':
        return '1. Population Mondiale & Nombre de Décès par An';
      case 'energy':
        return "2. Énergie & Pétrole : Multiplicateur d'Énergie et Part Utile";
      case 'climate':
        return '3. Réchauffement Mondial, Gaz à Effet de Serre & Montée des Océans';
      case 'agri':
        return '4. Disponibilité Alimentaire Mondiale & Rendements des Terres';
    }
  };

  // Rendu du contenu des graphiques (standard en grille ou étiré en plein écran)
  const renderChartsGrid = (expandedId: ChartId | null = null) => {
    const isExpanded = expandedId !== null;
    return (
      <div className={isExpanded ? 'w-full' : 'grid grid-cols-1 lg:grid-cols-2 gap-4'}>
        {/* ========================================================================= */}
        {/* GRAPHIQUE 1 : DÉMOGRAPHIE & TOUTES LES CAUSES DE DÉCÈS */}
        {/* ========================================================================= */}
        {(!isExpanded ? (activeTab === 'all' || activeTab === 'demo') : expandedId === 'demo') && (
          <div className={isExpanded ? 'bg-white border border-slate-300 rounded-2xl p-5 sm:p-7 shadow-sm w-full flex flex-col gap-3' : 'bg-slate-50/60 border border-slate-200/90 rounded-xl p-3.5 flex flex-col gap-2 shadow-2xs'}>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`${isExpanded ? 'text-sm sm:text-base' : 'text-xs'} font-bold text-slate-900`}>
                    1. Population Mondiale &amp; Nombre de Décès par An
                  </span>
                  {isExpanded && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-sky-100 text-sky-800 border border-sky-200 font-semibold">
                      Démographie
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10.5px] font-mono text-slate-600 font-semibold flex items-center gap-1.5">
                    {d1.isShowingHover ? (
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold">
                        🔍 Survol : {d1.displayYear}
                      </span>
                    ) : (
                      <span>Année {d1.displayYear}</span>
                    )}
                  </span>
                  {!isExpanded ? (
                    <button
                      onClick={() => setExpandedChartId('demo')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 hover:border-sky-300 transition-colors shadow-2xs cursor-pointer shrink-0"
                      title="Agrandir ce graphique en plein écran"
                      aria-label="Plein écran pour le graphique Démographie"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-sky-600" />
                      <span className="hidden sm:inline">Plein écran</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setExpandedChartId(null)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 hover:border-rose-300 transition-colors shadow-2xs cursor-pointer shrink-0"
                      title="Fermer le plein écran"
                      aria-label="Fermer le plein écran"
                    >
                      <X className="w-4 h-4 text-rose-600" />
                      <span>Fermer</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Indicateurs numériques précis avec tabular-nums pour zéros tremblements */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] font-mono mt-0.5 tabular-nums">
                <span className="text-slate-900 font-semibold flex items-center gap-1 min-w-[7rem]">
                  <span className="w-2 h-2 rounded-full bg-slate-900 inline-block shrink-0" />
                  Pop : {(d1.stateA.worldPopulation / 1000).toFixed(2)} Mds
                </span>
                <span className="text-purple-800 font-semibold flex items-center gap-1 min-w-[8.5rem]">
                  <span className="w-2 h-2 rounded-full bg-purple-600 inline-block shrink-0" />
                  Total Décès : {d1.stateA.worldDeathsAnnual.total.toFixed(1)} M/an
                </span>
                <span className="text-amber-800 font-semibold flex items-center gap-1 min-w-[7.5rem]">
                  <span className="w-2 h-2 rounded-full bg-amber-600 inline-block shrink-0" />
                  Déficit calorique — décès simulés : {d1.stateA.worldDeathsAnnual.famine.toFixed(1)} M/an
                </span>
                {/* Décès Canicule */}
                <span className="text-rose-800 font-bold bg-rose-100/80 border border-rose-300 px-1.5 py-0.5 rounded flex items-center gap-1 min-w-[9.5rem]">
                  <span className="w-2 h-2 rounded-full bg-rose-600 inline-block animate-pulse shrink-0" />
                  Décès chaleur simulés : {d1.thermalDeathsFormatted}
                  <TechTooltip term="stull" showIconOnly />
                </span>
              </div>

              {/* Ligne comparative Trajectoire B si activée */}
              {isCompareMode && d1.stateB && (
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200 text-[10px] font-mono text-emerald-800 tabular-nums">
                  <span className="font-bold flex items-center gap-1 text-emerald-700">
                    <GitCompare className="w-3 h-3 text-emerald-700" />
                    {scenarioB?.shortName ?? 'Trajectoire B (Sobriété)'} :
                  </span>
                  <span className="bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-semibold text-emerald-900">
                    Pop : {(d1.stateB.worldPopulation / 1000).toFixed(2)} Mds
                  </span>
                  <span className="bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-semibold text-emerald-900">
                    Canicules : {d1.thermalDeathsFormattedB}
                  </span>
                  <span className="bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-semibold text-emerald-900">
                    Déficit calorique — décès simulés : {d1.stateB.worldDeathsAnnual.famine.toFixed(1)} M/an
                  </span>
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-600 leading-tight">
              Nombre d'êtres humains sur Terre (axe gauche en Mds) comparé au rythme des décès annuels (axe droit en Millions/an).
            </p>

            {/* SVG Graphique 1 */}
            <div className={`relative w-full ${isExpanded ? 'aspect-[540/220] sm:aspect-[540/210] max-h-[62vh]' : 'aspect-[540/205]'} bg-white rounded-lg border border-slate-200 overflow-hidden cursor-crosshair shadow-inner`}>
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="w-full h-full"
                onClick={handleSvgClick}
                onMouseMove={(e) => handleSvgHover(e, 'demo')}
                onMouseLeave={() => handleSvgLeave('demo')}
              >
                {/* Axe vertical gauche : Population (Mds) */}
                <text x={PAD.left - 6} y={PAD.top + 4} fill="#0f172a" fontSize="8" textAnchor="end" fontFamily="monospace">10 Mds</text>
                <text x={PAD.left - 6} y={PAD.top + plotH / 2 + 3} fill="#0f172a" fontSize="8" textAnchor="end" fontFamily="monospace">6.5</text>
                <text x={PAD.left - 6} y={PAD.top + plotH} fill="#0f172a" fontSize="8" textAnchor="end" fontFamily="monospace">{popMin} Mds</text>

                {/* Axe vertical droit : Décès annuels (M/an) */}
                <text x={W - PAD.right + 6} y={PAD.top + 4} fill="#7e22ce" fontSize="8" textAnchor="start" fontFamily="monospace">220M/an</text>
                <text x={W - PAD.right + 6} y={PAD.top + plotH} fill="#7e22ce" fontSize="8" textAnchor="start" fontFamily="monospace">0M</text>

                {/* Lignes horizontales discrètes */}
                <line x1={PAD.left} y1={PAD.top} x2={W - PAD.right} y2={PAD.top} stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="3,3" />
                <line x1={PAD.left} y1={PAD.top + plotH / 2} x2={W - PAD.right} y2={PAD.top + plotH / 2} stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="3,3" />

                {/* Axe des abscisses et grilles temporelles */}
                {renderAbscisseAxis('demo')}

                {/* Courbe 1 : Population Mondiale (Noir/Anthracite épais) */}
                <path d={pathPop} fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />

                {/* Courbe 2 : Total Décès Annuels (Violette) */}
                <path d={pathDeathTotal} fill="none" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" />

                {/* Courbe 3 : Décès dus aux Famines (Orange) */}
                <path d={pathDeathFamine} fill="none" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" />

                {/* Courbe 4 : Décès par Canicules mortelles (Rouge fluo bien visible) */}
                <path d={pathDeathThermal} fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />

                {/* COURBES DE COMPARAISON TRAJECTOIRE B */}
                {isCompareMode && visibleCompareTrajectory.length > 0 && (
                  <g className="compare-layer">
                    <path d={pathPopB} fill="none" stroke="#059669" strokeWidth="2.2" strokeDasharray="5 3" strokeLinecap="round" />
                    <path d={pathDeathThermalB} fill="none" stroke="#e11d48" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
                  </g>
                )}

                {/* Mini-légende de comparaison intégrée */}
                {isCompareMode && (
                  <g className="select-none pointer-events-none">
                    <rect x={W - PAD.right - 136} y={PAD.top + 2} width="134" height="23" rx="3" fill="#ffffff" fillOpacity="0.9" stroke="#cbd5e1" strokeWidth="0.8" />
                    <line x1={W - PAD.right - 130} y1={PAD.top + 8} x2={W - PAD.right - 114} y2={PAD.top + 8} stroke="#0f172a" strokeWidth="2" />
                    <text x={W - PAD.right - 110} y={PAD.top + 10} fill="#1e293b" fontSize="6.8" fontFamily="sans-serif">A: {scenarioA?.shortName ?? 'Actuel'}</text>
                    <line x1={W - PAD.right - 130} y1={PAD.top + 17} x2={W - PAD.right - 114} y2={PAD.top + 17} stroke="#059669" strokeWidth="2" strokeDasharray="4 2" />
                    <text x={W - PAD.right - 110} y={PAD.top + 19} fill="#059669" fontSize="6.8" fontFamily="sans-serif">B: {scenarioB?.shortName ?? 'Sobriété'}</text>
                  </g>
                )}

                {/* Marqueur interactif sur la courbe des canicules */}
                <g>
                  <circle
                    cx={currentX}
                    cy={getYDeath(currentSimState.worldDeathsAnnual.thermal)}
                    r="4"
                    fill="#dc2626"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <rect
                    x={Math.max(PAD.left, Math.min(W - PAD.right - 54, currentX + 6))}
                    y={Math.max(PAD.top, getYDeath(currentSimState.worldDeathsAnnual.thermal) - 16)}
                    width="50"
                    height="12"
                    rx="3"
                    fill="#b91c1c"
                  />
                  <text
                    x={Math.max(PAD.left + 25, Math.min(W - PAD.right - 29, currentX + 31))}
                    y={Math.max(PAD.top + 8.5, getYDeath(currentSimState.worldDeathsAnnual.thermal) - 7.5)}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="7.5"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    🔴 {currentSimState.worldDeathsAnnual.thermal >= 1 ? currentSimState.worldDeathsAnnual.thermal.toFixed(1) + 'M' : Math.round(currentSimState.worldDeathsAnnual.thermal * 1000) + 'k'}
                  </text>
                </g>

                {/* Marqueur sur la population */}
                <circle
                  cx={currentX}
                  cy={getYPop(currentSimState.worldPopulation)}
                  r="4"
                  fill="#0284c7"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />

                {/* Marqueur sur la population B si comparaison */}
                {isCompareMode && currentSimStateB && (
                  <circle
                    cx={currentX}
                    cy={getYPop(currentSimStateB.worldPopulation)}
                    r="3.5"
                    fill="#059669"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                  />
                )}
              </svg>
            </div>

            {/* Légende détaillée sous le graphique */}
            <div className="flex flex-col gap-1 text-[10.5px] text-slate-700 pt-1 border-t border-slate-200">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>⚫ <strong>Ligne noire :</strong> Population mondiale ({(d1.stateA.worldPopulation / 1000).toFixed(2)} Mds)</span>
                <span>🟣 <strong>Ligne violette :</strong> Tous décès confondus ({d1.stateA.worldDeathsAnnual.total.toFixed(1)} M/an)</span>
                <span>🟠 <strong>Ligne orange :</strong> Décès simulés associés au déficit calorique ({d1.stateA.worldDeathsAnnual.famine.toFixed(1)} M/an)</span>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded p-1.5 text-rose-900 text-[10px]">
                🔴 <strong>Ligne rouge (Canicules mortelles) :</strong> {d1.thermalDeathsFormatted} en {d1.displayYear}. 
                Valeur calculée par le simulateur CLIMATOPEDY à partir de ses paramètres; elle ne constitue pas une estimation validée des décès attribuables à la chaleur.
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* GRAPHIQUE 2 : ÉNERGIE & PÉTROLE */}
        {/* ========================================================================= */}
        {(!isExpanded ? (activeTab === 'all' || activeTab === 'energy') : expandedId === 'energy') && (
          <div className={isExpanded ? 'bg-white border border-slate-300 rounded-2xl p-5 sm:p-7 shadow-sm w-full flex flex-col gap-3' : 'bg-slate-50/60 border border-slate-200/90 rounded-xl p-3.5 flex flex-col gap-2 shadow-2xs'}>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`${isExpanded ? 'text-sm sm:text-base' : 'text-xs'} font-bold text-slate-900`}>
                    2. Énergie &amp; Pétrole : Multiplicateur d'Énergie et Part Utile
                  </span>
                  {isExpanded && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-sky-100 text-sky-800 border border-sky-200 font-semibold">
                      Énergie
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10.5px] font-mono text-slate-600 font-semibold flex items-center gap-1.5">
                    {d2.isShowingHover ? (
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold">
                        🔍 Survol : {d2.displayYear}
                      </span>
                    ) : (
                      <span>Année {d2.displayYear}</span>
                    )}
                  </span>
                  {!isExpanded ? (
                    <button
                      onClick={() => setExpandedChartId('energy')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 hover:border-sky-300 transition-colors shadow-2xs cursor-pointer shrink-0"
                      title="Agrandir ce graphique en plein écran"
                      aria-label="Plein écran pour le graphique Énergie"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-sky-600" />
                      <span className="hidden sm:inline">Plein écran</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setExpandedChartId(null)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 hover:border-rose-300 transition-colors shadow-2xs cursor-pointer shrink-0"
                      title="Fermer le plein écran"
                      aria-label="Fermer le plein écran"
                    >
                      <X className="w-4 h-4 text-rose-600" />
                      <span>Fermer</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Indicateurs numériques avec tabular-nums */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] font-mono mt-0.5 tabular-nums">
                <span className="text-amber-800 font-bold bg-amber-50 border border-amber-300 px-1.5 py-0.5 rounded flex items-center gap-1 min-w-[12rem]" title="Rendement de l'énergie (barils obtenus pour 1 baril dépensé)">
                  Rendement pétrole : x{d2.stateA.currentEroi >= 20 ? Math.round(d2.stateA.currentEroi) : d2.stateA.currentEroi.toFixed(1)} ({d2.stateA.currentEroi >= 20 ? Math.round(d2.stateA.currentEroi) : d2.stateA.currentEroi.toFixed(1)} barils pour 1 dépensé)
                  <TechTooltip term="eroi" showIconOnly />
                </span>
                <span className="text-emerald-700 font-semibold min-w-[8.5rem]">
                  Énergie utile : {(d2.stateA.netEnergyRatio * 100).toFixed(0)}%
                </span>
                <span className="text-sky-700 flex items-center gap-1 min-w-[9.5rem]">
                  Engrais synthèse : {(d2.stateA.haberBoschNitrogenFactor * 100).toFixed(0)}%
                  <TechTooltip term="haber-bosch" showIconOnly />
                </span>
              </div>

              {/* Ligne comparative Trajectoire B si activée */}
              {isCompareMode && d2.stateB && (
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200 text-[10px] font-mono text-emerald-800 tabular-nums">
                  <span className="font-bold flex items-center gap-1 text-emerald-700">
                    <GitCompare className="w-3 h-3 text-emerald-700" />
                    {scenarioB?.shortName ?? 'Trajectoire B (Sobriété)'} :
                  </span>
                  <span className="bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-semibold text-emerald-900">
                    Rendement : x{d2.stateB.currentEroi >= 20 ? Math.round(d2.stateB.currentEroi) : d2.stateB.currentEroi.toFixed(1)}
                  </span>
                  <span className="bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-semibold text-emerald-900">
                    Énergie utile : {(d2.stateB.netEnergyRatio * 100).toFixed(0)}%
                  </span>
                  <span className="bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-semibold text-emerald-900">
                    Engrais : {(d2.stateB.haberBoschNitrogenFactor * 100).toFixed(0)}%
                  </span>
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-600 leading-tight">
              Pour 1 baril consommé à forer et raffiner, combien de barils d'énergie récolte-t-on ? (En 1900 : x100. En 2026 : x12. En dessous de x5, la société n'a plus assez d'énergie nette).
            </p>

            {/* SVG Graphique 2 */}
            <div className={`relative w-full ${isExpanded ? 'aspect-[540/220] sm:aspect-[540/210] max-h-[62vh]' : 'aspect-[540/205]'} bg-white rounded-lg border border-slate-200 overflow-hidden cursor-crosshair shadow-inner`}>
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="w-full h-full"
                onClick={handleSvgClick}
                onMouseMove={(e) => handleSvgHover(e, 'energy')}
                onMouseLeave={() => handleSvgLeave('energy')}
              >
                {/* Axe vertical gauche : Multiplicateur EROI */}
                <text x={PAD.left - 6} y={PAD.top + 4} fill="#d97706" fontSize="8" textAnchor="end" fontFamily="monospace">x{eroiMax}</text>
                <text x={PAD.left - 6} y={getYEroi(20) + 3} fill="#d97706" fontSize="8" textAnchor="end" fontFamily="monospace">x20</text>
                <text x={PAD.left - 6} y={getYEroi(10) + 3} fill="#d97706" fontSize="8" textAnchor="end" fontFamily="monospace">x10</text>
                <text x={PAD.left - 6} y={PAD.top + plotH} fill="#d97706" fontSize="8" textAnchor="end" fontFamily="monospace">x1</text>

                {/* Axe vertical droit : Pourcentage (0 à 100%) */}
                <text x={W - PAD.right + 6} y={PAD.top + 4} fill="#059669" fontSize="8" textAnchor="start" fontFamily="monospace">100%</text>
                <text x={W - PAD.right + 6} y={PAD.top + plotH / 2 + 3} fill="#059669" fontSize="8" textAnchor="start" fontFamily="monospace">50%</text>
                <text x={W - PAD.right + 6} y={PAD.top + plotH} fill="#059669" fontSize="8" textAnchor="start" fontFamily="monospace">0%</text>

                {/* Ligne de seuil d'alerte : x10 */}
                <line
                  x1={PAD.left}
                  y1={getYEroi(10)}
                  x2={W - PAD.right}
                  y2={getYEroi(10)}
                  stroke="#dc2626"
                  strokeWidth="1"
                  strokeDasharray="4,3"
                  opacity="0.8"
                />
                <text
                  x={W - PAD.right - 4}
                  y={getYEroi(10) - 3}
                  textAnchor="end"
                  fill="#dc2626"
                  fontSize="7"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                >
                  Seuil critique société moderne : moins de 10 barils obtenus pour 1 dépensé (x10)
                </text>

                {/* Axe des abscisses */}
                {renderAbscisseAxis('energy')}

                {/* Courbe 1 : Multiplicateur EROI (Ambre soutenu) */}
                <path d={pathEroi} fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />

                {/* Courbe 2 : Énergie nette civile restante (Verte) */}
                <path d={pathNetEnergy} fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" />

                {/* Courbe 3 : Engrais de synthèse Haber-Bosch */}
                <path d={pathHaberBosch} fill="none" stroke="#0284c7" strokeWidth="1.8" strokeDasharray="4,3" strokeLinecap="round" />

                {/* COURBES DE COMPARAISON TRAJECTOIRE B */}
                {isCompareMode && visibleCompareTrajectory.length > 0 && (
                  <g className="compare-layer">
                    <path d={pathEroiB} fill="none" stroke="#10b981" strokeWidth="2.2" strokeDasharray="5 3" strokeLinecap="round" />
                    <path d={pathNetEnergyB} fill="none" stroke="#34d399" strokeWidth="1.8" strokeDasharray="3 3" strokeLinecap="round" />
                  </g>
                )}

                {/* Mini-légende de comparaison intégrée */}
                {isCompareMode && (
                  <g className="select-none pointer-events-none">
                    <rect x={W - PAD.right - 136} y={PAD.top + 2} width="134" height="23" rx="3" fill="#ffffff" fillOpacity="0.9" stroke="#cbd5e1" strokeWidth="0.8" />
                    <line x1={W - PAD.right - 130} y1={PAD.top + 8} x2={W - PAD.right - 114} y2={PAD.top + 8} stroke="#d97706" strokeWidth="2" />
                    <text x={W - PAD.right - 110} y={PAD.top + 10} fill="#1e293b" fontSize="6.8" fontFamily="sans-serif">A: {scenarioA?.shortName ?? 'Actuel'}</text>
                    <line x1={W - PAD.right - 130} y1={PAD.top + 17} x2={W - PAD.right - 114} y2={PAD.top + 17} stroke="#059669" strokeWidth="2" strokeDasharray="4 2" />
                    <text x={W - PAD.right - 110} y={PAD.top + 19} fill="#059669" fontSize="6.8" fontFamily="sans-serif">B: {scenarioB?.shortName ?? 'Sobriété'}</text>
                  </g>
                )}

                {/* Marqueur interactif sur le multiplicateur pétrolier */}
                <circle
                  cx={currentX}
                  cy={getYEroi(currentSimState.currentEroi)}
                  r="4"
                  fill="#d97706"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />

                {/* Marqueur sur l'EROI B si comparaison */}
                {isCompareMode && currentSimStateB && (
                  <circle
                    cx={currentX}
                    cy={getYEroi(currentSimStateB.currentEroi)}
                    r="3.5"
                    fill="#059669"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                  />
                )}
                <rect
                  x={Math.max(PAD.left, Math.min(W - PAD.right - 42, currentX - 21))}
                  y={getYEroi(currentSimState.currentEroi) - 16}
                  width="42"
                  height="12"
                  rx="3"
                  fill="#92400e"
                />
                <text
                  x={Math.max(PAD.left + 21, Math.min(W - PAD.right - 21, currentX))}
                  y={getYEroi(currentSimState.currentEroi) - 7.5}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="7.5"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  x{currentSimState.currentEroi >= 20 ? Math.round(currentSimState.currentEroi) : currentSimState.currentEroi.toFixed(1)}
                </text>
              </svg>
            </div>

            {/* Légende explicative */}
            <div className="flex flex-col gap-1 text-[10.5px] text-slate-700 pt-1 border-t border-slate-200">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>🟡 <strong>Ligne jaune :</strong> Multiplicateur pétrole (x{d2.stateA.currentEroi >= 20 ? Math.round(d2.stateA.currentEroi) : d2.stateA.currentEroi.toFixed(1)} barils extraits pour 1 baril consommé)</span>
                <span>🟢 <strong>Ligne verte :</strong> Énergie utile disponible pour la société ({(d2.stateA.netEnergyRatio * 100).toFixed(0)}%)</span>
                <span>🔵 <strong>Pointillé bleu :</strong> Engrais chimiques Haber-Bosch ({(d2.stateA.haberBoschNitrogenFactor * 100).toFixed(0)}%)</span>
              </div>
              <p className="text-[10px] text-amber-950 bg-amber-50 p-1.5 rounded border border-amber-200">
                💡 <strong>À propos de l’indicateur :</strong> L’EROI varie selon la ressource, la période et le périmètre de calcul. Les valeurs tracées ici sont calculées par le modèle CLIMATOPEDY et ne sont pas une série historique d’observations.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* GRAPHIQUE 3 : CLIMAT & OCÉANS (Montée de la mer chiffrée jusqu'en 2200) */}
        {/* ========================================================================= */}
        {(!isExpanded ? (activeTab === 'all' || activeTab === 'climate') : expandedId === 'climate') && (
          <div className={isExpanded ? 'bg-white border border-slate-300 rounded-2xl p-5 sm:p-7 shadow-sm w-full flex flex-col gap-3' : 'bg-slate-50/60 border border-slate-200/90 rounded-xl p-3.5 flex flex-col gap-2 shadow-2xs'}>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`${isExpanded ? 'text-sm sm:text-base' : 'text-xs'} font-bold text-slate-900`}>
                    3. Réchauffement Mondial, Gaz à Effet de Serre &amp; Montée des Océans
                  </span>
                  {isExpanded && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-sky-100 text-sky-800 border border-sky-200 font-semibold">
                      Climat
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10.5px] font-mono text-slate-600 font-semibold flex items-center gap-1.5">
                    {d3.isShowingHover ? (
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold">
                        🔍 Survol : {d3.displayYear}
                      </span>
                    ) : (
                      <span>Année {d3.displayYear}</span>
                    )}
                  </span>
                  {!isExpanded ? (
                    <button
                      onClick={() => setExpandedChartId('climate')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 hover:border-sky-300 transition-colors shadow-2xs cursor-pointer shrink-0"
                      title="Agrandir ce graphique en plein écran"
                      aria-label="Plein écran pour le graphique Climat"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-sky-600" />
                      <span className="hidden sm:inline">Plein écran</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setExpandedChartId(null)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 hover:border-rose-300 transition-colors shadow-2xs cursor-pointer shrink-0"
                      title="Fermer le plein écran"
                      aria-label="Fermer le plein écran"
                    >
                      <X className="w-4 h-4 text-rose-600" />
                      <span>Fermer</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Chiffres précis dont la montée du niveau des mers */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] font-mono mt-0.5 tabular-nums">
                <span className="text-sky-800 font-semibold min-w-[7.5rem]">
                  CO2 : {Math.round(d3.stateA.atmosphericCo2Ppm)} ppm
                </span>
                <span className="text-rose-700 font-semibold flex items-center gap-1 min-w-[8.5rem]">
                  Réchauffement : {d3.stateA.surfaceTemperatureAnomaly >= 0 ? '+' : ''}{d3.stateA.surfaceTemperatureAnomaly.toFixed(2)}°C
                  <TechTooltip term="fair" showIconOnly />
                </span>
                {/* Montée des mers */}
                <span className="text-sky-900 font-bold bg-sky-100/80 border border-sky-300 px-2 py-0.5 rounded flex items-center gap-1 min-w-[11.5rem]">
                  🌊 Montée des océans : {d3.seaLevelCm >= 0 ? '+' : ''}{d3.seaLevelCm} cm ({d3.seaLevelVs2026 >= 0 ? `+${d3.seaLevelVs2026} cm depuis 2026` : `${d3.seaLevelVs2026} cm vs 2026`})
                  <TechTooltip term="slr" showIconOnly />
                </span>
              </div>

              {/* Ligne comparative Trajectoire B si activée */}
              {isCompareMode && d3.stateB && (
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200 text-[10px] font-mono text-emerald-800 tabular-nums">
                  <span className="font-bold flex items-center gap-1 text-emerald-700">
                    <GitCompare className="w-3 h-3 text-emerald-700" />
                    {scenarioB?.shortName ?? 'Trajectoire B (Sobriété)'} :
                  </span>
                  <span className="bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-semibold text-sky-900">
                    CO2 : {Math.round(d3.stateB.atmosphericCo2Ppm)} ppm
                  </span>
                  <span className="bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-semibold text-rose-800">
                    Réchauffement : +{d3.stateB.surfaceTemperatureAnomaly.toFixed(2)}°C
                  </span>
                  <span className="bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-semibold text-sky-800">
                    Océans : +{d3.seaLevelCmB} cm ({d3.seaLevelCmB - d3.seaLevelCm >= 0 ? `+${d3.seaLevelCmB - d3.seaLevelCm}` : `${d3.seaLevelCmB - d3.seaLevelCm}`} cm)
                  </span>
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-600 leading-tight">
              CO2 dans l'atmosphère (axe gauche), température mondiale depuis 1850 (axe droit) et élévation séculaire des océans (pointillé bleu chiffré en cm jusqu'en 2200).
            </p>

            {/* SVG Graphique 3 */}
            <div className={`relative w-full ${isExpanded ? 'aspect-[540/220] sm:aspect-[540/210] max-h-[62vh]' : 'aspect-[540/205]'} bg-white rounded-lg border border-slate-200 overflow-hidden cursor-crosshair shadow-inner`}>
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="w-full h-full"
                onClick={handleSvgClick}
                onMouseMove={(e) => handleSvgHover(e, 'climate')}
                onMouseLeave={() => handleSvgLeave('climate')}
              >
                {/* Axe vertical gauche : Concentration de CO2 (ppm) */}
                <text x={PAD.left - 6} y={PAD.top + 4} fill="#0284c7" fontSize="8" textAnchor="end" fontFamily="monospace">750 ppm</text>
                <text x={PAD.left - 6} y={PAD.top + plotH / 2 + 3} fill="#0284c7" fontSize="8" textAnchor="end" fontFamily="monospace">500</text>
                <text x={PAD.left - 6} y={PAD.top + plotH} fill="#0284c7" fontSize="8" textAnchor="end" fontFamily="monospace">{co2Min} ppm</text>

                {/* Axe vertical droit : Anomalie thermique (°C) */}
                <text x={W - PAD.right + 6} y={PAD.top + 4} fill="#b91c1c" fontSize="8" textAnchor="start" fontFamily="monospace">+5.0°C</text>
                <text x={W - PAD.right + 6} y={getYTemp(2.0) + 3} fill="#b91c1c" fontSize="8" textAnchor="start" fontFamily="monospace">+2.0°C</text>
                <text x={W - PAD.right + 6} y={PAD.top + plotH} fill="#b91c1c" fontSize="8" textAnchor="start" fontFamily="monospace">{tempMin >= 0 ? `+${tempMin}` : tempMin}°C</text>

                {/* Repères horizontaux pour la montée des océans */}
                {endYear === 2200 ? (
                  <>
                    <line x1={PAD.left} y1={getYSlr(2.5)} x2={W - PAD.right} y2={getYSlr(2.5)} stroke="#0284c7" strokeWidth="0.6" strokeDasharray="2,4" opacity="0.6" />
                    <text x={PAD.left + 4} y={getYSlr(2.5) - 2} fill="#0369a1" fontSize="6.5" opacity="0.85">Repère océan séculaire : +250 cm (+2,5 m en 2200)</text>

                    <line x1={PAD.left} y1={getYSlr(1.0)} x2={W - PAD.right} y2={getYSlr(1.0)} stroke="#0284c7" strokeWidth="0.6" strokeDasharray="2,4" opacity="0.5" />
                    <text x={PAD.left + 4} y={getYSlr(1.0) - 2} fill="#0369a1" fontSize="6.5" opacity="0.75">Repère océan : +100 cm (+1 m)</text>
                  </>
                ) : (
                  <>
                    <line x1={PAD.left} y1={getYSlr(0.75)} x2={W - PAD.right} y2={getYSlr(0.75)} stroke="#0284c7" strokeWidth="0.6" strokeDasharray="2,4" opacity="0.5" />
                    <text x={PAD.left + 4} y={getYSlr(0.75) - 2} fill="#0369a1" fontSize="6.5" opacity="0.8">Repère océan : +75 cm</text>

                    <line x1={PAD.left} y1={getYSlr(0.25)} x2={W - PAD.right} y2={getYSlr(0.25)} stroke="#0284c7" strokeWidth="0.6" strokeDasharray="2,4" opacity="0.5" />
                    <text x={PAD.left + 4} y={getYSlr(0.25) - 2} fill="#0369a1" fontSize="6.5" opacity="0.8">Repère océan : +25 cm</text>
                  </>
                )}

                {/* Ligne seuil Accord de Paris +1.5°C et +2.0°C */}
                <line x1={PAD.left} y1={getYTemp(1.5)} x2={W - PAD.right} y2={getYTemp(1.5)} stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.4" />
                <line x1={PAD.left} y1={getYTemp(2.0)} x2={W - PAD.right} y2={getYTemp(2.0)} stroke="#dc2626" strokeWidth="1" strokeDasharray="4,3" opacity="0.6" />

                {/* Axe des abscisses */}
                {renderAbscisseAxis('climate')}

                {/* Courbe 1 : CO2 Atmosphérique (Bleu Océan) */}
                <path d={pathCo2} fill="none" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" />

                {/* Courbe 2 : Température Globale FaIR (Rouge Rubis) */}
                <path d={pathTemp} fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />

                {/* Courbe 3 : Montée des Océans (Pointillé bleu profond) */}
                <path d={pathSlr} fill="none" stroke="#0369a1" strokeWidth="2.4" strokeDasharray="5,3" strokeLinecap="round" />

                {/* COURBES DE COMPARAISON TRAJECTOIRE B */}
                {isCompareMode && visibleCompareTrajectory.length > 0 && (
                  <g className="compare-layer">
                    <path d={pathTempB} fill="none" stroke="#16a34a" strokeWidth="2.2" strokeDasharray="5 3" strokeLinecap="round" />
                    <path d={pathSlrB} fill="none" stroke="#0ea5e9" strokeWidth="1.8" strokeDasharray="2 3" strokeLinecap="round" />
                  </g>
                )}

                {/* Mini-légende de comparaison intégrée */}
                {isCompareMode && (
                  <g className="select-none pointer-events-none">
                    <rect x={W - PAD.right - 136} y={PAD.top + 2} width="134" height="23" rx="3" fill="#ffffff" fillOpacity="0.9" stroke="#cbd5e1" strokeWidth="0.8" />
                    <line x1={W - PAD.right - 130} y1={PAD.top + 8} x2={W - PAD.right - 114} y2={PAD.top + 8} stroke="#dc2626" strokeWidth="2" />
                    <text x={W - PAD.right - 110} y={PAD.top + 10} fill="#1e293b" fontSize="6.8" fontFamily="sans-serif">A: {scenarioA?.shortName ?? 'Actuel'}</text>
                    <line x1={W - PAD.right - 130} y1={PAD.top + 17} x2={W - PAD.right - 114} y2={PAD.top + 17} stroke="#16a34a" strokeWidth="2" strokeDasharray="4 2" />
                    <text x={W - PAD.right - 110} y={PAD.top + 19} fill="#16a34a" fontSize="6.8" fontFamily="sans-serif">B: {scenarioB?.shortName ?? 'Sobriété'}</text>
                  </g>
                )}

                {/* Marqueur interactif sur la montée des océans */}
                <g>
                  <circle
                    cx={currentX}
                    cy={getYSlr(currentSimState.seaLevelRiseMeters)}
                    r="4.5"
                    fill="#0284c7"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <rect
                    x={Math.max(PAD.left, Math.min(W - PAD.right - 58, currentX - 29))}
                    y={Math.max(PAD.top, getYSlr(currentSimState.seaLevelRiseMeters) - 17)}
                    width="58"
                    height="13"
                    rx="3"
                    fill="#0284c7"
                  />
                  <text
                    x={Math.max(PAD.left + 29, Math.min(W - PAD.right - 29, currentX))}
                    y={Math.max(PAD.top + 9, getYSlr(currentSimState.seaLevelRiseMeters) - 7.5)}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="7.8"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    🌊 {d3.seaLevelCm >= 0 ? '+' : ''}{d3.seaLevelCm} cm
                  </text>
                </g>
              </svg>
            </div>

            {/* Légende avec explication claire de la montée */}
            <div className="flex flex-col gap-1 text-[10.5px] text-slate-600 pt-1 border-t border-slate-200">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>🔵 <strong>Ligne bleue :</strong> Concentration de CO2 ({Math.round(d3.stateA.atmosphericCo2Ppm)} ppm)</span>
                <span>🔴 <strong>Ligne rouge :</strong> Réchauffement (+{d3.stateA.surfaceTemperatureAnomaly.toFixed(2)}°C depuis 1850)</span>
              </div>
              <div className="bg-sky-50 border border-sky-200 rounded p-1.5 text-sky-900 text-[10px]">
                🌊 <strong>Pointillé bleu (Montée des océans) :</strong> {d3.seaLevelCm >= 0 ? '+' : ''}{d3.seaLevelCm} cm en {d3.displayYear} (soit {d3.seaLevelVs2026 >= 0 ? `+${d3.seaLevelVs2026} cm de plus qu'aujourd'hui` : `${d3.seaLevelVs2026} cm par rapport à aujourd'hui`}, projection jusqu'à +{endYear === 2200 ? '260 cm en 2200' : '75 cm en 2100'}).
                <br />
                Chaque tranche de 10 cm supplémentaire submerge les deltas côtiers très fertiles (Mékong, Bangladesh, Nil) et salinise les réserves d'eau douce souterraines.
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* GRAPHIQUE 4 : AGRONOMIE & ALIMENTATION */}
        {/* ========================================================================= */}
        {(!isExpanded ? (activeTab === 'all' || activeTab === 'agri') : expandedId === 'agri') && (
          <div className={isExpanded ? 'bg-white border border-slate-300 rounded-2xl p-5 sm:p-7 shadow-sm w-full flex flex-col gap-3' : 'bg-slate-50/60 border border-slate-200/90 rounded-xl p-3.5 flex flex-col gap-2 shadow-2xs'}>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`${isExpanded ? 'text-sm sm:text-base' : 'text-xs'} font-bold text-slate-900`}>
                    4. Disponibilité Alimentaire Mondiale &amp; Rendements des Terres
                  </span>
                  {isExpanded && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-sky-100 text-sky-800 border border-sky-200 font-semibold">
                      Alimentation
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10.5px] font-mono text-slate-600 font-semibold flex items-center gap-1.5">
                    {d4.isShowingHover ? (
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold">
                        🔍 Survol : {d4.displayYear}
                      </span>
                    ) : (
                      <span>Année {d4.displayYear}</span>
                    )}
                  </span>
                  {!isExpanded ? (
                    <button
                      onClick={() => setExpandedChartId('agri')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 hover:border-sky-300 transition-colors shadow-2xs cursor-pointer shrink-0"
                      title="Agrandir ce graphique en plein écran"
                      aria-label="Plein écran pour le graphique Alimentation"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-sky-600" />
                      <span className="hidden sm:inline">Plein écran</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setExpandedChartId(null)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 hover:border-rose-300 transition-colors shadow-2xs cursor-pointer shrink-0"
                      title="Fermer le plein écran"
                      aria-label="Fermer le plein écran"
                    >
                      <X className="w-4 h-4 text-rose-600" />
                      <span>Fermer</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Indicateurs numériques avec tabular-nums */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] font-mono mt-0.5 tabular-nums">
                <span className="text-emerald-700 font-semibold min-w-[8.5rem]">
                  Nourriture : {Math.round(d4.stateA.globalAverageCaloriesPerCapita)} kcal/hab/j
                </span>
                <span className="text-amber-800 font-semibold flex items-center gap-1 min-w-[9.5rem]">
                  Rendement moyen : {(d4.stateA.globalCropYieldComposite * 100).toFixed(0)}% du pic
                  <TechTooltip term="haber-bosch" showIconOnly />
                </span>
                <span className="text-rose-700 font-semibold min-w-[8.5rem]">
                  Paramètre calorique du modèle : 2 100 kcal/jour
                </span>
              </div>

              {/* Ligne comparative Trajectoire B si activée */}
              {isCompareMode && d4.stateB && (
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200 text-[10px] font-mono text-emerald-800 tabular-nums">
                  <span className="font-bold flex items-center gap-1 text-emerald-700">
                    <GitCompare className="w-3 h-3 text-emerald-700" />
                    {scenarioB?.shortName ?? 'Trajectoire B (Sobriété)'} :
                  </span>
                  <span className="bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-semibold text-emerald-900">
                    Calories : {Math.round(d4.stateB.globalAverageCaloriesPerCapita)} kcal/hab
                  </span>
                  <span className="bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-semibold text-amber-800">
                    Rendement : {(d4.stateB.globalCropYieldComposite * 100).toFixed(0)}%
                  </span>
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-600 leading-tight">
              Calories quotidiennes disponibles par être humain comparées au minimum vital absolu de 2 100 kcal/jour fixé par l'Organisation des Nations Unies.
            </p>

            {/* SVG Graphique 4 */}
            <div className={`relative w-full ${isExpanded ? 'aspect-[540/220] sm:aspect-[540/210] max-h-[62vh]' : 'aspect-[540/205]'} bg-white rounded-lg border border-slate-200 overflow-hidden cursor-crosshair shadow-inner`}>
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="w-full h-full"
                onClick={handleSvgClick}
                onMouseMove={(e) => handleSvgHover(e, 'agri')}
                onMouseLeave={() => handleSvgLeave('agri')}
              >
                {/* Axe vertical gauche : Calories (kcal/jour) */}
                <text x={PAD.left - 6} y={PAD.top + 4} fill="#059669" fontSize="8" textAnchor="end" fontFamily="monospace">3500</text>
                <text x={PAD.left - 6} y={yCalorie2100 + 3} fill="#dc2626" fontSize="8" textAnchor="end" fontFamily="monospace">2100</text>
                <text x={PAD.left - 6} y={PAD.top + plotH} fill="#059669" fontSize="8" textAnchor="end" fontFamily="monospace">1200 kcal</text>

                {/* Axe vertical droit : Rendements (0.1 à 1.2) */}
                <text x={W - PAD.right + 6} y={PAD.top + 4} fill="#d97706" fontSize="8" textAnchor="start" fontFamily="monospace">120%</text>
                <text x={W - PAD.right + 6} y={getYYield(1.0) + 3} fill="#d97706" fontSize="8" textAnchor="start" fontFamily="monospace">100%</text>
                <text x={W - PAD.right + 6} y={PAD.top + plotH} fill="#d97706" fontSize="8" textAnchor="start" fontFamily="monospace">10%</text>

                {/* Ligne de référence utilisée par le modèle (2100 kcal/jour) */}
                <line
                  x1={PAD.left}
                  y1={yCalorie2100}
                  x2={W - PAD.right}
                  y2={yCalorie2100}
                  stroke="#ef4444"
                  strokeWidth="1.2"
                  strokeDasharray="4,3"
                />
                <text
                  x={W - PAD.right - 4}
                  y={yCalorie2100 - 3}
                  textAnchor="end"
                  fill="#dc2626"
                  fontSize="7"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                >
                  Référence calorique du modèle (2100 kcal / jour)
                </text>

                {/* Axe des abscisses */}
                {renderAbscisseAxis('agri')}

                {/* Courbe 1 : Calories par habitant (Verte) */}
                <path d={pathCal} fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />

                {/* Courbe 2 : Rendements agricoles combinés (Ambre) */}
                <path d={pathCropYield} fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="3,2" strokeLinecap="round" />

                {/* COURBES DE COMPARAISON TRAJECTOIRE B */}
                {isCompareMode && visibleCompareTrajectory.length > 0 && (
                  <g className="compare-layer">
                    <path d={pathCalB} fill="none" stroke="#16a34a" strokeWidth="2.2" strokeDasharray="5 3" strokeLinecap="round" />
                    <path d={pathCropYieldB} fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="3 3" strokeLinecap="round" />
                  </g>
                )}

                {/* Mini-légende de comparaison intégrée */}
                {isCompareMode && (
                  <g className="select-none pointer-events-none">
                    <rect x={W - PAD.right - 136} y={PAD.top + 2} width="134" height="23" rx="3" fill="#ffffff" fillOpacity="0.9" stroke="#cbd5e1" strokeWidth="0.8" />
                    <line x1={W - PAD.right - 130} y1={PAD.top + 8} x2={W - PAD.right - 114} y2={PAD.top + 8} stroke="#059669" strokeWidth="2" />
                    <text x={W - PAD.right - 110} y={PAD.top + 10} fill="#1e293b" fontSize="6.8" fontFamily="sans-serif">A: {scenarioA?.shortName ?? 'Actuel'}</text>
                    <line x1={W - PAD.right - 130} y1={PAD.top + 17} x2={W - PAD.right - 114} y2={PAD.top + 17} stroke="#16a34a" strokeWidth="2" strokeDasharray="4 2" />
                    <text x={W - PAD.right - 110} y={PAD.top + 19} fill="#16a34a" fontSize="6.8" fontFamily="sans-serif">B: {scenarioB?.shortName ?? 'Sobriété'}</text>
                  </g>
                )}

                {/* Marqueur interactif sur les calories */}
                <circle
                  cx={currentX}
                  cy={getYCal(currentSimState.globalAverageCaloriesPerCapita)}
                  r="4"
                  fill="#059669"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <rect
                  x={Math.max(PAD.left, Math.min(W - PAD.right - 46, currentX - 23))}
                  y={getYCal(currentSimState.globalAverageCaloriesPerCapita) - 16}
                  width="46"
                  height="12"
                  rx="3"
                  fill="#065f46"
                />
                <text
                  x={Math.max(PAD.left + 23, Math.min(W - PAD.right - 23, currentX))}
                  y={getYCal(currentSimState.globalAverageCaloriesPerCapita) - 7.5}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="7.5"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {Math.round(currentSimState.globalAverageCaloriesPerCapita)} kcal
                </text>
              </svg>
            </div>

            {/* Légende */}
            <div className="flex flex-col gap-1 text-[10.5px] text-slate-600 pt-1 border-t border-slate-200">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>🟢 <strong>Ligne verte :</strong> Ration alimentaire moyenne ({Math.round(d4.stateA.globalAverageCaloriesPerCapita)} kcal/habitant/jour)</span>
                <span>🟠 <strong>Pointillé ambre :</strong> Rendements mondiaux des récoltes ({(d4.stateA.globalCropYieldComposite * 100).toFixed(0)}%)</span>
                <span>🔴 <strong>Ligne rouge pointillée :</strong> Référence calorique utilisée par le modèle (2 100 kcal/jour)</span>
              </div>
              <p className="text-[10px] text-slate-500">
                La trajectoire calorique affichée est calculée par CLIMATOPEDY à partir de ses paramètres agricoles et climatiques; elle n'est pas une prévision de disponibilité alimentaire.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* VUE STANDARD DES GRAPHIQUES */}
      <div className="w-full rounded-xl bg-white border border-slate-200/90 p-4 shadow-xs flex flex-col gap-3">
        {/* En-tête des graphiques avec sélecteur d'échelle temporelle (jusqu'en 2200) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-600" />
              <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-800">
                Trajectoires Biophysiques Couplées ({startYear} → {endYear})
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Évolution continue du système Terre · Cliquez sur un graphique pour caler la simulation sur l'année voulue
            </p>
          </div>

          {/* Commandes : Période temporelle, Isolation du survol, Plein écran & Onglets */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Sélecteur de période temporelle étendu jusqu'en 2200 */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <span className="text-[10px] text-slate-500 px-1.5 font-medium">Période :</span>
              <button
                onClick={() => setTimeRange('1900-2200')}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  timeRange === '1900-2200'
                    ? 'bg-sky-600 text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Grand Siècle & Prospective séculaire (1900–2200 - 300 ans)"
              >
                📜 1900–2200 (300 ans)
              </button>
              <button
                onClick={() => setTimeRange('1900-2100')}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  timeRange === '1900-2100'
                    ? 'bg-sky-700 text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Vue 1900-2100 (200 ans)"
              >
                1900–2100
              </button>
              <button
                onClick={() => setTimeRange('2026-2200')}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  timeRange === '2026-2200'
                    ? 'bg-sky-600 text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Prospective longue portée (2026-2200)"
              >
                🔭 2026–2200
              </button>
              <button
                onClick={() => setTimeRange('2026-2100')}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  timeRange === '2026-2100'
                    ? 'bg-sky-700 text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Zoom prospectif 21e siècle (2026-2100)"
              >
                2026–2100
              </button>
            </div>

            {/* Bouton de bascule du survol (Indépendant vs Synchronisé) */}
            <button
              onClick={() => setIsSyncHover(!isSyncHover)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors shadow-2xs ${
                !isSyncHover
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-indigo-50 border-indigo-300 text-indigo-800'
              }`}
              title={
                !isSyncHover
                  ? 'Survol indépendant : passer la souris sur un graphique ne fait JAMAIS bouger les 3 autres.'
                  : 'Survol synchronisé : le curseur temporel bouge sur les 4 graphiques en même temps.'
              }
            >
              {!isSyncHover ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Survol : Indépendant</span>
                </>
              ) : (
                <>
                  <GitCompare className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Survol : Synchronisé</span>
                </>
              )}
            </button>

            {/* Onglets thématiques */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tous (4)
              </button>
              <button
                onClick={() => setActiveTab('demo')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  activeTab === 'demo'
                    ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Démographie
              </button>
              <button
                onClick={() => setActiveTab('energy')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  activeTab === 'energy'
                    ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Énergie
              </button>
              <button
                onClick={() => setActiveTab('climate')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  activeTab === 'climate'
                    ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Climat
              </button>
              <button
                onClick={() => setActiveTab('agri')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  activeTab === 'agri'
                    ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Alimentation
              </button>
            </div>


          </div>
        </div>

        {/* Grille des graphiques interactifs */}
        {renderChartsGrid(null)}
      </div>

      {/* MODAL / FENÊTRE EN PLEIN ÉCRAN POUR LE GRAPHIQUE ÉTIRÉ */}
      {expandedChartId && (
        <div 
          className="fixed inset-0 z-50 flex flex-col bg-slate-100/95 backdrop-blur-md text-slate-800 overflow-y-auto animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-label="Graphique en plein écran"
        >
          {/* Barre supérieure d'en-tête du Plein Écran */}
          <div className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-600">
                <Maximize2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Plein Écran : {getChartTitle(expandedChartId)}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-sky-100 text-sky-800 border border-sky-200 font-semibold">
                    {startYear} → {endYear}
                  </span>
                </h2>
                <p className="text-[11px] text-slate-500">
                  Vue haute résolution étirée · Année visualisée : <strong className="text-slate-900 font-mono">{currentSimYear}</strong>
                </p>
              </div>
            </div>

            {/* Outils & Commandes en Plein Écran */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Sélecteur de période */}
              <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                <span className="text-[10px] text-slate-500 px-1.5 font-medium">Période :</span>
                <button
                  onClick={() => setTimeRange('1900-2200')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    timeRange === '1900-2200' ? 'bg-sky-600 text-white font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  1900–2200
                </button>
                <button
                  onClick={() => setTimeRange('1900-2100')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    timeRange === '1900-2100' ? 'bg-sky-700 text-white font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  1900–2100
                </button>
                <button
                  onClick={() => setTimeRange('2026-2200')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    timeRange === '2026-2200' ? 'bg-sky-600 text-white font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  2026–2200
                </button>
                <button
                  onClick={() => setTimeRange('2026-2100')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    timeRange === '2026-2100' ? 'bg-sky-700 text-white font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  2026–2100
                </button>
              </div>

              {/* BOUTON FERMER LE PLEIN ÉCRAN (CROIX) */}
              <button
                onClick={() => setExpandedChartId(null)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                title="Fermer le mode plein écran (Touche Échap)"
                aria-label="Fermer le plein écran"
              >
                <X className="w-4 h-4" />
                <span>Fermer le plein écran</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-rose-800 font-mono">Échap</span>
              </button>
            </div>
          </div>

          {/* Corps du Plein Écran */}
          <div className="flex-1 p-4 sm:p-6 space-y-4 max-w-[1600px] mx-auto w-full">
            {/* Barre de navigation temporelle rapide avec slider interactif */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-700 font-mono shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping inline-block" />
                <span>Curseur temporel : <strong className="text-slate-900 text-sm">{currentSimYear}</strong></span>
              </div>
              <div className="flex-1 min-w-[200px] max-w-lg flex items-center gap-3">
                <span className="text-xs font-mono text-slate-500">{startYear}</span>
                <input
                  type="range"
                  min={startYear}
                  max={endYear}
                  value={currentSimYear}
                  onChange={(e) => onSeekYear(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                  aria-label="Curseur temporel"
                />
                <span className="text-xs font-mono text-slate-500">{endYear}</span>
              </div>
              <div className="flex flex-wrap items-center gap-1 text-xs">
                <span className="text-slate-500 font-medium mr-1">Aller à :</span>
                {[1900, 1950, 2000, 2026, 2050, 2075, 2100, 2150, 2200].filter(y => y >= startYear && y <= endYear).map((yr) => (
                  <button
                    key={`jump-exp-${yr}`}
                    onClick={() => onSeekYear(yr)}
                    className={`px-2.5 py-1 rounded font-mono font-bold cursor-pointer transition-colors ${
                      currentSimYear === yr
                        ? 'bg-sky-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            {/* Rendu du graphique unique sélectionné, étiré et enrichi */}
            {renderChartsGrid(expandedChartId)}

            {/* Bouton secondaire en bas pour fermer confortablement */}
            <div className="flex justify-center pt-2 pb-6">
              <button
                onClick={() => setExpandedChartId(null)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer hover:scale-102"
              >
                <X className="w-4 h-4 text-slate-400" />
                <span>Quitter le plein écran (Échap)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
