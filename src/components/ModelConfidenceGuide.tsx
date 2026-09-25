import React from 'react';
import { Activity, Database, Info, Sprout, Thermometer, Users, Waves, Zap } from 'lucide-react';
import { MODEL_AUDIT_CRITERIA, MODEL_AUDIT_MAX_RATING, MODEL_AUDIT_SCORE, MODEL_AUDIT_WEIGHT_TOTAL } from '../data/modelAuditScore';

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
    meaning: 'Pour une sortie mondiale, son ordre de grandeur ou sa tendance recoupe des références scientifiques indépendantes. Ce rapprochement ne valide pas toutes les équations ni les résultats locaux.'
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
    title: 'Température mondiale future',
    icon: Activity,
    confidence: 'Partielle',
    kind: 'Sortie mondiale conditionnelle, comparée aux trajectoires mondiales publiées',
    text: 'Dans le scénario interne « Fortes émissions (modèle) », le réchauffement moyen mondial atteint environ +2,4 °C en 2100 par rapport à l’ère préindustrielle. Cette valeur décrit le système climatique mondial du simulateur, pas une prévision par pays ni SSP5-8.5.',
    actionDone: 'L’ordre de grandeur mondial est comparé aux évaluations du PNUE : +2,3 à +2,5 °C si les engagements nationaux annoncés sont pleinement appliqués, et 2,8 °C sous les politiques actuelles. Ce recoupement soutient une confiance partielle dans l’ordre de grandeur thermique global, sans valider le code ni identifier le scénario interne à l’un de ces parcours.',
    source: 'PNUE, Emissions Gap Report 2025',
    href: 'https://www.unep.org/fr/resources/rapport-2025-sur-lecart-entre-les-besoins-et-les-perspectives-en-matiere-de-reduction-des',
    reference: 'Le PNUE estime le réchauffement mondial au cours de ce siècle à 2,3–2,5 °C sous mise en œuvre intégrale des CDN et à 2,8 °C sous politiques actuelles. Ce sont des résultats d’ensembles d’études et d’hypothèses de politiques; ils ne sont pas des prévisions certaines et ne reproduisent pas le scénario CLIMATOPEDY.',
    referenceTraceability: 'Élevée',
    referenceSource: 'PNUE, rapport 2025',
    referenceHref: 'https://www.unep.org/fr/resources/rapport-2025-sur-lecart-entre-les-besoins-et-les-perspectives-en-matiere-de-reduction-des'
  },
  {
    title: 'Concentration mondiale de CO₂ future',
    icon: Database,
    confidence: 'Partielle',
    kind: 'Trajectoire globale calculée par le modèle',
    text: 'La simulation atteint environ 475 ppm de CO₂ atmosphérique en 2100. À l’échelle mondiale, cette valeur se situe dans l’enveloppe des concentrations de fin de siècle publiées pour plusieurs scénarios; elle est toutefois proche de la partie basse de cette enveloppe et ne correspond donc pas, à elle seule, à un scénario de fortes émissions reconnu.',
    actionDone: 'La concentration de départ est ancrée sur la moyenne mondiale NOAA 2025. Les scénarios SSP publiés couvrent environ 393 à 1 135 ppm en 2100; la valeur CLIMATOPEDY de 475 ppm est plausible dans cette enveloppe large, mais le moteur n’a pas démontré qu’elle suit un scénario d’émissions particulier. La confiance partielle porte sur l’ordre de grandeur planétaire, pas sur le libellé « fortes émissions » ni sur la trajectoire exacte.',
    source: 'Meinshausen et al. (2020), concentrations mondiales SSP',
    href: 'https://doi.org/10.5194/gmd-13-3571-2020',
    reference: 'La publication fournit les concentrations mondiales de CO₂ pour les scénarios SSP utilisés dans les travaux CMIP6; en 2100, les scénarios considérés couvrent environ 393 à 1 135 ppm. Cette grande amplitude traduit des hypothèses d’émissions différentes : l’appartenance à l’intervalle n’identifie pas le scénario le plus plausible et ne valide pas le modèle CLIMATOPEDY.',
    referenceTraceability: 'Élevée',
    referenceSource: 'Meinshausen et al. (2020), Geoscientific Model Development',
    referenceHref: 'https://gmd.copernicus.org/articles/13/3571/2020/'
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
    title: 'Élévation moyenne mondiale du niveau marin',
    icon: Waves,
    confidence: 'Partielle',
    kind: 'Sortie mondiale conditionnelle',
    text: 'La relation semi-empirique du moteur calcule une élévation moyenne globale; la sortie proche de 0,8 m en 2100 est une valeur de scénario. Elle ne représente pas une hausse uniforme sur chaque côte.',
    actionDone: 'L’ordre de grandeur est comparé aux plages du GIEC AR6. Le modèle du site prend l’année 2000 comme référence; l’AR6 rapporte les changements par rapport à 1995–2014. La comparaison est donc indicative, et le calcul interne n’a pas fait l’objet d’un test rétrospectif indépendant : confiance partielle pour l’ordre de grandeur mondial uniquement.',
    source: 'GIEC AR6, niveau moyen mondial de la mer',
    href: 'https://www.ipcc.ch/report/ar6/wg1/chapter/summary-for-policymakers/',
    reference: 'Hausse moyenne mondiale probable d’ici 2100, par rapport à 1995–2014 : 0,32–0,62 m sous SSP1-2.6; 0,44–0,76 m sous SSP2-4.5; 0,63–1,01 m sous SSP5-8.5. Ce ne sont pas des pertes de terres par pays.',
    referenceTraceability: 'Élevée',
    referenceSource: 'GIEC AR6, résumé pour décideurs',
    referenceHref: 'https://www.ipcc.ch/report/ar6/wg1/chapter/summary-for-policymakers/'
  },
  {
    title: 'Exposition côtière par territoire',
    icon: Waves,
    confidence: 'Faible',
    kind: 'Indicateur régional simplifié',
    text: 'L’indicateur côtier interne ne représente ni l’altitude précise, ni les défenses, ni l’affaissement du sol, ni les marées et tempêtes locales. Il ne permet donc pas d’estimer des hectares perdus ou une population déplacée par pays.',
    actionDone: 'Les plages mondiales du GIEC restent affichées comme contexte; aucune valeur globale du niveau marin n’est convertie en pertes de terres locales.',
    source: 'NASA, outil des projections du niveau marin du GIEC AR6',
    href: 'https://sealevel.nasa.gov/data_tools/17',
    reference: 'Les plages du GIEC sont des hausses moyennes mondiales par scénario et période de référence; elles ne décrivent pas directement le niveau relatif de la mer sur chaque côte.',
    referenceTraceability: 'Élevée',
    referenceSource: 'NASA, projections régionales du niveau marin AR6',
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
    text: 'C’est une sortie démographique à l’échelle mondiale, agrégée à partir de 34 zones. Les zones totalisent environ 93 % de la population mondiale de départ en 2025, mais leurs trajectoires internes de fécondité, mortalité et migration ne reproduisent pas le scénario central des Nations Unies.',
    actionDone: 'À l’horizon 2100, le scénario « Fortes émissions » du site agrège environ 4,8 milliards de personnes dans les 34 zones, contre 10,2 milliards dans le scénario central ONU WPP 2024 pour le monde entier. Cette différence est visible à l’échelle mondiale; la trajectoire démographique du simulateur reste donc faible en confiance, indépendamment de la résolution par pays.',
    source: 'ONU, World Population Prospects 2024',
    href: 'https://population.un.org/wpp/',
    reference: 'ONU WPP 2024 estime la population mondiale à 8,16 milliards en 2025; son scénario central atteint 10,2 milliards en 2100 (plage probabiliste à 95 % : 9,0–11,4 milliards). Au départ, les 34 zones du moteur totalisent 7,597 milliards, environ 93 % du repère 2025. En 2100, leur total simulé d’environ 4,8 milliards est très inférieur au scénario central mondial de l’ONU; il ne doit pas être interprété comme la trajectoire la plus plausible de la population mondiale.',
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
          Chaque fiche distingue <strong>la sortie calculée par CLIMATOPEDY</strong> du <strong>repère scientifique publié</strong>. Les résultats planétaires sont évalués par comparaison avec des données et des plages mondiales; les résultats régionaux ou sectoriels sont jugés selon les méthodes nécessaires à cette échelle. « Traçabilité élevée » signifie que le chiffre cité correspond à la source, à sa période et à son périmètre; cela ne valide pas une projection du site.
        </p>
      </div>
    </div>

    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Comment est calculé l’Indice de Confiance Scientifique &amp; Biophysique ?</h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">
            Il évalue le socle climatique planétaire et les grands ordres de grandeur, pas la précision de chaque résultat par pays. Chaque critère reçoit une note d’audit de 0 à 4 et un poids explicite; les poids totalisent 100 %.
          </p>
        </div>
        <span className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 font-mono text-sm font-bold text-amber-800">
          ({MODEL_AUDIT_CRITERIA.map(({ weight, rating }) => `${weight}×${rating}`).join(' + ')}) ÷ ({MODEL_AUDIT_WEIGHT_TOTAL}×{MODEL_AUDIT_MAX_RATING}) × 100 = {MODEL_AUDIT_SCORE}/100
        </span>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-slate-700">
        <strong>Calcul :</strong> somme de (poids en % × note sur 4), divisée par 4, puis arrondie à l’entier. <strong>Échelle :</strong> 0 = preuve absente ou contredite; 1 = appui faible; 2 = appui partiel avec lacunes importantes; 3 = appui solide avec limites; 4 = données et méthode validées pour l’usage annoncé. Les poids privilégient les observations mondiales, les fondements physiques et le contrôle des ordres de grandeur (25 % chacun); transparence des scénarios (15 %); incertitudes (10 %).
      </p>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {MODEL_AUDIT_CRITERIA.map((criterion) => (
          <div key={criterion.id} className="rounded-lg border border-amber-100 bg-white p-3">
            <div className="flex items-start justify-between gap-2">
              <strong className="text-xs text-slate-800">{criterion.title}</strong>
              <span className="shrink-0 font-mono text-xs font-bold text-amber-800">{criterion.rating}/{MODEL_AUDIT_MAX_RATING}</span>
            </div>
            <p className="mt-1 text-[10px] font-mono text-slate-400">Poids : {criterion.weight} %</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600">{criterion.rationale}</p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-slate-700">
        <strong>Contrôle des ordres de grandeur :</strong> le scénario interne atteint environ +2,4 °C en 2100; le PNUE situe les trajectoires mondiales autour de +2,3 à +2,5 °C avec mise en œuvre complète des engagements et à 2,8 °C avec les politiques actuelles. Le CO₂ de 475 ppm se trouve dans l’enveloppe publiée de 393 à 1 135 ppm pour les scénarios SSP en 2100, mais près de sa partie basse; cette enveloppe large n’établit pas que le scénario interne correspond à de fortes émissions. La sortie de niveau marin proche de 0,8 m recoupe la plage AR6 de 0,63 à 1,01 m sous SSP5-8.5, mais CLIMATOPEDY prend 2000 comme référence et l’AR6 1995–2014. Ces comparaisons éclairent l’échelle planétaire, sans valider les calculs du site. Voir le <a className="text-sky-700 underline" href="https://www.unep.org/fr/resources/rapport-2025-sur-lecart-entre-les-besoins-et-les-perspectives-en-matiere-de-reduction-des" target="_blank" rel="noreferrer">PNUE, Emissions Gap Report 2025</a>, le <a className="text-sky-700 underline" href="https://www.ipcc.ch/report/ar6/wg1/chapter/summary-for-policymakers/" target="_blank" rel="noreferrer">GIEC AR6</a> et <a className="text-sky-700 underline" href="https://doi.org/10.5194/gmd-13-3571-2020" target="_blank" rel="noreferrer">Meinshausen et al. (2020)</a>.
      </p>
      <p className="mt-2 text-xs leading-relaxed text-slate-700">
        <strong>Limite :</strong> les notes sont des jugements d’audit explicites fondés sur le code, les données et les comparaisons documentées. L’indice ne donne pas une probabilité d’exactitude et ne valide pas les sorties régionales, sanitaires, démographiques ou agricoles, qui restent évaluées séparément dans les fiches ci-dessous.
      </p>
    </div>

    <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 p-4">
      <h3 className="text-sm font-bold text-slate-900">Quand une sortie de CLIMATOPEDY peut-elle être jugée fiable ?</h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-700">
        Pour un résultat planétaire, on compare le bilan global et sa tendance aux observations mondiales et aux plages de plusieurs études; on ne demande pas à un résultat mondial de prédire chaque territoire. Pour un chiffre local, il faut en plus des données et des méthodes adaptées à cette échelle. Dans les deux cas, la comparaison ne remplace pas un test indépendant du code.
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">
        Une sortie globale peut donc avoir une confiance partielle quand son ordre de grandeur recoupe plusieurs références mondiales, même si les résultats locaux restent moins assurés. Les nombres que les formules du site ne permettent pas d’estimer honnêtement ne sont pas assimilés à des projections validées.
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

    <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm leading-relaxed text-slate-700">
      <strong className="text-slate-900">Lecture du système Terre :</strong> les sorties mondiales de température, de CO₂ atmosphérique et de niveau moyen marin ont chacune une confiance <strong>partielle</strong>, fondée sur leur comparaison avec des travaux et trajectoires mondiaux. Cette appréciation n’est pas abaissée parce que ces sorties ne donnent pas une prévision par territoire. À l’inverse, la concordance d’un bilan planétaire ne suffit pas à valider les indicateurs locaux, démographiques, agricoles ou sanitaires, évalués séparément ci-dessous.
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
