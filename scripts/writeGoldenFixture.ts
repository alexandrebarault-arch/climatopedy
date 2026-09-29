import fs from 'node:fs';
import path from 'node:path';
import { captureGoldenSubset } from '../tests/numerical/golden/capture.ts';

if (process.env.ALLOW_GOLDEN_WRITE !== '1') {
  console.error('Refusing to rewrite V0. Set ALLOW_GOLDEN_WRITE=1 and run this command only after human review.');
  process.exit(2);
}
const fixturePath = path.resolve('tests/numerical/golden/fixtures/v0/reference.json');
fs.writeFileSync(fixturePath, `${JSON.stringify(captureGoldenSubset(), null, 2)}\n`, 'utf8');
console.log(`Golden fixture explicitly written: ${fixturePath}`);
