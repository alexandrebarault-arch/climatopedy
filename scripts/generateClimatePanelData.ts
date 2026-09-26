import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildClimatePanelRow } from '../src/engine/buildClimatePanelRow';
import { summarizePowerDailySeries, PowerDailyClimateSample } from '../src/engine/climatePanelMath';
import { nearestLandCoordinate } from '../src/engine/representativeLandPoints';
import { getVerifiedZoneRecord, VERIFIED_TEMPERATURE_RECORDS } from '../src/data/verifiedTemperatureRecords';
import { CLIMATE_ZONE_METADATA } from '../src/data/climateZoneMetadata';
import { COUNTRIES_DATA } from '../src/data/countriesData';
import { ClimatePanelFile } from '../src/types/climatePanel';

const API_URL = 'https://power.larc.nasa.gov/api/temporal/daily/point';
const REFERENCE_START = '19910101';
const REFERENCE_END = '20201231';
const EXPECTED_DAILY_COUNT = 10_958;
const OUTPUT_PATH = resolve('src/data/climatePanelData.json');

export interface NormalizedPowerDailySeries {
  daily: PowerDailyClimateSample[];
  longitude: number;
  latitude: number;
  elevationM: number;
  sources: string[];
  timeStandard: string;
}

function parameterValues(parameters: Record<string, unknown>, name: string, dates: string[], fillValue: number): number[] {
  const series = parameters[name];
  if (!series || typeof series !== 'object') throw new Error(`NASA POWER response is missing ${name}.`);
  const values = series as Record<string, unknown>;
  return dates.map(date => {
    const value = values[date];
    if (typeof value !== 'number' || !Number.isFinite(value) || value === fillValue) {
      throw new Error(`NASA POWER ${name} has missing or invalid data on ${date}.`);
    }
    return value;
  });
}

/** Validates all daily MERRA-2 fields and source metadata before deriving metrics. */
export function normalizePowerDailyResponse(
  payload: unknown,
  expected: { expectedDailyCount?: number; startDate?: string; endDate?: string } = {}
): NormalizedPowerDailySeries {
  const expectedDailyCount = expected.expectedDailyCount ?? EXPECTED_DAILY_COUNT;
  const expectedStart = expected.startDate ?? REFERENCE_START;
  const expectedEnd = expected.endDate ?? REFERENCE_END;
  if (!payload || typeof payload !== 'object') throw new Error('NASA POWER response must be a JSON object.');
  const response = payload as Record<string, unknown>;
  const geometry = response.geometry as { coordinates?: unknown } | undefined;
  const header = response.header as Record<string, unknown> | undefined;
  const properties = response.properties as { parameter?: unknown } | undefined;
  const parameterObject = properties?.parameter;
  if (!geometry || !Array.isArray(geometry.coordinates) || !header || !parameterObject || typeof parameterObject !== 'object') {
    throw new Error('NASA POWER response is missing geometry, header, or parameter data.');
  }
  const [longitude, latitude, elevationM] = geometry.coordinates;
  if (![longitude, latitude, elevationM].every(value => typeof value === 'number' && Number.isFinite(value))) {
    throw new Error('NASA POWER response has invalid coordinates or elevation.');
  }

  const sources = header.sources;
  const timeStandard = header.time_standard;
  const fillValue = header.fill_value;
  if (!Array.isArray(sources) || !sources.includes('MERRA2') || typeof timeStandard !== 'string' || typeof fillValue !== 'number') {
    throw new Error('NASA POWER response does not identify MERRA-2, time standard, and fill value.');
  }

  const parameters = parameterObject as Record<string, unknown>;
  const meanSeries = parameters.T2M;
  if (!meanSeries || typeof meanSeries !== 'object') throw new Error('NASA POWER response is missing T2M.');
  const dates = Object.keys(meanSeries as Record<string, unknown>).sort();
  if (dates.length !== expectedDailyCount || dates[0] !== expectedStart || dates[dates.length - 1] !== expectedEnd) {
    throw new Error(`NASA POWER daily coverage/count mismatch: expected ${expectedDailyCount} complete days from ${expectedStart} through ${expectedEnd}, got ${dates.length}.`);
  }
  const mean = parameterValues(parameters, 'T2M', dates, fillValue);
  const dewPoint = parameterValues(parameters, 'T2MDEW', dates, fillValue);
  const maximum = parameterValues(parameters, 'T2M_MAX', dates, fillValue);
  const minimum = parameterValues(parameters, 'T2M_MIN', dates, fillValue);
  const daily = dates.map((date, index) => {
    if (!/^\d{8}$/.test(date)) throw new Error(`NASA POWER returned an invalid date key: ${date}.`);
    if (minimum[index] > maximum[index]) throw new Error(`NASA POWER Tmin exceeds Tmax on ${date}.`);
    return {
      date: `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`,
      meanC: mean[index],
      dewPointC: dewPoint[index],
      maxC: maximum[index],
      minC: minimum[index]
    };
  });
  return { daily, longitude, latitude, elevationM, sources: sources as string[], timeStandard };
}

async function fetchPowerDailySeries(latitude: number, longitude: number): Promise<NormalizedPowerDailySeries> {
  const url = new URL(API_URL);
  url.search = new URLSearchParams({
    parameters: 'T2M,T2MDEW,T2M_MAX,T2M_MIN',
    community: 'RE',
    longitude: String(longitude),
    latitude: String(latitude),
    start: REFERENCE_START,
    end: REFERENCE_END,
    format: 'JSON',
    'time-standard': 'LST'
  }).toString();

  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(120_000) });
      if (!response.ok) throw new Error(`NASA POWER returned HTTP ${response.status}.`);
      return normalizePowerDailyResponse(await response.json());
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise(resolveDelay => setTimeout(resolveDelay, attempt * 1500));
    }
  }
  throw new Error(`NASA POWER request failed for ${latitude},${longitude}: ${String(lastError)}`);
}

export async function generateClimatePanelRows(onProgress: (message: string) => void = () => undefined): Promise<ClimatePanelFile> {
  const generatedAt = new Date().toISOString();
  const rows = [];
  const countriesById = new Map(COUNTRIES_DATA.map(country => [country.id, country]));
  const zoneIds = Object.keys(CLIMATE_ZONE_METADATA).sort();
  if (zoneIds.length !== COUNTRIES_DATA.length || zoneIds.some((id, index) => id !== [...countriesById.keys()].sort()[index])) {
    throw new Error('Climate zone metadata does not cover exactly COUNTRIES_DATA.');
  }

  for (const country of COUNTRIES_DATA) {
    const zone = CLIMATE_ZONE_METADATA[country.id as keyof typeof CLIMATE_ZONE_METADATA];
    if (!zone) throw new Error(`Missing zone metadata for ${country.id}.`);
    const [longitude, latitude] = zone.representativeCoordinates;
    const [sampleLongitude, sampleLatitude] = nearestLandCoordinate([longitude, latitude]);
    const power = await fetchPowerDailySeries(sampleLatitude, sampleLongitude);
    const summary = summarizePowerDailySeries(power.daily);
    const record = getVerifiedZoneRecord(country.id);
    const sourcedMembers = zone.members.filter(member => Boolean(VERIFIED_TEMPERATURE_RECORDS[member.iso3])).length;
    const recordCoverage = { sourcedMembers, totalMembers: zone.members.length };
    rows.push(buildClimatePanelRow({
      id: country.id,
      requestedCoordinates: [longitude, latitude],
      sourcePointCoordinates: [power.longitude, power.latitude],
      sourcePointElevationM: power.elevationM,
      dailyTimeStandard: power.timeStandard,
      generatedAt,
      summary,
      record,
      recordCoverage
    }));
    onProgress(`${rows.length}/${COUNTRIES_DATA.length} zones: ${country.id}`);
    await new Promise(resolveDelay => setTimeout(resolveDelay, 300));
  }

  const output: ClimatePanelFile = {
    schemaVersion: 1,
    generatedAt,
    source: 'NASA POWER daily meteorology, MERRA-2 reanalysis, 1991–2020',
    sourceUrl: `${API_URL}?parameters=T2M,T2MDEW,T2M_MAX,T2M_MIN&community=RE&start=${REFERENCE_START}&end=${REFERENCE_END}&time-standard=LST`,
    rows
  };
  return output;
}

async function main(): Promise<void> {
  const output = await generateClimatePanelRows(message => console.log(message));
  await writeFile(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${output.rows.length} climate panel rows to ${OUTPUT_PATH}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}
