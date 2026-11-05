# Refonte Dark Tech Luxury

## Réalisation

Accueil entièrement recomposé : hero photographique sombre « YOUR BAND. YOUR STYLE. », deux collections, sélection sur fond clair, scène sportive « MADE TO MOVE WITH YOU. », scènes quotidiennes, personnalisation et détails textiles. Navigation sombre fixe, transition au défilement, menu mobile natif avec fermeture par Échap, footer organisé. Animations CSS et IntersectionObserver avec respect de `prefers-reduced-motion`.

Nouvelles pages `/{fr,en,ar}/catalog/`, avec les 19 variantes existantes. Les URL antérieures sont conservées. Fiche `product/` réorganisée avec grande photo fidèle à la sélection, collections repliables, quantité, ajout du bracelet seul et accès au dispositif configuré. Les cartes proposent un ajout rapide au panier démo via les mêmes fonctions de normalisation et d'ajout que le panier existant.

Le catalogue JSON, les 19 photos réelles, tous les prix, les règles du panier, les paramètres commerciaux, le checkout, la configuration Astro et les dépendances sont inchangés. Les prix non validés restent masqués ; commandes et paiements restent désactivés. Aucun stock, propriété de matériau, avis ou compatibilité avec une génération précise de WHOOP n'a été inventé.

## Images

L'archive effectivement reçue était `public/images/bracelets/visuels_wearable_store.zip`. Elle est extraite puis conservée dans `assets/inbox/wearable-visuals/visuels_wearable_store.zip`, hors du dossier public. Les cinq planches restent dans `assets/inbox/wearable-visuals/visuels/`, ignoré par Git.

**10 recadrages distincts**, WebP, environ **127 Kio au total** :

| Dossier sous `public/images/wearable/` | Fichiers |
| --- | --- |
| `hero/` | `black-band.webp` |
| `collections/` | `classic.webp`, `original.webp`, `colour-composition.webp` |
| `lifestyle/` | `training.webp`, `everyday.webp`, `office.webp` |
| `details/` | `textile.webp`, `on-desk.webp` |
| `products/` | `turquoise-editorial.webp` |

Aucune nouvelle génération d'image n'a été effectuée : découpage déterministe des images fournies, suppression des séparations de planche, proportions conservées et compression via Sharp. Aucun texte commercial incrusté à masquer ; les inscriptions décoratives des motifs restent visibles. La scène avec gouttes et le métal avec ports apparents ne sont pas utilisés pour suggérer des propriétés techniques.

La planche « catalogue_19_bracelets » montre en réalité 20 vignettes, dont des couleurs absentes du catalogue confirmé. Elle n'est donc pas découpée pour créer des variantes. Les **19 photographies réelles antérieures** restent la référence exclusive pour les cartes, la sélection et le panier. Les publicités générées sont identifiées comme telles dans les légendes ou textes alternatifs ; elles ne prouvent aucune propriété technique.

La résolution des recadrages publicitaires est faible (environ 242–342 px de large) : conservation de la résolution native, sans faux détail reconstitué. Pour un rendu Retina grand écran plus net, fournir les compositions individuelles en haute définition. Le cadrage utilise `object-fit: contain` pour garder les produits entiers.

## Fichiers

Créés : `src/styles/storefront.css`, `src/i18n/storefront.ts`, `src/data/visuals.ts`, `src/pages/[lang]/catalog.astro`, `scripts/prepare-storefront-visuals.mjs`, `scripts/verify-storefront.mjs`, `tests/editorial.test.mjs`, ce rapport et les 10 WebP listés ci-dessus.

Modifiés : `src/layouts/Base.astro`, `src/pages/[lang]/index.astro`, `src/pages/[lang]/product.astro`, `src/components/BraceletCollections.astro`, `src/components/Configurator.tsx`, `src/pages/sitemap.xml.ts`, `README.md`.

## Vérifications

- `npm run build` : réussie, 16 pages dont la redirection racine ; Astro/TypeScript : 0 erreur, 0 avertissement.
- `npm test` : 5 tests réussis, couvrant les fichiers d'images, les identifiants et traductions, la séparation publicités/variantes, les 38 configurations bracelet seul/dispositif et la persistance du panier.
- `node scripts/verify-storefront.mjs` : 15 pages localisées, 552 liens et ancres internes, 159 références d'images vérifiés ; H1 uniques, ratios déclarés corrects, RTL arabe, 19 choix produit et accueil sans hydratation React.
- HTTP : 15 pages et 10 publicités répondent en 200.
- Comparaison Git : catalogue, prix, configuration commerciale, checkout et logique métier inchangés. `git diff --check` réussi ; recherche ciblée de secrets sans résultat.
- Tentative de contrôle natif Chrome interrompue par une entrée utilisateur puis une fenêtre minimisée. **Le rendu visuel desktop/mobile, le test clavier complet et le parcours interactif en navigateur ne sont pas certifiés.** Les contrôles automatisés ne remplacent pas cette validation.

Les sources sont préparées pour le déploiement statique existant. Aucun dépôt distant n'étant configuré dans ce checkout, aucun push ni déploiement automatique ne peut être confirmé.
