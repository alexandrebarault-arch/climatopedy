# Assumptions and fallbacks

| Evidence | Confirmed rule | Effect |
|---|---|---|
| `countryTemperatures.ts:12-21,40-48` | bau→SSP585, sobriety→SSP126, else→SSP245; 2026–2100 linear blend; regional fallback 1 | Internal scenario is not full SSP; unknown scenario silently maps to middle pathway. |
| `temperatureReference.ts:12-24` | app anchors 2025=1.318333…, 2026=1.34; post-2100 excess clamped ≥0 | Baseline is deliberately recalibrated. |
| `heatHazardProjections.ts:56-70` | P99 proxy from TXx; RH proxy from Hurs; RH physical clamp 0–100 | Future heat humidity is inferred, not simultaneous observation. |
| `physicsModel.ts:43-44,56-58` | raw Stull function clamps -25..55 and 5..99; scenario wrapper returns null outside published domain | Two different APIs have different out-of-domain behaviours. |
| `physicsModel.ts:65-69,208,214,229,233` | `qInf || default`; depletion cap .96; EROI/net/capital/nitrogen floors/caps | `qInf=0` chooses default; not an error. |
| `physicsModel.ts:345,358,364,369-373,379-433` | flood ≤.35, crop ≥.12, population divisor ≥.01, kcal 400..3500, resilience ≤.95, borders ≤.98 | Nonlinear model constrained against numerical extremes. |
| `waterAccessProjections.ts:65-83,123-131` | near horizon or last published value to 2200; absent key→null | 2095 access and 2080 stress can appear as explicit post-horizon reference. |
| `habitabilityStatus.ts:90-105` | highest available dimension wins; all unavailable/null; level zero with water unknown→null | Missingness can suppress a favourable class but not an adverse available signal. |
| `representativeLandPoints.ts:18-36` | ocean map centre → nearest land on 0.05° grid within 2° | Point selection is deterministic but spatially coarse. |

All numerical constants in `physicsModel.ts:17-36` and `:294-306` are confirmed code constants; scientific justification remains `STATUS=UNKNOWN` unless a cited source in the code supports it.
