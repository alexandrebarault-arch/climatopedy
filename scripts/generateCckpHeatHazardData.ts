import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import countryTemperatures from '../src/data/cckpCountryTemperatures.json' with { type: 'json' };
import climatePanelData from '../src/data/climatePanelData.json' with { type: 'json' };
import { COUNTRIES_DATA } from '../src/data/countriesData.ts';

type CountrySeries = Record<string, Record<string, number>>;
type ApiResponse = { metadata?: { status?: string; messages?: string[] }; data: CountrySeries };
type PeriodData = { txx: number; hurs: number[] };
type HazardFile = {
  source: string;
  collection: string;
  sourceUrl: string;
  accessed: string;
  baselinePeriod: string;
  futurePeriod: string;
  statistic: string;
  baselineScenario: string;
  variables: { txx: string; hurs: string; method: string };
  zones: Record<string, { members: string[]; warmSeasonMonths: number[]; baseline: PeriodData; future: Record<string, PeriodData> }>;
};

const aliases: Record<string, string> = { med_eu: 'seu', nafr: 'naf', casia: 'cas' };
const sspScenarios = ['ssp126', 'ssp245', 'ssp585'] as const;
const sourceTemplate = 'https://cckpapi.worldbank.org/cckp/v1/cmip6-x0.25_climatology_{variable}_climatology_{frequency}_{period}_median_{scenario}_ensemble_all_mean/all_countries?_format=json';

async function fetchAllCountries(variable: 'txx' | 'hurs', frequency: 'annual' | 'monthly', period: string, scenario: string): Promise<CountrySeries> {
  const url = sourceTemplate
    .replace('{variable}', variable)
    .replace('{frequency}', frequency)
    .replace('{period}', period)
    .replace('{scenario}', scenario);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`CCKP ${variable}/${scenario}/${period}: HTTP ${response.status}`);
  const payload = await response.json() as ApiResponse;
  if (!payload.data || payload.metadata?.status !== 'success') throw new Error(`Réponse CCKP invalide pour ${url}`);
  return payload.data;
}

function aggregate(values: number[], label: string): number {
  if (!values.length || values.some(value => !Number.isFinite(value))) throw new Error(`Valeur CCKP absente pour ${label}.`);
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getZoneMembers(countryId: string): string[] {
  const id = aliases[countryId] ?? countryId;
  const grouped = (countryTemperatures.multiCountryMembers as Record<string, string[]>)[id];
  if (grouped) return grouped;
  const direct = COUNTRIES_DATA.find(country => country.id === countryId);
  if (!direct) throw new Error(`Zone CCKP absente: ${countryId}`);
  return [direct.code];
}

function makePeriod(txxRaw: CountrySeries, hursRaw: CountrySeries, memberIsos: string[], months: number[], period: string): PeriodData {
  const datePrefix = period.slice(0, 4);
  const txx = aggregate(memberIsos.map(iso => {
    const values = txxRaw[iso];
    if (!values) throw new Error(`TXX manquant pour ${iso}/${period}`);
    return Object.values(values)[0];
  }), `TXX ${memberIsos.join(',')}/${period}`);
  const hurs = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const key = `${datePrefix}-${String(month).padStart(2, '0')}`;
    return aggregate(memberIsos.map(iso => {
      const value = hursRaw[iso]?.[key];
      if (value === undefined) throw new Error(`Hurs manquant pour ${iso}/${key}`);
      return value;
    }), `Hurs ${memberIsos.join(',')}/${key}`);
  });
  if (months.some(month => month < 1 || month > 12)) throw new Error('Mois de saison chaude invalides.');
  return { txx, hurs };
}

const baselineTxx = await fetchAllCountries('txx', 'annual', '2020-2039', 'ssp245');
const baselineHurs = await fetchAllCountries('hurs', 'monthly', '2020-2039', 'ssp245');
const futureRaw = await Promise.all(sspScenarios.map(async scenario => {
  const [txx, hurs] = await Promise.all([
    fetchAllCountries('txx', 'annual', '2080-2099', scenario),
    fetchAllCountries('hurs', 'monthly', '2080-2099', scenario)
  ]);
  return [scenario, { txx, hurs }] as const;
}));
const futureBySsp = Object.fromEntries(futureRaw) as Record<string, { txx: CountrySeries; hurs: CountrySeries }>;
const climateRows = new Map((climatePanelData as typeof climatePanelData).rows.map(row => [row.id, row]));
const zones: HazardFile['zones'] = {};

for (const country of COUNTRIES_DATA) {
  const climateRow = climateRows.get(country.id);
  if (!climateRow) throw new Error(`Normale climatique manquante pour ${country.id}.`);
  const members = getZoneMembers(country.id);
  const warmSeasonMonths = climateRow.provenance.warmSeasonMonths;
  const baseline = makePeriod(baselineTxx, baselineHurs, members, warmSeasonMonths, '2020-2039');
  const future: Record<string, PeriodData> = {};
  for (const ssp of sspScenarios) {
    future[ssp] = makePeriod(futureBySsp[ssp].txx, futureBySsp[ssp].hurs, members, warmSeasonMonths, '2080-2099');
  }
  zones[country.id] = { members, warmSeasonMonths, baseline, future };
}

const output: HazardFile = {
  source: 'World Bank Climate Change Knowledge Portal CMIP6-x0.25 multi-model ensemble, median statistic',
  collection: 'cmip6-x0.25',
  sourceUrl: 'https://climateknowledgeportal.worldbank.org/download-data',
  accessed: new Date().toISOString().slice(0, 10),
  baselinePeriod: '2020-2039',
  futurePeriod: '2080-2099',
  statistic: 'median across ensemble; country values averaged equally within app zones',
  baselineScenario: 'ssp245',
  variables: {
    txx: 'Annual maximum of daily maximum temperature (°C), used only as a delta proxy for the site’s warm-season P99.',
    hurs: 'Monthly mean near-surface relative humidity (%); warm-season month mean deltas adjust the site’s hot-day RH estimate.',
    method: 'Changes are applied to the NASA POWER 1991-2020 local hot-day estimates to preserve their local baseline while using CMIP6 changes.'
  },
  zones
};

const outputPath = resolve('src/data/cckpHeatHazardProjections.json');
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`CCKP TXx/Hurs projections generated for ${Object.keys(zones).length} zones (${sspScenarios.join(', ')}).`);
