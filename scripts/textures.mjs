// Génère les deux textures du fond : textile.svg (trame de tissu) et rayures.svg (éraflures).
// Usage : npm run textures (réécrit public/textures/)
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.argv[2] ?? 'public/textures';

// ---------- textile.svg : sergé diagonal + fils + nuages, tuile de 600 px ----------
const T = 600;
const textile = `<svg xmlns="http://www.w3.org/2000/svg" width="${T}" height="${T}" viewBox="0 0 ${T} ${T}">
  <!-- Généré par scripts/textures.mjs (npm run textures). Trame de tissu noir : sergé diagonal, fils et légères variations de teinte.
       La tuile se répète sans couture (bruit « cousu » avec stitchTiles). -->
  <defs>
    <pattern id="serge" width="5" height="5" patternUnits="userSpaceOnUse">
      <path d="M-1 1l2-2M0 5l5-5M4 6l2-2" stroke="#fff" stroke-width="1.1"/>
    </pattern>
    <filter id="irregulier" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.01 0.03" numOctaves="2" seed="4" stitchTiles="stitch" result="bruit"/>
      <feColorMatrix in="bruit" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.5 0 0 0 -0.2" result="masque"/>
      <feComposite in="SourceGraphic" in2="masque" operator="in"/>
    </filter>
    <filter id="fils" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.025 0.65" numOctaves="2" seed="9" stitchTiles="stitch"/>
      <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  5 0 0 0 -3.05"/>
    </filter>
    <filter id="nuages" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="3" seed="2" stitchTiles="stitch"/>
      <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1.5 0 0 0 -0.6"/>
    </filter>
  </defs>
  <rect width="${T}" height="${T}" filter="url(#nuages)" opacity="0.045"/>
  <rect width="${T}" height="${T}" fill="url(#serge)" filter="url(#irregulier)" opacity="0.05"/>
  <rect width="${T}" height="${T}" filter="url(#fils)" opacity="0.07"/>
</svg>
`;
writeFileSync(join(outDir, 'textile.svg'), textile);

// ---------- rayures.svg : éraflures, fibres et poussière, tuile de 1100 px ----------
const W = 1100;
const H = 1100;

// Aléatoire à graine fixe : la texture est toujours la même
let seed = 20261008;
const rand = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const between = (a, b) => a + (b - a) * rand();
const rad = (d) => (d * Math.PI) / 180;
const r1 = (v) => Math.round(v * 10) / 10;

const lines = [];
const dots = [];

function scratch(x, y, angle, length, width, opacity, bend) {
  const dx = Math.cos(rad(angle)) * length;
  const dy = Math.sin(rad(angle)) * length;
  const k = between(-bend, bend) * length;
  lines.push({
    pts: [x, y, x + dx / 2 - (dy / length) * k, y + dy / 2 + (dx / length) * k, x + dx, y + dy],
    width,
    opacity,
  });
}

// Éraflures groupées, surtout en diagonale descendante comme sur la référence
for (let c = 0; c < 26; c++) {
  const x = between(0, W);
  const y = between(0, H);
  const roll = rand();
  const base = roll < 0.7 ? between(18, 48) : roll < 0.85 ? between(-12, 10) : between(55, 80);
  const count = 2 + Math.floor(rand() * 5);
  for (let i = 0; i < count; i++) {
    scratch(x + between(-28, 28), y + between(-22, 22), base + between(-7, 7), 8 + 85 * rand() ** 2, between(0.5, 1.25), between(0.07, 0.3), 0.12);
  }
}
// Longues rayures très pâles
for (let i = 0; i < 9; i++) scratch(between(0, W), between(0, H), between(15, 50), between(90, 240), between(0.4, 0.7), between(0.04, 0.1), 0.05);
// Fibres : petits poils courbés dans tous les sens
for (let i = 0; i < 45; i++) scratch(between(0, W), between(0, H), between(0, 360), between(5, 16), between(0.5, 0.9), between(0.08, 0.22), 0.45);
// Poussière
for (let i = 0; i < 170; i++) dots.push({ x: between(0, W), y: between(0, H), r: between(0.35, 1.05), opacity: between(0.06, 0.3) });

// Ce qui dépasse d'un bord est recopié de l'autre côté : la tuile se raccorde sans couture
const copies = (x1, y1, x2, y2) => {
  const result = [];
  for (const ox of [-W, 0, W]) {
    for (const oy of [-H, 0, H]) {
      if (x2 + ox < 0 || y2 + oy < 0 || x1 + ox > W || y1 + oy > H) continue;
      result.push([ox, oy]);
    }
  }
  return result;
};

const paths = lines.flatMap(({ pts, width, opacity }) => {
  const xs = [pts[0], pts[2], pts[4]];
  const ys = [pts[1], pts[3], pts[5]];
  return copies(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)).map(([ox, oy]) => {
    const [a, b, c, d, e, f] = pts;
    return `<path d="M${r1(a + ox)} ${r1(b + oy)}Q${r1(c + ox)} ${r1(d + oy)} ${r1(e + ox)} ${r1(f + oy)}" stroke-width="${width.toFixed(2)}" stroke-opacity="${opacity.toFixed(2)}"/>`;
  });
});
const specks = dots.flatMap(({ x, y, r, opacity }) =>
  copies(x - r, y - r, x + r, y + r).map(
    ([ox, oy]) => `<circle cx="${r1(x + ox)}" cy="${r1(y + oy)}" r="${r.toFixed(2)}" fill-opacity="${opacity.toFixed(2)}"/>`,
  ),
);

const rayures = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<!-- Généré par scripts/textures.mjs (npm run textures). Éraflures, fibres et poussière : tuile qui se répète sans couture -->
<g fill="none" stroke="#fff" stroke-linecap="round">
${paths.join('\n')}
</g>
<g fill="#fff">
${specks.join('\n')}
</g>
</svg>
`;
writeFileSync(join(outDir, 'rayures.svg'), rayures);
console.log(`textile.svg ${(textile.length / 1024).toFixed(1)} Ko — rayures.svg : ${paths.length} traits, ${specks.length} poussières, ${(rayures.length / 1024).toFixed(1)} Ko`);
