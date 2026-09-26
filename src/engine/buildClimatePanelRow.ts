import { calculateScenarioWetBulb, ClimateSeriesSummary } from './climatePanelMath';
import { CLIMATE_ZONE_METADATA } from '../data/climateZoneMetadata';
import { ZoneTemperatureRecord } from '../data/verifiedTemperatureRecords';
import { ClimatePanelMetric, ClimatePanelRow } from '../types/climatePanel';

export interface BuildClimatePanelRowInput {
  id: string;
  requestedCoordinates: [number, number];
  sourcePointCoordinates: [number, number];
  sourcePointElevationM: number;
  dailyTimeStandard: string;
  generatedAt: string;
  summary: ClimateSeriesSummary;
  record: ZoneTemperatureRecord | null;
  recordCoverage: { sourcedMembers: number; totalMembers: number };
}

const QUALITY: Record<ClimatePanelMetric, ClimatePanelRow['provenance']['dataQuality'][ClimatePanelMetric]> = {
  annualMeanTempC: 'proxy',
  annualMeanDailyMinTempC: 'proxy',
  annualMeanDailyMaxTempC: 'proxy',
  heatwaveScenarioTempC: 'estimated',
  heatwaveScenarioHumidityPct: 'estimated',
  heatwaveWetBulbC: 'calculated',
  absoluteAirTemperatureRecord: 'unavailable'
};

export function buildClimatePanelRow(input: BuildClimatePanelRowInput): ClimatePanelRow {
  const zone = CLIMATE_ZONE_METADATA[input.id as keyof typeof CLIMATE_ZONE_METADATA];
  if (!zone) throw new Error(`No versioned zone metadata for ${input.id}.`);
  const record = input.record ? { ...input.record, quality: 'observed' as const } : null;
  const dataQuality = { ...QUALITY, absoluteAirTemperatureRecord: record ? 'observed' as const : 'unavailable' as const };
  const methods: Record<ClimatePanelMetric, string> = {
    annualMeanTempC: 'Moyenne des températures quotidiennes moyennes MERRA-2 sur 1991–2020; point représentatif utilisé comme proxy de zone.',
    annualMeanDailyMinTempC: 'Moyenne arithmétique des Tmin quotidiennes MERRA-2 sur 1991–2020; point représentatif utilisé comme proxy de zone.',
    annualMeanDailyMaxTempC: 'Moyenne arithmétique des Tmax quotidiennes MERRA-2 sur 1991–2020; point représentatif utilisé comme proxy de zone.',
    heatwaveScenarioTempC: 'P99 linéaire des Tmax quotidiennes dans les six mois dont la moyenne MERRA-2 est la plus élevée; estimation de scénario, pas un record.',
    heatwaveScenarioHumidityPct: 'Humidité estimée par formule de Magnus avec Tmax et point de rosée quotidien moyen des jours au-dessus du P99 chaud; les deux valeurs ne sont pas simultanées.',
    heatwaveWetBulbC: 'Formule de Stull (2011) appliquée au P99 chaud et à son humidité associée; résultat calculé, soumis au domaine de validité publié.',
    absoluteAirTemperatureRecord: record
      ? zone.type === 'grouped-zone'
        ? `Maximum des records nationaux documentés dans le registre pour ${record.coverage.sourcedMembers} membre(s) sur ${record.coverage.totalMembers}; couverture partielle, pas un maximum régional exhaustif.`
        : 'Record absolu d’air observé et publié par le service météorologique cité.'
      : 'Aucun record d’air documenté dans le registre pour cette zone; non estimé.'
  };
  const uncertainty: ClimatePanelRow['provenance']['uncertainty'] = {
    annualMeanTempC: null,
    annualMeanDailyMinTempC: null,
    annualMeanDailyMaxTempC: null,
    heatwaveScenarioTempC: null,
    heatwaveScenarioHumidityPct: null,
    heatwaveWetBulbC: null
  };
  const notes = [
    'Un point NASA POWER près du centre déclaré représente chaque zone; si le centre de carte est en mer, le pipeline choisit le point terrestre le plus proche sur une grille de recherche de 0,05° (rayon maximal 2°). MERRA-2 est fourni sur une grille native d’environ 0,5° × 0,625°. Aucune moyenne surfacique n’est calculée; le biais peut être important pour les grands pays et zones groupées.',
    'L’humidité utilise le point de rosée quotidien moyen associé à un jour chaud et le Tmax du même jour. La valeur RH est une estimation, pas une mesure horaire simultanée au pic de température.',
    'Le P99 décrit la queue chaude de la réanalyse sur six mois climatologiquement chauds; il ne représente ni un record historique, ni une prévision météorologique, ni un seuil de canicule officiel.',
    'Aucune marge d’incertitude numérique n’est fournie faute d’ensemble régional calibré pour ces proxys.'
  ];
  if (record && record.coverage.sourcedMembers < record.coverage.totalMembers) {
    notes.push(`Record de zone partiel : ${record.coverage.sourcedMembers} membre(s) sur ${record.coverage.totalMembers} disposent d’un record national sourcé dans le registre.`);
  } else if (!record) {
    notes.push('Le record absolu reste indisponible faute de source historique intégrée; aucune température simulée ou réanalysée n’est utilisée à sa place.');
  }

  return {
    id: input.id,
    type: zone.type,
    annualMeanTempC: input.summary.annualMeanTempC,
    annualMeanDailyMinTempC: input.summary.annualMeanDailyMinTempC,
    annualMeanDailyMaxTempC: input.summary.annualMeanDailyMaxTempC,
    heatwaveScenarioTempC: input.summary.heatwaveScenarioTempC,
    heatwaveScenarioHumidityPct: input.summary.heatwaveScenarioHumidityPct,
    heatwaveWetBulbC: calculateScenarioWetBulb(input.summary.heatwaveScenarioTempC, input.summary.heatwaveScenarioHumidityPct),
    absoluteAirTemperatureRecord: record,
    recordCoverage: input.recordCoverage,
    provenance: {
      baselineReferencePeriod: '1991-2020',
      baselineDataset: 'NASA MERRA-2 reanalysis via POWER Daily API (T2M, T2MDEW, T2M_MAX, T2M_MIN; native meteorological grid about 0.5° × 0.625°)',
      accessProvider: 'NASA POWER Daily API, community=RE, daily time standard=LST',
      spatialMethod: 'NASA POWER point query at COUNTRIES_DATA.center; if that point falls in the sea, the nearest land point is chosen on a 0.05° search grid within 2°; point proxy, no area weighting.',
      requestedCoordinates: input.requestedCoordinates,
      sourcePointCoordinates: input.sourcePointCoordinates,
      sourcePointElevationM: input.sourcePointElevationM,
      dailyTimeStandard: input.dailyTimeStandard,
      warmSeasonMonths: input.summary.warmSeasonMonths,
      generatedAt: input.generatedAt,
      dataQuality,
      methods,
      uncertainty,
      notes
    }
  };
}
