# Intégration des bracelets

19 photos WebP dans `public/images/bracelets/`, 360 × 480 px, environ 540 Kio au total. 15 variantes classiques (10 finitions noires, 5 dorées) et 4 originales (turquoise/horloge, marine/ours, blanc/bus londonien, noir/faucon). Les finitions décrivent l'apparence, pas la composition du métal.

Sources : archive déplacée sans modification dans `assets/inbox/bracelets/bracelets_2_planches_photos.zip`. Les deux planches et les intermédiaires sont conservés dans le même dossier, ignoré par Git. Aucun original n'a été supprimé. Les sources brutes avec logos restent hors du dossier public et du commit.

## Traitement réellement effectué

- Retouche par l'outil intégré ImageGen, uniquement pour obtenir les surfaces métalliques sans les 15 W.
- Prompt : « Edit this exact supplied product contact sheet. Remove ONLY the tiny engraved W logo on the metal horizontal clasp of EACH of the 15 bands (5 columns x 3 rows). Smoothly restore the same metal surface and its original lighting where the logo was. Preserve exactly every band's original textile color, texture, shape, position, scale, metal color, shadows, and the 1536x1024 sheet framing and white background. No changes whatsoever to anything other than these 15 tiny engraved W marks. Do not add anything. Keep all 15 complete products. »
- Pour éviter les autres changements de la retouche générative, seuls les masques locaux de 31 × 27 px autour de chaque W sont repris ; la luminosité est raccordée aux pixels source de part et d'autre. Tout le reste de la planche classique conserve les pixels d'origine avant redimensionnement.
- Les quatre modèles à motifs ne passent pas par la retouche générative. Leurs motifs et inscriptions sont conservés.
- Recadrage, centrage, marges blanches, conservation des ombres et encodage WebP via Sharp. Aucune reconstruction de texture ou de détail. La netteté reste limitée par la résolution des planches fournies.
- Script : `node scripts/import-bracelets.mjs`. Il nécessite les deux sources extraites et `metal-retouched.png` dans le dossier inbox. Fusion du catalogue par identifiants, sans duplication ni changement de prix.

## Fonctionnement et vérifications

Les variantes sont sélectionnables en démonstration (`demoSelectable`), sans en déduire un stock disponible. Aucun prix d'accessoire ajouté ; le produit existant et ses paramètres sont conservés. L'ajout d'un bracelet seul est distingué d'un dispositif configuré dans la clé de panier. Les anciennes entrées sans `itemType` restent compatibles.

Inspection des 19 images sur planche de contrôle et des 15 fermoirs agrandis : aucun W visible, produits entiers et motifs conservés. Quatre tests automatisés vérifient les images, les 19 identifiants, les traductions et la persistance distincte des 38 combinaisons bracelet seul / dispositif configuré. Build Astro/TypeScript réussie, sans erreur ni avertissement.

L'accès au navigateur est indisponible dans cette session : le contrôle visuel réel du site sur ordinateur et téléphone, et le parcours interactif dans un navigateur, ne sont pas certifiés. Les règles responsive utilisent des grilles adaptatives et `object-fit: contain`.
