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
  X
} from 'lucide-react';

interface WorldMapProps {
  simulationState: GlobalBiophysicalState;
  selectedCountryId: string | null;
  onSelectCountry: (countryId: string | null) => void;
}

type TwOverlayMode = 'uninhabitable' | 'critical' | 'all' | 'off';

export const WorldMap: React.FC<WorldMapProps> = ({
  simulationState,
  selectedCountryId,
  onSelectCountry
}) => {
  const [activeMetric, setActiveMetric] = useState<MetricLayer>('wet_bulb');
  const [twOverlayMode, setTwOverlayMode] = useState<TwOverlayMode>('uninhabitable');
  const [hoveredFeature, setHoveredFeature] = useState<ProcessedCountryFeature | null>(null);

  // Système d'alertes visuelles de stress thermique Stull Tw (Seuil critique configurable, ex: >32.0°C)
  const [heatAlertThreshold, setHeatAlertThreshold] = useState<number>(32.0);
  const [heatAlertsEnabled, setHeatAlertsEnabled] = useState<boolean>(true);
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
    let uninhabitableCount = 0;
    let uninhabitablePop = 0;
    let criticalCount = 0;
    let alertCount = 0;
    let alertPop = 0;
    let extremeCount = 0; // Tw >= 35°C

    const uninhabitableList: Array<{ id: string; name: string; tw: number; pop: number }> = [];
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
        uninhabitableCount++;
        uninhabitablePop += dyn.cohorts.total;
        uninhabitableList.push({ id: c.id, name: c.frenchName, tw, pop: dyn.cohorts.total });
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

    uninhabitableList.sort((a, b) => b.tw - a.tw);
    alertList.sort((a, b) => b.tw - a.tw);

    return {
      uninhabitableCount,
      uninhabitablePop,
      criticalCount,
      alertCount,
      alertPop,
      extremeCount,
      alertList,
      uninhabitableList
    };
  }, [simulationState, heatAlertThreshold]);

  // Nuancier biophysique scientifique continu et contrasté (Élimine le monochrome sombre)
  const getCountryFillColor = (simId: string): string => {
    const dyn = simulationState.countries[simId];
    const staticC = COUNTRIES_DATA.find((c) => c.id === simId);
    if (!dyn || !staticC) return '#1e293b';

    switch (activeMetric) {
      case 'wet_bulb': {
        const tw = dyn.wetBulbPeak;
        // Échelle thermodynamique Roland Stull (2011) progressive par bandes climatiques
        if (tw < 8.0) return '#0369a1'; // Froid arctique/boréal (Bleu franc)
        if (tw < 14.0) return '#0284c7'; // Tempéré froid (Bleu ciel profond)
        if (tw < 18.0) return '#0891b2'; // Tempéré doux (Cyan-bleu)
        if (tw < 22.0) return '#0d9488'; // Tempéré chaud / Méditerranée (Sarcelle)
        if (tw < 25.0) return '#059669'; // Subtropical vivable (Émeraude)
        if (tw < 27.0) return '#ca8a04'; // Début d'inconfort thermique (Jaune ambre)
        if (tw < 29.0) return '#ea580c'; // Stress thermique élevé (Orange vif)
        if (tw < 31.0) return '#dc2626'; // Danger thermique sévère (Rouge vif)
        if (tw < 33.0) return '#991b1b'; // SEUIL LÉTAL DÉPASSÉ (Rouge cramoisi)
        return '#581c87'; // Effondrement métabolique immédiat (Pourpre létal)
      }

      case 'caloric_stress': {
        const cal = dyn.calPerCapita;
        if (cal >= 3200) return '#059669';
        if (cal >= 2700) return '#10b981';
        if (cal >= 2300) return '#eab308';
        if (cal >= 2100) return '#f97316';
        if (cal >= 1800) return '#ef4444'; // Famine sous 2100 kcal
        return '#7f1d1d';
      }

      case 'mortality': {
        const ratePer1000 = dyn.mortalityRates.total * 1000;
        if (ratePer1000 < 8) return '#0284c7';
        if (ratePer1000 < 14) return '#0d9488';
        if (ratePer1000 < 22) return '#eab308';
        if (ratePer1000 < 35) return '#ea580c';
        if (ratePer1000 < 60) return '#dc2626';
        return '#581c87';
      }

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
        if (threatIndex < 0.05) return '#1e293b';
        if (threatIndex < 0.15) return '#0369a1';
        if (threatIndex < 0.30) return '#0284c7';
        if (threatIndex < 0.50) return '#06b6d4';
        return '#38bdf8';
      }

      case 'migration': {
        const push = dyn.pushFactor;
        if (push < 0.1) return '#1e293b';
        if (push < 0.25) return '#ca8a04';
        if (push < 0.45) return '#ea580c';
        if (push < 0.65) return '#dc2626';
        return '#991b1b';
      }

      default:
        return '#334155';
    }
  };

  // Arcs de flux migratoires intercontinentaux
  const migrationArcs = [
    { from: [720, 195], to: [640, 100] },
    { from: [500, 220], to: [500, 135] },
    { from: [625, 180], to: [550, 118] },
    { from: [250, 218], to: [200, 145] }
  ];

  return (
    <div className="w-full rounded-xl bg-[#090d14] border border-slate-800 p-4 shadow-2xl flex flex-col gap-3">
      {/* 1. Barre supérieure : Calques biophysiques & Sélecteur de pastilles */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-cyan-400" />
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-200">
            Planisphère EPSG:4326
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-xs text-slate-400">
            Natural Earth 110m vectoriel
          </span>
        </div>

        {/* Calques biophysiques commutables */}
        <div className="flex flex-wrap items-center gap-1 bg-[#121824] p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveMetric('wet_bulb')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
              activeMetric === 'wet_bulb'
                ? 'bg-rose-950/90 text-rose-300 font-semibold border border-rose-800/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Thermomètre Mouillé (Tw)</span>
          </button>

          <button
            onClick={() => setActiveMetric('caloric_stress')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
              activeMetric === 'caloric_stress'
                ? 'bg-amber-950/90 text-amber-300 font-semibold border border-amber-800/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Déficit Alimentaire</span>
          </button>

          <button
            onClick={() => setActiveMetric('mortality')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
              activeMetric === 'mortality'
                ? 'bg-purple-950/90 text-purple-300 font-semibold border border-purple-800/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Skull className="w-3.5 h-3.5" />
            <span>Surmortalité</span>
          </button>

          <button
            onClick={() => setActiveMetric('population')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
              activeMetric === 'population'
                ? 'bg-blue-950/90 text-blue-300 font-semibold border border-blue-800/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Dépopulation</span>
          </button>

          <button
            onClick={() => setActiveMetric('sea_level')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
              activeMetric === 'sea_level'
                ? 'bg-cyan-950/90 text-cyan-300 font-semibold border border-cyan-800/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>Submersion</span>
          </button>

          <button
            onClick={() => setActiveMetric('migration')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
              activeMetric === 'migration'
                ? 'bg-orange-950/90 text-orange-300 font-semibold border border-orange-800/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Exode</span>
          </button>
        </div>
      </div>

      {/* 2. SYSTÈME D'ALERTES VISUELLES DE STRESS THERMIQUE 'STULL TW' */}
      <div className="bg-[#0b131f] border border-slate-800 rounded-xl p-3 shadow-lg flex flex-col gap-2.5">
        {/* Ligne 1 : Interrupteur d'alerte, sélection du seuil critique et statut */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Titre & Bouton d'activation */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setHeatAlertsEnabled(!heatAlertsEnabled)}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-semibold transition-all border ${
                heatAlertsEnabled
                  ? 'bg-rose-950/90 text-rose-200 border-rose-600 shadow-md shadow-rose-950/60'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="Activer ou désactiver les alertes visuelles sur la carte"
            >
              {heatAlertsEnabled ? (
                <>
                  <BellRing className="w-4 h-4 text-rose-400 animate-bounce" />
                  <span>Alertes Visuelles : ACTIVES</span>
                </>
              ) : (
                <>
                  <Radio className="w-4 h-4 text-slate-500" />
                  <span>Alertes : En Veille</span>
                </>
              )}
            </button>

            <span className="text-slate-500 hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-slate-300 font-medium">
                Seuil Chaleur Humide Ressentie (Tw) :
              </span>
              <span
                className="text-[10px] text-sky-400 bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-800/80 cursor-help"
                title="Tw = 'Wet-Bulb Temperature' (Thermomètre Mouillé). Formule de Roland Stull (2011) combinant température et humidité. À 31°C Tw, la sueur ne peut plus s'évaporer : c'est le seuil mortel d'hyperthermie."
              >
                Stull Tw ?
              </span>
            </div>
          </div>

          {/* Sélecteur de seuil critique Stull Tw */}
          <div className="flex items-center gap-1.5 bg-[#121927] p-1 rounded-lg border border-slate-700/80">
            {/* Décrémenter seuil */}
            <button
              onClick={() => setHeatAlertThreshold((prev) => Math.max(26.0, Number((prev - 0.5).toFixed(1))))}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Diminuer le seuil de 0.5°C"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            {/* Presets rapides de seuils */}
            <div className="flex items-center gap-1">
              {[
                { val: 29.0, label: '≥29° (Vuln.)', tip: 'Inconfort sévère, danger pour personnes âgées et enfants' },
                { val: 31.0, label: '≥31° (Létal)', tip: 'Seuil de rupture métabolique humaine (Sherwood & Huber / Raymond 2020)' },
                { val: 32.0, label: '≥32° (Critique)', tip: 'Inhabitabilité critique sans climatisation artificielle continue' },
                { val: 34.0, label: '≥34° (Extrême)', tip: 'Hyperthermie mortelle fulgurante en moins de 4 heures' },
                { val: 35.0, label: '≥35° (Max)', tip: 'Limite thermodynamique théorique absolue du corps humain' }
              ].map((preset) => (
                <button
                  key={preset.val}
                  onClick={() => setHeatAlertThreshold(preset.val)}
                  title={preset.tip}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
                    heatAlertThreshold === preset.val
                      ? 'bg-rose-600 text-white font-bold shadow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Incrémenter seuil */}
            <button
              onClick={() => setHeatAlertThreshold((prev) => Math.min(38.0, Number((prev + 0.5).toFixed(1))))}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Augmenter le seuil de 0.5°C"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>

            <span className="px-2 py-0.5 bg-rose-950/70 border border-rose-700/60 rounded text-rose-300 font-mono font-bold text-xs ml-1">
              {heatAlertThreshold.toFixed(1)}°C
            </span>
          </div>

          {/* Bilan du déclenchement */}
          <div className="flex items-center gap-2">
            {heatAlertsEnabled ? (
              thermalAnalysis.alertCount > 0 ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-950/80 border border-rose-700 text-rose-200">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span className="font-semibold font-mono">
                    {thermalAnalysis.alertCount} pays en alerte ({ (thermalAnalysis.alertPop / 1000).toFixed(2) } Md hab.)
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-700/80 text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Aucun pays &ge; {heatAlertThreshold.toFixed(1)}°C</span>
                </div>
              )
            ) : (
              <span className="text-slate-500 font-mono text-[11px]">Alertes visuelles en pause</span>
            )}

            {/* Sélecteur de badges permanents */}
            <div className="flex items-center gap-1 bg-[#141b2a] p-0.5 rounded border border-slate-700/80 text-[10.5px]">
              <span className="text-slate-400 px-1 flex items-center gap-1">
                <Eye className="w-2.5 h-2.5" /> Pins :
              </span>
              <button
                onClick={() => setTwOverlayMode('uninhabitable')}
                className={`px-1.5 py-0.5 rounded ${
                  twOverlayMode === 'uninhabitable' ? 'bg-rose-700 text-white font-semibold' : 'text-slate-400'
                }`}
              >
                Létal (&ge;31°)
              </button>
              <button
                onClick={() => setTwOverlayMode('off')}
                className={`px-1.5 py-0.5 rounded ${
                  twOverlayMode === 'off' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-500'
                }`}
              >
                Masquer
              </button>
            </div>
          </div>
        </div>

        {/* Ligne 2 : Bandeau d'alerte et pilules cliquables des pays en dépassement */}
        {heatAlertsEnabled && thermalAnalysis.alertCount > 0 && (
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-rose-300 flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                Zones à risque d'inhabitabilité (Stull Tw &ge; {heatAlertThreshold.toFixed(1)}°C) :
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
                      ? 'bg-rose-500 text-white border-white shadow-md'
                      : item.tw >= 35.0
                      ? 'bg-purple-950/80 text-purple-200 border-purple-600 hover:bg-purple-900'
                      : 'bg-rose-950/70 text-rose-200 border-rose-700/80 hover:bg-rose-900/90'
                  }`}
                >
                  <span>{item.name}</span>
                  <span className="font-bold text-white bg-black/40 px-1 rounded">
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
        <div className="lg:col-span-8 xl:col-span-9 relative bg-[#070b13] rounded-xl border border-slate-800/80 p-2 overflow-hidden flex flex-col justify-between shadow-inner lg:h-[520px] lg:max-h-[520px]">
          <svg
            viewBox="0 0 1000 500"
            className="w-full h-auto block select-none"
            style={{ maxHeight: '465px' }}
          >
            <defs>
              {/* Grille océanique bathymétrique */}
              <pattern id="oceanGridClear" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#0e1726" strokeWidth="0.6" />
              </pattern>

              {/* Hachures d'inhabitabilité létale standard */}
              <pattern id="uninhabitableStripe" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="10" stroke="#dc2626" strokeWidth="2.5" opacity="0.5" />
              </pattern>

              {/* Hachures d'alerte critique de stress thermique Stull Tw (Haute visibilité) */}
              <pattern id="heatAlertHazardStripe" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <rect width="10" height="10" fill="none" />
                <line x1="0" y1="0" x2="0" y2="10" stroke="#f43f5e" strokeWidth="3" opacity="0.75" />
              </pattern>

              {/* Halo d'alerte lumineuse pour pays en dépassement critique */}
              <filter id="alertGlowNeon" x="-25%" y="-25%" width="150%" height="150%">
                <feDropShadow dx="0" dy="0" stdDeviation="3.2" floodColor="#f43f5e" floodOpacity="0.9" />
              </filter>

              {/* Arcs migratoires */}
              <linearGradient id="migrGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
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

            {/* Océan profond avec gestionnaire de temporisation apaisée */}
            <rect width="1000" height="500" fill="#070c16" onPointerEnter={onOceanPointerEnter} />
            <rect width="1000" height="500" fill="url(#oceanGridClear)" opacity="0.8" className="pointer-events-none" />

            {/* Bande de chaleur équatoriale */}
            <rect y="160" width="1000" height="180" fill="url(#equatorialMesh)" className="pointer-events-none" />

            {/* Parallèles géographiques discrets */}
            <line x1="0" y1="250" x2="1000" y2="250" stroke="#334155" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.35" />
            <text x="10" y="246" fill="#475569" fontSize="8" fontFamily="monospace">Équateur 0°</text>

            <line x1="0" y1="184.7" x2="1000" y2="184.7" stroke="#334155" strokeWidth="0.6" strokeDasharray="2,4" opacity="0.25" />
            <text x="10" y="181" fill="#475569" fontSize="7" fontFamily="monospace">Tropique +23.5°</text>

            <line x1="0" y1="315.3" x2="1000" y2="315.3" stroke="#334155" strokeWidth="0.6" strokeDasharray="2,4" opacity="0.25" />
            <text x="10" y="311" fill="#475569" fontSize="7" fontFamily="monospace">Tropique -23.5°</text>

            <line x1="500" y1="0" x2="500" y2="500" stroke="#334155" strokeWidth="0.6" strokeDasharray="2,4" opacity="0.2" />
            <text x="504" y="14" fill="#475569" fontSize="7" fontFamily="monospace">0° Greenwich</text>

            {/* SOCLE CONTINENTAL MONDIAL UNIFIÉ (Natural Earth 110m) */}
            <path
              d={WORLD_LAND_PATH}
              fill="#131c2e"
              stroke="#1e293b"
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
              const isUninhabitable = dyn ? tw >= 31.0 : false;
              const fillColor = getCountryFillColor(feature.simCountryId);

              // Contour et style d'alerte
              let strokeColor = 'rgba(255, 255, 255, 0.22)';
              let strokeW = 0.8;
              let strokeDash: string | undefined = undefined;

              if (isSelected) {
                strokeColor = '#38bdf8';
                strokeW = 2.0;
              } else if (isInHeatAlert) {
                strokeColor = tw >= 35.0 ? '#c084fc' : tw >= 32.0 ? '#f43f5e' : '#fb923c';
                strokeW = 1.9;
                strokeDash = '4,2.5';
              } else if (isHovered) {
                strokeColor = '#ffffff';
                strokeW = 1.0;
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

                  {/* Superposition de hachures d'alerte critique ou d'inhabitabilité */}
                  {isInHeatAlert ? (
                    <path
                      d={feature.path}
                      fill="url(#heatAlertHazardStripe)"
                      className="pointer-events-none"
                    />
                  ) : isUninhabitable ? (
                    <path
                      d={feature.path}
                      fill="url(#uninhabitableStripe)"
                      className="pointer-events-none"
                    />
                  ) : null}
                </g>
              );
            })}

            {/* FLUX MIGRATOIRES */}
            {(activeMetric === 'migration' || simulationState.activeClimateRefugees > 10) && (
              <g className="pointer-events-none">
                {migrationArcs.map((arc, idx) => {
                  const midX = (arc.from[0] + arc.to[0]) / 2;
                  const midY = Math.min(arc.from[1], arc.to[1]) - 35;
                  const pathD = `M ${arc.from[0]} ${arc.from[1]} Q ${midX} ${midY} ${arc.to[0]} ${arc.to[1]}`;

                  return (
                    <g key={idx}>
                      <path
                        d={pathD}
                        fill="none"
                        stroke="url(#migrGradient)"
                        strokeWidth="2.0"
                        strokeDasharray="5,4"
                        className="animate-pulse"
                      />
                      <circle cx={arc.to[0]} cy={arc.to[1]} r="3.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                    </g>
                  );
                })}
              </g>
            )}

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

                  const isUninhabitable = tw >= 31.0;
                  const isCritical = tw >= 29.0;

                  if (twOverlayMode === 'uninhabitable' && !isUninhabitable) return null;
                  if (twOverlayMode === 'critical' && !isCritical) return null;

                  const [cx, cy] = SIM_CENTROIDS[staticC.id] || [500, 250];

                  const badgeBg = isUninhabitable
                    ? '#7f1d1d'
                    : tw >= 29.0
                    ? '#9a3412'
                    : tw >= 26.0
                    ? '#854d0e'
                    : '#064e3b';

                  const badgeBorder = isUninhabitable
                    ? '#f43f5e'
                    : tw >= 29.0
                    ? '#fb923c'
                    : '#10b981';

                  return (
                    <g key={`tw-pin-${staticC.id}`} transform={`translate(${cx}, ${cy})`}>
                      {isUninhabitable && (
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
                        {isUninhabitable ? `☠️ ${tw.toFixed(1)}°` : `${tw.toFixed(1)}°C`}
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
                      fill="#070d19"
                      stroke={isAlert ? '#f43f5e' : '#38bdf8'}
                      strokeWidth="1.2"
                    />
                    <text
                      x="0"
                      y="-3.5"
                      textAnchor="middle"
                      fill="#ffffff"
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

          {/* Légende horizontale en bas du planisphère */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 px-2 pt-2 border-t border-slate-800/60 mt-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-300 text-[11px]">Échelle Stull Tw :</span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-sky-400 font-mono">&lt;14°C Boréal</span>
                <span className="text-[10px] text-emerald-400 font-mono">22°C Vivable</span>
                <div className="h-2 w-20 rounded bg-gradient-to-r from-sky-600 via-emerald-500 to-rose-600" />
                <span className="text-[10px] text-rose-400 font-bold font-mono">&ge;31.0°C Seuil létal</span>
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
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col bg-[#0b121e] border border-slate-800 rounded-xl p-3 shadow-xl justify-between lg:h-[520px] lg:max-h-[520px] overflow-y-auto">
          {activeCountryData ? (
            // CAS A : UN PAYS EST SURVOLÉ OU ÉPINGLÉ
            (() => {
              const dyn = simulationState.countries[activeCountryData.id];
              if (!dyn) return null;

              const tw = dyn.wetBulbPeak;
              const isUninhabitable = tw >= 31.0;
              const isSevere = tw >= 29.0 && tw < 31.0;
              const isWarning = tw >= 26.0 && tw < 29.0;
              const popChangePct = ((dyn.cohorts.total - activeCountryData.basePop2026) / activeCountryData.basePop2026) * 100;
              const isFamine = dyn.calPerCapita < 2100;

              return (
                <div className="flex flex-col gap-3 h-full justify-between">
                  <div>
                    {/* Statut du panneau (Survol vs Épinglé) avec bouton de fermeture */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${hoveredFeature ? 'bg-cyan-400 animate-pulse' : 'bg-amber-400'}`} />
                        <span className="text-[10.5px] uppercase tracking-wider font-semibold text-slate-400">
                          {hoveredFeature ? 'Analyse en Direct (Survol)' : 'Territoire Sélectionné'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10.5px] font-mono text-cyan-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 font-semibold">
                          {activeCountryData.code}
                        </span>
                        {selectedCountryId && (
                          <button
                            onClick={() => onSelectCountry(null)}
                            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[10.5px] transition-colors cursor-pointer"
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
                        <h3 className="text-base font-bold text-white tracking-tight">
                          {activeCountryData.frenchName}
                        </h3>
                        {activeFeature?.name && activeFeature.name !== activeCountryData.name && (
                          <span className="text-xs text-slate-400">
                            ({activeFeature.name})
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {activeCountryData.region} · Année {Math.floor(simulationState.year)}
                      </span>
                    </div>

                    {/* BANNIÈRE D'ALERTE DE STRESS THERMIQUE CRITIQUE SI SEUIL DÉPASSÉ */}
                    {heatAlertsEnabled && tw >= heatAlertThreshold && (
                      <div className="mb-2.5 p-2.5 rounded-lg bg-gradient-to-r from-rose-950 via-red-950 to-purple-950 border border-rose-500 shadow-md text-xs space-y-1.5 animate-pulse">
                        <div className="flex items-center gap-1.5">
                          <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
                          <span className="font-bold text-white text-[11px] uppercase tracking-wide">
                            🚨 Canicule Mortelle Dépassée (Tw &ge; {heatAlertThreshold.toFixed(1)}°C)
                          </span>
                        </div>
                        <p className="text-[10.5px] text-rose-200 leading-snug">
                          <strong>Danger vital :</strong> Lors du pic estival ({dyn.summerMaxTemp.toFixed(1)}°C / {dyn.summerHumidity}% humidité), la chaleur ressentie atteint <strong>{tw.toFixed(1)}°C</strong>.
                          L'air saturé empêche la sueur de s'évaporer, provoquant une surchauffe mortelle du corps humain en &lt;6h sans pièce climatisée.
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-rose-300 pt-1 border-t border-rose-800/80 font-mono">
                          <span>Habitants menacés : <strong>{dyn.cohorts.total.toFixed(0)} M</strong></span>
                          <span>Enfants &amp; Aînés : <strong>{(dyn.cohorts.p0 + dyn.cohorts.p2).toFixed(0)} M</strong></span>
                        </div>
                      </div>
                    )}

                    {/* BLOC 1 : INDICE DE CHALEUR HUMIDE RESSENTIE */}
                    <div
                      className={`p-2.5 rounded-lg border mb-2.5 space-y-1.5 ${
                        isUninhabitable
                          ? 'bg-rose-950/80 border-rose-600 shadow-md shadow-rose-950/60'
                          : isSevere
                          ? 'bg-amber-950/80 border-amber-600'
                          : isWarning
                          ? 'bg-yellow-950/60 border-yellow-700'
                          : 'bg-emerald-950/60 border-emerald-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
                            <Flame className="w-4 h-4 text-rose-400" />
                            <span>Chaleur Humide Ressentie (Tw)</span>
                          </span>
                          <span className="text-[9.5px] text-slate-400 block mt-0.5">
                            Pic estival à {dyn.summerMaxTemp.toFixed(1)}°C · {dyn.summerHumidity}% humidité (Formule Stull)
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-mono font-bold text-white tabular-nums">
                            {tw.toFixed(1)}°C
                          </span>
                          {heatAlertsEnabled && tw >= heatAlertThreshold && (
                            <span className="block text-[9.5px] font-mono text-rose-400 font-bold">
                              &gt; Seuil {heatAlertThreshold.toFixed(1)}°C ⚠️
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Jauge graphique de Tw par rapport au seuil létal de 31°C */}
                      <div className="space-y-1">
                        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden flex relative">
                          <div
                            className={`h-full transition-all duration-300 ${
                              tw >= 35.0 ? 'bg-purple-500' : isUninhabitable ? 'bg-rose-500' : isSevere ? 'bg-amber-500' : 'bg-emerald-400'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(5, ((tw - 10) / 25) * 100))}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[9px] font-mono text-slate-400">
                          <span>10°C</span>
                          <span className="text-rose-400 font-semibold">Seuil Mortel 31°C</span>
                          <span className={heatAlertThreshold === 32.0 ? 'text-amber-300 font-bold' : ''}>
                            {heatAlertThreshold.toFixed(1)}°C (Seuil)
                          </span>
                          <span>35°C</span>
                        </div>
                      </div>

                      {/* Diagnostic physiologique */}
                      <div className="pt-0.5 text-[11px] font-semibold">
                        {isUninhabitable ? (
                          <p className="text-rose-300 leading-tight">
                            ☠️ INHABITABLE : Décès par surchauffe corporelle en &lt;6h sans climatisation.
                          </p>
                        ) : isSevere ? (
                          <p className="text-amber-300 leading-tight">
                            ⚠️ DANGER SÉVÈRE : Travailler dehors devient mortel pour le corps.
                          </p>
                        ) : isWarning ? (
                          <p className="text-yellow-300 leading-tight">
                            ⚡ STRESS ÉLEVÉ : Inconfort thermique sévère et risques sanitaires.
                          </p>
                        ) : (
                          <p className="text-emerald-300 leading-tight">
                            ✅ VIVABLE : Le corps régule sa chaleur par la transpiration.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* BLOC 2 : MÉTRIQUES CLIMATIQUES & DÉMOGRAPHIQUES SIMPLIFIÉES */}
                    <div className="space-y-1.5 text-xs">
                      {/* Pic caniculaire estival */}
                      <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Sun className="w-3.5 h-3.5 text-amber-400" />
                          Pic de chaleur à l'ombre (été)
                        </span>
                        <span className="font-mono text-amber-300 tabular-nums font-semibold">
                          {dyn.summerMaxTemp.toFixed(1)}°C{' '}
                          <span className="text-slate-500 font-normal text-[10.5px]">
                            (+{(dyn.summerMaxTemp - activeCountryData.summerMaxTemp).toFixed(1)}°C)
                          </span>
                        </span>
                      </div>

                      {/* Humidité relative caniculaire */}
                      <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Droplets className="w-3.5 h-3.5 text-sky-400" />
                          Humidité dans l'air (en %)
                        </span>
                        <span className="font-mono text-sky-300 tabular-nums font-medium">
                          {dyn.summerHumidity}%
                        </span>
                      </div>

                      {/* Température moyenne annuelle */}
                      <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Thermometer className="w-3.5 h-3.5 text-slate-400" />
                          Température moyenne sur l'année
                        </span>
                        <span className="font-mono text-slate-200 tabular-nums font-medium">
                          {dyn.dryBulbTemp.toFixed(1)}°C{' '}
                          <span className="text-slate-500 font-normal text-[10.5px]">
                            (+{(dyn.dryBulbTemp - activeCountryData.baseTemp).toFixed(1)}°C)
                          </span>
                        </span>
                      </div>

                      {/* Population résidente */}
                      <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                        <span className="text-slate-400">Nombre d'habitants</span>
                        <div className="text-right font-mono">
                          <span className="font-medium text-white tabular-nums">
                            {dyn.cohorts.total.toFixed(1)} M
                          </span>
                          <span
                            className={`ml-1.5 text-[11px] font-semibold tabular-nums ${
                              popChangePct < 0 ? 'text-rose-400' : 'text-emerald-400'
                            }`}
                          >
                            {popChangePct > 0 ? `+${popChangePct.toFixed(1)}%` : `${popChangePct.toFixed(1)}%`}
                          </span>
                        </div>
                      </div>

                      {/* Ration alimentaire */}
                      <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                        <span className="text-slate-400">Ration par personne</span>
                        <span
                          className={`font-mono tabular-nums font-medium ${
                            isFamine ? 'text-rose-400 font-bold' : 'text-emerald-400'
                          }`}
                        >
                          {Math.round(dyn.calPerCapita)} kcal/j {isFamine && '(Famine)'}
                        </span>
                      </div>

                      {/* Surmortalité annuelle */}
                      <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                        <span className="text-slate-400">Décès annuels causés par les crises</span>
                        <span className="font-mono text-purple-300 font-medium tabular-nums">
                          {dyn.annualDeaths.total.toFixed(2)} M/an{' '}
                          <span className="text-slate-500 text-[10.5px]">
                            ({(dyn.mortalityRates.total * 1000).toFixed(1)}‰)
                          </span>
                        </span>
                      </div>

                      {/* Solde migratoire */}
                      <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                        <span className="text-slate-400">Départs / Arrivées de population</span>
                        <span
                          className={`font-mono tabular-nums ${
                            dyn.netMigration < 0 ? 'text-rose-400' : 'text-cyan-400'
                          }`}
                        >
                          {dyn.netMigration > 0 ? `+${dyn.netMigration.toFixed(2)}` : dyn.netMigration.toFixed(2)} M/an
                        </span>
                      </div>

                      {/* Pyramide des âges */}
                      <div className="pt-1.5">
                        <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                          <span>Tranches d'âge de la population</span>
                          <span className="font-mono text-slate-300 text-[10.5px]">
                            {Math.round(dyn.cohorts.p0)}M enf. / {Math.round(dyn.cohorts.p1)}M act. / {Math.round(dyn.cohorts.p2)}M aînés
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-900 rounded flex overflow-hidden">
                          <div
                            className="bg-cyan-500 h-full"
                            style={{ width: `${(dyn.cohorts.p0 / dyn.cohorts.total) * 100}%` }}
                            title="0-14 ans (Enfants)"
                          />
                          <div
                            className="bg-blue-500 h-full"
                            style={{ width: `${(dyn.cohorts.p1 / dyn.cohorts.total) * 100}%` }}
                            title="15-64 ans (Actifs)"
                          />
                          <div
                            className="bg-purple-500 h-full"
                            style={{ width: `${(dyn.cohorts.p2 / dyn.cohorts.total) * 100}%` }}
                            title="65+ ans (Aînés)"
                          />
                        </div>
                        <div className="flex justify-between text-[9.5px] text-slate-400 mt-1">
                          <span className="text-cyan-400">Enfants (0-14 ans)</span>
                          <span className="text-blue-400">Actifs (15-64 ans)</span>
                          <span className="text-purple-400">Aînés (65+ ans)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bouton d'inspection granulaire */}
                  <button
                    onClick={() => onSelectCountry(activeCountryData.id)}
                    className="w-full mt-2 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-medium text-xs rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
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
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Globe2 className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                      Bilan Planétaire Global
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/80">
                    {Math.floor(simulationState.year)}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mt-2 mb-3 leading-relaxed">
                  Survolez n'importe quel pays sur le planisphère pour afficher ses indicateurs biophysiques en direct.
                </p>

                {/* Métriques globales en cartes compactes */}
                <div className="space-y-2.5">
                  {/* Population mondiale */}
                  <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-blue-400" />
                        Population Mondiale
                      </span>
                      <span className="font-mono font-bold text-white text-sm">
                        {(simulationState.worldPopulation / 1000).toFixed(2)} Md
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10.5px]">
                      <span className="text-slate-500">Pic 2026 : 8.15 Md</span>
                      <span
                        className={`font-mono ${
                          simulationState.worldPopulation < 8150 ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {simulationState.worldPopulation < 8150 ? (
                          <span className="flex items-center gap-0.5">
                            <TrendingDown className="w-3 h-3" />
                            -{((8150 - simulationState.worldPopulation) / 10).toFixed(0)} M
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5">
                            <TrendingUp className="w-3 h-3" />
                            +{(simulationState.worldPopulation - 8150).toFixed(0)} M
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Zones inhabitables Stull */}
                  <div
                    className={`p-2.5 rounded-lg border space-y-1 ${
                      thermalAnalysis.uninhabitableCount > 0
                        ? 'bg-rose-950/80 border-rose-700'
                        : 'bg-slate-900/90 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-rose-400" />
                        Dômes Létaux (Tw &ge; 31°C)
                      </span>
                      <span
                        className={`font-mono font-bold text-sm ${
                          thermalAnalysis.uninhabitableCount > 0 ? 'text-rose-300' : 'text-emerald-400'
                        }`}
                      >
                        {thermalAnalysis.uninhabitableCount} région(s)
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-400 leading-tight">
                      {thermalAnalysis.uninhabitableCount > 0
                        ? `${(thermalAnalysis.uninhabitablePop / 1000).toFixed(2)} Md d'humains exposés à l'hyperthermie mortelle.`
                        : 'Aucune zone létale saisonnière permanente.'}
                    </p>
                  </div>

                  {/* Réchauffement de surface FaIR */}
                  <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                        <span>Réchauffement Mondial</span>
                        <span
                          className="text-[9px] text-cyan-400 bg-cyan-950/80 px-1 py-0.5 rounded border border-cyan-800/80 cursor-help font-mono"
                          title="FaIR (Finite Amplitude Impulse Response) est le modèle climatique simplifié officiel du GIEC (AR6) simulant la hausse de température due aux émissions."
                        >
                          FaIR ?
                        </span>
                      </span>
                      <span className="font-mono font-bold text-white text-sm">
                        +{simulationState.surfaceTemperatureAnomaly.toFixed(2)}°C
                      </span>
                    </div>
                    <div className="flex justify-between text-[10.5px] text-slate-500">
                      <span>CO₂ atmosphérique :</span>
                      <span className="font-mono text-slate-300">
                        {simulationState.atmosphericCo2Ppm.toFixed(0)} ppm
                      </span>
                    </div>
                  </div>

                  {/* Énergie nette et EROI */}
                  <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        EROI Pétrolier Net
                      </span>
                      <span className="font-mono font-bold text-amber-400 text-sm">
                        {simulationState.currentEroi.toFixed(1)}:1
                      </span>
                    </div>
                    <div className="flex justify-between text-[10.5px] text-slate-500">
                      <span>Part nette disponible :</span>
                      <span className="font-mono text-slate-300">
                        {(simulationState.netEnergyRatio * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Raccourci d'aide */}
              <div className="p-2 rounded bg-slate-900/70 border border-slate-800/80 text-[10.5px] text-slate-400 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Déplacez la souris sur un continent pour inspecter ses métriques.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
