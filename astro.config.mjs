// @ts-check
import { defineConfig, envField } from 'astro/config';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  // Styles des composants sans poids de spécificité en plus : plus simple à surcharger
  scopedStyleStrategy: 'where',

  // Pas de barre d'outils Astro en bas de l'écran pendant les démos
  devToolbar: { enabled: false },

  // Les pages restent statiques ; seules les routes de paiement (prerender = false)
  // tournent sur un petit serveur Node
  adapter: node({
    mode: 'standalone',
  }),

  // Lues côté serveur uniquement, au démarrage (jamais envoyées au navigateur) :
  // les clés Stripe, et l'adresse publique du site une fois en ligne (ex. https://tomboutique.fr)
  env: {
    schema: {
      STRIPE_SECRET_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      STRIPE_WEBHOOK_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
      SITE_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
