export type TemperatureDataClass =
  | 'reconstitution_historique_zone'
  | 'ancrage_modele_non_observation'
  | 'scenario_CCKP_CMIP6_interpole'
  | 'extension_exploratoire_post_2100';

export interface TemperatureQualityMetrics {
  annualMinTemp: number;
  dryBulbTemp: number;
  annualMaxTemp: number;
  summerMaxTemp: number;
  summerHumidity: number;
  wetBulbPeak: number | null;
}

export interface TemperatureQualityIssue {
  code: string;
  severity: 'erreur' | 'information';
  message: string;
  correction: string;
}

export interface TemperatureQualityResult {
  status: 'conforme' | 'limite_formule' | 'anomalie';
  passedChecks: number;
  totalChecks: number;
  errors: TemperatureQualityIssue[];
  information: TemperatureQualityIssue[];
}

export const TEMPERATURE_QUALITY_THRESHOLDS = {
  airMinC: -100,
  airMaxC: 70,
  p99MaxC: 75,
  wetBulbToleranceC: 0.05,
  yearToYearAirJumpC: 2,
  yearToYearP99JumpC: 3,
  yearToYearHumidityJumpPct: 10
} as const;

export function getTemperatureDataClass(year: number): TemperatureDataClass {
  if (year <= 2025) return 'reconstitution_historique_zone';
  if (year === 2026) return 'ancrage_modele_non_observation';
  if (year <= 2100) return 'scenario_CCKP_CMIP6_interpole';
  return 'extension_exploratoire_post_2100';
}

/**
 * Checks one country-polygon/year/scenario row. Limits are conservative sanity
 * bounds; observed-data accuracy cannot be inferred from these model-only checks.
 */
export function auditTemperatureYear(
  metrics: TemperatureQualityMetrics,
  expectedWetBulbC: number | null,
  previousYear?: TemperatureQualityMetrics
): TemperatureQualityResult {
  const errors: TemperatureQualityIssue[] = [];
  const information: TemperatureQualityIssue[] = [];
  const checks: boolean[] = [];
  const error = (code: string, message: string, correction: string) => {
    errors.push({ code, severity: 'erreur', message, correction });
  };

  const annualFinite = [metrics.annualMinTemp, metrics.dryBulbTemp, metrics.annualMaxTemp].every(Number.isFinite);
  checks.push(annualFinite);
  if (!annualFinite) error('TEMPERATURE_ANNUELLE_NON_FINIE', 'Une température annuelle est absente ou non finie.', 'Régénérer la donnée source de la zone; ne pas remplacer la valeur par zéro.');

  const annualInRange = [metrics.annualMinTemp, metrics.dryBulbTemp, metrics.annualMaxTemp]
    .every(value => Number.isFinite(value) && value >= TEMPERATURE_QUALITY_THRESHOLDS.airMinC && value <= TEMPERATURE_QUALITY_THRESHOLDS.airMaxC);
  checks.push(annualInRange);
  if (!annualInRange) error('TEMPERATURE_ANNUELLE_HORS_BORNES', `Une température annuelle sort des bornes de contrôle ${TEMPERATURE_QUALITY_THRESHOLDS.airMinC}–${TEMPERATURE_QUALITY_THRESHOLDS.airMaxC}°C.`, 'Vérifier unité, valeur de remplissage, clé pays et scénario source avant toute correction.');

  const annualOrderValid = metrics.annualMinTemp <= metrics.dryBulbTemp && metrics.dryBulbTemp <= metrics.annualMaxTemp;
  checks.push(annualOrderValid);
  if (!annualOrderValid) error('ORDRE_TEMPERATURE_ANNUEL_INVALIDE', 'L’ordre Tmin ≤ moyenne annuelle ≤ Tmax est violé.', 'Vérifier les unités et l’alignement des variables tasmin, tas et tasmax; corriger le pipeline source, pas la valeur à la main.');

  const p99Finite = Number.isFinite(metrics.summerMaxTemp);
  checks.push(p99Finite);
  if (!p99Finite) error('P99_NON_FINIE', 'Le P99 chaud est absent ou non fini.', 'Vérifier la référence locale et les deltas TXx de la zone; ne pas afficher de valeur interpolée silencieusement.');

  const p99InRange = Number.isFinite(metrics.summerMaxTemp) && metrics.summerMaxTemp >= TEMPERATURE_QUALITY_THRESHOLDS.airMinC && metrics.summerMaxTemp <= TEMPERATURE_QUALITY_THRESHOLDS.p99MaxC;
  checks.push(p99InRange);
  if (!p99InRange) error('P99_HORS_BORNES', `Le P99 chaud sort des bornes de contrôle ${TEMPERATURE_QUALITY_THRESHOLDS.airMinC}–${TEMPERATURE_QUALITY_THRESHOLDS.p99MaxC}°C.`, 'Vérifier unités, point représentatif et deltas TXx avant de conserver cette projection.');

  const p99AboveAnnualMax = Number.isFinite(metrics.summerMaxTemp) && Number.isFinite(metrics.annualMaxTemp) && metrics.summerMaxTemp >= metrics.annualMaxTemp;
  checks.push(p99AboveAnnualMax);
  if (!p99AboveAnnualMax) error('P99_SOUS_TMAX_MOYENNE', 'Le P99 chaud est inférieur à la moyenne annuelle des Tmax quotidiennes.', 'Vérifier que le P99 utilise les jours des mois chauds et que l’anomalie TXx a été appliquée avec la bonne zone et la bonne année.');

  const humidityInRange = Number.isFinite(metrics.summerHumidity) && metrics.summerHumidity >= 0 && metrics.summerHumidity <= 100;
  checks.push(humidityInRange);
  if (!humidityInRange) error('HUMIDITE_HORS_BORNES', 'L’humidité relative est non finie ou hors de 0–100%.', 'Vérifier Hurs, les unités en points de pourcentage et l’application du delta de scénario.');

  const wetBulb = metrics.wetBulbPeak;
  const twConsistent = expectedWetBulbC === null
    ? wetBulb === null
    : wetBulb !== null && Number.isFinite(wetBulb) && Math.abs(wetBulb - expectedWetBulbC) <= TEMPERATURE_QUALITY_THRESHOLDS.wetBulbToleranceC;
  checks.push(twConsistent);
  if (!twConsistent) error('TW_INCOHERENT_AVEC_ENTREES', 'Tw ne correspond pas aux entrées P99/RH ou à leur domaine de calcul.', 'Recalculer Tw depuis le P99 et la RH de cette même ligne; conserver NC si Stull est hors domaine.');

  const twValue = metrics.wetBulbPeak;
  const twBelowDryBulb = twValue === null || (Number.isFinite(twValue) && twValue <= metrics.summerMaxTemp);
  checks.push(twBelowDryBulb);
  if (!twBelowDryBulb) error('TW_SUPERIEURE_A_TEMPERATURE_AIR', 'Tw dépasse la température de l’air utilisée en entrée.', 'Vérifier l’ordre des arguments Ta/RH, les unités et la formule Tw.');

  const temporalConsistent = previousYear === undefined || (
    Math.abs(metrics.dryBulbTemp - previousYear.dryBulbTemp) <= TEMPERATURE_QUALITY_THRESHOLDS.yearToYearAirJumpC &&
    Math.abs(metrics.annualMinTemp - previousYear.annualMinTemp) <= TEMPERATURE_QUALITY_THRESHOLDS.yearToYearAirJumpC &&
    Math.abs(metrics.annualMaxTemp - previousYear.annualMaxTemp) <= TEMPERATURE_QUALITY_THRESHOLDS.yearToYearAirJumpC &&
    Math.abs(metrics.summerMaxTemp - previousYear.summerMaxTemp) <= TEMPERATURE_QUALITY_THRESHOLDS.yearToYearP99JumpC &&
    Math.abs(metrics.summerHumidity - previousYear.summerHumidity) <= TEMPERATURE_QUALITY_THRESHOLDS.yearToYearHumidityJumpPct
  );
  if (previousYear !== undefined) {
    checks.push(temporalConsistent);
    if (!temporalConsistent) error('RUPTURE_TEMPORELLE', 'Un ou plusieurs indicateurs changent trop fortement par rapport à l’année précédente.', 'Comparer les deux années et vérifier source, correspondance de zone, scénario et interpolation; ne pas lisser avant d’avoir trouvé la cause.');
  }

  if (expectedWetBulbC === null && metrics.wetBulbPeak === null) {
    information.push({
      code: 'TW_HORS_DOMAINE_STULL',
      severity: 'information',
      message: 'Tw est correctement indisponible car au moins une entrée est hors du domaine publié de Stull.',
      correction: 'Aucune correction de données : conserver NC et afficher quelle entrée dépasse le domaine.'
    });
  }

  return {
    status: errors.length ? 'anomalie' : information.length ? 'limite_formule' : 'conforme',
    passedChecks: checks.filter(Boolean).length,
    totalChecks: checks.length,
    errors,
    information
  };
}
