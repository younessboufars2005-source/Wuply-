# WUPLY · Boutique wearable premium

Site Astro statique, îlots React limités au configurateur et au panier. FR, EN et AR (RTL). Aucun serveur métier, paiement ni collecte de coordonnées.

## Démarrage

Node 22.12+ recommandé. Sur Windows, utiliser `npm.cmd` si PowerShell bloque `npm.ps1`.

```sh
npm ci
npm run dev
npm run test
npm run build
npm run preview
```

La racine redirige vers `/fr/`. Pages : `/{fr,en,ar}/`, `catalog/`, `product/`, `cart/`, `checkout/`.

La refonte Dark Tech Luxury, les 10 visuels publicitaires et les vérifications sont documentés dans `docs/premium-redesign.md`. Après une build : `node scripts/verify-storefront.mjs` vérifie les routes générées, les liens et les images.

## Données et activation

- `src/config/site.ts` : identité, contacts, domaine, visibilité des prix et état commercial. Le nom interne n'est jamais rendu.
- `src/data/catalog.json` : produit unique, bracelets et variantes partagés entre configurateur et panier. Le tarif envisagé de 800 MAD est non validé et masqué. 19 variantes de bracelets issues des planches fournies, sans prix ni stock inventés.
- `src/i18n/index.ts` : toutes les traductions d'interface.
- `.pages.yml` : catalogue préparé pour Pages CMS. Les textes éditoriaux restent dans le dictionnaire typé ; leur édition CMS demandera une collection dédiée en phase 2.
- 19 photos de bracelets dans `public/images/bracelets/`, avec dimensions et textes alternatifs trilingues. Sources et archive conservées dans `assets/inbox/bracelets/` (ignorées par Git). Le visuel du dispositif seul reste typographique. Traitement et vérifications : `docs/bracelet-images.md`.
- La vente réelle doit être implémentée et auditée en phase 2. Les boutons actuels ajoutent exclusivement au panier démo, indépendamment des paramètres de vente. Les champs checkout sont désactivés, sans envoi réseau ni sauvegarde.
- Le panier ne conserve que les identifiants et quantités, jamais les prix. Les montants sont recalculés depuis le catalogue ; une future commande nécessitera un recalcul serveur. Les erreurs de stockage sont affichées. Pas de synchronisation du panier entre onglets.

## Cloudflare Pages / GitHub

Importer le dépôt GitHub existant dans Cloudflare Pages lorsque disponible. Branche de production : `main`. Commande : `npm run build`. Sortie : `dist`. Aucun adaptateur ou secret nécessaire au build statique. Variable optionnelle : `PUBLIC_SITE_URL` avec le domaine réellement validé (URL absolue HTTPS).

Par défaut : noindex, robots bloqués, sitemap vide, pas de canonical fictif. Après validation du domaine et des contenus, renseigner l'URL et passer `indexable` à `true`. Les canonical, hreflang et sitemap sont générés au build. Maintenir `indexable: false` sur les prévisualisations. Aucun Schema Product/Offer n'est émis faute d'identité et d'offre commerciale validées.

## Éléments à fournir pour la phase 2

Nom, logo, domaine, contacts et identité légale ; photos réelles et droits d'utilisation ; variantes, disponibilité et prix validés ; application et liens officiels ; politiques livraison/retour/garantie/confidentialité ; prestataire de paiement et validation serveur des commandes ; modalités du paiement à la livraison. Les polices DM Sans et Noto Sans Arabic sont chargées via Google Fonts avec fallback système ; un hébergement local pourra être ajouté avec les fichiers licenciés.

## Vérifications effectuées

Build de production réussie : 13 pages, dont la redirection racine. Contrôle Astro/TypeScript : zéro erreur et avertissement. Deux tests de logique panier réussis. Vérification des 12 pages localisées : HTTP 200, H1 unique, langue, RTL arabe, noindex, absence de canonical fictif et de prix non validé. Accueils sans hydratation React. Aucune détection de secret dans les sources.

Le navigateur de contrôle était indisponible dans cette session : l'inspection visuelle aux différentes tailles, les tests clavier et le parcours interactif complet restent à réaliser avant validation de la finition. Aucune publication ni connexion à GitHub/Cloudflare n'a été effectuée ; aucun dépôt distant n'était configuré.
