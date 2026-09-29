import assert from 'node:assert/strict';
import { test } from 'node:test';

const modulePromise = import('../src/engine/habitabilityStatus.ts').catch(() => ({} as Record<string, unknown>));

function inputs(wetBulbPeakC: number | null, caloriesKcalPerPersonDay: number, improvedWaterAccessPct: number | null = 100) {
  return {
    wetBulbPeakC,
    annualMeanDailyMaxTempC: 25,
    hotSeasonP99C: 30,
    caloriesKcalPerPersonDay,
    improvedWaterAccessPct,
    nationalWaterStressCategory: 0
  };
}

test('habitability status advances through heat and calorie constraint levels', async () => {
  const module = await modulePromise;
  const getHabitabilityStatus = module.getHabitabilityStatus as ((input: ReturnType<typeof inputs>) => {
    key: string; label: string; explanation: string; severity: string;
  } | null) | undefined;
  assert.equal(typeof getHabitabilityStatus, 'function');

  const favorable = getHabitabilityStatus?.(inputs(25.99, 2100));
  const moderateHeat = getHabitabilityStatus?.(inputs(26, 2100));
  const highHeat = getHabitabilityStatus?.(inputs(27, 2100));
  const majorHeat = getHabitabilityStatus?.(inputs(28, 2100));
  const extremeHeat = getHabitabilityStatus?.(inputs(29, 2100));
  const moderateFood = getHabitabilityStatus?.(inputs(25, 2099));
  const highFood = getHabitabilityStatus?.(inputs(25, 1899));
  const majorFood = getHabitabilityStatus?.(inputs(25, 1699));
  const extremeFood = getHabitabilityStatus?.(inputs(25, 1499));

  assert.equal(favorable?.key, 'favorable');
  assert.equal(moderateHeat?.key, 'constrained');
  assert.equal(highHeat?.key, 'high');
  assert.equal(majorHeat?.key, 'major');
  assert.equal(extremeHeat?.key, 'extreme');
  assert.equal(moderateFood?.key, 'constrained');
  assert.equal(highFood?.key, 'high');
  assert.equal(majorFood?.key, 'major');
  assert.equal(extremeFood?.key, 'extreme');
  assert.equal(getHabitabilityStatus?.(inputs(29, 1499))?.key, 'extreme', 'the strongest modeled constraint determines the map class');
  for (const status of [favorable, moderateHeat, highHeat, majorHeat, extremeHeat, moderateFood, highFood, majorFood, extremeFood]) {
    assert.ok(status?.label);
    assert.match(status?.explanation ?? '', /modélis/i);
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

test('habitability status treats non-finite inputs as missing dimensions', async () => {
  const module = await modulePromise;
  const getHabitabilityStatus = module.getHabitabilityStatus as ((input: ReturnType<typeof inputs>) => unknown) | undefined;
  assert.equal(typeof getHabitabilityStatus, 'function');
  const missingHeat = getHabitabilityStatus?.(inputs(Number.NaN, 2100)) as { key?: string; missingDimensions?: string[] } | null;
  assert.equal(missingHeat?.key, 'favorable');
  assert.ok(missingHeat?.missingDimensions?.includes('chaleur humide'));
  assert.equal(getHabitabilityStatus?.(inputs(null, 2100, null)), null, 'unknown heat cannot be presented as favorable');
  assert.equal((getHabitabilityStatus?.(inputs(null, 2000, null)) as { key?: string })?.key, 'constrained', 'known food stress remains visible when Tw is unavailable');
  const missingFood = getHabitabilityStatus?.(inputs(25, Number.POSITIVE_INFINITY)) as { key?: string; missingDimensions?: string[] } | null;
  assert.equal(missingFood?.key, 'favorable');
  assert.ok(missingFood?.missingDimensions?.includes('disponibilité calorique'));
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
