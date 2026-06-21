// ===========================================================================
// scripts/export-pdf.mjs  ·  Verificación local del PDF (sin Vercel)
//
// Usa el Chrome del sistema (no @sparticuz/chromium) para rendear el deck que
// sirve `python3 -m http.server` y escribir un PDF idéntico a la web. Mismo
// flujo que api/pdf.js: ?print-pdf + espera de window.__deckPrintReady.
//
// Uso:
//   python3 scripts/build.py
//   python3 -m http.server 8753
//   node scripts/export-pdf.mjs --theme="Mostaza claro" --typeset="Corporativo"
//
// Flags: --theme, --typeset, --base (def http://localhost:8753), --out
// ===========================================================================
import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';

function arg(name, def) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : def;
}

const theme = arg('theme', 'Mostaza claro');
const typeset = arg('typeset', 'Corporativo');
const base = arg('base', 'http://localhost:8753');
const out = arg('out', 'Escalamiento-Conpro.pdf');

// Chrome del sistema (macOS / Linux / Windows habituales).
const CANDIDATES = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
];
const executablePath = process.env.CHROME_PATH || CANDIDATES.find((p) => existsSync(p));
if (!executablePath) {
  console.error('No encontré Chrome. Definí CHROME_PATH=/ruta/al/chrome y reintentá.');
  process.exit(1);
}

const url = `${base}/index.html?print-pdf`
  + `&theme=${encodeURIComponent(theme)}&typeset=${encodeURIComponent(typeset)}`;

console.log(`[export-pdf] ${url}`);
const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  defaultViewport: { width: 1920, height: 1080 },
  args: ['--no-sandbox'],
});
try {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 45000 });
  await page.waitForFunction('window.__deckPrintReady === true', { timeout: 45000 });
  // Esperas en el lado Node (timers confiables): fuentes + asentado de los
  // gráficos (animación Chart.js ~600ms) antes de capturar.
  await page.evaluate(() => (document.fonts && document.fonts.ready) ? document.fonts.ready : null);
  await new Promise((r) => setTimeout(r, 900));
  await page.pdf({
    path: out,
    width: '1920px',
    height: '1080px',
    printBackground: true,
    preferCSSPageSize: true,
  });
  console.log(`[export-pdf] ✔ ${out}  (tema: ${theme} · tipografía: ${typeset})`);
} finally {
  await browser.close();
}
