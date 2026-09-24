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
    summarySimple: 'Un dôme de glace géant de 3 km d\'épaisseur. S\'il fond, la surface de la glace descend vers des altitudes plus basses où l\'air est plus chaud, ce qui accélère la fonte tout seul, même si on ne réchauffe plus l\'atmosphère.',
    thresholdEst: 1.5,
    thresholdMin: 0.8,
    thresholdMax: 3.0,
    timescaleYears: '1 000 à 10 000 ans',
    observedFactToday: 'Mesures satellites NASA (GRACE) : le Groenland perd actuellement ~270 milliards de tonnes de glace par an. Il a déjà perdu plus de 5 000 milliards de tonnes depuis 1992.',
    consequencePlain: 'Si toute la calotte fondait : +7,2 mètres de montée mondiale des océans. À notre échelle humaine, chaque siècle de fonte ajoute des dizaines de centimètres, inondant les ports et les côtes.',
    irreversibilityNotes: 'Une fois que la calotte a perdu de l\'altitude, il faudrait faire redescendre la température mondiale bien en-dessous du climat d\'aujourd\'hui pour qu\'elle se reconstitue.',
    scientificSource: 'Armstrong McKay et al., Science 2022 ; GIEC AR6 WG1 Chapitre 9 ; NASA GRACE.',
    statusToday: 'at_risk',
    estimatedYearTendency: '2030 – 2038 (Seuil bas déjà pénétré dès +1,3°C)',
    whatIsItSimple: 'Un immense bouclier de glace de 3 km d\'épaisseur posé sur une île. S\'il s\'affaisse, son sommet descend dans de l\'air plus chaud, ce qui accélère la fonte automatiquement sans qu\'on puisse l\'arrêter.',
    whyPointOfNoReturn: 'Une fois que la calotte perd de la hauteur, elle baigne en permanence dans de l\'air plus tiède et la glace sombre absorbe plus de rayons solaires. Même si les humains arrêtaient toutes leurs émissions, la fonte continuerait d\'elle-même.',
    concreteImpactEveryday: 'Submersion progressive des digues et des quais de commerce maritime. Érosion violente des plages et inondations à répétition dans les villes côtières lors des grandes marées d\'hiver.'
  },
  {
    id: 'wais',
    name: 'Calotte de l\'Antarctique de l\'Ouest (WAIS)',
    category: 'cryosphere',
    categoryLabel: 'Glaces & Pôles',
    location: 'Pôle Sud (Glaciers Thwaites et Pine Island)',
    summarySimple: 'Cette glace ne repose pas sur de la terre ferme mais dans une cuvette sous le niveau de la mer. L\'eau tiède de l\'océan ronge la base du glacier par en-dessous, le faisant glisser vers la mer comme un bouchon qui saute.',
    thresholdEst: 1.5,
    thresholdMin: 1.0,
    thresholdMax: 3.0,
    timescaleYears: '500 à 2 000 ans',
    observedFactToday: 'La ligne de contact sous-marine du glacier Thwaites (le "glacier de l\'apocalypse") recule de près d\'1 km par an. La région perd ~150 milliards de tonnes de glace par an.',
    consequencePlain: '+3,3 mètres de hausse mondiale des mers si elle s\'effondre totalement. Cela submergerait des quartiers entiers à New York, Tokyo, Calcutta, Alexandrie et Bordeaux.',
    irreversibilityNotes: 'La pente du socle rocheux descend vers l\'intérieur : plus la glace recule, plus la paroi exposée à l\'océan devient haute et instable (instabilité marine des calottes glaciaires).',
    scientificSource: 'Joughin et al., Science 2014 ; Rignot et al., GRL 2014 ; GIEC SROCC.',
    statusToday: 'at_risk',
    estimatedYearTendency: '2030 – 2040',
    whatIsItSimple: 'Une gigantesque masse de glace qui repose dans une cuvette sous le niveau de l\'océan. Des courants marins tièdes s\'infiltrent par en-dessous et rongent la base des glaciers géants (comme Thwaites).',
    whyPointOfNoReturn: 'Le socle rocheux descend en pente vers l\'intérieur : plus la glace recule, plus le front de glace exposé à l\'eau tiède est épais et fragile. C\'est un effet domino mécanique inexorable.',
    concreteImpactEveryday: '+3,3 mètres d\'eau en plus sur les côtes du monde entier. Des centaines de millions d\'habitants côtiers forcés de fuir et perte irréversible de millions d\'hectares de terres agricoles littorales.'
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
    observedFactToday: 'En avril 2024, la NOAA a confirmé le 4e épisode mondial de blanchissement de masse de l\'histoire. Plus de 54% des zones de récifs de 53 pays ont subi un stress thermique létal en 2023-2024.',
    consequencePlain: 'Les récifs abritent 25% de la vie marine mondiale et nourrissent 500 millions d\'humains (pêche côtière et protection contre les vagues de tempête). À +1,5°C, 70 à 90% des récifs disparaissent ; à +2,0°C, plus de 99%.',
    irreversibilityNotes: 'Un récif met 10 à 15 ans à se régénérer après un blanchissement. Si les vagues de chaleur marine reviennent chaque été, ils n\'ont plus le temps physique de survivre.',
    scientificSource: 'IPCC Spécial 1.5°C (2018) ; NOAA Coral Reef Watch (2024) ; Hughes et al., Nature 2017.',
    statusToday: 'tipping',
    estimatedYearTendency: '2026 – 2032 (En cours de franchissement !)',
    whatIsItSimple: 'Des animaux marins minuscules bâtisseurs de récifs qui vivent grâce à une algue microscopique colorée. Dès que la mer chauffe de +1°C en été, le corail panique, rejette l\'algue, devient blanc comme de la craie et meurt de faim.',
    whyPointOfNoReturn: 'Il faut au minimum 10 ans à un récif pour repousser. Si la canicule sous-marine revient chaque année, les jeunes coraux meurent avant de grandir : c\'est l\'extinction définitive du milieu.',
    concreteImpactEveryday: 'Dans votre assiette : effondrement de la pêche et raréfaction du poisson pour 500 millions d\'habitants. Sur les plages : disparition du brise-lames naturel qui absorbe l\'énergie des tempêtes tropicales.'
  },
  {
    id: 'permafrost',
    name: 'Dégel brutal du pergélisol (Permafrost)',
    category: 'cryosphere',
    categoryLabel: 'Glaces & Pôles',
    location: 'Sibérie, Alaska, Nord du Canada',
    summarySimple: 'Des sols gelés depuis des dizaines de milliers d\'années qui retiennent d\'immenses quantités de restes de plantes et d\'animaux préhistoriques. En dégelant, ces matières pourrissent et libèrent du CO2 et du méthane (un gaz à effet de serre très puissant).',
    thresholdEst: 1.5,
    thresholdMin: 1.0,
    thresholdMax: 2.3,
    timescaleYears: '100 à 300 ans',
    observedFactToday: 'Réseau GTN-P : la température des sols arctiques à 10-20 m de profondeur s\'est réchauffée de +0,3°C à +0,6°C par décennie. Des cratères d\'effondrement (thermokarst) et des fuites de méthane sont observés en Sibérie.',
    consequencePlain: 'Le pergélisol contient environ 1 500 milliards de tonnes de carbone (deux fois plus que toute l\'atmosphère). Son dégel agit comme un pays pollueur invisible supplémentaire qui annule nos efforts de réduction d\'émissions.',
    irreversibilityNotes: 'Une fois dégelée, la matière organique ne peut pas "se recongeler" magiquement : la décomposition bactérienne s\'auto-alimente en produisant de la chaleur.',
    scientificSource: 'Turetsky et al., Nature Geoscience 2020 ; Schuur et al., Nature 2015 ; GIEC AR6 Chapitre 5.',
    statusToday: 'at_risk',
    estimatedYearTendency: '2030 – 2040',
    whatIsItSimple: 'Un congélateur géant sous terre en Sibérie et au Canada qui conserve depuis l\'âge de glace des débris de mammouths et de végétaux. En dégelant, tout se met à pourrir et relâche d\'immenses quantités de méthane et CO2.',
    whyPointOfNoReturn: 'La décomposition produit sa propre chaleur sous la terre (comme un tas de compost). Même avec des hivers glaciaires en surface, la chaleur souterraine continue de faire fondre le reste.',
    concreteImpactEveryday: 'Le dégel agit comme une usine géante à effet de serre incontrôlable qui annule tous nos efforts humains de sobriété, accélérant la fréquence des canicules et des sécheresses sur nos cultures.'
  },
  {
    id: 'barents_ice',
    name: 'Banquise d\'été en Mer de Barents',
    category: 'cryosphere',
    categoryLabel: 'Glaces & Pôles',
    location: 'Arctique boréal (au nord de la Norvège et Russie)',
    summarySimple: 'La glace blanche reflète 80% des rayons du soleil vers l\'espace (effet miroir). Quand elle fond, l\'océan sombre absorbe 90% de la chaleur du soleil, réchauffant l\'eau et empêchant la glace de se reformer l\'hiver suivant.',
    thresholdEst: 1.6,
    thresholdMin: 1.5,
    thresholdMax: 1.7,
    timescaleYears: '20 à 30 ans',
    observedFactToday: 'L\'Arctique se réchauffe près de 4 fois plus vite que le reste de la planète (amplification arctique mesurée par le FMI et la NASA). La banquise d\'été a perdu 50% de sa surface et 75% de son volume depuis 1979.',
    consequencePlain: 'Déstabilisation du courant-jet (Jet Stream) atmosphérique, provoquant des "dômes de chaleur" bloqués pendant des semaines en Europe ou des vagues de froid polaire descendant anormalement au sud.',
    irreversibilityNotes: 'L\'effet albédo fonctionne dans les deux sens : une fois l\'eau devenue sombre et tiède, il faut un froid extrême pour réamorcer la banquise.',
    scientificSource: 'Rantanen et al., Communications Earth & Environment 2022 ; Screen & Simmonds 2010.',
    statusToday: 'at_risk',
    estimatedYearTendency: '2032 – 2042',
    whatIsItSimple: 'La glace blanche au pôle Nord agit comme un miroir pare-soleil. Dès qu\'elle disparaît en été, l\'océan bleu foncé absorbe 90% des rayons solaires, stockant la chaleur comme un radiateur géant.',
    whyPointOfNoReturn: 'L\'océan sombre emmagasine tellement de chaleur estivale qu\'il reste tiède jusqu\'en hiver, empêchant la banquise de se reformer. Le miroir protecteur de la planète est cassé.',
    concreteImpactEveryday: 'Blocage météo persistant : des dômes de canicule restent coincés pendant 4 semaines au-dessus de la France ou de l\'Espagne, grillant les récoltes, ou des pluies diluviennes inondent sans discontinuer.'
  },
  {
    id: 'amazon',
    name: 'Dépérissement de la forêt tropicale amazonienne',
    category: 'biosphere',
    categoryLabel: 'Écosystèmes vivants',
    location: 'Bassin d\'Amérique du Sud (Brésil, Pérou, Colombie...)',
    summarySimple: 'La forêt amazonienne fabrique sa propre pluie : chaque arbre pompe de l\'eau dans le sol et la transpire dans l\'air, créant des nuages qui arrosent les arbres plus à l\'ouest ("fleuves volants"). Si la forêt rétrécit trop, la pluie s\'arrête et la forêt sèche se transforme en savane.',
    thresholdEst: 3.5,
    thresholdMin: 2.0,
    thresholdMax: 6.0,
    timescaleYears: '50 à 100 ans',
    observedFactToday: '17% de l\'Amazonie a été déboisée par l\'Homme. Étude majeure Nature (Gatti et al. 2021) : la partie sud-est de l\'Amazonie est déjà devenue émettrice nette de CO2 (elle recrache plus de carbone qu\'elle n\'en absorbe lors des sécheresses).',
    consequencePlain: 'Relâchement d\'environ 150 à 200 milliards de tonnes de CO2 dans l\'air, chute dramatique des pluies nécessaires à l\'agriculture en Amérique du Sud et effondrement de la plus grande réserve de biodiversité terrestre.',
    irreversibilityNotes: 'Le seuil combiné dépend de deux facteurs : le réchauffement climatique ET le déboisement direct. Selon Carlos Nobre et Thomas Lovejoy, un déboisement de 20-25% suffirait à amorcer la savanisation.',
    scientificSource: 'Nobre et al., Science Advances 2016 ; Gatti et al., Nature 2021 ; Lovejoy & Nobre 2018.',
    statusToday: 'at_risk',
    estimatedYearTendency: '2060 – 2075',
    whatIsItSimple: 'La forêt amazonienne est une pompe à pluie : les arbres boivent l\'eau du sol et la transpirent pour créer des nuages qui arrosent les arbres voisins. Si on coupe trop d\'arbres, la pompe cale et la forêt sèche se transforme en savane herbeuse.',
    whyPointOfNoReturn: 'Moins d\'arbres = moins de nuages = sécheresse accrue = méga-feux spontanés. La forêt ne peut plus jamais repousser dans un climat devenu trop aride.',
    concreteImpactEveryday: 'Flambée des cours du café, du chocolat et du soja. Relâchement de 200 milliards de tonnes de CO2 dans l\'air (5 années entières de toute la pollution humaine), provoquant un bond thermique brutal.'
  },
  {
    id: 'amoc',
    name: 'Circulation méridienne atlantique (AMOC / Gulf Stream)',
    category: 'ocean_atmosphere',
    categoryLabel: 'Courants & Climat',
    location: 'Océan Atlantique Nord',
    summarySimple: 'Un immense tapis roulant océanique : l\'eau chaude des tropiques remonte vers l\'Europe en surface, se refroidit près du Groenland, devient très salée et lourde, puis plonge au fond de l\'océan pour repartir vers le sud. Si trop d\'eau douce de fonte glaciaire s\'y déverse, l\'eau devient trop légère et ne plonge plus : le tapis roulant cale.',
    thresholdEst: 4.0,
    thresholdMin: 1.4,
    thresholdMax: 8.0,
    timescaleYears: '50 à 200 ans',
    observedFactToday: 'Réseau de capteurs océanographiques RAPID : l\'AMOC a ralenti d\'environ 15% depuis les années 1950. C\'est son niveau le plus faible depuis au moins 1 000 ans.',
    consequencePlain: 'Un arrêt complet de l\'AMOC refroidirait brutalement le nord-ouest de l\'Europe de 3 à 8°C (hivers très rigoureux, tempêtes violentes), tout en surchauffant les tropiques et en déplaçant les moussons d\'Afrique et d\'Inde (menaçant les récoltes de milliards de personnes).',
    irreversibilityNotes: 'La plongée de l\'eau salée est un phénomène à seuil : une fois interrompu, il faut des décennies d\'eau très salée et froide pour relancer le moteur.',
    scientificSource: 'Caesar et al., Nature 2018 ; Ditlevsen & Ditlevsen, Nature Comm. 2023 ; GIEC AR6 WG1.',
    statusToday: 'at_risk',
    estimatedYearTendency: '2080 – 2100 (ou avant selon signaux précurseurs)',
    whatIsItSimple: 'Un gigantesque tapis roulant sous-marin : l\'eau tiède des Antilles monte vers l\'Europe, se refroidit près du Groenland, devient dense et salée, puis plonge au fond des abysses. Si trop d\'eau douce de fonte glaciaire s\'y déverse, l\'eau trop légère flotte et le tapis roulant cale net.',
    whyPointOfNoReturn: 'Pour relancer ce courant océanique planétaire, il faudrait pomper des milliards de tonnes d\'eau douce hors de l\'Atlantique Nord et refroidir tout le pôle : impossible pour l\'Humanité.',
    concreteImpactEveryday: 'Refroidissement paradoxal et violent en Europe (-5°C en hiver avec tempêtes destructrices), tandis que le sud suffoque. Effondrement de la mousson indienne et sahélienne : famines pour 2 milliards de paysans.'
  },
  {
    id: 'boreal_forest',
    name: 'Dépérissement des forêts boréales (Taïga)',
    category: 'biosphere',
    categoryLabel: 'Écosystèmes vivants',
    location: 'Canada, Scandinavie, Russie',
    summarySimple: 'L\'immense ceinture de conifères du nord souffre de la chaleur estivale, des attaques d\'insectes ravageurs qui ne meurent plus l\'hiver et de méga-feux de forêts gigantesques.',
    thresholdEst: 4.0,
    thresholdMin: 1.5,
    thresholdMax: 5.0,
    timescaleYears: '50 à 100 ans',
    observedFactToday: 'Au Canada, la saison des feux 2023 a brûlé plus de 18 millions d\'hectares (un record absolu, plus de 6 fois la moyenne historique), émettant plus de 2 milliards de tonnes de CO2.',
    consequencePlain: 'Transformation d\'un des plus grands puits de carbone de la planète en source d\'émissions incontrôlable. La fumée dégrade la qualité de l\'air à des milliers de kilomètres.',
    irreversibilityNotes: 'La disparition des conifères au profit de prairies ou d\'arbustes modifie durablement le sol et le cycle de l\'eau boréal.',
    scientificSource: 'Walker et al., Nature Communications 2019 ; Zheng et al., Science 2023.',
    statusToday: 'safe',
    estimatedYearTendency: '2085 – 2100',
    whatIsItSimple: 'L\'immense mer d\'arbres résineux qui encercle le Canada, la Suède et la Russie. Elle est décimée par des coléoptères qui ne meurent plus pendant les hivers trop doux et par des incendies géants inextinguibles.',
    whyPointOfNoReturn: 'Les graines de conifères ont besoin d\'hivers très froids et de sols humides. Une fois le sol calciné et séché, seuls des buissons et herbes sèches repoussent.',
    concreteImpactEveryday: 'Pénurie mondiale de bois et de pâte à papier. Fumées toxiques récurrentes envahissant les capitales sur des milliers de kilomètres, obligeant des millions de personnes à se calfeutrer.'
  },
  {
    id: 'wilkes_basin',
    name: 'Bassin sous-glaciaire de Wilkes (Antarctique Est)',
    category: 'cryosphere',
    categoryLabel: 'Glaces & Pôles',
    location: 'Antarctique Oriental',
    summarySimple: 'Longtemps jugée inébranlable, cette portion de l\'Antarctique oriental repose elle aussi sur un socle rocheux situé sous le niveau de la mer, retenue par un "verrou" de glace côtier.',
    thresholdEst: 3.0,
    thresholdMin: 2.0,
    thresholdMax: 6.0,
    timescaleYears: '2 000 à 10 000 ans',
    observedFactToday: 'Certains secteurs côtiers (glacier Totten) montrent des signes d\'accélération de l\'amincissement sous l\'effet d\'eaux profondes tièdes.',
    consequencePlain: 'Contient l\'équivalent de +3 à +4 mètres de montée mondiale des océans. Une fois le verrou côtier brisé, la vidange du bassin devient inexorable.',
    irreversibilityNotes: 'La topographie sous-marine en cuvette empêche la glace de s\'arrêter de glisser une fois le mouvement enclenché.',
    scientificSource: 'Mengel & Levermann, Nature Climate Change 2014 ; Rignot et al., PNAS 2019.',
    statusToday: 'safe',
    estimatedYearTendency: '2055 – 2070',
    whatIsItSimple: 'Une colossale calotte de glace posée au fond d\'une cuvette sous-marine en Antarctique oriental, retenue par un petit verrou de glace côtier (comme un barrage naturel).',
    whyPointOfNoReturn: 'Dès que le bouchon côtier de glace fond au contact d\'eaux profondes tièdes, la cuvette se vide mécaniquement dans l\'océan sans obstacle pour l\'enrayer.',
    concreteImpactEveryday: '+3 à +4 mètres supplémentaires d\'élévation du niveau moyen de la mer. Submersion permanente des deltas nourriciers mondiaux (Nil, Mékong, Pô, Mississippi).'
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
                Vous vous balancez sur deux pieds : tant que l'angle reste raisonnable, vous revenez en avant. Mais passé un angle critique, la chute devient inévitable sans qu'on ait besoin de vous pousser.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-2xs">
              <div className="flex items-center gap-2 text-amber-800 font-semibold text-xs mb-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-[11px] font-bold text-amber-900">2</span>
                L'analogie du gros glaçon
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                Sortir un bloc de glace de 100 kg d'un congélateur à -15°C et le poser dans une pièce à +20°C enclenche sa fonte certaine. Pourtant, il mettra des heures à fondre. Pour les calottes, cela prendra des siècles.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-2xs">
              <div className="flex items-center gap-2 text-rose-800 font-semibold text-xs mb-1.5">
                <span className="w-5 h-5 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center text-[11px] font-bold text-rose-800">3</span>
                L'effet domino (cascade)
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                La fonte de la glace arctique déverse de l'eau douce qui ralentit le courant atlantique (AMOC), qui à son tour déplace les moussons tropicales et assèche la forêt amazonienne.
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
              <span><strong>+1,3°C déjà atteint :</strong> La température moyenne mondiale observée a dépassé +1,28°C au-dessus de l'ère préindustrielle (Copernicus / OMM).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>5 points de bascule sont déjà dans la zone de danger</strong> dès +1,5°C : Groenland, Antarctique Ouest, coraux tropicaux, pergélisol, mer de Barents.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>Perte nette continue de glace :</strong> Le Groenland perd 270 Gt/an et l'Antarctique 150 Gt/an mesurés au millimètre près par gravimétrie satellite.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>Chaque dixième compte :</strong> Il n'y a pas de "falaise magique" où tout bascule d'un coup. Chaque fraction de degré évitée réduit les risques d'activation en chaîne.</span>
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
              <span><strong>PAS de fatalisme « tout est déjà foutu » :</strong> Dépasser temporairement +1,5°C pendant quelques années ne détruit pas instantanément le Groenland si la température redescend rapidement.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">•</span>
              <span><strong>PAS de "bombe à méthane" instantanée :</strong> Le dégel du pergélisol libère des gaz sur plusieurs siècles, pas sous forme d'une gigantesque explosion subite.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">•</span>
              <span><strong>Incertitudes documentées :</strong> La science donne des fourchettes (ex : AMOC entre +1,4°C et +8°C). Les chercheurs ne prétendent pas connaître le jour exact du basculement.</span>
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
                • <strong>Scénario Fossile sans rupture :</strong> Les 5 premiers points cèdent dès <span className="text-amber-800 font-bold">2030 – 2038 (+1,5°C)</span>, et l'ensemble des 9 points (AMOC et forêts boréales) est franchi vers <span className="text-rose-700 font-bold">2085 – 2100 (+4,0°C)</span>.
                <br />
                • <strong>Scénario Sobriété (Accord de Paris) :</strong> Stabilisation sous +1,8°C = l'ensemble des points n'est <span className="text-emerald-700 font-bold">JAMAIS franchi</span>.
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
              Effondrement en chaîne (Hothouse Earth)
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
                    <span>Date estimée de franchissement (trajectoire actuelle) :</span>
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
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px] uppercase tracking-wider font-mono">
                <th className="py-3.5 px-4 min-w-[200px]">Élément de bascule</th>
                <th className="py-3.5 px-3 whitespace-nowrap">Catégorie</th>
                <th className="py-3.5 px-3 whitespace-nowrap">Seuil estimé</th>
                <th className="py-3.5 px-3 whitespace-nowrap">Fourchette</th>
                <th className="py-3.5 px-3 whitespace-nowrap">Date prévisionnelle</th>
                <th className="py-3.5 px-3 whitespace-nowrap">Temps de bascule</th>
                <th className="py-3.5 px-4 min-w-[360px]">Impact majeur mesurable</th>
                <th className="py-3.5 px-3 text-center whitespace-nowrap">Fiche pour débutant</th>
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
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        elem.thresholdEst <= 1.5 ? 'bg-rose-500' : elem.thresholdEst <= 2.0 ? 'bg-amber-500' : 'bg-indigo-500'
                      }`} />
                      <span>{elem.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">{elem.categoryLabel}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-rose-700 whitespace-nowrap">+{elem.thresholdEst.toFixed(1)}°C</td>
                  <td className="py-3.5 px-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">{elem.thresholdMin}°C – {elem.thresholdMax}°C</td>
                  <td className="py-3.5 px-3 font-mono text-amber-800 font-semibold text-xs whitespace-nowrap">
                    {elem.estimatedYearTendency.split('(')[0].trim()}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-700 whitespace-nowrap">{elem.timescaleYears}</td>
                  <td className="py-3.5 px-4 text-slate-700 text-xs leading-relaxed whitespace-normal min-w-[360px]">
                    <div className="text-slate-700 font-normal">
                      {elem.consequencePlain}
                    </div>
                    <div className="mt-2 text-[11px] text-amber-900 font-medium bg-amber-50 p-2.5 rounded-lg border border-amber-200 leading-relaxed">
                      💡 <strong>Dans votre assiette &amp; votre ville :</strong> {elem.concreteImpactEveryday}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
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
          Les points de bascule ne doivent pas être vus comme un interrupteur binaire « tout va bien / tout est perdu ».
          Chaque dixième de degré évité (+1,4°C plutôt que +1,5°C ; +1,7°C plutôt que +1,8°C) diminue la probabilité statistique de franchir le seuil d'un élément supplémentaire et ralentit la vitesse d'effondrement des calottes.
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
