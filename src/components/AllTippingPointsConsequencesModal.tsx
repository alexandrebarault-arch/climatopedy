import React from 'react';
import {
  X,
  AlertTriangle,
  Flame,
  Waves,
  Globe2,
  Skull,
  TrendingUp,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Compass,
  ArrowRight,
  Zap,
  Info
} from 'lucide-react';

interface AllTippingPointsConsequencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSimulatedTemp: number;
}

export const AllTippingPointsConsequencesModal: React.FC<AllTippingPointsConsequencesModalProps> = ({
  isOpen,
  onClose,
  currentSimulatedTemp
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-xl overflow-hidden flex flex-col text-slate-800 max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="all-tipping-title"
      >
        {/* En-tête percutant rouge/ambre */}
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-rose-200 bg-gradient-to-r from-rose-50 via-slate-50 to-rose-50/40">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-xl bg-rose-100 border border-rose-200 text-rose-600 shrink-0 mt-0.5">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono uppercase tracking-wider text-rose-800 font-bold bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                  Synthèse des risques climatiques
                </span>
                <span className="text-[11px] font-mono text-slate-600">
                  Steffen et al. (2018) · Armstrong McKay et al. (2022)
                </span>
              </div>
              <h2 id="all-tipping-title" className="text-lg sm:text-xl font-black text-slate-800 tracking-tight mt-1">
                Quels risques sont étudiés pour les éléments de bascule climatique ?
              </h2>
              <p className="text-xs text-rose-900 mt-1">
                Les seuils et conséquences diffèrent selon les éléments et comportent des incertitudes.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0 ml-2"
            aria-label="Fermer la fenêtre d'alerte"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu déroulant */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* BANDEAU 1 : RÉSULTATS INDICATIFS DES SCÉNARIOS DU SITE */}
          <div className="bg-gradient-to-r from-rose-50/60 via-slate-50 to-amber-50/40 border border-rose-200 rounded-xl p-4 sm:p-5">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider mb-2">
              <Clock className="w-4 h-4 text-rose-600" />
              1. Que représentent les dates affichées ?
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs">
                <div>
                  <span className="text-[11px] font-semibold text-rose-900 block">
                    Scénario CLIMATOPEDY à émissions élevées
                  </span>
                  <div className="text-xl sm:text-2xl font-black font-mono text-rose-700 mt-1">
                    Sortie du modèle
                  </div>
                  <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">
                    Les dates et seuils calculés ici sont des sorties du scénario CLIMATOPEDY; ils ne constituent pas des dates de franchissement établies par les études citées ou par le GIEC.
                  </p>
                </div>
                <div className="mt-3 text-[10px] font-mono text-rose-800 bg-white px-2 py-1 rounded border border-rose-300">
                  Scénario conditionnel du modèle
                </div>
              </div>

              <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-900 block">
                    Trajectoire de Sobriété & Agroécologie (Scénario B CLIMATOPEDY)
                  </span>
                  <div className="text-xl sm:text-2xl font-black font-mono text-emerald-700 mt-1">
                    Sortie du modèle
                  </div>
                  <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">
                    Cette trajectoire est un scénario interne à CLIMATOPEDY. Les résultats calculés ne démontrent pas que des éléments de bascule sont nécessairement évités dans le monde réel.
                  </p>
                </div>
                <div className="mt-3 text-[10px] font-mono text-emerald-800 bg-white px-2 py-1 rounded border border-emerald-300">
                  Scénario conditionnel du modèle
                </div>
              </div>
            </div>
          </div>

          {/* BANDEAU 2 : LES 5 CONSÉQUENCES SYSTÉMIQUES DIRECTES */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              2. Résultats scientifiques portant sur ces systèmes
            </h3>

            <div className="space-y-3">
              {/* Conséquence 1 : Perte de contrôle humain */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-slate-300 shadow-2xs transition-colors">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold font-mono text-xs">
                    1
                  </span>
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
                     Rétroactions du cycle du carbone
                  </h4>
                </div>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed pl-8">
                  Le dégel du pergélisol et les changements des écosystèmes peuvent modifier les échanges de carbone entre les terres et l'atmosphère. L'ampleur et le calendrier de ces rétroactions restent incertains; elles ne justifient pas l'affirmation d'un réchauffement autonome et illimité.
                </p>
              </div>

              {/* Conséquence 2 : Montée des mers +10 à +12 mètres */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-slate-300 shadow-2xs transition-colors">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold font-mono text-xs">
                    2
                  </span>
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-2">
                     <span>Élévation potentielle à long terme du niveau marin</span>
                    <span className="text-[10px] text-sky-800 font-mono font-medium bg-sky-100 px-1.5 py-0.5 rounded border border-sky-200">Irréversible</span>
                  </h4>
                </div>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed pl-8">
                  La perte complète des grandes calottes glaciaires contribuerait à une élévation de plusieurs mètres du niveau marin sur de longues échelles de temps. Les projections pour les siècles à venir dépendent du scénario d'émissions et comportent une incertitude importante; elles ne déterminent pas un nombre de personnes déplacées.
                </p>
              </div>

              {/* Conséquence 3 : Arrêt de l'AMOC et chaos des moussons */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-slate-300 shadow-2xs transition-colors">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold font-mono text-xs">
                    3
                  </span>
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
                    Affaiblissement de l'AMOC et effets régionaux
                  </h4>
                </div>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed pl-8">
                  Le GIEC juge très probable un affaiblissement de l'AMOC au XXIe siècle et indique qu'un effondrement abrupt avant 2100 n'est pas attendu (confiance moyenne). Un effondrement, s'il survenait, modifierait les régimes régionaux de température et de précipitations.
                </p>
              </div>

              {/* Conséquence 4 : Chaleur et humidité */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-slate-300 shadow-2xs transition-colors">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold font-mono text-xs">
                    4
                  </span>
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
                    Chaleur et humidité : exposition au stress thermique
                  </h4>
                </div>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed pl-8">
                  Le risque de stress thermique dépend de la température, de l'humidité, de l'activité, de l'exposition et de la physiologie. Une valeur de température au thermomètre mouillé ne détermine pas à elle seule une durée de survie universelle.
                </p>
              </div>

              {/* Résultats sur l'agriculture */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-slate-300 shadow-2xs transition-colors">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold font-mono text-xs">
                    5
                  </span>
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
                    Sensibilité des rendements agricoles à la température
                  </h4>
                </div>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed pl-8">
                  Sans fertilisation au CO₂, adaptation efficace ni amélioration génétique, Zhao et al. (2017) estiment en moyenne une baisse des rendements mondiaux par degré de réchauffement : maïs 7,4%, blé 6,0%, riz 3,2% et soja 3,1%. Les effets varient selon les régions et les cultures.
                </p>
              </div>
            </div>
          </div>

          {/* BANDEAU 3 : CONCLUSION SCIENTIFIQUE VULGARISÉE */}
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-start gap-3 shadow-2xs">
            <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900 font-bold">À retenir :</strong> Les estimations de seuils et leurs conséquences comportent des plages d'incertitude. Les résultats des scénarios CLIMATOPEDY sont des simulations conditionnelles, et non des prévisions du GIEC.
            </div>
          </div>
        </div>

        {/* Pied de modal */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            Source : Armstrong McKay et al., Science 2022 · Steffen et al., PNAS 2018
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            J'ai compris
          </button>
        </div>
      </div>
    </div>
  );
};
