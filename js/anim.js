/* ============================================================
   Conpro · Animación de entradas (criterio Emil Kowalski)
   - Stagger de entrada GENÉRICO por slide, sin tocar los 31 partials:
     anima los hijos directos del cuerpo (.slide > div) con opacity +
     translateY, easing ease-out fuerte y delay incremental.
   - Solo transform/opacity (GPU). Transiciones (no keyframes) →
     interrumpibles al navegar rápido.
   - Respeta prefers-reduced-motion (mantiene opacity, sin movimiento).
   - Excluye el demo / cualquier slide [data-no-anim] y el modo print.
   - Secuencia del timeline (slide 06): resalta el paso activo 1→5 con
     las flechas o el clic, vía fragments de reveal.js.
   Expuesto como window.DeckAnim; lo llama deck.js en cada cambio de slide.
   ============================================================ */
(function () {
  'use strict';

  const REDUCED = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IS_PRINT = location.search.includes('print-pdf');

  /* ---- Entrada escalonada genérica --------------------------------- */
  function enter(slide) {
    if (!slide || IS_PRINT) return;
    if (slide.hasAttribute('data-no-anim')) return;
    const body = slide.querySelector(':scope > div');
    if (!body) return;

    // Objetivos = hijos directos del cuerpo (kicker, título, grid/timeline…).
    // Header/footer (chrome) quedan fuera: no son hijos del cuerpo.
    const items = Array.from(body.children);
    if (!items.length) return;

    const dur = cssMs('--anim-enter', 460);
    const step = cssMs('--anim-stagger', 55);
    const rise = (getComputedStyle(document.documentElement)
      .getPropertyValue('--anim-rise') || '14px').trim();
    const ease = (getComputedStyle(document.documentElement)
      .getPropertyValue('--ease-out') || 'ease-out').trim();

    items.forEach((el, i) => {
      // Estado inicial sin transición (para no animar el "reset").
      el.style.transition = 'none';
      el.style.opacity = '0';
      el.style.willChange = 'opacity, transform';
      if (!REDUCED) el.style.transform = `translateY(${rise})`;
    });
    // Forzar reflow para que el estado inicial se aplique antes de animar.
    void body.offsetHeight;

    items.forEach((el, i) => {
      const delay = i * step;
      el.style.transition =
        `opacity ${dur}ms ${ease} ${delay}ms` +
        (REDUCED ? '' : `, transform ${dur}ms ${ease} ${delay}ms`);
      el.style.opacity = '1';
      el.style.transform = REDUCED ? '' : 'translateY(0)';
      // Al terminar, limpiar los estilos inline para devolver el elemento a
      // su estado natural (no interferir con fitSlide ni con re-entradas).
      const total = dur + delay;
      window.setTimeout(() => {
        el.style.transition = '';
        el.style.opacity = '';
        el.style.transform = '';
        el.style.willChange = '';
      }, total + 60);
    });
  }

  /* ---- Secuencia del timeline (slide 06) --------------------------- *
     El contenedor de pasos lleva [data-sequence]; cada círculo de número
     lleva [data-seq]. Los pasos son visibles desde el inicio; las flechas/
     clics activan fragments invisibles ([data-seq-marker]) y movemos el
     resaltado del paso activo (1→5). Sin fragments todavía → paso 1 activo. */
  function paintSequence(slide) {
    if (!slide) return;
    const seq = slide.querySelector('[data-sequence]');
    if (!seq) return;
    const steps = Array.from(seq.querySelectorAll('[data-seq]'));
    if (!steps.length) return;
    // Paso activo: si [data-sequence] trae data-seq-active (lo setea el video
    // del slide 06 vía deck.js::syncFlowVideo) se usa ese; si no, se cuenta por
    // fragments revelados (flecha/clic), el comportamiento de los demás slides.
    const explicit = parseInt(seq.getAttribute('data-seq-active'), 10);
    const shown = slide.querySelectorAll('[data-seq-marker].visible').length;
    const active = Number.isFinite(explicit)
      ? Math.min(steps.length, Math.max(1, explicit))
      : Math.min(steps.length, shown + 1); // 1-based; enter = 1

    steps.forEach((el, i) => {
      const n = i + 1;
      el.style.transition =
        'background var(--anim-enter) var(--ease-out), ' +
        'border-color var(--anim-enter) var(--ease-out), ' +
        'color var(--anim-enter) var(--ease-out), ' +
        'transform var(--anim-enter) var(--ease-out)';
      // El resalte (color) ayuda a comprender → se mantiene siempre; el
      // scale es movimiento → se omite bajo prefers-reduced-motion.
      const pop = REDUCED ? 'scale(1)' : 'scale(1.08)';
      if (n === active) {                 // paso activo: relleno acento
        el.style.background = 'var(--color-accent)';
        el.style.borderColor = 'var(--color-accent)';
        el.style.color = 'var(--color-on-accent)';
        el.style.fontWeight = '700';
        el.style.transform = pop;
      } else if (n < active) {            // pasos completados: contorno acento
        el.style.background = 'var(--color-bg)';
        el.style.borderColor = 'var(--color-accent)';
        el.style.color = 'var(--color-accent)';
        el.style.fontWeight = '700';
        el.style.transform = 'scale(1)';
      } else {                            // pasos en reposo: gris
        el.style.background = 'var(--color-bg)';
        el.style.borderColor = 'var(--color-grid)';
        el.style.color = 'var(--color-text-muted)';
        el.style.fontWeight = '600';
        el.style.transform = 'scale(1)';
      }
    });

    // Línea de progreso que crece hasta el paso activo. Usa scale (GPU), no
    // width/height (que dispararía layout). La línea cubre todo el tramo entre
    // el primer y el último nodo; el scale la rellena hasta el paso activo.
    // Eje según data-orient: vertical (slide 06) usa scaleY; horizontal scaleX.
    const line = seq.querySelector('[data-seq-progress]');
    if (line && steps.length > 1) {
      const frac = (active - 1) / (steps.length - 1);
      const vertical = seq.getAttribute('data-orient') === 'vertical';
      line.style.transition = 'transform var(--anim-enter) var(--ease-out)';
      line.style.transform = (vertical ? 'scaleY(' : 'scaleX(') + frac + ')';
    }
  }

  /* ---- Bullets secuenciales (slides de bullets clave) -------------- *
     El <ul> lleva [data-seq-bullets]; cada item lleva class="fragment"
     [data-seq-bullet]. Aparecen de a uno (flecha/clic); el activo (el más
     reciente) queda a plena prominencia y los ya mostrados se atenúan. Al
     mostrar TODOS, vuelven todos a plena opacidad (estado final uniforme:
     respeta el feedback de "bullets parejos"). */
  function paintBullets(slide) {
    if (!slide) return;
    slide.querySelectorAll('[data-seq-bullets]').forEach((group) => {
      const items = Array.from(group.querySelectorAll('[data-seq-bullet]'));
      if (!items.length) return;
      const allShown = items.every((b) => b.classList.contains('visible'));
      items.forEach((b) => {
        b.style.transition = 'opacity var(--anim-enter) var(--ease-out)';
        if (!b.classList.contains('visible')) return; // reveal lo mantiene oculto
        const active = b.classList.contains('current-fragment');
        b.style.opacity = (allShown || active) ? '1' : '0.4';
      });
    });
  }

  /* ---- Utilidades --------------------------------------------------- */
  function cssMs(name, fallback) {
    const v = parseFloat(getComputedStyle(document.documentElement)
      .getPropertyValue(name));
    return Number.isFinite(v) ? v : fallback;
  }

  /* ---- API + enganche de fragments --------------------------------- */
  window.DeckAnim = {
    onSlide(slide) { enter(slide); paintSequence(slide); paintBullets(slide); },
    paintSequence,   // lo llama deck.js en cada timeupdate del video (slide 06)
  };

  // Los fragments del timeline cambian el paso activo (flecha o clic).
  document.addEventListener('DOMContentLoaded', () => {
    if (IS_PRINT || !window.Reveal) return;
    const repaint = (e) => {
      const slide = (e && e.fragment && e.fragment.closest('section.slide')) ||
        (window.Reveal.getCurrentSlide && window.Reveal.getCurrentSlide());
      paintSequence(slide);
      paintBullets(slide);
    };
    Reveal.on('fragmentshown', repaint);
    Reveal.on('fragmenthidden', repaint);
  });
})();
