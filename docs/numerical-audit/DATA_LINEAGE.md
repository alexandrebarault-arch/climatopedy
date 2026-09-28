# Data lineage

## Active country temperature / Tw

`CountryInspector.tsx:367-412` display → `CountryDynamicState` → `stepSimulation()` (`physicsModel.ts:315-342`) → CCKP temperature and heat adapters → climate-panel local proxy + CCKP snapshots → MERRA-2/NASA POWER and CCKP source metadata.

Historical (1901–2025): GISTEMP annual anomaly → app-offset (`temperatureReference.ts:25-30`) × `patternScaling` → climate panel point baseline (`historicalData.ts:290-299`). It is explicitly a zone reconstruction, not a national observation.

Future (2027–2100): climate-panel baseline + CCKP change blended linearly (`countryTemperatures.ts:40-50`); P99 uses TXx delta and RH uses warm-season Hurs delta (`heatHazardProjections.ts:56-70`); Tw uses Stull or `null`.

## Calories, population, global KPIs

Display (`KpiCharts.tsx`, `CountryInspector.tsx:472-527`) → state from `stepSimulation` → crop yield/food/mortality/migration/cohorts (`physicsModel.ts:344-501`) → static model parameters + climate/energy state. World kcal/yield are population-weighted aggregations (`:492-500`).

## Habitability and water

Map fill (`WorldMap.tsx:197-207`) / inspector (`CountryInspector.tsx:57-71`) → `getHabitabilityStatus()` → heat/calorie state plus WRI/IIASA lookups → embedded snapshots. It takes the **maximum** available constraint; it is a display classification, not an averaged score.

## Presentation transformations

UI rounds/labels values but does not re-run climate physics: examples include metres→centimetres in `KpiCharts.tsx:247-249`, ratio→percent and fixed decimals in `CountryInspector.tsx:304-527`, and comparison deltas in `ComparativeDashboardView.tsx:60-83`.
