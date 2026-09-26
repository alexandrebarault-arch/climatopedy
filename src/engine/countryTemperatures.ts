import cckpData from '../data/cckpCountryTemperatures.json';

type Metrics = { tas: number; tasmin: number; tasmax: number };
type CckpFile = {
  baseline: Record<string, Metrics>;
  future: Record<string, Record<string, Metrics>>;
};

const data = cckpData as CckpFile;

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
  baseMean: number,
  year: number,
  scenarioId?: string
): Metrics {
  const sourceId = getCountryId(countryId);
  const baseline = data.baseline[sourceId];
  const future = data.future[getScenario(scenarioId)]?.[sourceId];
  if (!baseline || !future) throw new Error(`Données CCKP manquantes pour la zone ${countryId}.`);

  // 2080–2099 is used as the late-century value at the app's 2100 endpoint.
  const fraction = Math.max(0, Math.min(1, (year - 2026) / 74));
  const blend = (key: keyof Metrics) => {
    const currentOffset = baseline[key] - baseline.tas;
    const projectedChange = future[key] - baseline[key];
    return baseMean + currentOffset + projectedChange * fraction;
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
  baseMean: number
): Metrics {
  const baseline = data.baseline[getCountryId(countryId)];
  if (!baseline) throw new Error(`Données CCKP manquantes pour la zone ${countryId}.`);
  const delta = mean - baseMean;
  return {
    tas: mean,
    tasmin: baseMean + (baseline.tasmin - baseline.tas) + delta,
    tasmax: baseMean + (baseline.tasmax - baseline.tas) + delta
  };
}
