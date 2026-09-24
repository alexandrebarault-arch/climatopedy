import React, { useState } from 'react';
import { Radio, Layers, Camera, Maximize2, X } from 'lucide-react';

interface TippingPointVisualCardProps {
  elementId: string;
  elementName: string;
  isTipped?: boolean;
  isUncertain?: boolean;
  compact?: boolean;
}

interface SatelliteData {
  sensor: string;
  coords: string;
  elevationOrDepth: string;
  spectrum: string;
  keyFeature: string;
  stressMetric: string;
  realPhotoUrl: string;
  photoCredit: string;
}

const VISUAL_METADATA: Record<string, SatelliteData> = {
  greenland: {
    sensor: 'NASA Terra/Aqua & Sentinel-3 OLCI',
    coords: "72°15'N 40°20'W",
    elevationOrDepth: '2 150 m alt.',
    spectrum: 'Albédo multispectral & Gravimétrie GRACE-FO',
    keyFeature: 'Lacs supraglaciaires d\'eau de fonte & bédières',
    stressMetric: '-270 Gt/an de glace perdue dans l\'océan',
    realPhotoUrl: '/images/visuals/greenland_ice.jpg',
    photoCredit: 'Observation aérienne NASA - Lacs de fonte supraglaciaires de l\'inlandsis'
  },
  wais: {
    sensor: 'CryoSat-2 SARIn & ICESat-2 Altimetry',
    coords: "75°06'S 106°45'W (Glacier Thwaites)",
    elevationOrDepth: '-850 m socle rocheux sous le niveau marin',
    spectrum: 'Radar altimétrique subglaciaire',
    keyFeature: 'Plateforme de glace tabulaire & ligne d\'échouage',
    stressMetric: 'Recul de la ligne d\'échouage : ~1 km/an',
    realPhotoUrl: '/images/visuals/antarctic_shelf.jpg',
    photoCredit: 'Fracture majeure de la plateforme de glace en Antarctique occidental'
  },
  corals: {
    sensor: 'NOAA Coral Reef Watch & Sentinel-2',
    coords: "18°17'S 147°42'E (Grande Barrière)",
    elevationOrDepth: '-12 m profondeur lagon',
    spectrum: 'Infrarouge thermique SST & Réflectance',
    keyFeature: 'Récif corallien tropical Indo-Pacifique',
    stressMetric: '54% des récifs mondiaux soumis au stress thermique mortel',
    realPhotoUrl: '/images/visuals/coral_reef.jpg',
    photoCredit: 'Photographie sous-marine - Écosystème corallien menacé par la canicule marine'
  },
  permafrost: {
    sensor: 'Landsat-9 SWIR & InSAR Sentinel-1',
    coords: "67°29'N 133°48'E (Cratère de Batagaika)",
    elevationOrDepth: '320 m alt. (Sols gelés pléistocènes)',
    spectrum: 'InSAR Subsidence & Détection CH₄',
    keyFeature: 'Méga-effondrement thermokarstique arctique',
    stressMetric: '+0.3°C/décennie à 10 m de profondeur',
    realPhotoUrl: '/images/visuals/permafrost_thaw.jpg',
    photoCredit: 'Cratère d\'effondrement de Batagaika (Sibérie) par dégel du pergélisol'
  },
  arctic_summer_ice: {
    sensor: 'AMSR2 & DMSP SSMIS Passive Microwave',
    coords: "84°30'N 15°00'E (Bassin Arctique)",
    elevationOrDepth: 'Niveau 0 m (Océan Arctique)',
    spectrum: 'Micro-ondes passives tout-temps',
    keyFeature: 'Banquise pérenne fragmentée & chenaux d\'eau libre',
    stressMetric: '-12.6% de surface par décennie en septembre',
    realPhotoUrl: '/images/visuals/sea_ice.jpg',
    photoCredit: 'Banquise polaire fracturée et chenaux d\'eau libre en été arctique'
  },
  amoc: {
    sensor: 'Copernicus CMEMS & RAPID Array (26°N)',
    coords: "55°00'N 35°00'W (Gyre Subpolaire)",
    elevationOrDepth: '0 à -3 200 m (Convection thermohaline)',
    spectrum: 'Courantométrie Doppler & Flotteurs Argo',
    keyFeature: 'Mer du Labrador & anomalie froide de surface',
    stressMetric: 'Ralentissement estimé ~15% depuis le milieu du XXe siècle',
    realPhotoUrl: '/images/visuals/amoc_sea.jpg',
    photoCredit: 'Océan Atlantique Nord subpolaire et zone de plongée d\'eau dense'
  },
  amazon: {
    sensor: 'Sentinel-1 SAR C-Band & MODIS NDVI',
    coords: "03°08'S 60°01'W (Bassin Central de l'Amazone)",
    elevationOrDepth: '45 m alt. (Canopée dense 35 m)',
    spectrum: 'Indice foliaire NDVI & Teneur en eau de la canopée',
    keyFeature: 'Fleuves volants & méandres hydrologiques',
    stressMetric: '17% déboisé (seuil critique de savanisation : 20-25%)',
    realPhotoUrl: '/images/visuals/amazon_rainforest.jpg',
    photoCredit: 'Vue aérienne de la canopée tropicale et du réseau hydrographique amazonien'
  },
  boreal: {
    sensor: 'MODIS Thermal Active Fire & VIIRS',
    coords: "61°15'N 115°45'W (Taïga)",
    elevationOrDepth: '280 m alt.',
    spectrum: 'Infrarouge thermique & Indice NBR',
    keyFeature: 'Taïga boréale à mélèzes et épicéas',
    stressMetric: '18 millions ha de forêt boréale brûlés en une saison record',
    realPhotoUrl: '/images/visuals/boreal_taiga.jpg',
    photoCredit: 'Écosystème de taïga boréale soumis aux sécheresses et méga-incendies'
  },
  barents: {
    sensor: 'CryoSat-2 & Sentinel-3 SLSTR',
    coords: "74°30'N 37°00'E (Mer de Barents)",
    elevationOrDepth: '-230 m (Plateau continental)',
    spectrum: 'Température de surface SST & Flux thermique',
    keyFeature: 'Atlantification & perte de stratification polaire',
    stressMetric: 'Réchauffement régional x4 plus rapide que la moyenne mondiale',
    realPhotoUrl: '/images/visuals/sea_ice.jpg',
    photoCredit: 'Front de glace et banquise en Mer de Barents en recul accéléré'
  }
};

export const TippingPointVisualCard: React.FC<TippingPointVisualCardProps> = ({
  elementId,
  elementName,
  isTipped = false,
  isUncertain = false,
  compact = false
}) => {
  const [displayMode, setDisplayMode] = useState<'photo' | 'schematic'>('photo');
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const meta = VISUAL_METADATA[elementId] || {
    sensor: 'Sentinel Earth Observation',
    coords: "00°00'N 00°00'E",
    elevationOrDepth: 'Surface',
    spectrum: 'Observation multispectrale',
    keyFeature: 'Zone biophysique critique',
    stressMetric: 'Suivi par télédétection orbitale',
    realPhotoUrl: '/images/visuals/sea_ice.jpg',
    photoCredit: 'Observation satellite système Terre'
  };

  const renderSchematicSvg = () => {
    switch (elementId) {
      case 'greenland':
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="iceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f1f5f9" />
                <stop offset="50%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
              <radialGradient id="lakeGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="70%" stopColor="#0369a1" />
                <stop offset="100%" stopColor="#082f49" />
              </radialGradient>
            </defs>
            <rect width="400" height="240" fill="#040814" />
            <path d="M 20 40 Q 70 80 50 140 T 30 230 L 0 240 L 0 0 L 50 0 Z" fill="#1e293b" opacity="0.8" />
            <path d="M 370 20 Q 340 90 360 160 T 390 240 L 400 240 L 400 0 Z" fill="#1e293b" opacity="0.8" />
            <path d="M 50 160 C 90 60 180 30 260 35 C 320 40 360 90 350 170 C 330 210 290 225 200 220 C 110 215 65 200 50 160 Z" fill="url(#iceGrad)" />
            <ellipse cx="160" cy="115" rx="16" ry="8" fill="url(#lakeGrad)" stroke="#38bdf8" strokeWidth="1" />
            <ellipse cx="235" cy="125" rx="20" ry="10" fill="url(#lakeGrad)" stroke="#38bdf8" strokeWidth="1" />
            <ellipse cx="195" cy="155" rx="13" ry="6" fill="url(#lakeGrad)" stroke="#38bdf8" strokeWidth="1" />
            <path d="M 170 118 Q 185 130 195 155 T 215 205" fill="none" stroke="#0ea5e9" strokeWidth="2" />
            <text x="140" y="185" fill="#0f172a" fontSize="11" fontFamily="sans-serif" fontWeight="bold">Lacs supraglaciaires & moulins</text>
          </svg>
        );

      case 'wais':
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
            <rect width="400" height="240" fill="#060913" />
            <path d="M 0 240 L 0 180 Q 150 200 280 225 L 400 240 Z" fill="#1f2937" />
            <path d="M 0 60 L 170 60 L 190 180 L 0 180 Z" fill="#cbd5e1" stroke="#94a3b8" />
            <path d="M 170 60 C 230 65 300 75 350 85 L 350 150 C 290 145 230 150 190 180 Z" fill="#94a3b8" opacity="0.85" />
            <circle cx="190" cy="180" r="5" fill="#facc15" />
            <path d="M 400 195 C 320 190 250 185 190 182" fill="none" stroke="#ef4444" strokeWidth="3.5" strokeDasharray="4 3" />
            <text x="180" y="170" fill="#facc15" fontSize="11" fontFamily="monospace" fontWeight="bold">Ligne d'échouage</text>
            <text x="240" y="210" fill="#f87171" fontSize="10" fontFamily="sans-serif">Eau tiède circumpolaire intrusive</text>
          </svg>
        );

      case 'corals':
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="reefW" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0891b2" />
                <stop offset="100%" stopColor="#042f2e" />
              </linearGradient>
            </defs>
            <rect width="400" height="240" fill="url(#reefW)" />
            <path d="M 20 200 C 25 150 50 130 70 165 C 80 145 100 140 110 170 C 130 150 145 160 150 200 Z" fill="#ec4899" />
            <path d="M 60 205 C 70 175 95 160 115 180 C 125 165 140 165 145 205 Z" fill="#10b981" />
            <path d="M 180 205 C 190 165 215 150 235 175 C 245 155 260 160 265 205 Z" fill="#e2e8f0" stroke="#cbd5e1" />
            <path d="M 260 205 C 270 155 305 140 325 165 C 335 145 360 150 365 205 Z" fill="#f8fafc" stroke="#e2e8f0" />
            <line x1="170" y1="30" x2="170" y2="210" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="30" y="45" fill="#34d399" fontSize="11" fontWeight="bold">Sain (&lt; 28.5°C)</text>
            <text x="185" y="45" fill="#fda4af" fontSize="11" fontWeight="bold">Blanchissement mortel (&gt; 30°C)</text>
          </svg>
        );

      case 'amazon':
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
            <rect width="400" height="240" fill="#064e3b" />
            <path d="M 140 240 C 180 170 250 130 400 120 L 400 240 Z" fill="#78350f" opacity="0.9" />
            <path d="M 0 140 Q 70 90 130 120 T 240 80 T 330 100 T 400 50" fill="none" stroke="#0284c7" strokeWidth="12" />
            <circle cx="270" cy="160" r="5" fill="#ef4444" />
            <circle cx="340" cy="180" r="5" fill="#ef4444" />
            <text x="210" y="195" fill="#fef3c7" fontSize="11" fontWeight="bold">Front de Savanisation</text>
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
            <rect width="400" height="240" fill="#080e1a" />
            <circle cx="200" cy="120" r="80" fill="#0284c7" opacity="0.3" filter="blur(14px)" />
            <text x="120" y="125" fill="#38bdf8" fontSize="12" fontFamily="monospace">Coupe télémétrique orbitale active</text>
          </svg>
        );
    }
  };

  return (
    <>
      <div className={`relative rounded-xl overflow-hidden border border-slate-700/80 bg-[#090d16] shadow-2xl group flex flex-col transition-all duration-300 ${compact ? 'h-52 sm:h-60' : 'h-72 sm:h-80'}`}>
        {/* En-tête de la carte avec Satellite & Sélecteur */}
        <div className="px-3.5 py-2 bg-[#0c1220] border-b border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wide truncate">
              {meta.sensor}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-black/60 border border-slate-800 text-[10px] font-mono text-slate-300">
              {meta.coords}
            </span>

            {/* Bascule Photo / Schéma */}
            <div className="flex rounded-lg p-0.5 bg-black/70 border border-slate-700 text-xs font-mono">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDisplayMode('photo');
                }}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  displayMode === 'photo'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Voir la photographie réelle HD du lieu"
              >
                <Camera className="w-3 h-3" />
                <span>Photo</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDisplayMode('schematic');
                }}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  displayMode === 'schematic'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Voir la coupe biophysique schématique"
              >
                <Layers className="w-3 h-3" />
                <span>Schéma</span>
              </button>
            </div>
          </div>
        </div>

        {/* Zone Principale d'Affichage Visuel */}
        <div className="relative flex-1 w-full overflow-hidden bg-black flex items-center justify-center">
          {displayMode === 'photo' ? (
            <div
              className="relative w-full h-full cursor-pointer group/photo"
              onClick={() => setIsZoomed(true)}
            >
              <img
                src={meta.realPhotoUrl}
                alt={`${elementName} - vue réelle documentaire`}
                className="w-full h-full object-cover object-center group-hover/photo:scale-103 transition-transform duration-700 ease-out"
                loading="eager"
              />

              {/* Bouton d'agrandissement en haut à droite */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(true);
                }}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all shadow-lg hover:scale-105"
                title="Agrandir l'image en plein écran"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              {/* Légende en bas de l'image */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-6 flex items-end justify-between">
                <p className="text-xs text-slate-200 font-medium max-w-[85%] leading-snug drop-shadow-md">
                  🛰️ {meta.photoCredit}
                </p>
                <span className="text-[10px] font-mono text-cyan-300 hidden sm:inline-block shrink-0 ml-2 bg-black/60 px-2 py-0.5 rounded border border-cyan-500/30">
                  Plein écran ⤢
                </span>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              {renderSchematicSvg()}
              {/* Graticule radar */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#38bdf80a_1px,transparent_1px),linear-gradient(to_bottom,#38bdf80a_1px,transparent_1px)] bg-[size:20px_20px]" />
            </div>
          )}
        </div>

        {/* Barre de télémétrie en pied de carte */}
        <div className="px-3.5 py-2 bg-[#0c1322] border-t border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 truncate">
            Stress biophysique : <strong className="text-amber-300">{meta.stressMetric}</strong>
          </span>
          <span className="text-[10px] uppercase tracking-wider shrink-0 flex items-center gap-1.5 font-bold">
            <span className={`w-2 h-2 rounded-full ${isTipped ? 'bg-rose-500 shadow-sm shadow-rose-500/80 animate-ping' : isUncertain ? 'bg-amber-400 shadow-sm shadow-amber-400/80' : 'bg-emerald-400'}`} />
            <span className={isTipped ? 'text-rose-400' : isUncertain ? 'text-amber-300' : 'text-emerald-400'}>
              {isTipped ? 'Seuil Dépassé' : isUncertain ? 'Zone de Risque' : 'Équilibre Actuel'}
            </span>
          </span>
        </div>
      </div>

      {/* Modal / Lightbox plein écran pour examiner l'observation HD */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setIsZoomed(false)}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 max-w-5xl mx-auto w-full">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                {elementName} · {meta.coords}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{meta.sensor} — {meta.spectrum}</p>
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
              src={meta.realPhotoUrl}
              alt={elementName}
              className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
            />
          </div>

          <div className="max-w-5xl mx-auto w-full pt-3 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>{meta.photoCredit}</span>
            <span className="text-amber-400 font-bold">{meta.stressMetric}</span>
          </div>
        </div>
      )}
    </>
  );
};
