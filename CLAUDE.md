# CLAUDE.md — Escalamiento de Conpro

Reglas para cada sesión. El *qué* construimos vive en `docs/project-spec.md`;
el *dónde* vamos, en `docs/devlog.md`. Este archivo es solo reglas.

## Convenciones (reglas duras — estructura/proceso)
- **1 archivo por slide.** Los moldes (biblioteca reutilizable de 22 templates)
  viven en `moldes/NN-molde.html`; el deck real se arma en `presentacion/`
  (un molde puede copiarse y usarse en varios slides). Para cambiar un slide:
  editar su partial y correr el build. **Nunca editar `index.html`/`moldes.html`
  a mano** — se generan.
- **Build:** `python3 scripts/build.py` regenera `moldes.html` (desde `moldes/`)
  e `index.html` (el deck real, desde `presentacion/`).
- **Número de slide = automático.** El número (arriba-derecha) lo calcula
  `js/deck.js` (`numberSlides`) según la **posición real** del slide en el deck.
  **Nunca lo hardcodees ni renumeres a mano**: al agregar/quitar/reordenar
  slides, se recalcula solo (por eso no hay que tocar todos los archivos en cada
  iteración). En un slide nuevo, dejá en el header el `<span>` placeholder
  (`NN / 28`, o un `data-page` vacío) y el JS lo sobrescribe. Slides a pantalla
  completa sin header (p. ej. el demo) quedan sin número, pero igual cuentan la
  posición. El total ("/ 28") se omite a propósito.
- **Diseño tokenizado:** colores/escala/espaciado viven como variables CSS en
  `css/tokens.css` (9 temas × 7 typesets, combinables vía `<html data-theme
  data-typeset>`). Usa `var(--token)`; si necesitas un valor nuevo, **agrega un
  token**, no lo hardcodees (si no, se rompe el cambio de tema).

- **Enviar el link tras cada cambio.** Después de cualquier modificación al deck,
  correr el server local (`python3 -m http.server 8753`) y **mandarle el link** al
  usuario (`http://localhost:8753/index.html`, con `#/N` si aplica al slide
  tocado). No esperar a que lo pida.

## Guías de estilo (punto de partida — iterables, no dogma)
<!-- Nacieron del handoff de diseño. Ajústalas cuando algo se vea mejor en el
     momento; anota el cambio en Lecciones para no repetir la discusión. -->
- Acento (amarillo/lime/…) preferentemente como bloque/relleno/subrayado con
  `--color-on-accent` encima, más que como texto suelto sobre fondo claro.
- Gráficos: heredan tokens, ejes desde cero, sin gridlines pesadas, leyendas
  redundantes ni sombras.
- Texto ≥ 24px (a escala 1920×1080), salvo que algo puntual pida otra cosa.
- **Nada de líneas de caption/nota chicas y densas al pie de la slide** — no se leen
  al proyectar. El dato clave va GRANDE dentro de la slide; el contexto/detalle va en
  las notas del orador (`aside.notes`), no en texto chico.

## Skills
- ANTES de usar una skill (la de animaciones de **Emil Kowalski**, o cualquiera
  que sumemos con `find skills`), **lee su SKILL.md**. No escribas su API de memoria.
- reveal.js y Chart.js no tienen SKILL.md local → usamos los patrones ya probados
  (documentados en `docs/devlog.md` y en la memoria del proyecto).
- **El demo de la plataforma NO se anima.** Cuando hagamos animaciones, el slide
  `presentacion/14b-demo-plataforma.html` (y su `assets/plataforma-demo.html`) se
  deja **tal cual está**: es un producto embebido, no se le aplican transiciones
  ni efectos de entrada.

## Cierre de sesión
Cuando diga "cierra la sesión": corre el build (`python3 scripts/build.py`)
y verifica que el deck abra sin errores en el server local
(`python3 -m http.server 8753`). Si todo bien, agrega una entrada NUEVA arriba en
`docs/devlog.md` (fecha, hito, qué hice, decisiones/bugs, próximo paso) y haz
commit. Si algo falla, arréglalo o avísame antes de commitear. Nunca edites
entradas viejas.
- **Recordatorio:** si el usuario menciona una plantilla de feedback por llenar,
  recuérdaselo al cerrar la sesión.
- **Devlog continuo:** además del cierre, escribe una entrada después de cada
  feature/implementación (agrupando varios fixes en una sola entrada).

## Git
- Commits **en inglés**.
- Flujo por ramas: feature branch → PR → merge a `main` (PR sobre todo si puede
  haber conflicto). No es regla dura: cuando convenga, varios commits en una misma
  rama para no perder la sesión.
- Nunca commitear: el PPTX generado (`Escalamiento-Conpro.pptx`), `build/`, ni
  nada en `.context/` (ya ignorado).

## Lecciones
<!-- Vacío al inicio. Cuando me corrijas (tecla #) o salga una lección durable del
     "Decisiones/bugs" del devlog, queda acá y no se repite. -->
- **Slides con mucho contenido → usar `justify-content:flex-start` en el cuerpo, no
  `center`.** Con `center`, el contenido que excede la región desborda hacia ARRIBA y
  se monta sobre el header; `fitSlide` solo detecta/escala el desborde hacia abajo.
