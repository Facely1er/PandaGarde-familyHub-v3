# PG-UC-05 — Guardian Manages Consent Settings

## Actors
- Guardian

## Preconditions
- Guardian authenticated
- Family workspace exists

## Main Success Scenario

1. Guardian navigates to privacy and consent settings
2. System displays current ConsentRecord states (tracking, cloud sync, school link)
3. Guardian toggles or updates a consent category
4. System presents clear explanation of impact
5. Guardian confirms change
6. System persists ConsentRecord with timestamp and version

## Alternative Flows

- Guardian revokes all optional consents — disable cloud sync, retain local data
- Guardian re-enables consent after prior revocation

## Exception Flows

- Attempt to enable school link without school invitation — block with message
- Concurrent session conflict — last-write-wins with audit trail

## Business Rules

- Consent must be explicit and granular
- Revocation must take effect immediately for cloud processing
- Child accounts cannot modify guardian consent settings
- Consent history retained per [FAMILY_DATA_GOVERNANCE.md](../FAMILY_DATA_GOVERNANCE.md)

## Postconditions

- Updated ConsentRecord stored
- Dependent features enabled or disabled accordingly
