---
name: adaptar-slide
description: >-
  Integra una slide HTML standalone (diseñada por fuera del deck) a la
  presentación "Escalamiento de Conpro": le aplica header/footer estándar,
  numeración automática, tokens de tema/typeset y el ajuste de espaciado
  vertical simétrico. Úsala SIEMPRE que el usuario traiga un HTML de slide
  nuevo o un rediseño para meter en el deck — frases como "integra esta
  slide", "agrega esta diapositiva", "reemplaza la slide de X con este HTML",
  "adapta este slide al deck", "mete este HTML a la presentación", o cuando
  adjunte un .html que es una slide suelta (con su propio <head>/:root/wrapper
  de escala). También aplica cuando una slide ya integrada "queda mal de
  espaciado / pegada al footer / muy abajo / desbordada".
---

# Adaptar una slide al deck Conpro

## Qué hace
Toma un `<section>`/slide diseñado por fuera (documento HTML completo, con su
propio `:root`, fuentes y wrapper de escala) y lo convierte en un partial del
deck en `presentacion/NN-nombre.html` que:
- usa el header/footer estándar (toggleable vía `data-chrome`),
- numera la página solo por posición real,
- hereda colores y tipografía del tema/typeset activos (vía tokens),
- y **encaja verticalmente con aire simétrico arriba y abajo** (sin quedar
  pegado al footer ni encogido por `fitSlide`).

Lee primero `CLAUDE.md` del repo (reglas duras: 1 archivo por slide, build,
nunca tocar `index.html` a mano, español neutro). Esta skill asume esas reglas.

## Contexto del deck (por qué cada paso importa)
- El build (`python3 scripts/build.py`) concatena los partials de
  `presentacion/` (ordenados por prefijo `NN-`) dentro del cascarón reveal.js y
  genera `index.html`. **Valida que cada archivo tenga exactamente 1
  `<section class="slide">`.**
- `js/deck.js`:
  - `numberSlides()` reescribe el número buscando `[data-page]` o el `<span>`
    del header cuyo texto matchee `N / N`. Por eso el header DEBE tener
    `data-chrome="header"` y un span placeholder `NN / 28`. El número refleja la
    **posición real** (los sub-slides `10b/14b/17b` cuentan), no se hardcodea.
  - `fitSlide()` escala el cuerpo hacia abajo (mín 0.75) solo si
    `content > region + 2`. Encoger no es un fix de diseño: si una slide está a
    `scale(0.83)` se ve chica y desbalanceada. **El objetivo es scale 1.0.**
- `css/deck.css` fija `section.slide` a 1920×1080 con `display:flex;
  flex-direction:column;justify-content:space-between`. El header y el footer
  quedan fijos; el cuerpo (primer `<div>` hijo) es lo que `fitSlide` escala.
- Tokens en `css/tokens.css`: 9 temas × 7 typesets. El deck real se construye
  con typeset **Corporativo** (display = Montserrat, body = Inter).

## Paso 1 — Extraer el `<section>`
Del HTML adjunto, conserva SOLO el contenido del slide y elimina todo el resto:
`<!DOCTYPE>`, `<head>`, `<style>`, el `<div class="slide-wrapper">`/wrapper de
escala, y los `<script>` propios (de escala o de lucide — el deck ya los provee).

- Convierte el `<div class="slide">` (o equivalente) en
  `<section class="slide" data-label="..." data-speaker-notes="..." style="...">`.
- Estilo inline del section, idéntico al resto de `presentacion/` (NO pongas
  `width/height`, los fija `deck.css`):
  ```
  background:var(--color-bg);color:var(--color-text);font-family:var(--font-body);
  padding:var(--slide-padding);display:flex;flex-direction:column;
  justify-content:space-between;overflow:hidden;
  ```

## Paso 2 — Eliminar el `:root` local (CRÍTICO)
Borra por completo el bloque `:root { --color-... }` que venía en el `<style>`.
Si se deja, **redeclara los tokens y pisa el tema** → el cambio de tema/typeset
deja de afectar la slide. Los tokens los provee `css/tokens.css`.

## Paso 3 — Header, footer y número
- **Header**: `<header data-chrome="header" ...>` con dos spans:
  - izq: `Evaluación de Proyectos` (uppercase, muted, `var(--scale-caption)`)
  - der: placeholder `NN / 28` con `font-variant-numeric:tabular-nums`
    (cualquier `N / N`; `numberSlides()` lo sobrescribe).
- **Footer**: `<footer data-chrome="footer" ...>` con **un solo span**
  `Escalamiento de Conpro`. Si el HTML traía un segundo texto (p. ej. "Defensa
  académica"), **quítalo** — el footer del deck es de un solo span y se activa/
  desactiva con el modo chrome. Copia el markup exacto de cualquier partial de
  `presentacion/` para mantener estilos.
- Agrega `<aside class="notes">…</aside>` con las notas del orador (el detalle
  va aquí, no en texto chico al pie).

## Paso 4 — Tokenizar lo hardcodeado
Lo que cambia con el tema/typeset SÍ o SÍ son **colores y familias de fuente**.
Los tamaños en px no rompen el tema (solo color y familia lo hacen), así que
pueden quedar en px; igual conviene usar los tokens de escala cuando calzan.

| En el HTML | Reemplazar por |
|---|---|
| `#FBFAF7` / fondo | `var(--color-bg)` |
| `#F2EEE4` / fondo alt | `var(--color-bg-alt)` |
| `#1A1A17` / texto | `var(--color-text)` |
| `#76726A` / texto tenue | `var(--color-text-muted)` |
| `#FCCE4E` / acento | `var(--color-accent)` |
| texto sobre acento | `var(--color-on-accent)` |
| `#E4DECF` / líneas/bordes | `var(--color-grid)` |
| gris neutro de gráfico | `var(--chart-series-2)` o `--chart-series-3` |
| `"Montserrat"` (títulos) | `var(--font-display)` |
| fuente de cuerpo | `var(--font-body)` |
| título principal | `var(--scale-h1)` (72) |
| número/stat grande | `var(--scale-stat)` (66) |
| kicker / caption | `var(--scale-kicker)` / `var(--scale-caption)` |
| radios | `var(--radius)` |

**Gotcha SVG:** `var()` NO funciona como atributo de presentación
(`fill="var(--color-accent)"` se ignora). Tiene que ir dentro de `style`:
`style="fill:var(--color-accent)"`. Igual para `font-family`/`fill` en `<text>`.
En un pie/torta: porciones → accent / text / chart-series-2; los `<text>` encima
→ `on-accent` (sobre acento), `bg` (sobre porción oscura), `text` (sobre clara).

**Imágenes:** si la slide referencia `assets/foo.png`, confirma que el archivo
exista en `assets/` (ruta relativa desde `index.html` en la raíz). Si no está,
pídeselo al usuario y guárdalo; como fallback usa el placeholder `.image-slot`.

**Íconos lucide:** el atributo nativo `data-lucide="nombre"` ya renderiza
(`deck.js` llama `lucide.createIcons()`). No hace falta script propio.

## Paso 5 — Build, servir y AJUSTE DE ESPACIADO (el paso que más cuesta)
Construye y sirve **desde el workspace**, con puerto propio (hay varios servers
de otros workspaces corriendo) y cache-bust:
```bash
python3 scripts/build.py
# server propio; usa ?r=N en la URL para evitar caché del browser
python3 -m http.server 8753   # si está ocupado, otro puerto
```
Abre la slide (`#/N`, índice 0-based de reveal) y verifica en el browser.

### El problema típico y cómo resolverlo
El cuerpo suele **desbordar** (el contenido del diseño externo es más alto que
la región útil ≈ 826px). Entonces `fitSlide()` lo encoge (p. ej. `scale(0.83)`)
y la slide se ve chica, "muy abajo" y con aire desigual. Además, si el cuerpo
tiene `padding-top` pero no `padding-bottom`, el contenido queda **pegado al
footer** mientras arriba sí hay aire.

**Objetivo:** `scale` = `none` (cabe a 1.0) **y** gap superior ≈ gap inferior.

**Receta:**
1. Da al cuerpo (primer `<div>` hijo del section) padding vertical simétrico,
   p. ej. `padding-top:24px;padding-bottom:32px;` (el de abajo un poco mayor
   porque la grilla tiende a comérselo).
2. Mide en el browser con este snippet (vía la tool de JS del navegador). Da el
   `scale` aplicado y los gaps reales en px del lienzo (1080):
   ```js
   const s=document.querySelectorAll('section.slide')[IDX]; // IDX = posición 0-based
   const h=s.querySelector('[data-chrome="header"]'), f=s.querySelector('[data-chrome="footer"]');
   const body=s.querySelector(':scope > div'), k=body.children[0];
   const grid=[...body.children].find(c=>getComputedStyle(c).display==='grid')||body.lastElementChild;
   const sf=1080/s.getBoundingClientRect().height;
   JSON.stringify({scale:body.style.transform||'none',
     content:body.scrollHeight, region:body.clientHeight,
     topGap:Math.round((k.getBoundingClientRect().top-h.getBoundingClientRect().bottom)*sf),
     bottomGap:Math.round((f.getBoundingClientRect().top-grid.getBoundingClientRect().bottom)*sf)});
   ```
3. Si `content > region` (hay scale): **reduce el alto real del contenido**, no
   subas el padding. El padding-bottom no sirve mientras la grilla desborde su
   espacio: el contenido se pasa por encima de él. Recorta lo que de verdad
   manda en el alto (medir qué columna/bloque es el más alto ayuda):
   - foto/imagen: bajar `min-height` y `height`,
   - gaps de listas/íconos, tamaños de íconos, números gigantes ("!"/stats),
   - `margin-top` de la grilla, paddings de cards y de la franja final,
   - tamaños de subtítulos bespoke (34/40/42px) un par de puntos.
4. Reconstruye, recarga con `?r=N` nuevo, vuelve a medir. Itera hasta que
   `scale:none` y `topGap ≈ bottomGap` (un valor cómodo ≈ 24px).

**Por qué funciona:** una vez que el contenido cabe a escala 1.0, el
`padding-bottom` deja de ser absorbido por el desborde y se vuelve aire real,
simétrico con el de arriba. (Cuando igual queda un leve scale, el padding se
escala en proporción, así que el aire se conserva — pero apunta a 1.0.)

### Pista de medición rápida sin browser
`fitSlide` usa `region = body.clientHeight` (≈826 tras header/footer/padding) y
`content = body.scrollHeight`. La región útil del cuerpo ronda los **826px**;
si el contenido la supera, hay que recortar la diferencia.

## Cierre
- No edites `index.html`/`moldes.html` a mano (se generan).
- Manda al usuario el link (`http://localhost:PORT/index.html#/N`).
- Devlog continuo: agrega una entrada en `docs/devlog.md` tras integrar la(s)
  slide(s) (agrupando los fixes de espaciado en la misma entrada). No edites
  entradas viejas.
- Verifica que la slide **reaccione al cambiar tema/typeset** (prueba uno
  oscuro como Cobalto + Impacto): si algún color o fuente no cambia, quedó un
  hardcode o el `:root` local sin borrar.

## Checklist final
- [ ] 1 `<section class="slide">` por archivo; sin `<head>`/`:root`/wrapper/scripts propios.
- [ ] Header con `data-chrome="header"` + placeholder `NN / 28`.
- [ ] Footer con `data-chrome="footer"` y un solo span.
- [ ] `<aside class="notes">` con notas del orador.
- [ ] Colores y fuentes vía `var(--...)`; SVG con `style="fill:var(...)"`.
- [ ] Imagen presente en `assets/` (o placeholder); íconos lucide con `data-lucide`.
- [ ] `python3 scripts/build.py` sin errores.
- [ ] En el browser: `scale:none` y `topGap ≈ bottomGap`.
- [ ] Reacciona a tema/typeset.
- [ ] Entrada en `docs/devlog.md` + link enviado.
