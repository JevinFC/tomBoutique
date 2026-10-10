// Panier de la boutique, gardé dans le navigateur (localStorage).
// On n'y garde que des identifiants, des tailles et des quantités : les prix sont toujours
// recalculés par le serveur au moment du paiement (voir src/pages/api/checkout.ts).
import { PANIER } from '../data/catalogue';
import { burst, toast } from './fun';

export interface Ligne {
  id: string;
  taille: string;
  quantite: number;
}

const CLE = 'tb-panier';
// Si le stockage est bloqué (navigation privée stricte), le panier vit le temps de la page
let secours: Ligne[] = [];

const estLigne = (valeur: unknown): valeur is Ligne => {
  if (typeof valeur !== 'object' || valeur === null) return false;
  const { id, taille, quantite } = valeur as Record<string, unknown>;
  return (
    typeof id === 'string' &&
    id.length > 0 &&
    id.length <= 80 &&
    typeof taille === 'string' &&
    taille.length > 0 &&
    taille.length <= 12 &&
    typeof quantite === 'number' &&
    Number.isInteger(quantite) &&
    quantite >= 1 &&
    quantite <= PANIER.quantiteMax
  );
};

export function lirePanier(): Ligne[] {
  try {
    const brut: unknown = JSON.parse(localStorage.getItem(CLE) ?? '[]');
    return Array.isArray(brut) ? brut.filter(estLigne).slice(0, PANIER.lignesMax) : [];
  } catch {
    return secours.map((ligne) => ({ ...ligne }));
  }
}

function ecrirePanier(lignes: Ligne[]) {
  secours = lignes;
  try {
    localStorage.setItem(CLE, JSON.stringify(lignes));
  } catch {
    // stockage indisponible : la version en mémoire suffit
  }
  window.dispatchEvent(new CustomEvent('panier:change'));
}

export function ajouter(id: string, taille: string, quantite = 1) {
  const lignes = lirePanier();
  const ligne = lignes.find((l) => l.id === id && l.taille === taille);
  if (ligne) ligne.quantite = Math.min(PANIER.quantiteMax, ligne.quantite + quantite);
  else if (lignes.length < PANIER.lignesMax) lignes.push({ id, taille, quantite: Math.min(PANIER.quantiteMax, quantite) });
  ecrirePanier(lignes);
}

/** Change la quantité d'une ligne (0 = la retire). */
export function changerQuantite(id: string, taille: string, quantite: number) {
  ecrirePanier(
    lirePanier()
      .map((l) => (l.id === id && l.taille === taille ? { ...l, quantite: Math.min(PANIER.quantiteMax, quantite) } : l))
      .filter((l) => l.quantite >= 1),
  );
}

export const retirer = (id: string, taille: string) => changerQuantite(id, taille, 0);
export const viderPanier = () => ecrirePanier([]);
export const nombreArticles = (lignes = lirePanier()) => lignes.reduce((total, l) => total + l.quantite, 0);

/** Ajoute une pièce et le fait savoir : confettis depuis le bouton et petit message. */
export function ajouterAvecFete(id: string, taille: string, nom: string, depuis?: Element | null) {
  ajouter(id, taille);
  if (depuis) {
    const rect = depuis.getBoundingClientRect();
    burst(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }
  toast(`Dans le panier : ${nom}${taille === 'Unique' ? '' : ` (${taille})`}`);
}

/** Une fois par page : compteur de l'en-tête et boutons « Ajouter » des pièces à taille unique. */
export function initPanier() {
  const majCompteurs = (bump: boolean) => {
    const total = String(nombreArticles());
    document.querySelectorAll<HTMLElement>('[data-cart-count]').forEach((el) => {
      if (el.textContent === total) return;
      el.textContent = total;
      if (!bump) return;
      el.classList.remove('bump');
      void el.offsetWidth; // relance l'animation
      el.classList.add('bump');
    });
  };
  majCompteurs(false);
  window.addEventListener('panier:change', () => majCompteurs(true));
  // Le panier a changé dans un autre onglet
  window.addEventListener('storage', (e) => {
    if (e.key === CLE) window.dispatchEvent(new CustomEvent('panier:change'));
  });

  document.addEventListener('click', (e) => {
    const bouton = (e.target as Element).closest<HTMLButtonElement>('button[data-add-id]');
    if (!bouton || bouton.disabled) return;
    const { addId, addTaille, addNom } = bouton.dataset;
    if (addId && addTaille) ajouterAvecFete(addId, addTaille, addNom ?? 'Article', bouton);
  });
}
