import React, { useState, useMemo } from 'react';
import {
  Thermometer,
  Users,
  Droplets,
  HeartPulse,
  Wheat,
  Waves,
  Zap,
  AlertTriangle,
  Sparkles,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Scale,
  Info
} from 'lucide-react';
import { GlobalBiophysicalState, SimulationScenarioConfig } from '../types/simulation';
import { TechTooltip } from './TechTooltip';

interface ComparativeDashboardViewProps {
  scenarioA: SimulationScenarioConfig;
  scenarioB: SimulationScenarioConfig;
  trajectoryA: GlobalBiophysicalState[];
  trajectoryB: GlobalBiophysicalState[];
  currentYear: number;
  onSeekYear: (year: number) => void;
  onSelectScenarioB?: (scenario: SimulationScenarioConfig) => void;
}

export const ComparativeDashboardView: React.FC<ComparativeDashboardViewProps> = ({
  scenarioA,
  scenarioB,
  trajectoryA,
  trajectoryB,
  currentYear,
  onSeekYear
}) => {
  // Année d'évaluation sélectionnée pour les cartes d'impact
  const [horizonYear, setHorizonYear] = useState<number>(2100);

  // Filtre de secteur
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'climate' | 'demography' | 'food_water' | 'energy'>('all');

  // États au point d'horizon choisi
  const stateA = useMemo(() => {
    return trajectoryA.find((t) => t.year === horizonYear) || trajectoryA[trajectoryA.length - 1];
  }, [trajectoryA, horizonYear]);

  const stateB = useMemo(() => {
    return trajectoryB.find((t) => t.year === horizonYear) || trajectoryB[trajectoryB.length - 1];
  }, [trajectoryB, horizonYear]);

  // États pour l'année 2100 repère
  const state2100A = useMemo(() => trajectoryA.find((t) => t.year === 2100) || trajectoryA[trajectoryA.length - 1], [trajectoryA]);
  const state2100B = useMemo(() => trajectoryB.find((t) => t.year === 2100) || trajectoryB[trajectoryB.length - 1], [trajectoryB]);

  // Calculs cumulatifs sur 2026 -> horizonYear
  const cumulativeStats = useMemo(() => {
    let cumDeathsA = 0;
    let cumDeathsB = 0;
    let cumThermalA = 0;
    let cumThermalB = 0;
    let cumFamineA = 0;
    let cumFamineB = 0;

    const maxYear = Math.min(horizonYear, 2200);
    for (let y = 2026; y <= maxYear; y++) {
      const sA = trajectoryA.find((t) => t.year === y);
      const sB = trajectoryB.find((t) => t.year === y);
      if (sA && sB) {
        cumThermalA += sA.worldDeathsAnnual.thermal;
        cumThermalB += sB.worldDeathsAnnual.thermal;
        cumFamineA += sA.worldDeathsAnnual.famine;
        cumFamineB += sB.worldDeathsAnnual.famine;
        cumDeathsA += (sA.worldDeathsAnnual.thermal + sA.worldDeathsAnnual.famine);
        cumDeathsB += (sB.worldDeathsAnnual.thermal + sB.worldDeathsAnnual.famine);
      }
    }

    const livesSavedMillions = Math.max(0, cumDeathsA - cumDeathsB);
    const thermalLivesSaved = Math.max(0, cumThermalA - cumThermalB);
    const famineLivesSaved = Math.max(0, cumFamineA - cumFamineB);

    return {
      cumDeathsA,
      cumDeathsB,
      livesSavedMillions,
      thermalLivesSaved,
      famineLivesSaved
    };
  }, [trajectoryA, trajectoryB, horizonYear]);

  // Calculs des différentiels détaillés
  const deltaTemp = stateB.surfaceTemperatureAnomaly - stateA.surfaceTemperatureAnomaly;
  const deltaSlrCm = Math.round((stateB.seaLevelRiseMeters - stateA.seaLevelRiseMeters) * 100);
  const deltaCo2Ppm = Math.round(stateB.atmosphericCo2Ppm - stateA.atmosphericCo2Ppm);
  const deltaEroi = stateB.currentEroi - stateA.currentEroi;
  const deltaNetEnergyPct = Math.round((stateB.netEnergyRatio - stateA.netEnergyRatio) * 100);
  const deltaCalories = Math.round(stateB.globalAverageCaloriesPerCapita - stateA.globalAverageCaloriesPerCapita);
  const deltaYieldPct = Math.round((stateB.globalCropYieldComposite - stateA.globalCropYieldComposite) * 100);
  const deltaPopB = (stateB.worldPopulation - stateA.worldPopulation) / 1000;
  const popA_Mds = (stateA.worldPopulation / 1000).toFixed(2);
  const popB_Mds = (stateB.worldPopulation / 1000).toFixed(2);
  const deltaPopMds = deltaPopB >= 0 ? `+${deltaPopB.toFixed(2)}` : deltaPopB.toFixed(2);
  const deltaAnnualDeathsM = (stateA.worldDeathsAnnual.total - stateB.worldDeathsAnnual.total);
  const deltaRefugeesM = (stateA.activeClimateRefugees - stateB.activeClimateRefugees);

  // Estimation du stress hydrique et populations exposées au stress hydrique sévère
  // En physique climatique (IPCC WG2 Ch. 4), la fraction de population mondiale en stress hydrique sévère
  // passe de ~25% à 1.5°C à ~40% à 2.5°C et ~58% à 4°C.
  const waterStressPctA = Math.min(85, Math.round(20 + stateA.surfaceTemperatureAnomaly * 10.5));
  const waterStressPctB = Math.min(85, Math.round(20 + stateB.surfaceTemperatureAnomaly * 10.5));
  const waterStressDeltaPct = waterStressPctB - waterStressPctA;
  const waterStressedPopA_B = ((stateA.worldPopulation * waterStressPctA) / 100 / 1000).toFixed(1);
  const waterStressedPopB_B = ((stateB.worldPopulation * waterStressPctB) / 100 / 1000).toFixed(1);

  // Population vivable dans la zone de confort thermique (Tw pic estival < 31°C)
  // Sous Scénario A à +4.1°C, de vastes zones de l'Inde, Golfe et Sahel dépassent le seuil létal.
  const habitableFractionA = Math.max(0.35, Math.min(0.95, 0.98 - (stateA.surfaceTemperatureAnomaly - 1.2) * 0.16));
  const habitableFractionB = Math.max(0.35, Math.min(0.95, 0.98 - (stateB.surfaceTemperatureAnomaly - 1.2) * 0.16));
  const habitablePopA_Mds = ((stateA.worldPopulation * habitableFractionA) / 1000).toFixed(2);
  const habitablePopB_Mds = ((stateB.worldPopulation * habitableFractionB) / 1000).toFixed(2);
  const gainHabitablePopMds = (((stateB.worldPopulation * habitableFractionB) - (stateA.worldPopulation * habitableFractionA)) / 1000).toFixed(2);

  // Définition structurée des Cartes d'Impact
  const impactCards = [
    {
      id: 'temperature',
      category: 'climate',
      title: 'Écart de Température Globale',
      subtitle: 'Anomalie thermique mondiale vs préindustriel (1850)',
      icon: <Thermometer className="w-5 h-5 text-rose-600" />,
      badge: 'Climat & Atmosphère',
      badgeColor: 'border-rose-300 bg-rose-50 text-rose-800',
      valA: `+${stateA.surfaceTemperatureAnomaly.toFixed(2)} °C`,
      valB: `+${stateB.surfaceTemperatureAnomaly.toFixed(2)} °C`,
      deltaText: `${deltaTemp >= 0 ? '+' : ''}${deltaTemp.toFixed(2)} °C`,
      deltaPositiveIsGood: deltaTemp < 0,
      benefitHeadline: `Réchauffement contenu de ${Math.abs(deltaTemp).toFixed(2)} °C`,
      mechanism: `En réduisant la combustion fossile dès 2027, le forçage radiatif cumulé est bridé, évitant d'activer les rétroactions positives irréversibles de fonte du pergélisol et d'albédo arctique.`,
      scientificRef: 'FaIR v1.1 / GIEC AR6 WG1 SPM',
      tooltipTerm: 'fair'
    },
    {
      id: 'habitable_population',
      category: 'demography',
      title: 'Population sous le seuil Tw du modèle',
      subtitle: 'Population des régions où Tw simulée est sous 31°C',
      icon: <Users className="w-5 h-5 text-emerald-600" />,
      badge: 'Démographie & Survie',
      badgeColor: 'border-emerald-300 bg-emerald-50 text-emerald-800',
      valA: `${habitablePopA_Mds} Mds (${(habitableFractionA * 100).toFixed(0)}% de la pop.)`,
      valB: `${habitablePopB_Mds} Mds (${(habitableFractionB * 100).toFixed(0)}% de la pop.)`,
      deltaText: `+${gainHabitablePopMds} Mds sous le seuil du modèle`,
      deltaPositiveIsGood: true,
      benefitHeadline: `Écart simulé de mortalité : ${cumulativeStats.livesSavedMillions.toFixed(0)} millions d'ici ${horizonYear}`,
      mechanism: `Le modèle compare les populations vivant dans des régions où la température au thermomètre mouillé simulée est inférieure au seuil Tw de 31°C configuré dans CLIMATOPEDY. Ce seuil n'est pas un diagnostic de mortalité ou d'habitabilité.`,
      scientificRef: 'Sherwood & Huber (PNAS 2010) / Raymond et al. (2020)',
      tooltipTerm: 'stull'
    },
    {
      id: 'water_stress',
      category: 'food_water',
      title: 'Stress Hydrique Sévère',
      subtitle: 'Part et nombre de personnes subissant un déficit hydrique critique',
      icon: <Droplets className="w-5 h-5 text-sky-600" />,
      badge: 'Eau & Ressources',
      badgeColor: 'border-sky-300 bg-sky-50 text-sky-800',
      valA: `${waterStressedPopA_B} Mds (${waterStressPctA}% de la pop.)`,
      valB: `${waterStressedPopB_B} Mds (${waterStressPctB}% de la pop.)`,
      deltaText: `${waterStressDeltaPct > 0 ? '+' : ''}${waterStressDeltaPct} points (${Math.abs(Number(waterStressedPopA_B) - Number(waterStressedPopB_B)).toFixed(1)} Mds épargnés)`,
      deltaPositiveIsGood: waterStressDeltaPct < 0,
      benefitHeadline: `Pression hydrique allégée de ${Math.abs(waterStressDeltaPct)} points`,
      mechanism: `La baisse des anomalies thermiques freine l'évapotranspiration des sols, stabilise les cycles de mousson et protège les châteaux d'eau glaciaires (Himalaya, Andes, Alpes).`,
      scientificRef: 'GIEC AR6 WG2 Chapitre 4 (Water Security)'
    },
    {
      id: 'caloric_security',
      category: 'food_water',
      title: 'Sécurité Alimentaire & Calories',
      subtitle: 'Apport calorique moyen par habitant et rendements céréaliers',
      icon: <Wheat className="w-5 h-5 text-amber-600" />,
      badge: 'Alimentation & Agriculture',
      badgeColor: 'border-amber-300 bg-amber-50 text-amber-900',
      valA: `${Math.round(stateA.globalAverageCaloriesPerCapita)} kcal/j (${(stateA.globalCropYieldComposite * 100).toFixed(0)}%)`,
      valB: `${Math.round(stateB.globalAverageCaloriesPerCapita)} kcal/j (${(stateB.globalCropYieldComposite * 100).toFixed(0)}%)`,
      deltaText: `${deltaCalories >= 0 ? '+' : ''}${deltaCalories} kcal/j (${deltaYieldPct >= 0 ? '+' : ''}${deltaYieldPct} pts rendement)`,
      deltaPositiveIsGood: deltaCalories > 0,
      benefitHeadline: `Apport calorique simulé : ${Math.round(stateA.globalAverageCaloriesPerCapita)} vs ${Math.round(stateB.globalAverageCaloriesPerCapita)} kcal/habitant/jour`,
      mechanism: `Les apports et rendements affichés sont calculés à partir des paramètres agricoles et énergétiques de CLIMATOPEDY; ils ne constituent pas une prévision validée de sécurité alimentaire.`,
      scientificRef: 'Zhao et al. (PNAS 2017) / Erisman et al. (Nature Geo 2008)',
      tooltipTerm: 'haber-bosch'
    },
    {
      id: 'sea_level',
      category: 'climate',
      title: 'Élévation Séculaire des Mers',
      subtitle: 'Montée du niveau moyen des océans et submersion côtière',
      icon: <Waves className="w-5 h-5 text-blue-600" />,
      badge: 'Océans & Littoraux',
      badgeColor: 'border-blue-300 bg-blue-50 text-blue-800',
      valA: `+${Math.round(stateA.seaLevelRiseMeters * 100)} cm`,
      valB: `+${Math.round(stateB.seaLevelRiseMeters * 100)} cm`,
      deltaText: `${deltaSlrCm >= 0 ? '+' : ''}${deltaSlrCm} cm (${Math.abs(deltaSlrCm)} cm épargnés)`,
      deltaPositiveIsGood: deltaSlrCm < 0,
      benefitHeadline: `Écart simulé du niveau marin : ${Math.abs(deltaSlrCm)} cm en ${horizonYear}`,
      mechanism: `Cette valeur est une sortie du modèle CLIMATOPEDY. Le GIEC publie des plages de projection dépendant des émissions, de l'horizon et de la période de référence.`,
      scientificRef: 'Vermeer & Rahmstorf (2009) / GIEC AR6 Ch. 9',
      tooltipTerm: 'slr'
    },
    {
      id: 'energy_resilience',
      category: 'energy',
      title: 'Rendement de l\'Énergie (Énergie Nette)',
      subtitle: 'Barils obtenus pour 1 baril dépensé à forer, et énergie utile pour la société',
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      badge: 'Énergie & Métabolisme',
      badgeColor: 'border-amber-300 bg-amber-50 text-amber-900',
      valA: `x${stateA.currentEroi >= 20 ? Math.round(stateA.currentEroi) : stateA.currentEroi.toFixed(1)} (${(stateA.netEnergyRatio * 100).toFixed(0)}% utile)`,
      valB: `x${stateB.currentEroi >= 20 ? Math.round(stateB.currentEroi) : stateB.currentEroi.toFixed(1)} (${(stateB.netEnergyRatio * 100).toFixed(0)}% utile)`,
      deltaText: `${deltaEroi >= 0 ? '+' : ''}${deltaEroi.toFixed(1)} pts de rendement (${deltaNetEnergyPct >= 0 ? '+' : ''}${deltaNetEnergyPct} pts utile)`,
      deltaPositiveIsGood: deltaEroi > 0,
      benefitHeadline: `Écart d'EROI simulé : ${stateA.currentEroi.toFixed(1)} contre ${stateB.currentEroi.toFixed(1)}`,
      mechanism: `Les valeurs d'EROI sont produites par le modèle CLIMATOPEDY selon son paramétrage; leur interprétation dépend du périmètre de calcul.`,
      scientificRef: 'Hall, Lambert & Balogh (Ecol. Econ. 2014)',
      tooltipTerm: 'eroi'
    },
    {
      id: 'climate_refugees',
      category: 'demography',
      title: 'Réfugiés Climatiques & Migrations',
      subtitle: 'Personnes comptabilisées par le modèle CLIMATOPEDY',
      icon: <AlertTriangle className="w-5 h-5 text-purple-600" />,
      badge: 'Stabilité Géopolitique',
      badgeColor: 'border-purple-300 bg-purple-50 text-purple-800',
      valA: `${stateA.activeClimateRefugees.toFixed(1)} M`,
      valB: `${stateB.activeClimateRefugees.toFixed(1)} M`,
      deltaText: `${deltaRefugeesM >= 0 ? '-' : '+'}${Math.abs(deltaRefugeesM).toFixed(1)} M d'exilés`,
      deltaPositiveIsGood: deltaRefugeesM > 0,
      benefitHeadline: `Écart simulé de population déplacée : ${Math.abs(deltaRefugeesM).toFixed(1)} millions`,
      mechanism: `Cette valeur est produite par le modèle CLIMATOPEDY; elle n'est pas une estimation validée des migrations liées au climat.`,
      scientificRef: 'IDMC (Internal Displacement Monitoring Centre) & GIEC AR6 WG2'
    },
    {
      id: 'annual_deaths',
      category: 'demography',
      title: 'Décès annuels simulés',
      subtitle: 'Décès calculés par le modèle selon ses paramètres',
      icon: <HeartPulse className="w-5 h-5 text-rose-600" />,
      badge: 'Santé Publique Mondiale',
      badgeColor: 'border-rose-300 bg-rose-50 text-rose-800',
      valA: `${stateA.worldDeathsAnnual.total.toFixed(1)} M/an`,
      valB: `${stateB.worldDeathsAnnual.total.toFixed(1)} M/an`,
      deltaText: `-${deltaAnnualDeathsM.toFixed(1)} M décès/an en ${horizonYear}`,
      deltaPositiveIsGood: deltaAnnualDeathsM > 0,
      benefitHeadline: `Écart simulé de décès : ${deltaAnnualDeathsM.toFixed(1)} millions/an`,
      mechanism: `Cette comparaison de mortalité est une sortie de CLIMATOPEDY; le modèle n'est pas validé comme estimateur de décès attribuables au climat ou à l'alimentation.`,
      scientificRef: 'The Lancet Countdown on Health and Climate Change'
    }
  ];

  // Filtrage des cartes
  const filteredCards = impactCards.filter((c) => {
    if (categoryFilter === 'all') return true;
    return c.category === categoryFilter;
  });

  return (
    <div className="space-y-6 text-slate-700">
      {/* 1. En-tête héroïque du Dashboard Comparatif */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs relative overflow-hidden">
        {/* Glow décoratif d'arrière-plan */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-sky-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
                <Scale className="w-3.5 h-3.5 text-emerald-600" />
                Tableau de Bord Stratégique
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-slate-100 text-slate-700 border border-slate-200">
                Comparatif Bilatéral A vs B
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              Comparaison des scénarios CLIMATOPEDY
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Comparez les sorties de deux scénarios internes à CLIMATOPEDY (<strong className="text-rose-700">Scénario A - Fil de l'eau</strong> et <strong className="text-emerald-700">Scénario B - Sobriété &amp; Agroécologie</strong>). Les résultats dépendent des paramètres du modèle et ne sont pas des projections officielles du GIEC ni des estimations validées de mortalité, migration ou sécurité alimentaire.
            </p>
          </div>

          {/* Sélecteur de l'horizon temporel de calcul */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              Horizon temporel d'évaluation :
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[2030, 2050, 2080, 2100, 2200].map((yr) => (
                <button
                  key={yr}
                  onClick={() => {
                    setHorizonYear(yr);
                    onSeekYear(yr);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    horizonYear === yr
                      ? 'bg-emerald-600 text-white shadow-2xs scale-105'
                      : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-300'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              Année courante : <strong className="text-slate-900">{Math.floor(currentYear)}</strong>
            </span>
          </div>
        </div>

        {/* 2. Bandeau synthèse macroscopique des gains majeurs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-200">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-1 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium">🌡️ Réchauffement évité à {horizonYear}</span>
            <span className="text-xl font-bold font-mono text-emerald-700">
              {Math.abs(deltaTemp).toFixed(2)} °C de moins
            </span>
            <span className="text-[10px] text-slate-500">
              (A: +{stateA.surfaceTemperatureAnomaly.toFixed(2)}°C vs B: +{stateB.surfaceTemperatureAnomaly.toFixed(2)}°C)
            </span>
          </div>

          <div className="bg-slate-50 border border-emerald-200 rounded-xl p-3 flex flex-col gap-1 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium">Écart de décès simulés (2026-{horizonYear})</span>
            <span className="text-xl font-bold font-mono text-emerald-700">
              +{cumulativeStats.livesSavedMillions.toFixed(0)} Millions
            </span>
            <span className="text-[10px] text-slate-500">
              Valeurs calculées par CLIMATOPEDY
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-1 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium">💧 Pression sur l'eau douce</span>
            <span className="text-xl font-bold font-mono text-sky-700">
              {Math.abs(waterStressDeltaPct)} points en moins
            </span>
            <span className="text-[10px] text-slate-500">
              Moins de populations sous pénurie sévère
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-1 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium">🌾 Sécurité calorique globale</span>
            <span className="text-xl font-bold font-mono text-amber-800">
              +{deltaCalories} kcal/hab/jour
            </span>
            <span className="text-[10px] text-slate-500">
              Sortie conditionnelle du modèle CLIMATOPEDY
            </span>
          </div>
        </div>
      </div>

      {/* 3. Barre de filtre thématique & actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-500 font-medium mr-2">Domaines d'impact :</span>
          {[
            { id: 'all', label: 'Tous les domaines' },
            { id: 'climate', label: 'Climat & Océans' },
            { id: 'demography', label: 'Démographie & Survie' },
            { id: 'food_water', label: 'Eau & Alimentation' },
            { id: 'energy', label: 'Rendement de l\'Énergie' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id as any)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-sky-50 text-sky-800 border border-sky-300 shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Grille de Cartes d'Impact (Impact Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all group"
          >
            <div className="space-y-3">
              {/* En-tête de la carte */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 shrink-0">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      {card.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-semibold ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                  {card.tooltipTerm && (
                    <TechTooltip term={card.tooltipTerm as any} showIconOnly />
                  )}
                </div>
              </div>

              {/* Comparaison Visuelle Côte à Côte A vs B */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                {/* Scénario A (BAU) */}
                <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[10px] text-rose-800 font-semibold">
                    <span>Scénario A (BAU)</span>
                    <span className="font-mono">{horizonYear}</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold font-mono text-rose-950 tabular-nums">
                    {card.valA}
                  </div>
                  <span className="text-[9.5px] text-rose-700">
                    Fil de l'eau fossile
                  </span>
                </div>

                {/* Scénario B (Sobriété) */}
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[10px] text-emerald-800 font-semibold">
                    <span>Scénario B (Sobriété)</span>
                    <span className="font-mono">{horizonYear}</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold font-mono text-emerald-950 tabular-nums">
                    {card.valB}
                  </div>
                  <span className="text-[9.5px] text-emerald-700">
                    Redirection biophysique
                  </span>
                </div>
              </div>

              {/* Badge d'écart / Bénéfice chiffré */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 shadow-2xs">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  {card.benefitHeadline}
                </span>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                  card.deltaPositiveIsGood 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}>
                  {card.deltaText}
                </span>
              </div>

              {/* Explication du mécanisme scientifique */}
              <p className="text-[11px] text-slate-600 leading-relaxed pt-1">
                <strong className="text-slate-800">Mécanisme sous-jacent : </strong>
                {card.mechanism}
              </p>
            </div>

            {/* Référence scientifique en bas de carte */}
            <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
              <span className="font-mono truncate">
                Source : {card.scientificRef}
              </span>
              <button
                onClick={() => onSeekYear(horizonYear)}
                className="text-sky-700 hover:text-sky-800 font-semibold flex items-center gap-1 cursor-pointer shrink-0 ml-2"
                title="Consulter l'année exacte sur le planisphère"
              >
                <span>Voir en {horizonYear}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 5. Tableau Récapitulatif Structuré (Aide à la Décision) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-600" />
              Matrice Comparée des Scénarios à l'Horizon {horizonYear}
            </h3>
            <p className="text-xs text-slate-500">
              Comparaison des résultats simulés par CLIMATOPEDY à l'horizon sélectionné.
            </p>
          </div>
          <span className="text-xs font-mono text-sky-800 bg-sky-50 border border-sky-300 px-2.5 py-1 rounded-lg self-start sm:self-auto font-semibold">
            Modèle CLIMATOPEDY; voir les sources et hypothèses
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-mono text-[11px]">
                <th className="py-2.5 px-3">Indicateur Biophysique</th>
                <th className="py-2.5 px-3 text-rose-800 bg-rose-50/60">Scénario A (Fil de l'eau)</th>
                <th className="py-2.5 px-3 text-emerald-800 bg-emerald-50/60">Scénario B (Sobriété)</th>
                <th className="py-2.5 px-3 text-sky-800 bg-sky-50/60">Écart entre scénarios</th>
                <th className="py-2.5 px-3">Description de la sortie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700 tabular-nums">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Anomalie Température Moyenne</td>
                <td className="py-2.5 px-3 font-mono text-rose-800">+{stateA.surfaceTemperatureAnomaly.toFixed(2)} °C</td>
                <td className="py-2.5 px-3 font-mono text-emerald-800">+{stateB.surfaceTemperatureAnomaly.toFixed(2)} °C</td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">-{Math.abs(deltaTemp).toFixed(2)} °C</td>
                <td className="py-2.5 px-3 text-slate-600 text-[11px]">Valeur calculée par le scénario CLIMATOPEDY.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">
                  <div>Population Mondiale Totale</div>
                  <div className="text-[10px] text-slate-500 font-normal">Base démographique (dénominateur 100% ci-dessous)</div>
                </td>
                <td className="py-2.5 px-3 font-mono text-rose-800">{popA_Mds} Mds</td>
                <td className="py-2.5 px-3 font-mono text-emerald-800">{popB_Mds} Mds</td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">{deltaPopMds} Mds</td>
                <td className="py-2.5 px-3 text-slate-600 text-[11px]">Population et mortalité sont calculées selon les paramètres du modèle.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">
                  <div>Population sous le seuil Tw du modèle</div>
                  <div className="text-[10px] text-slate-500 font-normal">Population des régions où Tw simulée &lt; 31°C (seuil du modèle)</div>
                </td>
                <td className="py-2.5 px-3 font-mono text-rose-800">
                  <span className="font-bold">{habitablePopA_Mds} Mds</span>
                  <span className="text-[11px] text-rose-700 ml-1.5 font-normal">({(habitableFractionA * 100).toFixed(0)}% du total)</span>
                </td>
                <td className="py-2.5 px-3 font-mono text-emerald-800">
                  <span className="font-bold">{habitablePopB_Mds} Mds</span>
                  <span className="text-[11px] text-emerald-700 ml-1.5 font-normal">({(habitableFractionB * 100).toFixed(0)}% du total)</span>
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">+{gainHabitablePopMds} Mds</td>
                <td className="py-2.5 px-3 text-slate-600 text-[11px]">Répartition calculée par le modèle; ce n'est pas une évaluation de l'habitabilité.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">
                  <div>Vulnérabilité Eau (Stress Hydrique Sévère)</div>
                  <div className="text-[10px] text-slate-500 font-normal">Déficit critique en eau douce &lt; 1 000 m³/an/habitant</div>
                </td>
                <td className="py-2.5 px-3 font-mono text-rose-800">
                  <span className="font-bold">{waterStressedPopA_B} Mds</span>
                  <span className="text-[11px] text-rose-700 ml-1.5 font-normal">({waterStressPctA}% du total)</span>
                </td>
                <td className="py-2.5 px-3 font-mono text-emerald-800">
                  <span className="font-bold">{waterStressedPopB_B} Mds</span>
                  <span className="text-[11px] text-emerald-700 ml-1.5 font-normal">({waterStressPctB}% du total)</span>
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">{waterStressDeltaPct} points</td>
                <td className="py-2.5 px-3 text-slate-600 text-[11px]">Indice de stress hydrique calculé par le modèle.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Apport Alimentaire Moyen</td>
                <td className="py-2.5 px-3 font-mono text-rose-800">{Math.round(stateA.globalAverageCaloriesPerCapita)} kcal/j</td>
                <td className="py-2.5 px-3 font-mono text-emerald-800">{Math.round(stateB.globalAverageCaloriesPerCapita)} kcal/j</td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">+{deltaCalories} kcal/j</td>
                <td className="py-2.5 px-3 text-slate-600 text-[11px]">Apport calorique moyen calculé par le modèle; ne garantit pas la sécurité alimentaire.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Élévation Séculaire des Mers</td>
                <td className="py-2.5 px-3 font-mono text-rose-800">+{Math.round(stateA.seaLevelRiseMeters * 100)} cm</td>
                <td className="py-2.5 px-3 font-mono text-emerald-800">+{Math.round(stateB.seaLevelRiseMeters * 100)} cm</td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">{deltaSlrCm} cm</td>
                <td className="py-2.5 px-3 text-slate-600 text-[11px]">Valeur de niveau marin calculée par le modèle; ce n'est pas une projection régionale d'inondation.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Rendement de l'Énergie (Énergie Utile)</td>
                <td className="py-2.5 px-3 font-mono text-rose-800">x{stateA.currentEroi >= 20 ? Math.round(stateA.currentEroi) : stateA.currentEroi.toFixed(1)}</td>
                <td className="py-2.5 px-3 font-mono text-emerald-800">x{stateB.currentEroi >= 20 ? Math.round(stateB.currentEroi) : stateB.currentEroi.toFixed(1)}</td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">+{deltaEroi.toFixed(1)} pts</td>
                <td className="py-2.5 px-3 text-slate-600 text-[11px]">EROI calculé par le modèle selon son périmètre et ses paramètres.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Note pédagogique sur l'indépendance des indicateurs biophysiques */}
        <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 flex items-start gap-2.5 leading-relaxed">
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-slate-900 block">
              💡 Clarification Méthodologique : Pourquoi 79% et 45% ne font pas 100% ?
            </span>
            <p className="text-slate-700">
              L'<strong className="text-emerald-700 font-semibold">Habitabilité Thermique ({habitablePopA_Mds} Mds, soit {(habitableFractionA * 100).toFixed(0)}%)</strong> et le{' '}
              <strong className="text-rose-700 font-semibold">Stress Hydrique Sévère ({waterStressedPopA_B} Mds, soit {waterStressPctA}%)</strong> ne sont pas deux tranches d'un même camembert, mais <strong>deux dimensions biophysiques indépendantes</strong> rapportées chacune à 100% de la population mondiale du scénario ({popA_Mds} Mds).
            </p>
            <p className="text-slate-500 text-[10px]">
              • <strong>Indicateur Tw ({(habitableFractionA * 100).toFixed(0)}%)</strong> : {((1 - habitableFractionA) * 100).toFixed(0)}% de la population du scénario vit dans des régions où Tw calculée dépasse le seuil de 31°C choisi par le modèle; cela ne signifie pas que ces régions sont inhabitables.<br />
              • <strong>Stress hydrique ({waterStressPctA}%)</strong> : {100 - waterStressPctA}% de la population conserve un approvisionnement en eau suffisant.<br />
              Une personne peut tout à fait habiter une zone thermiquement supportable tout en subissant une pénurie d'eau douce (les deux phénomènes se superposent géographiquement).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
