import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { GEO_COUNTRY_FEATURES } from '../src/data/worldMapGeo';
import { getSoleNationalFeatureForSimulationZone } from '../src/utils/mapCountryContext';

type Indicator = {
  value: number;
  year: number;
  observationStatus: string;
  sourceDecimals: number;
};

type CountryContext = {
  iso3: string;
  indicators: Record<string, Indicator | null>;
};

type CountryContextFile = {
  metadata: { sourceUpdated: string; fetchedAt: string; aggregateCodesExcluded: string[] };
  countries: CountryContext[];
};

function loadCountryContext(): CountryContextFile {
  return JSON.parse(readFileSync(new URL('../src/data/countryContextObserved.json', import.meta.url), 'utf8')) as CountryContextFile;
}

test('observed country context contains only national ISO3 rows and dated finite values', () => {
  const file = loadCountryContext();
  assert.match(file.metadata.sourceUpdated, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(file.metadata.fetchedAt, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(file.countries.length > 150);
  assert.equal(new Set(file.countries.map(country => country.iso3)).size, file.countries.length);
  assert.ok(file.metadata.aggregateCodesExcluded.length > 50);
  assert.ok(file.countries.every(country => !file.metadata.aggregateCodesExcluded.includes(country.iso3)));

  for (const country of file.countries) {
    assert.match(country.iso3, /^[A-Z]{3}$/);
    for (const indicator of Object.values(country.indicators)) {
      if (!indicator) continue;
      assert.ok(Number.isFinite(indicator.value));
      assert.ok(indicator.value >= 0 && indicator.value <= 100);
      assert.ok(indicator.year >= 2000 && indicator.year <= 2025);
      assert.equal(typeof indicator.observationStatus, 'string');
      assert.ok(Number.isInteger(indicator.sourceDecimals));
    }
  }
});

test('observed indicators use the expected codes and have nontrivial national coverage', () => {
  const file = loadCountryContext();
  const codes = ['SH.H2O.SMDW.ZS', 'SN.ITK.MSFI.ZS', 'EG.ELC.ACCS.ZS', 'EG.CFT.ACCS.ZS'];

  for (const code of codes) {
    const observations = file.countries.filter(country => country.indicators[code] !== null);
    assert.ok(observations.length > 100, `${code} should have substantial country coverage`);
  }

  const france = file.countries.find(country => country.iso3 === 'FRA');
  assert.ok(france, 'France should be keyed by its clicked map ISO3 code');
  assert.ok((france.indicators['SH.H2O.SMDW.ZS']?.value ?? 0) > 95);
  assert.ok((france.indicators['SN.ITK.MSFI.ZS']?.value ?? 100) < 20);
  assert.ok((france.indicators['EG.ELC.ACCS.ZS']?.value ?? 0) > 99);
  assert.ok((france.indicators['EG.CFT.ACCS.ZS']?.value ?? 0) > 99);
});

test('every selectable map feature resolves to one reviewed ISO3 country code', () => {
  const unrecognized = GEO_COUNTRY_FEATURES.filter(feature => feature.iso3 === null);
  assert.deepEqual(unrecognized.map(feature => feature.name).sort(), ['Kosovo', 'N. Cyprus', 'Somaliland']);
  const resolved = GEO_COUNTRY_FEATURES.filter(feature => feature.iso3 !== null);
  assert.ok(resolved.every(feature => /^[A-Z]{3}$/.test(feature.iso3!)));
  assert.equal(new Set(resolved.map(feature => feature.iso3)).size, resolved.length);
});

test('Aqueduct future water-stress data contains only published horizons and complete scenario keys', () => {
  const file = JSON.parse(readFileSync(new URL('../src/data/aqueductCountryWaterStress.json', import.meta.url), 'utf8')) as {
    rows: Array<{ iso3: string; year: number; scenario: string; score: number; category: number }>;
  };
  assert.ok(file.rows.length > 1000);
  assert.equal(new Set(file.rows.map(row => `${row.iso3}:${row.year}:${row.scenario}`)).size, file.rows.length);
  for (const row of file.rows) {
    assert.match(row.iso3, /^[A-Z]{3}$/);
    assert.ok([2030, 2050, 2080].includes(row.year));
    assert.ok(['opt', 'bau', 'pes'].includes(row.scenario));
    assert.ok(Number.isFinite(row.score) && row.score >= 0 && row.score <= 5);
    assert.ok(Number.isInteger(row.category) && row.category >= 0 && row.category <= 4);
  }
  for (const iso3 of new Set(file.rows.map(row => row.iso3))) {
    for (const year of [2030, 2050, 2080]) {
      for (const scenario of ['opt', 'bau', 'pes']) {
        assert.ok(file.rows.some(row => row.iso3 === iso3 && row.year === year && row.scenario === scenario), `${iso3} missing ${year}/${scenario}`);
      }
    }
  }
  assert.ok(file.rows.some(row => row.iso3 === 'FRA' && row.year === 2050 && row.scenario === 'bau'));
});

test('map selections pass the exact feature ISO3 through to the country inspector', () => {
  const mapSource = readFileSync(new URL('../src/components/WorldMap.tsx', import.meta.url), 'utf8');
  const inspectorSource = readFileSync(new URL('../src/components/CountryInspector.tsx', import.meta.url), 'utf8');
  const appSource = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
  const sourcesPage = readFileSync(new URL('../src/components/ScientificSourcesView.tsx', import.meta.url), 'utf8');
  assert.match(mapSource, /onSelectCountry\(isSelected \? null : feature\.simCountryId, isSelected \? null : feature\.iso3, isSelected \? null : feature\.name, isSelected \? null : feature\.id\)/);
  assert.match(appSource, /nationalContextIso3=\{selectedCountryIso3\}/);
  assert.match(inspectorSource, /Accès aux ressources — observations nationales/);
  assert.match(inspectorSource, /Pays cliqué :/);
  assert.match(inspectorSource, /observation\.year/);
  assert.match(sourcesPage, /wri-aqueduct-40-country/);
  assert.match(sourcesPage, /jmp-household-wash-2025/);
  assert.match(sourcesPage, /EG\.CFT\.ACCS\.ZS/);
});

test('zone-only inspector entry points resolve a country only for single-country zones', () => {
  assert.equal(getSoleNationalFeatureForSimulationZone('fra')?.iso3, 'FRA');
  assert.equal(getSoleNationalFeatureForSimulationZone('deu'), null);
});

test('country-by-country audit stays complete and exposes mapping gaps', () => {
  const report = JSON.parse(readFileSync(new URL('../docs/data-quality/country-context-country-by-country.json', import.meta.url), 'utf8')) as {
    coverage: { mapFeatures: number; recognizedUniqueIso3: number; mapFeaturesWithoutIso3: string[]; aqueductMappedIso3: number };
    countryChecklist: Array<{ mapFeatureId: string; observedIndicators: Record<string, unknown>; aqueductFuture: Record<string, boolean> | null }>;
  };
  assert.equal(report.coverage.mapFeatures, GEO_COUNTRY_FEATURES.length);
  assert.equal(report.coverage.recognizedUniqueIso3, 174);
  assert.equal(report.coverage.aqueductMappedIso3, 160);
  assert.deepEqual(report.coverage.mapFeaturesWithoutIso3, ['N. Cyprus', 'Somaliland', 'Kosovo']);
  assert.equal(report.countryChecklist.length, GEO_COUNTRY_FEATURES.length);
  assert.ok(report.countryChecklist.every(country => Object.keys(country.observedIndicators).length === 4));
  assert.ok(report.countryChecklist.filter(country => country.aqueductFuture).every(country => Object.keys(country.aqueductFuture!).length === 9));
  assert.ok(report.countryChecklist.filter(country => country.aqueductFuture).every(country => Object.values(country.aqueductFuture!).every(value => typeof value === 'boolean')));
});
