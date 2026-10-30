// Génère les cinq propositions d'icônes de The Black Hour (SVG 512×512) et une planche de comparaison.
// Usage : node generate-icons.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), 'propositions');
mkdirSync(OUT, { recursive: true });

// Aléatoire déterministe pour que les icônes ne changent pas d'une génération à l'autre
function rng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f = (n) => Math.round(n * 10) / 10;
// Angle en degrés, 0 = midi, sens horaire
const pol = (cx, cy, r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [f(cx + r * Math.sin(a)), f(cy - r * Math.cos(a))];
};

// rx : arrondi des coins (0 = carré plein cadre) ; finish : vignettage et grain, retirés pour les visuels composés
export const svg = (body, defs = '', rx = 96, finish = true) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <clipPath id="frame"><rect width="512" height="512" rx="${rx}"/></clipPath>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.7 0 0 0 -0.28"/>
    </filter>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="blur6" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
    <filter id="blur2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2"/></filter>
    <radialGradient id="vignette" cx="50%" cy="50%" r="72%">
      <stop offset="0.55" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.75"/>
    </radialGradient>
    ${defs}
  </defs>
  <g clip-path="url(#frame)">
    ${body}
    ${finish ? '<rect width="512" height="512" fill="url(#vignette)"/><rect width="512" height="512" filter="url(#grain)" opacity="0.5"/>' : ''}
  </g>
</svg>
`;

/* ───────────── 1. Minuit fêlé : l'horloge à 23 h 59, fendue et griffée ───────────── */
function crackedClock() {
  const C = 256;
  let ticks = '';
  for (let i = 0; i < 60; i++) {
    if (i % 5 === 0) continue;
    const [x1, y1] = pol(C, C, 158, i * 6);
    const [x2, y2] = pol(C, C, 168, i * 6);
    ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  }
  let hours = '';
  for (let h = 1; h < 12; h++) {
    const [x1, y1] = pol(C, C, 140, h * 30);
    const [x2, y2] = pol(C, C, 168, h * 30);
    hours += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  }
  const numerals = [['III', 90], ['VI', 180], ['IX', 270]]
    .map(([t, d]) => { const [x, y] = pol(C, C, 114, d); return `<text x="${x}" y="${f(y + 9)}">${t}</text>`; })
    .join('');
  // Aiguille en forme de lame, pointée selon un angle
  const hand = (deg, len, w, tail) =>
    `<path transform="rotate(${deg} ${C} ${C})" d="M${C} ${C - len} L${C + w} ${C - len * 0.72} L${C + w * 0.45} ${C + tail} L${C - w * 0.45} ${C + tail} L${C - w} ${C - len * 0.72} Z"/>`;
  const crack = 'M256 256 L232 288 L241 305 L214 338 L222 352 L190 392 L196 404 L168 436';
  const crack2 = 'M214 338 L182 344 L164 368 M241 305 L268 322 L276 350 M256 256 L292 236 L300 214 L326 204';
  const claws = [0, 1, 2].map((i) => {
    const o = i * 26;
    return `M${330 + o} ${318 - o * 0.4} Q${372 + o} ${360 - o * 0.2} ${398 + o * 0.8} ${438 - o * 0.6}`;
  });
  const defs = `
    <radialGradient id="bg1" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="#22101e"/><stop offset="1" stop-color="#050307"/></radialGradient>
    <radialGradient id="halo1"><stop offset="0.62" stop-color="#c4143a" stop-opacity="0"/><stop offset="0.8" stop-color="#c4143a" stop-opacity="0.55"/><stop offset="1" stop-color="#c4143a" stop-opacity="0"/></radialGradient>
    <linearGradient id="bezel1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6b5236"/><stop offset="0.45" stop-color="#2e2116"/><stop offset="1" stop-color="#0e0906"/></linearGradient>
    <radialGradient id="dial1" cx="45%" cy="40%" r="65%"><stop offset="0" stop-color="#2d1b26"/><stop offset="1" stop-color="#0a0509"/></radialGradient>
    <linearGradient id="bone1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efe4c8"/><stop offset="1" stop-color="#9c8c6c"/></linearGradient>
    <path id="ring1" d="M256 73 a183 183 0 1 1 -0.01 0"/>`;
  return svg(`
    <rect width="512" height="512" fill="url(#bg1)"/>
    <circle cx="256" cy="256" r="250" fill="url(#halo1)"/>
    <circle cx="256" cy="256" r="198" fill="url(#bezel1)" stroke="#050307" stroke-width="6"/>
    <circle cx="256" cy="256" r="176" fill="#0b0609" stroke="#8a6a44" stroke-width="2" stroke-opacity="0.5"/>
    <text font-family="Georgia, 'Times New Roman', serif" font-size="14" letter-spacing="6.2" fill="#c9a874" fill-opacity="0.75">
      <textPath href="#ring1">THE BLACK HOUR ✦ NO ONE SURVIVES THE NIGHT ✦ THE BLACK HOUR ✦ NO ONE SURVIVES ✦</textPath>
    </text>
    <circle cx="256" cy="256" r="172" fill="url(#dial1)"/>
    <g stroke="#7a6650" stroke-width="2">${ticks}</g>
    <g stroke="#cdb894" stroke-width="7" stroke-linecap="square">${hours}</g>
    <path d="M246 84 L266 84 L261 130 L251 130 Z" fill="#e01c44" filter="url(#glow)"/>
    <path d="M253 124 Q251 140 254 146 Q257 140 257 124 Z M258 120 Q258 152 261 160 Q264 150 261 120 Z" fill="#b0102e"/>
    <g font-family="Georgia, 'Times New Roman', serif" font-weight="bold" text-anchor="middle">
            <g font-size="26" fill="#a8916c">${numerals}</g>
    </g>
    <path d="${crack}" fill="none" stroke="#ff2a4e" stroke-width="9" stroke-linejoin="round" filter="url(#blur6)" opacity="0.9"/>
    <path d="${crack2}" fill="none" stroke="#ff2a4e" stroke-width="6" filter="url(#blur6)" opacity="0.7"/>
    <path d="${crack}" fill="none" stroke="#020102" stroke-width="3.5" stroke-linejoin="miter"/>
    <path d="${crack2}" fill="none" stroke="#020102" stroke-width="2"/>
    <g fill="url(#bone1)" stroke="#120a08" stroke-width="2.5" stroke-linejoin="round">
      ${hand(0, 104, 13, 22)}
      ${hand(-6, 150, 8, 30)}
    </g>
    <circle cx="256" cy="256" r="14" fill="#2a1a12" stroke="#c9a874" stroke-width="2"/>
    <circle cx="256" cy="256" r="6" fill="#e01c44"/>
    <g fill="none" stroke-linecap="round">
      ${claws.map((d) => `<path d="${d}" stroke="#3a0812" stroke-width="16"/>`).join('')}
      ${claws.map((d) => `<path d="${d}" stroke="#c4143a" stroke-width="9"/>`).join('')}
      ${claws.map((d) => `<path d="${d}" stroke="#ff6a84" stroke-width="2" stroke-opacity="0.8"/>`).join('')}
    </g>
    <path d="M402 420 q3 14 0 22 q-3 -8 0 -22 M378 402 q3 18 0 26 q-3 -8 0 -26" fill="#c4143a"/>
  `, defs);
}

/* ───────────── 2. Éclipse : soleil noir à douze rayons au-dessus d'une ville assiégée ───────────── */
export function eclipse(rx = 96, finish = true) {
  const r = rng(7);
  const cx = 256, cy = 212, R = 104;
  let rays = '';
  for (let i = 0; i < 90; i++) {
    const d = i * 4 + r() * 3;
    const major = i % 7.5 < 1;
    const len = major ? 70 + r() * 30 : 14 + r() * 46;
    const w = major ? 3.5 : 1.2 + r() * 2;
    const [ax, ay] = pol(cx, cy, R - 4, d - w);
    const [bx, by] = pol(cx, cy, R - 4, d + w);
    const [tx, ty] = pol(cx, cy, R + len, d);
    rays += `<path d="M${ax} ${ay} L${tx} ${ty} L${bx} ${by} Z" opacity="${f(major ? 0.9 : 0.35 + r() * 0.4)}"/>`;
  }
  // Douze marques d'heure lumineuses autour du disque noir
  let marks = '';
  for (let h = 0; h < 12; h++) {
    const [x1, y1] = pol(cx, cy, R + 8, h * 30);
    const [x2, y2] = pol(cx, cy, R + (h === 0 ? 34 : 20), h * 30);
    marks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${h === 0 ? 6 : 4}"/>`;
  }
  // Horde sur deux crêtes, à contre-jour : les pieds sont posés sur la courbe réelle du terrain
  const ridgeNear = (x) => 402 + 3 * Math.sin(x / 30) + 54 * Math.pow(Math.min(x, 240) / 240, 1.6);
  const ridgeFar = (x) => 374 + 5 * Math.sin(x / 28 + 1) + 0.012 * Math.max(0, x - 180) ** 2;
  const ridgePath = (fn) => {
    let d = `M0 ${f(fn(0))}`;
    for (let x = 4; x <= 264; x += 4) d += ` L${x} ${f(fn(x))}`;
    return `${d} L264 512 L0 512 Z`;
  };
  // Silhouettes de 100 unités de haut, origine aux pieds, tournées vers la ville (à droite)
  const limb = (pts, w) => `<polyline points="${pts}" fill="none" stroke-width="${w}"/>`;
  const rags = '<path d="M-11 -38 L8 -38 L10 -29 L6 -33 L2 -27 L-2 -32 L-7 -28 L-11 -33 Z"/>';
  const poses = {
    // Titube, les deux bras tendus vers l'avant
    shamble: `<ellipse cx="7" cy="-88" rx="7" ry="8.5" transform="rotate(22 7 -88)"/>
      <path d="M-8 -77 C2 -84 13 -79 16 -70 L13 -46 C11 -40 8 -36 6 -34 L-9 -34 C-13 -46 -15 -63 -8 -77 Z"/>${rags}
      ${limb('11,-72 26,-64 40,-61 47,-64', 6)}${limb('3,-70 16,-57 29,-52 35,-54', 5.5)}
      ${limb('-3,-36 -8,-18 -13,0', 8)}${limb('4,-36 11,-18 17,-1', 7.5)}
      <path d="M-18 2 L-6 2 L-9 -3 Z M14 2 L26 2 L20 -3 Z"/>`,
    // Traîne une jambe morte derrière lui, un bras ballant
    drag: `<ellipse cx="-1" cy="-87" rx="7" ry="8.5" transform="rotate(-28 -1 -87)"/>
      <path d="M-9 -76 C0 -82 12 -78 13 -68 L12 -44 C10 -38 6 -35 4 -34 L-10 -34 C-12 -48 -14 -64 -9 -76 Z"/>${rags}
      ${limb('-6,-72 -10,-56 -9,-41 -6,-37', 5.5)}${limb('9,-71 22,-60 34,-57 39,-59', 6)}
      ${limb('4,-36 6,-18 8,0', 8)}${limb('-5,-36 -16,-20 -30,-6 -38,-1', 7)}
      <path d="M3 2 L16 2 L12 -3 Z"/>`,
    // Debout, bras levés vers l'éclipse
    reach: `<ellipse cx="3" cy="-90" rx="7" ry="8.5" transform="rotate(12 3 -90)"/>
      <path d="M-9 -80 C-2 -85 8 -85 12 -79 L10 -48 C8 -40 6 -36 5 -34 L-8 -34 C-10 -46 -12 -66 -9 -80 Z"/>${rags}
      ${limb('9,-77 18,-92 22,-107 19,-114', 5.5)}${limb('-6,-77 -11,-92 -10,-105 -13,-110', 5.5)}
      ${limb('-3,-36 -5,-18 -7,0', 8)}${limb('4,-36 9,-18 12,0', 7.5)}
      <path d="M-12 2 L0 2 L-3 -3 Z M8 2 L20 2 L16 -3 Z"/>`,
    // Rampe, le buste tiré par un bras
    crawl: `<ellipse cx="33" cy="-21" rx="7" ry="7.5" transform="rotate(30 33 -21)"/>
      <path d="M-40 -5 C-30 -16 0 -25 26 -23 C31 -17 29 -11 22 -8 L-36 0 Z"/>
      ${limb('22,-18 36,-11 47,-3 56,0', 5.5)}${limb('12,-12 16,-5 21,0', 5)}
      ${limb('-36,-3 -50,-2 -60,0', 6.5)}${limb('-32,-6 -46,-9 -56,-5', 6)}`,
  };
  const zombie = (pose, x, h, ground, lean) =>
    `<g transform="translate(${f(x)} ${f(ground(x) + 1.5)}) rotate(${f(lean)}) scale(${f(h / 100)})">${poses[pose]}</g>`;
  let hordeFar = '';
  const walkers = ['shamble', 'drag', 'reach', 'shamble', 'drag'];
  for (let x = 8; x < 200; x += 9 + r() * 6) {
    hordeFar += zombie(walkers[Math.floor(r() * walkers.length)], x, 10 + r() * 2.5, ridgeFar, (r() - 0.3) * 8);
  }
  let horde = '';
  // Deux rangs décalés, plus serrés à l'approche du rempart
  for (const [shift, dy] of [[6, -3], [0, 0]]) {
    for (let x = 10 + shift; x < 222; x += x > 160 ? 7 + r() * 4 : 12 + r() * 8) {
      const pose = r() < 0.08 ? 'crawl' : walkers[Math.floor(r() * walkers.length)];
      horde += zombie(pose, x, 20 + r() * 4, (v) => ridgeNear(v) + dy, (r() - 0.3) * 8);
    }
  }
  horde += zombie('reach', 220, 23, ridgeNear, 4);
  // Palissade de pieux jointifs (ils se chevauchent : aucun jour entre eux), coupée par une porte
  let stakes = '';
  let stakeRims = '';
  for (let x = 236; x < 512; x += 9) {
    if (x > 300 && x < 334) continue;
    const top = 404 + r() * 7;
    const tip = top - 8 - r() * 3;
    stakes += `<path d="M${x} 458 L${x} ${f(top)} L${x + 5.5} ${f(tip)} L${x + 11} ${f(top)} L${x + 11} 458 Z"/>`;
    stakeRims += `<path d="M${x} ${f(top)} L${x + 5.5} ${f(tip)}"/>`;
  }
  let crows = '';
  for (const [x, y, s] of [[118, 120, 1], [144, 104, 0.8], [402, 150, 1.1], [380, 128, 0.7], [96, 160, 0.6]]) {
    crows += `<path transform="translate(${x} ${y}) scale(${s})" d="M-14 -2 Q-7 -8 0 1 Q7 -8 14 -2 Q7 -4 0 4 Q-7 -4 -14 -2 Z"/>`;
  }
  const defs = `
    <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#040208"/><stop offset="0.5" stop-color="#1d0612"/><stop offset="0.78" stop-color="#6a0f1c"/><stop offset="0.9" stop-color="#b8321a"/></linearGradient>
    <radialGradient id="corona2"><stop offset="0.5" stop-color="#fff1d6"/><stop offset="0.55" stop-color="#ffb46a" stop-opacity="0.9"/><stop offset="0.7" stop-color="#e0303a" stop-opacity="0.45"/><stop offset="1" stop-color="#c4143a" stop-opacity="0"/></radialGradient>
    <radialGradient id="disk2" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#140a10"/><stop offset="1" stop-color="#020103"/></radialGradient>
    <filter id="rim2" x="-20%" y="-20%" width="140%" height="140%">
      <feMorphology in="SourceAlpha" operator="dilate" radius="0.5" result="d"/>
      <feGaussianBlur in="d" stdDeviation="0.9" result="b"/>
      <feFlood flood-color="#ff5a3a" flood-opacity="0.4"/>
      <feComposite in2="b" operator="in" result="rim"/>
      <feMerge><feMergeNode in="rim"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <linearGradient id="mist2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd0b0" stop-opacity="0"/><stop offset="0.6" stop-color="#ffd0b0" stop-opacity="0.12"/><stop offset="1" stop-color="#ffd0b0" stop-opacity="0"/></linearGradient>`;
  return svg(`
    <rect width="512" height="512" fill="url(#sky2)"/>
    <circle cx="${cx}" cy="${cy}" r="210" fill="url(#corona2)"/>
    <g fill="#ffb878" filter="url(#blur2)">${rays}</g>
    <g stroke="#fff3dc" stroke-linecap="round" filter="url(#glow)">${marks}</g>
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#disk2)"/>
    <circle cx="${cx}" cy="${cy}" r="${R + 1}" fill="none" stroke="#ffe6c0" stroke-width="2.5" filter="url(#glow)"/>
    <circle cx="${pol(cx, cy, R, 38)[0]}" cy="${pol(cx, cy, R, 38)[1]}" r="9" fill="#fff" filter="url(#glow)"/>
    <circle cx="${pol(cx, cy, R, 38)[0]}" cy="${pol(cx, cy, R, 38)[1]}" r="22" fill="#fff" opacity="0.35" filter="url(#blur6)"/>
    <g fill="#0a0306">${crows}</g>
    <path d="${ridgePath(ridgeFar)}" fill="#33070f"/>
    <g fill="#33070f" stroke="#33070f" stroke-linecap="round" stroke-linejoin="round">${hordeFar}</g>
    <path d="${ridgePath(ridgeNear)}" fill="#14040a"/>
    <rect x="0" y="372" width="512" height="80" fill="url(#mist2)"/>
    <path d="M284 378 C276 360 292 350 284 334 C278 322 290 312 298 300" fill="none" stroke="#c9a0a0" stroke-opacity="0.22" stroke-width="7" stroke-linecap="round" filter="url(#blur6)"/>
    <!-- Maisons et tour derrière le rempart : un ton plus clair que lui pour donner de la profondeur -->
    <g fill="#14050b">
      <path d="M242 446 L242 400 L266 378 L290 400 L290 446 Z"/>
      <rect x="279" y="372" width="8" height="18"/>
      <path d="M282 446 L282 396 L294 374 L318 374 L330 396 L330 446 Z"/>
      <path d="M322 446 L322 388 L343 358 L364 388 L364 446 Z"/>
      <path d="M406 446 L406 398 L430 374 L454 398 L454 446 Z"/>
      <rect x="440" y="374" width="7" height="16"/>
      <path d="M448 446 L448 404 L474 384 L500 404 L500 446 Z"/>
      <path d="M494 446 L494 398 L512 386 L512 446 Z"/>
    </g>
    <g fill="#0d0407">
      <path d="M362 446 L370 332 L400 332 L408 446 L402 446 L395 340 L375 340 L368 446 Z"/>
      <path d="M371 352 L399 404 M399 352 L371 404 M368 404 L402 404" fill="none" stroke="#0d0407" stroke-width="3.5"/>
      <rect x="360" y="326" width="50" height="7"/>
      <rect x="362" y="314" width="46" height="13"/>
      <rect x="362" y="304" width="46" height="12"/>
      <path d="M354 306 L385 284 L416 306 Z"/>
      <rect x="383" y="262" width="3" height="24"/>
    </g>
    <path d="M386 262 Q396 264 404 262 Q398 268 404 274 Q396 272 386 274 Z" fill="#7a0f1e"/>
    <g fill="#ffb020" filter="url(#glow)">
      <rect x="378" y="306" width="14" height="7" fill="#ffd60a"/>
      <rect x="338" y="392" width="7" height="9"/>
      <rect x="425" y="400" width="6" height="7" opacity="0.7"/>
    </g>
    <path d="M338 396.5 H345 M341.5 392 V401" stroke="#14050b" stroke-width="1.5"/>
    <g fill="#050205">
      ${stakes}
      <path d="M226 458 L226 396 L248 396 L248 458 Z M222 398 L237 384 L252 398 Z"/>
      <path d="M296 458 L296 388 L304 388 L304 458 Z M330 458 L330 388 L338 388 L338 458 Z"/>
      <path d="M290 390 L344 390 L344 384 L317 376 L290 384 Z"/>
      <path d="M304 458 L304 404 L330 404 L330 458 Z"/>
      <path d="M0 478 Q130 472 230 457 L512 454 L512 512 L0 512 Z"/>
    </g>
    <path d="M310.5 406 V450 M317 406 V450 M323.5 406 V450 M306 446 L328 412" stroke="#1a070c" stroke-width="1.2"/>
    <g fill="none" stroke="#6a0f1c" stroke-opacity="0.7" stroke-width="1.2">${stakeRims}</g>
    <g fill="#0a0306" stroke="#0a0306" stroke-linecap="round" stroke-linejoin="round" filter="url(#rim2)">${horde}</g>
    ${[[293, 380], [341, 380]].map(([x, y]) => `<rect x="${x}" y="${y}" width="3" height="10" fill="#050205"/>
    <path d="M${x + 1.5} ${y - 9} Q${x + 5} ${y - 3} ${x + 1.5} ${y} Q${x - 2} ${y - 3} ${x + 1.5} ${y - 9} Z" fill="#ffb020" filter="url(#glow)"/>`).join('')}
  `, defs, rx, finish);
}

/* ───────────── 3. Sablier : le sable noir s'écoule, la horde attend en bas ───────────── */
function hourglass() {
  const r = rng(11);
  const glass = 'M176 124 C176 214 246 230 248 256 C246 282 176 298 176 388 L336 388 C336 298 266 282 264 256 C266 230 336 214 336 124 Z';
  let grains = '';
  for (let i = 0; i < 14; i++) {
    grains += `<circle cx="${f(256 + (r() - 0.5) * 6)}" cy="${f(266 + r() * 60)}" r="${f(0.8 + r() * 1.2)}"/>`;
  }
  let sparks = '';
  for (let i = 0; i < 26; i++) {
    const x = 186 + r() * 140;
    const y = 334 + r() * 52;
    if (Math.abs(x - 256) * 0.9 > y - 318) continue;
    sparks += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.6 + r())}" opacity="${f(0.4 + r() * 0.6)}"/>`;
  }
  const post = (x) => `
    <rect x="${x - 7}" y="122" width="14" height="268" fill="url(#wood3v)" stroke="#0a0504" stroke-width="2"/>
    <ellipse cx="${x}" cy="168" rx="11" ry="7" fill="#5a3a20" stroke="#0a0504" stroke-width="2"/>
    <ellipse cx="${x}" cy="256" rx="12" ry="9" fill="#6b4626" stroke="#0a0504" stroke-width="2"/>
    <ellipse cx="${x}" cy="344" rx="11" ry="7" fill="#5a3a20" stroke="#0a0504" stroke-width="2"/>`;
  const plate = (y) => `
    <rect x="132" y="${y}" width="248" height="30" rx="5" fill="url(#wood3)" stroke="#0a0504" stroke-width="3"/>
    <rect x="132" y="${y + 11}" width="248" height="7" fill="#2a2a30" stroke="#0a0504" stroke-width="1.5"/>
    ${[150, 200, 256, 312, 362].map((x) => `<circle cx="${x}" cy="${y + 14.5}" r="2.6" fill="#9aa0b0"/>`).join('')}`;
  const spike = (x, y, up) => `<path d="M${x - 9} ${y} L${x} ${y + (up ? -26 : 26)} L${x + 9} ${y} Z" fill="#3a3a44" stroke="#0a0504" stroke-width="2"/>`;
  const defs = `
    <radialGradient id="bg3" cx="50%" cy="50%" r="70%"><stop offset="0" stop-color="#2a0b16"/><stop offset="1" stop-color="#040205"/></radialGradient>
    <radialGradient id="halo3"><stop offset="0" stop-color="#c4143a" stop-opacity="0.6"/><stop offset="1" stop-color="#c4143a" stop-opacity="0"/></radialGradient>
    <linearGradient id="wood3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a4e2c"/><stop offset="1" stop-color="#2c170b"/></linearGradient>
    <linearGradient id="wood3v" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2c170b"/><stop offset="0.4" stop-color="#6b4626"/><stop offset="1" stop-color="#1e0f06"/></linearGradient>
    <linearGradient id="sand3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2c34"/><stop offset="1" stop-color="#0c080b"/></linearGradient>
    <linearGradient id="bone3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efe4c8"/><stop offset="1" stop-color="#8a7a5c"/></linearGradient>
    <clipPath id="glass3"><path d="${glass}"/></clipPath>`;
  return svg(`
    <rect width="512" height="512" fill="url(#bg3)"/>
    <ellipse cx="256" cy="270" rx="190" ry="210" fill="url(#halo3)"/>
    <path d="M256 30 A226 226 0 0 1 256 482" fill="none" stroke="#c4143a" stroke-opacity="0.25" stroke-width="2" stroke-dasharray="2 10"/>
    <path d="M256 30 A226 226 0 0 0 256 482" fill="none" stroke="#c4143a" stroke-opacity="0.25" stroke-width="2" stroke-dasharray="2 10"/>
    <g transform="translate(256 256) scale(1.13) translate(-256 -256)">
    <path d="${glass}" fill="#b8c8ff" fill-opacity="0.07"/>
    <g clip-path="url(#glass3)">
      <path d="M150 192 Q256 236 362 192 L362 262 L150 262 Z" fill="url(#sand3)"/>
      <path d="M190 200 Q256 226 322 200" fill="none" stroke="#ff4a66" stroke-opacity="0.35" stroke-width="2"/>
      <path d="M170 390 C204 356 236 318 256 316 C276 318 308 356 342 390 Z" fill="url(#sand3)"/>
      <g transform="translate(256 356)">
        <path d="M-22 4 C-24 -22 -10 -30 0 -30 C10 -30 24 -22 22 4 L14 14 L-14 14 Z" fill="url(#bone3)" stroke="#120a08" stroke-width="2"/>
        <path d="M-15 -8 q6 -7 12 0 q-2 9 -6 9 q-4 0 -6 -9 Z M15 -8 q-6 -7 -12 0 q2 9 6 9 q4 0 6 -9 Z" fill="#120a08"/>
        <circle cx="-9" cy="-4" r="2.2" fill="#ff2a4e" filter="url(#glow)"/>
        <circle cx="9" cy="-4" r="2.2" fill="#ff2a4e" filter="url(#glow)"/>
        <path d="M-2 4 L0 -1 L2 4 Z" fill="#120a08"/>
        <path d="M-30 10 C-10 4 10 4 30 10 L30 30 L-30 30 Z" fill="#1a1216"/>
      </g>
      <g stroke="url(#bone3)" stroke-linecap="round" fill="none">
        <path d="M206 384 L198 362 L190 352 M212 382 L210 358 L204 346 M218 384 L222 362 L220 350" stroke-width="4.5"/>
        <path d="M306 384 L316 366 L326 358 M300 382 L306 360 L312 348" stroke-width="4.5"/>
      </g>
      <g fill="#ff4a66">${sparks}</g>
      <path d="M256 258 L256 330" stroke="#ff2a4e" stroke-width="8" filter="url(#blur6)"/>
      <path d="M256 258 L256 330" stroke="#ff6a84" stroke-width="3" filter="url(#glow)"/>
      <g fill="#ff6a84">${grains}</g>
    </g>
    <path d="${glass}" fill="none" stroke="#dfe6ff" stroke-opacity="0.45" stroke-width="2.5"/>
    <path d="M190 140 C190 196 222 220 236 236" fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="5" stroke-linecap="round"/>
    <path d="M190 372 C190 330 214 296 236 278" fill="none" stroke="#fff" stroke-opacity="0.22" stroke-width="5" stroke-linecap="round"/>
    ${post(150)}${post(362)}
    ${plate(96)}${plate(386)}
    ${spike(146, 96, true)}${spike(366, 96, true)}${spike(146, 416, false)}${spike(366, 416, false)}
    <path d="M246 96 L256 74 L266 96 Z" fill="#3a3a44" stroke="#0a0504" stroke-width="2"/>
    </g>
  `, defs);
}

/* ───────────── 4. Barricade : des yeux rouges entre les planches, une main agrippe le bois ───────────── */
function barricade() {
  const r = rng(23);
  const eye = (x, y, s, tilt = 0) => `
    <g transform="translate(${x} ${y}) rotate(${tilt})" filter="url(#glow)">
      <path d="M${-s * 2.6 - s} 0 q${s} -${s * 0.9} ${s * 2} 0 q-${s} ${s * 0.7} -${s * 2} 0 Z M${s * 1.6} 0 q${s} -${s * 0.9} ${s * 2} 0 q-${s} ${s * 0.7} -${s * 2} 0 Z" fill="#ff1f3d"/>
      <circle cx="${f(-s * 2.6)}" cy="0" r="${f(s * 0.3)}" fill="#ffe0a0"/><circle cx="${f(s * 2.6)}" cy="0" r="${f(s * 0.3)}" fill="#ffe0a0"/>
    </g>`;
  const plank = (cy, rot, seed) => {
    const pr = rng(seed);
    let grain = '';
    for (let i = 0; i < 7; i++) {
      const y = -20 + i * 6.5 + pr() * 3;
      grain += `<path d="M-240 ${f(y)} C-120 ${f(y + (pr() - 0.5) * 6)} 0 ${f(y + (pr() - 0.5) * 6)} 240 ${f(y)}" />`;
    }
    const knotX = f(-120 + pr() * 240);
    return `<g transform="translate(256 ${cy}) rotate(${rot})">
      <rect x="-246" y="-31" width="492" height="62" fill="#000" opacity="0.55" transform="translate(4 8)" filter="url(#blur6)"/>
      <rect x="-240" y="-27" width="480" height="54" rx="3" fill="url(#wood4)" stroke="#120804" stroke-width="3"/>
      <g fill="none" stroke="#2a1608" stroke-opacity="0.55" stroke-width="1.5">${grain}</g>
      <ellipse cx="${knotX}" cy="${f((pr() - 0.5) * 20)}" rx="9" ry="5" fill="none" stroke="#2a1608" stroke-width="2"/>
      <path d="M-240 -25 L240 -25" stroke="#c49a6a" stroke-opacity="0.5" stroke-width="2"/>
      ${[-176, 176].map((x) => `<circle cx="${x}" cy="-12" r="4.5" fill="#6a6e78" stroke="#111" stroke-width="1.5"/><circle cx="${x}" cy="12" r="4.5" fill="#6a6e78" stroke="#111" stroke-width="1.5"/><path d="M${x - 2} -13 l3 -2 M${x - 2} 11 l3 -2" stroke="#c8ccd6" stroke-width="1"/>`).join('')}
      <path d="M${x(-176)} 14 q2 10 0 16" stroke="#5a1a08" stroke-opacity="0.6" stroke-width="3" fill="none"/>
    </g>`;
    function x(v) { return v; }
  };
  let bricks = '';
  for (let row = 0; row < 18; row++) {
    const y = row * 30;
    bricks += `<path d="M0 ${y} H512" />`;
    for (let c = 0; c < 9; c++) {
      const bx = c * 64 + (row % 2) * 32;
      bricks += `<path d="M${bx} ${y} V${y + 30}"/>`;
    }
  }
  const scratches = [0, 1, 2, 3].map((i) => `<path d="M${110 + i * 14} ${-14 + i * 2} L${150 + i * 14} ${16 + i * 2}"/>`).join('');
  // Doigts qui passent par-dessus la planche du milieu (dessinés dans le repère de la planche)
  const fingers = `<path d="M-72 -27 C-74 -56 -66 -84 -40 -96 L10 -92 C26 -78 28 -52 24 -27 Z" fill="url(#hand4)"/>` + [[-58, 2, 7], [-36, 6, 8], [-14, 4, 8], [8, -2, 7]].map(([fx, dy, w]) => `
      <ellipse cx="${fx}" cy="${-27 + dy * 0.3}" rx="${w + 3}" ry="7" fill="#5a6a44" stroke="#0e140a" stroke-width="2"/>
      <path d="M${fx - w} ${-27 + dy * 0.3} L${fx + w} ${-27 + dy * 0.3} L${fx + w - 1} ${-6 + dy} Q${fx + w - 2} ${6 + dy} ${fx} ${8 + dy} Q${fx - w + 2} ${6 + dy} ${fx - w + 1} ${-6 + dy} Z" fill="url(#skin4)" stroke="#0e140a" stroke-width="2.5"/>
      <path d="M${fx - 5} ${-14 + dy} q5 3 10 0" stroke="#1e2a14" stroke-width="1.6" fill="none"/>
      <path d="M${fx - 5} ${2 + dy} L${fx} ${18 + dy} L${fx + 5} ${2 + dy} Q${fx} ${6 + dy} ${fx - 5} ${2 + dy} Z" fill="#c8b98a" stroke="#2a1a10" stroke-width="1.5"/>
      <path d="M${fx - 2} ${10 + dy} q-2 10 0 16" stroke="#7a0c1e" stroke-width="3" stroke-linecap="round" fill="none"/>`).join('');
  const defs = `
    <linearGradient id="wall4" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a2632"/><stop offset="1" stop-color="#0c0a10"/></linearGradient>
    <radialGradient id="void4" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="#1a0408"/><stop offset="1" stop-color="#020102"/></radialGradient>
    <linearGradient id="wood4" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a6038"/><stop offset="0.5" stop-color="#5e3e22"/><stop offset="1" stop-color="#3a2412"/></linearGradient>
    <linearGradient id="frame4" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a3220"/><stop offset="1" stop-color="#1a0f08"/></linearGradient>
    <linearGradient id="skin4" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a7a50"/><stop offset="1" stop-color="#9aa87a"/></linearGradient>
    <linearGradient id="hand4" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#4a5a3a"/><stop offset="1" stop-color="#4a5a3a" stop-opacity="0"/></linearGradient>
    <linearGradient id="moon4" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9ab0ff" stop-opacity="0.22"/><stop offset="0.5" stop-color="#9ab0ff" stop-opacity="0"/></linearGradient>`;
  return svg(`
    <rect width="512" height="512" fill="url(#wall4)"/>
    <g stroke="#000" stroke-opacity="0.45" stroke-width="2" fill="none">${bricks}</g>
    <rect x="74" y="74" width="364" height="364" fill="url(#frame4)" stroke="#080402" stroke-width="4"/>
    <rect x="98" y="98" width="316" height="316" fill="url(#void4)" stroke="#080402" stroke-width="4"/>
    ${eye(350, 206, 9, -6)}${eye(272, 186, 6, -4)}${eye(152, 196, 4.5, 4)}
    ${eye(180, 312, 8, 8)}${eye(274, 322, 5, 0)}${eye(370, 326, 4, -3)}
        ${plank(262, 12, 5)}
    <g transform="translate(256 262) rotate(12)">
      <g transform="translate(-100 0)">${fingers}</g>
    </g>
    ${plank(150, -6, 3)}
    ${plank(372, -3, 9)}
    <g transform="translate(256 372) rotate(-3)" stroke="#1a0804" stroke-width="3" stroke-linecap="round">${scratches}</g>
    <g transform="translate(256 372) rotate(-3)" stroke="#c49a6a" stroke-opacity="0.45" stroke-width="1" stroke-linecap="round">${scratches}</g>
    <path d="M60 438 L452 438 L462 456 L50 456 Z" fill="#3a2414" stroke="#080402" stroke-width="3"/>
        <rect width="512" height="512" fill="url(#moon4)"/>
  `, defs);
}

/* ───────────── 5. Lune de sang : une main jaillit de la terre vers le cadran lunaire ───────────── */
function bloodMoon() {
  const r = rng(41);
  const cx = 256, cy = 214, R = 148;
  let craters = '';
  for (const [x, y, s] of [[-60, -50, 22], [40, -80, 14], [70, 10, 26], [-30, 40, 18], [-90, 20, 10], [20, 90, 12], [100, -40, 9], [-50, -100, 8], [10, -20, 7]]) {
    craters += `<circle cx="${cx + x}" cy="${cy + y}" r="${s}" fill="#3a0408" fill-opacity="0.28"/><path d="M${cx + x - s * 0.8} ${cy + y + s * 0.5} A${s} ${s} 0 0 0 ${cx + x + s * 0.8} ${cy + y + s * 0.5}" fill="none" stroke="#ff9a7a" stroke-opacity="0.25" stroke-width="2"/>`;
  }
  let ticks = '';
  for (let h = 0; h < 12; h++) {
    const [x1, y1] = pol(cx, cy, R - 10, h * 30);
    const [x2, y2] = pol(cx, cy, R - (h === 0 ? 40 : 26), h * 30);
    ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${h === 0 ? 9 : 5}"/>`;
  }
  let minor = '';
  for (let i = 0; i < 60; i++) {
    if (i % 5 === 0) continue;
    const [x1, y1] = pol(cx, cy, R - 10, i * 6);
    const [x2, y2] = pol(cx, cy, R - 17, i * 6);
    minor += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  }
  // Main décharnée : doigts en polylignes coudées, tous de la même encre pour former une silhouette
  const hand = `
    <path d="M262 512 C266 470 272 430 282 384 L322 384 C326 432 334 470 344 512 Z"/>
    <path d="M280 390 C268 372 266 344 270 322 L338 316 C344 344 336 372 324 392 Z"/>
    <path d="M276 330 L262 290 L246 264 L240 246" stroke-width="17"/>
    <path d="M296 322 L294 280 L284 246 L282 226" stroke-width="18"/>
    <path d="M316 322 L322 282 L320 252 L326 236" stroke-width="17"/>
    <path d="M334 328 L346 296 L356 276 L366 268" stroke-width="14"/>
    <path d="M276 362 L250 346 L232 320 L224 308" stroke-width="17"/>
    <path d="M262 512 L250 500 L274 494 Z M344 512 L360 498 L332 492 Z"/>`;
  let stones = '';
  for (const [x, w, h, cross] of [[60, 30, 44, true], [118, 26, 34, false], [178, 22, 30, true], [398, 28, 40, false], [446, 24, 52, true]]) {
    const base = 470 + r() * 6;
    stones += cross
      ? `<path d="M${x - 4} ${f(base)} V${f(base - h)} H${x + 4} V${f(base)} Z M${x - w / 2} ${f(base - h * 0.72)} H${x + w / 2} V${f(base - h * 0.72 + 8)} H${x - w / 2} Z" transform="rotate(${f((r() - 0.5) * 14)} ${x} ${f(base)})"/>`
      : `<path d="M${x - w / 2} ${f(base)} V${f(base - h + w / 2)} A${w / 2} ${w / 2} 0 0 1 ${x + w / 2} ${f(base - h + w / 2)} V${f(base)} Z" transform="rotate(${f((r() - 0.5) * 12)} ${x} ${f(base)})"/>`;
  }
  const branches = `
    <path d="M40 512 C46 440 40 380 30 330" stroke-width="18"/>
    <path d="M36 380 C70 340 96 300 108 250" stroke-width="9"/>
    <path d="M104 262 C128 240 146 210 150 180" stroke-width="5"/>
    <path d="M108 252 C96 220 92 196 98 170" stroke-width="4"/>
    <path d="M148 186 L170 160 M150 196 L176 192 M98 176 L84 150 M96 186 L114 160" stroke-width="2.5"/>
    <path d="M32 340 C20 300 10 280 -6 266" stroke-width="7"/>
    <path d="M64 330 C96 330 120 320 140 300" stroke-width="4"/>`;
  const defs = `
    <radialGradient id="bg5" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="#3a0610"/><stop offset="0.6" stop-color="#120308"/><stop offset="1" stop-color="#030103"/></radialGradient>
    <radialGradient id="atmo5"><stop offset="0.7" stop-color="#ff3a2a" stop-opacity="0.55"/><stop offset="1" stop-color="#ff3a2a" stop-opacity="0"/></radialGradient>
    <radialGradient id="moon5" cx="38%" cy="34%" r="72%"><stop offset="0" stop-color="#ff7a52"/><stop offset="0.45" stop-color="#c8202a"/><stop offset="1" stop-color="#4a050c"/></radialGradient>`;
  const [mx, my] = pol(cx, cy, 120, -6);
  const [hx, hy] = pol(cx, cy, 78, 0);
  return svg(`
    <rect width="512" height="512" fill="url(#bg5)"/>
    <circle cx="${cx}" cy="${cy}" r="${R + 60}" fill="url(#atmo5)"/>
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#moon5)"/>
    ${craters}
    <g stroke="#1a0306" stroke-opacity="0.55" stroke-width="2">${minor}</g>
    <g stroke="#1a0306" stroke-linecap="round">${ticks}</g>
    <g stroke="#0a0204" stroke-linecap="round">
      <line x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}" stroke-width="12"/>
      <line x1="${cx}" y1="${cy}" x2="${mx}" y2="${my}" stroke-width="7"/>
    </g>
    <circle cx="${cx}" cy="${cy}" r="10" fill="#0a0204"/>
    <path d="M0 236 Q120 250 512 226 L512 300 Q256 290 0 300 Z" fill="#000" opacity="0.25" filter="url(#blur6)"/>
    <g fill="none" stroke="#050204" stroke-linecap="round">${branches}</g>
    <path d="M0 468 Q90 446 200 462 Q300 476 400 456 Q460 448 512 458 L512 512 L0 512 Z" fill="#050204"/>
    <g fill="#050204">${stones}</g>
    <g fill="#ff4a32" stroke="#ff4a32" stroke-linecap="round" stroke-linejoin="round" filter="url(#blur2)" opacity="0.85" transform="translate(-2 -1)">
      <g stroke-width="4">${hand.replace(/stroke-width="(\d+)"/g, (_, w) => `stroke-width="${+w + 6}"`)}</g>
    </g>
    <g fill="#050204" stroke="#050204" stroke-linecap="round" stroke-linejoin="round">${hand}</g>
    <path d="M250 498 Q300 484 356 498 L362 512 L244 512 Z" fill="#0c0406"/>
    ${[0, 1, 2, 3, 4].map((i) => `<circle cx="${236 + i * 30 + r() * 10}" cy="${492 + r() * 8}" r="${f(3 + r() * 4)}" fill="#0c0406"/>`).join('')}
  `, defs);
}

// Génération des propositions seulement quand ce fichier est lancé directement (pas quand on l'importe)
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
const icons = [
  ['1-minuit-fele', 'Minuit fêlé', 'L’horloge bloquée à 23 h 59, cadran fendu par une lumière rouge, griffée par la horde. Le titre est gravé sur la lunette.', crackedClock],
  ['2-eclipse', 'Éclipse', 'Un soleil noir à douze rayons (les heures) se lève sur la ville : palissade, tour de guet allumée, horde à contre-jour sur la crête.', eclipse],
  ['3-sablier', 'Sablier', 'Le sable noir s’écoule en filet rouge ; en bas, un crâne aux yeux rouges et des os attendent que le dernier grain tombe.', hourglass],
  ['4-barricade', 'Barricade', 'Fenêtre condamnée : des paires d’yeux rouges entre les planches, une main pourrie agrippe le bois, griffures sur la planche basse.', barricade],
  ['5-lune-de-sang', 'Lune de sang', 'La lune rouge devient cadran à minuit ; une main décharnée jaillit du cimetière pour l’attraper, arbre mort en contre-jour.', bloodMoon],
];

const uri = {};
for (const [file, , , make] of icons) {
  const content = make();
  writeFileSync(join(OUT, `${file}.svg`), content);
  // La planche embarque les SVG pour s’fficher même ouverte hors serveur
  uri[file] = `data:image/svg+xml;base64,${Buffer.from(content).toString('base64')}`;
}

const card = ([file, name, desc]) => `
  <article>
    <h2>${name}</h2>
    <img class="big" data-icon="${file}" alt="${name}">
    <p>${desc}</p>
    <div class="sizes">
      ${[128, 64, 48, 32, 16].map((s) => `<figure><img data-icon="${file}" width="${s}" height="${s}" alt=""><figcaption>${s}</figcaption></figure>`).join('')}
      <figure><img class="discord" data-icon="${file}" width="96" height="96" alt=""><figcaption>Discord</figcaption></figure>
    </div>
  </article>`;
writeFileSync(join(OUT, 'planche.html'), `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Icônes The Black Hour</title>
<style>
  body { margin: 0; padding: 32px 16px; background: #0b0718; color: #eaf6ff; font: 15px/1.5 system-ui, sans-serif; }
  h1 { text-align: center; font-weight: 600; letter-spacing: .08em; margin: 0 0 28px; }
  main { display: grid; grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); gap: 24px; max-width: 1800px; margin: auto; }
  article { background: #160e33; border-radius: 16px; padding: 18px; }
  h2 { margin: 0 0 12px; font-size: 18px; }
  .big { width: 100%; max-width: 360px; display: block; margin: auto; }
  p { color: #c9cff2; min-height: 66px; }
  .sizes { display: flex; align-items: flex-end; gap: 12px; flex-wrap: wrap; }
  figure { margin: 0; text-align: center; }
  figcaption { color: #9fa8d9; font-size: 12px; }
  .discord { border-radius: 50%; clip-path: circle(50%); }
</style></head>
<body><h1>THE BLACK HOUR — 5 propositions d’icône</h1><main>${icons.map(card).join('')}</main>
<script>const uri = ${JSON.stringify(uri)};
for (const img of document.querySelectorAll('img[data-icon]')) img.src = uri[img.dataset.icon];</script>
</body></html>
`);
console.log('OK', OUT);
}
