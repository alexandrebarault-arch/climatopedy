import assert from 'node:assert/strict';
import { test } from 'node:test';

const modulePromise = import('../src/engine/habitabilityStatus.ts').catch(() => ({} as Record<string, unknown>));

test('habitability status uses the existing wet-bulb and calorie boundaries', async () => {
  const module = await modulePromise;
  const getHabitabilityStatus = module.getHabitabilityStatus as ((wetBulbPeakC: number | null, caloriesKcalPerPersonDay: number) => {
    key: string; label: string; explanation: string; severity: string;
  } | null) | undefined;
  assert.equal(typeof getHabitabilityStatus, 'function');

  const favorable = getHabitabilityStatus?.(25.99, 2100);
  const heatWarning = getHabitabilityStatus?.(26, 2100);
  const highHeatWarning = getHabitabilityStatus?.(30.99, 2100);
  const majorHeat = getHabitabilityStatus?.(31, 2100);
  const foodWarning = getHabitabilityStatus?.(25, 2099);
  const bothWarnings = getHabitabilityStatus?.(31, 1900);

  assert.equal(favorable?.key, 'favorable');
  assert.equal(heatWarning?.key, 'constrained');
  assert.equal(highHeatWarning?.key, 'constrained');
  assert.equal(majorHeat?.key, 'major');
  assert.equal(foodWarning?.key, 'constrained');
  assert.equal(bothWarnings?.key, 'major', 'the higher heat category takes precedence');
  for (const status of [favorable, heatWarning, highHeatWarning, majorHeat, foodWarning, bothWarnings]) {
    assert.ok(status?.label);
    assert.match(status?.explanation ?? '', /modèle/i);
    assert.doesNotMatch(`${status?.label} ${status?.explanation}`, /inhabitable/i);
  }
});

test('habitability status is unavailable for non-finite inputs', async () => {
  const module = await modulePromise;
  const getHabitabilityStatus = module.getHabitabilityStatus as ((wetBulbPeakC: number | null, caloriesKcalPerPersonDay: number) => unknown) | undefined;
  assert.equal(typeof getHabitabilityStatus, 'function');
  assert.equal(getHabitabilityStatus?.(Number.NaN, 2100), null);
  assert.equal(getHabitabilityStatus?.(null, 2100), null, 'unknown heat cannot be presented as favorable');
  assert.equal((getHabitabilityStatus?.(null, 2000) as { key?: string })?.key, 'constrained', 'known food stress remains visible when Tw is unavailable');
  assert.equal(getHabitabilityStatus?.(25, Number.POSITIVE_INFINITY), null);
});

test('historical temperature records are hidden after the 2026 baseline', async () => {
  const module = await modulePromise;
  const shouldShowHistoricalTemperatureRecord = module.shouldShowHistoricalTemperatureRecord as ((year: number) => boolean) | undefined;
  assert.equal(typeof shouldShowHistoricalTemperatureRecord, 'function');
  assert.equal(shouldShowHistoricalTemperatureRecord?.(2019), true);
  assert.equal(shouldShowHistoricalTemperatureRecord?.(2026), true);
  assert.equal(shouldShowHistoricalTemperatureRecord?.(2026.01), false);
  assert.equal(shouldShowHistoricalTemperatureRecord?.(2100), false);
  assert.equal(shouldShowHistoricalTemperatureRecord?.(Number.NaN), false);
});
