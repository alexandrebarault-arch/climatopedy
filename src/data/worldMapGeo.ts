import { geoEquirectangular, geoPath } from 'd3-geo';
import * as topojson from 'topojson-client';
import worldAtlasData from 'world-atlas/countries-110m.json';

// Projection plane Plate Carrée (Equirectangular EPSG:4326)
// Canvas dimensions : 1000px de large (-180° à +180°) par 500px de haut (+90° à -90°)
const projection = geoEquirectangular()
  .scale(1000 / (2 * Math.PI))
  .translate([500, 250]);

const pathGenerator = geoPath(projection);

// Conversion TopoJSON vers GeoJSON
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const atlas = worldAtlasData as any;
const landGeo = topojson.feature(atlas, atlas.objects.land);
const countriesGeo = topojson.feature(atlas, atlas.objects.countries);

// Tracé SVG complet du socle continental mondial (Natural Earth 110m)
export const WORLD_LAND_PATH = pathGenerator(landGeo) || '';

// Table de correspondance nom de pays Natural Earth -> ID de simulation CLIMATOPEDY
export const NAME_TO_SIM_ID: Record<string, string> = {
  // Amérique du Nord
  'United States of America': 'usa',
  'Canada': 'can',
  'Mexico': 'mex',
  'Guatemala': 'cen_am',
  'Belize': 'cen_am',
  'Honduras': 'cen_am',
  'El Salvador': 'cen_am',
  'Nicaragua': 'cen_am',
  'Costa Rica': 'cen_am',
  'Panama': 'cen_am',
  'Cuba': 'cen_am',
  'Haiti': 'cen_am',
  'Dominican Rep.': 'cen_am',
  'Jamaica': 'cen_am',
  'Bahamas': 'cen_am',
  'Trinidad and Tobago': 'cen_am',
  'Puerto Rico': 'cen_am',

  // Amérique du Sud
  'Brazil': 'bra',
  'Argentina': 'arg',
  'Chile': 'arg',
  'Uruguay': 'arg',
  'Paraguay': 'arg',
  'Falkland Is.': 'arg',
  'Colombia': 'and',
  'Peru': 'and',
  'Bolivia': 'and',
  'Ecuador': 'and',
  'Venezuela': 'and',
  'Guyana': 'and',
  'Suriname': 'and',
  'French Guiana': 'and',

  // Europe
  'France': 'fra',
  'Germany': 'deu',
  'Netherlands': 'deu',
  'Belgium': 'deu',
  'Luxembourg': 'deu',
  'Switzerland': 'deu',
  'Austria': 'deu',
  'United Kingdom': 'gbr',
  'Ireland': 'gbr',
  'Spain': 'med_eu',
  'Portugal': 'med_eu',
  'Italy': 'med_eu',
  'Greece': 'med_eu',
  'Cyprus': 'med_eu',
  'N. Cyprus': 'med_eu',
  'Poland': 'eeu',
  'Czechia': 'eeu',
  'Slovakia': 'eeu',
  'Hungary': 'eeu',
  'Romania': 'eeu',
  'Bulgaria': 'eeu',
  'Serbia': 'eeu',
  'Croatia': 'eeu',
  'Bosnia and Herz.': 'eeu',
  'Albania': 'eeu',
  'Macedonia': 'eeu',
  'Slovenia': 'eeu',
  'Montenegro': 'eeu',
  'Kosovo': 'eeu',
  'Norway': 'sca',
  'Sweden': 'sca',
  'Finland': 'sca',
  'Denmark': 'sca',
  'Iceland': 'sca',
  'Greenland': 'sca',
  'Estonia': 'sca',
  'Latvia': 'sca',
  'Lithuania': 'sca',
  'Ukraine': 'ukr',
  'Belarus': 'ukr',
  'Moldova': 'ukr',

  // Eurasie / Russie
  'Russia': 'rus',

  // Moyen-Orient
  'Turkey': 'tur',
  'Saudi Arabia': 'sau',
  'United Arab Emirates': 'sau',
  'Oman': 'sau',
  'Yemen': 'sau',
  'Qatar': 'sau',
  'Kuwait': 'sau',
  'Iran': 'irn',
  'Iraq': 'irn',
  'Syria': 'irn',
  'Jordan': 'irn',
  'Lebanon': 'irn',
  'Israel': 'irn',
  'Palestine': 'irn',

  // Afrique du Nord
  'Morocco': 'nafr',
  'Algeria': 'nafr',
  'Tunisia': 'nafr',
  'Libya': 'nafr',
  'W. Sahara': 'nafr',
  'Egypt': 'egy',
  'Sudan': 'egy',
  'S. Sudan': 'egy',

  // Afrique Subsaharienne
  'Nigeria': 'nga',
  'Ghana': 'nga',
  "Côte d'Ivoire": 'nga',
  'Senegal': 'nga',
  'Mali': 'nga',
  'Niger': 'nga',
  'Burkina Faso': 'nga',
  'Guinea': 'nga',
  'Benin': 'nga',
  'Togo': 'nga',
  'Sierra Leone': 'nga',
  'Liberia': 'nga',
  'Mauritania': 'nga',
  'Gambia': 'nga',
  'Guinea-Bissau': 'nga',
  'Ethiopia': 'eth',
  'Somalia': 'eth',
  'Somaliland': 'eth',
  'Eritrea': 'eth',
  'Djibouti': 'eth',
  'Dem. Rep. Congo': 'cod',
  'Congo': 'cod',
  'Gabon': 'cod',
  'Cameroon': 'cod',
  'Central African Rep.': 'cod',
  'Eq. Guinea': 'cod',
  'Chad': 'cod',
  'Kenya': 'eaf',
  'Tanzania': 'eaf',
  'Uganda': 'eaf',
  'Rwanda': 'eaf',
  'Burundi': 'eaf',
  'South Africa': 'zaf',
  'Namibia': 'zaf',
  'Botswana': 'zaf',
  'Zimbabwe': 'zaf',
  'Mozambique': 'zaf',
  'Zambia': 'zaf',
  'Angola': 'zaf',
  'Malawi': 'zaf',
  'Madagascar': 'zaf',
  'Lesotho': 'zaf',
  'eSwatini': 'zaf',

  // Asie
  'India': 'ind',
  'Sri Lanka': 'ind',
  'Nepal': 'ind',
  'Bhutan': 'ind',
  'Pakistan': 'pak',
  'Afghanistan': 'pak',
  'Bangladesh': 'bgd',
  'China': 'chn',
  'Mongolia': 'chn',
  'Taiwan': 'chn',
  'North Korea': 'chn',
  'Japan': 'jpn',
  'South Korea': 'jpn',
  'Vietnam': 'sea',
  'Thailand': 'sea',
  'Myanmar': 'sea',
  'Cambodia': 'sea',
  'Laos': 'sea',
  'Philippines': 'sea',
  'Indonesia': 'idn',
  'Malaysia': 'idn',
  'Brunei': 'idn',
  'Timor-Leste': 'idn',
  'Papua New Guinea': 'idn',
  'Kazakhstan': 'casia',
  'Uzbekistan': 'casia',
  'Turkmenistan': 'casia',
  'Kyrgyzstan': 'casia',
  'Tajikistan': 'casia',
  'Azerbaijan': 'casia',
  'Georgia': 'casia',
  'Armenia': 'casia',

  // Océanie
  'Australia': 'aus',
  'New Zealand': 'aus',
  'Fiji': 'aus',
  'Solomon Is.': 'aus',
  'Vanuatu': 'aus',
  'New Caledonia': 'aus'
};

export interface ProcessedCountryFeature {
  id: string; // ISO ou code de feature
  name: string; // Nom officiel
  simCountryId: string; // ID région simulation CLIMATOPEDY (ex: 'fra', 'usa')
  path: string; // Tracé SVG haute précision issu de Natural Earth
  centroid: [number, number]; // [x, y] en pixels SVG [0..1000, 0..500]
}

// Centroïdes géographiques rigoureux calculés sur les terres émergées pour les 23 blocs de simulation
export const SIM_CENTROIDS: Record<string, [number, number]> = {
  usa: [228, 142], // USA Contigu
  can: [205, 95], // Canada
  mex: [216, 186], // Mexique
  cen_am: [267, 211], // Amérique Centrale
  bra: [353, 278], // Brésil
  arg: [322, 344], // Argentine / Cône Sud
  and: [294, 261], // Région Andine
  fra: [506, 122], // France Métropolitaine (Paris/Centre)
  deu: [528, 107], // Allemagne / Benelux
  gbr: [493, 100], // Royaume-Uni & Irlande
  med_eu: [511, 138], // Europe du Sud (Espagne / Italie)
  eeu: [561, 108], // Europe Centrale & Orientale
  sca: [544, 78], // Scandinavie
  ukr: [589, 114], // Ukraine
  rus: [708, 81], // Russie
  tur: [597, 142], // Turquie
  sau: [625, 183], // Arabie Saoudite & Golfe
  irn: [650, 160], // Iran & Irak
  nafr: [539, 172], // Afrique du Nord & Maghreb
  egy: [585, 176], // Égypte & Vallée du Nil
  nga: [522, 224], // Nigéria & Afrique de l'Ouest
  eth: [611, 225], // Éthiopie & Corne de l'Afrique
  cod: [564, 257], // RDC & Bassin du Congo
  eaf: [600, 261], // Afrique de l'Est (Kenya/Tanzanie)
  zaf: [569, 331], // Afrique Australe (Afrique du Sud)
  ind: [719, 192], // Inde & Asie du Sud
  pak: [689, 167], // Pakistan & Afghanistan
  bgd: [750, 184], // Bangladesh
  chn: [792, 153], // Chine
  jpn: [881, 149], // Japon & Corée
  sea: [783, 208], // Asie du Sud-Est
  idn: [819, 256], // Indonésie & Malaisie
  casia: [686, 122], // Asie Centrale
  aus: [872, 319] // Australie & N-Z
};

// Extraction et découpage des entités géographiques
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rawFeatures: any[] = (countriesGeo as any).features;

const processedList: ProcessedCountryFeature[] = [];

rawFeatures.forEach((feature) => {
  const name: string = feature.properties?.name || '';
  if (name === 'Antarctica') return;

  // CAS SPÉCIFIQUE : France dans Natural Earth 110m
  // Le MultiPolygon de France contient la Guyane française (coords ouest -53°) et la métropole (coords est +2°)
  if (name === 'France' && feature.geometry.type === 'MultiPolygon') {
    const coords: number[][][][] = feature.geometry.coordinates;

    // Métropole + Corse (longitudes > -10°)
    const euroPolys = coords.filter((poly) => poly[0][0][0] > -10);
    // Guyane française (longitudes < -10°)
    const guyanaPolys = coords.filter((poly) => poly[0][0][0] <= -10);

    if (euroPolys.length > 0) {
      const euroFeature = {
        type: 'Feature',
        properties: { name: 'France (Métropole)' },
        geometry: { type: 'MultiPolygon', coordinates: euroPolys }
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = pathGenerator(euroFeature as any) || '';
      if (p) {
        processedList.push({
          id: 'fra_metro',
          name: 'France',
          simCountryId: 'fra',
          path: p,
          centroid: [506, 122]
        });
      }
    }

    if (guyanaPolys.length > 0) {
      const guyanaFeature = {
        type: 'Feature',
        properties: { name: 'Guyane Française' },
        geometry: { type: 'MultiPolygon', coordinates: guyanaPolys }
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = pathGenerator(guyanaFeature as any) || '';
      if (p) {
        processedList.push({
          id: 'fra_guyana',
          name: 'Guyane Française',
          simCountryId: 'and', // Rattachée à la région nord-sud-américaine
          path: p,
          centroid: [352, 238]
        });
      }
    }
    return;
  }

  // Tous les autres pays
  const simId = NAME_TO_SIM_ID[name] || 'rus';
  const path = pathGenerator(feature) || '';
  if (!path) return;

  const centroid = pathGenerator.centroid(feature) || [500, 250];

  processedList.push({
    id: String(feature.id || name),
    name,
    simCountryId: simId,
    path,
    centroid: [centroid[0], centroid[1]]
  });
});

export const GEO_COUNTRY_FEATURES: ProcessedCountryFeature[] = processedList;
