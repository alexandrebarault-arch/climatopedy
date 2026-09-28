import React, { useState } from 'react';
import { Radio, Layers, Camera, Maximize2, X } from 'lucide-react';
import { TippingPointSchematic } from './TippingPointSchematic';

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

export const VISUAL_METADATA: Record<string, SatelliteData> = {
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
    stressMetric: 'Stress thermique corallien observé; le blanchissement n\'implique pas une mortalité systématique',
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
  barents_ice: {
    sensor: 'AMSR2 & DMSP SSMIS & CryoSat-2',
    coords: "74°30'N 37°00'E (Mer de Barents / Bassin Arctique)",
    elevationOrDepth: 'Niveau 0 m (Océan Arctique)',
    spectrum: 'Micro-ondes passives tout-temps & Température SST',
    keyFeature: 'Banquise pérenne fragmentée & Atlantification',
    stressMetric: '-12.6% de surface par décennie en septembre',
    realPhotoUrl: '/images/visuals/sea_ice.jpg',
    photoCredit: 'Observation satellite - Banquise polaire fracturée et chenaux d\'eau libre en été'
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
  boreal_forest: {
    sensor: 'MODIS Thermal Active Fire & VIIRS & Sentinel-2',
    coords: "61°15'N 115°45'W (Taïga canadienne et sibérienne)",
    elevationOrDepth: '280 m alt.',
    spectrum: 'Infrarouge thermique & Indice NBR',
    keyFeature: 'Taïga boréale à mélèzes et épicéas',
    stressMetric: '18 millions ha de forêt boréale brûlés en une saison record',
    realPhotoUrl: '/images/visuals/boreal_taiga.jpg',
    photoCredit: 'Écosystème de taïga boréale soumis aux sécheresses et méga-incendies'
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
  wilkes_basin: {
    sensor: 'ICESat-2 Laser Altimetry & BedMachine Antarctica',
    coords: "70°00'S 135°00'E (Bassin Sous-Glaciaire de Wilkes)",
    elevationOrDepth: '-1 200 m socle rocheux sous le niveau marin',
    spectrum: 'Gravimétrie GRACE-FO & Radar subglaciaire',
    keyFeature: 'Verrou glaciaire marin & Glacier Totten',
    stressMetric: 'Potentiel d\'élévation globale des océans : +3 à +4 mètres',
    realPhotoUrl: '/images/visuals/wilkes_ice.jpg',
    photoCredit: 'Falaise glaciaire géante et mission océanographique au Bassin de Wilkes (Antarctique Est)'
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

  const renderSchematicSvg = () => <TippingPointSchematic elementId={elementId} />;
  return (
    <>
      <div className={`relative rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs group flex flex-col transition-all duration-300 ${compact ? 'h-52 sm:h-60' : 'h-72 sm:h-80'}`}>
        {/* En-tête de la carte avec Satellite & Sélecteur */}
        <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Radio className="w-3.5 h-3.5 text-sky-600 animate-pulse shrink-0" />
            <span className="text-xs font-mono font-bold text-sky-800 uppercase tracking-wide truncate">
              {meta.sensor}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-600 shadow-2xs">
              {meta.coords}
            </span>

            {/* Bascule Photo / Schéma */}
            <div className="flex rounded-lg p-0.5 bg-slate-100 border border-slate-200 text-xs font-mono">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDisplayMode('photo');
                }}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  displayMode === 'photo'
                    ? 'bg-white text-slate-800 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
                title="Voir la photographie réelle HD du lieu"
              >
                <Camera className="w-3 h-3 text-sky-600" />
                <span>Photo</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDisplayMode('schematic');
                }}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  displayMode === 'schematic'
                    ? 'bg-white text-slate-800 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
                title="Voir la coupe biophysique schématique"
              >
                <Layers className="w-3 h-3 text-sky-600" />
                <span>Schéma</span>
              </button>
            </div>
          </div>
        </div>

        {/* Zone Principale d'Affichage Visuel */}
        <div className="relative flex-1 w-full overflow-hidden bg-slate-50 flex items-center justify-center">
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
                <span className="text-[10px] font-mono text-sky-300 hidden sm:inline-block shrink-0 ml-2 bg-black/60 px-2 py-0.5 rounded border border-sky-500/30">
                  Plein écran ⤢
                </span>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              {renderSchematicSvg()}
            </div>
          )}
        </div>

        {/* Barre de télémétrie en pied de carte */}
        <div className="px-3.5 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-700 truncate">
            Stress biophysique : <strong className="text-amber-800">{meta.stressMetric}</strong>
          </span>
          <span className="text-[10px] uppercase tracking-wider shrink-0 flex items-center gap-1.5 font-bold">
            <span className={`w-2 h-2 rounded-full ${isTipped ? 'bg-rose-500 shadow-sm shadow-rose-500/80 animate-ping' : isUncertain ? 'bg-amber-500 shadow-sm shadow-amber-400/80' : 'bg-emerald-500'}`} />
            <span className={isTipped ? 'text-rose-700' : isUncertain ? 'text-amber-800' : 'text-emerald-700'}>
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
