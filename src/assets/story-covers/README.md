# Story cover assets

## Source masters (edit these)

| Path | Contents |
|---|---|
| `sources/cover-stories.png` | **Preferred** Ep 1–8 text-free illustration grid |
| `sources/cover-stories-banner.png` | Alternate text-free Ep 1–8 grid |
| `sources/cover-stories-season-2.png` | **Preferred** Ep 9–16 text-free illustration grid |
| `sources/cover-stories-season-2-alt.png` | Alternate text-free Ep 9–16 grid |
| `sources/season-1-covers-4x2.png` | Legacy titled poster grid |
| `sources/episodes-1-3-storyboard.png` | Ep 1–3 scenes + brand kit |
| `sources/season-2-zones-4x4.png` | Zone posters (forest map art) |

**Do not** duplicate PNGs in this folder root — keep masters in `sources/` only.

## Generated outputs (do not hand-edit)

| Path | Contents |
|---|---|
| `episode-1-cover.webp` … `episode-16-cover.webp` | Portrait card covers (`fit: cover`, gutters trimmed) |

Regenerate after changing a source:

```bash
npm run assets:story-covers
npm run assets:story-covers:verify   # edge bleed QA + overlay PNGs in sources/_crop-verify/
```

The crop script trims grid gutters, crops cells, resizes to 512×640 with `fit: cover`, then writes validated WebPs.

Legacy fallbacks (`episode-1-hero-source.png`, `story-covers-master.png`) are only used when the Season 1 grid source is missing.

Episode 1 hero framing on `/stories` uses `coverHeroImagePosition` in `src/data/stories.ts` (`32% center`).
