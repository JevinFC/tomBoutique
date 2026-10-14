// Infos légales de la boutique, affichées dans les CGV (/cgv) et les mentions légales (/mentions-legales).
// Les valeurs sont dans src/content/legal.json, modifiables depuis l'interface d'administration
// (Pages CMS, voir GUIDE.md). Un champ vide s'affiche en rouge « [À compléter : …] » sur le site.
// Les prix, la livraison et la durée des retours viennent de src/data/site.ts.
import donnees from '../content/legal.json';

/** Une info : chaîne vide tant qu'elle n'est pas renseignée */
type Info = string;

interface Legal {
  /** Nom et prénom de l'entrepreneur, ou nom de la société */
  vendeur: Info;
  /** Micro-entreprise, EI, SAS, SARL… (avec le capital social pour une société) */
  statut: Info;
  /** Adresse du siège (ou du domicile de l'entrepreneur) */
  adresse: Info;
  siret: Info;
  /** Immatriculation : RCS de telle ville, ou Registre national des entreprises (RNE) */
  immatriculation: Info;
  /** Numéro de TVA intracommunautaire, ou « TVA non applicable, art. 293 B du CGI » en micro-entreprise */
  tva: Info;
  /** Adresse e-mail de contact (service client, rétractation, données personnelles) */
  email: Info;
  telephone: Info;
  /** La personne responsable du contenu du site (souvent l'entrepreneur lui-même) */
  directeurPublication: Info;
  /** L'hébergeur du site (Netlify) */
  hebergeur: { nom: Info; adresse: Info; telephone: Info };
  /** Médiateur de la consommation : obligatoire pour vendre à des particuliers */
  mediateur: { nom: Info; site: Info };
  /** Transporteur utilisé pour les colis (La Poste, Colissimo, Mondial Relay…) */
  transporteur: Info;
  /** Qui paie le renvoi d'un article : « à la charge du client » ou « offerts par Tom Boutique » */
  fraisRetour: Info;
  /** Service qui enverra la newsletter (Brevo, Mailchimp…), une fois branché */
  newsletter: Info;
  /** Date de la dernière modification de ces textes */
  miseAJour: string;
}

export const legal: Legal = donnees;
