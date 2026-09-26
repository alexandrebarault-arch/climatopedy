import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
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

test('map analysis and country inspector use the shared status and future record rule', () => {
  const map = readSource('../src/components/WorldMap.tsx');
  const inspector = readSource('../src/components/CountryInspector.tsx');

  for (const [name, source] of [['WorldMap', map], ['CountryInspector', inspector]] as const) {
    assert.match(source, /getHabitabilityStatus/, `${name} must use the shared habitability rule`);
    assert.match(source, /wetBulbPeak/, `${name} must use the active simulated wet-bulb peak`);
    assert.match(source, /calPerCapita/, `${name} must use the active simulated calorie value`);
  }

  assert.match(inspector, /shouldShowHistoricalTemperatureRecord\(simulationState\.year\)/);
});

test('site architecture guide covers the pages, shared state, data flow and verification commands', async () => {
  const guideUrl = new URL('../docs/site-architecture.md', import.meta.url);
  assert.ok(existsSync(guideUrl), 'the site architecture guide must exist');
  const guide = readFileSync(guideUrl, 'utf8');
  const { SITE_SECTIONS } = await import('../src/data/siteSections.ts');

  for (const section of SITE_SECTIONS) assert.ok(guide.includes(`\`${section.id}\``), `guide must document ${section.id}`);
  for (const component of [
    'ClimatopedyHeader', 'WorldMap', 'TimelineController', 'ComparisonModePanel', 'KpiCharts',
    'YouthExplainerCard', 'FutureConclusionCard', 'InteractiveFaqSection', 'AiFutureDebateCard',
    'CountryInspector', 'ComparativeDashboardView', 'TippingPointsView', 'CausalChainExplorer',
    'SpecModal', 'ScientificSourcesView'
  ]) assert.ok(guide.includes(component), `guide must document ${component}`);
  for (const parameter of ['scenB', 'oilRed', 'agro', 'resil', 'ecs', 'year']) {
    assert.ok(guide.includes(`\`${parameter}\``), `guide must document URL parameter ${parameter}`);
  }
  for (const command of ['npm test', 'npm run lint', 'npm run build']) assert.ok(guide.includes(`\`${command}\``));
  assert.match(guide, /Liste de contrôle avant de modifier la structure/i);
});
