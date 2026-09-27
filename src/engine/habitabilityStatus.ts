export type HabitabilityStatusKey = 'favorable' | 'constrained' | 'high' | 'major' | 'extreme';

export interface HabitabilityStatus {
  key: HabitabilityStatusKey;
  label: string;
  explanation: string;
  severity: 'low' | 'medium' | 'high' | 'very-high' | 'extreme';
  reasons: string[];
  missingDimensions: string[];
}

export interface HabitabilityColorBand {
  key: HabitabilityStatusKey;
  label: string;
  color: string;
}

export const HABITABILITY_COLOR_BANDS: readonly HabitabilityColorBand[] = [
  { key: 'favorable', label: 'Contraintes faibles', color: '#fef3c7' },
  { key: 'constrained', label: 'Contraintes modérées', color: '#fdba74' },
  { key: 'high', label: 'Contraintes fortes', color: '#f97316' },
  { key: 'major', label: 'Contraintes majeures', color: '#dc2626' },
  { key: 'extreme', label: 'Contraintes très fortes', color: '#7f1d1d' }
];

export const HABITABILITY_UNAVAILABLE_COLOR = '#94a3b8';

export function getHabitabilityColor(key: HabitabilityStatusKey | null): string {
  if (!key) return HABITABILITY_UNAVAILABLE_COLOR;
  return HABITABILITY_COLOR_BANDS.find(band => band.key === key)?.color ?? HABITABILITY_UNAVAILABLE_COLOR;
}

/**
 * Summarizes available heat, food, household water-access and water-stress indicators.
 * These display bands are conservative visualization heuristics, not habitability limits.
 */
export interface HabitabilityInputs {
  wetBulbPeakC: number | null;
  annualMeanDailyMaxTempC: number | null;
  hotSeasonP99C: number | null;
  caloriesKcalPerPersonDay: number | null;
  improvedWaterAccessPct: number | null;
  nationalWaterStressCategory: number | null;
  waterAccessSourceYear?: number | null;
  waterAccessProjectionMethod?: string | null;
  nationalWaterStressSourceYear?: number | null;
}

export function getHabitabilityStatus(input: HabitabilityInputs): HabitabilityStatus | null {
  const metricLevels: Array<{ name: string; level: number | null; reason: string | null }> = [
    {
      name: 'chaleur humide',
      level: isFiniteValue(input.wetBulbPeakC) ? input.wetBulbPeakC >= 29 ? 4 : input.wetBulbPeakC >= 28 ? 3 : input.wetBulbPeakC >= 27 ? 2 : input.wetBulbPeakC >= 26 ? 1 : 0 : null,
      reason: isFiniteValue(input.wetBulbPeakC) && input.wetBulbPeakC >= 26 ? `Tw estimée à ${input.wetBulbPeakC.toFixed(1)} °C` : null
    },
    {
      name: 'chaleur sèche',
      level: isFiniteValue(input.hotSeasonP99C) ? input.hotSeasonP99C >= 50 ? 4 : input.hotSeasonP99C >= 45 ? 3 : input.hotSeasonP99C >= 40 ? 2 : input.hotSeasonP99C >= 35 ? 1 : 0 : null,
      reason: isFiniteValue(input.hotSeasonP99C) && input.hotSeasonP99C >= 35 ? `P99 chaud estimé à ${input.hotSeasonP99C.toFixed(1)} °C` : null
    },
    {
      name: 'chaleur moyenne quotidienne',
      level: isFiniteValue(input.annualMeanDailyMaxTempC) ? input.annualMeanDailyMaxTempC >= 35 ? 3 : input.annualMeanDailyMaxTempC >= 32 ? 2 : input.annualMeanDailyMaxTempC >= 30 ? 1 : 0 : null,
      reason: isFiniteValue(input.annualMeanDailyMaxTempC) && input.annualMeanDailyMaxTempC >= 30 ? `moyenne annuelle des Tmax à ${input.annualMeanDailyMaxTempC.toFixed(1)} °C` : null
    },
    {
      name: 'disponibilité calorique',
      level: isFiniteValue(input.caloriesKcalPerPersonDay) ? input.caloriesKcalPerPersonDay < 1500 ? 4 : input.caloriesKcalPerPersonDay < 1700 ? 3 : input.caloriesKcalPerPersonDay < 1900 ? 2 : input.caloriesKcalPerPersonDay < 2100 ? 1 : 0 : null,
      reason: isFiniteValue(input.caloriesKcalPerPersonDay) && input.caloriesKcalPerPersonDay < 2100 ? `${Math.round(input.caloriesKcalPerPersonDay)} kcal/jour simulées` : null
    },
    {
      name: 'accès à l’eau améliorée',
      level: isFiniteValue(input.improvedWaterAccessPct) ? input.improvedWaterAccessPct < 25 ? 4 : input.improvedWaterAccessPct < 50 ? 3 : input.improvedWaterAccessPct < 75 ? 2 : input.improvedWaterAccessPct < 90 ? 1 : 0 : null,
      reason: isFiniteValue(input.improvedWaterAccessPct) && input.improvedWaterAccessPct < 90
        ? input.waterAccessProjectionMethod === 'post-horizon-reference'
          ? `${input.improvedWaterAccessPct.toFixed(1)} % d’accès amélioré (niveau ${input.waterAccessSourceYear} maintenu à titre exploratoire)`
          : `${input.improvedWaterAccessPct.toFixed(1)} % d’accès projeté à une source améliorée`
        : input.waterAccessProjectionMethod === 'post-horizon-reference'
          ? `niveau d’accès amélioré de ${input.waterAccessSourceYear} maintenu à titre exploratoire`
          : null
    },
    {
      name: 'stress hydrique national',
      level: isFiniteValue(input.nationalWaterStressCategory) ? input.nationalWaterStressCategory >= 4 ? 3 : input.nationalWaterStressCategory >= 3 ? 2 : input.nationalWaterStressCategory >= 2 ? 1 : 0 : null,
      reason: isFiniteValue(input.nationalWaterStressCategory) && input.nationalWaterStressCategory >= 2
        ? `stress hydrique national Aqueduct de catégorie ${input.nationalWaterStressCategory}${input.nationalWaterStressSourceYear ? ` (horizon ${input.nationalWaterStressSourceYear})` : ''}`
        : null
    }
  ];
  const available = metricLevels.filter(item => item.level !== null);
  if (!available.length) return null;
  const level = Math.max(...available.map(item => item.level!));
  // A low constraint class would otherwise imply low water risk where household access is unknown.
  if (level === 0 && !isFiniteValue(input.improvedWaterAccessPct)) return null;
  const reasons = available.filter(item => item.reason !== null).map(item => item.reason!);
  const missingDimensions = metricLevels.filter(item => item.level === null).map(item => item.name);
  const keys: HabitabilityStatusKey[] = ['favorable', 'constrained', 'high', 'major', 'extreme'];
  const labels = ['Contraintes faibles dans les indicateurs disponibles', 'Contraintes modérées dans le modèle', 'Contraintes fortes dans le modèle', 'Contraintes majeures dans le modèle', 'Contraintes très fortes dans le modèle'];
  const severities: HabitabilityStatus['severity'][] = ['low', 'medium', 'high', 'very-high', 'extreme'];
  const explanation = [
    reasons.length ? `Classe déterminée par ${reasons.join(' et ')}` : 'Aucun seuil de contrainte des indicateurs disponibles n’est franchi',
    missingDimensions.length ? `données manquantes : ${missingDimensions.join(', ')}` : null,
    'Indicateurs partiels et modélisés; ce classement ne constitue pas un verdict d’habitabilité.'
  ].filter(Boolean).join('. ') + '.';
  return { key: keys[level], label: labels[level], explanation, severity: severities[level], reasons, missingDimensions };
}

function isFiniteValue(value: number | null): value is number {
  return value !== null && Number.isFinite(value);
}

/** Historical station records are context for the present, never future projections. */
export function shouldShowHistoricalTemperatureRecord(year: number): boolean {
  return Number.isFinite(year) && year <= 2026;
}
