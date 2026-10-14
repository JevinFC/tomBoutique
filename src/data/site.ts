// Réglages généraux : slogan, bandeau du haut, bandes défilantes, drop en cours, prochain drop,
// livraison, retours, réseaux. Les valeurs sont dans src/content/reglages.json, modifiables depuis
// l'interface d'administration (Pages CMS, voir GUIDE.md) ; ce fichier les met en forme pour le site.
// Les infos légales (SIRET, adresse, hébergeur…) sont dans src/content/legal.json.
import reglages from '../content/reglages.json';

/**
 * « 2026-10-31T20:00 », saisi en heure de Paris, devient une date ISO avec le bon décalage
 * (+01:00 en hiver, +02:00 en été), pour que le compte à rebours tombe juste partout dans le monde.
 */
function heureDeParis(saisie: string) {
  if (/(Z|[+-]\d\d:\d\d)$/.test(saisie)) return saisie;
  const [jour, heure = '00:00'] = saisie.split('T');
  const [a, m, j] = jour.split('-').map(Number);
  const [h, min] = heure.split(':').map(Number);
  const commeUtc = Date.UTC(a, m - 1, j, h, min);
  // Décalage de Paris (en minutes) à un instant donné : l'heure qu'il y est, moins l'heure UTC
  const decalageA = (instant: number) => {
    const morceaux = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Paris',
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).formatToParts(new Date(instant));
    const valeur = (type: string) => Number(morceaux.find((morceau) => morceau.type === type)?.value);
    const aParis = Date.UTC(valeur('year'), valeur('month') - 1, valeur('day'), valeur('hour'), valeur('minute'));
    return Math.round((aParis - instant) / 60_000);
  };
  // Deux passes : la seconde, au vrai instant, reste juste la nuit du changement d'heure
  const decalage = decalageA(commeUtc - decalageA(commeUtc) * 60_000);
  const deux = (n: number) => String(n).padStart(2, '0');
  const signe = decalage < 0 ? '-' : '+';
  return `${jour}T${deux(h)}:${deux(min)}:00${signe}${deux(Math.floor(Math.abs(decalage) / 60))}:${deux(Math.abs(decalage) % 60)}`;
}

/** Livraison (en euros) : bandeau du haut, panier, paiement et CGV */
const livraison = {
  /** Offerte à partir de ce montant d'achat */
  offerteDes: reglages.livraison.offerteDes ?? 80,
  /** Prix en dessous */
  prix: reglages.livraison.prix ?? 5.9,
  /** Pays livrés (codes ISO utilisés par Stripe) : à changer ici, dans le code */
  pays: [
    { code: 'FR', nom: 'France' },
    { code: 'BE', nom: 'Belgique' },
    { code: 'CH', nom: 'Suisse' },
    { code: 'LU', nom: 'Luxembourg' },
  ] as const,
  /** Délai annoncé au paiement, en jours ouvrés */
  delai: { min: reglages.livraison.delaiMin ?? 2, max: reglages.livraison.delaiMax ?? 5 },
};

/** Retours acceptés pendant ce nombre de jours après la réception (la loi en impose 14) */
const retours = { jours: reglages.retours ?? 30 };

const prochainDrop = { ...reglages.prochainDrop, date: heureDeParis(reglages.prochainDrop.date) };
const jourDuDrop = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', day: '2-digit', month: '2-digit' })
  .format(new Date(prochainDrop.date))
  .replace('/', '.');

export const site = {
  nom: 'Tom Boutique',
  slogan: reglages.slogan,
  description: reglages.description,

  /** Drop en cours (grille de produits) */
  drop: reglages.drop,

  /** Compte à rebours : date ISO avec le fuseau horaire de Paris */
  prochainDrop,

  livraison,
  retours,

  /** Bandeau fixe tout en haut : la livraison offerte en premier (seule info visible sur mobile),
      les messages de Tom au milieu, les retours à la fin */
  annonce: [
    `Livraison offerte dès ${livraison.offerteDes} €`,
    ...reglages.annonce.filter(Boolean),
    `Retours ${retours.jours} jours`,
  ],

  /** Textes des deux bandes qui traversent la page ; celle du prochain drop commence toujours
      par son numéro, sa date et son nom */
  bandes: {
    hero: reglages.bandes.hero.filter(Boolean),
    prochainDrop: [
      `Drop ${prochainDrop.numero}`,
      jourDuDrop,
      prochainDrop.nom,
      ...reglages.bandes.prochainDrop.filter(Boolean),
    ],
  },

  reseaux: reglages.reseaux,
};
