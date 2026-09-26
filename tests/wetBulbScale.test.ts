import assert from 'node:assert/strict';
import { test } from 'node:test';

test('wet-bulb map colors follow the declared temperature bands', async () => {
  const module = await import('../src/utils/wetBulbScale.ts');
  const getWetBulbColor = module.getWetBulbColor as ((value: number | null) => string) | undefined;

  assert.equal(typeof getWetBulbColor, 'function');
  assert.equal(getWetBulbColor?.(13.99), '#1d4ed8');
  assert.equal(getWetBulbColor?.(14), '#38bdf8');
  assert.equal(getWetBulbColor?.(18), '#06b6d4');
  assert.equal(getWetBulbColor?.(22), '#facc15');
  assert.equal(getWetBulbColor?.(25), '#f59e0b');
  assert.equal(getWetBulbColor?.(27), '#f97316');
  assert.equal(getWetBulbColor?.(29), '#ef4444');
  assert.equal(getWetBulbColor?.(31), '#b91c1c');
  assert.equal(getWetBulbColor?.(33), '#701a75');
  assert.equal(getWetBulbColor?.(null), '#94a3b8');
  assert.equal(getWetBulbColor?.(Number.NaN), '#94a3b8');
});

test('wet-bulb legend labels are generated from the same bands as the map', async () => {
  const { WET_BULB_COLOR_BANDS } = await import('../src/utils/wetBulbScale.ts');
  assert.deepEqual(WET_BULB_COLOR_BANDS.map((band: { label: string }) => band.label), [
    '<14°C', '14–18°C', '18–22°C', '22–25°C', '25–27°C', '27–29°C', '29–31°C', '31–33°C', '≥33°C'
  ]);
});
