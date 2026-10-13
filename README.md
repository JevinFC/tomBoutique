# Tom Boutique

Prototype de la boutique de Tom : **noir dehors, fluo dedans.**
Des fringues sombres (techno, rap underground) pour quelqu'un de très coloré — littéralement : ses cheveux.

Fait avec [Astro](https://astro.build), sans framework JS : du HTML, du CSS et un peu de JavaScript pour les animations. Les pages sont statiques ; seul le paiement passe par des fonctions serveur. Le site est hébergé sur [Netlify](https://www.netlify.com) (voir « Mettre en ligne »).

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
| `npm run build`   | Génère le site final (pages + fonctions du paiement), comme le fait Netlify |

## Modifier les vêtements

Chaque vêtement est un fichier dans `src/content/produits/`. Pour en ajouter un, copie un fichier existant et change les infos :

```md
---
nom: Hoodie Fantôme
prix: 75
categorie: hoodie # hoodie, tshirt, longsleeve, pantalon, casquette, bonnet, sac
badge: Nouveau # facultatif
tailles: [S, M, L, XL] # facultatif (S, M, L, XL par défaut)
alaune: true # affiché dans la grille du drop (6 pièces maximum)
epuise: false # true = bandeau « sold out »
ordre: 1 # le n°1 s'affiche aussi sur le polaroid du hero
# photo: ./hoodie-fantome.jpg # vraie photo, posée à côté du fichier
---
La description (affichée sur la fiche produit).
```

Sans `photo`, une silhouette du vêtement s'affiche à la place, sur le fond commun façon photo au flash. Si une info est mal écrite (une catégorie qui n'existe pas, un prix manquant…), le terminal de `npm run dev` le signale.

## Modifier les textes

`src/data/site.ts` : slogan, bandeau d'infos du haut, textes des deux bandes qui défilent, date du prochain drop (compte à rebours), livraison (seuil de gratuité et prix), liens des réseaux.

## Les infos légales

`src/data/legal.ts` : nom du vendeur, statut, adresse, SIRET, TVA, e-mail, hébergeur, médiateur de la consommation, transporteur, frais de retour. Tant qu'un champ vaut `null`, les CGV et les mentions légales affichent à sa place un repère rouge « [À compléter : …] ». La livraison (prix, pays, délai) et la durée des retours viennent de `src/data/site.ts`, les mêmes valeurs que le panier et le paiement.

Ces textes sont un modèle basé sur le code de la consommation : à faire relire avant d'ouvrir la boutique pour de vrai.

## Les pages

- `/` : l'accueil.
- `/produits/<nom-du-fichier>` : une fiche par vêtement (photo, prix, description, choix de la taille, ajout au panier, « Dans le même drop »). On y arrive en cliquant sur une carte, ou sur le polaroid du hero.
- `/panier` : les articles (quantités, suppression), la livraison offerte dès 80 €, et le bouton « Payer avec Stripe ». Le panier est gardé dans le navigateur.
- `/merci` : la confirmation après le paiement.
- `/cgv` et `/mentions-legales` : les conditions générales de vente et les mentions légales (avec données personnelles et cookies), liées depuis le pied de page et le panier.
- Toute autre adresse : la page 404 (« Le disque a sauté »), avec le vinyle du prochain drop à la place du zéro. Il saute à chaque tour, et on peut le scratcher d'un clic.

Depuis la grille, une pièce à taille unique s'ajoute directement au panier ; pour les autres, le bouton mène à la fiche pour choisir la taille.

## Paiement (Stripe, mode test)

Le paiement passe par **Stripe Checkout en mode test** : la vraie page de paiement de Stripe, sauf qu'aucune vraie carte n'est débitée. Pour le brancher :

1. Crée un compte gratuit sur [stripe.com](https://stripe.com) (pas besoin d'activer les vrais paiements).
2. Dans le tableau de bord, en **mode test**, copie la clé secrète (`sk_test_…`) depuis *Développeurs → Clés API*.
3. Copie `.env.example` en `.env` et colle la clé : `STRIPE_SECRET_KEY=sk_test_…`
4. Relance `npm run dev`.

Pour payer, utilise la carte de test `4242 4242 4242 4242`, une date d'expiration future et n'importe quel code (d'autres cartes de test, refusées ou avec 3D Secure, sur [docs.stripe.com/testing](https://docs.stripe.com/testing)). Sans clé, le bouton « Payer » explique simplement ce qu'il manque.

Ce qui rend le paiement sûr :

- la clé secrète reste sur le serveur (variables `astro:env`, jamais envoyées au navigateur) et le fichier `.env` n'est pas versionné ;
- le navigateur n'envoie que des identifiants, des tailles et des quantités : les noms et les prix sont recalculés par le serveur depuis les fiches produits (un prix trafiqué est ignoré, une pièce épuisée ou une taille inventée est refusée) ;
- les numéros de carte ne passent jamais par le site : ils sont saisis chez Stripe ;
- seules les pages du site peuvent lancer un paiement (contrôle de l'origine de la requête) ;
- la page de confirmation relit la commande chez Stripe au lieu de croire l'adresse ;
- le prototype refuse les clés « live » : impossible de débiter une vraie carte par erreur.

**Webhook (facultatif)**, pour que le serveur soit prévenu de chaque commande payée : installe la [Stripe CLI](https://docs.stripe.com/stripe-cli), lance `stripe listen --forward-to localhost:4321/api/stripe/webhook`, colle le secret `whsec_…` affiché dans `.env` (`STRIPE_WEBHOOK_SECRET`) puis relance `npm run dev`. Chaque commande s'affiche alors dans le terminal ; la signature de Stripe est vérifiée, un faux appel est rejeté.

**En ligne**, la clé se règle dans Netlify (voir ci-dessous) et non dans `.env`, qui reste sur ton ordinateur.

## Mettre en ligne (Netlify)

Le site est relié au dépôt GitHub : **chaque modification envoyée sur la branche `main` est mise en ligne toute seule**, en une à deux minutes (y compris les changements faits directement sur github.com).

La première fois :

1. Sur [netlify.com](https://www.netlify.com), créer un compte avec « Sign up with GitHub » (l'offre gratuite autorise un usage commercial).
2. **Add new project → Import an existing project → GitHub → tomBoutique**. Les réglages sont détectés (commande `npm run build`, Node 22 via `.nvmrc`) : cliquer sur **Deploy**.
3. Renommer l'adresse dans **Site configuration → Change site name** (ex. `tom-boutique.netlify.app`).
4. Pour le paiement de test : **Site configuration → Environment variables → Add a variable**, `STRIPE_SECRET_KEY` = la clé `sk_test_…`, puis **Deploys → Trigger deploy**.

Plus tard, avec un nom de domaine (ex. `tomboutique.fr`) : le brancher dans **Domain management**, et ajouter la variable `SITE_URL` avec cette adresse. Si une mise en ligne échoue (faute de frappe dans une fiche, par exemple), Netlify garde la version précédente en ligne et affiche l'erreur dans **Deploys**.

## Le fond

Le fond façon tissu noir éraflé vient de deux images dans `public/textures/` : `textile.svg` (la trame) et `rayures.svg` (les éraflures et la poussière). Pour changer la densité des rayures, modifier `scripts/textures.mjs` puis lancer `npm run textures`.

## La DA

- **Noir** partout (le fond tissu), **crème** pour le texte et les « papiers » (polaroids, newsletter).
- **Une seule couleur d'accent, le rouge** (`--accent` dans `src/styles/global.css`) : boutons, prix, badges, surlignage, scotch, compte à rebours.
- **L'arc-en-ciel n'existe que dans les cheveux de Tom** (`--cheveux-1` à `--cheveux-6`) : le logo, les imprimés des vêtements, l'intro et le mot « cheveux » dans la signature du manifeste. Nulle part ailleurs.
- **Un seul jeu de composants** : un bouton principal (rouge), un secondaire (contour crème), une ombre « collée » de 6 px (`--ombre`), 12 px minimum pour le texte, des capitales pour les titres et les boutons, la casse normale pour les légendes.
- **Gothique** (UnifrakturCook) seulement pour « Boutique » et les noms de drops ; Anybody pour les titres, Space Mono pour le texte.
- **Une seule direction photo** : fond noir, flash direct, grain (les placeholders l'imitent déjà, les vraies photos devront suivre).
- **Un seul moment fort par section** : le tissage du titre, une grille calme pour le drop, les mots qui s'allument dans le manifeste, le vinyle pour le prochain drop, les polaroids pour le lookbook.

## Ce qui bouge sur la page

- Intro : compteur puis balayage aux couleurs des cheveux de Tom (une fois par session, ou à chaque fois avec `?intro` dans l'URL)
- Slogan tissé lettre par lettre, de bas en haut (fils de chaîne, navette, rangs tassés)
- Bandes adhésives qui traversent la page et accélèrent quand on scrolle
- Patchs brodés qu'on peut attraper et déplacer à la souris (pirouette au clic)
- Cartes produits qui se soulèvent et mènent à leur fiche, confettis à chaque ajout au panier
- Manifeste qui s'allume mot à mot pendant le scroll
- Filtres par rayon au-dessus de la grille du drop
- Compte à rebours avec un vinyle qui tourne et un bras de platine qui se pose
- Lookbook qui défile à l'horizontale pendant le scroll (grand écran)
- Petit secret : taper « tom » au clavier

Si le visiteur a activé « réduire les animations » dans son système, tout reste immobile et lisible.

## Pour la suite

- Vraies photos (champ `photo` des fiches) et shooting pour le lookbook
- Passer aux vrais paiements : compte Stripe activé, clé live (le prototype les refuse exprès : à changer dans `src/lib/stripe.ts`), commandes enregistrées (base de données, e-mails, stock)
- Brancher la newsletter sur un service d'e-mailing
- Liens des réseaux sociaux et pages d'aide
