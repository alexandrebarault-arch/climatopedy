import { GlobalBiophysicalState, MilestoneEvent, SimulationScenarioConfig } from '../types/simulation';
import { initializeSimulationState, stepSimulation } from './physicsModel';
import { generateHistoricalState } from './historicalData';

export const SIMULATION_MILESTONES: MilestoneEvent[] = [
  {
    year: 1901,
    category: 'energy',
    title: 'Jaillissement de Spindletop & Début de l\'Ère Pétrolière',
    description: 'Le gisement géant texan crache 100 000 barils/jour sous sa propre pression. L\'EROI initial dépasse 100:1 : 1 baril d\'énergie dépensé permet d\'en extraire 100.'
  },
  {
    year: 1913,
    category: 'agri',
    title: 'Synthèse Industrielle de l\'Ammoniac (Haber-Bosch)',
    description: 'Carl Bosch industrialise le procédé Fritz Haber chez BASF. L\'azote de l\'air est fixé avec du gaz naturel pour fabriquer des engrais de synthèse, brisant le plafond agricole naturel.'
  },
  {
    year: 1950,
    category: 'human',
    title: 'Début de la Révolution Verte & Explosion Démographique',
    description: 'Variétés céréalières à haut rendement (Borlaug), tracteurs au fioul et engrais azotés : la population passe de 2,5 à 8 milliards en quelques décennies.'
  },
  {
    year: 1973,
    category: 'energy',
    title: 'Premier Choc Pétrolier & Rapport Meadows',
    description: 'Fin du pétrole conventionnel bon marché aux USA (pic de Hubbert américain 1970). Première prise de conscience scientifique des limites de la planète.'
  },
  {
    year: 2026,
    category: 'energy',
    title: 'Le Présent : Épuisement du Pétrole Facile & Réchauffement',
    description: 'Consommation mondiale record de 100 millions de barils/jour. L\'EROI moyen est tombé à 12:1. Le CO2 dépasse 424 ppm et le réchauffement atteint +1.35°C.'
  },
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
 * Génère la trajectoire temporelle complète 1900-2100 pas à pas (annuelle)
 * Intègre la série historique réelle (1900-2025) et la projection biophysique (2026-2100)
 */
export function generateFullTrajectory(startYear = 1900): GlobalBiophysicalState[] {
  const trajectory: GlobalBiophysicalState[] = [];

  // 1. Période historique 1900 à 2025
  if (startYear <= 1900) {
    for (let yr = 1900; yr < 2026; yr++) {
      trajectory.push(generateHistoricalState(yr));
    }
  }

  // 2. Point de référence 2026 (Présent calibré)
  let state = initializeSimulationState();
  trajectory.push(state);

  // 3. Projection prospective 2026 à 2100
  const endYear = 2100;
  const dt = 1.0;
  const steps = endYear - 2026;

  for (let s = 0; s < steps; s++) {
    state = stepSimulation(state, dt);
    trajectory.push(state);
  }

  return trajectory;
}

