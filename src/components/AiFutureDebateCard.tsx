import React, { useState } from 'react';
import {
  Cpu,
  Flame,
  Zap,
  TrendingDown,
  TrendingUp,
  Scale,
  Sparkles,
  Layers,
  AlertTriangle,
  Lightbulb,
  Droplets,
  Sprout,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Compass
} from 'lucide-react';

export const AiFutureDebateCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'risk' | 'leverage' | 'verdict'>('verdict');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <section className="w-full rounded-2xl bg-white border border-purple-200 p-5 sm:p-8 shadow-xs text-slate-700 flex flex-col gap-6">
      {/* En-tête : Pour aller plus loin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-purple-100 border border-purple-300 text-purple-700 shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-purple-700 font-semibold">
                Pour aller plus loin · Prospective &amp; Biophysique
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              L'IA peut-elle nous sauver ? Ou va-t-elle accélérer le changement ?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Analyse sans complaisance : confrontation entre la puissance des algorithmes (les bits) et les lois inviolables de la matière et de l'énergie (les atomes).
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 transition-colors border border-slate-200 shadow-2xs shrink-0 self-start sm:self-auto cursor-pointer"
        >
          {isExpanded ? (
            <>
              <span>Réduire l'analyse</span>
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Lire l'analyse complète</span>
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* Sélecteur de facette de réflexion */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('risk')}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'risk'
                  ? 'bg-white text-rose-800 border border-rose-300 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>1. L'Accélérateur de Crise (Risques)</span>
            </button>

            <button
              onClick={() => setActiveTab('leverage')}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'leverage'
                  ? 'bg-white text-emerald-800 border border-emerald-300 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>2. Le Levier d'Atténuation (Espoirs)</span>
            </button>

            <button
              onClick={() => setActiveTab('verdict')}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'verdict'
                  ? 'bg-purple-700 text-white shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Scale className={`w-4 h-4 ${activeTab === 'verdict' ? 'text-white' : 'text-purple-600'}`} />
              <span>3. Effets et incertitudes</span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* ONGLET 1 : L'ACCÉLÉRATEUR DE CRISE (LE PIÈGE THERMODYNAMIQUE)              */}
          {/* ========================================================================= */}
          {activeTab === 'risk' && (
            <div className="bg-rose-50/40 rounded-xl border border-rose-200 p-5 sm:p-6 flex flex-col gap-5">
              <div className="flex items-center gap-2.5 text-rose-800">
                <Flame className="w-5 h-5 text-rose-600" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Usages de l'IA, énergie et ressources
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* 1. La faim d'énergie et d'eau */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-rose-800 font-semibold text-sm">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span>L'empreinte matérielle exponentielle</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    L'IA n'est pas « virtuelle ». Elle tourne sur des millions de puces GPU en silicium ultra-raffiné, logées dans des datacenters géants. Ces centres consomment déjà des dizaines de térawattheures d'électricité par an et des millions de mètres cubes d'eau potable pour leur refroidissement.
                  </p>
                  <p className="text-slate-500 italic">
                    D'ici 2030, la demande électrique des datacenters mondiaux pourrait concurrencer directement l'électrification des transports et des pompes à chaleur domestiques.
                  </p>
                </div>

                {/* 2. Le paradoxe de Jevons (Effet Rebond) */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-rose-800 font-semibold text-sm">
                    <TrendingUp className="w-4 h-4 text-rose-600" />
                    <span>Le paradoxe de Jevons : l'effet rebond</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    L'effet rebond désigne une hausse de l'usage d'une ressource après un gain d'efficacité. Son ampleur varie selon le service, les prix, les politiques et la période; il ne conduit pas systématiquement à une hausse de la consommation totale.
                  </p>
                  <p className="text-slate-500 italic">
                    L'effet net de l'usage de l'IA dans l'exploration énergétique dépend de ses applications et des décisions de production; cette carte ne quantifie pas cet effet.
                  </p>
                </div>

                {/* 3. L'optimisation de la surconsommation */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-rose-800 font-semibold text-sm">
                    <Layers className="w-4 h-4 text-amber-600" />
                    <span>L'accélération des flux commerciaux superflus</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    Les usages de l'IA comprennent notamment la publicité et la logistique. Cette page ne dispose pas de données permettant de quantifier leur part dans la puissance de calcul mondiale ni leur effet net sur la consommation.
                  </p>
                  <p className="text-slate-500 italic">
                    Dans une économie linéaire, une IA hyper-performante est un amplificateur de gaspillage de matières premières.
                  </p>
                </div>

                {/* 4. L'illusion technosolutionniste */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-rose-800 font-semibold text-sm">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>L'anesthésie morale du « L'IA va régler ça »</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    Le plus grand danger est psychologique : faire croire aux citoyens et aux décideurs qu'il n'y a pas besoin de sobriété ni de réformes structurelles car une « superintelligence » résoudra la crise climatique au dernier moment par magie.
                  </p>
                  <p className="text-slate-500 italic">
                    Aucun algorithme ne peut violer le deuxième principe de la thermodynamique.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ONGLET 2 : LE LEVIER D'ATTÉNUATION (L'INTELLIGENCE AU SERVICE DES ATOMES)  */}
          {/* ========================================================================= */}
          {activeTab === 'leverage' && (
            <div className="bg-emerald-50/40 rounded-xl border border-emerald-200 p-5 sm:p-6 flex flex-col gap-5">
              <div className="flex items-center gap-2.5 text-emerald-800">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Comment l'IA peut devenir un instrument d'adaptation décisif
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* 1. Découverte de matériaux de rupture */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                    <Lightbulb className="w-4 h-4 text-emerald-600" />
                    <span>Découverte accélérée de matériaux propres</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    L'IA computationnelle (comme les modèles de repliement de protéines et de criblage cristallin) permet de tester en quelques semaines des millions de molécules chimiques qui auraient demandé des siècles en laboratoire.
                  </p>
                  <p className="text-slate-500 italic">
                    Exemples concrets : catalyseurs pour batteries sans cobalt ni nickel (sodium-ion), pérovskites solaires à haut rendement, et enzymes synthétiques pour fixer l'azote sans gaz naturel.
                  </p>
                </div>

                {/* 2. Pilotage des réseaux électriques décentralisés */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                    <Zap className="w-4 h-4 text-sky-600" />
                    <span>Équilibrage des réseaux 100% renouvelables</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    Le solaire et l'éolien sont intermittents. Une IA prédictive peut coordonner en temps réel des millions de batteries de véhicules, de chauffe-eau et d'usines pour absorber les pics et combler les creux sans aucune centrale thermique à gaz.
                  </p>
                  <p className="text-slate-500 italic">
                    Elle transforme un réseau électrique rigide et vulnérable en un écosystème souple et résilient.
                  </p>
                </div>

                {/* 3. Agriculture de précision et économie d'eau */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                    <Droplets className="w-4 h-4 text-sky-600" />
                    <span>Micro-irrigation et santé des sols</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    En analysant les images satellites multispectrales et les capteurs d'humidité au ras du sol, l'IA permet d'irriguer au pied par goutte-à-goutte, économisant jusqu'à 40% d'eau douce et réduisant de moitié l'usage de pesticides.
                  </p>
                  <p className="text-slate-500 italic">
                    Elle assiste les paysans dans le choix de semences adaptées aux nouvelles températures estivales.
                  </p>
                </div>

                {/* 4. Alerte précoce face aux canicules humides Stull Tw */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Protection civile &amp; sauvetage de vies</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    Des systèmes d'apprentissage automatique produisent des prévisions météorologiques. Cette page n'établit pas qu'ils prédisent des seuils de Tw à l'échelle d'un quartier, ni ne quantifie des vies sauvées. Le seuil de 31°C affiché ailleurs est un paramètre du modèle CLIMATOPEDY.
                  </p>
                  <p className="text-slate-500 italic">
                    Une aide vitale pour la logistique de survie lors des étés critiques.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ONGLET 3 : LE VERDICT BIOPHYSIQUE FINAL                                    */}
          {/* ========================================================================= */}
          {activeTab === 'verdict' && (
            <div className="bg-purple-50/60 rounded-xl border border-purple-200 p-6 sm:p-7 flex flex-col gap-5 shadow-xs">
              <div className="flex items-center gap-2.5 text-purple-800">
                <Compass className="w-5 h-5 text-purple-600" />
                <h3 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight">
                  Effets environnementaux associés aux usages de l'IA
                </h3>
              </div>

              {/* Encadré d'or : La règle fondamentale */}
              <div className="p-4 rounded-xl bg-purple-100/80 border border-purple-300 text-xs sm:text-sm text-purple-950 space-y-2 leading-relaxed shadow-2xs">
                <p className="font-bold text-purple-950 text-sm sm:text-base">
                  « L'humanité vit dans le monde des atomes, pas dans celui des bits. »
                </p>
                <p>
                  Une intelligence artificielle peut calculer la trajectoire d'une fusée, écrire un poème ou optimiser un bilan thermique au millième de degré. Mais elle <strong>ne fabrique pas de pétrole</strong>, elle <strong>ne fait pas pleuvoir sur les rizières asséchées</strong>, et elle <strong>ne peut pas empêcher un corps humain de succomber à 33°C de thermomètre mouillé</strong> sans électricité pour faire tourner un compresseur.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs pt-1">
                <div className="bg-white p-3.5 rounded-xl border border-purple-200 shadow-2xs space-y-1.5">
                  <span className="font-bold text-rose-700 block uppercase tracking-wider text-[10.5px]">
                    Si le cap reste l'hypercroissance :
                  </span>
                  <p className="text-slate-700 leading-snug">
                    Les effets futurs de l'IA sur les émissions et l'usage des ressources dépendent de la consommation énergétique, des applications et des politiques; leur ampleur est incertaine.
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-purple-200 shadow-2xs space-y-1.5">
                  <span className="font-bold text-sky-700 block uppercase tracking-wider text-[10.5px]">
                    Si le cap devient la résilience :
                  </span>
                  <p className="text-slate-700 leading-snug">
                    Des outils d'IA peuvent être appliqués à la prévision, à la gestion énergétique et au suivi environnemental. Leurs résultats dépendent des données, des méthodes et de leur mise en œuvre; ils ne garantissent pas ces effets.
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-purple-200 shadow-2xs space-y-1.5">
                  <span className="font-bold text-emerald-700 block uppercase tracking-wider text-[10.5px]">
                    La décision reste 100% humaine :
                  </span>
                  <p className="text-slate-700 leading-snug">
                    L'IA n'a pas de volonté propre ni de conscience de survie. Elle obéira toujours aux objectifs que nous lui fixons. Le salut ne viendra pas de la machine, mais du courage politique de respecter les limites planétaires.
                  </p>
                </div>
              </div>

              {/* Message de conclusion poétique et scientifique */}
              <div className="pt-3 border-t border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
                <span className="italic text-purple-900 font-medium">
                  « La véritable intelligence du XXIe siècle ne consistera pas à simuler un monde infini, mais à savoir habiter poétiquement et sobrement le seul que nous ayons. »
                </span>
                <span className="font-mono text-[10.5px] text-purple-700 font-semibold shrink-0">
                  Synthèse CLIMATOPEDY
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
