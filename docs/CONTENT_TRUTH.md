# Content truth sheet — PandaGarde & Family Hub

**Purpose:** Keep marketing, help text, and UI copy aligned with what the product actually does today. Update this file when behavior changes, then grep the codebase for stale phrases listed in §7.

**Status (v3, local-first):** Frontend-only PWA + Capacitor app. No production backend for family sync or accounts.

---

## 1. Two products, one journey

| Surface | Role | Route |
|--------|------|--------|
| **PandaGarde (website)** | Discover exposure (service catalog, DFA, assessment), learn, prioritize | `/`, `/service-catalog`, `/digital-footprint`, etc. |
| **Family Hub** | Practice and follow through — missions, members, progress on device | `/family-hub/*` |

**Approved one-liner:** The website helps families *see* exposure; Family Hub helps them *practice and follow through* together.

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
| “Approve/deny child app requests” in Family Hub | **False** — catalog status exists on the **website** for planning/DFA, not a child request workflow in Hub |

---

## 4. Safety alerts & notifications

Two related features on **`/safety-alerts`** (and enabled after **service catalog** entries exist). Neither monitors the child’s device.

### A. Service notifications (default tab)

- Generated from **services the family listed** in the catalog (`ServiceNotificationCenter`)
- Includes reminders (e.g. pending privacy actions), catalog-linked messages, and items merged from RSS when available
- Requires at least one service on a family member — empty catalog → empty notifications

### B. RSS safety headlines (`ChildSafetyAlerts` tab)

- Headlines from configured **public RSS feeds** (`rssAlertService`), filtered for child/privacy relevance and matched to catalog services when possible
- User may **refresh** on the alerts page; production does **not** auto-poll feeds on every page load (CORS / on-demand init)
- Not guaranteed “real-time”; network required to fetch feeds

### Optional email

- **Email capture** on the alerts page is for **newsletter-style updates** (EmailJS when configured), not push alerts from child devices

### Approved phrases

- “Alerts for **apps you add** to your family catalog”
- “**RSS headlines** about child privacy and safety (when feeds load)”
- “**Catalog-based** notifications and reminders”

### Avoid

- “Real-time monitoring” of children’s online activity
- “Automatic alerts for everything your child does online”
- Implying alerts work with **zero** catalog setup

---

## 5. Community routes (`/community/*`)

- **Device-local demos** (forum, stories, resource list) stored in `localStorage` via `communityStorageManager`
- **Not** connected to Family Hub sync or a live PandaGarde social network
- Subtitles should say **device-local demo** where relevant

---

## 6. Pilot program

- Pilot feedback is through the **program**, not an in-app Family Hub social feature
- “Exclusive resources” in pilot copy = pilot partner materials, not Family Hub membership perks

---

## 7. Stale phrases — grep before release

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

- List apps and services your family uses (self-reported)
- Digital Footprint Analysis and privacy recommendations from that list
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
