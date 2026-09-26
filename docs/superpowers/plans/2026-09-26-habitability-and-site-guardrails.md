# Habitability Labels and Site Structure Guardrails Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clarify future country results with a model-qualified habitability status, hide historical records in future years, and document and test the stable structure of the site.

**Architecture:** A pure helper maps simulated wet-bulb peak and calories to one of three qualified statuses. A second pure rule controls historical record visibility. A shared six-section contract provides the canonical IDs and labels for top-level navigation; focused contract tests guard its connection to navigation and `App.tsx`. A maintained French architecture guide documents page composition and data/state flow.

**Tech Stack:** React, TypeScript, Node built-in test runner, `tsx`, Vite; no new dependencies.

**Spec:** `docs/superpowers/specs/2026-09-26-site-structure-and-habitability-design.md`

## Global Constraints

- Do not declare a country factually habitable or uninhabitable.
- Use existing thresholds only: wet-bulb 26°C and 31°C, and the model reference 2,100 kcal/person/day.
- Hide every historical absolute-temperature record for simulation years after 2026; keep source data intact.
- Keep current map fills, thermal alerts, and detailed numerical outputs.
- Keep six top-level sections; FAQ and tutorial remain map-page entry points, not top-level pages.
- Add no browser-test framework or external dependency.

## Review Focus

- Boundary values exactly at Tw 26°C and 31°C and calories 2,100 kcal/day must follow the inclusive comparisons in the spec.
- If food and heat both indicate constraints, the more severe heat category must win.
- Missing or non-finite inputs must not silently produce a favorable status.
- Historical records must remain visible at year 2026 and be hidden for every year above 2026.
- A navigation section must not silently disappear from the page rendering contract or vice versa.

---

### Task 1: Pure habitability and record-visibility rules

**Files:**
- Create: `src/engine/habitabilityStatus.ts`
- Create: `tests/habitabilityStatus.test.ts`

**Interfaces:**
- `getHabitabilityStatus(wetBulbPeakC: number, caloriesKcalPerPersonDay: number): HabitabilityStatus | null`
- `HabitabilityStatus` has `key: 'favorable' | 'constrained' | 'major'`, a French `label`, a French `explanation`, and `severity: 'low' | 'medium' | 'high'`.
- `shouldShowHistoricalTemperatureRecord(year: number): boolean` returns true only for finite years `<= 2026`.

- [ ] **Step 1: Add failing boundary tests**

Test `getHabitabilityStatus` for `(25.99, 2100)` → `favorable`; `(26, 2100)` → `constrained`; `(30.99, 2100)` → `constrained`; `(31, 2100)` → `major`; `(25, 2099)` → `constrained`; `(31, 1900)` → `major`. Assert each returned explanation identifies the indicator as model-based and no label/explanation calls a zone literally uninhabitable. Assert `NaN`/infinite inputs return `null`.

Test `shouldShowHistoricalTemperatureRecord` returns true for 2026 and 2019; false for 2026.01, 2100, and non-finite input.

- [ ] **Step 2: Run tests and verify they fail**

Run: `node --import tsx --test tests/habitabilityStatus.test.ts`  
Expected: FAIL because the helper module/functions do not yet exist.

- [ ] **Step 3: Implement the pure rules**

Implement the exact comparisons from the spec. Apply major heat status first (`wetBulbPeakC >= 31`), constrained second (`wetBulbPeakC >= 26 || calories < 2100`), and favorable otherwise. Return `null` when either input is not finite. Use French copy that explicitly says “dans le modèle”.

- [ ] **Step 4: Run the focused tests**

Run: `node --import tsx --test tests/habitabilityStatus.test.ts`  
Expected: all boundary and invalid-input tests pass.

- [ ] **Step 5: Commit the tested rule**

```bash
git add src/engine/habitabilityStatus.ts tests/habitabilityStatus.test.ts
git commit -m "Add model-qualified habitability status rules"
```

### Task 2: Shared site-section contract and regression tests

**Files:**
- Create: `src/data/siteSections.ts`
- Modify: `src/components/TopBar.tsx`
- Modify: `src/App.tsx`
- Create: `tests/siteStructure.test.ts`

**Interfaces:**
- `SITE_SECTIONS` is an `as const` six-entry list; each entry contains `id`, `desktopLabel`, `mobileLabel`, and `primaryView`.
- `AppTabType` is derived from `SITE_SECTIONS[number]['id']` and re-exported from `TopBar.tsx` for existing consumers.
- Contract IDs are exactly `map`, `comparative-dashboard`, `tipping-points`, `causal`, `spec`, and `sources`, each with its current primary view component.

- [ ] **Step 1: Add failing contract tests**

Test that IDs are unique and equal the six expected IDs. For each entry, read `TopBar.tsx` and assert its ID and desktop/mobile labels are represented in navigation; read `App.tsx` and assert it has a render branch for that ID and references the declared primary view. Assert map-page anchors include `WorldMap`, `TimelineController`, `ComparisonModePanel`, and `KpiCharts`. Keep checks focused on IDs and primary components, not utility CSS or incidental text.

- [ ] **Step 2: Run tests and verify failure**

Run: `node --import tsx --test tests/siteStructure.test.ts`  
Expected: FAIL because the shared section contract does not yet exist.

- [ ] **Step 3: Add and consume the section contract**

Create the six-entry contract. Derive/re-export `AppTabType`; have `TopBar` use the contract IDs and desktop/mobile labels for its six existing navigation items while preserving icons, styling, and order. Have `App.tsx` consume the derived type for the selected section and retain the current six render branches; do not move page internals or change state ownership.

- [ ] **Step 4: Run contract tests and TypeScript**

Run: `node --import tsx --test tests/siteStructure.test.ts`  
Run: `npm run lint`  
Expected: all contract checks pass and TypeScript exits successfully.

- [ ] **Step 5: Commit the shared structure contract**

```bash
git add src/data/siteSections.ts src/components/TopBar.tsx src/App.tsx tests/siteStructure.test.ts
git commit -m "Define and guard top-level site sections"
```

### Task 3: Show status and hide future-year records

**Files:**
- Modify: `src/components/WorldMap.tsx`
- Modify: `src/components/CountryInspector.tsx`
- Modify: `tests/siteStructure.test.ts`

**Interfaces:**
- Consume `getHabitabilityStatus` and `shouldShowHistoricalTemperatureRecord` from Task 1.
- Both views derive the status from the current `CountryDynamicState` used for their numerical display and the same selected simulation year.

- [ ] **Step 1: Add failing UI-wiring assertions**

Add structural assertions that `WorldMap.tsx` and `CountryInspector.tsx` each call the shared status helper and gate record rendering through `shouldShowHistoricalTemperatureRecord`. They must fail before either view is wired to the helper.

- [ ] **Step 2: Run the focused contract test and verify failure**

Run: `node --import tsx --test tests/siteStructure.test.ts`  
Expected: FAIL on missing helper wiring in the views.

- [ ] **Step 3: Wire the two views**

Place the same concise badge beside the selected zone name in both views. Show its explanation as nearby text or an accessible title/tooltip. Keep map fills and existing warnings unchanged. Wrap each record card in `shouldShowHistoricalTemperatureRecord(simulationState.year)`; do not alter record values or registry. If either simulation input is unavailable, render no status rather than a default category.

- [ ] **Step 4: Run focused tests and type checking**

Run: `node --import tsx --test tests/habitabilityStatus.test.ts tests/siteStructure.test.ts`  
Run: `npm run lint`  
Expected: focused tests pass and TypeScript exits successfully.

- [ ] **Step 5: Commit the UI behavior**

```bash
git add src/components/WorldMap.tsx src/components/CountryInspector.tsx tests/siteStructure.test.ts
git commit -m "Show habitability status and hide future records"
```

### Task 4: Technical architecture guide and full validation

**Files:**
- Create: `docs/site-architecture.md`
- Modify: `tests/siteStructure.test.ts` to ensure the guide covers required section IDs and verification commands.

**Interfaces:**
- The guide documents the implemented `SITE_SECTIONS` IDs, App state owners, navigation, six page views, map composition, overlays, URL query parameters, climate/simulation/geometry/science data flow, and validation commands.

- [ ] **Step 1: Add failing documentation coverage checks**

Test that `docs/site-architecture.md` exists and includes all six `SITE_SECTIONS` IDs, the map composition components, state ownership/URL behavior, and `npm test`, `npm run lint`, and `npm run build` commands.

- [ ] **Step 2: Run the documentation contract and verify failure**

Run: `node --import tsx --test tests/siteStructure.test.ts`  
Expected: FAIL because the guide does not yet exist.

- [ ] **Step 3: Write the guide from the current implementation**

Document the actual page responsibilities and data flow. Include a “when changing site structure” checklist that points engineers to update the contract, navigation, render branches, tests, and this guide together. Do not state that a structural change is forbidden.

- [ ] **Step 4: Run all verification commands**

Run: `npm test`  
Run: `npm run lint`  
Run: `npm run build`  
Run: `git diff --check`  
Expected: all tests pass, TypeScript succeeds, the production build succeeds, and diff check emits no whitespace errors.

- [ ] **Step 5: Commit the architecture guide and final contract assertions**

```bash
git add docs/site-architecture.md tests/siteStructure.test.ts
git commit -m "Document site architecture and regression contract"
```
