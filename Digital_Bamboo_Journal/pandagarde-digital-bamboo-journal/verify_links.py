
from pathlib import Path
from html.parser import HTMLParser
root=Path(__file__).resolve().parent
class P(HTMLParser):
    def __init__(self): super().__init__(); self.links=[]
    def handle_starttag(self,tag,attrs):
        if tag=='a':
            d=dict(attrs); href=d.get('href')
            if href and not (href.startswith('http') or href.startswith('#') or href.startswith('mailto:')): self.links.append(href.split('#')[0])
errors=[]
for html in root.rglob('*.html'):
    p=P(); p.feed(html.read_text(encoding='utf-8'))
    for href in p.links:
        target=(html.parent/href).resolve()
        if not str(target).startswith(str(root.resolve())) or not target.exists(): errors.append((str(html.relative_to(root)),href))
if errors:
    print('BROKEN LINKS FOUND')
    for e in errors: print(e)
    raise SystemExit(1)
print('OK: all internal HTML links resolve.')
print('HTML files checked:', len(list(root.rglob('*.html'))))
