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
      id: 'thermal_population_index',
      category: 'demography',
      title: 'Indicateur de chaleur par zone',
      subtitle: 'Alerte thermique interne; aucun nombre de décès ni conclusion sur l’habitabilité',
      icon: <Users className="w-5 h-5 text-emerald-600" />,
      badge: 'Indicateur exploratoire',
      badgeColor: 'border-emerald-300 bg-emerald-50 text-emerald-800',
      valA: `Réchauffement moyen simulé : +${stateA.surfaceTemperatureAnomaly.toFixed(1)} °C`,
      valB: `Réchauffement moyen simulé : +${stateB.surfaceTemperatureAnomaly.toFixed(1)} °C`,
      deltaText: `Écart de température mondiale : ${deltaTemp >= 0 ? '+' : ''}${deltaTemp.toFixed(2)} °C`,
      deltaPositiveIsGood: true,
      benefitHeadline: 'Aucune estimation médicale de décès ou d’habitabilité',
      mechanism: `L’indice interne ne calcule pas l’exposition régionale à Tw et n’évalue pas l’habitabilité. Les sorties de mortalité ayant été retirées, cet indicateur ne doit pas être interprété comme un nombre de personnes protégées.`,
      scientificRef: 'Sherwood & Huber (PNAS 2010) / Raymond et al. (2020)',
      tooltipTerm: 'stull'
    },
    {
      id: 'water_stress',
      category: 'food_water',
      title: 'Indice de pression hydrique interne',
      subtitle: 'Règle simplifiée calculée à partir du réchauffement simulé; pas une mesure des personnes en pénurie',
      icon: <Droplets className="w-5 h-5 text-sky-600" />,
      badge: 'Eau & Ressources',
      badgeColor: 'border-sky-300 bg-sky-50 text-sky-800',
      valA: 'Population touchée : non estimée',
      valB: 'Population touchée : non estimée',
      deltaText: 'Aucune estimation de personnes en pénurie',
      deltaPositiveIsGood: false,
      benefitHeadline: 'Les effets sur l’eau ne sont pas quantifiés par pays',
      mechanism: `Les pourcentages précédemment calculés par le modèle reposaient sur une règle linéaire de température, sans données hydrologiques ou d’accès à l’eau. L’interface n’en déduit donc aucun nombre de personnes en pénurie.`,
      scientificRef: 'GIEC AR6 WG2 Chapitre 4 (Water Security)'
    },
    {
      id: 'caloric_security',
      category: 'food_water',
      title: 'Rendement agricole et disponibilité alimentaire simulés',
      subtitle: 'Indices de scénario; les kcal ne sont pas des observations de consommation',
      icon: <Wheat className="w-5 h-5 text-amber-600" />,
      badge: 'Alimentation & Agriculture',
      badgeColor: 'border-amber-300 bg-amber-50 text-amber-900',
      valA: `${Math.round(stateA.globalAverageCaloriesPerCapita)} kcal/j (${(stateA.globalCropYieldComposite * 100).toFixed(0)}%)`,
      valB: `${Math.round(stateB.globalAverageCaloriesPerCapita)} kcal/j (${(stateB.globalCropYieldComposite * 100).toFixed(0)}%)`,
      deltaText: `${deltaCalories >= 0 ? '+' : ''}${deltaCalories} kcal/j (${deltaYieldPct >= 0 ? '+' : ''}${deltaYieldPct} pts rendement)`,
      deltaPositiveIsGood: deltaCalories > 0,
      benefitHeadline: `Écart de disponibilité alimentaire simulée : ${deltaCalories >= 0 ? '+' : ''}${deltaCalories} kcal/habitant/jour`,
      mechanism: `Les valeurs sont des sorties du modèle, obtenues en appliquant un facteur de rendement simplifié à des disponibilités de départ saisies manuellement. Elles ne tiennent pas compte des échanges, des stocks, des pertes, de l’accès économique ou de la composition réelle de l’alimentation.`,
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
      deltaText: `${deltaSlrCm >= 0 ? '+' : ''}${deltaSlrCm} cm entre les deux scénarios internes`,
      deltaPositiveIsGood: deltaSlrCm < 0,
      benefitHeadline: `Écart de deux courbes internes : ${Math.abs(deltaSlrCm)} cm en ${horizonYear}`,
      mechanism: `La valeur absolue du modèle dépend de son ancrage et de sa relation semi-empirique. L’écart entre scénarios n’est pas une mesure de centimètres évités. Pour l’interpréter, comparer à la plage GIEC AR6 qui utilise une période de référence définie.`,
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
      title: 'Pression de déplacement (indice interne)',
      subtitle: 'Ce score n’est ni un nombre de personnes ni une projection migratoire',
      icon: <AlertTriangle className="w-5 h-5 text-purple-600" />,
      badge: 'Stabilité Géopolitique',
      badgeColor: 'border-purple-300 bg-purple-50 text-purple-800',
      valA: 'Indice non calibré',
      valB: 'Indice non calibré',
      deltaText: 'Aucun nombre de personnes estimé',
      deltaPositiveIsGood: false,
      benefitHeadline: 'Les déplacements ne sont pas quantifiés',
      mechanism: `Le moteur applique un score interne et ne conserve pas correctement un bilan de départs et d’arrivées. CLIMATOPEDY n’affiche donc pas de total de personnes déplacées. Le repère de la Banque mondiale porte sur des migrations internes dans six régions et dépend de scénarios précis.`,
      scientificRef: 'IDMC (Internal Displacement Monitoring Centre) & GIEC AR6 WG2'
    },
    {
      id: 'annual_deaths',
      category: 'demography',
      title: 'Indicateurs de santé : données insuffisantes',
      subtitle: 'Les décès ne sont pas calculables de façon fiable avec les données du simulateur',
      icon: <HeartPulse className="w-5 h-5 text-rose-600" />,
      badge: 'Santé Publique Mondiale',
      badgeColor: 'border-rose-300 bg-rose-50 text-rose-800',
      valA: 'Non estimé',
      valB: 'Non estimé',
      deltaText: 'Aucun total de décès validé',
      deltaPositiveIsGood: false,
      benefitHeadline: 'Le modèle ne permet pas de calculer un nombre de décès fiable',
      mechanism: `Les formules actuelles transforment directement les seuils thermiques et les déficits alimentaires en décès, sans données sanitaires par âge et par région ni relation dose-réponse validée. Ces chiffres ont été retirés de la comparaison; consulter les repères publiés sur la page Sources & Données.`,
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
              Comparez les sorties de deux scénarios internes à CLIMATOPEDY (<strong className="text-rose-700">Scénario A - Fil de l'eau</strong> et <strong className="text-emerald-700">Scénario B - Sobriété &amp; Agroécologie</strong>). Les résultats dépendent des paramètres du modèle et ne sont pas des projections officielles du GIEC ni des estimations validées de mortalité, migration ou sécurité alimentaire. La précision affichée est celle du calcul, pas une précision prédictive validée.
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
            <span className="text-[11px] text-slate-500 font-medium">🌡️ Écart simulé de réchauffement à {horizonYear}</span>
            <span className="text-xl font-bold font-mono text-emerald-700">
              {Math.abs(deltaTemp).toFixed(2)} °C entre scénarios
            </span>
            <span className="text-[10px] text-slate-500">
              (A: +{stateA.surfaceTemperatureAnomaly.toFixed(2)}°C vs B: +{stateB.surfaceTemperatureAnomaly.toFixed(2)}°C)
            </span>
          </div>

          <div className="bg-slate-50 border border-emerald-200 rounded-xl p-3 flex flex-col gap-1 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium">Décès attribuables au climat</span>
            <span className="text-xl font-bold font-mono text-rose-700">
              Non estimés
            </span>
            <span className="text-[10px] text-slate-500">
              Données de santé et méthode adaptées nécessaires
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-1 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium">💧 Population exposée au stress hydrique</span>
            <span className="text-xl font-bold font-mono text-sky-700">
              Non estimé
            </span>
            <span className="text-[10px] text-slate-500">
              Données hydrologiques régionales nécessaires
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-1 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium">🌾 Écart de disponibilité simulée</span>
            <span className="text-xl font-bold font-mono text-amber-800">
              {deltaCalories >= 0 ? '+' : ''}{deltaCalories} kcal/hab/jour
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
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">{deltaTemp >= 0 ? '+' : ''}{deltaTemp.toFixed(2)} °C</td>
                <td className="py-2.5 px-3 text-slate-600 text-[11px]">Valeur calculée par le scénario CLIMATOPEDY.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">
                  <div>Population des zones simulées</div>
                  <div className="text-[10px] text-slate-500 font-normal">34 zones; environ 7,6 milliards au départ, pas le total mondial complet</div>
                </td>
                <td className="py-2.5 px-3 font-mono text-rose-800">{popA_Mds} Mds</td>
                <td className="py-2.5 px-3 font-mono text-emerald-800">{popB_Mds} Mds</td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">{deltaPopMds} Mds</td>
                <td className="py-2.5 px-3 text-slate-600 text-[11px]">Projection démographique interne non alignée sur les tables de l’ONU; les décès ne sont pas estimés.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">
                  <div>Stress hydrique de la population</div>
                  <div className="text-[10px] text-slate-500 font-normal">Non calculé : aucune donnée hydrologique régionale intégrée</div>
                </td>
                <td className="py-2.5 px-3 text-slate-500" colSpan={4}>Non estimé par zone ou scénario.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Disponibilité alimentaire simulée</td>
                <td className="py-2.5 px-3 font-mono text-rose-800">{Math.round(stateA.globalAverageCaloriesPerCapita)} kcal/j</td>
                <td className="py-2.5 px-3 font-mono text-emerald-800">{Math.round(stateB.globalAverageCaloriesPerCapita)} kcal/j</td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">+{deltaCalories} kcal/j</td>
                <td className="py-2.5 px-3 text-slate-600 text-[11px]">Scénario simplifié issu de paramètres internes; ne mesure pas la disponibilité FAO, la consommation ou la faim.</td>
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

        {/* Note sur les indicateurs non estimés */}
        <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 flex items-start gap-2.5 leading-relaxed">
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-slate-900 block">
              💡 Limites des indicateurs humains
            </span>
            <p className="text-slate-700">
              Les données actuellement intégrées ne permettent pas d’estimer de manière fiable combien de personnes sont exposées à un stress thermique ou hydrique dans chaque scénario. Les nombres de décès ou de personnes en pénurie ne sont donc pas affichés.
            </p>
            <p className="text-slate-500 text-[10px]">
              Pour afficher ces résultats, il faudrait des données météorologiques quotidiennes, des cartes hydrologiques et des données démographiques géolocalisées, puis vérifier les méthodes sur des observations indépendantes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
