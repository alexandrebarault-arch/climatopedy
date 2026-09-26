import { GEO_COUNTRY_FEATURES, ProcessedCountryFeature } from '../data/worldMapGeo';

/** Resolve a simulation zone to a national feature only when every mapped feature belongs to one country. */
export function getSoleNationalFeatureForSimulationZone(zoneId: string): ProcessedCountryFeature | null {
  const features = GEO_COUNTRY_FEATURES.filter(feature => feature.simCountryId === zoneId);
  if (!features.length || features.some(feature => feature.iso3 === null)) return null;
  const countryCodes = new Set(features.map(feature => feature.iso3));
  return countryCodes.size === 1 ? features[0] : null;
}
