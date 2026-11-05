# Qualité des images et hero immersif

## Audit des sources

Toutes les photographies configurées ont été examinées : accueil, collections, catalogue, galerie, variantes, miniatures et panier. Inventaire des fichiers PNG/WebP disponibles dans `public/images/` et `assets/inbox/`, et examen des planches extraites des archives antérieures. Les copies des deux anciennes planches n'apportent pas de résolution supplémentaire.

- 15 classiques : cellules source de 286 px de large ; l'ancien export 360 × 480 agrandissait le contenu.
- 4 originales : cellules source de 470 × 498–503 px, plus détaillées que les petites vignettes du ZIP publicitaire.
- Publicités : recadrages de 242 à 342 px de large. La planche de 1536 px n'est pas une photo individuelle HD : cette largeur est partagée entre plusieurs scènes.
- Ancien hero : 315 × 274 px. Impossible d'en tirer honnêtement une photographie plein écran nette.

Le tableau complet par photographie (poids, formats, ratios, source, tailles exportées, limites CSS, Retina et texte intégré) est dans `docs/image-quality-audit.json`. Les dimensions d'affichage indiquées sont les plafonds CSS, **pas des mesures issues d'un navigateur**. L'inventaire technique complet avec empreintes SHA-256 est conservé dans `assets/inbox/image-inventory.json`.

Les inscriptions de l'horloge et du bus sont des motifs décoratifs conservés. Aucun titre publicitaire n'a été masqué par une superposition de texte HTML.

## Traitement effectué

29 familles responsive, soit **91 fichiers WebP de tailles différentes**, et non 91 nouvelles photographies. Lecture directe des PNG sources pour éviter de recompresser les anciens WebP ; réemploi de la source classique déjà réparée sans W. Aucun nouveau traitement génératif, aucun détail inventé, aucun agrandissement du contenu (`withoutEnlargement: true`).

- Classiques : 90, 180 et 270 px de large.
- Originales : 90, 180, 270 et 360 px de large.
- Éditorial : 120, jusqu'à 240, puis largeur native de la scène (jamais plus).
- Fond blanc, cadrage complet, centrage et ratio catalogue 3:4 ; marges proportionnelles identiques entre les tailles d'une même photo.
- WebP qualité 96 pour les grands exports catalogue, 90 pour les petits ; qualité 94 pour l'éditorial. Ces chiffres sont des paramètres d'encodage, pas une mesure de la qualité des sources.

Les anciens fichiers publics et les PNG/ZIP sources sont conservés. Les 42 images de l'inventaire initial sont inchangées, vérification des empreintes SHA-256 effectuée après les exports. Les 19 cadrages ont aussi été inspectés sur une planche de contrôle : produits entiers, motifs conservés, pas de W visible. Le catalogue JSON, ses identifiants, ses prix, ses variantes, les règles de panier et les paramètres commerciaux restent inchangés.

## Affichage sur tout le site

`ResponsivePhoto.astro`, `photoProps()` et `image-renditions.json` centralisent `srcset`, `sizes`, dimensions et plafonds d'affichage. Cartes, publicités, scènes lifestyle, détails, galerie, miniatures et panier utilisent ces données. Aucun `filter` de netteté ou de flou, aucun mélange de couleurs, aucun zoom au survol des petites photos éditoriales.

| Usage | Traitement actuel | Limite restante |
| --- | --- | --- |
| Catalogue / collection | `contain`, fond blanc, maximum 270 px CSS, tailles adaptées à la grille | Retina 2× au maximum demanderait 540 × 720 ; sources insuffisantes |
| Galerie | Photo centrée à 270 × 360 CSS maximum, cadre stable | La grande galerie photographique nette nécessite de nouvelles sources |
| Miniatures | Sélection responsive adaptée à environ 72 px | 180/270 px couvrent les densités usuelles à cette taille |
| Panier | 90 × 120 CSS, variantes 90/180/270 | Retina 2× couvert par 180 px |
| Publicités / lifestyle | Ratio natif, sujet complet, largeur plafonnée à la source | Pour de grandes compositions ou Retina, nouveaux originaux HD nécessaires |

Réduire la taille d'affichage évite d'accentuer la pixellisation ; **cela n'augmente pas la résolution réelle**. Certains panneaux sont donc volontairement moins photographiques/grands avec les sources actuelles.

## Nouveau hero

Le bloc texte gauche / image droite est supprimé. `ImmersiveHero.astro` prépare une photographie d'arrière-plan bord à bord, un texte HTML superposé, un dégradé sombre derrière le texte et une transition vers le fond du site. Composition mobile distincte, bouton accessible et prise en charge d'une source portrait indépendante via `<picture>`.

**Aucune photographie disponible n'est adaptée : le hero affiche actuellement le texte sur fond sombre, sans étirer l'ancienne image ni afficher une fausse photo HD.** Les deux emplacements dans `src/config/hero.ts` restent `null`.

Pour terminer la campagne photographique :

- Desktop : minimum accepté 1920 × 900 ; recommandé 3840 × 2160 pour un écran 1920 px Retina. Bracelet entier sur la droite, espace sombre sans texte à gauche, marges de cadrage suffisantes.
- Mobile : minimum accepté 900 × 1200 ; recommandé 1440 × 1920. Bracelet entier, espace réservé au texte et au bouton.
- Versions plus petites obtenues par réduction des vrais originaux uniquement, puis déclaration dans `heroMedia.*.sources` ; les fichiers devront être contrôlés avant activation.
- Chargement `eager`, priorité haute et `sizes="100vw"` prévus pour ces vraies sources. Aucun petit visuel préchargé inutilement aujourd'hui.

Un nouveau visuel HD peut venir d'une photographie ou d'une génération publicitaire. Aucun nouveau visuel IA n'a été demandé à un outil dans cette intervention.

## Vérifications et limite de validation

Sept tests passent : anciens tests catalogue/panier conservés, dimensions des 91 exports contrôlées, descripteurs `srcset` cohérents, plafonds et séparation des variantes/publicités vérifiés, rejet d'une petite photo comme hero HD. La build Astro réussit sans erreur ni avertissement.

Le vérificateur de pages contrôle les 15 routes localisées, leurs liens/ancres, les ratios et tous les fichiers des `srcset`. L'autorisation du contrôle natif VS Code a expiré : pas de validation visuelle certifiée desktop/mobile, ni de mesure réelle des débordements ou de la netteté Retina. Les limites exposées ici restent donc explicites.

Reproduction locale :

```sh
node scripts/audit-images.mjs
node scripts/prepare-responsive-images.mjs
node scripts/report-image-quality.mjs
npm test
npm run build
node scripts/verify-storefront.mjs
```

Les scripts de préparation nécessitent les sources conservées dans `assets/inbox/`. Le déploiement n'en a pas besoin : les WebP et le manifeste sont versionnés.
