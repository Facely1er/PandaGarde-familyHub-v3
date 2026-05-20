# Supplementary Specification

Version: 1.0  
Date: May 2026  
Applies to: FamilyHub v3 and shared PandaGarde platform services

> Decomposes [Authoritative Governance Suite](../pandagarde_authoritative_sdlc_governance_suite_v_1.md) §4–9 and §13. See [AUTHORITATIVE_ALIGNMENT.md](./AUTHORITATIVE_ALIGNMENT.md).

## 1. Scope

This document supplements the SDLC master package with functional requirements, non-functional requirements, UX/mission governance, and interface constraints not captured in individual standards.

## 2. Functional Requirements

### FR-01 Family Management
- Guardians SHALL create and manage a family workspace with one or more child profiles.
- Each child profile SHALL include age band and display name; additional PII is optional.
- No child account SHALL exist without an associated guardian.

### FR-02 Consent and Privacy
- The system SHALL capture guardian consent before storing educational progress or enabling cloud sync.
- Consent state SHALL be visible and revocable from the guardian dashboard.
- Parental consent flows SHALL gate teen and child experiences per regional policy.

### FR-03 Learning and Progress
- Children SHALL access age-appropriate privacy learning modules offline when cached.
- Progress (missions, streaks, milestones) SHALL persist locally in no-backend mode.
- Gamification SHALL use educational milestones only—no gambling-like mechanics.

### FR-04 Digital Footprint Awareness (DFA)
- Guardians and teens SHALL complete a structured DFA journey with scored outcomes.
- Journey steps SHALL be navigable via keyboard and screen reader.
- Scores SHALL be explainable to guardians without exposing child behavioral advertising profiles.

### FR-05 Screen Time and Wellbeing
- The platform SHALL surface screen-time insights to guardians without covert child surveillance.
- Insights SHALL be derived from voluntarily reported or locally aggregated session data.

### FR-06 School and Vendor (Future / Portal)
- School administrators SHALL manage a privacy portal scoped to their tenant.
- Vendor privacy posture SHALL be reviewable with documented data practices.

### FR-07 AI and Moderation
- AI-assisted features SHALL log interactions for safety review without storing unnecessary child dialogue.
- Unsafe content SHALL trigger moderation workflows per [CHILD_SAFETY_STANDARD.md](./CHILD_SAFETY_STANDARD.md).

### FR-08 Export and Reporting
- Guardians SHALL export a family privacy report in a portable format (PDF/JSON).
- Exports SHALL exclude third-party trackers and require active guardian session.

## 3. Non-Functional Requirements

| ID | Category | Requirement |
|----|----------|-------------|
| NFR-01 | Performance | First contentful paint &lt; 3s on 3G for core routes |
| NFR-02 | Availability | 99.5% uptime for production static hosting |
| NFR-03 | Offline | Core learning modules usable without network after initial load |
| NFR-04 | Accessibility | WCAG 2.2 AA per [ACCESSIBILITY_STANDARD.md](./ACCESSIBILITY_STANDARD.md) |
| NFR-05 | Security | TypeScript strict; no secrets in client bundle |
| NFR-06 | Privacy | No behavioral advertising; minimal telemetry |
| NFR-07 | Maintainability | ESLint + Prettier enforced in CI |
| NFR-08 | i18n | UI strings externalizable for future localization |

## 4. UX & Experience Governance (Suite §4–5, §4.3)

All UX and release reviews MUST follow the ordered **[UX Journey Review Framework](./UX_JOURNEY_REVIEW_FRAMEWORK.md)** (Entry → Return). Random screen-by-screen review is prohibited.

### 4.1 Canonical Screen Structure

All major screens MUST follow:

1. Context Header  
2. Primary Guidance Area  
3. Main Interactive Zone  
4. Progress Feedback  
5. Secondary Actions  
6. Parent Guidance Area  
7. Footer Actions  

### 4.2 Layout & Navigation

- Mobile-first, responsive; no horizontal scrolling  
- One canonical navigation hierarchy; predictable back behavior  
- Every route intentional, documented, theme-aware, mobile-tested  
- Dead routes and placeholder production pages prohibited  

### 4.3 Theme & Motion

- Dark and light themes mandatory for all components  
- Hardcoded colors prohibited — use `src/styles/constants.ts` tokens  
- Motion reinforces learning; MUST respect `prefers-reduced-motion`  
- Motion MUST NOT overwhelm or block usability  

## 5. Design Token Governance (Suite §6)

All visual styling MUST derive from canonical theme, spacing, typography, elevation, and motion tokens. Raw visual values in production components are prohibited. Typography MUST prioritize readability for children and parents.

## 6. Mission Architecture (Suite §7)

Activities are **MISSIONS**. Every mission MUST follow this lifecycle:

1. Mission Intro → 2. Objective Explanation → 3. Guided Interaction → 4. Completion Validation → 5. Reward Sequence → 6. Reflection → 7. Suggested Next Mission  

**Required metadata:** unique ID, title, educational objective, category, difficulty, estimated duration, XP reward, age range, completion state, parent discussion prompt.

**Approved categories:** Password Safety, Device Safety, Scam Awareness, Safe Sharing, Tracking Awareness, Privacy Rights, Family Privacy, Social Media Safety (new categories require governance review).

**Difficulty:** Beginner, Intermediate, Advanced — adapting visual complexity, interaction complexity, reading level, and guidance level.

## 7. Family Progression (Suite §8)

Progression motivates learning without addiction mechanics. **XP** must remain understandable, reward learning/consistency, and avoid inflation/exploitability. **Achievements** reinforce educational success and age-appropriate positive behavior; they MUST NOT encourage unhealthy usage or unsafe behavior.

## 8. Parent Experience (Suite §9)

Parents are collaborators, guides, facilitators, and discussion partners — NOT surveillance operators, punitive monitors, or hidden analytics consumers. Parent UX MUST remain simple, actionable, and supportive of real-world privacy discussions.

## 9. Content Governance (Suite §13)

Tone MUST be encouraging, educational, respectful, optimistic, and supportive. Prohibited: fear tactics, guilt messaging, legal intimidation, alarmist cybersecurity language. Content MUST be age-appropriate and jargon-minimized for family comprehension.

## 10. Technology Stack (FamilyHub v3)

- **Runtime:** Node 20.x, Vite 7, React 18, TypeScript 5.9
- **Styling:** Tailwind CSS 3
- **Routing:** React Router 7
- **Testing:** Vitest 4, Testing Library
- **Optional backend:** Supabase (PostgreSQL + RLS)

## 11. Out of Scope (v3.0)

- Behavioral advertising or ad network integrations
- Public social feeds for children
- Unmoderated peer-to-peer messaging
- Real-time location tracking

## 12. Compliance Mapping

| Regulation / Framework | SDLC Reference |
|------------------------|----------------|
| COPPA (US) | FAMILY_DATA_GOVERNANCE, CHILD_SAFETY_STANDARD |
| FERPA (school data) | DATABASE_DESIGN, school tenant RLS |
| WCAG 2.2 AA | ACCESSIBILITY_STANDARD |
| GDPR / state privacy laws | PRIVACY_ENGINEERING_STANDARD, consent flows |

## 13. Acceptance Criteria

A release candidate satisfies this supplementary spec when all **Must Have** use cases in [USE_CASES.md](./USE_CASES.md) pass functional tests and all NFR sign-offs in [QUALITY_ASSURANCE_STANDARD.md](./QUALITY_ASSURANCE_STANDARD.md) are complete.
