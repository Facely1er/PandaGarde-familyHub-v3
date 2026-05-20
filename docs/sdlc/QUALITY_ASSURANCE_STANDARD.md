# Quality Assurance Standard

> Aligned with [Authoritative Governance Suite](../pandagarde_authoritative_sdlc_governance_suite_v_1.md) §14. See [TEST_PLAN.md](./TEST_PLAN.md) and [AUTHORITATIVE_ALIGNMENT.md](./AUTHORITATIVE_ALIGNMENT.md).

## Verification Philosophy (Suite §14.1)

No feature may be declared complete without:

- build verification  
- route verification  
- visual verification  
- interaction verification  
- mobile verification  
- theme verification  

**Unverified completion claims violate governance.**

## Mandatory Automated Validation (Suite §14.2)

```bash
npm install
npm run build
npm run dev
```

CI releases additionally require:

```bash
npm run lint
npm run test:run
```

## Mandatory Manual Validation (Suite §14.2)

- navigation flows  
- mission flows and completion  
- theme switching (dark + light)  
- mobile layouts  
- no console errors  
- no broken routes or dead CTAs  
- no horizontal scrolling  

## Mandatory UX Journey Review (Suite §4.3)

Before UX or release sign-off on user-facing changes, complete all **10 journeys in order** per [UX_JOURNEY_REVIEW_FRAMEWORK.md](./UX_JOURNEY_REVIEW_FRAMEWORK.md). Attach the filled [Release Review Checklist](./UX_JOURNEY_REVIEW_FRAMEWORK.md#release-review-checklist).

**Do not** review screens in random order. **Blockers:** Fail on journeys 1, 3, 5, 8, or 10 (child-facing); Fail on 4 or 6 if manipulative or anxiety-driven patterns are present.

## Release Gates

- tests passing
- accessibility verified
- privacy review completed
- child safety review completed
- performance verified
- mobile QA completed

## Production Requirements

- no broken routes
- no console errors
- responsive layouts
- verified offline behavior

## Defect Severity

| Severity | Definition | Release blocker |
|----------|------------|-----------------|
| S1 | Child safety or data breach risk | Yes |
| S2 | Guardian cannot complete core flow | Yes |
| S3 | Degraded UX, workaround exists | No |
| S4 | Cosmetic | No |

## Evidence

Each release SHALL attach:

- `npm run test:run` output
- Build artifact hash
- Completed checklist from [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
