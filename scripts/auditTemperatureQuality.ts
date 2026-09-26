import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { COUNTRIES_DATA } from '../src/data/countriesData.ts';
import { GEO_COUNTRY_FEATURES } from '../src/data/worldMapGeo.ts';
import { generateFullTrajectory, SCENARIO_BAU, SCENARIO_DELAYED, SCENARIO_SOBRIETY } from '../src/engine/simulationRunner.ts';
import { auditTemperatureYear, getTemperatureDataClass, TEMPERATURE_QUALITY_THRESHOLDS } from '../src/engine/temperatureQuality.ts';
import { calculateScenarioWetBulb } from '../src/engine/physicsModel.ts';

const FIRST_YEAR = 1901;
const LAST_YEAR = 2200;
const YEAR_COUNT = LAST_YEAR - FIRST_YEAR + 1;
const scenarios = [SCENARIO_BAU, SCENARIO_DELAYED, SCENARIO_SOBRIETY];
const trajectories = scenarios.map(scenario => generateFullTrajectory(scenario, FIRST_YEAR, LAST_YEAR));
const zoneIds = new Set(COUNTRIES_DATA.map(country => country.id));
const unmappedFeatures = GEO_COUNTRY_FEATURES.filter(feature => !zoneIds.has(feature.simCountryId));
if (unmappedFeatures.length) throw new Error(`Pays/carte sans zone climatique : ${unmappedFeatures.map(feature => `${feature.name} (${feature.id})`).join(', ')}`);
if (new Set(GEO_COUNTRY_FEATURES.map(feature => feature.id)).size !== GEO_COUNTRY_FEATURES.length) throw new Error('Le registre cartographique contient des identifiants de pays en double.');
if (trajectories.some(trajectory => trajectory.length !== YEAR_COUNT || trajectory.some((state, index) => state.year !== FIRST_YEAR + index))) {
  throw new Error('Une trajectoire ne couvre pas exactement toutes les années de 1901 à 2200.');
}

const quote = (value: string | number | null | undefined) => value === null || value === undefined ? '' : `"${String(value).replaceAll('"', '""')}"`;
const checklist: Array<{ countryId: string; countryName: string; zoneId: string; year: number; scenario: string; dataClass: string; status: string; passed: number; total: number; codes: string; summary: string; correction: string }> = [];
const issues: Array<{ countryId: string; countryName: string; zoneId: string; year: number; scenario: string; dataClass: string; severity: string; code: string; summary: string; correction: string }> = [];
const catalog = new Map<string, { severity: string; message: string; correction: string; count: number }>();
const countryCounts = new Map(GEO_COUNTRY_FEATURES.map(feature => [feature.id, { name: feature.name, zone: feature.simCountryId, rows: 0, errors: 0, formulaLimits: 0 }]));
let errorCount = 0;
let formulaLimitCount = 0;
let passedChecks = 0;
let totalChecks = 0;

for (let scenarioIndex = 0; scenarioIndex < scenarios.length; scenarioIndex++) {
  const scenario = scenarios[scenarioIndex];
  const trajectory = trajectories[scenarioIndex];
  for (let yearIndex = 0; yearIndex < YEAR_COUNT; yearIndex++) {
    const year = FIRST_YEAR + yearIndex;
    const state = trajectory[yearIndex];
    const previousState = yearIndex ? trajectory[yearIndex - 1] : undefined;
    for (const feature of GEO_COUNTRY_FEATURES) {
      const current = state.countries[feature.simCountryId];
      const previous = previousState?.countries[feature.simCountryId];
      if (!current) throw new Error(`État manquant : ${feature.id}/${feature.simCountryId}/${scenario.id}/${year}`);
      const wetBulbExpected = calculateScenarioWetBulb(current.summerMaxTemp, current.summerHumidity);
      const audit = auditTemperatureYear(current, wetBulbExpected, previous);
      const row = countryCounts.get(feature.id)!;
      row.rows++;
      row.errors += audit.errors.length;
      row.formulaLimits += audit.information.length;
      errorCount += audit.errors.length;
      formulaLimitCount += audit.information.length;
      passedChecks += audit.passedChecks;
      totalChecks += audit.totalChecks;

      const allIssues = [...audit.errors, ...audit.information];
      for (const item of allIssues) {
        const existing = catalog.get(item.code);
        if (existing) existing.count++;
        else catalog.set(item.code, { severity: item.severity, message: item.message, correction: item.correction, count: 1 });
        issues.push({
          countryId: feature.id, countryName: feature.name, zoneId: feature.simCountryId, year,
          scenario: scenario.id, dataClass: getTemperatureDataClass(year), severity: item.severity,
          code: item.code, summary: item.message, correction: item.correction
        });
      }

      checklist.push({
        countryId: feature.id,
        countryName: feature.name,
        zoneId: feature.simCountryId,
        year,
        scenario: scenario.id,
        dataClass: getTemperatureDataClass(year),
        status: audit.status,
        passed: audit.passedChecks,
        total: audit.totalChecks,
        codes: allIssues.map(item => item.code).join('|'),
        summary: allIssues.map(item => item.message).join(' | '),
        correction: audit.errors.map(item => item.correction).join(' | ')
      });
    }
  }
}

if (checklist.length !== GEO_COUNTRY_FEATURES.length * YEAR_COUNT * scenarios.length) {
  throw new Error(`Couverture incomplète du registre : ${checklist.length} lignes produites.`);
}

const outDir = resolve('reports');
await mkdir(outDir, { recursive: true });
const checklistFields = ['pays_id', 'pays', 'zone_climatique_partagee', 'annee', 'scenario', 'classe_donnee', 'statut', 'controles_reussis', 'controles_total', 'codes', 'diagnostic', 'correction_recommandee'];
await writeFile(resolve(outDir, 'temperature-quality-checklist-1901-2200.csv'), `\uFEFF${[checklistFields, ...checklist.map(row => [row.countryId, row.countryName, row.zoneId, row.year, row.scenario, row.dataClass, row.status, row.passed, row.total, row.codes, row.summary, row.correction])].map(row => row.map(quote).join(',')).join('\n')}\n`, 'utf8');

const issueFields = ['pays_id', 'pays', 'zone_climatique_partagee', 'annee', 'scenario', 'classe_donnee', 'gravite', 'code', 'diagnostic', 'correction_recommandee'];
await writeFile(resolve(outDir, 'temperature-quality-issues-1901-2200.csv'), `\uFEFF${[issueFields, ...issues.map(row => [row.countryId, row.countryName, row.zoneId, row.year, row.scenario, row.dataClass, row.severity, row.code, row.summary, row.correction])].map(row => row.map(quote).join(',')).join('\n')}\n`, 'utf8');

const zoneMemberCounts = new Map<string, number>();
for (const feature of GEO_COUNTRY_FEATURES) zoneMemberCounts.set(feature.simCountryId, (zoneMemberCounts.get(feature.simCountryId) ?? 0) + 1);
const rowsByClass = checklist.reduce((counts, row) => counts.set(row.dataClass, (counts.get(row.dataClass) ?? 0) + 1), new Map<string, number>());
const report = [
  '# Contrôle qualité exhaustif des températures par pays et par année', '',
  `- Périmètre : ${GEO_COUNTRY_FEATURES.length} pays/territoires cartographiés × ${YEAR_COUNT} années (${FIRST_YEAR}–${LAST_YEAR}) × ${scenarios.length} scénarios = ${checklist.length} lignes vérifiées.`,
  `- Les entrées sont produites sur ${zoneIds.size} zones climatiques; plusieurs pays/territoires partagent donc une même valeur de zone. Le registre conserve toutefois une ligne de contrôle distincte pour chaque pays/année/scénario.`,
  `- Couverture : ${checklist.length === GEO_COUNTRY_FEATURES.length * YEAR_COUNT * scenarios.length ? 'complète' : 'incomplète'}.`,
  `- Contrôles élémentaires réussis : ${passedChecks}/${totalChecks}. Anomalies calculatoires : ${errorCount}. Limites de formule attendues : ${formulaLimitCount}.`,
  '',
  '## Provenance temporelle', '',
  '| Années | Classe | Interprétation |', '|---|---|---|',
  '| 1901–2025 | `reconstitution_historique_zone` | Anomalie mondiale appliquée aux proxys de zone; ce ne sont pas des relevés nationaux annuels. |',
  '| 2026 | `ancrage_modele_non_observation` | Démarrage du modèle depuis la normale locale 1991–2020; aucune valeur annuelle nationale observée n’est prétendue. |',
  '| 2027–2100 | `scenario_CCKP_CMIP6_interpole` | Évolution conditionnelle au scénario et aux sorties CCKP; pas une prévision météorologique. |',
  '| 2101–2200 | `extension_exploratoire_post_2100` | Extension interne hors horizon CMIP6. |',
  '',
  'L’absence d’observation pays-année dans les années reconstruites ou futures est une limite de provenance, pas une observation manquante substituée par zéro. En 2026, des bilans partiels nationaux peuvent exister; ils restent séparés du point MERRA-2 et de la simulation.',
  '',
  'Un statut « conforme » signifie seulement que la ligne passe les contrôles de cohérence interne et de provenance décrits ci-dessous. Ce n’est pas une validation de la précision réelle contre une série annuelle officielle de chaque pays; ces séries nationales complètes ne sont pas intégrées.',
  '',
  '## Règles de contrôle et conduite à tenir', '',
  '- Vérifier les années et les pays cartographiés attendus, la présence d’une zone et d’un état pour chaque scénario.',
  `- Exiger des températures annuelles finies dans [${TEMPERATURE_QUALITY_THRESHOLDS.airMinC}, ${TEMPERATURE_QUALITY_THRESHOLDS.airMaxC}]°C, ainsi que Tmin ≤ moyenne annuelle ≤ Tmax. Le P99 est borné dans [${TEMPERATURE_QUALITY_THRESHOLDS.airMinC}, ${TEMPERATURE_QUALITY_THRESHOLDS.p99MaxC}]°C. Ces bornes sont des détecteurs grossiers d’erreurs d’unité/source, pas des limites climatiques nationales.`,
  '- Exiger un P99 chaud fini et plausible, supérieur ou égal à la moyenne annuelle des Tmax quotidiennes.',
  '- Exiger une humidité relative dans 0–100 %.',
  `- Recalculer Tw à partir des mêmes P99/RH : la valeur doit correspondre à Stull dans une tolérance de ${TEMPERATURE_QUALITY_THRESHOLDS.wetBulbToleranceC}°C; lorsqu’une entrée est hors domaine, Tw doit rester vide/NC.`,
  `- Comparer chaque valeur à l’année précédente : plus de ±${TEMPERATURE_QUALITY_THRESHOLDS.yearToYearAirJumpC}°C sur les températures annuelles, ±${TEMPERATURE_QUALITY_THRESHOLDS.yearToYearP99JumpC}°C sur le P99 ou ±${TEMPERATURE_QUALITY_THRESHOLDS.yearToYearHumidityJumpPct} points RH est signalé pour enquête; rien n’est lissé automatiquement.`,
  '- Pour chaque anomalie, le journal indique le code, le pays, la zone partagée, l’année, le scénario, la cause probable et une correction recommandée. Corriger la source ou le rattachement en amont; ne pas éditer une valeur exportée à la main.',
  '',
  '### Anomalies détectées', '',
  catalog.size ? '| Code | Gravité | Occurrences | Diagnostic | Correction recommandée |\n|---|---|---:|---|---|' : 'Aucune anomalie calculatoire détectée dans cette exécution.',
  ...(catalog.size ? [...catalog.entries()].map(([code, item]) => `| ${code} | ${item.severity} | ${item.count} | ${item.message} | ${item.correction} |`) : []),
  '',
  '### Limites attendues des formules', '',
  catalog.has('TW_HORS_DOMAINE_STULL')
    ? `Tw est correctement marquée non calculable pour ${catalog.get('TW_HORS_DOMAINE_STULL')!.count} lignes pays/année/scénario lorsque Ta ou RH dépasse le domaine de Stull. Ce sont des limites de calcul, pas des valeurs corrigibles par extrapolation.`
    : 'Aucune entrée Tw hors du domaine de Stull rencontrée.',
  '',
  '## Couverture pays par pays', '',
  '| Pays/territoire | Zone partagée | Lignes vérifiées | Anomalies | Limites Stull |', '|---|---|---:|---:|---:|',
  ...GEO_COUNTRY_FEATURES.map(feature => {
    const row = countryCounts.get(feature.id)!;
    return `| ${feature.name} (${feature.id}) | ${row.zone} (${zoneMemberCounts.get(row.zone)} membres) | ${row.rows}/${YEAR_COUNT * scenarios.length} | ${row.errors} | ${row.formulaLimits} |`;
  }),
  '',
  '## Fichiers de vérification', '',
  '- `temperature-quality-checklist-1901-2200.csv` : registre complet, une ligne par pays/territoire × année × scénario.',
  '- `temperature-quality-issues-1901-2200.csv` : anomalies et limites de calcul seulement, avec diagnostic et action recommandée.',
  '- `temperature-trajectory-by-country-1901-2200.csv` : valeurs auditées utilisées pour le registre.',
  '',
  'Reproduire avec `npm run audit:climate`. La commande se termine en erreur si elle trouve des anomalies calculatoires; elle laisse les registres écrits afin de permettre l’enquête. Les limites attendues de Stull n’échouent pas l’audit.',
  '',
  `Répartition par classe : ${[...rowsByClass.entries()].map(([key, count]) => `${key}=${count}`).join(', ')}.`,
  ''
].join('\n');
await writeFile(resolve(outDir, 'temperature-quality-audit-1901-2200.md'), report, 'utf8');

console.log(`Registre qualité écrit : ${checklist.length} lignes (${GEO_COUNTRY_FEATURES.length} pays/territoires × ${YEAR_COUNT} années × ${scenarios.length} scénarios); anomalies=${errorCount}; limites Stull=${formulaLimitCount}.`);
if (errorCount > 0) process.exitCode = 1;
