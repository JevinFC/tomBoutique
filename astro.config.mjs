// @ts-check
import { defineConfig, envField } from 'astro/config';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  // Styles des composants sans poids de spécificité en plus : plus simple à surcharger
  scopedStyleStrategy: 'where',

  // Pas de barre d'outils Astro en bas de l'écran pendant les démos
  devToolbar: { enabled: false },

  // Hébergé sur Netlify : les pages restent statiques, seules les routes de paiement
  // (prerender = false) tournent en fonctions serveur
  adapter: netlify(),

  // Lues côté serveur uniquement (jamais envoyées au navigateur) : les clés Stripe, et l'adresse
  // publique du site si elle diffère de celle de Netlify (ex. https://tomboutique.fr).
  // En ligne, elles se règlent dans Netlify : Site configuration → Environment variables
  env: {
    schema: {
      STRIPE_SECRET_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      STRIPE_WEBHOOK_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
      SITE_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
