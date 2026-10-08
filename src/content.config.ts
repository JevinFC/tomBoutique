import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORIES, COULEURS } from './data/catalogue';

// Un fichier .md par vêtement dans src/content/produits/.
// Le schéma vérifie chaque fiche : une faute de frappe dans une catégorie ou une couleur
// est signalée directement dans le terminal de `npm run dev`.
const produits = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/produits' }),
  schema: ({ image }) =>
    z.object({
      nom: z.string(),
      prix: z.number().positive(),
      categorie: z.enum(CATEGORIES),
      couleur: z.enum(COULEURS),
      badge: z.string().optional(),
      tailles: z.array(z.string()).default(['S', 'M', 'L', 'XL']),
      /** Vraie photo (chemin relatif à la fiche). Sans photo, une silhouette placeholder s'affiche. */
      photo: image().optional(),
      /** Affiché dans la grille « Drop » de l'accueil */
      alaune: z.boolean().default(true),
      epuise: z.boolean().default(false),
      /** Ordre d'affichage (le plus petit en premier ; le n°1 devient la pièce phare) */
      ordre: z.number().default(99),
    }),
});

export const collections = { produits };
