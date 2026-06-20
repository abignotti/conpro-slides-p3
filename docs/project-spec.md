# Escalamiento de Conpro

Deck de presentación para la evaluación de un proyecto de Ingeniería Comercial: el
escalamiento de **Conpro**, una iniciativa de comercio comunitario que actúa como
intermediario entre proveedores (que ofrecen descuentos por volumen) y una demanda
minorista agregada — múltiples consumidores coordinan compras conjuntas para acceder
a mejores precios y repartir el costo de despacho. Hoy opera de manera informal vía
comunidades de WhatsApp gestionadas por su fundador (Ricardo Melo, 2025): ~100
personas, ~60 hogares activos, grupos segmentados por proveedor con mínimos de
volumen; Ricardo coordina demanda, comunicación, pagos y reclamos, y cobra comisión.
**Audiencia:** el fundador de Conpro, el profesor a cargo y el profesor auxiliar
(ayudante experto, trabaja en BCG). **Stack:** reveal.js + Chart.js (HTML/CSS/JS con
diseño tokenizado), deploy a Vercel; export a PDF y a PPTX editable como respaldo.

## Fuera del scope
- Sin backend ni datos en vivo: las cifras se hornean en los slides.
- No es una webapp pública ni una herramienta interactiva: es un deck de presentación.
- Paridad pixel-perfect entre el deck web (con animaciones/diseño) y el PPTX editable:
  son dos representaciones distintas; el PPTX es una versión de contenido, simplificada.

## Hitos
1. Moldes — biblioteca de 22 templates tokenizados (9 temas × 7 typesets) + tooling de build — hecho
2. Docs y flujo de trabajo — CLAUDE.md, project-spec, devlog, .gitignore, scripts versionados — hecho
3. Deck real — armar la presentación con el contenido y las cifras reales sobre los moldes (en `presentacion/`)
4. Pulido visual — mejorar diseño + animaciones/transiciones con skills (Emil Kowalski + otras vía `find skills`)
5. Deploy a Vercel — entregable "pro" que se diferencie del resto de los compañeros
6. Export a PPTX editable-nativo — versión de contenido (sin animaciones/diseño complejo) para que las compañeras editen en PowerPoint y luego se pase a code

Listo (MVP) = presentación visualmente de alto nivel, con animaciones y transiciones,
deployada a Vercel, y con export a PPTX editable disponible cuando se pida.
