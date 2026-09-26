export type HabitabilityStatusKey = 'favorable' | 'constrained' | 'high' | 'major' | 'extreme';

export interface HabitabilityStatus {
  key: HabitabilityStatusKey;
  label: string;
  explanation: string;
  severity: 'low' | 'medium' | 'high' | 'very-high' | 'extreme';
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
 * Groups the model's wet-bulb and calorie outputs into map classes.
 * These are visualization thresholds, not validated habitability boundaries.
 */
export function getHabitabilityStatus(
  wetBulbPeakC: number | null,
  caloriesKcalPerPersonDay: number
): HabitabilityStatus | null {
  if (!Number.isFinite(caloriesKcalPerPersonDay)) return null;
  const tw = wetBulbPeakC !== null && Number.isFinite(wetBulbPeakC) ? wetBulbPeakC : null;

  const heatLevel = tw === null ? null : tw >= 29 ? 4 : tw >= 28 ? 3 : tw >= 27 ? 2 : tw >= 26 ? 1 : 0;
  const foodLevel = caloriesKcalPerPersonDay < 1500 ? 4
    : caloriesKcalPerPersonDay < 1700 ? 3
      : caloriesKcalPerPersonDay < 1900 ? 2
        : caloriesKcalPerPersonDay < 2100 ? 1 : 0;
  const level = Math.max(heatLevel ?? 0, foodLevel);
  if (heatLevel === null && foodLevel === 0) return null;

  const keys: HabitabilityStatusKey[] = ['favorable', 'constrained', 'high', 'major', 'extreme'];
  const labels = ['Contraintes faibles dans le modèle', 'Contraintes modérées dans le modèle', 'Contraintes fortes dans le modèle', 'Contraintes majeures dans le modèle', 'Contraintes très fortes dans le modèle'];
  const severities: HabitabilityStatus['severity'][] = ['low', 'medium', 'high', 'very-high', 'extreme'];
  const reasons = [
    heatLevel !== null && heatLevel > 0 ? `le pic de Tw simulé atteint ${tw!.toFixed(1)} °C` : null,
    foodLevel > 0 ? `la disponibilité calorique simulée est de ${Math.round(caloriesKcalPerPersonDay)} kcal/jour` : null
  ].filter((reason): reason is string => reason !== null);
  const explanation = level === 0
    ? 'Dans le modèle, aucun des deux repères retenus n’est franchi; cela ne garantit pas l’habitabilité réelle.'
    : `Dans le modèle, ${reasons.join(' et ')}. Ces repères ne constituent pas un verdict d’habitabilité réelle.`;

  return { key: keys[level], label: labels[level], explanation, severity: severities[level] };
}

/** Historical station records are context for the present, never future projections. */
export function shouldShowHistoricalTemperatureRecord(year: number): boolean {
  return Number.isFinite(year) && year <= 2026;
}
