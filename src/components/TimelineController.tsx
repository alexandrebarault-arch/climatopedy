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

  return (
    <div id="tour-timeline" className="w-full rounded-xl bg-white border border-slate-200/90 p-4 shadow-xs flex flex-col gap-3">
      {/* Ligne 1 : Résumé des 6 macro-indicateurs biophysiques en temps réel */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
        {/* Population agrégée des zones simulées */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 flex flex-col justify-between">
          <div>
            <span className="text-[11px] text-slate-600 font-medium">Population des zones simulées</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                {(simulationState.worldPopulation / 1000).toFixed(2)}
              </span>
              <span className="text-[11px] text-slate-500">Milliards</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 pt-1 border-t border-slate-200">
            Naissances calculées dans le scénario : {(simulationState.worldBirthsAnnual).toFixed(1)} M/an
          </span>
        </div>

        {/* Rendement de l'Énergie & Énergie Nette Utile (parfaitement compréhensible sans connaissances préalables) */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                Rendement de l'Énergie
                <TechTooltip term="eroi" showIconOnly />
              </span>
              <span className="text-[9.5px] font-mono text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-bold">
                x{simulationState.currentEroi >= 20 ? Math.round(simulationState.currentEroi) : simulationState.currentEroi.toFixed(1)}
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span
                className={`text-lg font-bold font-mono tabular-nums ${
                  simulationState.currentEroi < 8.0
                    ? 'text-rose-700'
                    : simulationState.currentEroi < 15.0
                    ? 'text-amber-700'
                    : 'text-emerald-700'
                }`}
              >
                {simulationState.currentEroi >= 20 ? Math.round(simulationState.currentEroi) : simulationState.currentEroi.toFixed(1)} barils
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block leading-tight">
              obtenus pour 1 baril dépensé à forer
            </span>
          </div>
          <span className="text-[10px] text-emerald-800 mt-1 pt-1 border-t border-slate-200">
            <strong>{(simulationState.netEnergyRatio * 100).toFixed(0)}%</strong> d'énergie utile pour la société
          </span>
        </div>

        {/* CO2 Atmosphérique */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                Gaz effet de serre
                <TechTooltip term="fair" showIconOnly />
              </span>
              <span className="text-[9px] font-mono text-slate-500">CO₂</span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold font-mono text-sky-800 tabular-nums">
                {Math.round(simulationState.atmosphericCo2Ppm)}
              </span>
              <span className="text-[11px] text-slate-500">ppm</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 pt-1 border-t border-slate-200">
            {isHistorical ? 'NOAA / reconstructions paléoclimatiques' : 'Valeur mesurée ou simulée selon l\'année'}
          </span>
        </div>

        {/* Réchauffement Mondial */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                Réchauffement
                <TechTooltip term="fair" showIconOnly />
              </span>
              <span
                className="text-[9px] font-mono text-sky-800 bg-sky-50 px-1 py-0.2 rounded border border-sky-200 cursor-help"
                title="FaIR a contribué à certaines analyses du GIEC AR6; cette valeur est une sortie du simulateur CLIMATOPEDY."
              >
                FaIR / CLIMATOPEDY
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span
                className={`text-lg font-bold font-mono tabular-nums ${
                  simulationState.surfaceTemperatureAnomaly >= 2.5
                    ? 'text-rose-700'
                    : simulationState.surfaceTemperatureAnomaly >= 1.5
                    ? 'text-amber-700'
                    : 'text-emerald-700'
                }`}
              >
                {simulationState.surfaceTemperatureAnomaly >= 0 ? '+' : ''}{simulationState.surfaceTemperatureAnomaly.toFixed(2)}
              </span>
              <span className="text-[11px] text-slate-500">°C</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 pt-1 border-t border-slate-200">
            Par rapport à l'ère préindustrielle
          </span>
        </div>

        {/* Montée des Océans (Chiffrée sans ambiguïté) */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                Montée Océans
                <TechTooltip term="slr" showIconOnly />
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold font-mono text-sky-700 tabular-nums">
                {simulationState.seaLevelRiseMeters >= 0 ? '+' : ''}{(simulationState.seaLevelRiseMeters * 100).toFixed(0)}
              </span>
              <span className="text-[11px] text-slate-500">cm</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 pt-1 border-t border-slate-200">
            {simulationState.year >= 2026 ? (
              <span>+{Math.max(0, Math.round((simulationState.seaLevelRiseMeters - 0.12) * 100))} cm depuis 2026</span>
            ) : (
              <span>{Math.round((simulationState.seaLevelRiseMeters - 0.12) * 100)} cm vs 2026</span>
            )}
          </span>
        </div>

        {/* Les données disponibles ne permettent pas d'estimer les décès attribuables */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                Décès attribuables
                <TechTooltip term="stull" showIconOnly />
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-sm font-bold text-rose-800">Non estimés</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 pt-1 border-t border-slate-200 leading-tight">
            Les formules actuelles ne sont pas validées par des données sanitaires.
          </span>
        </div>
      </div>

      {simulationState.year >= 2026 && (
        <p className="text-[10px] text-slate-500">
          Pour les années simulées, ces indicateurs sont conditionnels aux paramètres de CLIMATOPEDY; leur précision affichée ne constitue pas une validation empirique.
        </p>
      )}

      {/* Ligne 2 : Commandes de lecture, scrubber temporel séculaire (1900-2100) et jalons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 border-t border-slate-200">
        {/* Contrôles de transport Play / Pause / Step / Reset */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap justify-center sm:justify-start">
          <button
            onClick={onTogglePlay}
            className={`flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-all shadow-xs cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-sky-600 text-white hover:bg-sky-700'
            }`}
            title={isPlaying ? 'Mettre en pause' : 'Lancer la simulation (Espace)'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <button
            onClick={onStepForward}
            disabled={currentYear >= 2200}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 disabled:opacity-40 transition-colors cursor-pointer"
            title="Avancer d'une année (+1 an)"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:text-sky-800 hover:bg-slate-200 transition-colors text-xs font-medium border border-slate-200 cursor-pointer shadow-2xs"
            title="Revenir au présent (2026)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden md:inline">2026 (Auj.)</span>
          </button>

          <button
            onClick={() => onSeekYear(1900)}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              currentYear <= 1910
                ? 'bg-sky-100 text-sky-900 border-sky-300 font-bold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
            }`}
            title="Remonter à 1900 (début de l'ère thermo-industrielle)"
          >
            <span>1900</span>
          </button>

          <button
            onClick={() => onSeekYear(2100)}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              Math.floor(currentYear) === 2100
                ? 'bg-purple-100 text-purple-900 border-purple-300 font-bold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
            }`}
            title="Sauter directement à l'année 2100 (fin du XXIe siècle)"
          >
            <span>2100</span>
          </button>

          <button
            onClick={() => onSeekYear(2200)}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              Math.floor(currentYear) >= 2195
                ? 'bg-rose-100 text-rose-900 border-rose-300 font-bold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
            }`}
            title="Projeter à l'horizon 2200 (prospective scientifique longue portée)"
          >
            <span>2200 🔭</span>
          </button>

          {/* Vitesse de simulation */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-[11px] font-mono ml-1">
            {[1, 2, 5, 10].map(s => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  playbackSpeed === s
                    ? 'bg-white text-sky-800 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Curseur temporel Scrubber (1900 - 2200) */}
        <div className="flex-1 w-full flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1.5 text-[11px] text-sky-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
              1900 (Début pétrole)
            </span>
            <div className="flex items-center gap-2">
              {isHistorical ? (
                <span className="text-[10px] font-sans font-semibold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded">
                  Repères historiques et base modèle (1900–2026)
                </span>
              ) : currentYear <= 2100 ? (
                <span className="text-[10px] font-sans font-semibold bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded">
                  Modèle biophysique (2026–2100)
                </span>
              ) : (
                <span className="text-[10px] font-sans font-semibold bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded">
                  Simulation CLIMATOPEDY (2100–2200)
                </span>
              )}
              <span className="text-base font-bold text-slate-900 px-2.5 py-0.5 rounded bg-slate-100 border border-slate-300 font-mono tabular-nums shadow-2xs">
                Année {Math.floor(currentYear)}
              </span>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] text-rose-700 font-medium">
              2200 (Horizon Long)
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
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
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600 focus:outline-none"
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
                        ? 'bg-sky-600 ring-2 ring-sky-400 ring-offset-1 ring-offset-white'
                        : is2100
                        ? 'bg-purple-600 ring-1 ring-purple-400/50'
                        : is2200
                        ? 'bg-rose-600 ring-1 ring-rose-400/50'
                        : isActive
                        ? 'bg-amber-500 ring-1 ring-amber-400/50'
                        : 'bg-slate-300'
                    }`}
                  />
                  <span className="text-[8.5px] font-mono text-slate-400 group-hover:text-slate-700 hidden lg:block">
                    {m.year}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Alerte événementielle synchronisée avec hauteur réservée anti-saccade */}
      <div
        className={`mt-1 p-2.5 rounded-lg border flex items-start gap-2.5 text-xs transition-colors duration-150 min-h-[50px] ${
          currentMilestone
            ? 'bg-amber-50 border-amber-200 text-amber-900 shadow-2xs'
            : 'bg-slate-50/80 border-slate-200/80 text-slate-500'
        }`}
      >
        {currentMilestone ? (
          <>
            <span className="font-mono font-bold text-amber-900 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded text-[11px] shrink-0">
              {currentMilestone.year < 2026 ? 'Histoire' : 'Jalon'} {currentMilestone.year}
            </span>
            <div className="leading-snug">
              <span className="font-bold text-slate-900 mr-1.5">
                {currentMilestone.title} :
              </span>
              <span className="text-amber-800 text-[11px] leading-relaxed">
                {currentMilestone.description}
              </span>
            </div>
          </>
        ) : (
          <>
            <span className="font-mono font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-[11px] shrink-0">
              {currentYear < 2026 ? 'Histoire' : currentYear <= 2100 ? 'Modèle' : 'Horizon'} {Math.floor(currentYear)}
            </span>
            <div className="leading-snug text-[11px] text-slate-600 flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-slate-800">
                {currentYear < 2026
                  ? "Repères historiques et paramètres de base (1900–2026) :"
                  : currentYear <= 2100
                  ? "Simulation biophysique continue (2026–2100) :"
                  : "Simulation CLIMATOPEDY (2100–2200) :"}
              </span>
              <span className="text-slate-500">
                Défilement continu. Cliquez ou survolez un jalon (points colorés ci-dessus) pour analyser un événement clé.
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
