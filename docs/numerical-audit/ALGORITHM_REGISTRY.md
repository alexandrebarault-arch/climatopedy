# Algorithm registry

| ID | Name / location | Inputs → output / formula or rule | Tests | Confidence |
|---|---|---|---|---|
| ALG-001 | RH Magnus, `climatePanelMath.ts:36-45` | T, dew point → clamp(100·exp(aTd/(b+Td))/exp(aT/(b+T)),0,100) | climate panel math | HIGH |
| ALG-002 | climate-series summary, `:68-130`, `:137-168` | daily samples → mean, monthly warmest six, linear P99, median RH | climate panel math | HIGH |
| ALG-003 | Stull Tw, `physicsModel.ts:42-59` | Ta,RH → published analytic approximation; scenario wrapper returns null outside -20..50/5..99 | wet bulb / temperature quality | HIGH |
| ALG-004 | CCKP annual temperatures, `countryTemperatures.ts:28-50` | local baseline + reference offset + CCKP delta·clamped((y-2026)/74) + post-2100 delta | indirect audits only | HIGH |
| ALG-005 | heat hazard, `heatHazardProjections.ts:48-71` | local P99/RH + TXx/Hurs deltas → P99/RH; RH clamp 0..100 | temperature quality indirect | HIGH |
| ALG-006 | historical benchmark, `historicalData.ts:234-370` | decennial table → linear interpolation, proportional zone population and anomaly proxy | indirect audits | HIGH |
| ALG-007 | EROI/net energy, `physicsModel.ts:64-70` | EROI=max(1.05,32(1-min(.96,Q/Qinf))^1.35); net=max(.01,1-1/EROI) | no direct test | HIGH |
| ALG-008 | initial state, `physicsModel.ts:75-190` | hard-coded 2026 anchors + country records → full state | no direct test | HIGH |
| ALG-009 | one simulation step, `physicsModel.ts:196-503` | Euler step: energy→emissions/carbon→temperature/SLR→countries→migration→cohorts→world totals | temperature-only audit | HIGH |
| ALG-010 | crop/food, `physicsModel.ts:344-373` | yield=max(.12,(1-Σmix·beta·ΔT)(1-flood)inputs); kcal clamp 400..3500; deficit clamp 0..100 | no direct test | HIGH |
| ALG-011 | mortality/demography/migration, `physicsModel.ts:375-501` | logistic/threshold thermal mortality, quadratic famine, Euler cohorts and bilateral migration | no direct test | HIGH |
| ALG-012 | habitability class, `habitabilityStatus.ts:49-105` | maximum available indicator band, with special unknown-water rule | unit tests | HIGH |
| ALG-013 | water lookup/aggregation, `waterAccessProjections.ts:45-132` | scenario map, closest/held horizon; zone population-weighted access | no direct test | HIGH |
| ALG-014 | URL normalisation, `urlParams.ts:21-127` | parsed controls clamped to stated ranges | no direct test | HIGH |
| ALG-015 | colour/display bands, `wetBulbScale.ts:8-24` | Tw threshold → colour | unit test | HIGH |

`STATUS=UNKNOWN`: scientific calibration/intent of internal coefficients (especially ALG-007–011) cannot be reconstructed from code alone. Their mechanics, not their scientific validity, are confirmed.
