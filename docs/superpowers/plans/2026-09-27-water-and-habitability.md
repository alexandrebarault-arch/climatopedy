# Water and Habitability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show defensible country and simulation-zone projections of household drinking-water access and water-resource stress, include dry heat in the map constraint class, and move the map year badge above its legend.

**Architecture:** Keep source indicators independently versioned and sourced. Add public IIASA SSP access projections at country scale and spatial Aqueduct future basin risk; aggregate simulation zones only from covered member countries with explicit population weights and coverage. A pure shared habitability helper will combine valid constraint levels while preserving separate indicator explanations.

**Tech Stack:** React, TypeScript, Vite, Node/tsx data-generation scripts, existing JSON source snapshots and CSV/JSON audit reports.

**Spec:** `docs/superpowers/specs/2026-09-27-water-and-habitability-design.md`

## Global Constraints

- Missing access or water data must remain missing; it must never be treated as zero risk.
- Improved drinking-water access projections must remain distinct from safely managed drinking-water observations and water-stress scores.
- Do not project beyond the published water-access horizon (2100) or interpolate unsupported years without labeling the result.
- Country values must not be copied to each member country of a simulation region; zone aggregates require explicit population weights and coverage.
- Heat-risk classes are model constraints, not binary habitability verdicts.
- Do not present a 35 °C wet-bulb value as a universal human safety threshold.

## Review Focus

- IIASA access projection data may omit mapped territories — audit every feature, keep unsupported countries unavailable, and publish coverage.
- The scenario selector names internal CLIMATOPEDY pathways, not pure SSPs — show source SSP mapping and the fact SSP5 development can improve water access while warming increases.
- Household water access and basin water stress can diverge — expose them as separate indicators and never combine their units.
- A proxy-zone climate point may not represent all parts of a large country — show zone membership/provenance and avoid claiming local resolution.
- Tw may be unavailable on very hot dry days — the dry-air indicator must still affect the constraint category.

## Files and Responsibilities

- `src/data/householdWaterAccessProjections.json` — public, license-checked source projection snapshot, provenance, SSP coverage, years, and country-level series.
- `src/data/aqueductSubbasinWaterStress.json` — public Aqueduct future basin layer subset/snapshot with source metadata and spatial identifiers.
- `scripts/generateHouseholdWaterAccessData.ts` — retrieve or normalize IIASA Explorer download into the versioned country/year/SSP schema; fail on schema/licence/coverage surprises.
- `scripts/generateAqueductSubbasinData.ts` — retrieve/normalize WRI future basin risk and compute country/zone aggregates with population weights where available.
- `src/engine/waterAccessProjections.ts` — resolve source SSP for selected internal scenario, select source horizon, return value, year, method and coverage.
- `src/engine/habitabilityStatus.ts` — accept Tw, dry-heat metrics, calories, projected improved-water access and basin stress; return worst supported constraint plus per-indicator reasons and missing-data flags.
- `src/components/WorldMap.tsx` — year badge position, selected-country metric cards, map status inputs and explanation.
- `src/components/CountryInspector.tsx` — country water projections, source SSP, observed safe-managed access and stress kept distinct.
- `src/components/ScientificSourcesView.tsx` or existing sources registry — add JMP, IIASA study/Explorer and Aqueduct basin projection provenance.
- `scripts/auditCountryContextData.ts` or a focused companion audit — verify coverage, uniqueness, bounds, scenario/year keys, zone aggregation and status-change ledger for every mapped feature and model zone.
- `docs/climate-panel-data.md` and `docs/data-quality/country-context-data.md` — methods, coverage, limitations and reproduction commands.
- `reports/water-habitability-country-zone-audit.json` and `.md` — exhaustive per-feature and per-zone coverage/results and changed status explanations.

## Tasks

### Task 1: Acquire and validate public access projection series

**Files:** Create `scripts/generateHouseholdWaterAccessData.ts`, `src/data/householdWaterAccessProjections.json`; update source data documentation.

**Interfaces:** Normalize rows as `{ iso3, year, ssp, improvedWaterAccessPct, populationWithoutAccess?, sourceModel, sourceUrl }`; metadata must include retrieval date, published horizons, license and caveats.

- [ ] Inspect IIASA SSP Extension Explorer download/API options and the model's published field definition, coverage, year grid, and license.
- [ ] Add a reproducible normalization script using only publicly downloadable data; do not fetch Zenodo restricted files.
- [ ] Store distinct country×SSP×year rows. Reject duplicate keys, non-finite/out-of-range percentages, unsupported SSPs, invalid years, and any undocumented schema change.
- [ ] Record unsupported country ISO3 values rather than inferring or filling their values.
- [ ] Document that improved service is not equivalent to safely managed service and that source resolution is national.

### Task 2: Add water-access resolver and zone aggregation

**Files:** Create `src/engine/waterAccessProjections.ts`; use existing country-to-feature and simulation-zone membership; add data audit coverage.

**Interfaces:** `getHouseholdWaterAccessProjection(iso3: string, year: number, scenarioId: string): WaterAccessProjection | null`; `aggregateWaterAccessForZone(members, year, scenarioId): WaterAccessZoneProjection | null`.

- [ ] Map `sobriety → SSP1`, `delayed → SSP2`, and `bau → SSP5`; return the source SSP in the result.
- [ ] Resolve only published years. If the app year is between source points, use nearest published year and expose `sourceYear`; no interpolation unless source spacing is validated and the result is explicitly marked interpolated.
- [ ] Aggregate zones by population among covered members only; include covered/total population and member count. Return `null` if no defensible weight exists.
- [ ] Keep individual country result distinct from the 34-zone summary; do not fan out a zone value onto country polygons.
- [ ] Cover missing ISO3, missing country trajectory, single-member zone, partial zone coverage, zero/missing population, and source-horizon boundaries in the requested country/zone audit.

### Task 3: Add subbasin water-stress coverage for mapped features and zones

**Files:** Create `scripts/generateAqueductSubbasinData.ts`, `src/data/aqueductSubbasinWaterStress.json`; extend country/zone audit and water source documentation.

- [ ] Locate public Aqueduct 4.0 future projection subbasin data and document its scenario, period and license metadata.
- [ ] Intersect basin geometries with map polygons and simulation-zone definitions; aggregate with population weights if the population grid is compatible. If not, use area weights and label them explicitly.
- [ ] Preserve the WRI country score as a national comparison; basin/zone aggregates are separate outputs and are not household access estimates.
- [ ] Record coverage and spatial-weight method per country and zone; unsupported geography remains unavailable.
- [ ] Fail data audit on invalid score bounds, duplicate spatial/scenario/year keys, missing basin geometry, invalid weights, or unsupported horizons.

### Task 4: Rework shared constraint status to include dry heat and water

**Files:** Modify `src/engine/habitabilityStatus.ts`; update its callers in `WorldMap.tsx` and `CountryInspector.tsx`.

**Interfaces:** Replace positional helper parameters with `getHabitabilityStatus(input: { wetBulbPeakC: number | null; p99HotTempC: number | null; annualMeanDailyMaxTempC: number | null; caloriesKcalPerPersonDay: number | null; improvedWaterAccessPct: number | null; basinWaterStressCategory: number | null }): HabitabilityStatus | null`. Result includes worst class, reasons and source dimensions.

- [ ] Define separately documented temperature, calorie, access and stress classes; worst valid class determines the displayed constraint band.
- [ ] Ensure high P99 or annual mean daily Tmax raises the class while Tw is null; missing water never maps to favorable.
- [ ] Keep unvalidated thresholds labeled visualization heuristics; cite published physiological context and do not state a universal survival limit.
- [ ] Show contributing indicators and missing dimensions in the result explanation.
- [ ] Preserve the existing severity color order and unavailable state where all deciding inputs are absent.

### Task 5: Surface projections and source limits in the UI

**Files:** Modify `src/components/WorldMap.tsx`, `src/components/CountryInspector.tsx`, source registry/view and relevant styles.

- [ ] Add country cards/rows for household improved-water projection, source year/SSP and coverage; retain observed safely managed JMP value separately.
- [ ] Add basin water-stress projection as a distinct row with method and horizon.
- [ ] Show source values as projected, interpolated, observed, or unavailable; include links/source date and avoid false precision.
- [ ] Display scenario mismatch caveat: pathways pair the selected climate scenario with source SSP trajectories but do not imply identical model assumptions.
- [ ] Move the year badge into the clear region above the legend; confirm responsive layout by code inspection and retain keyboard/accessibility labels.
- [ ] Ensure country selection uses its ISO3 projection while zone-level summaries show a population-weighted aggregate and coverage.

### Task 6: Produce exhaustive country/zone audit and update documentation

**Files:** Create/update audit script and reports; update `docs/climate-panel-data.md`, `docs/data-quality/country-context-data.md`, and package scripts.

- [ ] Generate one audit row for every mapped feature × published water scenario × published horizon, plus every simulation zone × its valid members.
- [ ] Include heat metrics, water access metric/source year, water-stress metric, model status before/after, class-changing reason, source coverage, spatial/population weighting, and known limitations.
- [ ] Report each country and zone with over/under-classification triggers: Tw missing, dry-heat class, water projection gap or basin stress.
- [ ] Document regeneration commands and the exact separation between drinking-water access, safe-management observation and resource stress.
- [ ] Run only the requested exhaustive data audit and report generated coverage/counts and all issues; do not present successful internal consistency checks as external validation.

## Verification Constraints

The user requested a country/zone audit. Run the new water/habitability audit and inspect its full result. The user did not request the general test suite; do not add or run general tests, lint, or build commands unless requested separately.
