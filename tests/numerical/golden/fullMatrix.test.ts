import assert from 'node:assert/strict';
import test from 'node:test';
import { generateFullTrajectory } from '../../../src/engine/simulationRunner.ts';
import { SCENARIO_BAU, SCENARIO_DELAYED, SCENARIO_SOBRIETY } from '../../../src/engine/simulationRunner.ts';
import { GOLDEN_CASES } from './cases.ts';

test('FULL walks every declared country-year-scenario cell against a deterministic trajectory', () => {
  let visited = 0;
  for (const scenario of [SCENARIO_BAU, SCENARIO_DELAYED, SCENARIO_SOBRIETY]) {
    const trajectory = generateFullTrajectory(scenario, 1901, 2200);
    const byYear = new Map(trajectory.map(state => [state.year, state]));
    for (const year of GOLDEN_CASES.years) {
      const state = byYear.get(year);
      assert.ok(state, `missing trajectory year ${year}`);
      for (const country of GOLDEN_CASES.countries) {
        assert.ok(state.countries[country], `missing country ${country} at ${year}`);
        visited++;
      }
    }
  }
  assert.equal(visited, 300);
});
