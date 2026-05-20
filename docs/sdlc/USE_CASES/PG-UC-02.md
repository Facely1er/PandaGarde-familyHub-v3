# PG-UC-02 — Child Accesses Learning Activities

> Mission lifecycle per [SUPPLEMENTARY_SPEC.md](../SUPPLEMENTARY_SPEC.md) §6 and governance suite §7.

## Actors
- Child
- Guardian (implicit oversight)

## Preconditions
- Guardian has created family workspace
- Child profile exists with age band configured
- Guardian consent for educational tracking is granted (if cloud sync enabled)

## Main Success Scenario

1. Child selects their profile on a guardian-approved device
2. System presents age-appropriate mission catalog (metadata per §6)
3. **Mission Intro** — child sees objective and estimated duration
4. **Guided Interaction** — child completes mission segments (offline cache if needed)
5. **Completion Validation** — system confirms learning outcome
6. **Reward Sequence** — positive reinforcement (no punishment / no gambling mechanics)
7. **Reflection** — brief recap; optional parent discussion prompt
8. **Suggested Next Mission** — system records progress and milestones locally

## Alternative Flows

- Child resumes incomplete module
- Guardian limits available modules by age band

## Exception Flows

- No child profile configured — redirect to guardian setup
- Consent revoked — block progress sync, allow read-only cached content
- Content unavailable offline — show friendly offline message

## Business Rules

- No behavioral advertising in learning UI
- No infinite scroll for child views
- Progress data minimized to educational outcomes only
- Gamification uses milestones, not gambling mechanics

## Postconditions

- LearningActivity record created or updated
- PrivacyMilestone updated when applicable
