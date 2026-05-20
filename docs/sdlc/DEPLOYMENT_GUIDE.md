# Deployment Guide

> Aligned with [Authoritative Governance Suite](../pandagarde_authoritative_sdlc_governance_suite_v_1.md) §15.

## Approved Deployment Surfaces (Suite §15.1)

The ecosystem may include: marketing website, FamilyHub app, activity/mission engine, parent dashboard, admin systems, optional backend services. Each surface MUST maintain design consistency and routing clarity.

Production deployments MUST NOT expose unfinished features, test routes, or debugging utilities (§15.2).

## Deployment Standards

- HTTPS mandatory
- Secure environment variables
- Encrypted secrets
- Production logging enabled

## Environments

- Development
- Staging
- Production

## CI/CD Requirements

- Pull request review
- Security scanning
- Dependency audit
- TypeScript validation
- Test execution

## Production Readiness Checklist

- RLS verified
- Child safety review completed
- Accessibility review completed
- Security review completed
- Privacy review completed

## FamilyHub v3 Build and Deploy

### Prerequisites

- Node.js `>=20.19.0 <21`
- npm `>=10`

### Build

```bash
npm ci
npm run lint
npm run test:launch-smoke
npm run build
```

Artifacts are emitted to `dist/` by Vite.

### Hosting Targets

| Target | Notes |
|--------|-------|
| Netlify | `npm run deploy:netlify` (production) |
| Vercel | Static SPA; configure environment variables in dashboard |
| Local preview | `npm run preview` |

### Environment Variables

Store secrets only in the hosting provider dashboard—never commit `.env` files. Required variables depend on backend mode:

| Variable | Required when |
|----------|---------------|
| Supabase URL / anon key | Cloud persistence enabled |
| Newsletter API keys | External newsletter integration |

### Post-Deploy Verification

1. Confirm HTTPS and HSTS headers
2. Run smoke test against `/family-hub` routes
3. Verify no child PII in browser network logs
4. Confirm CSP headers per [SECURE_CODING_STANDARD.md](./SECURE_CODING_STANDARD.md)

See [../diagrams/deployment_v1.mmd](../diagrams/deployment_v1.mmd) for deployment topology.
