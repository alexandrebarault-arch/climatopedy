import { SimulationScenarioConfig } from '../types/simulation';
import { SCENARIO_BAU, SCENARIO_SOBRIETY, SCENARIO_DELAYED } from '../engine/simulationRunner';

export interface CustomSimulationParams {
  oilDemandReductionRate: number;
  agroEcologyAdoptionRate: number;
  adaptationResilienceBoost: number;
  climateSensitivityECS: number;
}

export interface SimulationUrlState {
  isCompareMode: boolean;
  scenarioBId: string;
  params: CustomSimulationParams;
  year?: number;
}

/**
 * Construit un objet URLSearchParams avec les paramètres personnalisés du scénario B
 */
export function encodeSimulationParamsToUrl(
  params: CustomSimulationParams,
  scenarioBId: string = 'custom',
  year?: number
): string {
  const searchParams = new URLSearchParams(window.location.search);

  // Définir les variables clés de la simulation
  searchParams.set('scenB', scenarioBId);
  searchParams.set('oilRed', params.oilDemandReductionRate.toFixed(1));
  searchParams.set('agro', params.agroEcologyAdoptionRate.toFixed(0));
  searchParams.set('resil', params.adaptationResilienceBoost.toFixed(2));
  searchParams.set('ecs', params.climateSensitivityECS.toFixed(2));
  
  if (year && !isNaN(year)) {
    searchParams.set('year', Math.round(year).toString());
  }

  return searchParams.toString();
}

/**
 * Lit les paramètres depuis l'URL actuelle et renvoie l'état initial reconstitué
 */
export function decodeSimulationParamsFromUrl(): {
  hasCustomUrlParams: boolean;
  scenarioB: SimulationScenarioConfig;
  customParams: CustomSimulationParams;
  year?: number;
} {
  if (typeof window === 'undefined') {
    return {
      hasCustomUrlParams: false,
      scenarioB: SCENARIO_SOBRIETY,
      customParams: {
        oilDemandReductionRate: SCENARIO_SOBRIETY.oilDemandReductionRate,
        agroEcologyAdoptionRate: SCENARIO_SOBRIETY.agroEcologyAdoptionRate,
        adaptationResilienceBoost: SCENARIO_SOBRIETY.adaptationResilienceBoost,
        climateSensitivityECS: SCENARIO_SOBRIETY.climateSensitivityECS,
      }
    };
  }

  const urlParams = new URLSearchParams(window.location.search);
  
  const scenBParam = urlParams.get('scenB');
  const oilRedParam = urlParams.get('oilRed');
  const agroParam = urlParams.get('agro');
  const resilParam = urlParams.get('resil');
  const ecsParam = urlParams.get('ecs');
  const yearParam = urlParams.get('year');

  const hasParams = Boolean(scenBParam || oilRedParam || agroParam || resilParam || ecsParam);

  // Valeurs par défaut de départ
  let baseScenario: SimulationScenarioConfig = SCENARIO_SOBRIETY;
  if (scenBParam === 'delayed') {
    baseScenario = SCENARIO_DELAYED;
  } else if (scenBParam === 'bau') {
    baseScenario = SCENARIO_BAU;
  }

  const parsedOilRed = oilRedParam !== null ? parseFloat(oilRedParam) : baseScenario.oilDemandReductionRate;
  const parsedAgro = agroParam !== null ? parseFloat(agroParam) : baseScenario.agroEcologyAdoptionRate;
  const parsedResil = resilParam !== null ? parseFloat(resilParam) : baseScenario.adaptationResilienceBoost;
  const parsedEcs = ecsParam !== null ? parseFloat(ecsParam) : baseScenario.climateSensitivityECS;
  const parsedYear = yearParam !== null ? parseInt(yearParam, 10) : undefined;

  // Validation des bornes
  const safeParams: CustomSimulationParams = {
    oilDemandReductionRate: Math.max(0, Math.min(10, isNaN(parsedOilRed) ? 4.0 : parsedOilRed)),
    agroEcologyAdoptionRate: Math.max(0, Math.min(100, isNaN(parsedAgro) ? 65 : parsedAgro)),
    adaptationResilienceBoost: Math.max(1.0, Math.min(3.0, isNaN(parsedResil) ? 1.8 : parsedResil)),
    climateSensitivityECS: Math.max(1.5, Math.min(6.0, isNaN(parsedEcs) ? 3.0 : parsedEcs)),
  };

  let resolvedScenarioB: SimulationScenarioConfig;

  if (scenBParam === 'delayed' && !oilRedParam && !agroParam) {
    resolvedScenarioB = SCENARIO_DELAYED;
  } else if (scenBParam === 'sobriety' && !oilRedParam && !agroParam) {
    resolvedScenarioB = SCENARIO_SOBRIETY;
  } else if (scenBParam === 'bau' && !oilRedParam && !agroParam) {
    resolvedScenarioB = SCENARIO_BAU;
  } else if (hasParams) {
    resolvedScenarioB = {
      id: 'custom',
      name: 'Scénario Personnalisé (Partagé via URL)',
      shortName: 'Personnalisé (Lien)',
      tagline: `Paramétrage spécifique : -${safeParams.oilDemandReductionRate}%/an pétrole, ${safeParams.agroEcologyAdoptionRate}% agroécologie, résilience x${safeParams.adaptationResilienceBoost.toFixed(1)}`,
      description: 'Simulation configurée via les paramètres d\'URL partagés.',
      badgeColor: 'border-purple-500/50 bg-purple-950/40 text-purple-300',
      lineColor: '#c084fc',
      dashArray: '6 3',
      ...safeParams,
      ultimateReservesQinf: 2.80e12,
    };
  } else {
    resolvedScenarioB = SCENARIO_SOBRIETY;
  }

  return {
    hasCustomUrlParams: hasParams,
    scenarioB: resolvedScenarioB,
    customParams: safeParams,
    year: parsedYear && !isNaN(parsedYear) && parsedYear >= 1900 && parsedYear <= 2200 ? parsedYear : undefined,
  };
}

/**
 * Met à jour les query params dans l'historique sans recharger la page
 */
export function syncUrlWithSimulationState(
  params: CustomSimulationParams,
  scenarioBId: string,
  year?: number
) {
  if (typeof window === 'undefined') return;

  const queryString = encodeSimulationParamsToUrl(params, scenarioBId, year);
  const newRelativePathQuery = `${window.location.pathname}?${queryString}${window.location.hash}`;
  window.history.replaceState(null, '', newRelativePathQuery);
}

/**
 * Génère l'URL absolue complète pour le partage
 */
export function getShareableSimulationUrl(
  params: CustomSimulationParams,
  scenarioBId: string,
  year?: number
): string {
  if (typeof window === 'undefined') return '';
  const queryString = encodeSimulationParamsToUrl(params, scenarioBId, year);
  return `${window.location.origin}${window.location.pathname}?${queryString}${window.location.hash}`;
}
