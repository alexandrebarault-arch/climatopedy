import React from 'react';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { GlobalBiophysicalState, MilestoneEvent } from '../types/simulation';
import { SIMULATION_MILESTONES } from '../engine/simulationRunner';

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

  return (
    <div className="w-full rounded-xl bg-[#0b101b] border border-slate-800 p-4 shadow-xl flex flex-col gap-3">
      {/* Ligne 1 : Résumé des 6 macro-indicateurs biophysiques en temps réel */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
        {/* Population Mondiale */}
        <div className="bg-[#111726] border border-slate-800/80 rounded-lg p-2.5 flex flex-col">
          <span className="text-[11px] text-slate-400 font-medium">Population Humaine</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-bold font-mono text-white tabular-nums">
              {(simulationState.worldPopulation / 1000).toFixed(2)}
            </span>
            <span className="text-[11px] text-slate-400">Milliards</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5">
            Naissances: {(simulationState.worldBirthsAnnual).toFixed(1)} M/an
          </span>
        </div>

        {/* EROI & Énergie Nette */}
        <div className="bg-[#111726] border border-slate-800/80 rounded-lg p-2.5 flex flex-col">
          <span className="text-[11px] text-slate-400 font-medium">EROI Moyen (Falaise)</span>
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
              {simulationState.currentEroi.toFixed(1)} : 1
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5">
            Énergie Nette: {(simulationState.netEnergyRatio * 100).toFixed(1)}% brute
          </span>
        </div>

        {/* CO2 Atmosphérique */}
        <div className="bg-[#111726] border border-slate-800/80 rounded-lg p-2.5 flex flex-col">
          <span className="text-[11px] text-slate-400 font-medium">CO2 FaIR Global</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-bold font-mono text-cyan-300 tabular-nums">
              {Math.round(simulationState.atmosphericCo2Ppm)}
            </span>
            <span className="text-[11px] text-slate-400">ppm</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5">
            Forçage: {simulationState.radiativeForcing.toFixed(2)} W/m²
          </span>
        </div>

        {/* Anomalie Thermique Surface */}
        <div className="bg-[#111726] border border-slate-800/80 rounded-lg p-2.5 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">Réchauffement (T1)</span>
            <span
              className="text-[9px] font-mono text-cyan-400 bg-cyan-950/80 px-1 py-0.2 rounded border border-cyan-800/80 cursor-help"
              title="Calculé par le modèle climatique FaIR (Finite Amplitude Impulse Response, GIEC AR6)"
            >
              FaIR
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
              +{simulationState.surfaceTemperatureAnomaly.toFixed(2)}
            </span>
            <span className="text-[11px] text-slate-400">°C</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5">
            Océan profond: +{simulationState.deepOceanTemperatureAnomaly.toFixed(2)}°C
          </span>
        </div>

        {/* Élévation Marine */}
        <div className="bg-[#111726] border border-slate-800/80 rounded-lg p-2.5 flex flex-col">
          <span className="text-[11px] text-slate-400 font-medium">Niveau des Mers (VR09)</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-bold font-mono text-sky-400 tabular-nums">
              +{(simulationState.seaLevelRiseMeters * 100).toFixed(0)}
            </span>
            <span className="text-[11px] text-slate-400">cm</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5">
            Régression des deltas arables
          </span>
        </div>

        {/* Surmortalité Annuelle Forcée */}
        <div className="bg-[#111726] border border-slate-800/80 rounded-lg p-2.5 flex flex-col">
          <span className="text-[11px] text-slate-400 font-medium">Surmortalité Annuelle</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-bold font-mono text-purple-400 tabular-nums">
              {(
                simulationState.worldDeathsAnnual.thermal +
                simulationState.worldDeathsAnnual.famine +
                simulationState.worldDeathsAnnual.sanitary
              ).toFixed(1)}
            </span>
            <span className="text-[11px] text-slate-400">M / an</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5">
            Famines: {simulationState.worldDeathsAnnual.famine.toFixed(1)}M · Chaleur: {simulationState.worldDeathsAnnual.thermal.toFixed(1)}M
          </span>
        </div>
      </div>

      {/* Ligne 2 : Commandes de lecture, scrubber temporel et jalons historiques */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 border-t border-slate-800/80">
        {/* Contrôles de transport Play / Pause / Step / Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className={`flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-all shadow-md ${
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
            disabled={currentYear >= 2100}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 transition-colors"
            title="Avancer d'une année (+1 an)"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-300 hover:bg-slate-700 transition-colors text-xs font-medium border border-slate-700/60"
            title="Réinitialiser l'état de la carte à aujourd'hui (2026)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Aujourd'hui (2026)</span>
          </button>

          {/* Vitesse de simulation */}
          <div className="flex items-center bg-[#141b2a] rounded-lg p-0.5 border border-slate-800 text-[11px] font-mono ml-1">
            {[1, 2, 5, 10].map(s => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-2 py-1 rounded transition-colors ${
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

        {/* Curseur temporel Scrubber (2026 - 2100) */}
        <div className="flex-1 w-full flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>2026 (Présent)</span>
            <span className="text-base font-bold text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono tabular-nums">
              Année {Math.floor(currentYear)}
            </span>
            <span>2100 (Horizon)</span>
          </div>

          <div className="relative w-full flex items-center">
            <input
              type="range"
              min={2026}
              max={2100}
              step={1}
              value={Math.floor(currentYear)}
              onChange={(e) => onSeekYear(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
            />
          </div>

          {/* Points repères des ruptures biophysiques */}
          <div className="relative w-full h-4 mt-0.5">
            {SIMULATION_MILESTONES.map((m) => {
              const leftPercent = ((m.year - 2026) / (2100 - 2026)) * 100;
              const isActive = Math.floor(currentYear) >= m.year;
              return (
                <button
                  key={m.year}
                  onClick={() => onSeekYear(m.year)}
                  style={{ left: `${leftPercent}%` }}
                  title={`${m.year}: ${m.title}`}
                  className={`absolute -translate-x-1/2 top-0 flex flex-col items-center group cursor-pointer`}
                >
                  <span
                    className={`w-2 h-2 rounded-full transition-transform group-hover:scale-150 ${
                      isActive ? 'bg-cyan-400 ring-2 ring-cyan-500/30' : 'bg-slate-600'
                    }`}
                  />
                  <span className="text-[9px] font-mono text-slate-500 group-hover:text-slate-300 hidden md:block">
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
            Jalon {currentMilestone.year}
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
