# Mapeo `Conpro-P3-v1.pptx` ↔ deck web

> **Doc vivo.** Mapea cada slide del PPTX de referencia `Conpro-P3-v1.pptx`
> (el editable que circuló) contra el deck web actual (`presentacion/`), y
> registra qué slides difieren. Sirve para que **cualquier sesión tenga el
> contexto correcto** sin re-derivarlo. Se va actualizando a medida que el deck
> web o el PPTX cambian.
>
> Última actualización: 2026-06-21.

## ⚠️ Delta v4 (recibida 2026-06-21 · `ICS39113-2026-01-Presentación.01-G06.pdf` · **43 slides** · PDF, PptxGenJS)

Llegó **en PDF** (no PPTX), 43 slides físicas (43.ª útil = bibliografía; el split
da 44 con una trailing vacía). Es la **versión completa** de la v3: lo que en v3
eran placeholders WIP de recomendaciones **ya está lleno**, y suma anexos +
bibliografía + una portada nueva. Baseline de comparación = deck web actual de
**este** workspace `lahore` (rama `map-presentacion-actualizada`, 33 partials).

### TL;DR — qué cambió de v3 → v4 (lo realmente NET-NEW que el web NO cubre)
1. **🆕 6 slides de cierre que el web no tiene:**
   - **P30 · Sustentación — síntesis "¿Cómo mantener la ventaja competitiva?"**:
     3 columnas (Imitación / Sustitución / Expropiación) con su mitigación.
   - **P34 · Reco "No escalar ahora: operar CBO"**: comparación a **3 vías** —
     VAN proyecto **$2.386.311** · VAN CBO **$5.361.672** · VAN esperar
     **$8.742.617** + gatillo "esperar hasta un ingreso por venta bruto de
     **$2.336.640**". (El web `25-proyecto-vs-cbo` es de 2 vías.)
   - **P35 · Reco "Tener en consideración"**: Validación de demanda + Recopilación
     de datos. *(En v3 era placeholder solo-título; ahora con contenido.)*
   - **P36 · Reco "Testear el alza de márgenes donde hay holgura"**: chart café/vino.
   - **P37 · Reco "Si se escala, considerar"**: plan de transición gradual en 4
     pasos (Fintoc → 1 grupo piloto → migrar resto uno a uno → WhatsApp solo soporte).
   - **P39 · Divisor ANEXOS** + **P41-43 · Bibliografía** (~21 refs APA).
2. **⚠️ VAN del CBO en `11-resultados-cbo` (P13)**: el PDF muestra
   **VAN · 5 años = $5,36 M** (3 tarjetas). El web dice **$2,41 M**. Choca con la
   decisión #1 ya tomada (mantener `#/11` en $2,41M y solo usar $5,36M en la
   comparación). **Decisión pendiente: ¿el PDF cambió la postura a $5,36M también
   en esta slide?**
3. **⚠️ Márgenes (P25)**: el PDF vuelve a **7 productos** (Huevos/Café/Aceite/Miel/
   Queso/Vino/Frambuesa, picos Café ~$6,1M y Vino ~$5,1M) + bullet "VAN del
   Proyecto $2.386.311". El web `23-margenes` está reducido a **3 barras**. Revisar
   si se readopta el set de 7.

### Diferencias de formato/estructura (mismo concepto, no idénticas)
- **Portada (P01)**: rediseñada — "CONPRO", foto de supermercado, **agrega
  profesores** (Felipe Saavedra / Alan Piket supervisor), sin subtítulo
  descriptivo ni "Junio 2026". El web tiene título largo "Escalamiento de Conpro"
  + descripción + integrantes, sin profesores.
- **Juan (P03)**, **Propuesta (P04)**, **Mercado (P05)**, **Cómo opera (P06+P07,
  título+bullets en 2 slides)**, **Costos (P22, con torta + fila "costo por
  venta")**: mismo concepto, wording/layout distintos del web (el web ya los
  rediseñó por su cuenta).
- **Sustentación (P27-P29)**: el PDF la **expande a 3 slides** (Imitación /
  Sustitución / Expropiación); el web la **consolida** en `21b-sustentacion`.
  Datos coinciden (−7,5%→−55%, −12,5%→−87%; 32.085 hogares, ~167 empresas).
- **Flexibilidad (P31 pregunta + P32 tabla)**: el web lo tiene como 1 chart
  (`24-opcion-esperar`). Cifras coinciden (60/81/105/121/139 · 2,39/4,30/5,66/
  6,69/8,74 M).
- **Reordenamiento de secciones**: en el PDF, sensibilidad/márgenes/sustentación/
  flexibilidad quedan en la **sección 04**, y la **05 = solo recomendaciones**;
  **FODA pasa a ANEXOS** (tras "¡Gracias!"). El web tiene FODA en el flujo
  principal y un divisor de robustez antes del bloque.

### Solo-web (el PDF NO las trae)
- `14-plataforma` (explicación 5 pasos de la plataforma): el PDF salta directo al
  demo (P16).
- `19-ganancias` (ganancias proyectadas 0,5→5,0 M): el PDF no la incluye.

### ✅ Implementado (2026-06-21, rama `map-presentacion-actualizada`)
Decisiones del usuario aplicadas y verificadas por screenshot (deck escala 1.0):
- **VAN CBO** unificado en **$5,36M** (slide `11-resultados-cbo`).
- **Sustentación expandida:** se conserva `21b` (Imitación) y se agregan
  `21c` (Sustitución −55%/−87%), `21d` (Expropiación + desintermediación) y
  `21e` (Síntesis "¿Cómo mantener la ventaja competitiva?").
- **Recomendaciones:** agregadas `27a` (No escalar ahora · 3 VAN + gatillo $2.336.640),
  `27b` (Tener en consideración), `27c` (Testear márgenes · chart `chart-margenes-reco`)
  y `27d` (Si se escala · plan 01-04). Se **eliminó** `27-recomendaciones.html`; se
  **conserva** `25-proyecto-vs-cbo`.
- **Anexos:** `29-divisor-anexos` + `30-bibliografia-1/2/3` (~21 refs APA),
  **sin número de página** (header sin span de número).
- **Reordenado al orden físico del PDF (2026-06-21):** los 41 partials se
  renumeraron `01..41` para calzar 1:1 con el PDF. Cambios de orden clave:
  sensibilidad/márgenes ahora **antes** de sustentación; `¿sostener?` antes de
  sustentación; flexibilidad después de la síntesis; el **divisor 05**
  (`31-divisor-resultados`) movido a justo antes de las recomendaciones; FODA en
  anexos. Dos pares del PDF van consolidados en la web (P06+P07 → `06-como-opera`;
  P31+P32 → `30-opcion-esperar`).
- **Obsoletas → `presentacion-obsoletas/`** (el PDF no las trae, se conservan por
  si acaso): `14-plataforma`, `19-ganancias`, `25-proyecto-vs-cbo`.
- Pendiente: commit + PR (a la espera del OK del usuario).

### Plan de acción sugerido (orden de impacto)
1. **Resolver el VAN CBO $2,41M vs $5,36M** en `11-resultados-cbo` (decisión del usuario).
2. **Crear las 4 slides de recomendaciones** (no escalar / tener en consideración /
   testear márgenes / si se escala) — hoy el web solo tiene 1 (`27-recomendaciones`).
3. **Decidir Bibliografía + divisor Anexos** (el web no tiene): crear o no.
4. **Decidir Sustentación síntesis (P30)** y set de **márgenes 7 vs 3**.
5. Mantener (decisión previa) `14-plataforma` y `19-ganancias` aunque el PDF no las traiga.

## ⚠️ Delta v3 (recibida 2026-06-21 · `ICS39113-...-G06.pptx` · **42 slides** · 9,6 MB)

Versión más nueva (`.context/ref.pptx`, **42 slides físicas**, +6 vs la v2 de 36).
**Baseline de comparación = deck web más fresco** = rama
`reemplazar-slides-juan-inversion` (30 partials: ya rediseñó Juan/propuesta/costos
y **eliminó** `17c-mercado-alcanzable`, `20b-pregunta-sostener`,
`21b-sustentacion`).

> **Reenvío (2026-06-21 18:43, `.context/ref2.pptx`):** copia casi idéntica del
> mismo PPT. **Único cambio:** slide 29 (Expropiación/desintermediación), la
> línea pasó de *"Holgura máxima antes de perder competitividad"* a *"A mayor
> holgura de precio, menor exposición al riesgo. Los productos sin capacidad de
> ajuste son más vulnerables a aumentos de proveedores."* Mismos 42 slides,
> mismas cifras y gráficos → **todo el mapeo de abajo sigue válido.**

### TL;DR — qué cambió de v2 → v3
El salto de 36→42 slides es **un solo bloque**: la robustez/sustentación, que en
el deck web vivía consolidada en 1 slide (`21b-sustentacion`, hoy **borrada** en
la rama de rework), el PPTX la **expande a slides completas** y agrega **anexos**:

1. **🆕 Bloque "Análisis de Sustentación" (3 slides nuevas, con datos reales):**
   - **Imitación** (PPTX 27): mercado de comunas cercanas **32.085** hogares →
     espacio teórico para **~167** empresas tipo Conpro antes de saturar; capta
     **161** al año 5.
   - **Sustitución** (PPTX 28): si el interés cae **7,5%/año → VAN −55%**; si cae
     **12,5%/año → VAN −87%**. *(El viejo `21b` decía −55% / **−83%** → cifra
     cambió a −87%.)*
   - **Expropiación de renta + desintermediación** (PPTX 29): proveedor sube
     precio → Conpro lo traspasa → cliente puede comprar directo. "Holgura máxima
     antes de perder competitividad" (sin número cerrado aún).
2. **🆕 2 preguntas-ancla nuevas:** "¿Puede Conpro **sostener** la rentabilidad?"
   (PPTX 26) y "¿Qué pasa si **no invierte ya** y opera el CBO? · **Flexibilidad**"
   (PPTX 30). La web tenía la 1ª en `20b` (borrada).
3. **🎨 "Análisis de Flexibilidad / momento óptimo" (PPTX 31):** tabla detallada
   invertir-ahora vs esperar 1-4 años → Hogares Y1 **60/81/105/121/139** · VAN
   **$2,39M / $4,30M / $5,66M / $6,69M / $8,74M**. La web lo tiene simplificado a
   un chart (`24-opcion-esperar`) con otras cifras (2,39/4,07/5,66/6,11).
4. **🔄 Recomendaciones expandidas a 4 slides** (sección 05 del PPTX):
   - **No escalar ahora** (PPTX 33): VAN proyecto **$2.386.311** vs **VAN CBO
     $5.361.672** vs **VAN con esperar $8.742.617**; gatillo nuevo: esperar hasta
     un **ingreso por venta bruto de $2.336.640**. ⚠️ **Inconsistencia
     (confirmada por el usuario 2026-06-21):** el "VAN CBO **$5.361.672**" de esta
     slide choca con el VAN CBO del deck web (**$2,41M** en `11-resultados-cbo` y
     `25-proyecto-vs-cbo`). Hay que resolver cuál es el bueno.
   - **Tener en consideración** (PPTX 34): **placeholder WIP** (solo título).
   - **Testear márgenes donde hay holgura** (PPTX 35): chart café/vino.
   - **Si se escala: considerar** (PPTX 36): plan de transición gradual + riesgo
     de sustitución.
5. **🆕 Anexos (4 slides nuevas):** divisor **ANEXOS** (38), **FODA** (39, la web
   ya lo tiene en flujo principal `26-foda`), y **Bibliografía** (40-42, ~21
   refs APA) — la web **no tiene** bibliografía.

### Tensión a resolver (decisión del usuario)
La rama de rework **redujo** robustez (borró `21b-sustentacion` consolidada,
`20b`, `17c`); el PPTX v3 va en **dirección opuesta** y la **expande**. Hay que
decidir el nivel de detalle: 1 slide consolidada (como tenía la web) vs el bloque
de 3 + preguntas-ancla del PPTX.

### Estado vs deck web (lo realmente NET-NEW que el web no cubre)
- 🆕 Sustentación: imitación / sustitución / expropiación (datos arriba).
- 🆕 Pregunta-ancla "¿sostener?" y "flexibilidad".
- 🆕 Bibliografía (anexo).
- ✏️ Gatillo $2.336.640 y tabla de flexibilidad con 5 filas (antes 4).
- ⚠️ **Inconsistencia confirmada (usuario 2026-06-21):** VAN CBO $5.361.672
  (slide 33) vs $2,41M (web `11-resultados-cbo` / `25-proyecto-vs-cbo`). Resolver
  cuál es el bueno.
- ➖ Solo-web que el PPTX **no** trae: `14-plataforma` (explicación 5 pasos),
  `19-ganancias`. Mantener salvo decisión contraria.
- ✅ Todo lo demás (1-25, 37/39) ya está alineado o el web está mejor (TIR,
  4ª tarjeta CBO, demo interactivo, Juan/propuesta/costos rediseñados).

### Baseline canónico y links estables (2026-06-21)
Los workspaces de Conductor **rotan** (los que usé antes —`reemplazar`, `yokohama`—
ya no existen), por eso los links a sus puertos se caían. Reglas fijas:

- **Baseline canónico = rama `whatsapp-video-timeline`** (workspaces `havana` /
  `whatsapp-video-timeline`, 34 slides): es el deck **más parecido al PPT** (tiene
  el bloque de robustez + Juan rediseñado). Es lo mismo que el deck de **este**
  workspace `lahore` **salvo el slide de Juan**.
- **Links estables → server `:8761` (workspace `lahore`, propio, no se cierra).**
  Su deck es idéntico a `havana` salvo Juan, así que los índices `#/N` coinciden.
- ⚠️ Ningún deck es calco del PPT aún: el web **consolidó** la cola del PPT.
  **Falta** (decisión de diseño, no error): sustentación expandida a 3 slides
  (hoy 1 consolidada), tabla de Flexibilidad/momento óptimo, recomendaciones
  expandidas (no escalar / tener en consideración / si se escala) y
  **Anexos + Bibliografía**.

**Índices `#/N` (server `:8761`):** Resultados CBO `#/11` · Demanda `#/18` ·
Ingresos `#/19` · Mercado alcanzable `#/20` · Costos `#/21` · Ganancias `#/22` ·
Indicadores VAN `#/23` · ¿Sostener? `#/24` · Divisor 05 `#/25` · Sustentación
`#/26` · Sensibilidad `#/27` · Márgenes `#/28` · Opción esperar `#/29` ·
Proyecto vs CBO `#/30` · FODA `#/31` · Recomendaciones `#/32` · Síntesis `#/33`.

### Lista viva de inconsistencias PPT↔web (8 reales; #9 y #10 ya resueltas)
| # | Tema | Slide PPT | Link web (`:8761`) |
|---|---|---|---|
| ✅1 | VAN CBO → **$5,36M en la comparación `#/30`** (titular "Mismo valor"→"Más valor"); `#/11` queda **$2,41M** ("VAN 5 años" = PPT slide 13) | 33 | `#/30` | **aplicada** (usuario: 5,36M correcto). Los dos conviven, igual que en el PPT, diferenciados por etiqueta |
| ✅2 | "Esperar" → ahora 5 valores PPT [2,39/4,30/5,66/6,69/8,74], peak 4 años | 31 | `#/29` | **aplicada** (`js/deck.js chart-esperar` + notas) |
| ✅3 | Sustitución −83% → **−87%** | 28 | `#/26` | **aplicada** (`21b-sustentacion`) |
| ✅4 | Márgenes [6,2/5,2/1,2] → **[6,1/5,15/1,1]** (3 productos, sin Miel/Frambuesa) | 25/35 | `#/28` | **aplicada** (`js/deck.js chart-margenes`) |
| ✅5 | Sensibilidad → **rediseño completo a la slide 24 del PPT**: layout (título arriba · gráfico izq · bullets der), textos ("Análisis de Sensibilidad" / "¿Qué variables impactan más en el VAN?" / "Principal hallazgo…"), caption, y gráfico de **2 barras por variable** (rango bueno amarillo / malo gris, leyenda, eje $MM) | 24 | `#/27` | **aplicada** (`22-sensibilidad.html` reescrita + `charts.js` fn `tornado` 2 series + `chart-tornado`). Verificado por screenshot |
| ✅6 | WACC CBO 27% | 23 | — | **confirmado intencional** (CBO menos riesgoso que el proyecto); sin cambio |
| ✅7 | Gatillo: nota "120-130 hogares" → folded PPT "$2.336.640" (≈139 hog) | 33 | `#/29` | **aplicada** (nota `24-opcion-esperar`) |
| ✅8 | Ganancias: se **mantiene** la slide | — | `#/22` | usuario: **dejar**. Ojo: datos siguen sin validar (placeholder) |
| ✅9 | Nombre sección 05 | — | — | **resuelta** → "Resultados y recomendaciones" |
| ✅10 | Demanda "base" vs "conservador" | — | — | **resuelta** → "escenario conservador" |

> **Nota:** cambios aplicados en el workspace `lahore` (rama
> `map-presentacion-actualizada`). Para que queden en el baseline canónico hay que
> **replicarlos/mergearlos** a `whatsapp-video-timeline`.

---

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
