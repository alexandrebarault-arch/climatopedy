import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { afterEach, test } from 'node:test';
import { auditEditorialComprehension, getEditorialExitCode } from '../scripts/auditEditorialComprehension.ts';

const roots: string[] = [];

interface TestRule {
  id: string;
  term: string;
  category: string;
  severity: 'error' | 'warning';
  readerExplanation: string;
  explanationPattern?: string;
}

const smilRule: TestRule = {
  id: 'smil',
  term: '\\bSmil\\b',
  category: 'person',
  severity: 'warning',
  readerExplanation: 'Vaclav Smil est un chercheur spécialiste de l’énergie.',
  explanationPattern: '\\bVaclav\\s+Smil\\b.{0,80}\\b(chercheur|spécialiste|historien|professeur)'
};

function createFixture(options: { source: string; rules?: TestRule[] }): string {
  const root = mkdtempSync(join(tmpdir(), 'editorial-audit-'));
  roots.push(root);
  mkdirSync(join(root, 'docs', 'editorial'), { recursive: true });
  mkdirSync(join(root, 'src', 'components'), { recursive: true });
  writeFileSync(join(root, 'docs', 'editorial', 'terms.json'), JSON.stringify({ terms: options.rules ?? [smilRule] }));
  writeFileSync(join(root, 'src', 'components', 'Faq.tsx'), options.source);
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

test('flags a researcher mention when its local paragraph does not identify the person', () => {
  const root = createFixture({ source: '<p>Smil estimait ce chiffre autour de 2000.</p>\n' });
  const diagnostics = auditEditorialComprehension(root);

  assert.equal(diagnostics.length, 1);
  assert.equal(diagnostics[0].termId, 'smil');
  assert.equal(diagnostics[0].severity, 'warning');
  assert.equal(diagnostics[0].file, 'src/components/Faq.tsx');
  assert.equal(diagnostics[0].line, 1);
  assert.match(diagnostics[0].message, /Vaclav Smil/);
});

test('accepts a plain-language identification in the same paragraph', () => {
  const root = createFixture({ source: '<p>Vaclav Smil, chercheur spécialiste de l’énergie, estimait ce chiffre.</p>\n' });

  assert.deepEqual(auditEditorialComprehension(root), []);
});

test('accepts a plain-language identification when the name has inline emphasis', () => {
  const root = createFixture({ source: '<p>Vaclav <strong>Smil</strong>, chercheur spécialiste de l’énergie, estimait ce chiffre.</p>\n' });

  assert.deepEqual(auditEditorialComprehension(root), []);
});

test('warns when the FaIR model acronym appears without a plain-language explanation', () => {
  const fairRule: TestRule = {
    id: 'fair',
    term: '\\bFaIR\\b',
    category: 'model',
    severity: 'warning',
    readerExplanation: 'FaIR est un modèle climatique réduit qui simule la réponse du climat à des émissions.',
    explanationPattern: '(?:modèle climatique réduit|modèle de réponse impulsionnelle à amplitude finie)'
  };
  const root = createFixture({ source: '<p>FaIR calcule une trajectoire.</p>\n', rules: [fairRule] });

  assert.equal(auditEditorialComprehension(root).length, 1);
});

test('scans visitor labels rendered inside span elements', () => {
  const root = createFixture({ source: '<div><span>Smil estimait ce chiffre.</span></div>\n' });

  assert.equal(auditEditorialComprehension(root).length, 1);
});

test('scans citation fields displayed alongside visitor-facing copy', () => {
  const root = createFixture({ source: "export const card = { scientificRef: 'Smil (2001)' };\n" });

  assert.equal(auditEditorialComprehension(root).length, 1);
});

test('checks each paragraph separately so an explanation does not bless a later mention', () => {
  const root = createFixture({
    source: '<section><p>Vaclav Smil, chercheur spécialiste de l’énergie, estimait ce chiffre.</p><p>Smil estimait aussi un autre chiffre.</p></section>'
  });
  const diagnostics = auditEditorialComprehension(root);

  assert.equal(diagnostics.length, 1);
  assert.equal(diagnostics[0].termId, 'smil');
  assert.equal(diagnostics[0].line, 1);
});

test('ignores imports, comments, and ordinary internal code strings', () => {
  const root = createFixture({
    source: `import type { Smil } from 'Smil';
// Smil is mentioned only in this maintenance comment.
const internalNote = 'Smil is not visitor-facing copy';
export const Panel = () => <p>Texte courant.</p>;
`
  });

  assert.deepEqual(auditEditorialComprehension(root), []);
});

test('preserves source locations and ignores content-looking comments after Unicode text', () => {
  const root = createFixture({ source: `const marker = '🌍'; // authors: 'Smil (2001)'\n<p>Smil estimait ce chiffre.</p>\n` });
  const diagnostics = auditEditorialComprehension(root);

  assert.equal(diagnostics.length, 1);
  assert.equal(diagnostics[0].line, 2);
});

test('permits a narrow named exception immediately before the affected copy', () => {
  const root = createFixture({
    source: `const Panel = () => <main>
  {/* editorial-audit-ignore-next-line: smil -- Citation bibliographique sans place pour une notice biographique. */}
  <p>Smil (2001), Enriching the Earth.</p>
</main>;
`
  });

  assert.deepEqual(auditEditorialComprehension(root), []);
});

test('rejects malformed local exception comments', () => {
  const root = createFixture({
    source: `// editorial-audit-ignore-next-line: smil
const Panel = () => <p>Smil estimait ce chiffre.</p>;
`
  });

  assert.ok(auditEditorialComprehension(root).some((diagnostic) => diagnostic.termId === 'editorial-exception'));
});

test('fails visibly when the visitor-facing source directory cannot be scanned', () => {
  const root = createFixture({ source: '<p>Texte courant.</p>' });
  rmSync(join(root, 'src', 'components'), { recursive: true, force: true });

  assert.throws(() => auditEditorialComprehension(root), /Cannot scan visitor-facing source/);
});

test('editorial errors fail while heuristic warnings remain advisory', () => {
  assert.equal(getEditorialExitCode([{ file: 'x.tsx', line: 1, termId: 'smil', severity: 'warning', message: 'explain' }]), 0);
  assert.equal(getEditorialExitCode([{ file: 'x.tsx', line: 1, termId: 'jargon', severity: 'error', message: 'rewrite' }]), 1);
});

test('the CLI prints source location and term for an audit finding', () => {
  const root = createFixture({ source: '<p>Smil estimait ce chiffre.</p>\n' });
  const script = fileURLToPath(new URL('../scripts/auditEditorialComprehension.ts', import.meta.url));
  const result = spawnSync(process.execPath, ['--import', 'tsx', script, root], { encoding: 'utf8' });

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Faq\.tsx:1.*smil/i);
});

test('an objective terminology error makes the CLI exit unsuccessfully', () => {
  const jargonRule: TestRule = {
    id: 'counterfactual',
    term: '\\bcontrefactuel\\b',
    category: 'notion',
    severity: 'error',
    readerExplanation: 'Une comparaison avec une situation hypothétique.'
  };
  const root = createFixture({ source: '<p>Le contrefactuel est présenté ici.</p>\n', rules: [jargonRule] });
  const script = fileURLToPath(new URL('../scripts/auditEditorialComprehension.ts', import.meta.url));
  const result = spawnSync(process.execPath, ['--import', 'tsx', script, root], { encoding: 'utf8' });

  assert.equal(result.status, 1);
  assert.match(result.stdout, /counterfactual.*error/);
});

test('validates registry entries before scanning content', () => {
  const root = createFixture({ rules: [{ ...smilRule, id: '' }], source: '<p>Texte.</p>' });

  assert.throws(() => auditEditorialComprehension(root), /id/i);
});
