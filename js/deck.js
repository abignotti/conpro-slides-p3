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

/* ---- Visibilidad de slides (ocultar/mostrar en vivo) ----------------- *
   Una slide se oculta SACÁNDOLA del DOM (no con data-visibility: reveal 5.1 no
   excluye ese atributo de la navegación). Al quitarla/reinsertarla se llama
   Reveal.sync(), que recalcula total, navegación y barra de progreso. El estado
   se persiste en localStorage por data-sid (ID estable que inyecta build.py) y
   se reenvía al render del PDF vía URL.
   - SLIDE_ORDER: orden canónico (todas las slides, incl. ocultas) capturado al
     cargar, para reinsertar cada una en su posición original.
   - "oculta" == !el.isConnected (desconectada del DOM). */
const HIDE_KEY = 'conpro-hidden-slides';
let SLIDE_ORDER = [];          // [{ sid, el }] en orden de documento
let slidesParent = null;

function loadHidden() {
  try {
    const arr = JSON.parse(localStorage.getItem(HIDE_KEY) || '[]');
    return new Set(Array.isArray(arr) ? arr : []);
  } catch (e) { return new Set(); }
}
function saveHidden(set) {
  try { localStorage.setItem(HIDE_KEY, JSON.stringify([...set])); } catch (e) {}
}
function sidOf(section) { return section.getAttribute('data-sid') || ''; }

function captureSlides() {
  slidesParent = document.querySelector('.reveal .slides');
  SLIDE_ORDER = [...document.querySelectorAll('section.slide')]
    .map((el) => ({ sid: sidOf(el), el }));
}
function hideSlideEl(el) { if (el.isConnected) el.remove(); }
function showSlideEl(el) {
  if (el.isConnected || !slidesParent) return;
  const i = SLIDE_ORDER.findIndex((o) => o.el === el);
  let ref = null;                 // reinsertar antes de la 1ª slide posterior visible
  for (let j = i + 1; j < SLIDE_ORDER.length && !ref; j++) {
    if (SLIDE_ORDER[j].el.isConnected) ref = SLIDE_ORDER[j].el;
  }
  slidesParent.insertBefore(el, ref);   // ref null => al final
}

/* Aplica el estado oculto ANTES de Reveal.initialize() (las ocultas ni llegan a
   inicializarse). En modo print lee el set de ?hidden=sid,sid; si no, de
   localStorage. Requiere captureSlides() previo. */
function applyInitialHidden(isPrint, params) {
  const sids = isPrint
    ? new Set((params.get('hidden') || '').split(',').map((s) => s.trim()).filter(Boolean))
    : loadHidden();
  if (!sids.size) return;
  SLIDE_ORDER.forEach((o) => { if (sids.has(o.sid)) hideSlideEl(o.el); });
}

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
  // VAN por escenario (M$). Conservador (keyIndex 1) en acento. Sin TIR.
  'chart-van': (cv) => Charts.bar(cv, {
    labels: ['Pesimista', 'Conservador', 'Optimista'],
    data: [1.12, 2.39, 3.97],
    keyIndex: 1, yMax: 4.5, yStep: 1, yTitle: 'VAN (M$)', valueLabel: true, valueLabelAll: true,
    valueLabelFmt: (v) => '$' + v.toLocaleString('es-CL') + ' M', stagger: true,
  }),
  // TODO datos: curva de ingreso bruto (placeholder). Base: 60 hogares -> ~$37 MM al año 5 (diálogo).
  // Barras con rampa de opacidad (clara año 1 -> opaca año 5), número sobre
  // cada barra y aparición escalonada desde la base (año 1 -> año 5).
  'chart-demanda': (cv) => Charts.bar(cv, {
    labels: ['Año 1', 'Año 2', 'Año 3', 'Año 4', 'Año 5'],
    data: [60, 93, 122, 143, 161],
    yMax: 180, yStep: 60, yTitle: 'Hogares', valueLabel: true, valueLabelAll: true,
    colorRamp: true, stagger: true,
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

/* ---- Panel de visibilidad de slides --------------------------------- *
   Lista todas las slides (número + título) con un botón "ojo" por fila para
   ocultarlas/mostrarlas en vivo. Devuelve { panel, render } para que el picker
   lo enganche (toggle de apertura) y la tecla T lo oculte junto con el chrome. */
function buildSlideManager() {
  const panel = document.createElement('div');
  panel.className = 'slide-manager';
  const title = document.createElement('div');
  title.className = 'sm-title';
  title.textContent = 'Slides — ocultar / mostrar';
  const list = document.createElement('div');
  list.className = 'sm-list';
  panel.appendChild(title);
  panel.appendChild(list);
  document.body.appendChild(panel);

  const titleOf = (s) => {
    const h = s.querySelector('h1, h2');
    if (h && h.textContent.trim()) return h.textContent.trim();
    return s.getAttribute('data-label') || sidOf(s) || 'Slide';
  };

  function toggleSlide(section) {
    const set = loadHidden();
    const sid = sidOf(section);
    const willHide = section.isConnected;

    // Si voy a ocultar la slide actual, primero navego a una visible adyacente
    // (mientras sigue en el DOM y los índices son válidos).
    if (willHide && window.Reveal && Reveal.getCurrentSlide() === section) {
      const i = SLIDE_ORDER.findIndex((o) => o.el === section);
      let target = null;
      for (let j = i + 1; j < SLIDE_ORDER.length && !target; j++) if (SLIDE_ORDER[j].el.isConnected) target = SLIDE_ORDER[j].el;
      for (let j = i - 1; j >= 0 && !target; j--) if (SLIDE_ORDER[j].el.isConnected) target = SLIDE_ORDER[j].el;
      if (target) { const idx = Reveal.getIndices(target); Reveal.slide(idx.h, idx.v); }
    }

    if (willHide) { hideSlideEl(section); if (sid) set.add(sid); }
    else { showSlideEl(section); if (sid) set.delete(sid); }
    saveHidden(set);

    if (window.Reveal) { Reveal.sync(); Reveal.layout(); }
    numberSlides();
    render();
  }

  function render() {
    list.innerHTML = '';
    let n = 0;
    SLIDE_ORDER.forEach(({ el }) => {
      const hidden = !el.isConnected;
      if (!hidden) n += 1;
      const row = document.createElement('div');
      row.className = 'sm-row' + (hidden ? ' is-off' : '');

      const eye = document.createElement('button');
      eye.className = 'sm-eye';
      eye.type = 'button';
      eye.title = hidden ? 'Mostrar slide' : 'Ocultar slide';
      eye.textContent = hidden ? '🚫' : '👁';
      eye.addEventListener('click', (ev) => { ev.stopPropagation(); toggleSlide(el); });

      const num = document.createElement('span');
      num.className = 'sm-num';
      num.textContent = hidden ? '—' : String(n).padStart(2, '0');

      const label = document.createElement('span');
      label.className = 'sm-label';
      label.textContent = titleOf(el);

      row.appendChild(eye);
      row.appendChild(num);
      row.appendChild(label);
      // Click en la fila (no en el ojo) → navegar a esa slide, si está visible.
      row.addEventListener('click', () => {
        if (!el.isConnected || !window.Reveal) return;
        const idx = Reveal.getIndices(el);
        if (idx) Reveal.slide(idx.h, idx.v);
      });
      list.appendChild(row);
    });
  }

  return { panel, render };
}

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

  // Botón de descarga PDF: pide a la función serverless /api/pdf un render
  // headless (Chromium) del deck con el tema/tipografía ACTUALES, y descarga
  // el archivo. El render tarda unos segundos (cold start incluido), por eso
  // el botón muestra "Generando…" mientras espera.
  const pdfBtn = document.createElement('button');
  pdfBtn.className = 'pk-btn';
  pdfBtn.type = 'button';
  pdfBtn.innerHTML = '⤓ Descargar PDF';
  pdfBtn.addEventListener('click', async () => {
    if (pdfBtn.disabled) return;
    const label = pdfBtn.innerHTML;
    pdfBtn.disabled = true;
    pdfBtn.innerHTML = '⏳ Generando…';
    const theme = root.getAttribute('data-theme') || THEMES[0];
    const typeset = root.getAttribute('data-typeset') || TYPESETS[0];
    // Las slides ocultas también se excluyen del PDF: se reenvían sus data-sid.
    const hiddenSids = SLIDE_ORDER.filter((o) => !o.el.isConnected).map((o) => o.sid).filter(Boolean);
    let url = `/api/pdf?theme=${encodeURIComponent(theme)}&typeset=${encodeURIComponent(typeset)}`;
    if (hiddenSids.length) url += `&hidden=${encodeURIComponent(hiddenSids.join(','))}`;
    try {
      const res = await fetch(url);
      // 404 = la función serverless /api/pdf no existe en este server. Pasa con
      // el server estático local (python3 -m http.server): el PDF SOLO se genera
      // en Vercel (deploy o `vercel dev`). Para exportar localmente sin Vercel,
      // usar `node scripts/export-pdf.mjs`.
      if (res.status === 404) throw new Error('PDF_NO_API');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = 'Escalamiento-Conpro.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(href), 4000);
    } catch (err) {
      console.error('[PDF]', err);
      alert(err && err.message === 'PDF_NO_API'
        ? 'El export PDF necesita el entorno Vercel (deploy o `vercel dev`); no funciona con el server estático local.'
        : 'No se pudo generar el PDF. Revisa la consola.');
    } finally {
      pdfBtn.disabled = false;
      pdfBtn.innerHTML = label;
    }
  });
  picker.appendChild(pdfBtn);

  // Panel de visibilidad de slides + botón que lo abre/cierra.
  const mgr = buildSlideManager();
  const slidesBtn = document.createElement('button');
  slidesBtn.className = 'pk-btn';
  slidesBtn.type = 'button';
  slidesBtn.innerHTML = '☰ Slides';
  slidesBtn.addEventListener('click', () => {
    const open = mgr.panel.classList.toggle('open');
    if (open) mgr.render();
  });
  picker.appendChild(slidesBtn);

  const hint = document.createElement('span');
  hint.className = 'hint';
  hint.textContent = 'Tecla T: ocultar';
  picker.appendChild(hint);

  document.body.appendChild(picker);
  document.addEventListener('keydown', (e) => {
    if (e.key === 't' || e.key === 'T') {
      picker.classList.toggle('is-hidden');
      mgr.panel.classList.toggle('is-hidden');   // el panel se oculta junto al chrome
    }
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

/* ---- Navegación con flechas dentro de iframes (demo) ---------------- *
   Un iframe con foco captura el teclado, así que reveal.js deja de recibir
   las flechas y no se puede pasar de slide mientras se interactúa con el
   demo. Como el iframe es same-origin, enganchamos un keydown en SU
   documento y reenviamos las teclas de navegación a Reveal — salvo cuando
   se está escribiendo en un campo editable del demo (input/textarea). */
const NAV_KEYS = {
  ArrowRight: () => Reveal.right(), ArrowLeft: () => Reveal.left(),
  ArrowUp: () => Reveal.up(), ArrowDown: () => Reveal.down(),
  PageDown: () => Reveal.next(), PageUp: () => Reveal.prev(),
};
function isEditableTarget(el) {
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
}
function bridgeIframeNav(iframe) {
  if (!iframe) return;
  const attach = () => {
    let doc;
    try { doc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document); }
    catch (e) { return; }            // cross-origin: no se puede enganchar
    // La marca va en el DOCUMENT, no en el iframe: mover el iframe en el DOM
    // (o cualquier recarga) genera un contentDocument nuevo y hay que volver
    // a enganchar; un flag por-iframe dejaría el listener en el doc viejo.
    if (!doc || doc.__navBridged) return;
    doc.__navBridged = true;
    // Fase de captura: corremos ANTES de cualquier handler de teclado del
    // demo, así nunca nos "come" la tecla (stopPropagation) antes de tiempo.
    doc.addEventListener('keydown', (e) => {
      const fn = NAV_KEYS[e.key];
      if (!fn || isEditableTarget(e.target)) return;
      e.preventDefault();
      fn();
    }, true);
  };
  if (!iframe.dataset.navListener) {        // un solo listener de 'load' por iframe
    iframe.dataset.navListener = '1';
    iframe.addEventListener('load', attach);  // re-engancha tras cada (re)carga
  }
  attach();                                 // …o ya cargó
}
function bridgeNavIn(slide) {
  if (slide) slide.querySelectorAll('iframe').forEach(bridgeIframeNav);
}

/* ---- Demo a pantalla completa real ---------------------------------- *
   El demo es un producto embebido que internamente ocupa 100vw/100vh. El
   deck, en cambio, dibuja un lienzo fijo 16:9 (1920×1080) escalado y
   centrado dentro de .slides; el espacio sobrante (letterbox) queda como
   bandas laterales que, con fondo claro, se ven como "bordes blancos".
   Para que el demo use TODO el espacio sin importar el aspecto de la
   ventana, sacamos su iframe del lienzo escalado y lo montamos sobre
   .reveal (que sí cubre toda la ventana), ocupándola al 100%. Así el iframe
   adopta el tamaño real de la ventana y su contenido (100vw/100vh) llena
   todo. Se muestra solo cuando su slide está activa. */
let demoIframe = null, demoSection = null;
function setupDemoFill() {
  demoSection = document.querySelector('section.slide[data-label="Demo plataforma"]');
  const reveal = document.querySelector('.reveal');
  const iframe = demoSection && demoSection.querySelector('iframe');
  if (!iframe || !reveal) return;
  // z-index 6: sobre .slides (auto) pero debajo de controles (11) y barra de
  // progreso (10), para que las flechas de reveal sigan clickeables.
  iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;z-index:6;display:none;';
  reveal.appendChild(iframe);
  demoIframe = iframe;
  bridgeIframeNav(iframe);
}
function syncDemoFill(slide) {
  if (demoIframe) demoIframe.style.display = (slide === demoSection) ? 'block' : 'none';
}

/* ---- Init perezoso de gráficos (Chart.js necesita dimensiones) ------ */
function initChartsIn(slide) {
  if (!slide || !window.Charts) return;
  slide.querySelectorAll('canvas[id]').forEach((cv) => {
    if (!CHART_CONFIGS[cv.id]) return;
    if (cv.dataset.inited) {
      Charts.replay(cv);   // re-dispara la animación de entrada al volver a la slide
    } else {
      cv.dataset.inited = '1';
      Charts.register(cv, CHART_CONFIGS[cv.id]);
    }
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
  // Solo cuenta las visibles: las ocultas se sacan del DOM, así que ni aparecen.
  let n = 0;
  document.querySelectorAll('section.slide').forEach((slide) => {
    n += 1;
    let el = slide.querySelector('[data-page]');
    if (!el) {
      const header = slide.querySelector('[data-chrome="header"]');
      if (header) el = [...header.querySelectorAll('span')]
        .find((s) => /^\s*\d+\s*\/\s*\d+\s*$/.test(s.textContent));
      // Al rescribir el span perdería el patrón "NN / NN"; lo marcamos con
      // data-page para que las re-pasadas (al ocultar/mostrar) lo reencuentren.
      if (el) el.setAttribute('data-page', '');
    }
    if (el) el.textContent = String(n).padStart(2, '0');
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
  const params = new URLSearchParams(location.search);
  const isPrint = params.has('print-pdf');

  // Tema/tipografía desde la URL (?theme=…&typeset=…): así el render headless
  // del PDF —y cualquier link compartido— reproduce la combinación elegida.
  // Se valida contra las listas para no aceptar valores arbitrarios.
  const root = document.documentElement;
  const qpTheme = params.get('theme');
  const qpTypeset = params.get('typeset');
  if (qpTheme && THEMES.includes(qpTheme)) root.setAttribute('data-theme', qpTheme);
  if (qpTypeset && TYPESETS.includes(qpTypeset)) root.setAttribute('data-typeset', qpTypeset);

  // Captura el orden canónico y saca del DOM las slides ocultas (localStorage en
  // vivo, ?hidden=… en el PDF) ANTES de inicializar reveal, para que ni cuenten.
  captureSlides();
  applyInitialHidden(isPrint, params);

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
    // PDF: un slide por página (nunca partido); sin multiplicar por fragmentos.
    pdfMaxPagesPerSlide: 1, pdfSeparateFragments: false,
  });
  const onSlide = (slide) => {
    heroOnSlide(slide); initChartsIn(slide); drawIcons(); setViewportBg(slide); bridgeNavIn(slide); syncDemoFill(slide);
    if (window.DeckAnim) DeckAnim.onSlide(slide);   // entrada escalonada + timeline
    // tras render de fuentes/gráficos, ajustar si desborda
    requestAnimationFrame(() => fitSlide(slide));
    setTimeout(() => fitSlide(slide), 450);
  };
  Reveal.on('ready', (e) => {
    numberSlides();   // numera por posición real (no se hardcodea en partials)
    if (isPrint) {
      // PDF: todas las slides están apiladas y visibles → inicializar
      // gráficos e íconos de TODAS (no solo la actual), sin animar el hero.
      // No llamamos window.print(): el render headless (api/pdf.js) hace
      // page.pdf() cuando detecta la señal window.__deckPrintReady. Esperamos
      // a que las fuentes carguen y el layout se asiente antes de marcarla.
      // OJO: en headless/print los timers (setTimeout/rAF) de la página se
      // congelan, así que NO podemos depender de ellos para marcar la señal.
      // Inicializamos todo de forma síncrona y marcamos __deckPrintReady ya.
      // Las esperas (fuentes + asentado del layout) las hace el lado Node
      // (api/pdf.js / scripts/export-pdf.mjs), donde los timers sí corren.
      const slides = [...document.querySelectorAll('section.slide')];
      slides.forEach((s) => initChartsIn(s));
      drawIcons();
      slides.forEach((s) => fitSlide(s));
      drawIcons();
      window.__deckPrintReady = true;
    } else {
      setupDemoFill();   // saca el iframe del demo del lienzo escalado
      onSlide(e.currentSlide); setTimeout(drawIcons, 400);
    }
  });
  Reveal.on('slidechanged', (e) => { if (!isPrint) onSlide(e.currentSlide); });
});
