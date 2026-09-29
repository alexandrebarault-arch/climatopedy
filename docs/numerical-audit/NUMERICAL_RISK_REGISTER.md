# Numerical risk register

| ID | Severity | Type | Location | Description / evidence | Confidence |
|---|---|---|---|---|---|
| R-001 | CRITICAL | POTENTIAL ISSUE | `physicsModel.ts:436-464` | Nested origin/destination loop mutates destination active cohorts while later origins are processed; migration is not a simultaneous flow solve and may be order-dependent. | HIGH |
| R-002 | CRITICAL | NEEDS SCIENTIFIC REVIEW | `physicsModel.ts:196-503` | Most core causal coefficients and mortality relations are hard-coded; no direct numerical tests or calibration dataset exists. | HIGH |
| R-003 | HIGH | CONFIRMED LIMITATION | `countryTemperatures.ts:40-48`, `heatHazardProjections.ts:56-70` | CCKP time periods are linearly interpolated and TXx/Hurs are proxies for local P99/hot-day RH. | HIGH |
| R-004 | HIGH | CONFIRMED LIMITATION | `historicalData.ts:275-299` | Historical country values use world-scaled population and global anomaly × regional scale, not national time series. | HIGH |
| R-005 | HIGH | POTENTIAL ISSUE | `physicsModel.ts:42-59` | Low-level Stull clamps beyond its published domain whereas scenario API returns null; misuse can silently produce extrapolated Tw. | HIGH |
| R-006 | HIGH | CONFIRMED LIMITATION | `waterAccessProjections.ts:65-83,123-131` | 2095/2080 values are held through 2200, potentially displayed as a current simulation-year context (with method label). | HIGH |
| R-007 | MEDIUM | POTENTIAL ISSUE | `countryTemperatures.ts:12-16`, `waterAccessProjections.ts:45-49` | Unknown scenario IDs silently map to default/mismatched source scenarios. | HIGH |
| R-008 | MEDIUM | CONFIRMED LIMITATION | `representativeLandPoints.ts:18-36` | One representative point (and possible 2° relocation) represents large/grouped areas. | HIGH |
| R-009 | MEDIUM | POTENTIAL ISSUE | `habitabilityStatus.test.ts` vs `habitabilityStatus.ts:49` | Dynamic test calls use old positional signature; test does not exercise production object contract. | HIGH |
| R-010 | LOW | UNKNOWN | static JSON provenance | Refresh cadence and reproducibility of CCKP/POWER generated snapshots are not fully visible in this repository. | MEDIUM |
