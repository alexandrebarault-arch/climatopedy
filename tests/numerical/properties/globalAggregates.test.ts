import assert from 'node:assert/strict';
import test from 'node:test';
import { initializeSimulationState, stepSimulation } from '../../../src/engine/physicsModel.ts';

test('world totals are sums or population-weighted means of country outputs', () => {
  const state = stepSimulation(initializeSimulationState(), 1);
  const countries = Object.values(state.countries);
  const total = countries.reduce((sum, country) => sum + country.cohorts.total, 0);
  const calories = countries.reduce((sum, country) => sum + country.calPerCapita * country.cohorts.total, 0) / total;
  assert.equal(state.worldPopulation, total);
  assert.equal(state.globalAverageCaloriesPerCapita, calories);
  assert.ok(state.globalCropYieldComposite >= 0.12);
});
