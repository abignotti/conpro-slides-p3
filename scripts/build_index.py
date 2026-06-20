import glob, os, re

# ---------------------------------------------------------------------------
# Build index.html = cascarón reveal.js + las 22 secciones de slides/.
#
# Cada slide vive en su propio archivo slides/NN-molde.html (un <section
# class="slide">…</section> autocontenido, ya tokenizado y limpio). Este
# script solo los ORDENA por su prefijo numérico y los concatena dentro del
# cascarón. Sin transformaciones "mágicas": lo que ves en el partial es lo
# que se publica. Para editar un slide → editar su archivo en slides/.
# ---------------------------------------------------------------------------

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SLIDES_DIR = os.path.join(ROOT, "slides")

files = sorted(glob.glob(os.path.join(SLIDES_DIR, "*.html")))
assert files, f"no slides found in {SLIDES_DIR}"

# Validación ligera: cada partial debe tener exactamente un <section class="slide">.
parts = []
for f in files:
    s = open(f, encoding="utf-8").read().strip()
    n = len(re.findall(r'<section\b', s))
    assert n == 1, f"{os.path.basename(f)}: se esperaba 1 <section>, hay {n}"
    assert 'class="slide"' in s, f"{os.path.basename(f)}: falta class=\"slide\""
    parts.append(s)

slides = "\n\n".join(parts)

FONTS = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&family=Source+Sans+3:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Archivo:wght@500;600;700;800&family=Anton&family=Space+Mono:wght@400;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=Montserrat:wght@500;600;700;800&display=swap'

doc = f'''<!DOCTYPE html>
<html lang="es" data-theme="Mostaza claro" data-typeset="Editorial">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Escalamiento de Conpro</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="{FONTS}" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.css">
  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/deck.css">
</head>
<body>
  <div class="reveal" data-chrome="completo">
    <div class="slides">

{slides}

    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.js"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="js/charts.js"></script>
  <script src="js/deck.js"></script>
</body>
</html>
'''

out = os.path.join(ROOT, "index.html")
open(out, "w", encoding="utf-8").write(doc)
print(f"Wrote index.html: {len(doc)} chars, {len(parts)} slides from {SLIDES_DIR}")
for f in files:
    print("  ·", os.path.basename(f))
