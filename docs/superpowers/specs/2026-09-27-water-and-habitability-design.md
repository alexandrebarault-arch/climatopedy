# CLIMATOPEDY : risques de chaleur, eau potable et habitabilité

**Statut :** proposition à relire  
**Date :** 27 septembre 2026

## Intention et critères de réussite

L’utilisateur demande une lecture moins optimiste des contraintes d’habitabilité, prenant en compte la chaleur sèche et humide, les limites physiologiques, la disponibilité d’eau potable par pays et zone, et l’incertitude. Il demande aussi que le badge d’année soit déplacé vers le haut de la carte afin de laisser la légende lisible.

La carte doit signaler les contraintes importantes sans prétendre prédire si une population pourra ou non vivre dans un pays. Chaque résultat distingue observation, projection, extrapolation et absence de données. Les projections d’accès à l’eau utilisent des trajectoires de développement documentées et propres aux pays; elles ne déduisent pas directement l’accès domestique d’un score de stress hydrique.

## Constat dans le code actuel

- `src/engine/habitabilityStatus.ts` classe principalement selon la température humide de pointe (Tw) et les calories simulées. Si Tw est non calculable, une température d’air très élevée ne relève pas la classe thermique.
- Le panneau climatique expose P99 chaud estimé et moyenne annuelle des Tmax quotidiennes, mais ces sorties ne nourrissent pas le statut.
- L’accès à l’eau potable observé est stocké par pays; WRI Aqueduct fournit des projections nationales de stress hydrique pour 2030, 2050 et 2080. Les sources actuelles ne sont pas équivalentes à une projection de service domestique d’eau potable.
- Le badge d’année est rendu dans `src/components/WorldMap.tsx` à proximité de la légende et se superpose à celle-ci sur la capture fournie.

## Données et interprétation de l’eau

### Accès futur des ménages

Utiliser comme source principale les trajectoires d’accès à l’eau potable améliorée par pays de l’IIASA SSP Extension Explorer, fondées sur le modèle Vinca et al. (2026), qui couvre 142 pays jusqu’en 2100. Le modèle tient compte des trajectoires de revenu, urbanisation, inégalités et, selon la couverture, facteurs hydroclimatiques. Les résultats Zenodo associés sont indiqués comme accès restreint par l’API du dépôt; ne pas contourner cette restriction. Utiliser uniquement les séries effectivement téléchargeables publiquement depuis l’explorateur et consigner la licence, la date, la couverture et les champs extraits avant de les intégrer. Si les séries publiques ne permettent pas une couverture suffisante, utiliser les résultats publiés comme méthode de référence et laisser les pays non couverts en « données insuffisantes » plutôt que reconstruire le modèle sans validation.

Le service « amélioré » n’équivaut pas au service « géré en toute sécurité » de l’OMS/UNICEF : ce dernier exige également disponibilité quand nécessaire et absence de contamination. L’interface nomme donc exactement l’indicateur projeté et garde l’observation JMP « géré en toute sécurité » distincte. Elle n’affiche pas cette projection comme une probabilité de disposer d’eau potable sûre au domicile.

Associer les scénarios selon les trajectoires climatiques déjà utilisées dans l’application : sobriété → SSP1, intermédiaire → SSP2, fortes émissions → SSP5. Cette correspondance n’implique pas que les tendances d’accès suivent le classement thermique : SSP5 peut combiner davantage de réchauffement et un développement socioéconomique plus rapide. Montrer les hypothèses distinctement. Garder les horizons fournis par l’Explorer; si l’année du curseur n’est pas publiée, choisir la valeur source la plus proche et l’indiquer, ou interpoler entre deux points seulement si la granularité et la méthode le justifient et que l’interface qualifie cette valeur d’interpolée. Ne pas prolonger après 2100.

Les projections de l’étude couvrent 142 pays, non tous les polygones de la carte. Aucun chiffre n’est fabriqué pour les pays absents. Les polygones territoriaux sans code ou projection compatible restent « données insuffisantes ». Lorsque plusieurs pays forment une zone simulée, calculer une agrégation pondérée par population si les populations et séries nécessaires existent; afficher la couverture en pays/population et conserver les valeurs nationales accessibles au clic. Ne pas copier une valeur régionale sur chaque pays membre.

### Pression physique sur la ressource

Conserver Aqueduct comme indicateur distinct de stress hydrique et chercher sa couche spatiale future au niveau des sous-bassins HydroBASINS pour les scénarios/horizons publiés. Agréger à chaque polygone pays et aux 34 zones de simulation avec pondération de population lorsque la grille de population compatible est disponible; sinon documenter et afficher une moyenne surfacique, sans la confondre avec l’exposition de la population. Les scores nationaux existants restent en vue de comparaison. Ne pas prétendre que le stress hydrique prédit à lui seul les coupures, la qualité ou l’accès au robinet.

## Révision du statut de contraintes

Créer des dimensions visibles séparément : chaleur humide (Tw si calculable), chaleur sèche (P99 et moyenne annuelle des Tmax), disponibilité calorique, accès projeté à l’eau améliorée et stress hydrique projeté. Le statut synthétique adopte la classe la plus contraignante parmi les indicateurs valides; une Tw absente ne neutralise plus une chaleur sèche élevée. Les indicateurs d’eau comportent leurs propres sous-classes, et les données manquantes ne valent jamais « faibles contraintes ».

Les seuils thermiques servent à signaler des niveaux de risque et doivent être sourcés et décrits avec leur population/contextes d’application. Ne pas présenter 35 °C de Tw comme limite universelle de survie : la recherche expérimentale montre une limite de compensation plus basse dans certaines conditions, variable selon l’activité et les personnes. Si l’indicateur actuel Tw repose sur une humidité non simultanée ou hors domaine, maintenir « non calculable » et donner davantage de poids aux métriques d’air dont les limites sont également précisées.

Le score d’accès à l’eau porte sur le service projeté, non sur un volume universel nécessaire à la survie. Les classes synthétiques sont des « contraintes modélisées » et jamais « habitable/inhabitable ». Le détail du panneau explique les dimensions qui déterminent la classe, leur millésime, scénario, couverture et incertitude.

## Carte et panneau pays

- Repositionner le badge de l’année dans une zone libre au-dessus de la légende, sans masquer les contrôles ni les polygones importants; prévoir les largeurs mobile et desktop.
- Dans la fiche pays et la carte d’analyse, séparer les indicateurs observés des projections et afficher une date/source pour l’accès JMP, les projections d’accès, et Aqueduct.
- Ajouter un état explicite pour les pays sans série projetée, les sous-zones agrégées à couverture partielle et les horizons non disponibles.
- Le cas d’exemple Afrique du Nord est réévalué avec ses valeurs P99/Tmax et données d’eau selon disponibilité; aucun ajustement manuel spécifique à la zone.

## Audit pays, polygones et zones

Produire un rapport reproductible couvrant chaque polygone reconnu, les 34 zones, les scénarios et les horizons de chacune des sources. Le rapport vérifie les clés, la couverture, les unités, les années, les bornes, les scénarios, les pondérations de population, les groupes régionaux et les statuts dont Tw est absente mais le P99 élevé. Il doit distinguer erreur de calcul, données absentes, extrapolation et limite de modèle. Comparer les classes avant/après et lister chaque changement avec l’indicateur déclencheur; ne pas auto-corriger ni lisser les valeurs sources.

## Hors périmètre

- Prédire les feux futurs ou le dépérissement des forêts à partir des seuls indicateurs thermiques/eau disponibles.
- Affirmer qu’une zone est définitivement invivable, ou que toute sa population connaît le même risque.
- Déduire une quantité de litres disponible au robinet à partir d’Aqueduct.
- Extrapoler les projections de services domestiques au-delà de leur horizon publié.
- Traiter les 34 points climatiques représentatifs comme une résolution nationale ou locale exhaustive.

## Vérifications documentaires

- La méthode JMP utilise des enquêtes nationales et des sources administratives; les estimations « safely managed » incluent disponibilité et qualité et ne sont pas disponibles partout. [JMP Methods](https://washdata.org/topics/methods) · [Rapport JMP 2025](https://data.unicef.org/resources/jmp-report-2025/)
- L’étude 2026 estime l’accès amélioré sous SSP pour 142 pays jusqu’à 2100, et souligne que les inégalités persistent; elle ne mesure pas directement le service « safely managed ». [Vinca et al., 2026](https://doi.org/10.1038/s41545-026-00594-3) · [données Zenodo](https://doi.org/10.5281/zenodo.19866728)
- Aqueduct projette stress, demande et offre d’eau par sous-bassin sous plusieurs scénarios; son score n’est pas une mesure d’accès domestique. [WRI Aqueduct 4.0](https://www.wri.org/research/aqueduct-40-updated-decision-relevant-global-water-risk-indicators) · [méthode des projections](https://www.wri.org/aqueduct/help-center/understanding-future-projections)
- Le seuil physiologique dépend des conditions; une Tw de 35 °C n’est pas une limite de sécurité universelle. [PSU HEAT study](https://pmc.ncbi.nlm.nih.gov/articles/PMC8799385/) · [tolérance à la chaleur humide](https://pmc.ncbi.nlm.nih.gov/articles/PMC10589700/)
- Météo-France décrit une saison 2026 exceptionnelle par le danger incendie, la sécheresse des sols et la végétation affectée. [Bilan de l’été 2026](https://meteofrance.com/presse/bilan-climatique-de-lete-2026-juin-juillet-aout) · [point du 18 septembre](https://meteofrance.com/actualites/apres-la-chaleur-secheresse-et-danger-feux-en-ce-debut-dautomne)

## Critères d’acceptation

1. Les valeurs d’accès à l’eau projetées sont spécifiques au pays, au scénario et à l’horizon source; couverture et lacunes sont visibles.
2. L’accès « amélioré » projeté et l’accès « géré en toute sécurité » observé sont nommés séparément.
3. Les résultats par zone sont agrégés avec pondération et couverture explicites; aucune valeur régionale n’est attribuée artificiellement à chaque membre.
4. Le stress hydrique Aqueduct reste une dimension indépendante de l’accès domestique.
5. Une chaleur sèche extrême influe sur la classe même si Tw est indisponible; le détail montre l’indicateur ayant déterminé la classe.
6. Chaque polygone, zone, scénario et horizon publiés figure dans l’audit reproductible, lequel fait ressortir valeurs absentes, couverture et changements de classe.
7. Le badge d’année ne recouvre plus la légende sur les tailles d’écran prises en charge.
8. Toute classe demeure un indicateur de contraintes modélisées, pas un verdict binaire d’habitabilité.
