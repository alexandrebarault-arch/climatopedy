import React, { useState, useRef, useEffect } from 'react';
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
      'En 1900, 1 baril dépensé en rapportait 100 (x100). En 2026, il n\'en rapporte plus que 12 (x12). Les 92% d\'énergie restante font rouler camions, tracteurs et hôpitaux.',
    thresholdOrKeyFact:
      'Seuil critique : en dessous de x5, la société dépense tellement d\'énergie à forer qu\'elle n\'a plus assez d\'énergie utile pour faire tourner les hôpitaux ou les écoles.',
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
      'Près de 50% de l\'azote contenu dans les protéines de nos corps provient directement de cette réaction inventée en 1909.',
    thresholdOrKeyFact:
      'Sans gaz naturel pour alimenter Haber-Bosch, les récoltes de blé et de riz s\'effondrent de 40% à 50% en moins de 3 saisons.',
    faqId: 'faq-haber-bosch'
  },
  fair: {
    title: 'Modèle FaIR v1.1 (GIEC AR6)',
    subtitle: 'Finite Amplitude Impulse Response · Climatologie',
    icon: <Wind className="w-3.5 h-3.5 text-sky-600" />,
    badgeColor: 'border-sky-200 text-sky-800 bg-sky-50',
    definition:
      'Modèle climatique simplifié officiel retenu par le GIEC dans son 6e rapport (AR6) pour calculer l\'élévation de température selon les émissions de gaz à effet de serre.',
    analogy:
      'Il effectue en quelques millisecondes les mêmes calculs physiques que les supercalculateurs géants de Météo-France, en intégrant le cycle du carbone et l\'inertie des océans.',
    thresholdOrKeyFact:
      'Calcule l\'anomalie de température mondiale par rapport à 1850-1900 (+1,35°C en 2026, vers +3,5°C à +4,0°C en 2100 sous SSP5-8.5).',
    faqId: 'faq-fair'
  },
  stull: {
    title: 'Thermomètre Mouillé Stull Tw',
    subtitle: 'Wet-Bulb Temperature · Formule Roland Stull (2011)',
    icon: <Thermometer className="w-3.5 h-3.5 text-rose-600" />,
    badgeColor: 'border-rose-200 text-rose-800 bg-rose-50',
    definition:
      'Température ressentie par la peau humaine humidifiée par la sueur au contact de l\'air, calculée en combinant chaleur (°C) et humidité relative (%).',
    analogy:
      'Quand l\'air est saturé d\'humidité (100%), la sueur ne peut plus s\'évaporer : le corps ne peut plus du tout se refroidir.',
    thresholdOrKeyFact:
      'Seuil mortel absolu à 31,0°C Tw (Raymond et al., 2020) : même au repos à l\'ombre avec de l\'eau, le corps monte à 42°C en 4 à 6 heures sans climatisation électrique continue.',
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
      'Mesurée à +12 cm en 2026, elle atteint +60 à +75 cm en 2100. Chaque tranche de 10 cm salinise les nappes d\'eau douce côtières et submerge les grands deltas rizicoles.',
    thresholdOrKeyFact:
      'À +50 cm, des dizaines de millions d\'habitants des deltas d\'Asie (Mékong, Bangladesh, Nil) perdent leurs terres cultivables.',
    faqId: 'faq-slr'
  },
  ssp585: {
    title: 'Scénario SSP5-8.5 (Rigidité)',
    subtitle: 'Shared Socioeconomic Pathway 5 · GIEC',
    icon: <AlertCircle className="w-3.5 h-3.5 text-amber-600" />,
    badgeColor: 'border-amber-200 text-amber-800 bg-amber-50',
    definition:
      'Trajectoire socio-économique de référence où la croissance thermo-industrielle intensive se poursuit sans rupture politique majeure jusqu\'à heurter les limites géologiques.',
    analogy:
      'Sert de modèle de rigidité comportementale pour mesurer le choc réel quand la dépendance fossile percute les contraintes de la physique.',
    thresholdOrKeyFact:
      'Émissions de CO₂ continuant à croître jusqu\'en 2080 avant de s\'effondrer par épuisement des ressources accessibles.',
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
  const containerRef = useRef<HTMLDivElement>(null);
  const data = TECH_TERMS[term];

  // Fermeture au clic extérieur ou touche Échap
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Bouton déclencheur interactif */}
      {children ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
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
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
          className="p-0.5 rounded text-slate-400 hover:text-sky-600 hover:bg-slate-100 transition-colors cursor-pointer"
          title={`Définition : ${data.title}`}
          aria-label={`Comprendre ${data.title}`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
        </button>
      ) : (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
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
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-80 p-3.5 bg-white border border-slate-200 rounded-xl shadow-xl text-left animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md"
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
        </div>
      )}
    </div>
  );
};
