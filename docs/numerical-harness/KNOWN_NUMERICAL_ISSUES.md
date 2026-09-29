# Known numerical issues

- La migration modifie la cohorte destination pendant l’itération des origines ; inverser l’ordre des pays modifie les sorties (`ORDER_DEPENDENT`). Le comportement actuel est caractérisé, pas corrigé.
- TXx/Hurs CCKP sont des proxies pour P99/RH de jour chaud.
- Les valeurs d’eau post-horizon sont maintenues comme références étiquetées jusqu’à 2200.
- Les coefficients internes EROI, carbone, cultures, mortalité et démographie n’ont pas de validation scientifique externe dans ce dépôt.
