import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'tests/siteGoldenMaster.v0.json'), 'utf8')) as {
  version: string;
  referenceType: string;
  pages: { id: string; primaryView: string; requiredComponents: string[] }[];
  contentAnchors: { file: string; texts: string[] }[];
  ownership: Record<string, string[]>;
};

function source(relativePath: string): string {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('site Golden Master V0 preserves page identities, views and required map structure', async () => {
  const { SITE_SECTIONS } = await import('../src/data/siteSections.ts');
  assert.equal(manifest.version, 'V0');
  assert.equal(manifest.referenceType, 'CURRENT_PRODUCT_REFERENCE');
  assert.deepEqual(SITE_SECTIONS.map(section => section.id), manifest.pages.map(page => page.id));
  const app = source('src/App.tsx');
  for (const page of manifest.pages) {
    assert.match(app, new RegExp(`currentTab === '${page.id}'`));
    assert.ok(app.includes(`<${page.primaryView}`), `${page.primaryView} must remain rendered`);
    for (const component of page.requiredComponents) assert.ok(app.includes(`<${component}`), `${component} must remain on ${page.id}`);
  }
});

test('site Golden Master V0 preserves critical content anchors', () => {
  for (const anchor of manifest.contentAnchors) {
    const text = source(anchor.file);
    for (const phrase of anchor.texts) assert.ok(text.includes(phrase), `${anchor.file} lost protected content: ${phrase}`);
  }
});

test('site Golden Master V0 exposes ownership boundaries for unrelated-zone review', () => {
  for (const files of Object.values(manifest.ownership)) {
    for (const file of files) assert.equal(fs.existsSync(path.join(root, file)), true, `owned file missing: ${file}`);
  }
});
