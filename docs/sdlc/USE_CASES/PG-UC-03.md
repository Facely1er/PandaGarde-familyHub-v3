# PG-UC-03 — Parent Reviews Screen-Time Insights

> Parent as collaborator, not surveillance operator ([Authoritative Suite](../pandagarde_authoritative_sdlc_governance_suite_v_1.md) §9).

## Actors
- Guardian

## Preconditions
- Guardian authenticated to FamilyHub
- Screen-time data available (voluntary logging or device session summaries)

## Main Success Scenario

1. Guardian opens wellbeing or dashboard section
2. System aggregates ScreenTimeSession records per child
3. System presents trends (daily/weekly) without exposing raw surveillance data
4. Guardian reviews insights and optional guidance
5. Guardian may export summary for family discussion

## Alternative Flows

- No sessions recorded — show educational prompt to enable voluntary tracking
- Multiple children — filter by ChildProfile

## Exception Flows

- Data corruption — show recovery message, do not display inaccurate metrics
- Child profile deleted — orphan sessions purged per retention policy

## Business Rules

- No covert monitoring; transparency to guardian and age-appropriate child notice
- Insights must not be sold or used for advertising
- Pseudonymize analytics aggregates

## Postconditions

- Guardian has viewed insights; optional audit log entry (no child PII in logs)
