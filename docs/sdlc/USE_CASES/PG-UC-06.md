# PG-UC-06 — Child Completes Privacy Learning Journey

> Full mission lifecycle per governance suite §7.2 and [SUPPLEMENTARY_SPEC.md](../SUPPLEMENTARY_SPEC.md) §6.

## Actors
- Child
- Guardian (notification optional)

## Preconditions
- Child profile active with age-appropriate journey assigned
- Learning modules available (online or cached)

## Main Success Scenario

1. Child opens assigned privacy learning journey (multi-mission path)
2. For each mission: Intro → Objective → Guided Interaction → Validation → Reward → Reflection
3. System presents journey progress without anxiety-driven UX
4. Child completes knowledge checks; validation uses supportive messaging only
5. Child reaches journey completion; **Suggested Next Mission** or journey recap shown
6. System awards PrivacyMilestone; guardian dashboard receives summary (non-surveillance framing)

## Alternative Flows

- Child exits mid-journey — progress saved locally
- Guardian resets journey for remediation discussion

## Exception Flows

- Moderation flags unsafe user input — block submission, log ModerationEvent
- Offline completion — sync milestone when connectivity returns (if consented)

## Business Rules

- No gambling-like rewards or infinite scroll
- Age-appropriate language and imagery only
- AI assistance (if any) follows [AI_SAFETY_POLICY.md](../AI_SAFETY_POLICY.md)

## Postconditions

- PrivacyMilestone recorded
- LearningActivity completion logged
