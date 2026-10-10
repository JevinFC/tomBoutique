// Réglages généraux : textes des bandes défilantes, drop en cours, prochain drop, livraison, réseaux.
// Tout ce qui est ici se modifie sans toucher au reste du code.

/** Livraison (en euros) : bandeau du haut, panier et paiement */
const livraison = {
  /** Offerte à partir de ce montant d'achat */
  offerteDes: 80,
  /** Prix en dessous */
  prix: 5.9,
};

export const site = {
  nom: 'Tom Boutique',
  slogan: 'Noir dehors. Fluo dedans.',
  description:
    "Des fringues noires pour les nuits techno et les concerts de rap. Pour celles et ceux qui s'habillent sombre, mais n'ont rien de sombre.",

  /** Drop en cours (grille de produits) */
  drop: {
    numero: '001',
    nom: 'Sous-sol',
    saison: 'Hiver 26',
  },

  /** Compte à rebours : date ISO avec le fuseau horaire (+01:00 = heure d'hiver à Paris) */
  prochainDrop: {
    numero: '002',
    nom: 'Cimetière disco',
    date: '2026-10-31T20:00:00+01:00',
    pieces: 7,
  },

  livraison,

  /** Bandeau fixe tout en haut (sur mobile, seule la première info s'affiche) */
  annonce: [`Livraison offerte dès ${livraison.offerteDes} €`, 'Drop 001 dispo', 'Retours 30 jours'],

  /** Textes des deux bandes qui traversent la page */
  bandes: {
    hero: ['Nouveau drop', 'Hiver 26', 'Stock limité', 'Pas de restock'],
    prochainDrop: ['Drop 002', '31.10', 'Cimetière disco', 'Mets ton réveil'],
  },

  reseaux: [
    { nom: 'Instagram', url: '#' },
    { nom: 'TikTok', url: '#' },
    { nom: 'SoundCloud', url: '#' },
  ],
};
