---
name: mapeo-pptx-web
description: >-
  Mapea un PPTX o PDF de referencia ("Conpro-P3-v1.pptx" / "...-G06.pdf" o
  similar) contra el deck web (presentacion/) y reporta qué cambió, categorizado,
  actualizando docs/mapeo-pptx-v1.md. Trabaja SECCIÓN POR SECCIÓN para no quemar
  contexto. Úsala cuando el usuario pida "mapea el ppt con las slides web",
  "compara este PPT/PDF con la presentación", "qué cambió en el ppt nuevo", "haz
  el mapeo", o adjunte un .pptx/.pdf pidiendo comparar contra el deck. Específica
  de ESTE proyecto (Escalamiento de Conpro).
---

# Mapeo PPTX/PDF ↔ deck web

Compara un deck de referencia (lo que editan las compañeras) contra el deck web
real (`presentacion/`) y entrega: (a) un mapeo slide-por-slide categorizado y
(b) un plan de acción para alinear la web. Además **actualiza el doc vivo**
`docs/mapeo-pptx-v1.md`.

## Cuándo
El usuario pide mapear/comparar un `.pptx` o `.pdf` contra las slides web, o
adjunta uno nuevo y quiere saber qué cambió. Suele ser una versión más nueva
editada por las compañeras (mismo deck, distinto contenido).

## Entradas
- El deck a mapear: adjunto en `.context/attachments/.../*.{pptx,pdf}`. Si hay
  varios o no está claro cuál, **pregunta** antes de seguir.
- **Formato preferido: PDF.** El render del PDF es exactamente lo que se proyecta
  (el `.pptx` exportado vía LibreOffice puede driftear un poco). El PPTX solo
  gana si necesitas las **notas del orador** (markitdown las saca). Para comparar
  diseño/estructura, PDF es lo más fiel.
- El deck web vive en `presentacion/NN-*.html` (numeración **plana**, sin sufijos
  `b` desde 2026-06; ver `ls presentacion/`). Es la fuente de verdad de "lo que
  ya está". Hay slides full-bleed sin texto (demo) → confírmalas por render.

## Estrategia: SECCIÓN POR SECCIÓN (regla dura — no quemar contexto)
NO cargues las ~43 slides del PDF ni los ~41 partials de una sola vez. El deck
está dividido en **5 secciones + Anexos** (por los divisores "SECCIÓN 0N"):

| Sec | Tema | Divisor web |
|---|---|---|
| 01 | El cliente y el negocio | `*-divisor-cliente-negocio` |
| 02 | Caso Base Optimizado | `*-divisor-cbo` |
| 03 | El proyecto de escalamiento | `*-divisor-proyecto` |
| 04 | Modelo financiero | `*-divisor-modelo` |
| 05 | Resultados y recomendaciones | `*-divisor-resultados` |
| — | Anexos (FODA, bibliografía) | `*-divisor-anexos` |

Procesa **una sección a la vez**: ubica su rango de slides en el PDF (entre dos
divisores "SECCIÓN") y sus partials web correspondientes, compáralos, **reporta
esa sección y haz checkpoint** (chat + doc vivo), y recién ahí pasa a la
siguiente. Así el contexto queda acotado y el usuario revisa por bloques.

## Procedimiento

### 1. Extraer el deck de referencia (una vez, todo)
PDF (preferido) — directo, sin conversión:
```bash
cp "<ruta-al-adjunto>.pdf" .context/ref.pdf
pdfinfo .context/ref.pdf | grep -i pages              # nº de páginas físicas
pdftoppm -jpeg -r 90 .context/ref.pdf .context/refslide   # -> refslide-NN.jpg
pdftotext -layout .context/ref.pdf .context/ref.txt   # texto (orden físico)
```
PPTX — solo si necesitas notas del orador:
```bash
cp "<ruta>.pptx" .context/ref.pptx
python3 -m markitdown .context/ref.pptx > .context/ref.md   # texto + notas
python3 /Users/agustin/.claude/skills/pptx/scripts/office/soffice.py \
  --headless --convert-to pdf .context/ref.pptx             # -> .context/ref.pdf
pdftoppm -jpeg -r 90 .context/ref.pdf .context/refslide
```

### 2. Extraer el contenido del deck web (por sección)
```bash
cd presentacion && for f in *.html; do echo "#### $f"; python3 -c "
import re;t=open('$f',encoding='utf-8').read()
t=re.sub(r'<script.*?</script>','',t,flags=re.S)
t=re.sub(r'<style.*?</style>','',t,flags=re.S)
t=re.sub(r'<aside[^>]*notes.*?</aside>','',t,flags=re.S)
t=re.sub(r'<[^>]+>',' ',t);print(re.sub(r'\s+',' ',t).strip()[:1200])"; done
```
Filtra a los archivos de la sección en curso. **Los datos de los gráficos viven
en `js/deck.js` (`CHART_CONFIGS`), no en el HTML** — míralos (nº de series,
labels, valores).

### 3. Comparar — ESTRUCTURA, no solo texto (lección dura)
Por cada slide de la sección: **RENDERIZA** la del PDF (`refslide-NN.jpg`) y
compárala visualmente contra el render del partial web (server local + screenshot
headless, ver Notas). El texto extraído **miente** en slides imagen y oculta
diferencias de estructura. Casos reales que se nos escaparon por mirar solo texto:
- **FODA**: `pdftotext` no extrajo la Fortaleza → pareció "faltante" cuando era
  **idéntica**. (Solo el render lo aclaró.)
- **Márgenes**: el PPT tenía **gráfico de 7 productos + 4 bullets + nota**; la web
  estaba reducida a **3 barras + 2 bullets**. Se reportó como "✏️ wording" cuando
  era un **rework estructural** (🎨/🔄).

Compara explícitamente: **nº de barras/series del gráfico, nº de bullets,
orientación del layout (qué va a la izquierda/derecha)**, no solo las frases. Una
simplificación de gráfico o de estructura es **🎨/🔄, nunca ✏️**.

Clasifica cada slide física del deck de referencia a su partial web:

| Símbolo | Categoría | Significado |
|---|---|---|
| ✅ | **Idéntica** | Mismo contenido; ya está en la web |
| ✏️ | **Minor** | Misma slide, cambió texto/cifras (a veces la web ya está mejor) |
| 🎨 | **Mismo concepto, formato distinto** | La web lo simplificó/rediseñó |
| 🔄 | **Cambiada (rework)** | Hay que rehacer un slide existente |
| 🆕 | **Nueva** | No existe en la web → crear |
| ➖ | **Solo-web** | La web la tiene pero el PPTX la eliminó → decidir |
| 🔁 | **Duplicado obsoleto** | El PPTX arrastra la versión vieja Y la nueva; la web ya consolidó la nueva → ignorar |

### 4. Cuidados (lecciones ya aprendidas)
- **El PPTX trae duplicados**: suele incluir la generación vieja (verbosa) Y la
  nueva de sensibilidad/márgenes/flexibilidad. La web ya quedó solo con las
  limpias → los viejos son `🔁` obsoletos, no acción.
- **Numeración interna del PPTX es poco fiable** (páginas tipo "29/28", saltos):
  no la uses para inferir orden real; usa el orden físico de slides.
- **Slides imagen** (`![](...)`) no tienen texto en markitdown → confírmalas con
  el render JPG.
- **Placeholders WIP** (p. ej. un emoji/smiley azul, "ACA EL VIDEO"): márcalos
  como tales, no como contenido final.
- **Typos del PPTX** (p. ej. "Quiercalidade"): no los copies al portar.
- El PPTX = transición; la **web manda** donde ya está más completa (TIR, tarjeta
  extra, wording afinado). Señala esos casos pero recomienda mantener la web.

### 5. Reportar y hacer checkpoint — POR SECCIÓN
Al terminar **cada sección** (no al final de todo):
1. **Chat**: una mini-tabla de esa sección (PDF# → web#, categoría, qué no clava),
   más las decisiones abiertas de la sección. **Entrega también el link de arranque
   de la sección** (la slide divisor) para que el usuario abra, revise y comente:
   `http://localhost:<puerto>/index.html#/(N-1)` (reveal es 0-index → slide display
   N = `#/(N-1)`; ej. divisor Sec 02 = slide 10 → `#/9`). Levanta el server si no
   está corriendo. Concluye y pasa a la siguiente.
2. **Doc vivo** `docs/mapeo-pptx-v1.md`: antepón **una sola** `## ⚠️ Delta vN`
   arriba e ir **agregándole** los hallazgos sección por sección (no reescribas
   las versiones viejas — son histórico). Convierte fechas relativas a absolutas.

Cuando termines todas las secciones, cierra con un **TL;DR global** (los pocos
cambios reales) + el **plan**: slides a crear/rehacer + decisiones abiertas.

No implementes los cambios en el deck salvo que el usuario lo pida: esta skill
**mapea y planifica**; portar las slides es un paso aparte.

## Notas del entorno
- `.context/` está git-ignored: deja ahí PPTX, PDF, JPG y `.md` temporales.
  Nunca commitees el PPTX ni los PDF (también ignorados por `*.pdf`).
- Para previsualizar el deck web: `python3 -m http.server 8753` y abrir
  `index.html`. **Ojo**: otras workspaces (Conductor) pueden tener tomado el
  8753 sirviendo OTRA copia → verifica el cwd del proceso
  (`lsof -a -p <pid> -d cwd -Fn`) o usa otro puerto.
- **Render de un partial web para comparar 1:1 con el PDF** (headless, reveal es
  0-indexed → slide display N = `#/(N-1)`; usa `--virtual-time-budget` para que
  el gráfico alcance a dibujarse):
  ```bash
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless \
    --disable-gpu --hide-scrollbars --window-size=1280,720 \
    --virtual-time-budget=3500 --screenshot=.context/shotNN.png \
    "http://localhost:<puerto>/index.html#/<N-1>"
  ```
