# Résultat de l’audit des températures 1901–2200

- Pays/territoires de la carte exportés : 177.
- Zones climatiques simulées : 34; les membres d’une même zone partagent les mêmes températures.
- Années : 300 par pays, pour trois scénarios futurs (BAU, intermédiaire, sobriété), soit 53100 lignes pays-année.
- Températures absentes ou non finies dans les calculs : 0.
- Violations Tmin ≤ moyenne annuelle ≤ Tmax : 0.
- Écart de température moyenne 2025→2026 parmi les zones/scénarios : 0.023 à 0.042 °C.
- Zones africaines dans le scénario BAU : nafr, egy, nga, eth, cod, eaf, zaf.

| Zone africaine | Tmax moyenne journalière 2026 | 2100 | 2200 | Tw caniculaire 2100 |
|---|---:|---:|---:|---:|
| nafr | 30.0 °C | 34.3 °C | 34.6 °C | 21.7 °C |
| egy | 30.0 °C | 34.0 °C | 34.4 °C | 21.5 °C |
| nga | 31.9 °C | 35.3 °C | 35.6 °C | 21.4 °C |
| eth | 33.2 °C | 36.5 °C | 36.8 °C | 23.6 °C |
| cod | 29.1 °C | 32.5 °C | 32.8 °C | 25.3 °C |
| eaf | 30.2 °C | 33.4 °C | 33.8 °C | 22.8 °C |
| zaf | 28.2 °C | 32.3 °C | 32.7 °C | 21.2 °C |

## Lecture et limites

Le bleu aperçu en Afrique concernait le calque Tw, calculé à partir d’une humidité de scénario estimée et faible dans plusieurs zones arides; il ne signifiait pas que la température de l’air y était basse. Le calque par défaut affiche maintenant la moyenne annuelle des Tmax quotidiennes. Il ne s’agit ni du record absolu ni du pic caniculaire P99.

Les années 1901–2025 réutilisent les anomalies mondiales annuelles NASA GISTEMP, recalées pour que 2025 corresponde à l’ancre interne du site, puis appliquées au normal ponctuel 1991–2020 avec un facteur régional. Elles ne sont pas des observations météorologiques nationales. Les pays réunis en une zone partagent une valeur représentative.

De 2026 à 2100, l’évolution annuelle des températures moyennes/minimales/maximales provient de l’interpolation du changement CMIP6 CCKP 2020–2039 à 2080–2099. Après 2100, la composante régionale CCKP est maintenue à son niveau de fin de siècle, puis l’anomalie supplémentaire du modèle global CLIMATOPEDY est appliquée au facteur régional. Cette extension jusqu’en 2200 est exploratoire, dépend du scénario interne et n’est pas une projection CMIP6 ou du GIEC.

Le CSV détaille chaque polygone de pays, la zone simulée partagée et, pour chaque scénario, Tmin annuelle moyenne, Tmean, Tmax annuelle moyenne, scénario de canicule, humidité et Tw. Les champs vides pour Tw signifient que la formule de Stull est hors domaine.
