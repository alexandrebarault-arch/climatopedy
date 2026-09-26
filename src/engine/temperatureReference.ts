import nasaSeries from '../data/nasaGistempAnnualAnomalies.json';

type AnnualAnomaly = { year: number; anomaly: number };
type NasaAnomalyFile = { source: string; sourceUrl: string; accessed: string; rows: AnnualAnomaly[] };

const series = nasaSeries as NasaAnomalyFile;
const anomalyByYear = new Map(series.rows.map(row => [row.year, row.anomaly]));
const NASA_2025_ANOMALY = anomalyByYear.get(2025);
if (NASA_2025_ANOMALY === undefined) throw new Error('La série NASA GISTEMP doit contenir l’année 2025.');

// Recalage explicite sur l’ancre 2025 de l’application, conservée pour le raccord avec le scénario 2026.
export const APP_2025_GLOBAL_ANOMALY_C = 1.3183333333333334;
export const APP_2026_GLOBAL_ANOMALY_C = 1.34;
const nasaToAppOffset = APP_2025_GLOBAL_ANOMALY_C - NASA_2025_ANOMALY;

export function getAnnualGlobalTemperatureAnomaly(year: number): number {
  const value = anomalyByYear.get(year);
  if (value === undefined) throw new Error(`Anomalie annuelle NASA GISTEMP absente pour ${year}.`);
  return value + nasaToAppOffset;
}

export const GLOBAL_TEMPERATURE_REFERENCE_1991_2020_C = Array.from(
  { length: 30 },
  (_, index) => getAnnualGlobalTemperatureAnomaly(1991 + index)
).reduce((sum, value) => sum + value, 0) / 30;

export const NASA_GISTEMP_PROVENANCE = {
  source: series.source,
  sourceUrl: series.sourceUrl,
  accessed: series.accessed
};
