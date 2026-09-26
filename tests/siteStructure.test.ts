import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const expectedIds = ['map', 'comparative-dashboard', 'tipping-points', 'causal', 'spec', 'sources'];

function readSource(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

function countNavigationHandlers(source: string, sectionId: string): number {
  const access = sectionId.includes('-') ? `['${sectionId}']` : `.${sectionId}`;
  const handlers = source.match(/onClick=\{\(\) => handleTabClick\(SITE_SECTION_BY_ID[^\n]+\.id\)\}/g) ?? [];
  return handlers.filter(handler => handler.includes(`SITE_SECTION_BY_ID${access}.id`)).length;
}

function hasPrimaryViewInSection(source: string, sectionId: string, primaryView: string): boolean {
  const marker = `currentTab === '${sectionId}'`;
  const start = source.indexOf(marker);
  if (start < 0) return false;
  const nextBranch = source.indexOf('currentTab ===', start + marker.length);
  const branch = source.slice(start, nextBranch < 0 ? source.length : nextBranch);
  return branch.includes(`<${primaryView}`);
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
    assert.equal(countNavigationHandlers(topBar, section.id), 2, `${section.id} must be wired in desktop and mobile navigation`);
    assert.ok(hasPrimaryViewInSection(app, section.id, section.primaryView), `${section.primaryView} must be rendered inside the ${section.id} branch`);
  }
});

test('site structure checks detect disconnected navigation and swapped page views', async () => {
  const module = await import('../src/data/siteSections.ts');
  const sections = module.SITE_SECTIONS as readonly { id: string; primaryView: string }[];
  const topBar = readSource('../src/components/TopBar.tsx');
  const app = readSource('../src/App.tsx');
  const mapHandler = 'handleTabClick(SITE_SECTION_BY_ID.map.id)';
  const disconnectedNav = topBar.replace(mapHandler, '');
  assert.equal(countNavigationHandlers(disconnectedNav, 'map'), 1, 'a removed click handler must fail the two-navigation requirement');

  const swappedViews = app
    .replaceAll('ComparativeDashboardView', '__DashboardView__')
    .replaceAll('TippingPointsView', 'ComparativeDashboardView')
    .replaceAll('__DashboardView__', 'TippingPointsView');
  for (const section of sections.filter(item => item.id === 'comparative-dashboard' || item.id === 'tipping-points')) {
    assert.equal(hasPrimaryViewInSection(swappedViews, section.id, section.primaryView), false, `${section.id} must reject a view swapped into another page branch`);
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
  assert.match(map, /dyn\.annualMaxTemp\.toFixed\(1\)/, 'map must display the active year\'s mean daily maximum');
  assert.match(map, /dyn\.annualMinTemp\.toFixed\(1\)/, 'map must display the active year\'s mean daily minimum');
  assert.match(map, /projection du scénario/, 'future P99 label must not call a projection a 1991–2020 normal');
  assert.match(map, /Tw non calculable/, 'map must explain a Tw outside Stull\'s supported input range');
  assert.match(inspector, /Non calculable/, 'country detail must represent an unavailable Tw explicitly');
  assert.match(map, /return getWetBulbColor\(dyn\.wetBulbPeak\)/, 'map fills must use the tested wet-bulb color scale');
  assert.match(map, /WET_BULB_COLOR_BANDS\.map/, 'legend swatches must use the same bands as the map');
  assert.match(map, /normale proxy NASA 1991–2020/, 'map must distinguish its 2026 reference normal from observed weather');
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
