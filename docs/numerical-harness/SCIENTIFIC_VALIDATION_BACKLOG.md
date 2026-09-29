# Scientific validation backlog

V0 protège le produit actuel, pas sa validité scientifique. À traiter séparément : calibration indépendante des coefficients EROI/carbone/cultures/mortalité, validation des proxies CCKP, résolution de la migration séquentielle, vérification des reconstructions historiques et validation des maintiens post-horizon de l’eau.

## Migration et dépendance à l’ordre — priorité haute

**Question à éclaircir :** quelles permutations de `COUNTRIES_DATA` modifient les sorties, et par quel chemin numérique ?

**Constat V0 :** le statut est `ORDER_DEPENDENT`. La boucle de migration ajoute directement les arrivées dans `destination.cohorts.p1` pendant que les origines suivantes sont encore parcourues. Le harnais a mesuré une différence en inversant l’ordre complet des zones ; il n’a pas encore isolé chaque paire.

**Expérience à réaliser, sans corriger le modèle :**

1. Exécuter la trajectoire de référence avec l’ordre courant.
2. Permuter uniquement deux zones à la fois, notamment `fra` et la zone groupée `med_eu` qui représente l’Espagne.
3. Répéter avec les permutations de toutes les zones ayant un flux potentiel.
4. Enregistrer, pour chaque permutation, les deltas de cohortes actives, migration nette, population mondiale, naissances, décès et indicateurs affichés.
5. Identifier le premier pas annuel où le delta apparaît et produire un classement des plus grands deltas.

**Résultat attendu :** un rapport distinguant `ORDER_INDEPENDENT`, `ORDER_DEPENDENT` et `INCONCLUSIVE`, avec les permutations, années, zones et deltas observés. Toute anomalie doit rester documentée ; aucune réécriture simultanée des flux ne doit être introduite dans le cadre du Golden Master V0.
