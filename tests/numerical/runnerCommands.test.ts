import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

test('local harness commands are defined without changing GitHub Actions', () => {
  assert.equal(packageJson.scripts['harness:fast'], 'tsx scripts/harnessFast.ts');
  assert.equal(packageJson.scripts['harness:full'], 'tsx scripts/harnessFull.ts');
  assert.equal(fs.existsSync('.githooks/pre-commit'), true);
  assert.equal(fs.existsSync('.githooks/post-commit'), true);
  assert.equal(fs.existsSync('.github/workflows/verify.yml'), true);
});

test('impact report explains migration order dependence in plain language', () => {
  const reportScript = fs.readFileSync('scripts/reportNumericalImpact.ts', 'utf8');
  assert.match(reportScript, /migration is ORDER_DEPENDENT; reversing country iteration changes outputs/);
});
