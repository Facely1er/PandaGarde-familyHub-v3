# UX Journey Baseline Review — FamilyHub v3

Version: 1.0  
Date: May 2026  
Method: Code and structure review per [UX_JOURNEY_REVIEW_FRAMEWORK.md](./UX_JOURNEY_REVIEW_FRAMEWORK.md) (ordered 1→10)  
**Not a substitute for live device testing** — mark manual re-validation before release sign-off.

| Field | Value |
|-------|-------|
| Reviewer | SDLC documentation pass (automated baseline) |
| Build | FamilyHub v3 (local-first) |
| Next step | Manual tablet pass + filled checklist in framework doc |

---

## Summary

| Result | Count |
|--------|-------|
| Pass | 2 |
| Partial | 6 |
| Fail | 2 |

**Top strategic gap:** Emotional continuity between activities is weak — marketing site, DFA journey, mini-games, and Family Hub progress are not yet unified into one mission lifecycle (suite §7.2, framework journey 3 & 10).

**Top governance gap:** Placeholder routes remain in `App.tsx` ([ROUTE_REGISTRY.md](./ROUTE_REGISTRY.md)).

---

## 1. Entry Journey — **Partial**

| Question | Finding |
|----------|---------|
| Safe & trustworthy? | `HomePage` emphasizes trust points, local-first, shield iconography — positive |
| Family ecosystem vs dashboard? | `/` reads as marketing site; `/family-hub` is app shell — split may confuse first-time users |
| Mission in 5 seconds? | DFA “Understand exposure first” is clear; “mission-based privacy journey” less explicit on home hero |
| Calm hierarchy? | Home uses structured sections; many CTAs on full scroll |
| Child knows next step? | Child path not primary on `/`; hub entry via guardian |
| Parent role clear? | Parent CTAs present (`/parent-toolkit`, `/get-started`, `/family-hub`) |

**Remediation:** Unify entry narrative; single primary CTA for “Start family journey”; reduce competing actions above fold.

---

## 2. Orientation Journey — **Partial**

| Question | Finding |
|----------|---------|
| Child navigate without reading all? | Family Hub bottom nav (5 tabs) is icon+label — good for tablets |
| Visual guidance? | `AppShell` active states; DFA banner on dashboard |
| “Continue Journey” obvious? | DFA resume via `dfaJourney.ts` on dashboard; no global “Continue Journey” on activities tab |
| Progression understandable? | Split across `/family-hub/progress`, `GamificationDashboard`, `FamilyDashboard` |
| Categories intuitive? | Activities grid uses game names, not governance mission categories (Password Safety, etc.) |

**Remediation:** Add prominent Continue Journey; align activity categories with [SUPPLEMENTARY_SPEC.md](./SUPPLEMENTARY_SPEC.md) §6.

---

## 3. Mission Journey — **Fail**

Expected flow: `card → intro → activity → completion → reward → next`

| Step | Implementation |
|------|----------------|
| Mission card | Activities grid (`ActivitiesScreen`) — game cards, not mission metadata |
| Intro | **Missing** standardized mission intro |
| Activity | `ActivityManager` — present |
| Completion | Per-activity callbacks; inconsistent across games |
| Reward | XP via `gamificationSystem`; not all activities wired |
| Next recommendation | **Missing** systematic “suggested next mission” |

`gamificationSystem.ts` defines `Mission` interface but UI does not enforce suite §7.2 lifecycle.

**Remediation:** Implement shared `MissionShell` component with mandatory 7-step lifecycle; wire all child activities through it.

---

## 4. Progression Journey — **Partial**

| Question | Finding |
|----------|---------|
| Motivate without manipulation? | XP, levels, streaks, rarity tiers — monitor for casino feel |
| Progress visible? | `ProgressScreen`, certificates, export — yes in hub |
| Child feels advancement? | Depends on activity completion wiring |
| Rewards satisfying? | Achievement toasts in story; hub progress less celebratory |
| Understandable? | Multiple systems: `GamificationSystem`, `ProgressContext`, `FamilyProgressContext`, `dfaJourney` — **anti-drift risk** |

**Remediation:** Consolidate to one authoritative progress context per [ARCHITECTURE.md](./ARCHITECTURE.md); simplify XP display for children.

---

## 5. Parent Journey — **Partial**

| Question | Finding |
|----------|---------|
| Parent feels useful? | Guides, toolkit, family plan, dashboard — strong content surface |
| Concise? | Large marketing site — parent paths can overwhelm |
| Facilitates conversation? | Guides include conversation approaches; hub dashboard less discussion-prompt driven |
| Avoids surveillance UX? | Copy emphasizes local-first; “privacy score” language needs care |

**Remediation:** Add parent discussion prompts to hub dashboard per mission metadata standard; audit “score” copy for collaboration tone.

---

## 6. Emotional UX Journey — **Partial**

| Question | Finding |
|----------|---------|
| Trust? | Brand warmth on home and story |
| Child encouraged? | Story/Interactive Panda strong; hub activities more utilitarian |
| Celebrates learning? | Story celebrations; hub muted |
| Avoids anxiety? | Generally supportive; assessment flows need manual review |
| Panda identity alive? | Strong in story routes; weaker in `/family-hub/activities` |
| Memorable? | Story yes; hub TBD |

**Remediation:** Extend Panda voice and celebration patterns from `InteractiveStoryPage` into Family Hub missions.

---

## 7. Visual Rhythm — **Partial**

| Question | Finding |
|----------|---------|
| Calm UI? | Hub uses whitespace and cards — generally calm |
| Grouped sections? | App shell consistent; marketing site denser |
| Whitespace? | Adequate in hub; variable on marketing pages |
| Obvious hierarchy? | Hub good; home page long-scroll |
| Tiring? | Marketing home may fatigue — manual review needed |

**Remediation:** Enforce canonical screen structure ([SUPPLEMENTARY_SPEC.md](./SUPPLEMENTARY_SPEC.md) §4.1) on hub screens.

---

## 8. Mobile Journey — **Pass**

| Question | Finding |
|----------|---------|
| Tablet/mobile interaction? | `AppShell` bottom nav, `min-h-[64px]` touch targets, `safe-area-*` |
| Touch targets? | Activities back button 44px; tab bar 64px |
| Accidental taps? | Grid cards adequately spaced |
| Smooth motion? | Tailwind transitions; verify reduced-motion manually |

**Note:** Confirm on physical tablet before release sign-off.

---

## 9. Accessibility Journey — **Partial**

| Question | Finding |
|----------|---------|
| Inclusive? | `accessibility.ts` utilities; `/accessibility` page; tests exist |
| Reading comfortable? | Theme tokens; dyslexia support in utils — verify applied hub-wide |
| Predictable interactions? | Hub nav predictable; games vary |
| Excessive animation? | Home intersection animations — check `prefers-reduced-motion` |

**Remediation:** Run `npm run test:run` + manual NVDA/VoiceOver on hub + one mission path.

---

## 10. Return Journey — **Fail**

| Question | Finding |
|----------|---------|
| Reason to return? | Streaks/XP exist but not surfaced as daily hook on hub home |
| Progression visible? | Progress tab separate from activities |
| Next mission clear? | **Not** on dashboard by default |
| Continuity? | `dfaJourney` state helps DFA; activities lack linked “up next” |
| Feels alive? | Static grid vs dynamic journey |

**Remediation:** Dashboard widget: “Today’s mission”, streak, and Continue Journey; persist last mission in local storage.

---

## Remediation Backlog (Prioritized)

| Priority | Item | Journeys | Code areas |
|----------|------|----------|------------|
| ~~P0~~ Done | ~~Remove or implement placeholder routes~~ | 2, 14 QA | `ActivitiesPage`, `PrivacyLearningKitPage`, `WorksheetsPage` |
| P0 | Mission lifecycle shell (7 steps) | 3, 10 | `ActivitiesScreen`, new `MissionShell` |
| P1 | Single progress system | 4 | Contexts, `gamificationSystem.ts` |
| P1 | Continue Journey + today’s mission on dashboard | 2, 10 | `DashboardScreen`, `dfaJourney` |
| P2 | Mission categories align to governance | 2, 3 | Activity metadata |
| P2 | Parent discussion prompts on hub | 5 | `FamilyDashboard` |
| P3 | Panda emotional continuity in hub | 6 | Shared celebration components |

---

## Sign-off

This baseline does **not** qualify for production UX sign-off until manual validation completes and P0 items are addressed.

Copy the [Release Review Checklist](./UX_JOURNEY_REVIEW_FRAMEWORK.md#release-review-checklist) after remediation and live testing.
