# Plan: country access data and future water risk

## Goal

Enrich country inspection with traceable observed drinking-water access, food insecurity, electricity access, and clean-cooking access. Add projected water stress as a separate, scenario-labelled layer at only the horizons supplied by the source. Never present a shared simulation-zone value as a national observation, or extend observations into future years.

## Steps

1. **Country identity and data contracts**
   - [x] Add a reviewed join from map feature identifiers to ISO alpha-3 codes.
   - [x] Preserve map name, ISO code, source code, reference year, value, completeness, and source URL.
   - [x] Test every mapped feature, duplicate ISO assignments, and unknown or ambiguous territories.
2. **Observed country context**
   - [x] Use WHO/UNICEF JMP safely managed drinking-water coverage (World Bank WDI `SH.H2O.SMDW.ZS`).
   - [x] Use FAOSTAT SDG 2.1.2 moderate-or-severe food insecurity (FIES).
   - [x] Use Tracking SDG 7 / World Bank WDI electricity access (`EG.ELC.ACCS.ZS`) and clean cooking (`EG.CFT.ACCS.ZS`).
   - [x] Preserve each indicator's latest observed year; do not interpolate missing years or show it as a future projection.
3. **Future water-risk layer**
   - [x] Ingest WRI Aqueduct 4.0 country indicators, scenarios, and milestone horizons.
   - [x] Keep drinking-water service access separate from basin water stress.
   - [x] Show only actual source horizons and label scenario, vintage, aggregation, and limitations.
4. **Country inspector and map**
   - [x] Show observed context in its own dated section in the inspector, distinct from simulated future values.
   - [x] Add water stress as an independent selectable map layer after its country join passes the coverage audit.
   - [x] Leave the main habitability status unchanged because the indicators are not directly comparable.
5. **Verification and documentation**
   - [x] Test source snapshots, provenance, missing-data behavior, ISO joins, and observation years.
   - [x] Generate a country-by-country coverage report with WDI and Aqueduct gaps.
   - [x] Run the full test suite, type-check, data audit, and production build; record their result.

## Acceptance criteria

- Observed values are keyed to the clicked national feature, not its broader simulation zone.
- The interface visibly distinguishes observed data from conditional model output.
- Missing values are shown as unavailable, never as zero or as a regional substitute.
- Future water values are shown only for the available horizons and scenario.
- Coverage counts and source vintages are documented next to the data contract.

## Source references checked

- WHO/UNICEF JMP 2025 household update and estimation methods.
- FAOSTAT SDG Indicators, indicator 2.1.2 (FIES).
- World Bank WDI / Tracking SDG 7 electricity and clean-cooking access.
- WRI Aqueduct 4.0 country rankings and technical note.
