import { CountryStaticData } from '../types/simulation';

// Coordonnées et polygones en projection plane équirectangulaire (Plate Carrée EPSG:4326)
// Canvas dimensions : 1000 de large (-180° à +180°) par 500 de haut (+90° à -90°)
// Transformation rigoureuse :
// X = (lon + 180) * (1000 / 360)
// Y = (90 - lat) * (500 / 180)

export const COUNTRIES_DATA: CountryStaticData[] = [
  // ==========================================
  // --- AMÉRIQUE DU NORD ---
  // ==========================================
  {
    id: 'usa',
    name: 'United States',
    frenchName: 'États-Unis',
    code: 'USA',
    region: 'Americas',
    center: [-98, 39],
    // USA contigu + Alaska + Floride + Grands Lacs
    pathSvg: `
      M 160,118 L 195,118 L 220,118 L 235,116 L 244,124 L 238,132 L 252,130 L 255,138 L 246,146 L 248,158 L 244,172 L 240,186 L 234,186 L 230,174 L 218,172 L 208,188 L 194,186 L 176,182 L 164,168 L 158,150 L 158,132 Z
      M 80,62 L 120,62 L 122,86 L 102,96 L 82,90 L 76,78 Z
      M 240,172 L 248,172 L 246,192 L 240,192 Z
    `,
    basePop2026: 342,
    baseCohortSplit: [0.18, 0.64, 0.18],
    baseTemp: 13.5,
    baseHumidity: 62,
    summerMaxTemp: 37.2,
    summerHumidity: 52,
    patternScaling: 1.25,
    baseCaloriesDay: 3800,
    cropMix: { maize: 0.45, wheat: 0.25, rice: 0.05, soy: 0.25 },
    coastalExposureScore: 0.45,
    baseFertility: 1.66,
    baseMortality: 8.8,
    resilienceIndex: 0.85
  },
  {
    id: 'can',
    name: 'Canada',
    frenchName: 'Canada',
    code: 'CAN',
    region: 'Americas',
    center: [-106, 56],
    // Canada avec Baie d'Hudson, Labrador, Côte Pacifique
    pathSvg: `
      M 122,62 L 160,62 L 195,62 L 220,60 L 240,68 L 258,74 L 274,80 L 268,92 L 254,98 L 244,88 L 234,88 L 232,100 L 250,110 L 242,118 L 220,118 L 195,118 L 160,118 L 156,104 L 144,94 L 132,84 L 122,86 Z
      M 205,42 L 225,40 L 238,52 L 220,54 Z
    `,
    basePop2026: 40,
    baseCohortSplit: [0.16, 0.65, 0.19],
    baseTemp: 1.5,
    baseHumidity: 68,
    summerMaxTemp: 28.5,
    summerHumidity: 48,
    patternScaling: 1.85,
    baseCaloriesDay: 3500,
    cropMix: { maize: 0.15, wheat: 0.65, rice: 0.0, soy: 0.20 },
    coastalExposureScore: 0.30,
    baseFertility: 1.45,
    baseMortality: 8.2,
    resilienceIndex: 0.88
  },
  {
    id: 'mex',
    name: 'Mexico',
    frenchName: 'Mexique',
    code: 'MEX',
    region: 'Americas',
    center: [-102, 23],
    // Mexique avec péninsule de Basse-Californie et Yucatan
    pathSvg: `
      M 176,182 L 194,186 L 208,188 L 218,172 L 230,174 L 234,186 L 238,198 L 246,200 L 252,194 L 254,204 L 242,210 L 232,214 L 216,212 L 198,198 L 184,190 Z
      M 166,176 L 174,182 L 166,204 L 162,198 Z
    `,
    basePop2026: 130,
    baseCohortSplit: [0.24, 0.67, 0.09],
    baseTemp: 22.0,
    baseHumidity: 55,
    summerMaxTemp: 39.5,
    summerHumidity: 42,
    patternScaling: 1.15,
    baseCaloriesDay: 3200,
    cropMix: { maize: 0.60, wheat: 0.15, rice: 0.05, soy: 0.20 },
    coastalExposureScore: 0.50,
    baseFertility: 1.80,
    baseMortality: 6.2,
    resilienceIndex: 0.55
  },
  {
    id: 'cen_am',
    name: 'Central America & Caribbean',
    frenchName: 'Amérique Centrale & Caraïbes',
    code: 'CAC',
    region: 'Americas',
    center: [-84, 14],
    // Isthme méso-américain + Cuba + Hispaniola
    pathSvg: `
      M 242,210 L 254,204 L 264,212 L 274,218 L 268,226 L 258,222 L 248,220 L 238,214 Z
      M 258,194 L 272,196 L 276,200 L 264,200 Z
      M 278,198 L 290,200 L 288,206 L 278,204 Z
    `,
    basePop2026: 88,
    baseCohortSplit: [0.27, 0.65, 0.08],
    baseTemp: 25.5,
    baseHumidity: 78,
    summerMaxTemp: 33.5,
    summerHumidity: 70,
    patternScaling: 1.05,
    baseCaloriesDay: 2800,
    cropMix: { maize: 0.50, wheat: 0.10, rice: 0.25, soy: 0.15 },
    coastalExposureScore: 0.85,
    baseFertility: 2.15,
    baseMortality: 6.5,
    resilienceIndex: 0.40
  },

  // ==========================================
  // --- AMÉRIQUE DU SUD ---
  // ==========================================
  {
    id: 'bra',
    name: 'Brazil',
    frenchName: 'Brésil',
    code: 'BRA',
    region: 'Americas',
    center: [-53, -10],
    // Brésil : Bassin amazonien, corne du Nord-Est, côte Atlantique et Sud
    pathSvg: `
      M 314,236 L 340,230 L 366,236 L 388,252 L 392,266 L 384,284 L 374,302 L 358,318 L 344,324 L 334,310 L 322,300 L 314,282 L 302,274 L 306,252 Z
    `,
    basePop2026: 218,
    baseCohortSplit: [0.20, 0.70, 0.10],
    baseTemp: 25.2,
    baseHumidity: 79,
    summerMaxTemp: 34.5,
    summerHumidity: 62,
    patternScaling: 1.15,
    baseCaloriesDay: 3300,
    cropMix: { maize: 0.35, wheat: 0.10, rice: 0.15, soy: 0.40 },
    coastalExposureScore: 0.45,
    baseFertility: 1.62,
    baseMortality: 6.8,
    resilienceIndex: 0.60
  },
  {
    id: 'arg',
    name: 'Argentina & South Cone',
    frenchName: 'Argentine, Chili & Cône Sud',
    code: 'ARG',
    region: 'Americas',
    center: [-64, -34],
    // Cône Sud : Pampa argentine, Patagonie, Chili, Terre de Feu
    pathSvg: `
      M 316,298 L 334,310 L 344,324 L 338,348 L 328,374 L 320,404 L 314,432 L 308,432 L 304,396 L 308,350 L 310,320 Z
    `,
    basePop2026: 72,
    baseCohortSplit: [0.22, 0.65, 0.13],
    baseTemp: 15.8,
    baseHumidity: 60,
    summerMaxTemp: 38,
    summerHumidity: 46,
    patternScaling: 1.10,
    baseCaloriesDay: 3250,
    cropMix: { maize: 0.30, wheat: 0.35, rice: 0.05, soy: 0.30 },
    coastalExposureScore: 0.40,
    baseFertility: 1.95,
    baseMortality: 7.7,
    resilienceIndex: 0.62
  },
  {
    id: 'and',
    name: 'Andean Region (Col, Per, Bol)',
    frenchName: 'Région Andine (Colombie, Pérou, Bolivie)',
    code: 'AND',
    region: 'Americas',
    center: [-74, -4],
    // Colombie, Équateur, Pérou, Bolivie, Vénézuéla
    pathSvg: `
      M 274,218 L 290,224 L 314,236 L 306,252 L 302,274 L 314,282 L 316,298 L 310,320 L 300,314 L 290,296 L 282,272 L 276,248 L 274,230 Z
    `,
    basePop2026: 125,
    baseCohortSplit: [0.25, 0.66, 0.09],
    baseTemp: 21.0,
    baseHumidity: 72,
    summerMaxTemp: 34.5,
    summerHumidity: 70,
    patternScaling: 1.10,
    baseCaloriesDay: 2850,
    cropMix: { maize: 0.40, wheat: 0.20, rice: 0.25, soy: 0.15 },
    coastalExposureScore: 0.50,
    baseFertility: 2.10,
    baseMortality: 6.0,
    resilienceIndex: 0.48
  },

  // ==========================================
  // --- EUROPE ---
  // ==========================================
  {
    id: 'fra',
    name: 'France',
    frenchName: 'France',
    code: 'FRA',
    region: 'Europe',
    center: [2.5, 46.5],
    // Hexagone français avec Bretagne, Normandie, golfe de Gascogne et Méditerranée
    pathSvg: `
      M 498,114 L 512,112 L 518,124 L 514,136 L 504,138 L 496,136 L 492,126 L 488,118 Z
    `,
    basePop2026: 68,
    baseCohortSplit: [0.17, 0.61, 0.22],
    baseTemp: 12.2,
    baseHumidity: 74,
    summerMaxTemp: 35.5,
    summerHumidity: 38,
    patternScaling: 1.35,
    baseCaloriesDay: 3550,
    cropMix: { maize: 0.25, wheat: 0.60, rice: 0.02, soy: 0.13 },
    coastalExposureScore: 0.45,
    baseFertility: 1.75,
    baseMortality: 9.6,
    resilienceIndex: 0.86
  },
  {
    id: 'deu',
    name: 'Germany & Benelux',
    frenchName: 'Allemagne & Benelux',
    code: 'DEU',
    region: 'Europe',
    center: [10, 51.5],
    // Allemagne, Pays-Bas, Belgique, Suisse, Autriche
    pathSvg: `
      M 512,102 L 532,100 L 534,116 L 526,124 L 518,124 L 512,112 Z
    `,
    basePop2026: 112,
    baseCohortSplit: [0.14, 0.64, 0.22],
    baseTemp: 9.8,
    baseHumidity: 76,
    summerMaxTemp: 34,
    summerHumidity: 42,
    patternScaling: 1.35,
    baseCaloriesDay: 3600,
    cropMix: { maize: 0.20, wheat: 0.65, rice: 0.0, soy: 0.15 },
    coastalExposureScore: 0.60,
    baseFertility: 1.50,
    baseMortality: 11.2,
    resilienceIndex: 0.90
  },
  {
    id: 'gbr',
    name: 'United Kingdom & Ireland',
    frenchName: 'Royaume-Uni & Irlande',
    code: 'GBR',
    region: 'Europe',
    center: [-2.5, 54],
    // Grande-Bretagne (Écosse, Angleterre) + Irlande
    pathSvg: `
      M 488,92 L 498,90 L 496,108 L 486,114 L 482,106 Z
      M 476,100 L 482,100 L 480,110 L 474,108 Z
    `,
    basePop2026: 73,
    baseCohortSplit: [0.17, 0.64, 0.19],
    baseTemp: 9.5,
    baseHumidity: 82,
    summerMaxTemp: 32.5,
    summerHumidity: 48,
    patternScaling: 1.20,
    baseCaloriesDay: 3450,
    cropMix: { maize: 0.05, wheat: 0.85, rice: 0.0, soy: 0.10 },
    coastalExposureScore: 0.70,
    baseFertility: 1.60,
    baseMortality: 9.4,
    resilienceIndex: 0.87
  },
  {
    id: 'med_eu',
    name: 'Southern Europe (Iberia, Italy, Greece)',
    frenchName: 'Europe du Sud (Espagne, Italie, Grèce)',
    code: 'SEU',
    region: 'Europe',
    center: [8.0, 40.0],
    // Péninsule Ibérique + Botte Italienne & Sicile + Grèce
    pathSvg: `
      M 474,128 L 496,128 L 496,136 L 492,150 L 478,154 L 468,144 Z
      M 518,124 L 526,124 L 534,136 L 538,148 L 532,152 L 526,140 Z
      M 548,138 L 562,138 L 558,152 L 550,150 Z
    `,
    basePop2026: 132,
    baseCohortSplit: [0.13, 0.63, 0.24],
    baseTemp: 16.5,
    baseHumidity: 58,
    summerMaxTemp: 41.5,
    summerHumidity: 35,
    patternScaling: 1.45,
    baseCaloriesDay: 3400,
    cropMix: { maize: 0.25, wheat: 0.60, rice: 0.10, soy: 0.05 },
    coastalExposureScore: 0.60,
    baseFertility: 1.28,
    baseMortality: 10.8,
    resilienceIndex: 0.78
  },
  {
    id: 'eeu',
    name: 'Central & Eastern Europe',
    frenchName: 'Europe Centrale & Orientale',
    code: 'EEU',
    region: 'Europe',
    center: [22.0, 50.0],
    // Pologne, Tchéquie, Slovaquie, Hongrie, Roumanie, Balkans
    pathSvg: `
      M 532,100 L 564,98 L 572,122 L 562,138 L 548,138 L 534,124 L 534,106 Z
    `,
    basePop2026: 120,
    baseCohortSplit: [0.15, 0.65, 0.20],
    baseTemp: 8.8,
    baseHumidity: 72,
    summerMaxTemp: 35,
    summerHumidity: 45,
    patternScaling: 1.40,
    baseCaloriesDay: 3350,
    cropMix: { maize: 0.30, wheat: 0.55, rice: 0.0, soy: 0.15 },
    coastalExposureScore: 0.25,
    baseFertility: 1.45,
    baseMortality: 11.5,
    resilienceIndex: 0.72
  },
  {
    id: 'sca',
    name: 'Nordic Countries',
    frenchName: 'Pays Nordiques (Norvège, Suède, Finlande)',
    code: 'SCA',
    region: 'Europe',
    center: [16.0, 62.0],
    // Scandinavie : Fjords norvégiens, Suède, Finlande
    pathSvg: `
      M 514,64 L 536,58 L 562,64 L 558,92 L 542,96 L 526,94 L 520,78 Z
    `,
    basePop2026: 28,
    baseCohortSplit: [0.17, 0.63, 0.20],
    baseTemp: 4.5,
    baseHumidity: 78,
    summerMaxTemp: 28,
    summerHumidity: 50,
    patternScaling: 1.70,
    baseCaloriesDay: 3400,
    cropMix: { maize: 0.05, wheat: 0.85, rice: 0.0, soy: 0.10 },
    coastalExposureScore: 0.35,
    baseFertility: 1.58,
    baseMortality: 9.1,
    resilienceIndex: 0.92
  },
  {
    id: 'ukr',
    name: 'Ukraine & Black Sea Basin',
    frenchName: 'Ukraine & Bassin Pontique',
    code: 'UKR',
    region: 'Europe',
    center: [32.0, 49.0],
    // Ukraine, Biélorussie, Moldavie, Crimée
    pathSvg: `
      M 564,98 L 602,96 L 614,116 L 604,128 L 588,126 L 572,122 Z
    `,
    basePop2026: 52,
    baseCohortSplit: [0.15, 0.67, 0.18],
    baseTemp: 9.2,
    baseHumidity: 66,
    summerMaxTemp: 36.5,
    summerHumidity: 44,
    patternScaling: 1.45,
    baseCaloriesDay: 3100,
    cropMix: { maize: 0.40, wheat: 0.45, rice: 0.0, soy: 0.15 },
    coastalExposureScore: 0.30,
    baseFertility: 1.35,
    baseMortality: 12.8,
    resilienceIndex: 0.58
  },

  // ==========================================
  // --- EURASIE & RUSSIE ---
  // ==========================================
  {
    id: 'rus',
    name: 'Russian Federation',
    frenchName: 'Fédération de Russie',
    code: 'RUS',
    region: 'Eurasia',
    center: [75.0, 61.0],
    // Russie européenne, Sibérie, Kamtchatka jusqu'au Pacifique
    pathSvg: `
      M 562,64 L 602,60 L 670,54 L 750,56 L 820,58 L 890,62 L 910,82 L 892,104 L 848,110 L 784,118 L 712,118 L 642,114 L 602,96 L 564,98 Z
    `,
    basePop2026: 142,
    baseCohortSplit: [0.17, 0.67, 0.16],
    baseTemp: -3.5,
    baseHumidity: 72,
    summerMaxTemp: 32.5,
    summerHumidity: 50,
    patternScaling: 1.95,
    baseCaloriesDay: 3350,
    cropMix: { maize: 0.10, wheat: 0.75, rice: 0.05, soy: 0.10 },
    coastalExposureScore: 0.20,
    baseFertility: 1.52,
    baseMortality: 12.9,
    resilienceIndex: 0.68
  },

  // ==========================================
  // --- MOYEN-ORIENT & AFRIQUE DU NORD ---
  // ==========================================
  {
    id: 'tur',
    name: 'Turkey',
    frenchName: 'Turquie',
    code: 'TUR',
    region: 'MiddleEast',
    center: [35.0, 39.0],
    // Péninsule anatolienne, mer Noire et Méditerranée
    pathSvg: `
      M 576,134 L 618,132 L 624,146 L 596,148 L 574,146 Z
    `,
    basePop2026: 86,
    baseCohortSplit: [0.22, 0.68, 0.10],
    baseTemp: 13.8,
    baseHumidity: 56,
    summerMaxTemp: 39.5,
    summerHumidity: 36,
    patternScaling: 1.40,
    baseCaloriesDay: 3500,
    cropMix: { maize: 0.25, wheat: 0.65, rice: 0.05, soy: 0.05 },
    coastalExposureScore: 0.40,
    baseFertility: 1.88,
    baseMortality: 5.8,
    resilienceIndex: 0.64
  },
  {
    id: 'sau',
    name: 'Arabian Peninsula & Gulf',
    frenchName: 'Péninsule Arabique & Golfe',
    code: 'SAU',
    region: 'MiddleEast',
    center: [45.0, 24.0],
    // Arabie Saoudite, Émirats, Qatar, Oman, Yémen
    pathSvg: `
      M 598,168 L 624,166 L 642,176 L 646,198 L 634,212 L 614,214 L 602,192 Z
    `,
    basePop2026: 62,
    baseCohortSplit: [0.21, 0.75, 0.04],
    baseTemp: 28.5,
    baseHumidity: 48,
    summerMaxTemp: 44.0,
    summerHumidity: 30,
    patternScaling: 1.30,
    baseCaloriesDay: 3100,
    cropMix: { maize: 0.10, wheat: 0.70, rice: 0.20, soy: 0.0 },
    coastalExposureScore: 0.65,
    baseFertility: 2.15,
    baseMortality: 3.5,
    resilienceIndex: 0.65
  },
  {
    id: 'irn',
    name: 'Iran & Iraq',
    frenchName: 'Iran & Irak',
    code: 'IRN',
    region: 'MiddleEast',
    center: [54.0, 32.5],
    // Plateau iranien, Mésopotamie, golfe Persique
    pathSvg: `
      M 618,136 L 656,134 L 664,158 L 650,172 L 624,166 L 614,148 Z
    `,
    basePop2026: 135,
    baseCohortSplit: [0.24, 0.69, 0.07],
    baseTemp: 20.5,
    baseHumidity: 42,
    summerMaxTemp: 42.0,
    summerHumidity: 32,
    patternScaling: 1.35,
    baseCaloriesDay: 2950,
    cropMix: { maize: 0.20, wheat: 0.65, rice: 0.15, soy: 0.0 },
    coastalExposureScore: 0.35,
    baseFertility: 2.10,
    baseMortality: 5.5,
    resilienceIndex: 0.52
  },
  {
    id: 'nafr',
    name: 'North Africa & Maghreb',
    frenchName: 'Afrique du Nord & Maghreb',
    code: 'NAF',
    region: 'Africa',
    center: [14.0, 28.0],
    // Maroc, Algérie, Tunisie, Libye
    pathSvg: `
      M 466,154 L 500,152 L 536,152 L 568,154 L 566,188 L 496,188 L 460,182 Z
    `,
    basePop2026: 110,
    baseCohortSplit: [0.28, 0.64, 0.08],
    baseTemp: 23.5,
    baseHumidity: 45,
    summerMaxTemp: 41.0,
    summerHumidity: 28,
    patternScaling: 1.35,
    baseCaloriesDay: 3150,
    cropMix: { maize: 0.15, wheat: 0.75, rice: 0.05, soy: 0.05 },
    coastalExposureScore: 0.45,
    baseFertility: 2.30,
    baseMortality: 5.9,
    resilienceIndex: 0.50
  },
  {
    id: 'egy',
    name: 'Egypt & Nile Basin',
    frenchName: 'Égypte & Basse Vallée du Nil',
    code: 'EGY',
    region: 'Africa',
    center: [30.5, 26.5],
    // Égypte, Delta du Nil, Sinaï, mer Rouge
    pathSvg: `
      M 568,154 L 598,154 L 602,168 L 596,192 L 566,188 Z
    `,
    basePop2026: 115,
    baseCohortSplit: [0.32, 0.63, 0.05],
    baseTemp: 24.2,
    baseHumidity: 52,
    summerMaxTemp: 40.5,
    summerHumidity: 35,
    patternScaling: 1.25,
    baseCaloriesDay: 3200,
    cropMix: { maize: 0.30, wheat: 0.55, rice: 0.15, soy: 0.0 },
    coastalExposureScore: 0.95,
    baseFertility: 2.80,
    baseMortality: 5.8,
    resilienceIndex: 0.44
  },

  // ==========================================
  // --- AFRIQUE SUBSAHARIENNE ---
  // ==========================================
  {
    id: 'nga',
    name: 'Nigeria & West Africa',
    frenchName: 'Nigéria & Afrique de l\'Ouest',
    code: 'NGA',
    region: 'Africa',
    center: [8.0, 9.5],
    // Sahel ouest, Nigéria, Golfe de Guinée
    pathSvg: `
      M 458,192 L 526,190 L 536,218 L 520,240 L 468,236 L 452,216 Z
    `,
    basePop2026: 420,
    baseCohortSplit: [0.42, 0.55, 0.03],
    baseTemp: 27.5,
    baseHumidity: 78,
    summerMaxTemp: 37.0,
    summerHumidity: 55,
    patternScaling: 1.10,
    baseCaloriesDay: 2600,
    cropMix: { maize: 0.45, wheat: 0.10, rice: 0.35, soy: 0.10 },
    coastalExposureScore: 0.70,
    baseFertility: 4.80,
    baseMortality: 10.5,
    resilienceIndex: 0.32
  },
  {
    id: 'eth',
    name: 'Ethiopia & Horn of Africa',
    frenchName: 'Éthiopie & Corne de l\'Afrique',
    code: 'ETH',
    region: 'Africa',
    center: [40.0, 9.0],
    // Éthiopie, Somalie, Érythrée, Djibouti
    pathSvg: `
      M 588,194 L 622,196 L 642,214 L 626,242 L 588,236 L 582,212 Z
    `,
    basePop2026: 175,
    baseCohortSplit: [0.39, 0.57, 0.04],
    baseTemp: 23.0,
    baseHumidity: 55,
    summerMaxTemp: 33.5,
    summerHumidity: 50,
    patternScaling: 1.15,
    baseCaloriesDay: 2300,
    cropMix: { maize: 0.50, wheat: 0.35, rice: 0.05, soy: 0.10 },
    coastalExposureScore: 0.35,
    baseFertility: 4.10,
    baseMortality: 6.8,
    resilienceIndex: 0.28
  },
  {
    id: 'cod',
    name: 'Central Africa & Congo Basin',
    frenchName: 'Afrique Centrale (RDC, Bassin du Congo)',
    code: 'COD',
    region: 'Africa',
    center: [23.0, -2.5],
    // Bassin du Congo, RDC, Gabon, Cameroun
    pathSvg: `
      M 520,240 L 558,238 L 574,250 L 568,284 L 536,284 L 518,260 Z
    `,
    basePop2026: 180,
    baseCohortSplit: [0.44, 0.53, 0.03],
    baseTemp: 25.5,
    baseHumidity: 84,
    summerMaxTemp: 33.0,
    summerHumidity: 74,
    patternScaling: 1.05,
    baseCaloriesDay: 2150,
    cropMix: { maize: 0.50, wheat: 0.05, rice: 0.35, soy: 0.10 },
    coastalExposureScore: 0.25,
    baseFertility: 5.20,
    baseMortality: 11.8,
    resilienceIndex: 0.22
  },
  {
    id: 'eaf',
    name: 'East Africa (Kenya, Tanzania)',
    frenchName: 'Afrique de l\'Est (Kenya, Tanzanie)',
    code: 'EAF',
    region: 'Africa',
    center: [36.0, -4.0],
    // Kenya, Tanzanie, Ouganda, Grands Lacs
    pathSvg: `
      M 574,250 L 606,246 L 610,278 L 588,290 L 568,284 Z
    `,
    basePop2026: 145,
    baseCohortSplit: [0.39, 0.57, 0.04],
    baseTemp: 24.0,
    baseHumidity: 65,
    summerMaxTemp: 33.0,
    summerHumidity: 60,
    patternScaling: 1.15,
    baseCaloriesDay: 2250,
    cropMix: { maize: 0.60, wheat: 0.15, rice: 0.15, soy: 0.10 },
    coastalExposureScore: 0.40,
    baseFertility: 3.50,
    baseMortality: 6.5,
    resilienceIndex: 0.34
  },
  {
    id: 'zaf',
    name: 'Southern Africa',
    frenchName: 'Afrique Australe',
    code: 'ZAF',
    region: 'Africa',
    center: [25.0, -29.0],
    // Afrique du Sud, Namibie, Botswana, Zimbabwe, Mozambique + Madagascar
    pathSvg: `
      M 522,298 L 576,294 L 584,332 L 566,358 L 536,352 L 518,322 Z
      M 618,310 L 628,312 L 624,348 L 614,344 Z
    `,
    basePop2026: 95,
    baseCohortSplit: [0.29, 0.65, 0.06],
    baseTemp: 18.5,
    baseHumidity: 52,
    summerMaxTemp: 36.5,
    summerHumidity: 44,
    patternScaling: 1.30,
    baseCaloriesDay: 2850,
    cropMix: { maize: 0.65, wheat: 0.20, rice: 0.05, soy: 0.10 },
    coastalExposureScore: 0.40,
    baseFertility: 2.35,
    baseMortality: 9.8,
    resilienceIndex: 0.50
  },

  // ==========================================
  // --- ASIE DU SUD & ORIENTALE ---
  // ==========================================
  {
    id: 'ind',
    name: 'India & South Asia',
    frenchName: 'Inde & Asie du Sud',
    code: 'IND',
    region: 'Asia',
    center: [79.0, 21.0],
    // Sous-continent indien : Triangle du Deccan, Gujarat, côtes de Malabar et Coromandel + Sri Lanka
    pathSvg: `
      M 686,154 L 734,148 L 744,174 L 736,204 L 722,234 L 704,212 L 684,178 Z
      M 724,242 L 730,242 L 728,252 L 722,250 Z
    `,
    basePop2026: 1450,
    baseCohortSplit: [0.25, 0.68, 0.07],
    baseTemp: 24.8,
    baseHumidity: 70,
    summerMaxTemp: 40.0,
    summerHumidity: 42,
    patternScaling: 1.15,
    baseCaloriesDay: 2500,
    cropMix: { maize: 0.15, wheat: 0.40, rice: 0.40, soy: 0.05 },
    coastalExposureScore: 0.70,
    baseFertility: 2.00,
    baseMortality: 7.2,
    resilienceIndex: 0.46
  },
  {
    id: 'pak',
    name: 'Pakistan & Afghanistan',
    frenchName: 'Pakistan & Afghanistan',
    code: 'PAK',
    region: 'Asia',
    center: [68.0, 30.0],
    // Bassin de l'Indus, Baloutchistan, Hindou Kouch
    pathSvg: `
      M 660,136 L 696,134 L 694,166 L 674,176 L 656,164 Z
    `,
    basePop2026: 285,
    baseCohortSplit: [0.36, 0.60, 0.04],
    baseTemp: 22.5,
    baseHumidity: 46,
    summerMaxTemp: 42.0,
    summerHumidity: 36,
    patternScaling: 1.30,
    baseCaloriesDay: 2450,
    cropMix: { maize: 0.15, wheat: 0.65, rice: 0.15, soy: 0.05 },
    coastalExposureScore: 0.55,
    baseFertility: 3.35,
    baseMortality: 6.9,
    resilienceIndex: 0.35
  },
  {
    id: 'bgd',
    name: 'Bangladesh',
    frenchName: 'Bangladesh',
    code: 'BGD',
    region: 'Asia',
    center: [90.0, 23.8],
    // Delta du Gange-Brahmapoutre
    pathSvg: `
      M 744,174 L 758,172 L 756,188 L 744,188 Z
    `,
    basePop2026: 175,
    baseCohortSplit: [0.26, 0.68, 0.06],
    baseTemp: 25.8,
    baseHumidity: 79,
    summerMaxTemp: 34.5,
    summerHumidity: 70,
    patternScaling: 1.10,
    baseCaloriesDay: 2550,
    cropMix: { maize: 0.05, wheat: 0.10, rice: 0.82, soy: 0.03 },
    coastalExposureScore: 0.98,
    baseFertility: 1.90,
    baseMortality: 5.6,
    resilienceIndex: 0.38
  },
  {
    id: 'chn',
    name: 'China',
    frenchName: 'Chine',
    code: 'CHN',
    region: 'Asia',
    center: [105.0, 35.0],
    // Chine : Côtes du Pacifique, Shandong, delta du Yangtsé, Tibet, Mongolie intérieure
    pathSvg: `
      M 714,118 L 784,118 L 834,112 L 844,136 L 836,160 L 814,176 L 768,178 L 734,148 L 712,136 Z
      M 822,192 L 828,190 L 826,198 L 820,196 Z
    `,
    basePop2026: 1410,
    baseCohortSplit: [0.16, 0.70, 0.14],
    baseTemp: 8.5,
    baseHumidity: 64,
    summerMaxTemp: 35.5,
    summerHumidity: 52,
    patternScaling: 1.30,
    baseCaloriesDay: 3250,
    cropMix: { maize: 0.35, wheat: 0.30, rice: 0.28, soy: 0.07 },
    coastalExposureScore: 0.65,
    baseFertility: 1.15,
    baseMortality: 7.8,
    resilienceIndex: 0.75
  },
  {
    id: 'jpn',
    name: 'Japan & Korea',
    frenchName: 'Japon & Corée',
    code: 'JPN',
    region: 'Asia',
    center: [137.0, 36.5],
    // Archipel nippon (Honshu, Hokkaido, Kyushu) + Péninsule coréenne
    pathSvg: `
      M 860,132 L 884,124 L 892,142 L 868,154 Z
      M 844,128 L 852,126 L 852,142 L 844,138 Z
    `,
    basePop2026: 175,
    baseCohortSplit: [0.12, 0.58, 0.30],
    baseTemp: 12.0,
    baseHumidity: 70,
    summerMaxTemp: 33.0,
    summerHumidity: 65,
    patternScaling: 1.15,
    baseCaloriesDay: 2800,
    cropMix: { maize: 0.05, wheat: 0.15, rice: 0.70, soy: 0.10 },
    coastalExposureScore: 0.75,
    baseFertility: 1.10,
    baseMortality: 12.0,
    resilienceIndex: 0.88
  },
  {
    id: 'sea',
    name: 'Southeast Asia (VN, TH, MM, PH)',
    frenchName: 'Asie du Sud-Est & Philippines',
    code: 'SEA',
    region: 'Asia',
    center: [102.0, 15.0],
    // Péninsule indochinoise (Thaïlande, Vietnam, Birmanie) + Philippines
    pathSvg: `
      M 758,178 L 784,178 L 794,204 L 780,228 L 762,216 Z
      M 830,192 L 842,192 L 844,222 L 832,218 Z
    `,
    basePop2026: 410,
    baseCohortSplit: [0.24, 0.68, 0.08],
    baseTemp: 27.0,
    baseHumidity: 82,
    summerMaxTemp: 35.0,
    summerHumidity: 65,
    patternScaling: 1.05,
    baseCaloriesDay: 2800,
    cropMix: { maize: 0.15, wheat: 0.05, rice: 0.75, soy: 0.05 },
    coastalExposureScore: 0.85,
    baseFertility: 2.05,
    baseMortality: 6.3,
    resilienceIndex: 0.52
  },
  {
    id: 'idn',
    name: 'Indonesia & Malaysia',
    frenchName: 'Indonésie & Malaisie',
    code: 'IDN',
    region: 'Asia',
    center: [115.0, -2.0],
    // Archipel indonésien : Sumatra, Java, Bornéo, Célèbes, Papouasie
    pathSvg: `
      M 764,242 L 804,242 L 852,246 L 888,252 L 866,270 L 804,268 L 768,258 Z
    `,
    basePop2026: 315,
    baseCohortSplit: [0.25, 0.68, 0.07],
    baseTemp: 26.8,
    baseHumidity: 85,
    summerMaxTemp: 33.5,
    summerHumidity: 75,
    patternScaling: 1.05,
    baseCaloriesDay: 2750,
    cropMix: { maize: 0.20, wheat: 0.05, rice: 0.70, soy: 0.05 },
    coastalExposureScore: 0.90,
    baseFertility: 2.15,
    baseMortality: 6.7,
    resilienceIndex: 0.54
  },
  {
    id: 'casia',
    name: 'Central Asia & Steppes',
    frenchName: 'Asie Centrale & Steppes',
    code: 'CAS',
    region: 'Asia',
    center: [67.0, 46.0],
    // Kazakhstan, Ouzbékistan, Turkménistan, Mer Caspienne
    pathSvg: `
      M 624,116 L 712,118 L 714,136 L 664,136 L 624,134 Z
    `,
    basePop2026: 80,
    baseCohortSplit: [0.28, 0.65, 0.07],
    baseTemp: 7.5,
    baseHumidity: 52,
    summerMaxTemp: 41,
    summerHumidity: 30,
    patternScaling: 1.45,
    baseCaloriesDay: 3100,
    cropMix: { maize: 0.15, wheat: 0.75, rice: 0.05, soy: 0.05 },
    coastalExposureScore: 0.10,
    baseFertility: 2.60,
    baseMortality: 6.8,
    resilienceIndex: 0.56
  },

  // ==========================================
  // --- OCÉANIE ---
  // ==========================================
  {
    id: 'aus',
    name: 'Australia & New Zealand',
    frenchName: 'Australie & Nouvelle-Zélande',
    code: 'AUS',
    region: 'Oceania',
    center: [134.0, -25.0],
    // Île-continent Australie + Tasmanie + Nouvelle-Zélande
    pathSvg: `
      M 822,308 L 872,306 L 892,328 L 888,364 L 848,374 L 820,358 L 814,328 Z
      M 854,382 L 864,382 L 860,392 L 852,390 Z
      M 906,378 L 920,386 L 912,414 L 900,404 Z
    `,
    basePop2026: 32,
    baseCohortSplit: [0.18, 0.65, 0.17],
    baseTemp: 21.5,
    baseHumidity: 50,
    summerMaxTemp: 43,
    summerHumidity: 32,
    patternScaling: 1.25,
    baseCaloriesDay: 3500,
    cropMix: { maize: 0.10, wheat: 0.75, rice: 0.05, soy: 0.10 },
    coastalExposureScore: 0.55,
    baseFertility: 1.65,
    baseMortality: 7.0,
    resilienceIndex: 0.88
  }
];
