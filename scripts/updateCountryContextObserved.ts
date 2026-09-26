import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const indicators = [
  { code: 'SH.H2O.SMDW.ZS', label: 'Safely managed drinking-water services', unit: '% population', source: 'WHO/UNICEF JMP via World Bank WDI' },
  { code: 'SN.ITK.MSFI.ZS', label: 'Moderate or severe food insecurity (FIES)', unit: '% population', source: 'FAO via World Bank WDI' },
  { code: 'EG.ELC.ACCS.ZS', label: 'Access to electricity', unit: '% population', source: 'Tracking SDG 7 via World Bank WDI' },
  { code: 'EG.CFT.ACCS.ZS', label: 'Access to clean fuels and technologies for cooking', unit: '% population', source: 'WHO / Tracking SDG 7 via World Bank WDI' },
] as const;

type WdiRow = {
  countryiso3code: string;
  country: { id: string; value: string };
  date: string;
  value: number | null;
  obs_status: string;
  decimal: number;
};

type WdiResponse = [{ lastupdated: string }, WdiRow[] | null];
type CountryDirectoryResponse = [{ page: number; pages: number; total: number }, Array<{ id: string; region: { value: string } }> | null];

type ObservedValue = { value: number; year: number; observationStatus: string; sourceDecimals: number };

async function main() {
  const directoryResponse = await fetch('https://api.worldbank.org/v2/country?format=json&per_page=400');
  if (!directoryResponse.ok) throw new Error(`World Bank country directory returned HTTP ${directoryResponse.status}`);
  const directory = await directoryResponse.json() as CountryDirectoryResponse;
  const aggregateCodes = (directory[1] ?? []).filter(country => country.region.value === 'Aggregates').map(country => country.id).sort();
  if (!aggregateCodes.length) throw new Error('World Bank aggregate-code list was empty; refusing to publish an unfiltered snapshot.');
  const aggregateCodeSet = new Set(aggregateCodes);
  const byCountry = new Map<string, { iso3: string; name: string; indicators: Record<string, ObservedValue | null> }>();
  let sourceUpdated = '1900-01-01';

  for (const indicator of indicators) {
    const url = `https://api.worldbank.org/v2/country/all/indicator/${indicator.code}?format=json&per_page=20000&date=2000:2025`;
    const response = await fetch(url, { headers: { 'User-Agent': 'Climatopedy-data-maintenance/1.0' } });
    if (!response.ok) throw new Error(`${indicator.code}: World Bank API returned HTTP ${response.status}`);
    const data = await response.json() as WdiResponse;
    sourceUpdated = data[0].lastupdated > sourceUpdated ? data[0].lastupdated : sourceUpdated;
    const latest = new Map<string, WdiRow>();

    for (const row of data[1] ?? []) {
      if (!/^[A-Z]{3}$/.test(row.countryiso3code) || aggregateCodeSet.has(row.countryiso3code) || row.value === null) continue;
      const current = latest.get(row.countryiso3code);
      if (!current || Number(row.date) > Number(current.date)) latest.set(row.countryiso3code, row);
    }

    for (const row of latest.values()) {
      const country = byCountry.get(row.countryiso3code) ?? {
        iso3: row.countryiso3code,
        name: row.country.value,
        indicators: Object.fromEntries(indicators.map(({ code }) => [code, null])) as Record<string, ObservedValue | null>
      };
      country.indicators[indicator.code] = { value: row.value!, year: Number(row.date), observationStatus: row.obs_status, sourceDecimals: row.decimal };
      byCountry.set(country.iso3, country);
    }
  }

  const result = {
    metadata: {
      fetchedAt: new Date().toISOString().slice(0, 10),
      sourceUpdated,
      aggregateCodesExcluded: aggregateCodes,
      countryDirectoryUrl: 'https://api.worldbank.org/v2/country?format=json',
      period: 'latest non-null country observation from 2000–2025; years vary by indicator and country',
      indicatorDefinitions: Object.fromEntries(indicators.map(({ code, label, unit, source }) => [code, { label, unit, source, url: `https://api.worldbank.org/v2/country/all/indicator/${code}?format=json` }])),
      limitations: [
        'Observations are not interpolated or projected into future years.',
        'Food insecurity is based on the FAO FIES indicator; reference periods and survey availability vary by country.',
        'Missing values mean unavailable in this source snapshot, not zero.',
        'National percentages can hide substantial differences between regions and populations.'
      ]
    },
    countries: [...byCountry.values()].sort((a, b) => a.iso3.localeCompare(b.iso3))
  };

  const output = resolve('src/data/countryContextObserved.json');
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(result, null, 2)}\n`);
  console.log(`Wrote ${result.countries.length} countries; World Bank source updated ${sourceUpdated}; fetched ${result.metadata.fetchedAt}.`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
