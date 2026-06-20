# Sistema de diseño — Deck "Escalamiento de Conpro"

> Documento de diseño del deck. Adjúntalo junto a `design-tokens.md`,
> `que-no-hacer.md` y tus referencias. Reutilizable: el contenido cambia
> entre presentaciones, esto no.

---

## Dirección visual
Layouts tipo **annual report** (data-heavy, tablas pulidas, jerarquía
editorial) ejecutados en **paleta oscura premium**. Rigor de reporte +
estética de pitch. Ver referencias adjuntas.

## Formato
- reveal.js (HTML / CSS / JS). Export a PDF para respaldo.

## Paleta (fondo oscuro)
| Rol | Hex | Uso |
|---|---|---|
| Fondo | `#0F0F0F` | Casi negro, no negro puro |
| Texto | `#F5F5F5` | Blanco roto, titulares y cuerpo |
| Secundario | `#9A9A9A` | Gris, para contexto y subtítulos |
| Acento | `#FCCE4E` | Amarillo mostaza. **SOLO el dato/elemento clave de cada slide** |

## Tipografía
| Rol | Fuente | Peso | Notas |
|---|---|---|---|
| Titulares | **Fraunces** | 700 | Serif display, el "premium con carácter" |
| Cuerpo | **Inter** | 400–500 | Neutra y legible |
| Números hero | **Inter tabular** | 600 | Tamaño enorme, cifras alineadas |

## Reglas de tono "premium"
- **Una idea por slide.** Si hay dos, son dos slides.
- **Whitespace generoso:** todo respira.
- **Jerarquía por TAMAÑO, no por color.** El amarillo destaca, no jerarquiza.
- **El amarillo, con moderación:** un solo elemento clave por slide.
- **Datos hero:** conteo ascendente al entrar (GSAP).

## Gráficos
- Librería: **Chart.js**.
- Heredan la paleta: **serie clave en amarillo, resto en gris**.
- Sin decoración: sin gridlines pesadas, sin leyendas redundantes, sin sombras.

---

## Arquetipos (los moldes que se repiten)
| Arquetipo | Cubre |
|---|---|
| Portada / declaración | Apertura, cierre, frases ancla |
| Dato hero | Un número gigante (VAN, mercado) |
| Stat grid | Grilla de 3–4 números (ej. hogares + proveedores) |
| Bullets / lista | Metodología, recomendaciones |
| Split 2 columnas | Texto + un visual (gráfico/dato/tabla). Layout report estrella |
| Tabla | VAN por escenario, comparativa CBO, opción de esperar |
| Gráfico de barras | Ganancia, márgenes, holgura, comparación a escala. **Define el estilo de todos los gráficos** |
| Gráfico de líneas | Evolución de hogares por escenario |
| Timeline / cadena | Mapa con gatillo, cadenas lógicas |

> Los gráficos especiales (tornado, barras apiladas, rangos de precio)
> **heredan** el estilo del gráfico de barras: no se diseñan aparte.
