"""Agrega un <span data-conpro-header-fallback> al lado del lockup del header,
con el texto original que tenía cada slide. CSS oculta uno u otro según
data-logo en .reveal. Idempotente.
"""
import glob, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIR = os.path.join(ROOT, "presentacion")

LOCKUP = ('<div data-conpro-lockup="h" style="display:flex;align-items:center;'
          'gap:14px;color:var(--color-text);"><svg viewBox="0 0 64 64" width="38"'
          ' height="38" aria-hidden="true" style="display:block;flex:none;">'
          '<circle cx="32" cy="24.5" r="15" fill="none" stroke="currentColor"'
          ' stroke-width="3.6"/><circle cx="24" cy="40.5" r="15" fill="none"'
          ' stroke="currentColor" stroke-width="3.6"/><circle cx="40" cy="40.5"'
          ' r="15" fill="none" stroke="currentColor" stroke-width="3.6"/>'
          '<circle cx="32" cy="35" r="4.6" fill="var(--color-accent)"/></svg>'
          '<span style="font-family:var(--font-body);font-weight:700;'
          'font-size:30px;letter-spacing:-0.02em;line-height:1;">Conpro</span>'
          '</div>')

def fallback(text, ls):
    return (f'<span data-conpro-header-fallback style="font-size:var(--scale-caption);'
            f'font-weight:600;letter-spacing:{ls};text-transform:uppercase;'
            f'color:var(--color-text-muted);">{text}</span>')

changed = []
skipped = []
for f in sorted(glob.glob(os.path.join(DIR, "*.html"))):
    name = os.path.basename(f)
    s = open(f, encoding="utf-8").read()
    if 'data-conpro-header-fallback' in s:
        skipped.append((name, "ya tiene fallback")); continue
    if LOCKUP not in s:
        skipped.append((name, "sin lockup conocido")); continue
    if name == "01-portada.html":
        fb = fallback("Conpro · 2026", "0.22em")
    else:
        fb = fallback("Evaluación de Proyectos", "0.2em")
    s = s.replace(LOCKUP, LOCKUP + fb, 1)
    open(f, "w", encoding="utf-8").write(s)
    changed.append(name)

print(f"Cambiados: {len(changed)}")
for n in changed: print(f"  ✓ {n}")
if skipped:
    print(f"\nNo tocados: {len(skipped)}")
    for n, why in skipped: print(f"  - {n} ({why})")
