// Les photos envoyées depuis l'interface d'administration (Pages CMS) sont rangées dans
// src/assets/photos/, et les fiches enregistrent leur chemin, ex. « /src/assets/photos/hoodie.jpg ».
// On retrouve ici le fichier correspondant, pour que <Image> l'optimise (formats, tailles).
import type { ImageMetadata } from 'astro';

const PHOTOS = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/photos/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true },
);

/** La photo à ce chemin, ou undefined (pas de photo, ou fichier introuvable : la silhouette s'affiche). */
export function trouverPhoto(chemin: string | null | undefined): ImageMetadata | undefined {
  if (!chemin) return undefined;
  const photo = PHOTOS[chemin]?.default;
  if (!photo) console.warn(`[photos] Introuvable : ${chemin} (les photos doivent être dans src/assets/photos/)`);
  return photo;
}
