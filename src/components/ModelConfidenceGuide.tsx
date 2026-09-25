import React from 'react';
import { Activity, Database, Info, Sprout, Thermometer, Users, Waves, Zap } from 'lucide-react';

type Confidence = 'Élevée' | 'Partielle' | 'Faible' | 'Très faible';

const confidenceLevels: { label: Confidence; style: string; meaning: string }[] = [
  {
    label: 'Élevée',
    style: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    meaning: 'Une mesure publiée correspond directement au chiffre et à la période indiqués.'
  },
  {
    label: 'Partielle',
    style: 'bg-sky-100 text-sky-800 border-sky-200',
    meaning: 'La méthode convient au calcul, a réussi une vérification sur des observations passées indépendantes et une plage d’incertitude est montrée.'
  },
  {
    label: 'Faible',
    style: 'bg-amber-100 text-amber-900 border-amber-200',
    meaning: 'Le chiffre dépend d’entrées simplifiées ou d’hypothèses qui n’ont pas encore été assez vérifiées.'
  },
  {
    label: 'Très faible',
    style: 'bg-rose-100 text-rose-800 border-rose-200',
    meaning: 'Le chiffre vient d’une règle interne exploratoire, sans validation indépendante pour cet usage.'
  }
];

const domains: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  confidence: Confidence;
  kind: string;
  text: string;
  nextStep: string;
  source: string;
  href: string;
  reference: string;
  referenceConfidence: Confidence;
  referenceSource: string;
  referenceHref: string;
}[] = [
  {
    title: 'CO₂ mondial observé en 2024',
    icon: Database,
    confidence: 'Élevée',
    kind: 'Mesure publiée',
    text: 'La NOAA rapporte une moyenne mondiale annuelle de 422,8 ppm. Cette valeur décrit 2024; elle n’est pas une prévision.',
    nextStep: 'Garder la période et le périmètre avec la valeur.',
    source: 'NOAA, données mondiales de CO₂',
    href: 'https://prod-01-asg-www-climate.woc.noaa.gov/news-features/understanding-climate/climate-change-atmospheric-carbon-dioxide',
    reference: 'Repère observé : 422,8 ppm de moyenne mondiale annuelle en 2024.',
    referenceConfidence: 'Élevée',
    referenceSource: 'NOAA, moyenne mondiale 2024',
    referenceHref: 'https://prod-01-asg-www-climate.woc.noaa.gov/news-features/understanding-climate/climate-change-atmospheric-carbon-dioxide'
  },
  {
    title: 'CO₂ initialisé en 2026 (ancré sur 2025)',
    icon: Database,
    confidence: 'Élevée',
    kind: 'Observation annuelle utilisée comme valeur de départ',
    text: 'Le moteur part maintenant de 425,6 ppm, moyenne mondiale annuelle publiée pour 2025. La répartition entre ses réservoirs reste une hypothèse interne : cette correction ancre le niveau initial, mais ne valide pas la trajectoire future.',
    nextStep: 'Conserver l’année et le périmètre avec la valeur; évaluer séparément la trajectoire du cycle carbone.',
    source: 'NOAA, Global Carbon Budget 2025',
    href: 'https://repository.library.noaa.gov/view/noaa/74317',
    reference: '425,6 ppm est la moyenne mondiale annuelle estimée pour 2025; ce n’est ni la moyenne de 2026 ni une mesure de Mauna Loa seule.',
    referenceConfidence: 'Élevée',
    referenceSource: 'NOAA, Global Carbon Budget 2025',
    referenceHref: 'https://repository.library.noaa.gov/view/noaa/74317'
  },
  {
    title: 'Température et CO₂ futurs',
    icon: Activity,
    confidence: 'Faible',
    kind: 'Projection conditionnelle',
    text: 'Les courbes dépendent d’émissions et de paramètres propres à CLIMATOPEDY. Le cycle carbone reprend une structure de réservoirs, mais ne produit pas directement une projection FaIR ou du GIEC.',
    nextStep: 'Utiliser des scénarios publiés, comparer le moteur aux observations historiques indépendantes et afficher la plage de plusieurs simulations.',
    source: 'NASA, projections climatiques CMIP6',
    href: 'https://www.nccs.nasa.gov/data-collections/nex-gddp-cmip6/',
    reference: 'GIEC, moyenne 2081–2100 par rapport à 1850–1900 : SSP1-2.6 +1,8 °C [1,3–2,4]; SSP2-4.5 +2,7 °C [2,1–3,5]; SSP5-8.5 +4,4 °C [3,3–5,7]. Ces scénarios ne sont pas ceux du simulateur.',
    referenceConfidence: 'Partielle',
    referenceSource: 'GIEC AR6, chapitre 4',
    referenceHref: 'https://www.ipcc.ch/report/ar6/wg1/chapter/chapter-4/'
  },
  {
    title: 'Chaleur et température humide par région',
    icon: Thermometer,
    confidence: 'Faible',
    kind: 'Calcul avec entrées simplifiées',
    text: 'La formule de Stull estime la température humide à partir de la température et de l’humidité. Les entrées régionales du simulateur sont des paramètres statiques, pas une série météo locale.',
    nextStep: 'Calculer avec des données météo quotidiennes, puis comparer les résultats historiques aux stations météo avant de les projeter.',
    source: 'Stull, formule de température humide',
    href: 'https://doi.org/10.1175/JAMC-D-11-0143.1',
    reference: 'La formule de Stull a une erreur absolue moyenne inférieure à 0,3 °C dans son domaine d’application. En laboratoire, une étude sur de jeunes adultes en bonne santé a mesuré 30,55 ± 0,98 °C dans des conditions humides précises; ce n’est pas un seuil universel ni un seuil de mortalité.',
    referenceConfidence: 'Partielle',
    referenceSource: 'Stull (2011) et Vecellio et al. (2022)',
    referenceHref: 'https://pubmed.ncbi.nlm.nih.gov/34913738/'
  },
  {
    title: 'Niveau marin et terres côtières',
    icon: Waves,
    confidence: 'Faible',
    kind: 'Projection globale et indicateur régional simplifié',
    text: 'Le niveau marin du moteur est global. L’indice de terres côtières ne représente pas l’altitude locale, les défenses ni les mouvements du sol.',
    nextStep: 'Utiliser des projections régionales et, pour les zones touchées, des données d’altitude et de mouvement local du sol.',
    source: 'NASA, projections du GIEC AR6 par région',
    href: 'https://sealevel.nasa.gov/data_tools/17',
    reference: 'Hausse moyenne mondiale probable d’ici 2100, par rapport à 1995–2014 : 0,32–0,62 m sous SSP1-2.6; 0,44–0,76 m sous SSP2-4.5; 0,63–1,01 m sous SSP5-8.5. Ce ne sont pas des pertes de terres par pays.',
    referenceConfidence: 'Partielle',
    referenceSource: 'NASA, outil des projections GIEC AR6',
    referenceHref: 'https://sealevel.nasa.gov/data_tools/17'
  },
  {
    title: 'Rendements des cultures',
    icon: Sprout,
    confidence: 'Faible',
    kind: 'Projection agricole simplifiée',
    text: 'Des sensibilités moyennes mondiales sont appliquées à des mélanges de cultures régionaux. La météo, les sols, l’irrigation et les pratiques agricoles ne sont pas simulés en détail.',
    nextStep: 'Comparer des modèles agricoles aux rendements observés dans le passé et montrer l’écart entre plusieurs modèles.',
    source: 'ISIMIP, modèles agricoles et protocole',
    href: 'https://www.isimip.org/protocol/',
    reference: 'Pour +1 °C de température moyenne mondiale, Zhao et al. estiment en moyenne : maïs −7,4 ± 4,5 %, blé −6,0 ± 2,9 %, riz −3,2 ± 3,7 %, soja −3,1 ± 5,0 %. Ces moyennes ne prédisent pas le rendement d’un pays; elles excluent notamment l’adaptation et l’effet fertilisant du CO₂.',
    referenceConfidence: 'Partielle',
    referenceSource: 'Zhao et al. (2017), synthèse de quatre méthodes',
    referenceHref: 'https://www.giss.nasa.gov/pubs/abs/zh09200d.html'
  },
  {
    title: 'Calories disponibles par personne',
    icon: Sprout,
    confidence: 'Très faible',
    kind: 'Calcul exploratoire',
    text: 'Le chiffre découle d’un rendement simplifié et d’une population régionale. Il ne mesure pas les aliments consommés ou accessibles aux habitants.',
    nextStep: 'Ajouter les données de production, échanges, pertes et disponibilité alimentaire; valider séparément chaque composante.',
    source: 'FAOSTAT, production et rendements agricoles',
    href: 'https://www.fao.org/faostat/',
    reference: 'Repère observé : en 2023, l’offre alimentaire mondiale moyenne a dépassé 3 000 kcal par personne et par jour. C’est une disponibilité apparente nationale moyenne, pas la consommation de chaque personne ni une projection future.',
    referenceConfidence: 'Élevée',
    referenceSource: 'FAO, bilans alimentaires 2010–2023',
    referenceHref: 'https://www.fao.org/statistics/highlights-archive/highlights-detail/food-balance-sheets-2010-2023/'
  },
  {
    title: 'Décès associés à la chaleur, à l’alimentation ou à l’énergie',
    icon: Activity,
    confidence: 'Très faible',
    kind: 'Calcul exploratoire non validé en épidémiologie',
    text: 'Les taux de décès viennent de formules internes. La température humide ou un déficit calorique ne permet pas, à lui seul, de déduire combien de personnes mourront.',
    nextStep: 'Utiliser des liens entre météo et mortalité mesurés dans les données de santé, par âge et par région, puis vérifier leur performance sur des années non utilisées pour les régler.',
    source: 'OMS, méthodes d’évaluation des effets sanitaires',
    href: 'https://www.who.int/publications/i/item/9789241507691',
    reference: 'Repère publié : l’OMS estimait environ 250 000 décès supplémentaires par an entre 2030 et 2050 pour quatre causes étudiées. L’estimation repose sur des hypothèses de croissance et de progrès sanitaires; elle ne valide pas les décès calculés par CLIMATOPEDY.',
    referenceConfidence: 'Partielle',
    referenceSource: 'OMS (2014), estimation mondiale à causes limitées',
    referenceHref: 'https://www.who.int/publications/i/item/9789241507691'
  },
  {
    title: 'Population future',
    icon: Users,
    confidence: 'Faible',
    kind: 'Projection démographique interne',
    text: 'Le moteur agrège 34 zones. Avant 2026, leurs effectifs sont reconstruits en appliquant à ces zones l’évolution de la population mondiale, faute de séries historiques propres à chacune. Après 2026, les effectifs suivent des règles internes; les projections de l’ONU ne sont pas chargées directement.',
    nextStep: 'Utiliser les projections de l’ONU comme référence démographique, puis isoler tout effet climatique calculé séparément.',
    source: 'ONU, World Population Prospects 2024',
    href: 'https://population.un.org/wpp/',
    reference: 'ONU WPP 2024 estime la population mondiale à 8,16 milliards en 2025; son scénario central atteint 10,2 milliards en 2100 (plage probabiliste à 95 % : 9,0–11,4 milliards). Au départ, les 34 zones du moteur totalisent 7,597 milliards : environ 93 % du repère mondial 2025, soit près de 565 millions de personnes non représentées dans cette agrégation. Les trajectoires du moteur ne sont donc pas des totaux mondiaux complets.',
    referenceConfidence: 'Partielle',
    referenceSource: 'ONU, WPP 2024',
    referenceHref: 'https://population.un.org/wpp/assets/Files/WPP2024_Summary-of-Results.pdf'
  },
  {
    title: 'Migrations liées au climat',
    icon: Users,
    confidence: 'Très faible',
    kind: 'Règle interne de déplacement',
    text: 'Le moteur répartit des personnes selon des scores simplifiés. Ces chiffres ne sont ni des observations de migrations ni des prévisions validées.',
    nextStep: 'S’appuyer sur des modèles publiés et leurs scénarios; tester toute nouvelle méthode sur des déplacements observés. Sinon, n’afficher que des exemples conditionnels.',
    source: 'Banque mondiale, scénarios Groundswell',
    href: 'https://www.worldbank.org/en/news/feature/2021/09/13/millions-on-the-move-in-their-own-countries-the-human-face-of-climate-change',
    reference: 'La Banque mondiale a estimé jusqu’à 216 millions de migrants climatiques internes d’ici 2050 dans six régions, selon des scénarios. Il s’agit de déplacements à l’intérieur d’un même pays; ce total n’est pas une prévision mondiale de migrations internationales.',
    referenceConfidence: 'Partielle',
    referenceSource: 'Banque mondiale, Groundswell Part II',
    referenceHref: 'https://www.worldbank.org/en/news/press-release/2021/09/13/climate-change-could-force-216-million-people-to-migrate-within-their-own-countries-by-2050'
  },
  {
    title: 'Énergie et rendement pétrolier (EROI)',
    icon: Zap,
    confidence: 'Faible',
    kind: 'Scénario énergétique interne',
    text: 'Le rendement énergétique dépend de la ressource et de la méthode de calcul. La baisse future affichée dépend d’une formule et de réserves choisies dans le simulateur.',
    nextStep: 'Préciser la définition et le périmètre de l’EROI, sourcer les données historiques et confronter les scénarios à des trajectoires énergétiques publiées.',
    source: 'Hall, Lambert & Balogh, méthodes EROI',
    href: 'https://doi.org/10.1016/j.enpol.2013.05.049',
    reference: 'Une étude d’ingénierie de cinq grands champs pétroliers a estimé des baisses de rendement énergétique net de 46 à 88 % sur les périodes étudiées. Les résultats varient selon le champ et la définition; ils ne donnent pas une trajectoire mondiale future.',
    referenceConfidence: 'Partielle',
    referenceSource: 'Tripathi & Brandt (2017), cinq champs pétroliers',
    referenceHref: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0171083'
  }
];

const confidenceStyle: Record<Confidence, string> = Object.fromEntries(
  confidenceLevels.map(({ label, style }) => [label, style])
) as Record<Confidence, string>;

export const ModelConfidenceGuide: React.FC = () => (
  <section aria-labelledby="confidence-guide-title" className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs">
    <div className="flex items-start gap-3">
      <span className="mt-0.5 rounded-lg bg-sky-100 p-2 text-sky-700"><Info className="h-5 w-5" /></span>
      <div>
        <h2 id="confidence-guide-title" className="text-lg sm:text-xl font-bold text-slate-900">Que valent les chiffres affichés ?</h2>
        <p className="mt-1 max-w-4xl text-sm leading-relaxed text-slate-600">
          Chaque fiche distingue <strong>la sortie calculée par CLIMATOPEDY</strong> du <strong>repère scientifique publié</strong>. Une source solide permet de comparer un chiffre; elle ne valide pas automatiquement le calcul du simulateur. Les niveaux de confiance qualifient ces deux éléments séparément.
        </p>
      </div>
    </div>

    <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 p-4">
      <h3 className="text-sm font-bold text-slate-900">Quand une projection peut-elle avoir une confiance partielle ?</h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-700">
        Il faut connaître les données et les hypothèses, utiliser une méthode adaptée au chiffre calculé, vérifier que la méthode reproduit correctement une période passée qu’elle n’a pas servi à régler, et montrer une plage de résultats obtenue avec plusieurs scénarios plausibles. C’est une règle de lecture de CLIMATOPEDY, pas une note officielle du GIEC.
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">
        On peut aussi explorer l’avenir en posant des hypothèses — par exemple sur les émissions ou l’adaptation. Il faut les nommer, expliquer pourquoi elles sont retenues et montrer comment le résultat change avec d’autres choix. Cela rend un scénario transparent; cela ne transforme pas l’hypothèse en fait.
      </p>
    </div>

    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {confidenceLevels.map((level) => (
        <div key={level.label} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-bold ${level.style}`}>{level.label}</span>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">{level.meaning}</p>
        </div>
      ))}
    </div>

    <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
      {domains.map(({ title, icon: Icon, confidence, kind, text, nextStep, source, href, reference, referenceConfidence, referenceSource, referenceHref }) => (
        <article key={title} className="rounded-xl border border-slate-200 p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Icon className="h-4 w-4 shrink-0 text-sky-700" />{title}
              </h3>
              <span className="mt-1 ml-6 block text-xs text-slate-500">{kind}</span>
            </div>
            <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-bold ${confidenceStyle[confidence]}`}>
              Sortie CLIMATOPEDY : {confidence.toLowerCase()}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
          <div className="mt-3 rounded-lg border border-sky-100 bg-sky-50/70 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <strong className="text-xs text-slate-800">Repère scientifique publié</strong>
              <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-bold ${confidenceStyle[referenceConfidence]}`}>
                Confiance du repère : {referenceConfidence.toLowerCase()}
              </span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{reference}</p>
            <a href={referenceHref} target="_blank" rel="noreferrer" className="mt-1 inline-flex text-xs font-medium text-sky-700 underline underline-offset-2 hover:text-sky-900">{referenceSource}</a>
          </div>
          {confidence !== 'Élevée' && (
            <p className="mt-2 text-xs leading-relaxed text-slate-700"><strong>Pour progresser :</strong> {nextStep}</p>
          )}
          <a href={href} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-sky-700 underline underline-offset-2 hover:text-sky-900">
            Source à consulter : {source}
          </a>
        </article>
      ))}
    </div>

    <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-950">
      <strong>À retenir :</strong> une hypothèse aide à explorer un futur possible; elle ne devient pas une prévision fiable sans vérification. Si les critères ci-dessus ne sont pas remplis, CLIMATOPEDY garde un niveau faible ou présente le chiffre comme un exemple de scénario.
    </p>
  </section>
);
