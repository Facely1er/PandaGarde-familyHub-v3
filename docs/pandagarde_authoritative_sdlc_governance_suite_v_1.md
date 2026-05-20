# PandaGarde / FamilyHub
# Authoritative SDLC & Governance Suite v1.0

Version: 1.0
Status: AUTHORITATIVE
Project: PandaGarde FamilyHub
Organization: ERMITS Ecosystem
Classification: Internal Engineering & Product Governance Standard

## Decomposed SDLC Package

This document is the **single authoritative source**. The modular SDLC package under [`/docs/sdlc/`](./sdlc/README.md) decomposes it for day-to-day engineering. Alignment is tracked in [`/docs/sdlc/AUTHORITATIVE_ALIGNMENT.md`](./sdlc/AUTHORITATIVE_ALIGNMENT.md).

| Authoritative section | Primary SDLC document(s) |
|----------------------|---------------------------|
| §2 Product Vision | [VISION.md](./sdlc/VISION.md) |
| §3 SDLC Governance | [README.md](./sdlc/README.md), [CHANGE_MANAGEMENT_STANDARD.md](./sdlc/CHANGE_MANAGEMENT_STANDARD.md) |
| §4–6 UX / Design Tokens | [SUPPLEMENTARY_SPEC.md](./sdlc/SUPPLEMENTARY_SPEC.md) §4–9, [UX_JOURNEY_REVIEW_FRAMEWORK.md](./sdlc/UX_JOURNEY_REVIEW_FRAMEWORK.md) |
| §7–8 Missions & Progression | [SUPPLEMENTARY_SPEC.md](./sdlc/SUPPLEMENTARY_SPEC.md) §7–8, [USE_CASES/PG-UC-02.md](./sdlc/USE_CASES/PG-UC-02.md) |
| §9 Parent Experience | [SUPPLEMENTARY_SPEC.md](./sdlc/SUPPLEMENTARY_SPEC.md) §9 |
| §10 Child Safety & Privacy | [CHILD_SAFETY_STANDARD.md](./sdlc/CHILD_SAFETY_STANDARD.md), [FAMILY_DATA_GOVERNANCE.md](./sdlc/FAMILY_DATA_GOVERNANCE.md), [PRIVACY_ENGINEERING_STANDARD.md](./sdlc/PRIVACY_ENGINEERING_STANDARD.md) |
| §11 Frontend Architecture | [ARCHITECTURE.md](./sdlc/ARCHITECTURE.md) |
| §12 Accessibility | [ACCESSIBILITY_STANDARD.md](./sdlc/ACCESSIBILITY_STANDARD.md) |
| §13 Content Governance | [SUPPLEMENTARY_SPEC.md](./sdlc/SUPPLEMENTARY_SPEC.md) §10 |
| §4.3 UX Journey Review | [UX_JOURNEY_REVIEW_FRAMEWORK.md](./sdlc/UX_JOURNEY_REVIEW_FRAMEWORK.md), [UX_JOURNEY_BASELINE_REVIEW.md](./sdlc/UX_JOURNEY_BASELINE_REVIEW.md) |
| §3.3 / §11.5 Routes | [ROUTE_REGISTRY.md](./sdlc/ROUTE_REGISTRY.md) |
| §14 QA & Verification | [QUALITY_ASSURANCE_STANDARD.md](./sdlc/QUALITY_ASSURANCE_STANDARD.md), [TEST_PLAN.md](./sdlc/TEST_PLAN.md), [UX_JOURNEY_REVIEW_FRAMEWORK.md](./sdlc/UX_JOURNEY_REVIEW_FRAMEWORK.md) |
| §15 Deployment | [DEPLOYMENT_GUIDE.md](./sdlc/DEPLOYMENT_GUIDE.md) |
| §16 AI-Assisted Development | [CHANGE_MANAGEMENT_STANDARD.md](./sdlc/CHANGE_MANAGEMENT_STANDARD.md), [AI_SAFETY_POLICY.md](./sdlc/AI_SAFETY_POLICY.md) |

If any SDLC document conflicts with this file, **this file prevails**.

---

# 1. PURPOSE

This document establishes the authoritative software development lifecycle (SDLC), UX governance, architectural standards, product rules, and implementation controls for the PandaGarde FamilyHub platform.

This document exists to:

- Prevent uncontrolled architectural drift
- Prevent UX inconsistency
- Prevent AI-assisted code sprawl
- Preserve educational quality
- Maintain child-safe interaction standards
- Ensure long-term maintainability
- Create production-grade engineering discipline
- Standardize implementation patterns
- Protect the PandaGarde product identity
- Establish verification requirements before completion claims

This document supersedes:
- temporary implementation shortcuts
- unverified AI-generated architecture
- inconsistent component implementations
- undocumented route additions
- isolated feature experimentation

All implementation work must conform to this standard.

---

# 2. PRODUCT VISION

PandaGarde FamilyHub is NOT:

- a collection of mini-games
- a generic educational portal
- a static learning dashboard
- a worksheet repository
- a basic React activity application

PandaGarde FamilyHub IS:

- a family privacy learning ecosystem
- a mission-based educational platform
- a child-centered digital safety experience
- a gamified privacy education environment
- a structured family engagement platform
- a long-term behavioral reinforcement system

Core differentiation:

"Making digital privacy emotionally understandable for families."

The platform must prioritize:

- trust
- safety
- warmth
- emotional engagement
- guided learning
- family collaboration
- retention through positive reinforcement

The product must never become:

- fear-driven
- surveillance-oriented
- corporate/legalistic
- visually overwhelming
- cognitively chaotic

---

# 3. SDLC GOVERNANCE MODEL

## 3.1 Development Philosophy

All PandaGarde development must follow:

- architecture-first implementation
- UX-governed implementation
- verification-before-completion
- modular enhancement
- controlled iteration
- compatibility preservation

The project SHALL NOT:

- rebuild working systems unnecessarily
- replace stable structures without justification
- introduce duplicate component systems
- create parallel route hierarchies
- create competing design systems
- create isolated feature islands

---

## 3.2 Implementation Order

All work must follow this order:

1. Governance Definition
2. UX Definition
3. Architecture Definition
4. Route Planning
5. Data Model Definition
6. Shared Component Definition
7. Feature Implementation
8. QA Verification
9. Deployment Validation
10. Production Approval

No implementation may bypass governance.

---

## 3.3 Anti-Drift Rule

The following are prohibited:

- undocumented routes
- undocumented storage schemas
- duplicated layouts
- duplicate progress systems
- duplicate reward systems
- arbitrary gamification
- inconsistent activity structures
- isolated design patterns
- unverified completion claims
- placeholder pages in production
- dead navigation links
- temporary components shipped permanently
- arbitrary color additions
- random animation styles

---

# 4. PRODUCT EXPERIENCE GOVERNANCE

## 4.1 Experience Model

The FamilyHub experience must follow:

"Mission-Based Family Privacy Journey"

The experience hierarchy:

1. Welcome
2. Guidance
3. Mission Introduction
4. Interactive Learning
5. Positive Reinforcement
6. Reflection
7. Family Engagement
8. Progression
9. Return Motivation

The UX must always feel:

- safe
- encouraging
- emotionally positive
- structured
- immersive
- calm
- trustworthy
- playful but professional

---

## 4.2 Emotional Design Rules

The platform SHALL:

- celebrate progress positively
- avoid punishment mechanics
- avoid anxiety-driven UX
- reinforce learning gently
- encourage parent-child collaboration
- maintain visual warmth
- use supportive messaging

The platform SHALL NOT:

- shame users
- create fear-based interactions
- use aggressive alerts
- create dark patterns
- manipulate children psychologically

---

## 4.3 UX Journey Review Framework (Mandatory)

UX and release reviews MUST NOT be performed randomly.

All manual UX validation SHALL follow the **ordered 10-journey framework** defined in:

**[UX_JOURNEY_REVIEW_FRAMEWORK.md](./sdlc/UX_JOURNEY_REVIEW_FRAMEWORK.md)**

Review order (mandatory):

1. Entry Journey — first emotional impression  
2. Orientation Journey — cognitive friction  
3. Mission Journey — one complete activity flow  
4. Progression Journey — motivation without manipulation  
5. Parent Journey — collaboration, not surveillance  
6. Emotional UX Journey — trust, encouragement, memorability  
7. Visual Rhythm Review — calm, breathing UI  
8. Mobile Journey Review — tablet-first interaction  
9. Accessibility Journey — inclusive, predictable UX  
10. Return Journey — reason to come back tomorrow  

Strategic requirement: prioritize **emotional continuity between activities** over adding more isolated activities. Features without journey cohesion violate product intent (§2).

---

# 5. UX/UI GOVERNANCE STANDARD

## 5.1 Canonical UX Structure

All major screens must follow:

1. Context Header
2. Primary Guidance Area
3. Main Interactive Zone
4. Progress Feedback
5. Secondary Actions
6. Parent Guidance Area
7. Footer Actions

---

## 5.2 Layout Rules

Required:

- responsive layouts
- mobile-first implementation
- no horizontal scrolling
- consistent spacing rhythm
- consistent content widths
- predictable interaction zones

Forbidden:

- overflow-based layout hacks
- arbitrary spacing
- inconsistent card sizing
- mixed navigation systems
- uncontrolled z-index usage

---

## 5.3 Navigation Standards

The platform must maintain:

- one canonical navigation hierarchy
- predictable back behavior
- route consistency
- persistent orientation

Every route must:

- exist intentionally
- have a defined owner
- have a documented purpose
- support both themes
- support mobile layouts

Dead routes are prohibited.

---

## 5.4 Theme Governance

Both dark and light themes are mandatory.

Every component must:

- support both themes
- preserve readability
- maintain contrast standards
- avoid visual degradation

Hardcoded colors are prohibited.

---

## 5.5 Motion Governance

Motion must:

- reinforce learning
- improve orientation
- reward achievement
- improve delight

Motion must NOT:

- overwhelm users
- reduce accessibility
- create cognitive overload
- block usability

All motion must support reduced-motion preferences.

---

# 6. DESIGN TOKEN GOVERNANCE

## 6.1 Token Authority

All visual styling must derive from:

- canonical theme tokens
- spacing tokens
- typography tokens
- elevation tokens
- motion tokens

Raw visual values are prohibited in production components.

---

## 6.2 Typography Rules

Typography must:

- prioritize readability
- support children and parents
- preserve visual hierarchy
- support accessibility

Typography must avoid:

- excessive decorative fonts
- inconsistent heading scales
- unreadable text sizes

---

# 7. ACTIVITY ARCHITECTURE STANDARD

## 7.1 Activity Philosophy

Activities are officially defined as:

"MISSIONS"

Every mission must:

- teach a privacy concept
- reinforce safe behavior
- provide positive feedback
- contribute to progression
- support family engagement

---

## 7.2 Mission Lifecycle

Every mission must follow:

1. Mission Intro
2. Objective Explanation
3. Guided Interaction
4. Completion Validation
5. Reward Sequence
6. Reflection
7. Suggested Next Mission

No mission may bypass this lifecycle.

---

## 7.3 Mission Metadata Standard

All missions must include:

- unique ID
- mission title
- educational objective
- category
- difficulty
- estimated duration
- XP reward
- age range
- completion state
- parent discussion prompt

---

## 7.4 Mission Categories

Approved categories:

- Password Safety
- Device Safety
- Scam Awareness
- Safe Sharing
- Tracking Awareness
- Privacy Rights
- Family Privacy
- Social Media Safety

New categories require governance review.

---

## 7.5 Mission Difficulty Rules

Difficulty levels:

- Beginner
- Intermediate
- Advanced

Difficulty must adapt:

- visual complexity
- interaction complexity
- reading level
- guidance level

---

# 8. FAMILY PROGRESSION GOVERNANCE

## 8.1 Progression Philosophy

Progression exists to:

- motivate learning
- reinforce consistency
- reward engagement
- create return behavior

Progression must NOT:

- manipulate children excessively
- create addiction mechanics
- create aggressive scarcity loops

---

## 8.2 XP Rules

XP must:

- remain understandable
- reward learning
- reward consistency
- avoid exploitability

XP inflation is prohibited.

---

## 8.3 Achievement Rules

Achievements must:

- reinforce educational success
- reward positive behavior
- remain age-appropriate

Achievements must NOT:

- encourage unhealthy usage
- reward unsafe behavior
- pressure children excessively

---

# 9. PARENT EXPERIENCE GOVERNANCE

## 9.1 Parent Role

Parents are:

- collaborators
- guides
- facilitators
- discussion partners

Parents are NOT:

- surveillance operators
- punitive monitors
- hidden analytics consumers

---

## 9.2 Parent UX Rules

Parent experiences must:

- remain simple
- remain actionable
- avoid overload
- support family discussions
- reinforce real-world privacy behavior

---

# 10. CHILD SAFETY & PRIVACY GOVERNANCE

## 10.1 Child Safety Principles

The platform must:

- minimize data collection
- prioritize local-first behavior
- avoid unnecessary tracking
- avoid manipulative engagement systems
- support parental awareness

---

## 10.2 Data Governance

Default model:

- local-first
- offline-capable
- minimal telemetry
- privacy-preserving analytics

No unnecessary child profiling is permitted.

---

## 10.3 AI Usage Restrictions

AI systems must NOT:

- manipulate children emotionally
- create unsafe recommendations
- simulate authority figures deceptively
- collect hidden behavioral data

---

# 11. FRONTEND ARCHITECTURE STANDARD

## 11.1 Architectural Principles

The frontend must:

- remain modular
- remain maintainable
- avoid duplication
- preserve scalability
- isolate responsibilities clearly

---

## 11.2 Component Hierarchy

Hierarchy:

1. App Shell
2. Layout System
3. Shared UI Components
4. Feature Components
5. Mission Components
6. Utility Components

Shared components are authoritative.

Feature duplication is prohibited.

---

## 11.3 State Management Rules

State ownership must be explicit.

Local component state:
- UI interactions only

Shared app state:
- profile
- progress
- achievements
- theme
- onboarding

Duplicate progress state systems are prohibited.

---

## 11.4 Storage Rules

Approved storage:

- localStorage
- optional backend synchronization

All storage schemas must:

- support backward compatibility
- fail safely
- tolerate missing values

---

## 11.5 Route Governance

Routes must:

- be intentional
- be documented
- support mobile
- support both themes
- support accessibility

Placeholder routes are prohibited.

---

# 12. ACCESSIBILITY STANDARD

## 12.1 Accessibility Requirements

Minimum targets:

- keyboard accessibility
- screen reader compatibility
- reduced motion support
- touch target compliance
- readable contrast ratios

---

## 12.2 Inclusive UX

The platform should support:

- dyslexia-friendly reading
- simplified interactions
- age-adaptive guidance
- calm visual patterns

---

# 13. CONTENT GOVERNANCE STANDARD

## 13.1 Educational Tone

The platform tone must remain:

- encouraging
- educational
- respectful
- optimistic
- supportive

The platform must avoid:

- fear tactics
- guilt messaging
- legal intimidation
- alarmist cybersecurity language

---

## 13.2 Language Standards

Content must:

- remain age appropriate
- remain understandable
- avoid unnecessary jargon
- support family comprehension

---

# 14. QA & VERIFICATION GOVERNANCE

## 14.1 Verification Philosophy

No feature may be declared complete without:

- build verification
- route verification
- visual verification
- interaction verification
- mobile verification
- theme verification

---

## 14.2 Required Validation

Mandatory validation:

```bash
npm install
npm run build
npm run dev
```

Manual verification required:

- navigation
- mission flows
- completion flows
- theme switching
- mobile layouts
- no console errors
- no broken routes
- no dead CTAs
- no horizontal scrolling

---

## 14.3 Completion Claims

Completion claims are prohibited unless:

- verification was executed
- routes were manually tested
- UI was visually reviewed
- errors were documented honestly

Unverified completion claims violate governance.

---

# 15. DEPLOYMENT SURFACE GOVERNANCE

## 15.1 Approved Deployment Surfaces

The ecosystem may include:

- marketing website
- FamilyHub app
- activity engine
- parent dashboard
- admin systems
- optional backend services

Each surface must:

- maintain design consistency
- preserve routing clarity
- avoid UX fragmentation

---

## 15.2 Environment Separation

Development, staging, and production must remain isolated.

Production deployments must not:

- expose unfinished features
- expose test routes
- expose debugging utilities

---

# 16. AI-ASSISTED DEVELOPMENT GOVERNANCE

## 16.1 AI Usage Rules

AI tools may assist implementation.

AI tools may NOT:

- override architecture
- invent undocumented systems
- create hidden dependencies
- bypass governance standards
- introduce uncontrolled routes
- create duplicate state systems

---

## 16.2 Cursor / Copilot Governance

All AI-assisted implementation prompts must:

- reference authoritative standards
- prohibit rebuilding stable systems
- require build verification
- require route verification
- preserve architectural consistency

---

# 17. AUTHORITATIVE IMPLEMENTATION PRINCIPLES

The PandaGarde FamilyHub platform shall prioritize:

- coherence over feature quantity
- trust over growth hacking
- educational value over engagement manipulation
- maintainability over rapid expansion
- accessibility over visual excess
- emotional safety over fear-based cybersecurity messaging

This platform is intended to become:

A trusted family digital safety ecosystem.

Not a generic educational application.

---

# 18. FINAL AUTHORITATIVE RULE

If any implementation decision conflicts with:

- UX consistency
- child safety
- maintainability
- accessibility
- emotional trust
- architectural clarity

Then the implementation must be rejected or redesigned.

No feature is more important than platform coherence.

---

END OF AUTHORITATIVE DOCUMENT

