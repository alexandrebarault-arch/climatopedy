# Données pays : accès et stress hydrique

## Ce que la carte et la fiche affichent

La fiche d’un pays affiche quatre indicateurs d’accès observés, chacun avec son année propre : eau potable gérée en toute sécurité, insécurité alimentaire modérée ou grave, accès à l’électricité et accès aux combustibles et technologies de cuisson propres. La valeur nationale est rattachée au code ISO3 du polygone cliqué, jamais à la zone climatique voisine. Le curseur de simulation ne déplace pas ces années d’observation.

La couche **Stress hydrique projeté** est indépendante. Elle affiche le score Aqueduct 4.0 « baseline water stress » agrégé à l’échelle nationale, aux horizons publiés 2030, 2050 ou 2080 et sous les scénarios optimiste, tendanciel ou pessimiste. Ce score est dérivé des bassins et pondéré par la demande totale en eau. Ce n’est pas une mesure de l’eau potable disponible dans chaque foyer; les valeurs manquantes apparaissent en gris.

Ni la couche ni les taux d’accès ne sont fusionnés dans le statut d’habitabilité de CLIMATOPEDY. Les unités et concepts ne sont pas interchangeables et les observations ne fournissent pas de projections nationales futures.

## Couverture contrôlée

Le rapport pays par pays généré se trouve dans [`country-context-country-by-country.json`](country-context-country-by-country.json). Il contient chaque polygone, son code ISO, les observations par indicateur et les neuf combinaisons Aqueduct attendues. Régénérer le rapport avec `npm run audit:data-country`.

Instantané WDI récupéré le 26 septembre 2026 (UTC) et Aqueduct téléchargé le 27 septembre (heure locale), sur 177 polygones de carte :

| Indicateur observé | Code | Polygones avec valeur parmi les 177 polygones de carte |
| --- | --- | ---: |
| Eau gérée en toute sécurité | `SH.H2O.SMDW.ZS` | 124 |
| Insécurité alimentaire modérée ou grave | `SN.ITK.MSFI.ZS` | 137 |
| Électricité | `EG.ELC.ACCS.ZS` | 169 |
| Cuisson propre | `EG.CFT.ACCS.ZS` | 162 |

174 codes ISO3 distincts sont reconnus par les polygones de carte. Le rapport Aqueduct contient 164 pays; 160 de ces codes ISO3 recoupent la carte. Kosovo, Somaliland et Chypre du Nord ne disposent pas ici de code ISO3 reconnu et reçoivent donc aucune valeur nationale. Les autres absences sont consignées dans le rapport; elles ne sont jamais remplacées par zéro ou par une donnée régionale.

Exemple de la fiche **France** dans l’instantané WDI : eau gérée en toute sécurité **99,7 % (2024)**, insécurité alimentaire modérée ou grave **8,4 % (2023)**, accès à l’électricité **100 % (2024)** et cuisson propre **100 % (2023)**. Ce sont les observations les plus récentes présentes pour chaque série dans l’instantané, et non des mesures de l’année 2026.

## Provenance et limites

- Eau potable : WHO/UNICEF JMP, diffusé via l’indicateur WDI `SH.H2O.SMDW.ZS`. La définition « safely managed » exige une source améliorée, sur place, disponible quand nécessaire et sans contamination. [Rapport JMP 2025](https://washdata.org/reports/jmp-2025-wash-households) · [API WDI](https://api.worldbank.org/v2/country/all/indicator/SH.H2O.SMDW.ZS?format=json).
- Insécurité alimentaire : FAO FIES / ODD 2.1.2, série WDI `SN.ITK.MSFI.ZS`. Les enquêtes, années et périodes de référence diffèrent selon le pays. [Métadonnées FAO](https://www.fao.org/sustainable-development-goals-data-portal/data/indicators/212-prevalence-of-moderate-or-severe-food-insecurity-in-the-population-based-on-the-food-insecurity-experience-scale/2/) · [API WDI](https://api.worldbank.org/v2/country/all/indicator/SN.ITK.MSFI.ZS?format=json).
- Électricité et cuisson propre : séries WDI `EG.ELC.ACCS.ZS` et `EG.CFT.ACCS.ZS`, sous le partenariat Tracking SDG 7. [Rapport 2026](https://www.worldbank.org/en/news/press-release/2026/06/16/accelerating-universal-energy-access) · [API électricité](https://api.worldbank.org/v2/country/all/indicator/EG.ELC.ACCS.ZS?format=json) · [API cuisson propre](https://api.worldbank.org/v2/country/all/indicator/EG.CFT.ACCS.ZS?format=json).
- Stress hydrique : WRI Aqueduct 4.0, classeur pays téléchargé depuis le [Data Explorer](https://datasets.wri.org/datasets/aqueduct-40-current-and-future-country-rankings), onglet `country_future`, indicateur `bws`, agrégation `Tot`. Le catalogue signale une mise à jour au 22 septembre 2026, tandis que le classeur fourni porte le millésime `Y2023M07D05`; les deux dates sont conservées dans la provenance. [Note méthodologique](https://www.wri.org/research/aqueduct-40-updated-decision-relevant-global-water-risk-indicators).
- Les identifiants Natural Earth numériques sont convertis en ISO3 au moyen du fichier de correspondance [datasets/country-codes](https://github.com/datasets/country-codes); les deux entités françaises découpées sont codées explicitement `FRA` et `GUF`.

WDI et Aqueduct agrègent des sources, populations, périodes et méthodes différentes. Les taux d’accès nationaux masquent les écarts entre régions et groupes sociaux. Aqueduct dit que ses scores composites de risque global ne sont pas directement validables et les présente comme outil de priorisation. Il faut lire un score national comme signal de comparaison, pas comme diagnostic local ou garantie d’accès.

## Rafraîchir et vérifier

1. Rafraîchir les séries WDI et leurs années d’observation : `npx tsx scripts/updateCountryContextObserved.ts`.
2. Rafraîchir Aqueduct après vérification de la version du classeur et de la date de mise à jour catalogue dans le portail WRI : installer les dépendances optionnelles avec `python -m pip install -r requirements-data.txt`, puis passer la date vérifiée, par exemple `python scripts/updateAqueductCountryWaterStress.py --catalog-updated 2026-09-22`. Le script rejette les horizons, scénarios, scores, clés dupliquées ou combinaisons pays incomplètes.
3. Régénérer le contrôle détaillé : `npm run audit:data-country`.
4. Vérifier les contrôles automatisés et la production avec `npm test`, `npm run lint` et `npm run build`.

Le test contrôle les valeurs et années, les clés ISO, les entités sans code reconnu, l’unicité des lignes Aqueduct et ses horizons/scénarios. Le rapport JSON sert de liste de contrôle pays par pays et rend visibles les lacunes sans les combler par extrapolation.
