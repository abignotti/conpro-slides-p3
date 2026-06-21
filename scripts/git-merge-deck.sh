#!/bin/sh
# ---------------------------------------------------------------------------
# Merge driver para los decks GENERADOS (index.html / moldes.html).
#
# git lo invoca durante un merge con:  %A = archivo resultado, %P = ruta lógica.
# Estrategia: en vez de mezclar el HTML línea a línea (siempre choca y se hace a
# mano), REGENERAMOS el deck desde los partials con scripts/build.py y usamos esa
# salida como resultado del merge. Así el conflicto desaparece solo.
#
# Salvaguarda: si algún PARTIAL quedó con marcadores de conflicto sin resolver
# (dos ramas tocaron el MISMO slide = conflicto de contenido real), abortamos
# (exit 1) para que git marque el conflicto normal y se resuelva a mano. Es decir,
# este driver solo absorbe el ruido mecánico del HTML generado, nunca enmascara
# un conflicto real de contenido.
#
# Registro (una vez por repo):  sh scripts/setup-git.sh
# ---------------------------------------------------------------------------
set -e
RESULT="$1"     # %A — archivo donde git espera el resultado del merge
PATHNAME="$2"   # %P — ruta del archivo en conflicto (index.html / moldes.html)

# cwd durante el merge = raíz del working tree.
if grep -rlE '^(<<<<<<<|>>>>>>>)' presentacion moldes >/dev/null 2>&1; then
  echo "git-merge-deck: hay partials con conflictos sin resolver; resuélvelos y re-corre build.py" >&2
  exit 1
fi

python3 scripts/build.py >/dev/null 2>&1 || exit 1
cp "$PATHNAME" "$RESULT"
exit 0
