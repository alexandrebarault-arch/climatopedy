import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Thermometer,
  Snowflake,
  TreePine,
  Waves,
  Wind,
  Info,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  BookOpen,
  Filter,
  Activity,
  Layers,
  Sparkles,
  Flame,
  Calendar,
  Camera
} from 'lucide-react';
import { TippingPointsChart } from './TippingPointsChart';
import { AllTippingPointsConsequencesModal } from './AllTippingPointsConsequencesModal';
import { TippingPointModal } from './TippingPointModal';
import { TippingPointVisualCard, VISUAL_METADATA } from './TippingPointVisualCard';

export interface TippingElement {
  id: string;
  name: string;
  category: 'cryosphere' | 'biosphere' | 'ocean_atmosphere';
  categoryLabel: string;
  location: string;
  summarySimple: string; // Expliqué simplement pour tout le monde
  thresholdEst: number; // Seuil central estimé (°C)
  thresholdMin: number; // Seuil bas (°C)
  thresholdMax: number; // Seuil haut (°C)
  timescaleYears: string; // Temps pour basculer
  observedFactToday: string; // FAIT SCIENTIFIQUE MESURÉ AUJOURD'HUI
  consequencePlain: string; // Ce que ça change concrètement pour nous
  irreversibilityNotes: string; // Pourquoi c'est difficile à inverser
  scientificSource: string; // Référence exacte
  statusToday: 'safe' | 'at_risk' | 'tipping';
  estimatedYearTendency: string; // Date estimée de franchissement (trajectoire actuelle)
  whatIsItSimple: string; // Explication en 1 phrase accessible à un lecteur sans compétences
  whyPointOfNoReturn: string; // Pourquoi on ne peut plus revenir en arrière
  concreteImpactEveryday: string; // Impact direct dans l'assiette ou le quotidien
}

const TIPPING_ELEMENTS: TippingElement[] = [
  {
    id: 'greenland',
    name: 'Calotte glaciaire du Groenland',
    category: 'cryosphere',
    categoryLabel: 'Glaces & Pôles',
    location: 'Arctique Nord',
    summarySimple: 'La calotte du Groenland est une vaste masse de glace continentale. Sa masse et son altitude évoluent avec les échanges de neige et de glace avec l\'océan et l\'atmosphère.',
    thresholdEst: 1.5,
    thresholdMin: 0.8,
    thresholdMax: 3.0,
    timescaleYears: '1 000 à 10 000 ans',
    observedFactToday: 'Les observations satellitaires montrent une perte nette de masse de la calotte groenlandaise depuis le début des mesures gravimétriques GRACE; le taux moyen varie selon la période retenue.',
    consequencePlain: 'La fonte complète de la calotte groenlandaise correspond à environ 7 m d\'élévation moyenne du niveau marin à long terme. Ce n\'est pas une projection pour le XXIe siècle.',
    irreversibilityNotes: 'La réponse de la calotte dépend du réchauffement, de sa durée et des processus de surface et de dynamique glaciaire; les seuils et délais sont estimés avec incertitude.',
    scientificSource: 'Armstrong McKay et al., Science 2022 ; GIEC AR6 WG1 Chapitre 9 ; NASA GRACE.',
    statusToday: 'at_risk',
    estimatedYearTendency: 'Aucune date précise établie par les sources citées',
    whatIsItSimple: 'La calotte du Groenland est une vaste masse de glace reposant sur un socle rocheux. Elle contribue au niveau marin lorsqu\'elle perd de la masse vers l\'océan.',
    whyPointOfNoReturn: 'Des rétroactions liées à l\'altitude de la surface et au bilan de masse sont étudiées dans la littérature; leur importance dépend du scénario de réchauffement.',
    concreteImpactEveryday: 'La contribution de la calotte au niveau marin est évaluée sur des échelles de temps longues. Les conséquences locales dépendent aussi de la subsidence, des marées et de l\'exposition côtière.'
  },
  {
    id: 'wais',
    name: 'Calotte de l\'Antarctique de l\'Ouest (WAIS)',
    category: 'cryosphere',
    categoryLabel: 'Glaces & Pôles',
    location: 'Pôle Sud (Glaciers Thwaites et Pine Island)',
    summarySimple: 'La calotte antarctique occidentale comprend des secteurs dont le socle rocheux est situé sous le niveau de la mer. L\'océan peut contribuer à la fonte basale de glaciers côtiers.',
    thresholdEst: 1.5,
    thresholdMin: 1.0,
    thresholdMax: 3.0,
    timescaleYears: '500 à 2 000 ans',
    observedFactToday: 'Les observations satellitaires et de terrain montrent un amincissement et un recul de plusieurs glaciers de l\'Antarctique occidental, dont Thwaites; les taux varient dans le temps et selon les secteurs.',
    consequencePlain: 'La perte complète de la calotte antarctique occidentale correspondrait à plusieurs mètres d\'élévation moyenne du niveau marin à long terme. Ce chiffre n\'est pas une projection pour le XXIe siècle.',
    irreversibilityNotes: 'Certains secteurs reposent sur un socle situé sous le niveau marin. La dynamique de retrait et la stabilité de ces secteurs font l\'objet d\'études et d\'incertitudes.',
    scientificSource: 'Joughin et al., Science 2014 ; Rignot et al., GRL 2014 ; GIEC SROCC.',
    statusToday: 'at_risk',
    estimatedYearTendency: 'Aucune date précise établie par les sources citées',
    whatIsItSimple: 'La calotte antarctique occidentale comprend des glaciers reposant en partie sur un socle situé sous le niveau marin; l\'eau océanique peut contribuer à leur fonte basale.',
    whyPointOfNoReturn: 'L\'instabilité des secteurs marins est un mécanisme étudié; son évolution dépend de la géométrie du socle, de l\'océan et du climat.',
    concreteImpactEveryday: 'Une élévation du niveau marin augmente l\'exposition des zones côtières. Les impacts locaux dépendent des trajectoires d\'élévation, de l\'altitude et des protections en place.'
  },
  {
    id: 'corals',
    name: 'Récifs coralliens tropicaux d\'eaux chaudes',
    category: 'biosphere',
    categoryLabel: 'Écosystèmes vivants',
    location: 'Ceinture équatoriale (Grande Barrière, Caraïbes, Indo-Pacifique)',
    summarySimple: 'Quand l\'eau devient trop chaude ne serait-ce que de 1 ou 2°C pendant quelques semaines, les coraux expulsent la micro-algue qui les nourrit et leur donne leurs couleurs. Si la chaleur persiste, ils meurent de faim et blanchissent.',
    thresholdEst: 1.5,
    thresholdMin: 1.0,
    thresholdMax: 2.0,
    timescaleYears: '1 à 10 ans (quasi-immédiat)',
    observedFactToday: 'En avril 2024, la NOAA a annoncé le quatrième épisode mondial de blanchissement des coraux. L\'agence a rapporté un stress thermique de niveau blanchissement sur une part importante des récifs suivis; ce stress ne signifie pas que tous les coraux sont morts.',
    consequencePlain: 'Les récifs coralliens fournissent des habitats et contribuent à la protection de certains littoraux. Le GIEC évalue une forte diminution de leur aire à mesure que le réchauffement augmente; ces estimations dépendent du niveau de réchauffement.',
    irreversibilityNotes: 'Un récif met 10 à 15 ans à se régénérer après un blanchissement. Si les vagues de chaleur marine reviennent chaque été, ils n\'ont plus le temps physique de survivre.',
    scientificSource: 'IPCC Spécial 1.5°C (2018) ; NOAA Coral Reef Watch (2024) ; Hughes et al., Nature 2017.',
    statusToday: 'tipping',
    estimatedYearTendency: 'Aucune date précise établie par les sources citées',
    whatIsItSimple: 'Les coraux bâtisseurs de récifs vivent en association avec des algues. Un stress thermique peut provoquer le blanchissement; la mortalité dépend de l\'intensité et de la durée du stress et d\'autres facteurs.',
    whyPointOfNoReturn: 'La fréquence des épisodes de stress thermique peut affecter la récupération des récifs. Le rythme de récupération varie selon les espèces et les conditions locales.',
    concreteImpactEveryday: 'Les récifs fournissent des habitats et contribuent à la protection de certains littoraux; les effets d\'un épisode de blanchissement varient selon l\'écosystème et sa durée.'
  },
  {
    id: 'permafrost',
    name: 'Dégel brutal du pergélisol (Permafrost)',
    category: 'cryosphere',
    categoryLabel: 'Glaces & Pôles',
    location: 'Sibérie, Alaska, Nord du Canada',
    summarySimple: 'Le pergélisol est un sol qui reste à une température égale ou inférieure à 0°C pendant au moins deux années consécutives. Le dégel peut entraîner la décomposition de matière organique et des émissions de gaz à effet de serre.',
    thresholdEst: 1.5,
    thresholdMin: 1.0,
    thresholdMax: 2.3,
    timescaleYears: '100 à 300 ans',
    observedFactToday: 'Réseau GTN-P : la température des sols arctiques à 10-20 m de profondeur s\'est réchauffée de +0,3°C à +0,6°C par décennie. Des cratères d\'effondrement (thermokarst) et des fuites de méthane sont observés en Sibérie.',
    consequencePlain: 'Le pergélisol contient une grande quantité de carbone organique. Le dégel peut favoriser des émissions de CO₂ et de méthane; l\'ampleur dépend de la zone, du rythme du dégel et des processus microbiens.',
    irreversibilityNotes: 'Le dégel peut rendre disponible de la matière organique à la décomposition microbienne. Les émissions associées dépendent des conditions locales et des processus biogéochimiques.',
    scientificSource: 'Turetsky et al., Nature Geoscience 2020 ; Schuur et al., Nature 2015 ; GIEC AR6 Chapitre 5.',
    statusToday: 'at_risk',
    estimatedYearTendency: 'Aucune date précise établie par les sources citées',
    whatIsItSimple: 'Le pergélisol désigne un sol gelé en permanence pendant au moins deux années consécutives. Il peut contenir de la matière organique accumulée au cours du temps.',
    whyPointOfNoReturn: 'Le réchauffement du sol favorise le dégel; la vitesse et la profondeur du dégel varient selon le climat, les sols et la couverture végétale.',
    concreteImpactEveryday: 'Les émissions liées au dégel du pergélisol constituent une rétroaction climatique étudiée et sont incluses dans certaines évaluations des émissions futures.'
  },
  {
    id: 'barents_ice',
    name: 'Banquise d\'été en Mer de Barents',
    category: 'cryosphere',
    categoryLabel: 'Glaces & Pôles',
    location: 'Arctique boréal (au nord de la Norvège et Russie)',
    summarySimple: 'La glace de mer a un albédo plus élevé que l\'océan libre. La diminution de la couverture de glace modifie l\'énergie solaire absorbée par la surface, selon la saison et les conditions locales.',
    thresholdEst: 1.6,
    thresholdMin: 1.5,
    thresholdMax: 1.7,
    timescaleYears: '20 à 30 ans',
    observedFactToday: 'Les observations montrent une diminution de l\'étendue de la glace de mer arctique en septembre depuis le début des mesures satellitaires en 1979. Le taux dépend de la période calculée.',
    consequencePlain: 'Les liens entre la diminution de la glace de mer arctique et les régimes météorologiques des latitudes moyennes font l\'objet de recherches; leur ampleur et leur robustesse sont discutées.',
    irreversibilityNotes: 'La diminution de la glace de mer réduit l\'albédo de surface et modifie l\'absorption du rayonnement solaire; l\'effet varie selon la saison et la couverture nuageuse.',
    scientificSource: 'Rantanen et al., Communications Earth & Environment 2022 ; Screen & Simmonds 2010.',
    statusToday: 'at_risk',
    estimatedYearTendency: 'Aucune date précise établie par les sources citées',
    whatIsItSimple: 'La glace de mer arctique présente un albédo supérieur à celui de l\'océan libre. Son étendue varie au cours de l\'année et diminue à long terme.',
    whyPointOfNoReturn: 'La relation entre la couverture de glace, l\'albédo et la température de surface est décrite dans les évaluations du climat; elle ne permet pas, à elle seule, de déduire une date de disparition.',
    concreteImpactEveryday: 'Les effets de la diminution de la glace de mer sur les conditions météorologiques locales et lointaines sont étudiés; ils ne sont pas déterminés par cette simulation.'
  },
  {
    id: 'amazon',
    name: 'Dépérissement de la forêt tropicale amazonienne',
    category: 'biosphere',
    categoryLabel: 'Écosystèmes vivants',
    location: 'Bassin d\'Amérique du Sud (Brésil, Pérou, Colombie...)',
    summarySimple: 'L\'évapotranspiration de la forêt amazonienne contribue au recyclage de l\'humidité et aux précipitations régionales. La déforestation et le réchauffement peuvent modifier ces processus.',
    thresholdEst: 3.5,
    thresholdMin: 2.0,
    thresholdMax: 6.0,
    timescaleYears: '50 à 100 ans',
    observedFactToday: 'Les mesures de flux de carbone rapportées par Gatti et al. (2021) indiquent des émissions nettes dans l\'est et le sud-est de l\'Amazonie étudiés, en lien notamment avec la déforestation et les sécheresses pendant la période d\'observation.',
    consequencePlain: 'La dégradation de l\'Amazonie pourrait modifier les stocks de carbone, les précipitations régionales et les écosystèmes. L\'ampleur et la distribution de ces changements restent incertaines.',
    irreversibilityNotes: 'Les seuils de risque proposés pour l\'Amazonie dépendent du réchauffement et du déboisement; leurs estimations varient selon les méthodes et les hypothèses des études.',
    scientificSource: 'Nobre et al., Science Advances 2016 ; Gatti et al., Nature 2021 ; Lovejoy & Nobre 2018.',
    statusToday: 'at_risk',
    estimatedYearTendency: 'Aucune date précise établie par les sources citées',
    whatIsItSimple: 'L\'évapotranspiration de la végétation transfère de l\'eau vers l\'atmosphère et contribue aux précipitations régionales.',
    whyPointOfNoReturn: 'Le déboisement et le réchauffement peuvent modifier le cycle régional de l\'eau et accroître le risque de dégradation forestière; les seuils proposés sont incertains et dépendent de plusieurs facteurs.',
    concreteImpactEveryday: 'Les changements de précipitations et d\'écosystèmes peuvent affecter les activités agricoles et les populations de la région; les effets précis dépendent de l\'ampleur et de la localisation des changements.'
  },
  {
    id: 'amoc',
    name: 'Circulation méridienne atlantique (AMOC / Gulf Stream)',
    category: 'ocean_atmosphere',
    categoryLabel: 'Courants & Climat',
    location: 'Océan Atlantique Nord',
    summarySimple: 'L\'AMOC est un système de courants de l\'Atlantique qui transporte chaleur et eau entre les régions tropicales et nordiques. Elle comprend des courants de surface et des circulations profondes.',
    thresholdEst: 4.0,
    thresholdMin: 1.4,
    thresholdMax: 8.0,
    timescaleYears: '50 à 200 ans',
    observedFactToday: 'Les estimations des changements récents de l\'AMOC dépendent de la série d\'observations et de la méthode. La période instrumentale directe est trop courte pour établir un classement robuste sur un millénaire.',
    consequencePlain: 'Les modèles montrent qu\'un fort affaiblissement ou un effondrement de l\'AMOC modifierait les températures et les précipitations régionales. L\'ampleur et la répartition de ces changements dépendent du scénario et du modèle.',
    irreversibilityNotes: 'Des états alternatifs de la circulation sont étudiés dans les modèles; les mécanismes et la possibilité d\'un basculement sous le climat futur restent associés à des incertitudes.',
    scientificSource: 'Caesar et al., Nature 2018 ; Ditlevsen & Ditlevsen, Nature Comm. 2023 ; GIEC AR6 WG1.',
    statusToday: 'at_risk',
    estimatedYearTendency: 'Aucune date précise établie par les sources citées',
    whatIsItSimple: 'L\'AMOC est un système de courants de l\'Atlantique qui transporte chaleur, sel et eau entre les régions tropicales et nordiques. Elle comprend des courants de surface et des circulations profondes.',
    whyPointOfNoReturn: 'Le GIEC évalue un affaiblissement de l\'AMOC au XXIe siècle comme très probable, mais indique qu\'un effondrement abrupt avant 2100 n\'est pas attendu avec une confiance moyenne (AR6, WG I).',
    concreteImpactEveryday: 'Un fort affaiblissement modifierait les températures et les précipitations régionales. Les effets quantitatifs dépendent du scénario, du modèle et de la région.'
  },
  {
    id: 'boreal_forest',
    name: 'Dépérissement des forêts boréales (Taïga)',
    category: 'biosphere',
    categoryLabel: 'Écosystèmes vivants',
    location: 'Canada, Scandinavie, Russie',
    summarySimple: 'Les forêts boréales sont exposées aux variations de température, aux insectes, aux sécheresses et aux incendies. Les réponses des écosystèmes varient selon la région et les espèces.',
    thresholdEst: 4.0,
    thresholdMin: 1.5,
    thresholdMax: 5.0,
    timescaleYears: '50 à 100 ans',
    observedFactToday: 'La saison des feux de forêt au Canada en 2023 a été la plus étendue enregistrée dans le jeu de données national; les estimations d\'aire brûlée et d\'émissions dépendent des méthodes et sources utilisées.',
    consequencePlain: 'Les incendies émettent des gaz et des particules et peuvent modifier temporairement les flux de carbone des écosystèmes touchés.',
    irreversibilityNotes: 'Après un incendie, la composition et la structure de la végétation peuvent changer; la trajectoire de récupération dépend des conditions locales et de la fréquence des perturbations.',
    scientificSource: 'Walker et al., Nature Communications 2019 ; Zheng et al., Science 2023.',
    statusToday: 'safe',
    estimatedYearTendency: 'Aucune date précise établie par les sources citées',
    whatIsItSimple: 'Les forêts boréales forment une vaste zone forestière des hautes latitudes de l\'hémisphère Nord.',
    whyPointOfNoReturn: 'Le rétablissement après incendie dépend de l\'intensité du feu, des conditions du sol, des espèces présentes et des perturbations ultérieures.',
    concreteImpactEveryday: 'La fumée des incendies peut dégrader la qualité de l\'air et se transporter au-delà des zones brûlées; l\'exposition varie selon les conditions météorologiques.'
  },
  {
    id: 'wilkes_basin',
    name: 'Bassin sous-glaciaire de Wilkes (Antarctique Est)',
    category: 'cryosphere',
    categoryLabel: 'Glaces & Pôles',
    location: 'Antarctique Oriental',
    summarySimple: 'Le bassin de Wilkes est une région de l\'Antarctique oriental dont certaines parties du socle sont situées sous le niveau marin.',
    thresholdEst: 3.0,
    thresholdMin: 2.0,
    thresholdMax: 6.0,
    timescaleYears: '2 000 à 10 000 ans',
    observedFactToday: 'Certains secteurs côtiers (glacier Totten) montrent des signes d\'accélération de l\'amincissement sous l\'effet d\'eaux profondes tièdes.',
    consequencePlain: 'La perte de glace associée au bassin de Wilkes pourrait contribuer à l\'élévation du niveau marin sur de longues périodes; l\'ampleur et les délais dépendent de la dynamique de la calotte.',
    irreversibilityNotes: 'La géométrie du socle et les processus de rétroaction influencent la stabilité de la glace; leur évolution fait l\'objet d\'études et comporte des incertitudes.',
    scientificSource: 'Mengel & Levermann, Nature Climate Change 2014 ; Rignot et al., PNAS 2019.',
    statusToday: 'safe',
    estimatedYearTendency: 'Aucune date précise établie par les sources citées',
    whatIsItSimple: 'Le bassin de Wilkes est une région de l\'Antarctique oriental présentant une topographie sous-glaciaire en partie située sous le niveau marin.',
    whyPointOfNoReturn: 'La stabilité de la glace dépend notamment de la topographie sous-glaciaire et des interactions avec l\'océan; les projections comportent des incertitudes.',
    concreteImpactEveryday: 'Une contribution au niveau marin à long terme dépendrait de l\'évolution de la glace. Les impacts côtiers seraient différents selon l\'élévation locale, la subsidence et les protections.'
  }
];

interface TippingPointsViewProps {
  currentSimulatedYear?: number;
  currentSimulatedWarming?: number; // Ex: +1.28°C en 2026, +2.8°C en 2100
}

export const TippingPointsView: React.FC<TippingPointsViewProps> = ({
  currentSimulatedYear = 2026,
  currentSimulatedWarming = 1.3
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'cryosphere' | 'biosphere' | 'ocean_atmosphere'>('all');
  const [activeElementId, setActiveElementId] = useState<string>('corals');
  const [customTempSlider, setCustomTempSlider] = useState<number>(currentSimulatedWarming);
  const [modalElement, setModalElement] = useState<TippingElement | null>(null);
  const [isAllPointsModalOpen, setIsAllPointsModalOpen] = useState<boolean>(false);

  // Synchronise le curseur thermique avec la simulation en cours si elle change
  useEffect(() => {
    setCustomTempSlider(currentSimulatedWarming);
  }, [currentSimulatedWarming]);

  const activeElement = TIPPING_ELEMENTS.find(e => e.id === activeElementId) || TIPPING_ELEMENTS[0];

  const filteredElements = selectedCategory === 'all'
    ? TIPPING_ELEMENTS
    : TIPPING_ELEMENTS.filter(e => e.category === selectedCategory);

  // Helper pour situer un élément par rapport à la température sélectionnée
  const getRiskStatusAtTemp = (elem: TippingElement, temp: number) => {
    if (temp < elem.thresholdMin) {
      return {
        label: 'Zone encore épargnée',
        badgeClass: 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold',
        dotClass: 'bg-emerald-600',
        level: 'safe'
      };
    }
    if (temp >= elem.thresholdMin && temp < elem.thresholdEst) {
      return {
        label: 'Zone d\'incertitude & Risque réel',
        badgeClass: 'bg-amber-50 border-amber-300 text-amber-900 font-semibold',
        dotClass: 'bg-amber-500 animate-pulse',
        level: 'uncertain'
      };
    }
    return {
      label: 'Seuil central dépassé : Basculement probable',
      badgeClass: 'bg-rose-50 border-rose-300 text-rose-800 font-semibold',
      dotClass: 'bg-rose-600 animate-ping',
      level: 'tipped'
    };
  };

  return (
    <div className="flex flex-col gap-8 text-slate-700 pb-16">
      {/* 1. En-tête pédagogique et solennel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl relative z-10">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-1.5 shadow-2xs">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              Consensus Scientifique (Science 2022 &amp; GIEC AR6)
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-slate-100 border border-slate-200 text-slate-700">
              Réchauffement actuel mesuré : +1,3°C (OMM 2024)
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Les Points de Bascule du Climat Terrestre
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 font-normal">
            Un <strong>point de bascule</strong> (ou <em>tipping point</em>) est le seuil au-delà duquel un élément de la planète
            bascule de manière autonome et durable vers un nouvel état, <strong>même si l'humanité arrêtait toutes ses émissions le lendemain</strong>.
            Ici, pas de conjectures ni de sensationnalisme : uniquement les observations physiques mesurées par satellites et les synthèses des plus grandes revues scientifiques.
          </p>

          {/* Les 3 analogies pour comprendre simplement */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-2xs">
              <div className="flex items-center gap-2 text-sky-800 font-semibold text-xs mb-1.5">
                <span className="w-5 h-5 rounded-full bg-sky-100 border border-sky-300 flex items-center justify-center text-[11px] font-bold text-sky-800">1</span>
                L'analogie de la chaise
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                Cette analogie illustre un changement d'état après un seuil. Les seuils et mécanismes réels varient selon les composantes du système climatique et comportent des incertitudes.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-2xs">
              <div className="flex items-center gap-2 text-amber-800 font-semibold text-xs mb-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-[11px] font-bold text-amber-900">2</span>
                L'analogie du gros glaçon
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                Un grand volume de glace peut répondre lentement à un changement de température. Les délais de réponse des calottes sont estimés à partir de processus et de modèles; ils ne se déduisent pas directement de cette analogie.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-2xs">
              <div className="flex items-center gap-2 text-rose-800 font-semibold text-xs mb-1.5">
                <span className="w-5 h-5 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center text-[11px] font-bold text-rose-800">3</span>
                L'effet domino (cascade)
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                Les interactions entre calottes, circulation océanique, moussons et forêt amazonienne sont étudiées; cette chaîne ne constitue pas une conséquence déterministe établie.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Ce que la science DIT vs ce qu'elle NE DIT PAS (Démystification factuelle) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            Ce que la science a MESURÉ et DÉMONTRÉ (Faits)
          </div>
          <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>Réchauffement observé :</strong> Les estimations varient selon la période de référence et la période étudiée; une année isolée ne représente pas le niveau de réchauffement à long terme défini par le GIEC.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>Risques de points de bascule :</strong> La littérature évalue des plages de seuils et des probabilités pour plusieurs composantes; ces estimations ne signifient pas que cinq basculements sont déjà engagés à un seuil unique.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>Pertes de masse des calottes :</strong> Les estimations satellitaires montrent des pertes nettes au Groenland et en Antarctique; les taux dépendent de la période et de la méthode d'estimation.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>Risque et réchauffement :</strong> Les évaluations scientifiques décrivent des probabilités et des plages d'incertitude; elles ne fixent pas une date unique de basculement.</span>
            </li>
          </ul>
        </div>

        <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-rose-800 font-semibold text-sm mb-3">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            Ce que la science NE DIT PAS (Halte aux fausses suppositions)
          </div>
          <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">•</span>
              <span><strong>PAS d'apocalypse en 24 heures :</strong> Franchir un seuil de bascule ne veut pas dire que la Terre explose le lendemain. La fonte des calottes mettra des siècles ou des millénaires.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">•</span>
              <span><strong>Évolution des risques :</strong> Le franchissement temporaire d'un niveau de réchauffement ne permet pas, à lui seul, de conclure à l'effondrement immédiat d'une calotte; la réponse dépend de l'ampleur et de la durée du réchauffement.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">•</span>
              <span><strong>PAS de "bombe à méthane" instantanée :</strong> Le dégel du pergélisol libère des gaz sur plusieurs siècles, pas sous forme d'une gigantesque explosion subite.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">•</span>
              <span><strong>Incertitudes documentées :</strong> Les seuils estimés de l'AMOC dépendent des études, des méthodes et de la période de référence; aucune date précise de basculement n'est établie par consensus.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* SECTION SPÉCIALE : DATE ESTIMÉE DE FRANCHISSEMENT TOTAL & CONSÉQUENCES */}
      <div className="bg-gradient-to-r from-rose-50 via-purple-50 to-slate-50 border border-rose-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-xl bg-rose-100 border border-rose-300 text-rose-700 shrink-0 mt-0.5">
              <Calendar className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-rose-800 font-bold bg-rose-100 px-2.5 py-0.5 rounded border border-rose-300">
                  Chronologie Critique &amp; Projection
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  Évaluation scientifique CLIMATOPEDY
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Date envisagée pour le franchissement de l'ENSEMBLE des points de bascule
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-2xl leading-relaxed">
                • <strong>Scénario à fortes émissions :</strong> Les dates de franchissement affichées auparavant n'étaient pas des dates établies par les études. Le GIEC présente les risques avec des plages d'incertitude et des niveaux de confiance.
                <br />
                • <strong>Scénarios d'émissions :</strong> Une hausse de température plus faible réduit les risques, mais ne permet pas d'affirmer qu'aucun élément ne franchira son seuil.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2">
            <button
              onClick={() => setIsAllPointsModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <Flame className="w-4 h-4 text-amber-200 animate-pulse" />
              <span>Voir les conséquences si TOUS les points sont franchis</span>
            </button>
            <div className="text-[10px] text-center text-rose-700 font-mono">
              Interactions entre composantes du système climatique
            </div>
          </div>
        </div>
      </div>

      {/* 3. Graphique synthétique de référence (Échelle Thermique / Burning Embers et Matrice de Vitesse) */}
      <TippingPointsChart
        elements={TIPPING_ELEMENTS}
        currentTemp={customTempSlider}
        onTempChange={setCustomTempSlider}
        selectedElementId={activeElementId}
        onSelectElement={setActiveElementId}
      />

      {/* 4. Curseur thermique interactif et diagnostic numérique */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-base">
              <Thermometer className="w-5 h-5 text-rose-600" />
              Réglage précis du réchauffement testé
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Déplacez le curseur pour déplacer la ligne rouge sur le graphique et actualiser les diagnostics ci-dessous.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setCustomTempSlider(1.3)}
              className="px-2.5 py-1 text-xs font-mono rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs cursor-pointer"
            >
              Aujourd'hui (+1,3°C)
            </button>
            <button
              onClick={() => setCustomTempSlider(1.5)}
              className="px-2.5 py-1 text-xs font-mono rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs cursor-pointer"
            >
              Accord Paris (+1,5°C)
            </button>
            <button
              onClick={() => setCustomTempSlider(2.0)}
              className="px-2.5 py-1 text-xs font-mono rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-300 shadow-2xs cursor-pointer"
            >
              Limite haute (+2,0°C)
            </button>
            <button
              onClick={() => setCustomTempSlider(2.7)}
              className="px-2.5 py-1 text-xs font-mono rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs cursor-pointer"
            >
              Tendanciel (+2,7°C)
            </button>
          </div>
        </div>

        {/* Curseur thermique */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500">Élévation de température moyenne globale :</span>
            <span className="text-base font-bold px-2.5 py-0.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 shadow-2xs">
              +{customTempSlider.toFixed(1)}°C
            </span>
          </div>

          <div className="relative py-2">
            <input
              type="range"
              min="0.8"
              max="4.5"
              step="0.1"
              value={customTempSlider}
              onChange={(e) => setCustomTempSlider(parseFloat(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
            {/* Repères visuels */}
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1 px-1">
              <span>+0,8°C (1980)</span>
              <span className="text-sky-700 font-semibold">+1,3°C (Aujourd'hui)</span>
              <span className="text-amber-700 font-semibold">+1,5°C</span>
              <span className="text-orange-700">+2,0°C</span>
              <span className="text-rose-700 font-semibold">+3,0°C</span>
              <span>+4,5°C</span>
            </div>
          </div>
        </div>

        {/* Synthèse immédiate du nombre de points touchés */}
        {(() => {
          const safeCount = TIPPING_ELEMENTS.filter(e => customTempSlider < e.thresholdMin).length;
          const uncertainCount = TIPPING_ELEMENTS.filter(e => customTempSlider >= e.thresholdMin && customTempSlider < e.thresholdEst).length;
          const tippedCount = TIPPING_ELEMENTS.filter(e => customTempSlider >= e.thresholdEst).length;

          return (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4 pt-3 border-t border-slate-200">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-center justify-between shadow-2xs">
                <span className="text-xs text-emerald-800 font-medium">Hors zone de risque</span>
                <span className="text-sm font-bold font-mono text-emerald-800">{safeCount} / {TIPPING_ELEMENTS.length}</span>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex items-center justify-between shadow-2xs">
                <span className="text-xs text-amber-900 font-medium">Dans la zone d'incertitude</span>
                <span className="text-sm font-bold font-mono text-amber-900">{uncertainCount} / {TIPPING_ELEMENTS.length}</span>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 flex items-center justify-between shadow-2xs">
                <span className="text-xs text-rose-800 font-medium">Seuil central franchi</span>
                <span className="text-sm font-bold font-mono text-rose-800">{tippedCount} / {TIPPING_ELEMENTS.length}</span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* 4. Explorateur détaillé des 9 Éléments de Bascule Majeurs */}
      <div className="flex flex-col gap-4">
        {/* Barre de filtres par catégorie */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-600" />
              État des Lieux des 9 Points de Bascule Majeurs
            </h2>
            <p className="text-xs text-slate-600">
              Sélectionnez un élément pour consulter ses mesures concrètes et ses conséquences pratiques.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-lg self-start sm:self-auto text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                selectedCategory === 'all' ? 'bg-white text-slate-800 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Tous ({TIPPING_ELEMENTS.length})
            </button>
            <button
              onClick={() => setSelectedCategory('cryosphere')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                selectedCategory === 'cryosphere' ? 'bg-sky-100 text-sky-800 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Snowflake className="w-3 h-3 text-sky-600" />
              Glaces & Pôles
            </button>
            <button
              onClick={() => setSelectedCategory('biosphere')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                selectedCategory === 'biosphere' ? 'bg-emerald-100 text-emerald-800 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <TreePine className="w-3 h-3 text-emerald-600" />
              Forêts & Vivant
            </button>
            <button
              onClick={() => setSelectedCategory('ocean_atmosphere')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                selectedCategory === 'ocean_atmosphere' ? 'bg-indigo-100 text-indigo-800 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Waves className="w-3 h-3 text-indigo-600" />
              Océans & Climat
            </button>
          </div>
        </div>

        {/* Disposition 2 colonnes : Liste cliquable à gauche, Fiche détaillée à droite */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Colonne gauche (liste compacte) */}
          <div className="lg:col-span-5 flex flex-col gap-2.5">
            {filteredElements.map((elem) => {
              const status = getRiskStatusAtTemp(elem, customTempSlider);
              const isSelected = elem.id === activeElementId;
              const visualMeta = VISUAL_METADATA[elem.id];

              return (
                <button
                  key={elem.id}
                  onClick={() => setActiveElementId(elem.id)}
                  className={`text-left p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex gap-3 items-center group ${
                    isSelected
                      ? 'bg-sky-50/80 border-sky-400 shadow-sm ring-2 ring-sky-300'
                      : 'bg-white hover:bg-slate-50 border-slate-200 shadow-2xs'
                  }`}
                >
                  {/* Miniature visuelle de l'élément de bascule */}
                  <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-slate-200 relative bg-slate-100 shadow-2xs">
                    {visualMeta?.realPhotoUrl ? (
                      <img
                        src={visualMeta.realPhotoUrl}
                        alt={elem.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                        <Camera className="w-5 h-5" />
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute inset-0 ring-2 ring-inset ring-sky-500 rounded-lg pointer-events-none" />
                    )}
                  </div>

                  {/* Détails textuels */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-800 line-clamp-1">{elem.name}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap shrink-0 ${status.badgeClass}`}>
                        {elem.thresholdEst.toFixed(1)}°C
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600 gap-1">
                      <span className="flex items-center gap-1 truncate">
                        {elem.category === 'cryosphere' && <Snowflake className="w-3 h-3 text-sky-600 shrink-0" />}
                        {elem.category === 'biosphere' && <TreePine className="w-3 h-3 text-emerald-600 shrink-0" />}
                        {elem.category === 'ocean_atmosphere' && <Waves className="w-3 h-3 text-indigo-600 shrink-0" />}
                        <span className="truncate">{elem.categoryLabel}</span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 shrink-0">
                        {elem.thresholdMin}°C – {elem.thresholdMax}°C
                      </span>
                    </div>

                    {/* Statut dynamique sous le thermomètre sélectionné */}
                    <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center gap-1.5 text-[10px]">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${status.dotClass}`} />
                      <span className={`truncate ${status.level === 'tipped' ? 'text-rose-700 font-semibold' : status.level === 'uncertain' ? 'text-amber-800' : 'text-emerald-700'}`}>
                        À +{customTempSlider.toFixed(1)}°C : {status.label}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Colonne droite (fiche complète pour l'élément actif) */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs sticky top-20">
              {/* En-tête de fiche */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider block mb-1">
                    {activeElement.categoryLabel} · {activeElement.location}
                  </span>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                    {activeElement.name}
                  </h3>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Seuil central estimé</div>
                  <div className="text-xl font-black font-mono text-rose-600">
                    +{activeElement.thresholdEst.toFixed(1)}°C
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    Fourchette : [{activeElement.thresholdMin}°C à {activeElement.thresholdMax}°C]
                  </div>
                </div>
              </div>

              {/* Visualisation satellitaire haute fidélité simulée du lieu */}
              <div className="my-4">
                <TippingPointVisualCard
                  elementId={activeElement.id}
                  elementName={activeElement.name}
                  isTipped={getRiskStatusAtTemp(activeElement, customTempSlider).level === 'tipped'}
                  isUncertain={getRiskStatusAtTemp(activeElement, customTempSlider).level === 'uncertain'}
                />
              </div>

              {/* Statut au réchauffement simulé */}
              {(() => {
                const currentStatus = getRiskStatusAtTemp(activeElement, customTempSlider);
                return (
                  <div className={`my-4 p-3 rounded-xl border flex items-center justify-between text-xs ${currentStatus.badgeClass}`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${currentStatus.dotClass}`} />
                      <span className="font-semibold">Diagnostic au réchauffement actuel (+{customTempSlider.toFixed(1)}°C) :</span>
                    </div>
                    <span className="font-bold">{currentStatus.label}</span>
                  </div>
                );
              })()}

              {/* Bouton Fiche Débutant Accessible & Date Prévisionnelle */}
              <div className="my-4 p-3.5 rounded-xl bg-gradient-to-r from-sky-50 to-slate-50 border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-sky-800 font-semibold text-xs">
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    <span>Date indicative calculée dans le scénario CLIMATOPEDY :</span>
                  </div>
                  <div className="font-mono text-xs text-slate-800 font-bold mt-0.5">
                    {activeElement.estimatedYearTendency}
                  </div>
                </div>

                <button
                  onClick={() => setModalElement(activeElement)}
                  className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Fiche descriptive pour débutant</span>
                </button>
              </div>

              {/* Explication vulgarisée */}
              <div className="mb-5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                  De quoi s'agit-il simplement ?
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {activeElement.summarySimple}
                </p>
              </div>

              {/* Faits scientifiques mesurés aujourd'hui (SANS SUPPOSITION) */}
              <div className="mb-5">
                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-600" />
                  Ce qui est MESURÉ aujourd'hui par les instruments (Faits réels)
                </h4>
                <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-900 leading-relaxed font-mono">
                  {activeElement.observedFactToday}
                </div>
              </div>

              {/* Conséquences concrètes pour les humains */}
              <div className="mb-5">
                <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Ce que ça change concrètement pour nos vies
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-rose-50/60 border border-rose-200 p-3.5 rounded-xl">
                  {activeElement.consequencePlain}
                </p>
              </div>

              {/* Temps de réaction et irréversibilité */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 text-xs">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <div className="flex items-center gap-1 text-slate-600 mb-1 font-mono text-[11px]">
                    <Clock className="w-3 h-3 text-sky-600" />
                    Temps de basculement complet
                  </div>
                  <div className="font-semibold text-slate-800 font-mono">
                    {activeElement.timescaleYears}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <div className="text-slate-600 mb-1 font-mono text-[11px]">
                    Mécanisme d'auto-entretien
                  </div>
                  <div className="text-slate-700 text-[11px] leading-snug">
                    {activeElement.irreversibilityNotes}
                  </div>
                </div>
              </div>

              {/* Source scientifique exacte */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Source : {activeElement.scientificSource}</span>
                <span className="text-sky-700 font-medium">Données vérifiées</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Tableau récapitulatif comparatif (Tous les éléments d'un coup d'œil) */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Synthèse comparative des 9 points de bascule (Armstrong McKay et al. Science 2022)
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-slate-500">Classés par seuil croissant</span>
            <button
              onClick={() => setIsAllPointsModalOpen(true)}
              className="px-2.5 py-1 rounded bg-rose-50 border border-rose-300 hover:bg-rose-100 text-rose-800 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
            >
              <Flame className="w-3 h-3 text-rose-600" />
              <span>Conséquences si TOUS franchis</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] table-fixed text-left text-xs border-collapse">
            <colgroup>
              <col className="w-[14%]" />
              <col className="w-[10%]" />
              <col className="w-[8%]" />
              <col className="w-[9%]" />
              <col className="w-[16%]" />
              <col className="w-[11%]" />
              <col className="w-[24%]" />
              <col className="w-[8%]" />
            </colgroup>
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px] uppercase tracking-wider font-mono">
                <th className="py-2.5 px-2">Élément de bascule</th>
                <th className="py-2.5 px-2">Catégorie</th>
                <th className="py-2.5 px-2">Seuil estimé</th>
                <th className="py-2.5 px-2">Fourchette</th>
                <th className="py-2.5 px-2">Date établie par les sources</th>
                <th className="py-2.5 px-2">Temps de bascule</th>
                <th className="py-2.5 px-2">Impact majeur mesurable</th>
                <th className="py-2.5 px-2 text-center">Fiche pour débutant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {TIPPING_ELEMENTS.map((elem) => (
                <tr
                  key={elem.id}
                  onClick={() => setActiveElementId(elem.id)}
                  className={`hover:bg-slate-50/70 cursor-pointer transition-colors ${
                    elem.id === activeElementId ? 'bg-sky-50/60 font-medium' : ''
                  }`}
                >
                  <td className="py-3 px-2 font-semibold text-slate-800">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        elem.thresholdEst <= 1.5 ? 'bg-rose-500' : elem.thresholdEst <= 2.0 ? 'bg-amber-500' : 'bg-indigo-500'
                      }`} />
                      <span>{elem.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-slate-600">{elem.categoryLabel}</td>
                  <td className="py-3 px-2 font-mono font-bold text-rose-700 whitespace-nowrap">+{elem.thresholdEst.toFixed(1)}°C</td>
                  <td className="py-3 px-2 font-mono text-slate-500 text-[11px]">
                    {elem.thresholdMin}°C – {elem.thresholdMax}°C
                  </td>
                  <td className="py-3 px-2 font-mono text-amber-800 font-semibold text-xs leading-relaxed break-words">
                    {elem.estimatedYearTendency.split('(')[0].trim()}
                  </td>
                  <td className="py-3 px-2 font-mono text-slate-700 leading-relaxed break-words">{elem.timescaleYears}</td>
                  <td className="py-3 px-2 text-slate-700 text-xs leading-relaxed">
                    <div className="text-slate-700 font-normal">
                      {elem.consequencePlain}
                    </div>
                    <div className="mt-2 text-[11px] text-amber-900 font-medium bg-amber-50 p-2.5 rounded-lg border border-amber-200 leading-relaxed">
                      💡 <strong>Dans votre assiette &amp; votre ville :</strong> {elem.concreteImpactEveryday}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalElement(elem);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-sky-50 border border-slate-300 hover:border-sky-300 text-sky-700 text-[11px] font-medium transition-colors cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                      title="Ouvrir la fiche descriptive pour débutant"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Fiche simple</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Conclusion et message d'action factuelle */}
      <div className="bg-gradient-to-r from-sky-50/60 via-slate-50 to-sky-50/60 border border-sky-200 rounded-xl p-5 sm:p-6 text-xs text-slate-700 leading-relaxed shadow-xs">
        <div className="flex items-center gap-2 text-sky-800 font-bold text-sm mb-2">
          <Info className="w-4 h-4 text-sky-600" />
          La conclusion des climatologues : Pas de fatalisme, mais une urgence physique
        </div>
        <p className="mb-2">
          Les seuils sont des estimations incertaines issues de la littérature citée. Les dates affichées dans cette interface sont propres au scénario CLIMATOPEDY; elles ne sont pas des dates de franchissement établies par le GIEC ou par ces études.
        </p>
        <p className="text-slate-500">
          Sources de référence : <em>Global Tipping Points Report 2023 (Université d'Exeter, COP28)</em> ; <em>Armstrong McKay et al., Science (2022)</em> ; <em>IPCC 6e Rapport d'Évaluation (Groupes I et II, 2021-2023)</em>.
        </p>
      </div>

      {/* Modale Fiche descriptive pour débutant sans compétences */}
      <TippingPointModal
        element={modalElement}
        isOpen={!!modalElement}
        onClose={() => setModalElement(null)}
        currentSimulatedTemp={customTempSlider}
      />

      {/* Modale Conséquences si TOUS les points de bascule sont franchis */}
      <AllTippingPointsConsequencesModal
        isOpen={isAllPointsModalOpen}
        onClose={() => setIsAllPointsModalOpen(false)}
        currentSimulatedTemp={customTempSlider}
      />
    </div>
  );
};
