export type MetricLayer = 
  | 'wet_bulb'       // Température au thermomètre mouillé Tw (Stull)
  | 'caloric_stress' // Déficit calorique & Rendements agricoles
  | 'mortality'      // Taux brut de surmortalité annuelle
  | 'population'     // Densité & dépopulation relative
  | 'sea_level'      // Impact montée des mers sur les plaines côtières
  | 'migration';     // Pression de répulsion migratoire

export interface DemographicCohorts {
  p0: number; // 0-14 ans (millions)
  p1: number; // 15-64 ans (millions)
  p2: number; // 65+ ans (millions)
  total: number;
}

export interface MortalityCauses {
  base: number;      // Décès naturels de base (millions/an)
  thermal: number;   // Dômes de chaleur humide létale (Tw > 31°C)
  famine: number;    // Famine & sous-nutrition (< 2100 kcal)
  sanitary: number;  // Rupture infrastructures médicales/eau
  total: number;     // Total décès annuels
}

export interface CountryStaticData {
  id: string;
  name: string;
  frenchName: string;
  code: string;       // ISO 3
  region: 'Americas' | 'Europe' | 'Asia' | 'Africa' | 'MiddleEast' | 'Oceania' | 'Eurasia';
  center: [number, number]; // [longitude, latitude]
  pathSvg: string;    // SVG path dans la projection Plate Carrée [-180..180, -90..90]
  basePop2026: number; // Millions
  baseCohortSplit: [number, number, number]; // [% 0-14, % 15-64, % 65+]
  baseTemp: number;   // Température moyenne annuelle (°C)
  baseHumidity: number; // Humidité relative moyenne annuelle (%)
  summerMaxTemp: number; // Hypothèse ponctuelle de canicule, pas une normale ou un record mesuré (°C)
  summerHumidity: number; // Humidité relative associée à l'hypothèse de canicule (%)
  patternScaling: number; // Multiplicateur de réchauffement régional vs mondial
  baseCaloriesDay: number; // Kcal/habitant/jour initial
  cropMix: {
    maize: number; // % importance
    wheat: number;
    rice: number;
    soy: number;
  };
  coastalExposureScore: number; // Sensibilité à l'élévation marine (0-1)
  baseFertility: number; // Enfants par femme
  baseMortality: number; // Taux de mortalité brut de base (décès / 1000 hab / an)
  resilienceIndex: number; // Capacité de climatisation / réserves (0 à 1)
}

export interface CountryDynamicState {
  id: string;
  cohorts: DemographicCohorts;
  dryBulbTemp: number;     // Température moyenne annuelle (°C)
  annualMinTemp: number;   // Moyenne annuelle des Tmin quotidiennes (°C)
  annualMaxTemp: number;   // Moyenne annuelle des Tmax quotidiennes (°C)
  summerMaxTemp: number;   // Température de pic caniculaire estival sous abri (°C)
  summerHumidity: number;  // Humidité relative estivale caniculaire (%)
  wetBulbTemp: number;     // Tw moyen annuel (°C)
  wetBulbPeak: number;     // Tw extrême lors des pics estivaux (°C)
  cropYieldFactor: number; // Facteur combiné (chaleur + intrants) (1.0 = normal)
  calPerCapita: number;    // Kcal / jour / hab
  calDeficitPct: number;   // % de déficit sous 2100 kcal
  mortalityRates: {
    base: number;
    thermal: number;
    famine: number;
    sanitary: number;
    total: number;
  };
  annualDeaths: MortalityCauses;
  annualBirths: number;
  fertilityActual: number;
  pushFactor: number;      // Pression d'émigration
  netMigration: number;    // Solde migratoire annuel (millions)
  borderClosure: number;   // Taux de blocage frontalier (0 = ouvert, 1 = bunkerisé)
  floodedArablePct: number;// % terres arables côtières perdues
}

export interface GlobalBiophysicalState {
  year: number;
  // Climat & Atmosphère (FaIR)
  carbonPools: [number, number, number, number]; // R0, R1, R2, R3 (GtC)
  cumulativeEmissions: number; // GtC depuis l'ère préindustrielle
  atmosphericCo2Ppm: number;   // ppm CO2
  radiativeForcing: number;    // W/m2
  surfaceTemperatureAnomaly: number; // °C au-dessus de préindustriel (T1)
  deepOceanTemperatureAnomaly: number; // °C (T2)
  seaLevelRiseMeters: number;  // Mètres (Vermeer-Rahmstorf)
  
  // Énergie & Métabolisme Industriel
  oilCumulativeBarrels: number; // Barils cumulés extraits
  oilAnnualExtraction: number;  // Barils extraits par an
  currentEroi: number;          // EROI au stade final
  netEnergyRatio: number;       // 1 - 1/EROI
  industrialCapitalIndex: number; // Indice de capital manufacturier mondial
  haberBoschNitrogenFactor: number; // Disponibilité des engrais azotés (0..1)
  
  // Démographie mondiale
  worldPopulation: number;      // Millions
  worldBirthsAnnual: number;    // Millions / an
  worldDeathsAnnual: MortalityCauses;
  
  // Agronomie mondiale
  globalCropYieldComposite: number; // 1.0 = baseline
  globalAverageCaloriesPerCapita: number; // Kcal/jour
  activeClimateRefugees: number; // Réfugiés en déplacement (millions)
  
  // États détaillés par pays
  countries: Record<string, CountryDynamicState>;
}

export interface MilestoneEvent {
  year: number;
  title: string;
  category: 'energy' | 'climate' | 'agri' | 'human';
  description: string;
}

export interface SimulationScenarioConfig {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  badgeColor: string;
  lineColor: string;
  dashArray?: string;
  // Variables biophysiques et de politique de redirection :
  oilDemandReductionRate: number; // % annuel de réduction planifiée de la demande fossile dès 2027 (0 = BAU, 4% = Sobriété)
  agroEcologyAdoptionRate: number; // % d'autonomie azotée biologique via légumineuses/agroécologie (0% = BAU, 65% = Sobriété)
  adaptationResilienceBoost: number; // Multiplicateur de résilience sociétale & climatisation passive (1.0 = standard, 1.8 = Sobriété)
  climateSensitivityECS: number; // Sensibilité climatique à l'équilibre (°C par doublement CO2, 3.0°C standard)
  ultimateReservesQinf: number; // Barils ultimes exploitables (2.80e12 par défaut)
}
