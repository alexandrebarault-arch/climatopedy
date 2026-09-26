import assert from 'node:assert/strict';
import { test } from 'node:test';

test('human impact score combines heat, calorie deficit, birth-rate decline and population reach', async () => {
  const { getHumanImpactScore } = await import('../src/utils/humanImpactScale.ts');

  const baseline = {
    annualMaxTemp: 20,
    referenceMaxTemp: 20,
    caloriesPerCapita: 2800,
    baseBirthRatePerThousand: 16,
    birthRatePerThousand: 16,
    populationMillions: 50,
  };
  assert.equal(getHumanImpactScore(baseline), 0);

  const stressed = getHumanImpactScore({
    ...baseline,
    annualMaxTemp: 26,
    caloriesPerCapita: 1100,
    birthRatePerThousand: 8,
    populationMillions: 100,
  });
  assert.ok(stressed > 0.85 && stressed <= 1);

  const sameStressSmallerPopulation = getHumanImpactScore({
    ...baseline,
    annualMaxTemp: 26,
    caloriesPerCapita: 1100,
    birthRatePerThousand: 8,
    populationMillions: 1,
  });
  assert.ok(stressed > sameStressSmallerPopulation);
});

test('human impact color bands progress from neutral to dark red and reject invalid data', async () => {
  const { getHumanImpactColor } = await import('../src/utils/humanImpactScale.ts');
  assert.equal(getHumanImpactColor(0), '#fef3c7');
  assert.equal(getHumanImpactColor(0.3), '#f97316');
  assert.equal(getHumanImpactColor(0.75), '#7f1d1d');
  assert.equal(getHumanImpactColor(Number.NaN), '#94a3b8');
});
