// Client Stripe, côté serveur uniquement : la clé secrète ne quitte jamais le serveur.
// Ce prototype n'accepte que les clés de TEST : aucune vraie carte ne peut être débitée.
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from 'astro:env/server';

const CLE_DE_TEST = /^(sk|rk)_test_[A-Za-z0-9]+$/;

/** Pourquoi le paiement est indisponible, ou null si tout est prêt. */
export function raisonIndisponible(): string | null {
  if (STRIPE_SECRET_KEY && CLE_DE_TEST.test(STRIPE_SECRET_KEY)) return null;
  // En production, on ne détaille pas la configuration du serveur
  if (!import.meta.env.DEV) return 'Le paiement est indisponible pour le moment.';
  return STRIPE_SECRET_KEY
    ? 'Ce prototype accepte uniquement une clé Stripe de test (sk_test_…), jamais une clé live.'
    : "Le paiement n'est pas encore branché : colle ta clé de test Stripe (STRIPE_SECRET_KEY) dans le fichier .env, puis relance npm run dev.";
}

let client: Stripe | undefined;

/** Le client Stripe en mode test, ou null s'il n'est pas configuré. */
export function stripeTest(): Stripe | null {
  if (raisonIndisponible() || !STRIPE_SECRET_KEY) return null;
  client ??= new Stripe(STRIPE_SECRET_KEY);
  return client;
}
