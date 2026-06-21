// ===========================================================================
// /api/pdf  ·  Render headless del deck → PDF idéntico a la web
//
// Abre el propio deck desplegado con ?print-pdf&theme=…&typeset=… en Chromium
// headless, espera la señal window.__deckPrintReady (fuentes + gráficos +
// layout asentados) y devuelve page.pdf() a 1920×1080 (un slide por página,
// texto vectorial, fondos del tema). Pensado para el plan gratuito de Vercel:
// ver vercel.json (maxDuration 60, memory 1024).
// ===========================================================================
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

// Allowlists (espejo de js/deck.js): nunca aceptar valores arbitrarios.
const THEMES = ['Mostaza claro', 'Mostaza oscuro', 'Crema editorial', 'Grafito mono',
  'Cobalto', 'Ácido', 'Fucsia', 'Naranja brutal', 'Klein'];
const TYPESETS = ['Editorial', 'Clásico', 'Moderno', 'Geométrico', 'Impacto', 'Mono', 'Corporativo'];

export default async function handler(req, res) {
  const q = req.query || {};
  const theme = THEMES.includes(q.theme) ? q.theme : 'Mostaza claro';
  const typeset = TYPESETS.includes(q.typeset) ? q.typeset : 'Corporativo';
  // Slides a excluir del PDF: data-sid separados por coma. Se sanea a tokens
  // tipo slug (espejo del formato que inyecta build.py) para no propagar basura.
  const hidden = String(q.hidden || '')
    .split(',').map((s) => s.trim())
    .filter((s) => /^[a-z0-9-]+$/i.test(s));

  // URL absoluta del propio deployment (prod, preview o `vercel dev`).
  const host = req.headers['x-forwarded-host'] || req.headers.host || process.env.VERCEL_URL;
  if (!host) {
    res.status(500).json({ error: 'No se pudo resolver el host del deployment.' });
    return;
  }
  const proto = req.headers['x-forwarded-proto']
    || (/^(localhost|127\.)/.test(host) ? 'http' : 'https');
  let url = `${proto}://${host}/index.html?print-pdf`
    + `&theme=${encodeURIComponent(theme)}&typeset=${encodeURIComponent(typeset)}`;
  if (hidden.length) url += `&hidden=${encodeURIComponent(hidden.join(','))}`;

  let browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1920, height: 1080 },
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    // Si el deployment está protegido (Vercel Authentication), la función no
    // hereda la sesión del navegador del usuario: al pedir su PROPIA URL recibe
    // el muro de SSO en vez del deck. Con "Protection Bypass for Automation"
    // activado, Vercel expone VERCEL_AUTOMATION_BYPASS_SECRET; lo mandamos como
    // header en CADA request (documento + subrecursos same-origin: css/js/assets)
    // para que la función pueda leer el deck. Si no está, no se manda (inerte).
    const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
    if (bypass) await page.setExtraHTTPHeaders({ 'x-vercel-protection-bypass': bypass });
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 45000 });
    await page.waitForFunction('window.__deckPrintReady === true', { timeout: 45000 });
    // Esperas en el lado Node (timers confiables): fuentes + asentado de los
    // gráficos (animación Chart.js ~600ms) antes de capturar.
    await page.evaluate(() => (document.fonts && document.fonts.ready) ? document.fonts.ready : null);
    await new Promise((r) => setTimeout(r, 900));

    const pdf = await page.pdf({
      width: '1920px',
      height: '1080px',
      printBackground: true,
      preferCSSPageSize: true,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Escalamiento-Conpro.pdf"');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(Buffer.from(pdf));
  } catch (err) {
    console.error('[api/pdf]', err);
    res.status(500).json({ error: 'No se pudo generar el PDF.', detail: String(err && err.message || err) });
  } finally {
    if (browser) await browser.close();
  }
}
