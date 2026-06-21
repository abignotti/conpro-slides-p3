---
name: mapeo-pptx-web
description: >-
  Mapea un PPTX de referencia ("Conpro-P3-v1.pptx" o similar) contra el deck web
  (presentacion/) y reporta qué cambió, categorizado, actualizando
  docs/mapeo-pptx-v1.md. Úsala cuando el usuario pida "mapea el ppt con las
  slides web", "compara este PPT con la presentación", "qué cambió en el ppt
  nuevo", "haz el mapeo del pptx", o adjunte un .pptx pidiendo comparar contra
  el deck. Específica de ESTE proyecto (Escalamiento de Conpro).
---

# Mapeo PPTX ↔ deck web

Compara un PPTX de referencia (lo que editan las compañeras) contra el deck web
real (`presentacion/`) y entrega: (a) un mapeo slide-por-slide categorizado y
(b) un plan de acción para alinear la web. Además **actualiza el doc vivo**
`docs/mapeo-pptx-v1.md`.

## Cuándo
El usuario pide mapear/comparar un `.pptx` contra las slides web, o adjunta un
PPTX nuevo y quiere saber qué cambió. Suele ser una versión más nueva editada
por las compañeras (mismo nombre `Conpro-P3-v1.pptx`, pero distinto contenido).

## Entradas
- El PPTX a mapear: normalmente un adjunto en `.context/attachments/.../*.pptx`.
  Si hay varios o no está claro cuál, **pregunta** antes de seguir.
- El deck web vive en `presentacion/NN-*.html` (28 slides numeradas + `10b`,
  `14b`, `17b`). Es la fuente de verdad de "lo que ya está".

## Procedimiento

### 1. Extraer el PPTX
Copia el adjunto a `.context/` (ignorado por git) y saca texto + imágenes:
```bash
cp "<ruta-al-adjunto>.pptx" .context/ref.pptx
python3 -m markitdown .context/ref.pptx > .context/ref.md   # texto + notas
grep -c "Slide number" .context/ref.md                       # nº de slides físicas
```
Muchas slides son **imágenes planas** (portada, diagramas, gráficos exportados):
en el `.md` aparecen como `![](ImagenNN.jpg)` sin texto. Para esas hace falta
ver el render:
```bash
python3 /Users/agustin/.claude/skills/pptx/scripts/office/soffice.py \
  --headless --convert-to pdf .context/ref.pptx   # -> .context/ref.pdf
pdftoppm -jpeg -r 90 .context/ref.pdf .context/refslide   # -> refslide-NN.jpg
```
Lee con la tool `Read` las slides **nuevas / muy cambiadas / que son imagen**
(no hace falta ver las 36; enfócate en las dudosas).

### 2. Extraer el contenido del deck web
```bash
cd presentacion && for f in *.html; do echo "#### $f"; python3 -c "
import re;t=open('$f',encoding='utf-8').read()
t=re.sub(r'<script.*?</script>','',t,flags=re.S)
t=re.sub(r'<style.*?</style>','',t,flags=re.S)
t=re.sub(r'<aside[^>]*notes.*?</aside>','',t,flags=re.S)
t=re.sub(r'<[^>]+>',' ',t);print(re.sub(r'\s+',' ',t).strip()[:1200])"; done
```
Datos en gráficos viven en `js/deck.js` (`CHART_CONFIGS`), no en el HTML.

### 3. Comparar y categorizar
Mapea **cada slide física del PPTX** a su partial web y clasifica:

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

### 5. Actualizar el doc vivo
`docs/mapeo-pptx-v1.md` es **doc vivo**. Para una versión nueva:
- **Antepón** una sección nueva arriba: `## ⚠️ Delta vN (recibida <fecha> · N slides)`
  con los cambios reales respecto de la web actual + un mini plan de acción.
- **No edites** las secciones de versiones anteriores (son histórico).
- Convierte fechas relativas a absolutas.

### 6. Responder al usuario
Entrega en el chat:
1. **TL;DR**: qué cambió respecto de la versión previa (los pocos cambios reales).
2. **Tabla completa** PPTX→web con la categoría de cada slide.
3. **Plan**: las slides a crear/rehacer (el trabajo real) + decisiones abiertas
   (p. ej. mantener o quitar una slide solo-web, adoptar o no los rediseños).

No implementes los cambios en el deck salvo que el usuario lo pida: esta skill
**mapea y planifica**; portar las slides es un paso aparte.

## Notas del entorno
- `.context/` está git-ignored: deja ahí PPTX, PDF, JPG y `.md` temporales.
  Nunca commitees el PPTX ni los PDF (también ignorados por `*.pdf`).
- Para previsualizar el deck web: `python3 -m http.server 8753` y abrir
  `index.html`. **Ojo**: otras workspaces (Conductor) pueden tener tomado el
  8753 sirviendo OTRA copia → verifica el cwd del proceso
  (`lsof -a -p <pid> -d cwd -Fn`) o usa otro puerto.
