#!/bin/sh
# ---------------------------------------------------------------------------
# Registra el merge driver 'deck-rebuild' (ver .gitattributes y
# scripts/git-merge-deck.sh). Idempotente: correrlo varias veces no hace daño.
#
# Solo hace falta UNA vez por repo: los worktrees de Conductor comparten esta
# config. El driver 'union' del devlog NO necesita setup (es built-in de git).
#
# Uso:  sh scripts/setup-git.sh
# ---------------------------------------------------------------------------
set -e
cd "$(dirname "$0")/.."

git config merge.deck-rebuild.name "Regenerar decks (index.html/moldes.html) con build.py"
git config merge.deck-rebuild.driver "sh scripts/git-merge-deck.sh %A %P"

echo "✔ merge driver 'deck-rebuild' registrado."
echo "  Conflictos de index.html/moldes.html se autoregeneran; devlog usa 'union' (sin setup)."
