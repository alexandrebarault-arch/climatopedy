# CI policy

La politique V0 est exclusivement locale : FAST est lancé par le hook `pre-commit` opt-in et FAST + FULL sont relancés par `post-commit` après tout commit pertinent. Le dépôt ne contient aucun workflow GitHub Actions ; GitHub reçoit uniquement les commits poussés depuis le poste local. Un commit local et un push sont des opérations distinctes.
