import React from 'react';
import { Activity, Database, Info, Sprout, Thermometer, Users, Waves, Zap } from 'lucide-react';

const confidenceLevels = [
  {
    label: 'Élevée',
    style: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    meaning: 'Mesure publiée et bien définie; la valeur citée correspond à ce que la source mesure.'
  },
  {
    label: 'Partielle',
    style: 'bg-sky-100 text-sky-800 border-sky-200',
    meaning: 'La méthode est publiée, mais son application ici utilise des entrées simplifiées ou agrégées.'
  },
  {
    label: 'Faible',
    style: 'bg-amber-100 text-amber-900 border-amber-200',
    meaning: 'Le résultat dépend surtout d’hypothèses internes qui ne sont pas validées pour cet usage.'
  },
  {
    label: 'Très faible',
    style: 'bg-rose-100 text-rose-800 border-rose-200',
    meaning: 'Le site calcule un indicateur exploratoire; il ne faut pas le lire comme une prévision fiable.'
  }
];

const domains = [
  {
    title: 'CO₂ observé en 2024',
    icon: Database,
    confidence: 'Élevée',
    text: 'La moyenne mondiale annuelle de 422,8 ppm est une mesure publiée par la NOAA. Les 424 ppm utilisés comme point de départ 2026 sont un réglage du simulateur, pas une mesure annuelle de 2026.',
    source: 'NOAA, moyenne mondiale 2024',
    href: 'https://prod-01-asg-www-climate.woc.noaa.gov/news-features/understanding-climate/climate-change-atmospheric-carbon-dioxide'
  },
  {
    title: 'Climat futur simulé',
    icon: Activity,
    confidence: 'Faible',
    text: 'Le moteur reprend certaines idées de modèles climatiques simples, mais ses émissions et plusieurs paramètres sont propres à CLIMATOPEDY. Ses courbes ne sont pas des projections officielles du GIEC.',
    source: 'FaIR v1.3, article scientifique',
    href: 'https://gmd.copernicus.org/articles/11/2273/2018/gmd-11-2273-2018.html'
  },
  {
    title: 'Chaleur et température humide',
    icon: Thermometer,
    confidence: 'Partielle',
    text: 'La formule de Stull est une approximation publiée pour calculer la température humide à partir de la température et de l’humidité. Les valeurs régionales futures du site utilisent toutefois des moyennes et des paramètres simplifiés.',
    source: 'Stull, 2011',
    href: 'https://doi.org/10.1175/JAMC-D-11-0143.1'
  },
  {
    title: 'Niveau de la mer et zones côtières',
    icon: Waves,
    confidence: 'Faible',
    text: 'Le niveau marin simulé est global. Le calcul des terres côtières affectées repose sur un indice simplifié; il ne tient pas compte de l’altitude détaillée, des défenses ou des mouvements locaux du sol.',
    source: 'GIEC AR6, hausse globale du niveau marin',
    href: 'https://www.ipcc.ch/report/ar6/wg1/chapter/chapter-9/'
  },
  {
    title: 'Cultures et calories',
    icon: Sprout,
    confidence: 'Faible',
    text: 'Des moyennes d’études mondiales sont appliquées à des mélanges de cultures régionaux simplifiés. Le calcul ne représente pas toute la météo, les sols, l’irrigation, les échanges ou l’adaptation agricole.',
    source: 'Zhao et al., 2017',
    href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5584412/'
  },
  {
    title: 'Décès liés à la chaleur, à l’alimentation ou à l’énergie',
    icon: Activity,
    confidence: 'Très faible',
    text: 'Les taux de décès sont produits par des formules internes. Ils ne sont pas calibrés ni validés comme estimations épidémiologiques; une alerte thermique ne permet pas, à elle seule, de calculer des décès.',
    source: 'Méthodes et données de santé · OMS',
    href: 'https://www.who.int/publications/i/item/9789241507691'
  },
  {
    title: 'Population et migrations',
    icon: Users,
    confidence: 'Très faible',
    text: 'La population future et les migrations sont calculées avec des règles simplifiées propres au site. Les résultats ne remplacent pas les projections démographiques de l’ONU ni une étude des migrations observées.',
    source: 'ONU, World Population Prospects 2024',
    href: 'https://population.un.org/wpp/'
  },
  {
    title: 'Énergie et rendement pétrolier (EROI)',
    icon: Zap,
    confidence: 'Faible',
    text: 'L’EROI dépend de la ressource et de la façon de le mesurer. La courbe future du site vient d’une formule et de réserves choisies pour le simulateur; ce n’est pas une prévision vérifiée de l’approvisionnement énergétique.',
    source: 'Références sur l’EROI',
    href: 'https://doi.org/10.1016/j.enpol.2013.05.049'
  }
];

const confidenceStyle = Object.fromEntries(confidenceLevels.map(({ label, style }) => [label, style]));

export const ModelConfidenceGuide: React.FC = () => (
  <section aria-labelledby="confidence-guide-title" className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs">
    <div className="flex items-start gap-3">
      <span className="mt-0.5 rounded-lg bg-sky-100 p-2 text-sky-700"><Info className="h-5 w-5" /></span>
      <div>
        <h2 id="confidence-guide-title" className="text-lg sm:text-xl font-bold text-slate-900">Que valent les chiffres affichés ?</h2>
        <p className="mt-1 max-w-4xl text-sm leading-relaxed text-slate-600">
          Le niveau ci-dessous porte sur <strong>le chiffre de CLIMATOPEDY et son usage</strong>, pas sur la qualité générale de la source. Une étude peut être solide sans valider le calcul du site qui s’en inspire.
        </p>
      </div>
    </div>

    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {confidenceLevels.map((level) => (
        <div key={level.label} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-bold ${level.style}`}>{level.label}</span>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">{level.meaning}</p>
        </div>
      ))}
    </div>

    <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
      {domains.map(({ title, icon: Icon, confidence, text, source, href }) => (
        <article key={title} className="rounded-xl border border-slate-200 p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Icon className="h-4 w-4 shrink-0 text-sky-700" />{title}
            </h3>
            <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-bold ${confidenceStyle[confidence]}`}>
              Confiance : {confidence.toLowerCase()}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
          <a href={href} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-sky-700 underline underline-offset-2 hover:text-sky-900">
            Source de référence : {source}
          </a>
        </article>
      ))}
    </div>

    <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-950">
      <strong>À retenir :</strong> une valeur très précise à l’écran peut rester très incertaine. Les niveaux indiquent l’état des méthodes et des données actuellement utilisées; ils ne constituent pas une certification scientifique indépendante.
    </p>
  </section>
);
