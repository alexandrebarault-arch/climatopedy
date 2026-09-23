import React from 'react';
import { COUNTRIES_DATA } from '../data/countriesData';
import { GlobalBiophysicalState } from '../types/simulation';
import { X, Thermometer, Utensils, Skull, Users, ShieldAlert, AlertTriangle } from 'lucide-react';

interface CountryInspectorProps {
  countryId: string | null;
  onClose: () => void;
  simulationState: GlobalBiophysicalState;
  onSelectCountry: (id: string) => void;
}

export const CountryInspector: React.FC<CountryInspectorProps> = ({
  countryId,
  onClose,
  simulationState,
  onSelectCountry
}) => {
  if (!countryId) return null;

  const staticData = COUNTRIES_DATA.find(c => c.id === countryId);
  const dynState = simulationState.countries[countryId];

  if (!staticData || !dynState) return null;

  const popChangePct = ((dynState.cohorts.total - staticData.basePop2026) / staticData.basePop2026) * 100;
  const isLethalHeat = dynState.wetBulbPeak >= 31.0;
  const isFamine = dynState.calPerCapita < 2100;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[460px] bg-[#0c121e]/98 border-l border-slate-800 shadow-2xl z-50 flex flex-col backdrop-blur overflow-hidden animate-in slide-in-from-right duration-200">
      {/* Header du panneau */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#101726]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">
              {staticData.frenchName}
            </span>
            <span className="font-mono text-xs bg-slate-800 text-cyan-300 px-2 py-0.5 rounded border border-slate-700">
              {staticData.code}
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Région {staticData.region} · Coordonnées [{staticData.center[0]}°, {staticData.center[1]}°]
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sélecteur rapide d'un autre pays */}
          <select
            value={countryId}
            onChange={(e) => onSelectCountry(e.target.value)}
            className="bg-slate-800 text-slate-200 text-xs rounded px-2 py-1 border border-slate-700 focus:outline-none"
          >
            {COUNTRIES_DATA.map(c => (
              <option key={c.id} value={c.id}>
                {c.frenchName} ({c.code})
              </option>
            ))}
          </select>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Alertes critiques si seuils dépassés */}
      {(isLethalHeat || isFamine) && (
        <div className="p-3 bg-rose-950/80 border-b border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-white block">
              Alerte Rupture Biophysique Active ({Math.floor(simulationState.year)})
            </span>
            {dynState.wetBulbPeak >= 32.0 ? (
              <span className="block text-[11px] text-rose-300 font-bold">
                • Alerte Inhabitabilité Critique : Stull Tw = {dynState.wetBulbPeak.toFixed(1)}°C (&gt; 32.0°C). Refroidissement métabolique impossible sans climatisation permanente.
              </span>
            ) : isLethalHeat ? (
              <span className="block text-[11px] text-rose-300">
                • Dôme thermique létal : Tw = {dynState.wetBulbPeak.toFixed(1)}°C (&gt; 31.0°C). Refroidissement métabolique inopérant.
              </span>
            ) : null}
            {isFamine && (
              <span className="block text-[11px] text-amber-300">
                • Déficit calorique vital : {Math.round(dynState.calPerCapita)} kcal/j (&lt; 2100 kcal). Famine de masse enclenchée.
              </span>
            )}
          </div>
        </div>
      )}

      {/* Contenu déroulant */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* SECTION 1 : DÉMOGRAPHIE & PYRAMIDE DES ÂGES */}
        <div className="bg-[#121929] rounded-lg p-3 border border-slate-800/90 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              Démographie &amp; Structure par Âge
            </span>
            <span
              className={`font-mono font-bold tabular-nums ${
                popChangePct < 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {popChangePct > 0 ? `+${popChangePct.toFixed(1)}%` : `${popChangePct.toFixed(1)}%`} vs 2026
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-[#0b101b] p-2 rounded border border-slate-800">
              <span className="text-slate-400 block">Population Totale</span>
              <span className="text-base font-bold font-mono text-white tabular-nums">
                {dynState.cohorts.total.toFixed(1)} M
              </span>
              <span className="text-[10px] text-slate-500 block">Base 2026: {staticData.basePop2026} M</span>
            </div>

            <div className="bg-[#0b101b] p-2 rounded border border-slate-800">
              <span className="text-slate-400 block">Fécondité Effective</span>
              <span className="text-base font-bold font-mono text-white tabular-nums">
                {dynState.fertilityActual.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-500 block">enf./femme (stress régulé)</span>
            </div>
          </div>

          {/* Barre des 3 cohortes */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0–14 ans: {(dynState.cohorts.p0).toFixed(1)}M</span>
              <span>15–64 ans: {(dynState.cohorts.p1).toFixed(1)}M</span>
              <span>65+ ans: {(dynState.cohorts.p2).toFixed(1)}M</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800 flex overflow-hidden">
              <div
                style={{ width: `${(dynState.cohorts.p0 / dynState.cohorts.total) * 100}%` }}
                className="bg-cyan-500"
                title="Enfants 0-14"
              />
              <div
                style={{ width: `${(dynState.cohorts.p1 / dynState.cohorts.total) * 100}%` }}
                className="bg-blue-600"
                title="Actifs 15-64"
              />
              <div
                style={{ width: `${(dynState.cohorts.p2 / dynState.cohorts.total) * 100}%` }}
                className="bg-purple-600"
                title="Séniors 65+"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2 : CONTRAINTES THERMIQUES (STULL WET BULB) */}
        <div className="bg-[#121929] rounded-lg p-3 border border-slate-800/90 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-rose-400" />
              Thermodynamique &amp; Chaleur Humide (Stull 2011)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="bg-[#0b101b] p-2 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Pic Canicule (Tmax)</span>
              <span className="text-sm font-bold font-mono text-amber-300 tabular-nums">
                {dynState.summerMaxTemp.toFixed(1)}°C
              </span>
            </div>

            <div className="bg-[#0b101b] p-2 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Humidité Canicule (RH)</span>
              <span className="text-sm font-bold font-mono text-sky-300 tabular-nums">
                {dynState.summerHumidity}%
              </span>
            </div>

            <div className="bg-[#0b101b] p-2 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Tw Stull Estival</span>
              <span
                className={`text-sm font-bold font-mono tabular-nums ${
                  dynState.wetBulbPeak >= 31.0 ? 'text-rose-400 font-extrabold' : 'text-emerald-400'
                }`}
              >
                {dynState.wetBulbPeak.toFixed(1)}°C
              </span>
            </div>

            <div className="bg-[#0b101b] p-2 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Moyenne Annuelle</span>
              <span className="text-sm font-bold font-mono text-slate-300 tabular-nums">
                {dynState.dryBulbTemp.toFixed(1)}°C
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 bg-[#0a0e17] p-2 rounded border border-slate-800/80">
            <span className="font-medium text-slate-300 block mb-0.5">Seuils d'inhabitabilité physiologique :</span>
            <span>
              {dynState.wetBulbPeak >= 35.0
                ? '☠️ Tw ≥ 35°C : Effondrement absolu. Mortalité métabolique inévitable même au repos à l\'ombre avec ventilation.'
                : dynState.wetBulbPeak >= 32.0
                ? '🚨 Tw ≥ 32°C : Alerte d\'inhabitabilité critique. Décès par hyperthermie en moins de 6h sans climatisation continue.'
                : dynState.wetBulbPeak >= 31.0
                ? '⚠️ Tw ≥ 31°C : Seuil létal physiologique standard. Impossibilité d\'évacuer la chaleur par transpiration.'
                : dynState.wetBulbPeak >= 28.0
                ? '⚡ Tw ≥ 28°C : Risque sanitaire élevé. Tout effort physique en extérieur devient dangereux.'
                : '✅ Conditions thermiques supportables pour la physiologie humaine.'}
            </span>
          </div>
        </div>

        {/* SECTION 3 : AGRICULTURE & RATION CALORIQUE */}
        <div className="bg-[#121929] rounded-lg p-3 border border-slate-800/90 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-amber-400" />
              Sécurité Alimentaire &amp; Rendements (Zhao et al.)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-[#0b101b] p-2 rounded border border-slate-800">
              <span className="text-slate-400 block">Ration / Personne</span>
              <span
                className={`text-base font-bold font-mono tabular-nums ${
                  dynState.calPerCapita < 2100 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {Math.round(dynState.calPerCapita)} kcal/j
              </span>
              <span className="text-[10px] text-slate-500 block">Besoin vital : 2100 kcal</span>
            </div>

            <div className="bg-[#0b101b] p-2 rounded border border-slate-800">
              <span className="text-slate-400 block">Indice de Récolte</span>
              <span className="text-base font-bold font-mono text-amber-400 tabular-nums">
                {(dynState.cropYieldFactor * 100).toFixed(0)}%
              </span>
              <span className="text-[10px] text-slate-500 block">Réf. 2026 = 100%</span>
            </div>
          </div>

          {/* Composition des 4 céréales stratégiques du pays */}
          <div className="space-y-1 text-[11px]">
            <span className="text-slate-400 block">Mix cultural &amp; Dégradation thermique locale :</span>
            <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
              <span className="text-slate-300">Maïs ({(staticData.cropMix.maize * 100).toFixed(0)}%): -7.4%/°C</span>
              <span className="text-slate-300">Blé ({(staticData.cropMix.wheat * 100).toFixed(0)}%): -6.0%/°C</span>
              <span className="text-slate-300">Riz ({(staticData.cropMix.rice * 100).toFixed(0)}%): -3.2%/°C</span>
              <span className="text-slate-300">Soja ({(staticData.cropMix.soy * 100).toFixed(0)}%): -3.1%/°C</span>
            </div>
          </div>
        </div>

        {/* SECTION 4 : SURMORTALITÉS FORCÉES */}
        <div className="bg-[#121929] rounded-lg p-3 border border-slate-800/90 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Skull className="w-3.5 h-3.5 text-purple-400" />
              Décomposition de la Mortalité Annuelle
            </span>
            <span className="font-mono text-purple-300 font-bold tabular-nums">
              {(dynState.annualDeaths.total).toFixed(2)} M décès/an
            </span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between items-center bg-[#0b101b] p-1.5 rounded">
              <span className="text-rose-400">Dômes thermiques létaux (Tw &gt; 31°C) :</span>
              <span className="font-mono font-semibold text-white tabular-nums">
                {(dynState.annualDeaths.thermal).toFixed(2)} M/an
              </span>
            </div>

            <div className="flex justify-between items-center bg-[#0b101b] p-1.5 rounded">
              <span className="text-amber-400">Famines &amp; Déficit calorique :</span>
              <span className="font-mono font-semibold text-white tabular-nums">
                {(dynState.annualDeaths.famine).toFixed(2)} M/an
              </span>
            </div>

            <div className="flex justify-between items-center bg-[#0b101b] p-1.5 rounded">
              <span className="text-purple-400">Effondrement sanitaire / eau :</span>
              <span className="font-mono font-semibold text-white tabular-nums">
                {(dynState.annualDeaths.sanitary).toFixed(2)} M/an
              </span>
            </div>

            <div className="flex justify-between items-center bg-[#0b101b] p-1.5 rounded">
              <span className="text-slate-400">Mortalité naturelle de base :</span>
              <span className="font-mono text-slate-300 tabular-nums">
                {(dynState.annualDeaths.base).toFixed(2)} M/an
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 5 : MIGRATIONS & BLOCAGE FRONTALIER */}
        <div className="bg-[#121929] rounded-lg p-3 border border-slate-800/90 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />
              Pression d'Exode &amp; Frontières
            </span>
            <span className="font-mono text-orange-300 tabular-nums">
              Bunkerisation: {(dynState.borderClosure * 100).toFixed(0)}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-[#0b101b] p-2 rounded border border-slate-800">
              <span className="text-slate-400 block">Pression d'Émigration</span>
              <span className="text-sm font-bold font-mono text-orange-400 tabular-nums">
                {(dynState.pushFactor * 100).toFixed(0)} / 100
              </span>
            </div>

            <div className="bg-[#0b101b] p-2 rounded border border-slate-800">
              <span className="text-slate-400 block">Solde Migratoire Net</span>
              <span
                className={`text-sm font-bold font-mono tabular-nums ${
                  dynState.netMigration < 0 ? 'text-rose-400' : 'text-cyan-400'
                }`}
              >
                {dynState.netMigration > 0 ? `+${dynState.netMigration.toFixed(2)}` : dynState.netMigration.toFixed(2)} M/an
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
