import React from 'react';
import { Activity, Database, Info, Sprout, Thermometer, Users, Waves, Zap } from 'lucide-react';
import { MODEL_AUDIT_CRITERIA, MODEL_AUDIT_MAX_RATING, MODEL_AUDIT_SCORE } from '../data/modelAuditScore';

type Confidence = 'Élevée' | 'Partielle' | 'Faible' | 'Très faible';
type Traceability = 'Élevée' | 'Partielle';

const confidenceLevels: { label: Confidence; style: string; meaning: string }[] = [
  {
    label: 'Élevée',
    style: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    meaning: 'Pour une mesure ou une valeur de départ, le chiffre reprend une série publiée avec sa date et son périmètre. Cela ne valide pas les projections du modèle.'
  },
  {
    label: 'Partielle',
    style: 'bg-sky-100 text-sky-800 border-sky-200',
    meaning: 'Le calcul du site a été comparé à des observations indépendantes et son écart est affiché.'
  },
  {
    label: 'Faible',
    style: 'bg-amber-100 text-amber-900 border-amber-200',
    meaning: 'Le résultat du site dépend encore d’hypothèses simplifiées ou n’a pas été vérifié assez largement.'
  },
  {
    label: 'Très faible',
    style: 'bg-rose-100 text-rose-800 border-rose-200',
    meaning: 'Le chiffre vient d’une règle interne qui ne mesure pas correctement la grandeur annoncée; il est retiré ou présenté comme indicateur de scénario.'
  }
];

const domains: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  confidence: Confidence;
  kind: string;
  text: string;
  actionDone: string;
  source: string;
  href: string;
  reference: string;
  referenceTraceability: Traceability;
  referenceSource: string;
  referenceHref: string;
}[] = [
  {
    title: 'CO₂ mondial observé en 2024',
    icon: Database,
    confidence: 'Élevée',
    kind: 'Mesure publiée',
    text: 'La NOAA rapporte une moyenne mondiale annuelle de 422,8 ppm. Cette valeur décrit 2024; elle n’est pas une prévision.',
    actionDone: 'Affiché comme moyenne mondiale annuelle NOAA pour 2024; la mesure ponctuelle de Mauna Loa est distinguée ailleurs.',
    source: 'NOAA, données mondiales de CO₂',
    href: 'https://prod-01-asg-www-climate.woc.noaa.gov/news-features/understanding-climate/climate-change-atmospheric-carbon-dioxide',
    reference: 'Repère observé : 422,8 ppm de moyenne mondiale annuelle en 2024.',
    referenceTraceability: 'Élevée',
    referenceSource: 'NOAA, moyenne mondiale 2024',
    referenceHref: 'https://prod-01-asg-www-climate.woc.noaa.gov/news-features/understanding-climate/climate-change-atmospheric-carbon-dioxide'
  },
  {
    title: 'CO₂ initialisé en 2026 (ancré sur 2025)',
    icon: Database,
    confidence: 'Élevée',
    kind: 'Observation annuelle utilisée comme valeur de départ',
    text: 'Le moteur part maintenant de 425,6 ppm, moyenne mondiale annuelle publiée pour 2025. La répartition entre ses réservoirs reste une hypothèse interne : cette correction ancre le niveau initial, mais ne valide pas la trajectoire future.',
    actionDone: 'Le départ du moteur est ancré sur la moyenne mondiale 2025; la répartition interne des réservoirs est explicitement signalée comme hypothèse.',
    source: 'NOAA, Global Carbon Budget 2025',
    href: 'https://repository.library.noaa.gov/view/noaa/74317',
    reference: '425,6 ppm est la moyenne mondiale annuelle estimée pour 2025; ce n’est ni la moyenne de 2026 ni une mesure de Mauna Loa seule.',
    referenceTraceability: 'Élevée',
    referenceSource: 'NOAA, Global Carbon Budget 2025',
    referenceHref: 'https://repository.library.noaa.gov/view/noaa/74317'
  },
  {
    title: 'Réchauffement mondial au départ (ancré sur 2025)',
    icon: Activity,
    confidence: 'Élevée',
    kind: 'Observation annuelle utilisée comme valeur de départ',
    text: 'Le moteur commence à +1,34 °C, valeur annuelle mondiale publiée par NOAA pour 2025 par rapport à 1850–1900. C’est le dernier millésime complet utilisé comme repère du départ 2026, pas une mesure de l’année 2026.',
    actionDone: 'Le départ thermique est ancré sur NOAA 2025; l’estimation OMM est affichée à côté avec son intervalle et son autre méthode.',
    source: 'NOAA NCEI, température mondiale annuelle 2025',
    href: 'https://www.ncei.noaa.gov/news/global-climate-202513',
    reference: 'NOAA estime l’anomalie mondiale moyenne de 2025 à +1,34 °C par rapport à 1850–1900. L’OMM, en combinant huit jeux de données, estime +1,44 ± 0,13 °C. Ces valeurs ne sont pas contradictoires : les jeux diffèrent par leur couverture et leur méthode. Le moteur utilise la série NOAA.',
    referenceTraceability: 'Élevée',
    referenceSource: 'NOAA NCEI, bilan climatique annuel 2025',
    referenceHref: 'https://www.ncei.noaa.gov/news/global-climate-202513'
  },
  {
    title: 'Température et CO₂ futurs',
    icon: Activity,
    confidence: 'Faible',
    kind: 'Projection conditionnelle',
    text: 'Le scénario « Fortes émissions » du moteur ne reproduit pas SSP5-8.5 : avec les réglages actuels, il atteint environ +2,4 °C et 475 ppm en 2100. Le GIEC évalue +4,4 °C [3,3–5,7] pour SSP5-8.5. Les courbes CLIMATOPEDY restent des expériences internes et ne doivent pas être lues comme une prévision.',
    actionDone: 'La courbe interne est comparée au repère AR6 : environ +2,4 °C et 475 ppm en 2100 dans CLIMATOPEDY, contre +4,4 °C [3,3–5,7] sous SSP5-8.5 dans l’AR6. Cet écart est rendu visible; la sortie interne reste faible.',
    source: 'NASA, projections climatiques CMIP6',
    href: 'https://www.nccs.nasa.gov/data-collections/nex-gddp-cmip6/',
    reference: 'GIEC, moyenne 2081–2100 par rapport à 1850–1900 : SSP1-2.6 +1,8 °C [1,3–2,4]; SSP2-4.5 +2,7 °C [2,1–3,5]; SSP5-8.5 +4,4 °C [3,3–5,7]. La courbe interne « Fortes émissions » est actuellement très en dessous de ce dernier repère.',
    referenceTraceability: 'Élevée',
    referenceSource: 'GIEC AR6, chapitre 4',
    referenceHref: 'https://www.ipcc.ch/report/ar6/wg1/chapter/chapter-4/'
  },
  {
    title: 'Chaleur et température humide par région',
    icon: Thermometer,
    confidence: 'Faible',
    kind: 'Calcul avec entrées simplifiées',
    text: 'La formule de Stull estime correctement Tw à partir d’une température et d’une humidité appropriées. Ici, les entrées régionales sont des paramètres statiques et un pic estival simplifié; le résultat n’est ni une observation météo locale ni une durée d’exposition.',
    actionDone: 'La formule et son domaine sont cités; les seuils sont libellés « alertes du modèle » et aucun nombre de décès ou d’habitabilité n’est déduit.',
    source: 'Stull, formule de température humide',
    href: 'https://doi.org/10.1175/JAMC-D-11-0143.1',
    reference: 'La formule de Stull a une erreur absolue moyenne inférieure à 0,3 °C dans son domaine d’application. Une étude en laboratoire a mesuré une limite critique moyenne de 30,55 ± 0,98 °C chez de jeunes adultes en bonne santé, dans des conditions précises. Le moteur ne dispose pas des séries quotidiennes nécessaires pour estimer la fréquence de ces expositions.',
    referenceTraceability: 'Élevée',
    referenceSource: 'Stull (2011) et Vecellio et al. (2022)',
    referenceHref: 'https://pubmed.ncbi.nlm.nih.gov/34913738/'
  },
  {
    title: 'Niveau marin et terres côtières',
    icon: Waves,
    confidence: 'Faible',
    kind: 'Projection globale et indicateur régional simplifié',
    text: 'La relation semi-empirique du moteur produit une courbe globale, sans vérifier sa performance sur les observations récentes. L’indice côtier interne ne représente ni l’altitude, ni les défenses, ni l’affaissement local; il ne permet pas d’estimer des hectares perdus par pays.',
    actionDone: 'Les plages AR6 avec la période 1995–2014 sont données à côté de la courbe; l’indice local n’est plus converti en hectares ou en terres perdues.',
    source: 'NASA, projections du GIEC AR6 par région',
    href: 'https://sealevel.nasa.gov/data_tools/17',
    reference: 'Hausse moyenne mondiale probable d’ici 2100, par rapport à 1995–2014 : 0,32–0,62 m sous SSP1-2.6; 0,44–0,76 m sous SSP2-4.5; 0,63–1,01 m sous SSP5-8.5. Ce ne sont pas des pertes de terres par pays.',
    referenceTraceability: 'Élevée',
    referenceSource: 'NASA, outil des projections GIEC AR6',
    referenceHref: 'https://sealevel.nasa.gov/data_tools/17'
  },
  {
    title: 'Rendements des cultures',
    icon: Sprout,
    confidence: 'Faible',
    kind: 'Projection agricole simplifiée',
    text: 'Le moteur applique des sensibilités moyennes mondiales à une composition régionale simplifiée. Le résultat n’est pas une prévision de rendement locale : météo, sols, calendrier, irrigation, CO₂, adaptation et échanges alimentaires ne sont pas modélisés ensemble.',
    actionDone: 'Les sensibilités moyennes Zhao sont données culture par culture avec leurs incertitudes; le texte précise qu’elles ne prédisent pas le rendement d’un pays.',
    source: 'ISIMIP, modèles agricoles et protocole',
    href: 'https://www.isimip.org/protocol/',
    reference: 'Pour +1 °C de température moyenne mondiale, Zhao et al. estiment en moyenne : maïs −7,4 ± 4,5 %, blé −6,0 ± 2,9 %, riz −3,2 ± 3,7 %, soja −3,1 ± 5,0 %. Ces moyennes ne prédisent pas le rendement d’un pays; elles excluent notamment l’adaptation et l’effet fertilisant du CO₂.',
    referenceTraceability: 'Élevée',
    referenceSource: 'Zhao et al. (2017), synthèse de quatre méthodes',
    referenceHref: 'https://www.giss.nasa.gov/pubs/abs/zh09200d.html'
  },
  {
    title: 'Calories disponibles par personne',
    icon: Sprout,
    confidence: 'Très faible',
    kind: 'Calcul exploratoire',
    text: 'Le calcul actuel multiplie une valeur calorique de départ par le rendement simulé puis par une règle de disponibilité de main-d’œuvre. Il ne modélise pas les aliments produits, importés, exportés, perdus ou accessibles; les kcal futures affichées ne sont donc pas des projections de disponibilité alimentaire.',
    actionDone: 'Le repère FAO 2023 de plus de 3 000 kcal/personne/jour est cité. Les calories futures du moteur restent très faibles en confiance parce que la formule ne simule pas les bilans alimentaires, le commerce ou les pertes.',
    source: 'FAOSTAT, production et rendements agricoles',
    href: 'https://www.fao.org/faostat/',
    reference: 'Repère observé : en 2023, l’offre alimentaire mondiale moyenne a dépassé 3 000 kcal par personne et par jour. C’est une disponibilité apparente nationale moyenne, pas la consommation de chaque personne ni une projection future.',
    referenceTraceability: 'Élevée',
    referenceSource: 'FAO, bilans alimentaires 2010–2023',
    referenceHref: 'https://www.fao.org/statistics/highlights-archive/highlights-detail/food-balance-sheets-2010-2023/'
  },
  {
    title: 'Décès associés à la chaleur, à l’alimentation ou à l’énergie',
    icon: Activity,
    confidence: 'Très faible',
    kind: 'Calcul exploratoire non validé en épidémiologie',
    text: 'Le moteur transforme directement des seuils Tw, un déficit calorique et un manque d’énergie en taux de décès, sans fonction dose-réponse tirée de données sanitaires. Ces nombres n’ont pas de base scientifique suffisante pour être présentés comme des décès attendus, même avec une étiquette « exploratoire ».',
    actionDone: 'Les nombres de décès calculés par seuils internes ont été retirés des cartes et graphiques. L’OMS est présentée comme repère publié, sans l’utiliser pour valider ces formules.',
    source: 'OMS, méthodes d’évaluation des effets sanitaires',
    href: 'https://www.who.int/publications/i/item/9789241507691',
    reference: 'Repère publié : l’OMS estimait environ 250 000 décès supplémentaires par an entre 2030 et 2050 pour quatre causes étudiées. L’estimation repose sur des hypothèses de croissance et de progrès sanitaires; elle ne valide pas les décès calculés par CLIMATOPEDY.',
    referenceTraceability: 'Élevée',
    referenceSource: 'OMS (2014), estimation mondiale à causes limitées',
    referenceHref: 'https://www.who.int/publications/i/item/9789241507691'
  },
  {
    title: 'Population future',
    icon: Users,
    confidence: 'Faible',
    kind: 'Projection démographique interne',
    text: 'Le moteur agrège 34 zones couvrant environ 93 % du repère mondial 2025. Il utilise trois groupes d’âge et des taux internes; les règles de mortalité, fécondité et migration influencent encore la population simulée, sans constituer des projections nationales ou mondiales complètes.',
    actionDone: 'La couverture des 34 zones est comparée au total ONU 2025 et l’écart est affiché; les cohortes internes ne sont pas présentées comme une projection mondiale complète.',
    source: 'ONU, World Population Prospects 2024',
    href: 'https://population.un.org/wpp/',
    reference: 'ONU WPP 2024 estime la population mondiale à 8,16 milliards en 2025; son scénario central atteint 10,2 milliards en 2100 (plage probabiliste à 95 % : 9,0–11,4 milliards). Au départ, les 34 zones du moteur totalisent 7,597 milliards : environ 93 % du repère mondial 2025, soit près de 565 millions de personnes non représentées dans cette agrégation. Les trajectoires du moteur ne sont donc pas des totaux mondiaux complets.',
    referenceTraceability: 'Élevée',
    referenceSource: 'ONU, WPP 2024',
    referenceHref: 'https://population.un.org/wpp/assets/Files/WPP2024_Summary-of-Results.pdf'
  },
  {
    title: 'Migrations liées au climat',
    icon: Users,
    confidence: 'Très faible',
    kind: 'Règle interne de déplacement',
    text: 'Le moteur calcule un flux annuel à partir d’un score de chaleur, de nourriture et de côte; il n’enlève pas systématiquement les mêmes personnes de la zone d’origine et n’estime pas un stock de migrants. Le chiffre ne correspond donc pas clairement à un flux observé ou à un total de personnes déplacées.',
    actionDone: 'Les nombres de personnes et les arcs migratoires fictifs ont été retirés. Le repère Banque mondiale est conservé avec son périmètre de migrations internes dans six régions.',
    source: 'Banque mondiale, scénarios Groundswell',
    href: 'https://www.worldbank.org/en/news/feature/2021/09/13/millions-on-the-move-in-their-own-countries-the-human-face-of-climate-change',
    reference: 'La Banque mondiale a estimé jusqu’à 216 millions de migrants climatiques internes d’ici 2050 dans six régions, selon des scénarios. Il s’agit de déplacements à l’intérieur d’un même pays; ce total n’est pas une prévision mondiale de migrations internationales.',
    referenceTraceability: 'Élevée',
    referenceSource: 'Banque mondiale, Groundswell Part II',
    referenceHref: 'https://www.worldbank.org/en/news/press-release/2021/09/13/climate-change-could-force-216-million-people-to-migrate-within-their-own-countries-by-2050'
  },
  {
    title: 'Énergie et rendement pétrolier (EROI)',
    icon: Zap,
    confidence: 'Faible',
    kind: 'Scénario énergétique interne',
    text: 'La formule interne fait baisser l’EROI en fonction du volume cumulé extrait et d’une réserve ultime choisie; son exposant et sa trajectoire ne sont pas ajustés à des séries mondiales de projets pétroliers. La baisse affichée est une hypothèse de scénario, pas une prévision.',
    actionDone: 'La baisse de 46–88 % est expliquée comme cinq cas et non comme une trajectoire mondiale; la courbe de CLIMATOPEDY est explicitement qualifiée d’hypothèse interne.',
    source: 'Hall, Lambert & Balogh, méthodes EROI',
    href: 'https://doi.org/10.1016/j.enpol.2013.05.049',
    reference: 'Dans les cinq champs pétroliers étudiés, les baisses du rendement énergétique net sont comprises entre 46 % et 88 %, selon le champ et la période. Ces cinq cas ne permettent pas d’estimer une baisse mondiale.',
    referenceTraceability: 'Élevée',
    referenceSource: 'Tripathi & Brandt (2017), étude de cinq champs pétroliers',
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
          Chaque fiche distingue <strong>la sortie calculée par CLIMATOPEDY</strong> du <strong>repère scientifique publié</strong>. « Traçabilité élevée » signifie que le chiffre cité correspond à la source, à sa période et à son périmètre; cela ne signifie pas que la projection de la source est certaine ni que CLIMATOPEDY l’a reproduite. La confiance de la sortie du site est évaluée séparément.
        </p>
      </div>
    </div>

    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Comment est calculé l’Indice de Confiance Scientifique &amp; Biophysique ?</h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">
            Cinq critères ont le même poids. Chacun reçoit une note d’audit de 0 à 4; chaque niveau vaut donc 5 points sur le total de 100.
          </p>
        </div>
        <span className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 font-mono text-sm font-bold text-amber-800">
          ({MODEL_AUDIT_CRITERIA.map(({ rating }) => rating).join(' + ')}) ÷ {MODEL_AUDIT_CRITERIA.length * MODEL_AUDIT_MAX_RATING} × 100 = {MODEL_AUDIT_SCORE}/100
        </span>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-slate-700">
        <strong>Échelle :</strong> 0 = preuve absente ou contredite; 1 = appui faible, surtout fondé sur des hypothèses; 2 = appui partiel avec des lacunes importantes; 3 = appui solide, mais avec des limites; 4 = méthode, données et validation indépendante documentées pour l’usage annoncé.
      </p>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {MODEL_AUDIT_CRITERIA.map((criterion) => (
          <div key={criterion.id} className="rounded-lg border border-amber-100 bg-white p-3">
            <div className="flex items-start justify-between gap-2">
              <strong className="text-xs text-slate-800">{criterion.title}</strong>
              <span className="shrink-0 font-mono text-xs font-bold text-amber-800">{criterion.rating}/{MODEL_AUDIT_MAX_RATING}</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600">{criterion.rationale}</p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-slate-700">
        <strong>Portée :</strong> les notes sont des jugements d’audit explicites, attribués à partir du code, des données et des validations documentées. Leur somme est calculée automatiquement; ce score n’est ni une probabilité d’exactitude ni une évaluation du GIEC. Le niveau doit changer seulement si de nouvelles preuves, notamment des validations indépendantes, justifient une révision des notes.
      </p>
    </div>

    <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 p-4">
      <h3 className="text-sm font-bold text-slate-900">Quand une sortie de CLIMATOPEDY peut-elle être jugée fiable ?</h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-700">
        Il faut connaître les données et les hypothèses, utiliser une méthode adaptée au chiffre calculé, vérifier la méthode sur des observations qu’elle n’a pas servi à régler, et montrer l’incertitude avec plusieurs scénarios ou une plage. C’est pourquoi les chiffres observés CO₂ et température au départ sont élevés, tandis que plusieurs trajectoires internes restent faibles. Une source bien citée ne relève pas à elle seule la confiance dans un calcul.
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">
        Les projections publiées peuvent être très informatives sans être certaines : leurs plages et scénarios restent affichés. Les nombres que les formules du site ne permettent pas d’estimer honnêtement ont été retirés plutôt que présentés avec une note artificiellement élevée.
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
      {domains.map(({ title, icon: Icon, confidence, kind, text, actionDone, source, href, reference, referenceTraceability, referenceSource, referenceHref }) => (
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
              <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-bold ${confidenceStyle[referenceTraceability]}`}>
                Traçabilité de la référence : {referenceTraceability.toLowerCase()}
              </span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{reference}</p>
            <a href={referenceHref} target="_blank" rel="noreferrer" className="mt-1 inline-flex text-xs font-medium text-sky-700 underline underline-offset-2 hover:text-sky-900">{referenceSource}</a>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-700"><strong>Ce qui est fait :</strong> {actionDone}</p>
          <a href={href} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-sky-700 underline underline-offset-2 hover:text-sky-900">
            Source à consulter : {source}
          </a>
        </article>
      ))}
    </div>

    <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-950">
      <strong>À retenir :</strong> une traçabilité élevée signifie que la référence est identifiable et que son chiffre, sa date et son périmètre sont précisés. Cela ne rend pas certaines les projections publiées et ne relève pas la confiance accordée aux sorties internes de CLIMATOPEDY.
    </p>
  </section>
);
