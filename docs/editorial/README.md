# Règles éditoriales et audit de compréhension

CLIMATOPEDY s’adresse aussi aux lecteurs qui ne connaissent pas le vocabulaire scientifique du site. Ce guide aide à écrire les textes et à repérer les formulations qui demandent une explication.

## Règles de rédaction

- Présenter les personnes et les organismes à leur première mention utile : qui ils sont et pourquoi leur travail est cité.
- Développer les sigles et expliquer les notations quand leur sens ne va pas de soi dans le contexte.
- Remplacer les mots abstraits par une formulation concrète ou les expliquer immédiatement.
- Pour chaque chiffre, préciser ce qui est compté, la période et l’échelle concernées.
- Distinguer ce que la publication a observé ou estimé de ce que le modèle du site en déduit.
- Expliquer les limites scientifiques en mots courants, sans noyer le résultat principal dans des précautions.
- Garder le même sens pour un terme récurrent, même si l’explication est raccourcie dans une infobulle ou un petit écran.

Exemples : écrire « Vaclav Smil, chercheur spécialiste de l’énergie » plutôt que « Smil » seul; écrire « quand le gaz naturel devient moins disponible » plutôt que « déplétion fossile »; expliquer qu’une estimation décrit une part de population sans prétendre mesurer les atomes présents dans le corps de chaque personne.

## Registre des termes

Les règles automatisées sont maintenues dans [`terms.json`](./terms.json). Chaque entrée contient :

- `id` : identifiant stable, en minuscules avec des tirets;
- `term` : motif d’expression régulière à rechercher;
- `category` : type de personne, notion ou formulation;
- `severity` : `error` pour une formulation à remplacer ou un terme sans explication, `warning` pour un contrôle éditorial heuristique;
- `readerExplanation` : explication de référence en français courant, affichée dans le diagnostic;
- `explanationPattern` (facultatif) : expression régulière décrivant une explication accessible qui peut se trouver dans le même bloc de texte.

Les motifs sont insensibles aux majuscules et prennent en charge Unicode. Les erreurs font échouer l’audit; les avertissements sont informatifs. Une explication détectée automatiquement ne prouve pas que le texte est clair : relire le texte dans son contexte.

Pour ajouter un terme, choisir une forme suffisamment précise pour éviter les correspondances fortuites, fournir une explication compréhensible, puis ajouter des tests pour les formes signalées et les formes expliquées. N’abaisser une règle d’erreur ou élargir son motif qu’après avoir vérifié les occurrences réelles.

## Commande d’audit

À la racine du dépôt, lancer explicitement :

```powershell
npm run audit:editorial
```

La commande parcourt les fichiers `.ts` et `.tsx` de `src/components` et `src/data`. Elle examine le texte des paragraphes, titres, étiquettes et certains attributs JSX, ainsi que les valeurs textuelles de champs de contenu connus comme `question`, `authors`, `scientificRef`, `definition` et `keyDataOrQuote`. Les commentaires et instructions d’import sont écartés.

Chaque diagnostic indique le fichier, une ligne proche du texte, l’identifiant de règle, la gravité et une suggestion. Codes de sortie : `0` aucun diagnostic bloquant, `1` au moins une erreur éditoriale, `2` configuration du registre ou parcours des sources impossible.

L’audit reste une commande locale séparée : il ne fait partie ni de `npm run verify`, ni de `npm run build`, ni d’un workflow GitHub. Les tests du scanner et de sa configuration sont exécutés par `npm test`.

## Exceptions locales

Une exception n’est acceptable que si le terme doit vraiment rester dans ce passage, par exemple dans une référence bibliographique exacte. Placer une directive commentée juste avant le bloc de texte concerné et donner une raison :

```tsx
{/* editorial-audit-ignore-next-line: smil -- Nom conservé dans la référence bibliographique exacte. */}
<p>Smil (2001), Enriching the Earth.</p>
```

En JavaScript/TypeScript hors JSX, utiliser le commentaire `//` équivalent. La directive n’ignore que le terme nommé sur la ligne de contenu qui suit. Une règle inconnue, une raison manquante ou une exception qui ne correspond pas à du texte est signalée comme erreur. Préférer une réécriture compréhensible à une exception.

## Limites du contrôle automatique

Le harnais extrait des portions de texte avec des motifs ciblés; ce n’est ni un analyseur complet de TSX, ni un correcteur de style, ni une mesure du niveau de lecture. Les textes construits à l’exécution, certains champs de données non répertoriés, les contenus externes et les images ne sont pas nécessairement détectés. La compilation TypeScript vérifie séparément la syntaxe. Après chaque audit, examiner les diagnostics puis relire visuellement les modules modifiés, sur ordinateur et mobile si leur mise en page a changé.
