# Story Visual Asset Registry

**Purpose:** Track every image asset required to support the PandaGarde story registry. Update this file when episodes ship, art is produced, or `src/data/stories.ts` changes.

**Canonical narrative source:** [STORYLINE_BIBLE.md](./STORYLINE_BIBLE.md) §6  
**Story data source:** [src/data/stories.ts](../src/data/stories.ts)  
**Integration guide:** [src/data/STORY_INTEGRATION_GUIDE.md](../src/data/STORY_INTEGRATION_GUIDE.md)  
**Product / camp boundary:** [PRODUCT_VISION.md](./PRODUCT_VISION.md) §10 — story art is **product** (year-round), not Summer Camp–only.

**Last aligned with story registry:** 16 episodes (Season 1: 1–8 · Season 2: 9–16)

---

## How to use this registry

1. **Produce art** using the scene brief in each row.
2. **Export** master PNG/SVG → WebP for web delivery.
3. **Place files** at the paths in the **Target path** column.
4. **Check the box** when the asset exists and is non-empty.
5. **Wire in code** — add `coverIllustration` on `Story` and `illustration` on each `StoryChapter` in `stories.ts` (see [Wiring assets into code](#wiring-assets-into-code)).
6. **Retire** any asset listed in [Assets to replace or retire](#assets-to-replace-or-retire).

**Status key:** `[ ]` not started · `[~]` in progress · `[x]` shipped · `[—]` optional / Phase 2

---

## Art direction (all assets)

| Rule | Detail |
|---|---|
| Emotional register | Studio Ghibli warmth — calm, wonder, safe; never hyperstimulation or fear-mongering |
| Color | Warm greens, amber lantern light, teal stream tones; Shadow Mist = muted grey-purple |
| Characters | Match [STORYLINE_BIBLE.md](./STORYLINE_BIBLE.md) §3 visual language |
| Cover / chapter | **16:9 · 1024×576** WebP (match Ep 1 hero spec) |
| Activity sheets | A4 printable SVG or **2480×3508** PNG @ 300 dpi |
| Filename rule | Hyphenated ASCII only — no spaces or apostrophes in paths |

---

## File path convention

```
public/stories/{slug}/cover.webp
public/stories/{slug}/ch1.webp
public/stories/{slug}/ch2.webp
public/stories/{slug}/ch3.webp
public/stories/{slug}/ch4.webp
public/stories/{slug}/activities/{activity-id}.svg   (optional)

public/images/characters/{role}-portrait.webp
public/images/zones/{zone-id}-ambient.webp
public/images/devices/{device-id}.svg
```

**Example slug:** `billys-invisible-collection` → `public/stories/billys-invisible-collection/ch1.webp`

Regenerate bundled card covers after updating sources:

```bash
npm run assets:story-covers
```

### Bundled card covers (`StoryCard`, `StoryCoverArt`)

Story list cards use **640×360 WebP** crops in `src/assets/story-covers/episode-{n}-cover.webp`, wired by slug in [storyCoverAssets.ts](../src/data/storyCoverAssets.ts).

| Save production sheet as | Delivers |
|---|---|
| `src/assets/story-covers/sources/season-1-covers-4x2.png` | Ep 1–8 card covers (4×2 grid, row-major) |
| `src/assets/story-covers/sources/episodes-1-3-storyboard.png` | Ep 1–3 hero columns + 10 scene thumbs each + pillar/zone/character icons (future chapter crops) |
| `src/assets/story-covers/sources/season-2-zones-4x4.png` | 16 zone posters — **do not** map 1:1 to Ep 9–16 slugs (different titles); use for forest map / zone unlock art |

See [sources/README.md](../src/assets/story-covers/sources/README.md) for grid→slug mapping, gutter insets, and crop tunables.

| Status | Ep | Bundled path | Source panel |
|---|---|---|---|
| [x] | 1 | `src/assets/story-covers/episode-1-cover.webp` | Grid R0C0 (`pandastories-2.png`) |
| [x] | 2 | `episode-2-cover.webp` | Grid R0C1 |
| [x] | 3 | `episode-3-cover.webp` | Grid R0C2 |
| [x] | 4 | `episode-4-cover.webp` | Grid R0C3 |
| [x] | 5 | `episode-5-cover.webp` | Grid R1C0 |
| [x] | 6 | `episode-6-cover.webp` | Grid R1C1 |
| [x] | 7 | `episode-7-cover.webp` | Grid R1C2 |
| [x] | 8 | `episode-8-cover.webp` | Grid R1C3 |

**Art vs. canon (Ep 5–8 panels):** attached posters use zone-themed titles (Bridge, Backup, Shadow Mist, Campfire). They are **interim card art** until story-specific covers ship at `public/stories/{slug}/cover.webp`.

---

## Foundation library (shared across episodes)

### Character portraits

| Status | Asset ID | Character | Priority | Target path | Notes |
|---|---|---|---|---|---|
| [~] | `char-po` | Po | P0 | `public/images/characters/po-portrait.webp` | neutral, teaching, proud |
| [~] | `char-tao` | Tao | P0 | `public/images/characters/tao-portrait.webp` | canonical turtle; no "Elder Turtle" |
| [ ] | `char-ruby` | Ruby | P0 | `public/images/characters/ruby-portrait.webp` | |
| [ ] | `char-mika` | Mika (owl) | P0 | `public/images/characters/mika-portrait.webp` | canonical owl; no "Owen" |
| [ ] | `char-billy` | Billy | P0 | `public/images/characters/billy-portrait.webp` | |
| [ ] | `char-miki` | Miki (monkey) | P0 | `public/images/characters/miki-portrait.webp` | supporting cast |
| [ ] | `char-lumi` | Lumi | P0 | P1 | debuts Ep 8 |
| [ ] | `char-fiona` | Fiona | P1 | `public/images/characters/fiona-portrait.webp` | debuts Ep 10 |
| [ ] | `char-kai` | Kai | P1 | `public/images/characters/kai-portrait.webp` | debuts Ep 12 |
| [ ] | `char-vex` | Vex | P1 | `public/images/characters/vex-portrait.webp` | opportunist, not cartoon villain |
| [ ] | `char-sage` | Sage | P1 | `public/images/characters/sage-portrait.webp` | debuts Ep 16 |

### Zone backgrounds (Phase 1 — P0)

| Status | Zone ID | Scene | Target path |
|---|---|---|---|
| [ ] | `bamboo-gate` | Whispering Bamboo Gate | `public/images/zones/bamboo-gate-ambient.webp` |
| [ ] | `bridge-of-consent` | Bridge of Consent | `public/images/zones/bridge-of-consent-ambient.webp` |
| [ ] | `great-archive` | Great Bamboo Archive | `public/images/zones/great-archive-ambient.webp` |
| [ ] | `privacy-garden` | Privacy Garden + bamboo lock gate | `public/images/zones/privacy-garden-ambient.webp` |
| [ ] | `firefly-path` | Firefly Lantern Path at dusk | `public/images/zones/firefly-path-ambient.webp` |
| [ ] | `crystal-stream` | Crystal Stream | `public/images/zones/crystal-stream-ambient.webp` |
| [ ] | `harmony-campfire` | Harmony Campfire circle | `public/images/zones/harmony-campfire-ambient.webp` |
| [ ] | `taos-hollow` | Tao's Hollow entrance | `public/images/zones/taos-hollow-ambient.webp` |

### Zone backgrounds (Phase 2 — P1)

| Status | Zone ID | Scene | Target path |
|---|---|---|---|
| [ ] | `smoke-fox-den` | Smoke Fox Den at forest edge | `public/images/zones/smoke-fox-den-ambient.webp` |
| [ ] | `foxfire-workshop` | Kai's Foxfire Workshop | `public/images/zones/foxfire-workshop-ambient.webp` |
| [ ] | `shadow-mist` | Shadow Mist (soft fog) | `public/images/zones/shadow-mist-ambient.webp` |

### Recurring narrative devices

| Status | Device | Target path |
|---|---|---|
| [~] | Privacy Shield | `public/images/devices/privacy-shield.svg` | legacy: `public/images/coloring/privacy-shield.svg` |
| [ ] | Bamboo Lock | `public/images/devices/bamboo-lock.svg` |
| [ ] | Bridge of Consent | `public/images/devices/bridge-of-consent.svg` |
| [ ] | Quick Click Wind | `public/images/devices/quick-click-wind.svg` |
| [ ] | Tao's Hollow sign | `public/images/devices/taos-hollow-sign.svg` |
| [ ] | Lantern Path light | `public/images/devices/lantern-path-light.svg` |
| [ ] | Archive scroll | `public/images/devices/archive-scroll.svg` |
| [ ] | Crystal Stream ripple | `public/images/devices/crystal-stream-ripple.svg` |
| [ ] | Smoke at edge | `public/images/devices/smoke-at-edge.svg` |

### Five Forest Laws icons (P1)

| Status | Law | Target path |
|---|---|---|
| [ ] | Be Kind | `public/images/devices/forest-law-be-kind.svg` |
| [ ] | Think Before You Share | `public/images/devices/forest-law-think-before-share.svg` |
| [ ] | Respect Privacy | `public/images/devices/forest-law-respect-privacy.svg` |
| [ ] | Ask First | `public/images/devices/forest-law-ask-first.svg` |
| [ ] | Choose What to Share | `public/images/devices/forest-law-choose-share.svg` |

---

## Season 1 — The Privacy Grove (Episodes 1–8)

### Episode 1 — Privacy Panda and the Digital Bamboo Forest

| Field | Value |
|---|---|
| **Slug** | `privacy-panda-and-the-digital-bamboo-forest` |
| **Pillar / zone** | Path of Wisdom · `bamboo-gate` |
| **Characters** | Po, Tao, Miki, Ruby, Billy |
| **Launch priority** | P0 |

| Status | Asset | Chapter | Scene brief | Target path | Legacy / notes |
|---|---|---|---|---|---|
| [x] | Cover (card) | — | Po at Bamboo Gate — bundled `episode-1-cover.webp` | `public/stories/privacy-panda-and-the-digital-bamboo-forest/cover.webp` | `public/images/stories/covers/episode-1-bamboo-forest.svg` |
| [~] | Ch1 | The Shy Panda | Po hiding behind bamboo, tablet in paws, alone | `…/ch1.webp` | `public/images/story/01-PoInTheShadows.png` |
| [~] | Ch2 | The Wrong Button | Alert + messages flooding; Po shocked | `…/ch2.webp` | `3-TheAccident.png`, `04-PublicReaction.png` |
| [~] | Ch3 | Tao's Wisdom | Tao at den door with lantern; Privacy Shield intro | `…/ch3.webp` | `06-Turtle-Appears.png`, `07-LearningMoments.png` |
| [~] | Ch4 | Privacy Panda is Born | Po as Privacy Panda; animals asking for help | `…/ch4.webp` | `08-New-Po.png`, `09-Po-teaches.png` |

**Activity assets (optional):**

| Status | Activity ID | Target path |
|---|---|---|
| [~] | `a1-3` Create Your Privacy Shield | `…/activities/a1-3-privacy-shield.svg` |
| [ ] | `a1-1` Identity collage sheet | `…/activities/a1-1-identity-collage.svg` |
| [ ] | `a1-2` Dramatic play props | `…/activities/a1-2-dramatic-play.svg` |

**Action:** Consolidate 10 legacy `storyScenes.ts` PNGs into 4 chapter WebPs + 1 cover.

---

### Episode 2 — Miki and the Photo That Flew Away

| Field | Value |
|---|---|
| **Slug** | `miki-and-the-photo-that-flew-away` |
| **Pillar / zone** | Path of Connection · `bridge-of-consent` |
| **Launch priority** | P0 |

| Status | Asset | Chapter | Scene brief | Target path |
|---|---|---|---|---|
| [x] | Cover (card) | — | Photo flying — bundled `episode-2-cover.webp` | `public/stories/miki-and-the-photo-that-flew-away/cover.webp` |
| [ ] | Ch1 | Ruby's Secret Sculpture | Ruby with unfinished sculpture, not ready to show | `…/ch1.webp` |
| [ ] | Ch2 | Miki Means Well | Miki snapping photo; Ruby reaching "Wait—" | `…/ch2.webp` |
| [ ] | Ch3 | How Ruby Felt | Ruby hurt; praise messages she didn't choose | `…/ch3.webp` |
| [ ] | Ch4 | Po's Lesson | Po mediating; Bridge of Consent visible | `…/ch4.webp` |

**Activity assets:** `a2-1` permission photo booth · `a2-2` discussion cards

---

### Episode 3 — Billy's Invisible Collection

| Field | Value |
|---|---|
| **Slug** | `billys-invisible-collection` |
| **Pillar / zone** | Path of Memory · `great-archive` |
| **Launch priority** | P0 |

| Status | Asset | Chapter | Scene brief | Target path |
|---|---|---|---|---|
| [x] | Cover (card) | — | Billy + digital trail — bundled `episode-3-cover.webp` | `public/stories/billys-invisible-collection/cover.webp` |
| [ ] | Ch1 | Billy's Big Idea | Billy building secret real-time map | `…/ch1.webp` |
| [ ] | Ch2 | The Map Goes Live | Friends discover map; feel watched | `…/ch2.webp` |
| [ ] | Ch3 | What the Archive Remembers | Mika at Archive with path scroll | `…/ch3.webp` |
| [ ] | Ch4 | The Permission Map | Opt-in map with on/off switches | `…/ch4.webp` |

**Activity assets:** `a3-1` permission map · `a3-2` data trail discussion visual

**Replace:** `public/images/stories/covers/episode-3-sneaky-settings.svg` (wrong story — Owen era)

---

### Episode 4 — Mika and the Sneaky Settings

| Field | Value |
|---|---|
| **Slug** | `mika-and-the-sneaky-settings` |
| **Pillar / zone** | Path of Protection · `privacy-garden` |
| **Launch priority** | P0 |

| Status | Asset | Chapter | Scene brief | Target path |
|---|---|---|---|---|
| [ ] | Cover | — | "Allow All" screen; Smoke Fox at garden edge | `public/stories/mika-and-the-sneaky-settings/cover.webp` |
| [ ] | Ch1 | The Exciting New Game | Mika skipping permission list | `…/ch1.webp` |
| [ ] | Ch2 | Something Feels Off | Smoke Fox at thinking spot | `…/ch2.webp` |
| [ ] | Ch3 | Po and Tao's Audit | Permission audit under bamboo tree | `…/ch3.webp` |
| [ ] | Ch4 | The Three Questions | Mika teaching; garden doors closing | `…/ch4.webp` |

**Activity assets:** `a4-1` permission audit cards · `a4-2` three questions worksheet

---

### Episode 5 — Ruby and the Very Friendly Stranger

| Field | Value |
|---|---|
| **Slug** | `ruby-and-the-very-friendly-stranger` |
| **Pillar / zone** | Path of Connection · `firefly-path` |
| **Launch priority** | P0 |

| Status | Asset | Chapter | Scene brief | Target path |
|---|---|---|---|---|
| [ ] | Cover | — | Ruby on Lantern Path; stranger at clearing edge | `public/stories/ruby-and-the-very-friendly-stranger/cover.webp` |
| [ ] | Ch1 | The New Animal | Warm stranger; slightly shifting colors | `…/ch1.webp` |
| [ ] | Ch2 | The Questions Get Closer | Personal questions on tablet; pebble feeling | `…/ch2.webp` |
| [ ] | Ch3 | Tao's Lantern | Tao explaining earned trust vs. kindness | `…/ch3.webp` |
| [ ] | Ch4 | What Ruby Chose | Fireflies at dusk; Po beside Ruby | `…/ch4.webp` |

**Activity assets:** trust signal cards · trusted circle lantern path template

---

### Episode 6 — The Day the Password Was Too Short

| Field | Value |
|---|---|
| **Slug** | `the-day-the-password-was-too-short` |
| **Pillar / zone** | Path of Protection · `privacy-garden` |
| **Launch priority** | P0 |

| Status | Asset | Chapter | Scene brief | Target path |
|---|---|---|---|---|
| [ ] | Cover | — | Short key "bamboo1" vs. strong Bamboo Lock | `public/stories/the-day-the-password-was-too-short/cover.webp` |
| [ ] | Ch1 | The Easiest Key | Same password everywhere (no shame framing) | `…/ch1.webp` |
| [ ] | Ch2 | The Open Gate | Smoke Fox inside private garden | `…/ch2.webp` |
| [ ] | Ch3 | The Bamboo Lock | Tao demonstrating lock segments | `…/ch3.webp` |
| [ ] | Ch4 | A Different Kind of Confidence | Strong gate closed; quiet confidence | `…/ch4.webp` |

**Activity assets:** bamboo lock craft strips · align with `public/images/coloring/password-treasure.svg`

---

### Episode 7 — When Miki Said Something Unkind

| Field | Value |
|---|---|
| **Slug** | `when-miki-said-something-unkind` |
| **Pillar / zone** | Path of Wisdom · `crystal-stream` |
| **Launch priority** | P0 |

| Status | Asset | Chapter | Scene brief | Target path |
|---|---|---|---|---|
| [ ] | Cover | — | Message rippling through Crystal Stream | `public/stories/when-miki-said-something-unkind/cover.webp` |
| [ ] | Ch1 | A Small, Sharp Thought | Miki typing quickly on bad day | `…/ch1.webp` |
| [ ] | Ch2 | How Far the Stream Runs | Shares multiplying; Cedar's art visible | `…/ch2.webp` |
| [ ] | Ch3 | Po's Campfire | Sender's perspective at Campfire | `…/ch3.webp` |
| [ ] | Ch4 | What Miki Added | Genuine public apology; quieter stream | `…/ch4.webp` |

**Activity assets:** ripple map poster · kind/unkind sort cards

---

### Episode 8 — Po's Toughest Question

| Field | Value |
|---|---|
| **Slug** | `pos-toughest-question` |
| **Pillar / zone** | Path of Wisdom · `taos-hollow` |
| **Launch priority** | P0 |

| Status | Asset | Chapter | Scene brief | Target path |
|---|---|---|---|---|
| [ ] | Cover | — | Lumi's dimmed glow; path to Tao's Hollow lit | `public/stories/pos-toughest-question/cover.webp` |
| [ ] | Ch1 | The Message That Made Her Go Quiet | Lumi at Campfire with frightening message | `…/ch1.webp` |
| [ ] | Ch2 | The Week in the Den | Po sharing his own hiding story | `…/ch2.webp` |
| [ ] | Ch3 | Tao's Hollow Is Always Open | Tao listening; "exactly the right thing" | `…/ch3.webp` |
| [ ] | Ch4 | What Lumi Told the Campfire | Lumi speaking; glow returning | `…/ch4.webp` |

**My Camp unlock:** Trusted Circle Tree badge · Privacy Ranger path milestone (see [PRODUCT_VISION.md](./PRODUCT_VISION.md) §4)

---

## Season 2 — The Kindness Clearing (Episodes 9–16)

### Episode 9 — The Echo Chamber

| **Slug** | `the-echo-chamber` · **Pillar** | Path of Connection · `crystal-stream` · **Priority** | P1 |

| Status | Asset | Chapter | Scene brief | Target path |
|---|---|---|---|---|
| [ ] | Cover | — | Pile-on around Pepper's drawing at Stream | `public/stories/the-echo-chamber/cover.webp` |
| [ ] | Ch1 | Pepper's Drawing | Bystander watching thread grow | `…/ch1.webp` |
| [ ] | Ch2 | How the Stream Works | Ruby explaining current / echo | `…/ch2.webp` |
| [ ] | Ch3 | Po at the Campfire | Silence as a choice | `…/ch3.webp` |
| [ ] | Ch4 | One Stone | One kind reply redirecting thread | `…/ch4.webp` |

---

### Episode 10 — Vex and the Borrowed Face

| **Slug** | `vex-and-the-borrowed-face` · **Introduces** | Vex, Fiona · **Priority** | P1 |

| Status | Asset | Chapter | Scene brief | Target path |
|---|---|---|---|---|
| [ ] | Cover | — | Two Fiona profiles; Vex at forest edge | `public/stories/vex-and-the-borrowed-face/cover.webp` |
| [ ] | Ch1 | The Other Fiona | Deer showing fake conversation | `…/ch1.webp` |
| [ ] | Ch2 | Vex | Vex on branch — opportunist, not monster | `…/ch2.webp` |
| [ ] | Ch3 | Rebuilding the Lantern | Verification at Campfire | `…/ch3.webp` |
| [ ] | Ch4 | What Fiona Chose to Do | Fiona auditing Open Clearing profile | `…/ch4.webp` |

---

### Episode 11 — What Mika Forgot to Forget

| **Slug** | `what-mika-forgot-to-forget` · **Priority** | P1 |

| Status | Asset | Chapter | Scene brief | Target path |
|---|---|---|---|---|
| [ ] | Cover | — | False story entering Archive shelves | `public/stories/what-mika-forgot-to-forget/cover.webp` |
| [ ] | Ch1 | The Story That Arrived | Mika filing without verifying | `…/ch1.webp` |
| [ ] | Ch2 | The Weight of the Archive's Name | Cedar hurt; Mika's responsibility | `…/ch2.webp` |
| [ ] | Ch3 | The Truth-Testing Protocol | Four questions on Archive wall | `…/ch3.webp` |
| [ ] | Ch4 | What the Archive Added | "Unverified" note on false record | `…/ch4.webp` |

---

### Episode 12 — Kai's Accidental Machine

| **Slug** | `kais-accidental-machine` · **Introduces** | Kai · **Priority** | P1 |

| Status | Asset | Chapter | Scene brief | Target path |
|---|---|---|---|---|
| [ ] | Cover | — | Bamboo finder; uneven path map | `public/stories/kais-accidental-machine/cover.webp` |
| [ ] | Ch1 | The Foxfire Workshop | Kai's workshop; warm invention light | `…/ch1.webp` |
| [ ] | Ch2 | Where the Paths Stopped Going | Empty eastern patches on map | `…/ch2.webp` |
| [ ] | Ch3 | Po's Question | "Who did you imagine using it?" | `…/ch3.webp` |
| [ ] | Ch4 | The Rebuilt Finder | Diverse recommendations + feedback note | `…/ch4.webp` |

---

### Episode 13 — The Night the Stream Went Dark

| **Slug** | `the-night-the-stream-went-dark` · **Priority** | P1 |

| Status | Asset | Chapter | Scene brief | Target path |
|---|---|---|---|---|
| [ ] | Cover | — | Storm; dark Stream; damaged relay tower | `public/stories/the-night-the-stream-went-dark/cover.webp` |
| [ ] | Ch1 | Before the Storm | Silent tablet; disconnected forest | `…/ch1.webp` |
| [ ] | Ch2 | What the Storm Found | Tao at relay station with lantern | `…/ch2.webp` |
| [ ] | Ch3 | The Roots | Bamboo roots / infrastructure repair | `…/ch3.webp` |
| [ ] | Ch4 | When the Stream Came Back | Dawn reunion at Campfire | `…/ch4.webp` |

---

### Episode 14 — Lumi's Light

| **Slug** | `lumis-light` · **Priority** | P1 |

| Status | Asset | Chapter | Scene brief | Target path |
|---|---|---|---|---|
| [ ] | Cover | — | Light-art above Campfire; shares multiplying | `public/stories/lumis-light/cover.webp` |
| [ ] | Ch1 | The Art That Traveled | Lumi's night-forest piece shared | `…/ch1.webp` |
| [ ] | Ch2 | What Others Wanted to Do With Her Light | Overwhelming responses; copied work | `…/ch2.webp` |
| [ ] | Ch3 | What Belongs to Lumi | Fiona helping separate share vs. surrender | `…/ch3.webp` |
| [ ] | Ch4 | The Light Lumi Chose | Profile: "My light is mine" | `…/ch4.webp` |

---

### Episode 15 — The Weight of a Screenshot

| **Slug** | `the-weight-of-a-screenshot` · **Priority** | P1 |

| Status | Asset | Chapter | Scene brief | Target path |
|---|---|---|---|---|
| [ ] | Cover | — | Private message → screenshot chain | `public/stories/the-weight-of-a-screenshot/cover.webp` |
| [ ] | Ch1 | The Private Conversation | Olive's private message (dignified, abstract) | `…/ch1.webp` |
| [ ] | Ch2 | What the Archive Can and Cannot Do | Mika explaining limits honestly | `…/ch2.webp` |
| [ ] | Ch3 | The Choice Nobody Talked About | Nine who chose not to forward | `…/ch3.webp` |
| [ ] | Ch4 | What Olive Chose Next | Bridge of Consent in background | `…/ch4.webp` |

---

### Episode 16 — The Forest Agreement

| **Slug** | `the-forest-agreement` · **Introduces** | Sage · **Priority** | P1 |

| Status | Asset | Chapter | Scene brief | Target path |
|---|---|---|---|---|
| [ ] | Cover | — | Tiny Accept button vs. eleven pages of terms | `public/stories/the-forest-agreement/cover.webp` |
| [ ] | Ch1 | The Wonderful New Service | Animals tapping Accept in seconds | `…/ch1.webp` |
| [ ] | Ch2 | What the Agreement Said | Tao reading page 4 by lantern | `…/ch2.webp` |
| [ ] | Ch3 | Sage Arrives | Sage at Bridge with plain-language summary | `…/ch3.webp` |
| [ ] | Ch4 | A New Kind of Agreement | Sign: "Before you cross, know what's on the other side" | `…/ch4.webp` |

---

## My Camp & forest map (product progression)

These are **product** assets (year-round), not Summer Camp–only. See [PRODUCT_VISION.md](./PRODUCT_VISION.md) §4.

| Status | Asset | Target path | Tied to |
|---|---|---|---|
| [ ] | Forest map — base | `public/images/forest-map/base.webp` | Product home |
| [ ] | Zone locked state (×9 Phase 1) | `public/images/forest-map/{zone-id}-locked.webp` | Weekly unlock |
| [ ] | Zone unlocked state (×9) | `public/images/forest-map/{zone-id}-unlocked.webp` | Weekly unlock |
| [ ] | Week badge 1–8 | `public/images/my-camp/badges/week-{n}.webp` | Ep 1–8 completion |
| [ ] | Privacy Ranger certificate | `public/images/my-camp/privacy-ranger-certificate.webp` | Ep 8+ graduation |
| [ ] | Camp tent — empty | `public/images/my-camp/tent-empty.webp` | My Camp v0 |
| [ ] | Camp tent — decorated | `public/images/my-camp/tent-decorated.webp` | ProgressBar progression |
| [ ] | Trusted Circle Tree | `public/images/my-camp/trusted-circle-tree.webp` | Ep 8 unlock |

---

## Production summary

| Pack | Assets | Priority |
|---|---|---|
| Foundation (Tier 1 portraits + Phase 1 zones + devices) | ~23 | P0 |
| Season 1 covers + chapters (8 × 5) | 40 | P0 |
| Season 1 activity sheets | ~18 | P1 |
| Season 2 covers + chapters (8 × 5) | 40 | P1 |
| My Camp + forest map | ~20 | P1 |
| **MVP Privacy Grove launch minimum** | **~63** | Ep 1–8 covers + chapters + foundation |

---

## Assets to replace or retire

| Current path | Action |
|---|---|
| `public/images/stories/covers/episode-3-sneaky-settings.svg` | **Delete/replace** — wrong story (pre–Billy Ep 3) |
| Any art labeled Owen or Elder Turtle | **Retire** — use Mika / Tao per [STORYLINE_BIBLE.md](./STORYLINE_BIBLE.md) §3 |
| `src/data/storyScenes.ts` 10-scene Ep 1 set | **Consolidate** into 4 chapters + cover under slug path |
| Character names in legacy PNG filenames | Keep files; update `storyScenes.ts` paths only until migration complete |

---

## Wiring assets into code

When an asset ships:

1. Place WebP at the target path under `public/stories/{slug}/`.
2. Add fields in [src/data/stories.ts](../src/data/stories.ts):

```typescript
// On Story object:
coverIllustration: '/stories/billys-invisible-collection/cover.webp',

// On each StoryChapter:
illustration: '/stories/billys-invisible-collection/ch1.webp',
```

3. Update `StoryReader` / `StoryCard` to render `illustration ?? coverEmoji` when those components gain image support (see [STORY_INTEGRATION_GUIDE.md](../src/data/STORY_INTEGRATION_GUIDE.md)).
4. Mark `[x]` in this registry.
5. Run asset checks if applicable:

```bash
npm run check:story-assets   # when scene files exist
npm run assets:story-covers  # regenerate bundled WebP cards
```

---

## Change log

| Date | Change |
|---|---|
| 2026-05-24 | Initial registry — 16 episodes aligned with `stories.ts` and `STORYLINE_BIBLE.md` §6 |

---

*PandaGarde · The Digital Bamboo Forest · ERMITS Advisory*
