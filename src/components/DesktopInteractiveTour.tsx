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
  Eye
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
      badgeColor: 'border-sky-300 bg-sky-50 text-sky-800',
      title: 'Voyagez de 2026 à 2200 dans le futur',
      simpleExplanation:
        'En bas de votre écran se trouve la barre temporelle. Cliquez sur le bouton vert Play ▶️ ou faites glisser la réglette pour voir instantanément comment évoluent la météo, le rendement de l\'énergie et la population mondiale au fil des décennies.',
      targetElementId: 'tour-timeline',
      tab: 'map',
      boxPlacement: 'right',
      boxVertical: 'top',
      actionHint: 'Repérez le bouton vert Play et la barre des années ci-dessous 👇',
      mockupVisual: (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm flex flex-col gap-2.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="font-mono text-sky-700 font-bold">2026 (Aujourd'hui)</span>
            <span className="font-mono text-amber-700 font-bold">2050 (Pic)</span>
            <span className="font-mono text-rose-700 font-bold">2100 (Horizon)</span>
          </div>
          {/* Fausse barre de progression */}
          <div className="w-full bg-slate-200 h-3 rounded-full relative overflow-hidden">
            <div className="bg-gradient-to-r from-sky-500 via-emerald-400 to-amber-400 h-full w-2/5 rounded-full" />
          </div>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs">
              <Play className="w-4 h-4 fill-current" />
              <span>Lecture automatique</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">Glissez le curseur pour accélérer</span>
          </div>
        </div>
      )
    },
    {
      id: 2,
      badge: 'Étape 2 sur 5 · Le Planisphère',
      badgeColor: 'border-emerald-300 bg-emerald-50 text-emerald-800',
      title: 'Cliquez sur n\'importe quel pays du monde',
      simpleExplanation:
        'Sur la carte du monde, cliquez sur un pays (France, Inde, Brésil, États-Unis...) : un tiroir s\'ouvre immédiatement à droite avec sa météo estivale, ses réserves d\'eau et sa population. Les boutons au-dessus permettent de changer la couleur de la carte.',
      targetElementId: 'tour-worldmap',
      tab: 'map',
      boxPlacement: 'left',
      boxVertical: 'bottom',
      actionHint: 'Cliquez sur un pays ou changez le filtre de chaleur au-dessus 🌍',
      mockupVisual: (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm flex flex-col gap-2.5 shadow-2xs">
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="px-2.5 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold">
              🌡️ Thermomètre Mouillé (Tw)
            </span>
            <span className="px-2.5 py-1 rounded bg-white text-slate-700 border border-slate-200 font-medium">
              🌾 Alimentation
            </span>
            <span className="px-2.5 py-1 rounded bg-white text-slate-700 border border-slate-200 font-medium">
              💧 Eau douce
            </span>
          </div>
          <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="text-emerald-700 font-extrabold">👉 Clic sur un pays</span>
              <span className="text-slate-500">(ex: France ou Inde)</span>
            </div>
            <span className="text-sky-700 font-mono text-xs bg-sky-50 px-2 py-1 rounded border border-sky-200 font-bold">
              Tiroir d'analyse ➔
            </span>
          </div>
        </div>
      )
    },
    {
      id: 3,
      badge: 'Étape 3 sur 5 · Scénario A vs B',
      badgeColor: 'border-amber-300 bg-amber-50 text-amber-800',
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
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm flex flex-col gap-2.5 shadow-2xs">
          <div className="grid grid-cols-2 gap-3 text-center text-xs">
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700">
              <span className="block font-black text-xs uppercase tracking-wide">Scénario A</span>
              <span className="text-xs text-rose-600 font-mono">Fil de l'eau (+2,9°C)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
              <span className="block font-black text-xs uppercase tracking-wide">Scénario B</span>
              <span className="text-xs text-emerald-600 font-mono">Sobriété (+2,1°C)</span>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-center text-xs sm:text-sm font-black">
            Résultat simulé par CLIMATOPEDY : différence entre les sorties des scénarios A et B
          </div>
        </div>
      )
    },
    {
      id: 4,
      badge: 'Étape 4 sur 5 · Les Signaux d\'Alarme',
      badgeColor: 'border-rose-300 bg-rose-50 text-rose-800',
      title: 'Surveillez les 9 Points de Bascule de la Terre',
      simpleExplanation:
        'L\'onglet « Points de Bascule » présente des éléments du système climatique étudiés dans la littérature et des indicateurs issus du modèle CLIMATOPEDY. Les dates et seuils affichés ne sont pas des prévisions certaines.',
      targetElementId: 'tour-topbar-header',
      tab: 'tipping-points',
      boxPlacement: 'right',
      boxVertical: 'bottom',
      actionHint: 'Nous venons d\'ouvrir l\'onglet des Points de Bascule pour vous 🧊',
      mockupVisual: (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm flex flex-col gap-2.5 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping shrink-0" />
            <span className="font-extrabold text-rose-800 text-xs sm:text-sm">
              9 Piliers du Climat Sous Surveillance
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
            <div className="p-2 rounded-lg bg-white border border-slate-200 font-medium">
              ❄️ Groenland &amp; Antarctique
            </div>
            <div className="p-2 rounded-lg bg-white border border-slate-200 font-medium">
              🌳 Forêt Amazonienne
            </div>
            <div className="p-2 rounded-lg bg-white border border-slate-200 font-medium">
              🪸 Récifs de Coraux
            </div>
            <div className="p-2 rounded-lg bg-white border border-slate-200 font-medium">
              🌊 Courant Marin AMOC
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      badge: 'Étape 5 sur 5 · À Vous de Jouer',
      badgeColor: 'border-purple-300 bg-purple-50 text-purple-800',
      title: 'Revenir en 2026 à tout moment',
      simpleExplanation:
        'Le bouton « Aujourd\'hui » en haut à droite vous ramène instantanément en 2026 à tout moment. Vous pouvez tester librement n\'importe quel scénario sans craindre de perdre vos repères.',
      targetElementId: 'tour-topbar-actions',
      tab: 'map',
      boxPlacement: 'left',
      boxVertical: 'bottom',
      actionHint: 'Regardez en haut à droite de l\'écran pour trouver ce bouton ↗️',
      mockupVisual: (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm flex flex-col gap-2.5 shadow-2xs">
          <div className="flex items-center justify-center gap-2.5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs">
              <RotateCcw className="w-4 h-4 text-sky-600" />
              <span>Aujourd'hui (2026)</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 text-center pt-1 font-medium">
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
            border: '3px solid #0284c7',
            boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.55), 0 0 30px rgba(2, 132, 199, 0.6)',
          }}
        >
          {/* Badge animé bien visible sur la zone ciblée */}
          <div className="absolute -top-4 left-6 px-3.5 py-1 rounded-full bg-sky-600 text-white font-black text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-xl shadow-sky-950/40">
            <Sparkles className="w-4 h-4 fill-current text-white" />
            <span>Zone Ciblée (Regardez ici)</span>
          </div>
        </div>
      ) : (
        /* Voile sombre d'attente si le rectangle est en cours de détection */
        <div className="fixed inset-0 bg-slate-900/60 z-40 pointer-events-none transition-opacity" />
      )}

      {/* 
        CARTE FLOTTANTE DU TUTORIEL :
        - Dimensionnée en PLUS GROS (max-w-xl / max-w-2xl)
        - Textes et boutons agrandis pour une lisibilité parfaite
        - Positionnée dynamiquement (ex: SUR LA GAUCHE pour l'étape 3)
      */}
      <div className={`fixed z-55 w-full max-w-xl xl:max-w-2xl p-2 sm:p-3 pointer-events-auto transition-all duration-300 ${getCardPositionClasses()}`}>
        <div className="bg-white border-2 border-sky-400 rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.18)] overflow-hidden flex flex-col text-slate-700 backdrop-blur-md">
          {/* Barre de progression animée */}
          <div className="w-full bg-slate-100 h-2 shrink-0">
            <div
              className="h-full bg-gradient-to-r from-sky-500 via-emerald-400 to-amber-400 transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* En-tête agrandi */}
          <div className="p-5 sm:p-6 pb-4 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-black border ${currentStep.badgeColor}`}>
                  {currentStep.badge}
                </span>
                <span className="text-xs text-sky-700 font-mono font-bold flex items-center gap-1.5">
                  <Compass className="w-4 h-4" />
                  Guide Découverte Interactif
                </span>
              </div>
              <h3 id="tour-dialog-title" className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mt-2">
                {currentStep.title}
              </h3>
            </div>

            <button
              onClick={handleComplete}
              className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all cursor-pointer shrink-0 border border-slate-200 hover:scale-105"
              title="Quitter le tutoriel (Échap)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Corps agrandi & aéré */}
          <div className="p-5 sm:p-6 space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed bg-white">
            <p className="text-slate-700 font-normal leading-relaxed">
              {currentStep.simpleExplanation}
            </p>

            {/* Repère visuel / Mini-capture schématique agrandie */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-mono uppercase tracking-wider text-sky-700 font-bold flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>Ce qu'il faut repérer sur votre écran :</span>
              </span>
              {currentStep.mockupVisual}
            </div>

            {/* Indication d'action directe bien visible */}
            <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs sm:text-sm text-sky-800 font-semibold flex items-center gap-2.5">
              <MousePointerClick className="w-5 h-5 text-sky-600 shrink-0 animate-pulse" />
              <span>{currentStep.actionHint}</span>
            </div>
          </div>

          {/* Pied de carte agrandi : puces de navigation et boutons d'action */}
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
            {/* Puces interactives plus grandes */}
            <div className="flex items-center gap-2">
              {steps.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    idx === currentStepIndex
                      ? 'w-8 bg-sky-600 shadow-sm shadow-sky-600/40'
                      : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  title={`Étape ${idx + 1} : ${s.title}`}
                />
              ))}
            </div>

            {/* Boutons d'action agrandis */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleComplete}
                className="px-3.5 py-2 text-xs sm:text-sm text-slate-500 hover:text-slate-800 transition-colors cursor-pointer font-semibold"
              >
                Passer
              </button>

              {currentStepIndex > 0 && (
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold border border-slate-200 shadow-2xs transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Précédent</span>
                </button>
              )}

              {currentStepIndex < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/20 transition-all cursor-pointer hover:scale-105"
                >
                  <span>Suivant</span>
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer hover:scale-105"
                >
                  <Check className="w-4 h-4 text-white" />
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
