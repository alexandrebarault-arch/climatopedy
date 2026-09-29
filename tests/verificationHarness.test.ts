import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as {
  scripts: Record<string, string>;
};

test('the canonical verify command runs the complete regression gate', () => {
  const verify = packageJson.scripts.verify;
  assert.ok(verify, 'npm run verify must be the single local verification entry point');
  for (const required of ['npm test', 'npm run lint', 'npm run build']) {
    assert.ok(verify.includes(required), `npm run verify must run ${required}`);
  }
});

test('production builds cannot skip the climate and national-data audits', () => {
  const build = packageJson.scripts.build;
  assert.ok(build.includes('npm run audit:climate'));
  assert.ok(build.includes('npm run audit:data-country'));
  assert.ok(build.includes('vite build'));
});

test('the editorial audit is available as a standalone local command', () => {
  const audit = packageJson.scripts['audit:editorial'];
  assert.ok(audit, 'npm run audit:editorial must be available for local editorial review');
  assert.match(audit, /auditEditorialComprehension\.ts/);
  assert.doesNotMatch(packageJson.scripts.verify, /audit:editorial/);
  assert.doesNotMatch(packageJson.scripts.build, /audit:editorial/);
});

test('verification is local and the repository has no GitHub Actions workflow', () => {
  assert.equal(existsSync(new URL('../.github/workflows/verify.yml', import.meta.url)), false);
});
