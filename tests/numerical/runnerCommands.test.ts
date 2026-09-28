import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

test('local harness commands are defined without changing GitHub Actions', () => {
  assert.equal(packageJson.scripts['harness:fast'], 'tsx scripts/harnessFast.ts');
  assert.equal(packageJson.scripts['harness:full'], 'tsx scripts/harnessFull.ts');
  assert.equal(fs.existsSync('.githooks/pre-commit'), true);
  assert.equal(fs.existsSync('.github/workflows/verify.yml'), true);
});
