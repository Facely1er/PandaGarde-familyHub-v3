# Route Registry

Version: 1.0  
Date: May 2026  
Maintainer: Engineering  
Governance: [ARCHITECTURE.md](./ARCHITECTURE.md) § Route Governance, [Authoritative Suite](../pandagarde_authoritative_sdlc_governance_suite_v_1.md) §11.5

**Source of truth in code:** `src/App.tsx`, `src/pages/family-hub/FamilyHubWrapper.tsx`

Update this registry when adding, removing, or changing routes. Placeholder routes are **prohibited in production** (suite §3.3).

---

## FamilyHub App Shell (`/family-hub/*`)

| Path | Component | Owner | Purpose | Theme | Mobile | Status |
|------|-----------|-------|---------|-------|--------|--------|
| `/family-hub` | → dashboard | FamilyHub | Default redirect | Yes | Yes | Active |
| `/family-hub/dashboard` | `DashboardScreen` | FamilyHub | Guardian dashboard, DFA phase context | Yes | Yes | Active |
| `/family-hub/kids` | `KidsScreen` | FamilyHub | Child profile management | Yes | Yes | Active |
| `/family-hub/activities` | `ActivitiesScreen` | FamilyHub | Activity/mission launcher | Yes | Yes | Active |
| `/family-hub/progress` | `ProgressScreen` | FamilyHub | Achievements, certificates, export | Yes | Yes | Active |
| `/family-hub/settings` | `SettingsScreen` | FamilyHub | Family settings, consent | Yes | Yes | Active |
| `/family-hub/*` (unauth) | `LoginPage` | FamilyHub | Local guardian sign-in | Yes | Yes | Active |

---

## Marketing & Public Site (`src/App.tsx`)

### Core entry & story

| Path | Component | Purpose | Status |
|------|-----------|---------|--------|
| `/` | `HomePage` | Primary entry, DFA CTAs | Active |
| `/story`, `/privacy-panda` | `InteractiveStoryPage` | Privacy Panda narrative | Active |
| `/story-classic` | `StoryPage` | Classic story mode | Active |
| `/activity-book` | `ActivityBookPage` | Activity book experience | Active |
| `/get-started` | `GetStartedPage` | Onboarding entry | Active |
| `/family-hub/*` | `FamilyHubWrapper` | Authenticated hub | Active |

### Digital footprint & assessment

| Path | Component | Purpose | Status |
|------|-----------|---------|--------|
| `/digital-footprint`, `/footprint` | `DigitalFootprintPage` | DFA entry | Active |
| `/privacy-assessment`, `/assessment` | `PrivacyAssessmentPage` | Assessment flow | Active |
| `/quick-assessment` | `QuickAssessmentPage` | Short assessment | Active |
| `/assessment-history`, `/assessment/history` | `AssessmentHistoryPage` | History | Active |
| `/privacy-goals`, `/goals` | `PrivacyGoalsPage` | Goals tracking | Active |

### Learning & tools

| Path | Component | Purpose | Status |
|------|-----------|---------|--------|
| `/privacy-explorers` | `PrivacyExplorersPage` | Explorers program | Active |
| `/privacy-handbook` | `PrivacyHandbookPage` | Handbook | Active |
| `/digital-citizenship` | `DigitalCitizenshipPage` | Citizenship content | Active |
| `/teen-handbook` | `TeenHandbookPage` | Teen content | Active |
| `/privacy-tools` | `PrivacyToolsPage` | Tools index | Active |
| `/digital-rights` | `DigitalRightsPage` | Rights education | Active |

### Parent & educator

| Path | Component | Purpose | Status |
|------|-----------|---------|--------|
| `/parent-toolkit` | `ParentToolkitPage` | Parent resources | Active |
| `/parent-resources` | → `ResourcesPage` | Redirect | Active |
| `/resources` | `ResourcesPage` | Consolidated resources | Active |
| `/educator-tools` | `EducatorToolsPage` | Educator hub | Active |
| `/classroom-activities` | `ClassroomActivitiesPage` | Classroom | Active |
| `/guides/*` | Various guide pages | Parent guides | Active |
| `/family-privacy-plan` | `FamilyPrivacyPlanPage` | Family plan builder | Active |

### Consent & legal

| Path | Component | Purpose | Status |
|------|-----------|---------|--------|
| `/parental-consent` | `ParentalConsentPage` | Consent flow | Active |
| `/parental-consent/pending` | `ParentalConsentPendingPage` | Pending state | Active |
| `/privacy`, `/terms`, `/cookies` | Legal pages | Compliance | Active |
| `/accessibility` | `AccessibilityPage` | A11y statement | Active |

### Community & downloads

| Path | Component | Purpose | Status |
|------|-----------|---------|--------|
| `/community/*` | Community pages | Stories, forum, resources | Active |
| `/downloads/*`, `/coloring-sheets`, etc. | Download pages | Printable assets | Active |

### Safety & alerts

| Path | Component | Purpose | Status |
|------|-----------|---------|--------|
| `/safety-alerts`, `/alerts` | `ChildSafetyAlertsPage` | Safety alerts | Active |

### Informational

| Path | Component | Purpose | Status |
|------|-----------|---------|--------|
| `/about`, `/overview`, `/features`, `/how-it-works` | Info pages | Product info | Active |
| `/contact`, `/faq`, `/support`, `/pilot`, `/newsletter/*` | Support & comms | Active |
| `*` | `NotFoundPage` | 404 | Active |

---

## Activity routes (implemented)

| Path | Component | Purpose | Status |
|------|-----------|---------|--------|
| `/activities` | `ActivitiesPage` | Public mission catalog + launcher | Active |
| `/activities/:activityId` | `ActivitiesPage` | Deep link by slug (e.g. `password-safety`) | Active |
| `/activities/privacy-learning-kit` | `PrivacyLearningKitPage` | Curated learning kit hub | Active |
| `/downloads/worksheets` | `WorksheetsPage` | Printable worksheet index | Active |

**Release gate:** No placeholder routes in production per [RELEASE_MANAGEMENT_STANDARD.md](./RELEASE_MANAGEMENT_STANDARD.md).

---

## Duplicate / alias routes

Documented aliases (intentional SEO/bookmarks):

- `/story` ≡ `/privacy-panda`
- `/digital-footprint` ≡ `/footprint`
- `/privacy-assessment` ≡ `/assessment`
- `/safety-alerts` ≡ `/alerts`

Avoid adding new aliases without updating this registry.
