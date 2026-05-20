# PG-UC-09 — School Reviews Vendor Privacy Posture

## Actors
- School Admin
- Privacy officer (optional)

## Preconditions
- School tenant active
- Vendor records registered in school catalog

## Main Success Scenario

1. School Admin opens vendor management in privacy portal
2. System lists Vendor entities with privacy posture metadata
3. Admin selects vendor to review data practices, retention, and child data handling
4. Admin records review outcome (approved, conditional, rejected)
5. System stores review decision with audit timestamp

## Alternative Flows

- Admin uploads vendor DPIA or privacy policy document
- Admin compares two vendors side-by-side

## Exception Flows

- Expired vendor certification — flag warning on school dashboard
- Vendor lacks required child data disclosures — block approval until documented

## Business Rules

- Reviews scoped to school tenant only
- No sharing of school vendor decisions with other schools without explicit federation (future)
- Vendor behavioral advertising for students prohibited

## Postconditions

- Vendor review status updated
- Audit log entry created
