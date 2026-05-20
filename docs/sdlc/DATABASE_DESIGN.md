# Database Design Standard

## Primary Principles

- Family isolation
- School tenant isolation
- Child data minimization
- Pseudonymized analytics

## Core Tables

- families
- guardians
- child_profiles
- schools
- consent_records
- learning_activities
- privacy_milestones
- moderation_events
- ai_interactions
- screen_time_sessions

## Security Controls

- Row-Level Security mandatory
- UUID identifiers
- Encrypted secrets
- Audit logging

## Data Retention

- Automatic archival
- Expiration policies
- Child-safe deletion workflows

## Schema Conventions

| Convention | Requirement |
|------------|-------------|
| Primary keys | `uuid` generated server-side |
| Timestamps | `created_at`, `updated_at` on all mutable tables |
| Soft delete | `deleted_at` for recoverable guardian data only |
| Tenant key | `family_id` on all family-scoped rows |
| School scope | `school_id` on all school-scoped rows |

## Row-Level Security Policies

All production tables enforcing family or school scope must define RLS policies such that:

- Guardians may read/write only rows belonging to their `family_id`
- School administrators may read/write only rows belonging to their `school_id`
- Child sessions may read only their own `child_profile_id` rows
- Service roles are restricted to explicit operational functions

## Indexing

- Index `family_id`, `school_id`, `child_profile_id` on high-volume tables
- Partial indexes on active (`deleted_at IS NULL`) rows
- No full-text indexes on child PII fields

## Migration Policy

- All schema changes require reviewed migration scripts
- Migrations must be reversible where feasible
- Child data column additions require privacy review
