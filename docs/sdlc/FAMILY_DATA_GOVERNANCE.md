# Family Data Governance Standard

> Aligned with [Authoritative Governance Suite](../pandagarde_authoritative_sdlc_governance_suite_v_1.md) §10.2. Default model: local-first, offline-capable, minimal telemetry, privacy-preserving analytics.

## Principles

PandaGarde adopts:
- privacy by default
- minimal data collection
- explicit consent
- family transparency
- purpose limitation

## Data Classification

### Restricted
- child identity data
- educational records
- behavioral analytics
- location information

### Confidential
- guardian contact information
- school operational data

### Internal
- anonymized telemetry
- operational metrics

## Data Retention

- Child data minimized aggressively
- Inactive family data purged automatically
- Audit logs pseudonymized
- No indefinite retention

## Consent Requirements

Guardian consent required for:
- account creation
- educational tracking
- cloud synchronization
- school integrations

## Third-Party Restrictions

No third-party SDK may:
- track children behaviorally
- sell data
- fingerprint devices
- build advertising profiles
