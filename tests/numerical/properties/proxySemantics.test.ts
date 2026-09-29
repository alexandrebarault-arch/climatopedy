import assert from 'node:assert/strict';
import test from 'node:test';
import { projectHeatHazard } from '../../../src/engine/heatHazardProjections.ts';

test('CCKP heat outputs retain proxy semantics through the adapter method', () => {
  const result = projectHeatHazard({ countryId: 'fra', referenceP99C: 35, referenceHumidityPct: 40, warmSeasonMonths: [6, 7, 8], year: 2050, scenarioId: 'bau', globalTemperatureAnomaly: 1.8 });
  assert.equal(result.method, 'cmip6-delta');
  assert.ok(Number.isFinite(result.p99C) && Number.isFinite(result.humidityPct));
});
