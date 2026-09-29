import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateEroiAndNetEnergy,
  calculateScenarioWetBulb,
  calculateWetBulbStull
} from '../../../src/engine/physicsModel.ts';
import { getHouseholdWaterAccessProjection, getWaterStressProjection } from '../../../src/engine/waterAccessProjections.ts';
import { compareNumber } from '../support/tolerances.ts';

test('EROI reference vector preserves current product coefficients and floors', () => {
  const result = calculateEroiAndNetEnergy(1.45e12);
  assert.equal(compareNumber(result.currentEroi, 11.951907504100717, { absolute: 1e-12, relative: 1e-12 }), true);
  assert.ok(result.netEnergyRatio >= 0.01 && result.netEnergyRatio < 1);
  assert.equal(calculateEroiAndNetEnergy(Number.POSITIVE_INFINITY).currentEroi, 1.05);
});

test('Stull raw and scenario APIs preserve their distinct boundary behaviour', () => {
  assert.ok(Number.isFinite(calculateWetBulbStull(25, 60)));
  assert.equal(calculateScenarioWetBulb(-20, 5) !== null, true);
  assert.equal(calculateScenarioWetBulb(-20.01, 5), null);
  assert.equal(calculateScenarioWetBulb(25, 4.99), null);
});

test('water projections preserve published and post-horizon provenance', () => {
  const published = getHouseholdWaterAccessProjection('FRA', 2050, 'bau');
  assert.ok(published);
  assert.equal(published.method, 'published');
  const held = getHouseholdWaterAccessProjection('FRA', 2200, 'bau');
  assert.ok(held);
  assert.equal(held.method, 'post-horizon-reference');
  assert.equal(getHouseholdWaterAccessProjection('XXX', 2050, 'bau'), null);
  const stress = getWaterStressProjection('FRA', 2200, 'bau');
  assert.ok(stress);
  assert.equal(stress.method, 'post-horizon-risk-reference');
});
