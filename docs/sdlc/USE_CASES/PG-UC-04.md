# PG-UC-04 — School Administrator Manages Privacy Portal

## Actors
- School Admin

## Preconditions
- School tenant provisioned with administrator RBAC
- Administrator authenticated via school identity provider

## Main Success Scenario

1. School Admin signs into School Privacy Portal
2. System loads school-scoped dashboard (RLS enforced)
3. Admin reviews privacy policies and family linkage requests
4. Admin updates school privacy settings or vendor list
5. System persists changes within school tenant only

## Alternative Flows

- Admin delegates read-only access to educator role
- Admin exports compliance summary for district review

## Exception Flows

- Unauthorized tenant access — deny with audit log
- Invalid vendor record — validation error, no partial save

## Business Rules

- Strict school tenant isolation
- No cross-school data visibility
- FERPA-aligned handling of student-linked records
- Guardian consent required before linking family to school

## Postconditions

- School configuration updated
- Audit log entry for administrative action
