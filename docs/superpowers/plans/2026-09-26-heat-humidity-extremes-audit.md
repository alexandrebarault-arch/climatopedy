# Audit des extrêmes chauds et de l’humidité

## But

Auditer le calcul des cartes et du bloc « Chaleur Humide & Canicules », en particulier le P99 chaud, l’humidité pendant les jours chauds, Tw, et les moyennes annuelles Tmin/Tmax. Projeter les critères de 2026 à 2200 à partir des variables CMIP6 disponibles plutôt que de conserver une humidité constante ou de faire suivre le P99 aux seules moyennes annuelles.

## Constats initiaux

- Le P99 chaud est décalé par la variation de la moyenne annuelle des Tmax quotidiennes; c’est un proxy sans indicateur d’extrême dédié.
- L’humidité caniculaire est répétée à l’identique de la référence 1991–2020 pour toutes les années futures.
- Le portail CCKP donne TXx et Hurs mensuel par pays, période et SSP. TXx peut fournir un delta de température extrême; l’anomalie Hurs en saison chaude peut ajuster l’humidité de référence.
- Hurs de climatologie mensuelle n’est pas l’humidité relative instantanée des jours P99. L’appliquer comme anomalie au proxy du site est une hypothèse, non une observation coïncidente.

## Plan d’exécution

1. Capturer les réponses CCKP en période de référence 2020–2039 et en fin de siècle 2080–2099 pour TXx annuel et Hurs mensuel, scénarios SSP1-2.6, SSP2-4.5 et SSP5-8.5; agréger les membres des zones selon la méthode existante.
2. Ajouter d’abord les tests de projection : continuité du P99 au départ, évolution du P99 avec le delta TXx, humidité qui suit le delta Hurs de saison chaude et varie par SSP, Tw recalculée, valeurs finies et bornées; prolongation 2100–2200 explicitement exploratoire.
3. Remplacer dans le modèle l’ancrage du P99 sur la moyenne annuelle des Tmax et l’humidité constante par ces deltas CCKP; borner RH au domaine de calcul Stull.
4. Afficher dans l’inspecteur les horizons et la méthode associés aux valeurs projetées; ne pas confondre moyenne de Tmax journalière, P99 de saison chaude, TXx et record absolu.
5. Régénérer le relevé pays × année × scénario, l’audit de synthèse et la documentation des sources et limites.
6. Exécuter tests, lint et build; examiner les trajectoires de la France et des zones arides/humides représentatives jusqu’en 2200.

## Invariants de validation

- Valeurs de référence 2026 restent identiques aux estimations MERRA-2 existantes, après l’ancrage thermique déjà corrigé.
- Projection 2026–2100 cohérente avec les deltas des produits CCKP et différenciée par SSP.
- Après 2100, toute évolution additionnelle est identifiée comme extrapolation du modèle interne, pas comme sortie CMIP6.
- RH reste dans 5–99 % pour le calcul Stull; Tw reste une valeur dérivée distincte de la température d’air.
- Pour toute année et tout scénario, Tmin annuelle ≤ moyenne annuelle ≤ Tmax annuelle.
