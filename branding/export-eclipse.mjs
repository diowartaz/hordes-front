// Décline l'icône retenue (Éclipse) : SVG maîtres, favicon simplifiée, PNG à toutes les tailles,
// favicon.ico, icône et bannière Discord, visuels publicitaires.
// Usage : node export-eclipse.mjs  (rendu PNG par Chrome en mode headless)
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { eclipse } from './generate-icons.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), 'eclipse');
const SVG = join(ROOT, 'svg');
const PNG = join(ROOT, 'png');
const SOURCES = join(ROOT, 'sources');
for (const d of [SVG, PNG, SOURCES]) mkdirSync(d, { recursive: true });

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(existsSync);
if (!CHROME) throw new Error('Chrome ou Edge introuvable pour le rendu PNG');

/* ───────────── SVG ───────────── */

// Favicon : seulement l'éclipse, ses douze heures et la ligne du rempart, lisible jusqu'en 16 px
function favicon() {
  const cx = 256, cy = 230;
  const pol = (r, deg) => {
    const a = (deg * Math.PI) / 180;
    return [Math.round(cx + r * Math.sin(a)), Math.round(cy - r * Math.cos(a))];
  };
  let marks = '';
  for (let h = 0; h < 12; h++) {
    const [x1, y1] = pol(176, h * 30);
    const [x2, y2] = pol(h === 0 ? 232 : 212, h * 30);
    marks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${h === 0 ? 20 : 14}"/>`;
  }
  let stakes = '';
  for (let x = 0; x < 512; x += 24) stakes += `L${x} 452 L${x + 12} 436 L${x + 24} 452 `;
  const [sx, sy] = pol(150, 38);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <clipPath id="frame"><rect width="512" height="512" rx="112"/></clipPath>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05030a"/><stop offset="0.55" stop-color="#2a0712"/><stop offset="0.85" stop-color="#8c1a1c"/></linearGradient>
    <radialGradient id="corona"><stop offset="0.6" stop-color="#fff1d6"/><stop offset="0.66" stop-color="#ffb46a" stop-opacity="0.95"/><stop offset="0.82" stop-color="#e0303a" stop-opacity="0.5"/><stop offset="1" stop-color="#c4143a" stop-opacity="0"/></radialGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <g clip-path="url(#frame)">
    <rect width="512" height="512" fill="url(#sky)"/>
    <circle cx="${cx}" cy="${cy}" r="250" fill="url(#corona)"/>
    <g stroke="#fff3dc" stroke-linecap="round" filter="url(#glow)">${marks}</g>
    <circle cx="${cx}" cy="${cy}" r="150" fill="#030205"/>
    <circle cx="${cx}" cy="${cy}" r="151" fill="none" stroke="#ffe6c0" stroke-width="6" filter="url(#glow)"/>
    <circle cx="${sx}" cy="${sy}" r="16" fill="#fff" filter="url(#glow)"/>
    <path d="M0 512 L0 452 ${stakes}L512 452 L512 512 Z" fill="#050205"/>
    <path d="M372 452 L378 372 L370 372 L370 362 L414 362 L414 372 L406 372 L412 452 Z M362 364 L392 336 L422 364 Z" fill="#050205"/>
    <rect x="384" y="374" width="16" height="10" fill="#ffd60a" filter="url(#glow)"/>
  </g>
</svg>
`;
}

const files = {
  'eclipse.svg': eclipse(96, true), // coins arrondis : site, présentations
  'eclipse-square.svg': eclipse(0, true), // plein cadre : Discord, Apple, réseaux qui arrondissent eux-mêmes
  'eclipse-clean.svg': eclipse(0, false), // sans vignettage ni grain : base des visuels composés
  'favicon.svg': favicon(),
};
for (const [name, content] of Object.entries(files)) writeFileSync(join(SVG, name), content);

/* ───────────── Visuels composés (HTML → PNG) ───────────── */

const art = '../svg/eclipse-clean.svg';
const fonts = '<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&display=block" rel="stylesheet">';
const base = (w, h, extraCss, body) => `<!doctype html>
<html lang="fr"><head><meta charset="utf-8">${fonts}<style>
  html, body { margin: 0; width: ${w}px; height: ${h}px; overflow: hidden; background: #040208; }
  .stage { position: relative; width: ${w}px; height: ${h}px; overflow: hidden; }
  .stage > * { position: absolute; }
  .vignette { inset: 0; background: radial-gradient(ellipse at 60% 45%, transparent 55%, rgba(0,0,0,.7)); }
  .title { font-family: Cinzel, 'Palatino Linotype', Georgia, serif; font-weight: 800; color: #f6e7cf; letter-spacing: .08em; line-height: .95; margin: 0;
           text-shadow: 0 0 18px rgba(255, 70, 50, .55), 0 2px 0 #000; }
  .title span { display: block; color: #ff4632; text-shadow: 0 0 24px rgba(255, 50, 40, .8), 0 2px 0 #000; }
  .tag { font-family: Cinzel, 'Palatino Linotype', Georgia, serif; font-weight: 600; color: #e9c9a6; letter-spacing: .06em; margin: 0; text-shadow: 0 2px 6px #000; }
  ${extraCss}
</style></head><body><div class="stage">${body}<div class="vignette"></div></div></body></html>
`;

// Prolonge le décor vers la gauche (ciel, collines, sol) pour raccorder sans couture avec l'illustration carrée
// units : largeur du panneau ; seam : abscisse (même repère) où commence l'illustration
function sidePanel(units, seam) {
  let far = '', near = '';
  for (let x = 0; x <= units; x += 4) {
    const d = x - seam;
    far += ` L${x} ${(378.2 + 6 * Math.sin(d / 37)).toFixed(1)}`;
    near += ` L${x} ${(402 + 5 * Math.sin(d / 45)).toFixed(1)}`;
  }
  return `<svg viewBox="0 0 ${units} 512" preserveAspectRatio="none" style="height:100%;width:100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#040208"/><stop offset="0.5" stop-color="#1d0612"/><stop offset="0.78" stop-color="#6a0f1c"/><stop offset="0.9" stop-color="#b8321a"/></linearGradient>
      <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd0b0" stop-opacity="0"/><stop offset="0.6" stop-color="#ffd0b0" stop-opacity="0.12"/><stop offset="1" stop-color="#ffd0b0" stop-opacity="0"/></linearGradient>
      <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0.75"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
    </defs>
    <rect width="${units}" height="512" fill="url(#sky)"/>
    <path d="M0 512${far} L${units} 512 Z" fill="#33070f"/>
    <path d="M0 512${near} L${units} 512 Z" fill="#14040a"/>
    <rect y="372" width="${units}" height="80" fill="url(#mist)"/>
    <path d="M0 512 L0 ${478} Q${units / 2} 474 ${units} 478 L${units} 512 Z" fill="#050205"/>
    <rect width="${seam}" height="512" fill="url(#shade)"/>
  </svg>`;
}

// Format paysage : décor prolongé à gauche avec le titre, illustration carrée à droite
const landscape = (w, h, titleSize) => {
  const panel = w - h;
  // Le panneau passe sous la zone où l'illustration apparaît en fondu, sinon le fond noir transparaît
  const fade = Math.round(h * 0.12);
  return base(w, h, `
    .panel { left: 0; top: 0; width: ${panel + fade}px; height: ${h}px; }
    .art { right: 0; top: 0; width: ${h}px; height: ${h}px; -webkit-mask-image: linear-gradient(to right, transparent, #000 12%); mask-image: linear-gradient(to right, transparent, #000 12%); }
    .text { left: ${Math.round(h * 0.09)}px; top: 50%; transform: translateY(-58%); }
    .title { font-size: ${titleSize}px; }
    .title span { font-size: ${Math.round(titleSize * 1.45)}px; }
    .tag { font-size: ${Math.round(titleSize * 0.36)}px; margin-top: ${Math.round(titleSize * 0.4)}px; max-width: ${panel}px; }`,
  `<div class="panel">${sidePanel(((panel + fade) * 512) / h, (panel * 512) / h)}</div>
   <img class="art" src="${art}">
   <div class="text"><h1 class="title">The Black<span>Hour</span></h1><p class="tag">Chaque nuit, la horde revient.<br>Tiendras-tu jusqu’à l’aube&nbsp;?</p></div>`);
};

const sources = {
  'ad-landscape-1200x630.html': [1200, 630, landscape(1200, 630, 64)],
  'discord-banner-960x540.html': [960, 540, landscape(960, 540, 52)],
  'ad-square-1080.html': [1080, 1080, base(1080, 1080, `
    .art { inset: 0; width: 100%; height: 100%; }
    .shade { inset: 0 0 auto 0; height: 34%; background: linear-gradient(#000c, transparent); }
    .text { top: 46px; width: 100%; text-align: center; }
    .title { font-size: 70px; }
    .title span { display: inline; font-size: 70px; }
    .tag { bottom: 26px; width: 100%; text-align: center; font-size: 30px; }`,
    `<img class="art" src="${art}"><div class="shade"></div>
     <div class="text"><h1 class="title">The Black <span>Hour</span></h1></div>
     <p class="tag">Chaque nuit, la horde revient.</p>`)],
  'ad-story-1080x1920.html': [1080, 1920, base(1080, 1920, `
    .sky { inset: 0; background: linear-gradient(#000 0%, #040208 44%); }
    .art { left: 0; bottom: 0; width: 1080px; height: 1080px; }
    .text { top: 300px; width: 100%; text-align: center; }
    .title { font-size: 110px; }
    .title span { font-size: 170px; }
    .tag { font-size: 40px; margin-top: 56px; }`,
    `<div class="sky"></div><img class="art" src="${art}">
     <div class="text"><h1 class="title">The Black<span>Hour</span></h1><p class="tag">Chaque nuit, la horde revient.<br>Tiendras-tu jusqu’à l’aube&nbsp;?</p></div>`)],
};
for (const [name, [, , html]] of Object.entries(sources)) writeFileSync(join(SOURCES, name), html);

/* ───────────── Rendu PNG ───────────── */

const tmp = mkdtempSync(join(tmpdir(), 'tbh-eclipse-'));
function render(htmlFile, w, h, out) {
  execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--default-background-color=00000000',
    '--virtual-time-budget=8000', `--window-size=${w},${h}`, `--screenshot=${join(PNG, out)}`,
    pathToFileURL(htmlFile).href,
  ], { stdio: 'ignore' });
}
// Icône seule à une taille donnée, fond transparent (les coins arrondis restent transparents)
function renderIcon(svgName, size, out) {
  const html = join(tmp, `${out}.html`);
  writeFileSync(html, `<!doctype html><html><body style="margin:0;background:transparent"><img src="${pathToFileURL(join(SVG, svgName)).href}" style="display:block;width:${size}px;height:${size}px"></body></html>`);
  render(html, size, size, out);
}

const icons = [
  ['favicon.svg', 16, 'favicon-16.png'],
  ['favicon.svg', 32, 'favicon-32.png'],
  ['favicon.svg', 48, 'favicon-48.png'],
  ['favicon.svg', 64, 'favicon-64.png'],
  ['eclipse-square.svg', 180, 'apple-touch-icon-180.png'],
  ['eclipse.svg', 192, 'icon-192.png'],
  ['eclipse.svg', 512, 'icon-512.png'],
  ['eclipse.svg', 1024, 'icon-1024.png'],
  ['eclipse-square.svg', 1024, 'icon-square-1024.png'],
  ['eclipse-square.svg', 512, 'discord-icon-512.png'],
];
for (const [svgName, size, out] of icons) renderIcon(svgName, size, out);
for (const [name, [w, h]] of Object.entries(sources)) render(join(SOURCES, name), w, h, name.replace('.html', '.png'));
rmSync(tmp, { recursive: true, force: true });

// favicon.ico : PNG 16, 32 et 48 empaquetés (format ICO à entrées PNG)
const icoSizes = [16, 32, 48];
const pngs = icoSizes.map((s) => readFileSync(join(PNG, `favicon-${s}.png`)));
const header = Buffer.alloc(6 + 16 * pngs.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(pngs.length, 4);
let offset = header.length;
pngs.forEach((png, i) => {
  const e = 6 + 16 * i;
  header.writeUInt8(icoSizes[i], e);
  header.writeUInt8(icoSizes[i], e + 1);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(png.length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += png.length;
});
writeFileSync(join(PNG, 'favicon.ico'), Buffer.concat([header, ...pngs]));

console.log('OK', ROOT);
