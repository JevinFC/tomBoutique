# Modifier le site de Tom Boutique

Tout se fait depuis **[app.pagescms.org](https://app.pagescms.org)**, avec des formulaires, sans toucher au code.
Chaque fois que tu enregistres, le site se met à jour tout seul en **1 à 2 minutes**.

## Se connecter

1. Ouvre l'invitation reçue par e-mail (ou va sur [app.pagescms.org](https://app.pagescms.org)) et connecte-toi avec ton adresse e-mail.
2. Choisis le site **tomBoutique**.

Dans le menu, tu trouves :

- **Vêtements** : les pièces de la boutique ;
- **Réglages de la boutique** : la phrase d'accroche, le bandeau du haut, les drops, la livraison, les retours, les réseaux ;
- **Textes de l'accueil** : le manifeste, le texte du drop, le lookbook, la newsletter ;
- **Infos légales** : ce qui s'affiche dans les CGV et les mentions légales ;
- **Media** : toutes les photos envoyées.

## Ajouter un vêtement

1. **Vêtements**, puis le bouton pour ajouter une entrée.
2. Remplis le nom, le prix (avec un point : `34.90`), la catégorie, les tailles et la description.
3. Ajoute une photo (voir plus bas).
4. Enregistre. La pièce a sa propre page, et elle apparaît dans la grille de l'accueil si « Dans la grille de l'accueil » est coché (6 pièces au maximum).

**L'ordre d'affichage** : le plus petit d'abord. La pièce n°1 s'affiche aussi sur le polaroid en haut de l'accueil.

## Les photos

- **Format vertical** : 4/5 pour les vêtements, 3/4 pour le lookbook.
- **Fond sombre et flash direct**, comme le reste du site, et un peu de marge autour du vêtement : sur les grands écrans, la photo est légèrement recadrée en haut et en bas.
- **JPG de moins de 5 Mo** : le site se charge de les alléger.
- Sans photo, une silhouette dessinée s'affiche à la place : rien ne casse.

## Épuisé, retiré, supprimé

- **Plus de stock** : coche **Épuisé**. La pièce reste visible avec un bandeau « sold out », mais on ne peut plus l'acheter.
- **La sortir de l'accueil** sans la supprimer : décoche **Dans la grille de l'accueil**.
- **Supprimer** : possible, mais mieux vaut la marquer épuisée (les liens partagés continuent de marcher).

## Les drops

- **Réglages de la boutique → Prochain drop** : numéro, nom, date et heure (heure de Paris), nombre de pièces. Le compte à rebours et la bande qui défile se mettent à jour tout seuls.
- **Le jour de la sortie** : passe le numéro et le nom dans **Drop en cours**, puis prépare le suivant dans **Prochain drop**.

## Les textes

- **Le manifeste** : court, c'est mieux. Indique le mot à surligner en rouge, écrit exactement comme dans le texte.
- **Le texte de la section Drop** : `{pieces}` est remplacé tout seul par le nombre de pièces.
- **Le lookbook** : une photo et une légende par look. Tu peux en ajouter, en enlever ou changer l'ordre.
- **Le bandeau du haut** : « Livraison offerte dès … » et « Retours … jours » s'ajoutent tout seuls, avec les montants des réglages.

## Les infos légales

Remplis chaque champ, puis change la **date de mise à jour**. Tant qu'un champ est vide, les pages légales affichent un repère rouge « À compléter ».

## Si quelque chose ne marche pas

- **Le site n'a pas changé au bout de 5 minutes** : une erreur a bloqué la mise à jour. Pas de panique, l'ancienne version reste en ligne. Préviens la personne qui s'occupe du site, elle verra l'erreur sur Netlify.
- **Une erreur de ta part** : rien n'est perdu. Chaque modification est gardée et on peut revenir en arrière.

## Ce qui ne se change pas ici

Le design, les couleurs, la mise en page, les animations, le grand titre de l'accueil, les pays de livraison et le texte des CGV restent dans le code, pour que la DA ne casse jamais par accident. Pour ça, demande.
