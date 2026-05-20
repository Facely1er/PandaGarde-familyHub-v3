# PG-UC-10 — Parent Exports Family Privacy Report

## Actors
- Guardian

## Preconditions
- Guardian authenticated
- Family data and consent records available

## Main Success Scenario

1. Guardian requests privacy report from dashboard
2. System confirms guardian identity (active session)
3. System aggregates family consent state, milestones, DFA summary, and data inventory
4. System generates PDF or JSON export client-side
5. Guardian downloads file
6. System logs export event without embedding PII in operational logs

## Alternative Flows

- Guardian selects date range or specific child profiles
- Guardian cancels before download — no file retained server-side

## Exception Flows

- Export generation failure — retry with error message, no partial leak of other families' data
- Revoked consent categories — report marks sections as unavailable

## Business Rules

- Export requires guardian session; children cannot export family-wide data
- No third-party analytics on export flow
- Exported files must not contain embedded trackers
- Report must list data categories held and retention policies

## Postconditions

- Guardian possesses portable report
- Pseudonymized audit entry: export occurred

## Implementation Reference

- PDF generation: `jspdf`, `html2canvas` (client-side only)
