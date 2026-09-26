import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { COUNTRIES_DATA } from '../src/data/countriesData';

type PanelRow = {
  id: string;
  annualMeanTempC: number;
  annualMeanDailyMinTempC: number;
  annualMeanDailyMaxTempC: number;
  heatwaveScenarioTempC: number;
  heatwaveScenarioHumidityPct: number;
  heatwaveWetBulbC: number;
  absoluteAirTemperatureRecord: null | { valueC: number; sourceUrl: string };
  provenance: {
    baselineReferencePeriod: string;
    dataQuality: Record<string, string>;
    methods: Record<string, string>;
    notes: string[];
  };
};

function loadPanelRows(): PanelRow[] {
  try {
    const raw = readFileSync(new URL('../src/data/climatePanelData.json', import.meta.url), 'utf8');
    return (JSON.parse(raw) as { rows: PanelRow[] }).rows;
  } catch {
    return [];
  }
}

test('climate panel data covers exactly every map zone', () => {
  const rows = loadPanelRows();
  const ids = rows.map(row => row.id);
  assert.equal(rows.length, COUNTRIES_DATA.length, 'panel row count must match COUNTRIES_DATA');
  assert.deepEqual([...ids].sort(), COUNTRIES_DATA.map(country => country.id).sort());
});

test('country definitions no longer contain hand-entered heat-panel temperature constants', async () => {
  const { COUNTRIES_DATA } = await import('../src/data/countriesData');
  for (const country of COUNTRIES_DATA) {
    assert.equal('baseTemp' in country, false, `${country.id} still has a hand-entered annual temperature`);
    assert.equal('summerMaxTemp' in country, false, `${country.id} still has a hand-entered heatwave maximum`);
    assert.equal('summerHumidity' in country, false, `${country.id} still has a hand-entered heatwave humidity`);
  }
});

test('versioned zone metadata covers every single-country and grouped region', async () => {
  const module = await import('../src/data/climateZoneMetadata.ts').catch(() => ({} as Record<string, unknown>));
  const metadata = module.CLIMATE_ZONE_METADATA as Record<string, { type: string; members: { name: string; iso3: string }[] }> | undefined;
  assert.ok(metadata, 'versioned zone metadata must exist');
  assert.deepEqual(Object.keys(metadata).sort(), COUNTRIES_DATA.map(country => country.id).sort());
  for (const zone of Object.values(metadata)) {
    assert.ok(zone.type === 'country' || zone.type === 'grouped-zone');
    assert.ok(zone.members.length > 0);
    for (const member of zone.members) assert.match(member.iso3, /^[A-Z]{3}$/);
  }
});

test('representative sampling points are moved deterministically from water to nearby land', async () => {
  const module = await import('../src/engine/representativeLandPoints.ts').catch(() => ({} as Record<string, unknown>));
  const nearestLandCoordinate = module.nearestLandCoordinate as ((coordinate: [number, number]) => [number, number]) | undefined;
  const isLandCoordinate = module.isLandCoordinate as ((coordinate: [number, number]) => boolean) | undefined;
  assert.equal(typeof nearestLandCoordinate, 'function');
  assert.equal(typeof isLandCoordinate, 'function');
  assert.deepEqual(nearestLandCoordinate?.([-98, 39]), [-98, 39]);
  const shifted = nearestLandCoordinate?.([8, 40]);
  assert.ok(shifted && isLandCoordinate?.(shifted));
  if (shifted) assert.ok(Math.hypot((shifted[0] - 8) * Math.cos(40 * Math.PI / 180), shifted[1] - 40) < 1);
});

test('absolute records use sourced country observations and grouped maxima only', async () => {
  const module = await import('../src/data/verifiedTemperatureRecords.ts').catch(() => ({} as Record<string, unknown>));
  const getVerifiedZoneRecord = module.getVerifiedZoneRecord as ((zoneId: string) => { valueC: number; memberIso3: string; sourceUrl: string; coverage: { sourcedMembers: number; totalMembers: number } } | null) | undefined;
  assert.equal(typeof getVerifiedZoneRecord, 'function');
  assert.equal(getVerifiedZoneRecord?.('fra')?.valueC, 46);
  assert.equal(getVerifiedZoneRecord?.('usa')?.valueC, 56.7);
  assert.equal(getVerifiedZoneRecord?.('ind')?.memberIso3, 'IND');
  assert.equal(getVerifiedZoneRecord?.('chn')?.memberIso3, 'CHN');
  assert.equal(getVerifiedZoneRecord?.('rus'), null, 'an unsourced record must remain unavailable');
  const china = getVerifiedZoneRecord?.('chn');
  assert.ok(china && china.coverage.sourcedMembers < china.coverage.totalMembers);
  if (china) assert.match(china.sourceUrl, /^https:\/\//);
});

test('a panel row derives Tw from scenario temperature and humidity and preserves quality', async () => {
  const [builder, physics] = await Promise.all([
    import('../src/engine/buildClimatePanelRow.ts').catch(() => ({} as Record<string, unknown>)),
    import('../src/engine/physicsModel.ts')
  ]);
  const buildClimatePanelRow = builder.buildClimatePanelRow as ((input: Record<string, unknown>) => PanelRow) | undefined;
  assert.equal(typeof buildClimatePanelRow, 'function');
  const row = buildClimatePanelRow?.({
    id: 'fra', requestedCoordinates: [2.5, 46.5], sourcePointCoordinates: [2.5, 46.5],
    sourcePointElevationM: 100, dailyTimeStandard: 'LST', generatedAt: '2026-09-26T12:00:00Z',
    summary: { annualMeanTempC: 13, annualMeanDailyMinTempC: 9, annualMeanDailyMaxTempC: 17, heatwaveScenarioTempC: 35.5, heatwaveScenarioHumidityPct: 38, warmSeasonMonths: [5, 6, 7, 8, 9, 10] },
    record: null, recordCoverage: { sourcedMembers: 0, totalMembers: 1 }
  });
  assert.ok(row);
  assert.equal(row?.heatwaveWetBulbC, physics.calculateWetBulbStull(35.5, 38));
  assert.equal(row?.provenance.dataQuality.heatwaveScenarioTempC, 'estimated');
  assert.equal(row?.provenance.dataQuality.heatwaveScenarioHumidityPct, 'estimated');
  assert.equal(row?.provenance.dataQuality.heatwaveWetBulbC, 'calculated');
  assert.equal(row?.provenance.dataQuality.absoluteAirTemperatureRecord, 'unavailable');
});

test('future heat-scenario deltas are zero at baseline and use CCKP changes by SSP', async () => {
  const [module, cckp] = await Promise.all([
    import('../src/engine/countryTemperatures.ts').catch(() => ({} as Record<string, unknown>)),
    import('../src/data/cckpCountryTemperatures.json', { with: { type: 'json' } })
  ]);
  const getProjectedTemperatureDelta = module.getProjectedTemperatureDelta as ((countryId: string, variable: 'tas' | 'tasmin' | 'tasmax', year: number, scenarioId?: string) => number) | undefined;
  assert.equal(typeof getProjectedTemperatureDelta, 'function');
  const data = cckp.default as { baseline: Record<string, { tasmax: number }>; future: Record<string, Record<string, { tasmax: number }>> };
  const expectedDelta = data.future.ssp245.fra.tasmax - data.baseline.fra.tasmax;
  assert.equal(getProjectedTemperatureDelta?.('fra', 'tasmax', 2026), 0);
  assert.equal(getProjectedTemperatureDelta?.('fra', 'tasmax', 2100), expectedDelta);
  assert.ok(Math.abs((getProjectedTemperatureDelta?.('fra', 'tasmax', 2063) ?? 0) - expectedDelta / 2) < 0.01);
  assert.equal(getProjectedTemperatureDelta?.('fra', 'tasmax', 2100, 'bau'), data.future.ssp585.fra.tasmax - data.baseline.fra.tasmax);
});

test('projected daily extrema are anchored to matching 2026 NASA metrics without a first-year jump', async () => {
  const [module, panelModule, cckp] = await Promise.all([
    import('../src/engine/countryTemperatures.ts'),
    import('../src/data/climatePanelData.json', { with: { type: 'json' } }),
    import('../src/data/cckpCountryTemperatures.json', { with: { type: 'json' } })
  ]);
  const panel = (panelModule.default as { rows: PanelRow[] }).rows.find(row => row.id === 'fra')!;
  const data = cckp.default as { baseline: Record<string, { tasmax: number; tasmin: number }>; future: Record<string, Record<string, { tasmax: number; tasmin: number }>> };
  const baseline = { tas: panel.annualMeanTempC, tasmin: panel.annualMeanDailyMinTempC, tasmax: panel.annualMeanDailyMaxTempC };
  const current = module.getCountryTemperatures('fra', baseline, 2026);
  const firstFuture = module.getCountryTemperatures('fra', baseline, 2027);
  assert.deepEqual(current, baseline);
  assert.ok(Math.abs(firstFuture.tasmax - current.tasmax) < 0.2, 'Tmax must not jump in the first projected year');
  assert.ok(Math.abs(firstFuture.tasmin - current.tasmin) < 0.2, 'Tmin must not jump in the first projected year');
  assert.equal(firstFuture.tasmax, baseline.tasmax + (data.future.ssp245.fra.tasmax - data.baseline.fra.tasmax) / 74);
  assert.equal(firstFuture.tasmin, baseline.tasmin + (data.future.ssp245.fra.tasmin - data.baseline.fra.tasmin) / 74);

  const historical = module.getHistoricalCountryTemperatures('fra', baseline.tas - 2, baseline);
  assert.equal(historical.tasmin, baseline.tasmin - 2, 'historical minimum follows the reconstructed mean anomaly without an extra source offset');
  assert.equal(historical.tasmax, baseline.tasmax - 2, 'historical maximum follows the reconstructed mean anomaly without an extra source offset');
});

test('Stull wet-bulb estimates are unavailable outside the formula domain', async () => {
  const { calculateScenarioWetBulb } = await import('../src/engine/physicsModel.ts');
  assert.equal(calculateScenarioWetBulb(50.01, 38), null);
  assert.equal(calculateScenarioWetBulb(35, 4.9), null);
  assert.equal(calculateScenarioWetBulb(35, 38), calculateScenarioWetBulb(35, 38));
});

test('full BAU trajectory keeps annual temperature baselines continuous and marks India Tw unavailable past Stull limits', async () => {
  const runner = await import('../src/engine/simulationRunner.ts');
  const trajectory = runner.generateFullTrajectory(runner.SCENARIO_BAU, 2026, 2100);
  const year2026 = trajectory.find(state => state.year === 2026)!;
  const year2027 = trajectory.find(state => state.year === 2027)!;
  const year2100 = trajectory.find(state => state.year === 2100)!;
  const panel = loadPanelRows().find(row => row.id === 'fra')!;

  assert.equal(year2026.countries.fra.annualMinTemp, panel.annualMeanDailyMinTempC);
  assert.equal(year2026.countries.fra.annualMaxTemp, panel.annualMeanDailyMaxTempC);
  assert.ok(year2027.countries.fra.annualMaxTemp - year2026.countries.fra.annualMaxTemp < 0.2);
  assert.ok(year2027.countries.fra.annualMinTemp - year2026.countries.fra.annualMinTemp < 0.2);
  assert.ok(year2100.countries.ind.summerMaxTemp > 50);
  assert.equal(year2100.countries.ind.wetBulbPeak, null);
});

test('2026 simulation initializes the heat scenario and Tw from each climate-panel row', async () => {
  const [engine, panelModule] = await Promise.all([
    import('../src/engine/physicsModel.ts'),
    import('../src/data/climatePanelData.json', { with: { type: 'json' } })
  ]);
  const initial = engine.initializeSimulationState();
  const panel = (panelModule.default as { rows: PanelRow[] }).rows.find(row => row.id === 'fra');
  const state = initial.countries.fra;
  assert.ok(panel);
  assert.equal(state.summerMaxTemp, panel?.heatwaveScenarioTempC);
  assert.equal(state.summerHumidity, panel?.heatwaveScenarioHumidityPct);
  assert.equal(state.wetBulbPeak, panel?.heatwaveWetBulbC);
});

test('all climate metrics are finite, ordered and traceable', () => {
  const rows = loadPanelRows();
  assert.ok(rows.length > 0, 'climate panel data must exist');

  for (const row of rows) {
    for (const value of [row.annualMeanTempC, row.annualMeanDailyMinTempC, row.annualMeanDailyMaxTempC, row.heatwaveScenarioTempC, row.heatwaveScenarioHumidityPct, row.heatwaveWetBulbC]) {
      assert.ok(Number.isFinite(value), `${row.id} has a non-finite climate metric`);
    }
    assert.ok(row.heatwaveScenarioHumidityPct >= 0 && row.heatwaveScenarioHumidityPct <= 100, `${row.id} humidity outside 0..100%`);
    assert.ok(row.annualMeanDailyMinTempC <= row.annualMeanTempC && row.annualMeanTempC <= row.annualMeanDailyMaxTempC, `${row.id} annual temperature means are out of order`);
    assert.equal(row.provenance.baselineReferencePeriod, '1991-2020');
    assert.ok(Object.keys(row.provenance.dataQuality).length >= 7, `${row.id} is missing metric quality flags`);
    assert.ok(Object.keys(row.provenance.methods).length >= 7, `${row.id} is missing metric methods`);
    assert.ok(row.provenance.notes.length > 0, `${row.id} must disclose spatial/method limitations`);
    if (row.absoluteAirTemperatureRecord) assert.ok(row.absoluteAirTemperatureRecord.sourceUrl, `${row.id} record has no source`);
  }
});
