// Réglages généraux : textes des bandes défilantes, drop en cours, prochain drop, réseaux.
// Tout ce qui est ici se modifie sans toucher au reste du code.

export const site = {
  nom: 'Tom Boutique',
  slogan: 'Noir dehors. Fluo dedans.',
  description:
    'Des fringues noires pour les nuits techno, les sous-sols qui tremblent et le rap qui grince. La couleur, elle, est dans la tête — et sur les cheveux de Tom.',

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

  /** Textes des bandes colorées qui traversent la page */
  bandes: {
    annonce: ['Livraison offerte dès 80 €', 'Drop 001 dispo', 'Retours 30 jours', 'Stock limité'],
    heroA: ['Nouveau drop', 'Hiver 26', 'Stock limité', 'Pas de restock (peut-être)'],
    heroB: ['Noir dehors', 'Fluo dedans', '140 BPM', 'Fait pour les afters'],
    drop: ['Cousu pour danser', 'Coton épais', 'Prints fluo', 'Livraison offerte dès 80 €'],
    flyerA: ['Drop 002', '31.10', 'Cimetière disco', 'Mets ton réveil'],
    flyerB: ['Techno', 'Rap qui grince', 'Couleurs', 'Sous-sol'],
    liste: ['Rejoins la liste', 'Zéro spam', 'Drops en avant-première', 'Juré'],
  },

  reseaux: [
    { nom: 'Instagram', url: '#' },
    { nom: 'TikTok', url: '#' },
    { nom: 'SoundCloud', url: '#' },
  ],
};
