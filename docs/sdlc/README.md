# PandaGarde / FamilyHub SDLC Master Package

**Marketing & UI copy accuracy:** [../CONTENT_TRUTH.md](../CONTENT_TRUTH.md)

Version: 1.0
Date: May 2026

This package defines the Software Development Lifecycle (SDLC),
governance standards, privacy engineering requirements,
child safety controls, architecture principles,
and operational requirements for PandaGarde and FamilyHub.

PandaGarde is an independent family privacy
and digital wellbeing organization.

The **authoritative source of truth** is the governance suite:

**[pandagarde_authoritative_sdlc_governance_suite_v_1.md](../pandagarde_authoritative_sdlc_governance_suite_v_1.md)** (v1.0, STATUS: AUTHORITATIVE)

This `/docs/sdlc/` package decomposes that suite into modular standards for engineering, QA, and compliance. See [AUTHORITATIVE_ALIGNMENT.md](./AUTHORITATIVE_ALIGNMENT.md) for traceability and verification status.

**Organization:** ERMITS Ecosystem · **Project:** PandaGarde FamilyHub

Core principles:
- Child Safety by Design
- Privacy by Default
- Family-Centered UX
- Zero Advertising to Children
- Educational Integrity
- Ethical AI Usage
- Transparency and Trust
- Minimal Data Collection
- Age-Appropriate Experiences

Primary platform domains:
- FamilyHub
- PandaGarde Kids
- Privacy Panda Learning
- School Privacy Portal
- Digital Footprint Awareness
- Parent Guidance Dashboard

## Implementation Order

All work must follow the governance suite §3.2 order:

1. Governance Definition → 2. UX Definition → 3. Architecture Definition → 4. Route Planning → 5. Data Model Definition → 6. Shared Component Definition → 7. Feature Implementation → 8. QA Verification → 9. Deployment Validation → 10. Production Approval

No implementation may bypass governance. Verification-before-completion is mandatory (suite §14). UX reviews MUST follow the [UX Journey Review Framework](./UX_JOURNEY_REVIEW_FRAMEWORK.md) in order — never randomly (suite §4.3).

## Document Index

| Document | Purpose |
|----------|---------|
| [AUTHORITATIVE_ALIGNMENT.md](./AUTHORITATIVE_ALIGNMENT.md) | Governance suite ↔ SDLC traceability |
| [VISION.md](./VISION.md) | Mission, product identity, emotional design |
| [UX_JOURNEY_REVIEW_FRAMEWORK.md](./UX_JOURNEY_REVIEW_FRAMEWORK.md) | **Mandatory** ordered UX review (10 journeys) |
| [UX_JOURNEY_BASELINE_REVIEW.md](./UX_JOURNEY_BASELINE_REVIEW.md) | Baseline audit & remediation backlog (v3) |
| [ROUTE_REGISTRY.md](./ROUTE_REGISTRY.md) | Documented routes — update with every route change |
| [USE_CASES.md](./USE_CASES.md) | Use case catalog and traceability |
| [SUPPLEMENTARY_SPEC.md](./SUPPLEMENTARY_SPEC.md) | Functional and non-functional requirements |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture principles (see ROUTE_REGISTRY) |
| [DOMAIN_MODEL.md](./DOMAIN_MODEL.md) | Core domain entities |
| [DATABASE_DESIGN.md](./DATABASE_DESIGN.md) | Data store schema and RLS |
| [PERSISTENCE_DESIGN.md](./PERSISTENCE_DESIGN.md) | Client and cloud persistence strategy |
| [TEST_PLAN.md](./TEST_PLAN.md) | Verification and validation approach |
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | Environments and release operations |

## Governance Standards

| Standard | Focus |
|----------|-------|
| [CHILD_SAFETY_STANDARD.md](./CHILD_SAFETY_STANDARD.md) | Child protection controls |
| [AI_SAFETY_POLICY.md](./AI_SAFETY_POLICY.md) | Ethical AI usage |
| [FAMILY_DATA_GOVERNANCE.md](./FAMILY_DATA_GOVERNANCE.md) | Family data stewardship |
| [ACCESSIBILITY_STANDARD.md](./ACCESSIBILITY_STANDARD.md) | WCAG 2.2 AA compliance |
| [INCIDENT_RESPONSE_STANDARD.md](./INCIDENT_RESPONSE_STANDARD.md) | Security and safety incidents |
| [RISK_MANAGEMENT_STANDARD.md](./RISK_MANAGEMENT_STANDARD.md) | Risk identification and mitigation |
| [PRIVACY_ENGINEERING_STANDARD.md](./PRIVACY_ENGINEERING_STANDARD.md) | Privacy-by-design engineering |
| [SECURE_CODING_STANDARD.md](./SECURE_CODING_STANDARD.md) | Secure development practices |
| [RELEASE_MANAGEMENT_STANDARD.md](./RELEASE_MANAGEMENT_STANDARD.md) | Release gates and versioning |
| [CHANGE_MANAGEMENT_STANDARD.md](./CHANGE_MANAGEMENT_STANDARD.md) | Controlled change process |
| [QUALITY_ASSURANCE_STANDARD.md](./QUALITY_ASSURANCE_STANDARD.md) | QA gates and production readiness |
| [API_STANDARD.md](./API_STANDARD.md) | API design and security |
| [LOGGING_MONITORING_STANDARD.md](./LOGGING_MONITORING_STANDARD.md) | Observability without PII leakage |
| [BUSINESS_CONTINUITY_STANDARD.md](./BUSINESS_CONTINUITY_STANDARD.md) | Availability and recovery |

## Authoritative Implementation Principles (Suite §17)

Prioritize: coherence over feature quantity; trust over growth hacking; educational value over engagement manipulation; maintainability over rapid expansion; accessibility over visual excess; emotional safety over fear-based cybersecurity messaging.

If implementation conflicts with UX consistency, child safety, maintainability, accessibility, emotional trust, or architectural clarity — **reject or redesign** (§18).

## Diagrams

See [/docs/diagrams](../diagrams/) for architecture, domain, deployment, and data-flow diagrams.
