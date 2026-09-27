import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { GEO_COUNTRY_FEATURES } from '../src/data/worldMapGeo';
import { COUNTRIES_DATA } from '../src/data/countriesData';
import { generateFullTrajectory, PRESET_SCENARIOS } from '../src/engine/simulationRunner';
import { getHabitabilityStatus } from '../src/engine/habitabilityStatus';
import { aggregateWaterAccessForZone, getHouseholdWaterAccessProjection, getWaterStressProjection } from '../src/engine/waterAccessProjections';

const years = [2026, 2030, 2050, 2080, 2095, 2100, 2194];
const audit: Record<string, unknown>[] = [];
const countryIds = new Set(COUNTRIES_DATA.map(country => country.id));
const classKeys = ['favorable', 'constrained', 'high', 'major', 'extreme'];

for (const scenario of PRESET_SCENARIOS) {
  const trajectory = generateFullTrajectory(scenario, 2026, 2194);
  const byYear = new Map(trajectory.map(state => [Math.floor(state.year), state]));
  for (const year of years) {
    const state = byYear.get(year);
    if (!state) throw new Error(`Trajectoire ${scenario.id} absente en ${year}`);
    for (const feature of GEO_COUNTRY_FEATURES) {
      const sim = state.countries[feature.simCountryId];
      const water = getHouseholdWaterAccessProjection(feature.iso3, year, scenario.id);
      const stress = getWaterStressProjection(feature.iso3, year, scenario.id);
      const status = sim ? getHabitabilityStatus({
        wetBulbPeakC: sim.wetBulbPeak,
        annualMeanDailyMaxTempC: sim.annualMaxTemp,
        hotSeasonP99C: sim.summerMaxTemp,
        caloriesKcalPerPersonDay: sim.calPerCapita,
        improvedWaterAccessPct: water?.valuePct ?? null,
        nationalWaterStressCategory: stress?.category ?? null,
        waterAccessSourceYear: water?.sourceYear,
        waterAccessProjectionMethod: water?.method,
        nationalWaterStressSourceYear: stress?.sourceYear
      }) : null;
      const oldTw = sim?.wetBulbPeak;
      const oldHeatLevel = oldTw === null || oldTw === undefined ? null : oldTw >= 29 ? 4 : oldTw >= 28 ? 3 : oldTw >= 27 ? 2 : oldTw >= 26 ? 1 : 0;
      const oldFoodLevel = sim ? sim.calPerCapita < 1500 ? 4 : sim.calPerCapita < 1700 ? 3 : sim.calPerCapita < 1900 ? 2 : sim.calPerCapita < 2100 ? 1 : 0 : null;
      const oldClass = sim && (oldHeatLevel !== null || oldFoodLevel !== 0)
        ? classKeys[Math.max(oldHeatLevel ?? 0, oldFoodLevel ?? 0)] : null;
      const newLevel = status ? classKeys.indexOf(status.key) : null;
      const oldLevel = oldClass ? classKeys.indexOf(oldClass) : null;
      audit.push({
        recordType: 'mapped-feature', year, scenario: scenario.id,
        featureId: feature.id, country: feature.name, iso3: feature.iso3,
        simulationZone: feature.simCountryId, modelAvailable: Boolean(sim),
        annualMeanDailyMaxTempC: sim?.annualMaxTemp ?? null,
        hotSeasonP99C: sim?.summerMaxTemp ?? null, wetBulbPeakC: sim?.wetBulbPeak ?? null,
        caloriesKcalPerPersonDay: sim?.calPerCapita ?? null,
        waterAccessPct: water?.valuePct ?? null, waterAccessSourceYear: water?.sourceYear ?? null,
        waterAccessSSP: water?.ssp ?? null, waterAccessMethod: water?.method ?? null,
        waterStress: stress?.score ?? null,
        waterStressSourceYear: stress?.sourceYear ?? null,
        waterStressMethod: stress?.method ?? null,
        waterStressScale: stress ? 'national Aqueduct country ranking' : null,
        previousHeatFoodClass: oldClass, constraintClass: status?.key ?? null,
        classChangeVsPrevious: oldLevel !== null && newLevel !== null ? newLevel - oldLevel : null,
        classChangedReason: oldLevel !== null && newLevel !== null && newLevel !== oldLevel ? status?.reasons ?? [] : [],
        explanation: status?.explanation ?? null,
        missingDimensions: status?.missingDimensions ?? ['all indicators unavailable']
      });
    }
    for (const country of COUNTRIES_DATA) {
      const sim = state.countries[country.id];
      if (!sim) continue;
      const water = aggregateWaterAccessForZone(country.id, year, scenario.id);
      const zoneStatus = getHabitabilityStatus({
        wetBulbPeakC: sim.wetBulbPeak,
        annualMeanDailyMaxTempC: sim.annualMaxTemp,
        hotSeasonP99C: sim.summerMaxTemp,
        caloriesKcalPerPersonDay: sim.calPerCapita,
        improvedWaterAccessPct: water?.valuePct ?? null,
        nationalWaterStressCategory: null,
        waterAccessSourceYear: water?.sourceYear,
        waterAccessProjectionMethod: water?.method
      });
      audit.push({
        recordType: 'simulation-zone', year, scenario: scenario.id, simulationZone: country.id,
        populationWeightedImprovedWaterAccessPct: water?.valuePct ?? null,
        coveredCountries: water?.coveredCountries ?? 0,
        totalMappedCountries: water?.totalCountries ?? 0,
        coveredPopulationMillion: water?.coveredPopulationMillion ?? null,
        sourceYear: water?.sourceYear ?? null, ssp: water?.ssp ?? null,
        projectionMethod: water?.method ?? null,
        constraintClass: zoneStatus?.key ?? null,
        explanation: zoneStatus?.explanation ?? null,
        missingDimensions: zoneStatus?.missingDimensions ?? ['all indicators unavailable'],
        aggregation: 'country projections weighted by their source population; covered countries only',
        climateProxyCountryCount: GEO_COUNTRY_FEATURES.filter(feature => feature.simCountryId === country.id).length,
        note: 'Zone water estimate is separate from the climate model point; no local water-stress score is inferred.'
      });
    }
  }
}

const sourceCountries = [...new Set(GEO_COUNTRY_FEATURES.flatMap(feature => feature.iso3 ? [feature.iso3] : []))];
const mappedCoverage = sourceCountries.filter(iso3 => getHouseholdWaterAccessProjection(iso3, 2050, 'bau')).length;
const zoneRows = audit.filter(row => row.recordType === 'simulation-zone');
const featureRows = audit.filter(row => row.recordType === 'mapped-feature');
const classRaised = featureRows.filter(row => typeof row.classChangeVsPrevious === 'number' && (row.classChangeVsPrevious as number) > 0).length;
const classLowered = featureRows.filter(row => typeof row.classChangeVsPrevious === 'number' && (row.classChangeVsPrevious as number) < 0).length;
const report = {
  generatedAt: new Date().toISOString(),
  method: 'Exhaustive mapped-feature × selected year × internal scenario audit, plus simulation-zone population-weighted water summaries.',
  years, scenarios: PRESET_SCENARIOS.map(scenario => scenario.id),
  coverage: { mappedFeatures: GEO_COUNTRY_FEATURES.length, mappedISO3: sourceCountries.length, waterProjectionCoverage2050: `${mappedCoverage}/${sourceCountries.length}`, simulationZones: countryIds.size, featureRows: featureRows.length, zoneRows: zoneRows.length },
  limitations: [
    'L’accès projeté porte sur une source améliorée à l’échelle nationale, pas sur un service d’eau potable géré en toute sécurité; aucun lissage annuel n’est effectué.',
    'Aqueduct est un score national de stress hydrique pondéré par la demande, pas un indicateur de service domestique ni un score local par bassin.',
    'Les SSP IIASA sont associés aux scénarios internes CLIMATOPEDY comme approximation; les modèles et leurs hypothèses ne sont pas identiques.',
    'Après 2095, la référence maintient le taux d’accès 2095 et le signal de stress 2080; ce prolongement exploratoire n’est pas une probabilité ni une prévision validée.',
    'Les classes sont des heuristiques de contrainte, pas un diagnostic d’habitabilité ni un seuil universel de sécurité thermique.'
  ], rows: audit
};
await mkdir(resolve('reports'), { recursive: true });
await writeFile(resolve('reports/water-habitability-country-zone-audit.json'), `${JSON.stringify(report, null, 2)}\n`);
const summary = [
  '# Audit pays / zones — eau et contraintes thermiques', '',
  `Généré le ${report.generatedAt}.`, '',
  `- ${GEO_COUNTRY_FEATURES.length} entités cartographiques, dont ${sourceCountries.length} codes ISO3.`,
  `- Accès à une source améliorée projeté en 2050 : ${mappedCoverage}/${sourceCountries.length} pays ISO3 cartographiés (142 pays dans l’instantané IIASA, dont 136 recoupent la carte).`,
  `- ${featureRows.length} lignes pays/entité (années ${years.join(', ')}, scénarios ${report.scenarios.join(', ')}).`,
  `- ${zoneRows.length} lignes de synthèse par zone de simulation.`,
  `- Par rapport à l’ancienne classe chaleur humide/calories : niveau relevé dans ${classRaised} lignes; abaissé dans ${classLowered} lignes.`,
  '- Chaque ligne détaille les indicateurs disponibles, la classe, les dimensions manquantes et la provenance.', '',
  '## Limites à lire avec les résultats', '',
  '- Après 2095, le taux d’accès 2095 est maintenu et le signal de stress repose sur l’horizon Aqueduct 2080; cette hypothèse de stagnation est explicitement exploratoire.',
  ...report.limitations.map(item => `- ${item}`), '',
  'Voir le JSON associé pour l’ensemble des résultats pays, zones, horizons et scénarios.'
].join('\n');
await writeFile(resolve('reports/water-habitability-country-zone-audit.md'), `${summary}\n`);
console.log(`Audit generated: ${featureRows.length} mapped-feature rows, ${zoneRows.length} simulation-zone rows; water projection coverage 2050 ${mappedCoverage}/${sourceCountries.length} ISO3.`);
