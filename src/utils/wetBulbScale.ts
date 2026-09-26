export interface WetBulbColorBand {
  max: number;
  label: string;
  color: string;
}

/** Presentation bands for simulated peak wet-bulb temperature (Tw), in °C. */
export const WET_BULB_COLOR_BANDS: readonly WetBulbColorBand[] = [
  { max: 14, label: '<14°C', color: '#1d4ed8' },
  { max: 18, label: '14–18°C', color: '#38bdf8' },
  { max: 22, label: '18–22°C', color: '#06b6d4' },
  { max: 25, label: '22–25°C', color: '#facc15' },
  { max: 27, label: '25–27°C', color: '#f59e0b' },
  { max: 29, label: '27–29°C', color: '#f97316' },
  { max: 31, label: '29–31°C', color: '#ef4444' },
  { max: 33, label: '31–33°C', color: '#b91c1c' },
  { max: Number.POSITIVE_INFINITY, label: '≥33°C', color: '#701a75' }
];

export const WET_BULB_UNAVAILABLE_COLOR = '#94a3b8';

export function getWetBulbColor(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return WET_BULB_UNAVAILABLE_COLOR;
  return WET_BULB_COLOR_BANDS.find(band => value < band.max)?.color ?? WET_BULB_UNAVAILABLE_COLOR;
}
