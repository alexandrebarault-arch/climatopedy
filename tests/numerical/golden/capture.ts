import { calculateEroiAndNetEnergy, initializeSimulationState, stepSimulation } from '../../../src/engine/physicsModel.ts';

export function captureGoldenSubset() {
  const initial = initializeSimulationState();
  const step = stepSimulation(initial, 1);
  return {
    initial: {
      year: initial.year,
      worldPopulation: initial.worldPopulation,
      currentEroi: initial.currentEroi,
      netEnergyRatio: initial.netEnergyRatio
    },
    step: {
      year: step.year,
      worldPopulation: step.worldPopulation,
      atmosphericCo2Ppm: step.atmosphericCo2Ppm,
      currentEroi: step.currentEroi,
      globalAverageCaloriesPerCapita: step.globalAverageCaloriesPerCapita,
      france: step.countries.fra
    },
    vector: calculateEroiAndNetEnergy(1.45e12)
  };
}
