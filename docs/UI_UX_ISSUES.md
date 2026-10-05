# UI/UX Issue Tracker — Action Items

**Generated:** October 5, 2026  
**Parent Document:** [UI_UX_AUDIT.md](./UI_UX_AUDIT.md)  
**Purpose:** Granular tracking of UI/UX issues for GitHub issues or project management

---

## 🔴 Critical Issues (Production Blockers)

### C1: Form Inputs Without Labels (A11y WCAG Level A Violation)

**Severity:** 🔴 Critical  
**Category:** Accessibility  
**Files Affected:** 15+  
**Estimated Effort:** 4-6 hours  

**Issue:** Form inputs lack accessible labels, preventing screen reader users from understanding input purpose.

**Files to Fix:**

1. `src/tools/DigitalFootprintTimeline.tsx:259`
2. `src/familyhub/components/MissionScenarioCustomize.tsx:105,126,142,178`
3. `src/familyhub/screens/SettingsScreen.tsx:170`
4. `src/familyhub/screens/KidsScreen.tsx:391,411,516,535`
5. `src/pages/ParentToolkitPage.tsx:83`
6. `src/pages/FamilyHubPage.tsx:1110,1176,1191,1207`
7. `src/familyhub/components/MissionScenarioCustomize.tsx:161` (textarea)
8. `src/pages/ProfilePage.tsx:291` (textarea)
9. `src/components/parent/FamilyPrivacyPlanBuilder.tsx:307` (textarea)
10. `src/components/FamilyDashboard.tsx:1137` (textarea)
11. `src/components/forms/ContactForm.tsx:397` (textarea)
12. `src/components/FeedbackForm.tsx:190` (textarea)
13. `src/components/community/SuccessStories.tsx:455` (textarea)
14. `src/components/community/PrivacyTipsForum.tsx:641,940` (textarea)
15. `src/components/community/ResourceSharing.tsx:531` (textarea)

**Fix Pattern:**

```tsx
// Option 1: Visible label
<label htmlFor="unique-id" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
  Label Text
</label>
<input id="unique-id" type="text" className="..." />

// Option 2: aria-label (when visible label is not desired)
<input type="text" aria-label="Descriptive label" className="..." />
```

**Acceptance Criteria:**
- [ ] All inputs have `<label htmlFor>` or `aria-label`
- [ ] All textareas have `<label htmlFor>` or `aria-label`
- [ ] Screen reader announces input purpose
- [ ] `npm run lint` passes (if a11y rules are enabled)

---

### C2: Critical npm Security Vulnerability (jspdf)

**Severity:** 🔴 Critical  
**Category:** Security  
**Package:** `jspdf <=4.2.0`  
**CVE:** [Check npm audit output]  
**Estimated Effort:** 2 hours  

**Issue:** Critical vulnerability in PDF export library.

**Fix:**
```bash
npm audit fix --force
# OR
npm install jspdf@latest
```

**Testing Required:**
1. Test certificate generation (`src/components/CertificateGenerator.tsx`)
2. Test PDF export in Family Hub
3. Verify no regressions in PDF layout/rendering

**Acceptance Criteria:**
- [ ] `npm audit` shows 0 critical vulnerabilities
- [ ] Certificate generation works in dev
- [ ] Certificate generation works in production build
- [ ] PDF exports correctly on Chrome, Firefox, Safari

---

### C3: Pages Missing Dark Mode Support

**Severity:** 🔴 Critical  
**Category:** Design System / Theming  
**Files Affected:** 10 pages  
**Estimated Effort:** 6-8 hours  

**Issue:** Pages without `dark:` classes render unreadable in dark mode.

**Pages to Fix:**

1. `src/pages/AgeGroupsPage.tsx`
2. `src/pages/CertificatePage.tsx`
3. `src/pages/FeaturesPage.tsx`
4. `src/pages/ImplementationPage.tsx`
5. `src/pages/OverviewPage.tsx`
6. `src/pages/ParentLandingPage.tsx`
7. `src/pages/PlaceholderPage.tsx`
8. `src/pages/PrivacyToolsPage.tsx`
9. `src/pages/QuickStartPage.tsx`
10. `src/pages/ResourcesPage.tsx`

**Fix Pattern:**

```tsx
// Background
bg-white → bg-white dark:bg-gray-900

// Surface cards
bg-gray-50 → bg-gray-50 dark:bg-gray-800

// Borders
border-gray-200 → border-gray-200 dark:border-gray-700

// Headings
text-gray-900 → text-gray-900 dark:text-gray-100

// Body text
text-gray-600 → text-gray-600 dark:text-gray-300

// Muted text
text-gray-400 → text-gray-400 dark:text-gray-500
```

**Design Tokens (Reference):**
- Primary green: `text-green-700 dark:text-green-400`
- Background: `bg-white dark:bg-gray-900`
- Surface card: `bg-gray-50 dark:bg-gray-800`
- Border: `border-gray-200 dark:border-gray-700`

**Acceptance Criteria:**
- [ ] All text is readable in dark mode
- [ ] Color contrast meets WCAG AA (4.5:1 for body text)
- [ ] No hardcoded hex colors in these files
- [ ] Dark mode toggle switches correctly
- [ ] Visual hierarchy preserved in both themes

---

### C4: Pages Missing Responsive Design

**Severity:** 🔴 Critical  
**Category:** Responsive Design  
**Files Affected:** 12-15 pages  
**Estimated Effort:** 8-12 hours  

**Issue:** Pages without Tailwind breakpoints (`sm:`, `md:`, `lg:`) break on mobile.

**Pages to Fix:**

1. `src/pages/AgeGroupsPage.tsx`
2. `src/pages/CertificatePage.tsx`
3. `src/pages/FamilyPrivacyPlanPage.tsx`
4. `src/pages/FeaturesPage.tsx`
5. `src/pages/ImplementationPage.tsx`
6. `src/pages/NewsletterArchivePage.tsx`
7. `src/pages/OverviewPage.tsx`
8. `src/pages/ParentLandingPage.tsx`
9. `src/pages/ParentResourcesPage.tsx`
10. `src/pages/ParentalConsentPage.tsx`
11. `src/pages/PlaceholderPage.tsx`
12. `src/pages/PrivacyToolsPage.tsx`
13. `src/pages/QuickStartPage.tsx`
14. `src/pages/ResourcesPage.tsx`
15. `src/pages/TermsPage.tsx`

**Responsive Patterns:**

```tsx
// Flex layouts
flex gap-4 → flex flex-col md:flex-row gap-3 md:gap-4

// Grid layouts
grid gap-6 → grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6

// Padding
p-6 → p-4 sm:p-6 lg:p-8

// Font sizes
text-3xl → text-2xl sm:text-3xl lg:text-4xl

// Button groups
flex gap-4 → flex flex-col sm:flex-row gap-3 sm:gap-4

// Full-width on mobile
→ w-full sm:w-auto
```

**Breakpoints (Tailwind Defaults):**
- `sm:` — 640px
- `md:` — 768px
- `lg:` — 1024px
- `xl:` — 1280px

**Acceptance Criteria:**
- [ ] Page renders correctly at 375px (iPhone SE)
- [ ] Page renders correctly at 768px (iPad)
- [ ] Page renders correctly at 1920px (desktop)
- [ ] No horizontal scrolling at any breakpoint
- [ ] Touch targets are 44×44px minimum
- [ ] Text remains readable at all sizes

---

## 🟠 High Priority Issues

### H1: High-Severity npm Vulnerabilities (19 packages)

**Severity:** 🟠 High  
**Category:** Security  
**Packages:** `vite`, various transitive dependencies  
**Estimated Effort:** 2-4 hours  

**Issue:** 19 high-severity vulnerabilities in dependencies.

**Fix:**
```bash
npm audit fix --force
npm audit
```

**Testing Required:**
1. Dev server still runs (`npm run dev`)
2. Production build succeeds (`npm run build`)
3. HMR (hot module replacement) works in dev
4. No console errors in production build

**Acceptance Criteria:**
- [ ] `npm audit` shows 0 high vulnerabilities
- [ ] All npm scripts work (`dev`, `build`, `lint`, `test:run`)
- [ ] No build errors
- [ ] No runtime errors in dev or prod

---

### H2: Inline Style Violations (114 instances)

**Severity:** 🟠 High  
**Category:** Design System Compliance  
**Files Affected:** 85+ components, 6 pages  
**Estimated Effort:** 8-12 hours  

**Issue:** 114 instances of `style={{}}` bypass design system.

**Files with Inline Styles:**

**Pages:**
1. `src/pages/FamilyHubPage.tsx`
2. `src/pages/DigitalRightsPage.tsx`
3. `src/pages/InteractiveStoryPage.tsx`
4. `src/pages/PrivacyExplorersPage.tsx`
5. `src/pages/TeenHandbookPage.tsx`
6. `src/pages/ScoringMethodologyPage.tsx`

**Components (Top 20):**
1. `src/components/parent/PrivacyChecklists.tsx`
2. `src/components/parent/ChildRiskCard.tsx`
3. `src/components/parent/ProgressVisualization.tsx`
4. `src/components/parent/ParentOnboarding.tsx`
5. `src/components/FamilyDashboard.tsx`
6. `src/components/ui/Toast.tsx`
7. `src/components/activities/ConnectDotsActivity.tsx`
8. `src/components/activities/DragDropActivity.tsx`
9. `src/components/activities/WordSearchActivity.tsx`
10. `src/components/activities/ColoringActivity.tsx`
11. `src/components/activities/ActivityGameShell.tsx`
12. `src/components/ConversationStarter.tsx`
13. `src/components/FeatureUnlockCelebration.tsx`
14. `src/components/dfa/BreakdownBars.tsx`
15. `src/components/games/DigitalRightsQuiz.tsx`
16. `src/components/games/PasswordFortressBuilder.tsx`
17. `src/components/games/PrivacyPolicyDecoder.tsx`
18. `src/components/games/LearningProgress.tsx`
19. `src/components/games/PrivacySettingsTrainer.tsx`
20. `src/components/games/PrivacyStoryAdventure.tsx`

**Audit Process:**
1. Search for `style={{` in each file
2. Determine if style is **truly dynamic** (e.g., `animationDelay: ${index * 0.1}s`)
3. If static → convert to Tailwind classes
4. If dynamic → keep, add comment explaining why

**Example Fixes:**

```tsx
// ❌ Bad: Static colors
style={{ backgroundColor: 'var(--white)', color: 'var(--gray-800)' }}

// ✅ Good: Tailwind with dark mode
className="bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100"

// ❌ Bad: Dynamic color that could be a class
style={{ backgroundColor: difficultyColors[choice.difficulty] }}

// ✅ Good: Map to Tailwind classes
const difficultyClasses = {
  easy: 'bg-green-100 dark:bg-green-900',
  medium: 'bg-yellow-100 dark:bg-yellow-900',
  hard: 'bg-red-100 dark:bg-red-900'
};
className={difficultyClasses[choice.difficulty]}

// ✅ OK: Truly dynamic value
style={{ animationDelay: `${index * 0.1}s` }}
```

**Acceptance Criteria:**
- [ ] Inline styles reduced by 80% (≤20 remaining)
- [ ] All remaining styles have comments explaining necessity
- [ ] No static colors in inline styles
- [ ] No layout properties (padding, margin, width, height, etc.) in inline styles
- [ ] Dark mode works on converted components

---

### H3: Embedded `<style>` Tag in ParentDashboard.tsx

**Severity:** 🟠 High  
**Category:** Design System Violation  
**File:** `src/components/ParentDashboard.tsx`  
**Estimated Effort:** 1-2 hours  

**Issue:** Raw CSS in JSX breaks hot module replacement and violates design system.

**Location:** Lines 100+ (exact line may vary)

**Fix Options:**

1. **Option A: Convert to Tailwind utilities**
   ```tsx
   // Extract styles to Tailwind classes
   <div className="custom-dashboard-style">
   ```

2. **Option B: Extract to global CSS**
   ```css
   /* In src/index.css */
   .parent-dashboard-custom {
     /* styles here */
   }
   ```

3. **Option C: CSS Modules** (if absolutely necessary)
   ```tsx
   import styles from './ParentDashboard.module.css';
   <div className={styles.custom}>
   ```

**Recommendation:** Option A (Tailwind) preferred for consistency.

**Acceptance Criteria:**
- [ ] No `<style>` tags in JSX
- [ ] Styles moved to Tailwind or global CSS
- [ ] Component renders identically
- [ ] HMR works correctly

---

### H4: ESLint Errors (3 errors)

**Severity:** 🟠 High  
**Category:** Code Quality  
**Files Affected:** 2 files  
**Estimated Effort:** 30 minutes  

**Errors:**

1. **`src/familyhub/components/HubThemeToggle.tsx:41,55`**
   - **Error:** Expected `{` after `if` condition (curly)
   - **Fix:** Add curly braces
   ```tsx
   // ❌ Before
   if (condition) statement;
   
   // ✅ After
   if (condition) { statement; }
   ```

2. **`src/hooks/useResolvedMissionScenario.ts:4`**
   - **Error:** Duplicate import
   - **Fix:** Merge imports
   ```tsx
   // ❌ Before
   import { foo } from '../lib/footprintAnalyzer';
   import { bar } from '../lib/footprintAnalyzer';
   
   // ✅ After
   import { foo, bar } from '../lib/footprintAnalyzer';
   ```

**Run:**
```bash
npm run lint:fix  # Auto-fixes curly braces
# Manually fix duplicate import
npm run lint      # Verify 0 errors
```

**Acceptance Criteria:**
- [ ] `npm run lint` exits with 0 errors
- [ ] All warnings have justification or are fixed

---

### H5: Inconsistent Card Patterns

**Severity:** 🟠 High  
**Category:** Design Consistency  
**Files Affected:** Multiple  
**Estimated Effort:** 3-4 hours  

**Issue:** Cards use conflicting class combinations across the codebase.

**Standard Pattern (CLAUDE.md):**
```tsx
<div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
```

**Inconsistent Patterns Found:**

| Location | Issue | Fix |
|----------|-------|-----|
| `FamilyHubPage.tsx` | Uses `rounded-xl` + `border-2` | Change to `rounded-2xl` + `border` |
| Various | `p-4`, `p-5`, `p-6` mixed | Standardize to `p-6` (or `p-4 sm:p-6`) |
| `ParentToolkitPage.tsx` | Adds `shadow-md` | Decide if shadows are standard |

**Fix Strategy:**

1. **Audit all cards:**
   ```bash
   grep -r "rounded-.*border.*bg-" src/ --include="*.tsx"
   ```

2. **Create/use Card component:**
   ```tsx
   // src/components/ui/Card.tsx already exists
   import { Card } from '../components/ui/Card';
   
   <Card>
     {/* content */}
   </Card>
   ```

3. **Standardize props:**
   ```tsx
   <Card variant="default" padding="md" shadow="sm">
   ```

**Acceptance Criteria:**
- [ ] All cards use consistent `rounded-2xl`
- [ ] All cards use `border` (not `border-2` unless intentional emphasis)
- [ ] Padding is standardized (`p-4 sm:p-6` for responsive)
- [ ] Dark mode support on all cards
- [ ] Optional: Migrate to `<Card>` component where appropriate

---

## 🟡 Medium Priority Issues

### M1: Missing Reusable Form Components

**Severity:** 🟡 Medium  
**Category:** Design System / DX  
**Estimated Effort:** 4-6 hours  

**Issue:** No standardized `Input`, `Select`, `Textarea` components with built-in labels.

**Recommendation:** Create form components to prevent label violations.

**Proposed Components:**

```tsx
// src/components/ui/Input.tsx
interface InputProps {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  error?: string;
  // ... other props
}

export const Input: React.FC<InputProps> = ({ id, label, ... }) => (
  <div className="form-field">
    <label htmlFor={id} className="block text-sm font-medium mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={id}
      type={type}
      className="form-input"
      aria-required={required}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      {...props}
    />
    {error && (
      <p id={`${id}-error`} className="text-red-600 text-sm mt-1">
        {error}
      </p>
    )}
  </div>
);
```

**Components to Create:**
- [ ] `Input.tsx` (text, email, password, etc.)
- [ ] `Textarea.tsx`
- [ ] `Select.tsx`
- [ ] `Checkbox.tsx`
- [ ] `Radio.tsx`
- [ ] `Toggle.tsx` (switch)

**Acceptance Criteria:**
- [ ] All form components have built-in label support
- [ ] All components support error states
- [ ] All components have dark mode
- [ ] All components are fully accessible (WCAG AA)
- [ ] Storybook examples (if applicable)

---

### M2: Touch Target Sizing Violations

**Severity:** 🟡 Medium  
**Category:** Accessibility / Mobile UX  
**Files Affected:** Various  
**Estimated Effort:** 2-3 hours  

**Issue:** Some interactive elements don't meet 44×44px WCAG minimum.

**WCAG Guideline:** 2.5.5 Target Size (Level AAA, recommended)

**Audit Process:**
1. Identify all interactive elements (buttons, links, inputs, checkboxes, etc.)
2. Measure effective touch target size
3. Ensure minimum 44×44px (or 48×48px for better UX)

**Common Fixes:**

```tsx
// ❌ Bad: Small touch target
<button className="px-2 py-1 text-xs">Click</button>

// ✅ Good: Meets minimum
<button className="px-3 py-2 min-h-[44px] text-sm">Click</button>

// ✅ Better: Exceeds minimum
<button className="px-4 py-2.5 min-h-[48px] text-base">Click</button>

// ❌ Bad: Icon-only button without padding
<button><Icon size={16} /></button>

// ✅ Good: Icon with adequate padding
<button className="p-3 min-h-[44px] min-w-[44px] inline-flex items-center justify-center">
  <Icon size={20} />
</button>
```

**Files to Check:**
- Activity game shells
- Modal close buttons
- Dropdown menu items
- Category filter chips
- Icon-only action buttons

**Acceptance Criteria:**
- [ ] All buttons meet 44×44px minimum
- [ ] All links with `onClick` meet minimum
- [ ] All form controls meet minimum
- [ ] Adequate spacing between touch targets (8px minimum)

---

### M3: Console Statement Cleanup

**Severity:** 🟡 Medium  
**Category:** Code Quality  
**Files Affected:** 2 remaining  
**Estimated Effort:** 15 minutes  

**Issue:** 2 console statements found (good progress from 72!).

**Fix:**
```tsx
// ❌ Before
console.log('Debug info');

// ✅ After
import { logger } from '../lib/logger';
logger.debug('Debug info', { context });
```

**Search:**
```bash
grep -r "console.log\|console.warn\|console.error" src/ --include="*.ts" --include="*.tsx" | grep -v "logger"
```

**Exception:** `console.error` is allowed for genuine errors (not mode messages).

**Acceptance Criteria:**
- [ ] 0 `console.log` statements
- [ ] 0 `console.warn` statements
- [ ] `console.error` only for genuine errors
- [ ] All debug output uses `logger` utility

---

### M4: ESLint Warnings (6 warnings)

**Severity:** 🟡 Medium  
**Category:** Code Quality  
**Estimated Effort:** 30 minutes  

**Warnings:**

1. **Unused variables (5 warnings)**
   - Fix: Remove or prefix with `_`
   ```tsx
   // ❌ Warning
   const { data, error } = useQuery();
   
   // ✅ Fixed (if error is unused)
   const { data } = useQuery();
   // OR
   const { data, error: _error } = useQuery();
   ```

2. **Fast refresh violation in `KidsProgressContext.tsx`**
   - Fix: Export constants separately
   ```tsx
   // ❌ Warning
   export const KidsProgressContext = createContext(...);
   export const PROGRESS_VERSION = 1;
   
   // ✅ Fixed
   // In KidsProgressContext.tsx
   export const KidsProgressContext = createContext(...);
   
   // In constants.ts
   export const PROGRESS_VERSION = 1;
   ```

**Acceptance Criteria:**
- [ ] `npm run lint` exits with 0 warnings (or documented exceptions)
- [ ] All unused variables removed or prefixed
- [ ] Fast refresh works in dev mode

---

## 🟢 Nice to Have

### N1: Expand Design System Documentation

**Severity:** 🟢 Low  
**Category:** Documentation  
**Estimated Effort:** 4-6 hours  

**Recommendation:** Create Storybook or live component gallery.

**Contents:**
- All reusable components
- Color palette swatches
- Typography scale
- Spacing scale
- Icon library
- Interactive examples
- Code snippets

---

### N2: Visual Regression Testing

**Severity:** 🟢 Low  
**Category:** Testing  
**Estimated Effort:** 8-12 hours (setup)  

**Recommendation:** Implement visual regression testing with Playwright + Percy.

**Setup:**
```bash
npm install --save-dev @playwright/test @percy/cli @percy/playwright
```

**Benefits:**
- Catch unintended UI changes
- Validate responsive design
- Test dark mode automatically
- Prevent design system drift

---

### N3: Improved Mobile Tab Navigation

**Severity:** 🟢 Low  
**Category:** UX  
**Files:** `ParentDashboard.tsx`, others  
**Estimated Effort:** 2-3 hours  

**Issue:** Tab navigation on mobile could be more touch-friendly.

**Recommendation:**
- Full-width tabs on mobile
- Swipe gesture support
- Better visual feedback for active tab

---

## Implementation Roadmap

### Phase 1: Critical Issues (Week 1)
- [ ] C1: Form input labels (Day 1-2)
- [ ] C2: jspdf security fix (Day 1)
- [ ] C3: Dark mode support (Day 2-3)
- [ ] C4: Responsive design (Day 3-5)

**Goal:** All production blockers resolved.

### Phase 2: High Priority (Week 2)
- [ ] H1: npm vulnerability fixes (Day 1)
- [ ] H2: Inline style cleanup (Day 1-3)
- [ ] H3: Remove embedded `<style>` tag (Day 2)
- [ ] H4: ESLint errors (Day 1)
- [ ] H5: Standardize card patterns (Day 3-4)

**Goal:** Design system compliance at 90%+.

### Phase 3: Medium Priority (Week 3)
- [ ] M1: Reusable form components (Day 1-2)
- [ ] M2: Touch target audit (Day 2-3)
- [ ] M3: Console cleanup (Day 1)
- [ ] M4: ESLint warnings (Day 1)

**Goal:** 100% code quality standards met.

### Phase 4: Nice to Have (Ongoing)
- [ ] N1: Design system docs
- [ ] N2: Visual regression testing
- [ ] N3: UX improvements

---

## Tracking

**Total Issues:** 51  
**Critical:** 4  
**High:** 5  
**Medium:** 4  
**Low:** 3  

**Estimated Total Effort:** 35-50 hours

---

**Document Status:** Active tracking  
**Last Updated:** October 5, 2026  
**Next Review:** After Phase 1 completion
