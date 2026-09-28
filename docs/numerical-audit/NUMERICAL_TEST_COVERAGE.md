# Numerical test coverage

| Family | Evidence | Assessment |
|---|---|---|
| Temperature quality | `temperatureQuality.test.ts`; build runs `audit:climate` | PARTIALLY TESTED: internal bounds, order, Tw agreement and annual jumps over 1901–2200 × 3 scenarios; no external accuracy oracle. |
| Climate panel maths | `climatePanelMath.test.ts`, `climatePanelData.test.ts` | PARTIALLY TESTED: known calculations/data shape; generator/network path not exercised. |
| Habitability / colour | `habitabilityStatus.test.ts`, `wetBulbScale.test.ts` | TESTED for bands and unavailable values. Note tests use an obsolete positional call signature cast dynamically while production takes an object; this does not prove all six inputs. |
| Country context | `countryContextData.test.ts`, `auditCountryContextData.ts` | PARTIALLY TESTED: format, range and mapping coverage; no source reproducibility. |
| Harness / UI structure | `verificationHarness.test.ts`, `siteStructure.test.ts` | NOT NUMERICAL validation; checks commands/wiring/source strings. |
| Core simulation | no direct tests of `calculateEroiAndNetEnergy`, `initializeSimulationState`, `stepSimulation`, historical generation, water lookup | NOT TESTED numerically, except temperature outputs observed by audit. |

`npm run build` regenerates report files through audit scripts, so it was intentionally not run in this read-only mission. Existing working-tree report changes predate this audit and were not altered.
