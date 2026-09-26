import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle, ExternalLink, X, Zap, Thermometer, Wheat, Wind, Waves, AlertCircle } from 'lucide-react';

export type TechTermKey = 'eroi' | 'haber-bosch' | 'fair' | 'stull' | 'slr' | 'ssp585';

interface TermData {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badgeColor: string;
  definition: string;
  analogy: string;
  thresholdOrKeyFact: string;
  faqId: string;
}

export const TECH_TERMS: Record<TechTermKey, TermData> = {
  eroi: {
    title: 'Rendement de l\'Énergie',
    subtitle: 'Combien de barils obtenus pour 1 baril dépensé à forer',
    icon: <Zap className="w-3.5 h-3.5 text-amber-600" />,
    badgeColor: 'border-amber-200 text-amber-800 bg-amber-50',
    definition:
      'Indique combien de barils d\'énergie brute on extrait pour 1 baril consommé à forer, pomper et raffiner (terme scientifique : EROI).',
    analogy:
      'Un EROI de 12:1 signifie 12 unités d\'énergie obtenues pour une unité investie, dans le périmètre défini par l\'étude. Les valeurs varient selon la ressource et la méthode.',
    thresholdOrKeyFact:
      'Il n\'existe pas de seuil EROI universel qui détermine à lui seul la capacité d\'une société à fournir des services.',
    faqId: 'faq-eroi'
  },
  'haber-bosch': {
    title: 'Procédé Haber-Bosch (Engrais Azotés)',
    subtitle: 'Chimie industrielle · N₂ + 3H₂ → 2NH₃',
    icon: <Wheat className="w-3.5 h-3.5 text-emerald-600" />,
    badgeColor: 'border-emerald-200 text-emerald-800 bg-emerald-50',
    definition:
      'Procédé chimique qui combine le gaz fossile (méthane) et l\'azote de l\'air pour fabriquer les engrais de synthèse mondiaux.',
    analogy:
      'Smil estimait qu\'environ 40% de la population mondiale dépendait de l\'azote de synthèse vers 2000; Erisman et al. (2008) estimaient qu\'environ 48% de la population était nourrie par des cultures utilisant cet azote en 2008. Ce sont des estimations de production alimentaire à l\'échelle de la population, pas une mesure des atomes d\'azote de chaque individu.',
    thresholdOrKeyFact:
      'Le gaz naturel est une matière première et une source d\'énergie importante pour la production conventionnelle d\'ammoniac. L\'ampleur d\'un effet sur les rendements dépend des solutions de remplacement et des conditions agricoles.',
    faqId: 'faq-haber-bosch'
  },
  fair: {
    title: 'Modèle FaIR (utilisé dans des analyses du GIEC)',
    subtitle: 'Finite Amplitude Impulse Response · Climatologie',
    icon: <Wind className="w-3.5 h-3.5 text-sky-600" />,
    badgeColor: 'border-sky-200 text-sky-800 bg-sky-50',
    definition:
      'Modèle climatique réduit qui calcule la réponse climatique à des émissions de gaz à effet de serre. FaIR a contribué à certaines analyses du GIEC; ce n\'est pas son modèle officiel unique.',
    analogy:
      'Il calcule rapidement des réponses climatiques à des scénarios. Sa structure réduite ne réalise pas les mêmes calculs qu\'un modèle climatique tridimensionnel de circulation générale.',
    thresholdOrKeyFact:
      'Les valeurs affichées par CLIMATOPEDY sont des sorties de simulation, conditionnelles à ses paramètres; elles ne sont pas des projections officielles du GIEC.',
    faqId: 'faq-fair'
  },
  stull: {
    title: 'Thermomètre Mouillé Stull Tw',
    subtitle: 'Wet-Bulb Temperature · Formule Roland Stull (2011)',
    icon: <Thermometer className="w-3.5 h-3.5 text-rose-600" />,
    badgeColor: 'border-rose-200 text-rose-800 bg-rose-50',
    definition:
      'Température au thermomètre mouillé, calculée à partir des conditions atmosphériques. Ce n\'est pas la température ressentie par la peau.',
    analogy:
      'L\'humidité élevée peut limiter l\'évaporation de la sueur. La capacité du corps à perdre de la chaleur dépend aussi de la température, de l\'activité, de l\'acclimatation et de l\'environnement.',
    thresholdOrKeyFact:
      'Sherwood et Huber (2010) discutent une limite théorique autour de 35°C Tw pour une exposition prolongée. Ce n\'est pas un seuil universel de mortalité; Raymond et al. (2020) étudient des épisodes météorologiques extrêmes observés.',
    faqId: 'faq-stull'
  },
  slr: {
    title: 'Montée des Océans (SLR)',
    subtitle: 'Sea Level Rise · Dilatation thermique & fonte',
    icon: <Waves className="w-3.5 h-3.5 text-sky-600" />,
    badgeColor: 'border-sky-200 text-sky-800 bg-sky-50',
    definition:
      'Élévation moyenne du niveau marin mondial sous l\'effet combiné de l\'expansion de l\'eau chauffée et de la fonte des glaces terrestres.',
    analogy:
      'L\'AR6 estime, par rapport à 1995–2014, 0,28–0,55 m d\'élévation probable d\'ici 2100 sous SSP1-1.9 et 0,63–1,01 m sous SSP5-8.5 (confiance moyenne). Les impacts côtiers dépendent des conditions locales.',
    thresholdOrKeyFact:
      'À +50 cm, des dizaines de millions d\'habitants des deltas d\'Asie (Mékong, Bangladesh, Nil) perdent leurs terres cultivables.',
    faqId: 'faq-slr'
  },
  ssp585: {
    title: 'Scénario SSP5-8.5 (très fortes émissions)',
    subtitle: 'Shared Socioeconomic Pathway 5 · GIEC',
    icon: <AlertCircle className="w-3.5 h-3.5 text-amber-600" />,
    badgeColor: 'border-amber-200 text-amber-800 bg-amber-50',
    definition:
      'Scénario conditionnel de très fortes émissions associé à la trajectoire socio-économique SSP5. Ce n\'est ni une prévision certaine ni nécessairement le scénario le plus probable.',
    analogy:
      'Dans CLIMATOPEDY, les résultats associés à ce scénario sont calculés par le modèle du site et dépendent de ses propres paramètres.',
    thresholdOrKeyFact:
      'Le scénario climatique GIEC est défini par des trajectoires d\'émissions prescrites; l\'épuisement de ressources n\'est pas une caractéristique définissant SSP5-8.5.',
    faqId: 'faq-ssp585'
  }
};

interface TechTooltipProps {
  term: TechTermKey;
  children?: React.ReactNode;
  inlineLabel?: string;
  className?: string;
  showIconOnly?: boolean;
}

export const TechTooltip: React.FC<TechTooltipProps> = ({
  term,
  children,
  inlineLabel,
  className = '',
  showIconOnly = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const data = TECH_TERMS[term];

  const openPopover = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      const width = Math.min(320, window.innerWidth - 24);
      const leftOfTrigger = rect.left - width - 12;
      const preferredLeft = leftOfTrigger >= 12
        ? leftOfTrigger
        : rect.right + 12;
      setPopoverPosition({
        left: Math.max(12, Math.min(preferredLeft, window.innerWidth - width - 12)),
        top: Math.max(12, rect.top - 12)
      });
    }
    setIsOpen(true);
  };

  const scheduleClose = () => {
    closeTimerRef.current = setTimeout(() => setIsOpen(false), 140);
  };

  const togglePopover = () => {
    if (isOpen) setIsOpen(false);
    else openPopover();
  };

  // Fermeture au clic extérieur ou touche Échap
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!containerRef.current?.contains(target) && !popoverRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleOpenFaq = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    // Dispatch d'un événement global pour que la section FAQ déroule directement la question
    window.dispatchEvent(
      new CustomEvent('climatopedy-open-faq', {
        detail: { faqId: data.faqId }
      })
    );
    // Scroll fluide jusqu'à la section FAQ
    const faqElem = document.getElementById(data.faqId) || document.getElementById('faq-section');
    if (faqElem) {
      faqElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center align-middle ${className}`}
      onMouseEnter={openPopover}
      onMouseLeave={scheduleClose}
    >
      {/* Bouton déclencheur interactif */}
      {children ? (
        <button
          ref={triggerRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            togglePopover();
          }}
          className="inline-flex items-center gap-1 text-inherit border-b border-dotted border-sky-400 hover:border-sky-600 hover:text-sky-700 transition-colors cursor-help group text-left"
          title={`Cliquez pour comprendre le terme « ${data.title} »`}
        >
          <span>{children}</span>
          <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-slate-100 text-[9px] font-bold text-sky-700 group-hover:bg-sky-600 group-hover:text-white transition-colors">
            ?
          </span>
        </button>
      ) : showIconOnly ? (
        <button
          ref={triggerRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            togglePopover();
          }}
          className="p-0.5 rounded text-slate-400 hover:text-sky-600 hover:bg-slate-100 transition-colors cursor-pointer"
          title={`Définition : ${data.title}`}
          aria-label={`Comprendre ${data.title}`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
        </button>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            togglePopover();
          }}
          className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border transition-all cursor-pointer ${data.badgeColor} hover:brightness-105`}
          title={`Définition rapide : ${data.title}`}
        >
          {data.icon}
          <span>{inlineLabel || 'Explication'}</span>
          <span className="text-[9px] opacity-70">?</span>
        </button>
      )}

      {/* Popover / Infobulle riche au survol ou au clic */}
      {isOpen && createPortal(
        <div
          ref={popoverRef}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current); }}
          onMouseLeave={scheduleClose}
          style={{ position: 'fixed', zIndex: 1000, top: popoverPosition.top, left: popoverPosition.left, transform: 'translateY(-100%)', width: `${Math.min(320, window.innerWidth - 24)}px`, maxHeight: '80vh', overflowY: 'auto' }}
          className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xl text-left animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md"
        >
          {/* Flèche vers le bas */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white" />

          {/* En-tête du tooltip */}
          <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-slate-50 border border-slate-200 shrink-0">
                {data.icon}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 tracking-tight leading-tight">
                  {data.title}
                </h4>
                <p className="text-[9.5px] text-slate-500 font-mono">
                  {data.subtitle}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
              title="Fermer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Définition en 1 phrase */}
          <div className="py-2 text-[11px] text-slate-600 leading-snug space-y-2">
            <p>
              <strong className="text-slate-800">Définition :</strong> {data.definition}
            </p>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-[10.5px] text-slate-700">
              <span className="font-semibold text-sky-700 block mb-0.5">💡 Analogie concrète :</span>
              {data.analogy}
            </div>
            <div className="p-1.5 rounded bg-amber-50 border border-amber-200 text-[10px] text-amber-800 font-medium">
              ⚡ {data.thresholdOrKeyFact}
            </div>
          </div>

          {/* Bouton de redirection vers la FAQ interactive complète */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Info-bulle CLIMATOPEDY</span>
            <button
              onClick={handleOpenFaq}
              className="inline-flex items-center gap-1 font-semibold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
            >
              <span>Lire l'explication complète dans la FAQ</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>, document.body
      )}
    </div>
  );
};
