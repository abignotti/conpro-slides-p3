# DEVLOG — Escalamiento de Conpro

Lo nuevo arriba. No edites entradas viejas.

---

## [2026-06-20] — Doc: diálogo por slide
Qué hice:
- Creé `docs/dialogo-por-slide.md`: mapea cada una de las 28 slides con su parte del diálogo (texto verbatim de `docs/fuentes/guion.md`), por sección y por slide, para revisar la correspondencia y ensayar. Slides estructurales (portada, divisores) marcadas como transición.

## [2026-06-20] — Deck real COMPLETO: 28 slides en presentacion/
Qué hice:
- Construí las **28 slides** del deck real (Apertura · 5 bloques con divisores que integran la agenda · Cierre), reusando y adaptando los moldes.
- **Proceso:** prototipo de 4 slides (portada, divisor+agenda, stat grid, barras) aprobado primero; luego construido **bloque por bloque** (Apertura+B1 → B2 → B3 → B4 → B5+cierre) con screenshot de validación y commit en cada bloque.
- **Rondas de feedback aplicadas:** quitar profesores de la portada; eliminar captions densas al pie (contexto → notas); bullets sobre párrafos; marcadores de bullet uniformes en acento; eliminar em-dashes; selector probado arriba-derecha y devuelto a abajo-centro; botón PDF retirado.
- Gráficos Chart.js nuevos: `chart-precios` (barGroup), `chart-demanda` (línea), `chart-ganancias` (barras), `chart-tornado` (barH horizontal), `chart-margenes` (barras), `chart-esperar`. Extendí `charts.js` con `barGroup` y `barH`; etiquetas de valor con coma es-CL.
- Feedback aplicado en todo el deck: bullets > párrafos con marcadores uniformes en acento; sin em-dashes ("—"); sin captions chicas al pie (contexto → notas del orador); portada solo con los 6 integrantes; botón PDF retirado.
Decisiones/bugs:
- Lección: cuerpo `flex-start` en slides con mucho contenido (evita el choque con el header).
- DATOS PLACEHOLDER + TODO (marcados en las slides): curva de demanda (17), tabla de ganancias (19), payback por escenario (20), magnitudes del tornado (22), precios exactos Ilustración 1 (5), x% del mercado (17), gatillo de hogares (27), $16.700/h y $310.000 (verificar guion vs informe).
Próximo paso: revisar el deck completo; completar datos reales; luego animaciones (skill Emil Kowalski, idea: timeline 1→5) + deploy a Vercel; arreglar export PDF; export PPTX editable.

## [2026-06-20] — Planificación del deck real: fuentes, mapa y framing
Qué hice:
- Importé 9 docs de contenido/diseño + el Informe 3 (PDF) + el Molde Base PPT (claude design). Moví los 9 `.md` a `docs/fuentes/` (versionados). Binarios fuera de git (`*.pdf` en .gitignore; viven en `.context/`, ya ignorado).
- Creé `docs/mapa-deck.md`: las **28 slides** en orden (29 del esqueleto − agenda), cada una con molde + contenido conciso (del guion) + estado del dato + TODOs.
Decisiones/bugs:
- Tema = **Mostaza claro** (el oscuro de los docs quedó desactualizado); selector se mantiene. Sin agenda (revisar). Cero "Defensa". Framing: la presentación **vende y defiende** el hallazgo (CBO ≈ VAN del proyecto con ~1/8 de inversión → no invertir ya; plataforma **diferida, no descartada**).
- `Molde Base PPT.pptx` es **NATIVO/EDITABLE** (auto-shapes + texto, 22 moldes, 20×11.25in) → base ideal para el hito de PPTX editable (Fase 5), en vez de imagen-por-slide.
- Datos no finales: avanzar con placeholders + comentario TODO (ver `mapa-deck.md` → "TODO de datos").
Próximo paso: **Fase 2** — prototipo de 3-4 slides reales en `presentacion/` (Mostaza claro), screenshot y PARAR para aprobación del look.

## [2026-06-20] — Estructura: moldes/ (recurso) vs presentacion/ (deck real)
Qué hice:
- Renombré `slides/` → `moldes/` (biblioteca reutilizable de los 22 templates).
- Creé `presentacion/` para el deck real; sembrada con `01-portada.html` (cover placeholder).
- Unifiqué el build en `scripts/build.py`: genera `moldes.html` (galería de referencia, desde `moldes/`) e `index.html` (deck real, entrypoint para Vercel, desde `presentacion/`). Eliminé `scripts/build_index.py`.
- Verifiqué: las 22 secciones de `moldes.html` son idénticas al `index.html` anterior; `index.html` ahora es un deck de 1 slide.
Decisiones/bugs:
- `index.html` = deck real (lo que se deploya); `moldes.html` = recurso/catálogo. Un molde se copia a `presentacion/` y puede repetirse en varios slides.
- ⚠️ A tener en cuenta en hito 3: los moldes de gráfico (7/8/14) usan ids fijos de canvas (`chart-barras`/`chart-lineas`/`chart-combo`) mapeados en `CHART_CONFIGS` de `deck.js`. Si en `presentacion/` se reutiliza un molde de gráfico más de una vez, los ids chocarían (id duplicado → solo inicializa el primero). Al armar el deck real habrá que dar ids únicos por slide y volver `CHART_CONFIGS` data-driven.
Próximo paso: infraestructura de animación genérica; integrar los documentos que pasará el usuario; armar el contenido real en `presentacion/`. Rama `reimport-deck-redo`.

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
