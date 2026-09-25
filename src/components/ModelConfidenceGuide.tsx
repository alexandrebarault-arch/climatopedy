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
    meaning: 'La méthode convient à ce calcul, a été comparée à des observations passées et son incertitude est montrée.'
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
}[] = [
  {
    title: 'CO₂ mondial observé en 2024',
    icon: Database,
    confidence: 'Élevée',
    kind: 'Mesure publiée',
    text: 'La NOAA rapporte une moyenne mondiale annuelle de 422,8 ppm. Cette valeur décrit 2024; elle n’est pas une prévision.',
    nextStep: 'Garder la période et le périmètre avec la valeur.',
    source: 'NOAA, données mondiales de CO₂',
    href: 'https://prod-01-asg-www-climate.woc.noaa.gov/news-features/understanding-climate/climate-change-atmospheric-carbon-dioxide'
  },
  {
    title: 'Valeur de départ du CO₂ en 2026',
    icon: Database,
    confidence: 'Faible',
    kind: 'Paramètre du simulateur',
    text: 'Les 424 ppm sont une valeur réglée dans le moteur. Le code ne la charge pas comme une moyenne annuelle mesurée pour 2026.',
    nextStep: 'La remplacer par la dernière moyenne annuelle achevée et documenter comment elle initialise le modèle.',
    source: 'NOAA, mesures de CO₂',
    href: 'https://gml.noaa.gov/ccgg/trends/'
  },
  {
    title: 'Température et CO₂ futurs',
    icon: Activity,
    confidence: 'Faible',
    kind: 'Projection conditionnelle',
    text: 'Les courbes dépendent d’émissions et de paramètres propres à CLIMATOPEDY. Le cycle carbone reprend une structure de réservoirs, mais ne produit pas directement une projection FaIR ou du GIEC.',
    nextStep: 'Utiliser des scénarios publiés, comparer le moteur aux observations historiques indépendantes et afficher la plage de plusieurs simulations.',
    source: 'NASA, projections climatiques CMIP6',
    href: 'https://www.nccs.nasa.gov/data-collections/nex-gddp-cmip6/'
  },
  {
    title: 'Chaleur et température humide par région',
    icon: Thermometer,
    confidence: 'Faible',
    kind: 'Calcul avec entrées simplifiées',
    text: 'La formule de Stull estime la température humide à partir de la température et de l’humidité. Les entrées régionales du simulateur sont des paramètres statiques, pas une série météo locale.',
    nextStep: 'Calculer avec des données météo quotidiennes, puis comparer les résultats historiques aux stations météo avant de les projeter.',
    source: 'Stull, formule de température humide',
    href: 'https://doi.org/10.1175/JAMC-D-11-0143.1'
  },
  {
    title: 'Niveau marin et terres côtières',
    icon: Waves,
    confidence: 'Faible',
    kind: 'Projection globale et indicateur régional simplifié',
    text: 'Le niveau marin du moteur est global. L’indice de terres côtières ne représente pas l’altitude locale, les défenses ni les mouvements du sol.',
    nextStep: 'Utiliser des projections régionales et, pour les zones touchées, des données d’altitude et de mouvement local du sol.',
    source: 'NASA, projections du GIEC AR6 par région',
    href: 'https://sealevel.nasa.gov/data_tools/17'
  },
  {
    title: 'Rendements des cultures',
    icon: Sprout,
    confidence: 'Faible',
    kind: 'Projection agricole simplifiée',
    text: 'Des sensibilités moyennes mondiales sont appliquées à des mélanges de cultures régionaux. La météo, les sols, l’irrigation et les pratiques agricoles ne sont pas simulés en détail.',
    nextStep: 'Comparer des modèles agricoles aux rendements observés dans le passé et montrer l’écart entre plusieurs modèles.',
    source: 'ISIMIP, modèles agricoles et protocole',
    href: 'https://www.isimip.org/protocol/'
  },
  {
    title: 'Calories disponibles par personne',
    icon: Sprout,
    confidence: 'Très faible',
    kind: 'Calcul exploratoire',
    text: 'Le chiffre découle d’un rendement simplifié et d’une population régionale. Il ne mesure pas les aliments consommés ou accessibles aux habitants.',
    nextStep: 'Ajouter les données de production, échanges, pertes et disponibilité alimentaire; valider séparément chaque composante.',
    source: 'FAOSTAT, production et rendements agricoles',
    href: 'https://www.fao.org/faostat/'
  },
  {
    title: 'Décès associés à la chaleur, à l’alimentation ou à l’énergie',
    icon: Activity,
    confidence: 'Très faible',
    kind: 'Calcul exploratoire non validé en épidémiologie',
    text: 'Les taux de décès viennent de formules internes. La température humide ou un déficit calorique ne permet pas, à lui seul, de déduire combien de personnes mourront.',
    nextStep: 'Utiliser des liens entre météo et mortalité mesurés dans les données de santé, par âge et par région, puis vérifier leur performance sur des années non utilisées pour les régler.',
    source: 'OMS, méthodes d’évaluation des effets sanitaires',
    href: 'https://www.who.int/publications/i/item/9789241507691'
  },
  {
    title: 'Population future',
    icon: Users,
    confidence: 'Faible',
    kind: 'Projection démographique interne',
    text: 'Les effectifs et les groupes d’âge du moteur sont des paramètres régionaux. Les projections de l’ONU ne sont pas directement chargées dans ce calcul.',
    nextStep: 'Utiliser les projections de l’ONU comme référence démographique, puis isoler tout effet climatique calculé séparément.',
    source: 'ONU, World Population Prospects 2024',
    href: 'https://population.un.org/wpp/'
  },
  {
    title: 'Migrations liées au climat',
    icon: Users,
    confidence: 'Très faible',
    kind: 'Règle interne de déplacement',
    text: 'Le moteur répartit des personnes selon des scores simplifiés. Ces chiffres ne sont ni des observations de migrations ni des prévisions validées.',
    nextStep: 'S’appuyer sur des modèles publiés et leurs scénarios; tester toute nouvelle méthode sur des déplacements observés. Sinon, n’afficher que des exemples conditionnels.',
    source: 'Banque mondiale, scénarios Groundswell',
    href: 'https://www.worldbank.org/en/news/feature/2021/09/13/millions-on-the-move-in-their-own-countries-the-human-face-of-climate-change'
  },
  {
    title: 'Énergie et rendement pétrolier (EROI)',
    icon: Zap,
    confidence: 'Faible',
    kind: 'Scénario énergétique interne',
    text: 'Le rendement énergétique dépend de la ressource et de la méthode de calcul. La baisse future affichée dépend d’une formule et de réserves choisies dans le simulateur.',
    nextStep: 'Préciser la définition et le périmètre de l’EROI, sourcer les données historiques et confronter les scénarios à des trajectoires énergétiques publiées.',
    source: 'Hall, Lambert & Balogh, méthodes EROI',
    href: 'https://doi.org/10.1016/j.enpol.2013.05.049'
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
          Cette appréciation porte sur <strong>le chiffre et la façon dont CLIMATOPEDY le calcule</strong>, pas sur la réputation de la source. Un fait observé, un résultat de modèle et une hypothèse sur l’avenir ne se vérifient pas de la même façon.
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
      {domains.map(({ title, icon: Icon, confidence, kind, text, nextStep, source, href }) => (
        <article key={title} className="rounded-xl border border-slate-200 p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Icon className="h-4 w-4 shrink-0 text-sky-700" />{title}
              </h3>
              <span className="mt-1 ml-6 block text-xs text-slate-500">{kind}</span>
            </div>
            <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-bold ${confidenceStyle[confidence]}`}>
              Confiance : {confidence.toLowerCase()}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
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
