import React, { useState } from 'react';
import { Wrench, Zap, Sprout, Anchor, Layers, Fuel, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';
import { CausalChainVisualCard } from './CausalChainVisualCard';

export const CausalChainExplorer: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      id: 'drilling',
      title: '1. L\'Appareil de Forage & Métallurgie Lourde',
      subtitle: 'Comment fore-t-on concrètement ? De la barytine aux diamants PDC.',
      icon: Wrench,
      badge: 'Génie Minier & Matériaux'
    },
    {
      id: 'eroi_cliff',
      title: '2. La Falaise de l\'EROI & l\'Autophagie',
      subtitle: 'L\'équation biophysique : quand le forage dévore sa propre énergie.',
      icon: Zap,
      badge: 'Thermodynamique Industrielle'
    },
    {
      id: 'haber_bosch',
      title: '3. Du Gaz aux Champs : Haber-Bosch',
      subtitle: '50% des protéines humaines dépendent de la synthèse de l\'ammoniac.',
      icon: Sprout,
      badge: 'Chimie & Sécurité Alimentaire'
    },
    {
      id: 'societal_inertia',
      title: '4. Le Piège de l\'Inertie Sociétale',
      subtitle: 'Pourquoi l\'humanité est incapable de freiner sa dissipation d\'énergie.',
      icon: Anchor,
      badge: 'Dynamique des Systèmes'
    }
  ];

  return (
    <div className="w-full rounded-xl bg-white border border-slate-200 p-6 shadow-xs flex flex-col gap-6">
      {/* En-tête de l'enquête */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase">
            Enquête Technique Approfondie
          </span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-600">
            Traçabilité physique exhaustive : des entrailles de la Terre à l'assiette humaine
          </span>
        </div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
          La Chaîne de Dépendance Mécanique : Forer, Transformer, Nourrir, S'effondrer
        </h2>
        <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
          « Si on veut du pétrole, faut forer. On fore avec quoi ? Comment l'a-t-on conçu ? » 
          Cette enquête démonte le mythe de l'énergie dématérialisée en reconstituant l'intégralité des flux 
          de métaux rares, de synthèses chimiques haute pression et de rétroactions thermodynamiques.
        </p>
      </div>

      {/* Navigation entre les 4 étapes de l'enquête */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeStep === idx;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                isActive
                  ? 'bg-sky-50 border-sky-400 shadow-xs ring-2 ring-sky-200 text-slate-800'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`p-1.5 rounded ${isActive ? 'bg-sky-100 text-sky-700' : 'bg-white text-slate-500 border border-slate-200'}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
                  {step.badge}
                </span>
              </div>
              <div>
                <span className="font-semibold text-xs block text-slate-800">
                  {step.title}
                </span>
                <span className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {step.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* CONTENU DÉTAILLÉ DE L'ÉTAPE SÉLECTIONNÉE */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-6 text-slate-700 text-xs leading-relaxed shadow-xs">
        {/* Visualisation Technique & Coupe Réaliste Simulée */}
        <CausalChainVisualCard stepIndex={activeStep} />
        {/* ÉTAPE 1 : ANATOMIE DU FORAGE PÉTROLIER */}
        {activeStep === 0 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                  <Wrench className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Sous le derrick : L'extrême densité capitalistique du forage pétrolier
                  </h3>
                  <span className="text-slate-500 text-xs">
                    Pourquoi une pénurie d'alliages spéciaux ou de minéraux arrête immédiatement les puits
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Carte 1 : Les Casings en acier API Q125 */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-sky-800 font-semibold">
                  <Layers className="w-4 h-4 text-sky-600" />
                  <span>1. Cuvelages &amp; Tubages API</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Un puits de 5 000 m nécessite 300 à 600 tonnes de tubes d'acier allié sans soudure 
                  (Grades API L80, P110, Q125).
                </p>
                <div className="bg-white p-2.5 rounded border border-slate-200 space-y-1 text-[11px] shadow-2xs">
                  <span className="text-slate-800 font-mono font-semibold block">Intrants métallurgiques critiques :</span>
                  <span className="block text-slate-600">• Minerai de fer à &gt;62% Fe + Coke sidérurgique</span>
                  <span className="block text-slate-600">• Chrome, Nickel, Molybdène (anti-corrosion H₂S et CO₂)</span>
                  <span className="block text-slate-600">• Laminoirs à chaud géants et trempe thermique</span>
                </div>
              </div>

              {/* Carte 2 : Les Trépans PDC au diamant */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-semibold">
                  <Cpu className="w-4 h-4 text-amber-600" />
                  <span>2. Trépans PDC (Diamant Synthétique)</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Broyer le granite et le schiste profond à 250°C nécessite des taillants en diamant polycristallin compact (PDC).
                </p>
                <div className="bg-white p-2.5 rounded border border-slate-200 space-y-1 text-[11px] shadow-2xs">
                  <span className="text-slate-800 font-mono font-semibold block">Procédé de fabrication extrême :</span>
                  <span className="block text-slate-600">• Presses isostatiques à &gt;1 400°C et &gt;5 GPa de pression</span>
                  <span className="block text-slate-600">• Substrat en carbure de tungstène fritté</span>
                  <span className="block text-slate-600">• Liant cobalt extrait de filières minières concentrées</span>
                </div>
              </div>

              {/* Carte 3 : Les Fluides de Forage (Boues lourdes) */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                  <Fuel className="w-4 h-4 text-emerald-600" />
                  <span>3. Boue Thixotrope &amp; Anti-Éruption</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  La boue est pompée en continu par des pompes triplex mues par diesel lourd pour refroidir l'outil et équilibrer la pression géologique.
                </p>
                <div className="bg-white p-2.5 rounded border border-slate-200 space-y-1 text-[11px] shadow-2xs">
                  <span className="text-slate-800 font-mono font-semibold block">Intrants chimiques dédiés :</span>
                  <span className="block text-slate-600">• Barytine (BaSO₄) broyée pour alourdir le fluide</span>
                  <span className="block text-slate-600">• Bentonite sodique (argile thixotrope gonflante)</span>
                  <span className="block text-slate-600">• Polymères de synthèse dérivés du naphta pétrochimique</span>
                </div>
              </div>
            </div>

            {/* Encadré de conclusion causale */}
            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-lg text-amber-900 text-xs">
              <span className="font-bold text-amber-900 block mb-1">
                La boucle causale fermée :
              </span>
              Pour forer le pétrole de demain, il faut consommer l'acier, le diamant synthétique, les minéraux rares et les carburants 
              produits par le pétrole d'hier. Lorsque l'un quelconque de ces maillons logistiques mondiaux se fragmente, 
              le forage s'arrête net, indépendamment du cours du baril ou de la volonté des investisseurs financiers.
            </div>
          </div>
        )}

        {/* ÉTAPE 2 : LA FALAISE DE L'EROI */}
        {activeStep === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                  <Zap className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    La Falaise de l'EROI (Net Energy Cliff) &amp; Le Cannibalisme Industriel
                  </h3>
                  <span className="text-slate-500 text-xs">
                    Comprendre la relation non-linéaire : E_net = E_brute · (1 - 1/EROI)
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <p>
                  L'EROI (Energy Return on Energy Invested) quantifie le nombre d'unités d'énergie restituées 
                  par une ressource pour chaque unité d'énergie dépensée pour son exploration, son forage, 
                  son extraction et son raffinage.
                </p>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5 font-mono text-xs">
                  <span className="text-amber-800 font-bold block">
                    Formule de l'Énergie Nette disponible :
                  </span>
                  <span className="text-slate-800 block bg-white p-2 rounded border border-slate-200 shadow-2xs font-semibold">
                    E_net(t) = E_gross(t) · [ 1 - 1 / EROI(t) ]
                  </span>
                  <span className="text-slate-500 text-[11px] block mt-1">
                    Déplétion géologique : EROI(t) = EROI₀ · (1 - Q(t) / Q_inf)^1.35
                  </span>
                </div>
              </div>

              {/* Tableau comparatif des époques de l'EROI */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
                <table className="w-full text-[11px] text-left">
                  <thead className="bg-slate-50 text-slate-600 font-mono border-b border-slate-200">
                    <tr>
                      <th className="p-2">Époque / Ressource</th>
                      <th className="p-2">EROI moyen</th>
                      <th className="p-2">% Autoconsommé</th>
                      <th className="p-2 text-right">% Net pour la Société</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                    <tr>
                      <td className="p-2 font-sans font-medium text-slate-800">Texas 1930 (Spindletop)</td>
                      <td className="p-2 text-emerald-700 font-bold">100 : 1</td>
                      <td className="p-2 text-slate-500">1.0%</td>
                      <td className="p-2 text-emerald-700 font-bold text-right">99.0%</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-sans font-medium text-slate-800">Arabie 1970 (Ghawar)</td>
                      <td className="p-2 text-emerald-700 font-bold">35 : 1</td>
                      <td className="p-2 text-slate-500">2.8%</td>
                      <td className="p-2 text-emerald-700 font-bold text-right">97.2%</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-sans font-medium text-slate-800">Moyenne Mondiale 2026</td>
                      <td className="p-2 text-amber-800 font-bold">16 : 1</td>
                      <td className="p-2 text-slate-500">6.2%</td>
                      <td className="p-2 text-amber-800 font-bold text-right">93.8%</td>
                    </tr>
                    <tr className="bg-rose-50/40">
                      <td className="p-2 font-sans font-medium text-rose-800">Offshore Profond 2045</td>
                      <td className="p-2 text-rose-700 font-bold">8 : 1</td>
                      <td className="p-2 text-rose-700">12.5%</td>
                      <td className="p-2 text-rose-700 font-bold text-right">87.5%</td>
                    </tr>
                    <tr className="bg-rose-50/70">
                      <td className="p-2 font-sans font-medium text-rose-800">Sables Bitumineux / Schiste 2060</td>
                      <td className="p-2 text-rose-700 font-bold">4 : 1</td>
                      <td className="p-2 text-rose-700">25.0%</td>
                      <td className="p-2 text-rose-700 font-bold text-right">75.0%</td>
                    </tr>
                    <tr className="bg-rose-100/70 font-bold">
                      <td className="p-2 font-sans text-rose-900">Seuil de Cannibalisme 2075</td>
                      <td className="p-2 text-rose-800">2 : 1</td>
                      <td className="p-2 text-rose-800">50.0%</td>
                      <td className="p-2 text-rose-800 text-right">50.0%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-slate-700 text-xs shadow-2xs">
              <span className="font-semibold text-slate-800 block mb-1">
                L'Effet de la Falaise (The Net Energy Cliff) :
              </span>
              Tant que l'EROI reste supérieur à 20:1, l'impact de son érosion est presque imperceptible pour l'économie.
              Mais dès que le ratio s'enfonce sous 10:1 puis 5:1, l'énergie nette disponible pour les hôpitaux, les écoles, 
              les usines civiles et l'assainissement s'effondre de façon vertigineuse. Le secteur énergétique est contraint 
              d'absorber une part écrasante du PIB pour simplement maintenir le flux de barils en surface.
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : HABER-BOSCH & AGRICULTURE */}
        {activeStep === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Sprout className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Du Gaz Fossile aux Champs : Le Procédé Haber-Bosch
                  </h3>
                  <span className="text-slate-500 text-xs">
                    50% de l'azote de nos corps provient directement de la catalyse du gaz naturel
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                <span className="text-sky-800 font-semibold block">1. Reformage du Méthane (CH₄)</span>
                <p className="text-slate-600 text-[11px]">
                  Le gaz naturel n'est pas seulement un combustible : il fournit l'atome d'hydrogène (H₂) indispensable 
                  par vapo-reformage catalytique à 800°C.
                </p>
                <span className="font-mono text-[10px] text-slate-800 block bg-white p-2 rounded border border-slate-200 shadow-2xs font-semibold">
                  CH₄ + H₂O ➔ CO + 3 H₂
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                <span className="text-amber-900 font-semibold block">2. Synthèse Haute Pression</span>
                <p className="text-slate-600 text-[11px]">
                  Pour casser la triple liaison N≡N de l'azote de l'air, il faut comprimer le gaz à 200 bars (20 MPa) 
                  et chauffer à 450°C sur des catalyseurs au fer enrichi.
                </p>
                <span className="font-mono text-[10px] text-slate-800 block bg-white p-2 rounded border border-slate-200 shadow-2xs font-semibold">
                  N₂ + 3 H₂ ➔ 2 NH₃ (Ammoniac)
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                <span className="text-emerald-800 font-semibold block">3. Engrais &amp; Rendements x3</span>
                <p className="text-slate-600 text-[11px]">
                  L'ammoniac est transformé en nitrate d'ammonium et urée. Sans ces engrais, les rendements mondiaux 
                  du blé et du maïs chutent immédiatement de 60 à 70%.
                </p>
                <span className="font-mono text-[10px] text-slate-800 block bg-white p-2 rounded border border-slate-200 shadow-2xs font-semibold">
                  Socle agraire naturel : ~1.2 t/ha vs ~7.5 t/ha avec engrais
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
              <span className="font-semibold text-slate-800 text-xs block">
                L'Effet Ciseau Alimentaire Modélisé (Zhao et al. 2017 + Énergie Nette) :
              </span>
              <p className="text-slate-700 text-xs">
                Dans notre moteur biophysique, la production agricole mondiale subit simultanément deux chocs destructeurs non linéaires :
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] pt-1">
                <div className="bg-rose-50 p-2.5 rounded border border-rose-200 text-rose-900">
                  <span className="font-bold text-rose-800 block mb-0.5">Le Choc Thermique (Zhao et al. 2017) :</span>
                  Pour chaque degré de réchauffement local supplémentaire, les rendements s'érodent mécaniquement : 
                  Maïs (-7.4%/°C), Blé (-6.0%/°C), Riz (-3.2%/°C), Soja (-3.1%/°C) par échaudage thermique et avortement floral.
                </div>
                <div className="bg-amber-50 p-2.5 rounded border border-amber-200 text-amber-900">
                  <span className="font-bold text-amber-800 block mb-0.5">Le Choc d'Intrants Industriels :</span>
                  Lorsque l'EROI chute et que le gaz se raréfie, l'approvisionnement en engrais azotés synthétiques 
                  et en carburant pour les tracteurs s'amenuise, forçant les rendements vers le seuil agraire préindustriel.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 4 : L'INERTIE SOCIÉTALE */}
        {activeStep === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
                  <Anchor className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Le Verrou de l'Inertie Sociétale &amp; Le Super-Organisme
                  </h3>
                  <span className="text-slate-500 text-xs">
                    Pourquoi l'humanité ne peut freiner volontairement : l'hypothèse de rigidité absolue du brief
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                <span className="text-purple-800 font-semibold block">1. L'Inertie du Capital Physique</span>
                <p className="text-slate-600 text-[11px]">
                  Les centrales électriques, les raffineries, les navires vraquiers et les réseaux routiers sont 
                  conçus pour être amortis sur 30 à 50 ans. Déclasser ce capital avant terme déclenche une faillite bancaire immédiate.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                <span className="text-rose-800 font-semibold block">2. Le Dilemme des Prisonniers</span>
                <p className="text-slate-600 text-[11px]">
                  Toute nation qui restreindrait volontairement son extraction ou sa consommation d'énergie 
                  se verrait instantanément marginalisée militairement et économiquement par ses rivaux géopolitiques.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                <span className="text-amber-800 font-semibold block">3. La Dette comme Gage d'Énergie</span>
                <p className="text-slate-600 text-[11px]">
                  Le système financier mondial repose sur 300 000 milliards de dollars de dettes qui ne peuvent être 
                  honorées que par une croissance continue des flux physiques dissipés. L'arrêt équivaut à l'implosion monétaire.
                </p>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg text-purple-900 text-xs">
              <span className="font-bold text-purple-900 block mb-1">
                La conclusion biophysique :
              </span>
              Conformément à l'hypothèse du brief, l'humanité n'est pas dotée d'un pilote central capable de prescrire 
              la sobriété globale. Elle se comporte comme un super-organisme thermodynamique dissipatif gouverné 
              par le principe de puissance maximale de Lotka-Odum : tant qu'une ressource concentrée existe, le système la dissipera 
              jusqu'à rencontrer les limites physiques de la planète (chaleur létale, falaise d'EROI et famines).
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
