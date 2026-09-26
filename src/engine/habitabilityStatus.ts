export type HabitabilityStatusKey = 'favorable' | 'constrained' | 'major';

export interface HabitabilityStatus {
  key: HabitabilityStatusKey;
  label: string;
  explanation: string;
  severity: 'low' | 'medium' | 'high';
}

/**
 * Summarizes the simulation's existing heat and food reference points.
 * This is an exploratory model label, not a real-world habitability assessment.
 */
export function getHabitabilityStatus(
  wetBulbPeakC: number,
  caloriesKcalPerPersonDay: number
): HabitabilityStatus | null {
  if (!Number.isFinite(wetBulbPeakC) || !Number.isFinite(caloriesKcalPerPersonDay)) return null;

  if (wetBulbPeakC >= 31) {
    return {
      key: 'major',
      label: 'Contraintes majeures dans le modèle',
      explanation: 'Le pic de Tw simulé atteint le seuil thermique élevé de 31 °C du modèle.',
      severity: 'high'
    };
  }

  if (wetBulbPeakC >= 26 || caloriesKcalPerPersonDay < 2100) {
    const reasons = [
      wetBulbPeakC >= 26 ? 'le pic de Tw simulé atteint 26 °C' : null,
      caloriesKcalPerPersonDay < 2100 ? 'la disponibilité calorique simulée passe sous le repère de 2 100 kcal/jour' : null
    ].filter((reason): reason is string => reason !== null);

    return {
      key: 'constrained',
      label: 'Habitabilité sous contraintes',
      explanation: `Dans le modèle, ${reasons.join(' et ')}.`,
      severity: 'medium'
    };
  }

  return {
    key: 'favorable',
    label: 'Conditions favorables dans le modèle',
    explanation: 'Dans le modèle, le pic de Tw reste sous 26 °C et la disponibilité simulée atteint au moins 2 100 kcal/jour.',
    severity: 'low'
  };
}

/** Historical station records are context for the present, never future projections. */
export function shouldShowHistoricalTemperatureRecord(year: number): boolean {
  return Number.isFinite(year) && year <= 2026;
}
