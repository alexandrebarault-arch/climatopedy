# Données pays : accès et stress hydrique

## Ce que la carte et la fiche affichent

La fiche d’un pays affiche quatre indicateurs d’accès observés, chacun avec son année propre : eau potable gérée en toute sécurité, insécurité alimentaire modérée ou grave, accès à l’électricité et accès aux combustibles et technologies de cuisson propres. La valeur nationale est rattachée au code ISO3 du polygone cliqué, jamais à la zone climatique voisine. Le curseur de simulation ne déplace pas ces années d’observation.

La couche **Stress hydrique projeté** est indépendante. Elle affiche le score Aqueduct 4.0 « baseline water stress » agrégé à l’échelle nationale, aux horizons publiés 2030, 2050 ou 2080 et sous les scénarios optimiste, tendanciel ou pessimiste. Ce score est dérivé des bassins et pondéré par la demande totale en eau. Ce n’est pas une mesure de l’eau potable disponible dans chaque foyer; les valeurs manquantes apparaissent en gris.

La couche **Accès futur à l’eau** utilise les projections nationales du modèle IIASA Wat-San-Access pour cinq SSP et les forçages RCP2.6/RCP6.0. L’interface associe Sobriété→SSP1/RCP2.6, Transition modérée→SSP2/RCP6.0 et Fortes émissions→SSP5/RCP6.0; ce sont des scénarios socioéconomiques de référence, pas les mêmes modèles ni les mêmes hypothèses que CLIMATOPEDY. La série téléchargeable s’arrête en 2095. Après 2095, le scénario de référence maintient le taux d’accès de 2095 et le score de stress Aqueduct de 2080 comme signal de risque persistant. Ce prolongement par stagnation est une hypothèse explicite de prudence, sans probabilité calculée; ce n’est pas une prévision scientifique validée pour 2194. Les indicateurs « source améliorée » ne garantissent ni présence de l’eau au domicile, ni disponibilité continue, ni qualité microbiologique. Les résumés de zones sont pondérés par la population implicite de la source et affichent les pays couverts; ils ne décrivent pas les disparités intranationales.

La classe de contraintes de la carte tient maintenant aussi compte de la chaleur sèche (P99 de saison chaude et moyenne annuelle des Tmax quotidiennes), en plus de la chaleur humide, des calories simulées, de l’accès projeté à une source améliorée et du stress hydrique national. Elle retient le niveau de contrainte le plus élevé parmi les indicateurs disponibles. Les paliers sont des heuristiques de visualisation, pas des seuils médicaux ou une décision binaire d’habitabilité. En particulier, les scores Aqueduct employés ici sont nationaux, pas les couches futures géolocalisées de bassin; ils restent distingués de l’accès aux ménages.

Les taux d’accès amélioré et le stress hydrique national contribuent désormais à la classe de contraintes, séparément et sans fusion d’unités. Le prolongement post-2095 est marqué dans les explications de la classe. Les observations sûres JMP restent distinctes et ne sont pas projetées.

## Couverture contrôlée

Le rapport pays par pays généré se trouve dans [`country-context-country-by-country.json`](country-context-country-by-country.json). Il contient chaque polygone, son code ISO, les observations par indicateur et les neuf combinaisons Aqueduct attendues. Régénérer le rapport avec `npm run audit:data-country`.

L’audit des nouvelles projections et classes se trouve dans [`../../reports/water-habitability-country-zone-audit.md`](../../reports/water-habitability-country-zone-audit.md) et son JSON détaillé. Le régénérer avec `npm run audit:water-habitability`.

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
- Risque hydrique à long terme : le [GIEC AR6, chapitre Eau](https://www.ipcc.ch/report/ar6/wg2/chapter/chapter-4/) souligne que les facteurs socioéconomiques dominent le risque global et que les projections régionales de disponibilité restent très incertaines. Cela motive un prolongement de référence transparent après la dernière année des données, pas l’attribution d’une probabilité artificielle.
- Les identifiants Natural Earth numériques sont convertis en ISO3 au moyen du fichier de correspondance [datasets/country-codes](https://github.com/datasets/country-codes); les deux entités françaises découpées sont codées explicitement `FRA` et `GUF`.

WDI et Aqueduct agrègent des sources, populations, périodes et méthodes différentes. Les taux d’accès nationaux masquent les écarts entre régions et groupes sociaux. Aqueduct dit que ses scores composites de risque global ne sont pas directement validables et les présente comme outil de priorisation. Il faut lire un score national comme signal de comparaison, pas comme diagnostic local ou garantie d’accès.

## Rafraîchir et vérifier

1. Rafraîchir les séries WDI et leurs années d’observation : `npx tsx scripts/updateCountryContextObserved.ts`.
2. Rafraîchir Aqueduct après vérification de la version du classeur et de la date de mise à jour catalogue dans le portail WRI : installer les dépendances optionnelles avec `python -m pip install -r requirements-data.txt`, puis passer la date vérifiée, par exemple `python scripts/updateAqueductCountryWaterStress.py --catalog-updated 2026-09-22`. Le script rejette les horizons, scénarios, scores, clés dupliquées ou combinaisons pays incomplètes.
3. Régénérer le contrôle détaillé : `npm run audit:data-country`.
4. Lancer `npm run verify`; cette commande exécute toute la suite de tests, le contrôle TypeScript et le build, qui lance lui-même les audits climat et pays. GitHub Actions applique le même contrôle aux pull requests vers `main`.

Le test contrôle les valeurs et années, les clés ISO, les entités sans code reconnu, l’unicité des lignes Aqueduct et ses horizons/scénarios. Le rapport JSON sert de liste de contrôle pays par pays et rend visibles les lacunes sans les combler par extrapolation.
