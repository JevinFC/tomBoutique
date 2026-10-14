import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORIES } from './data/catalogue';

// Un fichier .md par vêtement dans src/content/produits/.
// Le schéma vérifie chaque fiche : une faute de frappe dans une catégorie est signalée
// directement dans le terminal de `npm run dev`. Pas de champ couleur : tous les produits
// partagent le même fond photo (voir la DA dans le README).
const produits = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/produits' }),
  // Les fiches sont aussi modifiées depuis l'interface d'administration (Pages CMS), qui peut écrire
  // un champ vide (null, "" ou []) : chaque champ facultatif retombe alors sur sa valeur par défaut.
  schema: z.object({
    nom: z.string(),
    prix: z.number().positive(),
    categorie: z.enum(CATEGORIES),
    badge: z.string().nullish(),
    tailles: z
      .array(z.string())
      .nullish()
      .transform((tailles) => (tailles?.length ? tailles : ['S', 'M', 'L', 'XL'])),
    /** Vraie photo, rangée dans src/assets/photos/ (voir src/lib/photos.ts). Sans photo, une silhouette s'affiche. */
    photo: z.string().nullish(),
    /** Affiché dans la grille « Drop » de l'accueil */
    alaune: z.boolean().nullish().transform((alaune) => alaune ?? true),
    epuise: z.boolean().nullish().transform((epuise) => epuise ?? false),
    /** Ordre d'affichage (le plus petit en premier ; le n°1 s'affiche aussi sur le polaroid du hero) */
    ordre: z.number().nullish().transform((ordre) => ordre ?? 99),
  }),
});

export const collections = { produits };
