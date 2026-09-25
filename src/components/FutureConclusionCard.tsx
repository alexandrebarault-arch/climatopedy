import React, { useState } from 'react';
import {
  Compass,
  Award,
  HelpCircle,
  Thermometer,
  Globe2,
  Calendar,
  Heart,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Zap,
  TrendingDown
} from 'lucide-react';
import { MODEL_AUDIT_CRITERIA, MODEL_AUDIT_MAX_RATING, MODEL_AUDIT_SCORE } from '../data/modelAuditScore';

export const FutureConclusionCard: React.FC = () => {
  const [activeEra, setActiveEra] = useState<'2050' | '2080' | '2100' | '2200'>('2050');
  const [glossaryOpen, setGlossaryOpen] = useState<boolean>(true);
  const [confidenceDetailsOpen, setConfidenceDetailsOpen] = useState<boolean>(false);

  return (
    <section className="w-full rounded-2xl bg-white border border-slate-200 p-5 sm:p-8 shadow-xs text-slate-700 flex flex-col gap-8">
      {/* ========================================================================= */}
      {/* BLOC 1 : CLARIFICATION EN FRANÇAIS FACILE DE "STULL TW" ET "MODÈLE FAIR" */}
      {/* ========================================================================= */}
      <div className="bg-slate-50/70 rounded-xl border border-slate-200 p-5 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Déchiffrage immédiat : Stull Tw, FaIR, EROI et Montée des Océans
              </h2>
              <p className="text-xs text-slate-500">
                Les concepts biophysiques clés traduits en français courant sans jargon
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => {
                document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-1 text-xs text-sky-700 hover:text-sky-800 font-semibold px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 shadow-2xs transition-colors cursor-pointer"
              title="Accéder directement à la FAQ et au lexique interactif complet"
            >
              <span>Consulter la FAQ complète</span>
              <span className="text-[10px]">↗</span>
            </button>
            <button
              onClick={() => setGlossaryOpen(!glossaryOpen)}
              className="flex items-center gap-1 text-xs text-sky-700 hover:text-sky-800 font-medium cursor-pointer"
            >
              <span>{glossaryOpen ? 'Masquer' : 'Aperçu'}</span>
              {glossaryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {glossaryOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
            {/* CARTE DÉCRYPTAGE : LE THERMOMÈTRE MOUILLÉ DE ROLAND STULL (TW) */}
            <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-2xs flex flex-col gap-3">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <Thermometer className="w-4 h-4 text-rose-600" />
                <span>1. « Seuil Stull Tw » = Le Thermomètre Mouillé</span>
              </div>

              <div className="space-y-2 text-slate-700 leading-relaxed">
                <p>
                  <strong>• Que veut dire « Tw » ?</strong> « Tw » signifie en anglais <em>Wet-Bulb Temperature</em>, c'est-à-dire <strong>la température du thermomètre mouillé</strong>, une grandeur météorologique calculée ou mesurée à partir des conditions d'air humide. Elle n'est pas équivalente à une sensation cutanée.
                </p>
                <p>
                  <strong>• Qui est Stull ?</strong> <strong>Roland Stull</strong> a publié en 2011 une approximation empirique de Tw à partir de la température de l'air et de l'humidité relative, dans le domaine de validité décrit par l'article.
                </p>
                <p>
                  <strong>• Pourquoi parle-t-on d'un « Seuil » ?</strong> Notre corps régule sa température à 37°C en transpirant : quand la sueur s'évapore, elle emporte de la chaleur. Mais si l'air est à la fois trop chaud et trop humide (saturation en vapeur d'eau), la sueur ne s'évapore plus du tout.
                </p>
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11.5px] font-medium">
                  <strong>Température humide :</strong> Sherwood et Huber (2010) discutent une limite théorique autour de 35°C Tw lors d'une exposition prolongée. Ce n'est pas un seuil universel de mortalité; la réponse varie selon les conditions d'exposition et la physiologie.
                </div>
              </div>
            </div>

            {/* CARTE DÉCRYPTAGE : LE MODÈLE CLIMATIQUE FaIR */}
            <div className="bg-white p-4 rounded-xl border border-sky-200 shadow-2xs flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sky-800 font-bold text-sm">
                <Globe2 className="w-4 h-4 text-sky-600" />
                <span>2. « FaIR » = Un modèle climatique réduit</span>
              </div>

              <div className="space-y-2 text-slate-700 leading-relaxed">
                <p>
                  <strong>• Que veut dire l'acronyme FaIR ?</strong> FaIR signifie en anglais <em>« Finite Amplitude Impulse Response »</em> (Modèle de réponse impulsionnelle à amplitude finie).
                </p>
                <p>
                  <strong>• À quoi sert-il ?</strong> FaIR est un modèle climatique réduit développé par Chris Smith et ses collègues. Il calcule rapidement la réponse climatique à des scénarios d'émissions; ses résultats dépendent des versions, paramètres et expériences utilisées.
                </p>
                <p>
                  <strong>• Usage dans l'AR6 :</strong> FaIR a contribué à certaines analyses de l'AR6. Le GIEC évalue de nombreux modèles et sources de données; FaIR n'est pas son modèle officiel unique.
                </p>
                <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-900 text-[11.5px] font-medium">
                  🌡️ <strong>Anomalie thermique simulée :</strong> Les valeurs affichées pour 2026 proviennent des données initiales du modèle CLIMATOPEDY; elles ne sont pas une observation annuelle complète de 2026.
                </div>
              </div>
            </div>

            {/* CARTE DÉCRYPTAGE : L'EROI & LE MULTIPLICATEUR PÉTROLE */}
            <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs flex flex-col gap-3">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>3. « EROI » = Le Multiplicateur d'Énergie Pétrolière</span>
              </div>

              <div className="space-y-2 text-slate-700 leading-relaxed">
                <p>
                  <strong>• Que signifie « EROI » ?</strong> En anglais, <em>Energy Return on Investment</em> = Rendement énergétique du capital investi. C'est tout simplement : <strong>Combien de barils d'énergie récolte-t-on pour 1 baril dépensé à forer ?</strong>
                </p>
                <p>
                  <strong>• Pourquoi n'utilise-t-on plus « 12.0 : 1 » ?</strong> Cette notation en ratio mathématique embrouille. On dit désormais <strong>« x12 »</strong> : 1 baril consommé permet d'en extraire 12.
                </p>
                <p>
                  <strong>• À propos des valeurs :</strong> Les ratios EROI dépendent du périmètre de calcul et de la ressource. Les valeurs affichées par le simulateur sont des paramètres ou des résultats du modèle, pas une série historique universelle.
                </p>
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11.5px] font-medium">
                  ⚡ <strong>Énergie nette :</strong> Pour un EROI de 12:1, une unité investie sur douze correspond à l'énergie investie dans le périmètre retenu. Aucun seuil EROI unique ne détermine à lui seul le niveau de services d'une société.
                </div>
              </div>
            </div>

            {/* CARTE DÉCRYPTAGE : LA MONTÉE DU NIVEAU DES OCÉANS */}
            <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-2xs flex flex-col gap-3">
              <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
                <TrendingDown className="w-4 h-4 text-blue-600 rotate-180" />
                <span>4. « Montée des Océans » = Combien de cm augmente la mer ?</span>
              </div>

              <div className="space-y-2 text-slate-700 leading-relaxed">
                <p>
                  <strong>• Pourquoi les mers montent-elles ?</strong> Pour deux raisons physiques : 1) La <em>dilatation thermique</em> (l'eau chaude prend plus de place que l'eau froide) ; 2) La fonte des calottes glaciaires terrestres (Groenland, Antarctique et glaciers de montagne).
                </p>
                <p>
                  <strong>• Projections :</strong> Le GIEC AR6 estime, par rapport à 1995–2014, une élévation probable de 0,28–0,55 m d'ici 2100 sous SSP1-1.9 et de 0,63–1,01 m sous SSP5-8.5. Ces plages sont conditionnelles aux scénarios, avec une confiance moyenne.
                </p>
                <p>
                  <strong>• Impacts côtiers :</strong> L'élévation du niveau marin augmente les risques d'inondation et d'intrusion saline. Les effets varient selon les conditions locales, l'exposition et les mesures de protection.
                </p>
                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-[11.5px] font-medium">
                  🌊 <strong>Sur le simulateur :</strong> L'indicateur affiche une sortie du modèle CLIMATOPEDY; sa valeur dépend des paramètres et de la référence utilisés.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* BLOC 2 : INDICE D'AUDIT SCIENTIFIQUE ET BIOPHYSIQUE                      */}
      {/* ========================================================================= */}
      <div className="bg-slate-50/70 rounded-xl border border-slate-200 p-5 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-300">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Indice de Confiance Scientifique &amp; Biophysique
                </h2>
                <span className="px-2 py-0.5 rounded bg-sky-100 border border-sky-300 text-sky-800 font-mono font-bold text-xs">
                  Évaluation rigoureuse
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Synthèse des preuves disponibles sur les données, les méthodes, la validation et les incertitudes
              </p>
            </div>
          </div>

          {/* SCORE D'AUDIT CALCULÉ À PARTIR DES CRITÈRES CI-DESSOUS */}
          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-amber-300 shadow-2xs shrink-0 self-start sm:self-auto">
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                Score d’audit interne
              </span>
              <span className="text-2xl sm:text-3xl font-mono font-bold text-amber-700 tabular-nums">
                {MODEL_AUDIT_SCORE}/100
              </span>
            </div>
            <div className="h-9 w-[1px] bg-slate-200" />
            <div className="text-xs">
              <span className="text-amber-800 font-semibold block">Barème CLIMATOPEDY</span>
              <span className="text-[10px] text-slate-500">Ce n’est pas une probabilité</span>
            </div>
          </div>
        </div>

        {/* CRITÈRES D'AUDIT : NIVEAU SUR 4, POIDS ÉGAL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {MODEL_AUDIT_CRITERIA.map((criterion) => (
            <div key={criterion.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between gap-2">
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-slate-800 font-semibold">{criterion.title}</span>
                  <span className="font-mono font-bold text-slate-700 shrink-0">{criterion.rating}/{MODEL_AUDIT_MAX_RATING}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">{criterion.rationale}</p>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden" aria-hidden="true">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(criterion.rating / MODEL_AUDIT_MAX_RATING) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* PORTÉE DU SCORE */}
        <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-[11.5px] text-amber-950 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>À propos de cet indice :</strong> le score résume un audit documentaire du modèle actuel. Il ne signifie pas que les sorties ont « {MODEL_AUDIT_SCORE} % de chances d’être vraies » et ne remplace pas une validation indépendante.
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BLOC 3 : CONCLUSION FINALE & MESSAGES POUR LES HABITANTS DU FUTUR         */}
      {/* (2050, 2080 ET 2100)                                                     */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-100 border border-purple-300 text-purple-700">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Conclusion Finale &amp; Bouteille à la Mer pour le Futur
                </h2>
                <span className="px-2 py-0.5 rounded bg-purple-100 border border-purple-300 text-purple-800 text-[11px] font-semibold">
                  2050 · 2080 · 2100 · 2200
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Le message personnel de l'équipe de modélisation adressé aux générations qui vivront ces dates
              </p>
            </div>
          </div>

          {/* Sélecteur de date future */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            {(['2050', '2080', '2100', '2200'] as const).map((era) => (
              <button
                key={era}
                onClick={() => setActiveEra(era)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeEra === era
                    ? 'bg-purple-700 text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                Horizons {era}
              </button>
            ))}
          </div>
        </div>

        {/* CARTE ÉDITORIALE D'ENVOI AU FUTUR */}
        <div className="bg-purple-50/40 border border-purple-200 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
          {/* Halo d'ambiance subtil */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />

          {/* MESSAGE POUR 2050 */}
          {activeEra === '2050' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-purple-800 text-xs font-mono uppercase tracking-wider font-semibold">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>Horizon 2050 · Valeurs conditionnelles du simulateur</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                Résultats affichés pour l'horizon 2050
              </h3>

              <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <p>
                  Les valeurs et descriptions affichées pour 2050 sont des résultats du modèle CLIMATOPEDY, calculés selon ses paramètres. Elles ne décrivent pas des observations de 2050 et ne sont pas des projections officielles du GIEC.
                </p>
                <p>
                  Les résultats dépendent des hypothèses de demande énergétique, d'émissions, d'agriculture et de réponse climatique intégrées au simulateur.
                </p>
                <p>
                  Les valeurs de CO₂, de température et d'EROI affichées ci-dessous sont des indicateurs de cette trajectoire simulée; elles ne constituent pas des prévisions observées.
                </p>
              </div>

              <div className="pt-4 border-t border-purple-200 flex flex-wrap items-center justify-between gap-3 text-xs text-purple-800">
                <span className="italic flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" /> Valeurs simulées par CLIMATOPEDY
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  Sortie du scénario CLIMATOPEDY : CO₂ ~490 ppm · T1 ~+1.85°C · EROI ~11:1
                </span>
              </div>
            </div>
          )}

          {/* MESSAGE POUR 2080 */}
          {activeEra === '2080' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-purple-800 text-xs font-mono uppercase tracking-wider font-semibold">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>Horizon 2080 · Valeurs conditionnelles du simulateur</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                Résultats affichés pour l'horizon 2080
              </h3>

              <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <p>
                  Les valeurs et descriptions affichées pour 2080 sont des résultats du modèle CLIMATOPEDY, calculés selon ses paramètres. Elles ne décrivent pas des observations de 2080 et ne sont pas des projections officielles du GIEC.
                </p>
                <p>
                  Les résultats dépendent des hypothèses du scénario et des paramètres démographiques, énergétiques et agricoles du simulateur.
                </p>
                <p>
                  Les valeurs de CO₂, de température et d'EROI ci-dessous sont des sorties de simulation; elles ne sont pas des observations futures.
                </p>
              </div>

              <div className="pt-4 border-t border-purple-200 flex flex-wrap items-center justify-between gap-3 text-xs text-purple-800">
                <span className="italic flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" /> Valeurs simulées par CLIMATOPEDY
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  Sortie du scénario CLIMATOPEDY : CO₂ ~560 ppm · T1 ~+2.30°C · EROI ~6.5:1
                </span>
              </div>
            </div>
          )}

          {/* MESSAGE POUR 2100 */}
          {activeEra === '2100' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-purple-800 text-xs font-mono uppercase tracking-wider font-semibold">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>Horizon 2100 · Valeurs conditionnelles du simulateur</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                Résultats affichés pour l'horizon 2100
              </h3>

              <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <p>
                  Les valeurs affichées pour 2100 sont des résultats du modèle CLIMATOPEDY, calculés selon ses paramètres. Elles ne décrivent pas des observations de 2100 et ne sont pas des projections officielles du GIEC.
                </p>
                <p>
                  Le GIEC publie des projections conditionnelles à des scénarios d'émissions, avec des plages et niveaux de confiance précisés. Les valeurs produites par CLIMATOPEDY ne remplacent pas ces évaluations.
                </p>
                <p>
                  Les données de cette vue sont calculées par le simulateur; les fonctions utilisées et les hypothèses ne constituent pas des observations futures.
                </p>
              </div>

              <div className="pt-4 border-t border-purple-200 flex flex-wrap items-center justify-between gap-3 text-xs text-purple-800">
                <span className="italic flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-purple-600" /> Sorties du scénario CLIMATOPEDY
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  Valeurs à 2100 : calculées par CLIMATOPEDY selon le scénario sélectionné
                </span>
              </div>
            </div>
          )}

          {/* MESSAGE POUR 2200 */}
          {activeEra === '2200' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-purple-800 text-xs font-mono uppercase tracking-wider font-semibold">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>Horizon 2200 · Valeurs conditionnelles du simulateur</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                Résultats affichés pour l'horizon 2200
              </h3>

              <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <p>
                  Le GIEC estime pour 2300 une élévation du niveau moyen de la mer de 0,3 à 3,1 m sous SSP1-2.6 et de 1,7 à 6,8 m sous SSP5-8.5 en l'absence de l'instabilité des falaises de glace marines (faible confiance). Ces plages ne définissent pas une valeur unique pour 2200.
                </p>
                <p>
                  <strong>Sorties de simulation CLIMATOPEDY :</strong> les températures, niveaux marins et populations présentés pour 2200 sont calculés selon les paramètres propres à chaque scénario. Ils ne sont pas des projections officielles du GIEC ou de l'ONU.
                </p>
                <p>
                  Les processus et projections scientifiques de long terme comportent une incertitude importante; les résultats du simulateur ne permettent pas d'établir des états futurs certains.
                </p>
              </div>

              <div className="pt-4 border-t border-purple-200 flex flex-wrap items-center justify-between gap-3 text-xs text-purple-800">
                <span className="italic flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-purple-600" /> Sorties du scénario CLIMATOPEDY
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  Paramètres repères : T1 +1.3°C à +4.5°C · Hausse marine +0.8m à +2.6m
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
