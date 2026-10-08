// Animations génériques pilotées par des attributs data-* posés dans les composants.
import { finePointer, onFrame, reducedMotion } from './ticker';

/** Apparitions : [data-reveal] et [data-pop] reçoivent .is-in en entrant à l'écran. */
function initReveals() {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  document.querySelectorAll('[data-reveal], [data-pop]').forEach((el) => io.observe(el));
}

/** Bandes défilantes : vitesse de base, accélérée par la vitesse de scroll. */
function initMarquees() {
  document.querySelectorAll<HTMLElement>('[data-marquee]').forEach((el) => {
    const track = el.querySelector<HTMLElement>('[data-marquee-track]');
    const groups = track ? ([...track.children] as HTMLElement[]) : [];
    if (!track || groups.length < 2) return;

    // Sur très grand écran, on rallonge la piste pour ne jamais voir de trou
    const originals = [...groups[0].children];
    for (let i = 0; i < 4 && groups[0].offsetWidth < el.offsetWidth; i++) {
      groups.forEach((group) => originals.forEach((child) => group.append(child.cloneNode(true))));
    }

    const direction = Number(el.dataset.marqueeDirection) || -1;
    const speed = Number(el.dataset.marqueeSpeed) || 70;
    let width = groups[0].offsetWidth;
    let x = 0;
    let visible = false;

    new ResizeObserver(() => (width = groups[0].offsetWidth)).observe(groups[0]);
    new IntersectionObserver(([entry]) => (visible = entry.isIntersecting)).observe(el);

    onFrame(({ delta, velocity }) => {
      if (!visible || reducedMotion.matches || width === 0) return;
      const boost = 1 + Math.min(Math.abs(velocity) / 300, 6);
      x = (x + direction * speed * boost * delta) % width;
      if (x > 0) x -= width;
      track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
    });
  });
}

/** Parallaxe : [data-speed] glisse verticalement selon sa position dans l'écran. */
function initParallax() {
  const items = [...document.querySelectorAll<HTMLElement>('[data-speed]')].map((el) => ({
    el,
    anchor: el.parentElement ?? el,
    speed: Number(el.dataset.speed) || 0,
    visible: false,
  }));
  if (!items.length) return;

  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) =>
        items.forEach((item) => {
          if (item.anchor === entry.target) item.visible = entry.isIntersecting;
        }),
      ),
    { rootMargin: '30% 0px' },
  );
  items.forEach((item) => io.observe(item.anchor));

  onFrame(() => {
    if (reducedMotion.matches) return;
    const middle = window.innerHeight / 2;
    // Toutes les lectures d'abord, puis toutes les écritures (évite les recalculs de mise en page)
    const offsets = items.map((item) => {
      if (!item.visible) return null;
      const rect = item.anchor.getBoundingClientRect();
      return (rect.top + rect.height / 2 - middle) * -item.speed;
    });
    items.forEach((item, i) => {
      const y = offsets[i];
      if (y !== null) item.el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    });
  });
}

/** Patchs : glisser-déposer à la souris, petite pirouette au clic ou au tap. */
function initPatches() {
  document.querySelectorAll<HTMLElement>('[data-patch]').forEach((el) => {
    let x = 0;
    let y = 0;
    let startX = 0;
    let startY = 0;
    let fromX = 0;
    let fromY = 0;
    let pointer = -1;
    let dragged = false;

    el.addEventListener('dragstart', (e) => e.preventDefault());
    el.addEventListener('pointerdown', (e) => {
      // Au doigt, on laisse le scroll tranquille : le patch fait juste une pirouette au tap
      if (e.pointerType === 'touch' || e.button !== 0) return;
      pointer = e.pointerId;
      el.setPointerCapture(pointer);
      startX = e.clientX;
      startY = e.clientY;
      fromX = x;
      fromY = y;
      dragged = false;
      el.classList.add('is-dragging');
    });
    el.addEventListener('pointermove', (e) => {
      if (e.pointerId !== pointer) return;
      x = fromX + e.clientX - startX;
      y = fromY + e.clientY - startY;
      if (Math.abs(x - fromX) + Math.abs(y - fromY) > 4) dragged = true;
      el.style.translate = `${x}px ${y}px`;
    });
    const release = (e: PointerEvent) => {
      if (e.pointerId !== pointer) return;
      pointer = -1;
      el.classList.remove('is-dragging');
    };
    el.addEventListener('pointerup', release);
    el.addEventListener('pointercancel', release);
    el.addEventListener('click', () => {
      if (dragged) {
        dragged = false;
        return;
      }
      if (reducedMotion.matches) return;
      el.animate(
        [
          { rotate: '0deg', scale: '1' },
          { rotate: '380deg', scale: '1.3', offset: 0.6 },
          { rotate: '360deg', scale: '1' },
        ],
        { duration: 750, easing: 'cubic-bezier(.34,1.56,.64,1)' },
      );
    });
  });
}

/** Effet 3D : [data-tilt] s'incline vers la souris (variables --rx / --ry). */
function initTilt() {
  if (!finePointer.matches) return;
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      if (reducedMotion.matches) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty('--rx', `${(-py * 16).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${(px * 18).toFixed(2)}deg`);
    });
    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    });
  });
}

export function initMotion() {
  document.documentElement.classList.add('motion-ok');
  initReveals();
  initMarquees();
  initParallax();
  initPatches();
  initTilt();
}
