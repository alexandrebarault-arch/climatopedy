import { GlobalBiophysicalState, MilestoneEvent, SimulationScenarioConfig } from '../types/simulation';
import { initializeSimulationState, stepSimulation } from './physicsModel';

export const SIMULATION_MILESTONES: MilestoneEvent[] = [
  {
    year: 2030,
    category: 'energy',
    title: 'Déclin des Gisements Historiques Super-Géants',
    description: 'Les gisements conventionnels à bas coût (Ghawar, Cantarell, Burgan) entrent en déplétion avancée. Le forage s\'oriente vers l\'offshore ultra-profond et le schiste étanche nécessitant 4x plus d\'acier et de forages horizontaux.'
  },
  {
    year: 2038,
    category: 'climate',
    title: 'Franchissement des +1.8°C & Dômes de Chaleur Humide',
    description: 'Premières vagues de chaleur humide estivales où la température de thermomètre mouillé de Stull approche 31.0°C dans la plaine du Gange et le Golfe. Climatisation d\'urgence sous tension électrique extrême.'
  },
  {
    year: 2045,
    category: 'energy',
    title: 'Seuil Critique de l\'EROI sous 12:1',
    description: 'La part de l\'énergie primaire requise pour alimenter l\'appareil extractif lui-même (cannibalisme énergétique) s\'envole au-delà de 8%. Les marges industrielles de raffinage se contractent.'
  },
  {
    year: 2053,
    category: 'agri',
    title: 'Tension Critique sur la Synthèse Haber-Bosch',
    description: 'La raréfaction du gaz naturel bon marché et la chute de l\'énergie nette compressent la production d\'ammoniac et d\'urée. Les rendements mondiaux du maïs et du blé enregistrent un premier décrochage brutal.'
  },
  {
    year: 2062,
    category: 'human',
    title: 'Inflexion Démographique & Pic de Population Mondiale',
    description: 'L\'effet ciseau (stress thermique létal + déficit calorique sous 2100 kcal + effondrement de la fertilité biologique) fait basculer la balance mondiale : les décès annuels dépassent les naissances.'
  },
  {
    year: 2075,
    category: 'energy',
    title: 'La Falaise de l\'EROI sous 6:1',
    description: 'Pour chaque 6 barils extraits, 1 baril équivalent est immédiatement consumé pour le forage, les presses à diamant PDC et la sidérurgie de cuvelage API. L\'énergie nette résiduelle allouée au secteur civil s\'effondre.'
  },
  {
    year: 2090,
    category: 'human',
    title: 'Régression Démographique & Recomposition Spatiale',
    description: 'Après plusieurs décennies de famines récurrentes et de dômes thermiques insoutenables, la population mondiale se stabilise vers un socle biophysique résilient compatible avec l\'agriculture post-chimique.'
  }
];

export const PRESET_SCENARIOS: SimulationScenarioConfig[] = [
  {
    name: 'SSP5-8.5 Inertie Brute (Standard)',
    description: 'Hypothèse centrale du brief : rigidité comportementale totale, poursuite effrénée de l\'extraction et de la consommation matérielle jusqu\'aux limites physiques.',
    eroiInitial: 32.0,
    ultimateReservesQinf: 2.80e12,
    climateSensitivityECS: 3.0,
    haberBoschDependency: 1.0,
    borderMilitarizationSpeed: 1.0
  },
  {
    name: 'Stress Climatique Extrême (ECS = 4.2°C)',
    description: 'Sensibilité climatique forte et dégel précoce du pergélisol arctique accélérant les dômes thermiques létaux (Tw > 31°C).',
    eroiInitial: 32.0,
    ultimateReservesQinf: 2.80e12,
    climateSensitivityECS: 4.2,
    haberBoschDependency: 1.0,
    borderMilitarizationSpeed: 1.3
  },
  {
    name: 'Falaise Énergétique Précoce (Q_inf = 2.3 T boe)',
    description: 'Réserves ultimes géologiques inférieures aux estimations optimistes. Chute précipitée de l\'EROI sous 10:1 dès 2038.',
    eroiInitial: 28.0,
    ultimateReservesQinf: 2.30e12,
    climateSensitivityECS: 3.0,
    haberBoschDependency: 1.2,
    borderMilitarizationSpeed: 1.1
  }
];

/**
 * Génère la trajectoire temporelle complète 2026-2100 pas à pas (annuelle)
 */
export function generateFullTrajectory(): GlobalBiophysicalState[] {
  const trajectory: GlobalBiophysicalState[] = [];
  let state = initializeSimulationState();
  trajectory.push(state);

  const startYear = 2026;
  const endYear = 2100;
  const dt = 1.0; // Pas annuel pour la table de trajectoire
  const steps = endYear - startYear;

  for (let s = 0; s < steps; s++) {
    state = stepSimulation(state, dt);
    trajectory.push(state);
  }

  return trajectory;
}
