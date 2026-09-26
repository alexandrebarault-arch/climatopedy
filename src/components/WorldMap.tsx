import React, { useState, useMemo, useRef, useCallback } from 'react';
import { COUNTRIES_DATA } from '../data/countriesData';
import { GEO_COUNTRY_FEATURES, WORLD_LAND_PATH, SIM_CENTROIDS, ProcessedCountryFeature } from '../data/worldMapGeo';
import { GlobalBiophysicalState, MetricLayer, CountryStaticData } from '../types/simulation';
import {
  Thermometer,
  Utensils,
  Skull,
  Users,
  Waves,
  ShieldAlert,
  AlertTriangle,
  Eye,
  Flame,
  Globe2,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Activity,
  Zap,
  Droplets,
  Sun,
  BellRing,
  Radio,
  AlertOctagon,
  Minus,
  Plus,
  ShieldCheck,
  TreePine,
  X
} from 'lucide-react';
import { TechTooltip } from './TechTooltip';
import { GreenZonesScientificModal } from './GreenZonesScientificModal';
import climatePanelData from '../data/climatePanelData.json';
import { ClimatePanelFile } from '../types/climatePanel';

const climateRows = new Map((climatePanelData as ClimatePanelFile).rows.map(row => [row.id, row]));

interface WorldMapProps {
  simulationState: GlobalBiophysicalState;
  selectedCountryId: string | null;
  onSelectCountry: (countryId: string | null) => void;
  currentYear?: number;
}

type TwOverlayMode = 'aboveTwAlertThreshold' | 'critical' | 'all' | 'off';

export const WorldMap: React.FC<WorldMapProps> = ({
  simulationState,
  selectedCountryId,
  onSelectCountry,
  currentYear
}) => {
  const displayYear = currentYear !== undefined ? Math.floor(currentYear) : Math.floor(simulationState.year);
  const [activeMetric, setActiveMetric] = useState<MetricLayer>('wet_bulb');
  const [twOverlayMode, setTwOverlayMode] = useState<TwOverlayMode>('aboveTwAlertThreshold');
  const [hoveredFeature, setHoveredFeature] = useState<ProcessedCountryFeature | null>(null);

  // Système d'alertes visuelles de stress thermique Stull Tw (Seuil critique configurable, ex: >32.0°C)
  const [heatAlertThreshold, setHeatAlertThreshold] = useState<number>(32.0);
  const [heatAlertsEnabled, setHeatAlertsEnabled] = useState<boolean>(true);
  const [showGreenZonesModal, setShowGreenZonesModal] = useState<boolean>(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Gestionnaire anti-tremblement : conservation fluide de l'entité lors des micro-mouvements de frontière
  const onCountryPointerEnter = useCallback((feature: ProcessedCountryFeature) => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setHoveredFeature(feature);
  }, []);

  const onCountryPointerLeave = useCallback(() => {
    // Ne pas repasser immédiatement à null pour éviter le scintillement lors du passage d'une frontière ou d'une côte
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setHoveredFeature(null);
    }, 280);
  }, []);

  const onOceanPointerEnter = useCallback(() => {
    // Si le curseur s'arrête franchement dans l'océan, réinitialisation après court délai
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setHoveredFeature(null);
    }, 220);
  }, []);

  // Détermination de l'entité active à afficher dans la colonne de droite (Priorité : Survol > Sélection)
  const activeFeature = hoveredFeature || (selectedCountryId ? GEO_COUNTRY_FEATURES.find(f => f.simCountryId === selectedCountryId) || null : null);

  const activeCountryData = useMemo<CountryStaticData | null>(() => {
    if (!activeFeature) return null;
    return COUNTRIES_DATA.find((c) => c.id === activeFeature.simCountryId) || null;
  }, [activeFeature]);

  // Analyse thermique mondiale et détection des dépassements du seuil critique Stull Tw
  const thermalAnalysis = useMemo(() => {
    let aboveTwAlertThresholdCount = 0;
    let aboveTwAlertThresholdPop = 0;
    let criticalCount = 0;
    let alertCount = 0;
    let alertPop = 0;
    let extremeCount = 0; // Tw >= 35°C

    const aboveTwAlertThresholdList: Array<{ id: string; name: string; tw: number; pop: number }> = [];
    const alertList: Array<{
      id: string;
      name: string;
      code: string;
      tw: number;
      pop: number;
      summerMax: number;
      summerRh: number;
      isExtreme: boolean;
    }> = [];

    COUNTRIES_DATA.forEach((c) => {
      const dyn = simulationState.countries[c.id];
      if (!dyn) return;

      const tw = dyn.wetBulbPeak;

      if (tw >= 31.0) {
        aboveTwAlertThresholdCount++;
        aboveTwAlertThresholdPop += dyn.cohorts.total;
        aboveTwAlertThresholdList.push({ id: c.id, name: c.frenchName, tw, pop: dyn.cohorts.total });
      } else if (tw >= 29.0) {
        criticalCount++;
      }

      if (tw >= 35.0) {
        extremeCount++;
      }

      // Seuil d'alerte paramétrable Stull Tw (ex: >32.0°C)
      if (tw >= heatAlertThreshold) {
        alertCount++;
        alertPop += dyn.cohorts.total;
        alertList.push({
          id: c.id,
          name: c.frenchName,
          code: c.code,
          tw,
          pop: dyn.cohorts.total,
          summerMax: dyn.summerMaxTemp,
          summerRh: dyn.summerHumidity,
          isExtreme: tw >= 35.0
        });
      }
    });

    aboveTwAlertThresholdList.sort((a, b) => b.tw - a.tw);
    alertList.sort((a, b) => b.tw - a.tw);

    return {
      aboveTwAlertThresholdCount,
      aboveTwAlertThresholdPop,
      criticalCount,
      alertCount,
      alertPop,
      extremeCount,
      alertList,
      aboveTwAlertThresholdList
    };
  }, [simulationState, heatAlertThreshold]);

  // Nuancier biophysique scientifique continu et contrasté (Élimine le monochrome sombre)
  const getCountryFillColor = (simId: string): string => {
    const dyn = simulationState.countries[simId];
    const staticC = COUNTRIES_DATA.find((c) => c.id === simId);
    if (!dyn || !staticC) return '#cbd5e1';

    switch (activeMetric) {
      case 'wet_bulb': {
        const tw = dyn.wetBulbPeak;
        // Échelle thermodynamique Roland Stull (2011) progressive par bandes climatiques
        if (tw < 8.0) return '#0284c7'; // Froid arctique/boréal (Bleu franc)
        if (tw < 14.0) return '#0ea5e9'; // Tempéré froid (Bleu ciel)
        if (tw < 18.0) return '#06b6d4'; // Tempéré doux (Cyan-bleu)
        if (tw < 22.0) return '#0d9488'; // Tempéré chaud / Méditerranée (Sarcelle)
        if (tw < 25.0) return '#10b981'; // Subtropical vivable (Émeraude)
        if (tw < 27.0) return '#eab308'; // Début d'inconfort thermique (Jaune ambre)
        if (tw < 29.0) return '#f97316'; // Stress thermique élevé (Orange vif)
        if (tw < 31.0) return '#ef4444'; // Danger thermique sévère (Rouge vif)
        if (tw < 33.0) return '#b91c1c'; // Niveau d'alerte du modèle
        return '#701a75'; // Niveau supérieur d'alerte du modèle
      }

      case 'caloric_stress': {
        const cal = dyn.calPerCapita;
        if (cal >= 3200) return '#059669';
        if (cal >= 2700) return '#10b981';
        if (cal >= 2300) return '#eab308';
        if (cal >= 2100) return '#f97316';
        if (cal >= 1800) return '#ef4444';
        return '#7f1d1d';
      }

      case 'mortality':
        return '#64748b';

      case 'population': {
        const base = staticC.basePop2026;
        const current = dyn.cohorts.total;
        const changePct = ((current - base) / base) * 100;
        if (changePct > 15) return '#059669';
        if (changePct > 0) return '#0284c7';
        if (changePct > -15) return '#d97706';
        if (changePct > -35) return '#dc2626';
        return '#450a0a';
      }

      case 'sea_level': {
        const exposure = staticC.coastalExposureScore;
        const slr = simulationState.seaLevelRiseMeters;
        const threatIndex = exposure * slr;
        if (threatIndex < 0.05) return '#cbd5e1';
        if (threatIndex < 0.15) return '#0284c7';
        if (threatIndex < 0.30) return '#0ea5e9';
        if (threatIndex < 0.50) return '#06b6d4';
        return '#38bdf8';
      }

      case 'migration': {
        const push = dyn.pushFactor;
        if (push < 0.1) return '#cbd5e1';
        if (push < 0.25) return '#eab308';
        if (push < 0.45) return '#f97316';
        if (push < 0.65) return '#ef4444';
        return '#991b1b';
      }

      default:
        return '#cbd5e1';
    }
  };

  return (
    <div id="tour-worldmap" className="w-full rounded-xl bg-white border border-slate-200/90 p-4 shadow-xs flex flex-col gap-3">
      {/* 1. Barre supérieure : Calques biophysiques & Sélecteur de pastilles */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-sky-600" />
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-800">
            Planisphère EPSG:4326
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-xs text-slate-500">
            Natural Earth 110m vectoriel
          </span>
        </div>

        {/* Calques biophysiques commutables */}
        <div id="tour-map-metrics" className="flex flex-wrap items-center gap-1 bg-slate-100/90 p-1 rounded-lg border border-slate-200 text-xs">
          <div className="flex items-center">
            <button
              onClick={() => setActiveMetric('wet_bulb')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
                activeMetric === 'wet_bulb'
                  ? 'bg-rose-50 text-rose-800 font-semibold border border-rose-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Thermometer className="w-3.5 h-3.5" />
              <span>Thermomètre Mouillé (Tw)</span>
            </button>
            <TechTooltip term="stull" showIconOnly className="ml-0.5 mr-1" />
          </div>

          <div className="flex items-center">
            <button
              onClick={() => setActiveMetric('caloric_stress')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
                activeMetric === 'caloric_stress'
                  ? 'bg-amber-50 text-amber-800 font-semibold border border-amber-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Disponibilité alimentaire simulée</span>
            </button>
            <TechTooltip term="haber-bosch" showIconOnly className="ml-0.5 mr-1" />
          </div>

          <button
            onClick={() => setActiveMetric('mortality')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
              activeMetric === 'mortality'
                ? 'bg-purple-50 text-purple-800 font-semibold border border-purple-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Skull className="w-3.5 h-3.5" />
            <span>Estimation des décès : indisponible</span>
          </button>

          <button
            onClick={() => setActiveMetric('population')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
              activeMetric === 'population'
                ? 'bg-sky-50 text-sky-800 font-semibold border border-sky-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Dépopulation</span>
          </button>

          <button
            onClick={() => setActiveMetric('sea_level')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
              activeMetric === 'sea_level'
                ? 'bg-cyan-50 text-cyan-800 font-semibold border border-cyan-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>Submersion</span>
          </button>

          <button
            onClick={() => setActiveMetric('migration')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
              activeMetric === 'migration'
                ? 'bg-orange-50 text-orange-800 font-semibold border border-orange-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Exode</span>
          </button>
        </div>

        {/* Bouton Explicatif Scientifique pour les Zones Vertes en 2100-2200 */}
        <button
          onClick={() => setShowGreenZonesModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 transition-colors shadow-2xs cursor-pointer ml-auto"
          title="Pourquoi certaines régions (Canada, Scandinavie, etc.) restent vertes en 2100 et 2200 ? Explication basée sur le GIEC AR6"
        >
          <TreePine className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">Pourquoi des zones restent vertes en 2100 & 2200 ?</span>
          <span className="sm:hidden">Zones vertes ?</span>
        </button>
      </div>

      {/* Bannière d'alerte contextuelle si l'utilisateur explore au-delà de 2100 (2100–2200) */}
      {simulationState.year > 2100 && (
        <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 flex flex-wrap items-center justify-between gap-2.5 text-xs text-purple-900 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded font-mono font-bold bg-purple-100 text-purple-800 border border-purple-300 text-[11px]">
              Horizon Séculaire {simulationState.year}
            </span>
            <span>
              <strong>Résultat de la simulation CLIMATOPEDY pour {simulationState.year} :</strong> niveau marin simulé : <strong>+{(simulationState.seaLevelRiseMeters * 100).toFixed(0)} cm</strong>. Cette valeur dépend des paramètres du modèle; la précision affichée n’est pas une validation régionale et ce n’est pas une projection officielle du GIEC.
            </span>
          </div>
          <button
            onClick={() => setShowGreenZonesModal(true)}
            className="px-2.5 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-semibold border border-purple-300 transition-colors cursor-pointer"
          >
            Fiche scientifique 2100–2200
          </button>
        </div>
      )}

      {/* 2. SYSTÈME D'ALERTES VISUELLES DE STRESS THERMIQUE 'STULL TW' */}
      <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-3 shadow-2xs flex flex-col gap-2.5">
        {/* Ligne 1 : Interrupteur d'alerte, sélection du seuil critique et statut */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Titre & Bouton d'activation */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setHeatAlertsEnabled(!heatAlertsEnabled)}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-semibold transition-all border cursor-pointer ${
                heatAlertsEnabled
                  ? 'bg-rose-50 text-rose-800 border-rose-300 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
              }`}
              title="Activer ou désactiver les alertes visuelles sur la carte"
            >
              {heatAlertsEnabled ? (
                <>
                  <BellRing className="w-4 h-4 text-rose-600 animate-bounce" />
                  <span>Alertes Visuelles : ACTIVES</span>
                </>
              ) : (
                <>
                  <Radio className="w-4 h-4 text-slate-400" />
                  <span>Alertes : En Veille</span>
                </>
              )}
            </button>

            <span className="text-slate-300 hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-slate-700 font-medium">
                Seuil Chaleur Humide Ressentie (Tw) :
              </span>
              <span
                className="text-[10px] text-sky-800 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200 cursor-help"
                title="Tw (température au thermomètre mouillé) combine la température de l'air et l'humidité. Formule approximative de Stull (2011). Tw ne constitue pas à elle seule un seuil universel de mortalité."
              >
                Stull Tw ?
              </span>
            </div>
          </div>

          {/* Sélecteur de seuil critique Stull Tw */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
            {/* Décrémenter seuil */}
            <button
              onClick={() => setHeatAlertThreshold((prev) => Math.max(26.0, Number((prev - 0.5).toFixed(1))))}
              className="p-1 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              title="Diminuer le seuil de 0.5°C"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            {/* Presets rapides de seuils */}
            <div className="flex items-center gap-1">
              {[
                { val: 29.0, label: '≥29° (Repère)', tip: 'Repère de Tw utilisé par le modèle; cette valeur seule ne détermine pas les effets sur la santé.' },
                { val: 31.0, label: '≥31° (Alerte modèle)', tip: 'Seuil d’alerte configuré dans CLIMATOPEDY; ce n’est pas un seuil universel de mortalité.' },
                { val: 32.0, label: '≥32° (Alerte modèle)', tip: 'Alerte configurée dans le modèle; Tw seule ne définit pas un seuil de survie ni un besoin de climatisation.' },
                { val: 34.0, label: '≥34° (Alerte modèle)', tip: 'Valeur élevée de Tw; les effets physiologiques dépendent de l’exposition et des personnes.' },
                { val: 35.0, label: '≥35° (Repère)', tip: 'Valeur étudiée dans la littérature pour une exposition prolongée; ce n’est pas un seuil universel de mortalité.' }
              ].map((preset) => (
                <button
                  key={preset.val}
                  onClick={() => setHeatAlertThreshold(preset.val)}
                  title={preset.tip}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all cursor-pointer ${
                    heatAlertThreshold === preset.val
                      ? 'bg-rose-600 text-white font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Incrémenter seuil */}
            <button
              onClick={() => setHeatAlertThreshold((prev) => Math.min(38.0, Number((prev + 0.5).toFixed(1))))}
              className="p-1 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              title="Augmenter le seuil de 0.5°C"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>

            <span className="px-2 py-0.5 bg-rose-50 border border-rose-200 rounded text-rose-800 font-mono font-bold text-xs ml-1">
              {heatAlertThreshold.toFixed(1)}°C
            </span>
          </div>

          {/* Bilan du déclenchement */}
          <div className="flex items-center gap-2">
            {heatAlertsEnabled ? (
              thermalAnalysis.alertCount > 0 ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-50 border border-rose-300 text-rose-800">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                  <span className="font-semibold font-mono">
                    {thermalAnalysis.alertCount} pays en alerte ({ (thermalAnalysis.alertPop / 1000).toFixed(2) } Md hab.)
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Aucun pays &ge; {heatAlertThreshold.toFixed(1)}°C</span>
                </div>
              )
            ) : (
              <span className="text-slate-400 font-mono text-[11px]">Alertes visuelles en pause</span>
            )}

            {/* Sélecteur de badges permanents */}
            <div className="flex items-center gap-1 bg-white p-0.5 rounded border border-slate-200 text-[10.5px]">
              <span className="text-slate-500 px-1 flex items-center gap-1">
                <Eye className="w-2.5 h-2.5" /> Pins :
              </span>
              <button
                onClick={() => setTwOverlayMode('aboveTwAlertThreshold')}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${
                  twOverlayMode === 'aboveTwAlertThreshold' ? 'bg-rose-600 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Alerte Tw du modèle (&ge;31°)
              </button>
              <button
                onClick={() => setTwOverlayMode('off')}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${
                  twOverlayMode === 'off' ? 'bg-slate-200 text-slate-800 font-semibold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Masquer
              </button>
            </div>
          </div>
        </div>

        {/* Ligne 2 : Bandeau d'alerte et pilules cliquables des pays en dépassement */}
        {heatAlertsEnabled && thermalAnalysis.alertCount > 0 && (
          <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-rose-800 flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                Régions où la Tw simulée dépasse le seuil configuré ({heatAlertThreshold.toFixed(1)}°C) :
              </span>
            </div>

            {/* Pilules cliquables des pays en alerte */}
            <div className="flex flex-wrap items-center gap-1.5">
              {thermalAnalysis.alertList.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectCountry(item.id)}
                  title={`Cliquer pour inspecter ${item.name} (Tmax canicule: ${item.summerMax.toFixed(1)}°C, HR: ${item.summerRh}%)`}
                  className={`px-2 py-0.5 rounded-full text-[11px] font-mono border transition-all flex items-center gap-1 ${
                    selectedCountryId === item.id
                      ? 'bg-rose-600 text-white border-rose-700 shadow-sm'
                      : item.tw >= 35.0
                      ? 'bg-purple-100 text-purple-900 border-purple-300 hover:bg-purple-200'
                      : 'bg-rose-100 text-rose-900 border-rose-300 hover:bg-rose-200'
                  }`}
                >
                  <span>{item.name}</span>
                  <span className="font-bold text-slate-900 bg-white/90 px-1 rounded shadow-2xs">
                    {item.tw >= 35.0 ? '☠️' : '🚨'} {item.tw.toFixed(1)}°C
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. DISPOSITION PRINCIPALE EN 2 ZONES : PLANISPHÈRE (GAUCHE) + COLONNE BIOPHYSIQUE EN DIRECT (DROITE) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* ========================================================= */}
        {/* ZONE GAUCHE : PLANISPHÈRE MONDIAL NET ET VECTORIEL        */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 xl:col-span-9 relative bg-[#e0f0f7] rounded-xl border border-slate-200 p-2 overflow-hidden flex flex-col justify-between shadow-xs lg:h-[520px] lg:max-h-[520px]">
          <svg
            viewBox="0 0 1000 500"
            className="w-full h-auto block select-none"
            style={{ maxHeight: '465px' }}
          >
            <defs>
              {/* Grille océanique bathymétrique */}
              <pattern id="oceanGridClear" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#c8e2ed" strokeWidth="0.6" />
              </pattern>

              {/* Hachures du seuil d'alerte Tw */}
              <pattern id="aboveTwAlertThresholdStripe" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="10" stroke="#dc2626" strokeWidth="2.5" opacity="0.6" />
              </pattern>

              {/* Hachures d'alerte critique de stress thermique Stull Tw (Haute visibilité) */}
              <pattern id="heatAlertHazardStripe" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <rect width="10" height="10" fill="none" />
                <line x1="0" y1="0" x2="0" y2="10" stroke="#e11d48" strokeWidth="3" opacity="0.8" />
              </pattern>

              {/* Halo d'alerte lumineuse pour pays en dépassement critique */}
              <filter id="alertGlowNeon" x="-25%" y="-25%" width="150%" height="150%">
                <feDropShadow dx="0" dy="0" stdDeviation="3.2" floodColor="#f43f5e" floodOpacity="0.8" />
              </filter>

              {/* Arcs migratoires */}
              <linearGradient id="migrGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.5" />
              </linearGradient>

              {/* Dôme thermique intertropical */}
              <linearGradient id="equatorialMesh" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0" />
                <stop offset="35%" stopColor="#f43f5e" stopOpacity={Math.min(0.2, simulationState.surfaceTemperatureAnomaly * 0.04)} />
                <stop offset="50%" stopColor="#ea580c" stopOpacity={Math.min(0.3, simulationState.surfaceTemperatureAnomaly * 0.06)} />
                <stop offset="65%" stopColor="#f43f5e" stopOpacity={Math.min(0.2, simulationState.surfaceTemperatureAnomaly * 0.04)} />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Océan lumineux et doux avec gestionnaire de temporisation apaisée */}
            <rect width="1000" height="500" fill="#e2f1f8" onPointerEnter={onOceanPointerEnter} />
            <rect width="1000" height="500" fill="url(#oceanGridClear)" opacity="0.9" className="pointer-events-none" />

            {/* Bande de chaleur équatoriale */}
            <rect y="160" width="1000" height="180" fill="url(#equatorialMesh)" className="pointer-events-none" />

            {/* Parallèles géographiques discrets */}
            <line x1="0" y1="250" x2="1000" y2="250" stroke="#64748b" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.4" />
            <text x="10" y="246" fill="#475569" fontSize="8" fontFamily="monospace">Équateur 0°</text>

            <line x1="0" y1="184.7" x2="1000" y2="184.7" stroke="#64748b" strokeWidth="0.6" strokeDasharray="2,4" opacity="0.35" />
            <text x="10" y="181" fill="#475569" fontSize="7" fontFamily="monospace">Tropique +23.5°</text>

            <line x1="0" y1="315.3" x2="1000" y2="315.3" stroke="#64748b" strokeWidth="0.6" strokeDasharray="2,4" opacity="0.35" />
            <text x="10" y="311" fill="#475569" fontSize="7" fontFamily="monospace">Tropique -23.5°</text>

            <line x1="500" y1="0" x2="500" y2="500" stroke="#64748b" strokeWidth="0.6" strokeDasharray="2,4" opacity="0.3" />
            <text x="504" y="14" fill="#475569" fontSize="7" fontFamily="monospace">0° Greenwich</text>

            {/* SOCLE CONTINENTAL MONDIAL UNIFIÉ (Natural Earth 110m) */}
            <path
              d={WORLD_LAND_PATH}
              fill="#e2e8f0"
              stroke="#cbd5e1"
              strokeWidth="0.5"
              className="pointer-events-none"
            />

            {/* PAYS DU MONDE AVEC FRONTIÈRES NETTES, SYSTÈME D'ALERTE VISUELLE ET SURVOL FLUIDE */}
            {GEO_COUNTRY_FEATURES.map((feature) => {
              const isSelected = selectedCountryId === feature.simCountryId;
              const isHovered = hoveredFeature?.id === feature.id;
              const dyn = simulationState.countries[feature.simCountryId];
              const tw = dyn ? dyn.wetBulbPeak : 0;
              const isInHeatAlert = heatAlertsEnabled && dyn && tw >= heatAlertThreshold;
              const isAboveTwAlertThreshold = dyn ? tw >= 31.0 : false;
              const fillColor = getCountryFillColor(feature.simCountryId);

              // Contour et style d'alerte
              let strokeColor = '#ffffff';
              let strokeW = 0.8;
              let strokeDash: string | undefined = undefined;

              if (isSelected) {
                strokeColor = '#0284c7';
                strokeW = 2.2;
              } else if (isInHeatAlert) {
                strokeColor = tw >= 35.0 ? '#9333ea' : tw >= 32.0 ? '#dc2626' : '#ea580c';
                strokeW = 2.0;
                strokeDash = '4,2.5';
              } else if (isHovered) {
                strokeColor = '#0f172a';
                strokeW = 1.4;
              }

              return (
                <g
                  key={feature.id}
                  className="cursor-pointer"
                  onClick={() => onSelectCountry(isSelected ? null : feature.simCountryId)}
                  onPointerEnter={() => onCountryPointerEnter(feature)}
                  onPointerLeave={onCountryPointerLeave}
                >
                  <path
                    d={feature.path}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={strokeW}
                    strokeDasharray={strokeDash}
                    fillOpacity={isHovered ? 1.0 : isSelected ? 0.95 : 0.88}
                    filter={
                      isSelected
                        ? 'drop-shadow(0 0 6px rgba(56, 189, 248, 0.85))'
                        : isInHeatAlert
                        ? 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.75))'
                        : undefined
                    }
                  />

                  {/* Superposition de hachures pour les seuils d'alerte Tw */}
                  {isInHeatAlert ? (
                    <path
                      d={feature.path}
                      fill="url(#heatAlertHazardStripe)"
                      className="pointer-events-none"
                    />
                  ) : isAboveTwAlertThreshold ? (
                    <path
                      d={feature.path}
                      fill="url(#aboveTwAlertThresholdStripe)"
                      className="pointer-events-none"
                    />
                  ) : null}
                </g>
              );
            })}


            {/* BALISES D'ALERTE VISUELLE D'URGENCE 'STULL TW' SUR LES CENTROÏDES DES PAYS */}
            {heatAlertsEnabled && (
              <g className="select-none">
                {COUNTRIES_DATA.map((staticC) => {
                  const dyn = simulationState.countries[staticC.id];
                  if (!dyn) return null;
                  const tw = dyn.wetBulbPeak;
                  if (tw < heatAlertThreshold) return null;

                  const [cx, cy] = SIM_CENTROIDS[staticC.id] || [500, 250];
                  const isExtreme = tw >= 35.0;
                  const isCritical = tw >= 32.0;
                  const isSelected = selectedCountryId === staticC.id;

                  const waveColor = isExtreme ? '#a855f7' : isCritical ? '#ef4444' : '#f59e0b';
                  const beaconBg = isExtreme ? '#3b0764' : isCritical ? '#881337' : '#78350f';
                  const beaconBorder = isSelected ? '#38bdf8' : isExtreme ? '#e9d5ff' : isCritical ? '#fda4af' : '#fef08a';

                  return (
                    <g
                      key={`heat-alert-beacon-${staticC.id}`}
                      transform={`translate(${cx}, ${cy})`}
                      className="cursor-pointer group"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCountry(staticC.id);
                      }}
                    >
                      {/* Onde radar pulsante d'alerte d'urgence (totalement transparente aux événements de survol) */}
                      <circle
                        cx="0"
                        cy="0"
                        r={isExtreme ? "22" : "18"}
                        fill={waveColor}
                        fillOpacity="0.45"
                        className="animate-ping pointer-events-none"
                      />
                      <circle
                        cx="0"
                        cy="0"
                        r={isExtreme ? "30" : "24"}
                        stroke={waveColor}
                        strokeWidth="1.4"
                        fill="none"
                        opacity="0.5"
                        className="animate-pulse pointer-events-none"
                      />

                      {/* Balise capsule d'alerte haute visibilité */}
                      <rect
                        x="-26"
                        y="-10"
                        width="52"
                        height="20"
                        rx="4"
                        fill={beaconBg}
                        stroke={beaconBorder}
                        strokeWidth={isSelected ? "2" : "1.2"}
                        filter="drop-shadow(0 3px 6px rgba(0,0,0,0.9))"
                        className="transition-transform group-hover:scale-110"
                      />
                      <text
                        x="0"
                        y="3.5"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="7.8"
                        fontWeight="800"
                        fontFamily="monospace"
                        className="pointer-events-none tracking-tight"
                      >
                        {isExtreme ? '☠️ ' : isCritical ? '🚨 ' : '⚠️ '}
                        {tw.toFixed(1)}°
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* BADGES DISCRETS SUR CARTE (Si activés dans les filtres pour les pays non alertés) */}
            {twOverlayMode !== 'off' && (
              <g className="pointer-events-none select-none">
                {COUNTRIES_DATA.map((staticC) => {
                  const dyn = simulationState.countries[staticC.id];
                  if (!dyn) return null;

                  const tw = dyn.wetBulbPeak;
                  // Si le pays a déjà une balise d'alerte active, on évite le doublon
                  if (heatAlertsEnabled && tw >= heatAlertThreshold) return null;

                  const isAboveTwAlertThreshold = tw >= 31.0;
                  const isCritical = tw >= 29.0;

                  if (twOverlayMode === 'aboveTwAlertThreshold' && !isAboveTwAlertThreshold) return null;
                  if (twOverlayMode === 'critical' && !isCritical) return null;

                  const [cx, cy] = SIM_CENTROIDS[staticC.id] || [500, 250];

                  const badgeBg = isAboveTwAlertThreshold
                    ? '#7f1d1d'
                    : tw >= 29.0
                    ? '#9a3412'
                    : tw >= 26.0
                    ? '#854d0e'
                    : '#064e3b';

                  const badgeBorder = isAboveTwAlertThreshold
                    ? '#f43f5e'
                    : tw >= 29.0
                    ? '#fb923c'
                    : '#10b981';

                  return (
                    <g key={`tw-pin-${staticC.id}`} transform={`translate(${cx}, ${cy})`}>
                      {isAboveTwAlertThreshold && (
                        <circle cx="0" cy="0" r="16" fill="#ef4444" fillOpacity="0.4" className="animate-ping" />
                      )}
                      <rect
                        x="-24"
                        y="-8"
                        width="48"
                        height="16"
                        rx="3"
                        fill={badgeBg}
                        stroke={badgeBorder}
                        strokeWidth="1"
                        filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))"
                      />
                      <text
                        x="0"
                        y="3"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="7.5"
                        fontWeight="700"
                        fontFamily="monospace"
                      >
                        {tw.toFixed(1)}°C
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* Pastille flottante dynamique sur le pays survolé */}
            {hoveredFeature && (
              (() => {
                const dyn = simulationState.countries[hoveredFeature.simCountryId];
                const staticC = COUNTRIES_DATA.find((c) => c.id === hoveredFeature.simCountryId);
                const centroid = SIM_CENTROIDS[hoveredFeature.simCountryId] || [500, 250];
                if (!dyn || !staticC) return null;
                const tw = dyn.wetBulbPeak;
                const isAlert = heatAlertsEnabled && tw >= heatAlertThreshold;
                const isLethal = tw >= 31.0;

                return (
                  <g
                    key={`hover-pin-${hoveredFeature.id}`}
                    transform={`translate(${centroid[0]}, ${centroid[1] - 12})`}
                    className="pointer-events-none select-none"
                  >
                    <rect
                      x="-48"
                      y="-16"
                      width="96"
                      height="18"
                      rx="3"
                      fill="#ffffff"
                      stroke={isAlert ? '#dc2626' : '#0284c7'}
                      strokeWidth="1.2"
                      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                    />
                    <text
                      x="0"
                      y="-3.5"
                      textAnchor="middle"
                      fill="#0f172a"
                      fontSize="8"
                      fontWeight="700"
                      fontFamily="monospace"
                    >
                      {staticC.frenchName} · {isLethal ? '☠️ ' : isAlert ? '🚨 ' : ''}{tw.toFixed(1)}°
                    </text>
                  </g>
                );
              })()
            )}
          </svg>

          {/* Badge Année en cours centré en bas sur la carte */}
          <div className="absolute bottom-12 sm:bottom-13 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none">
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-slate-300 shadow-md">
              <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse shrink-0" />
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Année</span>
              <span className="text-base sm:text-lg font-black font-mono text-slate-900 tabular-nums">
                {displayYear}
              </span>
            </div>
          </div>

          {/* Légende horizontale en bas du planisphère */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 px-2 pt-2 border-t border-slate-200 mt-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800 text-[11px]">Échelle Stull Tw :</span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-sky-700 font-mono">&lt;14°C Boréal</span>
                <span className="text-[10px] text-emerald-700 font-mono">22°C Vivable</span>
                <div className="h-2 w-20 rounded bg-gradient-to-r from-sky-600 via-emerald-500 to-rose-600" />
                <span className="text-[10px] text-rose-700 font-bold font-mono">&ge;31.0°C Seuil d’alerte du modèle</span>
              </div>
            </div>

            <span className="text-[11px] text-slate-500 font-mono">
              Survolez un pays pour mettre à jour la colonne de droite · Cliquez pour épingler
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ZONE DROITE : COLONNE D'ANALYSE BIOPHYSIQUE EN TEMPS RÉEL */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col bg-white border border-slate-200/90 rounded-xl p-3 shadow-xs justify-between lg:h-[520px] lg:max-h-[520px] overflow-y-auto">
          {activeCountryData ? (
            // CAS A : UN PAYS EST SURVOLÉ OU ÉPINGLÉ
            (() => {
              const dyn = simulationState.countries[activeCountryData.id];
              if (!dyn) return null;

              const tw = dyn.wetBulbPeak;
              const isAboveTwAlertThreshold = tw >= 31.0;
              const isSevere = tw >= 29.0 && tw < 31.0;
              const isWarning = tw >= 26.0 && tw < 29.0;
              const popChangePct = ((dyn.cohorts.total - activeCountryData.basePop2026) / activeCountryData.basePop2026) * 100;
              const isFamine = dyn.calPerCapita < 2100;

              return (
                <div className="flex flex-col gap-3 h-full justify-between">
                  <div>
                    <p className="mb-2 text-[9.5px] text-slate-500">
                      Valeurs calculées par CLIMATOPEDY pour {displayYear}; elles dépendent des paramètres du modèle. Les décimales affichées ne sont pas une précision locale validée.
                    </p>
                    {/* Statut du panneau (Survol vs Épinglé) avec bouton de fermeture */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${hoveredFeature ? 'bg-sky-500 animate-pulse' : 'bg-amber-500'}`} />
                        <span className="text-[10.5px] uppercase tracking-wider font-semibold text-slate-600">
                          {hoveredFeature ? 'Analyse en Direct (Survol)' : 'Territoire Sélectionné'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10.5px] font-mono text-sky-800 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200 font-semibold">
                          {activeCountryData.code}
                        </span>
                        {selectedCountryId && (
                          <button
                            onClick={() => onSelectCountry(null)}
                            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 text-[10.5px] transition-colors cursor-pointer"
                            title="Désélectionner ce pays et revenir à la vue globale"
                          >
                            <X className="w-3 h-3" />
                            <span>Désélectionner</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Nom du pays & Région */}
                    <div className="mt-2 mb-2.5">
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-base font-bold text-slate-900 tracking-tight">
                          {activeCountryData.frenchName}
                        </h3>
                        {activeFeature?.name && activeFeature.name !== activeCountryData.name && (
                          <span className="text-xs text-slate-500">
                            ({activeFeature.name})
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {activeCountryData.region} · Année {Math.floor(simulationState.year)}
                      </span>
                    </div>

                    {/* BANNIÈRE D'ALERTE DE STRESS THERMIQUE CRITIQUE SI SEUIL DÉPASSÉ */}
                    {heatAlertsEnabled && tw >= heatAlertThreshold && (
                      <div className="mb-2.5 p-2.5 rounded-lg bg-rose-50 border border-rose-300 shadow-2xs text-xs space-y-1.5 animate-pulse">
                        <div className="flex items-center gap-1.5">
                          <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                          <span className="font-bold text-rose-900 text-[11px] uppercase tracking-wide">
                            🚨 Seuil d’alerte Tw dépassé ({heatAlertThreshold.toFixed(1)}°C)
                          </span>
                        </div>
                        <p className="text-[10.5px] text-rose-800 leading-snug">
                          Au pic estival simulé ({dyn.summerMaxTemp.toFixed(1)}°C / {dyn.summerHumidity}% humidité), Tw calculée atteint <strong>{tw.toFixed(1)}°C</strong>. Cette sortie du modèle n'est pas une estimation médicale de mortalité.
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-rose-900 pt-1 border-t border-rose-200 font-mono">
                          <span>Population de la région sélectionnée : <strong>{dyn.cohorts.total.toFixed(0)} M</strong></span>
                          <span>Enfants et aînés dans cette région : <strong>{(dyn.cohorts.p0 + dyn.cohorts.p2).toFixed(0)} M</strong></span>
                        </div>
                        <p className="text-[9.5px] text-rose-800">Ces effectifs correspondent à la population simulée de cette région; ce n’est pas un décompte de personnes exposées ni une estimation sanitaire.</p>
                      </div>
                    )}

                    {/* BLOC 1 : INDICE DE CHALEUR HUMIDE RESSENTIE */}
                    <div
                      className={`p-2.5 rounded-lg border mb-2.5 space-y-1.5 ${
                        isAboveTwAlertThreshold
                          ? 'bg-rose-50 border-rose-300 text-rose-950 shadow-2xs'
                          : isSevere
                          ? 'bg-amber-50 border-amber-300 text-amber-950'
                          : isWarning
                          ? 'bg-yellow-50 border-yellow-300 text-yellow-950'
                          : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-semibold text-slate-800 flex items-center gap-1.5">
                            <Flame className="w-4 h-4 text-rose-600" />
                            <span>Chaleur Humide Ressentie (Tw)</span>
                          </span>
                          <span className="text-[9.5px] text-slate-600 block mt-0.5">
                            Pic estival à {dyn.summerMaxTemp.toFixed(1)}°C · {dyn.summerHumidity}% humidité (Formule Stull)
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-mono font-bold text-slate-900 tabular-nums">
                            {tw.toFixed(1)}°C
                          </span>
                          {heatAlertsEnabled && tw >= heatAlertThreshold && (
                            <span className="block text-[9.5px] font-mono text-rose-700 font-bold">
                              &gt; Seuil {heatAlertThreshold.toFixed(1)}°C ⚠️
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Jauge graphique de Tw par rapport au seuil d'alerte du modèle */}
                      <div className="space-y-1">
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex relative">
                          <div
                            className={`h-full transition-all duration-300 ${
                              tw >= 35.0 ? 'bg-purple-600' : isAboveTwAlertThreshold ? 'bg-rose-600' : isSevere ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(5, ((tw - 10) / 25) * 100))}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[9px] font-mono text-slate-500">
                          <span>10°C</span>
                          <span className="text-rose-700 font-semibold">Seuil du modèle 31°C</span>
                          <span className={heatAlertThreshold === 32.0 ? 'text-amber-800 font-bold' : ''}>
                            {heatAlertThreshold.toFixed(1)}°C (Seuil)
                          </span>
                          <span>35°C</span>
                        </div>
                      </div>

                      {/* Lecture du seuil de Tw dans le modèle */}
                      <div className="pt-0.5 text-[11px] font-semibold">
                        {isAboveTwAlertThreshold ? (
                          <p className="text-rose-800 leading-tight">
                            Tw simulée ≥ 31°C; seuil d’alerte utilisé dans CLIMATOPEDY.
                          </p>
                        ) : isSevere ? (
                          <p className="text-amber-800 leading-tight">
                            Tw simulée comprise entre 29°C et 31°C; plage de seuils du modèle.
                          </p>
                        ) : isWarning ? (
                          <p className="text-yellow-800 leading-tight">
                            Tw simulée comprise entre 26°C et 29°C; plage de valeurs affichée par le modèle.
                          </p>
                        ) : (
                          <p className="text-emerald-800 leading-tight">
                            Tw simulée inférieure à 26°C; valeur calculée par le modèle.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* BLOC 2 : MÉTRIQUES CLIMATIQUES & DÉMOGRAPHIQUES SIMPLIFIÉES */}
                    <div className="space-y-1.5 text-xs">
                      {(() => {
                        const climate = climateRows.get(activeCountryData.id);
                        return climate ? <>
                      {/* Pic caniculaire estival */}
                      <div className="flex justify-between items-center py-1 border-b border-slate-100">
                        <span className="text-slate-600 flex items-center gap-1">
                          <Sun className="w-3.5 h-3.5 text-amber-600" />
                          Pic chaud P99 estimé
                        </span>
                        <span className="font-mono text-amber-800 tabular-nums font-semibold">
                          {dyn.summerMaxTemp.toFixed(1)}°C{' '}
                          <span className="text-slate-500 font-normal text-[10.5px]">
                            (normale 1991–2020)
                          </span>
                        </span>
                      </div>

                      {/* Moyenne annuelle des températures maximales quotidiennes */}
                      <div className="flex justify-between items-center py-1 border-b border-slate-100">
                        <span className="text-slate-600 flex items-center gap-1">
                          <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                          Moy. des maximales quotidiennes (estimée)
                        </span>
                        <span className="font-mono text-rose-800 tabular-nums font-medium">
                          {climate.annualMeanDailyMaxTempC.toFixed(1)}°C
                        </span>
                      </div>

                      {/* Moyenne annuelle des températures minimales quotidiennes */}
                      <div className="flex justify-between items-center py-1 border-b border-slate-100">
                        <span className="text-slate-600 flex items-center gap-1">
                          <Thermometer className="w-3.5 h-3.5 text-indigo-500" />
                          Moy. des minimales quotidiennes (estimée)
                        </span>
                        <span className="font-mono text-indigo-800 tabular-nums font-medium">
                          {climate.annualMeanDailyMinTempC.toFixed(1)}°C
                        </span>
                      </div>

                      {/* Humidité relative caniculaire */}
                      <div className="flex justify-between items-center py-1 border-b border-slate-100">
                        <span className="text-slate-600 flex items-center gap-1">
                          <Droplets className="w-3.5 h-3.5 text-sky-600" />
                          Humidité estimée du P99
                        </span>
                        <span className="font-mono text-sky-800 tabular-nums font-medium">
                          {dyn.summerHumidity.toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-[9.5px] leading-snug text-slate-500">
                        Normales 1991–2020 d’un point NASA POWER/MERRA-2 représentatif, pas une moyenne nationale. P99 et humidité sont estimés; le record absolu est affiché dans la fiche pays s’il est sourcé.
                      </p>

                      {activeCountryData.id === 'fra' && displayYear === 2026 && (
                        <p className="text-[9.5px] leading-snug text-sky-900 bg-sky-50 border border-sky-100 rounded-lg p-2">
                          Été 2026 observé : 24,0 °C de moyenne sur 24 h (+3,6 °C à la normale) et 53 jours en vague de chaleur. C’est un bilan saisonnier, pas une moyenne annuelle.{' '}
                          <a className="underline font-medium" href="https://meteofrance.com/presse/bilan-climatique-de-lete-2026-juin-juillet-aout" target="_blank" rel="noreferrer">Météo-France</a>
                        </p>
                      )}

                      {/* Température moyenne annuelle */}
                      <div className="flex justify-between items-center py-1 border-b border-slate-100">
                        <span className="text-slate-600 flex items-center gap-1">
                          <Thermometer className="w-3.5 h-3.5 text-slate-500" />
                          {displayYear === 2026
                            ? 'Moyenne annuelle (1991–2020) · proxy'
                            : 'Moyenne annuelle simulée'}
                        </span>
                        <span className="font-mono text-slate-800 tabular-nums font-medium">
                          {dyn.dryBulbTemp.toFixed(1)}°C{' '}
                          <span className="text-slate-500 font-normal text-[10.5px]">
                            (point représentatif)
                          </span>
                        </span>
                      </div>
                      </> : null;
                      })()}

                      {/* Population résidente */}
                      <div className="flex justify-between items-center py-1 border-b border-slate-100">
                        <span className="text-slate-600">Nombre d'habitants</span>
                        <div className="text-right font-mono">
                          <span className="font-semibold text-slate-900 tabular-nums">
                            {dyn.cohorts.total.toFixed(1)} M
                          </span>
                          <span
                            className={`ml-1.5 text-[11px] font-semibold tabular-nums ${
                              popChangePct < 0 ? 'text-rose-700' : 'text-emerald-700'
                            }`}
                          >
                            {popChangePct > 0 ? `+${popChangePct.toFixed(1)}%` : `${popChangePct.toFixed(1)}%`}
                          </span>
                        </div>
                      </div>

                      {/* Ration alimentaire */}
                      <div className="flex justify-between items-center py-1 border-b border-slate-100">
                        <span className="text-slate-600">Disponibilité alimentaire simulée</span>
                        <span
                          className={`font-mono tabular-nums font-medium ${
                            isFamine ? 'text-rose-700 font-bold' : 'text-emerald-700'
                          }`}
                        >
                          {Math.round(dyn.calPerCapita)} kcal/j {isFamine && '(sous le repère interne)'}
                        </span>
                      </div>

                      <div className="py-1 border-b border-slate-100 text-[10px] text-rose-800">Les décès ne sont pas estimés : le calcul interne n’est pas validé par des données sanitaires.</div>

                      <div className="py-1 border-b border-slate-100 text-[10px] text-slate-500">La carte n’estime pas de nombre de personnes déplacées.</div>

                      {/* Pyramide des âges */}
                      <div className="pt-1.5">
                        <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                          <span>Tranches d'âge de la population</span>
                          <span className="font-mono text-slate-700 text-[10.5px]">
                            {Math.round(dyn.cohorts.p0)}M enf. / {Math.round(dyn.cohorts.p1)}M act. / {Math.round(dyn.cohorts.p2)}M aînés
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded flex overflow-hidden">
                          <div
                            className="bg-sky-500 h-full"
                            style={{ width: `${(dyn.cohorts.p0 / dyn.cohorts.total) * 100}%` }}
                            title="0-14 ans (Enfants)"
                          />
                          <div
                            className="bg-blue-600 h-full"
                            style={{ width: `${(dyn.cohorts.p1 / dyn.cohorts.total) * 100}%` }}
                            title="15-64 ans (Actifs)"
                          />
                          <div
                            className="bg-purple-600 h-full"
                            style={{ width: `${(dyn.cohorts.p2 / dyn.cohorts.total) * 100}%` }}
                            title="65+ ans (Aînés)"
                          />
                        </div>
                        <div className="flex justify-between text-[9.5px] text-slate-600 mt-1 font-medium">
                          <span className="text-sky-700">Enfants (0-14 ans)</span>
                          <span className="text-blue-700">Actifs (15-64 ans)</span>
                          <span className="text-purple-700">Aînés (65+ ans)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bouton d'inspection granulaire */}
                  <button
                    onClick={() => onSelectCountry(activeCountryData.id)}
                    className="w-full mt-2 py-2 px-3 bg-sky-50 hover:bg-sky-100 text-sky-800 font-semibold text-xs rounded-lg border border-sky-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <span>Ouvrir l'inspecteur complet</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })()
          ) : (
            // CAS B : AUCUN PAYS SURVOLÉ NI SÉLECTIONNÉ -> BILAN PLANÉTAIRE GLOBAL (TERRE)
            <div className="flex flex-col gap-3 h-full justify-between">
              <div>
                {/* En-tête Global */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <Globe2 className="w-4 h-4 text-sky-600" />
                    <span className="text-xs uppercase tracking-wider font-semibold text-slate-800">
                      Bilan Planétaire Global
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    {Math.floor(simulationState.year)}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 mt-2 mb-3 leading-relaxed">
                  Survolez n'importe quel pays sur le planisphère pour afficher ses indicateurs biophysiques en direct.
                </p>

                {/* Métriques globales en cartes compactes */}
                <div className="space-y-2.5">
                  {/* Population mondiale */}
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-sky-600" />
                        Population des zones simulées
                      </span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {(simulationState.worldPopulation / 1000).toFixed(2)} Md
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10.5px]">
                      <span className="text-slate-500">Base du modèle (34 zones) : 7,597 Md</span>
                      <span
                        className={`font-mono ${
                          simulationState.worldPopulation < 7597 ? 'text-rose-700' : 'text-emerald-700'
                        }`}
                      >
                        {simulationState.worldPopulation < 7597 ? (
                          <span className="flex items-center gap-0.5">
                            <TrendingDown className="w-3 h-3" />
                            -{(7597 - simulationState.worldPopulation).toFixed(0)} M
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5">
                            <TrendingUp className="w-3 h-3" />
                            +{(simulationState.worldPopulation - 7597).toFixed(0)} M
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Régions signalées au seuil Tw du modèle */}
                  <div
                    className={`p-2.5 rounded-lg border space-y-1 ${
                      thermalAnalysis.aboveTwAlertThresholdCount > 0
                        ? 'bg-rose-50 border-rose-300'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-800 flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-rose-600" />
                        Régions au-dessus du seuil Tw du modèle ({heatAlertThreshold.toFixed(1)}°C)
                      </span>
                      <span
                        className={`font-mono font-bold text-sm ${
                          thermalAnalysis.aboveTwAlertThresholdCount > 0 ? 'text-rose-800' : 'text-emerald-700'
                        }`}
                      >
                        {thermalAnalysis.aboveTwAlertThresholdCount} région(s)
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-600 leading-tight">
                      {thermalAnalysis.aboveTwAlertThresholdCount > 0
                        ? `${(thermalAnalysis.aboveTwAlertThresholdPop / 1000).toFixed(2)} Md de personnes résident dans les régions signalées; ce n’est pas une estimation de population exposée ou menacée.`
                        : 'Aucune région signalée au-dessus du seuil configuré dans le modèle.'}
                    </p>
                  </div>

                  {/* Réchauffement de surface FaIR */}
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 flex items-center gap-1.5">
                        <Thermometer className="w-3.5 h-3.5 text-rose-600" />
                        <span>Réchauffement Mondial</span>
                        <span
                          className="text-[9px] text-sky-800 bg-sky-50 px-1 py-0.5 rounded border border-sky-200 cursor-help font-mono"
                          title="FaIR (Finite Amplitude Impulse Response) est le modèle climatique simplifié officiel du GIEC (AR6) simulant la hausse de température due aux émissions."
                        >
                          FaIR ?
                        </span>
                      </span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        +{simulationState.surfaceTemperatureAnomaly.toFixed(2)}°C
                      </span>
                    </div>
                    <div className="flex justify-between text-[10.5px] text-slate-500">
                      <span>CO₂ atmosphérique :</span>
                      <span className="font-mono text-slate-700">
                        {simulationState.atmosphericCo2Ppm.toFixed(0)} ppm
                      </span>
                    </div>
                  </div>

                  {/* Rendement de l'énergie et part nette utile */}
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-600" />
                        Rendement de l'Énergie
                      </span>
                      <span className="font-mono font-bold text-amber-800 text-sm">
                        x{simulationState.currentEroi.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10.5px] text-slate-500">
                      <span>Barils obtenus pour 1 dépensé :</span>
                      <span className="font-mono text-amber-800 font-semibold">
                        {simulationState.currentEroi.toFixed(1)} barils
                      </span>
                    </div>
                    <div className="flex justify-between text-[10.5px] text-slate-500">
                      <span>Énergie utile pour la société :</span>
                      <span className="font-mono text-emerald-700 font-semibold">
                        {(simulationState.netEnergyRatio * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Raccourci d'aide */}
              <div className="p-2 rounded bg-slate-50 border border-slate-200 text-[10.5px] text-slate-500 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>Déplacez la souris sur un continent pour inspecter ses métriques.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Scientifique explicative des zones vertes */}
      <GreenZonesScientificModal
        isOpen={showGreenZonesModal}
        onClose={() => setShowGreenZonesModal(false)}
        currentYear={simulationState.year}
      />
    </div>
  );
};
