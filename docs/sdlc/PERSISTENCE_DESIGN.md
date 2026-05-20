# Persistence Design

> Implements [Authoritative Governance Suite](../pandagarde_authoritative_sdlc_governance_suite_v_1.md) §10.2 and §11.4 (local-first, backward-compatible schemas).

## Purpose

This document defines how PandaGarde platforms persist data across client devices, optional cloud backends, and export flows while honoring privacy-by-default and offline-first principles.

## Persistence Tiers

### Tier 1 — Browser Local (Primary for FamilyHub v3)

FamilyHub v3 operates in **local-first / no-backend mode** by default:

| Store | Key prefix / identifier | Contents |
|-------|-------------------------|----------|
| Auth state | `pandagarde_local_auth_v1` | Guardian session flag |
| Profile | `pandagarde_local_profile_v1` | Guardian profile metadata |
| Family data | `LocalStorageManager.FAMILY_KEY` | Encrypted family and member records |
| Secure storage | `fh_*` | TTL-wrapped JSON blobs via `familyHubSecurity.secureStorage` |
| Progress | Progress context keys | Learning missions, streaks, milestones |
| User ID | `pandagarde_current_user_id` | Pseudonymous local user identifier |

**Encryption:** PII fields are encrypted client-side when Web Crypto is available (`localStorageManager.ts`). Unencrypted fallback is logged and must not be used in production child profiles.

**Expiration:** Secure storage entries expire after 30 days unless refreshed.

### Tier 2 — Optional Cloud (Supabase / PostgreSQL)

When configured, cloud persistence provides:

- Newsletter subscriptions
- Multi-device family sync (future)
- School tenant data
- Moderation and audit logs

The `supabase.ts` adapter gates all cloud access. In no-backend mode, mutations return a controlled error and the UI degrades to local-only behavior.

### Tier 3 — Export Artifacts

Privacy reports and family summaries may be generated as PDF or JSON downloads. Exports:

- Require guardian authentication
- Must not include third-party tracking pixels
- Are generated on-demand and not retained server-side unless explicitly consented

## Sync Strategy

| Mode | Behavior |
|------|----------|
| Offline | All core learning and dashboard features use Tier 1 |
| Online (no backend) | RSS alerts and static content only; no family cloud sync |
| Online (backend enabled) | Write-through for consented entities; conflict resolution favors guardian manual merge |

## Data Minimization

- Do not persist child email unless required for school linkage
- Avoid caching full AI conversation transcripts locally
- Purge inactive secure-storage keys on sign-out

## Deletion

Guardian-initiated family deletion must:

1. Clear all `fh_*` and `pandagarde_*` localStorage keys
2. Revoke cloud tokens if backend enabled
3. Request server-side erasure per [FAMILY_DATA_GOVERNANCE.md](./FAMILY_DATA_GOVERNANCE.md)

See [../diagrams/familyhub_dataflow_v1.mmd](../diagrams/familyhub_dataflow_v1.mmd) for data-flow visualization.
