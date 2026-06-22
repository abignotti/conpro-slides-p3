# Playbook: trabajar con IA — de Conpro a cualquier proyecto futuro

> Documento durable, pensado para cruzarlo con otras revisiones. Destila lo aprendido
> construyendo el deck "Escalamiento de Conpro" con Claude Code y lo convierte en un manual
> reutilizable. Dos capas: **(A) principios generales** para cualquier proyecto con IA y
> **(B) específico de presentaciones**. Fecha base: 2026-06-22.

---

## Resumen ejecutivo

Hay **dos niveles de aprendizaje**:

- **General (cualquier proyecto):** 10 principios de uso de IA — separar política de mecánica,
  automatizar fricción recurrente, congelar el spec antes de construir, fuente única de verdad,
  subir la unidad de delegación, front-load del brief, paralelizar, delegar verificación,
  extraer una base reutilizable de cada proyecto, y mantener bitácora.
- **Presentaciones:** tu mayor activo no es el deck, es el **SISTEMA** que construiste para
  hacerlo (build determinista, diseño tokenizado, merge drivers, skills propias, CLAUDE.md +
  memoria). Extraerlo como base hace que el próximo deck **nazca en un nivel alto**.

**El patrón central a corregir:** hoy la IA opera como **"copiloto de tecleo"** — 1 commit cada
~9–15 min en ráfagas, micro-ediciones supervisadas (2–4 líneas, 1–3 archivos), una rama por
micro-feature (23 ramas). Es alta supervisión / baja delegación. El salto de productividad viene
de **subir de nivel**: delegar lotes más grandes, paralelizar y **automatizar el trabajo
mecánico** para que solo revises resultados.

**Evidencia (git, 100 commits):** 65 commits en un solo día; 27% de los commits son overhead de
sincronización (21% merges + 6% "Rebuild index.html"); monousuario; churn casi nulo (cambios bien
validados, pero a costa de mucha supervisión manual).

---

## CAPA A — Principios generales (cualquier proyecto con IA)

Transferibles a programación, análisis, documentos, research, etc. Derivados de Conpro pero no
atados a presentaciones.

### 1. Separa política de mecánica
Lo que requiere **juicio** → `CLAUDE.md`/memoria. Lo **determinista** (pasos que se repiten
igual) → hooks/scripts/CI. No le pidas al modelo recordar mecánica: la prosa hay que recordarla
cada turno; un hook simplemente lo hace.
*Evidencia Conpro:* reglas como "manda el link tras cada cambio", "identifica el server por
rama", "nunca edites el generado a mano" son prosa que debería ser un hook.

### 2. Automatiza toda fricción que aparezca ≥2 veces
El umbral de "vale la pena automatizar" es bajísimo cuando la IA escribe el script/hook por ti.
*Evidencia:* puerto local ocupado (×4+), cache del navegador (casi cada sesión), 6 commits solo
para regenerar `index.html` tras merge — todo evitable.

### 3. Congela el spec antes de construir a fondo
Construir sobre un blanco móvil es el **retrabajo más caro y silencioso**. Un cambio de
requisitos no es un parche: es un sprint nuevo, con un delta explícito.
*Evidencia:* el PPTX de referencia se reordenó 3 veces; VAN CBO fluctuó $2,41M↔$5,36M; márgenes
3↔7 productos; FODA y "ganancias" entrando y saliendo.

### 4. Fuente única de verdad para datos y decisiones
Cada dato canónico **una sola vez**, referido (no copiado). Cambiar un número debe ser editar un
lugar.
*Evidencia:* cifras hardcodeadas por slide → cambiar el VAN obligaba a cazarlo en varios
archivos, con riesgo de inconsistencia.

### 5. Sube la unidad de delegación
Mide el trabajo en **"unidades de revisión"**, no en ediciones. Pocos lotes grandes y bien
especificados rinden más que muchos micro-edits supervisados.
*Evidencia:* 1 commit cada ~10 min; ya sabes hacer lotes (un commit tocó 16 archivos) → hazlo el
modo por defecto, no la excepción.

### 6. Front-load el contexto del brief
Da de entrada la referencia + los datos exactos + las restricciones, y pide **2–3 variantes en
paralelo** al explorar. El costo de un brief completo se paga una vez; el de uno incompleto, en
cada vuelta.
*Evidencia:* portada rehecha 3×, slide "cómo opera" 2×, sustentación iterada varias veces.

### 7. Paraleliza lo independiente
El cuello de botella suele ser la **coordinación**, no el modelo; un mapa de propiedad
(quién toca qué) resuelve la coordinación.
*Evidencia:* la infraestructura de workspaces en paralelo está lista (merge drivers
auto-resuelven los generados) pero infrautilizada.

### 8. Delega la verificación
Pide que la IA **se autoverifique antes de mostrarte**: que corra el build, tome el screenshot,
haga el grep de cifras, valide. Verificación delegada, no manual.
*Evidencia:* hoy la verificación es 100% visual y manual.

### 9. Extrae una base reutilizable de cada proyecto
Lo que construyes una vez (build, tooling, convenciones, skills, plantilla de `CLAUDE.md`) debe
**viajar al siguiente proyecto**. Este es el principio que convierte experiencia en velocidad
compuesta.

### 10. Mantén bitácora de decisiones y gotchas
Un `devlog` y un `gotchas.md` evitan repetir tropiezos y le dan contexto a la IA entre sesiones.
*Evidencia:* el devlog ya es disciplinado — generalízalo a todo proyecto.

---

## CAPA B — Específico de presentaciones

### B1. La base reutilizable (el activo de mayor valor a futuro)

Qué extraer de Conpro a un **starter kit / template** para el próximo deck. Cada ítem ya está
probado aquí → portarlo cuesta poco y rinde en cada proyecto futuro.

| Activo | Estado en Conpro | Valor para futuros decks |
|---|---|---|
| Build determinista (1 archivo/slide → `build.py`) | ✅ maduro | Base de todo; portar tal cual. |
| Diseño tokenizado (temas × typesets) | ✅ maduro | Cambiar marca/tema sin tocar slides. |
| Merge drivers (`union` + `deck-rebuild`) + `setup-git.sh` | ✅ maduro | Cero conflictos en generados/devlog. |
| Skills `adaptar-slide` y `mapeo-pptx-web` | ✅ útiles | Integrar diseños / comparar vs referencia. |
| `CLAUDE.md` plantilla (solo política) + memoria | ✅ existe | Reglas listas; quitar lo específico de Conpro. |
| Motor de animación genérico (`anim.js`) | ✅ existe | Animar sin editar partials. |
| Export PDF/PPTX (`export-pdf.mjs`, `build_pptx.py`) | ✅ funciona | Entregables editables/imprimibles. |
| **NUEVO** dev-server script (puerto por rama + `no-cache`) | ❌ falta | Mata la fricción puerto+cache. |
| **NUEVO** hook pre-commit (`build.py` + falla si stale) | ❌ falta | Mata los rebuilds manuales. |
| **NUEVO** fuente única de cifras (`cifras.md/json` + check) | ❌ falta | Cambiar un número en un lugar. |
| **NUEVO** `docs/gotchas.md` | disperso | No repetir tropiezos conocidos. |

**Recomendación:** el próximo deck arranca **clonando esta base**, no desde cero. Los cuatro
"NUEVO" se construyen una vez y viajan con la base.

### B2. Qué centralizar para evitar hardcodes (más allá de colores)

Auditoría de `css/tokens.css`, `js/anim.js`, `js/charts.js` y 8 slides. Hoy: ~60% de
color/tipografía centralizado, ~40% de animación, ~10% de espaciado/componentes. **Sí: las
animaciones son el caso #1**, y hay varios más.

| Prioridad | Qué centralizar | Evidencia del hardcode actual |
|---|---|---|
| 1 — Animaciones | `--chart-anim-duration / -easing / -stagger`; que `charts.js` los lea con `cssMs()` | `js/charts.js:167/210/238/269` hardcodean 600/650ms e ignoran `--anim-enter`; `js/deck.js:269` `setTimeout(…, 250)` |
| 2 — Escala de tamaños | `--size-xs/sm/md/lg` (16/34/46/74px) | `width:46px` ×28, `34px` ×9, `74px` ×3, `16px` ×10 |
| 2 — Escala de radios | `--radius-sm/md/lg/pill` | `border-radius:9px` ×29 hardcodeado (junto a `var(--radius)` ×35) |
| 2 — Escala de gaps/padding | `--gap-xs … --gap-xl` | `gap:14px` ×77, `gap:18px` ×60, `gap:24px` ×19 |
| 3 — Escala de pesos | `--weight-regular/medium/bold/black` | `font-weight:600` ×186, `700` ×129, `500` ×40 |
| 3 — Logo inline | `<symbol>` + `<use>` (1 definición) | SVG del logo repetido en 27 slides |
| 4 — Cifras | `cifras.md/json` inyectado en build | números copiados a mano por slide |
| 4 — Strings header/footer | inyectados en build | "Escalamiento de Conpro" ×32, "Evaluación de Proyectos" ×25 |

> **Cuidado con el timing:** centralizar estos hardcodes en el deck vivo es un refactor de 200+
> ocurrencias → riesgo de regresión visual. Hazlo **aditivo** (agrega los tokens, migra de a
> poco) o directamente **en la base extraída**, no sobre un deck que está por entregarse.

### B3. Metodología para PPT/cifras cambiantes

1. **Congela una versión por sprint** (`v1`, `v2`, …). No construyas a fondo sobre algo no
   congelado.
2. **Fuente única de cifras** (`cifras.md/json`): el deck referencia; cambiar un número es editar
   un lugar.
3. **Delta review** ante cada versión nueva con la skill `mapeo-pptx-web`: categoriza qué cambió
   (✅ igual / ✏️ texto / 🎨 diseño / 🔄 movido / 🆕 nuevo / ➖ quitado) y **decide antes de tocar
   slides**. El cambio es un sprint, no un parche.
4. **Lee el PPT entrante con la skill `pptx`** (extracción estructurada de texto/tablas).
5. **Cierra decisiones abiertas** (qué cifra es la canónica) antes de propagarlas al deck.

### B4. Cómo abordar una presentación sin PPT base (desde cero)

1. **Brainstorm / outline primero** (skill `brainstorming`): objetivo, audiencia, el mensaje
   único, la narrativa (problema → solución → evidencia → pedido).
2. **Esqueleto**: lista de slides, **una idea por slide** + su dato clave — antes de diseñar nada.
3. **Datos a `cifras.md` desde el inicio**, aunque sean placeholders marcados `⚠️ por precisar`.
4. **Clona la base** (moldes + tokens + build) y **mapea cada slide del esqueleto a un molde**.
5. **Construye por lotes**, pide variantes de diseño en paralelo, y **autoverifica** (screenshot).
6. **Guion / contexto en `aside.notes`**, no en texto chico al pie (no se lee al proyectar).

### B5. Catálogo de skills y recursos (diseño, animación, flujo)

**Ya disponibles en tu entorno** (pudiste y puedes usarlas):

| Skill | Para qué |
|---|---|
| `build-presentation` | Armar presentaciones web (directamente aplicable). |
| `frontend-design` | UI distintiva, sin estética genérica de IA. |
| `theme-factory` | Temas (colores + fuentes) aplicables a slides/artefactos. |
| `canvas-design` / `algorithmic-art` | Arte y fondos generativos (png/pdf; p5.js). |
| `web-design-guidelines` | Revisar la UI contra buenas prácticas. |
| `brand-guidelines` | Aplicar identidad de marca. |
| `pptx` | Leer/escribir PPTX (clave para PPT cambiante y export). |
| `webapp-testing` / `verify` / `run` | QA visual del deck (Playwright, screenshots). |
| `skill-creator` / `writing-skills` | Crear tus propias skills (ya hiciste 2). |
| `brainstorming`, `writing-plans`, `executing-plans` | Diseñar antes de construir. |
| `dispatching-parallel-agents`, `subagent-driven-development`, `using-git-worktrees` | Paralelizar bien. |
| `systematic-debugging` | Depurar de forma metódica (p. ej. animaciones en headless). |

**Instalables del ecosistema** (`npx skills add <owner/repo@skill>`; verifica installs/fuente
antes de instalar):

| Skill | Installs | Para qué |
|---|---|---|
| `emilkowalski/skill@review-animations` | ~3.9K | El experto de animación que ya referencias. |
| `heygen-com/hyperframes@css-animations` | ~72K | Animación CSS de alta calidad. |
| `heygen-com/hyperframes@hyperframes-animation` | ~12K | Animaciones de keyframes/secuencias. |
| `mblode/agent-skills@ui-animation` | ~6.2K | Microinteracciones de UI. |
| `supermemoryai/skills@svg-animations` | ~1.1K | Animar SVG (diagramas tipo 04/12/29). |
| `rknall/claude-skills@svg-logo-designer` | ~1.2K | Diseñar logos/SVG. |
| `nweii/agent-stuff@suggest-lucide-icons` | — | Sugerir íconos Lucide (tu librería). |
| `jwynia/agent-skills@presentation-design` | ~1.7K | Principios de diseño de presentaciones. |

**MCPs / herramientas ya conectadas, útiles para decks:**
- **Canva** — generar/editar diseños y exportar.
- **Excalidraw / tldraw / Miro / Mermaid** — diagramas y flujos (ideal para slides tipo
  modelo-de-negocio, flujos y cadenas).
- **claude-in-chrome** — screenshots y QA visual automatizada del deck.
- **Drive / Notion** — traer contenido/fuentes de forma estructurada.

### B6. Anti-patrones observados (evitar en el próximo deck)
- Construir a fondo sobre un spec no congelado.
- Cifras hardcodeadas por slide (cambiar una obliga a cazarla en varios archivos).
- Recordar pasos mecánicos vía prosa en `CLAUDE.md` en vez de hooks.
- Micro-commits supervisados en serie en vez de lotes + paralelismo.
- Verificación 100% manual (cara y propensa a regresiones de espaciado, p. ej. `fitSlide`).
- Refactor masivo de tokens justo antes de una entrega.

---

## Cómo paralelizar (subir de nivel)

### Cuándo usar qué herramienta

| Herramienta | Úsala cuando… | Coordinación |
|---|---|---|
| **Subagentes en este workspace** (`Agent`/Task) | trabajo de **lectura/exploración** o **generación independiente que NO escribe los mismos archivos** (p. ej. 5 agentes redactando 5 slides distintos; varias búsquedas a la vez) | Tú das a cada uno un alcance **disjunto** y consolidas. Tipos: `Explore` (read-only), `Plan` (diseño), `general-purpose` (multistep). |
| **Worktrees aislados** (`isolation:"worktree"` o skill `using-git-worktrees`) | varios agentes **escriben archivos en paralelo** y chocarían | Cada uno en su copia del repo; integras al final. Más costoso: úsalo solo si hay escritura concurrente real. |
| **Workspaces de Conductor** (varios agentes humano-en-loop) | tareas grandes e **independientes** en paralelo (animaciones en uno, contenido en otro) | Reparte **propiedad de slides** por workspace; los merge drivers auto-resuelven los generados. |
| **Workflow tool** | orquestación **determinista** (fan-out + verificación) que pidas explícitamente | El script define qué corre en paralelo y qué hace barrera. |

### Reglas para coordinar bien
1. **Disjunta el trabajo** por archivo/slide (mapa de propiedad) → cero choques de merge.
2. **Brief autocontenido por agente**: los subagentes **no comparten tu contexto**; dales todo lo
   necesario (rutas, restricciones, formato de salida esperado).
3. **Barrera solo cuando necesitas todos los resultados juntos**; si no, deja que cada uno avance
   (pipeline).
4. **Tú eres el integrador**: los subagentes devuelven datos/borradores; tú decides y unificas.
5. **Empieza chico**: 2–3 agentes en paralelo, valida la calidad, y escala.

### Escalera de madurez de uso de IA
| Nivel | Qué es | Hoy | Cómo subir |
|---|---|---|---|
| **L1** Copiloto de tecleo | supervisar cada micro-edit | ⬅️ gran parte | empezar a agrupar |
| **L2** Delegación por tarea | "haz este lote, rebuild, muéstrame" | ⬅️ a veces | hacerlo el default |
| **L3** Paralelismo | varios agentes/workspaces en slices | infra lista, poco uso | mapa de propiedad + lanzar en paralelo |
| **L4** Automatización del loop | hooks/CI quitan lo mecánico | parcial (merge drivers) | hooks pre-commit + dev-server |
| **L5** Verificación delegada | la IA propone **y se autoverifica** | no aún | pedir self-check por defecto |

**Meta:** que el próximo proyecto **nazca en L3–L4** (gracias a la base) y opere en L4–L5 como
hábito.

---

## Checklist de arranque del próximo proyecto
- [ ] Clonar la base reutilizable (no empezar de cero).
- [ ] `sh scripts/setup-git.sh` (merge drivers activos).
- [ ] Elegir tema/typeset; limpiar `CLAUDE.md` de lo específico del proyecto anterior (dejar política).
- [ ] Crear `cifras.md` (fuente única) **antes** de los slides.
- [ ] Congelar la referencia del sprint (o brainstorm + esqueleto si no hay base).
- [ ] Hook pre-commit + dev-server script activos.
- [ ] Trabajar por **lotes**; mapa de propiedad de slides si hay paralelismo.
- [ ] Pedir **autoverificación** antes de revisar.

---

## Lo que ya funciona — conservar
Build determinista (1 archivo/slide) · merge drivers (`union` + `deck-rebuild`) · skills propias ·
memoria + `CLAUDE.md` detallado · reglas de comunicación ("siempre recomienda", "conciso pero
completo") · diseño tokenizado · devlog disciplinado · churn casi nulo.
