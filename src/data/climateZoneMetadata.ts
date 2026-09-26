/** Versioned map-zone composition; names follow worldMapGeo.ts and ISO3 codes follow Natural Earth Admin-0. */
export const CLIMATE_ZONE_METADATA_VERSION = 'worldMapGeo.ts + Natural Earth Admin-0 snapshot 2026-09-26';
export const CLIMATE_ZONE_METADATA = {
  "usa": {
    "type": "country",
    "representativeCoordinates": [
      -98,
      39
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "United States of America",
        "iso3": "USA"
      }
    ]
  },
  "can": {
    "type": "country",
    "representativeCoordinates": [
      -106,
      56
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "Canada",
        "iso3": "CAN"
      }
    ]
  },
  "mex": {
    "type": "country",
    "representativeCoordinates": [
      -102,
      23
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "Mexico",
        "iso3": "MEX"
      }
    ]
  },
  "cen_am": {
    "type": "grouped-zone",
    "representativeCoordinates": [
      -84,
      14
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "Guatemala",
        "iso3": "GTM"
      },
      {
        "name": "Belize",
        "iso3": "BLZ"
      },
      {
        "name": "Honduras",
        "iso3": "HND"
      },
      {
        "name": "El Salvador",
        "iso3": "SLV"
      },
      {
        "name": "Nicaragua",
        "iso3": "NIC"
      },
      {
        "name": "Costa Rica",
        "iso3": "CRI"
      },
      {
        "name": "Panama",
        "iso3": "PAN"
      },
      {
        "name": "Cuba",
        "iso3": "CUB"
      },
      {
        "name": "Haiti",
        "iso3": "HTI"
      },
      {
        "name": "Dominican Rep.",
        "iso3": "DOM"
      },
      {
        "name": "Jamaica",
        "iso3": "JAM"
      },
      {
        "name": "Bahamas",
        "iso3": "BHS"
      },
      {
        "name": "Trinidad and Tobago",
        "iso3": "TTO"
      },
      {
        "name": "Puerto Rico",
        "iso3": "PRI"
      }
    ]
  },
  "bra": {
    "type": "country",
    "representativeCoordinates": [
      -53,
      -10
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "Brazil",
        "iso3": "BRA"
      }
    ]
  },
  "arg": {
    "type": "grouped-zone",
    "representativeCoordinates": [
      -64,
      -34
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "Argentina",
        "iso3": "ARG"
      },
      {
        "name": "Chile",
        "iso3": "CHL"
      },
      {
        "name": "Uruguay",
        "iso3": "URY"
      },
      {
        "name": "Paraguay",
        "iso3": "PRY"
      },
      {
        "name": "Falkland Is.",
        "iso3": "FLK"
      }
    ]
  },
  "and": {
    "type": "grouped-zone",
    "representativeCoordinates": [
      -74,
      -4
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "Colombia",
        "iso3": "COL"
      },
      {
        "name": "Peru",
        "iso3": "PER"
      },
      {
        "name": "Bolivia",
        "iso3": "BOL"
      },
      {
        "name": "Ecuador",
        "iso3": "ECU"
      },
      {
        "name": "Venezuela",
        "iso3": "VEN"
      },
      {
        "name": "Guyana",
        "iso3": "GUY"
      },
      {
        "name": "Suriname",
        "iso3": "SUR"
      },
      {
        "name": "French Guiana",
        "iso3": "GUF"
      }
    ]
  },
  "fra": {
    "type": "country",
    "representativeCoordinates": [
      2.5,
      46.5
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "France",
        "iso3": "FRA"
      }
    ]
  },
  "deu": {
    "type": "grouped-zone",
    "representativeCoordinates": [
      10,
      51.5
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "Germany",
        "iso3": "DEU"
      },
      {
        "name": "Netherlands",
        "iso3": "NLD"
      },
      {
        "name": "Belgium",
        "iso3": "BEL"
      },
      {
        "name": "Luxembourg",
        "iso3": "LUX"
      },
      {
        "name": "Switzerland",
        "iso3": "CHE"
      },
      {
        "name": "Austria",
        "iso3": "AUT"
      }
    ]
  },
  "gbr": {
    "type": "grouped-zone",
    "representativeCoordinates": [
      -2.5,
      54
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "United Kingdom",
        "iso3": "GBR"
      },
      {
        "name": "Ireland",
        "iso3": "IRL"
      }
    ]
  },
  "med_eu": {
    "type": "grouped-zone",
    "representativeCoordinates": [
      8,
      40
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "Spain",
        "iso3": "ESP"
      },
      {
        "name": "Portugal",
        "iso3": "PRT"
      },
      {
        "name": "Italy",
        "iso3": "ITA"
      },
      {
        "name": "Greece",
        "iso3": "GRC"
      },
      {
        "name": "Cyprus",
        "iso3": "CYP"
      },
      {
        "name": "N. Cyprus",
        "iso3": "CYP"
      }
    ]
  },
  "eeu": {
    "type": "grouped-zone",
    "representativeCoordinates": [
      22,
      50
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "Poland",
        "iso3": "POL"
      },
      {
        "name": "Czechia",
        "iso3": "CZE"
      },
      {
        "name": "Slovakia",
        "iso3": "SVK"
      },
      {
        "name": "Hungary",
        "iso3": "HUN"
      },
      {
        "name": "Romania",
        "iso3": "ROU"
      },
      {
        "name": "Bulgaria",
        "iso3": "BGR"
      },
      {
        "name": "Serbia",
        "iso3": "SRB"
      },
      {
        "name": "Croatia",
        "iso3": "HRV"
      },
      {
        "name": "Bosnia and Herz.",
        "iso3": "BIH"
      },
      {
        "name": "Albania",
        "iso3": "ALB"
      },
      {
        "name": "Macedonia",
        "iso3": "MKD"
      },
      {
        "name": "Slovenia",
        "iso3": "SVN"
      },
      {
        "name": "Montenegro",
        "iso3": "MNE"
      },
      {
        "name": "Kosovo",
        "iso3": "XKX"
      }
    ]
  },
  "sca": {
    "type": "grouped-zone",
    "representativeCoordinates": [
      16,
      62
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "Norway",
        "iso3": "NOR"
      },
      {
        "name": "Sweden",
        "iso3": "SWE"
      },
      {
        "name": "Finland",
        "iso3": "FIN"
      },
      {
        "name": "Denmark",
        "iso3": "DNK"
      },
      {
        "name": "Iceland",
        "iso3": "ISL"
      },
      {
        "name": "Greenland",
        "iso3": "GRL"
      },
      {
        "name": "Estonia",
        "iso3": "EST"
      },
      {
        "name": "Latvia",
        "iso3": "LVA"
      },
      {
        "name": "Lithuania",
        "iso3": "LTU"
      }
    ]
  },
  "ukr": {
    "type": "grouped-zone",
    "representativeCoordinates": [
      32,
      49
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "Ukraine",
        "iso3": "UKR"
      },
      {
        "name": "Belarus",
        "iso3": "BLR"
      },
      {
        "name": "Moldova",
        "iso3": "MDA"
      }
    ]
  },
  "rus": {
    "type": "country",
    "representativeCoordinates": [
      75,
      61
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "Russia",
        "iso3": "RUS"
      }
    ]
  },
  "tur": {
    "type": "country",
    "representativeCoordinates": [
      35,
      39
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "Turkey",
        "iso3": "TUR"
      }
    ]
  },
  "sau": {
    "type": "grouped-zone",
    "representativeCoordinates": [
      45,
      24
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "Saudi Arabia",
        "iso3": "SAU"
      },
      {
        "name": "United Arab Emirates",
        "iso3": "ARE"
      },
      {
        "name": "Oman",
        "iso3": "OMN"
      },
      {
        "name": "Yemen",
        "iso3": "YEM"
      },
      {
        "name": "Qatar",
        "iso3": "QAT"
      },
      {
        "name": "Kuwait",
        "iso3": "KWT"
      }
    ]
  },
  "irn": {
    "type": "grouped-zone",
    "representativeCoordinates": [
      54,
      32.5
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "Iran",
        "iso3": "IRN"
      },
      {
        "name": "Iraq",
        "iso3": "IRQ"
      },
      {
        "name": "Syria",
        "iso3": "SYR"
      },
      {
        "name": "Jordan",
        "iso3": "JOR"
      },
      {
        "name": "Lebanon",
        "iso3": "LBN"
      },
      {
        "name": "Israel",
        "iso3": "ISR"
      },
      {
        "name": "Palestine",
        "iso3": "PSE"
      }
    ]
  },
  "nafr": {
    "type": "grouped-zone",
    "representativeCoordinates": [
      14,
      28
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "Morocco",
        "iso3": "MAR"
      },
      {
        "name": "Algeria",
        "iso3": "DZA"
      },
      {
        "name": "Tunisia",
        "iso3": "TUN"
      },
      {
        "name": "Libya",
        "iso3": "LBY"
      },
      {
        "name": "W. Sahara",
        "iso3": "ESH"
      }
    ]
  },
  "egy": {
    "type": "grouped-zone",
    "representativeCoordinates": [
      30.5,
      26.5
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "Egypt",
        "iso3": "EGY"
      },
      {
        "name": "Sudan",
        "iso3": "SDN"
      },
      {
        "name": "S. Sudan",
        "iso3": "SSD"
      }
    ]
  },
  "nga": {
    "type": "grouped-zone",
    "representativeCoordinates": [
      8,
      9.5
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "Nigeria",
        "iso3": "NGA"
      },
      {
        "name": "Ghana",
        "iso3": "GHA"
      },
      {
        "name": "Côte d'Ivoire",
        "iso3": "CIV"
      },
      {
        "name": "Senegal",
        "iso3": "SEN"
      },
      {
        "name": "Mali",
        "iso3": "MLI"
      },
      {
        "name": "Niger",
        "iso3": "NER"
      },
      {
        "name": "Burkina Faso",
        "iso3": "BFA"
      },
      {
        "name": "Guinea",
        "iso3": "GIN"
      },
      {
        "name": "Benin",
        "iso3": "BEN"
      },
      {
        "name": "Togo",
        "iso3": "TGO"
      },
      {
        "name": "Sierra Leone",
        "iso3": "SLE"
      },
      {
        "name": "Liberia",
        "iso3": "LBR"
      },
      {
        "name": "Mauritania",
        "iso3": "MRT"
      },
      {
        "name": "Gambia",
        "iso3": "GMB"
      },
      {
        "name": "Guinea-Bissau",
        "iso3": "GNB"
      }
    ]
  },
  "eth": {
    "type": "grouped-zone",
    "representativeCoordinates": [
      40,
      9
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "Ethiopia",
        "iso3": "ETH"
      },
      {
        "name": "Somalia",
        "iso3": "SOM"
      },
      {
        "name": "Somaliland",
        "iso3": "SOM"
      },
      {
        "name": "Eritrea",
        "iso3": "ERI"
      },
      {
        "name": "Djibouti",
        "iso3": "DJI"
      }
    ]
  },
  "cod": {
    "type": "grouped-zone",
    "representativeCoordinates": [
      23,
      -2.5
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "Dem. Rep. Congo",
        "iso3": "COD"
      },
      {
        "name": "Congo",
        "iso3": "COG"
      },
      {
        "name": "Gabon",
        "iso3": "GAB"
      },
      {
        "name": "Cameroon",
        "iso3": "CMR"
      },
      {
        "name": "Central African Rep.",
        "iso3": "CAF"
      },
      {
        "name": "Eq. Guinea",
        "iso3": "GNQ"
      },
      {
        "name": "Chad",
        "iso3": "TCD"
      }
    ]
  },
  "eaf": {
    "type": "grouped-zone",
    "representativeCoordinates": [
      36,
      -4
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "Kenya",
        "iso3": "KEN"
      },
      {
        "name": "Tanzania",
        "iso3": "TZA"
      },
      {
        "name": "Uganda",
        "iso3": "UGA"
      },
      {
        "name": "Rwanda",
        "iso3": "RWA"
      },
      {
        "name": "Burundi",
        "iso3": "BDI"
      }
    ]
  },
  "zaf": {
    "type": "grouped-zone",
    "representativeCoordinates": [
      25,
      -29
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "South Africa",
        "iso3": "ZAF"
      },
      {
        "name": "Namibia",
        "iso3": "NAM"
      },
      {
        "name": "Botswana",
        "iso3": "BWA"
      },
      {
        "name": "Zimbabwe",
        "iso3": "ZWE"
      },
      {
        "name": "Mozambique",
        "iso3": "MOZ"
      },
      {
        "name": "Zambia",
        "iso3": "ZMB"
      },
      {
        "name": "Angola",
        "iso3": "AGO"
      },
      {
        "name": "Malawi",
        "iso3": "MWI"
      },
      {
        "name": "Madagascar",
        "iso3": "MDG"
      },
      {
        "name": "Lesotho",
        "iso3": "LSO"
      },
      {
        "name": "eSwatini",
        "iso3": "SWZ"
      }
    ]
  },
  "ind": {
    "type": "grouped-zone",
    "representativeCoordinates": [
      79,
      21
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "India",
        "iso3": "IND"
      },
      {
        "name": "Sri Lanka",
        "iso3": "LKA"
      },
      {
        "name": "Nepal",
        "iso3": "NPL"
      },
      {
        "name": "Bhutan",
        "iso3": "BTN"
      }
    ]
  },
  "pak": {
    "type": "grouped-zone",
    "representativeCoordinates": [
      68,
      30
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "Pakistan",
        "iso3": "PAK"
      },
      {
        "name": "Afghanistan",
        "iso3": "AFG"
      }
    ]
  },
  "bgd": {
    "type": "country",
    "representativeCoordinates": [
      90,
      23.8
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "Bangladesh",
        "iso3": "BGD"
      }
    ]
  },
  "chn": {
    "type": "grouped-zone",
    "representativeCoordinates": [
      105,
      35
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "China",
        "iso3": "CHN"
      },
      {
        "name": "Mongolia",
        "iso3": "MNG"
      },
      {
        "name": "Taiwan",
        "iso3": "TWN"
      },
      {
        "name": "North Korea",
        "iso3": "PRK"
      }
    ]
  },
  "jpn": {
    "type": "grouped-zone",
    "representativeCoordinates": [
      137,
      36.5
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "Japan",
        "iso3": "JPN"
      },
      {
        "name": "South Korea",
        "iso3": "KOR"
      }
    ]
  },
  "sea": {
    "type": "grouped-zone",
    "representativeCoordinates": [
      102,
      15
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "Vietnam",
        "iso3": "VNM"
      },
      {
        "name": "Thailand",
        "iso3": "THA"
      },
      {
        "name": "Myanmar",
        "iso3": "MMR"
      },
      {
        "name": "Cambodia",
        "iso3": "KHM"
      },
      {
        "name": "Laos",
        "iso3": "LAO"
      },
      {
        "name": "Philippines",
        "iso3": "PHL"
      }
    ]
  },
  "idn": {
    "type": "grouped-zone",
    "representativeCoordinates": [
      115,
      -2
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "Indonesia",
        "iso3": "IDN"
      },
      {
        "name": "Malaysia",
        "iso3": "MYS"
      },
      {
        "name": "Brunei",
        "iso3": "BRN"
      },
      {
        "name": "Timor-Leste",
        "iso3": "TLS"
      },
      {
        "name": "Papua New Guinea",
        "iso3": "PNG"
      }
    ]
  },
  "casia": {
    "type": "grouped-zone",
    "representativeCoordinates": [
      67,
      46
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "Kazakhstan",
        "iso3": "KAZ"
      },
      {
        "name": "Uzbekistan",
        "iso3": "UZB"
      },
      {
        "name": "Turkmenistan",
        "iso3": "TKM"
      },
      {
        "name": "Kyrgyzstan",
        "iso3": "KGZ"
      },
      {
        "name": "Tajikistan",
        "iso3": "TJK"
      },
      {
        "name": "Azerbaijan",
        "iso3": "AZE"
      },
      {
        "name": "Georgia",
        "iso3": "GEO"
      },
      {
        "name": "Armenia",
        "iso3": "ARM"
      }
    ]
  },
  "aus": {
    "type": "grouped-zone",
    "representativeCoordinates": [
      134,
      -25
    ],
    "coordinateSource": "COUNTRIES_DATA.center; ERA5 land-cell selection",
    "members": [
      {
        "name": "Australia",
        "iso3": "AUS"
      },
      {
        "name": "New Zealand",
        "iso3": "NZL"
      },
      {
        "name": "Fiji",
        "iso3": "FJI"
      },
      {
        "name": "Solomon Is.",
        "iso3": "SLB"
      },
      {
        "name": "Vanuatu",
        "iso3": "VUT"
      },
      {
        "name": "New Caledonia",
        "iso3": "NCL"
      }
    ]
  }
} as const;
