# Climate Panel Scientific Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace undocumented heat-panel constants with reproducible NASA POWER/MERRA-2 1991–2020 metrics, explicit quality/provenance for all 34 zones, and verified-only temperature records.

**Architecture:** A Node pipeline fetches daily NASA POWER/MERRA-2 means, dew point and extrema for each zone's representative point (nearest land search where required), computes normals and a warm-season P99 with explicitly estimated humidity, derives Tw, joins a curated verified-record registry, and emits one typed JSON row per `COUNTRIES_DATA` ID. Runtime uses this panel as the baseline, retains CCKP deltas for future scenarios, and exposes each metric's quality and record availability in the existing panel.

**Tech Stack:** TypeScript, Node built-in `fetch`/`node:test`, `tsx`, NASA POWER Daily API serving MERRA-2, existing CCKP JSON, React/Vite.

**Spec:** `C:\Users\alexa\.codex\attachments\e8851d46-eaf0-4ddc-9d86-dac63795cfaf\Pasted text.txt`

## Global Constraints

- Cover exactly all `COUNTRIES_DATA` IDs; never fill a metric with an arbitrary number.
- Baseline period is 1991–2020 and the source reanalysis is NASA MERRA-2 via NASA POWER Daily API.
- Scenario temperature is the P99 of daily Tmax in the six warmest climatological months; humidity is estimated from daily mean dew point paired with daily Tmax, not coincident hourly values.
- Compute Tw only from the scenario temperature and humidity using Stull (2011) within the published validity range.
- Historical records must have an observation source; otherwise use `null`/unavailable.
- Zone-center ERA5 grid values are explicitly `proxy` for area-wide metrics; do not describe them as area-weighted national observations.
- Preserve current UI structure and distinguish observed, calculated, derived, estimated, proxy and unavailable.
- No force push and no direct changes to `main`.

## Review Focus

- A missing API value or a grid point over water must fail generation instead of silently emitting a fabricated metric.
- A grouped zone must retain its proxy status and documented coordinate; it must not be presented as a directly observed country mean.
- Stull inputs outside its documented validity range must be explicitly handled and tested.
- A missing or unsourced historical record must display as unavailable and never inherit a simulated heat scenario.
- Historical and future temperature series must remain ordered (`Tmin ≤ Tmean ≤ Tmax`) when joined to CCKP deltas.

---

### Task 1: Audit and data contract

**Files:**
- Create: `src/types/climatePanel.ts`
- Create: `src/data/climateZoneMetadata.ts`
- Create: `tests/climatePanelData.test.ts`
- Modify: `package.json`

**Interfaces:**
- `ClimatePanelRow` carries `id`, seven panel metrics, per-metric `quality`, methods, datasets, period, representative coordinates, record provenance or null, and limitations.
- `CLIMATE_ZONE_METADATA` has exactly one row per zone with type (`country`/`grouped-zone`), representative `[longitude, latitude]`, and member ISO-3 list for grouped zones.

- [ ] Write failing tests for exact zone coverage, group membership, and required provenance fields.
- [ ] Run the targeted test and confirm it fails before implementation.
- [ ] Add the types, explicit zone metadata, and `node --import tsx --test` script.
- [ ] Run the targeted test and confirm it passes.

### Task 2: Reproducible MERRA-2 climate-data pipeline

**Files:**
- Create: `scripts/generateClimatePanelData.ts`
- Create: `src/data/climatePanelData.json`
- Test: `tests/climatePanelData.test.ts`

**Interfaces:**
- `calculateRelativeHumidity(tempC: number, dewPointC: number): number` uses the documented Magnus saturation-vapor-pressure ratio.
- `summarizePowerDailySeries(samples): ClimateSeriesSummary` calculates 1991–2020 means, warmest six months, linear-interpolated P99 daily Tmax, and estimated RH from daily mean dew point.
- Script requests one NASA POWER point per row, writes complete provenance and quality flags, and rejects missing/non-finite inputs.

- [ ] Test Magnus RH against reference values and bounds.
- [ ] Test daily summaries with a small deterministic fixture, including warm-season selection, P99, and RH at peak temperature.
- [ ] Test null/NaN/incomplete API data rejection and Stull validity handling.
- [ ] Implement the deterministic summarizers and source/API client.
- [ ] Run the generator for all 34 zones, save JSON, then run schema and scientific-invariant tests.

### Task 3: Verified absolute-temperature records

**Files:**
- Create: `src/data/verifiedTemperatureRecords.ts`
- Modify: `scripts/generateClimatePanelData.ts`
- Test: `tests/climatePanelData.test.ts`

**Interfaces:**
- Registry entries contain observed value, location, ISO date, source label/URL, and member ISO code.
- Countries without a verified source resolve to `null`; grouped zones use the maximum sourced member and carry explicit sourced-member coverage.

- [ ] Test sourced-only records, grouped maximum selection, and unavailable behavior.
- [ ] Add records only after checking primary national meteorological service or WMO sources.
- [ ] Regenerate the panel; verify no synthetic/model record appears.

### Task 4: Runtime integration and panel UI

**Files:**
- Modify: `src/engine/countryTemperatures.ts`
- Modify: `src/engine/physicsModel.ts`
- Modify: `src/engine/historicalData.ts`
- Modify: `src/types/simulation.ts`
- Modify: `src/components/CountryInspector.tsx`
- Modify: `src/components/WorldMap.tsx`
- Test: `tests/climatePanelData.test.ts`

**Interfaces:**
- Runtime baseline metrics load by zone ID from `climatePanelData.json`; existing CCKP SSP deltas continue to adjust future `tas`, `tasmin`, and `tasmax`.
- Dynamic Tw is recalculated from the scenario temperature and associated RH, never read as a stored independent scenario input.
- The country panel retains its current seven-item layout, shows baseline annual normal and metric quality, and shows a linked verified record or “Record vérifié non disponible”.

- [ ] Test France/USA/India and grouped-zone runtime integration and the `Tmin ≤ Tmean ≤ Tmax` invariant over timeline endpoints.
- [ ] Integrate generated baseline and scenario values, preserving CCKP projection deltas.
- [ ] Add quality/provenance affordances and record availability to both country inspector and map detail.
- [ ] Run targeted tests and inspect all 34 generated rows through the UI data path.

### Task 5: Sources, documentation, and full validation

**Files:**
- Create: `docs/climate-panel-data.md`
- Modify: `src/components/ScientificSourcesView.tsx`
- Modify: `package.json`
- Test: `tests/climatePanelData.test.ts`

- [ ] Document NASA POWER/MERRA-2 access, period, proxy location method, Tmax/Tmin/Tmean, warm-season P99, estimated Magnus RH, Stull validity, record sourcing, grouped-zone handling, limitations and uncertainty.
- [ ] Add source entries for NASA POWER/MERRA-2, CCKP future deltas, Stull, Magnus, and verified record authorities.
- [ ] Add the complete reproducibility/invariant test suite, including sensitivity and the France/USA/Brazil/India/China/Australia/Russia plus grouped-zone spot checks.
- [ ] Run tests, `npm run lint`, and `npm run build`; fix failures and record exact results.
- [ ] Review `git diff --check`, commit the pipeline/data, runtime/UI, and documentation in logical commits, then create a PR if GitHub tooling is available.
