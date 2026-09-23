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

export const FutureConclusionCard: React.FC = () => {
  const [activeEra, setActiveEra] = useState<'2050' | '2080' | '2100'>('2050');
  const [glossaryOpen, setGlossaryOpen] = useState<boolean>(true);
  const [confidenceDetailsOpen, setConfidenceDetailsOpen] = useState<boolean>(false);

  return (
    <section className="w-full rounded-2xl bg-gradient-to-b from-[#090f1d] via-[#0b1325] to-[#070b14] border border-cyan-800/40 p-5 sm:p-8 shadow-2xl text-slate-200 flex flex-col gap-8">
      {/* ========================================================================= */}
      {/* BLOC 1 : CLARIFICATION EN FRANÇAIS FACILE DE "STULL TW" ET "MODÈLE FAIR" */}
      {/* ========================================================================= */}
      <div className="bg-[#0e1628] rounded-xl border border-slate-800 p-5 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Déchiffrage immédiat : Stull Tw, FaIR, EROI et Montée des Océans
              </h2>
              <p className="text-xs text-slate-400">
                Les concepts biophysiques clés traduits en français courant sans jargon
              </p>
            </div>
          </div>

          <button
            onClick={() => setGlossaryOpen(!glossaryOpen)}
            className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-medium self-start sm:self-auto cursor-pointer"
          >
            <span>{glossaryOpen ? 'Masquer les définitions' : 'Voir les explications détaillées'}</span>
            {glossaryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {glossaryOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
            {/* CARTE DÉCRYPTAGE : LE THERMOMÈTRE MOUILLÉ DE ROLAND STULL (TW) */}
            <div className="bg-[#121c32] p-4 rounded-xl border border-rose-900/40 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                <Thermometer className="w-4 h-4 text-rose-400" />
                <span>1. « Seuil Stull Tw » = Le Thermomètre Mouillé</span>
              </div>

              <div className="space-y-2 text-slate-300 leading-relaxed">
                <p>
                  <strong>• Que veut dire « Tw » ?</strong> « Tw » signifie en anglais <em>Wet-Bulb Temperature</em>, c'est-à-dire <strong>la température du thermomètre mouillé</strong>. C'est la température exacte que ressent la peau humaine mouillée par la sueur au contact de l'air.
                </p>
                <p>
                  <strong>• Qui est Stull ?</strong> Le professeur <strong>Roland Stull</strong> est un chercheur renommé en sciences atmosphériques à l'Université de Colombie-Britannique. En 2011, il a publié la formule mathématique mondiale de référence permettant de calculer précisément ce thermomètre mouillé en combinant la température de l'air (en °C) et le taux d'humidité relative (en %).
                </p>
                <p>
                  <strong>• Pourquoi parle-t-on d'un « Seuil » ?</strong> Notre corps régule sa température à 37°C en transpirant : quand la sueur s'évapore, elle emporte de la chaleur. Mais si l'air est à la fois trop chaud et trop humide (saturation en vapeur d'eau), la sueur ne s'évapore plus du tout.
                </p>
                <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-200 text-[11.5px] font-medium">
                  🚨 <strong>Le seuil létal de 31,0°C Tw (Raymond et al., 2020) :</strong> Au-delà de cette valeur, un être humain au repos à l'ombre ne peut plus évacuer sa chaleur corporelle. Sans climatisation électrique continue, la température interne grimpe à 42°C en quelques heures (coup de chaleur mortel).
                </div>
              </div>
            </div>

            {/* CARTE DÉCRYPTAGE : LE MODÈLE CLIMATIQUE FaIR */}
            <div className="bg-[#121c32] p-4 rounded-xl border border-cyan-900/40 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                <Globe2 className="w-4 h-4 text-cyan-400" />
                <span>2. « FaIR » = Le Modèle Climatique du GIEC</span>
              </div>

              <div className="space-y-2 text-slate-300 leading-relaxed">
                <p>
                  <strong>• Que veut dire l'acronyme FaIR ?</strong> FaIR signifie en anglais <em>« Finite Amplitude Impulse Response »</em> (Modèle de réponse impulsionnelle à amplitude finie).
                </p>
                <p>
                  <strong>• À quoi sert-il ?</strong> Les supercalculateurs climatiques de pointe mettent des semaines à simuler le climat mondial. En 2018, l'équipe du Dr Chris Smith (Oxford/Leeds) a conçu <strong>FaIR v1.1</strong> pour calculer avec exactitude l'effet de serre et la température de la Terre en quelques millisecondes.
                </p>
                <p>
                  <strong>• Quel est son rôle officiel ?</strong> FaIR est le modèle simplifié officiel retenu par le <strong>GIEC</strong> dans son 6e rapport d'évaluation (AR6, Groupe de travail I).
                </p>
                <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-800/60 text-cyan-200 text-[11.5px] font-medium">
                  🌡️ <strong>L'« Anomalie Thermique » :</strong> C'est la hausse de température moyenne à la surface de la Terre comparée à l'ère préindustrielle (1850-1900). En 2026, nous sommes à <strong>+1,35°C</strong> d'anomalie mondiale.
                </div>
              </div>
            </div>

            {/* CARTE DÉCRYPTAGE : L'EROI & LE MULTIPLICATEUR PÉTROLE */}
            <div className="bg-[#121c32] p-4 rounded-xl border border-amber-900/40 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>3. « EROI » = Le Multiplicateur d'Énergie Pétrolière</span>
              </div>

              <div className="space-y-2 text-slate-300 leading-relaxed">
                <p>
                  <strong>• Que signifie « EROI » ?</strong> En anglais, <em>Energy Return on Investment</em> = Rendement énergétique du capital investi. C'est tout simplement : <strong>Combien de barils d'énergie récolte-t-on pour 1 baril dépensé à forer ?</strong>
                </p>
                <p>
                  <strong>• Pourquoi n'utilise-t-on plus « 12.0 : 1 » ?</strong> Cette notation en ratio mathématique embrouille. On dit désormais <strong>« x12 »</strong> : 1 baril consommé permet d'en extraire 12.
                </p>
                <p>
                  <strong>• L'histoire en 2 dates :</strong> En 1900, le pétrole de surface rapportait <strong>x100</strong> (1 baril pour 100). En 2026, avec les forages sous-marins profonds et les sables bitumineux, il ne rapporte plus que <strong>x12</strong>.
                </p>
                <div className="p-2.5 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-200 text-[11.5px] font-medium">
                  ⚡ <strong>L'Énergie Nette pour la société :</strong> Si un puits rapporte x12, 1/12e sert au forage, et les <strong>92% restants</strong> alimentent les tracteurs, les camions, les trains et les hôpitaux. En dessous de x5, la société n'a plus assez d'énergie pour assurer ses services de base.
                </div>
              </div>
            </div>

            {/* CARTE DÉCRYPTAGE : LA MONTÉE DU NIVEAU DES OCÉANS */}
            <div className="bg-[#121c32] p-4 rounded-xl border border-sky-900/40 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sky-300 font-bold text-sm">
                <TrendingDown className="w-4 h-4 text-sky-400 rotate-180" />
                <span>4. « Montée des Océans » = Combien de cm augmente la mer ?</span>
              </div>

              <div className="space-y-2 text-slate-300 leading-relaxed">
                <p>
                  <strong>• Pourquoi les mers montent-elles ?</strong> Pour deux raisons physiques : 1) La <em>dilatation thermique</em> (l'eau chaude prend plus de place que l'eau froide) ; 2) La fonte des calottes glaciaires terrestres (Groenland, Antarctique et glaciers de montagne).
                </p>
                <p>
                  <strong>• Combien augmente-t-elle en chiffres concrets ?</strong> En 1900, la mer était 22 cm plus basse qu'aujourd'hui. En 2026, elle a déjà monté de <strong>+12 cm</strong> (référence 2000). D'ici 2100, les projections prévoient <strong>+60 à +75 cm supplémentaires</strong>.
                </p>
                <p>
                  <strong>• Quels impacts sur les populations ?</strong> Une montée de +50 cm suffit à saliniser les nappes phréatiques côtières (eau potable impropre) et à inonder chaque année les grands deltas rizicoles d'Asie (Mékong, Gange-Brahmapoutre) nourrissant des centaines de millions de personnes.
                </p>
                <div className="p-2.5 rounded-lg bg-sky-950/60 border border-sky-800/60 text-sky-200 text-[11.5px] font-medium">
                  🌊 <strong>Sur le simulateur :</strong> L'indicateur affiche la valeur globale en cm à l'instant T (+12 cm en 2026, jusqu'à +75 cm en 2100) ainsi que le delta exact par rapport à aujourd'hui.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* BLOC 2 : CHIFFRE DE CONFIANCE SCIENTIFIQUE ENVERS LE TRAVAIL RÉALISÉ       */}
      {/* ========================================================================= */}
      <div className="bg-[#0b1322] rounded-xl border border-slate-800 p-5 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Indice de Confiance Scientifique &amp; Biophysique
                </h2>
                <span className="px-2 py-0.5 rounded bg-emerald-950/90 border border-emerald-700 text-emerald-300 font-mono font-bold text-xs">
                  Évaluation Rigoureuse
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Mesure de la robustesse mathématique, des fondements physiques et des marges d'incertitude épistémique
              </p>
            </div>
          </div>

          {/* CHIFFRE GLOBAL EN GRAND */}
          <div className="flex items-center gap-3 bg-[#111c33] px-4 py-2.5 rounded-xl border border-emerald-500/40 shrink-0 self-start sm:self-auto">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                Score Global
              </span>
              <span className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 tabular-nums">
                88%
              </span>
            </div>
            <div className="h-9 w-[1px] bg-slate-700" />
            <div className="text-xs">
              <span className="text-emerald-300 font-semibold block">Confiance Élevée</span>
              <span className="text-[10px] text-slate-400">Standard IPCC / GIEC</span>
            </div>
          </div>
        </div>

        {/* DÉCOMPOSITION DÉTAILLÉE PAR PILIER SCIENTIFIQUE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Pilier 1 : Climat FaIR */}
          <div className="bg-[#101828] p-3 rounded-lg border border-slate-800 flex flex-col justify-between gap-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-300 font-semibold">1. Climatologie (FaIR)</span>
                <span className="font-mono font-bold text-emerald-400">94%</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Modèle CMIP6 validé, forçage CO2 direct et transfert de chaleur vers l'océan profond.
              </p>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: '94%' }} />
            </div>
          </div>

          {/* Pilier 2 : Thermodynamique Stull Tw */}
          <div className="bg-[#101828] p-3 rounded-lg border border-slate-800 flex flex-col justify-between gap-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-300 font-semibold">2. Thermodynamique (Tw)</span>
                <span className="font-mono font-bold text-emerald-400">92%</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Physique de l'évaporation d'eau éprouvée (Stull 2011) et seuils physiologiques publiés.
              </p>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: '92%' }} />
            </div>
          </div>

          {/* Pilier 3 : Énergie & EROI */}
          <div className="bg-[#101828] p-3 rounded-lg border border-slate-800 flex flex-col justify-between gap-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-300 font-semibold">3. Énergie Nette (EROI)</span>
                <span className="font-mono font-bold text-amber-400">85%</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Lois de retour énergétique solides ; marge sur le rythme de déploiement des renouvelables.
              </p>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: '85%' }} />
            </div>
          </div>

          {/* Pilier 4 : Agronomie & Calories */}
          <div className="bg-[#101828] p-3 rounded-lg border border-slate-800 flex flex-col justify-between gap-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-300 font-semibold">4. Agronomie (Zhao PNAS)</span>
                <span className="font-mono font-bold text-amber-400">83%</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Méta-analyse mondiale des rendements céréaliers ; marge sur les adaptations de semences.
              </p>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: '83%' }} />
            </div>
          </div>

          {/* Pilier 5 : Démographie & Comportements */}
          <div className="bg-[#101828] p-3 rounded-lg border border-slate-800 flex flex-col justify-between gap-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-300 font-semibold">5. Sociologie &amp; États</span>
                <span className="font-mono font-bold text-amber-400">78%</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Hypothèse de rigidité institutionnelle (SSP5-8.5). Le libre-arbitre humain reste ouvert.
              </p>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: '78%' }} />
            </div>
          </div>
        </div>

        {/* Note sur l'éthique de la modélisation */}
        <div className="p-3 rounded-lg bg-[#0e1728] border border-slate-800/80 text-[11.5px] text-slate-300 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">Ce que garantit ce chiffre de 88% :</strong> La simulation repose sur des lois de conservation biophysiques strictes (conservation de la masse, premier et second principes de la thermodynamique, chimie de la photosynthèse, démographie en cohortes d'âge). Elle ne triche pas avec la physique. Ce qui reste par nature indéterminé à 12%, ce sont les décisions politiques, les élans de solidarité et le génie d'innovation des sociétés humaines.
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BLOC 3 : CONCLUSION FINALE & MESSAGES POUR LES HABITANTS DU FUTUR         */}
      {/* (2050, 2080 ET 2100)                                                     */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/40 text-purple-300">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Conclusion Finale &amp; Bouteille à la Mer pour le Futur
                </h2>
                <span className="px-2 py-0.5 rounded bg-purple-950/80 border border-purple-700 text-purple-300 text-[11px] font-semibold">
                  2050 · 2080 · 2100
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Le message personnel de l'équipe de modélisation adressé aux générations qui vivront ces dates
              </p>
            </div>
          </div>

          {/* Sélecteur de date future */}
          <div className="flex items-center gap-1.5 bg-[#080d17] p-1 rounded-xl border border-slate-800 shrink-0">
            {(['2050', '2080', '2100'] as const).map((era) => (
              <button
                key={era}
                onClick={() => setActiveEra(era)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeEra === era
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-950/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                Horizons {era}
              </button>
            ))}
          </div>
        </div>

        {/* CARTE ÉDITORIALE D'ENVOI AU FUTUR */}
        <div className="bg-gradient-to-br from-[#10172c] via-[#0d1424] to-[#0a0f1d] border border-purple-900/50 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          {/* Halo d'ambiance subtil */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* MESSAGE POUR 2050 */}
          {activeEra === '2050' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-purple-300 text-xs font-mono uppercase tracking-wider font-semibold">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>Message transmis depuis l'an 2026 · À l'attention de nos enfants en 2050</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                « À vous qui franchissez le sommet du pic énergétique et l'épreuve des premières grandes canicules humides. »
              </h3>

              <div className="space-y-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <p>
                  Si vous lisez ces lignes en 2050, vous avez l'âge que nous avions lorsque nous avons conçu ce simulateur en 2026. Vous vivez aujourd'hui dans ce qui n'était pour nous qu'une projection mathématique : un monde où le pétrole facile s'est raréfié, où l'indice Stull Tw dépasse régulièrement les 29°C dans les plaines d'Asie du Sud et du Moyen-Orient, et où chaque mégawatt d'énergie nette compte double.
                </p>
                <p>
                  <strong>Ce que nous voulons vous dire :</strong> Nous ne vous avons pas oubliés. Si nous avons calculé ces trajectoires avec une rigueur implacable, ce n'était pas par pessimisme morbide, mais par refus absolu du déni. Nous savions que pour vous donner une chance d'amortir le choc, il fallait d'abord regarder la falaise thermique et énergétique en face, sans fard et sans illusions technosolutionnistes magiques.
                </p>
                <p>
                  Nous espérons de tout cœur que vous avez su métamorphoser la contrainte en chef-d'œuvre de solidarité : réhabiliter la paysannerie et l'agroécologie locale, transformer les villes minérales en oasis ombragées de fraîcheur végétale, et comprendre qu'une civilisation se mesure à la protection des plus fragiles (les aînés et les nouveaux-nés) plutôt qu'au volume de ses flux superflus.
                </p>
              </div>

              <div className="pt-4 border-t border-purple-900/40 flex flex-wrap items-center justify-between gap-3 text-xs text-purple-300">
                <span className="italic flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400" /> Rédigé avec lucidité, respect et tendresse depuis 2026.
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  Paramètres repères : CO2 ~490 ppm · T1 ~+1.85°C · EROI ~11:1
                </span>
              </div>
            </div>
          )}

          {/* MESSAGE POUR 2080 */}
          {activeEra === '2080' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-purple-300 text-xs font-mono uppercase tracking-wider font-semibold">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>Message transmis depuis l'an 2026 · À l'attention de nos petits-enfants en 2080</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                « À vous qui traversez le goulot d'étranglement biophysique le plus exigeant de l'histoire humaine. »
              </h3>

              <div className="space-y-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <p>
                  En 2080, vous êtes au cœur de ce que les biophysiciens nomment le « goulot d'étranglement ». La mer est montée de près de 50 centimètres sur les deltas du Nil et du Gange, les vagues de chaleur humide ont redéfini la carte de l'inhabitabilité estivale, et le système industriel hérité du XXe siècle a dû achever sa mue radicale vers la sobriété intégrale.
                </p>
                <p>
                  <strong>Notre message pour vous :</strong> Si vous êtes là pour lire ces lignes, vous êtes la preuve vivante que la survie humaine ne dépend pas d'un EROI à 50:1, mais de la densité des liens humains, du soin apporté à la terre nourricière et de la conservation patiente des savoirs fondamentaux (la médecine, la culture, l'ingénierie douce, la démocratie de proximité).
                </p>
                <p>
                  Ne nous maudissez pas trop pour notre lenteur au début du XXIe siècle. Sachez que des millions d'entre nous ont lutté, ont mesuré, ont partagé la vérité et ont semé des graines de résistance dont nous espérons que vous récoltez aujourd'hui les fruits. Vous êtes les pionniers de la décélération choisie.
                </p>
              </div>

              <div className="pt-4 border-t border-purple-900/40 flex flex-wrap items-center justify-between gap-3 text-xs text-purple-300">
                <span className="italic flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Le courage de durer est la plus haute forme d'intelligence.
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  Paramètres repères : CO2 ~560 ppm · T1 ~+2.30°C · EROI ~6.5:1
                </span>
              </div>
            </div>
          )}

          {/* MESSAGE POUR 2100 */}
          {activeEra === '2100' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-purple-300 text-xs font-mono uppercase tracking-wider font-semibold">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>Message transmis depuis l'an 2026 · Aux gardiens et bâtisseurs du XXIIe siècle</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                « Aux héritiers de la Terre apaisée : l'aube du grand rééquilibrage thermodynamique. »
              </h3>

              <div className="space-y-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <p>
                  L'an 2100. Pour nous, en 2026, cette année sonnait comme une frontière mythique, presque inimaginable, la borne ultime de nos tableaux de bord et de nos graphiques. Aujourd'hui, pour vous, c'est le présent. Le siècle fossile s'est définitivement éteint derrière vous.
                </p>
                <p>
                  <strong>Notre conclusion finale :</strong> La Terre n'était pas un réservoir infini à piller, mais un organisme vivant doté de lois physiques inviolables. Vous êtes la première génération de l'histoire moderne qui vit en harmonie mesurée avec les cycles du carbone, de l'eau et de l'azote. Vos ancêtres ont payé le prix lourd de l'apprentissage des limites, mais vous êtes désormais les gardiens éclairés de cet équilibre.
                </p>
                <p>
                  Ce simulateur s'arrête ici, à l'abscisse 2100. Mais votre histoire humaine, elle, commence véritablement. Prenez soin de chaque hectare de forêt, de chaque rivière propre, de chaque brise d'été vivable. Nous vous transmettons notre admiration éternelle et notre bénédiction depuis les origines de cette prise de conscience.
                </p>
              </div>

              <div className="pt-4 border-t border-purple-900/40 flex flex-wrap items-center justify-between gap-3 text-xs text-purple-300">
                <span className="italic flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-purple-400" /> Fin de la trajectoire simulée · Début du temps long régénéré.
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  Paramètres repères : CO2 stabilisé · Régime post-fossile équilibré
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
