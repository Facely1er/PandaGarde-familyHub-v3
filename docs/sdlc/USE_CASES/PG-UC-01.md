# PG-UC-01 — Parent Creates Family Account

## Actors
- Guardian

## Preconditions
- Guardian has valid email address

## Main Success Scenario

1. Guardian opens FamilyHub
2. System presents onboarding
3. Guardian accepts privacy terms
4. Guardian creates secure credentials
5. System provisions family workspace
6. Guardian configures child profiles

## Alternative Flows

- Guardian uses social login
- Guardian pauses onboarding

## Exception Flows

- Invalid email
- Weak password
- Consent failure

## Business Rules

- No child account may exist without guardian ownership
- Consent records must be stored
- Minimal data collection enforced

## Postconditions

- Family workspace exists in local or cloud persistence
- Guardian session is authenticated
- At least zero child profiles configured (onboarding may continue later)

## Related Standards

- [FAMILY_DATA_GOVERNANCE.md](../FAMILY_DATA_GOVERNANCE.md)
- [PERSISTENCE_DESIGN.md](../PERSISTENCE_DESIGN.md)
