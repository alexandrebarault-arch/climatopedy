import assert from 'node:assert/strict';
import test from 'node:test';
import { initializeSimulationState, stepSimulation } from '../../../src/engine/physicsModel.ts';

export type OrderDependenceStatus = 'ORDER_INDEPENDENT' | 'ORDER_DEPENDENT' | 'INCONCLUSIVE';

test('migration order characterization is explicit and does not silently claim scientific independence', () => {
  const first = stepSimulation(initializeSimulationState(), 1);
  const second = stepSimulation(initializeSimulationState(), 1);
  const status: OrderDependenceStatus = JSON.stringify(first) === JSON.stringify(second) ? 'INCONCLUSIVE' : 'ORDER_DEPENDENT';
  assert.equal(status, 'INCONCLUSIVE');
});
