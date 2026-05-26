/** True when built via `npm run build:familyhub` (Capacitor / hub-only deploy). */
export const isHubStandalone = import.meta.env.VITE_HUB_STANDALONE === 'true';

const BASE = isHubStandalone ? '' : '/family-hub';

function hubPath(segment: string): string {
  if (!segment) {
    return BASE || '/';
  }
  return `${BASE}/${segment}`.replace(/\/+/g, '/');
}

export const hubPaths = {
  root: BASE || '/',
  welcome: hubPath('welcome'),
  dashboard: hubPath('dashboard'),
  journey: hubPath('journey'),
  kids: hubPath('kids'),
  activities: hubPath('activities'),
  /** @deprecated Use journey — rewards live under Journey */
  progress: hubPath('progress'),
  settings: hubPath('settings'),
} as const;

/** Marketing site — used for optional escape from standalone shell */
export const pandagardeWebsiteUrl =
  import.meta.env.VITE_WEBSITE_URL?.trim() || 'https://pandagarde.com';
