import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export type EditorialSeverity = 'error' | 'warning';

export interface EditorialRule {
  id: string;
  term: string;
  category: string;
  severity: EditorialSeverity;
  readerExplanation: string;
  explanationPattern?: string;
}

export interface EditorialDiagnostic {
  file: string;
  line: number;
  termId: string;
  severity: EditorialSeverity;
  message: string;
}

interface ContentUnit {
  text: string;
  line: number;
}

interface ExceptionMarker {
  line: number;
  termId?: string;
  reason?: string;
  used: boolean;
}

const CONTENT_FIELDS = [
  'actionDone', 'analogy', 'authors', 'categoryLabel', 'description', 'definition', 'englishTitle',
  'gaiaRole', 'keyDataOrQuote', 'label', 'mechanism', 'primaryUrlLabel', 'question',
  'readerExplanation', 'reproducibilityNotes', 'shortSummary', 'subtitle',
  'reference', 'referenceSource', 'scientificRef', 'source', 'thresholdOrKeyFact', 'title', 'text', 'value'
];

const COPY_BLOCK_PATTERN = 'p|li|dt|dd|h[1-6]|button|label|summary|blockquote|figcaption|caption|span|a|strong|em';
const CONTENT_FIELD_PATTERN = CONTENT_FIELDS.join('|');

function validateRules(value: unknown): EditorialRule[] {
  if (!value || typeof value !== 'object' || !Array.isArray((value as { terms?: unknown }).terms)) {
    throw new Error('Editorial registry must contain a "terms" array.');
  }

  const seenIds = new Set<string>();
  return (value as { terms: unknown[] }).terms.map((entry, index) => {
    if (!entry || typeof entry !== 'object') throw new Error(`Editorial rule ${index + 1} must be an object.`);
    const rule = entry as Partial<EditorialRule>;
    if (typeof rule.id !== 'string' || !/^[a-z0-9][a-z0-9-]*$/i.test(rule.id)) {
      throw new Error(`Editorial rule ${index + 1} must have a valid id.`);
    }
    if (seenIds.has(rule.id)) throw new Error(`Editorial rule id "${rule.id}" is duplicated.`);
    seenIds.add(rule.id);
    if (typeof rule.term !== 'string' || !rule.term.trim()) throw new Error(`Editorial rule "${rule.id}" must have a term pattern.`);
    if (typeof rule.category !== 'string' || !rule.category.trim()) throw new Error(`Editorial rule "${rule.id}" must have a category.`);
    if (rule.severity !== 'error' && rule.severity !== 'warning') throw new Error(`Editorial rule "${rule.id}" must use error or warning severity.`);
    if (typeof rule.readerExplanation !== 'string' || !rule.readerExplanation.trim()) {
      throw new Error(`Editorial rule "${rule.id}" must include a readerExplanation.`);
    }
    try {
      new RegExp(rule.term, 'iu');
      if (rule.explanationPattern) new RegExp(rule.explanationPattern, 'iu');
    } catch (error) {
      throw new Error(`Editorial rule "${rule.id}" has an invalid regular expression: ${String(error)}`);
    }
    return rule as EditorialRule;
  });
}

export function loadEditorialRules(rootDir: string): EditorialRule[] {
  const path = join(rootDir, 'docs', 'editorial', 'terms.json');
  return validateRules(JSON.parse(readFileSync(path, 'utf8')) as unknown);
}

function walkSourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return walkSourceFiles(path);
    if (!entry.isFile() || !/\.tsx?$/.test(entry.name) || entry.name.endsWith('.d.ts')) return [];
    return [path];
  });
}

function maskRange(source: string, start: number, end: number): string {
  return source.slice(start, end).replace(/[^\r\n]/g, ' ');
}

function maskComments(source: string): string {
  const chars = [...source];
  let quote: "'" | '"' | '`' | undefined;
  let escaped = false;
  for (let index = 0; index < chars.length; index += 1) {
    const current = chars[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (current === '\\') escaped = true;
      else if (current === quote) quote = undefined;
      continue;
    }
    if (current === "'" || current === '"' || current === '`') {
      quote = current;
      continue;
    }
    if (current === '/' && chars[index + 1] === '/') {
      const start = index;
      while (index < chars.length && chars[index] !== '\n' && chars[index] !== '\r') index += 1;
      const masked = maskRange(source, start, index);
      for (let offset = 0; offset < masked.length; offset += 1) chars[start + offset] = masked[offset];
      index -= 1;
      continue;
    }
    if (current === '/' && chars[index + 1] === '*') {
      const start = index;
      index += 2;
      while (index < chars.length && !(chars[index] === '*' && chars[index + 1] === '/')) index += 1;
      index = Math.min(index + 2, chars.length);
      const masked = maskRange(source, start, index);
      for (let offset = 0; offset < masked.length; offset += 1) chars[start + offset] = masked[offset];
      index -= 1;
    }
  }
  return chars.join('');
}

function stripImports(source: string): string {
  return source.replace(/^[\t ]*import\b[^;\r\n]*(?:\r?\n[\t ]+[^;\r\n]*)*;?/gm, (statement) => statement.replace(/[^\r\n]/g, ' '));
}

function unescapeLiteral(value: string): string {
  return value.replace(/\\([\\'"`])/g, '$1').replace(/\\n/g, ' ').replace(/\\r/g, ' ');
}

function visibleJsxText(rawText: string): string {
  return rawText
    .replace(/\{\s*(['"`])((?:\\.|(?!\1)[^\\])*)\1\s*\}/g, ' $2 ')
    .replace(/\{[^{}]*\}/g, ' ')
    .replace(/<\/?[A-Za-z][^>]*>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function lineAt(source: string, position: number): number {
  return source.slice(0, position).split('\n').length;
}

function collectContentUnits(source: string): ContentUnit[] {
  const scanText = stripImports(maskComments(source));
  const units: ContentUnit[] = [];
  const blockPattern = new RegExp(`<(${COPY_BLOCK_PATTERN})\\b[^>]*>([\\s\\S]*?)<\\/\\1\\s*>`, 'gi');
  for (const match of scanText.matchAll(blockPattern)) {
    const text = visibleJsxText(match[2]);
    if (text) units.push({ text, line: lineAt(source, match.index ?? 0) });
  }

  const attributes = /\b(?:title|alt|placeholder|aria-label|aria-description)\s*=\s*(["'])(.*?)\1/gi;
  for (const match of scanText.matchAll(attributes)) {
    const value = unescapeLiteral(match[2]);
    if (value.trim()) units.push({ text: value, line: lineAt(source, (match.index ?? 0) + match[0].indexOf(match[2])) });
  }

  const dataField = new RegExp(`\\b(?:${CONTENT_FIELD_PATTERN})\\s*:\\s*(['"\x60])((?:\\\\.|(?!\\1)[^\\\\])*)\\1`, 'gi');
  for (const match of scanText.matchAll(dataField)) {
    const value = unescapeLiteral(match[2]);
    if (value.trim()) units.push({ text: value, line: lineAt(source, (match.index ?? 0) + match[0].indexOf(match[2])) });
  }

  return units;
}

function exceptionMarkers(source: string): ExceptionMarker[] {
  return source.split(/\r?\n/).flatMap((line, index) => {
    if (!line.includes('editorial-audit-ignore-next-line:')) return [];
    const match = line.match(/editorial-audit-ignore-next-line:\s*([a-z0-9][a-z0-9-]*)\s*--\s*(.*?)\s*(?:\*\/)?\s*$/i);
    if (!match || !match[2].trim()) return [{ line: index + 1, used: false }];
    return [{ line: index + 1, termId: match[1], reason: match[2].trim(), used: false }];
  });
}

function scanFile(rootDir: string, path: string, rules: EditorialRule[]): EditorialDiagnostic[] {
  const source = readFileSync(path, 'utf8');
  const relativePath = relative(rootDir, path).replaceAll('\\', '/');
  const diagnostics: EditorialDiagnostic[] = [];
  const markers = exceptionMarkers(source);
  const markerByLineAndId = new Map(markers.filter((marker) => marker.termId).map((marker) => [`${marker.line + 1}:${marker.termId}`, marker]));
  const units = collectContentUnits(source);
  const knownIds = new Set(rules.map((rule) => rule.id));

  for (const marker of markers) {
    if (!marker.termId || !marker.reason || !knownIds.has(marker.termId)) {
      diagnostics.push({
        file: relativePath,
        line: marker.line,
        termId: 'editorial-exception',
        severity: 'error',
        message: !marker.termId || !marker.reason
          ? 'Exception must name a term and include a reason after "--".'
          : `Exception references unknown term "${marker.termId}".`
      });
    }
  }

  for (const unit of units) {
    for (const rule of rules) {
      if (!new RegExp(rule.term, 'iu').test(unit.text)) continue;
      const marker = markerByLineAndId.get(`${unit.line}:${rule.id}`);
      if (marker?.reason) {
        marker.used = true;
        continue;
      }
      const explanationPattern = rule.explanationPattern ? new RegExp(rule.explanationPattern, 'iu') : undefined;
      if (explanationPattern?.test(unit.text)) continue;
      diagnostics.push({
        file: relativePath,
        line: unit.line,
        termId: rule.id,
        severity: rule.severity,
        message: `Explain « ${rule.term} » in plain language. Suggested explanation: ${rule.readerExplanation}`
      });
    }
  }

  for (const marker of markers) {
    if (marker.termId && marker.reason && knownIds.has(marker.termId) && !marker.used) {
      diagnostics.push({
        file: relativePath,
        line: marker.line,
        termId: 'editorial-exception',
        severity: 'error',
        message: `Exception for "${marker.termId}" does not apply to visitor-facing text on the following line.`
      });
    }
  }

  return diagnostics;
}

export function auditEditorialComprehension(rootDir: string): EditorialDiagnostic[] {
  const root = resolve(rootDir);
  const rules = loadEditorialRules(root);
  const componentDirectory = join(root, 'src', 'components');
  const dataDirectory = join(root, 'src', 'data');
  let componentFiles: string[];
  try {
    componentFiles = walkSourceFiles(componentDirectory);
  } catch (error) {
    throw new Error(`Cannot scan visitor-facing source at ${componentDirectory}: ${String(error)}`);
  }
  const sourceFiles = [
    ...componentFiles,
    ...(() => {
      try { return walkSourceFiles(dataDirectory); }
      catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
        throw new Error(`Cannot scan visitor-facing source at ${dataDirectory}: ${String(error)}`);
      }
    })()
  ].sort();
  return sourceFiles.flatMap((path) => scanFile(root, path, rules))
    .sort((left, right) => left.file.localeCompare(right.file) || left.line - right.line || left.termId.localeCompare(right.termId));
}

export function getEditorialExitCode(diagnostics: EditorialDiagnostic[]): number {
  return diagnostics.some((diagnostic) => diagnostic.severity === 'error') ? 1 : 0;
}

function runCli(): void {
  try {
    const rootDir = process.argv[2] ?? process.cwd();
    const diagnostics = auditEditorialComprehension(rootDir);
    if (diagnostics.length === 0) console.log('Editorial audit: no findings.');
    for (const diagnostic of diagnostics) {
      console.log(`${diagnostic.file}:${diagnostic.line} [${diagnostic.termId}] ${diagnostic.severity}: ${diagnostic.message}`);
    }
    process.exitCode = getEditorialExitCode(diagnostics);
  } catch (error) {
    console.error(`Editorial audit failed: ${String(error)}`);
    process.exitCode = 2;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) runCli();
