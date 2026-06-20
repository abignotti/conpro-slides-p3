# Design tokens — Deck "Escalamiento de Conpro"

> Estos son los **tweaks** del diseño: parámetros ajustables con nombre.
> En **Claude Design**, pídele que los use como variables (no valores fijos)
> y que los conserve. En **Claude Code**, se vuelven CSS custom properties:
> cambias un token y todo el deck se reajusta, sin tocar slide por slide.

---

## Color
| Token | Valor | Uso |
|---|---|---|
| `--color-bg` | `#0F0F0F` | Fondo principal |
| `--color-bg-alt` | `#161616` | Fondo de slides de declaración / tarjetas |
| `--color-text` | `#F5F5F5` | Texto principal |
| `--color-text-muted` | `#9A9A9A` | Contexto, subtítulos, ejes |
| `--color-accent` | `#FCCE4E` | Dato/elemento clave (uno por slide) |
| `--color-negative` | `#C46B5A` | Serie "mala" en gráficos (escenario pesimista). Ajustable |
| `--color-grid` | `#2A2A2A` | Líneas de eje/grilla, muy sutiles |

## Tipografía
| Token | Valor | Uso |
|---|---|---|
| `--font-display` | `"Fraunces"` | Titulares |
| `--font-body` | `"Inter"` | Cuerpo y datos |
| `--weight-display` | `700` | Peso de titulares |
| `--scale-hero` | `clamp(5rem, 12vw, 9rem)` | Número hero |
| `--scale-h1` | `clamp(2.5rem, 5vw, 4rem)` | Titular de slide |
| `--scale-body` | `1.125rem` | Cuerpo |
| `--scale-caption` | `0.875rem` | Contexto / pie de dato |

## Espaciado / layout
| Token | Valor | Uso |
|---|---|---|
| `--space-unit` | `8px` | Unidad base (todo es múltiplo de esto) |
| `--slide-padding` | `80px` | Margen interior de cada slide |
| `--content-max` | `1100px` | Ancho máximo de contenido |
| `--radius` | `12px` | Bordes de tarjetas/contenedores |

## Gráficos
| Token | Valor | Uso |
|---|---|---|
| `--chart-series-1` | `var(--color-accent)` | Serie clave (la que importa) |
| `--chart-series-2` | `#6B7280` | Serie secundaria |
| `--chart-series-3` | `#3F4654` | Serie terciaria |
| `--chart-bar-width` | `60%` | Grosor de barras |
| `--chart-line-weight` | `3px` | Grosor de líneas |

## Movimiento (intención para Code)
| Token | Valor | Uso |
|---|---|---|
| `--motion-duration` | `600ms` | Transiciones de entrada |
| `--motion-ease` | `cubic-bezier(0.4, 0, 0.2, 1)` | Curva de easing |
| `--count-duration` | `1200ms` | Velocidad del conteo ascendente (datos hero) |

---

## Bloque listo para Claude Code
Copiar tal cual al CSS del deck (reveal.js):

```css
:root {
  /* Color */
  --color-bg: #0F0F0F;
  --color-bg-alt: #161616;
  --color-text: #F5F5F5;
  --color-text-muted: #9A9A9A;
  --color-accent: #FCCE4E;
  --color-negative: #C46B5A;
  --color-grid: #2A2A2A;

  /* Tipografía */
  --font-display: "Fraunces", serif;
  --font-body: "Inter", sans-serif;
  --weight-display: 700;
  --scale-hero: clamp(5rem, 12vw, 9rem);
  --scale-h1: clamp(2.5rem, 5vw, 4rem);
  --scale-body: 1.125rem;
  --scale-caption: 0.875rem;

  /* Espaciado */
  --space-unit: 8px;
  --slide-padding: 80px;
  --content-max: 1100px;
  --radius: 12px;

  /* Gráficos */
  --chart-series-1: var(--color-accent);
  --chart-series-2: #6B7280;
  --chart-series-3: #3F4654;
  --chart-bar-width: 60%;
  --chart-line-weight: 3px;

  /* Movimiento */
  --motion-duration: 600ms;
  --motion-ease: cubic-bezier(0.4, 0, 0.2, 1);
  --count-duration: 1200ms;
}
```
