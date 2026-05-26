/** SocialCaution product URLs — override via VITE_* in Netlify/env. */
export const SOCIALCAUTION_WEB_URL =
  import.meta.env.VITE_SOCIALCAUTION_WEB_URL?.trim() || 'https://www.socialcaution.com';

export const SOCIALCAUTION_APP_URL =
  import.meta.env.VITE_SOCIALCAUTION_APP_URL?.trim() || 'https://app.socialcaution.com';

/** Outbound link with consistent PandaGarde referral params. */
export function socialCautionFunnelUrl(
  surface: 'web' | 'app' = 'app',
  campaign = 'pandagarde'
): string {
  const base = surface === 'web' ? SOCIALCAUTION_WEB_URL : SOCIALCAUTION_APP_URL;
  const url = new URL(base);
  url.searchParams.set('utm_source', 'pandagarde');
  url.searchParams.set('utm_medium', 'referral');
  url.searchParams.set('utm_campaign', campaign);
  return url.toString();
}
