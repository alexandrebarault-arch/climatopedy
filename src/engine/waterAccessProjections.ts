import projectionFile from '../data/householdWaterAccessProjections.json';
import aqueductFile from '../data/aqueductCountryWaterStress.json';
import { GEO_COUNTRY_FEATURES } from '../data/worldMapGeo';

export type ClimateScenarioId = 'bau' | 'delayed' | 'sobriety' | string;
export type WaterAccessProjection = {
  iso3: string;
  country: string;
  valuePct: number;
  populationWithAccessMillion: number;
  populationMillion: number;
  sourceYear: number;
  ssp: string;
  climateForcing: string;
  method: 'published' | 'nearest-published-horizon' | 'post-horizon-reference';
};
export type WaterAccessZoneProjection = {
  simCountryId: string;
  valuePct: number;
  coveredCountries: number;
  totalCountries: number;
  coveredPopulationMillion: number;
  sourceYear: number;
  ssp: string;
  climateForcing: string;
  method: 'population-weighted-country-estimates' | 'post-horizon-reference';
};
export type WaterStressProjection = {
  iso3: string;
  score: number;
  category: number;
  label: string;
  sourceYear: number;
  sourceScenario: 'opt' | 'bau' | 'pes';
  method: 'published-horizon' | 'post-horizon-risk-reference';
};

type ProjectionFile = typeof projectionFile;
type AqueductRow = (typeof aqueductFile.rows)[number];
const accessRows = (projectionFile as ProjectionFile).rows;
const accessYears = [...new Set(accessRows.map(row => row.year))].sort((a, b) => a - b);
const accessByKey = new Map(accessRows.map(row => [`${row.iso3}:${row.ssp}:${row.climateForcing}:${row.year}`, row]));
const waterStressByKey = new Map(aqueductFile.rows.map(row => [`${row.iso3}:${row.year}:${row.scenario}`, row]));

function accessScenario(scenarioId: ClimateScenarioId): { ssp: string; forcing: string } {
  if (scenarioId === 'sobriety') return { ssp: 'SSP1', forcing: 'RCP2.6' };
  if (scenarioId === 'delayed') return { ssp: 'SSP2', forcing: 'RCP6.0' };
  if (scenarioId === 'bau') return { ssp: 'SSP5', forcing: 'RCP6.0' };
  return { ssp: 'SSP5', forcing: 'RCP6.0' };
}

function closestYear(year: number, available: number[], maxDistance: number): number | null {
  const closest = available.reduce<number | null>((best, candidate) => {
    if (best === null || Math.abs(candidate - year) < Math.abs(best - year)) return candidate;
    return best;
  }, null);
  return closest !== null && Math.abs(closest - year) <= maxDistance ? closest : null;
}

export function getHouseholdWaterAccessProjection(
  iso3: string | null | undefined,
  year: number,
  scenarioId: ClimateScenarioId
): WaterAccessProjection | null {
  if (!iso3 || !Number.isFinite(year) || year < accessYears[0] || year > 2200) return null;
  const { ssp, forcing } = accessScenario(scenarioId);
  const lastPublishedYear = accessYears.at(-1) ?? 0;
  const postHorizon = year > lastPublishedYear;
  const sourceYear = postHorizon ? lastPublishedYear : closestYear(year, accessYears, 2);
  if (sourceYear === null) return null;
  const row = accessByKey.get(`${iso3}:${ssp}:${forcing}:${sourceYear}`);
  if (!row) return null;
  return {
    iso3,
    country: row.country,
    valuePct: row.improvedWaterAccessPct,
    populationWithAccessMillion: row.populationWithAccessMillion,
    populationMillion: row.populationMillion,
    sourceYear,
    ssp,
    climateForcing: forcing,
    method: postHorizon ? 'post-horizon-reference' : sourceYear === year ? 'published' : 'nearest-published-horizon'
  };
}

export function aggregateWaterAccessForZone(
  simCountryId: string,
  year: number,
  scenarioId: ClimateScenarioId
): WaterAccessZoneProjection | null {
  const features = GEO_COUNTRY_FEATURES.filter(feature => feature.simCountryId === simCountryId && feature.iso3);
  const memberIso3 = [...new Set(features.map(feature => feature.iso3!))];
  if (!memberIso3.length) return null;
  const projections = memberIso3.flatMap(iso3 => {
    const projection = getHouseholdWaterAccessProjection(iso3, year, scenarioId);
    return projection ? [projection] : [];
  });
  if (!projections.length) return null;
  const coveredPopulationMillion = projections.reduce((sum, row) => sum + row.populationMillion, 0);
  if (coveredPopulationMillion <= 0) return null;
  const withAccess = projections.reduce((sum, row) => sum + row.populationWithAccessMillion, 0);
  const { ssp, forcing } = accessScenario(scenarioId);
  return {
    simCountryId,
    valuePct: (withAccess / coveredPopulationMillion) * 100,
    coveredCountries: projections.length,
    totalCountries: memberIso3.length,
    coveredPopulationMillion,
    sourceYear: Math.min(...projections.map(row => row.sourceYear)),
    ssp,
    climateForcing: forcing,
    method: projections.every(row => row.method === 'post-horizon-reference')
      ? 'post-horizon-reference'
      : 'population-weighted-country-estimates'
  };
}

export function getWaterStressProjection(
  iso3: string | null | undefined,
  year: number,
  scenarioId: ClimateScenarioId
): WaterStressProjection | null {
  if (!iso3 || !Number.isFinite(year) || year > 2200) return null;
  const sourceScenario = scenarioId === 'sobriety' ? 'opt' : scenarioId === 'bau' ? 'pes' : 'bau';
  const postHorizon = year > 2080;
  const sourceYear = postHorizon ? 2080 : closestYear(year, [2030, 2050, 2080], 15);
  if (sourceYear === null) return null;
  const row = waterStressByKey.get(`${iso3}:${sourceYear}:${sourceScenario}`) as AqueductRow | undefined;
  return row ? {
    iso3, score: row.score, category: row.category, label: row.label, sourceYear, sourceScenario,
    method: postHorizon ? 'post-horizon-risk-reference' : 'published-horizon'
  } : null;
}

export function getWaterAccessSourceMetadata() {
  return projectionFile.metadata;
}
