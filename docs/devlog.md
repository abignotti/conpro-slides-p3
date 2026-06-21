# DEVLOG — Escalamiento de Conpro

Lo nuevo arriba. No edites entradas viejas.

---

## [2026-06-21] — Control de visibilidad de slides (ocultar/mostrar en vivo)
Qué hice:
- **Panel "☰ Slides"** nuevo en `buildPicker` (deck.js): lista las 34 slides (número + título tomado del `h1/h2`, con fallback `data-label`/`data-sid`) y un botón "ojo" por fila para **ocultar/mostrar cada slide en vivo**. Al ocultar, la numeración de las visibles se **recalcula sola** (sin huecos) y la navegación las **salta**. Se abre/cierra con el botón y se oculta junto al chrome con la tecla **T**.
- **Persistencia en `localStorage`** (`conpro-hidden-slides`, set de `data-sid`): el estado oculto sobrevive a la recarga.
- **PDF excluye las ocultas:** el botón "Descargar PDF" agrega `&hidden=sid,sid` al fetch; `api/pdf.js` lo sanea (slug `[a-z0-9-]`) y lo reenvía a `index.html?print-pdf&hidden=…`. En print, las ocultas se sacan antes de inicializar → no salen en el PDF.
- **IDs estables:** `scripts/build.py` ahora inyecta `data-sid="<archivo>"` (p. ej. `03-juan`) en cada `<section>`, para referenciar slides sin depender de la posición (no se duplica si ya existe).
Decisiones/bugs:
- **`data-visibility="hidden"` de reveal NO sirve:** verificado en vivo que reveal 5.1 igual navega a la slide (no la excluye de `getTotalSlides`/navegación). **Mecanismo elegido: sacar la `<section>` del DOM** y llamar `Reveal.sync()` + `Reveal.layout()` → recalcula total, navegación y barra de progreso. Se reinserta en su posición usando `SLIDE_ORDER` (orden canónico capturado al cargar) y `el.isConnected` como indicador de "oculta".
- **Bug de idempotencia en `numberSlides`:** tras la 1ª pasada el span queda como "04" (sin "/ 28"), así que la regex `NN / NN` ya no lo reencontraba en las re-pasadas. Fix: al ubicarlo la 1ª vez se le marca `data-page`, que las pasadas siguientes usan directo.
- **Recordatorio (worktrees + puerto):** otra vez el `localhost:8753` lo tenía tomado OTRO workspace (`yokohama`); verifiqué en un puerto propio (8760). Mismo aprendizaje que la entrada del PDF.
- Verificado en navegador: ocultar 2 slides → total 34→32 y renumeración (06→04); navegación salta las ocultas; mostrar → vuelve a 34; persistencia tras recarga; tecla T oculta picker+panel; URL del PDF lleva `&hidden=…`; print mode (`?print-pdf&hidden=07-dependencia`) excluye la slide (33 págs).
- **Mensaje de error del PDF aclarado:** el botón daba un `alert` genérico en voseo ("Revisá la consola") al pegar contra el server estático local, donde `/api/pdf` da 404 (la función serverless solo corre en Vercel). Ahora detecta el 404 y muestra mensaje neutro y claro ("necesita el entorno Vercel — deploy o `vercel dev`"); para export local sin Vercel queda `node scripts/export-pdf.mjs`. No era un bug del feature.
- **Rebase a main:** `HEAD` ya estaba en `origin/main` (`ca37dc4`); `reimport-deck-redo` es un ancestro más viejo. No había nada que rebasar ni conflictos; ninguna entrada de devlog en riesgo.
- **Ajuste Vercel (Node):** `@sparticuz/chromium@149` exige Node `^22.17 || >=24` (campo `engines`), pero `package.json` no fijaba `engines.node` → Vercel podía elegir un Node incompatible y romper el deploy. Se agregó `"engines": { "node": "22.x" }`. Validado: `npm ci` limpio (45 pkgs, 0 vuln) y la función importa OK. `vercel.json` (maxDuration 60, memory 1024) se deja igual. **OJO:** el `/api/pdf` (puppeteer + chromium de Lambda/Linux) **NO se puede probar con `vercel dev` en macOS** (binario Linux-only): se prueba SOLO en un deploy real (preview o prod).
- **Bug en preview de Vercel — Deployment Protection (RESUELTO):** el primer deploy preview falló el PDF con `TimeoutError: Waiting for function failed` (`__deckPrintReady` nunca true). Causa: el preview tenía **Vercel Authentication** activa → la función, al pedir su PROPIA URL server-to-server (sin la cookie de sesión del usuario), recibía el muro de SSO (`HTTP 401 Authentication Required`, `vercel.com/sso`) en vez del deck. Chromium sí arrancó (el `engines.node:22.x` funcionó). **Resuelto desactivando Vercel Authentication** en Settings → Deployment Protection (los previews quedan públicos; aceptable para este deck) → el PDF se genera OK en el preview.
- **Red de seguridad (inerte): bypass de protección.** Por si en el futuro se protege producción, `api/pdf.js` manda `VERCEL_AUTOMATION_BYPASS_SECRET` como header `x-vercel-protection-bypass` en cada request (vía `page.setExtraHTTPHeaders`, cubre documento + css/js/assets) **solo si la env var existe**. Hoy no está seteada, así que el código no hace nada; queda listo si se activa "Protection Bypass for Automation".
- **Lección (Vercel + headless self-fetch):** una función que renderiza su propio deployment con puppeteer NO hereda la sesión del navegador del usuario; si el deployment está protegido, la función ve el SSO. Opciones: previews públicos (Vercel Authentication off) o el secreto de bypass.
Próximo paso: PR a `main`. Eventualmente, deploy a producción y confirmar el PDF allí (si se protege prod, activar el bypass).

---

## [2026-06-21] — Fix del gráfico de precios (slide 05) + bullets
Qué hice:
- **Bug encontrado:** en `chart-precios` las series **"Mínimo mercado" y "Conpro"
  estaban intercambiadas** (p. ej. Aceite mostraba mín 61k / Conpro 35k cuando
  debía ser mín 35k / Conpro 61k). Verificado contra la slide de referencia del
  usuario: al swapear los `data` de esas dos series coinciden exactamente. Corregido.
- Ajusté el gráfico a la referencia: eje **$0–$80.000 paso $10.000** con formato
  `$` (es-CL, punto de miles), **leyenda abajo**, labels **"Precio mínimo / Conpro
  / Precio máximo"**, quité el título de eje "CLP", y "Aceite de oliva" en 2 líneas
  horizontales (label array) para que no se incline.
- `js/charts.js`: agregué opciones `yFmt` (callback de formato del eje) y
  `legendPosition` a `barGroup`/`scales` — con defaults que no afectan a los demás
  gráficos (`chart-precios` es el único `barGroup`).
- `05-mercado.html`: bullets de 3 → **2** con lead-in en negrita ("Supermercado y
  mayoristas" / "Naturistas y especializadas"), kicker a "Análisis de mercado y
  competencia", y ensanché la columna del gráfico (`0.92fr 1.08fr`) para que el
  título del panel no se parta en dos líneas.
- Nota de caché: los `<script src="js/*.js">` no se refrescan con `?r=N` (eso solo
  busta el HTML); para ver cambios de JS hay que hard-reload (Cmd+Shift+R).
Decisiones:
- **Título** actualizado al de la referencia: "Conpro compite con tiendas
  naturistas y especializadas" (el usuario lo confirmó después).
Próximo paso: crear el PR.

---

## [2026-06-21] — Slide 04 → "¿Qué es Conpro?" (diagrama) con la skill
Qué hice:
- Reemplacé `04-propuesta.html` (antes "Cita / Propuesta de valor") por el nuevo
  diseño **"¿Qué es Conpro?"**: diagrama Consumidores → Conpro → Proveedores (SVGs
  de casa+familia, carrito en círculo acento, bodega) + sección "Propuesta de
  valor" con el dato "precios más justos". Integrado con la skill `adaptar-slide`.
- El adjunto venía como **"Bundled Page"**: el HTML real estaba gzip+base64 dentro
  de un manifest, renderizado por un runtime React (`<x-dc>`). Lo descomprimí,
  extraje el diseño del template y de ahí el `<section>`.
- Tokenización: mapeé las variables del diseño (`--ink`/`--mustard`/`--band`/…) a
  los tokens del deck. **Hallazgo:** en el Chrome del deck `var()` SÍ funciona como
  atributo `fill=`/`stroke=` del SVG y reacciona al tema — así que bastó renombrar
  variables, sin convertir ~40 paths a `style=`. Actualicé el "gotcha" de la skill.
- **Fix de contraste:** el carrito y el texto "CONPRO" van DENTRO del círculo de
  acento → deben usar `var(--color-on-accent)`, no `--color-text` (con tema de
  acento claro como Ácido, `--color-text` se aclara y perdía contraste). Probado
  en Cobalto y Ácido: ahora correcto en todos los temas.
- Espaciado: el contenido entra a escala 1.0 pero flotaba alto; repartí la holgura
  subiendo los `margin-top` entre bloques hasta `topGap 24 ≈ bottomGap 29`.
- Mejoré la skill con estos aprendizajes (bundler, regla on-accent, balance de
  gaps cuando hay holgura).
Próximo paso: revisar/mergear; seguir integrando slides con la skill.

---

## [2026-06-21] — Fix de espaciado en Juan + skill `adaptar-slide`
Qué hice:
- **Espaciado de `03-juan.html`:** la slide quedaba encogida por `fitSlide`
  (scale 0.83) y, ya sin escalar, el contenido quedaba pegado al footer (el
  cuerpo tenía `padding-top` pero no `padding-bottom`). Solución: padding
  vertical simétrico en el cuerpo (`padding-top:24px;padding-bottom:32px`) y
  recorte del alto real del contenido (foto, gaps del perfil, ícono "!",
  `margin-top` de la grilla) hasta que entra a **escala 1.0**. Verificado en
  browser: `scale:none`, `topGap = bottomGap = 24px`.
- **Aprendizaje clave:** subir el `padding-bottom` no alcanza si la grilla
  (`flex:1`) desborda su espacio — el contenido se pasa por encima. Primero hay
  que reducir el alto para que quepa a 1.0; recién ahí el padding inferior se
  vuelve aire real.
- **Skill local `adaptar-slide`** en `.claude/skills/adaptar-slide/SKILL.md`
  (se commitea con el repo, no es global). Captura todo el proceso de integrar
  una slide HTML standalone al deck: extraer el `<section>`, borrar el `:root`
  local, header/footer con `data-chrome`, numeración automática, tabla de
  tokens (incluido el gotcha del SVG: `var()` solo dentro de `style`, no en
  `fill=`), y el loop de medir/recortar para el espaciado simétrico. Se dispara
  cuando el usuario traiga un HTML de slide nuevo o pida arreglar espaciado.
Próximo paso: usar la skill con las próximas slides; revisar/mergear.

---

## [2026-06-21] — Rediseño de slides 03-Juan y 18-Costos (integración al deck)
Qué hice:
- Reemplacé `presentacion/03-juan.html` (buyer persona) y `presentacion/18-costos.html`
  (inversión + pie de costos) con diseños nuevos que el usuario hizo por fuera (HTML
  standalone). Los integré al sistema del deck: extraje solo el `<section class="slide">`,
  **eliminé el `:root` local** (redeclaraba los tokens y rompía el cambio de tema), y
  apliqué header/footer estándar con `data-chrome="header"`/`"footer"`.
- Header/footer: footer a **un solo span** ("Escalamiento de Conpro"), quité el segundo
  span "Defensa académica" del original (decisión del usuario: footer igual al resto,
  toggleable vía modo chrome).
- Número de página: dejé el placeholder; lo recalcula `numberSlides()` por posición real.
  **Nota:** por los sub-slides (`10b/14b/17b`), Juan queda en posición 3 y Costos en **21**
  (no 18) — es el comportamiento correcto del sistema, no se hardcodea.
- Tokenización: el pie SVG de Costos tenía hex fijos → pasé los `fill` a `style="fill:var(...)"`
  (accent / text / chart-series-2) y los textos a on-accent / bg / text. Importante:
  `var()` **no funciona** como atributo `fill="..."`; solo dentro de `style`.
- Guardé la foto de Juan en `assets/juan.png` (la pasó el usuario). Íconos lucide
  (`data-lucide`) ya renderizan vía `deck.js`.
Decisiones/bugs:
- Los slides venían a mayor escala (h1 88px, stat 80px) que los tokens del deck (72/66);
  los alineé a los tokens por consistencia; `fitSlide()` protege contra desborde.
- Verificado en browser: ambos render OK y **reaccionan al cambiar tema/typeset**
  (probé Cobalto + Impacto) — confirma que la tokenización quedó bien.
Próximo paso: revisar con el usuario; commit/PR si lo pide.

---

## [2026-06-21] — Botón "Descargar PDF": export headless on-demand (idéntico a la web)
Qué hice:
- **Reactivé el export a PDF** (estaba retirado por verse mal) con un enfoque nuevo: render **headless** que produce un PDF **idéntico** a la web, respetando el **tema/tipografía activos** al apretar el botón.
- **Causa raíz del bug viejo:** reveal 5.x NO tiene un `pdf.css` aparte (vive dentro de `dist/reveal.css`, ya enlazado); su modo print fuerza `display:block!important` y `padding:0!important` en cada `<section>`, rompiendo el layout flex (header/cuerpo/pie) y borrando el `--slide-padding` (80px). Fix en `css/deck.css` bajo `html.reveal-print`: repone flex + `padding:var(--slide-padding)` + oculta selector/controles + `print-color-adjust:exact`. El slide demo (`data-label="Demo plataforma"`) queda exceptuado a `padding:0` (full-bleed a sangre).
- **Arquitectura (decisión del usuario): serverless on-demand en Vercel.** `api/pdf.js` (puppeteer-core + @sparticuz/chromium) abre el propio deployment con `?print-pdf&theme=…&typeset=…`, espera `window.__deckPrintReady` y devuelve `page.pdf()` a 1920×1080 como descarga. `vercel.json`: `maxDuration 60`, `memory 1024` (entran en el plan gratuito). Botón "⤓ Descargar PDF" repuesto en `buildPicker` (deck.js): lee `data-theme`/`data-typeset` actuales, hace `fetch('/api/pdf?…')` y descarga el blob; muestra "Generando…".
- **deck.js:** aplica `?theme=`/`?typeset=` de la URL (validados) antes de `Reveal.initialize`; agrega `pdfMaxPagesPerSlide:1`; la rama `isPrint` ya no llama `window.print()`.
- **`scripts/export-pdf.mjs`** (verificación local con el Chrome del sistema, sin Vercel) + `package.json` (deps).
Decisiones/bugs:
- **Lección (timers en headless):** en print headless los `setTimeout`/`requestAnimationFrame` de la página **se congelan**, así que `__deckPrintReady` NUNCA se seteaba si dependía de ellos (export colgado a 45s). Solución: marcar la señal **síncrona** en la página y mover las esperas (fuentes vía `document.fonts.ready`, asentado de gráficos ~900ms) al **lado Node**, donde los timers sí corren.
- **Lección (worktrees + puerto):** el `localhost:8753` lo tenía tomado un server de OTRO workspace (`lahore`), así que las pruebas pegaban contra otro deck. Para verificar, levantar el server de ESTE worktree en un puerto propio y pasar `--base` al script. (Los `.git` de cada workspace son worktrees del mismo repo: comparten objetos/refs/remoto, pero cada uno tiene su working dir y su rama; CLAUDE.md/devlog son archivos versionados normales — se pushean y mergean por rama.)
- Verificado local 3/3 estable: 31 págs, 1920×1080, ~2 MB, fuentes embebidas (texto vectorial), gráficos Chart.js y slide demo (iframe) renderizan completos.
- No se commitea el PDF generado (`*.pdf` ya ignorado); se agregó `node_modules/` y `.vercel/` a `.gitignore`.
Próximo paso: probar el botón en Vercel (`vercel dev` o deploy preview) — el `/api/pdf` no corre bajo `python3 -m http.server`. Cold start ~5-10s la primera vez.

---

## [2026-06-21] — Alineación con el PPTX v2 (36 slides): 3 slides nuevas + split ingresos/captación
Qué hice (tras mapear `.context/new-deck-v2.pptx`; ver "Delta v2" en `docs/mapeo-pptx-v1.md`):
- 🆕 **`17b-ingresos-demanda.html` = "Ingresos según la demanda"** (NUEVA): tarjeta acento $201.061 + tarjeta "Despacho · Mixto (domicilio + pick up)" + tabla por año (Hogares 60→161, Ingresos $13M→$37M, Año 5 destacado). Reemplaza al `17b` viejo (que era la captación). [PPTX 20]
- 🔄 **`17c-mercado-alcanzable.html`** (= la captación, `git mv` desde `17b`): recortada de 4 a **3 KPIs** (161 · 0,19% · 86.770); el $201.061 se movió a la slide de ingresos. [PPTX 21]
- 🆕 **`20b-pregunta-sostener.html`** = pregunta-ancla "¿Puede Conpro sostener esa rentabilidad…?" (molde cita, igual que `15-vale-la-pena`), antes del divisor de robustez. [PPTX 26]
- 🆕 **`21b-sustentacion.html`** = "Análisis de Sustentación" → 01 Imitación (acento) · 02 Sustitución · 03 Expropiación de renta (molde bullets, igual que recomendaciones). Primer tema de robustez. [PPTX 27]
- ✏️ **`12-techo`**: "no rompe el **techo operacional**". [PPTX 14]
- Build OK (34 slides). QA visual a 1920×1080 (playwright) de las 5 slides: sin desbordes ni solapes. Numeración automática reacomodó todo (no se tocó a mano).
Decisiones/bugs:
- **`19-ganancias` se mantiene** por ahora (el PPTX v2 la eliminó; el usuario decide revisarlo después). No se borró contenido.
- "Despacho Mixto" = **domicilio + pick up** (confirmado por el usuario; primero había puesto "retiro en conserjería").
- Colocación: pregunta-ancla antes del divisor de robustez (paralelo a `15-vale-la-pena`); Sustentación como primer tema de la sección.
- Orden por nombre de archivo: `17b` < `17c`; `20-van` < `20b`; `21-divisor` < `21b` → quedan en la posición correcta sin renumerar.
Próximo paso: decidir definitivamente ganancias; ¿adoptar los rediseños "formato distinto" del PPTX (Juan buyer-persona, Propuesta 2 tarjetas, Cómo funciona, Costos con torta)?; deploy.

## [2026-06-21] — Ajustes lote 1 del PPTX nuevo (compañeras) → deck web
Qué hice (al portar el `Conpro-P3-v1.pptx` re-editado; ver delta en `docs/mapeo-pptx-v1.md`):
- **Sección 05 renombrada** "Robustez y decisión" → **"Resultados y recomendaciones"** en los 5 divisores (`02/09/13/16/21-divisor*`), alineando al PPTX. En `21` cambia también el h2 y las notas.
- **`17-demanda`**: caption del gráfico "escenario base" → **"escenario conservador"** (corrige inconsistencia interna: notas y VAN ya decían conservador).
- **B · `11-resultados-cbo`**: de 4 tarjetas a **3** (se quita "Inversión $295.000"; el dato vive en `10-que-es-cbo`). Grid `repeat(4,1fr)`→`repeat(3,1fr)`.
- **A · `20-van-payback`**: rediseño — se reemplaza la **tabla con TIR** por un **gráfico de barras** (`chart-van`: Pesimista 1,12 · Conservador 2,39 acento · Optimista 3,97 M$), conservando los chips WACC 29,59% + Payback base 3 años. Sin TIR (sigue al PPTX). Nuevo config `chart-van` en `js/deck.js`.
- **C · `17b-ingresos-demanda`**: rediseño completo "**El desafío no es mercado, es captación**" — grilla de 4 KPIs ($201.061/hogar · 161 · 0,19% · 86.770) + **barra de holgura** (track muteado con sliver acento 0,19% + "161 captados" / "≈ 86.600 por captar"). Reemplaza el gráfico de ingresos; se quita el config `chart-ingresos` de `js/deck.js`.

Refinamientos (feedback del usuario, mismo lote):
- **`js/charts.js` · `bar()` con 3 opciones nuevas** (reutilizables): `valueLabelAll` (rotula TODAS las barras, no solo la clave), `colorRamp` (rampa de opacidad del acento vía nuevo helper `withAlpha`: clara la 1ª → opaca la última) y `stagger` (cada barra crece **desde la base** con retardo `dataIndex*220ms`, año 1→5). El plugin `valueLabel` ahora omite la etiqueta mientras la barra sigue pegada a la base, para que el número aparezca junto con la barra.
- **VAN (`chart-van`)**: `valueLabelAll` → número sobre las 3 barras (1,12 / 2,39 / 3,97).
- **Demanda (`chart-demanda`)**: `valueLabelAll` + `colorRamp` + `stagger` → número en cada barra, amarillo de claro (año 1) a oscuro (año 5) y aparición escalonada desde el eje X. Verificado frame-a-frame con playwright.
- **17b**: sliver de la barra de holgura 0,19%→**6%** (pedido: que no se vea tan vacía, aunque no sea representativo) y la frase "captarlos más rápido" en **una sola línea** (`white-space:nowrap`, quité el `max-width`).
- **Animación de gráficos cada vez que se entra a la slide** (pedido): `Charts.replay(canvas)` (reconstruye el gráfico, mismo camino que el cambio de tema) + `initChartsIn` ahora hace `replay` si el canvas ya estaba `inited` (antes solo animaba en la 1ª visita). Aplica a todos los gráficos (consistente con el count-up del hero). Bug encontrado y corregido: `replay` no estaba en el `return` del IIFE de `charts.js` → `Charts.replay is not a function`; verificado con playwright que la barra del año 5 espera su delay (~880ms) y luego crece desde la base. Subí el timeout de impresión PDF a 1900ms para dar margen al stagger.
- **VAN · unidad por barra** (pedido): nuevo `valueLabelFmt` en `bar()`; `chart-van` rotula `$1,12 M / $2,39 M / $3,97 M` (no solo el eje Y).
- **Barras desde abajo hacia arriba en Demanda y VAN** (pedido): `chart-van` ahora también `stagger: true` → las barras crecen desde la base (eje X), escalonadas Pesimista→Conservador→Optimista, igual que Demanda. Verificado por probe (alturas de barra suben de 0 al valor final).
Verificación:
- `build.py` OK; sin "Robustez y decisión" ni `chart-ingresos` residuales. QA visual a 1920×1080 (playwright) de las 5 slides tocadas: sin desbordes ni solapes.
- **Server local en 8753 estaba ocupado por la workspace `nashville`** (servía contenido viejo y confundió el primer QA). Levanté esta workspace en **8755**. Ojo a futuro: verificar el cwd del server (`lsof`) antes de confiar en el link.
Decisiones/bugs:
- El elemento visual de C (barra de holgura) queda **estático pero "animation-ready"** (count-up 0→161 / crecimiento del sliver) para el pase de animaciones (skill Emil), no ahora.
- `chart-van` usa M$ con `valueLabel` (sólo rotula la barra clave, patrón del deck).
Próximo paso (plan aparte): 2 slides **nuevas** del PPTX — pregunta-ancla "¿Puede Conpro sostener…?" y "Análisis de Sustentación" (Imitación/Sustitución/Expropiación). Pendiente decisión: quitar o no `19-ganancias` (el PPTX la eliminó).

## [2026-06-21] — Animaciones (piloto): sistema de entradas + timeline 1→5
Qué hice:
- **Skills de Emil Kowalski instaladas** (`.agents/skills/`): `emil-design-eng`
  (criterio de motion) y `review-animations` (QA). Leídas antes de usar. El criterio
  guía el "feel"; el motor sigue siendo CSS + reveal.js + Chart.js (sin GSAP).
- **`js/anim.js` (nuevo) — orquestador genérico de entradas.** En cada cambio de slide
  (enganchado en `deck.js::onSlide`) hace un *stagger* de los hijos directos del cuerpo
  (`.slide > div`) con `opacity` + `translateY`, easing ease-out fuerte
  (`--ease-out: cubic-bezier(0.23,1,0.32,1)`), `--anim-enter: 460ms`,
  `--anim-stagger: 55ms`. **Sin tocar los 31 partials.** Solo transform/opacity (GPU),
  con transiciones (interrumpibles). Respeta `prefers-reduced-motion` (mantiene opacity,
  sin movimiento). Excluye el demo (`data-no-anim` en `14b`) y el modo `?print-pdf`.
- **Momento firmado slide 06 (timeline 1→5):** el paso activo se resalta en acento y
  avanza 1→5 con **flecha o clic** (fragments invisibles `[data-seq-marker]` →
  `paintSequence` pinta activo/completado/reposo). Línea de progreso con `scaleX` (GPU).
  Idea original del usuario.
- **Count-up de KPIs:** marqué `data-hero` en los 3 stats del slide 08 (activa el
  `animateHero` ya existente, es-CL). Los gráficos Chart.js ya animaban (600ms easeOut).
- **Bullets secuenciales (pedido del usuario):** `paintBullets` en `anim.js` + marcas
  `[data-seq-bullets]`/`[data-seq-bullet]` (con `class="fragment"`) en el slide 27. Los
  bullets aparecen de a uno (flecha/clic); el activo queda a plena opacidad y los ya
  mostrados se atenúan (0.4). Al mostrar TODOS, vuelven todos a opacidad 1 (estado final
  uniforme → respeta el feedback de "bullets parejos"). Aplicado a slides **27 y 07**
  (en 07 unifiqué los marcadores 02/03 a acento, antes en gris → además cumple el
  feedback de "marcadores todos en acento"). FODA (26) excluido a pedido del usuario.
  Verificado en browser (puerto 8761).
- Nuevos tokens de motion en `tokens.css`; `anim.js` añadido al shell del build.
- Regla nueva (pedido del usuario) en `CLAUDE.md` + memoria: **ante cualquier decisión,
  entregar siempre mi recomendación.**
Decisiones/bugs:
- **Auto-QA con criterio `review-animations`:** corregí 2 hallazgos antes de cerrar —
  (1) la línea de progreso animaba `width` (layout) → pasada a `transform: scaleX()`;
  (2) `paintSequence` no respetaba reduced-motion → ahora omite el `scale` (mantiene el
  color, que ayuda a comprender).
- Entrada de **460ms** (>300ms del bar de UI): excepción justificada para deck
  proyectado/explicativo, visto una vez por la audiencia (el bar permite "longer" en
  marketing/explanatory).
- Verificado en browser (slides 06, 08, 27): sin errores de consola; timeline y bullets
  avanzan con flecha y clic; KPIs con valor final correcto; demo sin animación.
- **Caché del server local:** el browser sirve `index.html` cacheado; usar cache-buster
  (`?v=N`) o hard-reload tras cada rebuild para ver los cambios (ya estaba documentado).
- **Conflicto con rama `map-pptx-vs-web-slides`** (revisado, 1 commit por delante de main,
  "chart animations"): toca `js/charts.js` (yo NO lo toqué → sin choque; sus animaciones
  de barras y mi entrada de slide son capas independientes) y `js/deck.js` (sus cambios en
  `CHART_CONFIGS`/`initChartsIn`/print vs mi 1 línea en `onSlide` → hunks separados,
  auto-merge). Conflictos triviales solo en `docs/devlog.md` e `index.html` (regenerado).
  Recomendación: mergear map a main primero, luego rebasar esta rama; evitar editar por-slide
  los archivos que map tocó (divisores 02/09/13/16/21, 11, 17, 17b, 20) — la entrada genérica
  ya los anima sin tocarlos.
- **Puerto por workspace:** el server local quedó en **8761** (no 8753): el 8753 es la
  convención pero choca cuando hay varios workspaces en paralelo (cada uno con su server).
  Otros workspaces estaban en 8755/8757.
Próximo paso: rollout restante → `data-hero` en KPIs (15; 11/20 tras mergear map);
afinar entrada en slides densas vs `fitSlide`. Commit pendiente de OK.

---

## [2026-06-21] — Regla de comunicación concisa + normalización a español neutro
Qué hice:
- `CLAUDE.md` → Comunicación: nueva regla **"conciso pero completo"** (bullets/tablas/diagramas, conclusión primero, sin relleno; el usuario pregunta si algo no queda claro). También en memoria (`user-comms-concise`).
- Normalicé el voseo restante a español neutro: `CLAUDE.md` ("dejá"→"deja", "acá"→"aquí"). El devlog ya estaba en neutro (sin formas voseo). Solo cambió el dialecto, no el contenido; el voseo de los ejemplos citados (línea "vos tenés", "fijate") se deja a propósito.
Próximo paso: mergear PR #1 (incluye demo + estas reglas).

---

## [2026-06-21] — Reglas nuevas en CLAUDE.md (idioma, PRs, workspaces)
Qué hice:
- Documenté tres reglas en `CLAUDE.md`:
  - **Comunicación (sí o sí):** hablar y escribir siempre en español latino neutro, no argentino (sin voseo ni modismos rioplatenses). Aplica a mensajes, comentarios, docs y devlog; los commits de git siguen en inglés. También guardado en memoria del proyecto (`user-language-spanish`).
  - **Git → crear PRs con permisos:** el token activo por defecto es de integración (`ghu_`, vía `GH_TOKEN`) y no puede crear PRs; hay un token OAuth en el keyring (`gho_`) que sí. Workaround: `env -u GH_TOKEN -u GITHUB_TOKEN gh pr create --base main …`. El `git push` normal funciona sin el truco.
  - **Eficiencia y workspaces (Conductor):** recomendar de forma proactiva trabajar en otro workspace cuando una tarea pueda correr en paralelo y ahorre tiempo, evaluando antes el riesgo de conflictos (los generados se arreglan re-buildeando; los partials solo chocan si dos ramas tocan el mismo archivo).
Decisiones/bugs:
- Las entradas viejas del devlog y del propio `CLAUDE.md` quedan en su redacción original (voseo); la regla de español neutro aplica de aquí en adelante, no se reescribe lo previo.
Próximo paso: mergear el PR del demo (#1) y seguir con animaciones (skill Emil Kowalski).

---

## [2026-06-21] — Demo: light mode por default, full-bleed real y flechas sobre el iframe
Qué hice:
- **Light mode por default** en el demo embebido: cambié el estado inicial de la app (`assets/plataforma-demo.html`, `darkMode:true → false`). El toggle sol/luna sigue funcionando, solo cambia el arranque. Fondo del contenedor en `14b-demo-plataforma.html` de `#0F0F0F` → `#faf9f5` para que no haya flash oscuro.
- **El demo usa TODO el espacio (sin "bordes blancos"):** la app es internamente `100vw/100vh`, pero el deck dibuja un lienzo fijo 16:9 escalado dentro de `.slides`, y el letterbox sobrante (ahora claro) se veía como bordes blancos a los lados. Fix en `js/deck.js` (`setupDemoFill`/`syncDemoFill`, llamado en `Reveal.on('ready')`): saco el iframe del demo de `.slides` (que está escalado) y lo monto sobre `.reveal` (que sí cubre toda la ventana) con `position:absolute;inset:0;width/height:100%;z-index:6`. Así el iframe toma el tamaño real de la ventana y su contenido lo llena, sin importar el aspecto. Se muestra solo en su slide (toggle por `display`). `z-index:6` < controles (11)/progreso (10) → las flechas de reveal siguen clickeables.
- **Flechas en todo momento, aunque interactúes con el demo:** un iframe con foco captura el teclado y reveal dejaba de recibir las flechas. Como es same-origin, engancho un `keydown` (fase de **captura**, para que el demo no se lo coma con `stopPropagation`) en el `document` del iframe y reenvío las teclas de navegación (←/→/↑/↓, PageUp/PageDown) a Reveal — salvo si el foco está en un `input`/`textarea` editable del demo (`bridgeIframeNav`).
Decisiones/bugs:
- **Bug encontrado y corregido:** mover el iframe con `appendChild` lo **recarga** (nuevo `contentDocument`); el flag `navBridged` estaba en el iframe, así que el re-attach tras la recarga bailaba y el listener quedaba en el doc viejo (muerto). Movido el flag al **document** (`doc.__navBridged`) y re-attach en cada `load`.
- No se pudo validar el reenvío de flechas con la automatización del browser: el `key` sintético **no entrega keydown reales** ni siquiera en slides normales (no navega reveal). Sí verificado: el listener queda en el doc vivo y un `dispatchEvent('keydown')` sobre el doc del iframe **navega** (15→16). Lógica correcta; la entrega de teclas reales del usuario es estándar (bubble/capture).
- Regla `CLAUDE.md` respetada: el demo **no se anima**; solo se reubica el iframe y se escuchan teclas desde afuera (no se toca su lógica).
Próximo paso: ver en proyección 16:9 real (donde no hay letterbox) que el demo se vea idéntico; seguir con animaciones (skill Emil Kowalski) y deploy.

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
