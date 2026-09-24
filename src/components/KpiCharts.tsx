import React, { useState } from 'react';
import { Calendar, Info, Clock, AlertTriangle, Layers, ChevronRight, Activity, GitCompare, FileDown } from 'lucide-react';
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
  onOpenPdfExport?: () => void;
}

export const KpiCharts: React.FC<KpiChartsProps> = ({
  trajectory,
  compareTrajectory,
  scenarioA,
  scenarioB,
  isCompareMode = false,
  currentYear,
  onSeekYear,
  onOpenPdfExport
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'demo' | 'energy' | 'climate' | 'agri'>('all');
  const [hoverYear, setHoverYear] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState<'1900-2100' | '2026-2100'>('1900-2100');

  // Dimensions graphiques SVG
  const W = 540;
  const H = 205;
  const PAD = { top: 26, right: 42, bottom: 44, left: 48 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const startYear = timeRange === '1900-2100' ? 1900 : 2026;
  const endYear = 2100;

  // Filtrer la trajectoire selon la plage temporelle choisie
  const visibleTrajectory = trajectory.filter(pt => pt.year >= startYear && pt.year <= endYear);
  const visibleCompareTrajectory = (isCompareMode && compareTrajectory)
    ? compareTrajectory.filter(pt => pt.year >= startYear && pt.year <= endYear)
    : [];

  // Helper pour mapper une année vers les coordonnées horizontales X
  const getX = (year: number) => {
    const clampedYear = Math.max(startYear, Math.min(endYear, year));
    return PAD.left + ((clampedYear - startYear) / (endYear - startYear)) * plotW;
  };

  const currentX = getX(currentYear);
  const hoverX = hoverYear !== null ? getX(hoverYear) : null;
  const x2026 = getX(2026);

  // Repères d'années sur l'axe des abscisses
  const X_TICKS = timeRange === '1900-2100'
    ? [1900, 1930, 1960, 1990, 2026, 2050, 2080, 2100]
    : [2026, 2040, 2060, 2080, 2100];

  const X_GRID = timeRange === '1900-2100'
    ? [1920, 1940, 1960, 1980, 2000, 2026, 2050, 2075, 2100]
    : [2030, 2040, 2050, 2060, 2070, 2080, 2090, 2100];

  // =========================================================
  // 1. DÉMOGRAPHIE & MORTALITÉS
  // =========================================================
  const popMin = timeRange === '1900-2100' ? 1.0 : 3.0; // Mds
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
  const eroiMax = timeRange === '1900-2100' ? 105 : 35;
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
  const co2Min = timeRange === '1900-2100' ? 280 : 350;
  const co2Max = 750;
  const getYCo2 = (co2: number) => {
    return PAD.top + plotH - ((co2 - co2Min) / (co2Max - co2Min)) * plotH;
  };
  const pathCo2 = visibleTrajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYCo2(pt.atmosphericCo2Ppm).toFixed(1)}`).join(' ');

  const tempMin = timeRange === '1900-2100' ? -0.3 : 1.0;
  const tempMax = 5.0;
  const getYTemp = (temp: number) => {
    return PAD.top + plotH - ((temp - tempMin) / (tempMax - tempMin)) * plotH;
  };
  const pathTemp = visibleTrajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYTemp(pt.surfaceTemperatureAnomaly).toFixed(1)}`).join(' ');
  const pathTempB = visibleCompareTrajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYTemp(pt.surfaceTemperatureAnomaly).toFixed(1)}`).join(' ');

  // Échelle Océan en mètres (-0.15 m à +1.0 m) => graduation directe en cm
  const slrMin = -0.15; // -15 cm vs 2000
  const slrMax = 0.95;  // +95 cm vs 2000
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

  // Interaction Clic & Survol
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, (clickX - PAD.left) / plotW));
    const targetYear = Math.round(startYear + ratio * (endYear - startYear));
    onSeekYear(targetYear);
  };

  const handleSvgHover = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, (clickX - PAD.left) / plotW));
    const targetYear = Math.round(startYear + ratio * (endYear - startYear));
    setHoverYear(targetYear);
  };

  const displayYear = hoverYear ?? Math.floor(currentYear);
  const displayState = trajectory.find(t => t.year === displayYear) || trajectory[0];
  const displayStateB = (isCompareMode && compareTrajectory)
    ? (compareTrajectory.find(t => t.year === displayYear) || compareTrajectory[0])
    : null;

  // Décès par canicule formatés
  const thermalDeathsFormatted = displayState.worldDeathsAnnual.thermal >= 1
    ? `${displayState.worldDeathsAnnual.thermal.toFixed(2)} M/an`
    : `${Math.round(displayState.worldDeathsAnnual.thermal * 1000).toLocaleString('fr-FR')} décès/an`;

  const thermalDeathsFormattedB = displayStateB
    ? (displayStateB.worldDeathsAnnual.thermal >= 1
        ? `${displayStateB.worldDeathsAnnual.thermal.toFixed(2)} M/an`
        : `${Math.round(displayStateB.worldDeathsAnnual.thermal * 1000).toLocaleString('fr-FR')} décès/an`)
    : '';

  // Montée des océans formatée
  const seaLevelCm = Math.round(displayState.seaLevelRiseMeters * 100);
  const seaLevelVs2026 = Math.round((displayState.seaLevelRiseMeters - 0.12) * 100);
  const seaLevelCmB = displayStateB ? Math.round(displayStateB.seaLevelRiseMeters * 100) : 0;

  // Rendu de l'axe des abscisses et des repères temporels
  const renderAbscisseAxis = () => (
    <g className="select-none pointer-events-none">
      {/* Zone historique ombrée si timeRange = 1900-2100 */}
      {timeRange === '1900-2100' && x2026 > PAD.left && (
        <g>
          <rect
            x={PAD.left}
            y={PAD.top}
            width={x2026 - PAD.left}
            height={plotH}
            fill="#0284c7"
            opacity="0.05"
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
            fill="#38bdf8"
            fontSize="6.8"
            fontWeight="bold"
            fontFamily="sans-serif"
            opacity="0.85"
          >
            ← Données historiques mesurées (1900–2026)
          </text>
          <text
            x={x2026 + 6}
            y={PAD.top + 10}
            fill="#94a3b8"
            fontSize="6.8"
            fontWeight="bold"
            fontFamily="sans-serif"
            opacity="0.8"
          >
            Modèle prospectif (2026–2100) →
          </text>
        </g>
      )}

      {/* Lignes de grille temporelle */}
      {X_GRID.map((yr) => (
        <line
          key={`grid-x-${yr}`}
          x1={getX(yr)}
          y1={PAD.top}
          x2={getX(yr)}
          y2={PAD.top + plotH}
          stroke="#1e293b"
          strokeWidth="0.7"
          strokeDasharray="2,3"
        />
      ))}

      {/* Ligne de base horizontale */}
      <line
        x1={PAD.left}
        y1={PAD.top + plotH}
        x2={W - PAD.right}
        y2={PAD.top + plotH}
        stroke="#475569"
        strokeWidth="1.2"
      />

      {/* Graduations de l'axe temporel */}
      {X_TICKS.map((yr) => {
        const x = getX(yr);
        const isToday = yr === 2026;
        const isPast = yr < 2026;
        return (
          <g key={`tick-x-${yr}`}>
            <line
              x1={x}
              y1={PAD.top + plotH}
              x2={x}
              y2={PAD.top + plotH + 4}
              stroke={isToday ? '#38bdf8' : isPast ? '#60a5fa' : '#64748b'}
              strokeWidth={isToday ? '1.8' : '1'}
            />
            <text
              x={x}
              y={PAD.top + plotH + 14}
              textAnchor={yr === startYear ? 'start' : yr === endYear ? 'end' : 'middle'}
              fill={isToday ? '#38bdf8' : isPast ? '#93c5fd' : '#94a3b8'}
              fontSize={isToday ? '8.5' : '7.5'}
              fontWeight={isToday ? '800' : '600'}
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
        fill="#94a3b8"
        fontSize="7.5"
        fontWeight="600"
        fontFamily="sans-serif"
        letterSpacing="0.04em"
      >
        Axe temporel (X) : {timeRange === '1900-2100' ? '1900 → 2100 (200 ans d\'anthropocène)' : '2026 → 2100 (Projection prospective)'}
      </text>

      {/* Curseur de l'année sélectionnée avec badge flottant */}
      <line
        x1={currentX}
        y1={PAD.top - 6}
        x2={currentX}
        y2={PAD.top + plotH + 4}
        stroke="#38bdf8"
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
        {Math.floor(currentYear)}
      </text>

      {/* Repère de survol dynamique */}
      {hoverX !== null && hoverYear !== null && hoverYear !== Math.floor(currentYear) && (
        <g>
          <line
            x1={hoverX}
            y1={PAD.top}
            x2={hoverX}
            y2={PAD.top + plotH}
            stroke="#94a3b8"
            strokeWidth="1"
            strokeDasharray="2,2"
            opacity="0.8"
          />
          <rect
            x={Math.max(PAD.left - 2, Math.min(W - PAD.right - 32, hoverX - 16))}
            y={PAD.top + plotH + 18}
            width="32"
            height="11"
            rx="2"
            fill="#334155"
          />
          <text
            x={Math.max(PAD.left + 14, Math.min(W - PAD.right - 16, hoverX))}
            y={PAD.top + plotH + 26.5}
            textAnchor="middle"
            fill="#f8fafc"
            fontSize="7"
            fontWeight="700"
            fontFamily="monospace"
          >
            {hoverYear}
          </text>
        </g>
      )}
    </g>
  );

  return (
    <div className="w-full rounded-xl bg-[#090d15] border border-slate-800 p-4 shadow-xl flex flex-col gap-3">
      {/* En-tête des graphiques avec sélecteur d'échelle temporelle (1900-2100 vs 2026-2100) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-200">
              Trajectoires Biophysiques Couplées ({timeRange === '1900-2100' ? '1900–2100 : Histoire & Avenir' : '2026–2100 : Prospective'})
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Évolution continue du système Terre · Cliquez sur un graphique pour caler immédiatement la simulation sur l'année voulue
          </p>
        </div>

        {/* Commandes : Échelle temporelle & Filtre par thématique */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sélecteur de période temporelle demandé par l'utilisateur (départ 1900) */}
          <div className="flex items-center bg-[#121824] p-1 rounded-lg border border-slate-800 text-xs">
            <span className="text-[10px] text-slate-400 px-1.5 font-medium">Période :</span>
            <button
              onClick={() => setTimeRange('1900-2100')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                timeRange === '1900-2100'
                  ? 'bg-blue-600 text-white font-semibold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Affiche les données réelles depuis 1900 jusqu'au modèle de 2100 (vue sur 200 ans)"
            >
              📜 Depuis 1900 (200 ans)
            </button>
            <button
              onClick={() => setTimeRange('2026-2100')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                timeRange === '2026-2100'
                  ? 'bg-cyan-600 text-white font-semibold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Zoom sur les projections futures (2026-2100)"
            >
              🔭 2026–2100 (Zoom futur)
            </button>
          </div>

          {/* Onglets thématiques */}
          <div className="flex items-center gap-1 bg-[#121824] p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-slate-700 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tous (4)
            </button>
            <button
              onClick={() => setActiveTab('demo')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                activeTab === 'demo'
                  ? 'bg-slate-700 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1. Population &amp; Décès
            </button>
            <button
              onClick={() => setActiveTab('energy')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                activeTab === 'energy'
                  ? 'bg-slate-700 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2. Énergie &amp; Pétrole
            </button>
            <button
              onClick={() => setActiveTab('climate')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                activeTab === 'climate'
                  ? 'bg-slate-700 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              3. Climat &amp; Mers
            </button>
            <button
              onClick={() => setActiveTab('agri')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                activeTab === 'agri'
                  ? 'bg-slate-700 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              4. Alimentation
            </button>
          </div>

          {/* Bouton direct d'exportation PDF des graphiques */}
          {onOpenPdfExport && (
            <button
              onClick={onOpenPdfExport}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 text-cyan-300 hover:text-white border border-cyan-800/60 hover:border-cyan-600 transition-colors text-xs font-semibold cursor-pointer shadow-sm"
              title="Exporter ces graphiques et le bilan de simulation sous forme de rapport PDF imprimable"
            >
              <FileDown className="w-3.5 h-3.5 text-cyan-400" />
              <span>Exporter PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* Grille des graphiques interactifs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ========================================================================= */}
        {/* GRAPHIQUE 1 : DÉMOGRAPHIE & TOUTES LES CAUSES DE DÉCÈS (Canicules visibles) */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'demo') && (
          <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">
                  1. Population Mondiale &amp; Nombre de Décès par An
                </span>
                <span className="text-[10.5px] font-mono text-slate-400 font-semibold">
                  Année {displayYear}
                </span>
              </div>

              {/* Indicateurs numériques précis (TOUTES les causes affichées clairement avec valeur) */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] font-mono mt-0.5">
                <span className="text-white font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-white inline-block" />
                  Pop : {(displayState.worldPopulation / 1000).toFixed(2)} Mds
                </span>
                <span className="text-purple-300 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />
                  Total Décès : {displayState.worldDeathsAnnual.total.toFixed(1)} M/an
                </span>
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  Famines : {displayState.worldDeathsAnnual.famine.toFixed(1)} M/an
                </span>
                {/* Décès Canicule rendus 100% visibles avec formatage dynamique */}
                <span className="text-rose-400 font-bold bg-rose-950/70 border border-rose-800/80 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse" />
                  Canicules mortelles : {thermalDeathsFormatted}
                  <TechTooltip term="stull" showIconOnly />
                </span>
              </div>

              {/* Ligne comparative Trajectoire B si activée */}
              {isCompareMode && displayStateB && (
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80 text-[10px] font-mono text-emerald-300">
                  <span className="font-bold flex items-center gap-1 text-emerald-400">
                    <GitCompare className="w-3 h-3 text-emerald-400" />
                    {scenarioB?.shortName ?? 'Trajectoire B (Sobriété)'} :
                  </span>
                  <span className="bg-emerald-950/70 border border-emerald-800/80 px-1.5 py-0.5 rounded font-semibold text-emerald-300">
                    Pop : {(displayStateB.worldPopulation / 1000).toFixed(2)} Mds
                  </span>
                  <span className="bg-emerald-950/70 border border-emerald-800/80 px-1.5 py-0.5 rounded font-semibold text-emerald-300">
                    Canicules : {thermalDeathsFormattedB}
                  </span>
                  <span className="bg-emerald-950/70 border border-emerald-800/80 px-1.5 py-0.5 rounded font-semibold text-emerald-300">
                    Famines : {displayStateB.worldDeathsAnnual.famine.toFixed(1)} M/an
                  </span>
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-400 leading-tight">
              Nombre d'êtres humains sur Terre (axe gauche en Mds) comparé au rythme des décès annuels (axe droit en Millions/an).
            </p>

            {/* SVG Graphique 1 */}
            <div className="relative w-full aspect-[540/205] bg-[#070b12] rounded-lg border border-slate-900 overflow-hidden cursor-crosshair">
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="w-full h-full"
                onClick={handleSvgClick}
                onMouseMove={handleSvgHover}
                onMouseLeave={() => setHoverYear(null)}
              >
                {/* Axe vertical gauche : Population (Mds) */}
                <text x={PAD.left - 6} y={PAD.top + 4} fill="#ffffff" fontSize="8" textAnchor="end" fontFamily="monospace">10 Mds</text>
                <text x={PAD.left - 6} y={PAD.top + plotH / 2 + 3} fill="#ffffff" fontSize="8" textAnchor="end" fontFamily="monospace">6.5</text>
                <text x={PAD.left - 6} y={PAD.top + plotH} fill="#ffffff" fontSize="8" textAnchor="end" fontFamily="monospace">{popMin} Mds</text>

                {/* Axe vertical droit : Décès annuels (M/an) */}
                <text x={W - PAD.right + 6} y={PAD.top + 4} fill="#c084fc" fontSize="8" textAnchor="start" fontFamily="monospace">220M/an</text>
                <text x={W - PAD.right + 6} y={PAD.top + plotH} fill="#c084fc" fontSize="8" textAnchor="start" fontFamily="monospace">0M</text>

                {/* Lignes horizontales discrètes */}
                <line x1={PAD.left} y1={PAD.top} x2={W - PAD.right} y2={PAD.top} stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3,3" />
                <line x1={PAD.left} y1={PAD.top + plotH / 2} x2={W - PAD.right} y2={PAD.top + plotH / 2} stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3,3" />

                {/* Axe des abscisses et grilles temporelles */}
                {renderAbscisseAxis()}

                {/* Courbe 1 : Population Mondiale (Blanche épaisse) */}
                <path d={pathPop} fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />

                {/* Courbe 2 : Total Décès Annuels (Violette) */}
                <path d={pathDeathTotal} fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" />

                {/* Courbe 3 : Décès dus aux Famines (Orange) */}
                <path d={pathDeathFamine} fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />

                {/* Courbe 4 : Décès par Canicules mortelles (Rouge fluo bien visible) */}
                <path d={pathDeathThermal} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />

                {/* COURBES DE COMPARAISON TRAJECTOIRE B (Pointillés colorés) */}
                {isCompareMode && visibleCompareTrajectory.length > 0 && (
                  <g className="compare-layer">
                    {/* Pop B (Vert Émeraude pointillé) */}
                    <path d={pathPopB} fill="none" stroke="#34d399" strokeWidth="2.2" strokeDasharray="5 3" strokeLinecap="round" />
                    {/* Canicules B (Rose/Rouge pointillé) */}
                    <path d={pathDeathThermalB} fill="none" stroke="#fb7185" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
                  </g>
                )}

                {/* Mini-légende de comparaison intégrée */}
                {isCompareMode && (
                  <g className="select-none pointer-events-none">
                    <rect x={W - PAD.right - 136} y={PAD.top + 2} width="134" height="23" rx="3" fill="#080c14" fillOpacity="0.85" stroke="#1e293b" strokeWidth="0.8" />
                    <line x1={W - PAD.right - 130} y1={PAD.top + 8} x2={W - PAD.right - 114} y2={PAD.top + 8} stroke="#ffffff" strokeWidth="2" />
                    <text x={W - PAD.right - 110} y={PAD.top + 10} fill="#e2e8f0" fontSize="6.8" fontFamily="sans-serif">A: {scenarioA?.shortName ?? 'Actuel'}</text>
                    <line x1={W - PAD.right - 130} y1={PAD.top + 17} x2={W - PAD.right - 114} y2={PAD.top + 17} stroke="#34d399" strokeWidth="2" strokeDasharray="4 2" />
                    <text x={W - PAD.right - 110} y={PAD.top + 19} fill="#34d399" fontSize="6.8" fontFamily="sans-serif">B: {scenarioB?.shortName ?? 'Sobriété'}</text>
                  </g>
                )}

                {/* Marqueur interactif sur la courbe des canicules pour voir le nombre exact */}
                <g>
                  <circle
                    cx={currentX}
                    cy={getYDeath(displayState.worldDeathsAnnual.thermal)}
                    r="4"
                    fill="#ef4444"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  {/* Badge d'annotation lisible sur le point rouge */}
                  <rect
                    x={Math.max(PAD.left, Math.min(W - PAD.right - 54, currentX + 6))}
                    y={Math.max(PAD.top, getYDeath(displayState.worldDeathsAnnual.thermal) - 16)}
                    width="50"
                    height="12"
                    rx="3"
                    fill="#991b1b"
                  />
                  <text
                    x={Math.max(PAD.left + 25, Math.min(W - PAD.right - 29, currentX + 31))}
                    y={Math.max(PAD.top + 8.5, getYDeath(displayState.worldDeathsAnnual.thermal) - 7.5)}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="7.5"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    🔴 {displayState.worldDeathsAnnual.thermal >= 1 ? displayState.worldDeathsAnnual.thermal.toFixed(1) + 'M' : Math.round(displayState.worldDeathsAnnual.thermal * 1000) + 'k'}
                  </text>
                </g>

                {/* Marqueur sur la population */}
                <circle
                  cx={currentX}
                  cy={getYPop(displayState.worldPopulation)}
                  r="4"
                  fill="#38bdf8"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />

                {/* Marqueur sur la population B si comparaison */}
                {isCompareMode && displayStateB && (
                  <circle
                    cx={currentX}
                    cy={getYPop(displayStateB.worldPopulation)}
                    r="3.5"
                    fill="#34d399"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                  />
                )}
              </svg>
            </div>

            {/* Légende détaillée sous le graphique */}
            <div className="flex flex-col gap-1 text-[10.5px] text-slate-300 pt-1 border-t border-slate-800/80">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>⚪ <strong>Ligne blanche :</strong> Population mondiale ({(displayState.worldPopulation / 1000).toFixed(2)} Mds)</span>
                <span>🟣 <strong>Ligne violette :</strong> Tous décès confondus ({displayState.worldDeathsAnnual.total.toFixed(1)} M/an)</span>
                <span>🟠 <strong>Ligne orange :</strong> Famines ({displayState.worldDeathsAnnual.famine.toFixed(1)} M/an)</span>
              </div>
              <div className="bg-rose-950/40 border border-rose-900/60 rounded p-1.5 text-rose-200 text-[10px]">
                🔴 <strong>Ligne rouge (Canicules mortelles) :</strong> {thermalDeathsFormatted} à l'année {displayYear}. 
                Ces décès surviennent lorsque la chaleur humide (thermomètre mouillé Tw) franchit 31°C, empêchant le corps d'évacuer sa chaleur par la transpiration.
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* GRAPHIQUE 2 : ÉNERGIE & PÉTROLE (Clarifié : multiplicateur x12 au lieu de 12:1) */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'energy') && (
          <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">
                  2. Énergie &amp; Pétrole : Multiplicateur d'Énergie et Part Utile pour la Société
                </span>
                <span className="text-[10.5px] font-mono text-slate-400 font-semibold">
                  Année {displayYear}
                </span>
              </div>

              {/* Indicateurs numériques sans jargon */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] font-mono mt-0.5">
                <span className="text-amber-300 font-bold bg-amber-950/70 border border-amber-800/80 px-1.5 py-0.5 rounded flex items-center gap-1" title="Multiplicateur d'énergie EROI : Nombre de barils récoltés pour 1 baril dépensé à forer">
                  Multiplicateur pétrole : x{displayState.currentEroi >= 20 ? Math.round(displayState.currentEroi) : displayState.currentEroi.toFixed(1)} ({displayState.currentEroi >= 20 ? Math.round(displayState.currentEroi) : displayState.currentEroi.toFixed(1)} barils pour 1 dépensé)
                  <TechTooltip term="eroi" showIconOnly />
                </span>
                <span className="text-emerald-400 font-semibold">
                  Énergie utile société : {(displayState.netEnergyRatio * 100).toFixed(0)}%
                </span>
                <span className="text-sky-300 flex items-center gap-1">
                  Engrais de synthèse : {(displayState.haberBoschNitrogenFactor * 100).toFixed(0)}%
                  <TechTooltip term="haber-bosch" showIconOnly />
                </span>
              </div>

              {/* Ligne comparative Trajectoire B si activée */}
              {isCompareMode && displayStateB && (
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80 text-[10px] font-mono text-emerald-300">
                  <span className="font-bold flex items-center gap-1 text-emerald-400">
                    <GitCompare className="w-3 h-3 text-emerald-400" />
                    {scenarioB?.shortName ?? 'Trajectoire B (Sobriété)'} :
                  </span>
                  <span className="bg-emerald-950/70 border border-emerald-800/80 px-1.5 py-0.5 rounded font-semibold text-emerald-300">
                    EROI : x{displayStateB.currentEroi >= 20 ? Math.round(displayStateB.currentEroi) : displayStateB.currentEroi.toFixed(1)}
                  </span>
                  <span className="bg-emerald-950/70 border border-emerald-800/80 px-1.5 py-0.5 rounded font-semibold text-emerald-300">
                    Énergie utile : {(displayStateB.netEnergyRatio * 100).toFixed(0)}%
                  </span>
                  <span className="bg-emerald-950/70 border border-emerald-800/80 px-1.5 py-0.5 rounded font-semibold text-emerald-300">
                    Engrais / Azote : {(displayStateB.haberBoschNitrogenFactor * 100).toFixed(0)}%
                  </span>
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-400 leading-tight">
              Pour 1 baril consommé à forer et raffiner, combien de barils d'énergie récolte-t-on ? (En 1900 : x100. En 2026 : x12. En dessous de x5, la société n'a plus assez d'énergie nette pour faire rouler ses camions).
            </p>

            {/* SVG Graphique 2 */}
            <div className="relative w-full aspect-[540/205] bg-[#070b12] rounded-lg border border-slate-900 overflow-hidden cursor-crosshair">
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="w-full h-full"
                onClick={handleSvgClick}
                onMouseMove={handleSvgHover}
                onMouseLeave={() => setHoverYear(null)}
              >
                {/* Axe vertical gauche : Multiplicateur EROI (exprimé en x100, x50, x20, x10, x1) */}
                <text x={PAD.left - 6} y={PAD.top + 4} fill="#f59e0b" fontSize="8" textAnchor="end" fontFamily="monospace">x{eroiMax}</text>
                <text x={PAD.left - 6} y={getYEroi(20) + 3} fill="#f59e0b" fontSize="8" textAnchor="end" fontFamily="monospace">x20</text>
                <text x={PAD.left - 6} y={getYEroi(10) + 3} fill="#f59e0b" fontSize="8" textAnchor="end" fontFamily="monospace">x10</text>
                <text x={PAD.left - 6} y={PAD.top + plotH} fill="#f59e0b" fontSize="8" textAnchor="end" fontFamily="monospace">x1</text>

                {/* Axe vertical droit : Pourcentage (0 à 100%) */}
                <text x={W - PAD.right + 6} y={PAD.top + 4} fill="#10b981" fontSize="8" textAnchor="start" fontFamily="monospace">100%</text>
                <text x={W - PAD.right + 6} y={PAD.top + plotH / 2 + 3} fill="#10b981" fontSize="8" textAnchor="start" fontFamily="monospace">50%</text>
                <text x={W - PAD.right + 6} y={PAD.top + plotH} fill="#10b981" fontSize="8" textAnchor="start" fontFamily="monospace">0%</text>

                {/* Ligne de seuil d'alerte : Moins de 10 barils pour 1 dépensé (x10) */}
                <line
                  x1={PAD.left}
                  y1={getYEroi(10)}
                  x2={W - PAD.right}
                  y2={getYEroi(10)}
                  stroke="#ef4444"
                  strokeWidth="1"
                  strokeDasharray="4,3"
                  opacity="0.6"
                />
                <text
                  x={W - PAD.right - 4}
                  y={getYEroi(10) - 3}
                  textAnchor="end"
                  fill="#ef4444"
                  fontSize="7"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                >
                  Seuil critique société moderne : moins de 10 barils obtenus pour 1 dépensé (x10)
                </text>

                {/* Axe des abscisses */}
                {renderAbscisseAxis()}

                {/* Courbe 1 : Multiplicateur EROI (Jaune) */}
                <path d={pathEroi} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />

                {/* Courbe 2 : Énergie nette civile restante (Verte) */}
                <path d={pathNetEnergy} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />

                {/* Courbe 3 : Engrais de synthèse Haber-Bosch (Pointillé bleu) */}
                <path d={pathHaberBosch} fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="4,3" strokeLinecap="round" />

                {/* COURBES DE COMPARAISON TRAJECTOIRE B */}
                {isCompareMode && visibleCompareTrajectory.length > 0 && (
                  <g className="compare-layer">
                    {/* EROI B (Vert émeraude pointillé) */}
                    <path d={pathEroiB} fill="none" stroke="#34d399" strokeWidth="2.2" strokeDasharray="5 3" strokeLinecap="round" />
                    {/* Énergie nette B */}
                    <path d={pathNetEnergyB} fill="none" stroke="#6ee7b7" strokeWidth="1.8" strokeDasharray="3 3" strokeLinecap="round" />
                  </g>
                )}

                {/* Mini-légende de comparaison intégrée */}
                {isCompareMode && (
                  <g className="select-none pointer-events-none">
                    <rect x={W - PAD.right - 136} y={PAD.top + 2} width="134" height="23" rx="3" fill="#080c14" fillOpacity="0.85" stroke="#1e293b" strokeWidth="0.8" />
                    <line x1={W - PAD.right - 130} y1={PAD.top + 8} x2={W - PAD.right - 114} y2={PAD.top + 8} stroke="#f59e0b" strokeWidth="2" />
                    <text x={W - PAD.right - 110} y={PAD.top + 10} fill="#e2e8f0" fontSize="6.8" fontFamily="sans-serif">A: {scenarioA?.shortName ?? 'Actuel'}</text>
                    <line x1={W - PAD.right - 130} y1={PAD.top + 17} x2={W - PAD.right - 114} y2={PAD.top + 17} stroke="#34d399" strokeWidth="2" strokeDasharray="4 2" />
                    <text x={W - PAD.right - 110} y={PAD.top + 19} fill="#34d399" fontSize="6.8" fontFamily="sans-serif">B: {scenarioB?.shortName ?? 'Sobriété'}</text>
                  </g>
                )}

                {/* Marqueur interactif sur le multiplicateur pétrolier */}
                <circle
                  cx={currentX}
                  cy={getYEroi(displayState.currentEroi)}
                  r="4"
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />

                {/* Marqueur sur l'EROI B si comparaison */}
                {isCompareMode && displayStateB && (
                  <circle
                    cx={currentX}
                    cy={getYEroi(displayStateB.currentEroi)}
                    r="3.5"
                    fill="#34d399"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                  />
                )}
                <rect
                  x={Math.max(PAD.left, Math.min(W - PAD.right - 42, currentX - 21))}
                  y={getYEroi(displayState.currentEroi) - 16}
                  width="42"
                  height="12"
                  rx="3"
                  fill="#78350f"
                />
                <text
                  x={Math.max(PAD.left + 21, Math.min(W - PAD.right - 21, currentX))}
                  y={getYEroi(displayState.currentEroi) - 7.5}
                  textAnchor="middle"
                  fill="#fef3c7"
                  fontSize="7.5"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  x{displayState.currentEroi >= 20 ? Math.round(displayState.currentEroi) : displayState.currentEroi.toFixed(1)}
                </text>
              </svg>
            </div>

            {/* Légende explicative limpide */}
            <div className="flex flex-col gap-1 text-[10.5px] text-slate-300 pt-1 border-t border-slate-800/80">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>🟡 <strong>Ligne jaune :</strong> Multiplicateur pétrole (x{displayState.currentEroi >= 20 ? Math.round(displayState.currentEroi) : displayState.currentEroi.toFixed(1)} barils extraits pour 1 baril consommé à forer)</span>
                <span>🟢 <strong>Ligne verte :</strong> Énergie utile disponible pour la société ({(displayState.netEnergyRatio * 100).toFixed(0)}%)</span>
                <span>🔵 <strong>Pointillé bleu :</strong> Engrais chimiques agricoles Haber-Bosch ({(displayState.haberBoschNitrogenFactor * 100).toFixed(0)}%)</span>
              </div>
              <p className="text-[10px] text-amber-200/90 bg-amber-950/30 p-1.5 rounded border border-amber-900/50">
                💡 <strong>Pourquoi ce chiffre baisse-t-il ?</strong> Les premiers gisements (1900) étaient sous pression naturelle et peu profonds (rendement x100). Aujourd'hui, il faut forer à 3 000 mètres sous les océans ou fracturer la roche étanche, ce qui dévore d'immenses quantités d'énergie rien que pour forer.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* GRAPHIQUE 3 : CLIMAT & OCÉANS (Point 2 : Montée de la mer chiffrée avec échelle) */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'climate') && (
          <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">
                  3. Réchauffement Mondial, Gaz à Effet de Serre &amp; Montée des Océans
                </span>
                <span className="text-[10.5px] font-mono text-slate-400 font-semibold">
                  Année {displayYear}
                </span>
              </div>

              {/* Chiffres précis dont la montée du niveau des mers */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] font-mono mt-0.5">
                <span className="text-cyan-400 font-semibold">
                  CO2 dans l'air : {Math.round(displayState.atmosphericCo2Ppm)} ppm
                </span>
                <span className="text-rose-400 font-semibold flex items-center gap-1">
                  Réchauffement : {displayState.surfaceTemperatureAnomaly >= 0 ? '+' : ''}{displayState.surfaceTemperatureAnomaly.toFixed(2)}°C
                  <TechTooltip term="fair" showIconOnly />
                </span>
                {/* Montée des mers mise en avant de manière évidente */}
                <span className="text-sky-300 font-bold bg-sky-950/80 border border-sky-800/80 px-2 py-0.5 rounded flex items-center gap-1">
                  🌊 Montée des océans : {seaLevelCm >= 0 ? '+' : ''}{seaLevelCm} cm ({seaLevelVs2026 >= 0 ? `+${seaLevelVs2026} cm depuis 2026` : `${seaLevelVs2026} cm vs 2026`})
                  <TechTooltip term="slr" showIconOnly />
                </span>
              </div>

              {/* Ligne comparative Trajectoire B si activée */}
              {isCompareMode && displayStateB && (
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80 text-[10px] font-mono text-emerald-300">
                  <span className="font-bold flex items-center gap-1 text-emerald-400">
                    <GitCompare className="w-3 h-3 text-emerald-400" />
                    {scenarioB?.shortName ?? 'Trajectoire B (Sobriété)'} :
                  </span>
                  <span className="bg-emerald-950/70 border border-emerald-800/80 px-1.5 py-0.5 rounded font-semibold text-cyan-300">
                    CO2 : {Math.round(displayStateB.atmosphericCo2Ppm)} ppm
                  </span>
                  <span className="bg-emerald-950/70 border border-emerald-800/80 px-1.5 py-0.5 rounded font-semibold text-rose-300">
                    Réchauffement : +{displayStateB.surfaceTemperatureAnomaly.toFixed(2)}°C
                  </span>
                  <span className="bg-emerald-950/70 border border-emerald-800/80 px-1.5 py-0.5 rounded font-semibold text-sky-300">
                    Océans : +{seaLevelCmB} cm ({seaLevelCmB - seaLevelCm >= 0 ? `+${seaLevelCmB - seaLevelCm}` : `${seaLevelCmB - seaLevelCm}`} cm)
                  </span>
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-400 leading-tight">
              CO2 dans l'atmosphère (axe gauche), température mondiale depuis 1850 (axe droit) et élévation des océans (pointillé bleu chiffré en cm).
            </p>

            {/* SVG Graphique 3 */}
            <div className="relative w-full aspect-[540/205] bg-[#070b12] rounded-lg border border-slate-900 overflow-hidden cursor-crosshair">
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="w-full h-full"
                onClick={handleSvgClick}
                onMouseMove={handleSvgHover}
                onMouseLeave={() => setHoverYear(null)}
              >
                {/* Axe vertical gauche : Concentration de CO2 (ppm) */}
                <text x={PAD.left - 6} y={PAD.top + 4} fill="#22d3ee" fontSize="8" textAnchor="end" fontFamily="monospace">750 ppm</text>
                <text x={PAD.left - 6} y={PAD.top + plotH / 2 + 3} fill="#22d3ee" fontSize="8" textAnchor="end" fontFamily="monospace">500</text>
                <text x={PAD.left - 6} y={PAD.top + plotH} fill="#22d3ee" fontSize="8" textAnchor="end" fontFamily="monospace">{co2Min} ppm</text>

                {/* Axe vertical droit : Anomalie thermique (°C) */}
                <text x={W - PAD.right + 6} y={PAD.top + 4} fill="#f43f5e" fontSize="8" textAnchor="start" fontFamily="monospace">+5.0°C</text>
                <text x={W - PAD.right + 6} y={getYTemp(2.0) + 3} fill="#f43f5e" fontSize="8" textAnchor="start" fontFamily="monospace">+2.0°C</text>
                <text x={W - PAD.right + 6} y={PAD.top + plotH} fill="#f43f5e" fontSize="8" textAnchor="start" fontFamily="monospace">{tempMin >= 0 ? `+${tempMin}` : tempMin}°C</text>

                {/* Repères horizontaux pour la montée des océans (+75 cm, +50 cm, +25 cm, 0 cm) */}
                <line x1={PAD.left} y1={getYSlr(0.75)} x2={W - PAD.right} y2={getYSlr(0.75)} stroke="#0284c7" strokeWidth="0.6" strokeDasharray="2,4" opacity="0.5" />
                <text x={PAD.left + 4} y={getYSlr(0.75) - 2} fill="#38bdf8" fontSize="6.5" opacity="0.8">Repère océan : +75 cm</text>

                <line x1={PAD.left} y1={getYSlr(0.25)} x2={W - PAD.right} y2={getYSlr(0.25)} stroke="#0284c7" strokeWidth="0.6" strokeDasharray="2,4" opacity="0.5" />
                <text x={PAD.left + 4} y={getYSlr(0.25) - 2} fill="#38bdf8" fontSize="6.5" opacity="0.8">Repère océan : +25 cm</text>

                {/* Ligne seuil Accord de Paris +1.5°C et +2.0°C */}
                <line x1={PAD.left} y1={getYTemp(1.5)} x2={W - PAD.right} y2={getYTemp(1.5)} stroke="#f43f5e" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.4" />
                <line x1={PAD.left} y1={getYTemp(2.0)} x2={W - PAD.right} y2={getYTemp(2.0)} stroke="#f43f5e" strokeWidth="1" strokeDasharray="4,3" opacity="0.6" />

                {/* Axe des abscisses */}
                {renderAbscisseAxis()}

                {/* Courbe 1 : CO2 Atmosphérique (Cyan) */}
                <path d={pathCo2} fill="none" stroke="#22d3ee" strokeWidth="2.2" strokeLinecap="round" />

                {/* Courbe 2 : Température Globale FaIR (Rouge/Rose) */}
                <path d={pathTemp} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />

                {/* Courbe 3 : Montée des Océans (Pointillé bleu épais et visible) */}
                <path d={pathSlr} fill="none" stroke="#38bdf8" strokeWidth="2.4" strokeDasharray="5,3" strokeLinecap="round" />

                {/* COURBES DE COMPARAISON TRAJECTOIRE B */}
                {isCompareMode && visibleCompareTrajectory.length > 0 && (
                  <g className="compare-layer">
                    {/* Température B (Vert émeraude pointillé) */}
                    <path d={pathTempB} fill="none" stroke="#34d399" strokeWidth="2.2" strokeDasharray="5 3" strokeLinecap="round" />
                    {/* Montée de la mer B (Bleu ciel fin pointillé) */}
                    <path d={pathSlrB} fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="2 3" strokeLinecap="round" />
                  </g>
                )}

                {/* Mini-légende de comparaison intégrée */}
                {isCompareMode && (
                  <g className="select-none pointer-events-none">
                    <rect x={W - PAD.right - 136} y={PAD.top + 2} width="134" height="23" rx="3" fill="#080c14" fillOpacity="0.85" stroke="#1e293b" strokeWidth="0.8" />
                    <line x1={W - PAD.right - 130} y1={PAD.top + 8} x2={W - PAD.right - 114} y2={PAD.top + 8} stroke="#f43f5e" strokeWidth="2" />
                    <text x={W - PAD.right - 110} y={PAD.top + 10} fill="#e2e8f0" fontSize="6.8" fontFamily="sans-serif">A: {scenarioA?.shortName ?? 'Actuel'}</text>
                    <line x1={W - PAD.right - 130} y1={PAD.top + 17} x2={W - PAD.right - 114} y2={PAD.top + 17} stroke="#34d399" strokeWidth="2" strokeDasharray="4 2" />
                    <text x={W - PAD.right - 110} y={PAD.top + 19} fill="#34d399" fontSize="6.8" fontFamily="sans-serif">B: {scenarioB?.shortName ?? 'Sobriété'}</text>
                  </g>
                )}

                {/* Marqueur interactif sur la température B si comparaison */}
                {isCompareMode && displayStateB && (
                  <circle
                    cx={currentX}
                    cy={getYTemp(displayStateB.surfaceTemperatureAnomaly)}
                    r="3.5"
                    fill="#34d399"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                  />
                )}

                {/* Marqueur interactif sur la montée des océans avec badge en cm */}
                <g>
                  <circle
                    cx={currentX}
                    cy={getYSlr(displayState.seaLevelRiseMeters)}
                    r="4.5"
                    fill="#0284c7"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <rect
                    x={Math.max(PAD.left, Math.min(W - PAD.right - 54, currentX - 27))}
                    y={Math.max(PAD.top, getYSlr(displayState.seaLevelRiseMeters) - 17)}
                    width="54"
                    height="13"
                    rx="3"
                    fill="#0369a1"
                  />
                  <text
                    x={Math.max(PAD.left + 27, Math.min(W - PAD.right - 27, currentX))}
                    y={Math.max(PAD.top + 9, getYSlr(displayState.seaLevelRiseMeters) - 7.5)}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="7.8"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    🌊 {seaLevelCm >= 0 ? '+' : ''}{seaLevelCm} cm
                  </text>
                </g>
              </svg>
            </div>

            {/* Légende avec explication claire de la montée */}
            <div className="flex flex-col gap-1 text-[10.5px] text-slate-300 pt-1 border-t border-slate-800/80">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>🔵 <strong>Ligne cyan :</strong> Concentration de CO2 ({Math.round(displayState.atmosphericCo2Ppm)} ppm)</span>
                <span>🔴 <strong>Ligne rouge :</strong> Réchauffement (+{displayState.surfaceTemperatureAnomaly.toFixed(2)}°C depuis 1850)</span>
              </div>
              <div className="bg-sky-950/40 border border-sky-900/60 rounded p-1.5 text-sky-200 text-[10px]">
                🌊 <strong>Pointillé bleu (Montée des océans) :</strong> {seaLevelCm >= 0 ? '+' : ''}{seaLevelCm} cm mesurés à cette date (soit {seaLevelVs2026 >= 0 ? `+${seaLevelVs2026} cm de plus qu'aujourd'hui` : `${seaLevelVs2026} cm par rapport à aujourd'hui`}, projection jusqu'à +75 cm en 2100).
                <br />
                Chaque tranche de 10 cm supplémentaire noie les deltas côtiers très fertiles (Mékong, Bangladesh, Nil) et salinise les réserves d'eau douce souterraines.
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* GRAPHIQUE 4 : AGRONOMIE & ALIMENTATION */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'agri') && (
          <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">
                  4. Disponibilité Alimentaire Mondiale &amp; Rendements des Terres
                </span>
                <span className="text-[10.5px] font-mono text-slate-400 font-semibold">
                  Année {displayYear}
                </span>
              </div>

              {/* Indicateurs numériques */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] font-mono mt-0.5">
                <span className="text-emerald-400 font-semibold">
                  Nourriture par jour : {Math.round(displayState.globalAverageCaloriesPerCapita)} kcal/hab
                </span>
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  Rendement moyen mondial : {(displayState.globalCropYieldComposite * 100).toFixed(0)}% du pic
                  <TechTooltip term="haber-bosch" showIconOnly />
                </span>
                <span className="text-rose-400 font-semibold">
                  Seuil de famine ONU : 2 100 kcal
                </span>
              </div>

              {/* Ligne comparative Trajectoire B si activée */}
              {isCompareMode && displayStateB && (
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80 text-[10px] font-mono text-emerald-300">
                  <span className="font-bold flex items-center gap-1 text-emerald-400">
                    <GitCompare className="w-3 h-3 text-emerald-400" />
                    {scenarioB?.shortName ?? 'Trajectoire B (Sobriété)'} :
                  </span>
                  <span className="bg-emerald-950/70 border border-emerald-800/80 px-1.5 py-0.5 rounded font-semibold text-emerald-300">
                    Calories : {Math.round(displayStateB.globalAverageCaloriesPerCapita)} kcal/hab
                  </span>
                  <span className="bg-emerald-950/70 border border-emerald-800/80 px-1.5 py-0.5 rounded font-semibold text-amber-300">
                    Rendement : {(displayStateB.globalCropYieldComposite * 100).toFixed(0)}% du pic
                  </span>
                  <span className="text-slate-400 text-[9.5px]">
                    (Écart : {Math.round(displayStateB.globalAverageCaloriesPerCapita - displayState.globalAverageCaloriesPerCapita) >= 0 ? '+' : ''}{Math.round(displayStateB.globalAverageCaloriesPerCapita - displayState.globalAverageCaloriesPerCapita)} kcal/j)
                  </span>
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-400 leading-tight">
              Calories quotidiennes disponibles par être humain comparées au minimum vital absolu de 2 100 kcal/jour fixé par l'Organisation des Nations Unies.
            </p>

            {/* SVG Graphique 4 */}
            <div className="relative w-full aspect-[540/205] bg-[#070b12] rounded-lg border border-slate-900 overflow-hidden cursor-crosshair">
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="w-full h-full"
                onClick={handleSvgClick}
                onMouseMove={handleSvgHover}
                onMouseLeave={() => setHoverYear(null)}
              >
                {/* Axe vertical gauche : Calories (kcal/jour) */}
                <text x={PAD.left - 6} y={PAD.top + 4} fill="#10b981" fontSize="8" textAnchor="end" fontFamily="monospace">3500</text>
                <text x={PAD.left - 6} y={yCalorie2100 + 3} fill="#ef4444" fontSize="8" textAnchor="end" fontFamily="monospace">2100</text>
                <text x={PAD.left - 6} y={PAD.top + plotH} fill="#10b981" fontSize="8" textAnchor="end" fontFamily="monospace">1200 kcal</text>

                {/* Axe vertical droit : Rendements (0.1 à 1.2) */}
                <text x={W - PAD.right + 6} y={PAD.top + 4} fill="#f59e0b" fontSize="8" textAnchor="start" fontFamily="monospace">120%</text>
                <text x={W - PAD.right + 6} y={getYYield(1.0) + 3} fill="#f59e0b" fontSize="8" textAnchor="start" fontFamily="monospace">100%</text>
                <text x={W - PAD.right + 6} y={PAD.top + plotH} fill="#f59e0b" fontSize="8" textAnchor="start" fontFamily="monospace">10%</text>

                {/* Ligne rouge ONU du seuil de malnutrition aiguë (2100 kcal) */}
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
                  fill="#ef4444"
                  fontSize="7"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                >
                  Seuil de malnutrition aiguë sévère ONU (2100 kcal / jour)
                </text>

                {/* Axe des abscisses */}
                {renderAbscisseAxis()}

                {/* Courbe 1 : Calories par habitant (Verte) */}
                <path d={pathCal} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />

                {/* Courbe 2 : Rendements agricoles combinés (Ambre) */}
                <path d={pathCropYield} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,2" strokeLinecap="round" />

                {/* COURBES DE COMPARAISON TRAJECTOIRE B */}
                {isCompareMode && visibleCompareTrajectory.length > 0 && (
                  <g className="compare-layer">
                    {/* Calories B (Vert émeraude vif pointillé) */}
                    <path d={pathCalB} fill="none" stroke="#34d399" strokeWidth="2.2" strokeDasharray="5 3" strokeLinecap="round" />
                    {/* Rendements B (Ambre clair pointillé) */}
                    <path d={pathCropYieldB} fill="none" stroke="#fcd34d" strokeWidth="1.8" strokeDasharray="3 3" strokeLinecap="round" />
                  </g>
                )}

                {/* Mini-légende de comparaison intégrée */}
                {isCompareMode && (
                  <g className="select-none pointer-events-none">
                    <rect x={W - PAD.right - 136} y={PAD.top + 2} width="134" height="23" rx="3" fill="#080c14" fillOpacity="0.85" stroke="#1e293b" strokeWidth="0.8" />
                    <line x1={W - PAD.right - 130} y1={PAD.top + 8} x2={W - PAD.right - 114} y2={PAD.top + 8} stroke="#10b981" strokeWidth="2" />
                    <text x={W - PAD.right - 110} y={PAD.top + 10} fill="#e2e8f0" fontSize="6.8" fontFamily="sans-serif">A: {scenarioA?.shortName ?? 'Actuel'}</text>
                    <line x1={W - PAD.right - 130} y1={PAD.top + 17} x2={W - PAD.right - 114} y2={PAD.top + 17} stroke="#34d399" strokeWidth="2" strokeDasharray="4 2" />
                    <text x={W - PAD.right - 110} y={PAD.top + 19} fill="#34d399" fontSize="6.8" fontFamily="sans-serif">B: {scenarioB?.shortName ?? 'Sobriété'}</text>
                  </g>
                )}

                {/* Marqueur interactif sur les calories B si comparaison */}
                {isCompareMode && displayStateB && (
                  <circle
                    cx={currentX}
                    cy={getYCal(displayStateB.globalAverageCaloriesPerCapita)}
                    r="3.5"
                    fill="#34d399"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                  />
                )}

                {/* Marqueur interactif sur les calories */}
                <circle
                  cx={currentX}
                  cy={getYCal(displayState.globalAverageCaloriesPerCapita)}
                  r="4"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <rect
                  x={Math.max(PAD.left, Math.min(W - PAD.right - 46, currentX - 23))}
                  y={getYCal(displayState.globalAverageCaloriesPerCapita) - 16}
                  width="46"
                  height="12"
                  rx="3"
                  fill="#064e3b"
                />
                <text
                  x={Math.max(PAD.left + 23, Math.min(W - PAD.right - 23, currentX))}
                  y={getYCal(displayState.globalAverageCaloriesPerCapita) - 7.5}
                  textAnchor="middle"
                  fill="#a7f3d0"
                  fontSize="7.5"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {Math.round(displayState.globalAverageCaloriesPerCapita)} kcal
                </text>
              </svg>
            </div>

            {/* Légende */}
            <div className="flex flex-col gap-1 text-[10.5px] text-slate-300 pt-1 border-t border-slate-800/80">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>🟢 <strong>Ligne verte :</strong> Ration alimentaire moyenne ({Math.round(displayState.globalAverageCaloriesPerCapita)} kcal/habitant/jour)</span>
                <span>🟠 <strong>Pointillé ambre :</strong> Rendements mondiaux des récoltes ({(displayState.globalCropYieldComposite * 100).toFixed(0)}%)</span>
                <span>🔴 <strong>Ligne rouge pointillée :</strong> Seuil vital de subsistance ONU (2 100 kcal)</span>
              </div>
              <p className="text-[10px] text-slate-400">
                La chute calorique résulte de l'effet ciseau : baisse des engrais chimiques azotés (crise du gaz) combinée aux sécheresses et canicules sur les grands bassins céréaliers.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
