# Données du bloc « Chaleur humide & canicules »

## Couverture et protocole

Le fichier `src/data/climatePanelData.json` contient les 34 zones de `COUNTRIES_DATA`. Pour chacune, le pipeline `scripts/generateClimatePanelData.ts` télécharge les données quotidiennes NASA POWER issues de la réanalyse MERRA-2 sur 1991–2020 : `T2M`, `T2MDEW`, `T2M_MAX` et `T2M_MIN`. Les requêtes utilisent le temps local standard. La période complète doit être présente et sans valeurs de remplissage pour accepter le résultat.

Les normales sont les moyennes arithmétiques des températures quotidiennes du point demandé. Le point est le centre géographique de la zone; lorsqu’il tombe en mer, le générateur recherche un point terrestre voisin. Chaque valeur est donc un **proxy ponctuel**, sans pondération surfacique. Pour les pays vastes, les archipels et les zones regroupées, l’écart à la moyenne nationale peut être important. Coordonnées demandées et retenues, altitude, période, méthodes et date de génération figurent dans chaque provenance.

Le scénario chaud correspond au 99e percentile des Tmax journalières des six mois les plus chauds selon la moyenne T2M. Ce n’est ni un record absolu, ni une prévision, ni un seuil officiel de canicule. L’humidité relative est estimée avec Magnus (Alduchov & Eskridge, 1996), en associant le point de rosée quotidien moyen au Tmax de la même journée. Ces mesures ne sont pas simultanées : ce couplage est un proxy explicite. Tw est calculée avec la formule de Stull (2011) uniquement lorsque température et humidité entrent dans le domaine publié (-20 à 50 °C; 5 à 99 % RH).

## Futur et passé dans la simulation

Le climat local de référence vient des normales NASA POWER 1991–2020. Le calcul des températures de la carte le recale avec l’écart entre l’anomalie mondiale de référence et l’ancre 2026 du modèle. Les changements de `tas`, `tasmin` et `tasmax` entre le climat de référence et 2080–2099 proviennent des médianes d’ensemble CMIP6 du CCKP et sont interpolés annuellement vers 2100; 2080–2099 sert de proxy de fin de siècle. Les parcours sont conditionnels (BAU→SSP5-8.5, sobriété→SSP1-2.6, autre→SSP2-4.5), et non des prévisions.

Le **P99** local n’est pas fourni directement par la projection. Depuis 2026, sa référence NASA POWER suit le delta CCKP **TXx** — moyenne des maxima annuels de Tmax — utilisé comme proxy de changement de l’extrême, plutôt que le delta de la Tmax moyenne annuelle. Cela ne transforme pas le TXx en P99 projeté. L’humidité de référence des jours chauds reçoit l’anomalie moyenne **Hurs** CCKP des mois chauds de la zone et du scénario choisis. Hurs est une moyenne mensuelle de RH à 2 m, pas une mesure de l’humidité lors du jour et de l’heure du P99; son delta appliqué à l’estimation chaude NASA POWER/MERRA-2 est une hypothèse, avec une incertitude régionale plus grande. Les métadonnées CCKP précisent que l’humidité n’est pas ajustée contre des résultats non physiques; son delta doit être traité comme une hypothèse de faible confiance, particulièrement dans les régions sèches. Tw est recalculée à partir du P99 et de cette RH seulement si les deux entrées restent dans le domaine validé de Stull. Les données par zone et scénario sont versionnées dans `src/data/cckpHeatHazardProjections.json` et régénérables par `npx tsx scripts/generateCckpHeatHazardData.ts`.

Pour 1901–2025, l’anomalie annuelle mondiale NASA GISTEMP est recalée sur l’ancre interne du site en 2025, puis comparée à la moyenne 1991–2020 et appliquée au point local avec le facteur régional. L’humidité caniculaire passée reste un proxy 1991–2020 : aucune série historique annuelle par zone n’est intégrée. Ces séries sont des reconstructions, pas des observations météorologiques nationales.

Après 2100, CCKP n’apporte pas de nouvelles projections. L’application prolonge les deltas régionaux TXx et Hurs de fin de siècle proportionnellement au réchauffement global additionnel du modèle CLIMATOPEDY. Il s’agit d’une hypothèse exploratoire jusqu’en 2200, hors horizon CMIP6; RH reste bornée à 0–100 %, et Tw est affichée « non calculable » si Ta ou RH sort du domaine de Stull (−20 à 50 °C; 5 à 99 %). L’incertitude augmente fortement.

Les cartes distinguent maintenant le **Tw du scénario caniculaire** de la **moyenne annuelle des Tmax quotidiennes**. Une humidité d’été estimée faible peut produire un Tw modéré dans un climat où l’air reste très chaud; le calque Tw ne représente donc pas la température maximale de l’air. Les valeurs sont calculées pour 34 zones représentatives et partagées par les pays associés à chacune. Le relevé exhaustif pays/polygone × année × scénario est généré dans `reports/temperature-trajectory-by-country-1901-2200.csv`, avec la méthode et la zone source.

## Records absolus

Les records sont séparés des normales et des scénarios. Seuls les records intégrés avec une source officielle directe sont affichés. « Indisponible » signifie qu’aucune source vérifiée n’est intégrée; aucune extrapolation ne remplit ce manque. Une zone regroupée affiche, si disponible, le record maximal parmi ses membres documentés et le ratio de couverture : cela ne représente pas un maximum exhaustif de la région.

Les records actuellement documentés concernent la France, les États-Unis, le Brésil, l’Inde, la Chine et l’Australie. La liste versionnée et les liens sont dans `src/data/verifiedTemperatureRecords.ts`.

## Sources

- NASA POWER Daily API : <https://power.larc.nasa.gov/docs/services/api/temporal/daily/>
- NASA MERRA-2 : <https://gmao.gsfc.nasa.gov/reanalysis/MERRA-2/>
- NASA GISTEMP v4 annual global anomalies (J-D) : <https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.csv> (consulté le 26 septembre 2026; série intégrée versionnée dans `src/data/nasaGistempAnnualAnomalies.json`)
- Banque mondiale CCKP / données CMIP6 : <https://climateknowledgeportal.worldbank.org/download-data>
- Banque mondiale CCKP / métadonnées des variables (TXx, Hurs, limites d’ajustement) : <https://climateknowledgeportal.worldbank.org/metadata>
- Alduchov & Eskridge (1996), formule de Magnus : <https://doi.org/10.1175/1520-0450(1996)035%3C0601:IMFAOS%3E2.0.CO;2>
- Stull (2011), calcul de Tw : <https://doi.org/10.1175/JAMC-D-11-0143.1>

## Régénération et vérification

Exécuter `npx tsx scripts/generateClimatePanelData.ts` pour récupérer les normales NASA POWER, puis `npx tsx scripts/generateCckpHeatHazardData.ts` pour récupérer les projections TXx/Hurs CCKP par zone. `npx tsx scripts/generateTemperatureTrajectoryAudit.ts` régénère ensuite les exports pays × année × scénario et le rapport 1901–2200. Lancer enfin `npm test`, `npm run lint` et `npm run build`.
