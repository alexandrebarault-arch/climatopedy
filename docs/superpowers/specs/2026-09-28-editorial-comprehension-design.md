# Spécification — compréhension éditoriale du site

## Objectif

Rendre les textes de CLIMATOPEDY compréhensibles par une personne curieuse qui ne possède pas de formation scientifique. Le dispositif doit éviter que des noms de chercheurs, sigles, notions spécialisées ou précautions méthodologiques apparaissent sans repère suffisant, et donner à l’équipe un contrôle réutilisable lors des changements futurs.

## Contexte observé

Les textes affichés aux visiteurs sont répartis dans des composants React. Le contenu comprend notamment une FAQ/lexique, les vues de sources scientifiques et des explications dans les cartes et visualisations. Le projet possède déjà des tests Node/tsx, un contrôle TypeScript et des vérifications exécutées lors du build. Un dispositif éditorial doit s’insérer dans ce processus sans déplacer immédiatement tout le contenu vers un nouveau système.

Exemple du problème : la FAQ mentionne « Smil » et « Erisman et al. » sans présenter ces personnes avant leurs estimations. Des formulations comme « effet ciseau de la déplétion fossile », « estimation agrégée » et « contrefactuel » peuvent demander des connaissances préalables. Les précisions scientifiques présentes sont utiles, mais doivent être exprimées de façon lisible.

## Principes éditoriaux

1. **Partir du lecteur non spécialiste.** Employer des mots courants et des phrases directes. Introduire un terme technique seulement s’il apporte une information utile.
2. **Présenter les noms propres.** À la première mention dans un contexte de lecture, donner en quelques mots l’identité et la pertinence de la personne ou de l’organisme. Exemple : « Vaclav Smil, chercheur spécialiste de l’énergie et de l’histoire des techniques ». Ne pas supposer que « et al. » identifie les auteurs.
3. **Déplier les sigles et symboles.** Donner le nom complet à la première occurrence pertinente, puis utiliser le sigle si nécessaire. Expliquer les notations chimiques ou unités qui ne sont pas évidentes dans leur contexte.
4. **Traduire les notions abstraites.** Préférer une formulation concrète, ou donner immédiatement une explication courte. Exemple : remplacer « déplétion fossile » par « baisse de la disponibilité des combustibles fossiles » lorsque le sens visé le permet.
5. **Rendre les chiffres interprétables.** Indiquer qui/quoi est compté, à quelle période et à quelle échelle. Distinguer une estimation historique d’une mesure directe ou d’une prédiction.
6. **Séparer source et conclusion du site.** Expliquer ce que l’étude a estimé, puis préciser simplement ce qu’elle ne permet pas de conclure si cette limite est utile au lecteur. Éviter les termes méthodologiques non expliqués tels que « contrefactuel ».
7. **Garder les nuances sans jargon défensif.** Les limites scientifiques doivent rester exactes et proportionnées; les avertissements ne doivent pas noyer le résultat principal.
8. **Utiliser des explications cohérentes.** Un terme récurrent doit conserver la même définition de base dans la FAQ, les visualisations, les sources et les aides contextuelles, tout en adaptant la longueur au composant.

## Registre éditorial

Créer un registre versionné, lisible par l’équipe et exploitable par le script, dans `docs/editorial/terms.json` (ou un format équivalent validé avant l’implémentation). Chaque entrée comprend au minimum :

- terme ou motif à repérer;
- catégorie (sigle, personne, notion, unité, formulation à éviter);
- explication de référence en français courant;
- gravité / niveau de contrôle;
- variantes connues et exceptions contextuelles autorisées, si nécessaire.

Le registre est un inventaire de points d’attention, pas une liste prétendant couvrir tout le vocabulaire spécialisé. Il doit commencer par les occurrences déjà identifiées (Smil, Erisman, « et al. », azote réactif/de synthèse, ammoniac de synthèse, déplétion fossile, estimation agrégée, contrefactuel) et s’enrichir au fil des revues éditoriales. Les définitions peuvent être formulées différemment dans l’interface si elles gardent le même sens et satisfont les principes ci-dessus.

## Harnais de contrôle

Ajouter un audit éditorial déterministe, sans dépendance à un service externe, intégré aux scripts npm existants et à la vérification continue du projet.

Le harnais doit :

- parcourir les sources de contenu destinées aux visiteurs, en excluant les dépendances, les fichiers générés et les textes purement internes;
- signaler les termes du registre trouvés sans explication locale suffisante ou renvoi clair vers une définition accessible;
- signaler certains motifs structurels simples (sigle en capitales non développé à proximité, nom propre du registre sans identification, tournure interdite explicitement recensée);
- produire des diagnostics avec fichier, ligne si possible, terme concerné et raison;
- distinguer les erreurs bloquantes des avertissements éditoriaux;
- permettre des exceptions explicites, localisées et commentées, plutôt que des exclusions globales silencieuses;
- avoir des tests couvrant les cas conformes, les cas signalés, les exceptions et les textes hors périmètre.

L’analyse automatique ne prétend pas comprendre le texte ni juger son niveau de lecture. Les contrôles de voisinage et de motif sont des heuristiques; un humain doit pouvoir examiner les diagnostics et relire les écrans rendus. L’audit ne doit pas bloquer le build sur une formulation qu’il ne peut pas évaluer objectivement. Au départ, seuls les contrôles déterministes convenus seront bloquants; les heuristiques lexicales seront des avertissements jusqu’à ce que leur précision soit éprouvée.

## Revue éditoriale du site

Faire un passage initial sur l’ensemble du texte effectivement visible : titres, paragraphes, libellés d’interface, infobulles, FAQ/lexique, cartes de données, descriptions de sources et contenus mobiles. Pour chaque problème, corriger au plus près du texte et mettre à jour le registre si le problème est récurrent. Les sources scientifiques peuvent conserver leur titre bibliographique original, accompagné d’un titre ou d’une explication compréhensible lorsque le titre est affiché au public.

Une revue manuelle finale vérifie au minimum :

- qu’une personne sans connaissances préalables peut expliquer avec ses mots l’idée principale de chaque module;
- que les personnes et organismes sont identifiables;
- que les chiffres ont un sujet, une période et une échelle;
- que les explications n’ajoutent pas de conclusion non soutenue par la source;
- que les textes restent lisibles sur petit écran et dans leur contexte visuel.

## Exemple de direction de réécriture

Formulation actuelle : « L’effet ciseau de la déplétion fossile ».

Direction proposée : **« Quand le gaz devient moins disponible »**. Puis expliquer que la fabrication classique de l’ammoniac utilise du gaz naturel comme matière première et comme source d’énergie. Enfin préciser en termes simples que l’étude citée ne calcule pas directement l’effet d’une baisse d’approvisionnement sur les récoltes ou le risque de famine.

À la première mention des estimations : présenter brièvement Vaclav Smil et Jan Willem Erisman et expliquer que leurs chiffres décrivent la part estimée de la population nourrie grâce aux cultures ayant bénéficié de l’azote synthétique, avec leur période respective. Conserver la limite importante en disant explicitement que cela ne signifie pas que chaque personne contient une fraction mesurée d’azote provenant de ces engrais.

Ces formulations sont des exemples de ton et de méthode; les valeurs, les sources et leur interprétation scientifique devront être vérifiées pendant la revue de contenu.

## Périmètre et hors périmètre

Inclus : charte courte, registre éditorial, audit automatisé, intégration au flux de vérification existant, revue initiale de tous les textes exposés aux visiteurs.

Hors périmètre : refonte visuelle, réécriture de toutes les sources bibliographiques, migration générale du contenu hors des composants React, notation automatique de lisibilité présentée comme preuve de compréhension, génération automatique de définitions par IA.

## Critères d’acceptation

- La charte fournit des règles concrètes pour les noms propres, sigles, notions, chiffres et limites scientifiques.
- Le registre est maintenable, versionné, et documente les motifs et exceptions.
- L’audit indique où se trouve chaque problème et sépare erreurs et avertissements.
- Le contrôle est lancé par une commande documentée et branché au flux CI/build selon la stratégie de sévérité retenue.
- Des tests vérifient le comportement du harnais sans rendre les exceptions opaques.
- Les textes identifiés dans l’exemple (Smil, Erisman et notions attenantes) sont révisés et des termes spécifiques sont expliqués à leur première occurrence utile.
- Une revue manuelle couvre toutes les surfaces textuelles exposées au public; l’automatisation n’est pas présentée comme substitut à cette revue.
- La documentation du projet explique comment ajouter un terme et traiter un nouveau diagnostic.

## Décisions à confirmer avant le plan d’implémentation

Cette spécification propose une charte générale en français courant et un harnais à sévérité graduée : les règles objectives peuvent bloquer, les heuristiques restent informatives au début. Le registre est initialement tenu dans un fichier versionné distinct, tandis que les textes existants demeurent dans leurs composants. La revue couvre l’ensemble du contenu visible du site.
