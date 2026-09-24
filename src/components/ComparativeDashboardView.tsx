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
  FileDown,
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
  onOpenPdfExport?: () => void;
  onSelectScenarioB?: (scenario: SimulationScenarioConfig) => void;
}

export const ComparativeDashboardView: React.FC<ComparativeDashboardViewProps> = ({
  scenarioA,
  scenarioB,
  trajectoryA,
  trajectoryB,
  currentYear,
  onSeekYear,
  onOpenPdfExport
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
      icon: <Thermometer className="w-5 h-5 text-rose-400" />,
      badge: 'Climat & Atmosphère',
      badgeColor: 'border-rose-800/60 bg-rose-950/60 text-rose-300',
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
      title: 'Population Vivable & Préservée',
      subtitle: 'Humains vivant dans des zones biophysiquement viables (Tw < 31°C)',
      icon: <Users className="w-5 h-5 text-emerald-400" />,
      badge: 'Démographie & Survie',
      badgeColor: 'border-emerald-800/60 bg-emerald-950/60 text-emerald-300',
      valA: `${habitablePopA_Mds} Mds (${(habitableFractionA * 100).toFixed(0)}% de la pop.)`,
      valB: `${habitablePopB_Mds} Mds (${(habitableFractionB * 100).toFixed(0)}% de la pop.)`,
      deltaText: `+${gainHabitablePopMds} Mds d'humains viables`,
      deltaPositiveIsGood: true,
      benefitHeadline: `${cumulativeStats.livesSavedMillions.toFixed(0)} millions de vies préservées d'ici ${horizonYear}`,
      mechanism: `Le maintien du thermomètre mouillé sous le seuil létal de Stull (Tw < 31°C) empêche l'effondrement hyperthermique de milliards d'habitants dans le sous-continent indien, le Golfe persique et le Sahel.`,
      scientificRef: 'Sherwood & Huber (PNAS 2010) / Raymond et al. (2020)',
      tooltipTerm: 'stull'
    },
    {
      id: 'water_stress',
      category: 'food_water',
      title: 'Stress Hydrique Sévère',
      subtitle: 'Part et nombre de personnes subissant un déficit hydrique critique',
      icon: <Droplets className="w-5 h-5 text-sky-400" />,
      badge: 'Eau & Ressources',
      badgeColor: 'border-sky-800/60 bg-sky-950/60 text-sky-300',
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
      icon: <Wheat className="w-5 h-5 text-amber-400" />,
      badge: 'Alimentation & Agriculture',
      badgeColor: 'border-amber-800/60 bg-amber-950/60 text-amber-300',
      valA: `${Math.round(stateA.globalAverageCaloriesPerCapita)} kcal/j (${(stateA.globalCropYieldComposite * 100).toFixed(0)}%)`,
      valB: `${Math.round(stateB.globalAverageCaloriesPerCapita)} kcal/j (${(stateB.globalCropYieldComposite * 100).toFixed(0)}%)`,
      deltaText: `${deltaCalories >= 0 ? '+' : ''}${deltaCalories} kcal/j (${deltaYieldPct >= 0 ? '+' : ''}${deltaYieldPct} pts rendement)`,
      deltaPositiveIsGood: deltaCalories > 0,
      benefitHeadline: `Régime alimentaire supérieur au seuil vital (2 100 kcal)`,
      mechanism: `La transition agroécologique (fixation biologique de l'azote par légumineuses) compense l'épuisement inévitable du gaz pour le procédé Haber-Bosch et protège les sols de l'érosion.`,
      scientificRef: 'Zhao et al. (PNAS 2017) / Erisman et al. (Nature Geo 2008)',
      tooltipTerm: 'haber-bosch'
    },
    {
      id: 'sea_level',
      category: 'climate',
      title: 'Élévation Séculaire des Mers',
      subtitle: 'Montée du niveau moyen des océans et submersion côtière',
      icon: <Waves className="w-5 h-5 text-cyan-400" />,
      badge: 'Océans & Littoraux',
      badgeColor: 'border-cyan-800/60 bg-cyan-950/60 text-cyan-300',
      valA: `+${Math.round(stateA.seaLevelRiseMeters * 100)} cm`,
      valB: `+${Math.round(stateB.seaLevelRiseMeters * 100)} cm`,
      deltaText: `${deltaSlrCm >= 0 ? '+' : ''}${deltaSlrCm} cm (${Math.abs(deltaSlrCm)} cm épargnés)`,
      deltaPositiveIsGood: deltaSlrCm < 0,
      benefitHeadline: `${Math.abs(deltaSlrCm)} cm d'inondation côtière évitée en ${horizonYear}`,
      mechanism: `Moins de réchauffement atmosphérique réduit la dilatation thermique de l'océan profond et ralentit l'amincissement des calottes glaciaires du Groenland et de l'Antarctique de l'Ouest.`,
      scientificRef: 'Vermeer & Rahmstorf (2009) / GIEC AR6 Ch. 9',
      tooltipTerm: 'slr'
    },
    {
      id: 'energy_resilience',
      category: 'energy',
      title: 'Rendement de l\'Énergie (Énergie Nette)',
      subtitle: 'Barils obtenus pour 1 baril dépensé à forer, et énergie utile pour la société',
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      badge: 'Énergie & Métabolisme',
      badgeColor: 'border-yellow-800/60 bg-yellow-950/60 text-yellow-300',
      valA: `x${stateA.currentEroi >= 20 ? Math.round(stateA.currentEroi) : stateA.currentEroi.toFixed(1)} (${(stateA.netEnergyRatio * 100).toFixed(0)}% utile)`,
      valB: `x${stateB.currentEroi >= 20 ? Math.round(stateB.currentEroi) : stateB.currentEroi.toFixed(1)} (${(stateB.netEnergyRatio * 100).toFixed(0)}% utile)`,
      deltaText: `${deltaEroi >= 0 ? '+' : ''}${deltaEroi.toFixed(1)} pts de rendement (${deltaNetEnergyPct >= 0 ? '+' : ''}${deltaNetEnergyPct} pts utile)`,
      deltaPositiveIsGood: deltaEroi > 0,
      benefitHeadline: `Préservation de l'énergie pour les besoins vitaux`,
      mechanism: `La baisse délibérée de la demande évite de gaspiller les derniers gisements et préserve un rendement suffisant pour isoler les logements et électrifier.`,
      scientificRef: 'Hall, Lambert & Balogh (Ecol. Econ. 2014)',
      tooltipTerm: 'eroi'
    },
    {
      id: 'climate_refugees',
      category: 'demography',
      title: 'Réfugiés Climatiques & Migrations',
      subtitle: 'Personnes déplacées sous pression thermique et alimentaire',
      icon: <AlertTriangle className="w-5 h-5 text-purple-400" />,
      badge: 'Stabilité Géopolitique',
      badgeColor: 'border-purple-800/60 bg-purple-950/60 text-purple-300',
      valA: `${stateA.activeClimateRefugees.toFixed(1)} M`,
      valB: `${stateB.activeClimateRefugees.toFixed(1)} M`,
      deltaText: `${deltaRefugeesM >= 0 ? '-' : '+'}${Math.abs(deltaRefugeesM).toFixed(1)} M d'exilés`,
      deltaPositiveIsGood: deltaRefugeesM > 0,
      benefitHeadline: `${Math.abs(deltaRefugeesM).toFixed(1)} millions d'exils forcés évités`,
      mechanism: `En maintenant l'habitabilité locale des régions tropicales et méditerranéennes, la pression d'exode massif vers les pays boréaux est considérablement désamorcée.`,
      scientificRef: 'IDMC (Internal Displacement Monitoring Centre) & GIEC AR6 WG2'
    },
    {
      id: 'annual_deaths',
      category: 'demography',
      title: 'Mortalité Annuelle Critique',
      subtitle: 'Décès annuels causés par les canicules létales et les famines',
      icon: <HeartPulse className="w-5 h-5 text-rose-500" />,
      badge: 'Santé Publique Mondiale',
      badgeColor: 'border-rose-800/60 bg-rose-950/60 text-rose-300',
      valA: `${stateA.worldDeathsAnnual.total.toFixed(1)} M/an`,
      valB: `${stateB.worldDeathsAnnual.total.toFixed(1)} M/an`,
      deltaText: `-${deltaAnnualDeathsM.toFixed(1)} M décès/an en ${horizonYear}`,
      deltaPositiveIsGood: deltaAnnualDeathsM > 0,
      benefitHeadline: `Mortalité annuelle réduite de ${deltaAnnualDeathsM.toFixed(1)} millions/an`,
      mechanism: `Moins de dômes de chaleur humide et une production agroécologique résiliente limitent radicalement les hécatombes climatiques récurrentes.`,
      scientificRef: 'The Lancet Countdown on Health and Climate Change'
    }
  ];

  // Filtrage des cartes
  const filteredCards = impactCards.filter((c) => {
    if (categoryFilter === 'all') return true;
    return c.category === categoryFilter;
  });

  return (
    <div className="space-y-6">
      {/* 1. En-tête héroïque du Dashboard Comparatif */}
      <div className="bg-gradient-to-br from-[#0c1527] via-[#09101d] to-[#0d1f1f] border border-emerald-500/40 rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Glow décoratif d'arrière-plan */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-600/50 flex items-center gap-1.5 shadow-sm">
                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                Tableau de Bord Stratégique
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-slate-800/80 text-slate-300 border border-slate-700">
                Comparatif Bilatéral A vs B
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Dashboard Comparatif Global & Bénéfices de l'Action
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Visualisez instantanément la divergence biophysique majeure entre la poursuite aveugle du modèle actuel (<strong className="text-rose-300">Scénario A - Fil de l'eau</strong>) et une politique délibérée de redirection écologique (<strong className="text-emerald-300">Scénario B - Sobriété & Agroécologie</strong>).
            </p>
          </div>

          {/* Sélecteur de l'horizon temporel de calcul */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 bg-[#080d17]/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
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
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 scale-105'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Année courante : <strong className="text-white">{Math.floor(currentYear)}</strong>
            </span>
          </div>
        </div>

        {/* 2. Bandeau synthèse macroscopique des gains majeurs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-[#0b121e]/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-1 shadow-sm">
            <span className="text-[11px] text-slate-400 font-medium">🌡️ Réchauffement évité à {horizonYear}</span>
            <span className="text-xl font-bold font-mono text-emerald-400">
              {Math.abs(deltaTemp).toFixed(2)} °C de moins
            </span>
            <span className="text-[10px] text-slate-400">
              (A: +{stateA.surfaceTemperatureAnomaly.toFixed(2)}°C vs B: +{stateB.surfaceTemperatureAnomaly.toFixed(2)}°C)
            </span>
          </div>

          <div className="bg-[#0b121e]/90 border border-emerald-900/60 rounded-xl p-3 flex flex-col gap-1 shadow-sm">
            <span className="text-[11px] text-slate-400 font-medium">🛡️ Vies humaines épargnées (2026-{horizonYear})</span>
            <span className="text-xl font-bold font-mono text-emerald-300">
              +{cumulativeStats.livesSavedMillions.toFixed(0)} Millions
            </span>
            <span className="text-[10px] text-slate-400">
              Mortalités thermique & famine évitées
            </span>
          </div>

          <div className="bg-[#0b121e]/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-1 shadow-sm">
            <span className="text-[11px] text-slate-400 font-medium">💧 Pression sur l'eau douce</span>
            <span className="text-xl font-bold font-mono text-sky-400">
              {Math.abs(waterStressDeltaPct)} points en moins
            </span>
            <span className="text-[10px] text-slate-400">
              Moins de populations sous pénurie sévère
            </span>
          </div>

          <div className="bg-[#0b121e]/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-1 shadow-sm">
            <span className="text-[11px] text-slate-400 font-medium">🌾 Sécurité calorique globale</span>
            <span className="text-xl font-bold font-mono text-amber-400">
              +{deltaCalories} kcal/hab/jour
            </span>
            <span className="text-[10px] text-slate-400">
              Stabilisation via l'agroécologie autonome
            </span>
          </div>
        </div>
      </div>

      {/* 3. Barre de filtre thématique & actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0a101b] border border-slate-800 rounded-xl p-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 font-medium mr-2">Domaines d'impact :</span>
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
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/70 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {onOpenPdfExport && (
          <button
            onClick={onOpenPdfExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-950/80 hover:bg-cyan-900 text-cyan-200 border border-cyan-600/70 transition-colors cursor-pointer self-start sm:self-auto shrink-0 shadow-sm"
          >
            <FileDown className="w-3.5 h-3.5 text-cyan-400" />
            <span>Télécharger le comparatif complet (PDF)</span>
          </button>
        )}
      </div>

      {/* 4. Grille de Cartes d'Impact (Impact Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            className="bg-[#0c121e] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all group"
          >
            <div className="space-y-3">
              {/* En-tête de la carte */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-700/60 shrink-0">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-tight">
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
                <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[10px] text-rose-300 font-semibold">
                    <span>Scénario A (BAU)</span>
                    <span className="font-mono">{horizonYear}</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold font-mono text-rose-200 tabular-nums">
                    {card.valA}
                  </div>
                  <span className="text-[9.5px] text-rose-400/80">
                    Fil de l'eau fossile
                  </span>
                </div>

                {/* Scénario B (Sobriété) */}
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[10px] text-emerald-300 font-semibold">
                    <span>Scénario B (Sobriété)</span>
                    <span className="font-mono">{horizonYear}</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold font-mono text-emerald-300 tabular-nums">
                    {card.valB}
                  </div>
                  <span className="text-[9.5px] text-emerald-400/80">
                    Redirection biophysique
                  </span>
                </div>
              </div>

              {/* Badge d'écart / Bénéfice chiffré */}
              <div className="p-2.5 rounded-xl bg-[#111928] border border-slate-700/80 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  {card.benefitHeadline}
                </span>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                  card.deltaPositiveIsGood 
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/70' 
                    : 'bg-rose-950 text-rose-300 border border-rose-800/70'
                }`}>
                  {card.deltaText}
                </span>
              </div>

              {/* Explication du mécanisme scientifique */}
              <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
                <strong className="text-slate-200">Mécanisme sous-jacent : </strong>
                {card.mechanism}
              </p>
            </div>

            {/* Référence scientifique en bas de carte */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span className="font-mono truncate">
                Source : {card.scientificRef}
              </span>
              <button
                onClick={() => onSeekYear(horizonYear)}
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer shrink-0 ml-2"
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
      <div className="bg-[#0b101c] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Matrice Comparée des Scénarios à l'Horizon {horizonYear}
            </h3>
            <p className="text-xs text-slate-400">
              Synthèse intégrée pour les décideurs publics, chercheurs et citoyens éclairés.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-1 rounded-lg self-start sm:self-auto">
            Base CMIP6 / FaIR v1.1
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">Indicateur Biophysique</th>
                <th className="py-2.5 px-3 text-rose-300 bg-rose-950/20">Scénario A (Fil de l'eau)</th>
                <th className="py-2.5 px-3 text-emerald-300 bg-emerald-950/20">Scénario B (Sobriété)</th>
                <th className="py-2.5 px-3 text-cyan-300">Bénéfice Net de l'Action</th>
                <th className="py-2.5 px-3">Implication Concrète</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200 tabular-nums">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Anomalie Température Moyenne</td>
                <td className="py-2.5 px-3 font-mono text-rose-300">+{stateA.surfaceTemperatureAnomaly.toFixed(2)} °C</td>
                <td className="py-2.5 px-3 font-mono text-emerald-300">+{stateB.surfaceTemperatureAnomaly.toFixed(2)} °C</td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">-{Math.abs(deltaTemp).toFixed(2)} °C</td>
                <td className="py-2.5 px-3 text-slate-300 text-[11px]">Évite l'emballement des feux boréaux et du dégel du pergélisol.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">
                  <div>Population Mondiale Totale</div>
                  <div className="text-[10px] text-slate-400 font-normal">Base démographique (dénominateur 100% ci-dessous)</div>
                </td>
                <td className="py-2.5 px-3 font-mono text-rose-300">{popA_Mds} Mds</td>
                <td className="py-2.5 px-3 font-mono text-emerald-300">{popB_Mds} Mds</td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">{deltaPopMds} Mds</td>
                <td className="py-2.5 px-3 text-slate-300 text-[11px]">Évite les surmortalités massives par famines chroniques et stress thermique.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">
                  <div>Habitabilité Thermique (Zone Viable)</div>
                  <div className="text-[10px] text-slate-400 font-normal">Zone où Tw &lt; 31°C (seuil de tolérance humaine Stull)</div>
                </td>
                <td className="py-2.5 px-3 font-mono text-rose-300">
                  <span className="font-bold">{habitablePopA_Mds} Mds</span>
                  <span className="text-[11px] text-rose-400/90 ml-1.5 font-normal">({(habitableFractionA * 100).toFixed(0)}% du total)</span>
                </td>
                <td className="py-2.5 px-3 font-mono text-emerald-300">
                  <span className="font-bold">{habitablePopB_Mds} Mds</span>
                  <span className="text-[11px] text-emerald-400/90 ml-1.5 font-normal">({(habitableFractionB * 100).toFixed(0)}% du total)</span>
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">+{gainHabitablePopMds} Mds</td>
                <td className="py-2.5 px-3 text-slate-300 text-[11px]">Préserve l'habitabilité du sud asiatique et de l'Afrique sahélienne.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">
                  <div>Vulnérabilité Eau (Stress Hydrique Sévère)</div>
                  <div className="text-[10px] text-slate-400 font-normal">Déficit critique en eau douce &lt; 1 000 m³/an/habitant</div>
                </td>
                <td className="py-2.5 px-3 font-mono text-rose-300">
                  <span className="font-bold">{waterStressedPopA_B} Mds</span>
                  <span className="text-[11px] text-rose-400/90 ml-1.5 font-normal">({waterStressPctA}% du total)</span>
                </td>
                <td className="py-2.5 px-3 font-mono text-emerald-300">
                  <span className="font-bold">{waterStressedPopB_B} Mds</span>
                  <span className="text-[11px] text-emerald-400/90 ml-1.5 font-normal">({waterStressPctB}% du total)</span>
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">{waterStressDeltaPct} points</td>
                <td className="py-2.5 px-3 text-slate-300 text-[11px]">Maintien des débits estivaux des grands fleuves d'origine glaciaire.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Apport Alimentaire Moyen</td>
                <td className="py-2.5 px-3 font-mono text-rose-300">{Math.round(stateA.globalAverageCaloriesPerCapita)} kcal/j</td>
                <td className="py-2.5 px-3 font-mono text-emerald-300">{Math.round(stateB.globalAverageCaloriesPerCapita)} kcal/j</td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">+{deltaCalories} kcal/j</td>
                <td className="py-2.5 px-3 text-slate-300 text-[11px]">Sécurité alimentaire garantie au-dessus du plancher métabolique de 2100 kcal.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Élévation Séculaire des Mers</td>
                <td className="py-2.5 px-3 font-mono text-rose-300">+{Math.round(stateA.seaLevelRiseMeters * 100)} cm</td>
                <td className="py-2.5 px-3 font-mono text-emerald-300">+{Math.round(stateB.seaLevelRiseMeters * 100)} cm</td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">{deltaSlrCm} cm</td>
                <td className="py-2.5 px-3 text-slate-300 text-[11px]">Protection des deltas fertiles (Gange, Mékong, Nil, Pô) et mégapoles côtières.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Rendement de l'Énergie (Énergie Utile)</td>
                <td className="py-2.5 px-3 font-mono text-rose-300">x{stateA.currentEroi >= 20 ? Math.round(stateA.currentEroi) : stateA.currentEroi.toFixed(1)}</td>
                <td className="py-2.5 px-3 font-mono text-emerald-300">x{stateB.currentEroi >= 20 ? Math.round(stateB.currentEroi) : stateB.currentEroi.toFixed(1)}</td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">+{deltaEroi.toFixed(1)} pts</td>
                <td className="py-2.5 px-3 text-slate-300 text-[11px]">Conserve un surplus d'énergie suffisant pour maintenir la médecine et l'éducation.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Note pédagogique sur l'indépendance des indicateurs biophysiques */}
        <div className="mt-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2.5 leading-relaxed">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-white block">
              💡 Clarification Méthodologique : Pourquoi 79% et 45% ne font pas 100% ?
            </span>
            <p className="text-slate-300">
              L'<strong className="text-emerald-300 font-medium">Habitabilité Thermique ({habitablePopA_Mds} Mds, soit {(habitableFractionA * 100).toFixed(0)}%)</strong> et le{' '}
              <strong className="text-rose-300 font-medium">Stress Hydrique Sévère ({waterStressedPopA_B} Mds, soit {waterStressPctA}%)</strong> ne sont pas deux tranches d'un même camembert, mais <strong>deux dimensions biophysiques indépendantes</strong> rapportées chacune à 100% de la population mondiale du scénario ({popA_Mds} Mds).
            </p>
            <p className="text-slate-400 text-[10px]">
              • <strong>Habitabilité ({(habitableFractionA * 100).toFixed(0)}%)</strong> : {((1 - habitableFractionA) * 100).toFixed(0)}% de la population vit dans une zone rendue inhabitable par le stress thermique létal (Tw &gt; 31°C).<br />
              • <strong>Stress hydrique ({waterStressPctA}%)</strong> : {100 - waterStressPctA}% de la population conserve un approvisionnement en eau suffisant.<br />
              Une personne peut tout à fait habiter une zone thermiquement supportable tout en subissant une pénurie d'eau douce (les deux phénomènes se superposent géographiquement).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
