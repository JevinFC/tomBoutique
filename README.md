# Tom Boutique

Prototype de la page d'accueil de la boutique de Tom : **noir dehors, fluo dedans.**
Des fringues sombres (techno, rap underground) pour quelqu'un de très coloré — littéralement : ses cheveux.

Fait avec [Astro](https://astro.build), sans framework JS : du HTML, du CSS et un peu de JavaScript pour les animations.

## Lancer le site

Il faut Node.js 22.12 ou plus récent.

```sh
npm install
npm run dev
```

Puis ouvrir http://localhost:4321.

| Commande          | Action                                        |
| :---------------- | :-------------------------------------------- |
| `npm run dev`     | Serveur de développement sur `localhost:4321` |
| `npm run build`   | Génère le site final dans `dist/`             |
| `npm run preview` | Prévisualise le site généré                   |

## Modifier les vêtements

Chaque vêtement est un fichier dans `src/content/produits/`. Pour en ajouter un, copie un fichier existant et change les infos :

```md
---
nom: Hoodie Fantôme
prix: 75
categorie: hoodie # hoodie, tshirt, longsleeve, pantalon, casquette, bonnet, sac
couleur: rose # rose, acide, cyan, jaune, orange, violet
badge: Nouveau # facultatif
tailles: [S, M, L, XL] # facultatif (S, M, L, XL par défaut)
alaune: true # affiché dans la grille du drop (6 pièces maximum)
epuise: false # true = bandeau « sold out »
ordre: 1 # le n°1 devient la pièce phare
# photo: ./hoodie-fantome.jpg # vraie photo, posée à côté du fichier
---
La description (affichée sur la pièce phare).
```

Sans `photo`, une silhouette du vêtement s'affiche sur le fond de sa couleur. Si une info est mal écrite (une couleur ou une catégorie qui n'existe pas), le terminal de `npm run dev` le signale.

## Modifier les textes

`src/data/site.ts` : slogan, textes des bandes qui défilent, date du prochain drop (compte à rebours), liens des réseaux.

## Le fond

Le fond façon tissu noir éraflé vient de deux images dans `public/textures/` : `textile.svg` (la trame) et `rayures.svg` (les éraflures et la poussière). Pour changer la densité des rayures, modifier `scripts/textures.mjs` puis lancer `npm run textures`.

## Ce qui bouge sur la page

- Intro : compteur puis balayage aux couleurs des cheveux de Tom (une fois par session)
- Slogan aux lettres qui tombent, glitch RGB sur « NOIR », « FLUO » plaqué comme un sticker
- Bandes adhésives qui traversent la page et accélèrent quand on scrolle
- Patchs brodés qu'on peut attraper et déplacer à la souris (pirouette au clic)
- Cartes produits qui se soulèvent, panier de démo avec confettis
- Manifeste qui s'allume mot à mot pendant le scroll
- Rayons avec un aperçu qui suit la souris
- Compte à rebours avec un vinyle qui tourne et un bras de platine qui se pose
- Lookbook qui défile à l'horizontale pendant le scroll (grand écran)
- Petit secret : taper « tom » au clavier

Si le visiteur a activé « réduire les animations » dans son système, tout reste immobile et lisible.

## Pour la suite

- Vraies photos (champ `photo` des fiches) et shooting pour le lookbook
- Pages produit, vrai panier et paiement (Shopify, Stripe, Snipcart…)
- Brancher la newsletter sur un service d'e-mailing
- Liens des réseaux sociaux et pages d'aide
