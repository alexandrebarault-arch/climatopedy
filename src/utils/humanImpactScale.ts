export interface HumanImpactInputs {
  annualMaxTemp: number;
  referenceMaxTemp: number;
  caloriesPerCapita: number;
  baseBirthRatePerThousand: number;
  birthRatePerThousand: number;
  populationMillions: number;
}

export interface HumanImpactColorBand {
  max: number;
  label: string;
  color: string;
}

/**
 * Exploratory visualization score (0–1), not a validated health or welfare index.
 * Heat, calorie shortfall and modeled birth-rate decline estimate local stress;
 * population only adjusts how many people may be exposed (capped logarithmically).
 */
export function getHumanImpactScore(input: HumanImpactInputs): number {
  const values = Object.values(input);
  if (!values.every(Number.isFinite) || input.baseBirthRatePerThousand <= 0 || input.populationMillions < 0) return Number.NaN;

  const heatStress = clamp((input.annualMaxTemp - input.referenceMaxTemp) / 6, 0, 1);
  const calorieStress = clamp((2100 - input.caloriesPerCapita) / 1000, 0, 1);
  const birthRateStress = clamp((input.baseBirthRatePerThousand - input.birthRatePerThousand) / (input.baseBirthRatePerThousand * 0.5), 0, 1);
  const localStress = heatStress * 0.4 + calorieStress * 0.4 + birthRateStress * 0.2;
  const populationReach = clamp(Math.log1p(input.populationMillions) / Math.log1p(1000), 0, 1);
  return clamp(localStress * (0.7 + populationReach * 0.3), 0, 1);
}

export const HUMAN_IMPACT_COLOR_BANDS: readonly HumanImpactColorBand[] = [
  { max: 0.1, label: 'Faible', color: '#fef3c7' },
  { max: 0.25, label: 'Modéré', color: '#fdba74' },
  { max: 0.45, label: 'Élevé', color: '#f97316' },
  { max: 0.65, label: 'Très élevé', color: '#dc2626' },
  { max: Number.POSITIVE_INFINITY, label: 'Extrême', color: '#7f1d1d' },
];

export const HUMAN_IMPACT_UNAVAILABLE_COLOR = '#94a3b8';

export function getHumanImpactColor(score: number): string {
  if (!Number.isFinite(score) || score < 0) return HUMAN_IMPACT_UNAVAILABLE_COLOR;
  return HUMAN_IMPACT_COLOR_BANDS.find(band => score < band.max)?.color ?? HUMAN_IMPACT_COLOR_BANDS.at(-1)!.color;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
