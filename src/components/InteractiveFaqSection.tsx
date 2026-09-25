import React, { useState, useEffect, useMemo } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Zap,
  Wheat,
  Wind,
  Thermometer,
  Waves,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'energy' | 'agri' | 'climate' | 'survival' | 'method';
  categoryLabel: string;
  categoryIcon: React.ReactNode;
  question: string;
  shortSummary: string;
  fullAnswer: React.ReactNode;
  tags: string[];
  scientificRef: string;
}

export const InteractiveFaqSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'faq-eroi': true,
    'faq-stull': true
  });
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Écoute de l'événement global déclenché par les TechTooltips
  useEffect(() => {
    const handleOpenFaq = (e: Event) => {
      const customEvent = e as CustomEvent<{ faqId: string }>;
      const targetId = customEvent.detail?.faqId;
      if (targetId) {
        setSelectedCategory('all');
        setSearchQuery('');
        setExpandedIds((prev) => ({ ...prev, [targetId]: true }));
        setHighlightedId(targetId);

        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);

        setTimeout(() => {
          setHighlightedId(null);
        }, 3500);
      }
    };

    window.addEventListener('climatopedy-open-faq', handleOpenFaq);
    return () => window.removeEventListener('climatopedy-open-faq', handleOpenFaq);
  }, []);

  const FAQ_ITEMS: FaqItem[] = [
    {
      id: 'faq-eroi',
      category: 'energy',
      categoryLabel: 'Énergie & EROI',
      categoryIcon: <Zap className="w-4 h-4 text-amber-500" />,
      question: "Qu'est-ce que l'EROI ?",
      shortSummary: "Combien de barils d'énergie récolte-t-on pour 1 baril consommé à forer et raffiner.",
      tags: ['EROI', 'pétrole', 'énergie nette', 'multiplicateur', 'falaise énergétique'],
      scientificRef: 'Hall, Lambert & Balogh (2014) · Murphy & Hall (Ann. N.Y. Acad. Sci., 2010)',
      fullAnswer: (
        <div className="space-y-3 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <p>
            <strong>EROI</strong> signifie en anglais <em>Energy Return on Investment</em> (Rendement Énergétique du Capital Investi). C'est le ratio physique fondamental de notre civilisation :
          </p>
          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-900 font-mono text-xs">
            EROI = Énergie totale extraite / Énergie dépensée pour l'extraire et la raffiner
          </div>
          <p>
            Pour éviter le jargon des ratios mathématiques (ex. <em>12:1</em>), nous l'exprimons en <strong>multiplicateur simple (x12)</strong> :
          </p>
          <ul className="space-y-2 list-disc pl-5 text-slate-700">
            <li>
              <strong>Exemple de calcul (EROI 100:1) :</strong> Selon le périmètre retenu, un EROI de 100:1 signifie 100 unités d'énergie obtenues pour une unité investie; la fraction nette correspondante est de 99 unités. Ce nombre est un exemple de ratio, pas une estimation historique générale.
            </li>
            <li>
              <strong>Exemple de calcul (EROI 12:1) :</strong> Dans ce ratio, la part investie représente 1/12 de l'énergie brute obtenue. Les valeurs réelles varient selon la ressource, la période et le périmètre de calcul.
            </li>
            <li>
              <strong>Exemple de calcul (EROI 3:1) :</strong> Dans ce ratio, une unité d'énergie investie correspond à un tiers de l'énergie brute obtenue. Il n'existe pas de seuil EROI universel qui détermine à lui seul le fonctionnement d'une société.
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'faq-haber-bosch',
      category: 'agri',
      categoryLabel: 'Agriculture & Haber-Bosch',
      categoryIcon: <Wheat className="w-4 h-4 text-emerald-600" />,
      question: "Qu'est-ce que le procédé Haber-Bosch ?",
      shortSummary: "La réaction chimique qui transforme le gaz naturel et l'azote de l'air en engrais pour nourrir 8 milliards d'humains.",
      tags: ['Haber-Bosch', 'engrais', 'azote', 'gaz naturel', 'agriculture', 'famine', 'blé', 'riz'],
      scientificRef: 'Vaclav Smil (2001) · Enriching the Earth (MIT Press) · Erisman et al. (Nature Geoscience, 2008)',
      fullAnswer: (
        <div className="space-y-3 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <p>
            Inventé en 1909 par les chimistes allemands Fritz Haber et Carl Bosch, ce procédé permet de briser la triple liaison chimique extrêmement solide de l'azote de l'air ($N_2$) sous haute pression (200 bars) et haute température (450°C) grâce à l'hydrogène extrait du <strong>gaz naturel (méthane $CH_4$)</strong> :
          </p>
          <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-emerald-900 font-mono text-xs">
            N₂ (air) + 3 H₂ (extrait du gaz fossile CH₄) ➔ 2 NH₃ (Ammoniac de synthèse)
          </div>
          <p>
            Cet ammoniac est ensuite transformé en nitrates et urée épandus sur les champs de blé, maïs et riz à travers le monde.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2 text-xs">
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
              <span className="font-bold text-emerald-950 block">Un atome d'azote sur deux dans votre corps :</span>
              <span className="text-slate-700">
                Erisman et al. (2008) ont estimé qu'environ 48% de la population mondiale dépendait alors de l'azote réactif produit par le procédé Haber-Bosch pour sa production alimentaire. Il s'agit d'une estimation de dépendance alimentaire mondiale, pas d'une mesure directe des atomes d'azote dans chaque personne.
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
              <span className="font-bold text-rose-900 block">L'effet ciseau de la déplétion fossile :</span>
              <span className="text-slate-700">
                Le gaz naturel est une matière première et une source d'énergie importante pour la production conventionnelle d'ammoniac. L'étude citée ne permet pas de déduire une baisse mondiale uniforme des rendements ni une famine à partir d'une réduction de l'approvisionnement en gaz.
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'faq-fair',
      category: 'climate',
      categoryLabel: 'Climat & Modèle FaIR',
      categoryIcon: <Wind className="w-4 h-4 text-sky-600" />,
      question: "Le modèle FaIR : comment calcule-t-il le climat mondial sans supercalculateur géant ?",
      shortSummary: "Un modèle climatique réduit qui relie émissions, concentrations et température.",
      tags: ['FaIR', 'GIEC', 'AR6', 'CO2', 'température', 'effet de serre', 'Smith'],
      scientificRef: 'Smith et al. (Geosci. Model Dev., 2018) · GIEC AR6 WG1 Chapitre 7',
      fullAnswer: (
        <div className="space-y-3 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <p>
            <strong>FaIR</strong> signifie <em>Finite Amplitude Impulse Response</em> (Modèle de réponse impulsionnelle à amplitude finie).
          </p>
          <p>
            Les modèles de circulation générale couplée atmosphère-océan (comme ceux du CNRM ou de l'IPSL) nécessitent des semaines de calculs sur des supercalculateurs géants pour simuler un siècle de climat. FaIR a été développé par une équipe internationale menée par le Dr Chris Smith (Oxford/Leeds) pour résoudre ce problème :
          </p>
          <ul className="space-y-1.5 list-disc pl-5 text-slate-700">
            <li>
              <strong>Modèle réduit :</strong> FaIR calcule rapidement des réponses climatiques à des scénarios d'émissions. Les performances dépendent des variables, des expériences et des critères de comparaison.
            </li>
            <li>
              <strong>Cycle du carbone dynamique :</strong> Il intègre la saturation progressive des puits de carbone naturels (les océans et les forêts absorbent moins de CO₂ à mesure qu'ils se réchauffent).
            </li>
            <li>
              <strong>Inertie thermique océanique :</strong> Il prend en compte le décalage de plusieurs décennies entre le forçage radiatif du CO₂ et l'échauffement des grands fonds marins.
            </li>
          </ul>
          <p>
            Dans CLIMATOPEDY, ce modèle est directement exécuté en temps réel pour calculer l'anomalie thermique mondiale (°C) à chaque pas temporel en fonction des émissions cumulées de gaz à effet de serre.
          </p>
        </div>
      )
    },
    {
      id: 'faq-stull',
      category: 'survival',
      categoryLabel: 'Survie Humaine & Stull Tw',
      categoryIcon: <Thermometer className="w-4 h-4 text-rose-600" />,
      question: "Qu'est-ce que la température au thermomètre mouillé (Tw) ?",
      shortSummary: "Une mesure météorologique qui combine température de l'air et humidité.",
      tags: ['Stull Tw', 'thermomètre mouillé', 'chaleur humide', 'canicule', 'hyperthermie', 'seuil létal', 'Raymond'],
      scientificRef: 'Roland Stull (J. Appl. Meteor. Climatol., 2011) · Raymond et al. (Science Advances, 2020) · Sherwood & Huber (PNAS, 2010)',
      fullAnswer: (
        <div className="space-y-3 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <p>
            Le corps humain produit en permanence environ 100 Watts de chaleur métabolique interne. Pour maintenir notre température interne à 37°C dans un environnement chaud, nous n'avons qu'un seul mécanisme physique : <strong>l'évaporation de la sueur</strong>.
          </p>
          <p>
            Or, la thermodynamique dicte qu'un liquide ne peut s'évaporer que si l'air environnant n'est pas déjà saturé de vapeur d'eau. C'est ce que mesure le <strong>thermomètre mouillé (Wet-Bulb Temperature, noté Tw)</strong> :
          </p>
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 space-y-2">
            <span className="font-bold text-rose-950 block">Limite théorique discutée par Sherwood et Huber (2010) :</span>
            <p className="text-xs">
              Les auteurs discutent une limite théorique autour de 35°C Tw pour une exposition prolongée. Ce n'est pas un seuil universel de mortalité : la réponse dépend notamment de l'activité, de l'acclimatation, de l'âge et des conditions d'exposition. Raymond et al. étudient des épisodes météorologiques extrêmes observés; ils ne valident pas un seuil mortel à 31°C.
            </p>
          </div>
          <p>
            <strong>La formule de Roland Stull (2011) :</strong> Le professeur Roland Stull a publié l'équation de référence internationale combinant la température de l'air $T$ (en °C) et l'humidité relative $RH$ (en %) :
          </p>
          <div className="bg-slate-100 p-2.5 rounded border border-slate-200 font-mono text-[11px] text-sky-900 overflow-x-auto">
            Tw = T · atan(0.151977·√(RH + 8.313659)) + atan(T + RH) - atan(RH - 1.676331) + 0.00391838·RH^(3/2)·atan(0.023101·RH) - 4.686035
          </div>
          <p>
            CLIMATOPEDY utilise cette formule pour calculer Tw dans sa simulation. Ce calcul météorologique ne permet pas, à lui seul, d'estimer des décès réels ou validés.
          </p>
        </div>
      )
    },
    {
      id: 'faq-slr',
      category: 'climate',
      categoryLabel: 'Océans & Climat',
      categoryIcon: <Waves className="w-4 h-4 text-sky-600" />,
      question: "Quelles sont les causes de l'élévation du niveau moyen de la mer ?",
      shortSummary: "Les deux causes physiques de l'élévation marine et pourquoi les greniers côtiers s'effondrent avant d'être noyés.",
      tags: ['montée des océans', 'niveau marin', 'submersion', 'deltas', 'salinisation', 'Vermeer & Rahmstorf'],
      scientificRef: 'Vermeer & Rahmstorf (PNAS, 2009) · GIEC SROCC (2019)',
      fullAnswer: (
        <div className="space-y-3 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <p>
            Le niveau moyen de la mer s'élève sous l'effet de plusieurs processus, notamment le réchauffement et l'expansion de l'eau de mer ainsi que la perte de glace continentale :
          </p>
          <ol className="space-y-2 list-decimal pl-5 text-slate-700">
            <li>
              <strong>L'expansion thermique :</strong> L'eau de mer se dilate lorsqu'elle se réchauffe. Sa contribution varie dans le temps et selon la profondeur considérée.
            </li>
            <li>
              <strong>La perte de glace continentale :</strong> La fonte des glaciers et des calottes glaciaires ajoute de l'eau à l'océan. La fonte de glace de mer flottante a un effet direct beaucoup plus faible sur le niveau marin.
            </li>
          </ol>
          <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg text-sky-900">
            <span className="font-bold text-sky-950 block mb-1">Le piège de la salinisation des nappes côtières :</span>
            <p className="text-xs">
              L'élévation du niveau marin peut accroître les risques d'inondation et d'intrusion saline dans les aquifères côtiers. Les effets dépendent de la topographie, des marées, des prélèvements d'eau, des protections côtières et des conditions locales; aucun seuil mondial uniforme de 30 à 50 cm ne s'applique à tous les deltas.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'faq-weather-vs-tw',
      category: 'survival',
      categoryLabel: 'Survie Humaine',
      categoryIcon: <Thermometer className="w-4 h-4 text-rose-600" />,
      question: "Quelle est la différence concrète entre la température météo à l'ombre et la température humide Tw ?",
      shortSummary: "Comparatif direct : 45°C dans un désert sec vs 35°C dans une mousson tropicale.",
      tags: ['météo', 'température sèche', 'humidité', 'désert', 'tropiques', 'ressenti'],
      scientificRef: 'NOAA Heat Index Guidelines · Sherwood & Huber (2010)',
      fullAnswer: (
        <div className="space-y-3 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <p>
            Le thermomètre classique mesure la <strong>température de l'air (thermomètre sec)</strong>. L'humidité influence les échanges de chaleur et l'évaporation de la sueur; aucun couple température-humidité ne détermine à lui seul la survie d'une personne.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs my-2">
            <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200">
              <span className="font-bold text-amber-900 block mb-1">Cas A : Désert du Sahara ou Las Vegas</span>
              <p className="text-slate-700 mb-1.5">
                • Température de l'air : <strong>45°C</strong><br />
                • Humidité relative : <strong>12%</strong><br />
                • Température humide Tw : <strong>22,5°C</strong>
              </p>
              <span className="text-emerald-700 font-semibold block">
                Exemple météorologique : la valeur Tw dépend de la température et de l'humidité indiquées. La tolérance à la chaleur dépend aussi de l'exposition, de l'activité, de l'accès à l'eau et de l'état de santé.
              </span>
            </div>

            <div className="p-3 rounded-lg bg-rose-50/60 border border-rose-200">
              <span className="font-bold text-rose-900 block mb-1">Cas B : Golfe Persique, Inde ou delta chinois</span>
              <p className="text-slate-700 mb-1.5">
                • Température de l'air : <strong>35°C</strong><br />
                • Humidité relative : <strong>80%</strong><br />
                • Température humide Tw : <strong>32,2°C</strong>
              </p>
              <span className="text-rose-700 font-bold block">
                Exemple météorologique : une température et une humidité élevées limitent l'évaporation de la sueur et peuvent créer un stress thermique important. Ces deux valeurs seules ne déterminent ni une durée de survie ni une issue certaine.
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'faq-ssp585',
      category: 'method',
      categoryLabel: 'Méthodologie & Scénarios',
      categoryIcon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
      question: "Pourquoi le simulateur utilise-t-il l'hypothèse de rigidité comportementale (SSP5-8.5) ?",
      shortSummary: "Comprendre pourquoi modéliser la poursuite du modèle sans transition institutionnelle est crucial.",
      tags: ['SSP5-8.5', 'scénarios', 'rigidité', 'modélisation', 'bifurcation'],
      scientificRef: 'O\'Neill et al. (Global Environ. Change, 2017) · Riahi et al. (2017)',
      fullAnswer: (
        <div className="space-y-3 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <p>
            Dans l'AR6, <strong>SSP5-8.5</strong> est un scénario conditionnel de très fortes émissions de gaz à effet de serre associé à une trajectoire socio-économique SSP5. Ce n'est pas une prévision certaine ni nécessairement le scénario le plus probable.
          </p>
          <p>
            Les résultats affichés par CLIMATOPEDY dépendent des paramètres propres au simulateur. Ils ne sont pas des projections officielles du GIEC.
          </p>
          <ul className="space-y-1.5 list-disc pl-5 text-slate-700">
            <li>
              Les trajectoires présentées sont des sorties du modèle CLIMATOPEDY, conditionnelles à ses paramètres et hypothèses; elles ne quantifient pas exactement un futur observé.
            </li>
            <li>
              Le GIEC compare plusieurs scénarios afin d'évaluer les conséquences climatiques possibles de différents niveaux d'émissions.
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'faq-regen-agri',
      category: 'agri',
      categoryLabel: 'Agriculture & Transition',
      categoryIcon: <Wheat className="w-4 h-4 text-emerald-600" />,
      question: "L'agriculture biologique ou régénérative peut-elle remplacer Haber-Bosch rapidement ?",
      shortSummary: "Le défi du temps agronomique de transition, de la fixation biologique de l'azote et de la masse humaine.",
      tags: ['bio', 'agroécologie', 'azote', 'légumineuses', 'transition', 'rendement'],
      scientificRef: 'Ponisio et al. (Proc. R. Soc. B, 2015) · Billen, Garnier et al. (One Earth, 2021)',
      fullAnswer: (
        <div className="space-y-3 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <p>
            L'agroécologie et la fertilisation par les légumineuses (trèfle, luzerne, pois) qui fixent naturellement l'azote atmosphérique grâce à leurs nodosités bactériennes sont la <strong>seule solution pérenne à long terme</strong>.
          </p>
          <p>
            Cependant, à court et moyen terme (10 à 25 ans), trois freins physiques majeurs s'imposent :
          </p>
          <ul className="space-y-2 list-disc pl-5 text-slate-700">
            <li>
              <strong>Le temps d'inertie biologique des sols :</strong> Il faut entre 5 et 10 ans pour reconstituer le complexe argilo-humique d'un sol usé par 60 ans d'agriculture industrielle. Pendant cette phase, les rendements chutent de 25% à 40%.
            </li>
            <li>
              <strong>La surface requise :</strong> Pour fixer l'azote naturellement, il faut consacrer 25% à 30% des surfaces agricoles à des cultures de légumineuses engrais-vert, ce qui réduit temporairement la part disponible pour les céréales de consommation directe.
            </li>
            <li>
              <strong>La transition du régime carné :</strong> Comme l'a montré l'équipe du CNRS (Garnier & Billen, 2021), nourrir l'Europe en bio est possible, mais cela exige de diviser par deux la consommation de viande pour réaffecter les céréales destinées au bétail à la nutrition humaine.
            </li>
          </ul>
        </div>
      )
    }
  ];

  // Filtrage combiné par catégorie et recherche textuelle
  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const inQuestion = item.question.toLowerCase().includes(q);
      const inSummary = item.shortSummary.toLowerCase().includes(q);
      const inTags = item.tags.some((t) => t.toLowerCase().includes(q));
      return inQuestion || inSummary || inTags;
    });
  }, [selectedCategory, searchQuery]);

  const toggleAccordion = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleExpandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    filteredFaqs.forEach((f) => {
      allExpanded[f.id] = true;
    });
    setExpandedIds(allExpanded);
  };

  const handleCollapseAll = () => {
    setExpandedIds({});
  };

  return (
    <section
      id="faq-section"
      className="w-full rounded-2xl bg-white border border-slate-200 p-5 sm:p-7 shadow-xs flex flex-col gap-6"
    >
      {/* En-tête de la FAQ avec titre clair et badge explicatif */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-100 border border-sky-300 text-sky-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Foire Aux Questions &amp; Déchiffrage Scientifique
                <span className="text-[11px] font-mono text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-300 font-semibold">
                  Interactif
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Chaque terme technique utilisé dans les cartes de résultats expliqué en français limpide avec exemples concrets
              </p>
            </div>
          </div>
        </div>

        {/* Boutons Tout déplier / Tout replier */}
        <div className="flex items-center gap-2 text-xs self-end sm:self-auto">
          <button
            onClick={handleExpandAll}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            Tout déplier
          </button>
          <button
            onClick={handleCollapseAll}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            Tout replier
          </button>
        </div>
      </div>

      {/* Barre de recherche instantanée + Filtres par thématique */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Barre de recherche */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un concept : EROI, Haber-Bosch, FaIR, Stull Tw, 31°C, canicule, engrais..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              Effacer
            </button>
          )}
        </div>

        {/* Boutons catégories */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium ${
              selectedCategory === 'all'
                ? 'bg-sky-600 text-white font-bold shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Tous ({FAQ_ITEMS.length})
          </button>
          <button
            onClick={() => setSelectedCategory('energy')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium ${
              selectedCategory === 'energy'
                ? 'bg-amber-600 text-white font-bold shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Zap className={`w-3 h-3 ${selectedCategory === 'energy' ? 'text-white' : 'text-amber-600'}`} />
            <span>Énergie &amp; EROI</span>
          </button>
          <button
            onClick={() => setSelectedCategory('agri')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium ${
              selectedCategory === 'agri'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Wheat className={`w-3 h-3 ${selectedCategory === 'agri' ? 'text-white' : 'text-emerald-600'}`} />
            <span>Agriculture &amp; Engrais</span>
          </button>
          <button
            onClick={() => setSelectedCategory('climate')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium ${
              selectedCategory === 'climate'
                ? 'bg-sky-600 text-white font-bold shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Wind className={`w-3 h-3 ${selectedCategory === 'climate' ? 'text-white' : 'text-sky-600'}`} />
            <span>Climat &amp; FaIR</span>
          </button>
          <button
            onClick={() => setSelectedCategory('survival')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium ${
              selectedCategory === 'survival'
                ? 'bg-rose-600 text-white font-bold shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Thermometer className={`w-3 h-3 ${selectedCategory === 'survival' ? 'text-white' : 'text-rose-600'}`} />
            <span>Survie &amp; Stull Tw</span>
          </button>
        </div>
      </div>

      {/* Cartes d'accordéon FAQ */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-800">
              Aucune question trouvée pour « {searchQuery} »
            </p>
            <p className="text-xs text-slate-500">
              Essayez avec d'autres mots-clés comme "EROI", "Haber", "Tw", "FaIR" ou sélectionnez "Tous".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-2 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-sky-700 font-semibold hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
            >
              Réinitialiser la recherche
            </button>
          </div>
        ) : (
          filteredFaqs.map((item) => {
            const isExpanded = !!expandedIds[item.id];
            const isHighlighted = highlightedId === item.id;

            return (
              <div
                key={item.id}
                id={item.id}
                className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                  isHighlighted
                    ? 'ring-2 ring-sky-500 border-sky-400 bg-sky-50/50 shadow-md'
                    : isExpanded
                    ? 'bg-slate-50/60 border-slate-300 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/30'
                }`}
              >
                {/* Ligne d'en-tête de la question (cliquable pour déplier) */}
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full p-4 sm:p-4.5 flex items-start sm:items-center justify-between gap-3 text-left cursor-pointer group"
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                    <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 shrink-0 mt-0.5 sm:mt-0 group-hover:scale-105 transition-transform">
                      {item.categoryIcon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {item.categoryLabel}
                        </span>
                        {isHighlighted && (
                          <span className="text-[10px] font-semibold text-sky-800 bg-sky-100 px-2 py-0.5 rounded border border-sky-300 animate-pulse">
                            Sélectionné depuis l'info-bulle
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors tracking-tight">
                        {item.question}
                      </h3>
                      {!isExpanded && (
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                          {item.shortSummary}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-slate-500 group-hover:text-slate-800">
                    <span className="text-[11px] font-medium hidden md:inline">
                      {isExpanded ? 'Réduire' : 'Découvrir'}
                    </span>
                    <div className="p-1 rounded bg-slate-100 border border-slate-200">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-sky-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Corps de la réponse détaillé */}
                {isExpanded && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 border-t border-slate-200 animate-in fade-in duration-200">
                    {/* Contenu principal riche */}
                    {item.fullAnswer}

                    {/* Références scientifiques & Tags */}
                    <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[10.5px]">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        <span>Source de référence : {item.scientificRef}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-600 border border-slate-200"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Résumé mémo express en bas de FAQ */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-100 border border-amber-300 text-amber-700 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block">
              Astuce : Survolez les petits badges d'interrogation (?) dans n'importe quelle carte
            </span>
            <span className="text-slate-500">
              Des info-bulles interactives s'affichent instantanément sur le contrôleur de temps, les graphiques et le planisphère.
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-sky-700 font-semibold border border-slate-300 shadow-2xs transition-colors shrink-0 cursor-pointer"
        >
          <span>Remonter aux graphiques</span>
          <ArrowRight className="w-3.5 h-3.5 -rotate-90" />
        </button>
      </div>
    </section>
  );
};
