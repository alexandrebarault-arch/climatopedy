import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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

test('GitHub Actions applies the canonical gate to pull requests and main updates', () => {
  const workflow = readFileSync(new URL('../.github/workflows/verify.yml', import.meta.url), 'utf8');
  assert.match(workflow, /pull_request:\s*\n\s*branches: \[main\]/);
  assert.match(workflow, /push:\s*\n\s*branches: \[main\]/);
  assert.match(workflow, /run: npm run verify/);
});
