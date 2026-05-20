# PandaGarde Architecture Standard

> Aligned with [Authoritative Governance Suite](../pandagarde_authoritative_sdlc_governance_suite_v_1.md) §11. See [AUTHORITATIVE_ALIGNMENT.md](./AUTHORITATIVE_ALIGNMENT.md).

## Core Architecture Principles

- Privacy-first
- Offline-capable
- Zero-advertising
- Minimal telemetry
- Family-safe by design
- Modular deployment

## Architecture Layers

### Presentation Layer
- Parent dashboard
- Child-safe learning UI
- School portal

### Application Layer
- Learning engine
- Family orchestration
- Privacy analysis
- Guidance services

### Data Layer
- Family-scoped isolation
- School tenant isolation
- Local-first storage

## Hosting Principles

- HTTPS only
- Secure cloud hosting
- Encrypted transport
- Encrypted storage

## Authentication

- Guardian-controlled accounts
- School administrator RBAC
- Child-limited permissions

## Offline Support

Core educational experiences must:
- function offline
- degrade gracefully
- avoid mandatory cloud dependency

## Frontend Component Hierarchy (Suite §11.2)

1. App Shell  
2. Layout System  
3. Shared UI Components  
4. Feature Components  
5. Mission Components  
6. Utility Components  

Shared components are authoritative. Feature duplication is prohibited.

## State Management (Suite §11.3)

| State type | Owner | Scope |
|------------|-------|-------|
| Local component state | Component | UI interactions only |
| Shared app state | Context providers | profile, progress, achievements, theme, onboarding |

Duplicate progress or reward systems are prohibited. Authoritative contexts: `FamilyContext`, `ProgressContext`, `AuthWrapper`.

## Storage Rules (Suite §11.4)

Approved: `localStorage`, optional backend sync. Schemas MUST support backward compatibility, fail safely, and tolerate missing values. See [PERSISTENCE_DESIGN.md](./PERSISTENCE_DESIGN.md).

## Route Governance (Suite §11.5)

Routes MUST be intentional, documented, mobile-ready, dual-theme, and accessible. Placeholder routes in production are prohibited.

**Route inventory:** maintain [ROUTE_REGISTRY.md](./ROUTE_REGISTRY.md) when adding or changing routes in `src/App.tsx` or `FamilyHubWrapper.tsx`.

## Anti-Drift Rules (Suite §3.3)

Prohibited: undocumented routes/storage schemas, duplicated layouts, duplicate progress/reward systems, arbitrary gamification, inconsistent activity structures, unverified completion claims, dead navigation links, temporary components shipped permanently, arbitrary colors, random animation styles.

The project SHALL NOT: rebuild working systems unnecessarily, introduce duplicate component systems, create parallel route hierarchies, or create isolated feature islands.

## FamilyHub v3 Implementation Notes

FamilyHub v3 is implemented as a React 18 + TypeScript single-page application built with Vite. Key modules:

| Module | Responsibility |
|--------|----------------|
| `src/pages/family-hub/` | Guardian authentication shell and hub routing |
| `src/contexts/FamilyContext.tsx` | Family and member state orchestration |
| `src/utils/localStorageManager.ts` | Encrypted local persistence for family PII |
| `src/lib/familyHubSecurity.ts` | Client-side security helpers and secure storage |
| `src/lib/dfaJourney.ts` | Digital Footprint Awareness journey logic |
| `src/lib/supabase.ts` | Optional backend adapter (disabled in no-backend mode) |

See [../diagrams/architecture_v1.mmd](../diagrams/architecture_v1.mmd) for the reference architecture diagram.
