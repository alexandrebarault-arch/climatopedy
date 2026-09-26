import assert from 'node:assert/strict';
import { test } from 'node:test';

const modulePromise = import('../src/engine/habitabilityStatus.ts').catch(() => ({} as Record<string, unknown>));

test('habitability status advances through heat and calorie constraint levels', async () => {
  const module = await modulePromise;
  const getHabitabilityStatus = module.getHabitabilityStatus as ((wetBulbPeakC: number | null, caloriesKcalPerPersonDay: number) => {
    key: string; label: string; explanation: string; severity: string;
  } | null) | undefined;
  assert.equal(typeof getHabitabilityStatus, 'function');

  const favorable = getHabitabilityStatus?.(25.99, 2100);
  const moderateHeat = getHabitabilityStatus?.(26, 2100);
  const highHeat = getHabitabilityStatus?.(27, 2100);
  const majorHeat = getHabitabilityStatus?.(28, 2100);
  const extremeHeat = getHabitabilityStatus?.(29, 2100);
  const moderateFood = getHabitabilityStatus?.(25, 2099);
  const highFood = getHabitabilityStatus?.(25, 1899);
  const majorFood = getHabitabilityStatus?.(25, 1699);
  const extremeFood = getHabitabilityStatus?.(25, 1499);

  assert.equal(favorable?.key, 'favorable');
  assert.equal(moderateHeat?.key, 'constrained');
  assert.equal(highHeat?.key, 'high');
  assert.equal(majorHeat?.key, 'major');
  assert.equal(extremeHeat?.key, 'extreme');
  assert.equal(moderateFood?.key, 'constrained');
  assert.equal(highFood?.key, 'high');
  assert.equal(majorFood?.key, 'major');
  assert.equal(extremeFood?.key, 'extreme');
  assert.equal(getHabitabilityStatus?.(29, 1499)?.key, 'extreme', 'the strongest modeled constraint determines the map class');
  for (const status of [favorable, moderateHeat, highHeat, majorHeat, extremeHeat, moderateFood, highFood, majorFood, extremeFood]) {
    assert.ok(status?.label);
    assert.match(status?.explanation ?? '', /modèle/i);
    assert.doesNotMatch(`${status?.label} ${status?.explanation}`, /inhabitable/i);
  }
});

test('habitability classes map from pale yellow through progressively darker reds', async () => {
  const module = await modulePromise;
  const getHabitabilityColor = module.getHabitabilityColor as ((key: string | null) => string) | undefined;
  assert.equal(getHabitabilityColor?.('favorable'), '#fef3c7');
  assert.equal(getHabitabilityColor?.('constrained'), '#fdba74');
  assert.equal(getHabitabilityColor?.('high'), '#f97316');
  assert.equal(getHabitabilityColor?.('major'), '#dc2626');
  assert.equal(getHabitabilityColor?.('extreme'), '#7f1d1d');
  assert.equal(getHabitabilityColor?.(null), '#94a3b8');
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
