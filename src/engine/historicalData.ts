import { COUNTRIES_DATA } from '../data/countriesData';
import {
  CountryDynamicState,
  GlobalBiophysicalState,
  MortalityCauses,
  DemographicCohorts
} from '../types/simulation';
import { calculateWetBulbStull } from './physicsModel';
import { getHistoricalCountryTemperatures } from './countryTemperatures';

export interface HistoricalBenchmark {
  year: number;
  worldPopulation: number; // Millions
  atmosphericCo2Ppm: number;
  surfaceTemperatureAnomaly: number; // °C vs préindustriel (1850-1900)
  seaLevelRiseMeters: number; // Mètres vs référence 2000 (0.12 m en 2026)
  currentEroi: number; // Barils obtenus pour 1 baril dépensé à forer
  haberBoschNitrogenFactor: number; // Disponibilité engrais de synthèse (0..1)
  worldDeathsTotal: number; // Millions / an
  worldDeathsFamine: number; // Millions / an
  worldDeathsThermal: number; // Millions / an
  globalAverageCaloriesPerCapita: number; // Kcal/habitant/jour
  globalCropYieldComposite: number; // 1.0 en 2026
}

// Série mixte : observations mondiales sourcées et paramètres internes; chaque variable doit conserver son périmètre et sa source.
export const HISTORICAL_BENCHMARKS: HistoricalBenchmark[] = [
  {
    year: 1900,
    worldPopulation: 1650,
    atmosphericCo2Ppm: 296,
    surfaceTemperatureAnomaly: -0.08,
    seaLevelRiseMeters: -0.10, // ~22 cm plus bas qu'en 2026 (-10 cm vs 2000)
    currentEroi: 100.0, // Jaillissements spontanés de Spindletop
    haberBoschNitrogenFactor: 0.00, // Non inventé (Haber 1909, Bosch 1913)
    worldDeathsTotal: 42.0,
    worldDeathsFamine: 1.8,
    worldDeathsThermal: 0.02,
    globalAverageCaloriesPerCapita: 2180,
    globalCropYieldComposite: 0.32
  },
  {
    year: 1910,
    worldPopulation: 1750,
    atmosphericCo2Ppm: 300,
    surfaceTemperatureAnomaly: -0.22,
    seaLevelRiseMeters: -0.09,
    currentEroi: 95.0,
    haberBoschNitrogenFactor: 0.00,
    worldDeathsTotal: 44.0,
    worldDeathsFamine: 1.9,
    worldDeathsThermal: 0.02,
    globalAverageCaloriesPerCapita: 2200,
    globalCropYieldComposite: 0.34
  },
  {
    year: 1920,
    worldPopulation: 1860,
    atmosphericCo2Ppm: 303,
    surfaceTemperatureAnomaly: -0.15,
    seaLevelRiseMeters: -0.08,
    currentEroi: 90.0,
    haberBoschNitrogenFactor: 0.03, // Premières usines BASF Oppau
    worldDeathsTotal: 46.0,
    worldDeathsFamine: 2.0,
    worldDeathsThermal: 0.03,
    globalAverageCaloriesPerCapita: 2220,
    globalCropYieldComposite: 0.36
  },
  {
    year: 1930,
    worldPopulation: 2070,
    atmosphericCo2Ppm: 307,
    surfaceTemperatureAnomaly: -0.05,
    seaLevelRiseMeters: -0.07,
    currentEroi: 80.0,
    haberBoschNitrogenFactor: 0.06,
    worldDeathsTotal: 48.0,
    worldDeathsFamine: 2.1,
    worldDeathsThermal: 0.04,
    globalAverageCaloriesPerCapita: 2250,
    globalCropYieldComposite: 0.40
  },
  {
    year: 1940,
    worldPopulation: 2300,
    atmosphericCo2Ppm: 311,
    surfaceTemperatureAnomaly: 0.10,
    seaLevelRiseMeters: -0.06,
    currentEroi: 70.0,
    haberBoschNitrogenFactor: 0.09,
    worldDeathsTotal: 52.0,
    worldDeathsFamine: 2.5,
    worldDeathsThermal: 0.05,
    globalAverageCaloriesPerCapita: 2260,
    globalCropYieldComposite: 0.44
  },
  {
    year: 1950,
    worldPopulation: 2536,
    atmosphericCo2Ppm: 311,
    surfaceTemperatureAnomaly: -0.02,
    seaLevelRiseMeters: -0.05,
    currentEroi: 60.0,
    haberBoschNitrogenFactor: 0.15, // Début Révolution Verte de Borlaug
    worldDeathsTotal: 48.0,
    worldDeathsFamine: 1.6,
    worldDeathsThermal: 0.05,
    globalAverageCaloriesPerCapita: 2320,
    globalCropYieldComposite: 0.50
  },
  {
    year: 1960,
    worldPopulation: 3034,
    atmosphericCo2Ppm: 317,
    surfaceTemperatureAnomaly: 0.03,
    seaLevelRiseMeters: -0.04,
    currentEroi: 50.0,
    haberBoschNitrogenFactor: 0.32,
    worldDeathsTotal: 46.0,
    worldDeathsFamine: 2.1,
    worldDeathsThermal: 0.06,
    globalAverageCaloriesPerCapita: 2400,
    globalCropYieldComposite: 0.60
  },
  {
    year: 1970,
    worldPopulation: 3700,
    atmosphericCo2Ppm: 326,
    surfaceTemperatureAnomaly: 0.05,
    seaLevelRiseMeters: -0.03,
    currentEroi: 40.0,
    haberBoschNitrogenFactor: 0.52,
    worldDeathsTotal: 45.5,
    worldDeathsFamine: 1.2,
    worldDeathsThermal: 0.08,
    globalAverageCaloriesPerCapita: 2510,
    globalCropYieldComposite: 0.70
  },
  {
    year: 1980,
    worldPopulation: 4458,
    atmosphericCo2Ppm: 339,
    surfaceTemperatureAnomaly: 0.26,
    seaLevelRiseMeters: -0.02,
    currentEroi: 30.0,
    haberBoschNitrogenFactor: 0.70,
    worldDeathsTotal: 47.0,
    worldDeathsFamine: 0.8,
    worldDeathsThermal: 0.12,
    globalAverageCaloriesPerCapita: 2600,
    globalCropYieldComposite: 0.78
  },
  {
    year: 1990,
    worldPopulation: 5327,
    atmosphericCo2Ppm: 354,
    surfaceTemperatureAnomaly: 0.44,
    seaLevelRiseMeters: -0.01,
    currentEroi: 24.0,
    haberBoschNitrogenFactor: 0.82,
    worldDeathsTotal: 50.0,
    worldDeathsFamine: 0.7,
    worldDeathsThermal: 0.18,
    globalAverageCaloriesPerCapita: 2700,
    globalCropYieldComposite: 0.84
  },
  {
    year: 2000,
    worldPopulation: 6143,
    atmosphericCo2Ppm: 369,
    surfaceTemperatureAnomaly: 0.62,
    seaLevelRiseMeters: 0.00, // Référence 2000
    currentEroi: 19.0,
    haberBoschNitrogenFactor: 0.90,
    worldDeathsTotal: 53.0,
    worldDeathsFamine: 0.8,
    worldDeathsThermal: 0.25,
    globalAverageCaloriesPerCapita: 2790,
    globalCropYieldComposite: 0.90
  },
  {
    year: 2010,
    worldPopulation: 6956,
    atmosphericCo2Ppm: 390,
    surfaceTemperatureAnomaly: 0.93,
    seaLevelRiseMeters: 0.05,
    currentEroi: 15.0,
    haberBoschNitrogenFactor: 0.95,
    worldDeathsTotal: 55.0,
    worldDeathsFamine: 0.9,
    worldDeathsThermal: 0.35,
    globalAverageCaloriesPerCapita: 2880,
    globalCropYieldComposite: 0.95
  },
  {
    year: 2020,
    worldPopulation: 7790,
    atmosphericCo2Ppm: 414,
    surfaceTemperatureAnomaly: 1.21,
    seaLevelRiseMeters: 0.09,
    currentEroi: 13.0,
    haberBoschNitrogenFactor: 0.98,
    worldDeathsTotal: 58.5,
    worldDeathsFamine: 1.0,
    worldDeathsThermal: 0.44,
    globalAverageCaloriesPerCapita: 2930,
    globalCropYieldComposite: 0.98
  },
  {
    year: 2026,
    worldPopulation: 7597, // Somme de départ des 34 zones de COUNTRIES_DATA (millions)
    atmosphericCo2Ppm: 425.6,
    surfaceTemperatureAnomaly: 1.34,
    seaLevelRiseMeters: 0.12,
    currentEroi: 12.0,
    haberBoschNitrogenFactor: 1.00,
    worldDeathsTotal: 60.5,
    worldDeathsFamine: 1.2,
    worldDeathsThermal: 0.50,
    globalAverageCaloriesPerCapita: 2950,
    globalCropYieldComposite: 1.00
  }
];

/**
 * Interpole les valeurs historiques pour une année donnée entre 1900 et 2026
 */
export function getInterpolatedHistoricalBenchmark(year: number): HistoricalBenchmark {
  if (year <= 1900) return HISTORICAL_BENCHMARKS[0];
  if (year >= 2026) return HISTORICAL_BENCHMARKS[HISTORICAL_BENCHMARKS.length - 1];

  let lower = HISTORICAL_BENCHMARKS[0];
  let upper = HISTORICAL_BENCHMARKS[1];

  for (let i = 0; i < HISTORICAL_BENCHMARKS.length - 1; i++) {
    if (year >= HISTORICAL_BENCHMARKS[i].year && year <= HISTORICAL_BENCHMARKS[i + 1].year) {
      lower = HISTORICAL_BENCHMARKS[i];
      upper = HISTORICAL_BENCHMARKS[i + 1];
      break;
    }
  }

  const fraction = (year - lower.year) / (upper.year - lower.year);
  const lerp = (a: number, b: number) => a + fraction * (b - a);

  return {
    year,
    worldPopulation: lerp(lower.worldPopulation, upper.worldPopulation),
    atmosphericCo2Ppm: lerp(lower.atmosphericCo2Ppm, upper.atmosphericCo2Ppm),
    surfaceTemperatureAnomaly: lerp(lower.surfaceTemperatureAnomaly, upper.surfaceTemperatureAnomaly),
    seaLevelRiseMeters: lerp(lower.seaLevelRiseMeters, upper.seaLevelRiseMeters),
    currentEroi: lerp(lower.currentEroi, upper.currentEroi),
    haberBoschNitrogenFactor: lerp(lower.haberBoschNitrogenFactor, upper.haberBoschNitrogenFactor),
    worldDeathsTotal: lerp(lower.worldDeathsTotal, upper.worldDeathsTotal),
    worldDeathsFamine: lerp(lower.worldDeathsFamine, upper.worldDeathsFamine),
    worldDeathsThermal: lerp(lower.worldDeathsThermal, upper.worldDeathsThermal),
    globalAverageCaloriesPerCapita: lerp(lower.globalAverageCaloriesPerCapita, upper.globalAverageCaloriesPerCapita),
    globalCropYieldComposite: lerp(lower.globalCropYieldComposite, upper.globalCropYieldComposite)
  };
}

/**
 * Construit un état biophysique complet pour une année historique (1900..2025)
 */
export function generateHistoricalState(year: number): GlobalBiophysicalState {
  const b = getInterpolatedHistoricalBenchmark(year);
  const netEnergyRatio = Math.max(0.01, 1.0 - (1.0 / b.currentEroi));

  // Les effectifs historiques des zones sont reconstruits par mise à l'échelle de la série mondiale,
  // faute de séries historiques propres à chaque zone; ce ne sont pas des observations zonales.
  const popRatio = b.worldPopulation / 7600;

  // Anomalie thermique historique par rapport au repère de départ 2026 (+1.34°C, moyenne 2025)
  const deltaTempVs2026 = b.surfaceTemperatureAnomaly - 1.34;

  const countryStates: Record<string, CountryDynamicState> = {};

  COUNTRIES_DATA.forEach(c => {
    const countryPop = c.basePop2026 * popRatio;
    const p0 = countryPop * c.baseCohortSplit[0];
    const p1 = countryPop * c.baseCohortSplit[1];
    const p2 = countryPop * c.baseCohortSplit[2];

    const dryBulb = c.baseTemp + deltaTempVs2026 * c.patternScaling;
    const temperatures = getHistoricalCountryTemperatures(c.id, dryBulb, c.baseTemp);
    const summerMax = c.summerMaxTemp + deltaTempVs2026 * c.patternScaling;
    const wetBulb = calculateWetBulbStull(dryBulb, c.baseHumidity);
    const wetBulbPeak = calculateWetBulbStull(summerMax, c.summerHumidity);

    const baseMortalityRate = c.baseMortality / 1000.0;
    const annualDeaths: MortalityCauses = {
      base: countryPop * baseMortalityRate,
      thermal: (b.worldDeathsThermal / 7600) * countryPop,
      famine: (b.worldDeathsFamine / 7600) * countryPop,
      sanitary: 0.0003 * countryPop,
      total: countryPop * baseMortalityRate + ((b.worldDeathsThermal + b.worldDeathsFamine) / 7600) * countryPop
    };

    const cohorts: DemographicCohorts = { p0, p1, p2, total: countryPop };

    countryStates[c.id] = {
      id: c.id,
      cohorts,
      dryBulbTemp: dryBulb,
      annualMinTemp: temperatures.tasmin,
      annualMaxTemp: temperatures.tasmax,
      summerMaxTemp: summerMax,
      summerHumidity: c.summerHumidity,
      wetBulbTemp: wetBulb,
      wetBulbPeak,
      cropYieldFactor: b.globalCropYieldComposite,
      calPerCapita: c.baseCaloriesDay * (b.globalAverageCaloriesPerCapita / 2950),
      calDeficitPct: 0,
      mortalityRates: {
        base: baseMortalityRate,
        thermal: (b.worldDeathsThermal / b.worldPopulation),
        famine: (b.worldDeathsFamine / b.worldPopulation),
        sanitary: 0.0003,
        total: annualDeaths.total / countryPop
      },
      annualDeaths,
      annualBirths: p1 * 0.49 * (c.baseFertility / 28.0),
      fertilityActual: c.baseFertility * (year < 1970 ? 1.4 : 1.0),
      pushFactor: 0.02,
      netMigration: 0,
      borderClosure: 0.05,
      floodedArablePct: 0
    };
  });

  return {
    year,
    carbonPools: [60, 40, 20, 5],
    cumulativeEmissions: 100 + (year - 1900) * 4.6,
    atmosphericCo2Ppm: b.atmosphericCo2Ppm,
    radiativeForcing: 5.35 * Math.log(b.atmosphericCo2Ppm / 278.0),
    surfaceTemperatureAnomaly: b.surfaceTemperatureAnomaly,
    deepOceanTemperatureAnomaly: b.surfaceTemperatureAnomaly * 0.35,
    seaLevelRiseMeters: b.seaLevelRiseMeters,
    oilCumulativeBarrels: (year - 1900) * 1.15e10,
    oilAnnualExtraction: Math.max(1e8, (year - 1900) * 2.8e8),
    currentEroi: b.currentEroi,
    netEnergyRatio,
    industrialCapitalIndex: Math.max(0.1, (year - 1900) / 126),
    haberBoschNitrogenFactor: b.haberBoschNitrogenFactor,
    worldPopulation: b.worldPopulation,
    worldBirthsAnnual: (b.worldPopulation * 0.035),
    worldDeathsAnnual: {
      base: b.worldDeathsTotal - (b.worldDeathsFamine + b.worldDeathsThermal + 0.3),
      thermal: b.worldDeathsThermal,
      famine: b.worldDeathsFamine,
      sanitary: 0.3,
      total: b.worldDeathsTotal
    },
    globalCropYieldComposite: b.globalCropYieldComposite,
    globalAverageCaloriesPerCapita: b.globalAverageCaloriesPerCapita,
    activeClimateRefugees: 0.2,
    countries: countryStates
  };
}
