import assert from 'node:assert/strict';
import { test } from 'node:test';
import { auditTemperatureYear, getTemperatureDataClass } from '../src/engine/temperatureQuality.ts';

const validMetrics = {
  annualMinTemp: 7,
  dryBulbTemp: 12,
  annualMaxTemp: 17,
  summerMaxTemp: 36,
  summerHumidity: 35,
  wetBulbPeak: 25
};

test('a coherent country-year is accepted and its data lineage is explicit', () => {
  const result = auditTemperatureYear(validMetrics, 25);
  assert.equal(result.status, 'conforme');
  assert.equal(result.errors.length, 0);
  assert.equal(result.passedChecks, result.totalChecks);
  assert.equal(getTemperatureDataClass(2026), 'ancrage_modele_non_observation');
  assert.equal(getTemperatureDataClass(2100), 'scenario_CCKP_CMIP6_interpole');
  assert.equal(getTemperatureDataClass(2101), 'extension_exploratoire_post_2100');
  assert.equal(getTemperatureDataClass(2025), 'reconstitution_historique_zone');
});

test('an incoherent annual order and a P99 below mean Tmax are raised with correction guidance', () => {
  const result = auditTemperatureYear({
    ...validMetrics,
    annualMinTemp: 18,
    annualMaxTemp: 17,
    summerMaxTemp: 16
  }, 15);
  assert.equal(result.status, 'anomalie');
  assert.ok(result.errors.some(issue => issue.code === 'ORDRE_TEMPERATURE_ANNUEL_INVALIDE'));
  assert.ok(result.errors.some(issue => issue.code === 'P99_SOUS_TMAX_MOYENNE'));
  assert.ok(result.errors.every(issue => issue.correction.length > 0));
});

test('a temperature outside Stull limits is informational when Tw is correctly unavailable', () => {
  const result = auditTemperatureYear({
    ...validMetrics,
    summerMaxTemp: 50.6,
    summerHumidity: 7.3,
    wetBulbPeak: null
  }, null);
  assert.equal(result.status, 'limite_formule');
  assert.equal(result.errors.length, 0);
  assert.ok(result.information.some(issue => issue.code === 'TW_HORS_DOMAINE_STULL'));
});

test('an incorrect Tw value is reported instead of silently accepted', () => {
  const result = auditTemperatureYear(validMetrics, 25.8);
  assert.equal(result.status, 'anomalie');
  assert.ok(result.errors.some(issue => issue.code === 'TW_INCOHERENT_AVEC_ENTREES'));
});

test('a sudden year-to-year shift is raised for investigation rather than smoothed', () => {
  const result = auditTemperatureYear({ ...validMetrics, dryBulbTemp: 16 }, 25, validMetrics);
  assert.equal(result.status, 'anomalie');
  assert.ok(result.errors.some(issue => issue.code === 'RUPTURE_TEMPORELLE'));
  assert.match(result.errors.find(issue => issue.code === 'RUPTURE_TEMPORELLE')!.correction, /ne pas lisser/);
});
