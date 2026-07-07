# Story cover source sheets

Place production art here, then run from repo root:

```bash
npm run assets:story-covers
npm run assets:story-covers:verify
```

## Season 1 sources (Episodes 1–8)

| Save as | Contents |
|---|---|
| **`cover-stories.png`** | **Preferred** — 4×2 zone-labeled illustration grid (Ep 1–8) |
| `cover-stories-banner.png` | Alternate text-free grid |
| `season-1-covers-4x2.png` | Legacy **titled** poster grid |
| `season-1-covers-4x2-titled-reference.png` | Design reference — poster labels for audit |

### UI wiring (`storyCoverAssets.ts`)

All Season 1 episodes **1–8** use bundled WebP covers cropped from `cover-stories.png` (full panel scaled with `fit: contain` — no chrome chop).

### Grid → slug (canonical order)

| Ep | Slug | Source cell |
|---|---|---|
| 1 | `privacy-panda-and-the-digital-bamboo-forest` | R0C0 |
| 2 | `miki-and-the-photo-that-flew-away` | R0C1 |
| 3 | `billys-invisible-collection` | R0C2 |
| 4 | `mika-and-the-sneaky-settings` | R0C3 |
| 5 | `ruby-and-the-very-friendly-stranger` | R1C0 |
| 6 | `the-day-the-password-was-too-short` | R1C1 |
| 7 | `when-miki-said-something-unkind` | R1C2 |
| 8 | `pos-toughest-question` | R1C3 |

## Season 2 sources (Episodes 9–16)

| Save as | Contents |
|---|---|
| **`cover-stories-season-2.png`** | Preferred 4×2 text-free grid |
| `cover-stories-season-2-alt.png` | Alternate grid |

All Season 2 episodes **9–16** use bundled WebP covers from `cover-stories-season-2.png` (full panel scaled with `fit: contain` — same pipeline as Season 1).

### Grid → slug (canonical order)

| Ep | Slug | Source cell | Panel theme | Fit |
|---|---|---|---|---|
| 9 | `the-echo-chamber` | R0C0 | Drawing pile-on at Crystal Stream | ✅ |
| 10 | `vex-and-the-borrowed-face` | R0C1 | Vex chameleon + Fiona/Ruby tablets | ✅ |
| 11 | `what-mika-forgot-to-forget` | R0C2 | Archive scroll + warning hologram | ⚠️ Rabbit lead (story: Mika owl) |
| 12 | `kais-accidental-machine` | R0C3 | Kai fox + holographic map / robot | ✅ |
| 13 | `the-night-the-stream-went-dark` | R1C0 | Storm + bamboo relay repair | ✅ |
| 14 | `lumis-light` | R1C1 | Glowing art on easel | ⚠️ Deer artist (story: Lumi firefly) |
| 15 | `the-weight-of-a-screenshot` | R1C2 | Phone photo + crying otter | ✅ |
| 16 | `the-forest-agreement` | R1C3 | Po + forest crest / agreement | ✅ |

Soft spots (11, 14) are species swaps only — plot and mood match. Regenerate those two panels if pixel-perfect canon is needed.

## Optional assets

| Save as | Use |
|---|---|
| **`casting.png`** | 2×6 character casting sheet → `npm run assets:character-portraits` |
| `episodes-1-3-storyboard.png` | Scene thumbs + brand kit |
| `season-2-zones-4x4.png` | Forest zone map — not episode covers |

### Casting sheet → portrait (`forestCharacters.ts`)

Run `npm run assets:character-portraits` to write `public/images/characters/{role}-portrait.webp`.

Portrait crops use measured illustration bands (no white gutters on this sheet) and a **face-square** extract. **Mika (R0C3)** at focus `0.32` is the calibration reference; other roles use per-role focus overrides in `characterPortraitCropUtils.mjs`.

Sheet labels do not always match canon species — crop uses **grid cell → role id** (see `scripts/lib/characterPortraitCropUtils.mjs`). Portrait crops use **measured illustration bands** (not even grid splits — the sheet has no white gutters) and `fit: cover` anchored on faces.

| Cell | Sheet label | Canon role |
|---|---|---|
| R0C3 | Billy (owl art) | **mika** |
| R0C5 | Owen (beaver art) | **billy** |
| R1C1 | Mika (squirrel) | *(skipped — wrong species)* |
| R1C4 | Fiona (pangolin art) | **fiona** (fox in bible) |
| R1C5 | Rocco | *(skipped — not in bible)* |

Sage (Ep 16) uses standalone art — save as **`sage-portrait.png`** (not on the casting grid).

## Legacy fallbacks

- `../episode-1-hero-source.png` — single Ep 1 hero
- `../story-covers-master.png` — stacked Ep 2–3 only
