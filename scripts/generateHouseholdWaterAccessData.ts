import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import countryContext from '../src/data/countryContextObserved.json';
import { GEO_COUNTRY_FEATURES } from '../src/data/worldMapGeo';

const API = 'https://ixmp.ece.iiasa.ac.at/v1/ssp-extensions/iamc/datapoints';
const SOURCE = 'https://doi.org/10.1038/s41545-026-00594-3';
const MODELS = ['Wat-San-Access RCP2.6', 'Wat-San-Access RCP6.0'] as const;
const SSP_SCENARIOS = ['SSP1', 'SSP2', 'SSP3', 'SSP4', 'SSP5'] as const;
const VARIABLES = ['Population|Access to Water [Share]', 'Population|Access to Water'] as const;

type IamcResponse = {
  results: { columns: string[]; data: unknown[][] };
  total: number;
};
type WaterProjectionRow = {
  iso3: string;
  country: string;
  year: number;
  ssp: string;
  climateForcing: 'RCP2.6' | 'RCP6.0';
  improvedWaterAccessPct: number;
  populationWithAccessMillion: number;
  populationMillion: number;
};

const normalize = (value: string) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const countryByName = new Map<string, { iso3: string; name: string }>();
for (const country of countryContext.countries) {
  countryByName.set(normalize(country.name), { iso3: country.iso3, name: country.name });
}
for (const feature of GEO_COUNTRY_FEATURES) {
  if (feature.iso3) countryByName.set(normalize(feature.name), { iso3: feature.iso3, name: feature.name });
}
const countryAliases: Record<string, string> = {
  'Bahamas': 'BHS', 'Bolivia': 'BOL', 'Brunei': 'BRN', 'Cape Verde': 'CPV', 'Congo': 'COG',
  'Democratic Republic of the Congo': 'COD', 'Czech Republic': 'CZE', 'Ivory Coast': 'CIV',
  'Cote d Ivoire': 'CIV', 'East Timor': 'TLS', 'Iran': 'IRN', 'Laos': 'LAO', 'Macedonia': 'MKD',
  'Micronesia': 'FSM', 'Moldova': 'MDA', 'North Korea': 'PRK', 'Palestine': 'PSE',
  'Republic of Korea': 'KOR', 'Russia': 'RUS', 'Syria': 'SYR', 'Taiwan': 'TWN',
  'Tanzania': 'TZA', 'The Gambia': 'GMB', 'The Netherlands': 'NLD', 'Turkey': 'TUR',
  'United States': 'USA', 'Venezuela': 'VEN', 'Vietnam': 'VNM',
  'United Kingdom': 'GBR', 'United Arab Emirates': 'ARE', 'United Republic of Tanzania': 'TZA',
  'Viet Nam': 'VNM', 'Türkiye': 'TUR', 'Congo, Democratic Republic of the': 'COD',
  'Saint Vincent and the Grenadines': 'VCT'
};
const isoByName = new Map(Object.entries(countryAliases).map(([name, iso3]) => [normalize(name), iso3]));
const nameByIso = new Map(countryContext.countries.map(country => [country.iso3, country.name]));

function resolveCountry(countryName: string): { iso3: string; country: string } | null {
  const normalized = normalize(countryName);
  const known = countryByName.get(normalized);
  if (known) return known;
  const iso3 = isoByName.get(normalized);
  return iso3 ? { iso3, country: nameByIso.get(iso3) ?? countryName } : null;
}

async function fetchRows(variable: string, model: string, ssp: string): Promise<Array<Record<string, unknown>>> {
  const params = new URLSearchParams({
    variable,
    model,
    scenario: ssp,
    table: 'true',
    join_parameters: 'true',
    join_runs: 'true',
    limit: '10000',
    offset: '0'
  });
  const response = await fetch(`${API}?${params}`, { method: 'PATCH' });
  if (!response.ok) throw new Error(`IIASA API ${response.status} pour ${variable}, ${model}, ${ssp}.`);
  const payload = await response.json() as IamcResponse;
  if (!Array.isArray(payload.results?.columns) || !Array.isArray(payload.results?.data) || payload.total !== payload.results.data.length) {
    throw new Error(`Réponse IIASA tronquée ou inattendue (${payload.results?.data?.length ?? 0}/${payload.total ?? 'inconnu'}) pour ${variable}, ${model}, ${ssp}.`);
  }
  return payload.results.data.map(values => Object.fromEntries(payload.results.columns.map((column, index) => [column, values[index]])));
}

const combined = new Map<string, Partial<WaterProjectionRow> & { country: string; year: number; ssp: string; climateForcing: 'RCP2.6' | 'RCP6.0'; iso3: string }>();
const unresolved = new Set<string>();
for (const model of MODELS) {
  for (const ssp of SSP_SCENARIOS) {
    const [shares, withAccess] = await Promise.all(VARIABLES.map(variable => fetchRows(variable, model, ssp)));
    const forcing = model.endsWith('2.6') ? 'RCP2.6' : 'RCP6.0';
    for (const [data, field] of [[shares, 'improvedWaterAccessPct'], [withAccess, 'populationWithAccessMillion']] as const) {
      for (const item of data) {
        const iso = resolveCountry(String(item.region ?? ''));
        if (!iso) { unresolved.add(String(item.region ?? '')); continue; }
        const year = Number(item.step_year);
        const value = Number(item.value);
        if (!Number.isInteger(year) || year < 2020 || year > 2100 || !Number.isFinite(value)) {
          throw new Error(`Valeur/horizon invalide : ${JSON.stringify(item)}`);
        }
        const key = `${iso.iso3}:${ssp}:${forcing}:${year}`;
        const row = combined.get(key) ?? { ...iso, year, ssp, climateForcing: forcing };
        row[field] = value;
        combined.set(key, row);
      }
    }
  }
}

const rows: WaterProjectionRow[] = [...combined.values()].map(row => {
  if (!Number.isFinite(row.improvedWaterAccessPct) || !Number.isFinite(row.populationWithAccessMillion)) {
    throw new Error(`Série incomplète pour ${row.iso3}/${row.ssp}/${row.climateForcing}/${row.year}.`);
  }
  const pct = row.improvedWaterAccessPct!;
  const accessed = row.populationWithAccessMillion!;
  if (pct < 0 || pct > 100 || accessed < 0) throw new Error(`Valeur hors bornes pour ${row.iso3}/${row.ssp}/${row.climateForcing}/${row.year}.`);
  const population = pct > 0 ? accessed / (pct / 100) : null;
  if (population === null || !Number.isFinite(population) || population < accessed) throw new Error(`Dénominateur de population invalide pour ${row.iso3}/${row.ssp}/${row.climateForcing}/${row.year}.`);
  return { ...row, improvedWaterAccessPct: pct, populationWithAccessMillion: accessed, populationMillion: population };
}).sort((a, b) => a.iso3.localeCompare(b.iso3) || a.ssp.localeCompare(b.ssp) || a.climateForcing.localeCompare(b.climateForcing) || a.year - b.year);

const uniqueKeys = new Set(rows.map(row => `${row.iso3}:${row.ssp}:${row.climateForcing}:${row.year}`));
if (uniqueKeys.size !== rows.length) throw new Error('Clés de projection eau dupliquées.');
const mappedIso3 = new Set(GEO_COUNTRY_FEATURES.flatMap(feature => feature.iso3 ? [feature.iso3] : []));
const coveredIso3 = new Set(rows.map(row => row.iso3));
const output = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString().slice(0, 10),
  metadata: {
    source: 'IIASA SSP Extensions Explorer / Wat-San-Access',
    sourceUrl: 'https://ssp-extensions.apps.ece.iiasa.ac.at/explorer',
    paperUrl: SOURCE,
    apiUrl: 'https://ixmp.ece.iiasa.ac.at/v1/ssp-extensions',
    license: 'No explicit open-data license was established for this API snapshot; verify IIASA reuse terms before external republication.',
    indicator: 'Population|Access to Water [Share] (improved drinking-water access, not safely managed access)',
    scenarios: SSP_SCENARIOS,
    climateForcings: MODELS.map(model => model.replace('Wat-San-Access ', '')),
    years: [...new Set(rows.map(row => row.year))].sort((a, b) => a - b),
    model: 'Country access regression projections under SSP socioeconomic pathways and RCP2.6/RCP6.0 climate forcings; paper describes 142 countries through 2100, while the accessible Explorer API snapshot ends in 2095.',
    limitations: [
      'Improved drinking-water access is not equivalent to safely managed service; it does not guarantee water is available when needed or free from contamination.',
      'Country-level projections do not resolve within-country or household inequalities; zone values are population-weighted summaries of country estimates.',
      'This study offers RCP2.6 and RCP6.0 forcings only; it is not an RCP8.5 projection.',
      'The values are conditional scenario projections, not forecasts or measurements.'
    ],
    apiResponseRows: rows.length,
    mappedCountries: coveredIso3.size,
    mappedCountriesWithoutProjection: [...mappedIso3].filter(iso3 => !coveredIso3.has(iso3)).sort(),
    unresolvedSourceRegions: [...unresolved].sort()
  },
  rows
};
await mkdir(resolve('src/data'), { recursive: true });
await writeFile(resolve('src/data/householdWaterAccessProjections.json'), `${JSON.stringify(output)}\n`);
console.log(`IIASA water-access data: ${rows.length} country/scenario/forcing/year rows, ${coveredIso3.size} mapped ISO3, ${unresolved.size} unmatched source regions.`);
