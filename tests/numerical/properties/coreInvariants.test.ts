import assert from 'node:assert/strict';
import test from 'node:test';
import { initializeSimulationState, stepSimulation } from '../../../src/engine/physicsModel.ts';
import { scanFinite } from '../support/tolerances.ts';

test('initial and one-step states are finite and population aggregates conserve country totals', () => {
  const initial = initializeSimulationState();
  const next = stepSimulation(initial, 1);
  assert.deepEqual(scanFinite(next), []);
  const countryPopulation = Object.values(next.countries).reduce((sum, country) => sum + country.cohorts.total, 0);
  assert.equal(next.worldPopulation, countryPopulation);
  assert.ok(next.worldPopulation >= 0);
  for (const country of Object.values(next.countries)) {
    assert.ok(country.cohorts.p0 >= 0 && country.cohorts.p1 >= 0 && country.cohorts.p2 >= 0);
    assert.ok(country.calPerCapita >= 400 && country.calPerCapita <= 3500);
    assert.ok(country.calDeficitPct >= 0 && country.calDeficitPct <= 100);
  }
});

test('identical simulation inputs produce identical serialized outputs', () => {
  const left = stepSimulation(initializeSimulationState(), 1);
  const right = stepSimulation(initializeSimulationState(), 1);
  assert.deepEqual(left, right);
});
