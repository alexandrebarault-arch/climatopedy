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
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40 transition-opacity"
        aria-label="Fermer la vue détaillée"
      />

      {/* Panneau latéral droit */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[470px] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header du panneau conçu pour que la CROIX SOIT TOUJOURS VISIBLE, même avec un nom de pays très long */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200 bg-slate-50 flex flex-col gap-2.5 shrink-0">
          {/* Ligne 1 : Nom du pays complet + Code ISO + Bouton FERMER (Inamovible) */}
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <h2
                className="text-base sm:text-lg font-bold text-slate-900 truncate tracking-tight"
                title={staticData.frenchName}
              >
                {staticData.frenchName}
              </h2>
              <span className="font-mono text-xs bg-white text-sky-800 px-2 py-0.5 rounded border border-slate-300 shrink-0 font-bold shadow-2xs">
                {staticData.code}
              </span>
            </div>

            {/* Bouton Fermer (Croix) garanti 100% visible et prioritaire */}
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-rose-50 hover:text-rose-700 text-slate-700 border border-slate-300 hover:border-rose-300 transition-all text-xs font-semibold shrink-0 cursor-pointer shadow-2xs group"
              title="Fermer ce panneau (ou appuyez sur Échap)"
              aria-label="Fermer la fiche pays"
            >
              <X className="w-4 h-4 text-slate-500 group-hover:text-rose-600" />
              <span>Fermer</span>
            </button>
          </div>

          {/* Ligne 2 : Coordonnées géographiques + Sélecteur déroulant de pays */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200 text-xs">
            <span className="text-slate-500 text-[11px] truncate">
              Région {staticData.region} · Coordonnées [{staticData.center[0]}°, {staticData.center[1]}°]
            </span>

            {/* Sélecteur compact d'un autre pays */}
            <select
              value={countryId}
              onChange={(e) => onSelectCountry(e.target.value)}
              className="bg-white text-slate-700 text-xs rounded-md px-2 py-1 border border-slate-300 shadow-2xs focus:outline-none max-w-[180px] truncate shrink-0 cursor-pointer"
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
          <div className="p-3 bg-rose-50 border-b border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 shrink-0">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-rose-950 block">
                Alerte Urgence Vitale Active ({Math.floor(simulationState.year)})
              </span>
              {dynState.wetBulbPeak >= 32.0 ? (
                <span className="block text-[11px] text-rose-800 font-bold">
                  • Canicule mortelle : Température humide Tw à {dynState.wetBulbPeak.toFixed(1)}°C. Le corps ne peut plus évacuer sa chaleur sans climatisation électrique continue.
                </span>
              ) : isLethalHeat ? (
                <span className="block text-[11px] text-rose-800">
                  • Canicule humide létale : Température humide Tw à {dynState.wetBulbPeak.toFixed(1)}°C. Risque mortel d'hyperthermie pour la population.
                </span>
              ) : null}
              {isFamine && (
                <span className="block text-[11px] text-amber-900 font-medium">
                  • Famine grave : Ration alimentaire tombée à {Math.round(dynState.calPerCapita)} kcal/jour (en dessous du minimum vital de 2 100 kcal).
                </span>
              )}
            </div>
          </div>
        )}

        {/* Contenu déroulant avec vocabulaire accessible à tous */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-white">
          {/* SECTION 1 : POPULATION & ÂGES */}
          <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-sky-600" />
                Population &amp; Tranches d'Âge
              </span>
              <span
                className={`font-mono font-bold tabular-nums ${
                  popChangePct < 0 ? 'text-rose-700' : 'text-emerald-700'
                }`}
              >
                {popChangePct > 0 ? `+${popChangePct.toFixed(1)}%` : `${popChangePct.toFixed(1)}%`} vs 2026
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block">Nombre d'habitants</span>
                <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                  {dynState.cohorts.total.toFixed(1)} M
                </span>
                <span className="text-[10px] text-slate-400 block">En 2026 : {staticData.basePop2026} millions</span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block">Enfants par femme</span>
                <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                  {dynState.fertilityActual.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 block">Taux de natalité actuel</span>
              </div>
            </div>

            {/* Répartition par âge */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Enfants (0–14 ans) : {(dynState.cohorts.p0).toFixed(1)}M</span>
                <span>Actifs (15–64 ans) : {(dynState.cohorts.p1).toFixed(1)}M</span>
                <span>Aînés (65+ ans) : {(dynState.cohorts.p2).toFixed(1)}M</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 flex overflow-hidden">
                <div
                  style={{ width: `${(dynState.cohorts.p0 / dynState.cohorts.total) * 100}%` }}
                  className="bg-sky-500"
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
          <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-rose-600" />
                Chaleur Humide &amp; Canicules (Ce que ressent la peau)
              </span>
              <TechTooltip term="stull" showIconOnly />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block text-[10px]">Air à l'ombre (Tmax)</span>
                <span className="text-sm font-bold font-mono text-amber-700 tabular-nums">
                  {dynState.summerMaxTemp.toFixed(1)}°C
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block text-[10px]">Humidité de l'air</span>
                <span className="text-sm font-bold font-mono text-sky-700 tabular-nums">
                  {dynState.summerHumidity}%
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block text-[10px] flex items-center justify-between">
                  <span>Temp. Humide (Tw)</span>
                </span>
                <span
                  className={`text-sm font-bold font-mono tabular-nums ${
                    dynState.wetBulbPeak >= 31.0 ? 'text-rose-700 font-extrabold' : 'text-emerald-700'
                  }`}
                >
                  {dynState.wetBulbPeak.toFixed(1)}°C
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block text-[10px]">Moyenne sur l'année</span>
                <span className="text-sm font-bold font-mono text-slate-800 tabular-nums">
                  {dynState.dryBulbTemp.toFixed(1)}°C
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
              <span className="font-semibold text-slate-900 block mb-0.5">Seuil de danger pour le corps humain :</span>
              <span>
                {dynState.wetBulbPeak >= 35.0
                  ? '☠️ Température humide Tw ≥ 35°C (Létalité absolue) : Effondrement vital certain. Même au repos et à l\'ombre, la transpiration ne peut plus évacuer la chaleur.'
                  : dynState.wetBulbPeak >= 32.0
                  ? '🚨 Température humide Tw ≥ 32°C (Danger mortel) : Décès par coup de chaleur en moins de 6h sans climatisation continue.'
                  : dynState.wetBulbPeak >= 31.0
                  ? '⚠️ Température humide Tw ≥ 31°C (Seuil létal) : La transpiration ne refroidit plus le corps (Raymond et al. 2020).'
                  : dynState.wetBulbPeak >= 28.0
                  ? '⚡ Température humide Tw ≥ 28°C (Stress thermique sévère) : Fatigue intense. Tout travail physique extérieur devient dangereux.'
                  : '✅ Climat thermiquement supportable pour l\'organisme humain.'}
              </span>
            </div>
          </div>

          {/* SECTION 3 : ALIMENTATION & RÉCOLTES */}
          <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-amber-600" />
                Nourriture Disponible &amp; État des Récoltes
              </span>
              <TechTooltip term="haber-bosch" showIconOnly />
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block">Ration par personne</span>
                <span
                  className={`text-base font-bold font-mono tabular-nums ${
                    dynState.calPerCapita < 2100 ? 'text-rose-700' : 'text-emerald-700'
                  }`}
                >
                  {Math.round(dynState.calPerCapita)} kcal/j
                </span>
                <span className="text-[10px] text-slate-400 block">Minimum pour vivre : 2 100 kcal/j</span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block">Santé des récoltes</span>
                <span className="text-base font-bold font-mono text-amber-700 tabular-nums">
                  {(dynState.cropYieldFactor * 100).toFixed(0)}%
                </span>
                <span className="text-[10px] text-slate-400 block">100% = niveau normal de départ</span>
              </div>
            </div>

            {/* Composition des 4 céréales stratégiques du pays */}
            <div className="space-y-1 text-[11px]">
              <span className="text-slate-500 block">Sensibilité des 4 céréales clés à chaque degré de trop :</span>
              <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                <span className="text-slate-600">Maïs ({(staticData.cropMix.maize * 100).toFixed(0)}% du pays) : -7.4%/°C</span>
                <span className="text-slate-600">Blé ({(staticData.cropMix.wheat * 100).toFixed(0)}% du pays) : -6.0%/°C</span>
                <span className="text-slate-600">Riz ({(staticData.cropMix.rice * 100).toFixed(0)}% du pays) : -3.2%/°C</span>
                <span className="text-slate-600">Soja ({(staticData.cropMix.soy * 100).toFixed(0)}% du pays) : -3.1%/°C</span>
              </div>
            </div>
          </div>

          {/* SECTION 4 : CAUSES DES DÉCÈS */}
          <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Skull className="w-3.5 h-3.5 text-purple-600" />
                Nombre de Décès par An et Origines
              </span>
              <span className="font-mono text-purple-800 font-bold tabular-nums">
                {(dynState.annualDeaths.total).toFixed(2)} M décès/an
              </span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-rose-700 font-medium">Canicules mortelles (chaleur humide) :</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {(dynState.annualDeaths.thermal).toFixed(2)} M/an
                </span>
              </div>

              <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-amber-800 font-medium">Famines et manque de nourriture :</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {(dynState.annualDeaths.famine).toFixed(2)} M/an
                </span>
              </div>

              <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-purple-800 font-medium">Pénuries d'eau potable et santé :</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {(dynState.annualDeaths.sanitary).toFixed(2)} M/an
                </span>
              </div>

              <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-600">Décès normaux (vieillesse et maladies courantes) :</span>
                <span className="font-mono text-slate-700 tabular-nums">
                  {(dynState.annualDeaths.base).toFixed(2)} M/an
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 5 : MIGRATIONS & FRONTIÈRES */}
          <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                Déplacements de Population &amp; Frontières
              </span>
              <span className="font-mono text-amber-800 font-semibold tabular-nums">
                Fermeture frontières : {(dynState.borderClosure * 100).toFixed(0)}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block">Besoin d'émigrer (Urgence)</span>
                <span className="text-sm font-bold font-mono text-amber-800 tabular-nums">
                  {(dynState.pushFactor * 100).toFixed(0)} / 100
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block">Bilan départs / arrivées</span>
                <span
                  className={`text-sm font-bold font-mono tabular-nums ${
                    dynState.netMigration < 0 ? 'text-rose-700' : 'text-sky-700'
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
