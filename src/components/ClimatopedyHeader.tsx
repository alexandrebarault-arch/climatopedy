import React, { useState } from 'react';
import { Sparkles, Globe, Compass, ChevronDown, ChevronUp, HeartHandshake, ShieldCheck, Zap } from 'lucide-react';

interface ClimatopedyHeaderProps {
  onOpenTutorial?: () => void;
}

export const ClimatopedyHeader: React.FC<ClimatopedyHeaderProps> = ({ onOpenTutorial }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const lastUpdate = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short'
  }).format(new Date(__BUILD_TIMESTAMP__));

  return (
    <header className="rounded-2xl bg-white border border-slate-200/90 p-4 sm:p-5 shadow-xs relative overflow-hidden animate-in fade-in duration-300">
      {/* Halo subtil d'ambiance en arrière-plan */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-sky-500/5 blur-3xl"
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl"
      />

      <div className="relative z-10 space-y-3.5">
        {/* Ligne supérieure : Badges d'accessibilité + Titre + Bouton plier/déplier */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-sky-50 text-sky-800 border border-sky-200 flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>CLIMATOPEDY · L'Encyclopédie Citoyenne</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Accessible à tous · Zéro jargon technique</span>
            </span>
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="self-end sm:self-auto flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            title={isCollapsed ? "Afficher les explications détaillées de CLIMATOPEDY" : "Réduire l'en-tête pour avoir plus d'espace"}
          >
            <span>{isCollapsed ? "En savoir plus" : "Réduire l'en-tête"}</span>
            {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Titre principal clair et compréhensible */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
              CLIMATOPEDY : Comprendre le Climat &amp; l'Énergie sans jargon
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              À quoi sert cet outil et comment vous donne-t-il les clés de notre avenir commun ?
            </p>
          </div>
          <span className="text-[11px] sm:text-xs text-slate-500 whitespace-nowrap sm:pt-1">
            Dernière mise à jour : {lastUpdate}
          </span>
        </div>

        {/* Corps de l'en-tête si déplié */}
        {!isCollapsed ? (
          <div className="space-y-4 pt-1 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* Les 2 blocs fondamentaux : En quoi ça consiste & Quel est l'objectif */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
              {/* Bloc 1 : En quoi consiste CLIMATOPEDY */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/90 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-sky-800 font-bold text-xs sm:text-sm">
                  <Globe className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>En quoi consiste CLIMATOPEDY ?</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  C'est une <strong>encyclopédie visuelle et interactive</strong> ouverte à tous, spécialement conçue pour les personnes sans connaissances scientifiques préalables.
                  Elle relie directement ce que nous vivons chaque jour (notre alimentation, nos factures d'énergie, les vagues de chaleur estivales) aux réalités physiques de notre planète : la météo, les limites du pétrole et les récoltes mondiales.
                </p>
              </div>

              {/* Bloc 2 : Quel est l'objectif */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/90 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs sm:text-sm">
                  <HeartHandshake className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Quel est son objectif pour vous ?</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  CLIMATOPEDY présente des données climatiques, énergétiques et agricoles ainsi que des résultats de simulation. Les scénarios A et B sont des trajectoires définies par les paramètres du simulateur; leurs résultats ne sont pas des prévisions officielles.
                </p>
              </div>
            </div>

            {/* Comment explorer en 3 actions simples */}
            <div className="p-3 rounded-xl bg-sky-50/50 border border-sky-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 shrink-0">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>Comment explorer CLIMATOPEDY en 3 gestes :</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-700 flex-1">
                <div className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                  <span className="font-bold text-sky-700">1.</span>
                  <span><strong>Cliquez sur la carte :</strong> Choisissez un pays pour voir sa chaleur estivale et sa population.</span>
                </div>
                <div className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                  <span className="font-bold text-emerald-700">2.</span>
                  <span><strong>Lancez la réglette du bas :</strong> Appuyez sur ▶️ pour voir le monde changer d'ici 2100.</span>
                </div>
                <div className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                  <span className="font-bold text-amber-700">3.</span>
                  <span><strong>Comparez les paramètres :</strong> Modifiez les réglages du scénario et observez les résultats calculés par le simulateur.</span>
                </div>
              </div>

              {onOpenTutorial && (
                <button
                  onClick={onOpenTutorial}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs cursor-pointer transition-all shrink-0 hover:scale-102"
                  title="Démarrer la visite guidée interactive du simulateur"
                >
                  <Compass className="w-4 h-4 text-white" />
                  <span>Visite guidée interactive</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Résumé compact quand replié */
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs text-slate-600">
            <p>
              💡 <strong>En résumé :</strong> Un outil interactif présentant des données historiques et des simulations conditionnelles de 1900 à 2200.
            </p>
            {onOpenTutorial && (
              <button
                onClick={onOpenTutorial}
                className="self-start sm:self-auto text-emerald-700 hover:text-emerald-800 font-semibold underline underline-offset-2 flex items-center gap-1 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Lancer la visite guidée</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
