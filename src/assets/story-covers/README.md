# Story cover assets

## Source masters (edit these)

| Path | Contents |
|---|---|
| `sources/season-1-covers-4x2.png` | Ep 1–8 poster grid (required) |
| `sources/episodes-1-3-storyboard.png` | Ep 1–3 scenes + brand kit |
| `sources/season-2-zones-4x4.png` | Zone posters (forest map art) |

**Do not** duplicate PNGs in this folder root — keep masters in `sources/` only.

## Generated outputs (do not hand-edit)

| Path | Contents |
|---|---|
| `episode-1-cover.webp` … `episode-8-cover.webp` | 512×640 portrait card covers (`fit: contain`, full illustration) |

Regenerate after changing a source:

```bash
npm run assets:story-covers
npm run assets:story-covers:verify   # edge bleed QA + overlay PNGs in sources/_crop-verify/
```

The crop script trims grid gutters, crops once to 16:9 (no double-crop truncation), then writes validated WebPs.

Legacy fallbacks (`episode-1-hero-source.png`, `story-covers-master.png`) are only used when the grid source is missing.

Episode 1 hero framing on `/stories` uses `coverHeroImagePosition` in `src/data/stories.ts` (`32% center`).
