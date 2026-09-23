import React, { useState } from 'react';
import { 
  GitCompare, 
  Sliders, 
  Leaf, 
  Flame, 
  ShieldCheck, 
  TrendingDown, 
  Info, 
  Check, 
  RotateCcw, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Share2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { GlobalBiophysicalState, SimulationScenarioConfig } from '../types/simulation';
import { SCENARIO_BAU, SCENARIO_SOBRIETY, SCENARIO_DELAYED } from '../engine/simulationRunner';
import { getShareableSimulationUrl, CustomSimulationParams } from '../utils/urlParams';

interface ComparisonModePanelProps {
  isCompareMode: boolean;
  onToggleCompareMode: () => void;
  scenarioA: SimulationScenarioConfig;
  scenarioB: SimulationScenarioConfig;
  onSelectScenarioB: (scenario: SimulationScenarioConfig) => void;
  customParams: CustomSimulationParams;
  onUpdateCustomParam: (key: string, value: number) => void;
  trajectoryA: GlobalBiophysicalState[];
  trajectoryB: GlobalBiophysicalState[];
  currentYear: number;
}

export const ComparisonModePanel: React.FC<ComparisonModePanelProps> = ({
  isCompareMode,
  onToggleCompareMode,
  scenarioA,
  scenarioB,
  onSelectScenarioB,
  customParams,
  onUpdateCustomParam,
  trajectoryA,
  trajectoryB,
  currentYear
}) => {
  const [showSliders, setShowSliders] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  // Génération de l'URL partageable contenant les paramètres exacts
  const handleCopyShareUrl = async () => {
    try {
      const url = getShareableSimulationUrl(customParams, scenarioB.id, currentYear);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback si l'API clipboard n'est pas accessible
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedUrl(true);
      setShareFeedback('Lien copié dans le presse-papier !');
      setTimeout(() => {
        setCopiedUrl(false);
        setShareFeedback(null);
      }, 3500);
    } catch {
      setShareFeedback('Erreur lors de la copie du lien');
      setTimeout(() => setShareFeedback(null), 3000);
    }
  };

  // États au point 2100 pour la scorecard d'impact final
  const state2100A = trajectoryA.find((t) => t.year === 2100) || trajectoryA[trajectoryA.length - 1];
  const state2100B = trajectoryB.find((t) => t.year === 2100) || trajectoryB[trajectoryB.length - 1];

  // États pour l'année courante inspectée
  const yr = Math.floor(currentYear);
  const stateCurA = trajectoryA.find((t) => t.year === yr) || state2100A;
  const stateCurB = trajectoryB.find((t) => t.year === yr) || state2100B;

  // Calculs différentiels (Deltas) en 2100
  const deltaTemp2100 = (state2100B.surfaceTemperatureAnomaly - state2100A.surfaceTemperatureAnomaly);
  const deltaSlr2100Cm = Math.round((state2100B.seaLevelRiseMeters - state2100A.seaLevelRiseMeters) * 100);
  const deltaEroi2100 = (state2100B.currentEroi - state2100A.currentEroi);
  const deltaCal2100 = Math.round(state2100B.globalAverageCaloriesPerCapita - state2100A.globalAverageCaloriesPerCapita);

  // Cumul des décès évités sur la période 2026-2100
  let cumDeathsA = 0;
  let cumDeathsB = 0;
  for (let y = 2026; y <= 2100; y++) {
    const sA = trajectoryA.find((t) => t.year === y);
    const sB = trajectoryB.find((t) => t.year === y);
    if (sA && sB) {
      cumDeathsA += (sA.worldDeathsAnnual.thermal + sA.worldDeathsAnnual.famine);
      cumDeathsB += (sB.worldDeathsAnnual.thermal + sB.worldDeathsAnnual.famine);
    }
  }
  const livesSavedMillions = Math.max(0, Math.round(cumDeathsA - cumDeathsB));

  return (
    <section 
      id="comparison-section"
      className="bg-[#0b101b] rounded-xl border border-slate-800 p-4 sm:p-5 shadow-xl transition-all"
    >
      {/* En-tête avec bouton d'activation principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <GitCompare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                Mode Comparaison Multi-Trajectoires
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-semibold">
                  Interactif
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Superposez deux scénarios biophysiques pour mesurer l'impact de la sobriété et de l'agroécologie sur les résultats finaux.
            </p>
          </div>
        </div>

        {/* Boutons d'action : Partager l'URL persistante & Toggle On/Off */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* Bouton de Partage d'URL persistante */}
          <button
            onClick={handleCopyShareUrl}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
              copiedUrl
                ? 'bg-emerald-900/90 text-emerald-200 border-emerald-500 shadow-sm'
                : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border-slate-700 hover:border-slate-600'
            }`}
            title="Copier l'URL persistante avec les paramètres exacts du scénario B"
          >
            {copiedUrl ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Lien copié !</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Partager simulation</span>
              </>
            )}
          </button>

          {/* Toggle On/Off */}
          <button
            onClick={onToggleCompareMode}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm ${
              isCompareMode
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>{isCompareMode ? 'Mode Comparaison : Activé' : 'Activer la Comparaison'}</span>
            <span className={`w-2 h-2 rounded-full ${isCompareMode ? 'bg-emerald-200 animate-pulse' : 'bg-slate-500'}`} />
          </button>
        </div>
      </div>

      {/* Bannière de notification lors du partage */}
      {shareFeedback && (
        <div className="mt-3 px-3 py-2 bg-emerald-950/90 border border-emerald-700/80 rounded-lg text-xs text-emerald-200 flex items-center justify-between animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Lien persistant généré :</strong> Tous les paramètres du scénario B (baisse pétrole, agroécologie, résilience, sensibilité ECS) sont encodés dans l'URL.
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-300/80 ml-2">URL prête à être transmise</span>
        </div>
      )}

      {isCompareMode && (
        <div className="mt-4 flex flex-col gap-4 animate-in fade-in duration-200">
          {/* Sélecteurs de scénarios A vs B */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Scénario A (Référence actuelle) */}
            <div className="bg-[#0e1422] p-3.5 rounded-lg border border-sky-900/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-sky-400 inline-block shadow-sm" />
                    <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400 font-bold">
                      Trajectoire A (Référence)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-950/80 border border-sky-800 text-sky-300">
                    Ligne continue
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-100 mb-1">
                  {scenarioA.name}
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {scenarioA.tagline}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex flex-wrap gap-x-3 gap-y-1">
                <span>Sobriété fossile : <strong className="text-slate-200">0%/an</strong></span>
                <span>Agroécologie : <strong className="text-slate-200">0%</strong></span>
                <span>Résilience : <strong className="text-slate-200">x1.0</strong></span>
              </div>
            </div>

            {/* Scénario B (Choix alternatif superposé) */}
            <div className="bg-[#0e1422] p-3.5 rounded-lg border border-emerald-900/70 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block shadow-sm animate-pulse" />
                    <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                      Trajectoire B (Superposée)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300">
                    Ligne pointillée
                  </span>
                </div>

                {/* Boutons de sélection rapide du Scénario B */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <button
                    onClick={() => onSelectScenarioB(SCENARIO_SOBRIETY)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                      scenarioB.id === 'sobriety'
                        ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    🌿 Sobriété &amp; Agroécologie
                  </button>

                  <button
                    onClick={() => onSelectScenarioB(SCENARIO_DELAYED)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                      scenarioB.id === 'delayed'
                        ? 'bg-amber-600 text-white font-semibold shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    ⚡ Transition Tardive
                  </button>

                  <button
                    onClick={() => {
                      onSelectScenarioB({
                        id: 'custom',
                        name: 'Scénario Personnalisé (Variables Clés)',
                        shortName: 'Personnalisé',
                        tagline: 'Paramétrage sur mesure des variables de sobriété et de résilience',
                        description: 'Ajustez librement les curseurs pour observer la réponse physique du système Terre.',
                        badgeColor: 'border-purple-500/50 bg-purple-950/40 text-purple-300',
                        lineColor: '#c084fc',
                        dashArray: '6 3',
                        ...customParams,
                        ultimateReservesQinf: 2.80e12
                      });
                      setShowSliders(true);
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                      scenarioB.id === 'custom'
                        ? 'bg-purple-600 text-white font-semibold shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    ⚙️ Personnalisé
                  </button>
                </div>

                <div className="text-xs font-medium text-emerald-300">
                  {scenarioB.tagline}
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between">
                <div className="text-[11px] font-mono text-slate-400 flex flex-wrap gap-x-3 gap-y-1">
                  <span>Sobriété : <strong className="text-emerald-300">-{scenarioB.oilDemandReductionRate}%/an</strong></span>
                  <span>Agroécologie : <strong className="text-emerald-300">{scenarioB.agroEcologyAdoptionRate}%</strong></span>
                  <span>Résilience : <strong className="text-emerald-300">x{scenarioB.adaptationResilienceBoost.toFixed(1)}</strong></span>
                </div>

                <button
                  onClick={() => setShowSliders(!showSliders)}
                  className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer ml-auto"
                >
                  <Sliders className="w-3 h-3" />
                  <span>{showSliders ? 'Fermer curseurs' : 'Ajuster variables'}</span>
                  {showSliders ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>

          {/* Tiroir des curseurs de personnalisation */}
          {showSliders && (
            <div className="bg-[#0e1422] p-4 rounded-lg border border-purple-900/60 flex flex-col gap-3.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2 font-semibold text-purple-300">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Panneau de Contrôle des Variables Clés (Recalcul en Direct)</span>
                </div>
                <button
                  onClick={() => {
                    onSelectScenarioB(SCENARIO_SOBRIETY);
                  }}
                  className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Rétablir valeurs Sobriété</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* 1. Rythme de sobriété fossile */}
                <div className="flex flex-col gap-1.5 bg-[#080c14] p-2.5 rounded border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
                      Rythme de sobriété fossile (Demande)
                    </span>
                    <span className="font-mono font-bold text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800 text-[11px]">
                      -{customParams.oilDemandReductionRate.toFixed(1)}% / an
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    step="0.5"
                    value={customParams.oilDemandReductionRate}
                    onChange={(e) => onUpdateCustomParam('oilDemandReductionRate', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <p className="text-[10.5px] text-slate-400">
                    Baisse annuelle organisée de l'extraction. Préserve l'EROI au-dessus de 8:1 et évite la falaise énergétique.
                  </p>
                </div>

                {/* 2. Autonomie agroécologique */}
                <div className="flex flex-col gap-1.5 bg-[#080c14] p-2.5 rounded border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                      Autonomie agroécologique (Légumineuses)
                    </span>
                    <span className="font-mono font-bold text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800 text-[11px]">
                      {customParams.agroEcologyAdoptionRate}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={customParams.agroEcologyAdoptionRate}
                    onChange={(e) => onUpdateCustomParam('agroEcologyAdoptionRate', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <p className="text-[10.5px] text-slate-400">
                    Substitution de la synthèse chimique Haber-Bosch par la biofixation naturelle de l'azote pour nourrir la population.
                  </p>
                </div>

                {/* 3. Résilience et adaptation */}
                <div className="flex flex-col gap-1.5 bg-[#080c14] p-2.5 rounded border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                      Effort d'adaptation &amp; résilience collective
                    </span>
                    <span className="font-mono font-bold text-sky-300 bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-800 text-[11px]">
                      x{customParams.adaptationResilienceBoost.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="2.5"
                    step="0.1"
                    value={customParams.adaptationResilienceBoost}
                    onChange={(e) => onUpdateCustomParam('adaptationResilienceBoost', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                  <p className="text-[10.5px] text-slate-400">
                    Refroidissement urbain passif, canopées d'arbres, réseaux d'eau protégés et entraide réduisant la mortalité thermique.
                  </p>
                </div>

                {/* 4. Sensibilité climatique ECS */}
                <div className="flex flex-col gap-1.5 bg-[#080c14] p-2.5 rounded border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-rose-400" />
                      Sensibilité climatique ECS (GIEC)
                    </span>
                    <span className="font-mono font-bold text-rose-300 bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-800 text-[11px]">
                      {customParams.climateSensitivityECS.toFixed(1)}°C
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2.0"
                    max="4.5"
                    step="0.1"
                    value={customParams.climateSensitivityECS}
                    onChange={(e) => onUpdateCustomParam('climateSensitivityECS', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                  <p className="text-[10.5px] text-slate-400">
                    Réchauffement à l'équilibre par doublement du CO2. Valeur centrale GIEC : 3.0°C (plage 2.0 à 4.5°C).
                  </p>
                </div>
              </div>

              {/* Barre d'export d'URL directe au bas du tiroir des curseurs */}
              <div className="pt-2.5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                  <span>Tous les réglages ci-dessus sont immédiatement encodables dans une URL persistante partageable.</span>
                </div>

                <button
                  onClick={handleCopyShareUrl}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold cursor-pointer transition-colors shadow-sm self-end sm:self-auto"
                >
                  {copiedUrl ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>URL copiée !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier le lien de cette configuration</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Scorecard d'impacts comparatifs (Deltas 2100 & Année sélectionnée) */}
          <div className="bg-[#080c14] p-3.5 rounded-lg border border-slate-800 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Scorecard Synthétique des Impacts : Que change la bifurcation d'ici 2100 ?
              </span>
              <span className="text-[10.5px] font-mono text-slate-400">
                Comparatif Trajectoire A vs Trajectoire B
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
              {/* 1. Vies épargnées */}
              <div className="bg-[#0d1322] p-2.5 rounded-lg border border-emerald-900/60 flex flex-col items-center justify-center">
                <span className="text-[10px] text-slate-400 font-medium">Vies épargnées (cumul)</span>
                <span className="text-base sm:text-lg font-extrabold font-mono text-emerald-400 mt-0.5">
                  +{livesSavedMillions >= 1000 ? `${(livesSavedMillions / 1000).toFixed(1)} Md` : `${livesSavedMillions} M`}
                </span>
                <span className="text-[10px] text-emerald-300/80 font-mono">décès canicules/famines évités</span>
              </div>

              {/* 2. Réchauffement évité */}
              <div className="bg-[#0d1322] p-2.5 rounded-lg border border-cyan-900/60 flex flex-col items-center justify-center">
                <span className="text-[10px] text-slate-400 font-medium">Réchauffement évité</span>
                <span className="text-base sm:text-lg font-extrabold font-mono text-cyan-400 mt-0.5">
                  {deltaTemp2100.toFixed(2)}°C
                </span>
                <span className="text-[10px] text-cyan-300/80 font-mono">
                  {state2100B.surfaceTemperatureAnomaly.toFixed(1)}°C vs {state2100A.surfaceTemperatureAnomaly.toFixed(1)}°C
                </span>
              </div>

              {/* 3. Submersion côtière évitée */}
              <div className="bg-[#0d1322] p-2.5 rounded-lg border border-sky-900/60 flex flex-col items-center justify-center">
                <span className="text-[10px] text-slate-400 font-medium">Montée mer épargnée</span>
                <span className="text-base sm:text-lg font-extrabold font-mono text-sky-400 mt-0.5">
                  {deltaSlr2100Cm > 0 ? `+${deltaSlr2100Cm}` : `${deltaSlr2100Cm}`} cm
                </span>
                <span className="text-[10px] text-sky-300/80 font-mono">
                  {Math.round(state2100B.seaLevelRiseMeters * 100)} cm vs {Math.round(state2100A.seaLevelRiseMeters * 100)} cm
                </span>
              </div>

              {/* 4. EROI sauvé */}
              <div className="bg-[#0d1322] p-2.5 rounded-lg border border-amber-900/60 flex flex-col items-center justify-center">
                <span className="text-[10px] text-slate-400 font-medium">Multiplicateur EROI 2100</span>
                <span className="text-base sm:text-lg font-extrabold font-mono text-amber-400 mt-0.5">
                  x{state2100B.currentEroi.toFixed(1)}
                </span>
                <span className="text-[10px] text-amber-300/80 font-mono">
                  vs x{state2100A.currentEroi.toFixed(1)} ({deltaEroi2100 >= 0 ? `+${deltaEroi2100.toFixed(1)}` : deltaEroi2100.toFixed(1)})
                </span>
              </div>

              {/* 5. Sécurité alimentaire */}
              <div className="col-span-2 sm:col-span-1 bg-[#0d1322] p-2.5 rounded-lg border border-emerald-900/60 flex flex-col items-center justify-center">
                <span className="text-[10px] text-slate-400 font-medium">Nourriture 2100</span>
                <span className="text-base sm:text-lg font-extrabold font-mono text-emerald-400 mt-0.5">
                  {Math.round(state2100B.globalAverageCaloriesPerCapita)} kcal
                </span>
                <span className="text-[10px] text-emerald-300/80 font-mono">
                  vs {Math.round(state2100A.globalAverageCaloriesPerCapita)} kcal/hab/j
                </span>
              </div>
            </div>

            {/* Note d'explication de la superposition des graphiques */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900/70 p-2 rounded border border-slate-800 mt-1">
              <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>
                <strong>Graphiques synchronisés ci-dessous :</strong> Les courbes de la <strong>Trajectoire A</strong> (ligne continue) et de la <strong>Trajectoire B</strong> (ligne pointillée) sont désormais superposées en temps réel sur les 4 graphiques biophysiques. Survolez les graphiques pour voir les valeurs côte-à-côte.
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
