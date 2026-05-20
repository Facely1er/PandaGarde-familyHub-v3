# PG-UC-08 — AI Moderation Reviews Unsafe Interactions

## Actors
- System (automated moderation)
- Human reviewer (escalation)

## Preconditions
- AI-assisted feature enabled with safeguards configured
- Logging pipeline active per [LOGGING_MONITORING_STANDARD.md](../LOGGING_MONITORING_STANDARD.md)

## Main Success Scenario

1. User (child or guardian) submits content to AI-assisted feature
2. System applies safety filters and policy checks
3. Unsafe content detected — submission blocked or sanitized
4. System creates ModerationEvent and AIInteraction log (pseudonymized)
5. High-severity events queue for human review
6. Reviewer disposition recorded; remediation applied if needed

## Alternative Flows

- Borderline content — allow with warning and enhanced logging
- False positive — reviewer marks benign, tune rules

## Exception Flows

- Moderation service unavailable — fail closed for child sessions; degrade for guardian tools with notice
- Repeated violations — temporary feature suspension

## Business Rules

- Fail closed for minors when safety pipeline unavailable
- No full child dialogue in long-term logs
- Escalate I1 incidents per [INCIDENT_RESPONSE_STANDARD.md](../INCIDENT_RESPONSE_STANDARD.md)

## Postconditions

- ModerationEvent stored
- Feature state updated if suspension required
