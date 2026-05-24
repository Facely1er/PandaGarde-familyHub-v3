# Story cover source sheets

Place production art here, then run from repo root:

```bash
npm run assets:story-covers
```

## Required for Season 1 (Episodes 1–8)

| Save attached file as | Contents |
|---|---|
| **`season-1-covers-4x2.png`** | 4×2 grid of episode posters (PANDAGARDE Episodes 1–8). Crop order: row 1 → Ep 1–4, row 2 → Ep 5–8. |

The crop script trims ~11.5% top (title pill) and ~13.5% bottom (logo) per cell, plus **7.5% per side** on shared column borders and **4.5%** on the row split — so neighboring panels should not bleed into the card frame.

### Tunables (in `scripts/crop-story-covers.mjs`)

| Constant | Default | Purpose |
|---|---|---|
| `INNER_COL_GUTTER` | 0.075 | Horizontal shave at column boundaries (each cell takes half) |
| `INNER_ROW_GUTTER` | 0.045 | Vertical shave between row 1 and row 2 |
| `CHROME_TOP` / `CHROME_BOTTOM` | 0.115 / 0.135 | Title badge and bottom logo |
| `OUTER_EDGE` | 0.02 | Sheet outer margin only |

If a panel still shows a sliver of the neighbor, increase `INNER_COL_GUTTER` (e.g. `0.09`) and re-run `npm run assets:story-covers`.

### Canonical slug mapping (grid position → `stories.ts`)

| Grid cell | Episode | `stories.ts` slug | Notes |
|---|---|---|---|
| Row 0, Col 0 | 1 | `privacy-panda-and-the-digital-bamboo-forest` | ✓ |
| Row 0, Col 1 | 2 | `miki-and-the-photo-that-flew-away` | ✓ |
| Row 0, Col 2 | 3 | `billys-invisible-collection` | ✓ Art title matches |
| Row 0, Col 3 | 4 | `mika-and-the-sneaky-settings` | Art says "Owen" — owl/tablet still fits Mika |
| Row 1, Col 0 | 5 | `ruby-and-the-very-friendly-stranger` | Art: Bridge of Consent — reuse until stranger art exists |
| Row 1, Col 1 | 6 | `the-day-the-password-was-too-short` | Art: Tao backup — reuse until password art exists |
| Row 1, Col 2 | 7 | `when-miki-said-something-unkind` | Art: Shadow Mist — reuse until stream/unkind art exists |
| Row 1, Col 3 | 8 | `pos-toughest-question` | Art: Campfire + firefly — Lumi fits Ep 8 |

## Optional — chapter & brand assets

| Save as | Use |
|---|---|
| `episodes-1-3-storyboard.png` | Ep 1–3 cover columns + 10 scene thumbs each + zone/pillar/character icons (future chapter crops) |
| `season-2-zones-4x4.png` | 16 zone posters — **not** wired to Ep 9–16 story slugs (different titles); use for forest map / zone unlock art |

## Legacy (fallback if grid missing)

- `../episode-1-hero-source.png` — single Ep 1 hero
- `../story-covers-master.png` — stacked Ep 2–3 only
