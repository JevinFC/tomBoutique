// Petites réactions joyeuses : confettis, toast, easter egg (le panier, lui, vit dans panier.ts).
import { reducedMotion } from './ticker';

// Confettis rouges et crème : l'arc-en-ciel reste réservé aux cheveux de Tom
const COLORS = ['--accent', '--blanc'];

/** Explosion de confettis colorés depuis un point de l'écran. */
export function burst(x: number, y: number, count = 22) {
  if (reducedMotion.matches) return;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('span');
    const size = 7 + Math.random() * 9;
    const round = i % 3 === 0;
    piece.className = 'confetti';
    piece.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${round ? size : size * 0.55}px;background:var(${COLORS[i % COLORS.length]});border-radius:${round ? '50%' : '2px'}`;
    document.body.append(piece);

    const angle = Math.random() * Math.PI * 2;
    const distance = 70 + Math.random() * 150;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 50;
    const turn = (Math.random() - 0.5) * 900;
    piece
      .animate(
        [
          { transform: 'translate(-50%, -50%) rotate(0deg)', opacity: 1 },
          {
            transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${turn * 0.7}deg)`,
            opacity: 1,
            offset: 0.65,
          },
          {
            transform: `translate(calc(-50% + ${dx * 1.15}px), calc(-50% + ${dy + 90}px)) rotate(${turn}deg)`,
            opacity: 0,
          },
        ],
        { duration: 1000 + Math.random() * 500, easing: 'cubic-bezier(.16,1,.3,1)' },
      )
      .finished.then(() => piece.remove());
  }
}

let toastTimer = 0;

/** Petit message en bas de l'écran (annoncé aussi aux lecteurs d'écran). */
export function toast(message: string) {
  const el = document.querySelector<HTMLElement>('[data-toast]');
  const text = el?.querySelector<HTMLElement>('[data-toast-text]');
  if (!el || !text) return;
  text.textContent = message;
  el.classList.remove('is-on');
  void el.offsetWidth; // relance l'animation d'entrée
  el.classList.add('is-on');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove('is-on'), 3000);
}

/** Easter egg : taper « tom » au clavier fait pleuvoir des confettis. */
export function initEasterEgg() {
  let typed = '';
  window.addEventListener('keydown', (e) => {
    if ((e.target as HTMLElement).closest('input, textarea')) return;
    typed = (typed + e.key.toLowerCase()).slice(-3);
    if (typed !== 'tom') return;
    for (let i = 0; i < 5; i++) {
      window.setTimeout(
        () => burst(Math.random() * window.innerWidth, Math.random() * window.innerHeight * 0.6, 26),
        i * 140,
      );
    }
    toast('Salut Tom !');
  });
}
