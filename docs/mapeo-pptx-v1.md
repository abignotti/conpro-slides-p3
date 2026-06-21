# Mapeo `Conpro-P3-v1.pptx` ↔ deck web

> **Doc vivo.** Mapea cada slide del PPTX de referencia `Conpro-P3-v1.pptx`
> (el editable que circuló) contra el deck web actual (`presentacion/`), y
> registra qué slides difieren. Sirve para que **cualquier sesión tenga el
> contexto correcto** sin re-derivarlo. Se va actualizando a medida que el deck
> web o el PPTX cambian.
>
> Última actualización: 2026-06-21.

## ⚠️ Delta v2 (recibida 2026-06-21 · 36 slides · 9,9 MB)
Llegó otra versión más nueva (`.context/new-deck-v2.pptx`, **36 slides**, +1 vs
la anterior). Casi idéntica a la v1 de abajo, pero con un cambio estructural en
la zona ingresos/captación + confirma hacia dónde van:

1. **🆕 Slide 20 "Ingresos según Demanda"** (NUEVA, no estaba en v1): tabla de
   ingresos por año (Año 1-5: 60/93/122/143/161 hogares → $13M/$21M/$28M/$33M/$37M)
   + tarjeta **Ingreso por hogar $201.061** + tarjeta **Ingresos por despacho:
   Mixto**. → la web **no la tiene** (hay que crearla).
2. **🔄 Slide 21 "Mercado alcanzable / captación"**: bajó de **4 a 3 KPIs**
   (Hogares año 5 161 · Penetración 0,19% · Mercado potencial 86.770). El
   **$201.061 se movió** a la slide 20. → la web `17b` hoy tiene 4 KPIs (incl.
   $201.061): hay que **sacarle esa tarjeta** y dejar 3.
3. **✏️ Techo (slide 14)**: ahora dice "no rompe el **techo operacional**"
   (antes "el techo"). Minor.
4. **✅ Confirma alineación**: sección 05 = "Resultados y recomendaciones", VAN
   sin TIR, Demanda "conservador", Resultados CBO 3 tarjetas — todo lo que ya
   apliqué en el lote 1 coincide con esta v2.

Siguen pendientes (ya conocidos de v1, aún sin integrar): 🆕 "¿Puede Conpro
sostener…?" (slide 26) y 🆕 "Análisis de Sustentación" (slide 27). Y siguen los
duplicados viejos de sensibilidad/márgenes/flexibilidad (slides 24/25/28) +
ganancias eliminada del PPTX (la web aún la tiene en `19-ganancias`).

**✅ Implementado (2026-06-21):** la web ya está alineada con la v2 en esta zona:
- 🆕 `presentacion/17b-ingresos-demanda.html` — **"Ingresos según la demanda"**:
  tarjeta $201.061 + tarjeta "Despacho · Mixto (domicilio + pick up)" + tabla por
  año (60→161 hogares · $13M→$37M). [PPTX 20]
- 🔄 `presentacion/17c-mercado-alcanzable.html` — la captación (antes `17b`)
  **renombrada** y recortada a **3 KPIs** (161 · 0,19% · 86.770) + barra de
  holgura. [PPTX 21]
- 🆕 `presentacion/20b-pregunta-sostener.html` — pregunta-ancla "¿Puede Conpro
  sostener…?", antes del divisor de robustez. [PPTX 26]
- 🆕 `presentacion/21b-sustentacion.html` — "Análisis de Sustentación" (Imitación
  / Sustitución / Expropiación de renta), primer tema de robustez. [PPTX 27]
- ✏️ `12-techo` — "no rompe el **techo operacional**". [PPTX 14]

**Pendiente / decisión:** `19-ganancias` **se mantiene por ahora** (el PPTX v2 la
eliminó; decisión de revisar más adelante). Siguen como están los rediseños
"formato distinto" (Juan, Propuesta, Cómo funciona, Costos-torta).

## ⚠️ Delta de la versión recibida 2026-06-21 (editada por compañeras)
Llegó un PPTX nuevo (`.context/attachments/.../Conpro-P3-v1.pptx`, 35 slides,
mismo nombre). Estructura casi idéntica a la ya mapeada, pero con **4 cambios
reales** respecto del deck web actual:

1. **🆕 `25 · ¿Puede Conpro sostener esa rentabilidad…?`** — pregunta-ancla nueva
   (no existe en la web). Iría antes del bloque de robustez.
2. **🆕 `26 · Análisis de Sustentación`** — slide nueva: Imitación / Sustitución
   (interés −7,5% → VAN −55%; −12,5% → −83%) / Expropiación de renta. *(El PPTX
   trae un emoji azul placeholder encima del texto — WIP.)*
3. **🔄 `20 · Mercado alcanzable · "El desafío no es mercado, es captación"`** —
   **rediseñada**: pasó del gráfico de ingresos (web `17b`) a una grilla de 4 KPIs
   (Ingreso/hogar $201.061 · Hogares año 5 = 161 · Penetración 0,19% · Mercado
   86.770) + frase "el límite no es quedarse sin clientes, sino captarlos más
   rápido".
4. **➖ Ganancias proyectadas eliminada** — el PPTX salta la página 19; la web aún
   tiene `19-ganancias`. Decidir si se quita o se mantiene.

Lo demás (Juan buyer-persona, propuesta 2 tarjetas, cómo-funciona título+diagrama,
costos con torta, duplicados viejos de sensibilidad/márgenes/flexibilidad,
nombres de sección, "conservador" vs "base", TIR) ya estaba registrado abajo y
**no cambió** respecto de la versión anterior. El slide 16 del PPTX es el
**screenshot del demo** (= web `14b`), no la explicación de plataforma.

## Qué es el PPTX v1
Versión **intermedia / de transición**, **no** el deck web actual. Señales:
1. **Tiene duplicados**: trae la versión vieja y verbosa de
   Sensibilidad/Márgenes/Flexibilidad (slides 25-27) **y** la nueva y limpia
   (29-31). El web ya solo tiene la nueva.
2. **Tiene placeholders** que no existen en el web (slide 16:
   *"ACA EL VIDEO AGUSTIN JEJE"*).
3. **Se contradice a sí mismo**: la sección 05 se llama *"Resultados y
   recomendaciones"* en el divisor de la slide 2 pero *"Robustez y decisión"*
   en el de la slide 28.

El PPTX tiene **35 slides físicas** numeradas "X / 28". El deck web tiene 31
partials en `presentacion/` (28 slides numeradas + `10b`, `17b`, `14b`).

## Tabla de mapeo

| PPTX (físico / nº "/28") | Representa | Slide web actual | ¿Modificada vs. web? |
|---|---|---|---|
| 1 · Portada (imagen) | Portada | `01-portada` | ⚠️ En PPTX es **imagen plana**; web es editable con integrantes |
| 2 · Divisor 01 | Divisor "El cliente y el negocio" | `02-divisor-cliente-negocio` | ⚠️ Sección 05 dice **"Resultados y recomendaciones"** (web: "Robustez y decisión") |
| 3 · Juan (buyer-persona detallado) | Juan, el cliente | `03-juan` | ⚠️ **Distinta**: PPTX = buyer-persona completo (perfil/atributos/dolor, con typos "Quiercalidade", "limíta"); web = split-imagen simple. Coincide con molde nuevo `23-buyer-persona` (aún sin integrar) |
| 4 · Propuesta (2 tarjetas) | Propuesta de valor | `04-propuesta` | ⚠️ **Distinta**: PPTX = 2 tarjetas con imágenes (precios justos / productos calidad); web = cita de una frase |
| 5 · Mercado | Análisis de mercado | `05-mercado` | ⚠️ Título distinto; web agrega 3ª línea "misma calidad, precio conveniente" |
| 6 · Título "¿Cómo funciona?" + 7 · diagrama (imagen) | Cómo funciona hoy | `06-como-opera` | ⚠️ **Distinta**: PPTX = título + slide-diagrama separados; web = un único timeline de 5 pasos |
| 8 · Toda la gestión pasa por Ricardo | Dependencia | `07-dependencia` | ✅ Igual (Pedidos/Pagos/Entrega) |
| 9 · Costo de oportunidad | Costo de oportunidad | `08-costo-oportunidad` | ✅ Igual (16h/mes · $5.500/h · $16.700/h) |
| 10 · Divisor 02 | Divisor CBO | `09-divisor-cbo` | ✅ Igual |
| 11 · Automatizar pagos | Qué es el CBO | `10-que-es-cbo` | ✅ Igual ($295.000) |
| 12 · Automatización simple (flujo 9 pasos) | Flujo CBO | `10b-flujo-cbo` | ✅ Igual |
| 13 · Resultados del CBO | Resultados CBO | `11-resultados-cbo` | ⚠️ PPTX = **3 KPIs**; web = **4** (agrega "Inversión $295.000 · marca + Fintoc") |
| 14 · Techo ~180 hogares | El techo | `12-techo` | ✅ Igual |
| 15 · Divisor 03 | Divisor proyecto | `13-divisor-proyecto` | ✅ Igual |
| 16 · Plataforma B2C *(antes "ACA EL VIDEO")* | La plataforma (explicación) | `14-plataforma` | ✅ Igual (5 pasos). **Decisión:** Plataforma queda en pos. 16 (el placeholder de video se elimina) |
| 17 · Demo web de Conpro *(antes Plataforma B2C)* | Muestra real de la plataforma | `14b-demo-plataforma` (NUEVO) | 🆕 Slide con **demo embebido de la web de Conpro** (iframe full-body). Va **después** de la explicación. Ver "Estado" abajo |
| 18 · ¿Vale la pena invertir? | Pregunta ancla | `15-vale-la-pena` | ✅ Igual |
| 19 · Divisor 04 | Divisor modelo | `16-divisor-modelo` | ✅ Igual |
| 20 · Demanda | La demanda | `17-demanda` | ⚠️ Gráfico rotulado **"escenario conservador"** (web: "escenario base") |
| 21 · Ingresos según demanda | Ingresos | `17b-ingresos-demanda` | ✅ Igual (161 hogares = 0,19% de 86.770) |
| 22 · Costos (+ gráfico PIE) | Costos | `18-costos` | ⚠️ PPTX tiene **4 ítems + torta**; web = 4 ítems sin torta |
| 23 · Ganancias proyectadas | Ganancias | `19-ganancias` | ✅ Igual (0,5/1,6/2,8/3,9/5,0) |
| 24 · Indicadores VAN | VAN + payback | `20-van-payback` | ⚠️ PPTX **sin columna TIR**; web agrega TIR (45,7/57,9/69,3%) |
| **25 · Sensibilidad (vieja, verbosa)** | Sensibilidad (vieja) | → reemplazada por `22-sensibilidad` | 🔁 **Duplicado obsoleto** |
| **26 · Márgenes (vieja)** | Márgenes (vieja) | → reemplazada por `23-margenes` | 🔁 **Duplicado obsoleto** |
| **27 · Flexibilidad / momento óptimo (tabla)** | Opción de esperar (vieja) | → reemplazada por `24-opcion-esperar` | 🔁 **Duplicado obsoleto**, cifras distintas (ver abajo) |
| 28 · Divisor 05 | Divisor robustez | `21-divisor-robustez` | ✅ Igual ("Robustez y decisión") |
| 29 · Sensibilidad "Dos variables mandan" | Sensibilidad (nueva) | `22-sensibilidad` | ✅ Igual |
| 30 · Márgenes "Café y vino" | Márgenes (nueva) | `23-margenes` | ✅ Igual |
| 31 · La opción de esperar | Opción de esperar (nueva) | `24-opcion-esperar` | ✅ Igual |
| 32 · Proyecto vs Caso Base | Proyecto vs CBO | `25-proyecto-vs-cbo` | ✅ Igual |
| 33 · FODA | FODA | `26-foda` | ✅ Igual |
| 34 · Recomendaciones | Recomendaciones | `27-recomendaciones` | ✅ Igual |
| 35 · Recomendación final / ¡Gracias! | Síntesis | `28-sintesis` | ✅ Igual |

## Diferencias que importan (lo que SÍ cambió)
1. **Bloque 5 duplicado** — el v1 trae las dos generaciones (25-27 vieja, 29-31
   redibujada). El web limpió esto y solo conserva la nueva.
2. **Cifras de "esperar" inconsistentes** — tres juegos circulando:
   - PPTX viejo (slide 27): $2.386.311 → $4.302.497 → $5.662.917 → **$6.685.096**
   - `mapa-deck.md`: $2.386.311 → $4.073.470 → $5.662.917 → **$6.109.830**
   - `js/deck.js` (`chart-esperar`): 2,39 → 4,07 → 5,66 → **6,11** (M$)
   - ❓ **Falta fijar cuál es el bueno** antes del PPTX final.
3. **Slide 3 (Juan) y 4 (Propuesta)** — el PPTX usa diseños más ricos
   (buyer-persona y dos tarjetas) que el web **no** adoptó. El molde
   `23-buyer-persona` existe pero está **sin integrar** al deck.
4. **TIR**: el web agregó columna TIR en VAN; el PPTX no la tiene.
5. **Resultados CBO**: el web sumó una 4ª tarjeta (Inversión $295.000).
6. **Nombres desalineados**: sección 05; escenario "conservador" vs "base".
7. **Placeholders sin resolver en el PPTX**: el "video" (slide 16) y los typos
   en Juan.

## Estado / pendientes
- **Orden plataforma/demo (decisión 2026-06-21):** pos. 16 = Plataforma B2C
  (explicación, `14-plataforma`) → pos. 17 = demo web de Conpro
  (`14b-demo-plataforma`). El placeholder de video del PPTX se descarta.
- **Demo web** → `presentacion/14b-demo-plataforma.html` (sin título, iframe
  full-body a `assets/plataforma-demo.html`, va después de `14-plataforma`).
  - ✅ **Resuelto**: el bundle completo (`assets/plataforma-demo.html`, 715 KB,
    21 assets embebidos + fuentes) **renderiza el catálogo completo** (productos
    + panel "Elige tu grupo" con grupos por comuna y barras de avance). El bundle
    anterior (31 KB) fallaba con 404 a `Conpro.dc.html`; ya reemplazado.
  - ✅ **A pantalla completa**: este slide va **sin header ni pie** (full-bleed),
    para que el demo no quede alargado. Por lo mismo **no muestra número**.
- **Numeración automática (decisión 2026-06-21):** el número arriba-derecha lo
  calcula `js/deck.js` (`numberSlides`) según la posición real; ya **no se
  hardcodea ni se renumera a mano** (regla en `CLAUDE.md`). El total "/ 28" se
  quitó. Con esto, plataforma = **15**, el demo (pos. 16) va sin número, y
  vale-la-pena = **17** (la secuencia salta 15 → 17 porque el demo no imprime su
  número). El renumerado global manual quedó **obsoleto**.
- **Resumen de cobertura**: ~18/28 slides coinciden; difieren sobre todo la
  apertura (Juan, Propuesta, Cómo funciona) y el cierre del bloque 5 (duplicado
  en el PPTX, consolidado en el web).
