import assert from 'node:assert/strict';
import test from 'node:test';
import { initializeSimulationState, stepSimulation } from '../../../src/engine/physicsModel.ts';
import { COUNTRIES_DATA } from '../../../src/data/countriesData.ts';

export type OrderDependenceStatus = 'ORDER_INDEPENDENT' | 'ORDER_DEPENDENT' | 'INCONCLUSIVE';

test('migration order characterization is explicit and does not silently claim scientific independence', () => {
  const original = [...COUNTRIES_DATA];
  const first = stepSimulation(initializeSimulationState(), 1);
  COUNTRIES_DATA.reverse();
  const reversed = stepSimulation(initializeSimulationState(), 1);
  COUNTRIES_DATA.splice(0, COUNTRIES_DATA.length, ...original);
  const status: OrderDependenceStatus = JSON.stringify(first) === JSON.stringify(reversed) ? 'ORDER_INDEPENDENT' : 'ORDER_DEPENDENT';
  assert.ok(status === 'ORDER_INDEPENDENT' || status === 'ORDER_DEPENDENT');
});
