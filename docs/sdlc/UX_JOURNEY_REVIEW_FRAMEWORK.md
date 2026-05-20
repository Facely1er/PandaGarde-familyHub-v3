# UX Journey Review Framework

Version: 1.0  
Date: May 2026  
Status: **MANDATORY** for UX, QA, and release sign-off  
Aligned with: [Authoritative Governance Suite](../pandagarde_authoritative_sdlc_governance_suite_v_1.md) §4–5, [VISION.md](./VISION.md), [SUPPLEMENTARY_SPEC.md](./SUPPLEMENTARY_SPEC.md)

---

## Rule: Do NOT Review Randomly

UX reviews MUST follow the **numbered order below** (1 → 10). Skipping or reordering journeys invalidates the review for release sign-off.

Each journey has a **goal**, **review scope**, **questions**, and **critical risks**. Record pass/fail/notes in the [Release Review Checklist](#release-review-checklist) appendix.

---

## Strategic Position (Read First)

The largest UX opportunity is **not** more activities. It is **emotional continuity between activities** — the layer most privacy/education products miss.

When PandaGarde becomes:

- mission-driven  
- progression-based  
- emotionally cohesive  
- family collaborative  

…it stops competing with privacy awareness tools and competes with **premium educational ecosystems**.

**Children remember:** feelings, characters, rewards, stories — not dashboard complexity.

---

## 1. Entry Journey

**Goal:** Evaluate first emotional impression.

**Review scope:** Landing, welcome, first screen after auth, hero messaging, primary CTA.

### Questions

| # | Question |
|---|----------|
| 1.1 | Does the platform immediately feel **safe and trustworthy**? |
| 1.2 | Does it feel like a **family ecosystem** or a React dashboard? |
| 1.3 | Is the mission understandable within **5 seconds**? |
| 1.4 | Is the visual hierarchy **calm and guided**? |
| 1.5 | Does the child know **what to do next**? |
| 1.6 | Does the parent understand **their role**? |

### Critical risk

Most educational apps overwhelm users with options on first load.

### PandaGarde MUST feel

guided · warm · structured · welcoming

### PandaGarde MUST NOT feel

cluttered · enterprise-like · gamified chaos

**Governance refs:** Suite §2, §4.1; [VISION.md](./VISION.md)

---

## 2. Orientation Journey

**Goal:** Measure **cognitive friction** — how hard is it to understand where to go?

**Review scope:** Onboarding, first mission selection, navigation clarity, dashboard hierarchy.

### Questions

| # | Question |
|---|----------|
| 2.1 | Can a child navigate **without reading everything**? |
| 2.2 | Does the platform **visually guide attention**? |
| 2.3 | Is **“Continue Journey”** (or equivalent) obvious? |
| 2.4 | Is **progression understandable**? |
| 2.5 | Are **categories intuitive**? |

**Governance refs:** Suite §5.3; [SUPPLEMENTARY_SPEC.md](./SUPPLEMENTARY_SPEC.md) §4.2

---

## 3. Mission Journey

**Goal:** Validate one **complete activity flow** end-to-end.

**Review scope (in order):**

```
mission card → intro → activity → completion → reward → next recommendation
```

### Questions

| # | Question |
|---|----------|
| 3.1 | Does the activity feel **meaningful**? |
| 3.2 | Does the intro **emotionally frame** the mission? |
| 3.3 | Is the **learning objective** clear? |
| 3.4 | Is **feedback immediate**? |
| 3.5 | Does completion feel **rewarding**? |
| 3.6 | Is there a **natural next step**? |

### Critical risk

Without **emotional continuity**, activities feel disposable. This is where most educational platforms fail.

**Governance refs:** Suite §7.2; [SUPPLEMENTARY_SPEC.md](./SUPPLEMENTARY_SPEC.md) §6; [PG-UC-02](./USE_CASES/PG-UC-02.md), [PG-UC-06](./USE_CASES/PG-UC-06.md)

---

## 4. Progression Journey

**Goal:** Confirm motivation without manipulation.

**Review scope:** XP, achievements, streaks, unlockables, levels, progress UI.

### Questions

| # | Question |
|---|----------|
| 4.1 | Does progression motivate **without manipulation**? |
| 4.2 | Is progress **visible enough**? |
| 4.3 | Does the child feel **advancement**? |
| 4.4 | Are rewards **emotionally satisfying**? |
| 4.5 | Is the system **understandable**? |

### Danger

**Over-gamification.** You are NOT building casino mechanics for children. You ARE building **positive behavioral reinforcement**.

**Governance refs:** Suite §8; [CHILD_SAFETY_STANDARD.md](./CHILD_SAFETY_STANDARD.md) prohibited features

---

## 5. Parent Journey

**Goal:** Validate family collaboration — major differentiator.

**Review scope:** Parent prompts, discussion guidance, family participation hooks, guardian dashboard copy.

### Questions

| # | Question |
|---|----------|
| 5.1 | Does the parent feel **useful**? |
| 5.2 | Is parent content **concise**? |
| 5.3 | Does the app **facilitate conversation**? |
| 5.4 | Does the platform avoid **“surveillance parent”** UX? |

Most competitors ignore family collaboration. PandaGarde must not.

**Governance refs:** Suite §9; [SUPPLEMENTARY_SPEC.md](./SUPPLEMENTARY_SPEC.md) §8; [PG-UC-03](./USE_CASES/PG-UC-03.md)

---

## 6. Emotional UX Journey

**Goal:** Holistic emotional audit (not feature checklist).

### Questions

| # | Question |
|---|----------|
| 6.1 | Does the app create **trust**? |
| 6.2 | Does the child feel **encouraged**? |
| 6.3 | Does the UI **celebrate learning**? |
| 6.4 | Does the platform **avoid anxiety**? |
| 6.5 | Does the **Panda identity** feel alive? |
| 6.6 | Does the product feel **memorable**? |

**This matters more than features.**

**Governance refs:** Suite §4.2; [VISION.md](./VISION.md)

---

## 7. Visual Rhythm Review

**Goal:** Confirm the UI **breathes** — critical for educational/family UX.

**Review scope:** Spacing, density, card hierarchy, typography, motion, screen breathing room.

### Questions

| # | Question |
|---|----------|
| 7.1 | Is the UI **calm**? |
| 7.2 | Are sections **visually grouped**? |
| 7.3 | Is there **enough whitespace**? |
| 7.4 | Is the **hierarchy obvious**? |
| 7.5 | Does the screen feel **tiring**? |

**Governance refs:** Suite §5–6; design tokens in [SUPPLEMENTARY_SPEC.md](./SUPPLEMENTARY_SPEC.md) §5

---

## 8. Mobile Journey Review

**Goal:** Mandatory tablet/mobile validation.

**Review scope:** Thumb reachability, CTA placement, spacing, scrolling rhythm, responsiveness.

### Questions

| # | Question |
|---|----------|
| 8.1 | Can a child comfortably interact on **tablet/mobile**? |
| 8.2 | Are **touch targets** large enough (≥44×44 CSS px)? |
| 8.3 | Is there **accidental tap** risk? |
| 8.4 | Does **motion** feel smooth? |

**Assumption:** FamilyHub is **tablet-first** in real-world family usage.

**Governance refs:** Suite §5.2; [QUALITY_ASSURANCE_STANDARD.md](./QUALITY_ASSURANCE_STANDARD.md)

---

## 9. Accessibility Journey

**Goal:** Inclusive, predictable interactions — strategically important for schools, districts, and family trust.

**Review scope:** Readability, contrast, reduced motion, keyboard navigation, screen reader readiness.

### Questions

| # | Question |
|---|----------|
| 9.1 | Is the UI **inclusive**? |
| 9.2 | Is **reading** comfortable? |
| 9.3 | Are interactions **predictable**? |
| 9.4 | Are animations **excessive**? |

**Governance refs:** Suite §12; [ACCESSIBILITY_STANDARD.md](./ACCESSIBILITY_STANDARD.md)

---

## 10. Return Journey

**Goal:** Retention — what happens when users come back **tomorrow**?

**Review scope:** Re-entry screens, progression visibility, next-mission prompts, continuity cues.

### Questions

| # | Question |
|---|----------|
| 10.1 | Is there a **reason to return**? |
| 10.2 | Is **progression visible**? |
| 10.3 | Is the **next mission clear**? |
| 10.4 | Is there **continuity**? |
| 10.5 | Does the app feel **alive**? |

### Critical risk

Without return motivation, the platform becomes a **one-time novelty**.

**Governance refs:** Suite §4.1 step 9 (Return Motivation); [VISION.md](./VISION.md) experience model

---

## Journey-to-Governance Map

| Journey | Primary suite § | Primary SDLC docs |
|---------|-----------------|-------------------|
| 1 Entry | §2, §4.1 | VISION |
| 2 Orientation | §5.3 | SUPPLEMENTARY_SPEC §4 |
| 3 Mission | §7.2 | SUPPLEMENTARY_SPEC §6, PG-UC-02/06 |
| 4 Progression | §8 | SUPPLEMENTARY_SPEC §7, CHILD_SAFETY |
| 5 Parent | §9 | SUPPLEMENTARY_SPEC §8, PG-UC-03 |
| 6 Emotional | §4.2 | VISION |
| 7 Visual rhythm | §5–6 | SUPPLEMENTARY_SPEC §4–5 |
| 8 Mobile | §5.2, §14 | QA, ACCESSIBILITY |
| 9 Accessibility | §12 | ACCESSIBILITY_STANDARD |
| 10 Return | §4.1 (step 9) | VISION, mission/progress UI |

---

## Release Review Checklist

Complete in order before UX sign-off on any release touching user-facing flows.

| # | Journey | Pass | Fail | N/A | Reviewer | Date | Notes |
|---|---------|------|------|-----|----------|------|-------|
| 1 | Entry | ☐ | ☐ | ☐ | | | |
| 2 | Orientation | ☐ | ☐ | ☐ | | | |
| 3 | Mission (one full flow) | ☐ | ☐ | ☐ | | | |
| 4 | Progression | ☐ | ☐ | ☐ | | | |
| 5 | Parent | ☐ | ☐ | ☐ | | | |
| 6 | Emotional UX | ☐ | ☐ | ☐ | | | |
| 7 | Visual rhythm | ☐ | ☐ | ☐ | | | |
| 8 | Mobile | ☐ | ☐ | ☐ | | | |
| 9 | Accessibility | ☐ | ☐ | ☐ | | | |
| 10 | Return | ☐ | ☐ | ☐ | | | |

**Sign-off criteria:** No **Fail** on journeys 1, 3, 5, 8, or 10 for child-facing releases. Journeys 4 and 6 **Fail** block release if over-gamification or anxiety-driven patterns are observed.

**Reviewer signature:** _________________________ **Release version:** _____________

---

## When to Run This Framework

| Trigger | Required journeys |
|---------|-------------------|
| New feature / screen | All affected journeys + full flow if mission-related |
| Pre-release | All 10 in order |
| Post-redesign | All 10 |
| AI-assisted UI change | 1, 2, 3, 6, 7 minimum |
| School/district pilot | Add journey 9 emphasis + parent journey 5 |

Referenced by: [QUALITY_ASSURANCE_STANDARD.md](./QUALITY_ASSURANCE_STANDARD.md), [TEST_PLAN.md](./TEST_PLAN.md), [RELEASE_MANAGEMENT_STANDARD.md](./RELEASE_MANAGEMENT_STANDARD.md).

**Baseline audit (v3):** [UX_JOURNEY_BASELINE_REVIEW.md](./UX_JOURNEY_BASELINE_REVIEW.md) — initial code review findings and P0–P3 backlog.

**Diagram:** [../diagrams/ux_journey_v1.mmd](../diagrams/ux_journey_v1.mmd)
