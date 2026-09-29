# Climatopedy numerical system map

Scope: read-only audit, 2026-09-28. `STATUS=CONFIRMED` unless labelled otherwise.

```text
Versioned JSON + static country parameters
  -> generation/refresh scripts (offline maintenance)
  -> browser imports (`src/data/*`)
  -> historical reconstruction / scenario runner
  -> country indicators + global aggregation
  -> React state (`App.tsx:127-207`)
  -> WorldMap, CountryInspector, charts and comparison display
```

There is no runtime backend/API route in this repository: Vite bundles React and JSON. External APIs are contacted only by maintenance scripts, not by the browser simulation.

| Layer | Actual implementation | Evidence |
|---|---|---|
| Sources | NASA GISTEMP, NASA POWER/MERRA-2, CCKP CMIP6, WRI Aqueduct, IIASA, World Bank WDI; internal parameters | `src/data/*.json`, scripts |
| Ingestion | scripts download/validate snapshots; climate panel generation is offline | `scripts/updateCountryContextObserved.ts:25-81`, `scripts/updateAqueductCountryWaterStress.py:24-99` |
| Numerical core | historical interpolation, carbon/thermal/oil/food/demography model | `src/engine/historicalData.ts`, `src/engine/physicsModel.ts:196-503` |
| Projection adapters | CCKP deltas, heat/humidity proxy, water horizon lookup | `countryTemperatures.ts:28-81`, `heatHazardProjections.ts:48-71`, `waterAccessProjections.ts:60-132` |
| UI | no score recalculation except presentation/derived percentage; shared habitability classification | `WorldMap.tsx:197-207`, `CountryInspector.tsx:53-71` |

The 34 simulation zones (`COUNTRIES_DATA`) are mapped to 174 map features; grouped zones deliberately share a simulated state. This is a spatial proxy, not country-by-country modelling. Evidence: `scripts/auditTemperatureQuality.ts:13-20`; data file metadata.
