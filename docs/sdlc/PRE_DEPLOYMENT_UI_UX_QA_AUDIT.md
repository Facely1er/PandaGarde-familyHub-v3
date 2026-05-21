# Pre-Deployment & Store Submission — UI/UX QA Audit

**Product:** PandaGarde FamilyHub v3 (PWA / Netlify)  
**Audit date:** 2026-05-21  
**Scope:** UI/UX, accessibility, Family Hub, PWA manifest, production gates  
**Automated checks run:** `npm run lint`, `npm run build`, `npm run test:run`, `npm audit --audit-level=high`

---

## Executive summary

| Gate | Status | Notes |
|------|--------|--------|
| ESLint | **Pass** | `npm run lint` exit 0 |
| Production build | **Pass** | `npm run build` ~18s, no errors |
| Unit tests | **Pass** | 96/96 tests; Vitest mock hoisting warning (non-blocking) |
| npm audit (high+) | **Pass** | 0 high/critical at audit time |
| **Store / PWA metadata** | **Fail** | Manifest branding, broken shortcuts, placeholder screenshots |
| **Family Hub UX** | **Conditional** | Strong mobile/dark patterns; modal a11y gaps; destructive actions unconfirmed |
| **Marketing site polish** | **Defer** | Many pages still inline-style heavy; low responsive coverage on some routes |

**Recommendation:** Safe for **Netlify deploy** after P0 fixes (2026-05-21). Treat **App Store / Play “Add to Home Screen”** listing as blocked until **real store screenshots** are added (manifest no longer ships invalid screenshot entries).

---

## 1. Automated production gates

```
npm run lint     → PASS
npm run build    → PASS
npm run test:run → PASS (11 files, 96 tests)
npm audit        → 0 vulnerabilities (high+)
```

### Bundle size (post-build)

| Chunk | Size | Budget (CLAUDE.md) | Status |
|-------|------|-------------------|--------|
| `index-*.js` | ~267 KB | ≤ 300 KB | OK |
| `FamilyHubWrapper-*.js` | ~12 KB (route shell; screens split) | ≤ 250 KB | OK |
| `jspdf.es.min-*.js` | ~386 KB | Lazy-loaded | OK if dynamic import only |
| `html2canvas` | ~201 KB | Lazy-loaded | Verify call sites |

**Action:** Profile Family Hub chunk; defer heavy game/activity imports if store cold-start matters.

---

## 2. P0 — Blockers before store submission

### 2.1 `public/manifest.json` inconsistencies

| Issue | Detail |
|-------|--------|
| **Wrong product name** | `"Privacy Panda"` / `"Privacy Panda - Digital Privacy Education"` — live brand is **PandaGarde** (`index.html` uses PandaGarde apple title) |
| **Broken PWA shortcuts** | `/interactive-story` → no route (app uses `/story`, `/privacy-panda`) |
| | `/mission-hub` → **no route** (404 after install shortcut) |
| **Invalid store assets** | `screenshots` and all `icons` use `/LogoPandagarde.png` — stores reject logo-as-screenshot; need real 1280×720 / phone captures |
| **Icon sizing** | Same PNG declared as 192×192 and 512×512 without dedicated assets |

**Tester steps:** Install PWA → open each shortcut → confirm landing page exists and matches store listing copy.

### 2.2 Family Hub opened in new tab from main site

Multiple marketing links use `target="_blank"` for same-origin `/family-hub`:

- `HomePage`, `QuickStartPage`, `Footer`, `AboutPage`, `PilotPage`, etc.

**UX impact:** On mobile, users get a second browser context; breaks “app-like” flow and confuses reviewers testing “single app” journey.

**Fix:** Use `<Link to="/family-hub">` without `target="_blank"` (or `target="_self"`).

### 2.3 Kids screen — Add Member modal (accessibility)

File: `src/familyhub/screens/KidsScreen.tsx`

| Requirement (CLAUDE.md) | Status |
|-------------------------|--------|
| `role="dialog"` + `aria-modal="true"` | **Missing** on add-member overlay |
| Focus trap | **Missing** (contrast: `HubTour.tsx` has dialog role; `SearchModal.tsx` has full trap) |
| Escape closes modal | **Missing** |
| Focus return to trigger | **Missing** |

**Also:** Remove member has **no confirmation** — accidental tap deletes data (store UX negative).

---

## 3. P1 — High priority (deploy soon after P0)

### 3.1 Family Hub onboarding & auth

- `LoginPage` is **local “Open Family Hub”** only — correct for privacy story; **document for reviewers** on `AppStoreReviewPage` so Apple/Google don’t expect real accounts.
- `WelcomeScreen` + `HubTour` — good first-run UX; HubTour lacks Escape/focus trap (same class as Kids modal).

### 3.2 Activities — “coming soon” copy

`ActivitiesScreen.tsx` shows: *“Interactive game coming soon”* for some learning cards while still offering conversation prompts.

**Store risk:** Reviewers may mark incomplete if games are advertised in listing.

**Fix options:** Hide unfinished game CTAs in production, or reword to “Conversation guide” only.

### 3.3 Cross-app navigation from hub

`SettingsScreen` links to `/faq`, `/privacy` with `Link` (good). Dashboard links to `/privacy-assessment` via full page navigation (acceptable).

Ensure **back path** from site → hub doesn’t strand users (header “Site” link in `AppShell` helps).

### 3.4 Analytics & privacy claims

- GA4 hardcoded in `index.html` (`G-VEQXJHYNHG`) with `anonymize_ip` — align **Privacy Policy** and store “Data collected” answers.
- Settings claims “never shared with third parties” while GA runs — **copy/legal alignment** required for store forms.

### 3.5 Portrait-only PWA

`manifest.json`: `"orientation": "portrait-primary"` — tablets/landscape may letterbox; note in store “designed for phone portrait.”

---

## 4. P2 — Medium (post-launch polish)

### 4.1 Design system debt

- **~90+ files** still use `style={{}}` (grep count across `src/`) — violates Tailwind-first rule; uneven dark mode on legacy pages.
- `ParentDashboard.tsx` — embedded `<style>` strings (anti-pattern per CLAUDE.md).
- Pages flagged with **minimal responsive classes** (e.g. `FAQPage` ~1 breakpoint): `AgeGroupsPage`, `TermsPage`, `ResourcesPage`, etc. — test on 320px width.

### 4.2 Accessibility backlog

- Family Hub tab filters (`ActivitiesScreen` age/focus chips) — verify `aria-pressed` / selected state for screen readers.
- Div/span `onClick` without keyboard handlers — audit parent components (`HelpSystem`, `FamilyHubPage`) outside hub.
- Form inputs without labels — CLAUDE.md cites ~65 site-wide; hub forms (Kids) are **good** (labeled name/age/role).

### 4.3 PlaceholderPage

`PlaceholderPage.tsx` exists but is **not routed** in `App.tsx` — dead code; safe to remove or keep for dev only. CLAUDE “3 routes placeholder” blocker appears **stale**.

### 4.4 `console.log`

Production `console.log` in components largely cleared; only `logger.ts` references remain — **OK** for deploy.

---

## 5. Family Hub — screen-by-screen QA checklist

Use on **iOS Safari**, **Android Chrome**, and **desktop 1280px** in light + dark mode.

### Login / Welcome

- [ ] Login: single CTA, readable, 44px touch target
- [ ] Welcome → dashboard routing respects `HUB_WELCOMED_KEY`
- [ ] Dark mode contrast on teal banners

### Dashboard (`DashboardScreen`)

- [ ] Stats grid readable at 320px (3-column wraps)
- [ ] Quick actions navigate correctly
- [ ] Hub tour dismiss persists (`pandagarde_hub_tour_done`)
- [ ] Link to `/privacy-assessment` works from banner

### Kids (`KidsScreen`)

- [ ] Empty state → add member flow
- [ ] Age 5–17 shows activity badge link with correct `initialAgeFilter` on Activities
- [ ] View progress → `ChildProgressDetail` → back
- [ ] **Add modal:** keyboard trap, Escape, labelled fields
- [ ] **Remove:** confirm dialog before delete
- [ ] Ages outside 5–17: no broken badge (expected: no age-group link)

### Activities (`ActivitiesScreen`)

- [ ] Age tabs + focus tabs scroll on small screens
- [ ] Launch activity → back control
- [ ] Completed state persists after refresh
- [ ] “Coming soon” games clearly not broken buttons

### Progress (`ProgressScreen`)

- [ ] Certificates / export modals closable
- [ ] Touch targets on toggle buttons

### Settings (`SettingsScreen`)

- [ ] Theme toggle + `aria-pressed`
- [ ] External policy links open correctly
- [ ] “Back to website” works

### App shell

- [ ] Bottom nav 5 tabs, safe-area insets
- [ ] Skip link focuses `#family-hub-main`
- [ ] Tab keyboard arrows (implemented in `AppShell`)
- [ ] Logo returns to `/` without breaking hub state

---

## 6. Main website — critical paths before deploy

| Journey | Route(s) | Check |
|---------|----------|-------|
| Discover | `/`, `/features`, `/get-started` | Hero CTA, responsive, dark mode |
| DFA | `/service-catalog` → `/digital-footprint` → `/privacy-assessment` | Journey stepper progress saves |
| Goals | `/privacy-goals` | Create/edit goal, suggestions from assessment |
| Family Hub entry | `/family-hub` | No `target=_blank` after fix |
| Legal | `/privacy`, `/terms`, `/parental-consent` | Required for kids category stores |
| Reviewer doc | `/app-store-review` | Matches actual build behavior |

---

## 7. Store listing alignment (metadata vs app)

| Store field | Must match app |
|-------------|----------------|
| App name | PandaGarde (not Privacy Panda) |
| Screenshots | Real hub dashboard, activities, kids screen — not logo |
| Description | No “AI chatbot” unless shipped |
| Kids category | COPPA/parental consent pages linked |
| Offline | Accurate — localStorage, RSS needs network for alerts |
| Login | “No account required” — matches `LoginPage` |

---

## 8. Sign-off matrix

| Role | P0 complete | P1 complete | Approved |
|------|-------------|-------------|----------|
| UX | ☐ | ☐ | ☐ |
| A11y | ☐ | ☐ | ☐ |
| Engineering | ☐ | ☐ | ☐ |
| Legal / Privacy | ☐ GA copy | ☐ | ☐ |
| Store ops | ☐ manifest | ☐ assets | ☐ |

---

## 9. Suggested fix order (minimal workload)

1. ~~**manifest.json**~~ — done (PandaGarde branding, valid shortcuts, screenshots removed)  
2. ~~**Remove `target="_blank"`** on internal `/family-hub` links~~ — done  
3. ~~**KidsScreen modal**~~ — done (`useDialogFocusTrap`, confirm delete)  
4. ~~**HubTour**~~ — done (Escape, focus trap, backdrop dismiss)  
5. ~~**Activities**~~ — done (conversation-first copy)  
6. **Family Hub bundle** — lazy-load heaviest activity modules if over budget matters  
7. **Store listing** — add real device screenshots before App Store / Play submission  

---

## Appendix — Commands to re-run before release

```bash
npm run lint
npm run type-check
npm run test:run
npm run build
npm audit --audit-level=high
```

Manual: Lighthouse accessibility on `/`, `/family-hub/dashboard`, `/digital-footprint` (mobile emulation).
