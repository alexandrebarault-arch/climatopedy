export type ClimateDataQuality = 'observed' | 'calculated' | 'derived' | 'estimated' | 'proxy' | 'unavailable';

export type ClimatePanelMetric =
  | 'annualMeanTempC'
  | 'annualMeanDailyMinTempC'
  | 'annualMeanDailyMaxTempC'
  | 'heatwaveScenarioTempC'
  | 'heatwaveScenarioHumidityPct'
  | 'heatwaveWetBulbC'
  | 'absoluteAirTemperatureRecord';

export interface ClimateRecord {
  valueC: number;
  location: string;
  date: string;
  sourceLabel: string;
  sourceUrl: string;
  memberIso3: string;
  memberName: string;
  quality: 'observed';
  coverage: { sourcedMembers: number; totalMembers: number };
  isGroupedZone: boolean;
}

export interface ClimatePanelRow {
  id: string;
  type: 'country' | 'grouped-zone';
  annualMeanTempC: number;
  annualMeanDailyMinTempC: number;
  annualMeanDailyMaxTempC: number;
  heatwaveScenarioTempC: number;
  heatwaveScenarioHumidityPct: number;
  heatwaveWetBulbC: number;
  absoluteAirTemperatureRecord: ClimateRecord | null;
  recordCoverage: { sourcedMembers: number; totalMembers: number };
  provenance: {
    baselineReferencePeriod: '1991-2020';
    baselineDataset: string;
    accessProvider: string;
    spatialMethod: string;
    requestedCoordinates: [number, number];
    sourcePointCoordinates: [number, number];
    sourcePointElevationM: number;
    dailyTimeStandard: string;
    warmSeasonMonths: number[];
    generatedAt: string;
    dataQuality: Record<ClimatePanelMetric, ClimateDataQuality>;
    methods: Record<ClimatePanelMetric, string>;
    uncertainty: Record<Exclude<ClimatePanelMetric, 'absoluteAirTemperatureRecord'>, string | null>;
    notes: string[];
  };
}

export interface ClimatePanelFile {
  schemaVersion: 1;
  generatedAt: string;
  source: string;
  sourceUrl: string;
  rows: ClimatePanelRow[];
}
