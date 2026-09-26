import { geoContains, GeoPermissibleObjects } from 'd3-geo';
import * as topojson from 'topojson-client';
import worldAtlasData from 'world-atlas/countries-110m.json';

// The already-vendored world-atlas/Natural Earth land topology is also the map's land outline.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const atlas = worldAtlasData as any;
const land = topojson.feature(atlas, atlas.objects.land) as GeoPermissibleObjects;
const SEARCH_STEP_DEGREES = 0.05;
const SEARCH_RADIUS_DEGREES = 2;

export function isLandCoordinate(coordinate: [number, number]): boolean {
  const [longitude, latitude] = coordinate;
  if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) return false;
  return geoContains(land, coordinate);
}

/** Move an ocean map-center to the nearest land point on a deterministic 0.05° search grid. */
export function nearestLandCoordinate(coordinate: [number, number]): [number, number] {
  if (isLandCoordinate(coordinate)) return coordinate;
  const [longitude, latitude] = coordinate;
  const latitudeFactor = Math.max(0.1, Math.cos(latitude * Math.PI / 180));
  const candidates: { coordinate: [number, number]; distance: number }[] = [];

  for (let latitudeOffset = -SEARCH_RADIUS_DEGREES; latitudeOffset <= SEARCH_RADIUS_DEGREES; latitudeOffset += SEARCH_STEP_DEGREES) {
    for (let longitudeOffset = -SEARCH_RADIUS_DEGREES; longitudeOffset <= SEARCH_RADIUS_DEGREES; longitudeOffset += SEARCH_STEP_DEGREES) {
      if (latitudeOffset === 0 && longitudeOffset === 0) continue;
      const distance = Math.hypot(latitudeOffset, longitudeOffset * latitudeFactor);
      if (distance > SEARCH_RADIUS_DEGREES) continue;
      candidates.push({ coordinate: [longitude + longitudeOffset, latitude + latitudeOffset], distance });
    }
  }
  candidates.sort((a, b) => a.distance - b.distance || a.coordinate[1] - b.coordinate[1] || a.coordinate[0] - b.coordinate[0]);
  const nearest = candidates.find(candidate => isLandCoordinate(candidate.coordinate));
  if (!nearest) throw new Error(`No land point was found within ${SEARCH_RADIUS_DEGREES}° of ${longitude},${latitude}.`);
  return nearest.coordinate;
}
