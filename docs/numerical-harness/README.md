# Numerical Harness V0

Ce harnais protège le comportement numérique actuel de Climatopedy. Il ne constitue pas une validation scientifique et ne modifie aucun calcul métier.

`npm run harness:fast` exécute les vecteurs, invariants, données manquantes, horizons, proxies, agrégats et le sous-ensemble Golden Master. `npm run harness:full` exécute FAST, produit le rapport d’impact et rejoue toute la matrice caractérisée.

Pour activer le contrôle local avant commit, exécuter `npm run harness:install-hook`. Cette configuration concerne uniquement le worktree courant.

Le contrat sémantique de structure et de contenu du site est documenté dans [SITE_GOLDEN_MASTER_V0.md](SITE_GOLDEN_MASTER_V0.md) et vérifié par `tests/siteGoldenMaster.test.ts`.

Règle de commits : le hook local lance FAST avant le commit, puis FAST et FULL après un commit pertinent. En cas d’échec post-commit, consulter le rapport et corriger explicitement dans un nouveau commit.

Pour reprendre le travail dans une nouvelle discussion, commencer par [PROJECT_STATUS.md](PROJECT_STATUS.md), puis vérifier le worktree et le SHA courant avant toute modification.

Les rapports de reprise doivent toujours distinguer `PRODUCT_REFERENCE_SHA` (snapshot produit fixe) et `FINAL_HARNESS_SHA` (commit Git courant de la branche du harnais). Voir la section « Signification des deux SHA » de `PROJECT_STATUS.md`.
