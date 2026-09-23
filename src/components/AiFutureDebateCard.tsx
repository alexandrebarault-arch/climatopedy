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
    <section className="w-full rounded-2xl bg-gradient-to-b from-[#0b101d] via-[#090d18] to-[#070a13] border border-purple-800/40 p-5 sm:p-8 shadow-2xl text-slate-200 flex flex-col gap-6">
      {/* En-tête : Pour aller plus loin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/40 text-purple-300 shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-purple-400 font-semibold">
                Pour aller plus loin · Prospective &amp; Biophysique
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              L'IA peut-elle nous sauver ? Ou va-t-elle accélérer le changement ?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Analyse sans complaisance : confrontation entre la puissance des algorithmes (les bits) et les lois inviolables de la matière et de l'énergie (les atomes).
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors border border-slate-700 shrink-0 self-start sm:self-auto"
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#060a12] p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('risk')}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'risk'
                  ? 'bg-rose-950/80 text-rose-200 border border-rose-700 shadow-md shadow-rose-950/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>1. L'Accélérateur de Crise (Risques)</span>
            </button>

            <button
              onClick={() => setActiveTab('leverage')}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'leverage'
                  ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-700 shadow-md shadow-emerald-950/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>2. Le Levier d'Atténuation (Espoirs)</span>
            </button>

            <button
              onClick={() => setActiveTab('verdict')}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'verdict'
                  ? 'bg-purple-950/90 text-purple-200 border border-purple-600 shadow-md shadow-purple-950/60 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Scale className="w-4 h-4 text-purple-300" />
              <span>3. Le Verdict Biophysique Final</span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* ONGLET 1 : L'ACCÉLÉRATEUR DE CRISE (LE PIÈGE THERMODYNAMIQUE)              */}
          {/* ========================================================================= */}
          {activeTab === 'risk' && (
            <div className="bg-[#0e1526] rounded-xl border border-rose-900/40 p-5 sm:p-6 flex flex-col gap-5">
              <div className="flex items-center gap-2.5 text-rose-300">
                <Flame className="w-5 h-5 text-rose-400" />
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Pourquoi l'IA risque d'accélérer l'épuisement de la Terre
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* 1. La faim d'énergie et d'eau */}
                <div className="bg-[#121c32] p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-rose-300 font-semibold text-sm">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>L'empreinte matérielle exponentielle</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    L'IA n'est pas « virtuelle ». Elle tourne sur des millions de puces GPU en silicium ultra-raffiné, logées dans des datacenters géants. Ces centres consomment déjà des dizaines de térawattheures d'électricité par an et des millions de mètres cubes d'eau potable pour leur refroidissement.
                  </p>
                  <p className="text-slate-400 italic">
                    D'ici 2030, la demande électrique des datacenters mondiaux pourrait concurrencer directement l'électrification des transports et des pompes à chaleur domestiques.
                  </p>
                </div>

                {/* 2. Le paradoxe de Jevons (Effet Rebond) */}
                <div className="bg-[#121c32] p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-rose-300 font-semibold text-sm">
                    <TrendingUp className="w-4 h-4 text-rose-400" />
                    <span>Le paradoxe de Jevons : l'effet rebond</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Depuis deux siècles, chaque fois qu'une technologie rend l'extraction ou l'usage d'une ressource plus efficace, la consommation totale n'a jamais baissé : elle a bondi.
                  </p>
                  <p className="text-slate-400 italic">
                    Si une IA permet aux compagnies pétrolières de détecter les gisements sous-marins avec 30% d'efficacité en plus, elle servira d'abord à brûler plus vite le carbone résiduel, pas à le laisser sous terre.
                  </p>
                </div>

                {/* 3. L'optimisation de la surconsommation */}
                <div className="bg-[#121c32] p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-rose-300 font-semibold text-sm">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>L'accélération des flux commerciaux superflus</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    L'essentiel de la puissance de calcul actuelle n'est pas utilisé pour la transition écologique, mais pour optimiser le ciblage publicitaire comportemental, accélérer la logistique de la fast-fashion et susciter des besoins d'achat futiles.
                  </p>
                  <p className="text-slate-400 italic">
                    Dans une économie linéaire, une IA hyper-performante est un amplificateur de gaspillage de matières premières.
                  </p>
                </div>

                {/* 4. L'illusion technosolutionniste */}
                <div className="bg-[#121c32] p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-rose-300 font-semibold text-sm">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>L'anesthésie morale du « L'IA va régler ça »</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Le plus grand danger est psychologique : faire croire aux citoyens et aux décideurs qu'il n'y a pas besoin de sobriété ni de réformes structurelles car une « superintelligence » résoudra la crise climatique au dernier moment par magie.
                  </p>
                  <p className="text-slate-400 italic">
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
            <div className="bg-[#0e1526] rounded-xl border border-emerald-900/40 p-5 sm:p-6 flex flex-col gap-5">
              <div className="flex items-center gap-2.5 text-emerald-300">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Comment l'IA peut devenir un instrument d'adaptation décisif
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* 1. Découverte de matériaux de rupture */}
                <div className="bg-[#121c32] p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm">
                    <Lightbulb className="w-4 h-4 text-emerald-400" />
                    <span>Découverte accélérée de matériaux propres</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    L'IA computationnelle (comme les modèles de repliement de protéines et de criblage cristallin) permet de tester en quelques semaines des millions de molécules chimiques qui auraient demandé des siècles en laboratoire.
                  </p>
                  <p className="text-slate-400 italic">
                    Exemples concrets : catalyseurs pour batteries sans cobalt ni nickel (sodium-ion), pérovskites solaires à haut rendement, et enzymes synthétiques pour fixer l'azote sans gaz naturel.
                  </p>
                </div>

                {/* 2. Pilotage des réseaux électriques décentralisés */}
                <div className="bg-[#121c32] p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>Équilibrage des réseaux 100% renouvelables</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Le solaire et l'éolien sont intermittents. Une IA prédictive peut coordonner en temps réel des millions de batteries de véhicules, de chauffe-eau et d'usines pour absorber les pics et combler les creux sans aucune centrale thermique à gaz.
                  </p>
                  <p className="text-slate-400 italic">
                    Elle transforme un réseau électrique rigide et vulnérable en un écosystème souple et résilient.
                  </p>
                </div>

                {/* 3. Agriculture de précision et économie d'eau */}
                <div className="bg-[#121c32] p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm">
                    <Droplets className="w-4 h-4 text-sky-400" />
                    <span>Micro-irrigation et santé des sols</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    En analysant les images satellites multispectrales et les capteurs d'humidité au ras du sol, l'IA permet d'irriguer au pied par goutte-à-goutte, économisant jusqu'à 40% d'eau douce et réduisant de moitié l'usage de pesticides.
                  </p>
                  <p className="text-slate-400 italic">
                    Elle assiste les paysans dans le choix de semences adaptées aux nouvelles températures estivales.
                  </p>
                </div>

                {/* 4. Alerte précoce face aux canicules humides Stull Tw */}
                <div className="bg-[#121c32] p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Protection civile &amp; sauvetage de vies</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    La météo par IA (GraphCast, Nowcasting) prédit les dômes de chaleur humide létaux (Tw &ge; 31°C) avec 48 heures d'avance à l'échelle d'un quartier, permettant aux municipalités d'ouvrir des refuges climatisés et de sauver des milliers de personnes vulnérables.
                  </p>
                  <p className="text-slate-400 italic">
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
            <div className="bg-gradient-to-br from-[#12192e] via-[#0f1527] to-[#0a0f1d] rounded-xl border border-purple-700/50 p-6 sm:p-7 flex flex-col gap-5">
              <div className="flex items-center gap-2.5 text-purple-300">
                <Compass className="w-5 h-5 text-purple-400" />
                <h3 className="text-base sm:text-xl font-bold text-white tracking-tight">
                  Le Verdict des Biophysiciens : « L'IA est un amplificateur de choix, pas un substitut à la biosphère »
                </h3>
              </div>

              {/* Encadré d'or : La règle fondamentale */}
              <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-600/60 text-xs sm:text-sm text-purple-100 space-y-2 leading-relaxed">
                <p className="font-semibold text-white text-sm sm:text-base">
                  « L'humanité vit dans le monde des atomes, pas dans celui des bits. »
                </p>
                <p>
                  Une intelligence artificielle peut calculer la trajectoire d'une fusée, écrire un poème ou optimiser un bilan thermique au millième de degré. Mais elle <strong>ne fabrique pas de pétrole</strong>, elle <strong>ne fait pas pleuvoir sur les rizières asséchées</strong>, et elle <strong>ne peut pas empêcher un corps humain de succomber à 33°C de thermomètre mouillé</strong> sans électricité pour faire tourner un compresseur.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs pt-1">
                <div className="bg-[#0b101c] p-3.5 rounded-lg border border-slate-800 space-y-1.5">
                  <span className="font-bold text-rose-400 block uppercase tracking-wider text-[10.5px]">
                    Si le cap reste l'hypercroissance :
                  </span>
                  <p className="text-slate-300 leading-snug">
                    L'IA agira comme un <strong>accélérateur d'effondrement</strong> : elle épuisera le pétrole résiduel plus vite, consommera d'immenses surplus d'énergie et entretiendra l'illusion que la technologie peut abolir les limites du vivant.
                  </p>
                </div>

                <div className="bg-[#0b101c] p-3.5 rounded-lg border border-slate-800 space-y-1.5">
                  <span className="font-bold text-cyan-400 block uppercase tracking-wider text-[10.5px]">
                    Si le cap devient la résilience :
                  </span>
                  <p className="text-slate-300 leading-snug">
                    L'IA sera le <strong>compas le plus précieux de l'humanité</strong> : elle nous aidera à planifier une descente énergétique maîtrisée, à réparer les écosystèmes et à protéger équitablement les populations face aux chocs climatiques.
                  </p>
                </div>

                <div className="bg-[#0b101c] p-3.5 rounded-lg border border-slate-800 space-y-1.5">
                  <span className="font-bold text-emerald-400 block uppercase tracking-wider text-[10.5px]">
                    La décision reste 100% humaine :
                  </span>
                  <p className="text-slate-300 leading-snug">
                    L'IA n'a pas de volonté propre ni de conscience de survie. Elle obéira toujours aux objectifs que nous lui fixons. Le salut ne viendra pas de la machine, mais du courage politique de respecter les limites planétaires.
                  </p>
                </div>
              </div>

              {/* Message de conclusion poétique et scientifique */}
              <div className="pt-3 border-t border-purple-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
                <span className="italic text-purple-200">
                  « La véritable intelligence du XXIe siècle ne consistera pas à simuler un monde infini, mais à savoir habiter poétiquement et sobrement le seul que nous ayons. »
                </span>
                <span className="font-mono text-[10.5px] text-purple-400 shrink-0">
                  Synthèse Biophysique GAIA-Sim
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
