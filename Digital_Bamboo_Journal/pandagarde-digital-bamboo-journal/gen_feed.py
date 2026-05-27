"""Generate rss.xml and sitemap.xml from the post content model in build_posts.

Run: python gen_feed.py
"""
from __future__ import annotations

import html
from datetime import datetime, timezone
from pathlib import Path

from build_posts import BASE_URL, CATEGORY_URL, POSTS, fmt_date

ROOT = Path(__file__).resolve().parent

ROOT_PAGES = [
    "index.html", "family-digital-life.html", "inside-the-forest.html",
    "parent-guides.html", "digital-resilience.html", "educator-corner.html",
    "research-insights.html", "summer-camp.html", "socialcaution-bridge.html",
    "edusoluce-bridge.html", "seasonal-challenges.html", "pandagarde-news.html",
]


def rfc822(iso: str) -> str:
    dt = datetime.strptime(iso, "%Y-%m-%d").replace(tzinfo=timezone.utc)
    return dt.strftime("%a, %d %b %Y 00:00:00 +0000")


def sorted_posts() -> list[tuple[str, dict]]:
    return sorted(POSTS.items(), key=lambda kv: kv[1]["date"], reverse=True)


def build_rss() -> str:
    now = datetime.now(timezone.utc).strftime("%a, %d %b %Y %H:%M:%S +0000")
    items = []
    for slug, data in sorted_posts():
        link = f"{BASE_URL}/posts/{slug}.html"
        items.append(
            "<item>"
            f"<title>{html.escape(data['title'])}</title>"
            f"<link>{link}</link>"
            f'<guid isPermaLink="true">{link}</guid>'
            f"<category>{html.escape(data['category'])}</category>"
            f"<pubDate>{rfc822(data['date'])}</pubDate>"
            f"<description>{html.escape(data['description'])}</description>"
            "</item>"
        )
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n<channel>\n'
        "<title>Digital Bamboo Journal | PandaGarde</title>\n"
        f"<link>{BASE_URL}/</link>\n"
        f'<atom:link href="{BASE_URL}/rss.xml" rel="self" type="application/rss+xml"/>\n'
        "<description>Calm, shame-free digital resilience for families, educators, and children.</description>\n"
        "<language>en</language>\n"
        f"<lastBuildDate>{now}</lastBuildDate>\n"
        + "\n".join(items)
        + "\n</channel>\n</rss>\n"
    )


def build_sitemap() -> str:
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    urls = [f"  <url><loc>{BASE_URL}/{p}</loc><lastmod>{today}</lastmod></url>" for p in ROOT_PAGES]
    for slug, data in sorted_posts():
        urls.append(
            f"  <url><loc>{BASE_URL}/posts/{slug}.html</loc>"
            f"<lastmod>{data['date']}</lastmod></url>"
        )
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(urls)
        + "\n</urlset>\n"
    )


def main() -> None:
    (ROOT / "rss.xml").write_text(build_rss(), encoding="utf-8")
    (ROOT / "sitemap.xml").write_text(build_sitemap(), encoding="utf-8")
    print(f"Wrote rss.xml ({len(POSTS)} items) and sitemap.xml.")


if __name__ == "__main__":
    main()
