# Site Golden Master V0

Le contrat sémantique du site est défini dans `tests/siteGoldenMaster.v0.json` et vérifié par `tests/siteGoldenMaster.test.ts`.

Il fige les six pages, leur vue principale, les composants indispensables de la carte, plusieurs contenus critiques et les fichiers propriétaires de chaque zone.

Ce contrat ne fige pas chaque pixel CSS. Une modification volontaire de structure ou de contenu doit modifier explicitement le manifeste et le test dans le même changement revu. Une modification d’une zone indépendante ne doit pas modifier silencieusement une autre zone.

Les snapshots numériques et le contrat de site sont versionnés séparément : `GOLDEN_MASTER_VERSION=V0` et `SITE_GOLDEN_MASTER_VERSION=V0`.
