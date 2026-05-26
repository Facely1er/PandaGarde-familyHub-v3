# Content truth sheet — PandaGarde & Family Hub

**Purpose:** Keep marketing, help text, and UI copy aligned with what the product actually does today. Update this file when behavior changes, then grep the codebase for stale phrases listed in §7.

**Status (v3, local-first):** Frontend-only PWA + Capacitor app. No production backend for family sync or accounts.

---

## 1. Two products, one journey

| Surface | Role | Route |
|--------|------|--------|
| **PandaGarde (website)** | Service catalog + footprint review, stories, parent guides, printables/downloads; emotional path to Family Hub | `/`, `/service-catalog`, `/digital-footprint`, `/stories`, `/for-families`, etc. |
| **Family Hub** | Practice and follow through — **18 age-matched missions** (family talk + optional embedded games), members, progress on device | `/family-hub/*` |

**Approved one-liner:** Stories and guides are open anytime; the service catalog feeds footprint review when families want a snapshot; Family Hub is optional practice on device.

**Independence rule:** Do **not** imply stories, resources, or Family Hub require completing footprint review or the catalog (except the footprint **page** itself, which needs catalog entries to score).

---

## 2. Family Hub — accurate claims

### Family Hub IS

- A **local-first** workspace (browser or app); progress and profiles stay **on the device**
- **18 age-matched privacy missions** (5–8, 9–12, 13–17) with real-life scenarios, family talk, and one practical action
- **Parent-guided** — not a social network for children
- Optional continuation **after** website DFA/assessment, or **standalone** without the website funnel
- Local guardian gate on `/family-hub` (not a remote server login)

### Family Hub IS NOT

- A community or social network to “connect with other families”
- Child **device monitoring** or live tracking of what kids do online
- A cloud account with multi-device sync (future tier only; not shipped)
- “Exclusive resources” gated behind membership
- Requiring **email** to add a child (name + age only in `KidsScreen`)

### Approved CTAs

- **Open Family Hub** / **Continue in Family Hub** / **Start missions**
- Avoid **Join Family Hub** (implies signup/network)

---

## 3. Auth & privacy data

| Claim | Truth |
|-------|--------|
| “No account required” | Core journey: local profile + `signInLocally()` — no PandaGarde server account |
| “Encrypted and stored securely” (vague) | Prefer: data stays on device; optional client-side encryption for PII when Web Crypto is available |
| “See all apps kids use” | **False** — parents **add** services to the catalog; no passive monitoring |
| “Privacy risk score” | From **catalog + DFA**, not live activity monitoring |
| “We analyze your medical records” | **False** — families **list** health/wellness apps they use; no access to EHR or prescription data |
| “HIPAA-compliant” / “certifies HIPAA compliance” | **False** — educational exposure snapshot, not a compliance audit tool |
| Health apps in service catalog | **True** — wellness, patient portals, telehealth, pharmacy, and school health portals can be **self-reported** like other services |
| “Approve/deny child app requests” in Family Hub | **False** — catalog status exists on the **website** for planning/DFA, not a child request workflow in Hub |

---

## 4. Areas of the site (independent except catalog → footprint)

| Area | Requires catalog? | Notes |
|------|-------------------|--------|
| **Stories** | No | Emotional, kid-facing; open anytime |
| **Resources / guides** | No | Supporting parent copy; open anytime |
| **Family Hub** | No | Missions on device; open anytime |
| **Service catalog** | — | Builds the list footprint review uses |
| **Footprint review** | Yes (for scores) | Empty without catalog entries; does not block other areas |

### Website vs Family Hub — activities boundary

| Surface | Interactive missions / games | Progress |
|---------|------------------------------|----------|
| **Website** | **No** public `/activities` catalog (legacy URLs redirect to Hub). **Guides & stories** hub (`/for-families`) lists printables only—no duplicate mission catalog. | Not for missions |
| **Family Hub** | **Yes** — `ageBasedActivities` missions; optional `ActivityManager` games **inside** a mission only | Per member, device-local |

Do **not** describe website “Learning activities” and Hub “missions” as the same catalog. Approved website CTAs: **Privacy missions** → `/family-hub/activities`. Legacy `/activities` and `/activities/:slug` redirect to Hub (slug mapped when a mission shares the same game id).

Formal **privacy assessment** and **safety alerts** are on **SocialCaution** (legacy URLs redirect). Do not present a single mandatory “complete DFA first” funnel on PandaGarde marketing UI.

---

## 5. Safety alerts (removed from PandaGarde)

PandaGarde **does not** ship `/safety-alerts`. Legacy URLs (`/safety-alerts`, `/alerts`, `/child-safety-alerts`) **redirect** to SocialCaution (`app.socialcaution.com`, `utm_source=pandagarde`) so old bookmarks still work.

### Mention SocialCaution only when relevant

- **Support / FAQ** when users ask where alerts went
- **Not** in primary nav, Resources hub, How It Works, service catalog header, or DFA phase 3 cards

### Avoid on PandaGarde

- “Safety Alerts” as a PandaGarde feature or nav item
- Passive UI promoting SocialCaution on every page
- “Real-time monitoring” of children’s online activity
- Implying PandaGarde sends catalog or RSS alerts today

---

## 6. Community routes (`/community/*`)

- **Device-local demos** (forum, stories, resource list) stored in `localStorage` via `communityStorageManager`
- **Not** connected to Family Hub sync or a live PandaGarde social network
- Subtitles should say **device-local demo** where relevant

---

## 7. Pilot program

- Pilot feedback is through the **program**, not an in-app Family Hub social feature
- “Exclusive resources” in pilot copy = pilot partner materials, not Family Hub membership perks

---

## 8. Stale phrases — grep before release

Search and fix if found in user-facing copy:

```
Join Family Hub
Connect with other families
Family Hub Community
exclusive resources (for Family Hub)
see all the apps.*they use
monitor.*children.*online
real-time alerts.*children
privacy monitoring (for child activity)
Enter their name and email.*Child
```

---

## 8. Canonical feature bullets (copy-paste safe)

**Family Hub**

- 18 age-matched privacy missions (ages 5–17)
- Real-life scenarios and family conversation prompts
- Progress, streaks, and certificates on your device
- Parent-guided — no child social network
- Works standalone or after the website assessment
- No server account required for core use

**Service catalog → alerts**

- List apps and services your family uses (self-reported), including optional **health & medical** entries (wellness, portals, telehealth, pharmacy)
- Digital Footprint Analysis and privacy recommendations from that list — **not** from live medical record access
- Catalog-based service notifications plus RSS safety headlines when feeds load

---

## 9. Automated check

```bash
npm run check:content-truth
```

Scans `src/pages`, `src/components`, `src/familyhub`, and `src/data/familyResources.ts` for §7 banned phrases. Survey copy (`familyPrivacyAssessment.ts`) and service catalog vendor text are excluded.

Add new patterns to `scripts/check-content-truth.mjs` when product behavior changes.

---

## 10. Related docs

- [FAMILYHUB_APP_STORE_COPY.md](./FAMILYHUB_APP_STORE_COPY.md) — store listings (aligned with §2)
- [FAMILYHUB_MISSIONS_PARENT_GUIDE.md](./FAMILYHUB_MISSIONS_PARENT_GUIDE.md) — parent one-pager
- [sdlc/PERSISTENCE_DESIGN.md](./sdlc/PERSISTENCE_DESIGN.md) — local vs cloud tiers
- [sdlc/VISION.md](./sdlc/VISION.md) — product identity (authoritative)
