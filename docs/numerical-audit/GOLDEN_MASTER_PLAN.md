# Golden master plan

Capture serialised, unrounded state plus UI-labelled values for each matrix cell; version input JSON hashes, Node version and scenario config. Do not treat outputs as scientific truth: they are `CURRENT_BASELINE`.

| Dimension | Required cases |
|---|---|
| Zones/countries | France, USA, China, India, Brazil, Nigeria, Norway, Saudi Arabia, Japan, Australia; plus grouped-zone member, territory without ISO, low-population/limited-data map feature. |
| Years | 1901, 2025, 2026, 2030, 2050, 2080, 2095, 2100, 2101, 2200. |
| Scenarios | BAU, delayed, sobriety; one valid URL-custom case and bound inputs. |
| Outputs | Global state, per-zone temperature/P99/RH/Tw, EROI/CO2/SLR, crop/kcal/mortality/cohorts, water lookup metadata, habitability key/reasons, display rounded strings. |

Store fixtures by semantic group, compare numeric values with explicit absolute/relative tolerances only where platform floating point makes exact equality unsuitable. Separately snapshot null versus value and projection method/source year; those provenance fields are material behaviour.
