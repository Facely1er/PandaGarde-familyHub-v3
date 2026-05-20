# Accessibility Standard

> Aligned with [Authoritative Governance Suite](../pandagarde_authoritative_sdlc_governance_suite_v_1.md) §12.

PandaGarde platforms must comply with:
- WCAG 2.2 AA

Required support:
- keyboard navigation
- screen readers
- dyslexia-friendly modes
- reduced motion support
- high contrast themes
- multilingual accessibility

## Implementation Requirements

- All interactive controls SHALL have accessible names and roles
- Focus order SHALL follow visual reading order
- Color contrast SHALL meet AA minimums (4.5:1 normal text)
- Motion SHALL respect `prefers-reduced-motion`
- Form errors SHALL be announced to assistive technology
- Skip navigation links SHALL be provided on hub layouts

## Minimum Targets (Suite §12.1)

- keyboard accessibility  
- screen reader compatibility  
- reduced motion support (`prefers-reduced-motion`)  
- touch target compliance (minimum 44×44 CSS px where applicable)  
- readable contrast ratios (WCAG 2.2 AA)  

## Inclusive UX (Suite §12.2)

- dyslexia-friendly reading modes  
- simplified interactions where appropriate  
- age-adaptive guidance  
- calm visual patterns (no cognitive overload)  

## Verification

- Automated checks via `src/utils/__tests__/accessibility.test.ts`
- Manual screen reader pass (NVDA or VoiceOver) before release
- Keyboard-only walkthrough of primary guardian and child flows
