import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Compass,
  Clock,
  Globe2,
  Sliders,
  ShieldAlert,
  BookOpen,
  FileDown,
  Sparkles,
  CheckCircle,
  Eye,
  Layers,
  Thermometer,
  RotateCcw,
  Network,
  Users,
  Check
} from 'lucide-react';
import { AppTabType } from './TopBar';

interface DesktopTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: AppTabType) => void;
}

interface TutorialStep {
  id: number;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  description: string;
  tips: { icon: React.ReactNode; text: string }[];
  actionLabel?: string;
  targetTab?: AppTabType;
}

export const DesktopTutorialModal: React.FC<DesktopTutorialModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const steps: TutorialStep[] = [
    {
      id: 1,
      badge: 'Étape 1 · Vision Globale',
      badgeColor: 'border-cyan-700 bg-cyan-950/80 text-cyan-300',
      title: 'Bienvenue dans CLIMATOPEDY',
      subtitle: 'L\'encyclopédie interactive du climat et de l\'énergie (2026–2200)',
      description:
        'CLIMATOPEDY modélise et explique simplement les liens physiques entre l\'énergie fossile, le climat, l\'agriculture mondiale et la survie humaine. Ici, chaque donnée est rigoureusement documentée et traduite en visualisations claires pour tous.',
      tips: [
        {
          icon: <Globe2 className="w-4 h-4 text-cyan-400" />,
          text: 'Explorez l\'impact des choix collectifs sur l\'habitabilité réelle de la Terre.'
        },
        {
          icon: <Layers className="w-4 h-4 text-emerald-400" />,
          text: 'Observez la chaîne matérielle : sans pétrole, pas d\'engrais ; sans engrais, déficit alimentaire.'
        },
        {
          icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
          text: 'Surveillez l\'approche des 9 points de bascule climatiques irréversibles.'
        }
      ],
      actionLabel: 'Continuer le guide',
    },
    {
      id: 2,
      badge: 'Étape 2 · Chronologie',
      badgeColor: 'border-amber-700 bg-amber-950/80 text-amber-300',
      title: 'Maîtriser la Ligne Temporelle (2026–2200)',
      subtitle: 'Voyagez dans le temps et observez l\'inertie du système Terre',
      description:
        'En bas de votre écran se trouve le contrôleur temporel interactif. Vous pouvez faire glisser le curseur d\'année en année, lancer la lecture automatique ou sauter directement aux horizons charnières du siècle.',
      tips: [
        {
          icon: <Clock className="w-4 h-4 text-amber-400" />,
          text: 'Touches rapides : 2030 (choc initial), 2050 (pic d\'émission/famine), 2080, et 2100.'
        },
        {
          icon: <Sliders className="w-4 h-4 text-cyan-400" />,
          text: 'Vitesse ajustable : 1x (1 an/sec), 2x ou 5x pour tester rapidement des scénarios longs.'
        },
        {
          icon: <RotateCcw className="w-4 h-4 text-emerald-400" />,
          text: 'Le bouton « Aujourd\'hui » (en haut à droite) vous ramène instantanément en 2026.'
        }
      ],
      actionLabel: 'Compris, passer au planisphère',
    },
    {
      id: 3,
      badge: 'Étape 3 · Cartographie',
      badgeColor: 'border-blue-700 bg-blue-950/80 text-blue-300',
      title: 'Le Planisphère & l\'Inspection par Pays',
      subtitle: 'Changer de calque biophysique et cliquer sur un pays',
      description:
        'Le planisphère interactif affiche la santé de chaque pays. Vous pouvez changer le mode de visualisation pour analyser le stress thermique (Tw), le stress hydrique ou la disponibilité alimentaire.',
      tips: [
        {
          icon: <Thermometer className="w-4 h-4 text-rose-400" />,
          text: 'Calque Tw (Stull 2011) : met en lumière les zones mortelles où le corps ne peut plus transpirer (Tw > 31°C).'
        },
        {
          icon: <Eye className="w-4 h-4 text-cyan-400" />,
          text: 'Cliquez sur n\'importe quel pays (France, Inde, Brésil, États-Unis...) pour ouvrir son tiroir d\'inspection détaillée.'
        },
        {
          icon: <Users className="w-4 h-4 text-emerald-400" />,
          text: 'Le tiroir affiche la pyramide des âges, les calories par habitant et les réfugiés climatiques.'
        }
      ],
      actionLabel: 'Tester sur le Planisphère',
      targetTab: 'map'
    },
    {
      id: 4,
      badge: 'Étape 4 · Politiques Comparées',
      badgeColor: 'border-emerald-700 bg-emerald-950/80 text-emerald-300',
      title: 'Scénario A vs B : Le Bénéfice de l\'Action',
      subtitle: 'Comparez le Fil de l\'eau (BAU) à une politique de Sobriété',
      description:
        'CLIMATOPEDY permet de comparer simultanément deux avenirs : le Scénario A (rigidité fossile actuelle SSP5-8.5) face au Scénario B (planification écologique et sobriété). Le tableau calcule en temps réel les millions de vies épargnées et le réchauffement évité.',
      tips: [
        {
          icon: <Sliders className="w-4 h-4 text-emerald-400" />,
          text: 'Réglez les curseurs : déclin pétrolier volontaire, redirection des capitaux, agroécologie.'
        },
        {
          icon: <CheckCircle className="w-4 h-4 text-cyan-400" />,
          text: 'Consultez l\'onglet « Dashboard Comparatif » pour voir les deux planisphères côte à côte.'
        },
        {
          icon: <Layers className="w-4 h-4 text-amber-400" />,
          text: 'L\'indicateur de vies préservées cumule les surmortalités évitées par rapport au scénario passif.'
        }
      ],
      actionLabel: 'Ouvrir le Dashboard Comparatif',
      targetTab: 'comparative-dashboard'
    },
    {
      id: 5,
      badge: 'Étape 5 · Enquêtes & Points Critiques',
      badgeColor: 'border-rose-700 bg-rose-950/80 text-rose-300',
      title: 'Points de Bascule & Enquête Énergie',
      subtitle: 'Deux modules d\'investigation avec photographies documentaires',
      description:
        'Pour aller plus loin que les courbes agrégées, deux onglets spécialisés vous plongent au cœur des mécanismes physiques du système Terre.',
      tips: [
        {
          icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
          text: 'Onglet Points de Bascule : diagnostic des 9 seuils critiques (Groenland, AMOC, Amazonie, pergélisol Batagaika...) selon la hausse de température.'
        },
        {
          icon: <Network className="w-4 h-4 text-amber-400" />,
          text: 'Onglet Enquête Énergie : traçabilité matérielle de la plateforme offshore au porte-conteneurs et aux engrais Haber-Bosch.'
        },
        {
          icon: <Eye className="w-4 h-4 text-cyan-400" />,
          text: 'Basculez entre photographies réelles haute définition et coupes schématiques géotechniques.'
        }
      ],
      actionLabel: 'Voir les 9 Points de Bascule',
      targetTab: 'tipping-points'
    },
    {
      id: 6,
      badge: 'Étape 6 · Transparence & Outils',
      badgeColor: 'border-purple-700 bg-purple-950/80 text-purple-300',
      title: 'Rigueur Académique & Export de Rapport',
      subtitle: 'Vérifiez le travail et partagez vos simulations',
      description:
        'CLIMATOPEDY s\'inscrit dans une démarche d\'Open-Science intégrale. Vous pouvez auditer chaque formule, consulter les publications originales ou générer un rapport PDF complet.',
      tips: [
        {
          icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
          text: 'Onglet Sources & Données : plus de 20 publications à comité de lecture (Nature, Science, PNAS, GIEC, NOAA) avec liens vérifiés et archives photographiques.'
        },
        {
          icon: <Layers className="w-4 h-4 text-emerald-400" />,
          text: 'Onglet Spécifications : l\'ensemble des formules différentielles (ODE) et du modèle de Leontief documentés.'
        },
        {
          icon: <FileDown className="w-4 h-4 text-purple-400" />,
          text: 'Bouton Rapport PDF (en haut à droite) : téléchargez un document de synthèse synthétisant votre état de simulation.'
        }
      ],
      actionLabel: 'Terminer le tutoriel et explorer',
      targetTab: 'map'
    }
  ];

  const currentStep = steps[currentStepIndex];

  // Gestion des raccourcis clavier (Flèche droite / gauche / Échap)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleFinish();
      } else if (e.key === 'ArrowRight') {
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          handleFinish();
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentStepIndex > 0) {
          setCurrentStepIndex((prev) => prev - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex, steps.length]);

  if (!isOpen) return null;

  const handleFinish = () => {
    try {
      localStorage.setItem('climatopedy_desktop_tutorial_seen', 'true');
    } catch (e) {
      // Ignorer si localStorage est indisponible
    }
    onClose();
  };

  const handleStepAction = () => {
    if (currentStep.targetTab && onNavigateTab) {
      onNavigateTab(currentStep.targetTab);
    }
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-modal-title"
    >
      <div className="bg-[#0b1220] border border-cyan-800/70 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col text-slate-200 relative max-h-[92vh]">
        {/* Grille lumineuse discrète */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,#0369a118,transparent_70%)]" />

        {/* Barre de progression supérieure */}
        <div className="w-full bg-slate-900 h-1.5 shrink-0">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400 transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* En-tête de la modale */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-800/90 bg-gradient-to-r from-[#0d1728] via-[#0b1220] to-[#0d1728] flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${currentStep.badgeColor}`}>
                {currentStep.badge}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentStepIndex + 1} / {steps.length}
              </span>
            </div>
            <h2 id="tutorial-modal-title" className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {currentStep.title}
            </h2>
            <p className="text-xs text-cyan-300 font-medium">
              {currentStep.subtitle}
            </p>
          </div>

          <button
            onClick={handleFinish}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Fermer le tutoriel (Échap)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Corps de l'étape */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p className="text-slate-200">
            {currentStep.description}
          </p>

          {/* Cartouches de conseils / astuces pratiques */}
          <div className="space-y-2.5 pt-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
              Astuces clés de navigation :
            </span>
            <div className="grid grid-cols-1 gap-2">
              {currentStep.tips.map((tip, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-300"
                >
                  <div className="shrink-0 mt-0.5">{tip.icon}</div>
                  <span className="leading-snug">{tip.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pied de popup : navigation entre étapes */}
        <div className="p-4 sm:p-5 border-t border-slate-800/90 bg-[#080d17] flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Puces d'étapes interactives */}
          <div className="flex items-center gap-1.5 order-2 sm:order-1">
            {steps.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentStepIndex
                    ? 'w-6 bg-cyan-400 shadow-sm shadow-cyan-400/50'
                    : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Aller à l'étape ${idx + 1} : ${s.title}`}
              />
            ))}
            <span className="text-[10px] font-mono text-slate-500 ml-2 hidden sm:inline">
              (Flèches &larr; &rarr;)
            </span>
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center gap-2 order-1 sm:order-2 w-full sm:w-auto justify-end">
            {currentStepIndex > 0 && (
              <button
                onClick={() => setCurrentStepIndex((prev) => prev - 1)}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Précédent</span>
              </button>
            )}

            {currentStepIndex < steps.length - 1 ? (
              <button
                onClick={handleStepAction}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-950/60 transition-all cursor-pointer hover:scale-102"
              >
                <span>{currentStep.actionLabel || 'Étape suivante'}</span>
                <ChevronRight className="w-4 h-4 text-slate-950" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-950/60 transition-all cursor-pointer hover:scale-102"
              >
                <Check className="w-4 h-4 text-slate-950" />
                <span>Terminer le tutoriel &amp; Explorer</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
