// Constantes du catalogue, partagées entre la config des collections et les composants.

/** Couleurs de la palette (définies dans src/styles/global.css). */
export const COULEURS = ['rose', 'acide', 'cyan', 'jaune', 'orange', 'violet'] as const;
export type Couleur = (typeof COULEURS)[number];

/** Types de vêtements. Chacun a sa silhouette placeholder dans src/components/Garment.astro. */
export const CATEGORIES = [
  'hoodie',
  'tshirt',
  'longsleeve',
  'pantalon',
  'casquette',
  'bonnet',
  'sac',
] as const;
export type Categorie = (typeof CATEGORIES)[number];

/** Rayons affichés sur l'accueil : chaque rayon regroupe une ou plusieurs catégories. */
export const RAYONS: { nom: string; categories: Categorie[]; couleur: Couleur; apercu: Categorie }[] = [
  { nom: 'Hoodies', categories: ['hoodie'], couleur: 'rose', apercu: 'hoodie' },
  { nom: 'T-shirts', categories: ['tshirt', 'longsleeve'], couleur: 'acide', apercu: 'tshirt' },
  { nom: 'Pantalons', categories: ['pantalon'], couleur: 'cyan', apercu: 'pantalon' },
  { nom: 'Accessoires', categories: ['casquette', 'bonnet', 'sac'], couleur: 'jaune', apercu: 'casquette' },
];

export function formatPrix(prix: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: Number.isInteger(prix) ? 0 : 2,
  }).format(prix);
}
