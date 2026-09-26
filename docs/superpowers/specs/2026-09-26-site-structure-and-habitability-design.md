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

Un record absolu observé reste une référence historique et s’affiche dans les détails du pays uniquement pour les années simulées jusqu’à 2026 inclus. Il est masqué pour une année ultérieure, y compris 2100 et l’horizon 2100–2200. La valeur ne change pas dans le registre des sources ou les données. L’interface distingue clairement un record historique d’une valeur de scénario simulée.

### Indicateur d’habitabilité

Afficher un statut court à côté du nom de la zone dans la carte d’analyse et dans la fiche pays. Il est recalculé depuis l’état de simulation actif, donc suit l’année, le scénario et le pays sélectionnés. Il s’appuie uniquement sur les indicateurs existants :

| Statut | Règle | Sens affiché |
| --- | --- | --- |
| Conditions favorables dans le modèle | `wetBulbPeak < 26 °C` et `calPerCapita >= 2 100 kcal/personne/jour` | Aucun des deux repères d’alerte retenus n’est franchi. |
| Habitabilité sous contraintes | `wetBulbPeak < 31 °C` et (`wetBulbPeak >= 26 °C` ou `calPerCapita < 2 100 kcal/personne/jour`) | Au moins un repère thermique ou alimentaire du modèle est franchi. |
| Contraintes majeures dans le modèle | `wetBulbPeak >= 31 °C` | Le seuil thermique élevé d’alerte du modèle est atteint. |

Si les repères thermique et alimentaire sont tous deux franchis, la catégorie thermique la plus élevée prévaut. Cela évite d’inventer un nouveau seuil alimentaire. Chaque statut indique qu’il s’agit d’un indicateur exploratoire, calculé à partir du pic de Tw simulé et du repère alimentaire de 2 100 kcal du modèle. Il ne détermine pas si un pays est réellement habitable ou inhabitable. L’interface n’emploie pas le verdict catégorique « inhabitable ». Les couleurs de carte, alertes et valeurs détaillées actuelles restent en place.

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

- `src/components/WorldMap.tsx` : calculer et afficher le statut de la zone sélectionnée, et masquer les records dans le futur.
- `src/components/CountryInspector.tsx` : afficher le même statut et appliquer la même règle de visibilité des records.
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

Les trois statuts et leurs règles servent à interpréter les sorties du modèle ; ce ne sont pas des critères d’habitabilité validés scientifiquement. « Conditions favorables » signifie uniquement que les deux repères retenus ne sont pas franchis. Cela ne garantit ni la sécurité ni la qualité de vie.
