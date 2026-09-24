import React from 'react';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { GlobalBiophysicalState, MilestoneEvent } from '../types/simulation';
import { SIMULATION_MILESTONES } from '../engine/simulationRunner';
import { TechTooltip } from './TechTooltip';

interface TimelineControllerProps {
  currentYear: number;
  isPlaying: boolean;
  playbackSpeed: number;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onSeekYear: (year: number) => void;
  simulationState: GlobalBiophysicalState;
}

export const TimelineController: React.FC<TimelineControllerProps> = ({
  currentYear,
  isPlaying,
  playbackSpeed,
  onTogglePlay,
  onStepForward,
  onReset,
  onSpeedChange,
  onSeekYear,
  simulationState
}) => {
  const currentMilestone = SIMULATION_MILESTONES.find(m => Math.abs(m.year - Math.floor(currentYear)) <= 2);
  const isHistorical = currentYear < 2026;

  // Calcul du format lisible pour les décès par canicule (en milliers ou en millions)
  const thermalDeathsText = simulationState.worldDeathsAnnual.thermal >= 1
    ? `${simulationState.worldDeathsAnnual.thermal.toFixed(1)} M/an`
    : `${Math.round(simulationState.worldDeathsAnnual.thermal * 1000).toLocaleString('fr-FR')} décès/an`;

  return (
    <div className="w-full rounded-xl bg-[#0b101b] border border-slate-800 p-4 shadow-xl flex flex-col gap-3">
      {/* Ligne 1 : Résumé des 6 macro-indicateurs biophysiques en temps réel */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
        {/* Population Mondiale */}
        <div className="bg-[#111726] border border-slate-800/80 rounded-lg p-2.5 flex flex-col justify-between">
          <div>
            <span className="text-[11px] text-slate-300 font-medium">Population Humaine</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold font-mono text-white tabular-nums">
                {(simulationState.worldPopulation / 1000).toFixed(2)}
              </span>
              <span className="text-[11px] text-slate-400">Milliards</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-800/80">
            Naissances : {(simulationState.worldBirthsAnnual).toFixed(1)} M/an
          </span>
        </div>

        {/* EROI & Énergie Nette (Clarifié pour le grand public sans le jargon mathématique) */}
        <div className="bg-[#111726] border border-slate-800/80 rounded-lg p-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-300 font-medium flex items-center gap-1">
                Efficacité Pétrole
                <TechTooltip term="eroi" showIconOnly />
              </span>
              <span className="text-[9.5px] font-mono text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/80 font-bold">
                x{simulationState.currentEroi >= 20 ? Math.round(simulationState.currentEroi) : simulationState.currentEroi.toFixed(1)}
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span
                className={`text-lg font-bold font-mono tabular-nums ${
                  simulationState.currentEroi < 8.0
                    ? 'text-rose-400'
                    : simulationState.currentEroi < 15.0
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {simulationState.currentEroi >= 20 ? Math.round(simulationState.currentEroi) : simulationState.currentEroi.toFixed(1)} barils
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block leading-tight">
              obtenus pour 1 baril dépensé à forer
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 mt-1 pt-1 border-t border-slate-800/80">
            <strong>{(simulationState.netEnergyRatio * 100).toFixed(0)}%</strong> utile pour la société
          </span>
        </div>

        {/* CO2 Atmosphérique */}
        <div className="bg-[#111726] border border-slate-800/80 rounded-lg p-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-300 font-medium flex items-center gap-1">
                Gaz effet de serre
                <TechTooltip term="fair" showIconOnly />
              </span>
              <span className="text-[9px] font-mono text-slate-400">CO₂</span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold font-mono text-cyan-300 tabular-nums">
                {Math.round(simulationState.atmosphericCo2Ppm)}
              </span>
              <span className="text-[11px] text-slate-400">ppm</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-800/80">
            {isHistorical ? 'Mesures carottes de glace / NOAA' : 'Concentration dans l\'atmosphère'}
          </span>
        </div>

        {/* Réchauffement Mondial */}
        <div className="bg-[#111726] border border-slate-800/80 rounded-lg p-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-300 font-medium flex items-center gap-1">
                Réchauffement
                <TechTooltip term="fair" showIconOnly />
              </span>
              <span
                className="text-[9px] font-mono text-cyan-400 bg-cyan-950/80 px-1 py-0.2 rounded border border-cyan-800/80 cursor-help"
                title="Modèle FaIR officiel validé par le GIEC AR6"
              >
                GIEC FaIR
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span
                className={`text-lg font-bold font-mono tabular-nums ${
                  simulationState.surfaceTemperatureAnomaly >= 2.5
                    ? 'text-rose-400'
                    : simulationState.surfaceTemperatureAnomaly >= 1.5
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {simulationState.surfaceTemperatureAnomaly >= 0 ? '+' : ''}{simulationState.surfaceTemperatureAnomaly.toFixed(2)}
              </span>
              <span className="text-[11px] text-slate-400">°C</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-800/80">
            Par rapport à l'ère préindustrielle
          </span>
        </div>

        {/* Montée des Océans (Chiffrée sans ambiguïté) */}
        <div className="bg-[#111726] border border-slate-800/80 rounded-lg p-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-300 font-medium flex items-center gap-1">
                Montée Océans
                <TechTooltip term="slr" showIconOnly />
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold font-mono text-sky-400 tabular-nums">
                {simulationState.seaLevelRiseMeters >= 0 ? '+' : ''}{(simulationState.seaLevelRiseMeters * 100).toFixed(0)}
              </span>
              <span className="text-[11px] text-slate-400">cm</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-800/80">
            {simulationState.year >= 2026 ? (
              <span>+{Math.max(0, Math.round((simulationState.seaLevelRiseMeters - 0.12) * 100))} cm depuis 2026</span>
            ) : (
              <span>{Math.round((simulationState.seaLevelRiseMeters - 0.12) * 100)} cm vs 2026</span>
            )}
          </span>
        </div>

        {/* Décès dus aux crises (Famines & Canicules explicites) */}
        <div className="bg-[#111726] border border-slate-800/80 rounded-lg p-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-300 font-medium flex items-center gap-1">
                Décès crises
                <TechTooltip term="stull" showIconOnly />
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold font-mono text-purple-400 tabular-nums">
                {(
                  simulationState.worldDeathsAnnual.thermal +
                  simulationState.worldDeathsAnnual.famine
                ).toFixed(1)}
              </span>
              <span className="text-[11px] text-slate-400">M / an</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-800/80 leading-tight">
            Famines: {simulationState.worldDeathsAnnual.famine.toFixed(1)}M · Canicule: {thermalDeathsText}
          </span>
        </div>
      </div>

      {/* Ligne 2 : Commandes de lecture, scrubber temporel séculaire (1900-2100) et jalons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 border-t border-slate-800/80">
        {/* Contrôles de transport Play / Pause / Step / Reset */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap justify-center sm:justify-start">
          <button
            onClick={onTogglePlay}
            className={`flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-all shadow-md cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
            }`}
            title={isPlaying ? 'Mettre en pause' : 'Lancer la simulation (Espace)'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <button
            onClick={onStepForward}
            disabled={currentYear >= 2200}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
            title="Avancer d'une année (+1 an)"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-300 hover:bg-slate-700 transition-colors text-xs font-medium border border-slate-700/60 cursor-pointer"
            title="Revenir au présent (2026)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">2026 (Auj.)</span>
          </button>

          <button
            onClick={() => onSeekYear(1900)}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              currentYear <= 1910
                ? 'bg-blue-900/70 text-blue-200 border-blue-600'
                : 'bg-slate-800 text-slate-300 hover:text-blue-300 hover:bg-slate-700 border-slate-700'
            }`}
            title="Remonter à 1900 (début de l'ère thermo-industrielle)"
          >
            <span>1900</span>
          </button>

          <button
            onClick={() => onSeekYear(2100)}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              Math.floor(currentYear) === 2100
                ? 'bg-purple-900/70 text-purple-200 border-purple-600'
                : 'bg-slate-800 text-slate-300 hover:text-purple-300 hover:bg-slate-700 border-slate-700'
            }`}
            title="Sauter directement à l'année 2100 (fin du XXIe siècle)"
          >
            <span>2100</span>
          </button>

          <button
            onClick={() => onSeekYear(2200)}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              Math.floor(currentYear) >= 2195
                ? 'bg-rose-900/70 text-rose-200 border-rose-600'
                : 'bg-slate-800 text-slate-300 hover:text-rose-300 hover:bg-slate-700 border-slate-700'
            }`}
            title="Projeter à l'horizon 2200 (prospective scientifique longue portée)"
          >
            <span>2200 🔭</span>
          </button>

          {/* Vitesse de simulation */}
          <div className="flex items-center bg-[#141b2a] rounded-lg p-0.5 border border-slate-800 text-[11px] font-mono ml-1">
            {[1, 2, 5, 10].map(s => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  playbackSpeed === s
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Curseur temporel Scrubber (1900 - 2200) */}
        <div className="flex-1 w-full flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-[11px] text-blue-300">
              <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
              1900 (Début pétrole)
            </span>
            <div className="flex items-center gap-2">
              {isHistorical ? (
                <span className="text-[10px] font-sans font-semibold bg-blue-950 text-blue-300 border border-blue-800/80 px-2 py-0.5 rounded">
                  Données réelles mesurées (1900–2026)
                </span>
              ) : currentYear <= 2100 ? (
                <span className="text-[10px] font-sans font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/80 px-2 py-0.5 rounded">
                  Modèle biophysique (2026–2100)
                </span>
              ) : (
                <span className="text-[10px] font-sans font-semibold bg-purple-950 text-purple-300 border border-purple-800/80 px-2 py-0.5 rounded">
                  Projection longue portée (2100–2200 · IPCC AR6)
                </span>
              )}
              <span className="text-base font-bold text-white px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono tabular-nums">
                Année {Math.floor(currentYear)}
              </span>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] text-rose-300">
              2200 (Horizon Long)
              <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
            </span>
          </div>

          <div className="relative w-full flex items-center">
            <input
              type="range"
              min={1900}
              max={2200}
              step={1}
              value={Math.floor(currentYear)}
              onChange={(e) => onSeekYear(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
            />
          </div>

          {/* Points repères des ruptures biophysiques & historiques (1900-2200) */}
          <div className="relative w-full h-4 mt-0.5">
            {SIMULATION_MILESTONES.map((m) => {
              const leftPercent = ((m.year - 1900) / (2200 - 1900)) * 100;
              const isActive = Math.floor(currentYear) >= m.year;
              const is2026 = m.year === 2026;
              const is2100 = m.year === 2100;
              const is2200 = m.year === 2200;
              return (
                <button
                  key={m.year}
                  onClick={() => onSeekYear(m.year)}
                  style={{ left: `${leftPercent}%` }}
                  title={`${m.year}: ${m.title}`}
                  className="absolute -translate-x-1/2 top-0 flex flex-col items-center group cursor-pointer"
                >
                  <span
                    className={`w-2 h-2 rounded-full transition-transform group-hover:scale-150 ${
                      is2026
                        ? 'bg-cyan-300 ring-2 ring-cyan-400 ring-offset-1 ring-offset-slate-900'
                        : is2100
                        ? 'bg-purple-400 ring-1 ring-purple-400/50'
                        : is2200
                        ? 'bg-rose-400 ring-1 ring-rose-400/50'
                        : isActive
                        ? 'bg-amber-400 ring-1 ring-amber-400/50'
                        : 'bg-slate-600'
                    }`}
                  />
                  <span className="text-[8.5px] font-mono text-slate-500 group-hover:text-slate-300 hidden lg:block">
                    {m.year}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Alerte événementielle synchronisée si un jalon est actif */}
      {currentMilestone && (
        <div className="mt-1 p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/50 flex items-start gap-2.5 text-xs text-amber-200">
          <span className="font-mono font-bold text-amber-400 bg-amber-900/60 px-1.5 py-0.5 rounded text-[11px] shrink-0">
            {currentMilestone.year < 2026 ? 'Histoire' : 'Jalon'} {currentMilestone.year}
          </span>
          <div>
            <span className="font-semibold text-white mr-1.5">
              {currentMilestone.title} :
            </span>
            <span className="text-amber-200/90 text-[11px]">
              {currentMilestone.description}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
