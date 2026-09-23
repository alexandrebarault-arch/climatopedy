import React, { useEffect } from 'react';
import { COUNTRIES_DATA } from '../data/countriesData';
import { GlobalBiophysicalState } from '../types/simulation';
import { X, Thermometer, Utensils, Skull, Users, ShieldAlert, AlertTriangle } from 'lucide-react';
import { TechTooltip } from './TechTooltip';

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
  // Fermeture par touche Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!countryId) return null;

  const staticData = COUNTRIES_DATA.find(c => c.id === countryId);
  const dynState = simulationState.countries[countryId];

  if (!staticData || !dynState) return null;

  const popChangePct = ((dynState.cohorts.total - staticData.basePop2026) / staticData.basePop2026) * 100;
  const isLethalHeat = dynState.wetBulbPeak >= 31.0;
  const isFamine = dynState.calPerCapita < 2100;

  return (
    <>
      {/* Arrière-plan estompé cliquable pour fermer facilement le panneau */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40 transition-opacity"
        aria-label="Fermer la vue détaillée"
      />

      {/* Panneau latéral droit */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[470px] bg-[#0c121e]/98 border-l border-slate-700 shadow-2xl z-50 flex flex-col backdrop-blur overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header du panneau conçu pour que la CROIX SOIT TOUJOURS VISIBLE, même avec un nom de pays très long */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 bg-[#101726] flex flex-col gap-2.5 shrink-0">
          {/* Ligne 1 : Nom du pays complet + Code ISO + Bouton FERMER (Inamovible) */}
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <h2
                className="text-base sm:text-lg font-bold text-white truncate tracking-tight"
                title={staticData.frenchName}
              >
                {staticData.frenchName}
              </h2>
              <span className="font-mono text-xs bg-slate-800 text-cyan-300 px-2 py-0.5 rounded border border-slate-700 shrink-0 font-semibold">
                {staticData.code}
              </span>
            </div>

            {/* Bouton Fermer (Croix) garanti 100% visible et prioritaire */}
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-rose-900/70 hover:text-white text-slate-200 border border-slate-700 hover:border-rose-600 transition-all text-xs font-semibold shrink-0 cursor-pointer shadow-sm group"
              title="Fermer ce panneau (ou appuyez sur Échap)"
              aria-label="Fermer la fiche pays"
            >
              <X className="w-4 h-4 text-slate-300 group-hover:text-white" />
              <span>Fermer</span>
            </button>
          </div>

          {/* Ligne 2 : Coordonnées géographiques + Sélecteur déroulant de pays */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/70 text-xs">
            <span className="text-slate-400 text-[11px] truncate">
              Région {staticData.region} · Coordonnées [{staticData.center[0]}°, {staticData.center[1]}°]
            </span>

            {/* Sélecteur compact d'un autre pays */}
            <select
              value={countryId}
              onChange={(e) => onSelectCountry(e.target.value)}
              className="bg-slate-800 text-slate-200 text-xs rounded-md px-2 py-1 border border-slate-700 focus:outline-none max-w-[180px] truncate shrink-0 cursor-pointer"
              title="Sélectionner un autre pays"
            >
              {COUNTRIES_DATA.map(c => (
                <option key={c.id} value={c.id}>
                  {c.frenchName} ({c.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Alertes critiques si seuils dépassés (termes limpides) */}
        {(isLethalHeat || isFamine) && (
          <div className="p-3 bg-rose-950/80 border-b border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5 shrink-0">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-white block">
                Alerte Urgence Vitale Active ({Math.floor(simulationState.year)})
              </span>
              {dynState.wetBulbPeak >= 32.0 ? (
                <span className="block text-[11px] text-rose-300 font-bold">
                  • Canicule mortelle : Chaleur ressentie à {dynState.wetBulbPeak.toFixed(1)}°C. Le corps ne peut plus évacuer sa chaleur sans climatisation électrique continue.
                </span>
              ) : isLethalHeat ? (
                <span className="block text-[11px] text-rose-300">
                  • Canicule humide létale : Chaleur ressentie à {dynState.wetBulbPeak.toFixed(1)}°C. Risque mortel d'hyperthermie pour la population.
                </span>
              ) : null}
              {isFamine && (
                <span className="block text-[11px] text-amber-300">
                  • Famine grave : Ration alimentaire tombée à {Math.round(dynState.calPerCapita)} kcal/jour (en dessous du minimum vital de 2 100 kcal).
                </span>
              )}
            </div>
          </div>
        )}

        {/* Contenu déroulant avec vocabulaire accessible à tous */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* SECTION 1 : POPULATION & ÂGES */}
          <div className="bg-[#121929] rounded-lg p-3 border border-slate-800/90 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                Population &amp; Tranches d'Âge
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
                <span className="text-slate-400 block">Nombre d'habitants</span>
                <span className="text-base font-bold font-mono text-white tabular-nums">
                  {dynState.cohorts.total.toFixed(1)} M
                </span>
                <span className="text-[10px] text-slate-500 block">En 2026 : {staticData.basePop2026} millions</span>
              </div>

              <div className="bg-[#0b101b] p-2 rounded border border-slate-800">
                <span className="text-slate-400 block">Enfants par femme</span>
                <span className="text-base font-bold font-mono text-white tabular-nums">
                  {dynState.fertilityActual.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-500 block">Taux de natalité actuel</span>
              </div>
            </div>

            {/* Répartition par âge */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Enfants (0–14 ans) : {(dynState.cohorts.p0).toFixed(1)}M</span>
                <span>Actifs (15–64 ans) : {(dynState.cohorts.p1).toFixed(1)}M</span>
                <span>Aînés (65+ ans) : {(dynState.cohorts.p2).toFixed(1)}M</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 flex overflow-hidden">
                <div
                  style={{ width: `${(dynState.cohorts.p0 / dynState.cohorts.total) * 100}%` }}
                  className="bg-cyan-500"
                  title="Enfants (0-14 ans)"
                />
                <div
                  style={{ width: `${(dynState.cohorts.p1 / dynState.cohorts.total) * 100}%` }}
                  className="bg-blue-600"
                  title="Actifs (15-64 ans)"
                />
                <div
                  style={{ width: `${(dynState.cohorts.p2 / dynState.cohorts.total) * 100}%` }}
                  className="bg-purple-600"
                  title="Aînés (65 ans et plus)"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2 : CHALEUR HUMIDE RESSENTIE & CANICULES */}
          <div className="bg-[#121929] rounded-lg p-3 border border-slate-800/90 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                Chaleur Humide &amp; Canicules (Ce que ressent la peau)
              </span>
              <TechTooltip term="stull" showIconOnly />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="bg-[#0b101b] p-2 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Air à l'ombre (Tmax)</span>
                <span className="text-sm font-bold font-mono text-amber-300 tabular-nums">
                  {dynState.summerMaxTemp.toFixed(1)}°C
                </span>
              </div>

              <div className="bg-[#0b101b] p-2 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Humidité de l'air</span>
                <span className="text-sm font-bold font-mono text-sky-300 tabular-nums">
                  {dynState.summerHumidity}%
                </span>
              </div>

              <div className="bg-[#0b101b] p-2 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px] flex items-center justify-between">
                  <span>Chaleur ressentie (Tw)</span>
                </span>
                <span
                  className={`text-sm font-bold font-mono tabular-nums ${
                    dynState.wetBulbPeak >= 31.0 ? 'text-rose-400 font-extrabold' : 'text-emerald-400'
                  }`}
                >
                  {dynState.wetBulbPeak.toFixed(1)}°C
                </span>
              </div>

              <div className="bg-[#0b101b] p-2 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Moyenne sur l'année</span>
                <span className="text-sm font-bold font-mono text-slate-300 tabular-nums">
                  {dynState.dryBulbTemp.toFixed(1)}°C
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 bg-[#0a0e17] p-2 rounded border border-slate-800/80">
              <span className="font-medium text-slate-300 block mb-0.5">Seuil de danger pour le corps humain :</span>
              <span>
                {dynState.wetBulbPeak >= 35.0
                  ? '☠️ Chaleur ressentie ≥ 35°C : Effondrement vital certain. Même au repos et à l\'ombre, le corps ne peut pas évacuer sa sueur.'
                  : dynState.wetBulbPeak >= 32.0
                  ? '🚨 Chaleur ressentie ≥ 32°C : Danger mortel. Décès par coup de chaleur en moins de 6h sans pièce climatisée.'
                  : dynState.wetBulbPeak >= 31.0
                  ? '⚠️ Chaleur ressentie ≥ 31°C : Seuil létal. La transpiration ne refroidit plus le corps.'
                  : dynState.wetBulbPeak >= 28.0
                  ? '⚡ Chaleur ressentie ≥ 28°C : Fatigue intense. Travailler dehors en journée devient très risqué.'
                  : '✅ Climat supportable pour le corps humain.'}
              </span>
            </div>
          </div>

          {/* SECTION 3 : ALIMENTATION & RÉCOLTES */}
          <div className="bg-[#121929] rounded-lg p-3 border border-slate-800/90 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-amber-400" />
                Nourriture Disponible &amp; État des Récoltes
              </span>
              <TechTooltip term="haber-bosch" showIconOnly />
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-[#0b101b] p-2 rounded border border-slate-800">
                <span className="text-slate-400 block">Ration par personne</span>
                <span
                  className={`text-base font-bold font-mono tabular-nums ${
                    dynState.calPerCapita < 2100 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {Math.round(dynState.calPerCapita)} kcal/j
                </span>
                <span className="text-[10px] text-slate-500 block">Minimum pour vivre : 2 100 kcal/j</span>
              </div>

              <div className="bg-[#0b101b] p-2 rounded border border-slate-800">
                <span className="text-slate-400 block">Santé des récoltes</span>
                <span className="text-base font-bold font-mono text-amber-400 tabular-nums">
                  {(dynState.cropYieldFactor * 100).toFixed(0)}%
                </span>
                <span className="text-[10px] text-slate-500 block">100% = niveau normal de départ</span>
              </div>
            </div>

            {/* Composition des 4 céréales stratégiques du pays */}
            <div className="space-y-1 text-[11px]">
              <span className="text-slate-400 block">Sensibilité des 4 céréales clés à chaque degré de trop :</span>
              <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                <span className="text-slate-300">Maïs ({(staticData.cropMix.maize * 100).toFixed(0)}% du pays) : -7.4%/°C</span>
                <span className="text-slate-300">Blé ({(staticData.cropMix.wheat * 100).toFixed(0)}% du pays) : -6.0%/°C</span>
                <span className="text-slate-300">Riz ({(staticData.cropMix.rice * 100).toFixed(0)}% du pays) : -3.2%/°C</span>
                <span className="text-slate-300">Soja ({(staticData.cropMix.soy * 100).toFixed(0)}% du pays) : -3.1%/°C</span>
              </div>
            </div>
          </div>

          {/* SECTION 4 : CAUSES DES DÉCÈS */}
          <div className="bg-[#121929] rounded-lg p-3 border border-slate-800/90 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Skull className="w-3.5 h-3.5 text-purple-400" />
                Nombre de Décès par An et Origines
              </span>
              <span className="font-mono text-purple-300 font-bold tabular-nums">
                {(dynState.annualDeaths.total).toFixed(2)} M décès/an
              </span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between items-center bg-[#0b101b] p-1.5 rounded">
                <span className="text-rose-400">Canicules mortelles (chaleur humide) :</span>
                <span className="font-mono font-semibold text-white tabular-nums">
                  {(dynState.annualDeaths.thermal).toFixed(2)} M/an
                </span>
              </div>

              <div className="flex justify-between items-center bg-[#0b101b] p-1.5 rounded">
                <span className="text-amber-400">Famines et manque de nourriture :</span>
                <span className="font-mono font-semibold text-white tabular-nums">
                  {(dynState.annualDeaths.famine).toFixed(2)} M/an
                </span>
              </div>

              <div className="flex justify-between items-center bg-[#0b101b] p-1.5 rounded">
                <span className="text-purple-400">Pénuries d'eau potable et santé :</span>
                <span className="font-mono font-semibold text-white tabular-nums">
                  {(dynState.annualDeaths.sanitary).toFixed(2)} M/an
                </span>
              </div>

              <div className="flex justify-between items-center bg-[#0b101b] p-1.5 rounded">
                <span className="text-slate-400">Décès normaux (vieillesse et maladies courantes) :</span>
                <span className="font-mono text-slate-300 tabular-nums">
                  {(dynState.annualDeaths.base).toFixed(2)} M/an
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 5 : MIGRATIONS & FRONTIÈRES */}
          <div className="bg-[#121929] rounded-lg p-3 border border-slate-800/90 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />
                Déplacements de Population &amp; Frontières
              </span>
              <span className="font-mono text-orange-300 tabular-nums">
                Fermeture frontières : {(dynState.borderClosure * 100).toFixed(0)}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-[#0b101b] p-2 rounded border border-slate-800">
                <span className="text-slate-400 block">Besoin d'émigrer (Urgence)</span>
                <span className="text-sm font-bold font-mono text-orange-400 tabular-nums">
                  {(dynState.pushFactor * 100).toFixed(0)} / 100
                </span>
              </div>

              <div className="bg-[#0b101b] p-2 rounded border border-slate-800">
                <span className="text-slate-400 block">Bilan départs / arrivées</span>
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
    </>
  );
};
