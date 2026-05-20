# Test Plan

> Aligned with [Authoritative Governance Suite](../pandagarde_authoritative_sdlc_governance_suite_v_1.md) §14. Complements [QUALITY_ASSURANCE_STANDARD.md](./QUALITY_ASSURANCE_STANDARD.md).

## Verification-Before-Completion

Per governance suite §14, automated and manual verification are both required before marking work complete. See QA standard for the full manual checklist (missions, themes, routes, mobile).

### UX Journey Testing (Suite §4.3)

Manual UX validation MUST follow [UX_JOURNEY_REVIEW_FRAMEWORK.md](./UX_JOURNEY_REVIEW_FRAMEWORK.md) in sequence:

| Order | Journey | Test focus |
|-------|---------|------------|
| 1 | Entry | 5-second mission clarity, trust, calm hierarchy |
| 2 | Orientation | Cognitive friction, Continue Journey, categories |
| 3 | Mission | Full card → intro → activity → reward → next |
| 4 | Progression | XP/achievements without casino mechanics |
| 5 | Parent | Useful, concise, conversational — not surveillance |
| 6 | Emotional | Trust, encouragement, Panda identity, memorability |
| 7 | Visual rhythm | Whitespace, grouping, non-tiring screens |
| 8 | Mobile | Tablet-first, touch targets, thumb reach |
| 9 | Accessibility | Contrast, motion, keyboard, screen reader |
| 10 | Return | Next mission clear, progression visible, continuity |

## Test Categories

### Functional Testing
- onboarding
- consent flows
- dashboard functionality
- learning modules

### Security Testing
- authentication
- authorization
- RLS validation
- session security

### Child Safety Testing
- content filtering
- moderation validation
- unsafe prompt testing
- escalation workflows

### Accessibility Testing
- WCAG 2.2 AA
- keyboard navigation
- dyslexia-friendly rendering

### Performance Testing
- mobile responsiveness
- low-bandwidth behavior
- offline mode validation

### Privacy Testing
- consent verification
- data minimization validation
- retention enforcement

## Automated Test Suite (FamilyHub v3)

| Command | Scope |
|---------|-------|
| `npm run test` | Full Vitest suite (watch mode) |
| `npm run test:run` | CI single-pass execution |
| `npm run test:coverage` | Coverage report |
| `npm run test:dfa` | Digital Footprint Awareness journey and score engine |
| `npm run test:launch-smoke` | DFA tests + production build |

Key test locations:

- `src/utils/__tests__/accessibility.test.ts`
- `src/lib/dfaJourney.test.ts`, `dfaScoreEngine.test.ts`
- `src/components/journey/`, `src/components/dfa/`

## Traceability

Each use case in [USE_CASES.md](./USE_CASES.md) must map to at least one functional or acceptance test before production release.

## Sign-Off

Production releases require documented pass results for security, child safety, accessibility, and privacy test categories per [QUALITY_ASSURANCE_STANDARD.md](./QUALITY_ASSURANCE_STANDARD.md).
