"""Apply asset cache version and shared page-header class across journal HTML."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ASSET_VERSION = "20260606"

STYLES_RE = re.compile(r"styles\.css\?v=[^\"']+")
MAIN_RE = re.compile(r"main\.js\?v=[^\"']+")


def polish_text(text: str) -> str:
    text = STYLES_RE.sub(f"styles.css?v={ASSET_VERSION}", text)
    text = MAIN_RE.sub(f"main.js?v={ASSET_VERSION}", text)
    text = text.replace('class="page-title"', 'class="page-header page-title"')
    text = text.replace(
        '<section class="section"><div class="wrap grid three">',
        '<section class="section section--listing"><div class="wrap grid three">',
    )
    text = text.replace(
        '<section class="section"><div class="wrap grid two">',
        '<section class="section section--content"><div class="wrap grid two">',
    )
    return text


def main() -> None:
    changed = 0
    for html in sorted(ROOT.rglob("*.html")):
        original = html.read_text(encoding="utf-8")
        updated = polish_text(original)
        if updated != original:
            html.write_text(updated, encoding="utf-8")
            changed += 1
    print(f"Polished {changed} HTML file(s) -> assets v={ASSET_VERSION}")


if __name__ == "__main__":
    main()
