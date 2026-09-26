import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { COUNTRIES_DATA } from '../src/data/countriesData.ts';
import { GEO_COUNTRY_FEATURES } from '../src/data/worldMapGeo.ts';
import { generateFullTrajectory, SCENARIO_BAU, SCENARIO_DELAYED, SCENARIO_SOBRIETY } from '../src/engine/simulationRunner.ts';

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
      year <= 2025 ? 'reconstitution_historique_zone' : year <= 2100 ? 'scenario_CCKP_CMIP6_interpole' : 'extension_exploratoire_post_2100'
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
let maxTransition = 0;
let minTransition = Infinity;
for (const trajectory of trajectories) {
  for (const state of trajectory) {
    for (const id of knownZones) {
      const country = state.countries[id];
      if (![country.annualMinTemp, country.dryBulbTemp, country.annualMaxTemp].every(Number.isFinite)) nonFiniteValues++;
      if (!(country.annualMinTemp <= country.dryBulbTemp && country.dryBulbTemp <= country.annualMaxTemp)) orderFailures++;
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
  '# Résultat de l’audit des températures 1901–2200', '',
  `- Pays/territoires de la carte exportés : ${GEO_COUNTRY_FEATURES.length}.`,
  `- Zones climatiques simulées : ${knownZones.size}; les membres d’une même zone partagent les mêmes températures.`,
  `- Années : 300 par pays, pour trois scénarios futurs (BAU, intermédiaire, sobriété), soit ${GEO_COUNTRY_FEATURES.length * years} lignes pays-année.`,
  `- Températures absentes ou non finies dans les calculs : ${nonFiniteValues}.`,
  `- Violations Tmin ≤ moyenne annuelle ≤ Tmax : ${orderFailures}.`,
  `- Écart de température moyenne 2025→2026 parmi les zones/scénarios : ${minTransition.toFixed(3)} à ${maxTransition.toFixed(3)} °C.`,
  `- Zones africaines dans le scénario BAU : ${africa.join(', ')}.`, '',
  '| Zone africaine | Tmax moyenne journalière 2026 | 2100 | 2200 | Tw caniculaire 2100 |',
  '|---|---:|---:|---:|---:|',
  ...africa.map(id => {
    const a = bau.find(state => state.year === 2026)!.countries[id];
    const b = bau.find(state => state.year === 2100)!.countries[id];
    const c = bau.find(state => state.year === 2200)!.countries[id];
    return `| ${id} | ${a.annualMaxTemp.toFixed(1)} °C | ${b.annualMaxTemp.toFixed(1)} °C | ${c.annualMaxTemp.toFixed(1)} °C | ${b.wetBulbPeak?.toFixed(1) ?? 'NC'} °C |`;
  }), '',
  '## Lecture et limites', '',
  'Le bleu aperçu en Afrique concernait le calque Tw, calculé à partir d’une humidité de scénario estimée et faible dans plusieurs zones arides; il ne signifiait pas que la température de l’air y était basse. Le calque par défaut affiche maintenant la moyenne annuelle des Tmax quotidiennes. Il ne s’agit ni du record absolu ni du pic caniculaire P99.',
  '',
  'Les années 1901–2025 réutilisent les anomalies mondiales annuelles NASA GISTEMP, recalées pour que 2025 corresponde à l’ancre interne du site, puis appliquées au normal ponctuel 1991–2020 avec un facteur régional. Elles ne sont pas des observations météorologiques nationales. Les pays réunis en une zone partagent une valeur représentative.',
  '',
  'De 2026 à 2100, l’évolution annuelle des températures moyennes/minimales/maximales provient de l’interpolation du changement CMIP6 CCKP 2020–2039 à 2080–2099. Après 2100, la composante régionale CCKP est maintenue à son niveau de fin de siècle, puis l’anomalie supplémentaire du modèle global CLIMATOPEDY est appliquée au facteur régional. Cette extension jusqu’en 2200 est exploratoire, dépend du scénario interne et n’est pas une projection CMIP6 ou du GIEC.',
  '',
  'Le CSV détaille chaque polygone de pays, la zone simulée partagée et, pour chaque scénario, Tmin annuelle moyenne, Tmean, Tmax annuelle moyenne, scénario de canicule, humidité et Tw. Les champs vides pour Tw signifient que la formule de Stull est hors domaine.',
  ''
].join('\n');
await writeFile(resolve(outDir, 'temperature-trajectory-audit-1901-2200.md'), summary, 'utf8');
console.log(`Audit écrit: ${GEO_COUNTRY_FEATURES.length} pays/territoires × ${years} années; anomalies d'ordre=${orderFailures}, non-finis=${nonFiniteValues}; raccord 2025–2026=${minTransition.toFixed(3)}..${maxTransition.toFixed(3)}°C.`);
