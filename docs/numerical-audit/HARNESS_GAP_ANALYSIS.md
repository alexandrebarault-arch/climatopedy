# Harness gap analysis

Present: deterministic TypeScript core; committed data snapshots; temperature-quality sweep; basic unit and source-wiring checks; CI runs `npm run verify` (`.github/workflows/verify.yml`).

Missing for a numerical validation harness:

1. Direct unit tests and reference vectors for every core formula and edge case.
2. State conservation/aggregation/property tests for each yearly step, including migration order sensitivity.
3. Frozen golden outputs covering inputs/scenarios/years and display formatting.
4. Dataset schema/hash/provenance tests plus documented source refresh/re-generation procedure.
5. Explicit tolerance policy and separation of `observed`, `proxy`, `derived`, `estimated`, `modelled`, and `post-horizon-reference` claims.
6. External scientific validation—out of scope and not implied by current baseline tests.

Priority: (1) preserve baseline fixtures and invariants; (2) unit-test core; (3) integration UI/state lineage; (4) statistical regression and scientific review.
