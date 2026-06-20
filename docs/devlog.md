# DEVLOG — Escalamiento de Conpro

Lo nuevo arriba. No edites entradas viejas.

---

## [2026-06-20] — Hitos 1–2: Moldes, tooling y docs
Qué hice:
- Biblioteca de moldes completa: 22 templates tokenizados (9 temas × 7 typesets) en reveal.js + Chart.js, con selector de tema/typeset/chrome, pantalla completa sin bandas blancas, y botones de PDF/PPTX. (Fixes agrupados de sesiones previas: espaciado vertical de los 22 moldes, letterbox full-bleed, bandas de la portada que copian el fondo real del slide, eliminación de todo "Defensa", guiones de kicker.)
- Refactor a **1 archivo por slide**: separé los 22 `<section>` en `slides/NN-molde.html`; el `index.html` resultante quedó **byte-idéntico**.
- Reescribí el build como pura concatenación y lo moví a `scripts/build_index.py`; moví también `scripts/export_pptx.py`.
- Creé `CLAUDE.md`, `docs/project-spec.md`, `docs/devlog.md` y `.gitignore`.
Decisiones/bugs:
- `.context/` está gitignored (Conductor) → los scripts esenciales se mueven a `scripts/` para versionarlos.
- Scope nuevo: el PPTX debe ser **editable-nativo** (no imagen-por-slide) para que las compañeras editen en PowerPoint y luego se pase a code → hito 6. El `export_pptx.py` actual (imagen) es provisorio.
- Reglas duras vs. guías iterables: lo estructural (1 archivo/slide, build, tokens) es regla dura; lo estético (24px, acento, gráficos) es punto de partida iterable.
- Bug conocido: el export a PDF (`?print-pdf`) se ve mal → pendiente, baja prioridad.
Próximo paso: separar `slides/` (moldes, recurso reutilizable) de `presentacion/` (deck real); montar la infraestructura de animación genérica; armar el contenido real cuando el usuario entregue las cifras. Rama `reimport-deck-redo`.
