// Boucle d'animation unique (requestAnimationFrame) partagée par tout le site.
// Chaque abonné reçoit le temps écoulé et la vitesse de scroll lissée.

export type Frame = {
  /** Temps en secondes */
  time: number;
  /** Durée depuis l'image précédente, en secondes */
  delta: number;
  scrollY: number;
  /** Vitesse de scroll lissée en px/s (négative quand on remonte) */
  velocity: number;
};

type Subscriber = (frame: Frame) => void;

const subscribers = new Set<Subscriber>();
let running = false;
let lastTime = 0;
let lastY = 0;
let velocity = 0;

function loop(now: number) {
  const delta = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  const scrollY = window.scrollY;
  const instant = delta > 0 ? (scrollY - lastY) / delta : 0;
  lastY = scrollY;
  velocity += (instant - velocity) * 0.12;

  const frame: Frame = { time: now / 1000, delta, scrollY, velocity };
  subscribers.forEach((fn) => fn(frame));
  requestAnimationFrame(loop);
}

export function onFrame(fn: Subscriber) {
  subscribers.add(fn);
  if (!running) {
    running = true;
    lastY = window.scrollY;
    requestAnimationFrame((now) => {
      lastTime = now;
      loop(now);
    });
  }
  return () => subscribers.delete(fn);
}

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
export const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
