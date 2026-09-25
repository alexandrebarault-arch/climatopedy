import React, { useState } from 'react';
import { Layers, Camera, Radio, Maximize2, X, Info } from 'lucide-react';

interface CausalChainVisualCardProps {
  stepIndex: number;
}

interface StepMeta {
  title: string;
  subtitle: string;
  metric: string;
  photoUrl: string;
  photoCaption: string;
  sourceCredit: string;
}

const STEP_DATA: Record<number, StepMeta> = {
  0: {
    title: 'Plateforme Pétrolière Offshore en Haute Mer',
    subtitle: 'Appareil de forage semi-submersible, derrick et tête de puits sous-marine',
    metric: '450 t d\'acier spécial API + 1 200 t de barytine par puits de 4 800 m',
    photoUrl: '/images/visuals/oil_rig.jpg',
    photoCaption: 'Plateforme pétrolière de forage hauturier (Minke Field, Mer du Nord) opérant en eaux profondes.',
    sourceCredit: 'Photographie documentaire haute définition - Mer du Nord'
  },
  1: {
    title: 'La Falaise du Rendement Énergétique & le Raffinage',
    subtitle: 'Colonnes de distillation fractionnée et vapocraqueurs pétroliers',
    metric: 'Autoconsommation : de 1% (1930) à 8,4% (2026), puis 25% (2050)',
    photoUrl: '/images/visuals/eroi_energy.jpg',
    photoCaption: 'Tour de distillation atmosphérique géante et unité de craquage catalytique d\'une raffinerie pétrolière.',
    sourceCredit: 'Unité industrielle de fractionnement d\'hydrocarbures'
  },
  2: {
    title: 'Complexe Chimique Haber-Bosch & Synthèse d\'Engrais',
    subtitle: 'Réformeur de méthane (CH₄) et réacteurs de synthèse sous 200 bars',
    metric: 'Alimente 50% de l\'humanité (4 milliards d\'humains)',
    photoUrl: '/images/visuals/chemical_plant.jpg',
    photoCaption: 'Complexe chimique de synthèse d\'ammoniac et d\'engrais azotés (ammonitrate, urée).',
    sourceCredit: 'Installation chimique de synthèse industrielle d\'ammoniac'
  },
  3: {
    title: 'La Mégamachine Thermique : Flotte Commerciale Mondiale',
    subtitle: 'Porte-conteneurs géants propulsés au fioul lourd (Heavy Fuel Oil)',
    metric: '105 000 navires marchands transportent 90% des flux physiques de la planète',
    photoUrl: '/images/visuals/cargo_ship.jpg',
    photoCaption: 'Porte-conteneurs océanique transcontinental acheminant des milliers de conteneurs de marchandises.',
    sourceCredit: 'Marine marchande mondiale et logistique intermodale'
  }
};

export const CausalChainVisualCard: React.FC<CausalChainVisualCardProps> = ({ stepIndex }) => {
  const [viewMode, setViewMode] = useState<'photo' | 'schematic'>('photo');
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const meta = STEP_DATA[stepIndex] || STEP_DATA[0];

  // ÉTAPE 0 : COUPE GÉOTECHNIQUE SOUS-MARINE
  const renderDrillingSchematic = () => (
    <svg viewBox="0 0 600 320" className="w-full h-full object-cover">
      <defs>
        <linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0369a1" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#075985" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="strataGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#292524" />
          <stop offset="100%" stopColor="#0c0a09" />
        </linearGradient>
        <linearGradient id="oilRes" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#451a03" />
          <stop offset="50%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>
      </defs>

      {/* Surface marine & plateforme */}
      <rect x="0" y="0" width="600" height="30" fill="#0b1322" />
      <rect x="240" y="6" width="120" height="18" fill="#f59e0b" rx="2" />
      <path d="M 285 8 L 297 -15 L 303 -15 L 315 8 Z" fill="none" stroke="#fbbf24" strokeWidth="2" />

      {/* Colonne d'eau océanique (2 500 m) */}
      <rect x="0" y="30" width="600" height="110" fill="url(#oceanGrad)" />
      <line x1="300" y1="24" x2="300" y2="140" stroke="#cbd5e1" strokeWidth="4" />

      {/* Bloc Obturateur sous-marin (BOP - 350 t, 700 bars) */}
      <rect x="284" y="132" width="32" height="22" fill="#dc2626" rx="2" />
      <text x="325" y="146" fill="#fca5a5" fontSize="10" fontFamily="monospace" fontWeight="bold">
        BOP Sous-marin (700 bars)
      </text>

      {/* Strates géologiques profondes */}
      <rect x="0" y="140" width="600" height="180" fill="url(#strataGrad)" />
      <ellipse cx="300" cy="285" rx="150" ry="22" fill="url(#oilRes)" stroke="#f59e0b" strokeWidth="1.5" />
      <text x="300" y="289" fill="#fde68a" fontSize="11" fontWeight="bold" textAnchor="middle">
        Gisement d'hydrocarbures (Grès poreux sous 4 800 m)
      </text>

      {/* Cuvelage et trépan */}
      <line x1="300" y1="154" x2="300" y2="280" stroke="#f59e0b" strokeWidth="3" />
      <circle cx="300" cy="280" r="5" fill="#38bdf8" />

      <text x="120" y="85" fill="#bae6fd" fontSize="10" fontFamily="monospace">Riser marin (2 500 m d'eau)</text>
      <text x="365" y="225" fill="#fde68a" fontSize="10" fontFamily="monospace">Cuvelages acier API Q125</text>
      <text x="415" y="283" fill="#7dd3fc" fontSize="10" fontFamily="monospace">Trépan PDC (Diamants synthétiques)</text>
    </svg>
  );

  // ÉTAPE 1 : FALAISE DE L'EROI
  const renderEroiSchematic = () => (
    <div className="h-full w-full p-5 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 items-center">
      <div className="p-3.5 rounded-lg bg-white border border-emerald-300 shadow-2xs space-y-2">
        <div className="flex justify-between items-center text-xs font-bold text-emerald-700">
          <span>1930 · Spindletop</span>
          <span className="font-mono text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">100:1</span>
        </div>
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div className="w-[99%] bg-emerald-500" />
          <div className="w-[1%] bg-rose-500" />
        </div>
        <p className="text-[11px] text-slate-700 leading-snug"><strong>99% d'énergie nette</strong> pour bâtir l'économie mondiale moderne.</p>
      </div>

      <div className="p-3.5 rounded-lg bg-white border border-sky-300 shadow-2xs space-y-2">
        <div className="flex justify-between items-center text-xs font-bold text-sky-700">
          <span>1970 · Mer du Nord</span>
          <span className="font-mono text-[10px] bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">35:1</span>
        </div>
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div className="w-[97%] bg-sky-500" />
          <div className="w-[3%] bg-rose-500" />
        </div>
        <p className="text-[11px] text-slate-700 leading-snug"><strong>97% net.</strong> Grandes plateformes océaniques très rentables.</p>
      </div>

      <div className="p-3.5 rounded-lg bg-white border border-amber-300 shadow-2xs space-y-2">
        <div className="flex justify-between items-center text-xs font-bold text-amber-800">
          <span>2026 · Schiste & Deepwater</span>
          <span className="font-mono text-[10px] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">12:1</span>
        </div>
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div className="w-[91.6%] bg-amber-500" />
          <div className="w-[8.4%] bg-rose-500" />
        </div>
        <p className="text-[11px] text-slate-700 leading-snug"><strong>8,4% de l'énergie</strong> consommée rien que pour forer et fracturer.</p>
      </div>

      <div className="p-3.5 rounded-lg bg-rose-50/60 border border-rose-300 shadow-2xs space-y-2">
        <div className="flex justify-between items-center text-xs font-bold text-rose-800">
          <span>2050 · Sables bitumineux</span>
          <span className="font-mono text-[10px] bg-rose-100 px-1.5 py-0.5 rounded border border-rose-200">4:1</span>
        </div>
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div className="w-[75%] bg-amber-500" />
          <div className="w-[25%] bg-rose-500" />
        </div>
        <p className="text-[11px] text-rose-900 leading-snug"><strong>25% réabsorbé :</strong> 1 baril sur 4 sert uniquement à extraire le suivant.</p>
      </div>
    </div>
  );

  // ÉTAPE 2 : HABER-BOSCH
  const renderHaberBoschSchematic = () => (
    <div className="h-full w-full p-5 bg-slate-50 flex flex-col justify-center">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-white border border-sky-200 shadow-2xs">
          <span className="text-[10px] font-mono text-sky-700 font-bold block">1. GAZ NATUREL</span>
          <span className="text-xs font-bold text-slate-800 mt-1 block">Méthane CH₄</span>
          <span className="text-[11px] text-slate-600 block mt-1">Four vaporeformeur à 850°C avec vapeur.</span>
        </div>
        <div className="p-3 rounded-lg bg-white border border-indigo-200 shadow-2xs">
          <span className="text-[10px] font-mono text-indigo-700 font-bold block">2. CAPTURE AZOTE</span>
          <span className="text-xs font-bold text-slate-800 mt-1 block">Air N₂ (-196°C)</span>
          <span className="text-[11px] text-slate-600 block mt-1">Distillation cryogénique de l'atmosphère.</span>
        </div>
        <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-300 shadow-2xs">
          <span className="text-[10px] font-mono text-amber-800 font-bold block">3. HAUTE PRESSION</span>
          <span className="text-xs font-bold text-amber-900 mt-1 block">Haber-Bosch (200 bars)</span>
          <span className="text-[11px] text-slate-700 block mt-1">450°C sur lit catalytique de fer magnétite.</span>
        </div>
        <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-300 shadow-2xs">
          <span className="text-[10px] font-mono text-emerald-800 font-bold block">4. ALIMENTATION</span>
          <span className="text-xs font-bold text-emerald-900 mt-1 block">≈40% de la population</span>
          <span className="text-[11px] text-slate-700 block mt-1">Smil (2001) : env. 40% dépendaient de l'azote de synthèse (estimation pour 2000).</span>
        </div>
      </div>
    </div>
  );

  // ÉTAPE 3 : MÉGAMACHINE
  const renderMegamachineSchematic = () => (
    <div className="h-full w-full p-5 bg-slate-50 grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-center">
      <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-slate-800">
          <span>Parc Automobile</span>
          <span className="font-mono text-sky-700 font-bold">1,4 Milliard</span>
        </div>
        <p className="text-[11px] text-slate-600">Véhicules thermiques en service. Renouvellement physique planétaire : 18 à 22 ans.</p>
      </div>

      <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-slate-800">
          <span>Marine Marchande</span>
          <span className="font-mono text-amber-800 font-bold">105 000 navires</span>
        </div>
        <p className="text-[11px] text-slate-600">Transportent 90% des biens matériels mondiaux avec du fioul lourd non électrifiable.</p>
      </div>

      <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-slate-800">
          <span>Centrales Thermiques</span>
          <span className="font-mono text-rose-700 font-bold">26 000 unités</span>
        </div>
        <p className="text-[11px] text-slate-600">Actifs engagés pour 35 à 45 ans pour rentabiliser les investissements bancaires.</p>
      </div>
    </div>
  );

  const renderSchematic = () => {
    switch (stepIndex) {
      case 0:
        return renderDrillingSchematic();
      case 1:
        return renderEroiSchematic();
      case 2:
        return renderHaberBoschSchematic();
      case 3:
        return renderMegamachineSchematic();
      default:
        return renderDrillingSchematic();
    }
  };

  return (
    <>
      <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs group flex flex-col transition-all duration-300">
        {/* En-tête de la carte avec Titre & Sélecteur d'affichage */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <span className="text-xs font-mono font-bold text-amber-900 uppercase tracking-wide truncate">
              {meta.title}
            </span>
          </div>

          {/* Boutons de bascule Photo Réelle / Schéma */}
          <div className="flex rounded-lg p-0.5 bg-slate-100 border border-slate-200 text-xs font-mono shrink-0">
            <button
              onClick={() => setViewMode('photo')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'photo'
                  ? 'bg-white text-slate-800 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
              title="Voir la photographie documentaire haute définition"
            >
              <Camera className="w-3.5 h-3.5 text-sky-600" />
              <span>Photo Réelle</span>
            </button>
            <button
              onClick={() => setViewMode('schematic')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'schematic'
                  ? 'bg-white text-slate-800 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
              title="Voir la coupe technique ou géotechnique"
            >
              <Layers className="w-3.5 h-3.5 text-sky-600" />
              <span>Schéma d'Ingénierie</span>
            </button>
          </div>
        </div>

        {/* Zone Principale d'Affichage Visuel (hauteur optimisée 280-320px) */}
        <div className="relative h-64 sm:h-76 md:h-80 w-full overflow-hidden bg-slate-950 flex items-center justify-center">
          {viewMode === 'photo' ? (
            <div className="relative w-full h-full cursor-pointer group/img" onClick={() => setIsZoomed(true)}>
              <img
                src={meta.photoUrl}
                alt={meta.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover/img:scale-103"
                loading="eager"
              />

              {/* Bouton d'agrandissement en haut à droite */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(true);
                }}
                className="absolute top-3 right-3 p-2 rounded-lg bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all shadow-lg hover:scale-105"
                title="Agrandir l'image en plein écran"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Légende en bas de l'image avec fond semi-transparent sobre */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-6 flex items-end justify-between">
                <p className="text-xs text-slate-200 font-medium max-w-[85%] leading-snug drop-shadow-md">
                  📸 {meta.photoCaption}
                </p>
                <span className="text-[10px] font-mono text-amber-300/90 hidden sm:inline-block shrink-0 ml-2 bg-black/60 px-2 py-0.5 rounded border border-amber-500/30">
                  Plein écran ⤢
                </span>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              {renderSchematic()}
              {/* Grillage discret */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#38bdf808_1px,transparent_1px),linear-gradient(to_bottom,#38bdf808_1px,transparent_1px)] bg-[size:24px_24px]" />
            </div>
          )}
        </div>

        {/* Barre de métrologie et d'ordre de grandeur en pied de carte */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <span className="text-slate-700">
            ⚙️ Grandeur physique : <strong className="text-amber-800">{meta.metric}</strong>
          </span>
          <span className="text-[11px] text-slate-500">
            {meta.subtitle}
          </span>
        </div>
      </div>

      {/* Modal / Lightbox plein écran pour examiner l'image HD en détail */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setIsZoomed(false)}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 max-w-5xl mx-auto w-full">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                {meta.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{meta.sourceCredit}</p>
            </div>
            <button
              onClick={() => setIsZoomed(false)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div
            className="flex-1 max-w-5xl mx-auto w-full flex items-center justify-center overflow-hidden rounded-xl border border-slate-800 bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={meta.photoUrl}
              alt={meta.title}
              className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
            />
          </div>

          <div className="max-w-5xl mx-auto w-full pt-3 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>{meta.photoCaption}</span>
            <span className="text-amber-400 font-bold">{meta.metric}</span>
          </div>
        </div>
      )}
    </>
  );
};
