import hazardData from '../data/cckpHeatHazardProjections.json';
import { COUNTRIES_DATA } from '../data/countriesData';
import { APP_2026_GLOBAL_ANOMALY_C, GLOBAL_TEMPERATURE_REFERENCE_1991_2020_C, getPost2100GlobalWarmingDelta, POST_2100_GLOBAL_ANOMALY_ANCHORS } from './temperatureReference';

type PeriodMetrics = { txx: number; hurs: number[] };
type ZoneMetrics = { baseline: PeriodMetrics; future: Record<string, PeriodMetrics> };
type HazardFile = { zones: Record<string, ZoneMetrics> };

const cckp = hazardData as HazardFile;
const MIN_PHYSICAL_HUMIDITY_PCT = 0;
const MAX_PHYSICAL_HUMIDITY_PCT = 100;

function scenarioKey(scenarioId?: string): string {
  if (scenarioId === 'bau') return 'ssp585';
  if (scenarioId === 'sobriety') return 'ssp126';
  return 'ssp245';
}

function meanWarmSeasonHumidity(values: number[], months: number[]): number {
  if (!months.length) throw new Error('La saison chaude ne contient aucun mois.');
  const selected = months.map(month => values[month - 1]);
  if (selected.some(value => !Number.isFinite(value))) throw new Error(`Données Hurs manquantes pour les mois ${months.join(',')}.`);
  return selected.reduce((sum, value) => sum + value, 0) / selected.length;
}

export interface HeatHazardProjectionInput {
  countryId: string;
  referenceP99C: number;
  referenceHumidityPct: number;
  warmSeasonMonths: number[];
  year: number;
  scenarioId?: string;
  globalTemperatureAnomaly?: number;
}

export interface HeatHazardProjection {
  p99C: number;
  humidityPct: number;
  method: 'baseline' | 'cmip6-delta' | 'post2100-extrapolation';
}

/**
 * Projects the site’s local hot-season P99 and hot-day RH using CCKP changes.
 * TXx is an extreme-temperature delta proxy for the P99, not a P99 projection.
 * Warm-season Hurs monthly deltas are applied to the local hot-day RH estimate;
 * this is a scenario hypothesis because CCKP Hurs is not humidity coincident with a P99 hot day.
 */
export function projectHeatHazard(input: HeatHazardProjectionInput): HeatHazardProjection {
  const zone = cckp.zones[input.countryId];
  const country = COUNTRIES_DATA.find(row => row.id === input.countryId);
  if (!zone || !country) throw new Error(`Données CCKP TXx/Hurs manquantes pour ${input.countryId}.`);
  const pathway = scenarioKey(input.scenarioId);
  const future = zone.future[pathway];
  if (!future) throw new Error(`Projection CCKP ${pathway} manquante pour ${input.countryId}.`);

  const fraction = Math.max(0, Math.min(1, (input.year - 2026) / 74));
  const referenceOffset = (APP_2026_GLOBAL_ANOMALY_C - GLOBAL_TEMPERATURE_REFERENCE_1991_2020_C) * country.patternScaling;
  const txxDelta = future.txx - zone.baseline.txx;
  const humidityDelta = meanWarmSeasonHumidity(future.hurs, input.warmSeasonMonths)
    - meanWarmSeasonHumidity(zone.baseline.hurs, input.warmSeasonMonths);
  const extraGlobalWarming = getPost2100GlobalWarmingDelta(input.year, input.scenarioId, input.globalTemperatureAnomaly);
  const globalWarmingTo2100 = Math.max(0.01, (POST_2100_GLOBAL_ANOMALY_ANCHORS[input.scenarioId ?? 'delayed'] ?? POST_2100_GLOBAL_ANOMALY_ANCHORS.delayed) - APP_2026_GLOBAL_ANOMALY_C);
  const post2100HumidityDelta = extraGlobalWarming > 0 ? humidityDelta * (extraGlobalWarming / globalWarmingTo2100) : 0;

  return {
    p99C: input.referenceP99C + referenceOffset + (txxDelta * fraction) + (extraGlobalWarming * country.patternScaling),
    // Preserve the projected RH. Stull's 5–99% domain is a limit on Tw calculation,
    // not a justification for replacing out-of-domain humidity with 5% or 99%.
    humidityPct: Math.max(MIN_PHYSICAL_HUMIDITY_PCT, Math.min(MAX_PHYSICAL_HUMIDITY_PCT, input.referenceHumidityPct + (humidityDelta * fraction) + post2100HumidityDelta)),
    method: input.year > 2100 ? 'post2100-extrapolation' : input.year === 2026 ? 'baseline' : 'cmip6-delta'
  };
}
