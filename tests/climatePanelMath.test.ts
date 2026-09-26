import assert from 'node:assert/strict';
import { test } from 'node:test';

const math = await import('../src/engine/climatePanelMath.ts').catch(() => ({} as Record<string, unknown>));

test('relative humidity is calculated from air temperature and dew point', () => {
  const relativeHumidityFromDewPoint = math.relativeHumidityFromDewPoint as (temperatureC: number, dewPointC: number) => number;
  assert.equal(typeof relativeHumidityFromDewPoint, 'function');
  assert.ok(Math.abs(relativeHumidityFromDewPoint(25, 20) - 73.8) < 0.5);
  assert.equal(relativeHumidityFromDewPoint(20, 20), 100);
  assert.throws(() => relativeHumidityFromDewPoint(10, 11), /dew point/i);
});

test('warm-season scenario uses P99 daily Tmax and coincident peak-hour humidity', () => {
  const summarizeClimateSeries = math.summarizeClimateSeries as (daily: { date: string; maxC: number; minC: number }[], hourly: { time: string; temperatureC: number; dewPointC: number }[]) => {
    annualMeanTempC: number;
    annualMeanDailyMaxTempC: number;
    annualMeanDailyMinTempC: number;
    heatwaveScenarioTempC: number;
    heatwaveScenarioHumidityPct: number;
    warmSeasonMonths: number[];
  };
  assert.equal(typeof summarizeClimateSeries, 'function');

  const daily: { date: string; maxC: number; minC: number }[] = [];
  const hourly: { time: string; temperatureC: number; dewPointC: number }[] = [];
  for (let month = 1; month <= 12; month += 1) {
    for (let day = 1; day <= 10; day += 1) {
      const date = `2000-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const maxC = month + day / 100;
      daily.push({ date, maxC, minC: maxC - 10 });
      hourly.push({ time: `${date}T15:00`, temperatureC: maxC, dewPointC: maxC - 5 });
      hourly.push({ time: `${date}T03:00`, temperatureC: maxC - 10, dewPointC: maxC - 12 });
    }
  }

  const result = summarizeClimateSeries(daily, hourly);
  assert.deepEqual(result.warmSeasonMonths, [7, 8, 9, 10, 11, 12]);
  assert.ok(result.heatwaveScenarioTempC > 12 && result.heatwaveScenarioTempC <= 12.1);
  assert.ok(result.heatwaveScenarioHumidityPct > 50 && result.heatwaveScenarioHumidityPct < 80);
  assert.ok(result.annualMeanDailyMinTempC < result.annualMeanTempC && result.annualMeanTempC < result.annualMeanDailyMaxTempC);
});

test('NASA daily summary selects hot months and estimates RH from same-day Tmax and dew point', () => {
  const summarizePowerDailySeries = math.summarizePowerDailySeries as (samples: { date: string; meanC: number; dewPointC: number; maxC: number; minC: number }[]) => {
    annualMeanTempC: number;
    annualMeanDailyMaxTempC: number;
    annualMeanDailyMinTempC: number;
    heatwaveScenarioTempC: number;
    heatwaveScenarioHumidityPct: number;
    warmSeasonMonths: number[];
  };
  assert.equal(typeof summarizePowerDailySeries, 'function');
  const samples = [];
  for (let month = 1; month <= 12; month += 1) {
    for (let day = 1; day <= 10; day += 1) {
      const date = `2000-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const maxC = month + day / 100;
      samples.push({ date, meanC: maxC - 5, dewPointC: maxC - 5, maxC, minC: maxC - 10 });
    }
  }
  const result = summarizePowerDailySeries(samples);
  assert.deepEqual(result.warmSeasonMonths, [7, 8, 9, 10, 11, 12]);
  assert.ok(result.heatwaveScenarioTempC > 12 && result.heatwaveScenarioTempC <= 12.1);
  assert.ok(result.heatwaveScenarioHumidityPct > 50 && result.heatwaveScenarioHumidityPct < 80);
  assert.ok(result.annualMeanDailyMinTempC < result.annualMeanTempC && result.annualMeanTempC < result.annualMeanDailyMaxTempC);
});

test('series summary rejects missing days and out-of-domain Stull inputs', () => {
  const summarizeClimateSeries = math.summarizeClimateSeries as (daily: { date: string; maxC: number; minC: number }[], hourly: { time: string; temperatureC: number; dewPointC: number }[]) => unknown;
  const calculateScenarioWetBulb = math.calculateScenarioWetBulb as (temperatureC: number, humidityPct: number) => number;
  assert.equal(typeof summarizeClimateSeries, 'function');
  assert.equal(typeof calculateScenarioWetBulb, 'function');
  assert.throws(() => summarizeClimateSeries([], []), /daily|hourly|series/i);
  assert.throws(() => calculateScenarioWetBulb(51, 50), /validity/i);
  assert.throws(() => calculateScenarioWetBulb(35, 4), /validity/i);
  assert.ok(calculateScenarioWetBulb(35, 50) <= 35);
});

test('NASA POWER normalization rejects fill values and preserves source metadata', async () => {
  const module = await import('../scripts/generateClimatePanelData.ts').catch(() => ({} as Record<string, unknown>));
  const normalizePowerDailyResponse = module.normalizePowerDailyResponse as ((payload: unknown, expected?: { expectedDailyCount?: number; startDate?: string; endDate?: string }) => { daily: unknown[]; longitude: number; latitude: number; elevationM: number; sources: string[]; timeStandard: string }) | undefined;
  assert.equal(typeof normalizePowerDailyResponse, 'function');
  const payload = {
    geometry: { coordinates: [2.5, 46.5, 120] },
    header: { sources: ['MERRA2', 'POWER'], time_standard: 'LST', fill_value: -999 },
    properties: { parameter: {
      T2M: { '19910101': 8 }, T2MDEW: { '19910101': 4 }, T2M_MAX: { '19910101': 10 }, T2M_MIN: { '19910101': 1 }
    } }
  };
  const expected = { expectedDailyCount: 1, startDate: '19910101', endDate: '19910101' };
  const parsed = normalizePowerDailyResponse?.(payload, expected);
  assert.equal(parsed?.latitude, 46.5);
  assert.equal(parsed?.longitude, 2.5);
  assert.equal(parsed?.elevationM, 120);
  assert.deepEqual(parsed?.sources, ['MERRA2', 'POWER']);
  assert.equal(parsed?.timeStandard, 'LST');
  assert.throws(() => normalizePowerDailyResponse?.({ ...payload, properties: { parameter: { ...payload.properties.parameter, T2M: { '19910101': -999 } } } }, expected), /fill|finite|missing/i);
  assert.throws(() => normalizePowerDailyResponse?.(payload, { ...expected, expectedDailyCount: 2, endDate: '19910102' }), /daily|count|coverage/i);
});
