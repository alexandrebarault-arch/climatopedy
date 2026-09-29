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
    warmSeasonMonths: number[];
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

test('projected daily extrema share the 1991–2020 anomaly offset without a first-year jump', async () => {
  const [module, panelModule, cckp, temperatureReference] = await Promise.all([
    import('../src/engine/countryTemperatures.ts'),
    import('../src/data/climatePanelData.json', { with: { type: 'json' } }),
    import('../src/data/cckpCountryTemperatures.json', { with: { type: 'json' } }),
    import('../src/engine/temperatureReference.ts')
  ]);
  const panel = (panelModule.default as { rows: PanelRow[] }).rows.find(row => row.id === 'fra')!;
  const data = cckp.default as { baseline: Record<string, { tasmax: number; tasmin: number }>; future: Record<string, Record<string, { tasmax: number; tasmin: number }>> };
  const baseline = { tas: panel.annualMeanTempC, tasmin: panel.annualMeanDailyMinTempC, tasmax: panel.annualMeanDailyMaxTempC };
  const offset = (1.34 - temperatureReference.GLOBAL_TEMPERATURE_REFERENCE_1991_2020_C) * 1.35;
  const current = module.getCountryTemperatures('fra', baseline, 2026);
  const firstFuture = module.getCountryTemperatures('fra', baseline, 2027);
  assert.deepEqual(current, { tas: baseline.tas + offset, tasmin: baseline.tasmin + offset, tasmax: baseline.tasmax + offset });
  assert.ok(Math.abs(firstFuture.tasmax - current.tasmax) < 0.2, 'Tmax must not jump in the first projected year');
  assert.ok(Math.abs(firstFuture.tasmin - current.tasmin) < 0.2, 'Tmin must not jump in the first projected year');
  assert.equal(firstFuture.tasmax, baseline.tasmax + offset + (data.future.ssp245.fra.tasmax - data.baseline.fra.tasmax) / 74);
  assert.equal(firstFuture.tasmin, baseline.tasmin + offset + (data.future.ssp245.fra.tasmin - data.baseline.fra.tasmin) / 74);

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
  const [runner, temperatureReference] = await Promise.all([import('../src/engine/simulationRunner.ts'), import('../src/engine/temperatureReference.ts')]);
  const trajectory = runner.generateFullTrajectory(runner.SCENARIO_BAU, 2026, 2100);
  const year2026 = trajectory.find(state => state.year === 2026)!;
  const year2027 = trajectory.find(state => state.year === 2027)!;
  const year2100 = trajectory.find(state => state.year === 2100)!;
  const panel = loadPanelRows().find(row => row.id === 'fra')!;

  const offset = (1.34 - temperatureReference.GLOBAL_TEMPERATURE_REFERENCE_1991_2020_C) * 1.35;
  assert.equal(year2026.countries.fra.annualMinTemp, panel.annualMeanDailyMinTempC + offset);
  assert.equal(year2026.countries.fra.annualMaxTemp, panel.annualMeanDailyMaxTempC + offset);
  assert.ok(year2027.countries.fra.annualMaxTemp - year2026.countries.fra.annualMaxTemp < 0.2);
  assert.ok(year2027.countries.fra.annualMinTemp - year2026.countries.fra.annualMinTemp < 0.2);
  assert.ok(year2100.countries.ind.summerMaxTemp > 50);
  assert.equal(year2100.countries.ind.wetBulbPeak, null);
});

test('temperature trajectories remain complete, ordered, and do not reset in 2026 or plateau after 2100', async () => {
  const runner = await import('../src/engine/simulationRunner.ts');
  const [{ COUNTRIES_DATA }, temperatureReference, physics, quality] = await Promise.all([
    import('../src/data/countriesData.ts'),
    import('../src/engine/temperatureReference.ts'),
    import('../src/engine/physicsModel.ts'),
    import('../src/engine/temperatureQuality.ts')
  ]);
  const scenarios = [runner.SCENARIO_BAU, runner.SCENARIO_DELAYED, runner.SCENARIO_SOBRIETY];
  const trajectories = scenarios.map(scenario => runner.generateFullTrajectory(scenario, 1901, 2200));
  for (let scenarioIndex = 0; scenarioIndex < scenarios.length; scenarioIndex++) {
    const scenarioTrajectory = trajectories[scenarioIndex];
    assert.equal(scenarioTrajectory.length, 300, `${scenarios[scenarioIndex].id} must include all years 1901–2200`);
    assert.equal(scenarioTrajectory[0].year, 1901);
    assert.equal(scenarioTrajectory.at(-1)?.year, 2200);
    for (const country of COUNTRIES_DATA) {
      for (let index = 0; index < scenarioTrajectory.length; index++) {
        const state = scenarioTrajectory[index].countries[country.id];
        const year = 1901 + index;
        assert.ok(Number.isFinite(state.dryBulbTemp), `${country.id}/${scenarios[scenarioIndex].id} has no mean temperature in ${year}`);
        assert.ok(Number.isFinite(state.annualMinTemp) && Number.isFinite(state.annualMaxTemp), `${country.id}/${scenarios[scenarioIndex].id} has incomplete extrema in ${year}`);
        assert.ok(state.annualMinTemp <= state.dryBulbTemp && state.dryBulbTemp <= state.annualMaxTemp, `${country.id}/${scenarios[scenarioIndex].id} temperature ordering fails in ${year}`);
        assert.ok(Number.isFinite(state.summerMaxTemp) && Number.isFinite(state.summerHumidity), `${country.id}/${scenarios[scenarioIndex].id} heat metrics missing in ${year}`);
        assert.ok(state.summerHumidity >= 0 && state.summerHumidity <= 100, `${country.id}/${scenarios[scenarioIndex].id} RH outside physical bounds in ${year}`);
        assert.ok(state.summerMaxTemp >= state.annualMaxTemp, `${country.id}/${scenarios[scenarioIndex].id} P99 falls below annual mean Tmax in ${year}`);
        assert.equal(state.wetBulbPeak, physics.calculateScenarioWetBulb(state.summerMaxTemp, state.summerHumidity), `${country.id}/${scenarios[scenarioIndex].id} Tw not recalculated from P99 and RH in ${year}`);
        const previous = index > 0 ? scenarioTrajectory[index - 1].countries[country.id] : undefined;
        const qualityResult = quality.auditTemperatureYear(state, physics.calculateScenarioWetBulb(state.summerMaxTemp, state.summerHumidity), previous);
        assert.equal(qualityResult.errors.length, 0, `${country.id}/${scenarios[scenarioIndex].id} quality audit failed in ${year}: ${qualityResult.errors.map(issue => issue.code).join(',')}`);
      }
      const y2025 = scenarioTrajectory.find(state => state.year === 2025)!.countries[country.id].dryBulbTemp;
      const y2026 = scenarioTrajectory.find(state => state.year === 2026)!.countries[country.id].dryBulbTemp;
      const y2100 = scenarioTrajectory.find(state => state.year === 2100)!.countries[country.id].dryBulbTemp;
      const y2200 = scenarioTrajectory.find(state => state.year === 2200)!.countries[country.id].dryBulbTemp;
      assert.ok(Math.abs(y2026 - y2025) < 0.15, `${country.id}/${scenarios[scenarioIndex].id} discontinuity around 2026`);
      assert.ok(y2200 > y2100, `${country.id}/${scenarios[scenarioIndex].id} frozen after 2100`);
    }
  }
  const nasa = await import('../src/data/nasaGistempAnnualAnomalies.json', { with: { type: 'json' } });
  const nasaFile = nasa.default as { rows: Array<{ year: number }> };
  assert.equal(nasaFile.rows.length, 125);
  assert.equal(nasaFile.rows[0].year, 1901);
  assert.equal(nasaFile.rows.at(-1)?.year, 2025);
  for (let year = 1901; year <= 2025; year++) assert.equal(nasaFile.rows[year - 1901].year, year, `missing NASA global anomaly for ${year}`);
  assert.ok(Number.isFinite(temperatureReference.GLOBAL_TEMPERATURE_REFERENCE_1991_2020_C));
});

test('map defaults to modeled habitability constraints while keeping Tmax and wet-bulb as diagnostic layers', async () => {
  const { readFile } = await import('node:fs/promises');
  const source = await readFile(new URL('../src/components/WorldMap.tsx', import.meta.url), 'utf8');
  assert.match(source, /useState<MetricLayer>\('habitability'\)/);
  assert.match(source, /setActiveMetric\('habitability'\)/);
  assert.match(source, /HABITABILITY_COLOR_BANDS/);
  assert.match(source, /setActiveMetric\('air_temperature'\)/);
  assert.match(source, /getHabitabilityStatus\(\{/);
  assert.match(source, /wetBulbPeakC:\s*dyn\.wetBulbPeak/);
  assert.match(source, /caloriesKcalPerPersonDay:\s*dyn\.calPerCapita/);
  assert.match(source, /dyn\.annualMaxTemp/);
  assert.match(source, /Moyenne annuelle des Tmax quotidiennes/);
});

test('heatwave P99 and humidity use separate CMIP6 extreme-temperature and warm-season humidity deltas', async () => {
  const [projection, cckp, climatePanel, temperatureReference, physics] = await Promise.all([
    import('../src/engine/heatHazardProjections.ts'),
    import('../src/data/cckpHeatHazardProjections.json', { with: { type: 'json' } }),
    import('../src/data/climatePanelData.json', { with: { type: 'json' } }),
    import('../src/engine/temperatureReference.ts'),
    import('../src/engine/physicsModel.ts')
  ]);
  const panel = (climatePanel.default as { rows: PanelRow[] }).rows.find(row => row.id === 'fra')!;
  const data = cckp.default as {
    zones: Record<string, {
      warmSeasonMonths: number[];
      baseline: { txx: number; hurs: number[] };
      future: Record<string, { txx: number; hurs: number[] }>;
    }>;
  };
  const zone = data.zones.fra;
  const months = panel.provenance.warmSeasonMonths;
  const warmMean = (values: number[]) => months.reduce((sum, month) => sum + values[month - 1], 0) / months.length;
  const get = projection.projectHeatHazard as (input: {
    countryId: string; referenceP99C: number; referenceHumidityPct: number; warmSeasonMonths: number[];
    year: number; scenarioId?: string; globalTemperatureAnomaly?: number;
  }) => { p99C: number; humidityPct: number; method: string };
  const input = { countryId: 'fra', referenceP99C: panel.heatwaveScenarioTempC, referenceHumidityPct: panel.heatwaveScenarioHumidityPct, warmSeasonMonths: months, scenarioId: 'bau' };
  const start = get({ ...input, year: 2026, globalTemperatureAnomaly: 1.34 });
  const offset = (1.34 - temperatureReference.GLOBAL_TEMPERATURE_REFERENCE_1991_2020_C) * 1.35;
  assert.ok(Math.abs(start.p99C - (panel.heatwaveScenarioTempC + offset)) < 1e-10, '2026 P99 must preserve the NASA POWER baseline plus existing reference offset');
  assert.equal(start.humidityPct, panel.heatwaveScenarioHumidityPct, '2026 humidity must preserve the heat-day estimate');

  const at2100 = get({ ...input, year: 2100, globalTemperatureAnomaly: 2.41083138670827 });
  const expectedP99 = panel.heatwaveScenarioTempC + offset + zone.future.ssp585.txx - zone.baseline.txx;
  const expectedHumidity = panel.heatwaveScenarioHumidityPct + warmMean(zone.future.ssp585.hurs) - warmMean(zone.baseline.hurs);
  assert.ok(Math.abs(at2100.p99C - expectedP99) < 1e-10, 'P99 should use CCKP TXx delta, not annual mean Tmax delta');
  assert.ok(Math.abs(at2100.humidityPct - expectedHumidity) < 1e-10, 'summer humidity should use CCKP Hurs change for warm months');
  assert.notEqual(at2100.humidityPct, start.humidityPct, 'future humidity must no longer be frozen at its baseline');
  assert.equal(at2100.method, 'cmip6-delta');
  const projectedTw = physics.calculateScenarioWetBulb(at2100.p99C, at2100.humidityPct);
  assert.ok(projectedTw !== null && projectedTw < at2100.p99C, 'Tw must be recomputed from projected P99 and humidity');

  const ssp126 = get({ ...input, year: 2100, scenarioId: 'sobriety', globalTemperatureAnomaly: 2.1904169375126314 });
  assert.ok(at2100.p99C > ssp126.p99C, 'P99 should differ by pathway');
  assert.notEqual(at2100.humidityPct, ssp126.humidityPct, 'Hurs should follow the selected pathway');
  const at2200 = get({ ...input, year: 2200, globalTemperatureAnomaly: 2.696 });
  assert.ok(at2200.p99C > at2100.p99C, 'P99 should continue only as an explicit post-2100 extrapolation');
  assert.ok(at2200.humidityPct >= 0 && at2200.humidityPct <= 100);
  assert.equal(at2200.method, 'post2100-extrapolation');
});

test('CCKP heat-hazard inputs cover every model zone and have complete scenario fields', async () => {
  const [hazards, countries] = await Promise.all([
    import('../src/data/cckpHeatHazardProjections.json', { with: { type: 'json' } }),
    import('../src/data/countriesData.ts')
  ]);
  const data = hazards.default as { zones: Record<string, { members: string[]; baseline: { txx: number; hurs: number[] }; future: Record<string, { txx: number; hurs: number[] }> }> };
  const { COUNTRIES_DATA } = countries;
  assert.equal(Object.keys(data.zones).length, COUNTRIES_DATA.length);
  for (const country of COUNTRIES_DATA) {
    const zone = data.zones[country.id];
    assert.ok(zone, `${country.id} is missing CCKP hazard projections`);
    assert.ok(zone.members.length > 0, `${country.id} has no country members`);
    assert.ok(Number.isFinite(zone.baseline.txx));
    assert.equal(zone.baseline.hurs.length, 12);
    for (const scenario of ['ssp126', 'ssp245', 'ssp585']) {
      assert.ok(Number.isFinite(zone.future[scenario].txx), `${country.id}/${scenario} TXx missing`);
      assert.equal(zone.future[scenario].hurs.length, 12, `${country.id}/${scenario} Hurs months missing`);
      assert.ok(zone.future[scenario].hurs.every(value => Number.isFinite(value) && value >= 0 && value <= 100));
    }
  }
});

test('2026 simulation initializes the heat scenario and Tw from the adjusted 2026 baseline', async () => {
  const [engine, panelModule, temperatureReference] = await Promise.all([
    import('../src/engine/physicsModel.ts'),
    import('../src/data/climatePanelData.json', { with: { type: 'json' } }),
    import('../src/engine/temperatureReference.ts')
  ]);
  const initial = engine.initializeSimulationState();
  const panel = (panelModule.default as { rows: PanelRow[] }).rows.find(row => row.id === 'fra');
  const state = initial.countries.fra;
  assert.ok(panel);
  const heatOffset = (1.34 - temperatureReference.GLOBAL_TEMPERATURE_REFERENCE_1991_2020_C) * 1.35;
  assert.equal(state.summerMaxTemp, (panel?.heatwaveScenarioTempC ?? 0) + heatOffset);
  assert.equal(state.summerHumidity, panel?.heatwaveScenarioHumidityPct);
  assert.ok(state.wetBulbPeak !== panel?.heatwaveWetBulbC, 'Tw must be recalculated from the adjusted air temperature');
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
