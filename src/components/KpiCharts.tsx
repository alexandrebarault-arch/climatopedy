import React, { useState } from 'react';
import { Calendar, Info, Clock, AlertTriangle } from 'lucide-react';
import { GlobalBiophysicalState } from '../types/simulation';

interface KpiChartsProps {
  trajectory: GlobalBiophysicalState[];
  currentYear: number;
  onSeekYear: (year: number) => void;
}

export const KpiCharts: React.FC<KpiChartsProps> = ({
  trajectory,
  currentYear,
  onSeekYear
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'demo' | 'energy' | 'climate' | 'agri'>('all');
  const [hoverYear, setHoverYear] = useState<number | null>(null);

  // Helper pour mapper l'axe des abscisses (Années [2026..2100]) vers les coordonnées X [0..W]
  const W = 520;
  const H = 185;
  const PAD = { top: 24, right: 38, bottom: 42, left: 46 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const getX = (year: number) => {
    return PAD.left + ((year - 2026) / (2100 - 2026)) * plotW;
  };

  const currentX = getX(currentYear);
  const hoverX = hoverYear !== null ? getX(hoverYear) : null;

  // Repères d'années sur l'axe des abscisses
  const X_TICKS = [2026, 2035, 2050, 2065, 2080, 2100];
  const X_GRID = [2030, 2040, 2050, 2060, 2070, 2080, 2090, 2100];

  // =========================================================
  // 1. DÉMOGRAPHIE & MORTALITÉS
  // =========================================================
  const popMin = 3.0; // Mds
  const popMax = 10.5; // Mds
  const getYPop = (popMillions: number) => {
    const popB = popMillions / 1000;
    return PAD.top + plotH - ((popB - popMin) / (popMax - popMin)) * plotH;
  };

  const pathPop = trajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYPop(pt.worldPopulation).toFixed(1)}`).join(' ');

  const deathMax = 220; // Millions / an
  const getYDeath = (deathsM: number) => {
    return PAD.top + plotH - (deathsM / deathMax) * plotH;
  };
  const pathDeathThermal = trajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYDeath(pt.worldDeathsAnnual.thermal).toFixed(1)}`).join(' ');
  const pathDeathFamine = trajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYDeath(pt.worldDeathsAnnual.famine).toFixed(1)}`).join(' ');
  const pathDeathTotal = trajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYDeath(pt.worldDeathsAnnual.total).toFixed(1)}`).join(' ');

  // =========================================================
  // 2. ÉNERGIE & EROI
  // =========================================================
  const eroiMax = 35;
  const getYEroi = (eroi: number) => {
    return PAD.top + plotH - (eroi / eroiMax) * plotH;
  };
  const pathEroi = trajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYEroi(pt.currentEroi).toFixed(1)}`).join(' ');

  const getYPct = (val0to1: number) => {
    return PAD.top + plotH - val0to1 * plotH;
  };
  const pathNetEnergy = trajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYPct(pt.netEnergyRatio).toFixed(1)}`).join(' ');
  const pathHaberBosch = trajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYPct(pt.haberBoschNitrogenFactor).toFixed(1)}`).join(' ');

  // =========================================================
  // 3. CLIMAT & OCÉANS
  // =========================================================
  const co2Min = 350;
  const co2Max = 750;
  const getYCo2 = (co2: number) => {
    return PAD.top + plotH - ((co2 - co2Min) / (co2Max - co2Min)) * plotH;
  };
  const pathCo2 = trajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYCo2(pt.atmosphericCo2Ppm).toFixed(1)}`).join(' ');

  const tempMin = 1.0;
  const tempMax = 5.0;
  const getYTemp = (temp: number) => {
    return PAD.top + plotH - ((temp - tempMin) / (tempMax - tempMin)) * plotH;
  };
  const pathTemp = trajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYTemp(pt.surfaceTemperatureAnomaly).toFixed(1)}`).join(' ');

  const slrMax = 1.2;
  const getYSlr = (slr: number) => {
    return PAD.top + plotH - (slr / slrMax) * plotH;
  };
  const pathSlr = trajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYSlr(pt.seaLevelRiseMeters).toFixed(1)}`).join(' ');

  // =========================================================
  // 4. AGRONOMIE & CALORIES
  // =========================================================
  const calMin = 1200;
  const calMax = 3500;
  const getYCal = (cal: number) => {
    return PAD.top + plotH - ((cal - calMin) / (calMax - calMin)) * plotH;
  };
  const pathCal = trajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYCal(pt.globalAverageCaloriesPerCapita).toFixed(1)}`).join(' ');
  const yCalorie2100 = getYCal(2100);

  const yieldMin = 0.1;
  const yieldMax = 1.2;
  const getYYield = (yVal: number) => {
    return PAD.top + plotH - ((yVal - yieldMin) / (yieldMax - yieldMin)) * plotH;
  };
  const pathCropYield = trajectory.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.year).toFixed(1)},${getYYield(pt.globalCropYieldComposite).toFixed(1)}`).join(' ');

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, (clickX - PAD.left) / plotW));
    const targetYear = Math.round(2026 + ratio * (2100 - 2026));
    onSeekYear(targetYear);
  };

  const handleSvgHover = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, (clickX - PAD.left) / plotW));
    const targetYear = Math.round(2026 + ratio * (2100 - 2026));
    setHoverYear(targetYear);
  };

  const currentState = trajectory.find(t => t.year === Math.floor(currentYear)) || trajectory[0];
  const displayState = trajectory.find(t => t.year === (hoverYear ?? Math.floor(currentYear))) || trajectory[0];

  // Rendu modulaire et complet de l'axe des abscisses (horizontal X) pour chaque graphique
  const renderAbscisseAxis = () => (
    <g className="select-none pointer-events-none">
      {/* Lignes de grille temporelle décennale */}
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

      {/* Ligne de base horizontale de l'abscisse */}
      <line
        x1={PAD.left}
        y1={PAD.top + plotH}
        x2={W - PAD.right}
        y2={PAD.top + plotH}
        stroke="#475569"
        strokeWidth="1.2"
      />

      {/* Graduations chiffrées de l'axe temporel */}
      {X_TICKS.map((yr) => {
        const x = getX(yr);
        const isToday = yr === 2026;
        const isHorizon = yr === 2050;
        return (
          <g key={`tick-x-${yr}`}>
            <line
              x1={x}
              y1={PAD.top + plotH}
              x2={x}
              y2={PAD.top + plotH + 4}
              stroke={isToday ? '#38bdf8' : isHorizon ? '#fbbf24' : '#64748b'}
              strokeWidth={isToday || isHorizon ? '1.5' : '1'}
            />
            <text
              x={x}
              y={PAD.top + plotH + 14}
              textAnchor={yr === 2026 ? 'start' : yr === 2100 ? 'end' : 'middle'}
              fill={isToday ? '#38bdf8' : isHorizon ? '#fbbf24' : '#94a3b8'}
              fontSize={isToday ? '8.5' : '7.8'}
              fontWeight={isToday || isHorizon ? '700' : '500'}
              fontFamily="monospace"
            >
              {isToday ? '2026 (Auj.)' : yr}
            </text>
          </g>
        );
      })}

      {/* Libellé explicite de l'abscisse */}
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
        Axe des abscisses (X) : Année calendaire simulée (2026 → 2100)
      </text>

      {/* Curseur de l'année courante avec étiquette haute */}
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
        y={PAD.top - 17}
        width="36"
        height="12"
        rx="3"
        fill="#0284c7"
      />
      <text
        x={Math.max(PAD.left + 16, Math.min(W - PAD.right - 18, currentX))}
        y={PAD.top - 8}
        textAnchor="middle"
        fill="#ffffff"
        fontSize="7.8"
        fontWeight="800"
        fontFamily="monospace"
      >
        {Math.floor(currentYear)}
      </text>

      {/* Repère de survol dynamique */}
      {hoverX !== null && hoverYear !== null && (
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
      {/* En-tête des graphiques avec filtrage par domaine */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-200">
              Trajectoires Biophysiques &amp; Rétroactions (2026–2100)
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Évolution temporelle couplée du système Terre · Cliquez sur un graphique pour caler la simulation à l'année voulue
          </p>
        </div>

        {/* Onglets de focalisation */}
        <div className="flex items-center gap-1 bg-[#121824] p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === 'all'
                ? 'bg-slate-700 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Vue d'Ensemble (4x)
          </button>
          <button
            onClick={() => setActiveTab('demo')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === 'demo'
                ? 'bg-purple-950/80 text-purple-300 font-medium border border-purple-800/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Démographie &amp; Décès
          </button>
          <button
            onClick={() => setActiveTab('energy')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === 'energy'
                ? 'bg-amber-950/80 text-amber-300 font-medium border border-amber-800/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Énergie &amp; EROI
          </button>
          <button
            onClick={() => setActiveTab('climate')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === 'climate'
                ? 'bg-cyan-950/80 text-cyan-300 font-medium border border-cyan-800/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Climat &amp; Océans
          </button>
          <button
            onClick={() => setActiveTab('agri')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === 'agri'
                ? 'bg-emerald-950/80 text-emerald-300 font-medium border border-emerald-800/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Agriculture &amp; Calories
          </button>
        </div>
      </div>

      {/* BANDEAU CLAIR EXPLICATIF : GUIDE DE L'ABSCISSE (X) */}
      <div className="bg-sky-950/30 border border-sky-800/50 rounded-lg p-2.5 flex items-start gap-2.5">
        <div className="p-1 rounded bg-sky-500/20 text-sky-400 shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-[11.5px] text-slate-300 leading-relaxed">
          <span className="font-semibold text-sky-300">Précision sur l'axe des abscisses (axe horizontal X) :</span>{' '}
          L'abscisse de chaque graphique représente <span className="text-white font-semibold">l'échelle du temps en années civiles, s'étendant de 2026 jusqu'à 2100</span>.{' '}
          Le bord gauche débute à <span className="text-sky-300 font-mono font-semibold">2026 (Aujourd'hui)</span>, point de départ de la simulation, et le curseur bleu vertical pointillé marque l'année courante (<span className="text-sky-300 font-mono font-bold">{Math.floor(currentYear)}</span>). Les ordonnées (Y) indiquent les grandeurs physiques correspondantes.
        </div>
      </div>

      {/* Grille des 4 graphiques scientifiques */}
      <div className={`grid gap-4 ${activeTab === 'all' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        {/* GRAPHIQUE 1 : DÉMOGRAPHIE MONDIALE & DÉCÈS */}
        {(activeTab === 'all' || activeTab === 'demo') && (
          <div className="bg-[#0e1422] rounded-lg border border-slate-800/90 p-3 flex flex-col">
            <div className="flex items-center justify-between mb-1 text-xs">
              <span className="font-semibold text-slate-200">
                1. Démographie Mondiale &amp; Décès par Cause
              </span>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span className="text-white flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-white inline-block" />
                  Pop: {(displayState.worldPopulation / 1000).toFixed(2)} Mds
                </span>
                <span className="text-purple-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />
                  Total Décès: {displayState.worldDeathsAnnual.total.toFixed(1)} M/an
                </span>
              </div>
            </div>

            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full h-auto cursor-crosshair select-none block"
              onClick={handleSvgClick}
              onMouseMove={handleSvgHover}
              onMouseLeave={() => setHoverYear(null)}
            >
              {/* Grille horizontale */}
              <line x1={PAD.left} y1={PAD.top} x2={W - PAD.right} y2={PAD.top} stroke="#1e293b" strokeWidth="0.8" />
              <line x1={PAD.left} y1={PAD.top + plotH / 2} x2={W - PAD.right} y2={PAD.top + plotH / 2} stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3,3" />

              {/* Axe vertical gauche (Pop en Mds) */}
              <text x={PAD.left - 6} y={PAD.top + 4} fill="#94a3b8" fontSize="8" textAnchor="end" fontFamily="monospace">10 Mds</text>
              <text x={PAD.left - 6} y={PAD.top + plotH / 2 + 3} fill="#94a3b8" fontSize="8" textAnchor="end" fontFamily="monospace">6.5</text>
              <text x={PAD.left - 6} y={PAD.top + plotH} fill="#94a3b8" fontSize="8" textAnchor="end" fontFamily="monospace">3 Mds</text>

              {/* Axe vertical droite (Décès en M/an) */}
              <text x={W - PAD.right + 6} y={PAD.top + 4} fill="#c084fc" fontSize="8" textAnchor="start" fontFamily="monospace">220M/an</text>
              <text x={W - PAD.right + 6} y={PAD.top + plotH} fill="#c084fc" fontSize="8" textAnchor="start" fontFamily="monospace">0M</text>

              {/* Courbes de mortalité et population */}
              {/* Décès famines (ambre) */}
              <path d={pathDeathFamine} fill="none" stroke="#f59e0b" strokeWidth="1.4" opacity="0.85" />
              {/* Décès thermiques létaux Stull Tw (rouge vif) */}
              <path d={pathDeathThermal} fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.85" />
              {/* Total décès annuels (violet) */}
              <path d={pathDeathTotal} fill="none" stroke="#c084fc" strokeWidth="1.8" />
              {/* Population mondiale (blanc continu) */}
              <path d={pathPop} fill="none" stroke="#ffffff" strokeWidth="2.5" />

              {/* Point courant sur la population */}
              <circle cx={currentX} cy={getYPop(currentState.worldPopulation)} r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />

              {/* Rendu complet de l'axe des abscisses (horizontal X) */}
              {renderAbscisseAxis()}
            </svg>

            {/* Légende du graphique */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 px-1">
              <span className="text-white font-medium">Ligne blanche : Population mondiale</span>
              <span className="text-amber-400">Ambre : Décès famines</span>
              <span className="text-rose-400">Rouge : Chaleur létale Tw</span>
              <span className="text-purple-300">Violet : Total décès annuels</span>
            </div>
          </div>
        )}

        {/* GRAPHIQUE 2 : ÉNERGIE & FEROI (FALAISE ÉNERGÉTIQUE) */}
        {(activeTab === 'all' || activeTab === 'energy') && (
          <div className="bg-[#0e1422] rounded-lg border border-slate-800/90 p-3 flex flex-col">
            <div className="flex items-center justify-between mb-1 text-xs">
              <span className="font-semibold text-slate-200">
                2. Falaise de l'EROI &amp; Énergie Nette Disponible
              </span>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span className="text-amber-400">
                  EROI: {displayState.currentEroi.toFixed(1)}:1
                </span>
                <span className="text-emerald-400">
                  Énergie Nette: {(displayState.netEnergyRatio * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full h-auto cursor-crosshair select-none block"
              onClick={handleSvgClick}
              onMouseMove={handleSvgHover}
              onMouseLeave={() => setHoverYear(null)}
            >
              <line x1={PAD.left} y1={PAD.top} x2={W - PAD.right} y2={PAD.top} stroke="#1e293b" strokeWidth="0.8" />
              <line x1={PAD.left} y1={PAD.top + plotH / 2} x2={W - PAD.right} y2={PAD.top + plotH / 2} stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3,3" />

              {/* Ligne critique seuil EROI = 10:1 */}
              <line x1={PAD.left} y1={getYEroi(10)} x2={W - PAD.right} y2={getYEroi(10)} stroke="#ef4444" strokeWidth="0.8" strokeDasharray="2,3" opacity="0.5" />
              <text x={W - PAD.right - 2} y={getYEroi(10) - 3} fill="#ef4444" fontSize="7" textAnchor="end" fontFamily="monospace">Seuil critique EROI &lt; 10:1</text>

              {/* Axe EROI à gauche */}
              <text x={PAD.left - 6} y={PAD.top + 4} fill="#f59e0b" fontSize="8" textAnchor="end" fontFamily="monospace">35:1</text>
              <text x={PAD.left - 6} y={PAD.top + plotH / 2 + 3} fill="#f59e0b" fontSize="8" textAnchor="end" fontFamily="monospace">17:1</text>
              <text x={PAD.left - 6} y={PAD.top + plotH} fill="#f59e0b" fontSize="8" textAnchor="end" fontFamily="monospace">0:1</text>

              {/* Axe % Énergie Nette à droite */}
              <text x={W - PAD.right + 6} y={PAD.top + 4} fill="#10b981" fontSize="8" textAnchor="start" fontFamily="monospace">100%</text>
              <text x={W - PAD.right + 6} y={PAD.top + plotH} fill="#10b981" fontSize="8" textAnchor="start" fontFamily="monospace">0%</text>

              {/* Courbes */}
              <path d={pathHaberBosch} fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="4,2" />
              <path d={pathNetEnergy} fill="none" stroke="#10b981" strokeWidth="2" />
              <path d={pathEroi} fill="none" stroke="#f59e0b" strokeWidth="2.5" />

              <circle cx={currentX} cy={getYEroi(currentState.currentEroi)} r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />

              {/* Rendu complet de l'axe des abscisses (horizontal X) */}
              {renderAbscisseAxis()}
            </svg>

            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 px-1">
              <span className="text-amber-400 font-medium">Jaune : EROI net</span>
              <span className="text-emerald-400">Vert : Énergie nette disponible (1 - 1/EROI)</span>
              <span className="text-cyan-400">Pointillé bleu : Intrants Haber-Bosch</span>
            </div>
          </div>
        )}

        {/* GRAPHIQUE 3 : CLIMAT & OCÉANS (FaIR & VERMEER-RAHMSTORF) */}
        {(activeTab === 'all' || activeTab === 'climate') && (
          <div className="bg-[#0e1422] rounded-lg border border-slate-800/90 p-3 flex flex-col">
            <div className="flex items-center justify-between mb-1 text-xs">
              <span className="font-semibold text-slate-200">
                3. Climat Global &amp; Océans (Modèle FaIR / GIEC + VR09)
              </span>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span className="text-cyan-400">
                  CO2: {Math.round(displayState.atmosphericCo2Ppm)} ppm
                </span>
                <span className="text-rose-400">
                  T1: +{displayState.surfaceTemperatureAnomaly.toFixed(2)}°C
                </span>
                <span className="text-sky-400">
                  Mers: +{(displayState.seaLevelRiseMeters * 100).toFixed(0)} cm
                </span>
              </div>
            </div>

            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full h-auto cursor-crosshair select-none block"
              onClick={handleSvgClick}
              onMouseMove={handleSvgHover}
              onMouseLeave={() => setHoverYear(null)}
            >
              <line x1={PAD.left} y1={PAD.top} x2={W - PAD.right} y2={PAD.top} stroke="#1e293b" strokeWidth="0.8" />
              <line x1={PAD.left} y1={PAD.top + plotH / 2} x2={W - PAD.right} y2={PAD.top + plotH / 2} stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3,3" />

              {/* Ligne des seuils +1.5°C et +2.0°C */}
              <line x1={PAD.left} y1={getYTemp(1.5)} x2={W - PAD.right} y2={getYTemp(1.5)} stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="2,3" opacity="0.4" />
              <line x1={PAD.left} y1={getYTemp(2.0)} x2={W - PAD.right} y2={getYTemp(2.0)} stroke="#ef4444" strokeWidth="0.8" strokeDasharray="2,3" opacity="0.4" />
              <text x={W - PAD.right - 2} y={getYTemp(2.0) - 3} fill="#ef4444" fontSize="7" textAnchor="end" fontFamily="monospace">Seuil Paris +2.0°C</text>

              {/* Axes CO2 et T1 */}
              <text x={PAD.left - 6} y={PAD.top + 4} fill="#38bdf8" fontSize="8" textAnchor="end" fontFamily="monospace">750 ppm</text>
              <text x={PAD.left - 6} y={PAD.top + plotH} fill="#38bdf8" fontSize="8" textAnchor="end" fontFamily="monospace">350</text>

              <text x={W - PAD.right + 6} y={PAD.top + 4} fill="#f43f5e" fontSize="8" textAnchor="start" fontFamily="monospace">+5.0°C</text>
              <text x={W - PAD.right + 6} y={PAD.top + plotH} fill="#f43f5e" fontSize="8" textAnchor="start" fontFamily="monospace">+1.0°C</text>

              {/* Courbes */}
              <path d={pathSlr} fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,2" opacity="0.8" />
              <path d={pathCo2} fill="none" stroke="#06b6d4" strokeWidth="2" />
              <path d={pathTemp} fill="none" stroke="#f43f5e" strokeWidth="2.5" />

              <circle cx={currentX} cy={getYTemp(currentState.surfaceTemperatureAnomaly)} r="4" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />

              {/* Rendu complet de l'axe des abscisses (horizontal X) */}
              {renderAbscisseAxis()}
            </svg>

            <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-400 mt-1 px-1 gap-1">
              <span className="text-rose-400 font-medium">Rose : Température surface T1 (FaIR)</span>
              <span className="text-cyan-400">Cyan : Concentration CO2 ppm</span>
              <span className="text-sky-300">Pointillé bleu : Niveau des mers (VR09)</span>
            </div>
            <div className="text-[9.5px] text-slate-500 mt-0.5 px-1 font-mono">
              FaIR = Finite Amplitude Impulse Response (modèle climatique officiel du GIEC simulant la température globale).
            </div>
          </div>
        )}

        {/* GRAPHIQUE 4 : AGRICULTURE & CALORIES MONDIALES */}
        {(activeTab === 'all' || activeTab === 'agri') && (
          <div className="bg-[#0e1422] rounded-lg border border-slate-800/90 p-3 flex flex-col">
            <div className="flex items-center justify-between mb-1 text-xs">
              <span className="font-semibold text-slate-200">
                4. Disponibilité Alimentaire &amp; Rendements (Zhao et al.)
              </span>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span
                  className={
                    displayState.globalAverageCaloriesPerCapita < 2100 ? 'text-rose-400' : 'text-emerald-400'
                  }
                >
                  Calories: {Math.round(displayState.globalAverageCaloriesPerCapita)} kcal/j
                </span>
                <span className="text-amber-400">
                  Rendement: {(displayState.globalCropYieldComposite * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full h-auto cursor-crosshair select-none block"
              onClick={handleSvgClick}
              onMouseMove={handleSvgHover}
              onMouseLeave={() => setHoverYear(null)}
            >
              <line x1={PAD.left} y1={PAD.top} x2={W - PAD.right} y2={PAD.top} stroke="#1e293b" strokeWidth="0.8" />
              <line x1={PAD.left} y1={PAD.top + plotH / 2} x2={W - PAD.right} y2={PAD.top + plotH / 2} stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3,3" />

              {/* Ligne critique FAO de famine : 2100 kcal */}
              <line x1={PAD.left} y1={yCalorie2100} x2={W - PAD.right} y2={yCalorie2100} stroke="#dc2626" strokeWidth="1.2" strokeDasharray="4,2" />
              <text x={W - PAD.right - 2} y={yCalorie2100 - 3} fill="#dc2626" fontSize="7" textAnchor="end" fontFamily="monospace">Seuil vital OMS: 2100 kcal/j</text>

              {/* Axes Calories à gauche */}
              <text x={PAD.left - 6} y={PAD.top + 4} fill="#10b981" fontSize="8" textAnchor="end" fontFamily="monospace">3500</text>
              <text x={PAD.left - 6} y={yCalorie2100 + 3} fill="#dc2626" fontSize="8" textAnchor="end" fontFamily="monospace">2100</text>
              <text x={PAD.left - 6} y={PAD.top + plotH} fill="#10b981" fontSize="8" textAnchor="end" fontFamily="monospace">1200</text>

              {/* Axe Rendement à droite */}
              <text x={W - PAD.right + 6} y={PAD.top + 4} fill="#f59e0b" fontSize="8" textAnchor="start" fontFamily="monospace">120%</text>
              <text x={W - PAD.right + 6} y={PAD.top + plotH} fill="#f59e0b" fontSize="8" textAnchor="start" fontFamily="monospace">10%</text>

              {/* Courbes */}
              <path d={pathCropYield} fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="4,2" />
              <path d={pathCal} fill="none" stroke="#10b981" strokeWidth="2.5" />

              <circle cx={currentX} cy={getYCal(currentState.globalAverageCaloriesPerCapita)} r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />

              {/* Rendu complet de l'axe des abscisses (horizontal X) */}
              {renderAbscisseAxis()}
            </svg>

            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 px-1">
              <span className="text-emerald-400 font-medium">Vert : Calories consommables par habitant</span>
              <span className="text-rose-400 font-semibold">Ligne rouge : Seuil FAO de famine (2100 kcal)</span>
              <span className="text-amber-400">Pointillé orange : Rendement 4 céréales</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
