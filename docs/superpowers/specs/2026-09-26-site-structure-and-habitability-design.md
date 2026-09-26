# CLIMATOPEDY : indicateurs d’habitabilité et contrat de structure du site

**Statut :** brouillon soumis à relecture  
**Date :** 26 septembre 2026  
**Branche :** `codex/climate-panel-science`

## Objectif

Rendre les résultats par pays plus faciles à interpréter sans présenter les sorties exploratoires du modèle comme des faits observés, masquer les records de température lorsqu’on explore le futur, et documenter puis protéger la structure actuelle du site contre les régressions accidentelles.

## Organisation actuelle

Le site est une application monopage React/Vite. `App.tsx` gère la section sélectionnée, le pays sélectionné, l’année, les scénarios, les trajectoires calculées, les paramètres d’URL partagés et l’état des fenêtres modales. `TopBar.tsx` donne accès à six sections de premier niveau : `map`, `comparative-dashboard`, `tipping-points`, `causal`, `spec` et `sources`. La FAQ et le tutoriel sont des accès intégrés à l’expérience de la carte, pas des pages de premier niveau supplémentaires.

La page Carte compose l’en-tête pédagogique, `WorldMap`, la chronologie, la comparaison de scénarios, les graphiques KPI, les explications, la FAQ et la conclusion sur le futur. `WorldMap` dessine les pays, les commandes de couches, les détails au survol et à la sélection, ainsi que la carte d’analyse du pays sélectionné. La fiche pays est un panneau latéral ouvert depuis la carte. Les cinq autres sections de premier niveau affichent le tableau de comparaison, le dossier sur les points de bascule, l’enquête sur les chaînes causales, les spécifications du modèle et le catalogue des sources scientifiques. Cet inventaire sera comparé au code avant de devenir le contrat d’architecture.

## Comportements attendus

### Visibilité des records futurs

Un record absolu observé reste une référence historique et s’affiche dans la fiche pays `CountryInspector` uniquement pour les années simulées jusqu’à 2026 inclus. Il est masqué pour une année ultérieure, y compris 2100 et l’horizon 2100–2200. Il n’est pas actuellement rendu dans la carte d’analyse `WorldMap`. La valeur ne change pas dans le registre des sources ou les données. L’interface distingue clairement un record historique d’une valeur de scénario simulée.

### Indicateur d’habitabilité

Afficher un statut court à côté du nom de la zone dans la carte d’analyse et dans la fiche pays. Il est recalculé depuis l’état de simulation actif, donc suit l’année, le scénario et le pays sélectionnés. Il s’appuie uniquement sur les indicateurs existants :

| Statut | Règle | Sens affiché |
| --- | --- | --- |
| Contraintes faibles | `wetBulbPeak < 26 °C` et `calPerCapita >= 2 100 kcal/personne/jour` | Les deux repères sélectionnés restent sous leur seuil de contrainte. |
| Contraintes modérées | `26 <= wetBulbPeak < 27 °C` ou `1 900 <= calPerCapita < 2 100` | Premier niveau de contrainte thermique ou alimentaire. |
| Contraintes fortes | `27 <= wetBulbPeak < 28 °C` ou `1 700 <= calPerCapita < 1 900` | Niveau élevé sur au moins un des deux indicateurs. |
| Contraintes majeures | `28 <= wetBulbPeak < 29 °C` ou `1 500 <= calPerCapita < 1 700` | Niveau élevé d'un indicateur dans le scénario modélisé. |
| Contraintes très fortes | `wetBulbPeak >= 29 °C` ou `calPerCapita < 1 500` | Niveau le plus élevé des classes de visualisation choisies. |

Si les repères thermique et alimentaire donnent des catégories différentes, la plus contraignante prévaut. Les seuils intermédiaires servent à faire apparaître les évolutions dans la plage de valeurs simulée; ils ne sont pas des frontières scientifiques validées d’habitabilité. Le calque principal passe du jaune pâle à l’orange et au rouge sombre selon ces contraintes simulées; les couches Tmax et Tw restent disponibles séparément. Une absence de Tw et l’absence de stress calorique connu restent en gris « données indisponibles », jamais en classe favorable. Le libellé et la légende précisent que ce statut ne détermine pas si un pays est réellement habitable ou inhabitable.

## Contrat de structure et harnais de régression

Ajouter `docs/site-architecture.md`, un guide technique maintenu qui décrit :

- les six sections de premier niveau et leurs composants de page ;
- la composition de chaque page et les principales fenêtres de la page Carte ;
- la responsabilité et le parcours de l’année, des scénarios, du pays sélectionné, de l’état d’URL, des trajectoires et des comparaisons ;
- les vues qui consomment les données climatiques, de simulation, géographiques et de sources scientifiques ;
- les comportements de navigation et d’URL pris en charge ainsi que les responsabilités des composants principaux ;
- les commandes pour les tests, la vérification TypeScript et le build de production ;
- une liste de contrôle à appliquer lors d’un changement de structure : inventaire des pages, navigation, état partagé et tests.

Ajouter des tests Node déterministes à la suite existante `npm test`. Un contrat unique et explicite définit les six identifiants stables des sections et leurs vues principales. Les tests repèrent les identifiants manquants ou dupliqués, vérifient que chaque section reste reliée à la navigation et à son rendu dans l’application, et protègent les points d’entrée importants de la carte et les données d’état partagé. Les tests doivent pouvoir être mis à jour volontairement avec une évolution du site ; ils ne figent ni les styles ni les libellés accessoires. Aucun nouvel outil de test navigateur ni dépendance externe n’est nécessaire pour ce premier garde-fou.

Le document décrit la structure. Les tests protègent un petit ensemble de contrats structurels explicites. Ensemble, ils limitent les régressions accidentelles sans interdire les évolutions décidées.

## Fichiers envisagés

- `src/components/WorldMap.tsx` : calculer et afficher le statut de la zone sélectionnée.
- `src/components/CountryInspector.tsx` : afficher le même statut et masquer le record après 2026.
- Un petit helper pur dans `src/engine/` ou `src/utils/` : retourner une clé, un libellé, une explication et une sévérité depuis le pic de Tw et les calories, avec des tests unitaires ciblés.
- Un contrat partagé de sections du site, utilisé par la navigation et le rendu dans `App.tsx`.
- `docs/site-architecture.md` : guide des pages, de leur fonctionnement et des flux de données.
- `tests/` : tests des règles et du contrat de structure, inclus dans la commande npm de test existante.

## Critères d’acceptation

1. À partir de 2100, aucun record historique d’aucune zone n’apparaît comme résultat futur.
2. Pour chaque zone disposant d’un état simulé, la carte d’analyse et la fiche pays affichent le même statut déterministe pour l’état actif.
3. Les tests couvrent les frontières juste avant et à 26 °C, juste avant et à 31 °C, juste avant et à 2 100 kcal, ainsi que les cas où plusieurs conditions sont réunies et la priorité des catégories.
4. Le libellé précise que le statut dépend du modèle et n’affirme pas l’habitabilité réelle.
5. Le guide d’architecture recense les six sections, les principales sous-sections de la carte, la responsabilité de l’état, les flux de données et les commandes de vérification.
6. Les tests structurels échouent si une section de premier niveau est retirée sans mise à jour, dupliquée ou déconnectée de la navigation ou du rendu. Une modification délibérée peut mettre à jour le contrat partagé et ses tests.
7. `npm test`, `npm run lint` et `npm run build` réussissent.

## Hors périmètre

- Modifier les seuils scientifiques du modèle ou présenter 2 100 kcal/jour comme un approvisionnement alimentaire national observé.
- Déclarer un pays réellement habitable ou inhabitable.
- Remplacer ou pondérer par superficie les proxys climatiques nationaux existants.
- Refaire les couleurs de carte, alertes thermiques, toutes les mises en page ou le moteur de simulation.
- Ajouter des captures d’écran de référence, de l’automatisation navigateur ou une nouvelle dépendance de test UI.

## Point à valider

Les cinq classes et leurs règles servent à interpréter les sorties du modèle ; ce ne sont pas des critères d’habitabilité validés scientifiquement. « Contraintes faibles » signifie uniquement que les deux repères retenus ne sont pas franchis. Cela ne garantit ni la sécurité ni la qualité de vie.
