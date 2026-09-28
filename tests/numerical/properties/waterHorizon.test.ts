import assert from 'node:assert/strict';
import test from 'node:test';
import { getHouseholdWaterAccessProjection, getWaterStressProjection } from '../../../src/engine/waterAccessProjections.ts';

test('water access exposes within, at, and beyond data horizon states', () => {
  const within = getHouseholdWaterAccessProjection('FRA', 2050, 'bau');
  const at = getHouseholdWaterAccessProjection('FRA', 2095, 'bau');
  const beyond = getHouseholdWaterAccessProjection('FRA', 2200, 'bau');
  assert.equal(within?.method, 'published');
  assert.equal(at?.method, 'published');
  assert.equal(beyond?.method, 'post-horizon-reference');
  assert.equal(getWaterStressProjection('FRA', 2200, 'bau')?.method, 'post-horizon-risk-reference');
});
