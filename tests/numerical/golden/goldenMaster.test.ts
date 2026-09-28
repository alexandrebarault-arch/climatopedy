import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { captureGoldenSubset } from './capture.ts';
import { assertGolden } from './compare.ts';
import { GOLDEN_CASES } from './cases.ts';
import { GOLDEN_MASTER_MANIFEST } from '../support/manifest.ts';

const fixturePath = path.resolve('tests/numerical/golden/fixtures/v0/reference.json');
const expected = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

test('V0 golden manifest covers the required matrix and current reference', () => {
  if (GOLDEN_CASES.countries.length !== 10 || GOLDEN_CASES.years.length !== 10 || GOLDEN_CASES.scenarios.length !== 3) throw new Error('incomplete V0 matrix');
  if (GOLDEN_MASTER_MANIFEST.referenceType !== 'CURRENT_PRODUCT_REFERENCE') throw new Error('wrong reference type');
});

test('V0 golden subset matches serialized current-product reference', () => {
  assertGolden(captureGoldenSubset(), expected);
});
