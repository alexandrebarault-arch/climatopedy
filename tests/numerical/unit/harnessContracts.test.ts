import assert from 'node:assert/strict';
import test from 'node:test';
import { compareNumber, scanFinite } from '../support/tolerances.ts';
import { GOLDEN_MASTER_MANIFEST } from '../support/manifest.ts';

test('numeric comparison accepts values inside explicit absolute or relative tolerance', () => {
  assert.equal(compareNumber(10, 10.000001, { absolute: 1e-5, relative: 1e-6 }), true);
  assert.equal(compareNumber(10, 10.1, { absolute: 1e-5, relative: 1e-6 }), false);
});

test('finite scan reports non-finite paths while allowing explicit nulls', () => {
  assert.deepEqual(scanFinite({ ok: 1, nullable: null, broken: Number.NaN }), ['broken']);
});

test('manifest pins the product reference and V0 semantics', () => {
  assert.equal(GOLDEN_MASTER_MANIFEST.version, 'V0');
  assert.equal(GOLDEN_MASTER_MANIFEST.referenceType, 'CURRENT_PRODUCT_REFERENCE');
  assert.equal(GOLDEN_MASTER_MANIFEST.productReferenceSha, '907fcb63fede8dc53df7e861bfd0b5745bcdc831');
});
