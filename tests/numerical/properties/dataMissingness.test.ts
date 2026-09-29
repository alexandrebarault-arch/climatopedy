import assert from 'node:assert/strict';
import test from 'node:test';
import { getHouseholdWaterAccessProjection, getWaterStressProjection } from '../../../src/engine/waterAccessProjections.ts';

test('missing water keys stay null and are not observed zero values', () => {
  assert.equal(getHouseholdWaterAccessProjection(null, 2050, 'bau'), null);
  assert.equal(getHouseholdWaterAccessProjection(undefined, 2050, 'bau'), null);
  assert.equal(getHouseholdWaterAccessProjection('XXX', 2050, 'bau'), null);
  assert.equal(getWaterStressProjection(null, 2050, 'bau'), null);
});
