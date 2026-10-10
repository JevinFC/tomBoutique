// Webhook Stripe (facultatif) : Stripe prévient le serveur quand une commande est payée.
// La signature est vérifiée avec STRIPE_WEBHOOK_SECRET : un faux appel est rejeté.
import type { APIRoute } from 'astro';
import { STRIPE_WEBHOOK_SECRET } from 'astro:env/server';
import { stripeTest } from '../../../lib/stripe';

export const prerender = false;

const json = (corps: Record<string, unknown>, status: number) =>
  new Response(JSON.stringify(corps), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export const POST: APIRoute = async ({ request }) => {
  const stripe = stripeTest();
  if (!stripe || !STRIPE_WEBHOOK_SECRET) return json({ erreur: 'Webhook non configuré' }, 503);

  const signature = request.headers.get('stripe-signature');
  if (!signature) return json({ erreur: 'Signature manquante' }, 400);

  // La signature se vérifie sur le corps brut, exactement tel que Stripe l'a envoyé
  const corps = await request.text();
  let evenement;
  try {
    evenement = await stripe.webhooks.constructEventAsync(corps, signature, STRIPE_WEBHOOK_SECRET);
  } catch {
    return json({ erreur: 'Signature invalide' }, 400);
  }

  if (evenement.type === 'checkout.session.completed') {
    const session = evenement.data.object;
    // Une vraie boutique enregistrerait ici la commande, baisserait le stock et enverrait l'e-mail
    console.info(
      `[stripe] Commande payée (test) ${session.id} : ${(session.amount_total ?? 0) / 100} € — ${session.metadata?.lignes ?? ''}`,
    );
  }

  return json({ recu: true }, 200);
};
