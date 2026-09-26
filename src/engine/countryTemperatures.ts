import cckpData from '../data/cckpCountryTemperatures.json';
import { COUNTRIES_DATA } from '../data/countriesData';
import { APP_2026_GLOBAL_ANOMALY_C, GLOBAL_TEMPERATURE_REFERENCE_1991_2020_C } from './temperatureReference';

type Metrics = { tas: number; tasmin: number; tasmax: number };
type CckpFile = {
  baseline: Record<string, Metrics>;
  future: Record<string, Record<string, Metrics>>;
};

const data = cckpData as CckpFile;
// Anomalies atteintes en 2100 par les trois scénarios internes standard; si la dynamique évolue, mettre à jour ces ancres avec la simulation de référence.
const POST_2100_GLOBAL_ANOMALY_ANCHORS: Record<string, number> = {
  bau: 2.41083138670827,
  sobriety: 2.1904169375126314,
  delayed: 2.2937210849784373
};

function getScenario(scenarioId?: string): string {
  // Correspondances de trajectoires; le scénario interne reste distinct des SSP complets du CMIP6.
  if (scenarioId === 'bau') return 'ssp585';
  if (scenarioId === 'sobriety') return 'ssp126';
  return 'ssp245';
}

function getCountryId(countryId: string): string {
  return ({ med_eu: 'seu', nafr: 'naf', casia: 'cas' } as Record<string, string>)[countryId] ?? countryId;
}

/**
 * Returns annual mean, mean of daily minima and mean of daily maxima.
 * CCKP climatology offsets are bias-adjusted to the app's 2026 local mean;
 * the change to 2080–2099 follows the selected CMIP6 pathway.
 */
export function getCountryTemperatures(
  countryId: string,
  baselineMetrics: Metrics,
  year: number,
  scenarioId?: string,
  globalTemperatureAnomaly?: number
): Metrics {
  const sourceId = getCountryId(countryId);
  const baseline = data.baseline[sourceId];
  const future = data.future[getScenario(scenarioId)]?.[sourceId];
  if (!baseline || !future) throw new Error(`Données CCKP manquantes pour la zone ${countryId}.`);

  // 2080–2099 is used as the late-century value at the app's 2100 endpoint.
  const fraction = Math.max(0, Math.min(1, (year - 2026) / 74));
  const country = COUNTRIES_DATA.find(row => row.id === countryId);
  const regionalScale = country?.patternScaling ?? 1;
  const referenceOffset = (APP_2026_GLOBAL_ANOMALY_C - GLOBAL_TEMPERATURE_REFERENCE_1991_2020_C) * regionalScale;
  const globalAnchor = POST_2100_GLOBAL_ANOMALY_ANCHORS[scenarioId ?? 'delayed'] ?? POST_2100_GLOBAL_ANOMALY_ANCHORS.delayed;
  const post2100Delta = year > 2100 && globalTemperatureAnomaly !== undefined
    ? Math.max(0, globalTemperatureAnomaly - globalAnchor) * regionalScale
    : 0;
  const blend = (key: keyof Metrics) => {
    const projectedChange = future[key] - baseline[key];
    return baselineMetrics[key] + referenceOffset + projectedChange * fraction + post2100Delta;
  };
  return { tas: blend('tas'), tasmin: blend('tasmin'), tasmax: blend('tasmax') };
}

/** CCKP late-century temperature change relative to its 2020–2039 baseline. */
export function getProjectedTemperatureDelta(
  countryId: string,
  variable: keyof Metrics,
  year: number,
  scenarioId?: string
): number {
  const sourceId = getCountryId(countryId);
  const baseline = data.baseline[sourceId];
  const future = data.future[getScenario(scenarioId)]?.[sourceId];
  if (!baseline || !future) throw new Error(`Données CCKP manquantes pour la zone ${countryId}.`);
  const fraction = Math.max(0, Math.min(1, (year - 2026) / 74));
  return (future[variable] - baseline[variable]) * fraction;
}

/** Reconstructs past annual min/max means using the same estimated local anomaly as tas. */
export function getHistoricalCountryTemperatures(
  countryId: string,
  mean: number,
  baselineMetrics: Metrics
): Metrics {
  const baseline = data.baseline[getCountryId(countryId)];
  if (!baseline) throw new Error(`Données CCKP manquantes pour la zone ${countryId}.`);
  const delta = mean - baselineMetrics.tas;
  return {
    tas: mean,
    tasmin: baselineMetrics.tasmin + delta,
    tasmax: baselineMetrics.tasmax + delta
  };
}
