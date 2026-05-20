# PG-UC-07 — Parent Reviews Digital Footprint Summary

## Actors
- Guardian
- Teen (optional co-review)

## Preconditions
- Guardian authenticated
- DFA journey data exists (guardian or teen completed steps)

## Main Success Scenario

1. Guardian opens Digital Footprint Awareness section
2. System computes DFA score from completed journey inputs
3. System presents explainable score breakdown and recommendations
4. Guardian reviews per-child or family-level summary
5. Guardian may initiate family discussion resources

## Alternative Flows

- Teen completes journey first — guardian receives summary notification (if enabled)
- Partial journey — show progress, not final score

## Exception Flows

- Insufficient data — prompt to complete remaining steps
- Score engine error — fail safe with generic guidance, log operational event

## Business Rules

- Scores must be explainable, not opaque rankings
- No sharing of child scores publicly
- No use of DFA data for advertising profiles

## Postconditions

- Guardian has viewed summary; optional export via PG-UC-10

## Implementation Reference

- `src/lib/dfaJourney.ts`, `dfaScoreEngine.ts`
- Automated tests: `npm run test:dfa`
