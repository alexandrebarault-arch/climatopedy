import React from 'react';
import {
  X,
  Thermometer,
  Calendar,
  AlertTriangle,
  Lightbulb,
  Undo2,
  Clock,
  Activity,
  Layers,
  CheckCircle2,
  ExternalLink,
  Snowflake,
  TreePine,
  Waves
} from 'lucide-react';
import { TippingElement } from './TippingPointsView';

interface TippingPointModalProps {
  element: TippingElement | null;
  isOpen: boolean;
  onClose: () => void;
  currentSimulatedTemp: number;
}

export const TippingPointModal: React.FC<TippingPointModalProps> = ({
  element,
  isOpen,
  onClose,
  currentSimulatedTemp
}) => {
  if (!isOpen || !element) return null;

  // Calcul du statut au niveau de réchauffement actuel
  const isSafe = currentSimulatedTemp < element.thresholdMin;
  const isUncertain = currentSimulatedTemp >= element.thresholdMin && currentSimulatedTemp < element.thresholdEst;
  const isTipped = currentSimulatedTemp >= element.thresholdEst;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-[#0f172a] border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col text-slate-200 max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-element-title"
      >
        {/* En-tête de la fiche explicative */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-[#0d1322]">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border flex items-center justify-center ${
              element.category === 'cryosphere'
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                : element.category === 'biosphere'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
            }`}>
              {element.category === 'cryosphere' && <Snowflake className="w-5 h-5" />}
              {element.category === 'biosphere' && <TreePine className="w-5 h-5" />}
              {element.category === 'ocean_atmosphere' && <Waves className="w-5 h-5" />}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  {element.categoryLabel} · {element.location}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isTipped
                    ? 'bg-rose-950 border-rose-700 text-rose-300'
                    : isUncertain
                    ? 'bg-amber-950 border-amber-700 text-amber-300'
                    : 'bg-emerald-950 border-emerald-700 text-emerald-300'
                }`}>
                  {isTipped ? '⚠️ Seuil franchi à +' + currentSimulatedTemp.toFixed(1) + '°C' : isUncertain ? '⚠️ Zone de risque' : '✓ Préservé'}
                </span>
              </div>
              <h3 id="modal-element-title" className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                {element.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fermer la fiche descriptive"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps de la fiche : Explication pédagogique pour tout le monde */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Ligne repère thermique et date estimée */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#131c31] border border-slate-800/80 rounded-xl p-3.5">
            <div className="flex items-center gap-2.5">
              <Thermometer className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-400 block">Seuil de basculement scientifique</span>
                <span className="font-mono font-bold text-white text-xs sm:text-sm">
                  +{element.thresholdEst.toFixed(1)}°C <span className="text-slate-400 font-normal text-xs">(fourchette : {element.thresholdMin}°C à {element.thresholdMax}°C)</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-400 block">Date estimée de franchissement (trajectoire actuelle)</span>
                <span className="font-mono font-bold text-amber-300 text-xs sm:text-sm">
                  {element.estimatedYearTendency || '2030 – 2045 selon scénario'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 1 : C'est quoi en clair ? */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Lightbulb className="w-4 h-4 text-cyan-400" />
              1. C'est quoi concrètement ? (En langage simple)
            </div>
            <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
              {element.whatIsItSimple || element.summarySimple}
            </p>
          </div>

          {/* Section 2 : Pourquoi c'est un point de non-retour ? */}
          <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Undo2 className="w-4 h-4 text-rose-400" />
              2. Pourquoi ne peut-on plus faire marche arrière ? (L'irréversibilité)
            </div>
            <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
              {element.whyPointOfNoReturn || element.irreversibilityNotes}
            </p>
          </div>

          {/* Section 3 : Conséquence directe dans votre vie / votre assiette */}
          <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              3. Quel impact direct dans la vie de tous les jours ?
            </div>
            <p className="text-slate-200 leading-relaxed text-xs sm:text-sm">
              {element.concreteImpactEveryday || element.consequencePlain}
            </p>
          </div>

          {/* Section 4 : Ce que la science et les satellites mesurent aujourd'hui */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              4. Les faits mesurés aujourd'hui par les instruments réels
            </div>
            <div className="text-slate-300 leading-relaxed text-xs font-mono bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              {element.observedFactToday}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-2">
              <span>Temps pour basculer : <strong>{element.timescaleYears}</strong></span>
              <span>Source : {element.scientificSource}</span>
            </div>
          </div>
        </div>

        {/* Pied de modal avec bouton de fermeture */}
        <div className="p-4 border-t border-slate-800 bg-[#0c1220] flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Fiche pédagogique accessible à tous · GAIA-Sim
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Fermer la fiche
          </button>
        </div>
      </div>
    </div>
  );
};
