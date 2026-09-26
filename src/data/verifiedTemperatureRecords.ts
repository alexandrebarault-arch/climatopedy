import { CLIMATE_ZONE_METADATA } from './climateZoneMetadata';

export interface VerifiedTemperatureRecord {
  valueC: number;
  location: string;
  date: string;
  sourceLabel: string;
  sourceUrl: string;
  memberIso3: string;
}

export interface ZoneTemperatureRecord extends VerifiedTemperatureRecord {
  memberName: string;
  coverage: { sourcedMembers: number; totalMembers: number };
  isGroupedZone: boolean;
}

/** Curated records only; never populate this registry from modeled/reanalysis maxima. */
export const VERIFIED_TEMPERATURE_RECORDS: Record<string, VerifiedTemperatureRecord> = {
  FRA: {
    valueC: 46.0,
    location: 'Vérargues (Hérault)',
    date: '2019-06-28',
    sourceLabel: 'Météo-France',
    sourceUrl: 'https://meteofrance.com/meteo-a-z/quelle-est-la-temperature-la-plus-elevee-enregistree-en-france',
    memberIso3: 'FRA'
  },
  USA: {
    valueC: 56.7,
    location: 'Greenland Ranch, Death Valley (Californie)',
    date: '1913-07-10',
    sourceLabel: 'NOAA / National Centers for Environmental Information',
    sourceUrl: 'https://www.ncei.noaa.gov/news/earths-hottest-temperature',
    memberIso3: 'USA'
  },
  BRA: {
    valueC: 44.8,
    location: 'Araçuaí (Minas Gerais)',
    date: '2023-11-19',
    sourceLabel: 'INMET — Instituto Nacional de Meteorologia',
    sourceUrl: 'https://portal.inmet.gov.br/noticias/primavera-2023-foi-marcada-por-temperaturas-elevadas-seca-no-centro-norte-do-pa%C3%ADs-e-chuva-intensa-na-regi%C3%A3o-sul',
    memberIso3: 'BRA'
  },
  IND: {
    valueC: 51.0,
    location: 'Phalodi (Rajasthan)',
    date: '2016-05-19',
    sourceLabel: 'India Meteorological Department',
    sourceUrl: 'https://metnet.imd.gov.in/docs/imdnews/ar2016.pdf',
    memberIso3: 'IND'
  },
  CHN: {
    valueC: 52.2,
    location: 'Sanbao (Xinjiang)',
    date: '2023-07-16',
    sourceLabel: 'National Climate Center, cité par le portail du gouvernement de Jiyuan',
    sourceUrl: 'https://zrzyghj.jiyuan.gov.cn/zwfw/kxpj/t927293.html',
    memberIso3: 'CHN'
  },
  AUS: {
    valueC: 50.7,
    location: 'Oodnadatta Airport (Australie-Méridionale)',
    date: '1960-01-02',
    sourceLabel: 'Bureau of Meteorology Australia',
    sourceUrl: 'https://www.bom.gov.au/climate/extreme/records.shtml',
    memberIso3: 'AUS'
  }
};

/** Returns the highest sourced member record, with coverage so a partial zone isn't presented as exhaustive. */
export function getVerifiedZoneRecord(zoneId: string): ZoneTemperatureRecord | null {
  const zone = CLIMATE_ZONE_METADATA[zoneId as keyof typeof CLIMATE_ZONE_METADATA];
  if (!zone) throw new Error(`Unknown climate zone: ${zoneId}`);

  const sourcedRecords = zone.members
    .map(member => ({ member, record: VERIFIED_TEMPERATURE_RECORDS[member.iso3] }))
    .filter((entry): entry is { member: (typeof zone.members)[number]; record: VerifiedTemperatureRecord } => Boolean(entry.record))
    .sort((a, b) => b.record.valueC - a.record.valueC);
  const highest = sourcedRecords[0];
  if (!highest) return null;

  return {
    ...highest.record,
    memberName: highest.member.name,
    coverage: { sourcedMembers: sourcedRecords.length, totalMembers: zone.members.length },
    isGroupedZone: zone.type === 'grouped-zone'
  };
}
