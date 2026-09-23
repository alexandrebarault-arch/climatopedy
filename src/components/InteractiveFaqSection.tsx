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

    window.addEventListener('gaia-open-faq', handleOpenFaq);
    return () => window.removeEventListener('gaia-open-faq', handleOpenFaq);
  }, []);

  const FAQ_ITEMS: FaqItem[] = [
    {
      id: 'faq-eroi',
      category: 'energy',
      categoryLabel: 'Énergie & EROI',
      categoryIcon: <Zap className="w-4 h-4 text-amber-400" />,
      question: "Qu'est-ce que l'EROI et pourquoi est-ce le moteur caché de notre société ?",
      shortSummary: "Combien de barils d'énergie récolte-t-on pour 1 baril consommé à forer et raffiner.",
      tags: ['EROI', 'pétrole', 'énergie nette', 'multiplicateur', 'falaise énergétique'],
      scientificRef: 'Hall, Lambert & Balogh (2014) · Murphy & Hall (Ann. N.Y. Acad. Sci., 2010)',
      fullAnswer: (
        <div className="space-y-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
          <p>
            <strong>EROI</strong> signifie en anglais <em>Energy Return on Investment</em> (Rendement Énergétique du Capital Investi). C'est le ratio physique fondamental de notre civilisation :
          </p>
          <div className="bg-[#0b101b] p-3 rounded-lg border border-amber-900/40 text-amber-200 font-mono text-xs">
            EROI = Énergie totale extraite / Énergie dépensée pour l'extraire et la raffiner
          </div>
          <p>
            Pour éviter le jargon des ratios mathématiques (ex. <em>12:1</em>), nous l'exprimons en <strong>multiplicateur simple (x12)</strong> :
          </p>
          <ul className="space-y-2 list-disc pl-5 text-slate-300">
            <li>
              <strong>En 1900 (Multiplicateur x100) :</strong> Les premiers gisements au Texas et en Azerbaïdjan jaillissaient à quelques mètres du sol sous forte pression. Dépenser l'équivalent énergétique d'un baril permettait d'en extraire 100 ! Les <strong>99% restants</strong> (« énergie nette ») ont permis de construire les réseaux ferrés, les hôpitaux, les universités et l'aviation.
            </li>
            <li>
              <strong>En 2026 (Multiplicateur x12) :</strong> Les gisements faciles sont épuisés. Pour trouver du pétrole, il faut désormais forer sous 3 000 mètres d'océan, fracturer la roche étanche (schiste américain) ou distiller du bitume canadien. Un baril n'en rapporte plus que 12 : les <strong>92% d'énergie utile</strong> font encore tourner la société, mais la marge se réduit.
            </li>
            <li>
              <strong>La Falaise Énergétique (Sous x5) :</strong> Si l'EROI tombe à x3, il faut brûler 1 baril rien que pour en récupérer 3. La société doit alors mobiliser un tiers de son économie rien que pour alimenter le secteur énergétique, entraînant une désindustrialisation mécanique et une baisse brutale des services publics.
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'faq-haber-bosch',
      category: 'agri',
      categoryLabel: 'Agriculture & Haber-Bosch',
      categoryIcon: <Wheat className="w-4 h-4 text-emerald-400" />,
      question: "Le procédé Haber-Bosch : pourquoi la moitié de l'humanité mange-t-elle grâce au gaz fossile ?",
      shortSummary: "La réaction chimique qui transforme le gaz naturel et l'azote de l'air en engrais pour nourrir 8 milliards d'humains.",
      tags: ['Haber-Bosch', 'engrais', 'azote', 'gaz naturel', 'agriculture', 'famine', 'blé', 'riz'],
      scientificRef: 'Vaclav Smil (2001) · Enriching the Earth (MIT Press) · Erisman et al. (Nature Geoscience, 2008)',
      fullAnswer: (
        <div className="space-y-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
          <p>
            Inventé en 1909 par les chimistes allemands Fritz Haber et Carl Bosch, ce procédé permet de briser la triple liaison chimique extrêmement solide de l'azote de l'air ($N_2$) sous haute pression (200 bars) et haute température (450°C) grâce à l'hydrogène extrait du <strong>gaz naturel (méthane $CH_4$)</strong> :
          </p>
          <div className="bg-[#0b101b] p-3 rounded-lg border border-emerald-900/40 text-emerald-200 font-mono text-xs">
            N₂ (air) + 3 H₂ (extrait du gaz fossile CH₄) ➔ 2 NH₃ (Ammoniac de synthèse)
          </div>
          <p>
            Cet ammoniac est ensuite transformé en nitrates et urée épandus sur les champs de blé, maïs et riz à travers le monde.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2 text-xs">
            <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50">
              <span className="font-bold text-white block">Un atome d'azote sur deux dans votre corps :</span>
              <span className="text-slate-300">
                Comme l'a démontré le chercheur Vaclav Smil, 48% à 50% des atomes d'azote constitutifs des protéines musculaires et de l'ADN des 8 milliards d'humains vivants proviennent de cette usine chimique.
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/50">
              <span className="font-bold text-rose-300 block">L'effet ciseau de la déplétion fossile :</span>
              <span className="text-slate-300">
                Quand le gaz naturel devient rare ou trop cher, les usines d'engrais ferment (comme en Europe en 2022). Les rendements de blé chutent de 40% à 50% en deux saisons, provoquant des famines mondiales immédiates.
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
      categoryIcon: <Wind className="w-4 h-4 text-cyan-400" />,
      question: "Le modèle FaIR : comment calcule-t-il le climat mondial sans supercalculateur géant ?",
      shortSummary: "Le modèle d'émissions et de température validé par le GIEC AR6 pour simuler instantanément la Terre.",
      tags: ['FaIR', 'GIEC', 'AR6', 'CO2', 'température', 'effet de serre', 'Smith'],
      scientificRef: 'Smith et al. (Geosci. Model Dev., 2018) · GIEC AR6 WG1 Chapitre 7',
      fullAnswer: (
        <div className="space-y-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
          <p>
            <strong>FaIR</strong> signifie <em>Finite Amplitude Impulse Response</em> (Modèle de réponse impulsionnelle à amplitude finie).
          </p>
          <p>
            Les modèles de circulation générale couplée atmosphère-océan (comme ceux du CNRM ou de l'IPSL) nécessitent des semaines de calculs sur des supercalculateurs géants pour simuler un siècle de climat. FaIR a été développé par une équipe internationale menée par le Dr Chris Smith (Oxford/Leeds) pour résoudre ce problème :
          </p>
          <ul className="space-y-1.5 list-disc pl-5 text-slate-300">
            <li>
              <strong>Résolution milliseconde :</strong> FaIR reproduit avec une fidélité supérieure à 98% les trajectoires thermiques des grands modèles complexes CMIP6.
            </li>
            <li>
              <strong>Cycle du carbone dynamique :</strong> Il intègre la saturation progressive des puits de carbone naturels (les océans et les forêts absorbent moins de CO₂ à mesure qu'ils se réchauffent).
            </li>
            <li>
              <strong>Inertie thermique océanique :</strong> Il prend en compte le décalage de plusieurs décennies entre le forçage radiatif du CO₂ et l'échauffement des grands fonds marins.
            </li>
          </ul>
          <p>
            Dans GAIA-Sim, FaIR est directement exécuté en temps réel pour calculer l'anomalie thermique mondiale (°C) à chaque pas temporel en fonction des émissions cumulées de gaz à effet de serre.
          </p>
        </div>
      )
    },
    {
      id: 'faq-stull',
      category: 'survival',
      categoryLabel: 'Survie Humaine & Stull Tw',
      categoryIcon: <Thermometer className="w-4 h-4 text-rose-400" />,
      question: "La température humide Stull Tw : pourquoi le corps humain ne peut-il pas survivre au-dessus de 31°C Tw ?",
      shortSummary: "La thermodynamique de la transpiration et le seuil mortel où le corps cuit de l'intérieur.",
      tags: ['Stull Tw', 'thermomètre mouillé', 'chaleur humide', 'canicule', 'hyperthermie', 'seuil létal', 'Raymond'],
      scientificRef: 'Roland Stull (J. Appl. Meteor. Climatol., 2011) · Raymond et al. (Science Advances, 2020) · Sherwood & Huber (PNAS, 2010)',
      fullAnswer: (
        <div className="space-y-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
          <p>
            Le corps humain produit en permanence environ 100 Watts de chaleur métabolique interne. Pour maintenir notre température interne à 37°C dans un environnement chaud, nous n'avons qu'un seul mécanisme physique : <strong>l'évaporation de la sueur</strong>.
          </p>
          <p>
            Or, la thermodynamique dicte qu'un liquide ne peut s'évaporer que si l'air environnant n'est pas déjà saturé de vapeur d'eau. C'est ce que mesure le <strong>thermomètre mouillé (Wet-Bulb Temperature, noté Tw)</strong> :
          </p>
          <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg text-rose-200 space-y-2">
            <span className="font-bold text-white block">🚨 Le seuil létal absolu de 31,0°C Tw (Raymond et al., 2020) :</span>
            <p className="text-xs">
              À partir de 31,0°C Tw, l'air est à la fois trop chaud et trop gorgé d'eau pour absorber la sueur. Même nu, immobile à l'ombre d'un arbre et avec de l'eau à volonté, le corps ne peut plus se refroidir. La température interne grimpe inévitablement jusqu'à 42°C en 4 à 6 heures, entraînant défaillance multi-viscérale et arrêt cardiaque.
            </p>
          </div>
          <p>
            <strong>La formule de Roland Stull (2011) :</strong> Le professeur Roland Stull a publié l'équation de référence internationale combinant la température de l'air $T$ (en °C) et l'humidité relative $RH$ (en %) :
          </p>
          <div className="bg-[#0b101b] p-2.5 rounded border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto">
            Tw = T · atan(0.151977·√(RH + 8.313659)) + atan(T + RH) - atan(RH - 1.676331) + 0.00391838·RH^(3/2)·atan(0.023101·RH) - 4.686035
          </div>
          <p>
            Cette formule est utilisée dans GAIA-Sim pour chaque pays afin de déterminer avec rigueur les jours annuels de mortalité par hyperthermie.
          </p>
        </div>
      )
    },
    {
      id: 'faq-slr',
      category: 'climate',
      categoryLabel: 'Océans & Climat',
      categoryIcon: <Waves className="w-4 h-4 text-sky-400" />,
      question: "La montée des océans : comment passe-t-on de +12 cm aujourd'hui à +75 cm en 2100 ?",
      shortSummary: "Les deux causes physiques de l'élévation marine et pourquoi les greniers côtiers s'effondrent avant d'être noyés.",
      tags: ['montée des océans', 'niveau marin', 'submersion', 'deltas', 'salinisation', 'Vermeer & Rahmstorf'],
      scientificRef: 'Vermeer & Rahmstorf (PNAS, 2009) · GIEC SROCC (2019)',
      fullAnswer: (
        <div className="space-y-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
          <p>
            L'élévation moyenne du niveau de la mer n'est pas une simple vague : c'est un processus physique inarrêtable à court terme gouverné par deux moteurs :
          </p>
          <ol className="space-y-2 list-decimal pl-5 text-slate-300">
            <li>
              <strong>La dilatation thermique (environ 40%) :</strong> L'eau chauffée gagne en volume. Comme les océans ont absorbé plus de 90% de l'excès de chaleur accumulé par l'effet de serre, la colonne d'eau se dilate sur des milliers de mètres de profondeur.
            </li>
            <li>
              <strong>La fonte des glaces continentales (environ 60%) :</strong> Les glaciers de montagne (Alpes, Andes, Himalaya) ainsi que les calottes polaires posées sur la terre ferme (Groenland et Antarctique occidental) déversent des milliards de tonnes d'eau douce dans les océans. (Note : la fonte de la banquise flottante ne fait pas monter l'eau, comme un glaçon dans un verre).
            </li>
          </ol>
          <div className="p-3 bg-sky-950/40 border border-sky-800/60 rounded-lg text-sky-200">
            <span className="font-bold text-white block mb-1">Le piège de la salinisation des nappes côtières :</span>
            <p className="text-xs">
              Les deltas rizicoles (Mékong au Vietnam, delta du Gange au Bangladesh, delta du Nil en Égypte) nourrissent des centaines de millions d'individus. Bien avant que l'eau ne submerge les maisons, une hausse de +30 à +50 cm infiltre l'eau salée de mer dans les nappes phréatiques douces. La terre devient stérile et l'eau potable devient impropre à la consommation.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'faq-weather-vs-tw',
      category: 'survival',
      categoryLabel: 'Survie Humaine',
      categoryIcon: <Thermometer className="w-4 h-4 text-rose-400" />,
      question: "Quelle est la différence concrète entre la température météo à l'ombre et la température humide Tw ?",
      shortSummary: "Comparatif direct : 45°C dans un désert sec vs 35°C dans une mousson tropicale.",
      tags: ['météo', 'température sèche', 'humidité', 'désert', 'tropiques', 'ressenti'],
      scientificRef: 'NOAA Heat Index Guidelines · Sherwood & Huber (2010)',
      fullAnswer: (
        <div className="space-y-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
          <p>
            Le thermomètre classique de votre application météo mesure la <strong>température de l'air sec (Dry-Bulb)</strong>. Il ignore totalement l'humidité, alors que c'est elle qui décide si vous survivez ou mourez :
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs my-2">
            <div className="p-3 rounded-lg bg-[#0b101b] border border-amber-800/60">
              <span className="font-bold text-amber-300 block mb-1">Cas A : Désert du Sahara ou Las Vegas</span>
              <p className="text-slate-300 mb-1.5">
                • Température de l'air : <strong>45°C</strong><br />
                • Humidité relative : <strong>12%</strong><br />
                • Température humide Tw : <strong>22,5°C</strong>
              </p>
              <span className="text-emerald-400 font-semibold block">
                ✅ Survie possible : L'air est si sec que la sueur s'évapore instantanément. En restant à l'ombre et en buvant 8 litres d'eau par jour, le corps régule ses 37°C.
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#0b101b] border border-rose-800/60">
              <span className="font-bold text-rose-300 block mb-1">Cas B : Golfe Persique, Inde ou delta chinois</span>
              <p className="text-slate-300 mb-1.5">
                • Température de l'air : <strong>35°C</strong><br />
                • Humidité relative : <strong>80%</strong><br />
                • Température humide Tw : <strong>32,2°C</strong>
              </p>
              <span className="text-rose-400 font-bold block">
                ☠️ Mortel en 4 heures : Bien que l'air soit à 35°C (10°C de moins que dans le désert), la saturation en vapeur empêche l'évaporation. Sans climatisation électrique, coup de chaleur fatal garanti.
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
      categoryIcon: <AlertTriangle className="w-4 h-4 text-orange-400" />,
      question: "Pourquoi le simulateur utilise-t-il l'hypothèse de rigidité comportementale (SSP5-8.5) ?",
      shortSummary: "Comprendre pourquoi modéliser la poursuite du modèle sans transition institutionnelle est crucial.",
      tags: ['SSP5-8.5', 'scénarios', 'rigidité', 'modélisation', 'bifurcation'],
      scientificRef: 'O\'Neill et al. (Global Environ. Change, 2017) · Riahi et al. (2017)',
      fullAnswer: (
        <div className="space-y-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
          <p>
            Dans les rapports du GIEC, le scénario <strong>SSP5-8.5</strong> représente un monde axé sur la croissance économique par l'intensification des ressources conventionnelles, sans politique climatique globale contraignante.
          </p>
          <p>
            Dans GAIA-Sim, nous l'adoptons non pas comme une prophétie inéluctable, mais comme une <strong>sonde de contrainte biophysique</strong> :
          </p>
          <ul className="space-y-1.5 list-disc pl-5 text-slate-300">
            <li>
              Il permet de quantifier exactement ce qui se produit lorsque les infrastructures existantes (centrales, autoroutes, parcs de camions, usines d'engrais) continuent sur leur lancée et percutent de plein fouet les limites géologiques (déclin de l'EROI) et thermodynamiques (chaleur létale Tw).
            </li>
            <li>
              C'est la référence indispensable pour mesurer l'urgence et l'ampleur des politiques d'adaptation, de sobriété et de relocalisation résiliente.
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'faq-regen-agri',
      category: 'agri',
      categoryLabel: 'Agriculture & Transition',
      categoryIcon: <Wheat className="w-4 h-4 text-emerald-400" />,
      question: "L'agriculture biologique ou régénérative peut-elle remplacer Haber-Bosch rapidement ?",
      shortSummary: "Le défi du temps agronomique de transition, de la fixation biologique de l'azote et de la masse humaine.",
      tags: ['bio', 'agroécologie', 'azote', 'légumineuses', 'transition', 'rendement'],
      scientificRef: 'Ponisio et al. (Proc. R. Soc. B, 2015) · Billen, Garnier et al. (One Earth, 2021)',
      fullAnswer: (
        <div className="space-y-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
          <p>
            L'agroécologie et la fertilisation par les légumineuses (trèfle, luzerne, pois) qui fixent naturellement l'azote atmosphérique grâce à leurs nodosités bactériennes sont la <strong>seule solution pérenne à long terme</strong>.
          </p>
          <p>
            Cependant, à court et moyen terme (10 à 25 ans), trois freins physiques majeurs s'imposent :
          </p>
          <ul className="space-y-2 list-disc pl-5 text-slate-300">
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
      className="w-full rounded-2xl bg-[#090e18] border border-slate-800 p-5 sm:p-7 shadow-2xl flex flex-col gap-6"
    >
      {/* En-tête de la FAQ avec titre clair et badge explicatif */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Foire Aux Questions &amp; Déchiffrage Scientifique
                <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800/80">
                  Interactif
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Chaque terme technique utilisé dans les cartes de résultats expliqué en français limpide avec exemples concrets
              </p>
            </div>
          </div>
        </div>

        {/* Boutons Tout déplier / Tout replier */}
        <div className="flex items-center gap-2 text-xs self-end sm:self-auto">
          <button
            onClick={handleExpandAll}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Tout déplier
          </button>
          <button
            onClick={handleCollapseAll}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
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
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0f1728] border border-slate-700 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
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
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            Tous ({FAQ_ITEMS.length})
          </button>
          <button
            onClick={() => setSelectedCategory('energy')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium ${
              selectedCategory === 'energy'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Énergie &amp; EROI</span>
          </button>
          <button
            onClick={() => setSelectedCategory('agri')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium ${
              selectedCategory === 'agri'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Wheat className="w-3 h-3 text-emerald-400" />
            <span>Agriculture &amp; Engrais</span>
          </button>
          <button
            onClick={() => setSelectedCategory('climate')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium ${
              selectedCategory === 'climate'
                ? 'bg-sky-500 text-slate-950 font-bold shadow'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Wind className="w-3 h-3 text-cyan-400" />
            <span>Climat &amp; FaIR</span>
          </button>
          <button
            onClick={() => setSelectedCategory('survival')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium ${
              selectedCategory === 'survival'
                ? 'bg-rose-500 text-slate-950 font-bold shadow'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Thermometer className="w-3 h-3 text-rose-400" />
            <span>Survie &amp; Stull Tw</span>
          </button>
        </div>
      </div>

      {/* Cartes d'accordéon FAQ */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#0f1728] border border-slate-800 text-center space-y-2">
            <HelpCircle className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">
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
              className="mt-2 px-3 py-1.5 rounded bg-slate-800 text-xs text-cyan-400 hover:bg-slate-700 transition-colors"
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
                    ? 'ring-2 ring-cyan-400 border-cyan-400 bg-[#101b30] shadow-lg shadow-cyan-950/60'
                    : isExpanded
                    ? 'bg-[#0e1626] border-slate-700 shadow-md'
                    : 'bg-[#0c121e] border-slate-800/90 hover:border-slate-700 hover:bg-[#0f1728]'
                }`}
              >
                {/* Ligne d'en-tête de la question (cliquable pour déplier) */}
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full p-4 sm:p-4.5 flex items-start sm:items-center justify-between gap-3 text-left cursor-pointer group"
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 shrink-0 mt-0.5 sm:mt-0 group-hover:scale-105 transition-transform">
                      {item.categoryIcon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {item.categoryLabel}
                        </span>
                        {isHighlighted && (
                          <span className="text-[10px] font-semibold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-700 animate-pulse">
                            Sélectionné depuis l'info-bulle
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors tracking-tight">
                        {item.question}
                      </h3>
                      {!isExpanded && (
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {item.shortSummary}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-slate-400 group-hover:text-white">
                    <span className="text-[11px] font-medium hidden md:inline">
                      {isExpanded ? 'Réduire' : 'Découvrir'}
                    </span>
                    <div className="p-1 rounded bg-slate-800 border border-slate-700">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Corps de la réponse détaillé */}
                {isExpanded && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 border-t border-slate-800/80 animate-in fade-in duration-200">
                    {/* Contenu principal riche */}
                    {item.fullAnswer}

                    {/* Références scientifiques & Tags */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10.5px]">
                        <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                        <span>Source de référence : {item.scientificRef}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-full bg-slate-800/80 text-[10px] text-slate-400"
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
      <div className="p-4 rounded-xl bg-[#0f1728] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white block">
              Astuce : Survolez les petits badges d'interrogation (?) dans n'importe quelle carte
            </span>
            <span className="text-slate-400">
              Des info-bulles interactives s'affichent instantanément sur le contrôleur de temps, les graphiques et le planisphère.
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold border border-slate-700 transition-colors shrink-0 cursor-pointer"
        >
          <span>Remonter aux graphiques</span>
          <ArrowRight className="w-3.5 h-3.5 -rotate-90" />
        </button>
      </div>
    </section>
  );
};
