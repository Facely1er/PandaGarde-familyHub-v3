# UI/UX Quality Checklist — Quick Reference

**Purpose:** Use this checklist during development and PR reviews to ensure design system compliance.  
**Related:** [UI_UX_AUDIT.md](./UI_UX_AUDIT.md) | [UI_UX_ISSUES.md](./UI_UX_ISSUES.md)

---

## Pre-Commit Checklist

Before committing any UI changes, verify:

### ✅ Design System Compliance

- [ ] **No inline `style={{}}` except dynamic values**
  - ❌ `style={{ backgroundColor: 'white' }}`
  - ✅ `className="bg-white dark:bg-gray-900"`
  - ✅ `style={{ animationDelay: `${index * 0.1}s` }}` (truly dynamic)

- [ ] **Responsive layout at `sm:` / `md:` / `lg:`**
  - ❌ `<div className="flex gap-4">`
  - ✅ `<div className="flex flex-col md:flex-row gap-3 md:gap-4">`

- [ ] **Dark mode works (`dark:` variants on all color classes)**
  - ❌ `className="bg-white text-gray-900"`
  - ✅ `className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"`

### ✅ Accessibility (A11y)

- [ ] **All form inputs have labels or `aria-label`**
  - ❌ `<input type="text" placeholder="Name" />`
  - ✅ `<label htmlFor="name">Name</label><input id="name" type="text" />`
  - ✅ `<input type="text" aria-label="Name" />`

- [ ] **Interactive non-button elements have `role`, `tabIndex`, `onKeyDown`**
  - ❌ `<div onClick={handleClick}>Click me</div>`
  - ✅ `<button onClick={handleClick}>Click me</button>`
  - ✅ `<div role="button" tabIndex={0} onClick={handleClick} onKeyDown={handleKeyDown}>...</div>`

- [ ] **Modals have `role="dialog"`, `aria-modal`, focus trap, Escape key**
  - See `SearchModal.tsx` for reference implementation

- [ ] **Images have descriptive `alt` text (or `alt=""` for decorative)**
  - ❌ `<img src="photo.jpg">`
  - ✅ `<img src="photo.jpg" alt="Child using tablet with parent">`
  - ✅ `<Icon aria-hidden />` (for decorative icons)

- [ ] **Touch targets meet 44×44px minimum**
  - ❌ `<button className="px-2 py-1">Click</button>`
  - ✅ `<button className="px-4 py-2.5 min-h-[44px]">Click</button>`

### ✅ Code Quality

- [ ] **No `console.log` in the component**
  - ❌ `console.log('Debug info')`
  - ✅ `import { logger } from '../lib/logger'; logger.debug('Debug info')`

- [ ] **Uses design tokens from `tailwind.config.js` / `index.css`**
  - ❌ `className="text-[#1B5E20]"`
  - ✅ `className="text-green-700 dark:text-green-400"`

- [ ] **`npm run lint` passes with no new errors for this file**

- [ ] **Builds without TypeScript errors (`npx tsc --noEmit`)**

---

## Component Patterns Reference

### Card Pattern

```tsx
<div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
  {/* content */}
</div>
```

### Button Pattern

```tsx
import { Button } from '../components/ui/Button';

<Button variant="primary" size="md">
  Click me
</Button>

// OR global CSS classes
<button className="button button-primary">
  Click me
</button>
```

### Form Field Pattern

```tsx
<div className="form-field">
  <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
    Email Address
  </label>
  <input
    id="email"
    type="email"
    required
    className="form-input w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
  />
</div>
```

### Responsive Grid Pattern

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  {/* items */}
</div>
```

### Responsive Flex Pattern

```tsx
<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
  {/* items */}
</div>
```

### Modal Pattern

```tsx
<div
  className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full">
    <h2 id="modal-title" className="text-2xl font-bold">Modal Title</h2>
    {/* content */}
  </div>
</div>
```

---

## Design Tokens Quick Reference

### Colors

| Use Case | Light Mode | Dark Mode |
|----------|------------|-----------|
| Primary green | `text-green-700` | `text-green-400` |
| Background | `bg-white` | `bg-gray-900` |
| Surface card | `bg-gray-50` | `bg-gray-800` |
| Border | `border-gray-200` | `border-gray-700` |
| Heading | `text-gray-900` | `text-gray-100` |
| Body text | `text-gray-600` | `text-gray-300` |
| Muted text | `text-gray-400` | `text-gray-500` |

### Spacing Scale

- `gap-3` / `p-3` — 0.75rem (12px)
- `gap-4` / `p-4` — 1rem (16px)
- `gap-6` / `p-6` — 1.5rem (24px)
- `gap-8` / `p-8` — 2rem (32px)

### Border Radius

- `rounded-lg` — 12px (cards, inputs)
- `rounded-xl` — 16px (larger cards)
- `rounded-2xl` — 20px (standard card pattern)

### Breakpoints

- `sm:` — 640px (large phones, small tablets)
- `md:` — 768px (tablets)
- `lg:` — 1024px (laptops)
- `xl:` — 1280px (desktops)

---

## Common Violations & Fixes

### ❌ Hard-coded colors

```tsx
// Bad
<div style={{ backgroundColor: '#1B5E20' }}>

// Good
<div className="bg-green-700 dark:bg-green-600">
```

### ❌ No responsive breakpoints

```tsx
// Bad
<div className="flex gap-4">
  <div className="w-1/3">
  <div className="w-1/3">
  <div className="w-1/3">
</div>

// Good
<div className="flex flex-col md:flex-row gap-3 md:gap-4">
  <div className="w-full md:w-1/3">
  <div className="w-full md:w-1/3">
  <div className="w-full md:w-1/3">
</div>
```

### ❌ Missing dark mode

```tsx
// Bad
<div className="bg-white border-gray-200 text-gray-900">

// Good
<div className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
```

### ❌ Input without label

```tsx
// Bad
<input type="email" placeholder="Email" />

// Good (Option 1: Visible label)
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// Good (Option 2: aria-label)
<input type="email" aria-label="Email address" />
```

### ❌ Clickable div without a11y

```tsx
// Bad
<div onClick={handleClick}>Click me</div>

// Good (Option 1: Use button)
<button onClick={handleClick}>Click me</button>

// Good (Option 2: Add a11y attributes)
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  Click me
</div>
```

### ❌ Console.log in production

```tsx
// Bad
console.log('Debug info');

// Good
import { logger } from '../lib/logger';
logger.debug('Debug info', { context });
```

### ❌ Small touch targets

```tsx
// Bad
<button className="px-2 py-1 text-xs">
  <Icon size={12} />
</button>

// Good
<button className="px-4 py-2.5 min-h-[44px] min-w-[44px] inline-flex items-center justify-center">
  <Icon size={20} />
</button>
```

---

## Testing Checklist

Before marking a PR as ready:

### Manual Testing

- [ ] Tested on mobile (375px width — iPhone SE size)
- [ ] Tested on tablet (768px width)
- [ ] Tested on desktop (1920px width)
- [ ] Tested in dark mode
- [ ] Tested with keyboard navigation (Tab, Enter, Space, Escape)
- [ ] Tested with screen reader (optional but recommended)

### Automated Testing

- [ ] `npm run lint` — 0 errors
- [ ] `npm run type-check` — 0 errors
- [ ] `npm run test:run` — all tests pass
- [ ] `npm audit` — 0 critical/high vulnerabilities

---

## Resources

### Internal Docs
- [CLAUDE.md](../CLAUDE.md) — Authoritative design system guide
- [UI_UX_AUDIT.md](./UI_UX_AUDIT.md) — Full audit report
- [UI_UX_ISSUES.md](./UI_UX_ISSUES.md) — Detailed issue tracker
- [CONTENT_TRUTH.md](./CONTENT_TRUTH.md) — Marketing copy guidelines

### External References
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

---

## PR Review Template

Copy this into PR descriptions:

```markdown
## Design System Compliance Checklist

- [ ] No inline `style={{}}` except dynamic values
- [ ] Responsive layout at `sm:` / `md:` / `lg:`
- [ ] Dark mode works (`dark:` variants on all color classes)
- [ ] All form inputs have labels or `aria-label`
- [ ] Interactive non-button elements have `role`, `tabIndex`, `onKeyDown`
- [ ] Images have descriptive `alt` text (or `alt=""` for decorative)
- [ ] No `console.log` in the component
- [ ] Touch targets meet 44×44px minimum
- [ ] Uses design tokens from `tailwind.config.js` / `index.css`
- [ ] `npm run lint` passes with no new errors
- [ ] Builds without TypeScript errors

## Testing

- [ ] Tested on mobile (375px)
- [ ] Tested on tablet (768px)
- [ ] Tested on desktop (1920px)
- [ ] Tested in dark mode
- [ ] Tested keyboard navigation

## Screenshots

<!-- Add before/after screenshots for UI changes -->
```

---

**Last Updated:** October 5, 2026  
**Maintained By:** PandaGarde Development Team
