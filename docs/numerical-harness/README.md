# Numerical Harness V0

Ce harnais protège le comportement numérique actuel de Climatopedy. Il ne constitue pas une validation scientifique et ne modifie aucun calcul métier.

`npm run harness:fast` exécute les vecteurs, invariants, données manquantes, horizons, proxies, agrégats et le sous-ensemble Golden Master. `npm run harness:full` exécute FAST, produit le rapport d’impact et rejoue toute la matrice caractérisée.

Pour activer le contrôle local avant commit, exécuter `npm run harness:install-hook`. Cette configuration concerne uniquement le worktree courant.

Le contrat sémantique de structure et de contenu du site est documenté dans [SITE_GOLDEN_MASTER_V0.md](SITE_GOLDEN_MASTER_V0.md) et vérifié par `tests/siteGoldenMaster.test.ts`.

Règle de commits : le hook local lance FAST avant le commit, puis FAST et FULL après un commit pertinent. En cas d’échec post-commit, consulter le rapport et corriger explicitement dans un nouveau commit.
