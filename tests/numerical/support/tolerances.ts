export type NumericTolerance = { absolute: number; relative: number };

export function compareNumber(actual: number, expected: number, tolerance: NumericTolerance): boolean {
  if (!Number.isFinite(actual) || !Number.isFinite(expected)) return Object.is(actual, expected);
  const delta = Math.abs(actual - expected);
  return delta <= tolerance.absolute || delta <= Math.max(Math.abs(actual), Math.abs(expected)) * tolerance.relative;
}

export function scanFinite(value: unknown, path = ''): string[] {
  if (value === null || value === undefined) return [];
  if (typeof value === 'number') return Number.isFinite(value) ? [] : [path || '<root>'];
  if (Array.isArray(value)) return value.flatMap((item, index) => scanFinite(item, `${path}[${index}]`));
  if (typeof value !== 'object') return [];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    scanFinite(child, path ? `${path}.${key}` : key)
  );
}
