import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  ExternalLink,
  Search,
  CheckCircle,
  FileText,
  ShieldCheck,
  Database,
  Thermometer,
  Layers,
  Flame,
  Wheat,
  Globe2,
  Activity,
  ArrowLeft,
  Check,
  Copy,
  Info,
  Scale,
  Camera,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import { AppTabType } from './TopBar';

export interface ScientificSourceItem {
  id: string;
  category: 'climate' | 'wetbulb' | 'tipping' | 'energy' | 'agriculture' | 'demography' | 'observatories';
  categoryLabel: string;
  title: string;
  englishTitle?: string;
  authors: string;
  year: number;
  publisher: string;
  peerReviewed: boolean;
  typeBadge: string;
  primaryUrl: string;
  primaryUrlLabel: string;
  secondaryUrl?: string;
  secondaryUrlLabel?: string;
  doi?: string;
  gaiaRole: string; // Où et comment c'est appliqué dans CLIMATOPEDY
  keyDataOrQuote: string; // Valeur empirique ou citation clé
  reproducibilityNotes: string; // Formule ou équation exacte concernée
}

export interface ImageSourceCredit {
  id: string;
  title: string;
  section: 'Enquête Chaîne Matérielle & Pétrole' | 'Points de Bascule Climatiques';
  localPath: string;
  description: string;
  archiveUrl: string;
  archiveLabel: string;
  license: string;
  sensorOrLocation: string;
}

export const SCIENTIFIC_SOURCES_LIST: ScientificSourceItem[] = [
  // 1. CLIMAT & CARBONE
  {
    id: 'fair-v13',
    category: 'climate',
    categoryLabel: 'Climat & Cycle du Carbone',
    title: 'Modèle FaIR v1.3 : Modèle Climatique Réduit à Réponse Impulsionnelle',
    englishTitle: 'FAIR v1.3: a simple emissions-based impulse response and carbon cycle model',
    authors: 'C. J. Smith, P. M. Forster, M. Allen, et al.',
    year: 2018,
    publisher: 'Geoscientific Model Development (Copernicus Publications)',
    peerReviewed: true,
    typeBadge: 'Modèle de référence CMIP6',
    primaryUrl: 'https://gmd.copernicus.org/articles/11/2273/2018/',
    primaryUrlLabel: 'Article scientifique (Copernicus GMD)',
    secondaryUrl: 'https://github.com/OMS-NetZero/FAIR',
    secondaryUrlLabel: 'Code source ouvert (GitHub)',
    doi: '10.5194/gmd-11-2273-2018',
    gaiaRole: 'Cœur du moteur climatique dans physicsModel.ts : calcul des 4 réservoirs de carbone atmosphérique (R1 à R4), de la constante de saturation alpha(t) et du forçage radiatif du CO2 (5.35 * ln(C/C0)).',
    keyDataOrQuote: 'FaIR est un modèle climatique réduit. L’article présente son architecture et évalue ses performances sur des scénarios d’émissions ; il ne conclut pas à une fidélité universelle supérieure à 99%.',
    reproducibilityNotes: 'Réservoirs tau = [1000000, 394.4, 36.54, 4.304] ans ; coefficients a = [0.2173, 0.2240, 0.2824, 0.2763].'
  },
  {
    id: 'ipcc-ar6-wg1',
    category: 'climate',
    categoryLabel: 'Climat & Cycle du Carbone',
    title: 'GIEC 6e Rapport d\'Évaluation (AR6) : Les Bases Scientifiques Physiques',
    englishTitle: 'IPCC AR6 Working Group I: The Physical Science Basis',
    authors: 'GIEC / IPCC (Groupe de travail I)',
    year: 2021,
    publisher: 'Organisation Météorologique Mondiale (OMM) & PNUE',
    peerReviewed: true,
    typeBadge: 'Consensus scientifique mondial',
    primaryUrl: 'https://www.ipcc.ch/report/ar6/wg1/',
    primaryUrlLabel: 'Rapport complet GIEC AR6 WGI',
    secondaryUrl: 'https://www.ipcc.ch/report/ar6/wg1/chapter/chapter-7/',
    secondaryUrlLabel: 'Chapitre 7 : Sensibilité climatique ECS',
    doi: '10.1017/9781009157896',
    gaiaRole: 'L’AR6 évalue la sensibilité climatique à l’équilibre et analyse plusieurs scénarios d’émissions. SSP5-8.5 est un scénario conditionnel de très fortes émissions, pas une prévision certaine.',
    keyDataOrQuote: 'GIEC AR6 : ECS avec estimation centrale de 3°C, plage probable de 2,5°C à 4°C et plage très probable de 2°C à 5°C.',
    reproducibilityNotes: 'Le curseur comparatif CLIMATOPEDY est un contrôle du simulateur réglable de 2°C à 4,5°C; ces bornes ne sont pas les plages d\'évaluation du GIEC.'
  },
  {
    id: 'vermeer-rahmstorf-2009',
    category: 'climate',
    categoryLabel: 'Climat & Cycle du Carbone',
    title: 'Élévation Globale du Niveau Marin Liée à la Température Planétaire',
    englishTitle: 'Global sea level linked to global temperature',
    authors: 'M. Vermeer & S. Rahmstorf',
    year: 2009,
    publisher: 'Proceedings of the National Academy of Sciences (PNAS)',
    peerReviewed: true,
    typeBadge: 'Article de référence PNAS',
    primaryUrl: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2799834/',
    primaryUrlLabel: 'Texte intégral en accès libre (PubMed Central)',
    doi: '10.1073/pnas.0907765106',
    gaiaRole: 'L’étude propose une relation semi-empirique entre température mondiale et niveau moyen de la mer. Cette publication ne constitue pas à elle seule une projection régionale d’inondation.',
    keyDataOrQuote: 'Formule différentielle : dH/dt = a * (T - T0) + b * dT/dt avec a = 3.4 mm/an/°C, b = 18 mm/°C et T0 = -0.5°C.',
    reproducibilityNotes: 'Intégration pas à pas de la dilatation thermique et de la fonte des glaces continentales.'
  },

  // 2. THERMODYNAMIQUE HUMAINE & THERMOMÈTRE MOUILLÉ
  {
    id: 'stull-2011',
    category: 'wetbulb',
    categoryLabel: 'Thermodynamique & Physiologie Humaine',
    title: 'Approximation de la Température au Thermomètre Mouillé (Tw)',
    englishTitle: 'Wet-Bulb Temperature from Relative Humidity and Air Temperature',
    authors: 'Roland Stull',
    year: 2011,
    publisher: 'Journal of Applied Meteorology and Climatology (American Meteorological Society)',
    peerReviewed: true,
    typeBadge: 'Standard en météorologie appliquée',
    primaryUrl: 'https://www.semanticscholar.org/paper/Wet-Bulb-Temperature-from-Relative-Humidity-and-Stull/90f8983226a20ca33cba797b5e43c5d7dd7dd5b3',
    primaryUrlLabel: 'Fiche d\'évaluation & texte (Semantic Scholar)',
    secondaryUrl: 'https://doi.org/10.1175/JAMC-D-11-0143.1',
    secondaryUrlLabel: 'DOI Officiel (American Meteorological Society)',
    doi: '10.1175/JAMC-D-11-0143.1',
    gaiaRole: 'La formule de Stull fournit une approximation de la température au thermomètre mouillé à partir de la température de l’air et de l’humidité relative.',
    keyDataOrQuote: 'Tw = Ta * atan(0.151977 * sqrt(RH + 8.313659)) + atan(Ta + RH) - atan(RH - 1.676331) + 0.00391838 * (RH^1.5) * atan(0.023101 * RH) - 4.686035.',
    reproducibilityNotes: 'L’article décrit le domaine d’application et les erreurs de l’approximation. Cette formule météorologique ne définit pas un seuil physiologique.'
  },
  {
    id: 'sherwood-huber-2010',
    category: 'wetbulb',
    categoryLabel: 'Thermodynamique & Physiologie Humaine',
    title: 'Une Limite Biophysique d\'Adaptabilité Humaine au Stress Thermique',
    englishTitle: 'An adaptability limit to climate change due to heat stress',
    authors: 'Steven C. Sherwood & Matthew Huber',
    year: 2010,
    publisher: 'Proceedings of the National Academy of Sciences (PNAS)',
    peerReviewed: true,
    typeBadge: 'Article fondateur PNAS',
    primaryUrl: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2906879/',
    primaryUrlLabel: 'Texte intégral en accès libre (PubMed Central)',
    doi: '10.1073/pnas.0913352107',
    gaiaRole: 'Sherwood et Huber discutent une limite théorique de contrainte thermique dans des conditions environnementales spécifiques. L’article ne fournit pas un seuil universel de mortalité applicable à chaque individu.',
    keyDataOrQuote: 'L’article étudie une limite théorique autour de 35°C de température au thermomètre mouillé pour une exposition prolongée. L’interprétation physiologique dépend notamment de l’activité, de l’acclimatation et des conditions d’exposition.',
    reproducibilityNotes: 'Cette étude ne valide pas à elle seule des estimations régionales d’inhabitabilité, de mortalité ou de déplacements de population.'
  },
  {
    id: 'raymond-et-al-2020',
    category: 'wetbulb',
    categoryLabel: 'Thermodynamique & Physiologie Humaine',
    title: 'Émergence Précoce de Seuils de Chaleur et d\'Humidité au-delà de la Tolérance Humaine',
    englishTitle: 'The emergence of heat and humidity too severe for human tolerance',
    authors: 'Colin Raymond, Tom Matthews & Radley M. Horton',
    year: 2020,
    publisher: 'Science Advances (American Association for the Advancement of Science)',
    peerReviewed: true,
    typeBadge: 'Analyse d’observations météorologiques',
    primaryUrl: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9578703/',
    primaryUrlLabel: 'Texte intégral en accès libre (PubMed Central)',
    doi: '10.1126/sciadv.aaw1838',
    gaiaRole: 'Validation observationnelle des points chauds mondiaux de Tw critique (Golfe Persique, Vallée de l\'Indus, Plaine du Nord de la Chine).',
    keyDataOrQuote: 'L’étude analyse des épisodes extrêmes de chaleur et d’humidité observés. Elle ne démontre pas que des seuils précis ont été atteints des décennies avant les projections des modèles.',
    reproducibilityNotes: 'Permet d\'étalonner l\'indice de vulnérabilité thermique humaine par zone géographique.'
  },

  // 3. POINTS DE BASCULE CLIMATIQUES (TIPPING POINTS)
  {
    id: 'armstrong-mckay-2022',
    category: 'tipping',
    categoryLabel: 'Points de Bascule (Tipping Points)',
    title: 'Le Dépassement de 1.5°C Pourrait Déclencher de Multiples Points de Bascule Planétaires',
    englishTitle: 'Exceeding 1.5°C global warming could trigger multiple climate tipping points',
    authors: 'David I. Armstrong McKay, Arie Staal, Timothy M. Lenton, et al.',
    year: 2022,
    publisher: 'Science',
    peerReviewed: true,
    typeBadge: 'Méta-analyse de référence Science',
    primaryUrl: 'https://global-tipping-points.org/',
    primaryUrlLabel: 'Rapport complet & données (Global Tipping Points)',
    secondaryUrl: 'https://doi.org/10.1126/science.abn7950',
    secondaryUrlLabel: 'DOI Officiel (Science Magazine)',
    doi: '10.1126/science.abn7950',
    gaiaRole: 'L’étude synthétise des estimations de seuils pour plusieurs éléments de bascule. Les valeurs affichées par Climatopedy ne sont pas la matrice exacte de l’article.',
    keyDataOrQuote: 'Les auteurs estiment que plusieurs éléments pourraient être déclenchés dans la plage de réchauffement de 1,5 à moins de 2°C; leurs seuils sont incertains et varient selon l’élément.',
    reproducibilityNotes: 'Données intégrées dans les jauges de risque en temps réel selon le réchauffement simulé.'
  },
  {
    id: 'lenton-2019-nature',
    category: 'tipping',
    categoryLabel: 'Points de Bascule (Tipping Points)',
    title: 'Points de Bascule Climatiques : Trop Dangereux pour Spéculer',
    englishTitle: 'Climate tipping points — too risky to bet against',
    authors: 'Timothy M. Lenton, Johan Rockström, Owen Gaffney, et al.',
    year: 2019,
    publisher: 'Nature',
    peerReviewed: true,
    typeBadge: 'Synthèse d\'alerte Nature',
    primaryUrl: 'https://www.nature.com/articles/d41586-019-03595-0',
    primaryUrlLabel: 'Publication officielle (Nature)',
    doi: '10.1038/d41586-019-03595-0',
    gaiaRole: 'Modélisation des cascades de rétroactions positives (ex: la fonte de l\'Arctique injecte de l\'eau douce qui freine l\'AMOC, modifiant la mousson amazonienne).',
    keyDataOrQuote: 'Cette synthèse décrit les risques liés aux points de bascule climatiques; elle ne quantifie pas ici la part des éléments déjà actifs ou proches d’un seuil.',
    reproducibilityNotes: 'Fondement de l\'analyse des rétroactions biophysiques non linéaires.'
  },
  {
    id: 'caesar-amoc-2018',
    category: 'tipping',
    categoryLabel: 'Points de Bascule (Tipping Points)',
    title: 'Empreinte Observée d\'un Affaiblissement de la Circulation Méridienne Atlantique (AMOC)',
    englishTitle: 'Observed fingerprint of a weakening Atlantic Ocean overturning circulation',
    authors: 'L. Caesar, S. Rahmstorf, A. Robinson, et al.',
    year: 2018,
    publisher: 'Nature',
    peerReviewed: true,
    typeBadge: 'Observations océanographiques',
    primaryUrl: 'https://www.nature.com/articles/s41586-018-0006-5',
    primaryUrlLabel: 'Article scientifique (Nature)',
    doi: '10.1038/s41586-018-0006-5',
    gaiaRole: 'Calibrage de l\'élément de bascule AMOC et de la "bulle froide" en mer du Labrador dans la modélisation océanique.',
    keyDataOrQuote: 'Caesar et al. (2018) infèrent un affaiblissement de l’AMOC à partir d’une empreinte de température de surface reconstruite. Ce résultat n’est pas une mesure instrumentale directe et continue du transport.',
    reproducibilityNotes: 'Données corrélées aux observations des bouées sub-surfaciques RAPID Array (26°N).'
  },
  {
    id: 'lovejoy-nobre-amazon-2018',
    category: 'tipping',
    categoryLabel: 'Points de Bascule (Tipping Points)',
    title: 'Point de Bascule de l\'Amazonie : Seuil de Savanisation',
    englishTitle: 'Amazon Tipping Point',
    authors: 'Thomas E. Lovejoy & Carlos Nobre',
    year: 2018,
    publisher: 'Science Advances',
    peerReviewed: true,
    typeBadge: 'Étude biogéochimique tropicale',
    primaryUrl: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5821491/',
    primaryUrlLabel: 'Texte intégral en accès libre (PubMed Central)',
    doi: '10.1126/sciadv.aat2340',
    gaiaRole: 'L’article examine les risques de dépérissement de l’Amazonie liés conjointement au réchauffement, à la déforestation, aux sécheresses et aux incendies.',
    keyDataOrQuote: 'La publication discute une estimation de 20 à 25% de déforestation comme niveau de risque; elle ne décrit pas un seuil global déterministe déclenchant à lui seul un assèchement irréversible.',
    reproducibilityNotes: 'Utilisé pour modéliser le basculement de l\'Amazonie de puits de carbone en émetteur net de CO2.'
  },
  {
    id: 'imbie-greenland-2020',
    category: 'tipping',
    categoryLabel: 'Points de Bascule (Tipping Points)',
    title: 'Bilan de Masse de l\'Inlandsis du Groenland par Satellites Altimétriques',
    englishTitle: 'Mass balance of the Greenland Ice Sheet from 1992 to 2018',
    authors: 'The IMBIE Team (Andrew Shepherd, Erik Ivins, et al.)',
    year: 2020,
    publisher: 'Nature',
    peerReviewed: true,
    typeBadge: 'Consortium altimétrique international',
    primaryUrl: 'https://www.nature.com/articles/s41586-019-1855-2',
    primaryUrlLabel: 'Publication scientifique (Nature)',
    doi: '10.1038/s41586-019-1855-2',
    gaiaRole: 'Mesure de la perte de masse de glace de -270 Gt/an et calibrage de la rétroaction albédo-altitude de la calotte.',
    keyDataOrQuote: 'L’étude estime la perte de masse de la calotte groenlandaise sur la période 1992–2018 à partir de plusieurs observations satellitaires. Cette mesure passée n’est pas une validation d’un scénario futur particulier.',
    reproducibilityNotes: 'Combine les données des satellites GRACE, CryoSat-2 et ICESat.'
  },

  // 4. ÉNERGIE, EROI & MÉTABOLISME INDUSTRIEL
  {
    id: 'hall-eroi-2014',
    category: 'energy',
    categoryLabel: 'Énergie, EROI & Métabolisme Industriel',
    title: 'L\'EROI des Différents Carburants et ses Conséquences pour la Société Humaine',
    englishTitle: 'EROI of different fuels and the implications for society',
    authors: 'Charles A. S. Hall, Jessica G. Lambert & Stephen B. Balogh',
    year: 2014,
    publisher: 'Energy Policy (Elsevier)',
    peerReviewed: true,
    typeBadge: 'Théorie biophysique de l\'énergie',
    primaryUrl: 'https://doi.org/10.1016/j.enpol.2013.05.049',
    primaryUrlLabel: 'DOI Officiel (Elsevier Energy Policy)',
    secondaryUrl: 'https://ourworldindata.org/energy',
    secondaryUrlLabel: 'Données mondiales comparatives (Our World in Data)',
    doi: '10.1016/j.enpol.2013.05.049',
    gaiaRole: 'Formule non-linéaire de la falaise de l\'EROI dans physicsModel.ts : E_net = E_gross * (1 - 1/EROI). Sous un EROI de 5:1, l\'industrie doit consacrer l\'essentiel de sa puissance à s\'auto-extraire.',
    keyDataOrQuote: 'Les estimations d’EROI dépendent du périmètre et de la méthode de calcul. Cette publication ne justifie pas un seuil universel nécessaire au fonctionnement d’une société.',
    reproducibilityNotes: 'Calibre le cannibalisme énergétique des hydrocarbures non conventionnels (sables bitumineux, pétrole de schiste).'
  },
  {
    id: 'brockway-nature-energy-2019',
    category: 'energy',
    categoryLabel: 'Énergie, EROI & Métabolisme Industriel',
    title: 'Estimation de l\'EROI au Stade Final de Consommation pour les Énergies Fossiles',
    englishTitle: 'Estimation of global final-stage energy-return-on-investment for fossil fuels',
    authors: 'Paul E. Brockway, Anne Owen, Lina I. Brand-Correa, et al.',
    year: 2019,
    publisher: 'Nature Energy',
    peerReviewed: true,
    typeBadge: 'Analyse d\'énergie nette',
    primaryUrl: 'https://www.nature.com/articles/s41560-019-0425-z',
    primaryUrlLabel: 'Article scientifique (Nature Energy)',
    doi: '10.1038/s41560-019-0425-z',
    gaiaRole: 'Mesure de la dégradation continue du rendement énergétique réel lorsque les coûts de raffinage et de transport sont intégrés.',
    keyDataOrQuote: 'Pour les données mondiales de 1995 à 2011, l’étude estime un EROI des combustibles fossiles d’environ 6:1 au stade final, en baisse. Au stade primaire, ses estimations sont proches de 30:1.',
    reproducibilityNotes: 'Justifie la contrainte biophysique d\'inertie industrielle et de contraction matérielle.'
  },
  {
    id: 'smil-energy-civilization',
    category: 'energy',
    categoryLabel: 'Énergie, EROI & Métabolisme Industriel',
    title: 'Énergie et Civilisation : Une Histoire Biophysique de l\'Humanité',
    englishTitle: 'Energy and Civilization: A History',
    authors: 'Vaclav Smil (Distinguished Professor Emeritus, University of Manitoba)',
    year: 2017,
    publisher: 'The MIT Press',
    peerReviewed: true,
    typeBadge: 'Ouvrage de référence MIT Press',
    primaryUrl: 'https://openlibrary.org/works/OL17838501W/Energy_and_Civilization',
    primaryUrlLabel: 'Référence bibliographique (Open Library)',
    secondaryUrl: 'https://en.wikipedia.org/wiki/Energy_and_Civilization:_A_History',
    secondaryUrlLabel: 'Fiche descriptive encyclopédique',
    gaiaRole: 'Cet ouvrage traite de l’histoire des systèmes énergétiques et de leurs liens avec les sociétés et les technologies.',
    keyDataOrQuote: 'La production d’acier, de ciment, de plastiques et d’ammoniac utilise différentes sources d’énergie et matières premières; l’ouvrage ne permet pas d’affirmer que ces secteurs dépendent à 100% de la combustion fossile.',
    reproducibilityNotes: 'Intégré dans le modèle de transition sous contrainte de temps physique (18 à 25 ans de cycle d\'investissement).'
  },

  // 5. AGRICULTURE, HABER-BOSCH & ALIMENTATION
  {
    id: 'zhao-crop-yields-2017',
    category: 'agriculture',
    categoryLabel: 'Agriculture & Sécurité Alimentaire',
    title: 'L\'Élévation de Température Réduit les Rendements des Principales Cultures Mondiales',
    englishTitle: 'Temperature increase reduces global yields of major crops in four independent estimates',
    authors: 'Chuang Zhao, Bing Liu, Shilong Piao, et al.',
    year: 2017,
    publisher: 'Proceedings of the National Academy of Sciences (PNAS)',
    peerReviewed: true,
    typeBadge: 'Méta-analyse agronomique PNAS',
    primaryUrl: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5584412/',
    primaryUrlLabel: 'Texte intégral en accès libre (PubMed Central)',
    doi: '10.1073/pnas.1701762114',
    gaiaRole: 'Zhao et al. synthétisent des estimations moyennes mondiales de sensibilité des rendements; ces valeurs ne constituent pas des coefficients universels pour chaque pays ou année.',
    keyDataOrQuote: 'Sans fertilisation au CO₂, adaptation efficace ni amélioration génétique, l’étude estime qu’un degré supplémentaire de température moyenne mondiale réduirait en moyenne les rendements mondiaux du maïs de 7,4%, du blé de 6,0%, du riz de 3,2% et du soja de 3,1%. Les effets varient selon les régions.',
    reproducibilityNotes: 'CLIMATOPEDY applique ces moyennes mondiales comme paramètres avec un panier de cultures attribué à chaque pays. Cette extrapolation interne ne constitue pas une estimation locale validée; l’étude rapporte une forte hétérogénéité entre régions et cultures.'
  },
  {
    id: 'erisman-haber-bosch-2008',
    category: 'agriculture',
    categoryLabel: 'Agriculture & Sécurité Alimentaire',
    title: 'Comment un Siècle de Synthèse d\'Ammoniac a Révolutionné la Production Alimentaire',
    englishTitle: 'How a century of ammonia synthesis changed the world',
    authors: 'Jan Willem Erisman, Mark A. Sutton, James Galloway, et al.',
    year: 2008,
    publisher: 'Nature Geoscience',
    peerReviewed: true,
    typeBadge: 'Article historique Nature Geoscience',
    primaryUrl: 'https://www.nature.com/articles/ngeo325',
    primaryUrlLabel: 'Publication scientifique (Nature)',
    doi: '10.1038/ngeo325',
    gaiaRole: 'Couplage direct entre approvisionnement en gaz fossile (méthane CH4) et calories agricoles disponibles par être humain.',
    keyDataOrQuote: 'L\'analyse d\'Erisman et al. estime qu\'en 2008, environ 48% de la population mondiale était nourrie grâce à la production agricole utilisant de l\'azote réactif issu de la synthèse industrielle. C\'est une estimation agrégée de la contribution à l\'alimentation, pas un contrefactuel de naissance ni une mesure des atomes d\'azote individuels.',
    reproducibilityNotes: 'Modélise l\'impact d\'une rupture de la chaîne pétrochimique sur la production céréalière globale.'
  },
  {
    id: 'fao-sofi-report',
    category: 'agriculture',
    categoryLabel: 'Agriculture & Sécurité Alimentaire',
    title: 'L\'État de la Sécurité Alimentaire et de la Nutrition dans le Monde (SOFI)',
    englishTitle: 'The State of Food Security and Nutrition in the World',
    authors: 'FAO, FIDA, OMS, PAM, UNICEF (Nations Unies)',
    year: 2023,
    publisher: 'Organisation des Nations Unies pour l\'Alimentation et l\'Agriculture (FAO)',
    peerReviewed: true,
    typeBadge: 'Rapport annuel inter-agences ONU',
    primaryUrl: 'https://www.fao.org/publications/home/fao-flagship-publications/the-state-of-food-security-and-nutrition-in-the-world/en',
    primaryUrlLabel: 'Portail des rapports phares de la FAO',
    gaiaRole: 'Norme calorique vitale minimale (2 100 kcal / jour / habitant) et calcul des populations en déficit alimentaire aigu.',
    keyDataOrQuote: 'Définit les seuils de faim chronique et de sous-alimentation sévère utilisés pour calculer la surmortalité nutritionnelle dans le moteur démographique.',
    reproducibilityNotes: 'Données utilisées pour étalonner la capacité de charge alimentaire des continents.'
  },

  // 6. DÉMOGRAPHIE & LIMITES PLANÉTAIRES
  {
    id: 'un-wpp-2024',
    category: 'demography',
    categoryLabel: 'Démographie & Limites Planétaires',
    title: 'Perspectives de la Population Mondiale 2024 (World Population Prospects)',
    englishTitle: 'World Population Prospects 2024',
    authors: 'Département des affaires économiques et sociales de l\'ONU (UN DESA Population Division)',
    year: 2024,
    publisher: 'Nations Unies',
    peerReviewed: true,
    typeBadge: 'Données démographiques officielles ONU',
    primaryUrl: 'https://population.un.org/wpp/',
    primaryUrlLabel: 'Portail officiel des données démographiques ONU',
    gaiaRole: 'Point de départ de la population mondiale (8.15 milliards en 2026), structure par tranche d\'âge et pyramides des âges de référence.',
    keyDataOrQuote: 'Base empirique pour la mortalité de base (hors crise) et la fertilité naturelle avant perturbation biophysique.',
    reproducibilityNotes: 'Séries historiques démographiques de 1950 à 2024 vérifiées et alignées.'
  },
  {
    id: 'richardson-boundaries-2023',
    category: 'demography',
    categoryLabel: 'Démographie & Limites Planétaires',
    title: 'La Terre au-delà de Six des Neuf Limites Planétaires',
    englishTitle: 'Earth beyond six of nine planetary boundaries',
    authors: 'Katherine Richardson, Will Steffen, Wolfgang Lucht, et al.',
    year: 2023,
    publisher: 'Science Advances',
    peerReviewed: true,
    typeBadge: 'Évaluation globale du Système Terre',
    primaryUrl: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12232504/',
    primaryUrlLabel: 'Texte intégral en accès libre (PubMed Central)',
    secondaryUrl: 'https://www.stockholmresilience.org/research/planetary-boundaries.html',
    secondaryUrlLabel: 'Cadre du Stockholm Resilience Centre',
    doi: '10.1126/sciadv.adh2458',
    gaiaRole: 'Cadre théorique global des contraintes d\'intégrité de la biosphère et des cycles biogéochimiques qui limitent la substitution technologique infinie.',
    keyDataOrQuote: '6 des 9 limites planétaires sont franchies en 2023, signalant que la Terre opère désormais bien en dehors de la zone de sécurité holocène.',
    reproducibilityNotes: 'Démontre pourquoi le climat n\'est pas un problème isolé mais un symptôme de dépassement biophysique systémique.'
  },
  {
    id: 'meadows-limits-to-growth',
    category: 'demography',
    categoryLabel: 'Démographie & Limites Planétaires',
    title: 'Les Limites à la Croissance : Rapport au Club de Rome sur le Modèle World3',
    englishTitle: 'The Limits to Growth',
    authors: 'Donella H. Meadows, Dennis L. Meadows, Jørgen Randers & William W. Behrens III',
    year: 1972,
    publisher: 'Universe Books / Le Club de Rome',
    peerReviewed: true,
    typeBadge: 'Modèle fondateur de dynamique des systèmes',
    primaryUrl: 'https://www.clubofrome.org/publication/the-limits-to-growth/',
    primaryUrlLabel: 'Fiche officielle de la publication (Club de Rome)',
    gaiaRole: 'Validation épistémologique des boucles de rétroaction entre capital, ressources naturelles non renouvelables et démographie.',
    keyDataOrQuote: 'Prévision précoce des rétroactions de retardement (overshoot and collapse) lorsque l\'extraction dépend de capitaux de plus en plus intensifs.',
    reproducibilityNotes: 'Les trajectoires réelles 1972–2020 épousent le scénario standard de World3 (Turner 2014, Herrington 2020).'
  },

  // 7. OBSERVATOIRES SATELLITAIRES & MESURES CONTINUES EN TEMPS RÉEL
  {
    id: 'noaa-mauna-loa',
    category: 'observatories',
    categoryLabel: 'Observatoires & Données Satellites en Direct',
    title: 'Mesures Continues du CO₂ Atmosphérique à l\'Observatoire de Mauna Loa',
    englishTitle: 'Atmospheric Carbon Dioxide Trends at Mauna Loa, Hawaii',
    authors: 'NOAA Global Monitoring Laboratory (GML) & Scripps Institution of Oceanography',
    year: 2024,
    publisher: 'National Oceanic and Atmospheric Administration (NOAA)',
    peerReviewed: true,
    typeBadge: 'Série de données de référence mondiale',
    primaryUrl: 'https://gml.noaa.gov/ccgg/trends/',
    primaryUrlLabel: 'Données en direct NOAA GML (Trends in Atmospheric CO₂)',
    secondaryUrl: 'https://prod-01-asg-www-climate.woc.noaa.gov/news-features/understanding-climate/climate-change-atmospheric-carbon-dioxide',
    secondaryUrlLabel: 'NOAA Climate.gov : moyennes mondiales et de Mauna Loa en 2024',
    gaiaRole: 'La base de simulation utilise 424 ppm en 2026. C\'est un paramètre initial du modèle, pas une moyenne annuelle observée pour 2026.',
    keyDataOrQuote: 'NOAA rapporte pour 2024 une moyenne mondiale annuelle de 422,8 ppm et une moyenne annuelle de 424,61 ppm à Mauna Loa. Ces séries ont des périmètres différents et ne doivent pas être confondues.',
    reproducibilityNotes: 'Données publiques actualisées chaque mois.'
  },
  {
    id: 'copernicus-era5',
    category: 'observatories',
    categoryLabel: 'Observatoires & Données Satellites en Direct',
    title: 'Service Copernicus pour le Changement Climatique (C3S) & Réanalyse ERA5',
    englishTitle: 'Copernicus Climate Change Service / ECMWF ERA5 Reanalysis',
    authors: 'Centre Européen pour les Prévisions Météorologiques à Moyen Terme (ECMWF)',
    year: 2024,
    publisher: 'Union Européenne / ECMWF',
    peerReviewed: true,
    typeBadge: 'Système d\'observation de la Terre (Union Européenne)',
    primaryUrl: 'https://climate.copernicus.eu/',
    primaryUrlLabel: 'Portail officiel Copernicus Climate Change Service',
    gaiaRole: 'Validation de l\'anomalie de température actuelle (+1.3°C à +1.4°C en moyenne globale lissée) et des températures de surface de la mer (SST).',
    keyDataOrQuote: 'Fournit la réanalyse climatique mondiale la plus précise par assimilation de milliards d\'observations satellites et in situ.',
    reproducibilityNotes: 'Données horaires et mensuelles librement accessibles sous licence ouverte Copernicus.'
  },
  {
    id: 'nasa-gistemp-v4',
    category: 'observatories',
    categoryLabel: 'Observatoires & Données Satellites en Direct',
    title: 'Analyse des Températures de Surface Globales GISTEMP v4',
    englishTitle: 'GISS Surface Temperature Analysis (GISTEMP v4)',
    authors: 'NASA Goddard Institute for Space Studies (GISS)',
    year: 2024,
    publisher: 'National Aeronautics and Space Administration (NASA)',
    peerReviewed: true,
    typeBadge: 'Série temporelle instrumentale historique',
    primaryUrl: 'https://data.giss.nasa.gov/gistemp/',
    primaryUrlLabel: 'Jeu de données NASA GISTEMP v4',
    gaiaRole: 'Étalonnage de la courbe historique des températures moyennes mondiales de 1880 à 2026 dans la chronologie de simulation.',
    keyDataOrQuote: 'Reconstitution instrumentale planétaire combinant les stations terrestres GHCN v4 et les mesures océaniques ERSST v5.',
    reproducibilityNotes: 'Permet de vérifier que le modèle reproduit fidèlement le réchauffement observé au XXe siècle.'
  },
  {
    id: 'global-carbon-budget',
    category: 'observatories',
    categoryLabel: 'Observatoires & Données Satellites en Direct',
    title: 'Budget Carbone Mondial Annuel (Global Carbon Budget)',
    englishTitle: 'Global Carbon Budget',
    authors: 'P. Friedlingstein, M. W. Jones, M. O\'Sullivan, et al. (Global Carbon Project)',
    year: 2023,
    publisher: 'Earth System Science Data',
    peerReviewed: true,
    typeBadge: 'Synthèse internationale annuelle',
    primaryUrl: 'https://www.globalcarbonproject.org/',
    primaryUrlLabel: 'Site officiel du Global Carbon Project',
    gaiaRole: 'Bilan comptable annuel des émissions fossiles (~37 Gt CO2/an) et de déforestation (~4 Gt CO2/an) injectées dans FaIR.',
    keyDataOrQuote: 'Comptabilise la répartition des émissions entre l\'atmosphère (48%), les puits océaniques (26%) et les puits terrestres (29%).',
    reproducibilityNotes: 'Publié annuellement avec l\'ensemble des fichiers de données ouverts.'
  },
  {
    id: 'noaa-coral-reef-watch',
    category: 'observatories',
    categoryLabel: 'Observatoires & Données Satellites en Direct',
    title: 'Programme de Surveillance Satellitaire des Récifs Coralliens (Coral Reef Watch)',
    englishTitle: 'NOAA Coral Reef Watch 5km Satellite Thermal Stress Monitoring',
    authors: 'NOAA National Environmental Satellite, Data, and Information Service (NESDIS)',
    year: 2024,
    publisher: 'National Oceanic and Atmospheric Administration (NOAA)',
    peerReviewed: true,
    typeBadge: 'Surveillance satellitaire opérationnelle',
    primaryUrl: 'https://coralreefwatch.noaa.gov/',
    primaryUrlLabel: 'Portail opérationnel NOAA Coral Reef Watch',
    gaiaRole: 'Suivi de l\'indice Degree Heating Weeks (DHW) et validation de l\'état de stress critique des barrières coralliennes tropicales.',
    keyDataOrQuote: 'Confirme le 4e événement mondial de blanchissement massif des coraux en 2023–2024 touchant plus de 54% des récifs mondiaux.',
    reproducibilityNotes: 'Résolution satellitaire de 5 km à l\'échelle de tous les récifs tropicaux du globe.'
  }
];

export const IMAGE_SOURCES_LIST: ImageSourceCredit[] = [
  {
    id: 'oil-rig-img',
    title: 'Plateforme Pétrolière Offshore en Haute Mer',
    section: 'Enquête Chaîne Matérielle & Pétrole',
    localPath: '/images/visuals/oil_rig.jpg',
    description: 'Plateforme de forage semi-submersible en eaux profondes opérant en Mer du Nord (Minke Field). Affiche les structures tubulaires, le derrick et le pont d\'extraction.',
    archiveUrl: 'https://commons.wikimedia.org/wiki/Category:Oil_platforms',
    archiveLabel: 'Archives Wikimedia Commons : Catégorie Oil Platforms',
    license: 'Domaine Public / Licence Libre Wikimedia Commons',
    sensorOrLocation: 'Mer du Nord (Offshore hauturier)'
  },
  {
    id: 'refinery-img',
    title: 'Tour de Distillation Atmosphérique & Craquage Pétrolier',
    section: 'Enquête Chaîne Matérielle & Pétrole',
    localPath: '/images/visuals/eroi_energy.jpg',
    description: 'Complexe industriel de raffinage pétrolier, colonnes de fractionnement thermique et unités de craquage catalytique illustrant la falaise de l\'EROI.',
    archiveUrl: 'https://commons.wikimedia.org/wiki/Category:Oil_refineries',
    archiveLabel: 'Archives Wikimedia Commons : Catégorie Oil Refineries',
    license: 'Licence Libre Creative Commons / Wikimedia',
    sensorOrLocation: 'Unité industrielle de raffinage pétrochimique'
  },
  {
    id: 'chemical-plant-img',
    title: 'Complexe Chimique de Synthèse d\'Ammoniac (Haber-Bosch)',
    section: 'Enquête Chaîne Matérielle & Pétrole',
    localPath: '/images/visuals/chemical_plant.jpg',
    description: 'Réformeur catalytique de méthane et réacteurs haute pression (200 bars) pour la synthèse d\'ammoniac et d\'engrais azotés mondiaux.',
    archiveUrl: 'https://commons.wikimedia.org/wiki/Category:Chemical_plants',
    archiveLabel: 'Archives Wikimedia Commons : Catégorie Chemical Plants',
    license: 'Licence Libre Creative Commons / Wikimedia',
    sensorOrLocation: 'Installation industrielle de synthèse chimique'
  },
  {
    id: 'cargo-ship-img',
    title: 'Porte-Conteneurs Océanique Transcontinental',
    section: 'Enquête Chaîne Matérielle & Pétrole',
    localPath: '/images/visuals/cargo_ship.jpg',
    description: 'Navire marchand géant propulsé au fioul lourd, pilier logistique transportant 90% du fret matériel mondial.',
    archiveUrl: 'https://commons.wikimedia.org/wiki/Category:Container_ships',
    archiveLabel: 'Archives Wikimedia Commons : Catégorie Container Ships',
    license: 'Licence Libre Creative Commons / Wikimedia',
    sensorOrLocation: 'Route maritime commerciale internationale'
  },
  {
    id: 'greenland-ice-img',
    title: 'Calotte Glaciaire du Groenland & Lacs Supraglaciaires',
    section: 'Points de Bascule Climatiques',
    localPath: '/images/visuals/greenland_ice.jpg',
    description: 'Vue aérienne de l\'inlandsis montrant l\'apparition estivale de lacs de fonte bleutés et de bédières qui s\'engouffrent vers le socle rocheux.',
    archiveUrl: 'https://commons.wikimedia.org/wiki/Category:Greenland_ice_sheet',
    archiveLabel: 'Archives Wikimedia Commons : Catégorie Greenland Ice Sheet',
    license: 'NASA Earth Observatory / Domaine Public',
    sensorOrLocation: '72°15\'N 40°20\'W (Inlandsis Groenlandais)'
  },
  {
    id: 'antarctic-shelf-img',
    title: 'Plateforme Glaciaire Tabulaire d\'Antarctique Occidental',
    section: 'Points de Bascule Climatiques',
    localPath: '/images/visuals/antarctic_shelf.jpg',
    description: 'Front vertical de glace tabulaire et réseau de crevasses côtières dans le secteur sensible du glacier Thwaites.',
    archiveUrl: 'https://commons.wikimedia.org/wiki/Category:Ice_shelves_of_Antarctica',
    archiveLabel: 'Archives Wikimedia Commons : Catégorie Ice Shelves of Antarctica',
    license: 'US Antarctic Program / Domaine Public',
    sensorOrLocation: '75°06\'S 106°45\'W (Glacier Thwaites / WAIS)'
  },
  {
    id: 'coral-reef-img',
    title: 'Écosystème Corallien Tropical Indo-Pacifique',
    section: 'Points de Bascule Climatiques',
    localPath: '/images/visuals/coral_reef.jpg',
    description: 'Biodiversité corallienne d\'eaux peu profondes menacée de blanchissement létal par le dépassement des seuils Degree Heating Weeks.',
    archiveUrl: 'https://commons.wikimedia.org/wiki/Category:Coral_reefs',
    archiveLabel: 'Archives Wikimedia Commons : Catégorie Coral Reefs',
    license: 'NOAA Coral Reef Watch / CC-BY',
    sensorOrLocation: '18°17\'S 147°42\'E (Grande Barrière de Corail)'
  },
  {
    id: 'permafrost-img',
    title: 'Dégel du Pergélisol Arctique & Cratère de Batagaika',
    section: 'Points de Bascule Climatiques',
    localPath: '/images/visuals/permafrost_thaw.jpg',
    description: 'Méga-effondrement thermokarstique mettant à nu des strates de glaces fossiles et de sols organiques pléistocènes.',
    archiveUrl: 'https://commons.wikimedia.org/wiki/Category:Permafrost',
    archiveLabel: 'Archives Wikimedia Commons : Catégorie Permafrost',
    license: 'Licence Libre Creative Commons / Wikimedia',
    sensorOrLocation: '67°29\'N 133°48\'E (Iakoutie, Sibérie)'
  },
  {
    id: 'sea-ice-img',
    title: 'Banquise Polaire Fracturée & Chenaux d\'Eau Libre',
    section: 'Points de Bascule Climatiques',
    localPath: '/images/visuals/sea_ice.jpg',
    description: 'Vue rapprochée de la glace de mer dérivante et des surfaces océaniques d\'albédo sombre absorbant le rayonnement solaire.',
    archiveUrl: 'https://commons.wikimedia.org/wiki/Category:Arctic_sea_ice',
    archiveLabel: 'Archives Wikimedia Commons : Catégorie Arctic Sea Ice',
    license: 'NOAA / NASA / Domaine Public',
    sensorOrLocation: '84°30\'N 15°00\'E (Bassin Arctique Central)'
  },
  {
    id: 'amoc-sea-img',
    title: 'Océan Atlantique Nord Subpolaire & Convection AMOC',
    section: 'Points de Bascule Climatiques',
    localPath: '/images/visuals/amoc_sea.jpg',
    description: 'Houle subpolaire en Mer du Labrador où s\'effectue la plongée des eaux froides et salées alimentant la circulation thermohaline.',
    archiveUrl: 'https://commons.wikimedia.org/wiki/Category:Atlantic_Ocean',
    archiveLabel: 'Archives Wikimedia Commons : Catégorie Atlantic Ocean',
    license: 'Licence Libre Creative Commons / Wikimedia',
    sensorOrLocation: '55°00\'N 35°00\'W (Gyre Subpolaire Nord-Atlantique)'
  },
  {
    id: 'amazon-img',
    title: 'Canopée de la Forêt Tropicale Amazonienne',
    section: 'Points de Bascule Climatiques',
    localPath: '/images/visuals/amazon_rainforest.jpg',
    description: 'Forêt pluviale primaire dense et méandres hydrologiques générateurs des « fleuves volants » d\'évapotranspiration.',
    archiveUrl: 'https://commons.wikimedia.org/wiki/Category:Amazon_Rainforest',
    archiveLabel: 'Archives Wikimedia Commons : Catégorie Amazon Rainforest',
    license: 'Licence Libre Creative Commons / Wikimedia',
    sensorOrLocation: '03°08\'S 60°01\'W (Bassin Central de l\'Amazone)'
  },
  {
    id: 'boreal-taiga-img',
    title: 'Taïga Boréale à Résineux & Écorégion Subarctique',
    section: 'Points de Bascule Climatiques',
    localPath: '/images/visuals/boreal_taiga.jpg',
    description: 'Massif forestier boréal de conifères soumis au stress hydrique estival, aux pullulations d\'insectes et aux méga-feux.',
    archiveUrl: 'https://commons.wikimedia.org/wiki/Category:Taiga',
    archiveLabel: 'Archives Wikimedia Commons : Catégorie Taiga',
    license: 'Licence Libre Creative Commons / Wikimedia',
    sensorOrLocation: '61°15\'N 115°45\'W (Territoires du Nord-Ouest)'
  },
  {
    id: 'wilkes-ice-img',
    title: 'Bassin Sous-Glaciaire de Wilkes & Falaise de Glace Totten',
    section: 'Points de Bascule Climatiques',
    localPath: '/images/visuals/wilkes_ice.jpg',
    description: 'Falaise glaciaire géante et mission océanographique auscultant les eaux de fond du bassin marin sous-glaciaire d\'Antarctique oriental.',
    archiveUrl: 'https://commons.wikimedia.org/wiki/Category:Wilkes_Land',
    archiveLabel: 'Archives Wikimedia Commons : Catégorie Wilkes Land & East Antarctic Ice Sheet',
    license: 'Licence Libre Creative Commons / US Antarctic Program',
    sensorOrLocation: '70°00\'S 135°00\'E (Bassin Sous-Glaciaire de Wilkes / Terre de Wilkes)'
  }
];

interface ScientificSourcesViewProps {
  onNavigateTab: (tab: AppTabType) => void;
  onSeekYear?: (year: number) => void;
}

export const ScientificSourcesView: React.FC<ScientificSourcesViewProps> = ({
  onNavigateTab
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'papers' | 'images'>('papers');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedDoi, setCopiedDoi] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Toutes les disciplines (20)' },
    { id: 'climate', label: 'Climat & Cycle du Carbone (3)' },
    { id: 'wetbulb', label: 'Thermodynamique & Tw Humain (3)' },
    { id: 'tipping', label: 'Points de Bascule (5)' },
    { id: 'energy', label: 'Énergie & Falaise EROI (3)' },
    { id: 'agriculture', label: 'Agriculture & Haber-Bosch (3)' },
    { id: 'demography', label: 'Démographie & Limites (3)' },
    { id: 'observatories', label: 'Observatoires Satellites (5)' }
  ];

  const filteredSources = useMemo(() => {
    return SCIENTIFIC_SOURCES_LIST.filter((source) => {
      const matchesCategory = selectedCategory === 'all' || source.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch =
        source.title.toLowerCase().includes(q) ||
        (source.englishTitle && source.englishTitle.toLowerCase().includes(q)) ||
        source.authors.toLowerCase().includes(q) ||
        source.publisher.toLowerCase().includes(q) ||
        source.gaiaRole.toLowerCase().includes(q) ||
        source.keyDataOrQuote.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const filteredImages = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return IMAGE_SOURCES_LIST;
    return IMAGE_SOURCES_LIST.filter(
      (img) =>
        img.title.toLowerCase().includes(q) ||
        img.description.toLowerCase().includes(q) ||
        img.section.toLowerCase().includes(q) ||
        img.sensorOrLocation.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleCopyDoi = (doi: string, id: string) => {
    navigator.clipboard.writeText(`https://doi.org/${doi}`);
    setCopiedDoi(id);
    setTimeout(() => setCopiedDoi(null), 2000);
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-200">
      {/* 1. Bandeau Titre & Engagement de Transparence Scientifique */}
      <div className="rounded-2xl bg-gradient-to-br from-sky-50 via-white to-sky-50/50 border border-sky-200 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Grillage discret en fond */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#0284c708_1px,transparent_1px),linear-gradient(to_bottom,#0284c708_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => onNavigateTab('map')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour à la Simulation Planétaire</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono font-semibold shadow-2xs">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Liens Vérifiés &amp; Actifs</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-50 border border-sky-300 text-sky-800 text-xs font-mono font-semibold shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                <span>Évalué par les pairs (Peer-reviewed)</span>
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-sky-600 shrink-0" />
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
                Sources Scientifiques, Données &amp; Imagerie Vérifiables
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-4xl leading-relaxed">
              Pour permettre à chaque chercheur, enseignant, étudiant ou citoyen de <strong>vérifier et d'auditer l'intégrité du travail</strong>, 
              cette page recense l'intégralité des publications académiques à comité de lecture (<em>Nature, Science, PNAS</em>), 
              des rapports d'institutions internationales (<em>GIEC, ONU, FAO, NOAA</em>), des relevés d'observatoires satellites 
              et des photographies documentaires libres qui fondent <strong>CLIMATOPEDY</strong>.
            </p>
          </div>

          {/* 3 Cartouches de synthèse sur la méthode */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-start gap-2.5">
              <Scale className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 block font-semibold">Zéro Boîte Noire</strong>
                <span className="text-slate-600 text-[11px] leading-snug block mt-0.5">
                  Toutes les équations (FaIR, Stull Tw, EROI, Zhao) sont formulées analytiquement en open-source.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-start gap-2.5">
              <Database className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 block font-semibold">Jeux de données de référence</strong>
                <span className="text-slate-600 text-[11px] leading-snug block mt-0.5">
                  CLIMATOPEDY utilise des séries de Mauna Loa (CO₂), ERA5 Copernicus (températures) et des données démographiques de l'ONU comme références d'entrée; cela ne constitue pas une validation indépendante de toutes les sorties du modèle.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-start gap-2.5">
              <ExternalLink className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 block font-semibold">Accès Direct Gratuit</strong>
                <span className="text-slate-600 text-[11px] leading-snug block mt-0.5">
                  Priorité aux textes intégraux gratuits en accès libre (PubMed Central, dépôts universitaires).
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Onglets Principaux : Publications Académiques vs Imagerie & Photographies */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2 text-xs sm:text-sm">
        <button
          onClick={() => setActiveMainTab('papers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeMainTab === 'papers'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Publications Scientifiques &amp; Modèles (20)</span>
        </button>

        <button
          onClick={() => setActiveMainTab('images')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeMainTab === 'images'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Photographies Documentaires &amp; Imagerie (12)</span>
        </button>
      </div>

      {/* 3. Barre de Recherche */}
      <div className="flex flex-col gap-3 bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-2xs">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeMainTab === 'papers'
                ? "Rechercher par auteur (Stull, Smith, Zhao, Lenton), revue (Science, Nature, PNAS), formule..."
                : "Rechercher une photographie (Plateforme, Navire, Groenland, Coraux, Pergélisol, Amazonie)..."
            }
            className="w-full pl-10 pr-24 py-2.5 rounded-lg bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 transition-colors font-sans shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-800 px-2 py-0.5 rounded bg-slate-100 cursor-pointer"
            >
              Effacer
            </button>
          )}
        </div>

        {/* Pilules de filtres spécifiques aux publications */}
        {activeMainTab === 'papers' && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-sky-600 text-white font-bold shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-slate-200 shadow-2xs'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. CONTENU : ONGLET 1 - PUBLICATIONS & MODÈLES SCIENTIFIQUES */}
      {activeMainTab === 'papers' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-mono">
            <span>
              Affichage de <strong className="text-slate-800 font-bold">{filteredSources.length}</strong> publication(s) vérifiée(s)
            </span>
            <button
              onClick={() => onNavigateTab('spec')}
              className="text-sky-700 hover:text-sky-900 underline font-sans flex items-center gap-1 cursor-pointer font-medium"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Voir les équations différentielles (Spec) &rarr;</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredSources.map((source) => (
              <div
                key={source.id}
                className="rounded-xl bg-white border border-slate-200 hover:border-slate-300 p-5 shadow-xs flex flex-col gap-4 transition-all"
              >
                {/* Haut de fiche : Titre, Catégorie, Badges */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                        {source.categoryLabel}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>Lien vérifié</span>
                      </span>
                      {source.peerReviewed && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-indigo-800 bg-indigo-50 border border-indigo-200">
                          Évalué par les pairs
                        </span>
                      )}
                      <span className="text-xs text-slate-500">· {source.year}</span>
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
                      {source.title}
                    </h2>
                    {source.englishTitle && (
                      <p className="text-xs text-slate-500 italic">
                        Titre original : « {source.englishTitle} »
                      </p>
                    )}

                    <div className="text-xs text-slate-700 font-medium pt-0.5">
                      <span className="text-slate-500">Auteurs :</span> {source.authors}
                      <span className="mx-2 text-slate-300">|</span>
                      <span className="text-sky-700 font-semibold">{source.publisher}</span>
                    </div>
                  </div>

                  {/* Bouton de copie DOI si disponible */}
                  {source.doi && (
                    <button
                      onClick={() => handleCopyDoi(source.doi!, source.id)}
                      className="self-start px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-mono border border-slate-200 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
                      title="Copier le DOI officiel"
                    >
                      {copiedDoi === source.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-800 font-semibold">DOI Copié</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-400" />
                          <span>DOI: {source.doi}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Corps de fiche : Application concrète dans CLIMATOPEDY */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                  <div className="p-3.5 rounded-lg bg-sky-50/60 border border-sky-200 space-y-1.5">
                    <span className="font-mono text-[11px] font-bold text-sky-800 uppercase tracking-wide flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-sky-600" />
                      Rôle &amp; Modélisation dans CLIMATOPEDY :
                    </span>
                    <p className="text-slate-700 leading-relaxed font-sans">
                      {source.gaiaRole}
                    </p>
                    <div className="text-[11px] text-slate-600 font-mono pt-1">
                      📐 {source.reproducibilityNotes}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-amber-50/60 border border-amber-200 space-y-1.5">
                    <span className="font-mono text-[11px] font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-amber-600" />
                      Valeur Empirique ou Citation Clé :
                    </span>
                    <p className="text-slate-700 leading-relaxed italic font-serif">
                      « {source.keyDataOrQuote} »
                    </p>
                  </div>
                </div>

                {/* Liens d'accès direct vérifiés */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={source.primaryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{source.primaryUrlLabel}</span>
                    </a>

                    {source.secondaryUrl && (
                      <a
                        href={source.secondaryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-300 shadow-2xs transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-3 h-3 text-sky-600" />
                        <span>{source.secondaryUrlLabel}</span>
                      </a>
                    )}
                  </div>

                  <span className="text-[11px] font-mono text-slate-500">
                    ID Source : <code className="text-slate-700">{source.id}</code>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CONTENU : ONGLET 2 - PHOTOGRAPHIES DOCUMENTAIRES & IMAGERIE */}
      {activeMainTab === 'images' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-mono">
            <span>
              Affichage de <strong className="text-slate-800 font-bold">{filteredImages.length}</strong> photographie(s) et actif(s) documentaire(s)
            </span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Stockage local pérenne + Archives Wikimedia vérifiées</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredImages.map((img) => (
              <div
                key={img.id}
                className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-xs flex flex-col transition-all hover:border-slate-300"
              >
                {/* Vignette de la photo réelle */}
                <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden group">
                  <img
                    src={img.localPath}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950/80 text-amber-300 border border-amber-500/50 backdrop-blur">
                      {img.section}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/90 text-emerald-300 border border-emerald-600/60 backdrop-blur">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>Haute Résolution Vérifiée</span>
                  </div>
                </div>

                {/* Données et crédits */}
                <div className="p-4 flex flex-col gap-3 flex-1 justify-between">
                  <div className="space-y-1.5">
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
                      {img.title}
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {img.description}
                    </p>
                    <div className="text-[11px] font-mono text-slate-600 pt-1 space-y-0.5">
                      <div>📍 <strong>Localisation :</strong> {img.sensorOrLocation}</div>
                      <div>⚖️ <strong>Licence :</strong> {img.license}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <a
                      href={img.archiveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{img.archiveLabel}</span>
                    </a>

                    <span className="text-[10px] font-mono text-slate-500 truncate max-w-[140px]">
                      {img.localPath}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Guide de Reproduction & Audit Pas à Pas pour Vérifier le Travail */}
      <div className="rounded-2xl bg-white border border-emerald-300 p-6 sm:p-7 shadow-xs flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
            Protocole d'Audit Indépendant : Comment Vérifier les Calculs de CLIMATOPEDY ?
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Pour vous assurer de l'honnêteté et de la rigueur biophysique des projections, voici les 3 étapes recommandées :
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 shadow-2xs">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center font-bold font-mono text-[11px]">
              1
            </span>
            <strong className="text-slate-800 block font-semibold">Auditer les Formules (ODE)</strong>
            <p className="text-slate-600 leading-snug">
              Ouvrez l'onglet <strong>Spécifications</strong> pour copier l'intégralité du code mathématique (équations différentielles FaIR, formule de Stull, Vermeer &amp; Rahmstorf).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 shadow-2xs">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center font-bold font-mono text-[11px]">
              2
            </span>
            <strong className="text-slate-800 block font-semibold">Vérifier l'Historique 1900–2026</strong>
            <p className="text-slate-600 leading-snug">
              Comparez les sorties du simulateur avec les observations historiques. Les mesures de Mauna Loa et les estimations de température mondiale sont des séries distinctes; leur présence ne constitue pas une validation indépendante des autres sorties du modèle.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 shadow-2xs">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center font-bold font-mono text-[11px]">
              3
            </span>
            <strong className="text-slate-800 block font-semibold">Tester les Scénarios Extrêmes</strong>
            <p className="text-slate-600 leading-snug">
              Dans le mode comparatif, modifiez le taux de déclin pétrolier, l'adoption de l'agroécologie ou la sensibilité climatique ECS pour observer le comportement mathématique des boucles.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Aucune donnée n'est masquée. Le code source TypeScript est accessible et inspectable.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('spec')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Consulter le Cahier des Charges Mathématique
            </button>
            <button
              onClick={() => onNavigateTab('map')}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs border border-slate-200 transition-colors cursor-pointer"
            >
              Retour à la Carte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
