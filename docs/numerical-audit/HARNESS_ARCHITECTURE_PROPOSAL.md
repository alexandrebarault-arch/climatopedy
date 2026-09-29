# Harness architecture proposal

Keep production code unchanged initially. Add a test-only numerical harness with four layers:

```text
Fast: pure-function vectors + property/invariant tests
  -> Full: fast + data-contract checks + trajectory integration + golden master
  -> Report: changed inputs/formulas/outputs, tolerance deltas, null/provenance changes
```

Suggested structure: `tests/numerical/unit/` for ALG vectors; `tests/numerical/properties/` for invariants; `tests/numerical/golden/fixtures/` with input manifest and raw expected state; `scripts/reportNumericalImpact.ts` to compare two fixture runs without writing production data. Build a test adapter only if direct serialisation becomes unstable.

Run Fast on every change; Full in CI/nightly or when `src/engine`, `src/data`, scenario config, or formatters change. Report changes by indicator, country/zone/year/scenario, absolute/relative delta, data class, and source-year/method transition. Gate critical invariant failures and unintended golden/provenance deltas; require explicit reviewed fixture update for intentional baseline changes.
