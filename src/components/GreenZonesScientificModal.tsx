import React from 'react';
import { X, ShieldCheck, Thermometer, TreePine, Users, Waves, BookOpen, AlertTriangle } from 'lucide-react';

interface GreenZonesScientificModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentYear: number;
}

export const GreenZonesScientificModal: React.FC<GreenZonesScientificModalProps> = ({
  isOpen,
  onClose,
  currentYear
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] bg-white border border-emerald-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-700"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-green-zones-title"
      >
        {/* En-tête */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
              <TreePine className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modal-green-zones-title" className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
                Pourquoi certaines zones restent-elles vertes en 2100 et 2200 ?
                <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Faits Scientifiques GIEC AR6
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Diagnostic biophysique rigoureux basé sur les publications scientifiques de référence (GIEC, PNAS, Science Advances).
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Fermer (Échap)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps déroulant */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-sm leading-relaxed">
          
          {/* Synthèse immédiate */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3.5">
            <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-emerald-800 text-sm">
                La carte affiche des sorties du simulateur CLIMATOPEDY; le GIEC ne valide pas ces résultats régionaux du modèle.
              </h3>
              <p className="text-xs text-slate-700 mt-1">
                Les valeurs régionales pour 2100 et 2200 sont des résultats de simulation CLIMATOPEDY, conditionnels à ses paramètres. Elles ne constituent pas des projections officielles du GIEC ni une garantie d'absence de stress thermique.
              </p>
            </div>
          </div>

          {/* Grille des 4 piliers scientifiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Pilier 1 : Thermodynamique du thermomètre mouillé */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-sky-700 font-semibold text-sm">
                <Thermometer className="w-4 h-4" />
                <span>1. Thermodynamique du thermomètre mouillé (Tw)</span>
              </div>
              <p className="text-xs text-slate-600">
                L'inhabitabilité thermique ne dépend pas seulement de la température brute (thermomètre sec), mais de sa combinaison avec l'humidité absolue de l'air (<a href="https://www.pnas.org/doi/10.1073/pnas.0913352107" target="_blank" rel="noreferrer" className="text-sky-600 font-semibold underline">Sherwood &amp; Huber 2010 PNAS</a>, <a href="https://www.science.org/doi/10.1126/sciadv.aaw1838" target="_blank" rel="noreferrer" className="text-sky-600 font-semibold underline">Raymond et al. 2020 Science Advances</a>).
              </p>
              <ul className="text-xs text-slate-600 list-disc list-inside space-y-1 pl-1">
                <li>
                  <strong className="text-slate-800">Dans les tropiques et golfes humides :</strong> Une atmosphère plus chaude peut contenir davantage de vapeur d'eau à saturation; l'évolution locale de l'humidité dépend aussi des conditions atmosphériques.
                </li>
                <li>
                  <strong className="text-slate-800">Dans les hautes latitudes :</strong> Les valeurs de Tw représentées sur la carte proviennent de la simulation CLIMATOPEDY et dépendent de ses données et paramètres régionaux.
                </li>
              </ul>
            </div>

            {/* Pilier 2 : Le « Verdissement Arctique » vs le « Brunissement Boréal » */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
                <TreePine className="w-4 h-4" />
                <span>2. « Verdissement Arctique » vs « Brunissement »</span>
              </div>
              <p className="text-xs text-slate-600">
                La couleur verte reflète aussi un phénomène écologique réel observé par satellite (<a href="https://www.nature.com/articles/nclimate3004" target="_blank" rel="noreferrer" className="text-emerald-700 font-semibold underline">Zhu et al. 2016 Nature Climate Change</a>, GIEC AR6 GT1 Box TS.3) :
              </p>
              <ul className="text-xs text-slate-600 list-disc list-inside space-y-1 pl-1">
                <li>
                  <strong className="text-slate-800">Verdissement de la toundra :</strong> L'allongement de la saison végétative permet aux arbustes et résineux de coloniser l'extrême nord.
                </li>
                <li>
                  <strong className="text-amber-800 font-semibold">Attention, ce n'est pas un éden :</strong> La frange sud des forêts boréales subit un « brunissement » avec mégafeux incontrôlables, pullulation de scolytes et dégel du pergélisol qui affaisse les sols (thermokarst).
                </li>
              </ul>
            </div>

            {/* Pilier 3 : Déplacement des ceintures agricoles & calories */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-amber-700 font-semibold text-sm">
                <BookOpen className="w-4 h-4" />
                <span>3. Déplacement des ceintures agricoles vers le Nord</span>
              </div>
              <p className="text-xs text-slate-600">
                Dans la couche <em>« Déficit Calorique »</em>, le Canada, la Russie et l'Argentine restent verts (&gt; 2700 kcal/j) car :
              </p>
              <ul className="text-xs text-slate-600 list-disc list-inside space-y-1 pl-1">
                <li>
                  Zhao et al. (2017) estiment des effets moyens du réchauffement sur les rendements de plusieurs grandes cultures; cette étude ne démontre pas à elle seule une migration générale des cultures vers le nord.
                </li>
                <li>
                  Les niveaux de calories et de population de cette carte sont des sorties de simulation; la publication citée n'établit pas un avantage alimentaire régional en cas de baisse des intrants.
                </li>
              </ul>
            </div>

            {/* Pilier 4 : Dynamique des Réfugiés & Pression démographique */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-purple-700 font-semibold text-sm">
                <Users className="w-4 h-4" />
                <span>4. Densité Démographique & Réfugiés Climatiques</span>
              </div>
              <p className="text-xs text-slate-600">
                Dans la couche <em>« Densité &amp; Dépopulation »</em>, les zones boréales apparaissent en vert car leur population relative <strong>augmente</strong> (&gt; +15%) :
              </p>
              <ul className="text-xs text-slate-600 list-disc list-inside space-y-1 pl-1">
                <li>
                Les nombres et déplacements affichés sont des sorties du modèle CLIMATOPEDY; ils ne sont pas des estimations validées de migrations climatiques.
                </li>
                <li>
                  Les effets sur les infrastructures et les politiques migratoires ne sont pas établis par cette simulation; ils ne sont pas déduits ici comme des faits.
                </li>
              </ul>
            </div>

          </div>

          {/* Prospective 2100 - 2200 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-2">
              <Waves className="w-4 h-4 text-sky-600" />
              Ce qui se passe scientifiquement entre 2100 et 2200 (Horizon Séculaire Long)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <span className="font-bold text-sky-700 block mb-1">Montée Séculaire des Eaux (+2,6 m)</span>
                Le niveau moyen de la mer continuera de s'élever pendant des siècles à des millénaires. Les valeurs pour 2200 affichées ici sont des sorties de simulation CLIMATOPEDY, pas une projection GIEC unique. L'AR6 fournit des plages dépendant du scénario et de l'horizon.
              </div>
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <span className="font-bold text-amber-700 block mb-1">Épuisement Géologique Fossile</span>
                Les dates d'épuisement et la composition du système énergétique en 2200 sont des hypothèses et des résultats du modèle CLIMATOPEDY, et non des conclusions du GIEC.
              </div>
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <span className="font-bold text-emerald-700 block mb-1">Stabilisation Démographique</span>
                Les valeurs démographiques de 2200 affichées par cette simulation dépendent des hypothèses de CLIMATOPEDY; elles ne sont pas des projections démographiques officielles.
              </div>
            </div>
          </div>

          {/* Références bibliographiques scientifiques formelles */}
          <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 text-[11px] text-slate-600">
            <span className="font-bold text-slate-800 block mb-1">Sources &amp; Publications Scientifiques de Référence :</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>• <strong>Sherwood &amp; Huber (2010)</strong>, <em>PNAS</em> : Limite d'adaptabilité humaine à la contrainte thermique mouillée.</div>
              <div>• <strong>Raymond et al. (2020)</strong>, <em>Science Advances</em> : Émergence des seuils de chaleur et d'humidité létales.</div>
              <div>• <strong>GIEC AR6 WG1 (2021)</strong>, <em>Chapitres 9 &amp; 11</em> : Montée des océans à 2300 et extrêmes climatiques régionaux.</div>
              <div>• <strong>Zhu et al. (2016)</strong>, <em>Nature Climate Change</em> : Greening of the Earth and its drivers.</div>
            </div>
          </div>

        </div>

        {/* Pied de page */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            Année visualisée : <strong className="text-slate-800">{Math.floor(currentYear)}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-colors cursor-pointer"
          >
            Compris, fermer l'explication
          </button>
        </div>
      </div>
    </div>
  );
};
