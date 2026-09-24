import React, { useState } from 'react';
import {
  Sparkles,
  Thermometer,
  Zap,
  Utensils,
  LineChart,
  Lightbulb,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Droplets,
  Trees,
  Sun,
  Flame,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: { text: string; correct: boolean; explanation: string }[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "Pourquoi un ventilateur ne peut plus te rafraîchir si l'air est à 36°C avec 90% d'humidité ?",
    options: [
      {
        text: "Parce que le ventilateur souffle de l'air trop vite",
        correct: false,
        explanation: "Non, la vitesse du ventilateur ne change rien au problème !"
      },
      {
        text: "Parce que l'air est déjà plein d'eau, donc ta sueur ne peut plus s'évaporer pour refroidir ta peau",
        correct: true,
        explanation: "Exactement ! Quand l'air est saturé d'humidité (comme dans une salle de bain pleine de buée), l'eau de ta sueur ne peut pas s'évaporer. Le ventilateur souffle alors de l'air chaud et humide sur toi, comme un sèche-cheveux tiède !"
      },
      {
        text: "Parce que les ventilateurs ne fonctionnent qu'en hiver",
        correct: false,
        explanation: "Non, bien sûr !"
      }
    ]
  },
  {
    question: "Qu'est-ce que le « Rendement de l'Énergie » dans l'histoire des mûres sauvages ?",
    options: [
      {
        text: "La vitesse à laquelle on court pour trouver les mûres",
        correct: false,
        explanation: "Pas tout à fait, même si la distance compte !"
      },
      {
        text: "Le rapport entre l'énergie qu'on gagne en mangeant les mûres et l'énergie dépensée pour aller les cueillir",
        correct: true,
        explanation: "Bravo ! Si tu dépenses 1 calorie pour ramasser 50 calories de mûres, tu es gagnant. Mais si tu dépenses 1 calorie pour en ramener seulement 2, il ne te reste presque plus rien pour le reste de ta journée !"
      },
      {
        text: "Le prix des mûres au supermarché",
        correct: false,
        explanation: "Non, le rendement énergétique est une mesure physique d'énergie, pas une étiquette en euros !"
      }
    ]
  },
  {
    question: "Combien de calories par jour un être humain a-t-il besoin au minimum pour être en bonne santé ?",
    options: [
      {
        text: "Environ 500 calories",
        correct: false,
        explanation: "C'est beaucoup trop peu, c'est une famine sévère qui met la vie en danger."
      },
      {
        text: "Environ 2 100 calories (seuil FAO / OMS)",
        correct: true,
        explanation: "C'est la bonne réponse ! 2 100 calories par jour, c'est le carburant essentiel dont notre corps et notre cerveau ont besoin pour bouger, penser et grandir."
      },
      {
        text: "Environ 15 000 calories",
        correct: false,
        explanation: "C'est ce que mange un ours polaire avant l'hibernation !"
      }
    ]
  }
];

export const YouthExplainerCard: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<'tw' | 'eroi' | 'food' | 'charts' | 'future'>('tw');
  const [quizAnswers, setQuizAnswers] = useState<{ [qIdx: number]: number | null }>({});
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const handleSelectAnswer = (qIdx: number, optIdx: number) => {
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  return (
    <section className="w-full rounded-2xl bg-white border border-slate-200/90 p-5 sm:p-7 shadow-xs text-slate-700 flex flex-col gap-6">
      {/* En-tête principal : Style livret pédagogique */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                La Terre expliquée aux curieux de 12 ans (et à leurs parents !)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Comment fonctionne cette machine à explorer le futur de 2026 à 2200 ? Les clés pour tout comprendre sans jargon.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 transition-colors border border-slate-200 shrink-0 cursor-pointer shadow-2xs"
        >
          {isExpanded ? (
            <>
              <span>Réduire le guide</span>
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Ouvrir le guide complet</span>
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* Menu de navigation des chapitres */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTopic('tw')}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTopic === 'tw'
                  ? 'bg-white text-rose-800 border border-rose-200 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-600" />
              <span>1. La Chaleur Mouillée</span>
            </button>

            <button
              onClick={() => setActiveTopic('eroi')}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTopic === 'eroi'
                  ? 'bg-white text-amber-800 border border-amber-200 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>2. Le Secret de l'Énergie</span>
            </button>

            <button
              onClick={() => setActiveTopic('food')}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTopic === 'food'
                  ? 'bg-white text-emerald-800 border border-emerald-200 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Utensils className="w-3.5 h-3.5 text-emerald-600" />
              <span>3. Dans Notre Assiette</span>
            </button>

            <button
              onClick={() => setActiveTopic('charts')}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTopic === 'charts'
                  ? 'bg-white text-sky-800 border border-sky-200 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <LineChart className="w-3.5 h-3.5 text-sky-600" />
              <span>4. Lire les Graphiques</span>
            </button>

            <button
              onClick={() => setActiveTopic('future')}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all col-span-2 sm:col-span-1 cursor-pointer ${
                activeTopic === 'future'
                  ? 'bg-white text-purple-800 border border-purple-200 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-purple-600" />
              <span>5. Solutions &amp; Avenir</span>
            </button>
          </div>

          {/* CONTENU DU THÈME 1 : THERMOMÈTRE MOUILLÉ (TW) */}
          {activeTopic === 'tw' && (
            <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-5 flex flex-col gap-4 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Pourquoi 35°C dans le désert c'est gérable, mais 32°C dans un hammam c'est mortel ?
                  </h3>
                  <p className="text-xs text-slate-500">
                    Le grand secret de la transpiration et de l'indice Roland Stull (Tw)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Étape 1 : Le super-pouvoir */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-2 shadow-2xs">
                  <div className="flex items-center gap-2 text-sky-800 font-semibold text-sm">
                    <Droplets className="w-4 h-4 text-sky-600" />
                    <span>1. Ton climatiseur interne</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    Quand tu cours dans la cour d'école en plein été, ton corps chauffe comme un petit moteur. Pour ne pas monter à 42°C de fièvre, ta peau fabrique des gouttes de sueur.
                  </p>
                  <p className="text-slate-500 italic">
                    En s'évaporant dans l'air, l'eau emporte la chaleur avec elle. C'est pour ça que tu frissonnes quand tu sors mouillé de la piscine avec du vent !
                  </p>
                </div>

                {/* Étape 2 : Le piège de l'humidité */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-2 shadow-2xs">
                  <div className="flex items-center gap-2 text-amber-800 font-semibold text-sm">
                    <Sun className="w-4 h-4 text-amber-600" />
                    <span>2. L'air comme une éponge pleine</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    L'air autour de nous est comme une éponge. Dans un désert sec, l'éponge est vide : la sueur s'évapore instantanément.
                  </p>
                  <p className="text-slate-500 italic">
                    Mais près de l'océan ou dans une serre tropicale, l'éponge est déjà gorgée d'eau (80% à 95% d'humidité). Ta sueur coule mais elle ne peut plus s'évaporer !
                  </p>
                </div>

                {/* Étape 3 : Le seuil létal des 31°C Tw */}
                <div className="bg-white p-4 rounded-xl border border-rose-200 flex flex-col gap-2 shadow-2xs">
                  <div className="flex items-center gap-2 text-rose-700 font-semibold text-sm">
                    <Flame className="w-4 h-4 text-rose-600" />
                    <span>3. Le seuil des 31°C Tw</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    Si le thermomètre mouillé dépasse <strong>31°C</strong>, le corps humain ne peut plus du tout se refroidir, même à l'ombre avec un ventilateur.
                  </p>
                  <p className="text-rose-700 font-medium">
                    Sans climatisation branchée sur une prise électrique, la température interne grimpe en flèche. C'est l'inhabitabilité physiologique.
                  </p>
                </div>
              </div>

              {/* Exemple concret */}
              <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 text-xs text-sky-900 flex items-start gap-2.5">
                <span className="text-lg">💡</span>
                <div>
                  <span className="font-semibold text-sky-950">Ce qu'il faut retenir sur la carte :</span>{' '}
                  Quand tu vois un pays coloré en rouge ou violet avec un signal d'alarme (comme le Pakistan, l'Inde ou le Golfe Persique en été), cela ne veut pas seulement dire « il fait chaud », cela veut dire que l'air y est trop humide pour la survie humaine sans protection artificielle.
                </div>
              </div>
            </div>
          )}

          {/* CONTENU DU THÈME 2 : L'EROI & L'ÉNERGIE NETTE */}
          {activeTopic === 'eroi' && (
            <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-5 flex flex-col gap-4 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    L'histoire du panier de mûres et du rendement de l'énergie
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pourquoi extraire du pétrole devient de plus en plus difficile pour notre civilisation
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Métaphore du panier */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-3 shadow-2xs">
                  <h4 className="font-semibold text-amber-800 text-sm">
                    🍇 La métaphore de la cueillette de mûres sauvages
                  </h4>
                  <p className="text-slate-700 leading-relaxed">
                    Imagine que tes parents te demandent d'aller ramasser des mûres dans la forêt pour le goûter :
                  </p>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-emerald-700 font-mono">En 1900 :</span>
                      <span>Les buissons sont juste devant la maison. Tu marches 20 mètres et tu ramènes un seau plein à ras bord. Tu as dépensé 1 calorie pour en rapporter 100 ! (Multiplicateur x100 : 100 calories obtenues pour 1 dépensée). Tout le reste de la journée, tu as 99% d'énergie pour construire une cabane.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-amber-700 font-mono">En 2026 :</span>
                      <span>On a mangé toutes les mûres faciles. Maintenant, tu dois marcher 5 kilomètres et grimper des rochers. Tu dépenses 1 calorie pour en rapporter 12 (Multiplicateur x12 : 12 calories obtenues pour 1 dépensée). Les 92% restants font rouler les camions et tourner les hôpitaux.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-rose-700 font-mono">En 2060 :</span>
                      <span>Tu dois faire de l'escalade extrême pendant 8 heures pour trouver 2 petites baies. Tu dépenses presque autant d'énergie que ce que tu ramènes ! (Multiplicateur x3 : seulement 3 calories obtenues pour 1 dépensée). Un tiers de l'énergie sert juste à chercher les baies !</span>
                    </li>
                  </ul>
                </div>

                {/* Conséquence sur notre monde */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-3 shadow-2xs">
                  <h4 className="font-semibold text-sky-800 text-sm">
                    🏗️ Qu'est-ce que l'Énergie Nette change pour nous ?
                  </h4>
                  <p className="text-slate-700 leading-relaxed">
                    Le pétrole et le gaz ne servent pas qu'aux voitures. Ils servent à :
                  </p>
                  <ul className="space-y-1.5 text-slate-700">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                      <span>Faire rouler les <strong>tracteurs</strong> dans les champs de blé</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                      <span>Fabriquer les <strong>engrais chimiques</strong> (synthèse Haber-Bosch)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                      <span>Construire les <strong>écoles, hôpitaux, routes et trains</strong></span>
                    </li>
                  </ul>
                  <div className="mt-auto p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                    <strong>La « falaise énergétique » :</strong> Si le rendement tombe trop bas (sous 8 barils gagnés pour 1 dépensé), l'industrie dépense tellement d'énergie pour simplement trouver de l'énergie qu'il ne reste plus assez pour faire tourner les hôpitaux ou les usines.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONTENU DU THÈME 3 : DANS NOTRE ASSIETTE */}
          {activeTopic === 'food' && (
            <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-5 flex flex-col gap-4 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Qu'est-ce qu'on mange en 2050 ? Les 3 voleurs de récoltes
                  </h3>
                  <p className="text-xs text-slate-500">
                    Comment le climat, l'énergie et les océans influencent directement le contenu de notre assiette
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Voleur 1 : Le coup de chaud des céréales */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-2 shadow-2xs">
                  <div className="text-amber-800 font-semibold text-sm flex items-center gap-1.5">
                    <span>🌾</span>
                    <span>1. La fièvre des céréales</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    Les 4 plantes magiques qui nourrissent le monde sont le <strong>blé, le riz, le maïs et le soja</strong>.
                  </p>
                  <p className="text-slate-500">
                    Les scientifiques ont calculé que pour chaque degré de réchauffement en plus, le maïs perd environ 7,4% de son rendement et le blé 6%. Au-delà de 35°C au moment de la floraison, les épis n'arrivent plus à fabriquer de grains.
                  </p>
                </div>

                {/* Voleur 2 : L'azote et les engrais */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-2 shadow-2xs">
                  <div className="text-sky-800 font-semibold text-sm flex items-center gap-1.5">
                    <span>🧪</span>
                    <span>2. L'azote magique (Haber-Bosch)</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    Aujourd'hui, presque la moitié des humains sur Terre mangent grâce à des engrais azotés inventés il y a 100 ans.
                  </p>
                  <p className="text-slate-500">
                    Pour fabriquer ces engrais, il faut beaucoup de gaz naturel et de très hautes températures. Si l'énergie fossile devient rare ou très chère, les champs produisent beaucoup moins.
                  </p>
                </div>

                {/* Voleur 3 : L'eau salée sur les deltas */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-2 shadow-2xs">
                  <div className="text-blue-800 font-semibold text-sm flex items-center gap-1.5">
                    <span>🌊</span>
                    <span>3. Le sel des océans</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    Les terres les plus fertiles du monde sont les deltas des fleuves : le Nil en Égypte, le Gange au Bangladesh, le Mékong au Vietnam.
                  </p>
                  <p className="text-slate-500">
                    Quand la mer monte, l'eau salée s'infiltre dans les rizières. Or, le riz et le blé ne peuvent pas pousser dans l'eau salée !
                  </p>
                </div>
              </div>

              {/* Règle des 2100 kcal */}
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🥗</span>
                  <div className="text-slate-700">
                    <span className="font-semibold text-emerald-800">Le seuil vital de 2 100 kcal/jour :</span>{' '}
                    C'est la quantité minimale d'énergie qu'une personne doit manger chaque jour. Si la courbe verte passe sous cette ligne dans la simulation, c'est que la région entre en situation de malnutrition ou de famine.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONTENU DU THÈME 4 : DÉCRYPTAGE DES 4 GRAPHIQUES */}
          {activeTopic === 'charts' && (
            <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-5 flex flex-col gap-4 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
                  <LineChart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Comment lire les 4 graphiques sans mal de tête ?
                  </h3>
                  <p className="text-xs text-slate-500">
                    Chaque graphique raconte un morceau de la grande histoire du XXIe siècle
                  </p>
                </div>
              </div>

              {/* RAPPEL SUR L'AXE DES ABSCISSES X */}
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 text-xs text-sky-900 flex items-start gap-3">
                <span className="text-xl">👉</span>
                <div>
                  <span className="font-bold text-sky-950 uppercase tracking-wider text-[11px]">Règle d'or : L'axe du bas (X), c'est la ligne du temps !</span>
                  <p className="mt-1 text-slate-700 leading-relaxed">
                    Sur les graphiques, tu peux observer la ligne du temps prospective de <strong>2026 jusqu'à 2100 ou 2200</strong> (et même remonter dans l'histoire jusqu'en 1900 grâce au sélecteur d'époque). Le curseur qui avance montre l'année active que tu es en train d'explorer.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Graphique 1 */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col gap-1.5 shadow-2xs">
                  <span className="font-semibold text-purple-800 flex items-center gap-1.5">
                    <span>👥</span> 1. Démographie mondiale
                  </span>
                  <p className="text-slate-700">
                    <strong>Ligne noire/bleue :</strong> Combien d'humains vivent sur la Terre. En 2026, nous sommes 8,15 milliards.
                  </p>
                  <p className="text-slate-500">
                    <strong>Lignes rouge et ambre :</strong> Le nombre de décès dus aux canicules humides létales et au manque de nourriture.
                  </p>
                </div>

                {/* Graphique 2 */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col gap-1.5 shadow-2xs">
                  <span className="font-semibold text-amber-800 flex items-center gap-1.5">
                    <span>⚡</span> 2. L'énergie disponible
                  </span>
                  <p className="text-slate-700">
                    <strong>Ligne jaune :</strong> Le rendement de l'énergie (combien de barils on gagne pour 1 baril dépensé à forer).
                  </p>
                  <p className="text-slate-500">
                    <strong>Ligne verte :</strong> La part d'énergie qu'il nous reste pour faire rouler le monde (écoles, tracteurs, hôpitaux).
                  </p>
                </div>

                {/* Graphique 3 */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col gap-1.5 shadow-2xs">
                  <span className="font-semibold text-rose-800 flex items-center gap-1.5">
                    <span>🌡️</span> 3. Climat et Océans
                  </span>
                  <p className="text-slate-700">
                    <strong>Ligne rose :</strong> La température moyenne de surface de la Terre (+1,35°C aujourd'hui).
                  </p>
                  <p className="text-slate-500">
                    <strong>Ligne bleue pointillée :</strong> La montée du niveau de la mer (en centimètres).
                  </p>
                </div>

                {/* Graphique 4 */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col gap-1.5 shadow-2xs">
                  <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                    <span>🍞</span> 4. L'assiette mondiale
                  </span>
                  <p className="text-slate-700">
                    <strong>Ligne verte :</strong> Le nombre de calories moyennes par habitant et par jour.
                  </p>
                  <p className="text-slate-500">
                    <strong>Ligne rouge pointillée :</strong> La limite d'urgence de 2 100 kcal. En dessous, c'est la faim.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CONTENU DU THÈME 5 : POURQUOI CE N'EST PAS UNE FATALITÉ (SOLUTIONS) */}
          {activeTopic === 'future' && (
            <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-5 flex flex-col gap-4 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Pourquoi cette simulation n'est PAS une fatalité ?
                  </h3>
                  <p className="text-xs text-slate-500">
                    C'est un simulateur de vol pour apprendre à éviter les obstacles, pas une prédiction gravée dans la pierre !
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Solution 1 : Les villes fraîches */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-2 shadow-2xs">
                  <div className="text-emerald-700 font-semibold text-sm flex items-center gap-1.5">
                    <Trees className="w-4 h-4 text-emerald-600" />
                    <span>1. Végétaliser et ombrager</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    Planter des arbres dans les villes et végétaliser les toits permet de faire baisser la température ressentie de <strong>3 à 6°C</strong> grâce à l'ombre et à l'évaporation naturelle des feuilles !
                  </p>
                </div>

                {/* Solution 2 : L'isolation et la sobriété */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-2 shadow-2xs">
                  <div className="text-amber-800 font-semibold text-sm flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>2. Isoler les bâtiments</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    Une maison bien isolée avec des volets et des murs épais reste fraîche sans avoir besoin de climatiseurs électriques géants qui consomment beaucoup d'énergie.
                  </p>
                </div>

                {/* Solution 3 : L'agroécologie locale */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-2 shadow-2xs">
                  <div className="text-sky-800 font-semibold text-sm flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-sky-600" />
                    <span>3. Une agriculture résiliente</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    En diversifiant les plantes (sorgho, millet, légumineuses qui fabriquent leur propre engrais sans pétrole), on protège nos assiettes même quand le climat change.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-900">
                <strong>Le message de la science :</strong> Cette simulation calcule ce qui se passe si l'humanité continue exactement sur sa trajectoire actuelle sans s'adapter. Mais dès qu'on comprend les règles physiques, on a le pouvoir d'agir !
              </div>
            </div>
          )}

          {/* SECTION LUDIQUE : LE MINI-QUIZZ DU CLIMATOLOGUE */}
          <div className="bg-white rounded-xl border border-sky-200 p-4 sm:p-5 flex flex-col gap-4 shadow-xs">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-sky-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Mini-Défi : As-tu tout compris ? (3 questions chrono)
              </h3>
            </div>

            <div className="space-y-4">
              {QUIZ_QUESTIONS.map((q, qIdx) => {
                const selectedOpt = quizAnswers[qIdx];
                return (
                  <div key={qIdx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col gap-2 text-xs">
                    <p className="font-semibold text-slate-900 text-[13px]">
                      {qIdx + 1}. {q.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = selectedOpt === optIdx;
                        let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300';

                        if (selectedOpt !== undefined && selectedOpt !== null) {
                          if (opt.correct) {
                            btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold shadow-xs';
                          } else if (isChosen && !opt.correct) {
                            btnStyle = 'bg-rose-50 border-rose-500 text-rose-800 font-semibold shadow-xs';
                          } else {
                            btnStyle = 'bg-slate-100/70 border-slate-200 text-slate-400 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectAnswer(qIdx, optIdx)}
                            className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-start gap-2 cursor-pointer ${btnStyle}`}
                          >
                            <span className="font-mono font-bold text-slate-400 shrink-0">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            <span>{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explication après sélection */}
                    {selectedOpt !== undefined && selectedOpt !== null && (
                      <div
                        className={`mt-2 p-2.5 rounded-lg text-xs flex items-start gap-2 animate-fadeIn ${
                          q.options[selectedOpt].correct
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                            : 'bg-rose-50 border border-rose-200 text-rose-800'
                        }`}
                      >
                        {q.options[selectedOpt].correct ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="font-bold">
                            {q.options[selectedOpt].correct ? 'Bien joué ! ' : 'Pas tout à fait... '}
                          </span>
                          {q.options[selectedOpt].explanation}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
