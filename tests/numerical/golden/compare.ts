import assert from 'node:assert/strict';
import { compareNumber } from '../support/tolerances.ts';

export function compareGolden(actual: unknown, expected: any, path = ''): string[] {
  if (typeof expected === 'number') {
    return compareNumber(actual as number, expected, { absolute: 1e-9, relative: 1e-9 }) ? [] : [path];
  }
  if (expected === null || typeof expected !== 'object') return Object.is(actual, expected) ? [] : [path];
  if (typeof actual !== 'object' || actual === null || Array.isArray(actual) !== Array.isArray(expected)) return [path];
  if (Array.isArray(expected)) {
    if ((actual as any[]).length !== expected.length) return [path];
    return expected.flatMap((item, index) => compareGolden((actual as any[])[index], item, `${path}[${index}]`));
  }
  const actualKeys = Object.keys(actual as object);
  const expectedKeys = Object.keys(expected);
  if (actualKeys.length !== expectedKeys.length || actualKeys.some(key => !expectedKeys.includes(key))) return [path];
  return expectedKeys.flatMap(key => compareGolden((actual as any)?.[key], expected[key], path ? `${path}.${key}` : key));
}

export function assertGolden(actual: unknown, expected: unknown): void {
  assert.deepEqual(compareGolden(actual, expected), []);
}
