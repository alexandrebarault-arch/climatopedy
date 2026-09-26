import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const expectedIds = ['map', 'comparative-dashboard', 'tipping-points', 'causal', 'spec', 'sources'];

function readSource(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

test('top-level site section contract preserves the six page IDs and primary views', async () => {
  const module = await import('../src/data/siteSections.ts').catch(() => ({} as Record<string, unknown>));
  const sections = module.SITE_SECTIONS as { id: string; desktopLabel: string; desktopSuffix?: string; mobileLabel: string; primaryView: string }[] | undefined;
  assert.ok(Array.isArray(sections), 'the shared site section contract must exist');

  const ids = sections?.map(section => section.id) ?? [];
  assert.deepEqual(ids, expectedIds);
  assert.equal(new Set(ids).size, ids.length, 'section IDs must be unique');

  const topBar = readSource('../src/components/TopBar.tsx');
  const app = readSource('../src/App.tsx');
  for (const section of sections ?? []) {
    assert.ok(section.desktopLabel.length > 0);
    assert.ok(section.mobileLabel.length > 0);
    assert.ok(section.primaryView.length > 0);
    const sectionAccess = section.id.includes('-')
      ? `\\['${section.id}'\\]`
      : `\\.${section.id}`;
    assert.match(topBar, new RegExp(`SITE_SECTION_BY_ID${sectionAccess}\\.desktopLabel`));
    assert.match(topBar, new RegExp(`SITE_SECTION_BY_ID${sectionAccess}\\.mobileLabel`));
    if (section.desktopSuffix) assert.match(topBar, new RegExp(`SITE_SECTION_BY_ID${sectionAccess}\\.desktopSuffix`));
    assert.ok(app.includes(`currentTab === '${section.id}'`), `${section.id} must have an App render branch`);
    assert.ok(app.includes(`<${section.primaryView}`), `${section.primaryView} must be rendered by App`);
  }
});

test('map page retains its primary simulation and analysis anchors', () => {
  const app = readSource('../src/App.tsx');
  for (const component of ['WorldMap', 'TimelineController', 'ComparisonModePanel', 'KpiCharts']) {
    assert.ok(app.includes(`<${component}`), `map page must retain ${component}`);
  }
});
