import { calculateWetBulbStull } from './physicsModel';

export interface DailyClimateSample {
  date: string;
  maxC: number;
  minC: number;
}

export interface HourlyClimateSample {
  time: string;
  temperatureC: number;
  dewPointC: number;
}

export interface PowerDailyClimateSample {
  date: string;
  meanC: number;
  dewPointC: number;
  maxC: number;
  minC: number;
}

export interface ClimateSeriesSummary {
  annualMeanTempC: number;
  annualMeanDailyMaxTempC: number;
  annualMeanDailyMinTempC: number;
  heatwaveScenarioTempC: number;
  heatwaveScenarioHumidityPct: number;
  warmSeasonMonths: number[];
}

const MAGNUS_A = 17.625;
const MAGNUS_B_C = 243.04;

/** RH from the Magnus saturation-vapor-pressure ratio (Alduchov & Eskridge, 1996). */
export function relativeHumidityFromDewPoint(temperatureC: number, dewPointC: number): number {
  if (!Number.isFinite(temperatureC) || !Number.isFinite(dewPointC)) {
    throw new Error('Temperature and dew point must be finite values.');
  }
  if (dewPointC > temperatureC) throw new Error('Dew point cannot exceed air temperature.');

  const saturationAtDewPoint = Math.exp((MAGNUS_A * dewPointC) / (MAGNUS_B_C + dewPointC));
  const saturationAtTemperature = Math.exp((MAGNUS_A * temperatureC) / (MAGNUS_B_C + temperatureC));
  return Math.max(0, Math.min(100, 100 * saturationAtDewPoint / saturationAtTemperature));
}

function quantile(values: number[], probability: number): number {
  if (values.length === 0) throw new Error('Cannot calculate a percentile from an empty series.');
  const sorted = [...values].sort((a, b) => a - b);
  const position = (sorted.length - 1) * probability;
  const lowerIndex = Math.floor(position);
  const upperIndex = Math.ceil(position);
  const fraction = position - lowerIndex;
  return sorted[lowerIndex] + (sorted[upperIndex] - sorted[lowerIndex]) * fraction;
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  if (sorted.length === 0) throw new Error('Cannot calculate a median from an empty series.');
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

/**
 * Uses the six warmest months by 1991–2020 mean temperature, P99 daily Tmax,
 * and median RH at the daily Tmax hour among days meeting that threshold.
 */
export function summarizeClimateSeries(
  daily: DailyClimateSample[],
  hourly: HourlyClimateSample[]
): ClimateSeriesSummary {
  if (daily.length === 0 || hourly.length === 0) throw new Error('Daily and hourly climate series must not be empty.');

  const dailyByDate = new Map<string, DailyClimateSample>();
  for (const sample of daily) {
    if (!Number.isFinite(sample.maxC) || !Number.isFinite(sample.minC) || sample.minC > sample.maxC) {
      throw new Error(`Invalid daily temperature sample for ${sample.date}.`);
    }
    dailyByDate.set(sample.date, sample);
  }

  const hourlyByDate = new Map<string, HourlyClimateSample[]>();
  for (const sample of hourly) {
    if (!Number.isFinite(sample.temperatureC) || !Number.isFinite(sample.dewPointC)) {
      throw new Error(`Invalid hourly temperature sample for ${sample.time}.`);
    }
    const date = sample.time.slice(0, 10);
    const day = hourlyByDate.get(date) ?? [];
    day.push(sample);
    hourlyByDate.set(date, day);
  }

  const dailyMeans: { date: string; meanC: number }[] = [];
  for (const [date, samples] of hourlyByDate) {
    if (!dailyByDate.has(date)) throw new Error(`Hourly observations have no daily extrema for ${date}.`);
    dailyMeans.push({ date, meanC: samples.reduce((total, sample) => total + sample.temperatureC, 0) / samples.length });
  }
  if (dailyMeans.length !== dailyByDate.size) throw new Error('Some daily extrema do not have matching hourly observations.');

  const monthlyMeans = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const matching = dailyMeans.filter(sample => Number(sample.date.slice(5, 7)) === month);
    if (matching.length === 0) throw new Error(`Climate series has no observations for month ${month}.`);
    return { month, meanC: matching.reduce((total, sample) => total + sample.meanC, 0) / matching.length };
  });
  const warmSeasonMonths = monthlyMeans
    .sort((a, b) => b.meanC - a.meanC || a.month - b.month)
    .slice(0, 6)
    .map(sample => sample.month)
    .sort((a, b) => a - b);

  const warmSeasonDays = daily.filter(sample => warmSeasonMonths.includes(Number(sample.date.slice(5, 7))));
  const heatwaveScenarioTempC = quantile(warmSeasonDays.map(sample => sample.maxC), 0.99);
  const hotDayHumidity = warmSeasonDays
    .filter(sample => sample.maxC >= heatwaveScenarioTempC)
    .map(sample => {
      const sameDayHours = hourlyByDate.get(sample.date);
      if (!sameDayHours?.length) throw new Error(`No hourly data for hot day ${sample.date}.`);
      const peakHour = sameDayHours.reduce((warmest, current) => current.temperatureC > warmest.temperatureC ? current : warmest);
      return relativeHumidityFromDewPoint(peakHour.temperatureC, peakHour.dewPointC);
    });

  return {
    annualMeanTempC: dailyMeans.reduce((total, sample) => total + sample.meanC, 0) / dailyMeans.length,
    annualMeanDailyMaxTempC: daily.reduce((total, sample) => total + sample.maxC, 0) / daily.length,
    annualMeanDailyMinTempC: daily.reduce((total, sample) => total + sample.minC, 0) / daily.length,
    heatwaveScenarioTempC,
    heatwaveScenarioHumidityPct: median(hotDayHumidity),
    warmSeasonMonths
  };
}

/**
 * Summary for NASA POWER/MERRA-2 daily data. Daily mean dew point is not
 * simultaneous with daily Tmax, so RH at Tmax is an explicit estimate.
 */
export function summarizePowerDailySeries(samples: PowerDailyClimateSample[]): ClimateSeriesSummary {
  if (samples.length === 0) throw new Error('Daily climate series must not be empty.');
  for (const sample of samples) {
    if (![sample.meanC, sample.dewPointC, sample.maxC, sample.minC].every(Number.isFinite) || sample.minC > sample.maxC) {
      throw new Error(`Invalid daily climate sample for ${sample.date}.`);
    }
  }

  const monthlyMeans = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const matching = samples.filter(sample => Number(sample.date.slice(5, 7)) === month);
    if (matching.length === 0) throw new Error(`Climate series has no observations for month ${month}.`);
    return { month, meanC: matching.reduce((total, sample) => total + sample.meanC, 0) / matching.length };
  });
  const warmSeasonMonths = monthlyMeans
    .sort((a, b) => b.meanC - a.meanC || a.month - b.month)
    .slice(0, 6)
    .map(sample => sample.month)
    .sort((a, b) => a - b);
  const warmDays = samples.filter(sample => warmSeasonMonths.includes(Number(sample.date.slice(5, 7))));
  const heatwaveScenarioTempC = quantile(warmDays.map(sample => sample.maxC), 0.99);
  const hotDays = warmDays.filter(sample => sample.maxC >= heatwaveScenarioTempC);
  const humidity = hotDays.map(sample => relativeHumidityFromDewPoint(sample.maxC, sample.dewPointC));

  return {
    annualMeanTempC: samples.reduce((total, sample) => total + sample.meanC, 0) / samples.length,
    annualMeanDailyMaxTempC: samples.reduce((total, sample) => total + sample.maxC, 0) / samples.length,
    annualMeanDailyMinTempC: samples.reduce((total, sample) => total + sample.minC, 0) / samples.length,
    heatwaveScenarioTempC,
    heatwaveScenarioHumidityPct: median(humidity),
    warmSeasonMonths
  };
}

/** Stull approximation is only used inside its published Ta/RH domain. */
export function calculateScenarioWetBulb(temperatureC: number, humidityPct: number): number {
  if (!Number.isFinite(temperatureC) || !Number.isFinite(humidityPct) || temperatureC < -20 || temperatureC > 50 || humidityPct < 5 || humidityPct > 99) {
    throw new RangeError('Scenario inputs fall outside Stull (2011) validity: air temperature -20..50°C and RH 5..99%.');
  }
  return calculateWetBulbStull(temperatureC, humidityPct);
}
