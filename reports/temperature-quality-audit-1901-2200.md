# Contrôle qualité exhaustif des températures par pays et par année

- Périmètre : 177 pays/territoires cartographiés × 300 années (1901–2200) × 3 scénarios = 159300 lignes vérifiées.
- Les entrées sont produites sur 34 zones climatiques; plusieurs pays/territoires partagent donc une même valeur de zone. Le registre conserve toutefois une ligne de contrôle distincte pour chaque pays/année/scénario.
- Couverture : complète.
- Contrôles élémentaires réussis : 1592469/1592469. Anomalies calculatoires : 0. Limites de formule attendues : 1988.

## Provenance temporelle

| Années | Classe | Interprétation |
|---|---|---|
| 1901–2025 | `reconstitution_historique_zone` | Anomalie mondiale appliquée aux proxys de zone; ce ne sont pas des relevés nationaux annuels. |
| 2026 | `ancrage_modele_non_observation` | Démarrage du modèle depuis la normale locale 1991–2020; aucune valeur annuelle nationale observée n’est prétendue. |
| 2027–2100 | `scenario_CCKP_CMIP6_interpole` | Évolution conditionnelle au scénario et aux sorties CCKP; pas une prévision météorologique. |
| 2101–2200 | `extension_exploratoire_post_2100` | Extension interne hors horizon CMIP6. |

L’absence d’observation pays-année dans les années reconstruites ou futures est une limite de provenance, pas une observation manquante substituée par zéro. En 2026, des bilans partiels nationaux peuvent exister; ils restent séparés du point MERRA-2 et de la simulation.

Un statut « conforme » signifie seulement que la ligne passe les contrôles de cohérence interne et de provenance décrits ci-dessous. Ce n’est pas une validation de la précision réelle contre une série annuelle officielle de chaque pays; ces séries nationales complètes ne sont pas intégrées.

## Règles de contrôle et conduite à tenir

- Vérifier les années et les pays cartographiés attendus, la présence d’une zone et d’un état pour chaque scénario.
- Exiger des températures annuelles finies dans [-100, 70]°C, ainsi que Tmin ≤ moyenne annuelle ≤ Tmax. Le P99 est borné dans [-100, 75]°C. Ces bornes sont des détecteurs grossiers d’erreurs d’unité/source, pas des limites climatiques nationales.
- Exiger un P99 chaud fini et plausible, supérieur ou égal à la moyenne annuelle des Tmax quotidiennes.
- Exiger une humidité relative dans 0–100 %.
- Recalculer Tw à partir des mêmes P99/RH : la valeur doit correspondre à Stull dans une tolérance de 0.05°C; lorsqu’une entrée est hors domaine, Tw doit rester vide/NC.
- Comparer chaque valeur à l’année précédente : plus de ±2°C sur les températures annuelles, ±3°C sur le P99 ou ±10 points RH est signalé pour enquête; rien n’est lissé automatiquement.
- Pour chaque anomalie, le journal indique le code, le pays, la zone partagée, l’année, le scénario, la cause probable et une correction recommandée. Corriger la source ou le rattachement en amont; ne pas éditer une valeur exportée à la main.

### Anomalies détectées

| Code | Gravité | Occurrences | Diagnostic | Correction recommandée |
|---|---|---:|---|---|
| TW_HORS_DOMAINE_STULL | information | 1988 | Tw est correctement indisponible car au moins une entrée est hors du domaine publié de Stull. | Aucune correction de données : conserver NC et afficher quelle entrée dépasse le domaine. |

### Limites attendues des formules

Tw est correctement marquée non calculable pour 1988 lignes pays/année/scénario lorsque Ta ou RH dépasse le domaine de Stull. Ce sont des limites de calcul, pas des valeurs corrigibles par extrapolation.

## Couverture pays par pays

| Pays/territoire | Zone partagée | Lignes vérifiées | Anomalies | Limites Stull |
|---|---|---:|---:|---:|
| Fiji (242) | aus (6 membres) | 900/900 | 0 | 0 |
| Tanzania (834) | eaf (5 membres) | 900/900 | 0 | 0 |
| W. Sahara (732) | nafr (5 membres) | 900/900 | 0 | 62 |
| Canada (124) | can (1 membres) | 900/900 | 0 | 0 |
| United States of America (840) | usa (1 membres) | 900/900 | 0 | 0 |
| Kazakhstan (398) | casia (8 membres) | 900/900 | 0 | 0 |
| Uzbekistan (860) | casia (8 membres) | 900/900 | 0 | 0 |
| Papua New Guinea (598) | idn (5 membres) | 900/900 | 0 | 0 |
| Indonesia (360) | idn (5 membres) | 900/900 | 0 | 0 |
| Argentina (032) | arg (5 membres) | 900/900 | 0 | 0 |
| Chile (152) | arg (5 membres) | 900/900 | 0 | 0 |
| Dem. Rep. Congo (180) | cod (7 membres) | 900/900 | 0 | 0 |
| Somalia (706) | eth (5 membres) | 900/900 | 0 | 0 |
| Kenya (404) | eaf (5 membres) | 900/900 | 0 | 0 |
| Sudan (729) | egy (3 membres) | 900/900 | 0 | 0 |
| Chad (148) | cod (7 membres) | 900/900 | 0 | 0 |
| Haiti (332) | cen_am (14 membres) | 900/900 | 0 | 0 |
| Dominican Rep. (214) | cen_am (14 membres) | 900/900 | 0 | 0 |
| Russia (643) | rus (2 membres) | 900/900 | 0 | 0 |
| Bahamas (044) | cen_am (14 membres) | 900/900 | 0 | 0 |
| Falkland Is. (238) | arg (5 membres) | 900/900 | 0 | 0 |
| Norway (578) | sca (9 membres) | 900/900 | 0 | 0 |
| Greenland (304) | sca (9 membres) | 900/900 | 0 | 0 |
| Fr. S. Antarctic Lands (260) | rus (2 membres) | 900/900 | 0 | 0 |
| Timor-Leste (626) | idn (5 membres) | 900/900 | 0 | 0 |
| South Africa (710) | zaf (11 membres) | 900/900 | 0 | 0 |
| Lesotho (426) | zaf (11 membres) | 900/900 | 0 | 0 |
| Mexico (484) | mex (1 membres) | 900/900 | 0 | 0 |
| Uruguay (858) | arg (5 membres) | 900/900 | 0 | 0 |
| Brazil (076) | bra (1 membres) | 900/900 | 0 | 0 |
| Bolivia (068) | and (8 membres) | 900/900 | 0 | 0 |
| Peru (604) | and (8 membres) | 900/900 | 0 | 0 |
| Colombia (170) | and (8 membres) | 900/900 | 0 | 0 |
| Panama (591) | cen_am (14 membres) | 900/900 | 0 | 0 |
| Costa Rica (188) | cen_am (14 membres) | 900/900 | 0 | 0 |
| Nicaragua (558) | cen_am (14 membres) | 900/900 | 0 | 0 |
| Honduras (340) | cen_am (14 membres) | 900/900 | 0 | 0 |
| El Salvador (222) | cen_am (14 membres) | 900/900 | 0 | 0 |
| Guatemala (320) | cen_am (14 membres) | 900/900 | 0 | 0 |
| Belize (084) | cen_am (14 membres) | 900/900 | 0 | 0 |
| Venezuela (862) | and (8 membres) | 900/900 | 0 | 0 |
| Guyana (328) | and (8 membres) | 900/900 | 0 | 0 |
| Suriname (740) | and (8 membres) | 900/900 | 0 | 0 |
| France (fra_metro) | fra (1 membres) | 900/900 | 0 | 0 |
| Guyane Française (fra_guyana) | and (8 membres) | 900/900 | 0 | 0 |
| Ecuador (218) | and (8 membres) | 900/900 | 0 | 0 |
| Puerto Rico (630) | cen_am (14 membres) | 900/900 | 0 | 0 |
| Jamaica (388) | cen_am (14 membres) | 900/900 | 0 | 0 |
| Cuba (192) | cen_am (14 membres) | 900/900 | 0 | 0 |
| Zimbabwe (716) | zaf (11 membres) | 900/900 | 0 | 0 |
| Botswana (072) | zaf (11 membres) | 900/900 | 0 | 0 |
| Namibia (516) | zaf (11 membres) | 900/900 | 0 | 0 |
| Senegal (686) | nga (15 membres) | 900/900 | 0 | 0 |
| Mali (466) | nga (15 membres) | 900/900 | 0 | 0 |
| Mauritania (478) | nga (15 membres) | 900/900 | 0 | 0 |
| Benin (204) | nga (15 membres) | 900/900 | 0 | 0 |
| Niger (562) | nga (15 membres) | 900/900 | 0 | 0 |
| Nigeria (566) | nga (15 membres) | 900/900 | 0 | 0 |
| Cameroon (120) | cod (7 membres) | 900/900 | 0 | 0 |
| Togo (768) | nga (15 membres) | 900/900 | 0 | 0 |
| Ghana (288) | nga (15 membres) | 900/900 | 0 | 0 |
| Côte d'Ivoire (384) | nga (15 membres) | 900/900 | 0 | 0 |
| Guinea (324) | nga (15 membres) | 900/900 | 0 | 0 |
| Guinea-Bissau (624) | nga (15 membres) | 900/900 | 0 | 0 |
| Liberia (430) | nga (15 membres) | 900/900 | 0 | 0 |
| Sierra Leone (694) | nga (15 membres) | 900/900 | 0 | 0 |
| Burkina Faso (854) | nga (15 membres) | 900/900 | 0 | 0 |
| Central African Rep. (140) | cod (7 membres) | 900/900 | 0 | 0 |
| Congo (178) | cod (7 membres) | 900/900 | 0 | 0 |
| Gabon (266) | cod (7 membres) | 900/900 | 0 | 0 |
| Eq. Guinea (226) | cod (7 membres) | 900/900 | 0 | 0 |
| Zambia (894) | zaf (11 membres) | 900/900 | 0 | 0 |
| Malawi (454) | zaf (11 membres) | 900/900 | 0 | 0 |
| Mozambique (508) | zaf (11 membres) | 900/900 | 0 | 0 |
| eSwatini (748) | zaf (11 membres) | 900/900 | 0 | 0 |
| Angola (024) | zaf (11 membres) | 900/900 | 0 | 0 |
| Burundi (108) | eaf (5 membres) | 900/900 | 0 | 0 |
| Israel (376) | irn (7 membres) | 900/900 | 0 | 0 |
| Lebanon (422) | irn (7 membres) | 900/900 | 0 | 0 |
| Madagascar (450) | zaf (11 membres) | 900/900 | 0 | 0 |
| Palestine (275) | irn (7 membres) | 900/900 | 0 | 0 |
| Gambia (270) | nga (15 membres) | 900/900 | 0 | 0 |
| Tunisia (788) | nafr (5 membres) | 900/900 | 0 | 62 |
| Algeria (012) | nafr (5 membres) | 900/900 | 0 | 62 |
| Jordan (400) | irn (7 membres) | 900/900 | 0 | 0 |
| United Arab Emirates (784) | sau (6 membres) | 900/900 | 0 | 109 |
| Qatar (634) | sau (6 membres) | 900/900 | 0 | 109 |
| Kuwait (414) | sau (6 membres) | 900/900 | 0 | 109 |
| Iraq (368) | irn (7 membres) | 900/900 | 0 | 0 |
| Oman (512) | sau (6 membres) | 900/900 | 0 | 109 |
| Vanuatu (548) | aus (6 membres) | 900/900 | 0 | 0 |
| Cambodia (116) | sea (6 membres) | 900/900 | 0 | 0 |
| Thailand (764) | sea (6 membres) | 900/900 | 0 | 0 |
| Laos (418) | sea (6 membres) | 900/900 | 0 | 0 |
| Myanmar (104) | sea (6 membres) | 900/900 | 0 | 0 |
| Vietnam (704) | sea (6 membres) | 900/900 | 0 | 0 |
| North Korea (408) | chn (4 membres) | 900/900 | 0 | 0 |
| South Korea (410) | jpn (2 membres) | 900/900 | 0 | 0 |
| Mongolia (496) | chn (4 membres) | 900/900 | 0 | 0 |
| India (356) | ind (4 membres) | 900/900 | 0 | 126 |
| Bangladesh (050) | bgd (1 membres) | 900/900 | 0 | 0 |
| Bhutan (064) | ind (4 membres) | 900/900 | 0 | 126 |
| Nepal (524) | ind (4 membres) | 900/900 | 0 | 126 |
| Pakistan (586) | pak (2 membres) | 900/900 | 0 | 260 |
| Afghanistan (004) | pak (2 membres) | 900/900 | 0 | 260 |
| Tajikistan (762) | casia (8 membres) | 900/900 | 0 | 0 |
| Kyrgyzstan (417) | casia (8 membres) | 900/900 | 0 | 0 |
| Turkmenistan (795) | casia (8 membres) | 900/900 | 0 | 0 |
| Iran (364) | irn (7 membres) | 900/900 | 0 | 0 |
| Syria (760) | irn (7 membres) | 900/900 | 0 | 0 |
| Armenia (051) | casia (8 membres) | 900/900 | 0 | 0 |
| Sweden (752) | sca (9 membres) | 900/900 | 0 | 0 |
| Belarus (112) | ukr (3 membres) | 900/900 | 0 | 0 |
| Ukraine (804) | ukr (3 membres) | 900/900 | 0 | 0 |
| Poland (616) | eeu (14 membres) | 900/900 | 0 | 0 |
| Austria (040) | deu (6 membres) | 900/900 | 0 | 0 |
| Hungary (348) | eeu (14 membres) | 900/900 | 0 | 0 |
| Moldova (498) | ukr (3 membres) | 900/900 | 0 | 0 |
| Romania (642) | eeu (14 membres) | 900/900 | 0 | 0 |
| Lithuania (440) | sca (9 membres) | 900/900 | 0 | 0 |
| Latvia (428) | sca (9 membres) | 900/900 | 0 | 0 |
| Estonia (233) | sca (9 membres) | 900/900 | 0 | 0 |
| Germany (276) | deu (6 membres) | 900/900 | 0 | 0 |
| Bulgaria (100) | eeu (14 membres) | 900/900 | 0 | 0 |
| Greece (300) | med_eu (6 membres) | 900/900 | 0 | 0 |
| Turkey (792) | tur (1 membres) | 900/900 | 0 | 0 |
| Albania (008) | eeu (14 membres) | 900/900 | 0 | 0 |
| Croatia (191) | eeu (14 membres) | 900/900 | 0 | 0 |
| Switzerland (756) | deu (6 membres) | 900/900 | 0 | 0 |
| Luxembourg (442) | deu (6 membres) | 900/900 | 0 | 0 |
| Belgium (056) | deu (6 membres) | 900/900 | 0 | 0 |
| Netherlands (528) | deu (6 membres) | 900/900 | 0 | 0 |
| Portugal (620) | med_eu (6 membres) | 900/900 | 0 | 0 |
| Spain (724) | med_eu (6 membres) | 900/900 | 0 | 0 |
| Ireland (372) | gbr (2 membres) | 900/900 | 0 | 0 |
| New Caledonia (540) | aus (6 membres) | 900/900 | 0 | 0 |
| Solomon Is. (090) | aus (6 membres) | 900/900 | 0 | 0 |
| New Zealand (554) | aus (6 membres) | 900/900 | 0 | 0 |
| Australia (036) | aus (6 membres) | 900/900 | 0 | 0 |
| Sri Lanka (144) | ind (4 membres) | 900/900 | 0 | 126 |
| China (156) | chn (4 membres) | 900/900 | 0 | 0 |
| Taiwan (158) | chn (4 membres) | 900/900 | 0 | 0 |
| Italy (380) | med_eu (6 membres) | 900/900 | 0 | 0 |
| Denmark (208) | sca (9 membres) | 900/900 | 0 | 0 |
| United Kingdom (826) | gbr (2 membres) | 900/900 | 0 | 0 |
| Iceland (352) | sca (9 membres) | 900/900 | 0 | 0 |
| Azerbaijan (031) | casia (8 membres) | 900/900 | 0 | 0 |
| Georgia (268) | casia (8 membres) | 900/900 | 0 | 0 |
| Philippines (608) | sea (6 membres) | 900/900 | 0 | 0 |
| Malaysia (458) | idn (5 membres) | 900/900 | 0 | 0 |
| Brunei (096) | idn (5 membres) | 900/900 | 0 | 0 |
| Slovenia (705) | eeu (14 membres) | 900/900 | 0 | 0 |
| Finland (246) | sca (9 membres) | 900/900 | 0 | 0 |
| Slovakia (703) | eeu (14 membres) | 900/900 | 0 | 0 |
| Czechia (203) | eeu (14 membres) | 900/900 | 0 | 0 |
| Eritrea (232) | eth (5 membres) | 900/900 | 0 | 0 |
| Japan (392) | jpn (2 membres) | 900/900 | 0 | 0 |
| Paraguay (600) | arg (5 membres) | 900/900 | 0 | 0 |
| Yemen (887) | sau (6 membres) | 900/900 | 0 | 109 |
| Saudi Arabia (682) | sau (6 membres) | 900/900 | 0 | 109 |
| N. Cyprus (N. Cyprus) | med_eu (6 membres) | 900/900 | 0 | 0 |
| Cyprus (196) | med_eu (6 membres) | 900/900 | 0 | 0 |
| Morocco (504) | nafr (5 membres) | 900/900 | 0 | 62 |
| Egypt (818) | egy (3 membres) | 900/900 | 0 | 0 |
| Libya (434) | nafr (5 membres) | 900/900 | 0 | 62 |
| Ethiopia (231) | eth (5 membres) | 900/900 | 0 | 0 |
| Djibouti (262) | eth (5 membres) | 900/900 | 0 | 0 |
| Somaliland (Somaliland) | eth (5 membres) | 900/900 | 0 | 0 |
| Uganda (800) | eaf (5 membres) | 900/900 | 0 | 0 |
| Rwanda (646) | eaf (5 membres) | 900/900 | 0 | 0 |
| Bosnia and Herz. (070) | eeu (14 membres) | 900/900 | 0 | 0 |
| Macedonia (807) | eeu (14 membres) | 900/900 | 0 | 0 |
| Serbia (688) | eeu (14 membres) | 900/900 | 0 | 0 |
| Montenegro (499) | eeu (14 membres) | 900/900 | 0 | 0 |
| Kosovo (Kosovo) | eeu (14 membres) | 900/900 | 0 | 0 |
| Trinidad and Tobago (780) | cen_am (14 membres) | 900/900 | 0 | 0 |
| S. Sudan (728) | egy (3 membres) | 900/900 | 0 | 0 |

## Fichiers de vérification

- `temperature-quality-checklist-1901-2200.csv` : registre complet, une ligne par pays/territoire × année × scénario.
- `temperature-quality-issues-1901-2200.csv` : anomalies et limites de calcul seulement, avec diagnostic et action recommandée.
- `temperature-trajectory-by-country-1901-2200.csv` : valeurs auditées utilisées pour le registre.

Reproduire avec `npm run audit:climate`. La commande se termine en erreur si elle trouve des anomalies calculatoires; elle laisse les registres écrits afin de permettre l’enquête. Les limites attendues de Stull n’échouent pas l’audit.

Répartition par classe : reconstitution_historique_zone=66375, ancrage_modele_non_observation=531, scenario_CCKP_CMIP6_interpole=39294, extension_exploratoire_post_2100=53100.
