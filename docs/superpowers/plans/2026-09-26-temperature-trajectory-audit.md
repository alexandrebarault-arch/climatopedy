# Audit et correction des trajectoires thermiques 1901–2200

## Objectif

Vérifier, pour chaque pays affiché et chaque année de 1901 à 2200, les températures moyennes, minimales, maximales et la cohérence des indicateurs affichés. Corriger les ruptures et plateaux dus au code, rendre explicite la résolution en 34 zones climatiques et éviter que la carte Tw soit interprétée comme une carte de température de l’air.

## Éléments établis

- Le modèle mappe les pays de la carte sur 34 zones climatiques représentatives; certaines valeurs sont donc partagées.
- Les années 1901–2025 sont reconstruites à partir de repères annuels interpolés d’anomalie mondiale et d’un coefficient de réponse régional; elles ne sont pas des observations nationales.
- Le calcul présent mélange le climat de référence local 1991–2020 avec un écart historique construit à partir d’une moyenne non annuelle de quelques repères décennaux.
- L’initialisation 2026 repart du normal local sans ce même écart; le raccordement 2025–2026 baisse artificiellement dans toutes les zones.
- Les températures locales futures plafonnent en 2100 alors que l’anomalie globale du modèle continue d’augmenter jusqu’en 2200.
- La couche cartographique par défaut est Tw simulé; les humidités caniculaires estimées, notamment basses dans les zones arides, donnent des Tw sensiblement inférieurs aux températures de l’air.

## Approche

1. Ajouter des tests rouges pour l’ancrage 2025–2026, la continuité 2100–2200 et les invariants annuels de toutes les zones jusqu’en 2200.
2. Faire utiliser à l’historique et à 2026 la même référence thermique moyenne 1991–2020 calculée année par année à partir des repères disponibles.
3. Prolonger après 2100 l’anomalie globale du scénario selon le modèle interne et le coefficient régional, avec un raccord continu sur l’ancre CCKP de fin de siècle; identifier clairement cette extension comme scénario exploratoire.
4. Ajouter une couche de carte distincte « Tmax quotidienne moyenne » et des légendes propres à chaque métrique; conserver Tw comme indicateur distinct.
5. Générer un CSV exhaustif 1901–2200 × pays avec les valeurs, l’identifiant de la zone climatique source et l’étiquette de méthode; produire aussi une synthèse d’audit avec ruptures, non-monotonicités et limites.
6. Mettre à jour la documentation Sources & Données pour les fenêtres CCKP, la reconstruction historique et l’extrapolation post-2100.
7. Exécuter tests, lint et build, régénérer le relevé, examiner l’audit et corriger toute anomalie détectée.

## Validation

- Une série annuelle finie et ordonnée par zone (Tmin ≤ moyenne ≤ Tmax), sans année absente.
- Aucun saut généralisé au raccord 2025–2026; la petite variation observée suit l’anomalie annuelle plutôt qu’un changement de référence.
- La température locale continue à évoluer après 2100 en cohérence avec la trajectoire globale, et le niveau de confiance post-2100 est explicitement limité.
- Les pays associés à une même zone partagent une valeur marquée comme régionale, sans être présentés comme des stations nationales.
- La couche Tw et la couche Tmax sont distinguées dans l’interface et leurs plages ne sont pas confondues.
