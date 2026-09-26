# Résultat de l’audit chaleur/humidité 1901–2200

- Pays/territoires de la carte exportés : 177.
- Zones climatiques simulées : 34; les membres d’une même zone partagent les mêmes températures.
- Années : 300 par pays, pour trois scénarios futurs (BAU, intermédiaire, sobriété), soit 53100 lignes pays-année.
- Températures absentes ou non finies dans les calculs : 0.
- Violations Tmin ≤ moyenne annuelle ≤ Tmax : 0.
- P99/humidités manquants, non finis ou RH hors de 0–100 % : 0. RH hors domaine Stull (Tw non calculable pour ces cas) : 322.
- P99 inférieur à la moyenne annuelle des Tmax : 0. Tw non calculable (hors domaine Stull en température ou RH) : 557.
- Écart de température moyenne 2025→2026 parmi les zones/scénarios : 0.023 à 0.042 °C.
- Zones africaines dans le scénario BAU : nafr, egy, nga, eth, cod, eaf, zaf.

| Zone africaine | P99 2026 | P99 2100 | P99 2200 | RH 2026 | RH 2100 | RH 2200 | Tw 2100 |
|---|---:|---:|---:|---:|---:|---:|---:|
| nafr | 44.1 °C | 49.1 °C | 49.5 °C | 7.5% | 5.3% | 4.7% | 20.7 °C |
| egy | 43.5 °C | 47.6 °C | 48.0 °C | 7.8% | 6.4% | 6.0% | 20.6 °C |
| nga | 41.0 °C | 45.0 °C | 45.3 °C | 10.7% | 9.6% | 9.3% | 21.2 °C |
| eth | 39.0 °C | 42.7 °C | 43.0 °C | 18.4% | 18.5% | 18.5% | 23.9 °C |
| cod | 36.4 °C | 40.4 °C | 40.7 °C | 28.6% | 26.1% | 25.4% | 25.0 °C |
| eaf | 35.8 °C | 39.4 °C | 39.7 °C | 22.3% | 22.9% | 23.1% | 23.3 °C |
| zaf | 40.5 °C | 44.9 °C | 45.3 °C | 10.0% | 7.5% | 6.9% | 19.9 °C |

| Scénario France | Année | P99 chaud | RH jours chauds | Tw |
|---|---:|---:|---:|---:|
| Fortes émissions (modèle) | 2026 | 36.5 °C | 20.7% | 20.5 °C |
| Fortes émissions (modèle) | 2050 | 38.4 °C | 18.9% | 21.2 °C |
| Fortes émissions (modèle) | 2100 | 42.3 °C | 15.2% | 22.3 °C |
| Fortes émissions (modèle) | 2200 | 42.7 °C | 13.7% | 21.9 °C |
| Transition Modérée | 2026 | 36.5 °C | 20.7% | 20.5 °C |
| Transition Modérée | 2050 | 37.3 °C | 20.0% | 20.9 °C |
| Transition Modérée | 2100 | 38.9 °C | 18.8% | 21.5 °C |
| Transition Modérée | 2200 | 39.1 °C | 18.5% | 21.6 °C |
| Sobriété & Agroécologie | 2026 | 36.5 °C | 20.7% | 20.5 °C |
| Sobriété & Agroécologie | 2050 | 36.7 °C | 20.5% | 20.6 °C |
| Sobriété & Agroécologie | 2100 | 37.3 °C | 20.1% | 20.9 °C |
| Sobriété & Agroécologie | 2200 | 37.4 °C | 20.1% | 20.9 °C |

## Lecture et limites

Le bleu aperçu en Afrique concernait le calque Tw, calculé à partir d’une humidité de scénario estimée et faible dans plusieurs zones arides; il ne signifiait pas que la température de l’air y était basse. Le calque par défaut affiche la moyenne annuelle des Tmax quotidiennes. Le P99 chaud, cette moyenne et le record absolu sont trois mesures différentes.

Les années 1901–2025 réutilisent les anomalies mondiales annuelles NASA GISTEMP, recalées pour que 2025 corresponde à l’ancre interne du site, puis appliquées au normal ponctuel 1991–2020 avec un facteur régional. Elles ne sont pas des observations météorologiques nationales. Les pays réunis en une zone partagent une valeur représentative.

De 2026 à 2100, la moyenne/minima/maxima annuels viennent des deltas tas/tasmin/tasmax CCKP. Le P99 local est projeté avec le delta du TXx CCKP (maximum annuel de la Tmax quotidienne), proxy de variation d’extrême et non projection directe du quantile P99. L’humidité estimée des jours chauds reçoit le delta moyen Hurs des mois chauds; Hurs mensuel n’est pas l’humidité horaire simultanée au P99 et sa confiance régionale est moindre. Tw est recalculée avec les deux critères.

Après 2100, les deltas de température et d’humidité de fin de siècle sont prolongés au prorata de l’anomalie globale supplémentaire simulée par CLIMATOPEDY. La RH reste dans ses bornes physiques de 0–100 %; si elle sort du domaine validé de Stull (5–99 %), Tw est affichée NC au lieu de substituer artificiellement une humidité limite. La prolongation jusqu’en 2200 dépend du scénario interne et n’est pas une projection CMIP6 ou du GIEC.

Les métadonnées CCKP signalent que l’humidité n’est pas ajustée pour éliminer des résultats non physiques. Son delta est donc traité comme une hypothèse de faible confiance; les valeurs futures de RH et de Tw doivent être lues avec prudence, surtout pour les zones arides.

Le CSV détaille chaque polygone de pays, la zone simulée partagée et, pour chaque scénario, Tmin annuelle moyenne, Tmean, Tmax annuelle moyenne, scénario de canicule, humidité et Tw. Les champs vides pour Tw signifient que la formule de Stull est hors domaine.
