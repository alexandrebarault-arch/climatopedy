import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Play,
  RotateCcw,
  Sparkles,
  MousePointerClick,
  Compass,
  Eye,
  FileDown
} from 'lucide-react';
import { AppTabType } from './TopBar';

interface DesktopInteractiveTourProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: AppTabType;
  onNavigateTab: (tab: AppTabType) => void;
  onSeekYear?: (year: number) => void;
}

interface TourStep {
  id: number;
  badge: string;
  badgeColor: string;
  title: string;
  simpleExplanation: string;
  targetElementId: string;
  tab: AppTabType;
  // Positionnement de la boîte pour ne JAMAIS recouvrir ce qu'on montre
  boxPlacement: 'left' | 'right';
  boxVertical: 'top' | 'bottom';
  actionHint: string;
  mockupVisual: React.ReactNode;
}

export const DesktopInteractiveTour: React.FC<DesktopInteractiveTourProps> = ({
  isOpen,
  onClose,
  currentTab,
  onNavigateTab
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const steps: TourStep[] = [
    {
      id: 1,
      badge: 'Étape 1 sur 5 · La Machine Temporelle',
      badgeColor: 'border-cyan-500 bg-cyan-950/90 text-cyan-300',
      title: 'Voyagez de 2026 à 2200 dans le futur',
      simpleExplanation:
        'En bas de votre écran se trouve la barre temporelle. Cliquez sur le bouton vert Play ▶️ ou faites glisser la réglette pour voir instantanément comment évoluent la météo, le rendement de l\'énergie et la population mondiale au fil des décennies.',
      targetElementId: 'tour-timeline',
      tab: 'map',
      boxPlacement: 'right',
      boxVertical: 'top',
      actionHint: 'Repérez le bouton vert Play et la barre des années ci-dessous 👇',
      mockupVisual: (
        <div className="bg-[#0b101c] border border-cyan-800/80 rounded-xl p-4 text-xs sm:text-sm flex flex-col gap-2.5 shadow-inner">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="font-mono text-cyan-400">2026 (Aujourd'hui)</span>
            <span className="font-mono text-amber-400">2050 (Pic)</span>
            <span className="font-mono text-rose-400">2100 (Horizon)</span>
          </div>
          {/* Fausse barre de progression */}
          <div className="w-full bg-slate-800 h-3 rounded-full relative overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 h-full w-2/5 rounded-full" />
          </div>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-600 text-emerald-300 font-bold text-xs">
              <Play className="w-4 h-4 fill-current" />
              <span>Lecture automatique</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Glissez le curseur pour accélérer</span>
          </div>
        </div>
      )
    },
    {
      id: 2,
      badge: 'Étape 2 sur 5 · Le Planisphère',
      badgeColor: 'border-emerald-500 bg-emerald-950/90 text-emerald-300',
      title: 'Cliquez sur n\'importe quel pays du monde',
      simpleExplanation:
        'Sur la carte du monde, cliquez sur un pays (France, Inde, Brésil, États-Unis...) : un tiroir s\'ouvre immédiatement à droite avec sa météo estivale, ses réserves d\'eau et sa population. Les boutons au-dessus permettent de changer la couleur de la carte.',
      targetElementId: 'tour-worldmap',
      tab: 'map',
      boxPlacement: 'left',
      boxVertical: 'bottom',
      actionHint: 'Cliquez sur un pays ou changez le filtre de chaleur au-dessus 🌍',
      mockupVisual: (
        <div className="bg-[#090e18] border border-emerald-800/80 rounded-xl p-4 text-xs sm:text-sm flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-700 font-bold">
              🌡️ Thermomètre Mouillé (Tw)
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-medium">
              🌾 Alimentation
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-medium">
              💧 Eau douce
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-extrabold">👉 Clic sur un pays</span>
              <span className="text-slate-400">(ex: France ou Inde)</span>
            </div>
            <span className="text-cyan-300 font-mono text-xs bg-cyan-950 px-2 py-1 rounded border border-cyan-700 font-bold">
              Tiroir d'analyse ➔
            </span>
          </div>
        </div>
      )
    },
    {
      id: 3,
      badge: 'Étape 3 sur 5 · Scénario A vs B',
      badgeColor: 'border-amber-500 bg-amber-950/90 text-amber-300',
      title: 'Testez vos propres choix écologiques',
      simpleExplanation:
        'Et si l\'humanité réduisait sa consommation de pétrole et basculait vers l\'agroécologie ? Juste sous la carte, comparez le scénario passif (rouge) avec une politique écologique (vert). Vous pouvez bouger les manettes à droite pour observer en direct les millions de vies épargnées.',
      targetElementId: 'comparison-section',
      tab: 'map',
      // PLACÉ SUR LA GAUCHE selon la demande explicite de l'utilisateur
      boxPlacement: 'left',
      boxVertical: 'top',
      actionHint: 'Ajustez les curseurs sur la droite pour tester une bifurcation 🌱',
      mockupVisual: (
        <div className="bg-[#0b101c] border border-amber-800/80 rounded-xl p-4 text-xs sm:text-sm flex flex-col gap-2.5">
          <div className="grid grid-cols-2 gap-3 text-center text-xs">
            <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-700 text-rose-200">
              <span className="block font-black text-xs uppercase tracking-wide">Scénario A</span>
              <span className="text-xs text-rose-300 font-mono">Fil de l'eau (+2,9°C)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-200">
              <span className="block font-black text-xs uppercase tracking-wide">Scénario B</span>
              <span className="text-xs text-emerald-300 font-mono">Sobriété (+2,1°C)</span>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-950/70 border border-emerald-600 text-emerald-200 text-center text-xs sm:text-sm font-black">
            ✨ Résultat : +2,8 Milliards de vies humaines préservées
          </div>
        </div>
      )
    },
    {
      id: 4,
      badge: 'Étape 4 sur 5 · Les Signaux d\'Alarme',
      badgeColor: 'border-rose-500 bg-rose-950/90 text-rose-300',
      title: 'Surveillez les 9 Points de Bascule de la Terre',
      simpleExplanation:
        'La banquise, la forêt amazonienne, le dégel du pergélisol ou les récifs coralliens ont des limites physiques. L\'onglet « Points de Bascule » vous montre des photographies réelles et vous alerte quand ces zones risquent de s\'effondrer irréversiblement.',
      targetElementId: 'tour-topbar-header',
      tab: 'tipping-points',
      boxPlacement: 'right',
      boxVertical: 'bottom',
      actionHint: 'Nous venons d\'ouvrir l\'onglet des Points de Bascule pour vous 🧊',
      mockupVisual: (
        <div className="bg-[#120c15] border border-rose-800/80 rounded-xl p-4 text-xs sm:text-sm flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping shrink-0" />
            <span className="font-extrabold text-rose-200 text-xs sm:text-sm">
              9 Piliers du Climat Sous Surveillance
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 font-medium">
              ❄️ Groenland &amp; Antarctique
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 font-medium">
              🌳 Forêt Amazonienne
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 font-medium">
              🪸 Récifs de Coraux
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 font-medium">
              🌊 Courant Marin AMOC
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      badge: 'Étape 5 sur 5 · À Vous de Jouer',
      badgeColor: 'border-purple-500 bg-purple-950/90 text-purple-300',
      title: 'Revenir en 2026 ou Exporter votre Rapport',
      simpleExplanation:
        'Deux boutons magiques en haut à droite : « Aujourd\'hui » vous ramène en 2026 à tout moment. Et « Rapport PDF » vous permet de télécharger un document illustré et prêt à imprimer pour partager votre simulation avec vos proches ou collègues.',
      targetElementId: 'tour-topbar-actions',
      tab: 'map',
      boxPlacement: 'left',
      boxVertical: 'bottom',
      actionHint: 'Regardez en haut à droite de l\'écran pour trouver ces boutons ↗️',
      mockupVisual: (
        <div className="bg-[#0e1220] border border-purple-800/80 rounded-xl p-4 text-xs sm:text-sm flex flex-col gap-2.5">
          <div className="flex items-center justify-end gap-2.5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold">
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>Aujourd'hui (2026)</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-600 text-cyan-200 text-xs font-black">
              <FileDown className="w-4 h-4 text-cyan-400" />
              <span>Rapport PDF</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 text-center pt-1 font-medium">
            🎉 Vous avez toutes les clés ! Vous pouvez explorer librement.
          </p>
        </div>
      )
    }
  ];

  const currentStep = steps[currentStepIndex];

  // Mise à jour continue et précise de la boîte englobante de l'élément cible
  const updateTargetRect = useCallback(() => {
    const el = document.getElementById(currentStep.targetElementId);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
    } else {
      setTargetRect(null);
    }
  }, [currentStep.targetElementId]);

  // Synchronisation au changement d'étape : navigation d'onglet + défilement automatique
  useEffect(() => {
    if (!isOpen) return;

    if (currentStep.tab !== currentTab) {
      onNavigateTab(currentStep.tab);
    }

    // Scroll vers l'élément ciblé
    const scrollTimer = setTimeout(() => {
      const el = document.getElementById(currentStep.targetElementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 80);

    // Sondage haute fréquence pour suivre le défilement fluide
    const interval = setInterval(updateTargetRect, 35);
    const stopInterval = setTimeout(() => clearInterval(interval), 1100);

    window.addEventListener('scroll', updateTargetRect, { passive: true });
    window.addEventListener('resize', updateTargetRect);

    return () => {
      clearTimeout(scrollTimer);
      clearInterval(interval);
      clearTimeout(stopInterval);
      window.removeEventListener('scroll', updateTargetRect);
      window.removeEventListener('resize', updateTargetRect);
    };
  }, [isOpen, currentStepIndex, currentStep.tab, currentStep.targetElementId, updateTargetRect]);

  // Raccourcis clavier (flèches droite / gauche / Échap)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleComplete();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex]);

  if (!isOpen) return null;

  const handleComplete = () => {
    try {
      localStorage.setItem('climatopedy_desktop_tour_completed', 'true');
    } catch (e) {
      // ignore
    }
    onNavigateTab('map');
    onClose();
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  // Positionnement dynamique de la carte selon le paramètre de l'étape
  // (ex: ÉTAPE 3 sur la GAUCHE selon la demande explicite de l'utilisateur)
  const getCardPositionClasses = () => {
    const isLeft = currentStep.boxPlacement === 'left';
    const isTop = currentStep.boxVertical === 'top';

    const hPos = isLeft ? 'left-4 sm:left-8' : 'right-4 sm:right-8';
    const vPos = isTop ? 'top-4 sm:top-8' : 'bottom-4 sm:bottom-8';

    return `${hPos} ${vPos}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-auto select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-dialog-title"
    >
      {/* 
        MÉTHODE DE DÉCOUPE CSS INFAILLIBLE :
        La boîte englobante a un box-shadow de 9999px tout autour d'elle.
        L'intérieur de la boîte est 100% TRANSPARENT, SANS AUCUN VOILE NI FLOU !
        La zone cible réelle de la page ressort avec une clarté et une brillance parfaites.
      */}
      {targetRect ? (
        <div
          className="fixed pointer-events-none z-40 transition-all duration-200"
          style={{
            top: `${Math.max(4, Math.round(targetRect.top - 8))}px`,
            left: `${Math.max(4, Math.round(targetRect.left - 8))}px`,
            width: `${Math.round(targetRect.width + 16)}px`,
            height: `${Math.round(targetRect.height + 16)}px`,
            borderRadius: '18px',
            border: '3px solid #06b6d4',
            boxShadow: '0 0 0 9999px rgba(3, 7, 18, 0.85), 0 0 40px rgba(6, 182, 212, 0.95)',
          }}
        >
          {/* Badge animé bien visible sur la zone ciblée */}
          <div className="absolute -top-4 left-6 px-3.5 py-1 rounded-full bg-cyan-400 text-slate-950 font-black text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-xl shadow-cyan-950">
            <Sparkles className="w-4 h-4 fill-current text-slate-950" />
            <span>Zone Ciblée (Regardez ici)</span>
          </div>
        </div>
      ) : (
        /* Voile sombre d'attente si le rectangle est en cours de détection */
        <div className="fixed inset-0 bg-black/85 z-40 pointer-events-none transition-opacity" />
      )}

      {/* 
        CARTE FLOTTANTE DU TUTORIEL :
        - Dimensionnée en PLUS GROS (max-w-xl / max-w-2xl)
        - Textes et boutons agrandis pour une lisibilité parfaite
        - Positionnée dynamiquement (ex: SUR LA GAUCHE pour l'étape 3)
      */}
      <div className={`fixed z-55 w-full max-w-xl xl:max-w-2xl p-2 sm:p-3 pointer-events-auto transition-all duration-300 ${getCardPositionClasses()}`}>
        <div className="bg-[#0b1322]/98 border-2 border-cyan-500 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col text-slate-200 backdrop-blur-md">
          {/* Barre de progression animée */}
          <div className="w-full bg-slate-900 h-2 shrink-0">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* En-tête agrandi */}
          <div className="p-5 sm:p-6 pb-4 border-b border-slate-800 bg-[#0e182a] flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-black border ${currentStep.badgeColor}`}>
                  {currentStep.badge}
                </span>
                <span className="text-xs text-cyan-400 font-mono font-bold flex items-center gap-1.5">
                  <Compass className="w-4 h-4" />
                  Guide Découverte Interactif
                </span>
              </div>
              <h3 id="tour-dialog-title" className="text-xl sm:text-2xl font-black text-white tracking-tight mt-2">
                {currentStep.title}
              </h3>
            </div>

            <button
              onClick={handleComplete}
              className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer shrink-0 border border-slate-700 hover:scale-105"
              title="Quitter le tutoriel (Échap)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Corps agrandi & aéré */}
          <div className="p-5 sm:p-6 space-y-4 text-sm sm:text-base text-slate-200 leading-relaxed bg-[#0b1322]">
            <p className="text-slate-100 font-normal leading-relaxed">
              {currentStep.simpleExplanation}
            </p>

            {/* Repère visuel / Mini-capture schématique agrandie */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>Ce qu'il faut repérer sur votre écran :</span>
              </span>
              {currentStep.mockupVisual}
            </div>

            {/* Indication d'action directe bien visible */}
            <div className="p-3.5 rounded-xl bg-cyan-950/70 border border-cyan-700/60 text-xs sm:text-sm text-cyan-200 font-semibold flex items-center gap-2.5">
              <MousePointerClick className="w-5 h-5 text-cyan-400 shrink-0 animate-pulse" />
              <span>{currentStep.actionHint}</span>
            </div>
          </div>

          {/* Pied de carte agrandi : puces de navigation et boutons d'action */}
          <div className="p-4 sm:p-5 border-t border-slate-800/90 bg-[#080d17] flex items-center justify-between gap-4">
            {/* Puces interactives plus grandes */}
            <div className="flex items-center gap-2">
              {steps.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    idx === currentStepIndex
                      ? 'w-8 bg-cyan-400 shadow-sm shadow-cyan-400/70'
                      : 'w-2.5 bg-slate-700 hover:bg-slate-500'
                  }`}
                  title={`Étape ${idx + 1} : ${s.title}`}
                />
              ))}
            </div>

            {/* Boutons d'action agrandis */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleComplete}
                className="px-3.5 py-2 text-xs sm:text-sm text-slate-400 hover:text-slate-200 transition-colors cursor-pointer font-medium"
              >
                Passer
              </button>

              {currentStepIndex > 0 && (
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold border border-slate-700 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Précédent</span>
                </button>
              )}

              {currentStepIndex < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-cyan-950/70 transition-all cursor-pointer hover:scale-105"
                >
                  <span>Suivant</span>
                  <ChevronRight className="w-4 h-4 text-slate-950" />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-950/70 transition-all cursor-pointer hover:scale-105"
                >
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>C'est parti !</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
