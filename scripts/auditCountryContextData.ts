import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import contextFile from '../src/data/countryContextObserved.json';
import waterFile from '../src/data/aqueductCountryWaterStress.json';
import { GEO_COUNTRY_FEATURES } from '../src/data/worldMapGeo';

const indicatorCodes = ['SH.H2O.SMDW.ZS', 'SN.ITK.MSFI.ZS', 'EG.ELC.ACCS.ZS', 'EG.CFT.ACCS.ZS'] as const;
const horizons = [2030, 2050, 2080] as const;
const scenarios = ['opt', 'bau', 'pes'] as const;
const contextByIso = new Map(contextFile.countries.map(country => [country.iso3, country]));
const waterKeySet = new Set(waterFile.rows.map(row => `${row.iso3}:${row.year}:${row.scenario}`));
const expectedWaterKeys = (iso3: string) => horizons.flatMap(year => scenarios.map(scenario => `${iso3}:${year}:${scenario}`));
const knownIsoCodes = new Set(GEO_COUNTRY_FEATURES.flatMap(feature => feature.iso3 ? [feature.iso3] : []));

const invalidObservedValues = contextFile.countries.flatMap(country => indicatorCodes.flatMap(code => {
  const observation = country.indicators[code];
  return observation && (!Number.isFinite(observation.value) || observation.value < 0 || observation.value > 100 || observation.year < 2000 || observation.year > 2025)
    ? [{ iso3: country.iso3, indicator: code, observation }]
    : [];
}));
const aqueductCountryCount = new Set(waterFile.rows.map(row => row.iso3)).size;
const expectedAqueductRows = aqueductCountryCount * horizons.length * scenarios.length;
const invalidWaterRows = waterFile.rows.filter(row => !Number.isFinite(row.score) || row.score < 0 || row.score > 5 || !Number.isInteger(row.category) || row.category < 0 || row.category > 4);
const unsupportedWaterRows = waterFile.rows.filter(row => !(horizons as readonly number[]).includes(row.year) || !(scenarios as readonly string[]).includes(row.scenario));
const incompleteWaterCountries = [...new Set(waterFile.rows.map(row => row.iso3))].filter(iso3 => expectedWaterKeys(iso3).some(key => !waterKeySet.has(key)));
const missingWaterRows = waterFile.rows.length !== expectedAqueductRows || waterKeySet.size !== waterFile.rows.length || invalidWaterRows.length > 0 || unsupportedWaterRows.length > 0 || incompleteWaterCountries.length > 0;
const checklist = GEO_COUNTRY_FEATURES.map(feature => ({
  mapFeatureId: feature.id,
  countryName: feature.name,
  iso3: feature.iso3,
  simulationZone: feature.simCountryId,
  observedIndicators: Object.fromEntries(indicatorCodes.map(code => [code, feature.iso3 ? contextByIso.get(feature.iso3)?.indicators[code] ?? null : null])),
  aqueductFuture: feature.iso3 ? Object.fromEntries(horizons.flatMap(year => scenarios.map(scenario => {
    const key = `${feature.iso3}:${year}:${scenario}`;
    return [`${year}:${scenario}`, waterKeySet.has(key)];
  }))) : null
}));
const report = {
  generatedAt: new Date().toISOString().slice(0, 10),
  sourceFreshness: {
    worldBankUpdatedAt: contextFile.metadata.sourceUpdated,
    observedSnapshotFetchedAt: contextFile.metadata.fetchedAt,
    aqueductCatalogUpdatedAt: waterFile.metadata.catalogUpdated,
    aqueductSnapshotDownloadedAt: waterFile.metadata.downloadedAt,
    aqueductWorkbookVintage: waterFile.metadata.workbookVintage
  },
  coverage: {
    mapFeatures: GEO_COUNTRY_FEATURES.length,
    recognizedUniqueIso3: knownIsoCodes.size,
    mapFeaturesWithoutIso3: GEO_COUNTRY_FEATURES.filter(feature => !feature.iso3).map(feature => feature.name),
    observedIndicators: Object.fromEntries(indicatorCodes.map(code => [code, {
      availableMapFeatures: GEO_COUNTRY_FEATURES.filter(feature => feature.iso3 && contextByIso.get(feature.iso3)?.indicators[code]).length,
      mapFeatures: GEO_COUNTRY_FEATURES.length
    }])),
    aqueductCountries: aqueductCountryCount,
    aqueductMappedIso3: [...knownIsoCodes].filter(iso3 => waterFile.rows.some(row => row.iso3 === iso3)).length,
    aqueductRows: waterFile.rows.length,
    expectedAqueductRows
  },
  validation: { invalidObservedValues, invalidWaterRows, unsupportedWaterRows, incompleteWaterCountries, aqueductKeysUnique: waterKeySet.size === waterFile.rows.length, aqueductExpectedHorizonsAndScenarios: !missingWaterRows },
  countryChecklist: checklist
};

if (invalidObservedValues.length || missingWaterRows || contextFile.countries.some(country => contextFile.metadata.aggregateCodesExcluded.includes(country.iso3))) {
  throw new Error(`Country data audit failed: invalid observations=${invalidObservedValues.length}, Aqueduct incomplete=${missingWaterRows}, aggregate codes=${contextFile.countries.filter(country => contextFile.metadata.aggregateCodesExcluded.includes(country.iso3)).length}`);
}

const output = resolve('docs/data-quality/country-context-country-by-country.json');
await mkdir(resolve('docs/data-quality'), { recursive: true });
await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Country context audit passed: ${knownIsoCodes.size} map ISO3, WDI coverages ${indicatorCodes.map(code => `${code}=${report.coverage.observedIndicators[code].availableMapFeatures}`).join(', ')}, Aqueduct ${report.coverage.aqueductMappedIso3}/${knownIsoCodes.size} ISO3.`);
