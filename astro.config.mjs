// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Styles des composants sans poids de spécificité en plus : plus simple à surcharger
  scopedStyleStrategy: 'where',
  // Pas de barre d'outils Astro en bas de l'écran pendant les démos
  devToolbar: { enabled: false },
});
