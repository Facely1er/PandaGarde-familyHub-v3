# PandaGarde FamilyHub v3 — SDLC Master

## Project overview

PandaGarde is a family privacy-education SPA built with React 18, TypeScript, Tailwind CSS, and Vite. The website guides families through a Digital Footprint Analysis and routes them into the Family Hub workspace. It is deployed on Netlify as a frontend-only PWA (no backend in production today).

## Architecture

```
src/
  pages/        # Route-level page components (73 pages, lazy-loaded)
  components/   # Shared UI components (107+ files)
  familyhub/    # Family Hub sub-app with its own screens and shell
  lib/          # Core business logic (DFA engine, scoring, PDF, analytics)
  contexts/     # React Context providers (Theme, Family, Progress, Search, etc.)
  hooks/        # Custom hooks
  utils/        # Utilities (gamification, accessibility, storage)
  types/        # TypeScript interfaces and types
  data/         # Static content and configuration
  styles/       # Global CSS (index.css)
```

State is managed with Context API + localStorage. There is no backend; all persistence is client-side.

---

## Development commands

```bash
npm run dev           # Vite dev server
npm run build         # Production build
npm run lint          # ESLint check
npm run lint:fix      # ESLint auto-fix
npm run format        # Prettier
npm run type-check    # npx tsc --noEmit
npm run test:run      # Vitest single run
npm run test:coverage # Coverage report
```

---

## Design system rules

### 1. Tailwind-first — no inline styles for layout or color

Use Tailwind utility classes for all layout, spacing, color, typography, and responsive behaviour. Inline `style={{}}` is only acceptable for:
- Dynamic values that cannot be expressed as static Tailwind classes (e.g., `style={{ animationDelay: \`${index * 0.1}s\` }}`)
- CSS custom property references where Tailwind config does not expose a token (e.g., `style={{ color: 'var(--primary)' }}` when the token has no Tailwind alias)

Do NOT use inline styles for: padding, margin, width, height, border-radius, background color, font size, font weight, or flex/grid layout. These all have Tailwind equivalents.

**Bad:**
```tsx
<div style={{ display: 'flex', gap: '1rem', padding: '1.5rem', borderRadius: '16px', background: '#f0fdf4' }}>
```

**Good:**
```tsx
<div className="flex gap-4 p-6 rounded-2xl bg-green-50 dark:bg-green-950">
```

### 2. Every page must be responsive

All pages must use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) for layout changes. Minimum requirement:
- Single-column on mobile (`< sm`)
- Two-column where appropriate at `md:`
- Full layout at `lg:`

Pages that currently have zero responsive classes and must be addressed:
`AgeGroupsPage`, `CertificatePage`, `FAQPage`, `FamilyPrivacyPlanPage`, `FeaturesPage`, `HomePage`, `ImplementationPage`, `NewsletterArchivePage`, `NotFoundPage`, `OverviewPage`, `ParentLandingPage`, `ParentResourcesPage`, `ParentalConsentPage`, `PlaceholderPage`, `PrivacyToolsPage`, `QuickStartPage`, `ResourcesPage`, `TermsPage`

### 3. Dark mode support is mandatory

All new UI must work in both light and dark mode. Use Tailwind `dark:` variants. Do not hard-code hex colours — use design tokens from `tailwind.config.js` or CSS custom properties defined in `index.css`. The `ParentDashboard.tsx` pattern of embedding raw CSS strings in a `<style>` tag inside JSX must not be replicated.

### 4. Design tokens reference

Primary green: `bg-green-700` / `text-green-700` (light) — `bg-green-400` / `text-green-400` (dark)  
Background: `bg-white dark:bg-gray-900`  
Surface card: `bg-gray-50 dark:bg-gray-800`  
Border: `border-gray-200 dark:border-gray-700`  
Heading: `text-gray-900 dark:text-gray-100`  
Body text: `text-gray-600 dark:text-gray-300`  
Muted text: `text-gray-400 dark:text-gray-500`

### 5. Use the PageLayout component for content pages

Any page that is not a landing/marketing page must wrap its content in `<PageLayout>` from `src/components/layout/PageLayout.tsx`. This ensures consistent header, breadcrumb, and container width.

### 6. Card pattern

```tsx
<div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
```

### 7. Button pattern

Use the `<Button>` component from `src/components/ui/Button.tsx` or the global `button button-primary` / `button button-secondary` CSS classes. Never style raw `<a>` or `<button>` elements inline.

---

## Accessibility requirements

Every PR must satisfy all of the following before merge:

1. **Form inputs must have labels.** Every `<input>`, `<textarea>`, and `<select>` must have either:
   - A visible `<label htmlFor="input-id">` paired with `id="input-id"` on the input, OR
   - An `aria-label` attribute on the input itself.

2. **Interactive non-button elements need roles and keyboard handlers.** Any `<div>` or `<span>` with an `onClick` must also have:
   - `role="button"` (or a more specific role)
   - `tabIndex={0}`
   - `onKeyDown` that triggers the action on Enter/Space

3. **Modal dialogs require focus management:**
   - `role="dialog"` and `aria-modal="true"` on the modal root
   - Focus trap (see `SearchModal.tsx` for the reference implementation)
   - Escape key closes the modal
   - Focus returns to the trigger element on close

4. **Images must have alt text.** Decorative images use `alt=""`. Meaningful images describe their content.

5. **Colour contrast.** Text must meet WCAG AA (4.5:1 for normal text, 3:1 for large text).

---

## Code quality standards

### No `console.log` in production code

Use the `logger` utility from `src/lib/logger.ts` for all debug output — it gates on `VITE_DEBUG_LOGGING` and strips in production. `console.error` and `console.warn` are allowed only for genuine errors (not informational mode messages like "Frontend-only mode: …").

```typescript
// Bad
console.log('Frontend-only mode: loadFamilyMembers()')

// Good — only if genuinely unexpected
console.error('Failed to load family members:', error)

// Good — debug info
import { logger } from '../lib/logger'
logger.debug('loadFamilyMembers called', { familyId })
```

### No `TODO`/`FIXME` in shipped code

Incomplete logic must be tracked as GitHub issues, not left as in-code TODOs. If a feature is not ready, the function should throw or return a sensible default with a comment explaining the current limitation — not a placeholder that silently returns wrong data.

### TypeScript — no `any`

`any` is a warning in ESLint and must be resolved before merge. Use `unknown` with a type guard, or define the proper interface.

### ESLint must pass with zero errors

Run `npm run lint` before every commit. The CI gate is `41 errors, 289 warnings` as of the last audit; the target is 0 errors. Auto-fixable issues: `npm run lint:fix`.

---

## Security requirements

### Dependencies

- Run `npm audit` before every release. No unresolved **critical** or **high** vulnerabilities may ship.
- Current critical: `jspdf <=4.2.0` — upgrade to 4.2.1+ with `npm audit fix --force` and verify PDF export still works.
- Current high: `vite 7.0.0-7.3.1` — upgrade with `npm audit fix`.

### No hardcoded credentials or secrets

All secrets and configuration IDs (GA measurement ID, EmailJS keys, Sentry DSN) must be injected via `VITE_*` environment variables, never hardcoded in source.

### localStorage data

User data stored in localStorage is unencrypted by default. `src/lib/encryption.ts` provides optional client-side encryption — use it for any PII fields (names, emails, ages).

### CSP

The Content Security Policy in `netlify.toml` must not be weakened without explicit review. `'unsafe-inline'` and `'unsafe-eval'` are currently necessary for Vite's HMR and inline styles respectively — document any new exceptions.

---

## Testing requirements

- Core business logic in `src/lib/` must have unit tests.
- New React components should have at minimum a render test.
- Run `npm run test:run` before every PR. Target: zero failing tests.
- Coverage target: >60% statement coverage (currently ~4% by file count — improve incrementally).

---

## Bundle size budget

| Chunk | Current | Budget |
|---|---|---|
| `index.js` (main entry) | 262 KB | ≤ 300 KB |
| `FamilyHubWrapper` | 225 KB | ≤ 250 KB |
| `jspdf` | 376 KB | Lazy-loaded only |
| `html2canvas` | 201 KB | Lazy-loaded only |
| Per-page chunks | avg 14 KB | ≤ 50 KB |

jsPDF and html2canvas must be dynamically imported at point of use (PDF export action), not included in the static dependency graph.

---

## Open production blockers (as of 2026-05-20)

Track these as issues; do not ship to a real audience until resolved:

| # | Issue | Severity |
|---|---|---|
| 1 | `jspdf` critical CVE — upgrade to 4.2.1 | Critical |
| 2 | `vite` high CVE — `npm audit fix` | High |
| 3 | 72 `console.log` calls leak internal state in production | High |
| 4 | 41 ESLint errors (auto-fix 32 with `npm run lint:fix`) | High |
| 5 | No real auth — localStorage-only demo credentials | High |
| 6 | 5 TODOs in gamification core (privacyScore, toolsUsed, longestStreak) | Medium |
| 7 | 3 routes serve PlaceholderPage "coming soon" | Medium |
| 8 | 19 pages without responsive Tailwind breakpoints | Medium |
| 9 | 734 inline `style={{}}` instances bypass design system | Medium |
| 10 | 65 form inputs without accessible labels | Medium |

---

## Page polish checklist (per page)

Before a page is considered production-ready:

- [ ] Zero inline `style={{}}` except dynamic values
- [ ] Responsive layout at `sm:` / `md:` / `lg:`
- [ ] Dark mode works (`dark:` variants on all colour classes)
- [ ] All `<input>` / `<textarea>` / `<select>` have labels or `aria-label`
- [ ] Interactive non-button elements have `role`, `tabIndex`, `onKeyDown`
- [ ] Modals: `role="dialog"`, `aria-modal`, focus trap, Escape key
- [ ] Images have descriptive `alt` text (or `alt=""` for decorative)
- [ ] No `console.log` in the component
- [ ] `npm run lint` passes with no new errors for this file
- [ ] Builds without TypeScript errors (`npx tsc --noEmit`)
