# Sistema de diseño — generar moldes, íconos y recursos desde la base

> Documento de diseño operativo del deck (lienzo 1920×1080, reveal.js). Consolida
> `docs/fuentes/{sistema-diseno,design-tokens,guia-moldes,que-no-hacer}.md` y la skill
> `adaptar-slide`, y llena los vacíos para poder **crear moldes, íconos y recursos nuevos de
> forma consistente**. Si vas a integrar un HTML externo al deck, usa la skill `adaptar-slide`
> (este doc es la referencia de diseño; la skill es el procedimiento de integración).

---

## 1. Grid y baseline

- **Lienzo fijo:** 1920×1080 px. `css/deck.css` fija `section.slide` a ese tamaño con
  `display:flex; flex-direction:column; justify-content:space-between`.
- **Unidad base:** `--space-unit: 8px`. Todo espaciado en múltiplos de 8 (8/16/24/32/40).
- **Padding del slide:** `--slide-padding: 80px` (margen exterior en los 4 lados).
- **Ancho de contenido:** `--content-max: 1100px` para bloques de texto largo (lectura cómoda).
- **Región útil del cuerpo:** ≈ **826px** de alto (1080 − header − footer − paddings). Es el
  presupuesto vertical real: si el contenido lo supera, `fitSlide()` lo encoge (malo). Diseña
  para caber a **escala 1.0**.

## 2. Anatomía del slide (estructura estándar)

Tres zonas. El **header y el footer son fijos**; el **cuerpo** (primer `<div>` hijo) es lo único
que `fitSlide()` escala.

```html
<section class="slide" data-label="Nombre del molde"
  data-speaker-notes="Resumen para el orador."
  style="background:var(--color-bg);color:var(--color-text);font-family:var(--font-body);
         padding:var(--slide-padding);display:flex;flex-direction:column;
         justify-content:space-between;overflow:hidden;">

  <!-- HEADER: sección (izq) + número placeholder (der). numberSlides() reescribe el número. -->
  <header data-chrome="header"
    style="display:flex;justify-content:space-between;align-items:flex-end;
           padding-bottom:22px;border-bottom:1px solid var(--color-grid);">
    <span style="font-size:var(--scale-caption);font-weight:600;letter-spacing:0.2em;
                 text-transform:uppercase;color:var(--color-text-muted);">Sección</span>
    <span style="font-size:var(--scale-caption);font-weight:500;letter-spacing:0.16em;
                 color:var(--color-text-muted);font-variant-numeric:tabular-nums;">NN / 28</span>
  </header>

  <!-- CUERPO: el único bloque que fitSlide escala. Usa padding vertical simétrico. -->
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
    <!-- contenido del molde -->
  </div>

  <!-- FOOTER: un solo span. -->
  <footer data-chrome="footer"
    style="display:flex;justify-content:space-between;align-items:center;
           padding-top:22px;border-top:1px solid var(--color-grid);">
    <span style="font-size:var(--scale-caption);letter-spacing:0.06em;
                 color:var(--color-text-muted);">Título del proyecto</span>
  </footer>

  <aside class="notes">Notas del orador (el detalle va aquí, no en texto chico al pie).</aside>
</section>
```

**Reglas duras de estructura:**
- **1 `<section class="slide">` por archivo.** Sin `<head>`, `<style>`, `:root` local, wrapper de
  escala ni `<script>` propios (el deck los provee). Un `:root` local **pisa el tema** → la slide
  deja de reaccionar al cambio de tema/typeset.
- **No pongas `width`/`height`** en el section: los fija `deck.css`.
- **Número automático:** deja el placeholder `NN / 28` en el header; `numberSlides()` lo
  sobrescribe según la **posición real**. Nunca hardcodear ni renumerar a mano.
- **Notas en `<aside class="notes">`**, no en captions pequeñas al pie.

## 3. Tokens de escala — cuándo usar cada uno

Los tamaños en px no rompen el tema (solo color y familia lo hacen), pero usa los tokens de
escala cuando calcen, para coherencia.

| Token | Valor | Úsalo para |
|---|---|---|
| `--scale-hero` | 168px | Un número/dato gigante protagonista (molde dato-hero). |
| `--scale-h1` | 72px | Título principal del slide. |
| `--scale-h2` | 40px | Subtítulos, encabezados de sección dentro del slide. |
| `--scale-stat` | 66px | Cifras destacadas en KPI cards / stat grid. |
| `--scale-body` | 26px | Texto de cuerpo (mínimo legible al proyectar). |
| `--scale-caption` | 24px | Header/footer, etiquetas, pies. |
| `--scale-kicker` | 24px | Kicker (etiqueta uppercase sobre el título). |
| `--weight-display` | 700 | Peso de titulares. |

**Tipografía:** `var(--font-display)` para titulares, `var(--font-body)` para cuerpo. El deck real
usa typeset **Corporativo** (display = Montserrat, body = Inter); los moldes deben ser
typeset-agnósticos (nunca nombrar una familia a mano).

> **Texto ≥ 24px** a escala 1920×1080, salvo excepción puntual justificada.

## 4. Color — paleta y uso del acento

Cada tema reescribe solo los tokens de color. **Nunca hardcodees un color**: usa el token.

| Token | Rol |
|---|---|
| `--color-bg` / `--color-bg-alt` | Fondo / fondo alterno (tarjetas, bandas). |
| `--color-text` / `--color-text-muted` | Texto principal / secundario. |
| `--color-accent` | Acento (un solo acento por slide). |
| `--color-on-accent` | **Texto/íconos SOBRE el acento** (clave de contraste). |
| `--color-negative` | Serie "mala" en gráficos (escenario pesimista). |
| `--color-grid` | Líneas, bordes, hairlines. |
| `--chart-series-1/2/3` | Series de gráfico (1 = acento, 2/3 neutros). |

**Regla de contraste (la que más se rompe):** lo que va ENCIMA del acento (texto o ícono dentro de
un relleno `var(--color-accent)`) usa `var(--color-on-accent)`, **no** `var(--color-text)`. En el
tema base coinciden y el bug pasa desapercibido; en un tema de acento claro (p. ej. **Ácido**) el
ícono queda sin contraste. **Prueba siempre un tema de acento claro.**

Guía de acento: preferir el acento como **bloque/relleno/subrayado** con `--color-on-accent`
encima, más que como texto suelto sobre fondo claro. Un dato clave por slide.

## 5. Sistema de íconos

- **Librería:** **Lucide**. Atributo nativo `data-lucide="nombre"` — `deck.js` llama
  `lucide.createIcons()`. No hace falta script propio.
- **Banco de referencia:** molde `22-iconografia.html` (18 íconos curados, grilla de 6 columnas).
- **Color:** heredan `--color-text` por defecto. Dentro de un relleno de acento → el ícono debe
  tomar `--color-on-accent` (regla de contraste).
- **Tamaño/stroke (recomendado):** caja de ícono según escala de tamaños (§6): `--size-sm` (34px)
  para íconos en línea, `--size-md` (46px) para íconos en círculo/badge; stroke por defecto de
  Lucide (≈1.6–2). Mantener el mismo tamaño dentro de un mismo grupo.
- **Lucide vs SVG custom:** usa Lucide para íconos genéricos (transporte, datos, alianzas, etc.).
  Usa **SVG propio** solo para marcas/diagramas específicos (logo, flujos, pie charts). En SVG,
  `fill`/`stroke` aceptan `var(--token)` como atributo y reaccionan al tema (verificado); para
  `<text>`/`font-family` conviene `style="…"`.

## 6. Escalas propuestas para componentes (centralización futura)

Para evitar hardcodes repetidos (ver auditoría en `docs/playbook-trabajo-con-ia.md` §B2), la base
debería incluir estas escalas como tokens. **Aditivas** — no romper el deck vivo.

| Familia | Tokens sugeridos | Reemplaza hardcodes como |
|---|---|---|
| Tamaño de caja | `--size-xs:16px; --size-sm:34px; --size-md:46px; --size-lg:74px` | `width:46px;height:46px` (×28) |
| Radio | `--radius-sm:4px; --radius-md:9px; --radius:12px; --radius-pill:999px` | `border-radius:9px` (×29) |
| Gap | `--gap-xs:8px; --gap-sm:12px; --gap-md:16px; --gap-lg:24px; --gap-xl:40px` | `gap:14px` (×77) |
| Peso | `--weight-regular:500; --weight-medium:600; --weight-bold:700; --weight-black:800` | `font-weight:600` (×186) |
| Animación de chart | `--chart-anim-duration:600ms; --chart-anim-easing:var(--motion-ease); --chart-anim-stagger:220ms` | `duration:600/650` en `charts.js` |

## 7. Anatomía de componentes reutilizables

- **Card / panel:** fondo `var(--color-bg-alt)`, `border-radius:var(--radius)`, padding interior
  24–32px, borde opcional `1px solid var(--color-grid)`.
- **Stat / KPI:** cifra en `--scale-stat` con `font-variant-numeric:tabular-nums`, label en
  `--scale-caption` uppercase muted; una de las cards en bloque de acento (`--color-accent` +
  `--color-on-accent`).
- **Hairline / separador:** `1px solid var(--color-grid)` (header/footer, divisiones de columnas).
- **Regla de acento:** barra `height:6px; background:var(--color-accent);
  border-radius:var(--radius-pill)` bajo un dato hero.
- **Tabla:** cabecera uppercase muted, fila clave con `--color-bg-alt`, número clave en acento;
  ejes/valores con `tabular-nums`.

## 8. Movimiento

Tokens en `css/tokens.css`: `--anim-enter: 460ms`, `--anim-stagger: 55ms`, `--anim-rise: 14px`,
`--ease-out: cubic-bezier(0.23,1,0.32,1)`, `--flow-stagger: 160ms`, `--count-duration: 1200ms`.

- **Entradas** (criterio Emil Kowalski): ease-out fuerte, < 600ms, stagger corto (30–80ms). El
  motor genérico (`js/anim.js`) anima sin tocar el partial.
- **Gráficos entran solo con fade** (sin `translateY`) — corregido globalmente (`noRiseFor`).
- **Conteo ascendente** para cifras grandes con `--count-duration`.
- **El demo de plataforma NO se anima** (producto embebido).
- **Pendiente de centralizar:** las duraciones de Chart.js están hardcodeadas (ver §6).

## 9. Do / Don't (resumen visual)

| ✅ Sí | ❌ No |
|---|---|
| Una idea por slide, dato clave GRANDE | Varias ideas / texto chico y denso |
| Un acento por slide, como relleno | Multi-color, neón, jerarquía por color |
| Ejes desde cero, sin gridlines pesadas | Truncar ejes, gridlines/sombras pesadas |
| Texto ≥ 24px; detalle en `aside.notes` | Captions chicas al pie (no se leen al proyectar) |
| `var(--token)` siempre | Colores/fuentes hardcodeados |
| `justify-content:flex-start` si hay mucho contenido | `center` con contenido que desborda hacia arriba |
| `--color-on-accent` sobre acento | `--color-text` sobre acento |

## 10. Checklist para crear un molde nuevo
- [ ] 1 `<section class="slide">` por archivo; sin `<head>`/`:root`/wrapper/scripts propios.
- [ ] Header con `data-chrome="header"` + placeholder `NN / NN`.
- [ ] Footer con `data-chrome="footer"` y un solo span.
- [ ] `<aside class="notes">` con notas.
- [ ] Colores y fuentes vía `var(--…)`; SVG con tokens en `fill`/`stroke`.
- [ ] Texto ≥ 24px; un acento; `--color-on-accent` sobre el acento.
- [ ] Contenido NOMINAL/placeholder (no datos reales de un proyecto): es biblioteca reutilizable.
- [ ] Íconos Lucide con `data-lucide` (o SVG propio tokenizado).
- [ ] `python3 scripts/build.py` sin errores → revisar en `moldes.html`.
- [ ] **Reacciona al cambiar tema/typeset** (probar uno oscuro de acento claro, p. ej. Ácido).
- [ ] Cabe a `scale:none` con aire superior ≈ inferior (medir con el snippet de `adaptar-slide`).

## Boilerplate
Copia el bloque de la **§2** como punto de partida, o duplica el molde existente más cercano en
`moldes/` (p. ej. `02-dato-hero.html`, `11-kpi-cards.html`, `07-grafico-barras.html`) y reemplaza
el contenido del cuerpo.

---

### Fuentes consolidadas
`docs/fuentes/sistema-diseno.md` · `design-tokens.md` · `guia-moldes.md` · `que-no-hacer.md` ·
skill `.claude/skills/adaptar-slide/SKILL.md` · `css/tokens.css` · `css/deck.css` · `js/deck.js`
(`numberSlides`, `fitSlide`) · `js/anim.js` · `js/charts.js`.
