import { GlobalBiophysicalState, MilestoneEvent, SimulationScenarioConfig } from '../types/simulation';
import { initializeSimulationState, stepSimulation } from './physicsModel';
import { generateHistoricalState } from './historicalData';

export const SIMULATION_MILESTONES: MilestoneEvent[] = [
  {
    year: 1901,
    category: 'energy',
    title: 'Jaillissement de Spindletop & Début de l\'Ère Pétrolière',
    description: 'Repère historique lié à l\'essor de la production pétrolière au Texas. La valeur d\'EROI de 100:1 est un paramètre illustratif du modèle, pas une mesure représentative de tous les gisements.'
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
    description: 'Variétés céréalières à haut rendement, mécanisation agricole et engrais azotés ont accompagné la hausse de la production alimentaire et de la population mondiale au cours du XXe siècle. Cette formulation ne quantifie pas la contribution propre de chaque facteur.'
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
    description: 'Valeurs affichées pour 2026 : les émissions, l\'EROI et l\'anomalie thermique proviennent des données initiales et des paramètres de CLIMATOPEDY; elles ne constituent pas toutes des observations annuelles mesurées.'
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
    description: 'Sortie conditionnelle du scénario CLIMATOPEDY : les variables de stress thermique, de disponibilité calorique et de démographie sont calculées par le modèle et ne constituent pas des projections démographiques ou sanitaires validées.'
  },
  {
    year: 2075,
    category: 'energy',
    title: 'La Falaise de l\'EROI sous 6:1',
    description: 'Sortie conditionnelle du modèle CLIMATOPEDY. La relation entre extraction et EROI dépend des paramètres du simulateur; elle ne constitue pas une prévision du rendement futur des hydrocarbures.'
  },
  {
    year: 2090,
    category: 'human',
    title: 'Régression Démographique & Recomposition Spatiale',
    description: 'Sortie de la simulation CLIMATOPEDY pour le scénario et les paramètres sélectionnés. Les valeurs démographiques et alimentaires ne sont pas des projections validées par le GIEC.'
  },
  {
    year: 2100,
    category: 'climate',
    title: 'Clôture du XXIe Siècle & Bilan AR6 (Divergence 1,4°C vs 4,3°C)',
    description: 'En trajectoire fossile, l\'épuisement des réserves de pétrole et de gaz scelle le réchauffement autour de +4.3°C. En sobriété, l\'anomalie est stabilisée à +1.4°C. Montée marine : 85 cm à 1 mètre.'
  },
  {
    year: 2125,
    category: 'climate',
    title: 'Inertie Abyssale Océanique & Hausse Séculaire du Niveau Marin',
    description: 'Même si les émissions nettes s\'épuisent, l\'océan profond continue d\'absorber la chaleur accumulée (Fox-Kemper et al. 2021). L\'élévation marine franchit +1.5 m en trajectoire fossile (+0.8 m en sobriété).'
  },
  {
    year: 2150,
    category: 'climate',
    title: 'Fonte Engagée des Calottes Polaires (Groenland & WAIS)',
    description: 'Les valeurs affichées sont des résultats du scénario CLIMATOPEDY. Le GIEC évalue une élévation du niveau marin dépendante des émissions et de l\'horizon; cette sortie ne représente pas une projection officielle de fonte des calottes.'
  },
  {
    year: 2175,
    category: 'agri',
    title: 'Recomposition Radicale des Biomes & Verdissement Boréal',
    description: 'La toundra arctique dégèle en profondeur et se boise (« verdissement arctique »), tandis que les marges sud de la taïga subissent mégafeux et dépérissement. L\'agriculture se replie vers les hautes latitudes (Burke et al. 2018 PNAS).'
  },
  {
    year: 2200,
    category: 'human',
    title: 'Horizon 2200 : Nouvel Équilibre Biophysique Post-Anthropocène',
    description: 'Résultats de simulation CLIMATOPEDY pour l\'horizon 2200. Température, niveau marin et population sont conditionnels aux paramètres du modèle et ne sont pas des projections officielles du GIEC ou de l\'ONU.'
  }
];

export const SCENARIO_BAU: SimulationScenarioConfig = {
  id: 'bau',
  name: 'Scénario CLIMATOPEDY à très fortes émissions (inspiré de SSP5-8.5)',
  shortName: 'Scénario Actuel',
  tagline: 'Rigidité sociétale, extraction fossile continue et absence de sobriété',
  description: 'Scénario interne au simulateur, conditionnel à ses paramètres de demande énergétique, de réserves et d\'usage des engrais. Il ne représente pas une prédiction certaine ni SSP5-8.5 dans son ensemble.',
  badgeColor: 'border-sky-500/40 bg-sky-950/40 text-sky-300',
  lineColor: '#38bdf8',
  dashArray: 'none',
  oilDemandReductionRate: 0,
  agroEcologyAdoptionRate: 0,
  adaptationResilienceBoost: 1.0,
  climateSensitivityECS: 3.0,
  ultimateReservesQinf: 2.80e12
};

export const SCENARIO_SOBRIETY: SimulationScenarioConfig = {
  id: 'sobriety',
  name: 'Scénario de Sobriété & Redirection Écologique',
  shortName: 'Sobriété & Agroécologie',
  tagline: 'Descente énergétique choisie (-4%/an), autonomie azotée et résilience collective',
  description: 'Scénario interne au simulateur avec une baisse paramétrée de l\'extraction et des changements d\'intrants agricoles. Les résultats sont conditionnels à ces paramètres et ne constituent pas une projection validée.',
  badgeColor: 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300',
  lineColor: '#10b981',
  dashArray: '5 3',
  oilDemandReductionRate: 4.0,
  agroEcologyAdoptionRate: 65,
  adaptationResilienceBoost: 1.8,
  climateSensitivityECS: 3.0,
  ultimateReservesQinf: 2.80e12
};

export const SCENARIO_DELAYED: SimulationScenarioConfig = {
  id: 'delayed',
  name: 'Scénario CLIMATOPEDY intermédiaire (comparaison avec SSP2-4.5)',
  shortName: 'Transition Modérée',
  tagline: 'Réduction partielle de la demande (-1.8%/an) et adaptation intermédiaire',
  description: 'Politique de compromis : amorce de sobriété plus tardive et limitée (-1.8%/an), recours partiel à l\'agroécologie (30%), investissements modestes dans la résilience urbaine.',
  badgeColor: 'border-amber-500/50 bg-amber-950/40 text-amber-300',
  lineColor: '#f59e0b',
  dashArray: '4 4',
  oilDemandReductionRate: 1.8,
  agroEcologyAdoptionRate: 30,
  adaptationResilienceBoost: 1.3,
  climateSensitivityECS: 3.0,
  ultimateReservesQinf: 2.80e12
};

export const PRESET_SCENARIOS: SimulationScenarioConfig[] = [
  SCENARIO_BAU,
  SCENARIO_SOBRIETY,
  SCENARIO_DELAYED
];

/**
 * Génère la trajectoire temporelle complète 1900-2200 pas à pas (annuelle)
 * Intègre la série historique réelle (1900-2025) et la projection biophysique (2026-2200)
 */
export function generateFullTrajectory(
  configOrStartYear?: SimulationScenarioConfig | number,
  secondArg?: SimulationScenarioConfig | number,
  targetEndYear: number = 2200
): GlobalBiophysicalState[] {
  let startYear = 1900;
  let scenarioConfig: SimulationScenarioConfig = SCENARIO_BAU;
  let endYear = targetEndYear;

  if (typeof configOrStartYear === 'number') {
    startYear = configOrStartYear;
    if (secondArg && typeof secondArg === 'object') {
      scenarioConfig = secondArg;
    }
  } else if (configOrStartYear && typeof configOrStartYear === 'object') {
    scenarioConfig = configOrStartYear;
    if (typeof secondArg === 'number') {
      startYear = secondArg;
    }
  }

  const trajectory: GlobalBiophysicalState[] = [];

  // 1. Période historique 1900 à 2025 (identique pour tous les scénarios car déjà passée)
  if (startYear <= 1900) {
    for (let yr = 1900; yr < 2026; yr++) {
      trajectory.push(generateHistoricalState(yr));
    }
  }

  // 2. Point de référence 2026 (Présent calibré)
  let state = initializeSimulationState(scenarioConfig);
  trajectory.push(state);

  // 3. Projection prospective 2026 à 2200 modulée selon le scénario biophysique
  const dt = 1.0;
  const steps = endYear - 2026;

  for (let s = 0; s < steps; s++) {
    state = stepSimulation(state, dt, scenarioConfig);
    trajectory.push(state);
  }

  return trajectory;
}

