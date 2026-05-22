/**
 * Netlify build router for two sites in one repo:
 * - Main website (dist/) — www.pandagarde.com
 * - Family Hub (dist-familyhub/) — hub.pandagarde.com
 *
 * Uses NETLIFY_SITE_ID so the hub site never publishes the marketing SPA when
 * it accidentally points at netlify.toml instead of netlify-familyhub.toml.
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

/** pandagarde-family-hub — must match package.json deploy:netlify:familyhub */
const HUB_SITE_ID = '09a33b67-21f2-4f27-bc38-1b732b9cf29e';

function run(command) {
  execSync(command, { stdio: 'inherit', env: process.env, cwd: root, shell: true });
}

function readPublishDirFromConfig(configFile) {
  const configPath = path.join(root, configFile);
  if (!fs.existsSync(configPath)) return 'dist';
  const text = fs.readFileSync(configPath, 'utf8');
  const match = text.match(/^\s*publish\s*=\s*["']?([^"'\s#]+)/m);
  return match?.[1] ?? 'dist';
}

function isHubDeploy() {
  const siteId = process.env.NETLIFY_SITE_ID ?? '';
  const configFile = path.basename(process.env.NETLIFY_CONFIG_PATH ?? 'netlify.toml');
  return (
    siteId === HUB_SITE_ID ||
    configFile.includes('familyhub') ||
    process.env.VITE_HUB_STANDALONE === 'true'
  );
}

function assertHubBundle(outDir) {
  const indexPath = path.join(outDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error(`Hub build missing ${indexPath}`);
  }
  const html = fs.readFileSync(indexPath, 'utf8');
  if (html.includes('Digital Footprint Education Website')) {
    throw new Error(
      'Hub deploy would publish the main marketing site. Check Netlify publish dir and build command.'
    );
  }
  if (!html.includes('Family Hub') && !html.includes('familyhub-main')) {
    throw new Error('Hub build output does not look like the Family Hub bundle.');
  }
}

function assertWebsiteBundle(outDir) {
  const indexPath = path.join(outDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error(`Website build missing ${indexPath}`);
  }
  const html = fs.readFileSync(indexPath, 'utf8');
  if (html.includes('familyhub-main.tsx')) {
    throw new Error('Website deploy must not publish familyhub.html as index.html.');
  }
}

function stageHubForPublish(hubOut, publishDir) {
  if (publishDir === 'dist-familyhub') return;
  const websiteDist = path.join(root, 'dist');
  fs.rmSync(websiteDist, { recursive: true, force: true });
  fs.cpSync(hubOut, websiteDist, { recursive: true });
  console.log('[netlify-build] Staged dist-familyhub → dist for Netlify publish');
}

const hubDeploy = isHubDeploy();
const configFile = path.basename(process.env.NETLIFY_CONFIG_PATH ?? 'netlify.toml');
const publishDir = readPublishDirFromConfig(configFile);

if (hubDeploy) {
  console.log(`[netlify-build] Family Hub (site=${process.env.NETLIFY_SITE_ID ?? 'local'}, publish=${publishDir})`);
  run('npm ci --ignore-scripts');
  process.env.VITE_HUB_STANDALONE = 'true';
  process.env.VITE_WEBSITE_URL = process.env.VITE_WEBSITE_URL ?? 'https://www.pandagarde.com';
  run('npm run build:familyhub');
  const hubOut = path.join(root, 'dist-familyhub');
  assertHubBundle(hubOut);
  stageHubForPublish(hubOut, publishDir);
} else {
  console.log(`[netlify-build] Main website (site=${process.env.NETLIFY_SITE_ID ?? 'local'}, publish=${publishDir})`);
  run('npm install --no-audit --ignore-scripts');
  run('npm run build');
  assertWebsiteBundle(path.join(root, 'dist'));
}
