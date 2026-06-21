# DEVLOG — Escalamiento de Conpro

Lo nuevo arriba. No edites entradas viejas.

---

## [2026-06-21] — Cierre de sesión: demo plataforma + numeración auto (commit/push)
Qué hice:
- Cierre de la sesión del **demo de la plataforma** y la **numeración automática**. Build OK (31 slides), server local 200, demo verificado en browser. Commit + push de `reimport-deck-redo` con todo el trabajo acumulado en el working tree (esta sesión + la de "datos reales" de la otra sesión).
- Reglas nuevas en `CLAUDE.md`: número de slide automático (no se hardcodea); el demo NO se anima; enviar el link tras cada cambio.
- Doc nuevo: `docs/mapeo-pptx-v1.md` (mapeo PPTX v1 ↔ deck, vivo).
Decisiones/bugs:
- Se commitean también los cambios de la otra sesión (slides 08/11/17/18/19/20, `10b`, `17b`, `moldes/23-buyer-persona`, `assets/flujo/`) por estar en la misma rama y formar parte del mismo redo. `.context/`, PPTX y `build/` quedan ignorados.
Próximo paso (otra rama): integrar/aprobar buyer-persona (Juan) y propuesta 2-tarjetas; unificar las 3 cifras de "esperar"; datos del tornado (22) y verificación de márgenes (23); animaciones (skill Emil Kowalski, el demo queda fijo); deploy a Vercel para link público.

## [2026-06-21] — Demo: zoom 1.5× para que no quede angosto
Qué hice:
- El contenido de la app embebida (catálogo + panel lateral al abrir un producto) se veía **muy angosto** porque la app centra su contenido en un ancho máximo y el iframe corría a 1920px. Fix en `14b-demo-plataforma.html`: el iframe renderiza a un **viewport de 1280×720** y se escala **1.5×** (`transform:scale(1.5);transform-origin:top left`) para llenar la slide (1280×1.5=1920, 720×1.5=1080). Así el contenido ocupa proporcionalmente más ancho y todo se ve más grande. Verificado en browser: productos a todo el ancho y panel lateral bien proporcionado.
Decisiones/bugs:
- Técnica "iframe a viewport chico + scale" para controlar el ancho efectivo de un embed con max-width propio (no se puede editar el bundle, va comprimido). Si aún se quiere más grande, bajar el viewport (p. ej. 1152) sube el zoom — ojo con gatillar el layout tablet de la app.

## [2026-06-21] — Numeración automática + demo a pantalla completa
Qué hice:
- **Número de slide automático** (`js/deck.js` → `numberSlides`, llamado en `Reveal.on('ready')`): el número arriba-derecha se calcula por la **posición real** del slide (no se hardcodea). Sobrescribe el placeholder del header (matchea `[data-page]` o el `<span>` cuyo texto sea "N / N"). **Cero edición de los 30 partials** ahora y en adelante: agregar/quitar/reordenar slides recalcula solo. Se **quitó el total** ("/ 28"). Regla anotada en `CLAUDE.md` (Convenciones) para que toda sesión la siga.
- **Demo de la plataforma a pantalla completa**: saqué header + pie de `14b-demo-plataforma.html` (iframe full-bleed, `padding:0`, fondo `#0F0F0F`) — venía muy alargado horizontalmente. Verificado en browser: plataforma=15, demo (pos. 16) sin número, vale-la-pena=17.
Decisiones/bugs:
- El demo, al no tener header, **no imprime número** → la secuencia salta 15 → 17. Es coherente (número = posición real); si molesta, se puede excluir de la cuenta con un flag. Pendiente de decisión del usuario.
- El renumerado global **manual** quedó obsoleto (lo reemplaza `numberSlides`). Avisar a la otra sesión que estaba en esa tarea.
- Cache del server local: hay que **hard-reload** (Cmd+Shift+R) para ver cambios de `js/deck.js`.
Próximo paso: confirmar con el usuario si el demo debe o no consumir número (salto 15→17); seguir con datos reales (tornado 22, márgenes 23) y deploy.

## [2026-06-21] — Demo web de la plataforma: bundle completo + orden 16/17
Qué hice:
- Llegó el bundle **completo** de la web de Conpro (715 KB, 21 assets embebidos + fuentes, sin la referencia 404 a `Conpro.dc.html` del export anterior). Reemplacé `assets/plataforma-demo.html` y **verifiqué en el browser**: el iframe del slide `14b-demo-plataforma` ahora renderiza el catálogo completo (tarjetas Huevos/Café/Aceite/Miel… + panel "Elige tu grupo" con Providencia/Las Condes/Ñuñoa/La Reina y barras de avance).
- **Orden definido (pedido del usuario):** pos. 16 = Plataforma B2C (explicación, `14-plataforma`) → pos. 17 = demo web (`14b-demo-plataforma`). El placeholder de video del PPTX se descarta. El deck web ya tenía ese orden (plataforma → demo), así que solo se actualizó el bundle + docs.
- Actualicé `docs/mapeo-pptx-v1.md` (filas 16/17 + estado: demo resuelto).
Decisiones/bugs:
- El demo sigue mostrando "14 / 28" (convención "b", comparte número con su slide principal). Que muestre un número propio en pantalla (16/17 literal) depende del **renumerado global** del deck — tarea aparte, en curso en otra sesión; no la toqué para no pisar ese trabajo.
Próximo paso: integrar el renumerado global (que fija el "/28" del demo); confirmar que el iframe escala bien en pantalla completa/proyección.

## [2026-06-21] — Datos reales del PPTX del grupo + 3 slides nuevas + molde buyer persona
Qué hice:
- **Comparé el PPTX del grupo** (`Conpro-P3-v1.pptx`, en `.context/`) contra el deck y apliqué los **datos reales**: precios por producto (`chart-precios` en `js/deck.js`, mapeados Conpro/mín/máx), y la **demanda** pasó de "ingreso bruto" a **hogares** 60/93/122/143/161 (`chart-demanda` ahora barras). Limpié las marcas de TODO/placeholder de las slides ya confirmadas (08 costo-oportunidad, 11 resultados-cbo, 18 costos, 19 ganancias, 20 van-payback).
- **3 slides nuevas** (en `presentacion/`, staging, pendientes de aprobar/renumerar): `10b-flujo-cbo` (flujo de automatización del CBO en 9 pasos con los **íconos reales del PPTX** extraídos a `assets/flujo/` — xlsx/make/fintoc/whatsapp/check/folder), `17b-ingresos-demanda` (`chart-ingresos`: ingresos por tramo de hogares + dato **0,19% de 86.770 hogares**). Nota: `14b-demo-plataforma` apareció de otra sesión en el workspace.
- **Molde nuevo `moldes/23-buyer-persona.html`**: buyer persona de Juan, recreado en HTML (no imagen). Iterado a una versión limpia según referencia del usuario (avatar de familia, kicker "El cliente", 2 atributos, bloque "Su dolor" con "!", frase de cierre).
Decisiones/bugs:
- Juan va **a los moldes** (biblioteca reutilizable), no como imagen embebida en el deck.
- Íconos del flujo = PNG en `assets/flujo/` (paleta mostaza coincide, pero NO se re-colorean al cambiar de tema).
- **Lección de layout:** el cuerpo entre header y footer da ~826px; si el contenido cabe en ese alto, `justify-content:center` lo balancea sin que `fitSlide` lo escale/descentre (evita el "pegado abajo, hueco arriba").
- `chart-ingresos`: las etiquetas salen como `37.374.912` sin `$` (el plugin de `js/charts.js` está cableado a un solo formato); falta decidir si se agrega el `$`.
- Verificación visual con Playwright headless a 1920×1080 (mide `scrollHeight` vs `clientHeight` para confirmar que no escala). El server local cachea: usar cache-buster al re-renderizar.
- Nada commiteado aún: pendiente OK del usuario sobre Juan/flujo/ingresos.
Próximo paso: aprobar e integrar (renumerar a posición real) las slides nuevas; decidir el `$` del gráfico de ingresos; verificar el tornado (22) y márgenes (23), que siguen como placeholder.

## [2026-06-21] — Mapeo PPTX v1 + slide demo plataforma (16)
Qué hice:
- **`docs/mapeo-pptx-v1.md`** (doc vivo): mapea las 35 slides del PPTX de referencia `Conpro-P3-v1.pptx` ↔ el deck web (`presentacion/`), con flag por slide (✅ igual · ⚠️ modificada · 🔁 duplicado obsoleto · 🆕 nuevo). Pensado para que cualquier sesión tenga el contexto sin re-derivarlo; se va actualizando.
- **Slide demo de la plataforma**: creé `presentacion/14b-demo-plataforma.html` (reemplaza el placeholder "ACA EL VIDEO" del PPTX, slide 16). Muestra "14 / 28" siguiendo la convención "b" (comparte número con su slide principal, como `10b`/`17b`); va **después** de `14-plataforma`. Embebe el mockup vía `<iframe>` a `assets/plataforma-demo.html` ocupando todo el cuerpo, **sin título** (a pedido).
Decisiones/bugs:
- El PPTX v1 es una versión **intermedia**, no el deck web: trae duplicados (bloque 5 viejo+nuevo), placeholders ("video", typos en Juan) y se contradice (sección 05 = "Resultados y recomendaciones" en slide 2 vs "Robustez y decisión" en slide 28). ~18/28 coinciden.
- **3 cifras distintas de "esperar"** sin unificar: PPTX viejo ($6.685.096) vs `mapa-deck.md` ($6.109.830) vs `js/deck.js` chart-esperar (6,11 M$). Pendiente fijar la buena.
- ⚠️ **Demo bloqueado por contenido**: el bundle `Molde - Conpro Chrome.html` renderiza la ventana de Chrome pero el catálogo sale en negro — el export no incluyó `Conpro.dc.html` (404). La infra del slide ya está lista; falta re-exportar el bundle completo o pasar el contenido del catálogo.
Próximo paso: conseguir el bundle completo de la plataforma; unificar cifras de "esperar"; decidir si se integran al web los diseños del PPTX (buyer-persona Juan, propuesta 2 tarjetas, TIR).

## [2026-06-20] — PPT editable nativo + deck en Corporativo + PDF del diálogo
Qué hice:
- Deck web cambiado a **Mostaza claro + Corporativo** (Montserrat/Inter) + Completo (`build.py` parametrizado por `typeset`; `presentacion` → Corporativo, `moldes` sigue Editorial).
- **`scripts/build_pptx.py`**: genera `Escalamiento-Conpro.pptx` NATIVO/EDITABLE (28 slides) replicando el deck web. Mapea el lienzo 1920×1080 → 13.333×7.5in (1px=6350 EMU, fuente ×0.5pt), colores Mostaza claro; texto, tablas, tarjetas y formas son nativas/editables. Los gráficos van como imagen fiel capturada del canvas del deck. Verificado renderizando con LibreOffice (`soffice --convert-to pdf`).
- `docs/dialogo-por-slide.pdf` exportado (pandoc → HTML → Chrome PDF).
Decisiones/bugs:
- Gráficos del PPT = imagen (no nativos) para máxima fidelidad visual; el resto editable. Se pueden volver nativos si las compañeras necesitan editar los datos del gráfico.
- Fuentes Montserrat/Inter: si PowerPoint no las tiene, sustituye (el deck web las carga de Google Fonts). Para portabilidad total habría que embeber fuentes.
- `Escalamiento-Conpro.pptx` y `docs/*.pdf` están gitignored (artefactos); se regeneran con los scripts.
Próximo paso: completar datos reales; animaciones (Emil Kowalski); deploy Vercel; (opcional) gráficos nativos en el PPT.

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
