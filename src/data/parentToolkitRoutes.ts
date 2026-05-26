/**
 * Live in-app destinations for Parent Toolkit cards (no placeholder PDFs).
 */
export const PARENT_TOOLKIT_ROUTES: Record<string, { href: string; label: string }> = {
  'privacy-policy-template': { href: '/family-privacy-plan', label: 'Open family privacy plan' },
  'device-setup-checklist': { href: '/guides/device-setup', label: 'Open device setup guide' },
  'conversation-starters': { href: '/guides/conversation-approaches', label: 'Open conversation guide' },
  'app-review-guide': { href: '/guides/app-selection', label: 'Open app selection guide' },
  'safety-checklist': { href: '/guides/emergency-safety', label: 'Open emergency safety guide' },
  'privacy-settings-guide': { href: '/guides/device-setup', label: 'Open device setup guide' },
  'monitoring-tools-guide': { href: '/guides/device-setup', label: 'Open device setup guide' },
  'incident-response-plan': { href: '/guides/emergency-safety', label: 'Open emergency safety guide' },
  'password-security-guide': {
    href: '/family-hub/activities',
    label: 'Open password missions in Family Hub',
  },
  'expert-advice-library': { href: '/guides/family-privacy', label: 'Open family privacy guide' },
  'family-agreement-template': { href: '/downloads/family-agreement', label: 'Open family agreement' },
  'social-media-guide': {
    href: '/family-hub/activities',
    label: 'Open teen missions in Family Hub',
  },
};

export function getToolkitRoute(resourceId: string): { href: string; label: string } | undefined {
  return PARENT_TOOLKIT_ROUTES[resourceId];
}
