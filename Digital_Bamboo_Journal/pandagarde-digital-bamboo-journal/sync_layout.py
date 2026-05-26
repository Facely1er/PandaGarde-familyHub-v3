"""Sync header nav (6 items) and footer across all journal HTML pages."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ASSET_VERSION = "20260527"

NAV = [
    ("index.html", "Home"),
    ("family-digital-life.html", "Family Digital Life"),
    ("inside-the-forest.html", "Inside the Forest"),
    ("parent-guides.html", "Parent Guides"),
    ("digital-resilience.html", "Digital Resilience"),
    ("educator-corner.html", "Educator Corner"),
]

FOOTER_MORE = [
    ("research-insights.html", "Research Insights"),
    ("seasonal-challenges.html", "Seasonal Challenges"),
    ("pandagarde-news.html", "PandaGarde News"),
    ("campfire-conversations.html", "Campfire Conversations"),
]

FOOTER_ECOSYSTEM = [
    ("socialcaution-bridge.html", "SocialCaution Family Privacy Tools"),
    ("edusoluce-bridge.html", "EduSoluce School Programs"),
    ("summer-camp.html", "Privacy Panda Summer Camp"),
]

NAV_RE = re.compile(
    r'<nav class="nav" aria-label="Main navigation">.*?</nav>',
    re.DOTALL,
)
FOOTER_RE = re.compile(
    r'<footer class="site-footer"><div class="wrap footer-grid">.*?</div></footer>',
    re.DOTALL,
)
ICON_SPAN_RE = re.compile(
    r'<span class="nav-icon" aria-hidden="true">[^<]*</span>',
)


def prefix_for(html: Path) -> str:
    depth = len(html.relative_to(ROOT).parts) - 1
    return "../" * depth if depth else ""


def page_slug(html: Path) -> str:
    if html.name == "index.html":
        return "index.html"
    return html.name


def build_nav(pfx: str, current: str) -> str:
    parts = []
    for href, label in NAV:
        full = f"{pfx}{href}"
        cur = ' aria-current="page"' if href == current else ""
        parts.append(f'<a href="{full}"{cur}><span>{label}</span></a>')
    return (
        '<nav class="nav" aria-label="Main navigation">'
        + "".join(parts)
        + "</nav>"
    )


def build_footer(pfx: str) -> str:
    more_links = "".join(
        f'<a href="{pfx}{href}"><span>{label}</span></a>' for href, label in FOOTER_MORE
    )
    eco_links = "".join(
        f'<a href="{pfx}{href}"><span>{label}</span></a>'
        for href, label in FOOTER_ECOSYSTEM
    )
    return (
        '<footer class="site-footer"><div class="wrap footer-grid">'
        "<div><h3>Digital Bamboo Journal</h3>"
        '<p class="notice">A calm family digital resilience publication by PandaGarde. '
        "Designed to support children, parents, and educators without shame, fear, "
        'or surveillance-first messaging.</p></div>'
        "<div><h3>More from the Journal</h3>"
        f"{more_links}</div>"
        "<div><h3>Ecosystem Links</h3>"
        f"{eco_links}</div>"
        "</div></footer>"
    )


def sync_file(html: Path) -> bool:
    text = html.read_text(encoding="utf-8")
    original = text
    pfx = prefix_for(html)
    current = page_slug(html)

    text = ICON_SPAN_RE.sub("", text)
    text, n_nav = NAV_RE.subn(build_nav(pfx, current), text, count=1)
    text, n_footer = FOOTER_RE.subn(build_footer(pfx), text, count=1)
    text = re.sub(r"styles\.css\?v=[^\"']+", f"styles.css?v={ASSET_VERSION}", text)
    text = re.sub(r"main\.js\?v=[^\"']+", f"main.js?v={ASSET_VERSION}", text)

    if n_nav == 0 and n_footer == 0:
        return False
    if n_nav != 1 or n_footer != 1:
        raise RuntimeError(f"{html.relative_to(ROOT)}: nav={n_nav} footer={n_footer}")

    if text != original:
        html.write_text(text, encoding="utf-8")
        return True
    return False


def main() -> None:
    changed = 0
    for html in sorted(ROOT.rglob("*.html")):
        if sync_file(html):
            changed += 1
    print(f"Updated {changed} HTML file(s).")


if __name__ == "__main__":
    main()
