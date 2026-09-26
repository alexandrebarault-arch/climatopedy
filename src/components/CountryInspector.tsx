import React, { useEffect } from 'react';
import { COUNTRIES_DATA } from '../data/countriesData';
import { GlobalBiophysicalState } from '../types/simulation';
import { X, Thermometer, Utensils, Skull, Users, ShieldAlert, AlertTriangle } from 'lucide-react';
import { TechTooltip } from './TechTooltip';
import climatePanelData from '../data/climatePanelData.json';
import { ClimatePanelFile } from '../types/climatePanel';
import { getHabitabilityStatus, shouldShowHistoricalTemperatureRecord } from '../engine/habitabilityStatus';

const climateRows = new Map((climatePanelData as ClimatePanelFile).rows.map(row => [row.id, row]));

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
  const climate = climateRows.get(countryId);
  if (!climate) return null;

  const popChangePct = ((dynState.cohorts.total - staticData.basePop2026) / staticData.basePop2026) * 100;
  const isLethalHeat = dynState.wetBulbPeak >= 31.0;
  const isFamine = dynState.calPerCapita < 2100;
  const habitabilityStatus = getHabitabilityStatus(dynState.wetBulbPeak, dynState.calPerCapita);
  const showHistoricalRecord = shouldShowHistoricalTemperatureRecord(simulationState.year);
  const habitabilityBadgeClass = habitabilityStatus?.severity === 'high'
    ? 'bg-rose-50 text-rose-800 border-rose-200'
    : habitabilityStatus?.severity === 'medium'
    ? 'bg-amber-50 text-amber-900 border-amber-200'
    : 'bg-emerald-50 text-emerald-800 border-emerald-200';

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
              {habitabilityStatus && (
                <span
                  className={`max-w-[150px] truncate rounded border px-1.5 py-0.5 text-[9px] font-semibold ${habitabilityBadgeClass}`}
                  title={habitabilityStatus.explanation}
                  aria-label={`${habitabilityStatus.label}. ${habitabilityStatus.explanation}`}
                >
                  {habitabilityStatus.label}
                </span>
              )}
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
                Alerte thermique du modèle ({Math.floor(simulationState.year)})
              </span>
              {dynState.wetBulbPeak >= 32.0 ? (
                <span className="block text-[11px] text-rose-800 font-bold">
                  • Seuil d'alerte du modèle dépassé : Tw simulée à {dynState.wetBulbPeak.toFixed(1)}°C. Cette valeur n'est pas une estimation médicale de mortalité.
                </span>
              ) : isLethalHeat ? (
                <span className="block text-[11px] text-rose-800">
                  • Seuil d'alerte du modèle dépassé : Tw simulée à {dynState.wetBulbPeak.toFixed(1)}°C.
                </span>
              ) : null}
              {isFamine && (
                <span className="block text-[11px] text-amber-900 font-medium">
                  • Disponibilité calorique simulée : {Math.round(dynState.calPerCapita)} kcal/habitant/jour. La valeur ne constitue pas à elle seule une mesure de famine.
                </span>
              )}
            </div>
          </div>
        )}

        {/* Contenu déroulant avec vocabulaire accessible à tous */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-white">
          <p className="text-[10px] text-slate-600 bg-sky-50 border border-sky-100 rounded-lg p-2.5">
            Les valeurs projetées par pays sont des sorties de CLIMATOPEDY conditionnelles à ses paramètres. Les décimales affichées ne signifient pas que ces résultats sont validés à l’échelle nationale, notamment pour la démographie et la mortalité.
          </p>

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

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block text-[10px]">Pic chaud P99 estimé</span>
                <span className="text-sm font-bold font-mono text-amber-700 tabular-nums">
                  {dynState.summerMaxTemp.toFixed(1)}°C
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block text-[10px]">Humidité estimée</span>
                <span className="text-sm font-bold font-mono text-sky-700 tabular-nums">
                  {dynState.summerHumidity.toFixed(0)}%
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block text-[10px] flex items-center justify-between">
                  <span>Tw (thermomètre mouillé)</span>
                </span>
                <span
                  className={`text-sm font-bold font-mono tabular-nums ${
                    dynState.wetBulbPeak >= 31.0 ? 'text-rose-700 font-extrabold' : 'text-emerald-700'
                  }`}
                >
                  {(Math.floor(simulationState.year) === 2026 ? climate.heatwaveWetBulbC : dynState.wetBulbPeak).toFixed(1)}°C
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block text-[10px]">Moy. des Tmax quotidiennes (proxy)</span>
                <span className="text-sm font-bold font-mono text-rose-700 tabular-nums">
                  {(Math.floor(simulationState.year) === 2026 ? climate.annualMeanDailyMaxTempC : dynState.annualMaxTemp).toFixed(1)}°C
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block text-[10px]">Moy. des Tmin quotidiennes (proxy)</span>
                <span className="text-sm font-bold font-mono text-indigo-800 tabular-nums">
                  {(Math.floor(simulationState.year) === 2026 ? climate.annualMeanDailyMinTempC : dynState.annualMinTemp).toFixed(1)}°C
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block text-[10px]">
                  {Math.floor(simulationState.year) === 2026 ? 'Moyenne annuelle (proxy)' : 'Moyenne annuelle projetée'}
                </span>
                <span className="text-sm font-bold font-mono text-slate-800 tabular-nums">
                  {(Math.floor(simulationState.year) === 2026 ? climate.annualMeanTempC : dynState.dryBulbTemp).toFixed(1)}°C
                </span>
                <span className="text-[9px] text-slate-400 block">{Math.floor(simulationState.year) === 2026 ? 'Normale du point représentatif, pas moyenne nationale' : 'Projection locale conditionnelle au scénario'}</span>
              </div>
            </div>

            {showHistoricalRecord && climate.absoluteAirTemperatureRecord ? (
              <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 shadow-2xs">
                <span className="text-amber-900 text-[10px] font-medium">Record officiel documenté de la zone : </span>
                <span className="text-sm font-bold font-mono text-amber-900 tabular-nums">{climate.absoluteAirTemperatureRecord.valueC.toFixed(1)}°C</span>
                <span className="text-[10px] text-amber-900"> à {climate.absoluteAirTemperatureRecord.location}, {climate.absoluteAirTemperatureRecord.date} · </span>
                <a className="text-[10px] underline text-amber-900" href={climate.absoluteAirTemperatureRecord.sourceUrl} target="_blank" rel="noreferrer">{climate.absoluteAirTemperatureRecord.sourceLabel}</a>
                <span className="block text-[9px] text-amber-800">Couverture des records : {climate.recordCoverage.sourcedMembers}/{climate.recordCoverage.totalMembers} pays membres documentés.</span>
              </div>
            ) : showHistoricalRecord ? <p className="text-[10px] text-slate-500">Record absolu : indisponible faute de source vérifiée intégrée.</p> : null}

            <p className="text-[10px] leading-relaxed text-slate-500">
              Normales 1991–2020 issues d’un point NASA POWER/MERRA-2, utilisé comme proxy de la zone. Le P99 chaud et l’humidité sont estimés; l’humidité n’est pas simultanée à la Tmax. Tw est calculée, jamais une température mesurée. Les moyennes des maximales et minimales quotidiennes ne sont pas des records.
            </p>
            <p className="text-[9px] text-slate-400">Données générées le {new Date(climate.provenance.generatedAt).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Paris' })} · référence 1991–2020.</p>

            {staticData.id === 'fra' && Math.floor(simulationState.year) === 2026 && (
              <p className="text-[10px] leading-relaxed text-sky-900 bg-sky-50 border border-sky-100 rounded-lg p-2.5">
                En observation, Météo-France mesure pour l’été 2026 une moyenne de 24,0 °C sur 24 h (+3,6 °C par rapport à la normale) et 53 jours en vague de chaleur. Ce bilan saisonnier n’est pas une moyenne annuelle.{' '}
                <a className="underline font-medium" href="https://meteofrance.com/presse/bilan-climatique-de-lete-2026-juin-juillet-aout" target="_blank" rel="noreferrer">Bilan Météo-France</a>
              </p>
            )}

            <div className="text-[11px] text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
              <span className="font-semibold text-slate-900 block mb-0.5">Seuil d’alerte thermique du modèle :</span>
              <span>
                {dynState.wetBulbPeak >= 31.0
                  ? `Tw simulée ≥ 31°C, au-dessus du seuil d'alerte configuré dans le modèle. Ce seuil n'est pas une limite universelle de mortalité.`
                  : dynState.wetBulbPeak >= 28.0
                  ? 'Tw simulée ≥ 28°C, plage signalée par le modèle. Le niveau de risque individuel dépend des conditions d’exposition et de la physiologie.'
                  : 'Tw simulée sous les seuils d’alerte configurés dans le modèle.'}
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
                <span className="text-slate-500 block">Disponibilité alimentaire simulée</span>
                <span
                  className={`text-base font-bold font-mono tabular-nums ${
                    dynState.calPerCapita < 2100 ? 'text-rose-700' : 'text-emerald-700'
                  }`}
                >
                  {Math.round(dynState.calPerCapita)} kcal/j
                </span>
                <span className="text-[10px] text-slate-400 block">Repère interne du modèle : 2 100 kcal/j; ne mesure pas la consommation réelle ni la famine.</span>
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

          {/* SECTION 4 : LIMITES DES ESTIMATIONS SANITAIRES */}
          <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Skull className="w-3.5 h-3.5 text-purple-600" />
                Estimation des décès
              </span>
              <span className="text-xs font-semibold text-rose-800">Non estimée</span>
            </div>

            <p className="text-[10px] leading-relaxed text-slate-600">Les formules actuelles ne relient pas la chaleur ou l’alimentation à des données sanitaires observées. Elles ne permettent donc pas d’estimer les décès de cette zone. Les seuils thermiques restent des alertes du modèle, sans interprétation médicale.</p>
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
                <span className="text-slate-500 block">Indice de pression interne</span>
                <span className="text-sm font-bold font-mono text-amber-800 tabular-nums">
                  {(dynState.pushFactor * 100).toFixed(0)} / 100
                </span>
              </div>

              <p className="col-span-2 text-[10px] text-slate-500">Indice exploratoire sans conversion en nombre de personnes déplacées.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
