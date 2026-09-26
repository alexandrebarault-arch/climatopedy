import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { COUNTRIES_DATA } from '../src/data/countriesData.ts';
import { GEO_COUNTRY_FEATURES } from '../src/data/worldMapGeo.ts';
import { generateFullTrajectory, SCENARIO_BAU, SCENARIO_DELAYED, SCENARIO_SOBRIETY } from '../src/engine/simulationRunner.ts';
import { getTemperatureDataClass } from '../src/engine/temperatureQuality.ts';

const years = 300;
const scenarios = [SCENARIO_BAU, SCENARIO_DELAYED, SCENARIO_SOBRIETY];
const trajectories = scenarios.map(config => generateFullTrajectory(config, 1901, 2200));
if (trajectories.some(trajectory => trajectory.length !== years)) throw new Error('Une trajectoire ne contient pas les 300 années de 1901 à 2200.');

const knownZones = new Set(COUNTRIES_DATA.map(country => country.id));
const unmapped = GEO_COUNTRY_FEATURES.filter(feature => !knownZones.has(feature.simCountryId));
if (unmapped.length) throw new Error(`Pays sans zone simulée: ${unmapped.map(feature => feature.name).join(', ')}`);

const quote = (value: string | number | null | undefined) => value === null || value === undefined ? '' : `"${String(value).replaceAll('"', '""')}"`;
const fields = [
  'annee', 'identifiant_carte', 'pays_affiche', 'zone_simulation', 'statut_donnees',
  ...scenarios.flatMap(scenario => [`${scenario.id}_tmin_moyenne_journaliere_C`, `${scenario.id}_tmean_annuel_C`, `${scenario.id}_tmax_moyenne_journaliere_C`, `${scenario.id}_pic_caniculaire_air_C`, `${scenario.id}_humidite_scenario_pct`, `${scenario.id}_tw_pic_C`])
];
const rows = [fields.map(quote).join(',')];

for (let index = 0; index < years; index++) {
  const year = 1901 + index;
  for (const feature of GEO_COUNTRY_FEATURES) {
    const values: Array<string | number | null> = [
      year, feature.id, feature.name, feature.simCountryId,
      getTemperatureDataClass(year)
    ];
    for (const trajectory of trajectories) {
      const country = trajectory[index].countries[feature.simCountryId];
      values.push(
        country.annualMinTemp.toFixed(3), country.dryBulbTemp.toFixed(3), country.annualMaxTemp.toFixed(3),
        country.summerMaxTemp.toFixed(3), country.summerHumidity.toFixed(3), country.wetBulbPeak?.toFixed(3) ?? null
      );
    }
    rows.push(values.map(quote).join(','));
  }
}

const outDir = resolve('reports');
await mkdir(outDir, { recursive: true });
await writeFile(resolve(outDir, 'temperature-trajectory-by-country-1901-2200.csv'), `\uFEFF${rows.join('\n')}\n`, 'utf8');

let orderFailures = 0;
let nonFiniteValues = 0;
let invalidHeatHazards = 0;
let rhOutsideStull = 0;
let p99BelowAnnualMax = 0;
let twUnavailable = 0;
let maxTransition = 0;
let minTransition = Infinity;
for (const trajectory of trajectories) {
  for (const state of trajectory) {
    for (const id of knownZones) {
      const country = state.countries[id];
      if (![country.annualMinTemp, country.dryBulbTemp, country.annualMaxTemp].every(Number.isFinite)) nonFiniteValues++;
      if (!(country.annualMinTemp <= country.dryBulbTemp && country.dryBulbTemp <= country.annualMaxTemp)) orderFailures++;
      if (!Number.isFinite(country.summerMaxTemp) || !Number.isFinite(country.summerHumidity) || country.summerHumidity < 0 || country.summerHumidity > 100) invalidHeatHazards++;
      if (country.summerHumidity < 5 || country.summerHumidity > 99) rhOutsideStull++;
      if (country.summerMaxTemp < country.annualMaxTemp) p99BelowAnnualMax++;
      if (country.wetBulbPeak === null) twUnavailable++;
    }
  }
  const y2025 = trajectory.find(state => state.year === 2025)!;
  const y2026 = trajectory.find(state => state.year === 2026)!;
  for (const id of knownZones) {
    const delta = y2026.countries[id].dryBulbTemp - y2025.countries[id].dryBulbTemp;
    maxTransition = Math.max(maxTransition, delta);
    minTransition = Math.min(minTransition, delta);
  }
}

const africa = ['nafr', 'egy', 'nga', 'eth', 'cod', 'eaf', 'zaf'];
const bau = trajectories[0];
const summary = [
  '# Résultat de l’audit chaleur/humidité 1901–2200', '',
  `- Pays/territoires de la carte exportés : ${GEO_COUNTRY_FEATURES.length}.`,
  `- Zones climatiques simulées : ${knownZones.size}; les membres d’une même zone partagent les mêmes températures.`,
  `- Années : 300 par pays, pour trois scénarios futurs (BAU, intermédiaire, sobriété), soit ${GEO_COUNTRY_FEATURES.length * years} lignes pays-année.`,
  `- Températures absentes ou non finies dans les calculs : ${nonFiniteValues}.`,
  `- Violations Tmin ≤ moyenne annuelle ≤ Tmax : ${orderFailures}.`,
  `- P99/humidités manquants, non finis ou RH hors de 0–100 % : ${invalidHeatHazards}. RH hors domaine Stull (Tw non calculable pour ces cas) : ${rhOutsideStull}.`,
  `- P99 inférieur à la moyenne annuelle des Tmax : ${p99BelowAnnualMax}. Tw non calculable (hors domaine Stull en température ou RH) : ${twUnavailable}.`,
  `- Écart de température moyenne 2025→2026 parmi les zones/scénarios : ${minTransition.toFixed(3)} à ${maxTransition.toFixed(3)} °C.`,
  `- Zones africaines dans le scénario BAU : ${africa.join(', ')}.`, '',
  '| Zone africaine | P99 2026 | P99 2100 | P99 2200 | RH 2026 | RH 2100 | RH 2200 | Tw 2100 |',
  '|---|---:|---:|---:|---:|---:|---:|---:|',
  ...africa.map(id => {
    const a = bau.find(state => state.year === 2026)!.countries[id];
    const b = bau.find(state => state.year === 2100)!.countries[id];
    const c = bau.find(state => state.year === 2200)!.countries[id];
    return `| ${id} | ${a.summerMaxTemp.toFixed(1)} °C | ${b.summerMaxTemp.toFixed(1)} °C | ${c.summerMaxTemp.toFixed(1)} °C | ${a.summerHumidity.toFixed(1)}% | ${b.summerHumidity.toFixed(1)}% | ${c.summerHumidity.toFixed(1)}% | ${b.wetBulbPeak?.toFixed(1) ?? 'NC'} °C |`;
  }), '',
  '| Scénario France | Année | P99 chaud | RH jours chauds | Tw |',
  '|---|---:|---:|---:|---:|',
  ...scenarios.flatMap((scenario, scenarioIndex) => [2026, 2050, 2100, 2200].map(year => {
    const state = trajectories[scenarioIndex].find(item => item.year === year)!.countries.fra;
    return `| ${scenario.shortName} | ${year} | ${state.summerMaxTemp.toFixed(1)} °C | ${state.summerHumidity.toFixed(1)}% | ${state.wetBulbPeak?.toFixed(1) ?? 'NC'} °C |`;
  })), '',
  '## Lecture et limites', '',
  'Le bleu aperçu en Afrique concernait le calque Tw, calculé à partir d’une humidité de scénario estimée et faible dans plusieurs zones arides; il ne signifiait pas que la température de l’air y était basse. Le calque par défaut affiche la moyenne annuelle des Tmax quotidiennes. Le P99 chaud, cette moyenne et le record absolu sont trois mesures différentes.',
  '',
  'Les années 1901–2025 réutilisent les anomalies mondiales annuelles NASA GISTEMP, recalées pour que 2025 corresponde à l’ancre interne du site, puis appliquées au normal ponctuel 1991–2020 avec un facteur régional. Elles ne sont pas des observations météorologiques nationales. Les pays réunis en une zone partagent une valeur représentative.',
  '',
  'De 2026 à 2100, la moyenne/minima/maxima annuels viennent des deltas tas/tasmin/tasmax CCKP. Le P99 local est projeté avec le delta du TXx CCKP (maximum annuel de la Tmax quotidienne), proxy de variation d’extrême et non projection directe du quantile P99. L’humidité estimée des jours chauds reçoit le delta moyen Hurs des mois chauds; Hurs mensuel n’est pas l’humidité horaire simultanée au P99 et sa confiance régionale est moindre. Tw est recalculée avec les deux critères.',
  '',
  'Après 2100, les deltas de température et d’humidité de fin de siècle sont prolongés au prorata de l’anomalie globale supplémentaire simulée par CLIMATOPEDY. La RH reste dans ses bornes physiques de 0–100 %; si elle sort du domaine validé de Stull (5–99 %), Tw est affichée NC au lieu de substituer artificiellement une humidité limite. La prolongation jusqu’en 2200 dépend du scénario interne et n’est pas une projection CMIP6 ou du GIEC.',
  '',
  'Les métadonnées CCKP signalent que l’humidité n’est pas ajustée pour éliminer des résultats non physiques. Son delta est donc traité comme une hypothèse de faible confiance; les valeurs futures de RH et de Tw doivent être lues avec prudence, surtout pour les zones arides.',
  '',
  'Le CSV détaille chaque polygone de pays, la zone simulée partagée et, pour chaque scénario, Tmin annuelle moyenne, Tmean, Tmax annuelle moyenne, scénario de canicule, humidité et Tw. Les champs vides pour Tw signifient que la formule de Stull est hors domaine.',
  ''
].join('\n');
await writeFile(resolve(outDir, 'temperature-trajectory-audit-1901-2200.md'), summary, 'utf8');
console.log(`Audit écrit: ${GEO_COUNTRY_FEATURES.length} pays/territoires × ${years} années; anomalies d'ordre=${orderFailures}, non-finis=${nonFiniteValues}; raccord 2025–2026=${minTransition.toFixed(3)}..${maxTransition.toFixed(3)}°C.`);
