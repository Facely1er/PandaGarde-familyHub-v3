# PandaGarde Product Vision
## The Digital Bamboo Forest

> **Version:** July 2026 (readapted from May 2025)  
> **Author:** Facely Kandé, ERMITS Advisory  
> **Scope:** Product definition and north star. Operational claims must match
> [`CONTENT_TRUTH.md`](./CONTENT_TRUTH.md). Creative canon lives in
> [`STORYLINE_BIBLE.md`](./STORYLINE_BIBLE.md). Federal policy mapping (H.R. 7757):
> [`KIDS_ACT_ALIGNMENT.md`](./KIDS_ACT_ALIGNMENT.md). Summer Camp is a separate GTM program
> (`docs/SUMMER_CAMP_STRATEGY.md` when present).

---

## The Vision in One Page

### What PandaGarde Is

PandaGarde is a **family digital resilience system** built around one living world — the
Digital Bamboo Forest — delivered through **four experience surfaces** that share the
same characters, stories, and quest pillars:

| Surface | Who it serves | What it does |
|---|---|---|
| **PandaGarde website** | Parents & educators | Service catalog, footprint review, stories, guides, assessment, safety alerts |
| **Kids App** (`dist-kids/`) | Children 5–13 | Forest Map, story episodes, pillar games, badges, graduation certificate |
| **Family Hub** | Parents + children together | 18 age-matched privacy missions, local progress, family practice |
| **Institutional layer** *(aspirational)* | Schools, districts, grants | Curriculum alignment, evidence base, pilot outcomes — no child-facing UI |

The cast — Po, Ruby, Tao, Mika, Billy, Lumi, and the extended tier — is the emotional
and structural backbone. Canon content in `src/data/stories.ts` and
`docs/STORYLINE_BIBLE.md` feeds all surfaces.

**Approved one-liner (shipped):** Stories and guides are open anytime; the service catalog
feeds footprint review when families want a snapshot; Family Hub is optional practice on
device; the Kids App is where the forest feels most real for children.

### What It Is Not

It is not a digital safety website. It is not a parental control tool. It is not child
device monitoring. It is not a compliance curriculum. It is not a therapy platform. It is
not another EdTech app children are asked to use and forget.

### The Category It Creates

**Family digital resilience** — the space between passive entertainment and institutional
safety education, built for how families actually live with technology. PandaGarde closes
the **capability gap**: parents already know screens, cyberbullying, and social media are
risky; what they lack is language, ritual, framework, and a structured way to engage their
child.

### The Policy Truth (H.R. 7757 — KIDS Act)

The *Kids Internet and Digital Safety Act* (H.R. 7757, 119th Congress) tells **platforms**
what safeguards and parental tools they must build. PandaGarde is **not** a covered platform
— it does not host social messaging, operate child-facing AI chatbots, sell in-app purchases,
or collect behavioral profiles for advertising.

PandaGarde **complements** the bill by closing the capability gap Title V assumes but does
not supply: helping families understand *why* safeguards matter and *how* to use them in
real life. Full requirement-by-requirement mapping: [`KIDS_ACT_ALIGNMENT.md`](./KIDS_ACT_ALIGNMENT.md).

**Positioning in one line:** The KIDS Act tells platforms what they must build; PandaGarde
helps families learn to use those tools — calmly, locally, and without surveillance framing.


### The Architectural Truth (July 2026)

Families do not all enter through the forest. Many parents start with **footprint
capability** (catalog → scores → conversation prompts) and optionally add child immersion
(Kids App) and family practice (Hub). That is intentional — not a compromise of the
vision.

```
Shared canon (STORYLINE_BIBLE + stories.ts + forestCharacters.ts)
        │
        ├── Website ──► DFA Journey (core) + stories/guides (open anytime)
        ├── Kids App ──► Forest Map → Episode → Game → Badge → Certificate
        ├── Family Hub ──► Missions + progress + certificates (device-local)
        └── Institutional ──► Educator tools, pilot, evidence (backend TBD)
```

---

## 1. The World

Every design decision in PandaGarde begins with a single question:
**does this make the forest more real?**

The forest is not a metaphor for the curriculum. The curriculum is the mechanism by which
the forest becomes meaningful. That inversion is the product.

### The Seven Qualities of the Forest

| Quality | What it means | Shipped today |
|---|---|---|
| **Persistent** | The forest exists between visits. It remembers. | Kids App episode progress, Hub mission progress (device-local) |
| **Evolving** | New zones unlock as children progress. Each story leaves a mark. | Linear Forest Map unlock (v0.5); zone map v1 planned |
| **Atmospheric** | Ambient audio, soft animation, felt before read. | Calm UI, cover art, gentle transitions — audio layer planned |
| **Inhabited** | Characters react, remember, guide. | Story narration, character portraits, guide-linked Hub missions |
| **Personal** | Every child has a camp — badges, artifacts, choices. | Badge Shelf + trusted-team scaffold (Camp v0.5); full My Camp v1 planned |
| **Safe** | Calm, not exciting. Studio Ghibli, not gamified loops. | Shame-free games, no streak anxiety, parental gate on grown-ups view |
| **Expandable** | Privacy is the first grove. The forest grows with the child. | Season 1 in Kids App; Season 2 content in `stories.ts` |

### The Internet Architecture Layer

The Digital Bamboo Forest **is** the internet — experienced emotionally and structurally.
Every zone corresponds to a real layer of how the digital world works. This creates
**hidden technical literacy**: children absorb networking, security, data flow, and AI
concepts without technical language.

> *The child who helps Ruby reconnect broken lantern paths understands packet routing.
> The child who helps Mika organize corrupted memory scrolls understands data integrity.
> The child who defends Tao's gates from shadow bugs understands security operations.
> None of them needed a textbook.*

See `STORYLINE_BIBLE.md` §1 for the complete forest-to-internet mapping.

---

## 2. The Architecture: Three Audiences, Four Surfaces

The May 2025 model described three layers (child, parent, institutional) in one product.
The shipped architecture separates **who experiences what** from **where they experience it**.

### Layer 1 — The Child: Pure Immersion (Kids App primary)

**Surface:** `src/kidsapp/` → `kids.html` / `dist-kids/` (privacy-first bundle: no analytics,
no service worker, device-local only).

**Design principle:** No statistics. No institutional language. No fear. No performance
pressure. The child enters the forest. The forest teaches.

The child experiences:
- Forest Map — Season 1 episodes as stops on a bamboo path (unlock on completion)
- Episode flow — story chapters → pillar mini-game → badge ceremony → family activity prompt
- Badge Shelf — earned pillar badges and season certificate
- Character avatar choice (no real name collected)
- Trusted Team Builder — generic trusted roles + family code word (disclosure scaffold)

The child never sees:
- Parent dashboards · Footprint scores · Research citations · Monitoring language

**Graduation:** Completing all Season 1 episodes unlocks the **Privacy Grove Explorer**
certificate (identity arc equivalent to “Privacy Ranger” in the original vision).

### Layer 2 — The Parent: Structured Confidence (split across surfaces)

Parents do not need more anxiety. They need **language, ritual, and evidence** that
something meaningful is happening. Layer 2 is delivered through three permanent surfaces:

#### 2A — DFA Journey (website, parent front door)

**Code:** `src/lib/dfaJourney.ts`, `DfaJourneyStepper.tsx`

| Phase | Key | Required? | Path |
|---|---|---|---|
| Set your starting point | `profile` | **Core** | `/service-catalog` |
| Run footprint review | `dfa` | **Core** | `/digital-footprint` |
| Stories & follow-through | `plan` | Optional | `/stories` |
| Family Hub | `hub` | Optional | `/family-hub/dashboard` |

Core completion = catalog (≥3 services) + footprint review. Stories and Hub are **never
gated** — see `CONTENT_TRUTH.md` independence rule.

This path closes the **capability gap** first: what apps the family uses, what exposure
means, and what to talk about next.

#### 2B — Family Hub (family practice)

**Code:** `src/familyhub/`

- 18 age-matched privacy missions (5–8, 9–12, 13–17)
- Parent-guided co-experience — not a child social network
- Progress, badges, certificates, export — all device-local
- Forest friends tracked by guide character (`ProgressScreen`)

#### 2C — Kids App grown-ups corner

Behind parental gate: privacy facts, episode progress summary, data reset. Lightweight
parent view — not a full dashboard.

> **Camp delivery layer (program only):** Weekly email sequence, named Mon/Fri/Sun cadence
> labels, Family Privacy Agreement printable, cohort enrollment. These are **camp
> deliverables**, not permanent product features. No `/summer-camp` route is required in
> the codebase; pilot programs (e.g. 2026 cohort) wrap the same product content.

### Layer 3 — The Institutional Layer (aspirational, backend-dependent)

**Design principle:** Schools, districts, clinics, and grant committees need metrics,
evidence, and curriculum alignment — none of which appear in the child's forest.

**Shipped today:** Educator tools, pilot page, curriculum alignment in docs, progress
export PDFs, evidence-base documents.

**Requires backend:** Cohort analytics, district admin dashboard, aggregate anonymized
outcomes, white-label deployment. Tag as Phase 3 until a sync/analytics tier exists.

**Policy fit (H.R. 7757):** Strongest alignment with **Title V** (§522 education campaign,
§526 Kids Internet Safety Partnership). Institutional docs and pilot evidence support
nonprofit/school partnership positioning — see §12.

---

## 3. Design Principles

These govern every decision. They are constraints, not aspirations.

| # | Principle | The rule |
|---|---|---|
| 1 | **The forest teaches, not the platform** | Lessons through story and character encounter — never direct instruction in the child layer. |
| 2 | **Calm is the product quality** | Studio Ghibli, not gamified. No streak anxiety. No “you'll lose progress” messaging. |
| 3 | **Shame has no address in the forest** | Mistakes are the story, not the failure state. Wrong answers get gentle explanations. |
| 4 | **The research is invisible to children, essential for everyone else** | Children engage through characters. Parents trust through evidence. Institutions fund through data. |
| 5 | **Family ritual is the moat** | Code word, family activity, Hub missions, shared footprint review — rituals create belonging. |
| 6 | **The child owns their camp** | Badges and choices are the child's property. Identity formation, not content completion. |
| 7 | **Privacy is the first grove, not the whole forest** | Privacy vocabulary becomes the foundation for cyberbullying, AI, and identity arcs. |
| 8 | **Never over-medicalize** | No clinical, corrective, or surveillance framing in child-facing surfaces. |
| 9 | **Children should leave feeling more capable, not more afraid** | The product doctrine. Governs every story, game, mission, and parent message. |
| 10 | **Sensory design is not decoration** | Ambient sound, motion, silence moments are first-class — still rolling out. |
| 11 | **The Francophone dimension is a first-mover advantage** | French is a parallel universe in the architecture, not a translation afterthought. |
| 12 | **Local-first honesty** *(new)* | Do not claim cloud sync, live monitoring, or server accounts until shipped. See `CONTENT_TRUTH.md`. |

---

## 4. The Progression System

### Product rhythm vs. camp rhythm

| Rhythm type | Who sets the pace | What unlocks |
|---|---|---|
| **Product (year-round)** | Child/family self-paced | Next episode when current episode (story + game) completes |
| **Camp (cohort program)** | Named weekly cadence Mon–Sun | Same content, scheduled emails and ceremony labels |

**Camp weekly arc (program scheduling only):**

| Day | Forest event | Child feels | Parent does |
|---|---|---|---|
| Monday | New area accessible | Anticipation, discovery | Check dashboard; camp email (if enrolled) |
| Tuesday | Family activity surfaces | Invitation to do together | Plan 15 minutes co-experience |
| Wednesday | Campfire reflection | Calm, reflective | Optional mid-week prompt |
| Friday | Badge ceremony | Pride, visible progress | Celebrate with child |
| Sunday | Quiet forest rest | Wonder, slowness | Optional presence, no agenda |

The **product** expresses rhythm through design (unlock, ceremony, family prompt) without
requiring a calendar.

### Kids App episode arc (shipped)

```
Forest Map stop → Story chapters → Pillar game (or episode override)
    → Badge ceremony → Family activity suggestion → Next stop unlocks
```

Episode-specific games (e.g. `KindnessGuardians`, `TrustedTeamBuilder`) override pillar
defaults where the story theme demands it — see `kidsContent.ts` `EPISODE_GAME_OVERRIDES`.

### My Camp — The Ownership Layer

| Element | Vision (full My Camp v1) | Shipped (Camp v0.5) |
|---|---|---|
| Badge Wall | Every completed badge, centerpiece Privacy Ranger | **Badge Shelf** in Kids App |
| Trusted Circle Tree | Named trusted adults, permanent visual | **Trusted Team Builder** (generic roles + code word, device-local) |
| Bamboo Backpack | Collectibles with story attachments | Planned |
| Tent / decoration | Child-chosen placement and themes | Planned |
| Memory Journal | Revisitable story moments | Planned |
| Companion Corner | Characters wave, remember, are home | Character portraits in Hub progress; full corner planned |

> Retention in children's products is driven by emotional ownership. Badge Shelf is the
> first permanent evidence of belonging; full My Camp deepens it.

### The Privacy Ranger / Privacy Grove Explorer Identity Arc

Completing all eight Season 1 stories — at any pace, year-round — earns graduation.
In the Kids App this surfaces as the **Privacy Grove Explorer** certificate. The
psychology is unchanged: *"I am someone who protects what matters"* beats *"I finished
a module."*

---

## 5. The Internet Architecture Layer

See `STORYLINE_BIBLE.md` §1. Key contrast:

| Rules-based | Forest architecture |
|---|---|
| *"Don't share your password"* | *"The bamboo lock protects your garden gate"* |
| *"Be careful what you post"* | *"The Archive remembers everything — including what you wish could be forgotten"* |
| *"Don't talk to strangers"* | *"Unnamed foxes in the Shadow Mist have not earned a lantern"* |
| *"AI can make mistakes"* | *"Echo repeats what she heard, louder, whether it was true or not"* |

---

## 6. The Cast

See `STORYLINE_BIBLE.md` §3 and `src/data/forestCharacters.ts`.

| Tier | Characters | Entry | Theme |
|---|---|---|---|
| **Tier 1 — Heart** | Po · Tao · Ruby · Mika (Owl) · Billy · Miki (Monkey) | 5+ | Wisdom, protection, connection, memory, consent |
| **Tier 2 — Creative** | Kai · Lumi · Fiona | 8–10+ | Creation, identity, self-expression |
| **Tier 3 — Extended** | Vex · Sage · Echo | 9–10+ | Threats, governance, AI |

**Reconciliation (canonical):** Elder Turtle → Tao. Owen the Owl → Mika the Owl in new
stories. Fiona (child identity) distinct from Kai (builder). Miki the Monkey retained as
impulsive peer supporting cast.

---

## 7. The Five Quest Pillars

See `STORYLINE_BIBLE.md` §5 and `kidsContent.ts` `PILLAR_META`.

| Pillar | Led by | IT layer | Kids game (default) |
|---|---|---|---|
| Path of Wisdom | Po | Human layer | Safe vs Unsafe Sorting |
| Path of Connection | Ruby | Network layer | Phishing Detective |
| Path of Memory | Mika | Data layer | Digital Footprint Visualizer |
| Path of Protection | Tao | Infrastructure layer | Password Fortress Builder |
| Path of Creation | Kai *(Phase 2)* | Application layer | Privacy Settings Trainer |

---

## 8. The Roadmap (readapted July 2026)

### Phase 1 — The Privacy Grove — **largely shipped**

| Item | Status |
|---|---|
| Stories 1–8 in canon (`stories.ts`) | ✅ Shipped |
| Kids App: Forest Map, episodes, games, Badge Shelf | ✅ Shipped (v0.5) |
| Privacy Grove Explorer certificate | ✅ Shipped |
| DFA Journey (catalog → footprint) | ✅ Shipped |
| Family Hub: 18 missions, progress, certificates | ✅ Shipped |
| Storyline Bible + forest characters | ✅ Shipped |
| Forest map v1 — clickable 9 zones | 🔲 Path-only map today |
| My Camp v1 — tent, backpack, journal, companion corner | 🔲 Badge Shelf + trusted team only |
| Parent unified progress across Kids + Hub + DFA | 🔲 Split across surfaces |
| Ambient audio foundation | 🔲 Planned |
| Institutional evidence base (docs) | ✅ Partial |
| Summer Camp 2025 GTM | 📋 Historical program layer; pilot 2026+ |

### Phase 1.5 — DFA & parent capability — **shipped** *(not in May 2025 doc)*

- Service catalog with self-reported apps (no passive monitoring)
- Footprint review scores from catalog
- Optional privacy assessment and safety alerts (device-local)
- Journey stepper with honest optional phases
- Content truth governance (`CONTENT_TRUTH.md`)

### Phase 2 — The Kindness Clearing — **in progress**

| Item | Status |
|---|---|
| Stories 9–14 (Season 2) in `stories.ts` | ✅ Content started |
| `KindnessGuardians` game (Episode 7 override) | ✅ Shipped |
| Season 2 in Kids App Forest Map | 🔲 Season 1 only today |
| Echo Cavern zone, Kai/Lumi primary cast in app | 🔲 Planned |
| Character animation, ambient audio, branching v1 | 🔲 Planned |
| School district pilot | 🔲 Pilot page live; contract TBD |
| Francophone edition | 🔲 Strategic; not in app bundle yet |

### Phase 3 — The Wisdom Mountain — **planned**

- AI literacy (Echo), social pressure (Crowd Current)
- Full immersive environment (seasons, weather, collectibles)
- My Camp v2 full customization
- **Institutional platform** (requires backend)
- School-year program, educator certification

---

## 9. Competitive Positioning

PandaGarde creates the category; it does not fit an existing shelf.

| Capability | PandaGarde | Duolingo | Common Sense | PBS Kids | Parental Controls |
|---|---|---|---|---|---|
| Persistent world & characters | ✅ | ✅ | ❌ | ✅ | ❌ |
| Research-backed curriculum | ✅ | ⚠️ | ✅ | ⚠️ | ❌ |
| Family ritual mechanics | ✅ | ❌ | ❌ | ❌ | ❌ |
| Parent + child separate layers | ✅ | ❌ | ⚠️ | ❌ | ⚠️ |
| Parent footprint snapshot (no child monitoring) | ✅ | ❌ | ⚠️ | ❌ | ❌ |
| Institutional / school layer | ⚠️ docs/pilot | ✅ | ✅ | ✅ | ❌ |
| Calm immersive aesthetic | ✅ | ❌ | ❌ | ⚠️ | N/A |
| Identity formation arc | ✅ | ⚠️ | ❌ | ⚠️ | ❌ |
| Forest = internet architecture | ✅ | ❌ | ❌ | ❌ | ❌ |
| Five quest pillars (ISTE-aligned) | ✅ | ❌ | ⚠️ | ❌ | ❌ |
| Hidden technical literacy | ✅ | ❌ | ❌ | ❌ | ❌ |
| Local-first / privacy-by-design kids bundle | ✅ | ❌ | ❌ | ⚠️ | ❌ |
| Francophone Africa first-mover | ✅ strategic | ❌ | ❌ | ❌ | ❌ |

**The moat:** Persistent narrative world structured as the internet, five-pillar quest
progression, family ritual across three surfaces, parent capability without surveillance,
and multilingual scalability — together, a category that does not exist yet.

---

## 10. Build Categories (permanent vs. program)

### Product foundation (permanent, year-round)

| Feature | Surface | Code anchor |
|---|---|---|
| DFA Journey | Website | `dfaJourney.ts`, `DfaJourneyStepper.tsx` |
| Service catalog + footprint review | Website | `ServiceCatalogPage`, `DigitalFootprintPage` |
| Stories 1–8+ | Website + Kids App | `stories.ts`, `EpisodeScreen.tsx` |
| Kids App bundle | Kids | `kidsapp/`, `vite.kids.config.ts` |
| Forest Map + episode loop | Kids | `WorldMapScreen.tsx` |
| Badge Shelf + certificate | Kids | `BadgeShelfScreen.tsx`, `certificateService.ts` |
| Family Hub missions | Hub | `familyhub/`, `ageBasedActivities` |
| Storyline Bible canon | Docs + data | `STORYLINE_BIBLE.md`, `forestCharacters.ts` |

### Product enhancement (next quality gates)

- Clickable 9-zone forest map (upgrade from linear path)
- My Camp v1 persistence (tent, backpack, journal, companion corner)
- Ambient audio per zone (toggleable, no autoplay)
- Character greeting on episode entry with progress memory
- Parent progress bridge (single view: Kids episodes + Hub missions + DFA status)
- Season 2 episodes in Kids App

### Camp / pilot layer (additive, removable)

- Cohort enrollment and email sequence (external to platform)
- Named weekly cadence labels in camp dashboard
- Family Privacy Agreement printable for cohort graduation
- Pilot feedback program — not an in-app social feature

> **The distinction in one line:**  
> **Product** = forest canon, Kids App, Hub missions, DFA journey, certificates, audio, zones.  
> **Camp/Pilot** = enrollment, email cadence, cohort printables, program scheduling.

---

## 11. The North Star

> *"Children should leave feeling more capable, not more afraid."*

Every story, game, mission, parent message, and design choice is governed by three
questions — **reweighted by surface**:

| Question | Primary surface | Secondary |
|---|---|---|
| **Does this make the forest more real?** | Kids App episodes, zone art, games | Website story experience |
| **Does this close the capability gap for parents?** | DFA journey, footprint, catalog, guides | Hub missions, conversation prompts |
| **Does this make a child more resilient in the real world?** | Trusted team, kindness games, family activities | Hub scenarios, parent follow-through |

**Decision rule:**

- Answers **all three** → build it.
- Answers **one** strongly → build if it serves a clear surface; do not force forest dressing on pure parent tools.
- Answers **none** → it does not belong in PandaGarde.

A footprint PDF export that never mentions Po is still on-mission if it gives parents
language and action they did not have before.

---

## 12. Federal Policy Alignment — H.R. 7757 (KIDS Act)

> **Bill status (July 2026):** Passed House (June 29, 2026); pending Senate.  
> **Source:** [`BILLS-119hr7757eh.pdf`](./BILLS-119hr7757eh.pdf)  
> **Full analysis:** [`KIDS_ACT_ALIGNMENT.md`](./KIDS_ACT_ALIGNMENT.md) — mission catalog, grant
> narrative, gaps, approved positioning language.  
> **Disclaimer:** Engineering/product alignment only — not legal advice.

### PandaGarde's role in the policy ecosystem

| Role | What it means |
|---|---|
| **Not a covered operator** | No platform duties under Titles I–IV or VI enforcement |
| **Title V education partner** | Age-banded missions, parent guides, stories, institutional docs |
| **Privacy-by-design exemplar** | Local-first Kids App; no behavioral ads; data minimization |
| **Anti-addictive design model** | Calm UX; no streak anxiety; no manipulative child engagement |

```
H.R. 7757 operator duties (Titles I–IV, VI)  →  regulated platforms (social, games, AI)
H.R. 7757 education & partnerships (Title V) →  PandaGarde (website, Hub, Kids App)
Platforms must build safeguards            →  PandaGarde teaches families to use them
```

### Bill titles at a glance

| Title | Subject | Regulated actors | PandaGarde fit |
|---|---|---|---|
| **I** | Shielding minors from obscenity | Adult-content sites | N/A — education only (red/yellow/green missions) |
| **II** | Online platform safety | Social media platforms | **Education** — settings, messaging, compulsive-design literacy |
| **III** | Social gaming safeguards | Game providers | **Education** — in-game chat, purchase scrutiny via catalog |
| **IV** | AI chatbots | Chatbot operators | **Education** — Echo arc, teen AI mission; PandaGarde does not operate child AI chat |
| **V** | Research, education, partnerships | FTC, HHS, schools, nonprofits | **Strongest fit** — missions, DFA, pilot evidence |
| **VI** | Kids privacy (COPPA 2.0) | Data-collecting operators | **Architecture** — local-first, no teen profiling, no behavioral ads |
| **VII** | Enforcement | FTC, state AGs | N/A — PandaGarde is not an enforcement target |

### Requirement mapping by title

#### Title II — Platform safety & parental tools (§213–§214)

| Bill requirement *(platforms)* | PandaGarde contribution | Evidence |
|---|---|---|
| Limit compulsive design | Models anti-addictive child UX | No infinite scroll; calm aesthetic (§3) |
| Default protective privacy settings | Teaches families to find and set safer defaults | *Privacy Settings Pro* (9–12); *Social Media Privacy Simulator* (13–17) |
| Parental tools to view/manage settings | **Educates** parents to use platform tools — does not provide them | *App Permission Inspector*; DFA catalog → footprint |
| Limit messaging with strangers | Family conversation + practice | *Who Can I Talk To Online?* (5–8); Trusted Team Builder (Kids App) |
| Restrict geolocation sharing | Teaches location-sharing risks | *Social Media Privacy Simulator* (13–17) |

**Honesty rule:** Copy must say families **learn to use** third-party controls — PandaGarde
does not implement §214 tools on Instagram, Roblox, Snapchat, etc.

#### Title III — Social gaming safeguards

| Bill requirement *(game platforms)* | PandaGarde contribution | Evidence |
|---|---|---|
| Parental communication limits | Education on in-game chat risks | *Who Can I Talk To Online?*; game entries in service catalog |
| Purchase restrictions | Teaches scrutiny at sign-up | *Pack Your Digital Backpack* (5–8) |
| Gaming-specific privacy | Self-reported catalog + footprint | Roblox, Fortnite, etc. in catalog; scores drive conversation |

#### Title IV — AI chatbots & AWARE Act (§524)

| Bill requirement *(chatbot operators)* | PandaGarde contribution | Evidence |
|---|---|---|
| Disclose AI is not human | Education on AI nature and limits | Echo character arc; *AI & Your Privacy* (13–17) |
| Crisis hotline disclosure | **Gap** — recommended on teen AI content | See `KIDS_ACT_ALIGNMENT.md` §Gaps |
| AWARE parent/educator resources | Strong thematic alignment | Teen mission; parent guides; DFA journey |

#### Title V — Research, education, best practices *(primary alignment)*

| Bill provision | PandaGarde contribution | Evidence |
|---|---|---|
| §522 — Public awareness & education campaign | Direct — nonprofit education for parents, educators, minors | 18 missions; stories; DFA journey |
| §522 — Facilitate nonprofit/school education | Institutional layer + pilot docs | Layer 3 (aspirational); educator tools |
| §522(C) — Effective use of safeguards & parental controls | Missions end with one real settings/action step | Hub mission model: talk → activity → **do this after** |
| §524 — Safe chatbot use resources | Teen AI mission + Echo stories | `ageBasedActivities.ts`; Season 2 stories |
| §526 — Age-differentiated best practices | Three age bands (5–8, 9–12, 13–17) | `hubAgeBands.ts`, `ageBasedActivities.ts` |
| §526 — Partnership stakeholders (nonprofit, academic) | Positioning opportunity | ERMITS Advisory; governance suite |

**§522 definition of "online safety" — PandaGarde coverage:**

| Statutory element | Product support |
|---|---|
| (A) Protect from cybercrime, narcotics, gambling, alcohol, adult content | Phishing missions; stranger messaging; red/yellow/green sorting |
| (B) Prevent compulsive behavior and adverse health impacts | Anti-addictive design; no streak anxiety in child layer |
| (C) Facilitate effective use of safeguards and parental controls | Settings missions; catalog; DFA path; parent-guided Hub |

#### Title VI — COPPA 2.0 (kids privacy)

| COPPA 2.0 direction | PandaGarde contribution | Evidence |
|---|---|---|
| Expand protections to teens | Teen band missions (13–17); no teen behavioral profiling | `CONTENT_TRUTH.md` §3 |
| Limit targeted advertising | Zero behavioral advertising | Kids App has no analytics |
| Data minimization | Local-first; avatar + age band only in Kids App | `KidsProgressContext.tsx` |
| Deletion rights | Device-local data; user can reset | Kids App grown-ups corner |

### Four-surface policy contribution

| Surface | KIDS Act contribution |
|---|---|
| **Website** | DFA journey; self-reported catalog; footprint review; safety alerts; parent guides; privacy assessment |
| **Family Hub** | 18 structured missions with family ritual and real-world action steps |
| **Kids App** | Calm immersive learning; Trusted Team Builder; no analytics; parental gate |
| **Institutional** *(aspirational)* | Evidence base, pilot outcomes, curriculum alignment for §526 partnership |

### Mission-to-policy quick reference (Family Hub)

Full catalog: [`FAMILYHUB_MISSIONS_PARENT_GUIDE.md`](./FAMILYHUB_MISSIONS_PARENT_GUIDE.md).

| Age band | Mission | KIDS Act theme |
|---|---|---|
| 5–8 | Traffic Light: Safe or Not? | Harm avoidance; social-engineering precursors |
| 5–8 | Who Can I Talk To Online? | Messaging safety; stranger controls (§214 education) |
| 5–8 | Secret Keeper Club | Account security; password literacy |
| 9–12 | Privacy Settings Pro | Parental-tool literacy (§214(B)) |
| 9–12 | App Permission Inspector | Permissions; geolocation/contacts/mic (§214(E) education) |
| 9–12 | Phishing Patrol | Financial/deceptive harm (§213(4)) |
| 9–12 | Screenshot Safety Challenge | Social harm; bullying prevention |
| 13–17 | Social Media Privacy Simulator | Messaging, audience, location (§214) |
| 13–17 | Data Broker Discovery | Personal information disclosure (Title VI) |
| 13–17 | Privacy Rights Challenge | Consent and deletion literacy (COPPA 2.0) |
| 13–17 | AI & Your Privacy | AWARE Act / Title IV education |

### Approved positioning language (grants / pilots)

- PandaGarde is a **family digital resilience** system that helps parents and children
  practice online safety, privacy settings, and responsible technology use — complementing
  platform safeguards required under federal child-safety legislation.
- Family Hub provides **18 age-matched privacy missions** (ages 5–17) with parent-guided
  conversation and one concrete action per mission — aligned with empowering parents and
  strengthening families.
- PandaGarde teaches families to **use** parental controls and privacy settings on apps they
  already use; it is **not** a monitoring tool or substitute for platform safeguards.

**Avoid:** monitoring claims, third-party parental-control claims, HIPAA/COPPA certification
claims — see `CONTENT_TRUTH.md` §8.

### Policy-driven roadmap enhancements

| Priority | Enhancement | Bill hook |
|---|---|---|
| High | Platform settings deep-links appendix (per-mission parent cards) | §214; §522(C) |
| High | AWARE parent one-pager (chatbot risks, printable PDF) | §524 |
| Medium | Crisis resources block on teen AI content (988 / Crisis Text Line) | Title IV spirit |
| Medium | Pilot evidence package (parent confidence pre/post) | §526 |
| Medium | Educator/district brief (mission map → ISTE / digital citizenship) | §522; §526 |

---

## 13. Related Documents

| Document | Role |
|---|---|
| [`CONTENT_TRUTH.md`](./CONTENT_TRUTH.md) | Shipped behavior — grep before release |
| [`KIDS_ACT_ALIGNMENT.md`](./KIDS_ACT_ALIGNMENT.md) | Full H.R. 7757 requirement mapping, gaps, grant narrative |
| [`BILLS-119hr7757eh.pdf`](./BILLS-119hr7757eh.pdf) | Source legislation (KIDS Act) |
| [`STORYLINE_BIBLE.md`](./STORYLINE_BIBLE.md) | Creative canon — characters, zones, pillars |
| [`FAMILYHUB_MISSIONS_PARENT_GUIDE.md`](./FAMILYHUB_MISSIONS_PARENT_GUIDE.md) | Mission catalog for parents and policy conversations |
| [`sdlc/VISION.md`](./sdlc/VISION.md) | FamilyHub authoritative identity (SDLC suite) |
| `CLAUDE.md` | Engineering standards and production blockers |

---

*PandaGarde · The Digital Bamboo Forest · ERMITS Advisory*  
*pandagarde.com · Facely Kandé, CISSP, CISA, PMP, J.D.*
