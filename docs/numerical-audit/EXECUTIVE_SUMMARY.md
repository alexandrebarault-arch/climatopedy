# Executive summary — numerical reverse engineering

`MISSION = CLIMATOLOGY_NUMERICAL_REVERSE_ENGINEERING`

Climatopedy is a client-side React/Vite system with embedded, versioned data snapshots—not a runtime backend. A 34-zone numerical model feeds 174 map features. The principal chain is climate proxies and CCKP deltas → annual simulation state → country/global aggregation → shared habitability classification and React display.

Approximately 15 material numerical chains were identified. Eight source families were found, including NASA POWER/MERRA-2, NASA GISTEMP, CCKP, WRI, IIASA, WDI, static zone parameters and an internal historical benchmark. Data provenance is strongest for the temperature and water snapshots; the scientific derivation of internal model coefficients is not fully reconstructible from repository evidence.

Existing verification is meaningful but narrow: it executes a complete temperature internal-consistency sweep and tests selected climate/habitability presentation behaviour. Core energy/carbon/food/mortality/migration/demography equations have no direct numerical reference-vector coverage. Current results are therefore an implementation baseline, not a scientific reference.

Highest-priority risks are order-dependent migration mutation, uncalibrated hard-coded core relationships, projection proxies/linear interpolation, reconstructed historic national values, and long post-horizon holding of water values. These are documented as risks/limitations; this audit does not claim they are errors.

Recommended next step: freeze representative raw outputs for the country/year/scenario matrix, then implement pure-function invariants and reference vectors before any model changes. Follow with aggregation/migration integration checks and numerical-impact reporting.

See the companion registry, lineage, coverage, risk, invariant, golden-master and architecture documents in this directory for file/function/line evidence.
