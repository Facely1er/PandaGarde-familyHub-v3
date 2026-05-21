/**
 * Live in-app destinations for Parent Toolkit cards (no placeholder PDFs).
 */
export const PARENT_TOOLKIT_ROUTES: Record<string, { href: string; label: string }> = {
  'privacy-policy-template': { href: '/family-privacy-plan', label: 'Open family privacy plan' },
  'device-setup-checklist': { href: '/guides/device-setup', label: 'Open device setup guide' },
  'conversation-starters': { href: '/guides/conversation-approaches', label: 'Open conversation guide' },
  'app-review-guide': { href: '/guides/app-selection', label: 'Open app selection guide' },
  'safety-checklist': { href: '/guides/emergency-safety', label: 'Open safety guide' },
  'privacy-settings-guide': { href: '/privacy-tools', label: 'Open privacy tools' },
  'monitoring-tools-guide': { href: '/guides/device-setup', label: 'Open device & controls guide' },
  'incident-response-plan': { href: '/guides/emergency-safety', label: 'Open emergency guide' },
  'password-security-guide': { href: '/activities/password-safety', label: 'Try password quiz activity' },
  'expert-advice-library': { href: '/resources', label: 'Browse resources' },
  'family-agreement-template': { href: '/downloads/family-agreement', label: 'Open family agreement' },
  'social-media-guide': { href: '/teen-handbook', label: 'Open teen handbook' },
};

export function getToolkitRoute(resourceId: string): { href: string; label: string } | undefined {
  return PARENT_TOOLKIT_ROUTES[resourceId];
}
