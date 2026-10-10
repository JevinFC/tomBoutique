// Constantes du catalogue, partagées entre la config des collections, les composants et le paiement.
import { site } from './site';

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

/** Rayons (filtres de la grille, liens du pied de page) : chacun regroupe une ou plusieurs catégories. */
export const RAYONS: { nom: string; categories: Categorie[] }[] = [
  { nom: 'Hoodies', categories: ['hoodie'] },
  { nom: 'T-shirts', categories: ['tshirt', 'longsleeve'] },
  { nom: 'Pantalons', categories: ['pantalon'] },
  { nom: 'Accessoires', categories: ['casquette', 'bonnet', 'sac'] },
];

export function formatPrix(prix: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: Number.isInteger(prix) ? 0 : 2,
  }).format(prix);
}

/** Limites du panier, vérifiées dans le navigateur et par le serveur au paiement. */
export const PANIER = { quantiteMax: 10, lignesMax: 20 } as const;

/** Les montants du panier se calculent en centimes, pour éviter les erreurs d'arrondi. */
export const enCentimes = (euros: number) => Math.round(euros * 100);
export const formatCentimes = (centimes: number) => formatPrix(centimes / 100);

/** Frais de livraison (en centimes) pour un sous-total donné. */
export function livraisonCentimes(sousTotal: number) {
  return sousTotal >= enCentimes(site.livraison.offerteDes) ? 0 : enCentimes(site.livraison.prix);
}
