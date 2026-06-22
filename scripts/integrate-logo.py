"""Integra el lockup horizontal Conpro (isotipo + wordmark) en el header
izquierdo de todas las slides de contenido, reemplazando el span
'Evaluación de Proyectos'. Tareas hermanas (portada y síntesis) se hacen a mano.

Idempotente: si ya hay un data-conpro-lockup en el header, no toca nada.
"""
import glob, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIR = os.path.join(ROOT, "presentacion")

OLD = (
    '<span style="font-size:var(--scale-caption);font-weight:600;'
    'letter-spacing:0.2em;text-transform:uppercase;color:var(--color-text-muted);'
    '">Evaluación de Proyectos</span>'
)

NEW = (
    '<div data-conpro-lockup="h" style="display:flex;align-items:center;'
    'gap:14px;color:var(--color-text);">'
    '<svg viewBox="0 0 64 64" width="38" height="38" aria-hidden="true" '
    'style="display:block;flex:none;">'
    '<circle cx="32" cy="24.5" r="15" fill="none" stroke="currentColor" stroke-width="3.6"/>'
    '<circle cx="24" cy="40.5" r="15" fill="none" stroke="currentColor" stroke-width="3.6"/>'
    '<circle cx="40" cy="40.5" r="15" fill="none" stroke="currentColor" stroke-width="3.6"/>'
    '<circle cx="32" cy="35" r="4.6" fill="var(--color-accent)"/>'
    '</svg>'
    '<span style="font-family:var(--font-body);font-weight:700;font-size:30px;'
    'letter-spacing:-0.02em;line-height:1;">Conpro</span>'
    '</div>'
)

skipped = []
changed = []
for f in sorted(glob.glob(os.path.join(DIR, "*.html"))):
    name = os.path.basename(f)
    if name == "01-portada.html":
        skipped.append((name, "portada (manual)"))
        continue
    s = open(f, encoding="utf-8").read()
    if 'data-conpro-lockup' in s:
        skipped.append((name, "ya tiene lockup"))
        continue
    if OLD not in s:
        skipped.append((name, "no matchea span"))
        continue
    s = s.replace(OLD, NEW, 1)
    open(f, "w", encoding="utf-8").write(s)
    changed.append(name)

print(f"Cambiados: {len(changed)}")
for n in changed:
    print(f"  ✓ {n}")
if skipped:
    print(f"\nNo tocados: {len(skipped)}")
    for n, why in skipped:
        print(f"  - {n} ({why})")
