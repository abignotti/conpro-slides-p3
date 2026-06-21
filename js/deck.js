/* ============================================================
   Conpro · Deck runtime (reveal.js)
   - Init reveal 1920×1080 (escala todo el lienzo con transform).
   - Selector: tema (data-theme) · tipografía (data-typeset) ·
     chrome (data-chrome en el .reveal).
   - Conteo ascendente del dato hero (--count-duration, es-CL).
   - Init perezoso de los gráficos Chart.js (moldes 7, 8, 14).
   - Íconos Lucide (molde 22) que heredan el color del tema.
   ============================================================ */

const THEMES = ['Mostaza claro', 'Mostaza oscuro', 'Crema editorial', 'Grafito mono',
  'Cobalto', 'Ácido', 'Fucsia', 'Naranja brutal', 'Klein'];
const TYPESETS = ['Editorial', 'Clásico', 'Moderno', 'Geométrico', 'Impacto', 'Mono', 'Corporativo'];
const CHROMES = ['completo', 'minimo', 'limpio'];

/* ---- Configs de los gráficos, por id de canvas ---------------------- */
const CHART_CONFIGS = {
  'chart-barras': (cv) => Charts.bar(cv, {
    labels: ['Escala actual', '×3', '×6', '×12'],
    data: [18, 46, 95, 182],
    keyIndex: 3, yMax: 200, yStep: 50, yTitle: 'M$', valueLabel: true,
  }),
  'chart-lineas': (cv) => Charts.line(cv, {
    labels: ['Año 1', 'Año 2', 'Año 3', 'Año 4', 'Año 5', 'Año 6'],
    yMax: 300, yStep: 100,
    series: [
      { label: 'Optimista', role: 'key', data: [5, 20, 51, 106, 186, 283] },
      { label: 'Base', role: 'base', data: [5, 16, 37, 69, 106, 145] },
      { label: 'Pesimista', role: 'negative', data: [5, 17, 25, 39, 54, 69] },
    ],
  }),
  'chart-combo': (cv) => Charts.bar(cv, {
    labels: ['Pesim.', 'Base', 'Optim.'],
    data: [8.1, 16.4, 23.7],
    keyIndex: 1, yMax: 24, yStep: 8,
    threshold: 12, thresholdLabel: 'Exigido 12%',
  }),

  // --- Deck real (presentacion/) ---
  // TODO Fase 3: con varios gráficos por molde reutilizado, volver esto
  // data-driven (id único por slide) en vez de un map fijo por id.
  'chart-esperar': (cv) => Charts.bar(cv, {
    labels: ['Ahora', 'Esperar 1 año', 'Esperar 2 años', 'Esperar 3 años'],
    data: [2.39, 4.07, 5.66, 6.11],
    keyIndex: 3, yMax: 7, yStep: 1, yTitle: 'VAN al presente (M$)', valueLabel: true,
  }),
  // TODO datos: curva de ingreso bruto (placeholder). Base: 60 hogares -> ~$37 MM al año 5 (diálogo).
  'chart-demanda': (cv) => Charts.bar(cv, {
    labels: ['Año 1', 'Año 2', 'Año 3', 'Año 4', 'Año 5'],
    data: [60, 93, 122, 143, 161],
    keyIndex: 4, yMax: 180, yStep: 60, yTitle: 'Hogares', valueLabel: true,
  }),
  // Ingresos (CLP) según hogares atendidos. Eje X = hogares; valueLabel usa
  // fmtNum (es-CL: separador de miles con punto) -> "$37.374.912" vía valueLabelPrefix.
  'chart-ingresos': (cv) => Charts.bar(cv, {
    labels: ['60', '93', '122', '143', '161'],
    data: [13895145, 21493276, 28154459, 33063850, 37374912],
    keyIndex: 4, yMax: 40000000, yStep: 10000000, yTitle: 'Ingresos (CLP)', valueLabel: true,
  }),
  // TODO datos: ganancia anual años 1-5 (placeholder, falta en el informe leído).
  'chart-ganancias': (cv) => Charts.bar(cv, {
    labels: ['Año 1', 'Año 2', 'Año 3', 'Año 4', 'Año 5'],
    data: [0.5, 1.6, 2.8, 3.9, 5.0],
    keyIndex: 4, yMax: 6, yStep: 2, yTitle: 'Ganancia (M$)', valueLabel: true,
  }),
  // TODO datos: magnitudes del tornado (placeholder). Orden e ingreso/hogar+fuga sí son del informe.
  'chart-tornado': (cv) => Charts.barH(cv, {
    labels: ['Ingreso por hogar', 'Tasa de fuga', 'Adopción', 'Nivel de interés', 'WACC'],
    data: [4.5, 3.8, 2.4, 1.6, 1.1],
    accentIndices: [0, 1], xMax: 5, xStep: 1, xTitle: 'Impacto en el VAN (M$)',
  }),
  'chart-margenes': (cv) => Charts.bar(cv, {
    labels: ['Café', 'Vino', 'Aceite'],
    data: [6.2, 5.2, 1.2],
    keyIndex: 0, yMax: 8, yStep: 2, yTitle: 'ΔVAN (M$)', valueLabel: true,
  }),
  // TODO datos: precios exactos del Informe 3 (Ilustración 1). Valores aprox.
  'chart-precios': (cv) => Charts.barGroup(cv, {
    labels: ['Huevos', 'Café', 'Aceite', 'Miel', 'Queso'],
    yMax: 70000, yStep: 20000, yTitle: 'CLP',
    series: [
      { label: 'Mínimo mercado', role: 'muted', data: [9000, 28700, 61000, 7000, 12600] },
      { label: 'Conpro', role: 'key', data: [9490, 29670, 34990, 6990, 10573] },
      { label: 'Máximo mercado', role: 'base', data: [11990, 58000, 67776, 13000, 14990] },
    ],
  }),
};

/* ---- Selector de previsualización ----------------------------------- */
function buildPicker() {
  const root = document.documentElement;
  const reveal = document.querySelector('.reveal');
  const picker = document.createElement('div');
  picker.className = 'theme-picker';

  const mk = (labelText, options, get, set) => {
    const wrap = document.createElement('label');
    wrap.textContent = labelText;
    const sel = document.createElement('select');
    options.forEach((o) => {
      const opt = document.createElement('option');
      opt.value = o; opt.textContent = o.charAt(0).toUpperCase() + o.slice(1);
      sel.appendChild(opt);
    });
    sel.value = get();
    sel.addEventListener('change', () => {
      set(sel.value);
      if (window.Charts) Charts.refreshAll();
      const cur = (window.Reveal && Reveal.getCurrentSlide) ? Reveal.getCurrentSlide() : null;
      setViewportBg(cur);
      requestAnimationFrame(() => fitSlide(cur));
      setTimeout(() => fitSlide(cur), 250);
    });
    wrap.appendChild(sel);
    return wrap;
  };

  picker.appendChild(mk('Tema', THEMES,
    () => root.getAttribute('data-theme') || THEMES[0],
    (v) => root.setAttribute('data-theme', v)));
  picker.appendChild(mk('Tipografía', TYPESETS,
    () => root.getAttribute('data-typeset') || TYPESETS[0],
    (v) => root.setAttribute('data-typeset', v)));
  picker.appendChild(mk('Chrome', CHROMES,
    () => reveal.getAttribute('data-chrome') || 'completo',
    (v) => reveal.setAttribute('data-chrome', v)));

  // Botón de pantalla completa (además de la tecla F nativa de reveal).
  const fsBtn = document.createElement('button');
  fsBtn.className = 'pk-btn';
  fsBtn.type = 'button';
  fsBtn.innerHTML = '⛶ Pantalla completa';
  fsBtn.addEventListener('click', () => {
    const el = document.documentElement;
    if (!document.fullscreenElement) (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
    else (document.exitFullscreen || document.webkitExitFullscreen).call(document);
  });
  picker.appendChild(fsBtn);

  // Botón de PDF retirado temporalmente: el export ?print-pdf se ve mal.
  // Reactivar cuando se arregle (ver docs/devlog.md y memoria de pendientes).

  const hint = document.createElement('span');
  hint.className = 'hint';
  hint.textContent = 'Tecla T: ocultar';
  picker.appendChild(hint);

  document.body.appendChild(picker);
  document.addEventListener('keydown', (e) => {
    if (e.key === 't' || e.key === 'T') picker.classList.toggle('is-hidden');
  });
}

/* ---- Conteo ascendente del dato hero -------------------------------- */
const fmtCL = new Intl.NumberFormat('es-CL');
function animateHero(el) {
  if (!el || el.dataset.counted) return;
  const original = el.textContent;
  const target = parseInt(original.replace(/\D/g, ''), 10);
  if (!Number.isFinite(target) || target === 0) return;
  const prefix = original.trim().startsWith('$') ? '$' : '';
  const dur = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--count-duration')) || 1200;
  el.dataset.counted = '1';
  const t0 = performance.now();
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  function frame(now) {
    const p = Math.min(1, (now - t0) / dur);
    el.textContent = prefix + fmtCL.format(Math.round(target * ease(p)));
    if (p < 1) requestAnimationFrame(frame);
    else el.textContent = original; // restaura el formato exacto
  }
  requestAnimationFrame(frame);
}
function heroOnSlide(slide) {
  if (slide) slide.querySelectorAll('[data-hero]').forEach(animateHero);
}

/* ---- Init perezoso de gráficos (Chart.js necesita dimensiones) ------ */
function initChartsIn(slide) {
  if (!slide || !window.Charts) return;
  slide.querySelectorAll('canvas[id]').forEach((cv) => {
    if (cv.dataset.inited || !CHART_CONFIGS[cv.id]) return;
    cv.dataset.inited = '1';
    Charts.register(cv, CHART_CONFIGS[cv.id]);
  });
}

/* ---- Guarda de ajuste vertical -------------------------------------- *
   Si el cuerpo de una slide excede su región (contenido > 1080), lo
   escala hacia abajo para que quepa — header/pie quedan fijos. Solo
   reduce, nunca agranda. Protege el molde 4 y el contenido real futuro. */
function fitSlide(slide) {
  if (!slide) return;
  const body = slide.querySelector(':scope > div');
  if (!body) return;
  body.style.transform = '';
  body.style.transformOrigin = 'center top';
  const region = body.clientHeight;
  const content = body.scrollHeight;
  if (content > region + 2) {
    const k = Math.max(0.75, region / content);
    body.style.transform = `scale(${k})`;
  }
}

/* ---- Numeración automática del slide (arriba-derecha) --------------- *
   El número de página NO se hardcodea en los partials: se calcula acá según
   la posición real del slide en el deck. Así, agregar/quitar/reordenar slides
   nunca exige renumerar a mano. Elemento objetivo: [data-page] o, en su
   defecto, el <span> del header cuyo texto sea "N / N" (el placeholder).
   Slides sin ese elemento (portada, demo a pantalla completa) quedan sin
   número impreso, pero igual cuentan para la posición. El total se omite. */
function numberSlides() {
  document.querySelectorAll('section.slide').forEach((slide, i) => {
    let el = slide.querySelector('[data-page]');
    if (!el) {
      const header = slide.querySelector('[data-chrome="header"]');
      if (header) el = [...header.querySelectorAll('span')]
        .find((s) => /^\s*\d+\s*\/\s*\d+\s*$/.test(s.textContent));
    }
    if (el) el.textContent = String(i + 1).padStart(2, '0');
  });
}

/* ---- Fondo del letterbox = fondo del slide actual ------------------- *
   Algunas slides usan --color-bg-alt (portada, cita, divisor). Para que
   las bandas laterales nunca se noten, el viewport copia el fondo real
   del slide visible (cambia con el tema y con cada slide). */
function setViewportBg(slide) {
  if (!slide) return;
  const bg = getComputedStyle(slide).backgroundColor;
  const vp = document.querySelector('.reveal-viewport');
  if (vp) vp.style.background = bg;
  document.documentElement.style.background = bg;
}

/* ---- Íconos Lucide -------------------------------------------------- */
function drawIcons() {
  if (window.lucide && window.lucide.createIcons) {
    try { window.lucide.createIcons(); } catch (e) {}
  }
}

/* ---- Init ----------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const isPrint = location.search.includes('print-pdf');
  if (!isPrint) buildPicker();   // sin selector en el PDF
  Reveal.initialize({
    width: 1920, height: 1080, margin: 0,
    minScale: 0.1, maxScale: 2,
    center: false, hash: true,
    // reveal escribe este display inline al mostrar cada slide; 'flex'
    // (en vez del 'block' por defecto) preserva el layout vertical de
    // .slide (contenido centrado + pie abajo en cada lienzo de 1080).
    display: 'flex',
    transition: 'fade', controls: true, progress: true,
  });
  const onSlide = (slide) => {
    heroOnSlide(slide); initChartsIn(slide); drawIcons(); setViewportBg(slide);
    // tras render de fuentes/gráficos, ajustar si desborda
    requestAnimationFrame(() => fitSlide(slide));
    setTimeout(() => fitSlide(slide), 450);
  };
  Reveal.on('ready', (e) => {
    numberSlides();   // numera por posición real (no se hardcodea en partials)
    if (isPrint) {
      // PDF: todas las slides están apiladas y visibles → inicializar
      // gráficos y ajustar TODAS (no solo la actual), sin animar el hero.
      document.querySelectorAll('section.slide').forEach((s) => { initChartsIn(s); fitSlide(s); });
      drawIcons(); setTimeout(drawIcons, 400);
      setTimeout(() => window.print(), 1300);
    } else {
      onSlide(e.currentSlide); setTimeout(drawIcons, 400);
    }
  });
  Reveal.on('slidechanged', (e) => { if (!isPrint) onSlide(e.currentSlide); });
});
