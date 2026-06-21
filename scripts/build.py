import glob, os, re

# ---------------------------------------------------------------------------
# Build de los dos decks reveal.js a partir de sus carpetas de partials:
#
#   moldes/        -> moldes.html   (galería/referencia de los 22 templates)
#   presentacion/  -> index.html    (el deck REAL, entrypoint que va a Vercel)
#
# Cada slide vive en su propio archivo NN-*.html (un <section class="slide">…
# </section> autocontenido, ya tokenizado). Este script solo los ORDENA por su
# prefijo numérico y los concatena dentro del cascarón reveal. Sin
# transformaciones "mágicas": lo que ves en el partial es lo que se publica.
# Un molde puede copiarse a presentacion/ y usarse en varios slides.
# ---------------------------------------------------------------------------

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

FONTS = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&family=Source+Sans+3:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Archivo:wght@500;600;700;800&family=Anton&family=Space+Mono:wght@400;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=Montserrat:wght@500;600;700;800&display=swap'


def collect(src_dir):
    """Lee y valida los partials de src_dir, ordenados por nombre."""
    files = sorted(glob.glob(os.path.join(src_dir, "*.html")))
    parts = []
    for f in files:
        s = open(f, encoding="utf-8").read().strip()
        n = len(re.findall(r'<section\b', s))
        assert n == 1, f"{os.path.basename(f)}: se esperaba 1 <section>, hay {n}"
        assert 'class="slide"' in s, f"{os.path.basename(f)}: falta class=\"slide\""
        parts.append(s)
    return files, parts


def shell(title, slides_html, typeset="Editorial"):
    return f'''<!DOCTYPE html>
<html lang="es" data-theme="Mostaza claro" data-typeset="{typeset}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
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

{slides_html}

    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.js"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="js/charts.js"></script>
  <script src="js/anim.js"></script>
  <script src="js/deck.js"></script>
</body>
</html>
'''


def build(src_dir, out_file, title, typeset="Editorial"):
    src = os.path.join(ROOT, src_dir)
    files, parts = collect(src)
    if not parts:
        print(f"⚠  {src_dir}/ vacío — no se genera {out_file} (sin slides todavía)")
        return
    doc = shell(title, "\n\n".join(parts), typeset=typeset)
    out = os.path.join(ROOT, out_file)
    open(out, "w", encoding="utf-8").write(doc)
    print(f"✔  {out_file}: {len(doc)} chars, {len(parts)} slides desde {src_dir}/")
    for f in files:
        print("     ·", os.path.basename(f))


if __name__ == "__main__":
    build("moldes", "moldes.html", "Moldes — Escalamiento de Conpro")
    build("presentacion", "index.html", "Escalamiento de Conpro", typeset="Corporativo")
