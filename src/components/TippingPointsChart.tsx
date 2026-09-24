import React, { useState } from 'react';
import {
  Thermometer,
  Snowflake,
  TreePine,
  Waves,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Info,
  Layers,
  Sparkles,
  Calendar,
  Flame,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import { TippingElement } from './TippingPointsView';
import { AllTippingPointsConsequencesModal } from './AllTippingPointsConsequencesModal';
import { TippingPointModal } from './TippingPointModal';

interface TippingPointsChartProps {
  elements: TippingElement[];
  currentTemp: number;
  onTempChange: (temp: number) => void;
  selectedElementId: string;
  onSelectElement: (id: string) => void;
}

export const TippingPointsChart: React.FC<TippingPointsChartProps> = ({
  elements,
  currentTemp,
  onTempChange,
  selectedElementId,
  onSelectElement
}) => {
  const [viewMode, setViewMode] = useState<'embers' | 'matrix'>('embers');
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const [modalElem, setModalElem] = useState<TippingElement | null>(null);
  const [isAllModalOpen, setIsAllModalOpen] = useState<boolean>(false);

  // Bornes de l'échelle thermique (°C)
  const minTempScale = 0.5;
  const maxTempScale = 5.0;

  // Dimensions SVG de l'échelle thermique
  const W = 950;
  const H = 485;
  const PAD = { top: 54, right: 35, bottom: 58, left: 235 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const rowHeight = chartH / elements.length;

  const tempToX = (t: number) => {
    const clamped = Math.max(minTempScale, Math.min(maxTempScale, t));
    return PAD.left + ((clamped - minTempScale) / (maxTempScale - minTempScale)) * chartW;
  };

  const needleX = tempToX(currentTemp);

  // Données de vitesse pour la matrice 2D (Années approximatives pour basculer complètement)
  const getTimescaleOrder = (elemId: string): number => {
    switch (elemId) {
      case 'corals': return 1; // 1-10 ans (quasi-instantané)
      case 'barents_ice': return 2; // 25 ans
      case 'amazon': return 3; // 50-100 ans
      case 'boreal_forest': return 3; // 50-100 ans
      case 'amoc': return 4; // 100-200 ans
      case 'permafrost': return 4; // 100-300 ans
      case 'wais': return 5; // 1000-2000 ans
      case 'greenland': return 6; // 1000-10000 ans
      case 'wilkes_basin': return 6; // 2000-10000 ans
      default: return 3;
    }
  };

  const getTimescaleBadge = (elemId: string) => {
    switch (elemId) {
      case 'corals':
        return { label: '⚡ ~10 ans', color: 'text-amber-400 bg-amber-950/70 border-amber-800' };
      case 'barents_ice':
        return { label: '⚡ ~25 ans', color: 'text-amber-400 bg-amber-950/70 border-amber-800' };
      case 'amazon':
      case 'boreal_forest':
        return { label: '⏳ ~50-100 ans', color: 'text-sky-300 bg-sky-950/70 border-sky-800' };
      case 'amoc':
      case 'permafrost':
        return { label: '⏳ ~100-200 ans', color: 'text-indigo-300 bg-indigo-950/70 border-indigo-800' };
      default:
        return { label: '🏔️ Millénaires', color: 'text-purple-300 bg-purple-950/70 border-purple-800' };
    }
  };

  return (
    <div className="bg-[#0b101c] border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col gap-4">
      {/* En-tête du graphique */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-950/80 border border-rose-800/70 text-rose-400">
              <Thermometer className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Graphique Synthétique : Les Seuils Thermiques Critiques
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Représentation standardisée du consensus scientifique (Armstrong McKay et al., <em>Science</em> 2022). 
            La ligne verticale rouge indique le niveau de réchauffement testé.
          </p>
        </div>

        {/* Contrôles : mode d'affichage et rappel de la température */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="bg-slate-900 border border-slate-800 p-0.5 rounded-lg flex items-center text-xs">
            <button
              onClick={() => setViewMode('embers')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'embers'
                  ? 'bg-slate-700 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Échelle des Seuils
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-slate-700 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Matrice Vitesse vs Température
            </button>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-700/80 text-rose-200 text-xs font-mono font-bold">
            <span>Réchauffement :</span>
            <span className="text-white text-sm">+{currentTemp.toFixed(1)}°C</span>
          </div>
        </div>
      </div>

      {/* Bandeau Date prévisionnelle de franchissement de l'ensemble des points */}
      <div className="bg-gradient-to-r from-rose-950/70 via-slate-900 to-slate-900 border border-rose-800/60 rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0 mt-0.5 sm:mt-0">
            <Calendar className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-rose-200">Date envisagée pour l'ENSEMBLE des points de bascule :</span>
              <span className="text-white font-mono font-bold bg-rose-950 px-2 py-0.5 rounded border border-rose-700 text-rose-300">
                ~2085 – 2100 (+4,0°C)
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              En trajectoire fossile, le dernier verrou (forêts boréales et AMOC) cède vers la fin du siècle. En sobriété, l'ensemble n'est <strong className="text-emerald-400">JAMAIS franchi</strong>.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAllModalOpen(true)}
          className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
        >
          <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>Conséquences si TOUS franchis</span>
        </button>
      </div>

      {/* VUE 1 : ÉCHELLE THERMIQUE DES SEUILS (Burning Embers Range Chart) */}
      {viewMode === 'embers' && (
        <div className="flex flex-col gap-2">
          {/* Légende du graphique */}
          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 px-1 py-1 gap-y-2">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-2.5 rounded-sm bg-gradient-to-r from-amber-500/30 to-amber-500/80 border border-amber-500/60 inline-block" />
                <span>Zone d'incertitude (Début du risque)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rotate-45 bg-rose-500 border border-white inline-block shadow-sm" />
                <span>Seuil central estimé (Basculement probable)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-2.5 rounded-sm bg-gradient-to-r from-rose-600/80 to-purple-800/90 border border-rose-500/80 inline-block" />
                <span>Zone de déstabilisation avancée</span>
              </span>
            </div>

            <span className="text-[10px] text-slate-500 italic">
              Cliquez sur une ligne pour inspecter l'élément
            </span>
          </div>

          {/* Conteneur SVG avec défilement horizontal sur mobile */}
          <div className="w-full overflow-x-auto bg-[#070b13] border border-slate-800/80 rounded-xl p-2 sm:p-3">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full min-w-[700px] h-auto select-none font-sans"
              style={{ maxHeight: '500px' }}
            >
              <defs>
                {/* Dégradé de la barre d'incertitude (jaune/ambre vers orange) */}
                <linearGradient id="grad-uncertain" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.85" />
                </linearGradient>

                {/* Dégradé de la barre de basculement certain (orange/rouge vers violet) */}
                <linearGradient id="grad-tipped" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                  <stop offset="60%" stopColor="#dc2626" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#881337" stopOpacity="0.95" />
                </linearGradient>

                {/* Filtre de lueur pour la ligne de température actuelle */}
                <filter id="glow-needle" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* 1. Bandes d'arrière-plan de référence politique/climat */}
              {/* Zone Accord de Paris (+1.5°C à +2.0°C) */}
              <rect
                x={tempToX(1.5)}
                y={PAD.top}
                width={tempToX(2.0) - tempToX(1.5)}
                height={chartH}
                fill="#38bdf8"
                fillOpacity="0.04"
                stroke="#0284c7"
                strokeOpacity="0.2"
                strokeDasharray="3 3"
              />
              <text
                x={(tempToX(1.5) + tempToX(2.0)) / 2}
                y={PAD.top - 8}
                fill="#38bdf8"
                fontSize="9"
                fontFamily="sans-serif"
                textAnchor="middle"
                fontWeight="600"
              >
                Accord de Paris [1.5°C – 2.0°C]
              </text>

              {/* Grille verticale des températures et dates estimées de passage */}
              {[1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0].map((t) => {
                const x = tempToX(t);
                const isMajor = t === 1.5 || t === 2.0 || t === 3.0 || t === 4.0;

                return (
                  <g key={t}>
                    <line
                      x1={x}
                      y1={PAD.top}
                      x2={x}
                      y2={PAD.top + chartH}
                      stroke={isMajor ? (t === 4.0 ? '#be123c' : '#334155') : '#1e293b'}
                      strokeWidth={isMajor ? (t === 4.0 ? 1.5 : 1) : 0.6}
                      strokeDasharray={t === 4.0 ? '4 2' : isMajor ? undefined : '2 3'}
                    />
                    <text
                      x={x}
                      y={PAD.top + chartH + 16}
                      fill={t === 4.0 ? '#f43f5e' : isMajor ? '#f1f5f9' : '#64748b'}
                      fontSize={isMajor ? '10' : '9'}
                      fontFamily="monospace"
                      fontWeight={isMajor ? 'bold' : 'normal'}
                      textAnchor="middle"
                    >
                      +{t.toFixed(1)}°C
                    </text>

                    {/* Dates estimées de franchissement sous les seuils clés */}
                    {t === 1.0 && (
                      <text x={x} y={PAD.top + chartH + 28} fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle">
                        (2015)
                      </text>
                    )}
                    {t === 1.5 && (
                      <text x={x} y={PAD.top + chartH + 28} fill="#f59e0b" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                        ~2030-38
                      </text>
                    )}
                    {t === 2.0 && (
                      <text x={x} y={PAD.top + chartH + 28} fill="#fb923c" fontSize="8" fontFamily="monospace" textAnchor="middle">
                        ~2050
                      </text>
                    )}
                    {t === 2.5 && (
                      <text x={x} y={PAD.top + chartH + 28} fill="#fb7185" fontSize="8" fontFamily="monospace" textAnchor="middle">
                        ~2060
                      </text>
                    )}
                    {t === 3.0 && (
                      <text x={x} y={PAD.top + chartH + 28} fill="#f87171" fontSize="8" fontFamily="monospace" textAnchor="middle">
                        ~2070
                      </text>
                    )}
                    {t === 4.0 && (
                      <g>
                        <text x={x} y={PAD.top + chartH + 28} fill="#fda4af" fontSize="8.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                          ~2085-2100
                        </text>
                        <text x={x} y={PAD.top + chartH + 39} fill="#f43f5e" fontSize="7.5" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                          (TOUS franchis)
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Repère Aujourd'hui sur l'axe X (+1.3°C) */}
              <line
                x1={tempToX(1.3)}
                y1={PAD.top - 2}
                x2={tempToX(1.3)}
                y2={PAD.top + chartH}
                stroke="#38bdf8"
                strokeWidth="1.2"
                strokeDasharray="3 2"
              />
              <text
                x={tempToX(1.3)}
                y={PAD.top - 18}
                fill="#38bdf8"
                fontSize="8.5"
                fontFamily="sans-serif"
                textAnchor="middle"
                fontWeight="bold"
              >
                +1,3°C (Aujourd'hui)
              </text>

              {/* Repère : Franchissement de l'ensemble des points (+4.0°C) */}
              <g transform={`translate(${tempToX(4.0)}, ${PAD.top - 20})`}>
                <rect x="-82" y="-12" width="164" height="15" rx="3" fill="#881337" stroke="#f43f5e" strokeWidth="0.8" />
                <text
                  x="0"
                  y="-1"
                  fill="#fecdd3"
                  fontSize="7.5"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  ⚠️ ~2085–2100 : ENSEMBLE FRANCHI
                </text>
              </g>

              {/* 2. Lignes et Barres des 9 éléments de bascule */}
              {elements.map((elem, idx) => {
                const y = PAD.top + idx * rowHeight;
                const barH = 14;
                const barY = y + (rowHeight - barH) / 2;

                const xMin = tempToX(elem.thresholdMin);
                const xEst = tempToX(elem.thresholdEst);
                const xMax = tempToX(Math.min(maxTempScale, elem.thresholdMax));

                const isSelected = elem.id === selectedElementId;
                const isHovered = elem.id === hoveredElementId;

                // Statut dynamique vis-à-vis de currentTemp
                const isSafe = currentTemp < elem.thresholdMin;
                const isUncertain = currentTemp >= elem.thresholdMin && currentTemp < elem.thresholdEst;
                const isTipped = currentTemp >= elem.thresholdEst;

                const badge = getTimescaleBadge(elem.id);

                return (
                  <g
                    key={elem.id}
                    className="cursor-pointer transition-opacity"
                    onClick={() => onSelectElement(elem.id)}
                    onMouseEnter={() => setHoveredElementId(elem.id)}
                    onMouseLeave={() => setHoveredElementId(null)}
                    opacity={hoveredElementId && !isHovered && !isSelected ? 0.45 : 1}
                  >
                    {/* Fond interactif de la ligne */}
                    <rect
                      x={8}
                      y={y + 1}
                      width={W - 16}
                      height={rowHeight - 2}
                      rx="4"
                      fill={isSelected ? '#1e293b' : isHovered ? '#151e2e' : idx % 2 === 0 ? '#0b111e' : 'transparent'}
                      stroke={isSelected ? '#38bdf8' : isHovered ? '#475569' : 'transparent'}
                      strokeWidth={isSelected ? 1.2 : 0.8}
                    />

                    {/* Titre et icône de catégorie à gauche */}
                    <g transform={`translate(${16}, ${y + rowHeight / 2})`}>
                      {/* Icône de catégorie colorée */}
                      <circle
                        cx="7"
                        cy="0"
                        r="5.5"
                        fill={
                          elem.category === 'cryosphere' ? '#0891b2' :
                          elem.category === 'biosphere' ? '#059669' : '#4f46e5'
                        }
                      />
                      <text
                        x="18"
                        y="3.5"
                        fill={isSelected ? '#ffffff' : '#cbd5e1'}
                        fontSize="10"
                        fontWeight={isSelected ? 'bold' : '500'}
                        fontFamily="sans-serif"
                      >
                        {elem.name.length > 25 ? elem.name.substring(0, 24) + '...' : elem.name}
                      </text>

                      {/* Badge de vitesse de basculement */}
                      <text
                        x={PAD.left - 26}
                        y="3.5"
                        fill="#94a3b8"
                        fontSize="8.5"
                        fontFamily="sans-serif"
                        textAnchor="end"
                      >
                        {badge.label}
                      </text>
                    </g>

                    {/* Barre Segment 1 : Zone d'incertitude (Min -> Est) */}
                    <rect
                      x={xMin}
                      y={barY}
                      width={Math.max(2, xEst - xMin)}
                      height={barH}
                      rx="2"
                      fill="url(#grad-uncertain)"
                      stroke="#d97706"
                      strokeWidth="0.8"
                    />

                    {/* Barre Segment 2 : Zone de basculement probable (Est -> Max) */}
                    <rect
                      x={xEst}
                      y={barY}
                      width={Math.max(2, xMax - xEst)}
                      height={barH}
                      rx="2"
                      fill="url(#grad-tipped)"
                      stroke="#b91c1c"
                      strokeWidth="0.8"
                    />

                    {/* Marqueur du seuil central (Point médian) */}
                    <g transform={`translate(${xEst}, ${barY + barH / 2})`}>
                      <rect
                        x="-4.5"
                        y="-4.5"
                        width="9"
                        height="9"
                        transform="rotate(45)"
                        fill="#ffffff"
                        stroke="#b91c1c"
                        strokeWidth="1.5"
                      />
                    </g>

                    {/* Pastille textuelle du seuil central au-dessus du diamant */}
                    <text
                      x={xEst}
                      y={barY - 3}
                      fill="#fca5a5"
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      +{elem.thresholdEst.toFixed(1)}°C
                    </text>

                    {/* Date estimée de franchissement */}
                    <text
                      x={W - PAD.right - 62}
                      y={barY + barH / 2 + 3}
                      fill="#94a3b8"
                      fontSize="7.5"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      {elem.estimatedYearTendency.split('(')[0].trim()}
                    </text>

                    {/* Indicateur de statut à droite de la barre si dans la ligne de mire */}
                    {isTipped && (
                      <g transform={`translate(${W - PAD.right - 2}, ${barY + barH / 2 + 3})`}>
                        <text
                          x="0"
                          y="0"
                          fill="#f87171"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                          textAnchor="end"
                        >
                          ⚠️ Franchi
                        </text>
                      </g>
                    )}
                    {isUncertain && (
                      <g transform={`translate(${W - PAD.right - 2}, ${barY + barH / 2 + 3})`}>
                        <text
                          x="0"
                          y="0"
                          fill="#fbbf24"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                          textAnchor="end"
                        >
                          ⚠️ Risque
                        </text>
                      </g>
                    )}
                    {isSafe && (
                      <g transform={`translate(${W - PAD.right - 2}, ${barY + barH / 2 + 3})`}>
                        <text
                          x="0"
                          y="0"
                          fill="#34d399"
                          fontSize="8.5"
                          fontFamily="sans-serif"
                          textAnchor="end"
                        >
                          ✓ Sauf
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* 3. Ligne d'aiguille verticale dynamique (Réchauffement actuel simulé) */}
              <g className="needle-group">
                {/* Lueur rouge intense sous la ligne */}
                <line
                  x1={needleX}
                  y1={PAD.top - 8}
                  x2={needleX}
                  y2={PAD.top + chartH + 4}
                  stroke="#ef4444"
                  strokeWidth="3.5"
                  strokeOpacity="0.4"
                  filter="url(#glow-needle)"
                />
                {/* Ligne principale blanche/rouge fine et nette */}
                <line
                  x1={needleX}
                  y1={PAD.top - 8}
                  x2={needleX}
                  y2={PAD.top + chartH + 4}
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />

                {/* Badge d'en-tête mobile au sommet de la ligne */}
                <g transform={`translate(${needleX}, ${PAD.top - 18})`}>
                  <rect
                    x="-32"
                    y="-12"
                    width="64"
                    height="18"
                    rx="4"
                    fill="#991b1b"
                    stroke="#f87171"
                    strokeWidth="1.2"
                  />
                  <text
                    x="0"
                    y="1"
                    fill="#ffffff"
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    +{currentTemp.toFixed(1)}°C
                  </text>
                  <polygon points="-4,6 4,6 0,11" fill="#f87171" />
                </g>
              </g>
            </svg>
          </div>

          {/* Fiche Info-Bulle Pédagogique Interactive Débutant (Comprendre sans jargon) */}
          {(() => {
            const activeElem = elements.find(e => e.id === (hoveredElementId || selectedElementId)) || elements[0];
            return (
              <div className="bg-gradient-to-r from-slate-900 via-[#111a2e] to-slate-900 border border-slate-700/80 rounded-xl p-4 sm:p-5 shadow-lg flex flex-col gap-3 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
                      <HelpCircle className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-[10px] text-cyan-400 uppercase font-mono tracking-wider font-semibold">
                        Info-bulle pédagogique (Comprendre sans compétences techniques)
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        {activeElem.name}
                        <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                          Seuil : +{activeElem.thresholdEst.toFixed(1)}°C
                        </span>
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/90 border border-slate-700 text-amber-300 font-mono text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{activeElem.estimatedYearTendency}</span>
                    </div>

                    <button
                      onClick={() => setModalElem(activeElem)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Fiche descriptive complète</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs leading-relaxed">
                  <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800/80 flex flex-col gap-1">
                    <div className="text-cyan-400 font-semibold flex items-center gap-1.5 text-xs">
                      <span>💡</span> C'est quoi simplement ?
                    </div>
                    <p className="text-slate-300 text-[11.5px] leading-snug">
                      {activeElem.whatIsItSimple}
                    </p>
                  </div>

                  <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800/80 flex flex-col gap-1">
                    <div className="text-amber-400 font-semibold flex items-center gap-1.5 text-xs">
                      <span>🔄</span> Pourquoi le non-retour ?
                    </div>
                    <p className="text-slate-300 text-[11.5px] leading-snug">
                      {activeElem.whyPointOfNoReturn}
                    </p>
                  </div>

                  <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800/80 flex flex-col gap-1">
                    <div className="text-rose-400 font-semibold flex items-center gap-1.5 text-xs">
                      <span>🍽️</span> Impact dans votre vie
                    </div>
                    <p className="text-slate-300 text-[11.5px] leading-snug">
                      {activeElem.concreteImpactEveryday}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* VUE 2 : MATRICE 2D VITESSE DE BASCULEMENT VS SEUIL DE TEMPÉRATURE */}
      {viewMode === 'matrix' && (
        <div className="flex flex-col gap-3">
          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-cyan-400">Pourquoi cette vue est cruciale :</span>{' '}
            Tous les points de bascule ne vont pas à la même vitesse. Les récifs coralliens meurent en <strong>quelques années</strong>, 
            la forêt amazonienne peut dépérir en <strong>quelques décennies</strong>, tandis que les calottes polaires mettront des <strong>siècles ou des millénaires</strong> à fondre entièrement.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Colonne 1 : Ultra-rapide (1 à 30 ans) */}
            <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-3.5 flex flex-col gap-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-rose-900/40">
                <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-rose-400" />
                  Effets Rapides (1 à 30 ans)
                </span>
                <span className="text-[10px] font-mono text-rose-400 bg-rose-950 px-1.5 py-0.5 rounded border border-rose-800">
                  Immédiat
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Impacts sur notre génération même. Aucune inertie géologique pour amortir le choc.
              </p>
              <div className="flex flex-col gap-2 mt-1">
                {elements.filter(e => e.id === 'corals' || e.id === 'barents_ice').map(elem => (
                  <div
                    key={elem.id}
                    onClick={() => onSelectElement(elem.id)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      elem.id === selectedElementId
                        ? 'bg-rose-900/60 border-rose-500 text-white'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-white flex items-center justify-between">
                      <span>{elem.name}</span>
                      <span className="text-rose-400 font-mono text-[10px]">+{elem.thresholdEst}°C</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                      <span>Temps : {elem.timescaleYears}</span>
                      <span className="text-amber-300">{elem.estimatedYearTendency.split('(')[0].trim()}</span>
                    </div>
                    <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalElem(elem);
                        }}
                        className="text-[10.5px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-sans cursor-pointer"
                      >
                        <HelpCircle className="w-3 h-3" /> Fiche débutant
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Colonne 2 : Moyen terme (50 à 300 ans) */}
            <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-3.5 flex flex-col gap-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-amber-900/40">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Effets Séculaires (50 à 300 ans)
                </span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800">
                  Générations 2 à 4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Déstabilisation progressive mais inexorable des écosystèmes et grands cycles.
              </p>
              <div className="flex flex-col gap-2 mt-1">
                {elements.filter(e => e.id === 'amazon' || e.id === 'amoc' || e.id === 'permafrost' || e.id === 'boreal_forest').map(elem => (
                  <div
                    key={elem.id}
                    onClick={() => onSelectElement(elem.id)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      elem.id === selectedElementId
                        ? 'bg-amber-900/60 border-amber-500 text-white'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-white flex items-center justify-between">
                      <span>{elem.name}</span>
                      <span className="text-amber-400 font-mono text-[10px]">+{elem.thresholdEst}°C</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                      <span>Temps : {elem.timescaleYears}</span>
                      <span className="text-amber-300">{elem.estimatedYearTendency.split('(')[0].trim()}</span>
                    </div>
                    <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalElem(elem);
                        }}
                        className="text-[10.5px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-sans cursor-pointer"
                      >
                        <HelpCircle className="w-3 h-3" /> Fiche débutant
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Colonne 3 : Millénaire (500 à 10 000 ans) */}
            <div className="bg-sky-950/20 border border-sky-900/40 rounded-xl p-3.5 flex flex-col gap-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-sky-900/40">
                <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                  <Snowflake className="w-3.5 h-3.5 text-sky-400" />
                  Effets Millénaires (Calottes)
                </span>
                <span className="text-[10px] font-mono text-sky-400 bg-sky-950 px-1.5 py-0.5 rounded border border-sky-800">
                  Héritage lointain
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Seuil de fonte irréversible franchi aujourd'hui, mais la montée de 10 mètres s'étire sur des millénaires.
              </p>
              <div className="flex flex-col gap-2 mt-1">
                {elements.filter(e => e.id === 'greenland' || e.id === 'wais' || e.id === 'wilkes_basin').map(elem => (
                  <div
                    key={elem.id}
                    onClick={() => onSelectElement(elem.id)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      elem.id === selectedElementId
                        ? 'bg-sky-900/60 border-sky-500 text-white'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-white flex items-center justify-between">
                      <span>{elem.name}</span>
                      <span className="text-sky-400 font-mono text-[10px]">+{elem.thresholdEst}°C</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                      <span>Temps : {elem.timescaleYears}</span>
                      <span className="text-amber-300">{elem.estimatedYearTendency.split('(')[0].trim()}</span>
                    </div>
                    <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalElem(elem);
                        }}
                        className="text-[10.5px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-sans cursor-pointer"
                      >
                        <HelpCircle className="w-3 h-3" /> Fiche débutant
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Raccourcis de simulation de température intégrés sous le graphique */}
      <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Tester l'impact sur le graphique :</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => onTempChange(1.3)}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer border ${
              Math.abs(currentTemp - 1.3) < 0.05
                ? 'bg-cyan-900 text-cyan-200 border-cyan-400 font-bold'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            Aujourd'hui (+1,3°C)
          </button>
          <button
            onClick={() => onTempChange(1.5)}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer border ${
              Math.abs(currentTemp - 1.5) < 0.05
                ? 'bg-amber-900 text-amber-200 border-amber-400 font-bold'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            Objectif Paris (+1,5°C)
          </button>
          <button
            onClick={() => onTempChange(2.0)}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer border ${
              Math.abs(currentTemp - 2.0) < 0.05
                ? 'bg-orange-900 text-orange-200 border-orange-400 font-bold'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            Limite Haute (+2,0°C)
          </button>
          <button
            onClick={() => onTempChange(2.7)}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer border ${
              Math.abs(currentTemp - 2.7) < 0.05
                ? 'bg-rose-900 text-rose-200 border-rose-400 font-bold'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            Politiques 2024 (+2,7°C)
          </button>
          <button
            onClick={() => onTempChange(4.0)}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer border ${
              Math.abs(currentTemp - 4.0) < 0.05
                ? 'bg-purple-900 text-purple-200 border-purple-400 font-bold'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            Scénario Extrême (+4,0°C)
          </button>
        </div>
      </div>

      {/* Modale Fiche descriptive pour débutant */}
      <TippingPointModal
        element={modalElem}
        isOpen={!!modalElem}
        onClose={() => setModalElem(null)}
        currentSimulatedTemp={currentTemp}
      />

      {/* Modale Conséquences si TOUS franchis */}
      <AllTippingPointsConsequencesModal
        isOpen={isAllModalOpen}
        onClose={() => setIsAllModalOpen(false)}
        currentSimulatedTemp={currentTemp}
      />
    </div>
  );
};
