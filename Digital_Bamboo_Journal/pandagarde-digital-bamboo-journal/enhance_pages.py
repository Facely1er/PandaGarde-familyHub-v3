"""Add unique descriptions + Open Graph/Twitter/canonical tags to root pages.

Posts are handled by build_posts.py. Redirect stubs are skipped. Idempotent:
re-running updates the description and refreshes the social block in place.

Run: python enhance_pages.py
"""
from __future__ import annotations

import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BASE_URL = "https://journal.pandagarde.com"
OG_IMAGE = f"{BASE_URL}/assets/LogoPandagarde.png"

# filename -> (title-for-social, unique description)
PAGES: dict[str, tuple[str, str]] = {
    "index.html": (
        "Digital Bamboo Journal",
        "Calm, shame-free digital resilience for families, educators, and children—stories, parent guides, and research-informed practice from PandaGarde.",
    ),
    "family-digital-life.html": (
        "Family Digital Life",
        "Calm, practical guidance for the everyday realities of raising children online—screen-time conflict, disclosure, and shame-free conversations.",
    ),
    "inside-the-forest.html": (
        "Inside the Forest",
        "Step into the Digital Bamboo Forest. Gentle story-world articles that help children understand privacy, trust, and asking for help.",
    ),
    "parent-guides.html": (
        "Parent Guides",
        "Practical checklists, platform safety guides, and calm conversation starters to help parents support children online with confidence.",
    ),
    "digital-resilience.html": (
        "Digital Resilience",
        "Why skills, language, and confidence matter more than screen limits—and how families and schools build lasting digital resilience.",
    ),
    "educator-corner.html": (
        "Educator Corner",
        "Structured, family-reinforced approaches to digital resilience for elementary classrooms, with implementation ideas for educators.",
    ),
    "research-insights.html": (
        "Research Insights",
        "Evidence-informed perspectives on how children learn digital safety, seasonal risk patterns, and what actually changes behavior.",
    ),
    "seasonal-challenges.html": (
        "Seasonal Challenges",
        "Gentle, time-bound family activities that build calm digital habits across the year, one small ritual at a time.",
    ),
    "pandagarde-news.html": (
        "PandaGarde News",
        "Updates from PandaGarde and the Digital Bamboo Journal, including the planned Privacy Panda Summer Camp pilot.",
    ),
    "summer-camp.html": (
        "Privacy Panda Summer Camp",
        "A planned summer pilot that turns the summer reset into a calm, weekly family ritual for digital resilience. Not a live program yet.",
    ),
    "socialcaution-bridge.html": (
        "SocialCaution Family Privacy Tools",
        "Device checklists, exposure snapshots, and privacy-plan templates for parents, built from the services families already use.",
    ),
    "edusoluce-bridge.html": (
        "EduSoluce School Programs",
        "Curriculum pilots, educator kits, and implementation support for bringing digital resilience into classrooms.",
    ),
}

SKIP = {"campfire-conversations.html"}  # redirect stub

SOCIAL_RE = re.compile(r"<!--social:start-->.*?<!--social:end-->", re.DOTALL)
DESC_RE = re.compile(r'<meta name="description" content="[^"]*">')


def social_block(filename: str, title: str, desc: str) -> str:
    url = f"{BASE_URL}/{filename}"
    et, ed = html.escape(title), html.escape(desc)
    og_type = "website" if filename == "index.html" else "article"
    return (
        "<!--social:start-->"
        f'<link rel="canonical" href="{url}">'
        f'<meta property="og:type" content="{og_type}">'
        '<meta property="og:site_name" content="Digital Bamboo Journal">'
        f'<meta property="og:title" content="{et} | PandaGarde">'
        f'<meta property="og:description" content="{ed}">'
        f'<meta property="og:url" content="{url}">'
        f'<meta property="og:image" content="{OG_IMAGE}">'
        f'<link rel="alternate" type="application/rss+xml" title="Digital Bamboo Journal" href="{BASE_URL}/rss.xml">'
        '<meta name="twitter:card" content="summary_large_image">'
        f'<meta name="twitter:title" content="{et} | PandaGarde">'
        f'<meta name="twitter:description" content="{ed}">'
        f'<meta name="twitter:image" content="{OG_IMAGE}">'
        "<!--social:end-->"
    )


def main() -> None:
    changed = 0
    for filename, (title, desc) in PAGES.items():
        if filename in SKIP:
            continue
        path = ROOT / filename
        if not path.exists():
            print(f"  skip (missing): {filename}")
            continue
        text = path.read_text(encoding="utf-8")
        new_desc = f'<meta name="description" content="{html.escape(desc)}">'
        if DESC_RE.search(text):
            text = DESC_RE.sub(new_desc, text, count=1)
        block = social_block(filename, title, desc)
        if SOCIAL_RE.search(text):
            text = SOCIAL_RE.sub(block, text)
        else:
            text = text.replace("</head>", block + "</head>", 1)
        path.write_text(text, encoding="utf-8")
        changed += 1
    print(f"Enhanced {changed} root page(s) with unique descriptions + social tags.")


if __name__ == "__main__":
    main()
