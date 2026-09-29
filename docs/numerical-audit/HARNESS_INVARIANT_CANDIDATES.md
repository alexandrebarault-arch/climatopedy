# Harness invariant candidates

| ID | Description / scope | Severity | Candidate algorithms |
|---|---|---|---|
| INV-001 | All exposed state values finite except explicit nullable Tw. | CRITICAL | ALG-004–011 |
| INV-002 | Tmin ≤ mean ≤ Tmax; P99 ≥ annual Tmax; 0≤RH≤100; Tw≤Ta. | CRITICAL | ALG-003–005 |
| INV-003 | Stull scenario returns null iff inputs outside published domain. | HIGH | ALG-003 |
| INV-004 | cohorts and world population non-negative; total=sum cohorts. | CRITICAL | ALG-011 |
| INV-005 | world totals equal country sums; global kcal/yield use population-weighting. | HIGH | ALG-009/011 |
| INV-006 | EROI≥1.05, net energy ∈[.01,1), capital≥.25, nitrogen≥.20. | HIGH | ALG-007/009 |
| INV-007 | crop yield≥.12, calories∈[400,3500], deficit∈[0,100], flood∈[0,.35]. | HIGH | ALG-010 |
| INV-008 | URL controls stay within declared bounds and same URL yields same scenario. | MEDIUM | ALG-014 |
| INV-009 | absent data remains null/unavailable, never zero/observed. | CRITICAL | ALG-003/013/012 |
| INV-010 | water zone percentage equals weighted numerator/denominator and lies [0,100]. | HIGH | ALG-013 |
| INV-011 | trajectories cover requested integer years exactly, deterministic for fixed config. | HIGH | ALG-009 |
| INV-012 | map/inspector class use identical object inputs and shared classifier. | MEDIUM | ALG-012/UI |
