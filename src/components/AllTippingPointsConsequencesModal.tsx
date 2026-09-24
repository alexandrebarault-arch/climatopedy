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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-[#0b111e] border border-rose-900/70 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col text-slate-200 max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="all-tipping-title"
      >
        {/* En-tête percutant rouge/ambre */}
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-rose-900/50 bg-gradient-to-r from-rose-950/80 via-[#160c18] to-[#0d1322]">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-xl bg-rose-600/20 border border-rose-500/50 text-rose-400 shrink-0 mt-0.5">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono uppercase tracking-wider text-rose-300 font-bold bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                  Choc Systémique Planétaire
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Modèle Hothouse Earth (Steffen et al. PNAS 2018)
                </span>
              </div>
              <h2 id="all-tipping-title" className="text-lg sm:text-xl font-black text-white tracking-tight mt-1">
                Que se passe-t-il si l'ENSEMBLE des 9 points de bascule est franchi ?
              </h2>
              <p className="text-xs text-rose-200/90 mt-1">
                La bascule vers l'état irréversible de « Terre Étuvante » et la perte de contrôle thermodynamique de la biosphère.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0 ml-2"
            aria-label="Fermer la fenêtre d'alerte"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu déroulant */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* BANDEAU 1 : DATE PRÉVISIONNELLE DU FRANCHISSEMENT TOTAL */}
          <div className="bg-gradient-to-r from-rose-950/40 via-amber-950/30 to-slate-900 border border-rose-800/60 rounded-xl p-4 sm:p-5">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Clock className="w-4 h-4 text-rose-400" />
              1. Quand ce seuil de basculement total risque-t-il d'arriver ?
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div className="bg-rose-950/60 border border-rose-700/60 rounded-xl p-3.5 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-rose-300 block">
                    Trajectoire Fossile Tendancielle (Sans rupture / Échec climatique)
                  </span>
                  <div className="text-xl sm:text-2xl font-black font-mono text-white mt-1">
                    Entre 2085 et 2100
                  </div>
                  <p className="text-xs text-rose-100/80 mt-1.5 leading-relaxed">
                    Si les émissions mondiales restent à des plateaux élevés (+3,5°C à +4,0°C d'ici 2100), le dernier verrou (forêts boréales et AMOC à +4,0°C) cède à la fin du siècle.
                  </p>
                </div>
                <div className="mt-3 text-[10px] font-mono text-rose-300 bg-rose-900/40 px-2 py-1 rounded border border-rose-800/80">
                  Risque maximal de cascade irréversible
                </div>
              </div>

              <div className="bg-emerald-950/50 border border-emerald-700/60 rounded-xl p-3.5 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-300 block">
                    Trajectoire de Sobriété & Agroécologie (Scénario B GAIA-Sim)
                  </span>
                  <div className="text-xl sm:text-2xl font-black font-mono text-emerald-300 mt-1">
                    JAMAIS FRANCHI
                  </div>
                  <p className="text-xs text-emerald-100/80 mt-1.5 leading-relaxed">
                    En diminuant rapidement la combustion fossile (-4%/an) et en sanctuarisant les sols, le climat se stabilise sous +1,8°C. Les grands verrous (Amazonie, calottes géantes, AMOC) sont sauvés.
                  </p>
                </div>
                <div className="mt-3 text-[10px] font-mono text-emerald-300 bg-emerald-900/40 px-2 py-1 rounded border border-emerald-800/80">
                  Climat stabilisé dans une zone habitable
                </div>
              </div>
            </div>
          </div>

          {/* BANDEAU 2 : LES 5 CONSÉQUENCES SYSTÉMIQUES DIRECTES */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              2. Les 5 conséquences physiques majeures dès que tous les points ont basculé
            </h3>

            <div className="space-y-3">
              {/* Conséquence 1 : Perte de contrôle humain */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold font-mono text-xs">
                    1
                  </span>
                  <h4 className="font-bold text-white text-xs sm:text-sm">
                    Perte définitive de contrôle humain (La Terre s'auto-réchauffe)
                  </h4>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed pl-8">
                  Le dégel du pergélisol, la savanisation de l'Amazonie et les méga-feux de la taïga boréale relarguent ensemble plus de <strong>350 à 500 milliards de tonnes de CO2 et de méthane</strong>. La Terre devient elle-même le premier pollueur de la planète. Même si les humains arrêtaient instantanément 100% de leurs usines et véhicules, le climat continuerait de surchauffer tout seul.
                </p>
              </div>

              {/* Conséquence 2 : Montée des mers +10 à +12 mètres */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold font-mono text-xs">
                    2
                  </span>
                  <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
                    <span>Montée cumulée des océans : +10 à +12 mètres</span>
                    <span className="text-[10px] text-cyan-300 font-mono font-normal bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">Irréversible</span>
                  </h4>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed pl-8">
                  La fonte conjointe du Groenland (+7,2 m), de l'Antarctique de l'Ouest (+3,3 m) et du Bassin de Wilkes (+3 m) noie sous l'eau toutes les villes côtières du monde (Tokyo, New York, Shanghaï, Londres, Alexandrie, Bordeaux). Plus de <strong>1,2 milliard de réfugiés climatiques côtiers</strong> doivent fuir vers l'intérieur des terres et tous les grands ports maritimes de commerce sont détruits.
                </p>
              </div>

              {/* Conséquence 3 : Arrêt de l'AMOC et chaos des moussons */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold font-mono text-xs">
                    3
                  </span>
                  <h4 className="font-bold text-white text-xs sm:text-sm">
                    Arrêt du Gulf Stream (AMOC) & Déplacement brutal des Moussons
                  </h4>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed pl-8">
                  L'arrêt du tapis roulant marin plonge le nord de l'Europe dans des hivers glaciaires avec des tempêtes record, tandis que la chaleur s'accumule dans l'Atlantique Sud. Les moussons vitales en Inde et au Sahel s'effondrent ou se décalent, privant d'eau les récoltes vivrières dont dépendent <strong>2 milliards d'habitants</strong>.
                </p>
              </div>

              {/* Conséquence 4 : Inhabitabilité thermique humaine */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold font-mono text-xs">
                    4
                  </span>
                  <h4 className="font-bold text-white text-xs sm:text-sm">
                    Inhabitabilité thermique : La frontière mortelle de Stull (Tw &gt; 31°C)
                  </h4>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed pl-8">
                  La combinaison d'une chaleur extrême et d'une humidité suffocante dépasse le seuil physiologique de refroidissement du corps humain. Dans le golfe Persique, en Asie du Sud, au Sahel et en Amazonie, tout travail extérieur devient mortel en moins de 6 heures pendant 60 à 120 jours par an.
                </p>
              </div>

              {/* Conséquence 5 : Chute de 40% à 60% de la nourriture mondiale */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold font-mono text-xs">
                    5
                  </span>
                  <h4 className="font-bold text-white text-xs sm:text-sm">
                    Effondrement de la production alimentaire mondiale (-40% à -60%)
                  </h4>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed pl-8">
                  La perte de la biodiversité marine (disparition de 99% des coraux), les méga-sécheresses et la stérilisation du pollen des céréales par les canicules frappent simultanément les 4 grands greniers à blé mondiaux (USA, Europe, Ukraine, Chine). Les famines deviennent chroniques et structurelles.
                </p>
              </div>
            </div>
          </div>

          {/* BANDEAU 3 : CONCLUSION SCIENTIFIQUE VULGARISÉE */}
          <div className="bg-cyan-950/30 border border-cyan-800/50 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white">Ce qu'il faut retenir :</strong> Le franchissement simultané de l'ensemble de ces points n'est pas une sentence inévitable. Chaque dixième de degré évité (+1,5°C plutôt que +1,8°C ; +2,0°C plutôt que +2,5°C) empêche un point de bascule supplémentaire de tomber et bloque l'effet domino. C'est tout le sens du modèle biophysique GAIA-Sim.
            </div>
          </div>
        </div>

        {/* Pied de modal */}
        <div className="p-4 border-t border-slate-800 bg-[#080d17] flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            Source : Armstrong McKay et al., Science 2022 · Steffen et al., PNAS 2018
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
          >
            J'ai compris
          </button>
        </div>
      </div>
    </div>
  );
};
