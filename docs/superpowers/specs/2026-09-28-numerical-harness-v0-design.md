# Numerical Harness V0 — design

## Intent and boundary

Protect `CURRENT_PRODUCT_REFERENCE` at product SHA
`907fcb63fede8dc53df7e861bfd0b5745bcdc831` against numerical regressions.
The harness is a test-only subsystem: it must not alter formulas, input data,
fallbacks, or UI behaviour. Its V0 baseline is an implementation reference,
not scientific validation.

Execution stays local by default. No GitHub Actions workflow is added or
modified; no push, PR, merge, or remote operation is required.

## Architecture

`tests/numerical/` contains deterministic Node test files and helpers:

1. `unit/` captures reference vectors for exported pure functions (including
   Stull, EROI, CCKP and heat-hazard adapters, water access/stress, historical
   benchmarks, URL normalisation and display bands).
2. `properties/` checks only audit-confirmed invariants: finite values,
   null-versus-zero semantics, published Stull domain, bounds, ordering,
   population/cohort and aggregation constraints, determinism, and migration
   order characterisation.
3. `golden/` generates a serialisable projection record from existing public
   engine APIs, compares it to V0 fixtures, and records every numeric,
   provenance, nullability and display difference.

Fixtures live under `tests/numerical/golden/fixtures/v0/`. The manifest pins
`GOLDEN_MASTER_VERSION=V0`, `REFERENCE_TYPE=CURRENT_PRODUCT_REFERENCE`, the
product SHA, Node version, selected input hashes, cases and explicit tolerance
policy. Fixture update code is deliberately separate from comparison code and
requires an explicit command; normal tests never rewrite fixtures.

## Commands and local commit guard

`npm run harness:fast` runs pure vectors, critical properties, reference data
contracts and a small golden subset. `npm run harness:full` runs FAST plus the
full country/year/scenario matrix, migration permutations, integration
characterisations and the impact report.

The repository will include `.githooks/pre-commit` and an explicit local
installer command. The installer sets `core.hooksPath=.githooks` only in the
current clone/worktree. The hook invokes `npm run harness:fast`, so a failing
critical check blocks a local commit. Git does not version this configuration;
the installer and hook source are versioned to make opt-in reproducible.
`HARNESS FULL` remains manual, to avoid unexpectedly expensive commits.

## Reporting and documented limitations

The full run writes a deterministic Numerical Impact Report to a non-source
report location. It includes case coverage, per-value deltas, aggregate delta
statistics, NaN/Infinity counts, invariant failures, known failures and
unexpected failures. The report never changes fixtures.

Documentation under `docs/numerical-harness/` defines tolerances, local CI
policy, fixture updates subject to human review, observed/proxy distinctions,
known numerical issues/failures, runbook and the scientific-validation backlog.
Migration order, CCKP P99/RH proxy behaviour, water horizons and the multiple
Stull APIs are characterised as current behaviour; none is corrected.

## Verification

Each harness component begins with a failing Node test. Verification includes
the focused test, `npm test`, `npm run harness:fast`, `npm run harness:full`,
type-check and the existing relevant project checks. No build is used merely
to prove the harness if it regenerates unrelated report files; it is executed
only when its expected output scope is understood and preserved.
