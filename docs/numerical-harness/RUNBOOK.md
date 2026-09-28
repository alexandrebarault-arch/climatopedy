# Runbook local

1. `npm ci` dans le worktree si `node_modules` est absent.
2. `npm run harness:fast` avant un commit ou une modification numérique.
3. `npm run harness:full` pour la matrice complète et le rapport.
4. Lire `reports/numerical-impact-report.md` avant toute mise à jour de fixture.
5. Installer le garde local une seule fois avec `npm run harness:install-hook`.

Le hook est opt-in, local au worktree et n’exécute aucun service distant.
