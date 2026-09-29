# Climatopedy — project status and handoff

Ce fichier est le point d’entrée de continuité pour toute nouvelle discussion Codex ou toute reprise du worktree.

## Références immuables

- Worktree : `C:\Users\alexa\.codex\worktrees\numerical-harness-v0\Climatopedy`
- Branche : `codex/numerical-harness-v0`
- Product reference SHA : `907fcb63fede8dc53df7e861bfd0b5745bcdc831`
- Golden Master numérique : `V0 / CURRENT_PRODUCT_REFERENCE`
- Site Golden Master : `V0 / CURRENT_PRODUCT_REFERENCE`

## Signification des deux SHA

Ces deux identifiants ne désignent pas la même chose :

- `PRODUCT_REFERENCE_SHA` est le snapshot produit de référence. Il reste volontairement fixe, même si le harnais évolue.
- `FINAL_HARNESS_SHA` est le snapshot Git final de la branche du harnais. Il identifie le commit qui contient la version livrée du harnais et de sa documentation.

La branche `codex/numerical-harness-v0` est un pointeur mobile vers le dernier `FINAL_HARNESS_SHA`; le nom de branche n'est donc pas un remplacement du SHA.

Pour transmettre les références après un travail, exécuter :

```powershell
$productReferenceSha = '907fcb63fede8dc53df7e861bfd0b5745bcdc831'
$finalHarnessSha = git rev-parse HEAD
Write-Output "PRODUCT_REFERENCE_SHA = $productReferenceSha"
Write-Output "FINAL_HARNESS_SHA     = $finalHarnessSha"
```

Le `FINAL_HARNESS_SHA` doit toujours être obtenu avec `git rev-parse HEAD`; il ne doit pas être recopié manuellement dans ce fichier après chaque commit.

## Commandes locales

Depuis le worktree, utiliser `npm.cmd` sous PowerShell :

```powershell
npm.cmd run harness:install-hook
npm.cmd run harness:fast
npm.cmd run harness:full
```

Le hook `pre-commit` lance FAST avant le commit. Le hook `post-commit` relance FAST et FULL après tout commit pertinent. Aucun workflow GitHub Actions n’est requis.

La directive agent correspondante est versionnée dans `AGENTS.md` : le travail et les vérifications sont locaux ; GitHub reçoit uniquement les commits poussés et ne lance aucun workflow de validation.

## État validé

- FAST couvre les vecteurs, invariants, données manquantes, proxies, horizons, agrégats et le contrat de site.
- FULL parcourt la matrice Golden déclarée et produit le Numerical Impact Report.
- Le site est protégé par un contrat sémantique structure + contenu : `SITE_GOLDEN_MASTER_V0.md`.
- La migration est caractérisée `ORDER_DEPENDENT`; elle n’est pas corrigée dans V0.
- Les fixtures ne sont jamais régénérées automatiquement.

## Fichiers générés par le build

Le build (`npm.cmd run build`) régénère six artefacts d'audit suivis par Git :

- `docs/data-quality/country-context-country-by-country.json` : données de contrôle utilisées par la qualité des données et certains tests ;
- `reports/temperature-trajectory-by-country-1901-2200.csv` : trajectoires détaillées par pays ;
- `reports/temperature-trajectory-audit-1901-2200.md` : synthèse de l'audit des trajectoires ;
- `reports/temperature-quality-checklist-1901-2200.csv` : registre des contrôles qualité ;
- `reports/temperature-quality-issues-1901-2200.csv` : anomalies et limites connues ;
- `reports/temperature-quality-audit-1901-2200.md` : rapport global de qualité.

Ces fichiers ne sont ni le site runtime ni les fixtures du harnais numérique V0. Leur présence dans `git status` après un build ne signifie donc pas que l'évolution du harnais les a modifiés. Ne pas les supprimer, réinitialiser ou commiter automatiquement ; les inclure seulement si la demande porte explicitement sur les audits ou les données générées.

## Problèmes connus hors périmètre V0

- Des tests historiques du projet utilisent une ancienne signature d’habitabilité.
- Le lint existant signale une erreur dans `scripts/generateHouseholdWaterAccessData.ts`.
- Ces problèmes ne doivent pas être corrigés en modifiant le comportement métier du produit de référence.

## Règle de reprise

Avant toute action dans une nouvelle discussion :

1. relire ce fichier ;
2. vérifier `git status --short`, la branche et `git rev-parse HEAD` ;
3. relire la spec et le plan si la demande touche au harnais ;
4. ne jamais supposer que l’historique conversationnel remplace les fichiers versionnés ;
5. après toute modification, mettre à jour la documentation concernée et fournir les commandes de vérification.

Une nouvelle discussion ne doit jamais démarrer une modification avant cette vérification de continuité.
