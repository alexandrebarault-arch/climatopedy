# Numerical Harness V0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a local-only V0 numerical regression harness that freezes current product behaviour and blocks local commits when FAST checks fail.

**Architecture:** Keep production algorithms unchanged. Add test-only TypeScript helpers, explicit V0 fixtures/manifests, FAST/FULL runner scripts, impact reporting, documentation, and an opt-in Git hooks installer. Baselines are never rewritten by normal test execution.

**Tech Stack:** Node 22-compatible TypeScript, existing `tsx` test runner, Node `node:test`, npm scripts, native Git hooks.

**Spec:** `docs/superpowers/specs/2026-09-28-numerical-harness-v0-design.md`

## Global Constraints

- `PRODUCT_REFERENCE_SHA=907fcb63fede8dc53df7e861bfd0b5745bcdc831`.
- `GOLDEN_MASTER_VERSION=V0` and `REFERENCE_TYPE=CURRENT_PRODUCT_REFERENCE`.
- Do not modify formulas, datasets, fallbacks, projections, UI behaviour, or GitHub Actions.
- Missing values remain distinct from zero; nullable Tw and provenance/method fields are material outputs.
- Fixture updates require an explicit command and human review; FAST/FULL never regenerate fixtures.
- All execution is local; no push, PR, merge, or global installation is required.

## Review Focus

- Migration origin/destination order can change results: permutation tests record status and deltas without correcting it.
- Stull low-level clamping differs from scenario nullability: vectors cover both APIs and domain edges.
- Water access/stress horizon holding through 2200 is labelled, not corrected.
- Missing, zero, NaN and Infinity inputs remain distinguishable in adapters and invariants.
- Golden comparisons detect provenance/nullability changes even when numeric values are unchanged.

### Task 1: Harness contracts and tolerance utilities

**Files:** Create `tests/numerical/support/tolerances.ts`, `tests/numerical/support/finite.ts`, `tests/numerical/support/manifest.ts`, `tests/numerical/unit/harnessContracts.test.ts`.

- [ ] Write failing tests for absolute/relative comparison, finite-value scanning, nullable fields, and manifest constants.
- [ ] Run `node --import tsx --test tests/numerical/unit/harnessContracts.test.ts`; expect missing-module failures.
- [ ] Implement `compareNumber(actual, expected, tolerance)`, `scanFinite(value, path)`, and `GOLDEN_MASTER_MANIFEST` with explicit tolerances and reference metadata.
- [ ] Re-run focused test and then `npm test`.
- [ ] Commit `test: add numerical harness contracts`.

### Task 2: Pure-function reference vectors and critical invariants

**Files:** Create `tests/numerical/unit/referenceVectors.test.ts`, `tests/numerical/properties/coreInvariants.test.ts`, `tests/numerical/properties/dataMissingness.test.ts`.

- [ ] Add red tests for Stull vectors/domain edges, EROI floors, heat/temperature adapters, water horizon metadata, habitability nullability, URL bounds, and display bands.
- [ ] Add red tests for finite state values, ordering, population/cohort conservation, global aggregation, crop/calorie bounds, and null/undefined/0/NaN/Infinity distinctions.
- [ ] Run focused files and confirm failures identify uncovered contracts rather than test syntax errors.
- [ ] Implement only test adapters/helpers needed to serialize existing exports; do not change `src/engine`.
- [ ] Run focused files and `npm test`.
- [ ] Commit `test: characterize core numerical algorithms`.

### Task 3: Golden capture, fixtures, and deterministic comparison

**Files:** Create `tests/numerical/golden/capture.ts`, `tests/numerical/golden/compare.ts`, `tests/numerical/golden/cases.ts`, `tests/numerical/golden/fixtures/v0/manifest.json`, `tests/numerical/golden/fixtures/v0/reference.json`, `tests/numerical/golden/goldenMaster.test.ts`.

- [ ] Write a red test asserting the required country/year/scenario matrix, serialized raw/display outputs, input hashes, and no fixture mutation during comparison.
- [ ] Implement capture through existing public engine APIs for France, USA, China, India, Brazil, Nigeria, Norway, Saudi Arabia, Japan, Australia plus grouped/limited-data cases; use years 1901, 2025, 2026, 2030, 2050, 2080, 2095, 2100, 2101, 2200 and BAU/delayed/sobriety.
- [ ] Generate V0 fixtures only through an explicit `--write-fixture` command, review output, then lock normal test mode to read-only comparison.
- [ ] Verify golden tests detect a deliberate temporary fixture delta, restore the fixture, and pass.
- [ ] Run `npm test` and commit `test: freeze numerical golden master v0`.

### Task 4: Migration, water, proxy, and aggregate characterization

**Files:** Create `tests/numerical/properties/migrationOrder.test.ts`, `tests/numerical/properties/waterHorizon.test.ts`, `tests/numerical/properties/globalAggregates.test.ts`, `tests/numerical/properties/proxySemantics.test.ts`.

- [ ] Add red tests for all migration permutations and classify `ORDER_INDEPENDENT`, `ORDER_DEPENDENT`, or `INCONCLUSIVE` with measured deltas.
- [ ] Add horizon tests for within-horizon, at-horizon, and beyond-horizon access/stress, preserving source year/method and proxy labels.
- [ ] Add aggregate sum/weighted-mean tests and CCKP P99/RH proxy provenance tests.
- [ ] Implement test-only characterization/report helpers without changing production behaviour.
- [ ] Run focused tests and commit `test: characterize order horizon proxy and aggregate behaviour`.

### Task 5: FAST/FULL runners and Numerical Impact Report

**Files:** Create `scripts/harnessFast.ts`, `scripts/harnessFull.ts`, `scripts/reportNumericalImpact.ts`, `tests/numerical/runnerCommands.test.ts`, modify `package.json` scripts.

- [ ] Write red command-contract tests for `npm run harness:fast`, `npm run harness:full`, and report output fields.
- [ ] Implement FAST as vectors + critical properties + golden subset; implement FULL as FAST + complete golden matrix + permutations + integration/statistics/impact report.
- [ ] Implement report fields for cases tested/unchanged/changed, algorithms/countries/years/scenarios, median/P95 deltas, largest deltas, NaN/Infinity, invariant failures, known/unexpected failures.
- [ ] Verify each runner exits non-zero for an intentional failure and does not rewrite V0 fixtures.
- [ ] Run both commands and commit `feat: add local numerical harness runners`.

### Task 6: Documentation and local commit hook

**Files:** Create `docs/numerical-harness/README.md`, `GOLDEN_MASTER_V0.md`, `GOLDEN_MASTER_UPDATE_POLICY.md`, `INVARIANTS.md`, `REFERENCE_VECTORS.md`, `KNOWN_NUMERICAL_ISSUES.md`, `KNOWN_FAILURES.md`, `RUNBOOK.md`, `CI_POLICY.md`, `SCIENTIFIC_VALIDATION_BACKLOG.md`, `NUMERICAL_IMPACT_REPORT_SPEC.md`, `.githooks/pre-commit`, `scripts/installLocalHarnessHook.ps1`, `tests/numerical/hookInstaller.test.ts`.

- [ ] Write red tests for documentation command references and hook behaviour (FAST blocks failure; FULL is never implicit).
- [ ] Implement the opt-in installer using `git config core.hooksPath .githooks` in the current worktree only; make the hook invoke `npm run harness:fast` and propagate failure.
- [ ] Document no GitHub Actions changes, local-only execution, fixture approval, known risks, proxy semantics, horizons, order status and scientific backlog.
- [ ] Run hook/documentation tests and `git diff --check`; commit `feat: add local pre-commit numerical guard`.

### Task 7: Full verification and final review

- [ ] Run `npm test`, `npm run harness:fast`, `npm run harness:full`, `npm run lint`, and relevant existing audits without altering production reports unexpectedly.
- [ ] Inspect `git diff --stat`, `git diff --check`, status, commit log, and primary checkout status.
- [ ] Generate the final Numerical Impact Report and confirm all required final-report fields.
- [ ] Commit any documentation-only corrections as an atomic follow-up.
