// Crée une session de paiement Stripe Checkout (mode test) à partir du panier.
// Le navigateur n'envoie que des identifiants, des tailles et des quantités : les noms et les
// prix viennent des fiches produits, côté serveur. Les numéros de carte sont saisis chez Stripe.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_URL } from 'astro:env/server';
import { z } from 'astro/zod';
import type Stripe from 'stripe';
import { enCentimes, livraisonCentimes, PANIER } from '../../data/catalogue';
import { site } from '../../data/site';
import { raisonIndisponible, stripeTest } from '../../lib/stripe';

export const prerender = false;

const Panier = z.object({
  lignes: z
    .array(
      z.object({
        id: z.string().min(1).max(80),
        taille: z.string().min(1).max(12),
        quantite: z.number().int().min(1).max(PANIER.quantiteMax),
      }),
    )
    .min(1)
    .max(PANIER.lignesMax),
});

const json = (corps: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(corps), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

// Adresses depuis lesquelles on peut payer : celle que voit le serveur, plus l'adresse publique
// du site une fois en ligne (derrière un hébergeur, le serveur ne voit souvent que localhost)
function originesAutorisees(url: URL) {
  const origines = new Set([url.origin]);
  try {
    if (SITE_URL) origines.add(new URL(SITE_URL).origin);
  } catch {
    console.error('[stripe] SITE_URL doit être une adresse complète, ex. https://tomboutique.fr');
  }
  return origines;
}

export const POST: APIRoute = async ({ request, url }) => {
  // Seules les pages du site peuvent lancer un paiement, avec un petit corps JSON
  const origine = request.headers.get('origin');
  if (!origine || !originesAutorisees(url).has(origine)) return json({ erreur: 'Requête refusée.' }, 403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    return json({ erreur: 'Requête refusée.' }, 415);
  }
  if (Number(request.headers.get('content-length') ?? 0) > 10_000) return json({ erreur: 'Panier trop gros.' }, 413);

  const stripe = stripeTest();
  if (!stripe) return json({ erreur: raisonIndisponible() }, 503);

  const panier = Panier.safeParse(await request.json().catch(() => null));
  if (!panier.success) return json({ erreur: 'Panier illisible : vide-le puis réessaie.' }, 400);

  // Les prix viennent du catalogue, jamais du navigateur
  const catalogue = new Map((await getCollection('produits')).map((produit) => [produit.id, produit]));
  const articles: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  let sousTotal = 0;

  for (const { id, taille, quantite } of panier.data.lignes) {
    const produit = catalogue.get(id);
    if (!produit || produit.data.epuise || !produit.data.tailles.includes(taille)) {
      return json({ erreur: "Un article du panier n'est plus disponible : retire-le, puis réessaie." }, 409);
    }
    const prix = enCentimes(produit.data.prix);
    sousTotal += prix * quantite;
    articles.push({
      quantity: quantite,
      price_data: {
        currency: 'eur',
        unit_amount: prix,
        product_data: {
          name: taille === 'Unique' ? produit.data.nom : `${produit.data.nom} — taille ${taille}`,
          metadata: { id, taille },
        },
      },
    });
  }

  const livraison = livraisonCentimes(sousTotal);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      locale: 'fr',
      line_items: articles,
      shipping_address_collection: { allowed_countries: site.livraison.pays.map((pays) => pays.code) },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            display_name: livraison === 0 ? 'Livraison offerte' : 'Livraison standard',
            fixed_amount: { amount: livraison, currency: 'eur' },
            delivery_estimate: {
              minimum: { unit: 'business_day', value: site.livraison.delai.min },
              maximum: { unit: 'business_day', value: site.livraison.delai.max },
            },
          },
        },
      ],
      custom_text: { submit: { message: 'Paiement de test : aucune vraie carte, aucun débit.' } },
      metadata: {
        lignes: panier.data.lignes
          .map((ligne) => `${ligne.id}:${ligne.taille}:${ligne.quantite}`)
          .join(',')
          .slice(0, 500),
      },
      // Retour vers l'adresse d'où vient l'acheteur (vérifiée plus haut)
      success_url: `${origine}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origine}/panier?annule=1`,
    });
    if (!session.url) throw new Error('session sans URL');
    return json({ url: session.url });
  } catch (erreur) {
    // Le détail reste dans les logs du serveur
    console.error('[stripe] Session de paiement impossible :', erreur instanceof Error ? erreur.message : erreur);
    return json({ erreur: 'Stripe ne répond pas pour le moment. Réessaie dans un instant.' }, 502);
  }
};
