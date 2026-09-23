import { COUNTRIES_DATA } from '../data/countriesData';
import {
  CountryDynamicState,
  GlobalBiophysicalState,
  MortalityCauses,
  DemographicCohorts
} from '../types/simulation';

// Constantes FaIR (Finite Amplitude Impulse Response) CMIP6
export const FAIR_A_POOLS = [0.2173, 0.2240, 0.2838, 0.2749];
export const FAIR_TAU_POOLS = [1.0e6, 394.4, 36.54, 4.304]; // Années

// Paramètres thermiques deux couches
export const C_TH1 = 8.2;   // Capacité thermique atmosphère + océan supérieur (W·an·m⁻²·°C⁻¹)
export const C_TH2 = 105.0; // Capacité thermique océan profond (W·an·m⁻²·°C⁻¹)
export const LAMBDA_FEEDBACK = 1.13; // Paramètre de rétroaction (W·m⁻²·°C⁻¹)
export const GAMMA_HEAT_EXCH = 0.73; // Échange thermique couches (W·m⁻²·°C⁻¹)

// Paramètres élévation marine (Vermeer & Rahmstorf 2009)
export const SL_A = 0.0034;  // m·an⁻¹·°C⁻¹
export const SL_B = 0.0180;  // m·°C⁻¹
export const SL_T0 = -0.5;   // °C

// Paramètres EROI et réserves pétrolières
export const EROI_INITIAL = 32.0;
export const Q_INF_BARRELS = 2.80e12; // Réserves ultimes récupérables (2800 Mds de barils)
export const Q_2026_CUMUL = 1.45e12;  // Déjà extraits en 2026 (~1450 Mds de barils)
export const EROI_EXPONENT_BETA = 1.35;

/**
 * Calcule la température au thermomètre mouillé de Roland Stull (2011)
 * Validité: Ta [-20..50°C], RH [5..99%]. Formule analytique en radians.
 */
export function calculateWetBulbStull(ta: number, rh: number): number {
  const boundedRh = Math.min(99, Math.max(5, rh));
  const boundedTa = Math.min(55, Math.max(-25, ta));

  const term1 = boundedTa * Math.atan(0.151977 * Math.sqrt(boundedRh + 8.313659));
  const term2 = Math.atan(boundedTa + boundedRh);
  const term3 = Math.atan(boundedRh - 1.676331);
  const term4 = 0.00391838 * Math.pow(boundedRh, 1.5) * Math.atan(0.023101 * boundedRh);
  const term5 = -4.686035;

  return term1 + term2 - term3 + term4 + term5;
}

/**
 * Calcule l'EROI au stade final et la fraction d'énergie nette disponible
 */
export function calculateEroiAndNetEnergy(cumulExtracted: number) {
  const depletionRatio = Math.min(0.96, cumulExtracted / Q_INF_BARRELS);
  const currentEroi = Math.max(1.05, EROI_INITIAL * Math.pow(1.0 - depletionRatio, EROI_EXPONENT_BETA));
  const netEnergyRatio = Math.max(0.01, 1.0 - (1.0 / currentEroi));
  return { currentEroi, netEnergyRatio };
}

/**
 * Initialise l'état biophysique complet pour l'année 2026
 */
export function initializeSimulationState(): GlobalBiophysicalState {
  // Concentrations et réservoirs initiaux 2026
  // CO2 atmosphérique mesuré en 2026 : ~424.0 ppm (NOAA Mauna Loa)
  // Réservoirs FaIR étalonnés sur l'excédent historique (~146.0 ppm excédent * 2.123 GtC/ppm = 310 GtC)
  const initialPools: [number, number, number, number] = [135.0, 95.0, 62.0, 18.0];
  const initialCumulativeEmissions = 690.0; // GtC depuis 1750
  const initialCo2 = 278.0 + (initialPools.reduce((a, b) => a + b, 0) / 2.123);
  const initialT1 = 1.35; // Anomalie thermique globale en 2026 (°C par rapport à 1850-1900)
  const initialT2 = 0.55; // Océan profond
  const initialSeaLevel = 0.12; // Mètres depuis 2000

  const { currentEroi, netEnergyRatio } = calculateEroiAndNetEnergy(Q_2026_CUMUL);

  const initialCountries: Record<string, CountryDynamicState> = {};
  let totalWorldPop = 0;

  COUNTRIES_DATA.forEach(c => {
    const p0 = c.basePop2026 * c.baseCohortSplit[0];
    const p1 = c.basePop2026 * c.baseCohortSplit[1];
    const p2 = c.basePop2026 * c.baseCohortSplit[2];
    totalWorldPop += c.basePop2026;

    // À l'année de base 2026, les températures de base de countriesData reflètent fidèlement le climat présent
    const dryBulb = c.baseTemp;
    const summerMax = c.summerMaxTemp;
    const wetBulb = calculateWetBulbStull(dryBulb, c.baseHumidity);
    // Calcul rigoureux de Roland Stull (2011) sur les canicules estivales observables aujourd'hui (2026)
    const wetBulbPeak = calculateWetBulbStull(summerMax, c.summerHumidity);

    const cohorts: DemographicCohorts = { p0, p1, p2, total: c.basePop2026 };
    const baseMortalityRate = c.baseMortality / 1000.0; // En taux unitaire

    const annualDeaths: MortalityCauses = {
      base: c.basePop2026 * baseMortalityRate,
      thermal: 0.0005 * c.basePop2026,
      famine: 0.001 * c.basePop2026,
      sanitary: 0.0005 * c.basePop2026,
      total: c.basePop2026 * (baseMortalityRate + 0.002)
    };

    initialCountries[c.id] = {
      id: c.id,
      cohorts,
      dryBulbTemp: dryBulb,
      summerMaxTemp: summerMax,
      summerHumidity: c.summerHumidity,
      wetBulbTemp: wetBulb,
      wetBulbPeak,
      cropYieldFactor: 1.0,
      calPerCapita: c.baseCaloriesDay,
      calDeficitPct: 0,
      mortalityRates: {
        base: baseMortalityRate,
        thermal: 0.0005,
        famine: 0.001,
        sanitary: 0.0005,
        total: baseMortalityRate + 0.002
      },
      annualDeaths,
      annualBirths: p1 * 0.49 * (c.baseFertility / 30.0),
      fertilityActual: c.baseFertility,
      pushFactor: 0.05,
      netMigration: 0,
      borderClosure: 0.15,
      floodedArablePct: c.coastalExposureScore * 0.02
    };
  });

  return {
    year: 2026,
    carbonPools: initialPools,
    cumulativeEmissions: initialCumulativeEmissions,
    atmosphericCo2Ppm: initialCo2,
    radiativeForcing: 5.35 * Math.log(initialCo2 / 278.0) + 0.85,
    surfaceTemperatureAnomaly: initialT1,
    deepOceanTemperatureAnomaly: initialT2,
    seaLevelRiseMeters: initialSeaLevel,
    oilCumulativeBarrels: Q_2026_CUMUL,
    oilAnnualExtraction: 36.5e9, // ~100 millions de barils / jour
    currentEroi,
    netEnergyRatio,
    industrialCapitalIndex: 1.0,
    haberBoschNitrogenFactor: 1.0,
    worldPopulation: totalWorldPop,
    worldBirthsAnnual: 133, // Millions
    worldDeathsAnnual: {
      base: 58,
      thermal: 0.5,
      famine: 1.2,
      sanitary: 0.8,
      total: 60.5
    },
    globalCropYieldComposite: 1.0,
    globalAverageCaloriesPerCapita: 2950,
    activeClimateRefugees: 3.5,
    countries: initialCountries
  };
}

/**
 * Exécute un pas temporel complet de simulation d'une durée dt (ex: 0.2 an ou 1.0 an)
 */
export function stepSimulation(currentState: GlobalBiophysicalState, dt: number): GlobalBiophysicalState {
  const next = structuredClone(currentState);
  next.year += dt;

  // 1. DYNAMIQUE ÉNERGÉTIQUE & EXTRACTION INDUSTRIELLE
  // La demande énergétique est guidée par la population active et le capital physique
  const globalActivePop = Object.values(next.countries).reduce((acc, c) => acc + c.cohorts.p1, 0);
  const baselineActive = 5200; // Millions en 2026
  const capitalDamping = Math.min(1.2, Math.max(0.2, next.industrialCapitalIndex));
  
  // L'inertie sociétale maintient le besoin de forer et de consommer du brut
  const targetExtraction = 36.5e9 * (globalActivePop / baselineActive) * capitalDamping * Math.pow(next.netEnergyRatio, 0.4);
  next.oilAnnualExtraction = targetExtraction;
  next.oilCumulativeBarrels += targetExtraction * dt;

  // Mise à jour de l'EROI et de l'énergie nette
  const { currentEroi, netEnergyRatio } = calculateEroiAndNetEnergy(next.oilCumulativeBarrels);
  next.currentEroi = currentEroi;
  next.netEnergyRatio = netEnergyRatio;

  // Dépréciation ou maintien du capital industriel (cannibalisme énergétique)
  // Lorsque l'EROI chute sous 12:1, le secteur extractif consomme le métal et les machines
  const capitalErosionRate = currentEroi < 10.0 ? (10.0 - currentEroi) * 0.012 : 0;
  next.industrialCapitalIndex = Math.max(0.25, next.industrialCapitalIndex * (1 - capitalErosionRate * dt));

  // Disponibilité de la synthèse Haber-Bosch (méthane + électricité + réacteurs haute pression)
  // Fortement corrélée à l'énergie nette et au capital
  next.haberBoschNitrogenFactor = Math.max(0.20, Math.pow(netEnergyRatio / 0.968, 0.65) * Math.pow(next.industrialCapitalIndex, 0.4));

  // 2. ÉMISSIONS & CYCLE DU CARBONE FaIR
  // Émissions fossiles annuelles (pétrole + charbon + gaz)
  const emissionsFossilOil = (next.oilAnnualExtraction * 1.15e-10); // ~4.2 GtC/an pour le pétrole
  const emissionsGasCoal = 5.8 * (netEnergyRatio / 0.968) * next.industrialCapitalIndex; // Gaz + Charbon
  const totalAnnualGtC = emissionsFossilOil + emissionsGasCoal;
  
  // Équation FaIR avec ralentissement par saturation des puits de carbone
  const sumPools = next.carbonPools.reduce((a, b) => a + b, 0);
  const cAcc = next.cumulativeEmissions - sumPools;
  const tGlobal = next.surfaceTemperatureAnomaly;
  
  // Facteur non-linéaire alpha d'essoufflement des puits (océans saturés, réchauffement)
  const alpha = Math.exp((0.00032 * cAcc + 0.019 * tGlobal) / 0.20);

  const updatedPools: [number, number, number, number] = [0, 0, 0, 0];
  for (let i = 0; i < 4; i++) {
    const drDt = FAIR_A_POOLS[i] * totalAnnualGtC - (next.carbonPools[i] / (alpha * FAIR_TAU_POOLS[i]));
    updatedPools[i] = Math.max(0, next.carbonPools[i] + drDt * dt);
  }
  next.carbonPools = updatedPools;
  next.cumulativeEmissions += totalAnnualGtC * dt;

  // Concentration atmosphérique de CO2 (2.123 GtC par ppm)
  const newCo2 = 278.0 + (next.carbonPools.reduce((a, b) => a + b, 0) / 2.123);
  next.atmosphericCo2Ppm = newCo2;

  // 3. FORÇAGE RADIATIF & MODÈLE THERMIQUE DEUX COUCHES
  const forcingCo2 = 5.35 * Math.log(newCo2 / 278.0);
  // Forçages auxiliaires (CH4 dégel pergélisol + N2O engrais + aérosols industriels décroissants)
  const permafrostFeedbackForcing = Math.max(0, (tGlobal - 1.5) * 0.18);
  const forcingTotal = forcingCo2 + 0.85 + permafrostFeedbackForcing;
  next.radiativeForcing = forcingTotal;

  const t1 = next.surfaceTemperatureAnomaly;
  const t2 = next.deepOceanTemperatureAnomaly;

  const dt1_dt = (forcingTotal - LAMBDA_FEEDBACK * t1 - GAMMA_HEAT_EXCH * (t1 - t2)) / C_TH1;
  const dt2_dt = (GAMMA_HEAT_EXCH * (t1 - t2)) / C_TH2;

  next.surfaceTemperatureAnomaly += dt1_dt * dt;
  next.deepOceanTemperatureAnomaly += dt2_dt * dt;

  // 4. ÉLÉVATION MARINE (Vermeer & Rahmstorf 2009)
  const dsl_dt = SL_A * (next.surfaceTemperatureAnomaly - SL_T0) + SL_B * dt1_dt;
  next.seaLevelRiseMeters += dsl_dt * dt;

  // 5. INTÉGRATION SPATIALISÉE PAR PAYS
  let totalWorldDeaths: MortalityCauses = { base: 0, thermal: 0, famine: 0, sanitary: 0, total: 0 };
  let totalWorldBirths = 0;
  let totalWorldPopulation = 0;
  let weightedCaloriesSum = 0;
  let weightedCropYieldSum = 0;
  let totalClimateRefugees = 0;

  // Facteurs de dégradation thermique des 4 céréales (Zhao et al. 2017)
  const BETA_MAIZE = 0.074; // -7.4% par °C
  const BETA_WHEAT = 0.060; // -6.0% par °C
  const BETA_RICE  = 0.032; // -3.2% par °C
  const BETA_SOY   = 0.031; // -3.1% par °C

  // Calcul préliminaire des push factors pour les migrations
  const countryPushFactors: Record<string, number> = {};

  COUNTRIES_DATA.forEach(staticC => {
    const cState = next.countries[staticC.id];
    
    // Réchauffement additionnel par rapport à l'année de départ 2026 (anomalie globale T1 - 1.35°C)
    const deltaTGlobalFrom2026 = Math.max(0, next.surfaceTemperatureAnomaly - 1.35);

    // Descente d'échelle thermique locale (température moyenne annuelle)
    const localDryBulb = staticC.baseTemp + deltaTGlobalFrom2026 * staticC.patternScaling;
    cState.dryBulbTemp = localDryBulb;

    // Descente d'échelle du pic caniculaire estival sous abri (amplification des extrêmes continentaux x1.15)
    const localSummerMax = staticC.summerMaxTemp + deltaTGlobalFrom2026 * staticC.patternScaling * 1.15;
    cState.summerMaxTemp = localSummerMax;
    cState.summerHumidity = staticC.summerHumidity;

    // Calcul de la température humide moyenne annuelle
    const localWetBulb = calculateWetBulbStull(localDryBulb, staticC.baseHumidity);
    cState.wetBulbTemp = localWetBulb;

    // Calcul rigoureux de Roland Stull (2011) lors du pic caniculaire estival
    cState.wetBulbPeak = calculateWetBulbStull(localSummerMax, staticC.summerHumidity);

    // Perte surfacique côtière due au niveau marin (deltas, plaines rizicoles)
    cState.floodedArablePct = Math.min(0.35, staticC.coastalExposureScore * (next.seaLevelRiseMeters * 0.18));

    // Dégradation thermique des cultures régionales (Zhao et al. 2017)
    const deltaTLocal = deltaTGlobalFrom2026 * staticC.patternScaling;
    const mix = staticC.cropMix;
    const thermalCropLoss = 
      (mix.maize * BETA_MAIZE + mix.wheat * BETA_WHEAT + mix.rice * BETA_RICE + mix.soy * BETA_SOY) * deltaTLocal;
    
    // Facteur d'intrants matériels et énergétiques (traction diesel + engrais Haber-Bosch)
    const inputsFactor = Math.pow(next.netEnergyRatio / 0.968, 0.65) * Math.pow(next.haberBoschNitrogenFactor, 0.35);
    
    // Rendement net tenant compte du climat, de la perte des terres côtières et des intrants
    const compositeCropYield = Math.max(0.12, (1.0 - thermalCropLoss) * (1.0 - cState.floodedArablePct) * inputsFactor);
    cState.cropYieldFactor = compositeCropYield;

    // Production calorique et sécurité alimentaire
    const totalPop = cState.cohorts.p0 + cState.cohorts.p1 + cState.cohorts.p2;
    const initialPop = staticC.basePop2026;
    const popRatio = Math.max(0.01, totalPop / initialPop);
    
    // La production agricole dépend du rendement et de la main-d'œuvre/traction disponible
    const laborAvailability = Math.min(1.0, Math.pow(popRatio, 0.5));
    const regionalFoodProduction = staticC.basePop2026 * staticC.baseCaloriesDay * compositeCropYield * laborAvailability;
    const rawCalPerCapita = regionalFoodProduction / Math.max(0.01, totalPop);
    // Plafond physiologique pour éviter les artefacts de surconsommation lors des chocs démographiques
    const currentCalPerCapita = Math.min(3500, Math.max(400, rawCalPerCapita));
    cState.calPerCapita = currentCalPerCapita;
    cState.calDeficitPct = Math.max(0, Math.min(100, ((2100 - currentCalPerCapita) / 2100) * 100));

    // SURMORTALITÉS NON-LINÉAIRES
    // 1. Chaleur humide létale : émergence au-delà du seuil critique de Roland Stull Tw
    // Amortie temporairement par les infrastructures si le pays a une haute résilience ET une énergie nette suffisante
    const activeResilience = staticC.resilienceIndex * Math.pow(next.netEnergyRatio, 0.8);
    const effectiveTwPeak = cState.wetBulbPeak - (activeResilience * 2.0);
    let muThermal = 0;
    if (effectiveTwPeak >= 30.5) {
      muThermal = 0.35 / (1.0 + Math.exp(-2.2 * (effectiveTwPeak - 31.8)));
    } else if (effectiveTwPeak >= 29.5) {
      muThermal = 0.0015 * ((effectiveTwPeak - 29.5) / 1.0);
    }

    // 2. Famines & Sous-nutrition : fonction quadratique du déficit calorique
    const calorieDeficitFraction = Math.max(0, 1.0 - (currentCalPerCapita / 2100.0));
    const muFamine = 0.42 * Math.pow(calorieDeficitFraction, 2.0);

    // 3. Dégradation sanitaire (manque de désinfection de l'eau, pièces détachées médicales, antibiotiques)
    const energyShortage = Math.max(0, 1.0 - (next.netEnergyRatio / 0.968));
    const muSanitary = (staticC.baseMortality / 1000.0) * 0.45 * Math.pow(energyShortage, 1.5) * (1.0 - activeResilience * 0.5);

    // 4. Mortalité de base
    const muBase = staticC.baseMortality / 1000.0;
    const muTotal = muBase + muThermal + muFamine + muSanitary;

    cState.mortalityRates = {
      base: muBase,
      thermal: muThermal,
      famine: muFamine,
      sanitary: muSanitary,
      total: muTotal
    };

    // Nombre absolu de décès par cause
    cState.annualDeaths = {
      base: totalPop * muBase,
      thermal: totalPop * muThermal,
      famine: totalPop * muFamine,
      sanitary: totalPop * muSanitary,
      total: totalPop * muTotal
    };

    // FERTILITÉ & NAISSANCES
    // Le stress calorique et la chaleur humide altèrent directement la fertilité biologique
    const biophysicalStress = Math.max(0.15, 1.0 - (muThermal * 2.2) - Math.sqrt(muFamine));
    cState.fertilityActual = Math.max(0.4, staticC.baseFertility * biophysicalStress);
    cState.annualBirths = cState.cohorts.p1 * 0.49 * (cState.fertilityActual / 30.0);

    // Calcul du Push Factor pour les migrations internationales
    const push = 
      (effectiveTwPeak > 31.0 ? 0.45 : 0) +
      calorieDeficitFraction * 0.40 +
      cState.floodedArablePct * 0.15;
    countryPushFactors[staticC.id] = push;
    cState.pushFactor = push;

    // Fermeture progressive des frontières géopolitiques (militarisation)
    const yearElapsed = next.year - 2026;
    cState.borderClosure = Math.min(0.98, 0.15 + (yearElapsed * 0.016) + (push > 0.3 ? 0.2 : 0));
  });

  // 6. MODÈLE GRAVITATIONNEL DE MIGRATION & RÉSISTANCE FRONTALIÈRE
  COUNTRIES_DATA.forEach(originC => {
    const oState = next.countries[originC.id];
    const pushOrigin = countryPushFactors[originC.id];
    let netMigr = 0;

    if (pushOrigin > 0.10) {
      // Les populations fuient vers les zones plus tempérées ou moins affamées
      const potentialMigrants = oState.cohorts.p1 * pushOrigin * 0.04; // Fraction mobile
      totalClimateRefugees += potentialMigrants;

      COUNTRIES_DATA.forEach(destC => {
        if (originC.id === destC.id) return;
        const dState = next.countries[destC.id];
        const pushDest = countryPushFactors[destC.id];

        // Attractivité relative si le pays de destination est plus vivable
        if (pushDest < pushOrigin) {
          const deltaHabitability = pushOrigin - pushDest;
          // Résistance frontalière (barbelés, marine côtière, visas verrouillés)
          const passThroughRate = 1.0 - dState.borderClosure;
          const acceptedFlow = (potentialMigrants * deltaHabitability * 0.25) * passThroughRate;
          netMigr -= acceptedFlow;
          dState.cohorts.p1 += acceptedFlow * dt; // Arrivée dans la cohorte active
        }
      });
    }
    oState.netMigration = netMigr;
  });

  // 7. TRANSITION DES COHORTES DÉMOGRAPHIQUES (EULER)
  COUNTRIES_DATA.forEach(c => {
    const cState = next.countries[c.id];
    const { p0, p1, p2 } = cState.cohorts;
    const mu = cState.mortalityRates.total;

    // dp0/dt = Naissances - passage à p1 (15 ans) - décès
    const dp0 = (cState.annualBirths - (p0 / 15.0) - p0 * mu) * dt;
    // dp1/dt = arrivée de p0 - passage à p2 (50 ans) - décès + solde migratoire
    const dp1 = ((p0 / 15.0) - (p1 / 50.0) - p1 * mu + cState.netMigration) * dt;
    // dp2/dt = arrivée de p1 - décès seniors (mortalité accentuée 1.4x)
    const dp2 = ((p1 / 50.0) - p2 * (mu * 1.4)) * dt;

    cState.cohorts.p0 = Math.max(0, p0 + dp0);
    cState.cohorts.p1 = Math.max(0, p1 + dp1);
    cState.cohorts.p2 = Math.max(0, p2 + dp2);
    cState.cohorts.total = cState.cohorts.p0 + cState.cohorts.p1 + cState.cohorts.p2;

    // Agrégations mondiales
    totalWorldPopulation += cState.cohorts.total;
    totalWorldBirths += cState.annualBirths;
    totalWorldDeaths.base += cState.annualDeaths.base;
    totalWorldDeaths.thermal += cState.annualDeaths.thermal;
    totalWorldDeaths.famine += cState.annualDeaths.famine;
    totalWorldDeaths.sanitary += cState.annualDeaths.sanitary;
    totalWorldDeaths.total += cState.annualDeaths.total;

    weightedCaloriesSum += cState.calPerCapita * cState.cohorts.total;
    weightedCropYieldSum += cState.cropYieldFactor * cState.cohorts.total;
  });

  next.worldPopulation = totalWorldPopulation;
  next.worldBirthsAnnual = totalWorldBirths;
  next.worldDeathsAnnual = totalWorldDeaths;
  next.globalCropYieldComposite = totalWorldPopulation > 0 ? weightedCropYieldSum / totalWorldPopulation : 0;
  next.globalAverageCaloriesPerCapita = totalWorldPopulation > 0 ? weightedCaloriesSum / totalWorldPopulation : 0;
  next.activeClimateRefugees = totalClimateRefugees;

  return next;
}
