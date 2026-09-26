# Données du bloc « Chaleur humide & canicules »

## Couverture et protocole

Le fichier `src/data/climatePanelData.json` contient les 34 zones de `COUNTRIES_DATA`. Pour chacune, le pipeline `scripts/generateClimatePanelData.ts` télécharge les données quotidiennes NASA POWER issues de la réanalyse MERRA-2 sur 1991–2020 : `T2M`, `T2MDEW`, `T2M_MAX` et `T2M_MIN`. Les requêtes utilisent le temps local standard. La période complète doit être présente et sans valeurs de remplissage pour accepter le résultat.

Les normales sont les moyennes arithmétiques des températures quotidiennes du point demandé. Le point est le centre géographique de la zone; lorsqu’il tombe en mer, le générateur recherche un point terrestre voisin. Chaque valeur est donc un **proxy ponctuel**, sans pondération surfacique. Pour les pays vastes, les archipels et les zones regroupées, l’écart à la moyenne nationale peut être important. Coordonnées demandées et retenues, altitude, période, méthodes et date de génération figurent dans chaque provenance.

Le scénario chaud correspond au 99e percentile des Tmax journalières des six mois les plus chauds selon la moyenne T2M. Ce n’est ni un record absolu, ni une prévision, ni un seuil officiel de canicule. L’humidité relative est estimée avec Magnus (Alduchov & Eskridge, 1996), en associant le point de rosée quotidien moyen au Tmax de la même journée. Ces mesures ne sont pas simultanées : ce couplage est un proxy explicite. Tw est calculée avec la formule de Stull (2011) uniquement lorsque température et humidité entrent dans le domaine publié (-20 à 50 °C; 5 à 99 % RH).

## Futur et passé dans la simulation

Le départ 2026 est ancré sur la normale NASA POWER 1991–2020. Les changements de `tas`, `tasmin` et `tasmax` entre le climat de référence et 2080–2099 proviennent des médianes d’ensemble CMIP6 du CCKP et sont interpolés linéairement vers 2100; ce dernier intervalle sert de proxy de fin de siècle. Les parcours sont conditionnels (BAU→SSP5-8.5, sobriété→SSP1-2.6, autre→SSP2-4.5), et non des prévisions.

Le P99 chaud évolue avec le changement de `tasmax` CCKP; faute de projection d’humidité intégrée, son humidité reste constante. Tw est recalculée à partir de ces deux valeurs. Pour le passé, l’anomalie thermique mondiale interpolée est appliquée au point de référence avec le facteur régional déjà déclaré dans le modèle. Ces séries historiques par zone sont reconstruites, pas observées localement.

## Records absolus

Les records sont séparés des normales et des scénarios. Seuls les records intégrés avec une source officielle directe sont affichés. « Indisponible » signifie qu’aucune source vérifiée n’est intégrée; aucune extrapolation ne remplit ce manque. Une zone regroupée affiche, si disponible, le record maximal parmi ses membres documentés et le ratio de couverture : cela ne représente pas un maximum exhaustif de la région.

Les records actuellement documentés concernent la France, les États-Unis, le Brésil, l’Inde, la Chine et l’Australie. La liste versionnée et les liens sont dans `src/data/verifiedTemperatureRecords.ts`.

## Sources

- NASA POWER Daily API : <https://power.larc.nasa.gov/docs/services/api/temporal/daily/>
- NASA MERRA-2 : <https://gmao.gsfc.nasa.gov/reanalysis/MERRA-2/>
- Banque mondiale CCKP / données CMIP6 : <https://climateknowledgeportal.worldbank.org/download-data>
- Alduchov & Eskridge (1996), formule de Magnus : <https://doi.org/10.1175/1520-0450(1996)035%3C0601:IMFAOS%3E2.0.CO;2>
- Stull (2011), calcul de Tw : <https://doi.org/10.1175/JAMC-D-11-0143.1>

## Régénération et vérification

Exécuter `npx tsx scripts/generateClimatePanelData.ts` pour interroger l’API et réécrire le fichier statique, puis `npm test`, `npm run lint` et `npm run build`. Le générateur échoue si une zone manque, si les données journalières sont incomplètes, si les extrema sont incohérents ou si une entrée ne peut pas produire Tw dans le domaine de Stull.
