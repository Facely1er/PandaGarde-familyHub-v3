# Business Continuity Standard

## Objectives

- maintain educational availability
- preserve family trust
- protect child safety systems

## Requirements

- backup validation
- recovery procedures
- incident communication plan
- operational failover strategy

## Recovery Targets

| Tier | RTO | RPO | Scope |
|------|-----|-----|-------|
| Tier 1 — Static SPA | 4 hours | N/A (immutable deploy) | FamilyHub public site |
| Tier 2 — API / DB | 8 hours | 1 hour | Cloud family sync, school portal |
| Tier 3 — Moderation | 1 hour | 15 min | Child safety pipelines |

## Communication

- Guardian-facing status page for prolonged outages
- No disclosure of child incident details in public communications
- Regulatory notification per legal counsel guidance when required
