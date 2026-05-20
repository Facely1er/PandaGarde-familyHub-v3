# Release Management Standard

> Aligned with [Authoritative Governance Suite](../pandagarde_authoritative_sdlc_governance_suite_v_1.md) §14–15 and [QUALITY_ASSURANCE_STANDARD.md](./QUALITY_ASSURANCE_STANDARD.md).

## Versioning

- Semantic versioning: `MAJOR.MINOR.PATCH`
- MAJOR: breaking API or consent model changes
- MINOR: new features backward compatible
- PATCH: security fixes and bug fixes

## Release Types

| Type | Approval | Testing |
|------|----------|---------|
| Hotfix | Security lead + on-call | Targeted regression + smoke |
| Standard | Product + engineering lead | Full test plan |
| Major | Governance board | Full plan + staged rollout |

## Release Gates

All production releases MUST satisfy [QUALITY_ASSURANCE_STANDARD.md](./QUALITY_ASSURANCE_STANDARD.md):

1. `npm run lint` — no blocking errors
2. `npm run test:run` — all tests pass
3. `npm run build` — clean production build
4. Child safety review for child-facing changes
5. Privacy review for data model or collection changes
6. Accessibility spot-check for UI changes
7. UX Journey Review Framework checklist completed (all 10 journeys in order) for user-facing releases

## Artifacts

Each release SHALL record:

- Git tag and commit SHA
- Changelog entry
- Deployment timestamp and environment
- Rollback procedure validated

## Rollback

- Static SPA: redeploy previous `dist` artifact or Netlify rollback
- Database: apply tested down migration only when approved
- Communicate guardian-facing impact if rollback exceeds 15 minutes downtime

## Prohibited

- Friday production deploys without on-call coverage
- Deploying with known S1/S2 defects
- Skipping child safety review for child-facing features
