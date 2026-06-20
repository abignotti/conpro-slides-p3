# Instrucciones de implementación — Deck Conpro (para Claude Code)

> **Léeme primero.** Orquesto los demás documentos y defino el orden de trabajo.

## Objetivo
Construir la presentación "Escalamiento de Conpro" en **reveal.js**: premium,
fondo oscuro, lista para proyectar y exportar a PDF.

## Documentos y su rol (fuente de verdad de cada cosa)
| Documento | Es la fuente de verdad de… |
|---|---|
| `esqueleto-deck.md` | El **orden** de las slides y qué **molde** usa cada una |
| `guia-moldes.md` | **Cómo se ve** y qué contiene cada molde (1-22) |
| `estructura-slides-dialogo.md` | El **contenido** concreto de cada slide |
| `sistema-diseno.md` | Reglas de diseño, paleta, tipografía, arquetipos |
| `design-tokens.md` | Los **valores exactos** (CSS variables). Cópialos a `:root` |
| `que-no-hacer.md` | Lo **prohibido**. Tiene prioridad sobre cualquier impulso decorativo |
| `datos-clave.md` | Las **cifras** |
| `guion.md` | La **narración oral** (contexto). NO es el texto de las slides |

> Si tienes el output de Claude Design (los moldes ya implementados en HTML/CSS),
> úsalo como base en vez de construir desde cero.

## Reglas críticas
1. **El guion es lo que se dice en voz alta, no lo que va escrito.** El texto de
   cada slide sale de `estructura-slides-dialogo.md` y es **conciso**. Nunca
   vuelques párrafos del guion dentro de una slide.
2. **Los datos no son definitivos.** Úsalos como placeholders y deja un comentario
   marcando los que haya que verificar. No inventes cifras nuevas.
3. **Una idea por slide**, jerarquía por **tamaño**, un solo **acento** por slide.
   Respeta `que-no-hacer.md` al pie de la letra.

## Orden de trabajo (NO hagas todo de una)
1. Monta reveal.js, carga las fuentes (Fraunces, Inter) y pega los tokens de
   `design-tokens.md` en `:root`.
2. Construye los **moldes base** como plantillas reutilizables. Empieza por los
   que definen el lenguaje: **1 (portada), 2 (dato hero), 3 (stat grid),
   5 (split), 6 (tabla), 7 (barras), 8 (líneas), 9 (timeline), 21 (divisor)**.
3. Renderiza 3-4 de esos moldes, sácame **screenshot** y **PARA**. Espera mi OK.
4. Cuando apruebe el look, ensambla las 29 slides siguiendo `esqueleto-deck.md`
   (cada slide = su molde + su contenido de `estructura-slides-dialogo.md`).
5. Al final: animaciones de entrada + conteo ascendente de los datos hero (GSAP).

## Freno
**No generes las 29 slides** hasta que yo apruebe los moldes base (paso 3).
Validar el molde una vez evita rehacer 29 slides.
