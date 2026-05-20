# Change Management Standard

> Aligned with [Authoritative Governance Suite](../pandagarde_authoritative_sdlc_governance_suite_v_1.md) §3 and §16.

## Purpose

Ensures all changes to PandaGarde systems are proposed, reviewed, tested, and traceable.

## Development Philosophy (Suite §3.1)

All development must follow: architecture-first, UX-governed, verification-before-completion, modular enhancement, controlled iteration, compatibility preservation.

## AI-Assisted Development (Suite §16)

AI tools (Cursor, Copilot, etc.) MAY assist implementation. They MUST NOT:

- override architecture  
- invent undocumented systems  
- create hidden dependencies  
- bypass governance standards  
- introduce uncontrolled routes  
- create duplicate state systems  

All AI-assisted prompts SHOULD reference the [authoritative governance suite](../pandagarde_authoritative_sdlc_governance_suite_v_1.md), prohibit rebuilding stable systems, and require build + route verification before completion claims.

## Change Categories

| Category | Examples | Review |
|----------|----------|--------|
| Standard | UI copy, non-child bug fixes | Peer PR review |
| Significant | New guardian flow, schema change | + privacy or safety reviewer |
| Emergency | Active exploit mitigation | Post-merge review within 24h |

## Route Changes

Any new or modified route MUST update [ROUTE_REGISTRY.md](./ROUTE_REGISTRY.md). Placeholder routes are prohibited in production (suite §3.3).

## Change Request Workflow

1. **Proposal** — Issue or PR describing scope, risk, and affected use cases
2. **Impact analysis** — Map to [USE_CASES.md](./USE_CASES.md) and risk register
3. **Implementation** — Feature branch; follow [SECURE_CODING_STANDARD.md](./SECURE_CODING_STANDARD.md)
4. **Verification** — Tests per [TEST_PLAN.md](./TEST_PLAN.md)
5. **Approval** — Required reviewers per category
6. **Deploy** — Per [RELEASE_MANAGEMENT_STANDARD.md](./RELEASE_MANAGEMENT_STANDARD.md)
7. **Document** — Update SDLC docs when behavior or architecture changes

## Traceability

- PR title SHOULD reference use case ID (e.g. `PG-UC-05`) when applicable
- Database migrations MUST link to privacy review ticket when touching child data

## Rollback Criteria

Rollback when:

- S1 or S2 defect detected in production
- Child safety control regression confirmed
- Unauthorized data exposure suspected

## Communication

Significant changes affecting consent or data collection require guardian-visible release notes or in-app notice.
