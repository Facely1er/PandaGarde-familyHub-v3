/**
 * App Review recording entry point.
 * macOS: attempts native simulator capture when scripts/record-app-review-ios-sim.mjs exists;
 * otherwise falls back to Playwright web capture (works on Windows/Mac/Linux).
 */
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const webScript = join(root, 'scripts/record-app-review-video.mjs');
const iosSimScript = join(root, 'scripts/record-app-review-ios-sim.mjs');

const useIosSim = process.platform === 'darwin' && existsSync(iosSimScript) && process.env.APP_REVIEW_WEB_ONLY !== '1';
const script = useIosSim ? iosSimScript : webScript;

if (!useIosSim) {
  console.log('[app-review:record] Using Playwright web capture (iPhone 6.7" viewport).\n');
}

const r = spawnSync('node', [script], {
  stdio: 'inherit',
  cwd: root,
  env: { ...process.env, VITE_APP_REVIEW_DEMO: 'true' },
});
process.exit(r.status ?? 1);
