# Data sources registry

| Source / repository file | Format, coverage and unit | Classification / consumer / fallback |
|---|---|---|
| `climatePanelData.json` | 34 rows; MERRA-2/NASA POWER 1991–2020; °C, RH %, point proxies | Derived baseline; `physicsModel`, `historicalData`; absent row throws. Provenance embedded in rows; generator design `buildClimatePanelRow.ts:28-93`. |
| `cckpCountryTemperatures.json` | 34 zones; 2020–39 baseline and 2080–99 future; tas/tasmin/tasmax °C; SSP126/245/585 | Projection; linearly blended 2026–2100, post-2100 internal delta. `countryTemperatures.ts:28-50`. Missing throws. |
| `cckpHeatHazardProjections.json` | 34 zones; TXx °C and 12 monthly Hurs %; same CCKP periods | Projection/proxy; TXx delta is used for P99 and warm-month mean Hurs delta for hot-day RH. `heatHazardProjections.ts:42-71`. |
| `nasaGistempAnnualAnomalies.json` | 125 annual global anomalies; NASA GISTEMP v4, °C | Observed global series shifted to app anchor; historical local reconstruction. `temperatureReference.ts:6-36`. Missing year throws. |
| `householdWaterAccessProjections.json` | 21,300 rows; 2025–2095, countries, SSP/RCP, %, population M | Projection. Nearest horizon ≤2 years; 2095 held to 2200. `waterAccessProjections.ts:60-83`. |
| `aqueductCountryWaterStress.json` | 1,476 rows; 164 countries × 2030/2050/2080 × opt/bau/pes; score 0–5, category 0–4 | Projection. Closest horizon ≤15y; 2080 held to 2200. `waterAccessProjections.ts:118-132`. |
| `countryContextObserved.json` | latest non-null 2000–25 WDI per country; four percentages | Observed context only; null stays unavailable. `updateCountryContextObserved.ts:35-80`. |
| `countriesData.ts` / `worldMapGeo.ts` | 34 model-zone parameters and map topology | Internal/hypothetical static inputs: population, crop mix, humidity, resilience, coastal exposure. Consumers: core and map. |
| `historicalData.ts:32-229` | decennial mixed benchmark 1900–2026 | Mixed observed/internal; linear interpolation. Inputs without source metadata must be treated as internal baseline parameters. |

Refresh frequency is not scheduled in code. Snapshot dates are metadata, not a runtime update mechanism. Data values missing from country projections return `null`; they are not replaced with zero.
