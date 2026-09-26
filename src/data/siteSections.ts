export const SITE_SECTIONS = [
  { id: 'map', desktopLabel: 'Planisphère', desktopSuffix: '& Indicateurs', mobileLabel: 'Planisphère & Indicateurs', primaryView: 'WorldMap' },
  { id: 'comparative-dashboard', desktopLabel: 'Dashboard Comparatif', mobileLabel: 'Dashboard Comparatif Global', primaryView: 'ComparativeDashboardView' },
  { id: 'tipping-points', desktopLabel: 'Points de Bascule', mobileLabel: 'Points de Bascule Climatiques', primaryView: 'TippingPointsView' },
  { id: 'causal', desktopLabel: 'Enquête Énergie', desktopSuffix: '& Pétrole', mobileLabel: 'Enquête Chaîne Matérielle & Pétrole', primaryView: 'CausalChainExplorer' },
  { id: 'spec', desktopLabel: 'Spécifications', mobileLabel: 'Spécification & Algorithmes', primaryView: 'SpecModal' },
  { id: 'sources', desktopLabel: 'Sources & Données', mobileLabel: 'Sources & Données Scientifiques', primaryView: 'ScientificSourcesView' }
] as const;

export type SiteSectionId = (typeof SITE_SECTIONS)[number]['id'];
export type SiteSection = (typeof SITE_SECTIONS)[number];

export const SITE_SECTION_BY_ID = Object.fromEntries(
  SITE_SECTIONS.map(section => [section.id, section])
) as { [Id in SiteSectionId]: Extract<SiteSection, { id: Id }> };
